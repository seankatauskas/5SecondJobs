import PrefetchApplicationsDisplay from '@/app/server/prefetchApplicationsDisplay'
import normalizeFilters from '@/app/lib/filterHelpers'
import type { SearchParams } from '@/app/types'

export default async function Home({ searchParams }: {searchParams: SearchParams}) {
    const resolvedSearchParams = await searchParams
    const filters = normalizeFilters(resolvedSearchParams)

    return (
        <PrefetchApplicationsDisplay pageType={'search'} filters={filters}>
        </PrefetchApplicationsDisplay>
    )
}

