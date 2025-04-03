import { prefetchSearchApplications, prefetchReviewedApplications, prefetchCompletedApplications } from '@/app/lib/actions'
import { fetchSearchApplications, fetchReviewedApplications, fetchCompletedApplications } from '@/app/lib/fetchApplications'

export default function queryParamsPageType(pageType, isPrefetch) {
    const options = { 
        search: [['applicationsSearch'], prefetchSearchApplications, fetchSearchApplications], 
        reviewed: [['applicationsReviewed'], prefetchReviewedApplications, fetchReviewedApplications], 
        completed: [['applicationsCompleted'], prefetchCompletedApplications, fetchCompletedApplications] 
    }

    const queryKey = options[pageType][0]  
    const queryFn = options[pageType][isPrefetch ? 1 : 2]  
    
    return [queryKey, queryFn] 
}
