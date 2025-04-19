import { prefetchApplications } from '@/app/lib/actions'
import { fetchApplications } from '@/app/lib/fetchApplications'
import type { PageType, Filters } from '@/app/types'

export default function queryParamsPageType(pageType: PageType, isPrefetch: boolean, filters: Filters): [readonly unknown[], any] {
    const options = { 
        search: [['applicationsSearch', pageType, filters], prefetchApplications, fetchApplications], 
        reviewed: [['applicationsReviewed', pageType, filters], prefetchApplications, fetchApplications], 
        completed: [['applicationsCompleted', pageType, filters], prefetchApplications, fetchApplications] 
    } as const

    const queryKey = options[pageType][0]  
    const queryFn = options[pageType][isPrefetch ? 1 : 2]  
    
    return [queryKey, queryFn] 
}
