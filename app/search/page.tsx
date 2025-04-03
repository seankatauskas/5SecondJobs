import PrefetchApplicationsDisplay from '@/app/server/prefetchApplicationsDisplay'

export default async function Home() {
    return (
        <PrefetchApplicationsDisplay pageType={'search'}>
        </PrefetchApplicationsDisplay>
    )
}

