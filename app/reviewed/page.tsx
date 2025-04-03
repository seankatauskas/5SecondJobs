import PrefetchApplicationsDisplay from '@/app/server/PrefetchApplicationsDisplay'

export default async function Home() {
    return (
        <PrefetchApplicationsDisplay pageType={'reviewed'}>
        </PrefetchApplicationsDisplay>
    )
}


