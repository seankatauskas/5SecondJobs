import PrefetchApplicationsDisplay from '@/app/server/prefetchApplicationsDisplay'
import normalizeFilters from '@/app/lib/filterHelpers'

export default async function Home({ searchParams }) {
    let filters = await searchParams
    filters = normalizeFilters(filters)

    return (
        <PrefetchApplicationsDisplay pageType={'completed'} filters={filters}>
        </PrefetchApplicationsDisplay>
    )
}


