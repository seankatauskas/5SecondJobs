'use client'

import type { QueryKey, PageParam, NormalizedFilters, PageType } from '@/app/types'
import { filtersToURLSearchParams } from '@/app/lib/filterHelpers'

interface FetchApplicationsParams {
  queryKey: QueryKey
  pageParam: PageParam
}

export async function fetchApplications({ queryKey, pageParam }: FetchApplicationsParams) {
    const [, pageType, filters] = queryKey
    const filterParams = filtersToURLSearchParams(filters)
    const response = await fetch(`/api/applications/${pageType}/?cursor=${pageParam}&${filterParams}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json()
}

export async function fetchApplicationsCount(filters: NormalizedFilters, pageType: PageType) {
    const filterParams = filtersToURLSearchParams(filters)
    const response = await fetch(`/api/applications/count/?pagetype=${pageType}&${filterParams}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json()
}
