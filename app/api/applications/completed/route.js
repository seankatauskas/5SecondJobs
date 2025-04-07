'use server'

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getApplications } from '@/app/lib/actions'

export async function GET(req) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const searchParams = req.nextUrl.searchParams
    const currentCursor = req.nextUrl.searchParams.get('cursor');
    const filters = {}
    for (const [key, value] of searchParams.entries()) {
        if (key !== 'cursor') {
            filters[key] = value
        }
    }

    try {
        const data = await getApplications('completed', session, currentCursor, filters)
        return NextResponse.json(data);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: `Failed to fetch jobs: ${error.message}` }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
        }
    }
}

