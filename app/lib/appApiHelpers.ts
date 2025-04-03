export async function mergeApplicationData(jobs, pool) {
    const childTables = [
        'jobs_categories', 'jobs_desirable', 'jobs_experience_level',
        'jobs_functions', 'jobs_industries', 'jobs_locations',
        'jobs_requirements', 'jobs_responsibilities', 'jobs_skills',
        'jobs_subtitles', 'jobsdetails'
    ];

    let modifiedJobs = [...jobs];
    const jobIds = jobs.map(job => job.id);

    const queries = childTables.map(table => 
        pool.query(`SELECT * FROM ${table} WHERE id = ANY($1)`, [jobIds])
    );

    const responses = await Promise.all(queries);

    responses.forEach((response) => {
        const groupedData = response.rows.reduce((acc, row) => {
            if (!acc[row.id]) acc[row.id] = [];
            acc[row.id].push(row);
            return acc;
        }, {});

        modifiedJobs = modifiedJobs.map(job => {
            const jobData = groupedData[job.id] || [];
            if (jobData.length > 1) {
                const formattedData = jobData.reduce((acc, row) => {
                    Object.keys(row).forEach(column => {
                        if (column !== 'id') {
                            acc[column] = acc[column] || [];
                            acc[column].push(row[column]);
                        }
                    });
                    return acc;
                }, {});
                return { ...job, ...formattedData };
            } else if (jobData.length === 1) {
                return { ...job, ...jobData[0] };
            }
            return job;
        });
    });

    return modifiedJobs;
}

export function encodeCursor(data) {
    return Buffer.from(JSON.stringify(data)).toString('base64url');
}

export function decodeCursor(cursor) {
    return JSON.parse(Buffer.from(cursor, 'base64url').toString());
}



