import type { NormalizedFilters } from '@/app/types'

export default function normalizeFilters(filters: {[key: string]: string | string[] | undefined }) : NormalizedFilters {
  return {
    search: filters.search as string || '',
    location: Array.isArray(filters.location) 
      ? filters.location 
      : filters.location ? [filters.location] : [],
    experience: Array.isArray(filters.experience) 
      ? filters.experience 
      : filters.experience ? [filters.experience] : []
  };
}

export function configureFilters(searchParams: URLSearchParams): Record<string, string | string[]> {
    const filters: Record<string, string | string[]> = {}
    for (const [key, value] of searchParams.entries()) {
        if (key === 'search') {
            filters[key] = value
        } 
        else if (key !== 'cursor') {
            if (value !== "") {
                filters[key] = value.split(",")
            } else {
                filters[key] = []
            }
        }
    }
    return filters
}

