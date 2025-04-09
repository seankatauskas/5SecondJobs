'use client'

export async function fetchApplications({ queryKey, pageParam }) {
    const [, pageType, filters] = queryKey
    const filterParams = new URLSearchParams(filters)
    const response = await fetch(`/api/applications/${pageType}/?cursor=${pageParam}&${filterParams}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json()
}

export async function fetchApplicationsCount(filters, pageType) {
    const filterParams = new URLSearchParams(filters)
    const response = await fetch(`/api/applications/count/?pagetype=${pageType}&${filterParams}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json()
}
