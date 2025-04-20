'use server'

import { auth } from '@/auth'
import type { Session } from 'next-auth'
import { Pool } from '@neondatabase/serverless'
import { mergeApplicationData, encodeCursor, decodeCursor } from '@/app/lib/appApiHelpers'
import type { NormalizedFilters, PageType } from '@/app/types' 
import { locationMap, experienceMap } from '@/app/constants'

export async function fetchGuestApplications() {
    const response = await fetch(`/api/applications/guest`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    return response.json()
}

export async function prefetchApplications(queryKey: {[key: string]: any}) {
    const pageType = queryKey.queryKey[1]
    const filters = queryKey.queryKey[2]
    const pageParam = queryKey.pageParam

    const session = await auth()
    if (!session) {
        throw new Error('Unauthorized')
    }
    
    const currentCursor = pageParam
    try {
        const data = await getApplications(pageType, session, currentCursor, filters)
        return data
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch jobs: ${error.message}`)
        } else {
            throw new Error("Failed to fetch jobs: An unknown error occurred")
        }
    }
}

function buildFilterJoinsAndConditions(
        filters: NormalizedFilters, 
        currentCursor: string | number | null = null,
        pageType: PageType,
        countQuery: boolean = false
    ) {
    const joins = new Set()
    const conditions = []
    const values = []
    let paramIndex: number
    
    if (countQuery) {
        if (pageType === 'search') {
            paramIndex = 2 
        } else {
            paramIndex = 3
        }
    } else {
        if (currentCursor == 0) {
            if (pageType === 'search') {
                paramIndex = 3 
            } else {
                paramIndex = 4
            }
        } else {
            if (pageType === 'search') {
                paramIndex = 5 
            } else {
                paramIndex = 6
            }
        }
    }


    if (Array.isArray(filters.location) && filters.location.length > 0) {
        const locations = filters.location
            .map(key => locationMap[key as keyof typeof locationMap])
            .filter(Boolean)

        if (locations.length > 0) {
            joins.add(`JOIN jobs_locations ON jobs.id = jobs_locations.id`)

            const placeholders = locations.map(() => `$${paramIndex++}`)
            conditions.push(`jobs_locations.locations IN (${placeholders.join(', ')})`)
            values.push(...locations)
        }
    }

    if (Array.isArray(filters.experience) && filters.experience.length > 0) {
        const experiences = filters.experience
            .map(key => experienceMap[key as keyof typeof experienceMap])
            .filter(Boolean)

        if (experiences.length > 0) {
            joins.add(`JOIN jobs_experience_level ON jobs.id = jobs_experience_level.id`)

            const placeholders = experiences.map(() => `$${paramIndex++}`)
            conditions.push(`jobs_experience_level.experience_level IN (${placeholders.join(', ')})`)
            values.push(...experiences)
        }
    }


    if (filters.search && typeof filters.search === 'string') {
        conditions.push(`jobs.title ILIKE $${paramIndex++}`)
        values.push(`%${filters.search}%`)
    }

    return {
        joins: Array.from(joins),
        whereClause: conditions.length ? ' AND ' + conditions.join(' AND ') : '',
        values
    }
}


export async function getCount(pageType: PageType, session: Session, filters: NormalizedFilters) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    const { joins, whereClause, values: filterValues } = buildFilterJoinsAndConditions(filters, null, pageType, true)

    if (!session.user) {
        throw new Error('User is not authenticated')
    }

    let query
    let values
    try {
        query = `
            SELECT COUNT(DISTINCT jobs.id)
            FROM jobs 
            ${joins.join('\n')}
            LEFT JOIN user_companies_applied 
            ON jobs.company_id = user_companies_applied.company_id 
            AND user_companies_applied.user_id = $1
        `
        if (pageType === 'search') {
            query += `
                LEFT JOIN user_jobs ON jobs.id = user_jobs.job_id
                AND user_jobs.user_id = $1
                WHERE user_jobs.job_id IS NULL 
                ${whereClause}
            `
            values = [session.user.id, ...filterValues]
        } else {
            query += `
                JOIN user_jobs ON jobs.id = user_jobs.job_id
                WHERE user_jobs.status = $2
                AND user_jobs.user_id = $1
                ${whereClause}
            `
            values = [session.user.id, pageType, ...filterValues]
        }
        const count = await pool.query(query, values)
        return count.rows[0].count
    } catch (error) {
        throw error
    } finally {
        await pool.end()
    }
}

export async function getApplications(pageType: PageType, session: Session, currentCursor: string | number | null, filters: NormalizedFilters) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    const pageSize = 20

    const { joins, whereClause, values: filterValues } = buildFilterJoinsAndConditions(filters, currentCursor, pageType)

    let query
    let values

    if (!session.user) {
        throw new Error('User is not authenticated')
    }

    try {
        if (currentCursor == 0) {
            query = `
                SELECT DISTINCT jobs.*, user_jobs.updated_at, user_companies_applied.last_applied, user_jobs.job_id  
                FROM jobs
                ${joins.join('\n')}
                LEFT JOIN user_companies_applied 
                ON jobs.company_id = user_companies_applied.company_id 
                AND user_companies_applied.user_id = $1
            `

            if (pageType === 'search') {
                query += `
                    LEFT JOIN user_jobs ON jobs.id = user_jobs.job_id 
                    AND user_jobs.user_id = $1
                    WHERE user_jobs.job_id IS NULL
                    ${whereClause}
                    ORDER BY jobs.updated_date DESC, jobs.id DESC 
                    LIMIT $2
                `
                values = [session.user.id, pageSize, ...filterValues]
            } else {
                query += `
                    JOIN user_jobs ON jobs.id = user_jobs.job_id
                    WHERE user_jobs.status = $2 
                    AND user_jobs.user_id = $1
                    ${whereClause}
                    ORDER BY user_jobs.updated_at DESC, user_jobs.job_id DESC
                    LIMIT $3
                `
                values = [session.user.id, pageType, pageSize, ...filterValues]
            }
        } else {
            const { updated_date, id } = decodeCursor(currentCursor as string)
            const updated_at = new Date(updated_date)

            query = `
                SELECT DISTINCT jobs.*, user_jobs.updated_at, user_companies_applied.last_applied, user_jobs.job_id
                FROM jobs 
                ${joins.join('\n')}
                LEFT JOIN user_companies_applied 
                ON jobs.company_id = user_companies_applied.company_id 
                AND user_companies_applied.user_id = $1
            `

            if (pageType === 'search') {
                query += `
                    LEFT JOIN user_jobs ON jobs.id = user_jobs.job_id
                    AND user_jobs.user_id = $1
                    WHERE user_jobs.job_id IS NULL 
                    AND (jobs.updated_date < $2 OR (jobs.updated_date = $2 AND jobs.id < $3))
                    ${whereClause}
                    ORDER BY updated_date DESC, id DESC 
                    LIMIT $4
                `
                values = [session.user.id, updated_date, id, pageSize, ...filterValues]
            } else {
                query += `
                    JOIN user_jobs ON jobs.id = user_jobs.job_id
                    WHERE user_jobs.status = $2
                    AND user_jobs.user_id = $1
                    AND (user_jobs.updated_at < $3 OR (user_jobs.updated_at = $3 AND user_jobs.job_id < $4))
                    ${whereClause}
                    ORDER BY user_jobs.updated_at DESC, user_jobs.job_id DESC
                    LIMIT $5
                `
                values = [session.user.id, pageType, updated_at, id, pageSize, ...filterValues]
            }
        }

        const { rows: jobs } = await pool.query(query, values)

        const jobsDataCombined = await mergeApplicationData(jobs, pool)

        const lastJob = jobs[jobs.length - 1]

        let nextCursor = null
        if (jobs.length === pageSize) {
            if (pageType === 'search') {
                nextCursor = encodeCursor({ updated_date: lastJob.updated_date, id: lastJob.id })
            } else {
                nextCursor = encodeCursor({ updated_date: lastJob.updated_at, id: lastJob.id })
            }
        }

        return {
            data: jobsDataCombined.slice(0, pageSize),
            nextCursor
        }
    } catch (error) {
        throw error
    } finally {
        await pool.end()
    }
}

