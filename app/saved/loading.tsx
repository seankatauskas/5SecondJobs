import { CardsSkeleton, FilterSkeleton } from '@/app/ui/skeletons'

export default function Loading() {
    return (
        <>
            <FilterSkeleton />
            <CardsSkeleton />
        </>
    )
}

