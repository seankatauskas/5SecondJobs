'use server'

import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import { getCompletedApplications } from '@/app/lib/actions'

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const currentCursor = req.nextUrl.searchParams.get('cursor');
    try {
        const data = await getCompletedApplications(session, currentCursor)
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: `Failed to fetch jobs ${error.message}` }, { status: 500 });
    }
}

