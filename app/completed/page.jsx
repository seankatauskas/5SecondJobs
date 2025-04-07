import PrefetchApplicationsDisplay from '@/app/server/prefetchApplicationsDisplay'

export default async function Home({ searchParams }) {
    const filters = await searchParams

    return (
        <PrefetchApplicationsDisplay pageType={'completed'} filters={filters}>
        </PrefetchApplicationsDisplay>
    )
}


