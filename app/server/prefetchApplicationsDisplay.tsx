import ApplicationsDisplay from '@/app/ui/ApplicationsDisplay'
import React from 'react'
import { dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query"
import queryParamsPageType from '@/app/lib/appDisplayHelpers' 
import { getCount } from '@/app/lib/actions'
import { auth } from '@/auth'
import type { NormalizedFilters, PageType } from '@/app/types'

type Props = {
    pageType: PageType
    filters: NormalizedFilters
}

export default async function PrefetchApplicationsDisplay({ pageType, filters }: Props) {
    const session = await auth()
    if (!session) {
        throw new Error("No session found");
    }

    const count = await getCount(pageType, session, filters)

    const isPrefetch = true
    const [queryKey, queryFn] = queryParamsPageType(pageType, isPrefetch, filters)

    const queryClient = new QueryClient()
    await queryClient.prefetchInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam: 0,
    })
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
                <ApplicationsDisplay pageType={pageType} serverFilters={filters} count={count}/>
        </HydrationBoundary>
    )
}

