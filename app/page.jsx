import GuestApplicationsDisplay from './ui/GuestApplicationsDisplay'
import React from 'react'
import { dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query"
import { fetchGuestApplications } from '@/app/lib/actions'

export default async function Home() {
    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({
        queryKey: ['guestApplications'],
        queryFn: fetchGuestApplications,
    })
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
                <GuestApplicationsDisplay/>
        </HydrationBoundary>
    )
}
