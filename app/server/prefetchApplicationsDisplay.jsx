import ApplicationsDisplay from '@/app/ui/ApplicationsDisplay'
import React from 'react'
import { dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query"
import queryParamsPageType from '@/app/lib/appDisplayHelpers' 

export default async function PrefetchApplicationsDisplay({ pageType }) {
    const isPrefetch = true
    const [queryKey, queryFn] = queryParamsPageType(pageType, isPrefetch)

    const queryClient = new QueryClient()
    await queryClient.prefetchInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam: 0,
    })
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
                <ApplicationsDisplay pageType={pageType}/>
        </HydrationBoundary>
    )
}

