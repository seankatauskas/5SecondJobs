'use server'

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getCount } from '@/app/lib/actions'
import { configureFilters } from '@/app/lib/filterHelpers'
import type { PageType } from '@/app/types' 

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    function isPageType(value: string): value is PageType {
        return ['search', 'reviewed', 'completed'].includes(value);
    }

    const pageType = req.nextUrl.searchParams.get('pagetype');
    if (!pageType || !isPageType(pageType)) {
        return NextResponse.json({ error: 'Invalid or missing pagetype parameter' }, { status: 400 });
    }

    const searchParams = req.nextUrl.searchParams
    const filters = configureFilters(searchParams)

    try {
        const data = await getCount(pageType, session, filters)
        return NextResponse.json(data);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: `Failed to fetch jobs: ${error.message}` }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
        }
    }
}

