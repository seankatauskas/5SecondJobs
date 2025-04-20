import type { NormalizedFilters } from '@/app/types'

export default function normalizeFilters(filters: {[key: string]: string | string[] | undefined }) : NormalizedFilters {
  return {
    search: filters.search as string || '',
    location: Array.isArray(filters.location) 
      ? filters.location 
      : filters.location ? filters.location.split(',') : [],
    experience: Array.isArray(filters.experience) 
      ? filters.experience 
      : filters.experience ? filters.experience.split(',') : []
  }
}

export function configureFilters(searchParams: URLSearchParams): NormalizedFilters {
    const location = searchParams.get('location')
    const experience = searchParams.get('experience')

    const filters: NormalizedFilters = {
        search: searchParams.get('search') || '',
        location: location ? location.split(',') : [],
        experience: experience ? experience.split(',') : [],
    }

    return filters
}


export function filtersToURLSearchParams(filters: NormalizedFilters): URLSearchParams {
    const params = new URLSearchParams()

    params.set('search', filters.search)
    params.set('location', filters.location.join(','))
    params.set('experience', filters.experience.join(','))

    return params
}

