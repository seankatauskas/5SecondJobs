import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { Pool } from '@neondatabase/serverless';

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { job_id, status } = await req.json();
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
  try {
    const { rows } = await pool.query(
      'UPDATE user_jobs SET status = $1, updated_at = NOW() WHERE job_id = $2 AND user_id = $3 RETURNING *',
      [status, job_id, session.user.id]
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Job not found on user\'s list' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update job on user\'s list' }, { status: 500 });
  } finally {
    await pool.end();
  }
}

