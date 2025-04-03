'use server'

import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';
import { mergeApplicationData } from '@/app/lib/appApiHelpers'

export async function GET() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    try {
        const pageSize = 20;

        const query = 'SELECT * FROM jobs ORDER BY updated_date DESC, id DESC LIMIT $1';
        const values = [pageSize];

        const { rows: jobs } = await pool.query(query, values);

        const jobsDataCombined = await mergeApplicationData(jobs, pool);


        return NextResponse.json({ data: jobsDataCombined.slice(0, pageSize)});
    } catch (error) {
        return NextResponse.json({ error: `Failed to fetch jobs: ${error.message}` }, { status: 500 });
    }
}


