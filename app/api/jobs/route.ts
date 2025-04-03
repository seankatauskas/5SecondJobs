'use server'

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { Pool } from '@neondatabase/serverless';

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { job_id, status } = await req.json();
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const { rows } = await pool.query(
      'INSERT INTO user_jobs (user_id, job_id, status) VALUES ($1, $2, $3) RETURNING *',
      [session.user.id, job_id, status]
    );
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add job to user\'s list' }, { status: 500 });
  } finally {
    await pool.end();
  }
}
