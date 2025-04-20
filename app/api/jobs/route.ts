'use server'

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { Pool } from '@neondatabase/serverless';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { job_id, status } = await req.json();
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const userId = session.user?.id

  try {
    const { rows } = await pool.query(
      'INSERT INTO user_jobs (user_id, job_id, status) VALUES ($1, $2, $3) RETURNING *',
      [userId, job_id, status]
    );
    return NextResponse.json(rows[0]);
  } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: `Failed to add job to user's list: ${error.message}` }, { status: 500 });
        }
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  } finally {
    await pool.end();
  }
}
