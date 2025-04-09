'use server'

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getCount } from '@/app/lib/actions'

export async function GET(req) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams
    const pageType = req.nextUrl.searchParams.get('pagetype');
    const filters = {}
    for (const [key, value] of searchParams.entries()) {
        if (key === 'search') {
            filters[key] = value
        } else {
            if (key !== 'pagetype') {
                if (value !== "") {
                    filters[key] = value.split(",")
                } else {
                    filters[key] = []
                }
            }
        }
    }


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

