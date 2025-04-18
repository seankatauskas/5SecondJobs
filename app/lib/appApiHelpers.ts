import { Pool, QueryResult } from "@neondatabase/serverless"

interface Job {
    id: string
    [key: string]: any
}

interface Row {
    id: string
    [key: string]: any
}

export async function mergeApplicationData(jobs: Job[], pool: Pool): Promise<Job[]> {
    const childTables = [
        'jobs_categories', 'jobs_desirable', 'jobs_experience_level',
        'jobs_functions', 'jobs_industries', 'jobs_locations',
        'jobs_requirements', 'jobs_responsibilities', 'jobs_skills',
        'jobs_subtitles', 'jobsdetails'
    ]

    let modifiedJobs: Job[] = [...jobs]
    const jobIds: string[] = jobs.map(job => job.id)

    const queries: Promise<QueryResult<Row>>[] = childTables.map(table => 
        pool.query(`SELECT * FROM ${table} WHERE id = ANY($1)`, [jobIds])
    )

    const responses: QueryResult<Row>[] = await Promise.all(queries)

    responses.forEach((response) => {
        const groupedData = response.rows.reduce((acc: Record<string, Row[]>, row: Row) => {
            if (!acc[row.id]) acc[row.id] = []
            acc[row.id].push(row)
            return acc
        }, {})

        modifiedJobs = modifiedJobs.map((job: Job) => {
            const jobData = groupedData[job.id] || []
            if (jobData.length > 1) {
                const formattedData = jobData.reduce((acc: Record<string, any>, row: Row) => {
                    Object.keys(row).forEach((column: string) => {
                        if (column !== 'id') {
                            acc[column] = acc[column] || []
                            acc[column].push(row[column])
                        }
                    })
                    return acc
                }, {})
                return { ...job, ...formattedData }
            } else if (jobData.length === 1) {
                return { ...job, ...jobData[0] }
            }
            return job
        })
    })

    return modifiedJobs
}

export function encodeCursor(data: Record<string, Date | string>): string {
    return Buffer.from(JSON.stringify(data)).toString('base64url')
}

export function decodeCursor(cursor: string): Record<string, Date | string> {
    return JSON.parse(Buffer.from(cursor, 'base64url').toString())
}

