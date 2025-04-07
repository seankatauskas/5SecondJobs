import { prefetchApplications } from '@/app/lib/actions'
import { fetchApplications } from '@/app/lib/fetchApplications'

export default function queryParamsPageType(pageType, isPrefetch, filters) {
    const options = { 
        search: [['applicationsSearch', pageType, filters], prefetchApplications, fetchApplications], 
        reviewed: [['applicationsReviewed', pageType, filters], prefetchApplications, fetchApplications], 
        completed: [['applicationsCompleted', pageType, filters], prefetchApplications, fetchApplications] 
    }

    const queryKey = options[pageType][0]  
    const queryFn = options[pageType][isPrefetch ? 1 : 2]  
    
    return [queryKey, queryFn] 
}
