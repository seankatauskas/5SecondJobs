'use server'

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { Pool } from '@neondatabase/serverless'

export async function DELETE(req) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { company_id } = await req.json()
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const userId = session.user?.id

  try {
    const { rows: currentRows } = await pool.query(
      `
        SELECT count
        FROM user_companies_applied
        WHERE user_id = $1 AND company_id = $2
      `,
      [userId, company_id]
    )

    if (currentRows.length === 0) {
      return NextResponse.json({ error: 'No entry found for the user and company pair' }, { status: 404 })
    }

    const { count } = currentRows[0]

    if (count > 1) {
      const { rows: jobRows } = await pool.query(
        `
        SELECT user_jobs.job_id, user_jobs.updated_at
        FROM user_jobs
        JOIN jobs ON user_jobs.job_id = jobs.id
        WHERE user_jobs.user_id = $1 AND jobs.company_id = $2 AND user_jobs.status = 'completed'
        ORDER BY user_jobs.updated_at DESC
        LIMIT 1
        `,
        [userId, company_id]
      )

      if (jobRows.length === 0) {
        return NextResponse.json({ error: 'No matching job found for the user and company pair' }, { status: 404 })
      }

      const { job_id, updated_at } = jobRows[0]

      await pool.query(
        `
          UPDATE user_companies_applied
          SET count = count - 1, last_application_id = $1, last_applied = $2
          WHERE user_id = $3 AND company_id = $4
        `,
        [job_id, updated_at, userId, company_id]
      )

      return NextResponse.json({ message: 'Application count decremented and last application updated' })
    }

    if (count === 1) {
      await pool.query(
        `
          DELETE FROM user_companies_applied
          WHERE user_id = $1 AND company_id = $2
        `,
        [userId, company_id]
      )

      return NextResponse.json({ message: 'Entry deleted' })
    }

    return NextResponse.json({ error: 'Unhandled count case' }, { status: 500 })
  } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json({ error: `Failed to process the delete operation: ${error.message}` }, { status: 500 })
      }
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 })
  } finally {
    await pool.end()
  }
}

