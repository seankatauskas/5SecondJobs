'use server'

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { Pool } from '@neondatabase/serverless'

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { company_id, job_id } = await req.json()
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const userId = session.user?.id

  try {
    const { rows } = await pool.query(
      `
        INSERT INTO user_companies_applied (user_id, company_id, count, last_applied, last_application_id)
        VALUES ($1, $2, 1, CURRENT_TIMESTAMP, $3)
        ON CONFLICT (user_id, company_id)
        DO UPDATE SET 
          count = user_companies_applied.count + 1,
          last_applied = CURRENT_TIMESTAMP,
          last_application_id = $3
        RETURNING *
      `,
      [userId, company_id, job_id] 
    )

    return NextResponse.json(rows[0])
  } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: `Failed to process the delete operation: ${error.message}` }, { status: 500 });
        }
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 })
  } finally {
    await pool.end()
  }
}

