'use server'

import { auth } from '@/auth';
import { Pool } from '@neondatabase/serverless';
import { mergeApplicationData, encodeCursor, decodeCursor } from '@/app/lib/appApiHelpers'

export async function fetchGuestApplications() {
    const response = await fetch('http://localhost:3000/api/applications/guest', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    return response.json()
}

export async function prefetchApplications(pageType, pageParam) {
    const getApplicationsFn = {
        search: getSearchApplications, 
        reviewed: getReviewedApplications,
        completed: getCompletedApplications
    } 
    const fetchFunction = getApplicationsFn[pageType]

    const session = await auth();
    if (!session) {
        throw new Error('Unauthorized');
    }
    
    const currentCursor = pageParam
    try {
        const data = await fetchFunction(session, currentCursor)
        return data
    } catch (error) {
        throw new Error('Failed to fetch jobs')
    }
}

export async function prefetchSearchApplications({ pageParam }) {
    return await prefetchApplications('search', pageParam)
}

export async function prefetchReviewedApplications({ pageParam }) {
    return await prefetchApplications('reviewed', pageParam)
}

export async function prefetchCompletedApplications({ pageParam }) {
    return await prefetchApplications('completed', pageParam)
}

export async function getApplications(pageType, session, currentCursor) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    const pageSize = 20;


    let query;
    let values;
    if (currentCursor == 0) {
        query = `
            SELECT jobs.*, user_jobs.updated_at, user_companies_applied.last_applied  
            FROM jobs
            LEFT JOIN user_companies_applied 
            ON jobs.company_id = user_companies_applied.company_id 
            AND user_companies_applied.user_id = $1
        `
        if (pageType === 'search') {
            query += `
                LEFT JOIN user_jobs ON jobs.id = user_jobs.job_id 
                AND user_jobs.user_id = $1
                WHERE user_jobs.job_id IS NULL 
                ORDER BY jobs.updated_date DESC, jobs.id DESC 
                LIMIT $2
            `
            values = [session.user.id, pageSize];
        } else {
            query += `
                JOIN user_jobs ON jobs.id = user_jobs.job_id
                WHERE user_jobs.status = $2 
                AND user_jobs.user_id = $1
                ORDER BY user_jobs.updated_at DESC, user_jobs.job_id DESC
                LIMIT $3
            `
            values = [session.user.id, pageType, pageSize];
        }
    } else {
        let { updated_date, id } = decodeCursor(currentCursor)
        if (pageType !== 'search') {
            updated_date = new Date(updated_date)
        }         
        query = `
            SELECT jobs.*, user_jobs.updated_at, user_companies_applied.last_applied 
            FROM jobs 
            LEFT JOIN user_companies_applied 
            ON jobs.company_id = user_companies_applied.company_id 
            AND user_companies_applied.user_id = $1
        `;
        if (pageType === 'search') {
            query += `
                LEFT JOIN user_jobs ON jobs.id = user_jobs.job_id
                AND user_jobs.user_id = $1
                WHERE user_jobs.job_id IS NULL 
                AND (jobs.updated_date < $2 OR (jobs.updated_date = $2 AND jobs.id < $3))
                ORDER BY updated_date DESC, id DESC 
                LIMIT $4
            `
            values = [session.user.id, updated_date, id, pageSize];
        } else {
            query += `
                JOIN user_jobs ON jobs.id = user_jobs.job_id
                WHERE user_jobs.status = $2
                AND user_jobs.user_id = $1
                AND (user_jobs.updated_at < $3 OR (user_jobs.updated_at = $3 AND user_jobs.job_id < $4))
                ORDER BY user_jobs.updated_at DESC, user_jobs.job_id DESC
                LIMIT $5
            `
            values = [session.user.id, pageType, updated_date, id, pageSize];
        }
    }
    

    const { rows: jobs } = await pool.query(query, values);

    const jobsDataCombined = await mergeApplicationData(jobs, pool);

    let lastJob = jobs[jobs.length - 1];

    let nextCursor = null
    if (jobs.length === pageSize) {
        if (pageType === 'search') {
            nextCursor = encodeCursor({ updated_date: lastJob.updated_date, id: lastJob.id })
        } else {
            nextCursor = encodeCursor({ updated_date: lastJob.updated_at, id: lastJob.id })
        }
    }
    const response = { data: jobsDataCombined.slice(0, pageSize), nextCursor } 
    return response
}

export async function getSearchApplications(session, currentCursor) {
    return await getApplications('search', session, currentCursor)
}

export async function getReviewedApplications(session, currentCursor) {
    return await getApplications('reviewed', session, currentCursor)
}

export async function getCompletedApplications(session, currentCursor) {
    return await getApplications('completed', session, currentCursor)
}


