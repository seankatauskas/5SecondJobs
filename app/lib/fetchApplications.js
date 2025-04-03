'use client'

export async function fetchSearchApplications({ pageParam }) {
    const response = await fetch(`/api/applications/search/?cursor=${pageParam}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json()
}

export async function fetchReviewedApplications({ pageParam }) {
    const response = await fetch(`/api/applications/reviewed/?cursor=${pageParam}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json()
}

export async function fetchCompletedApplications({ pageParam }) {
    const response = await fetch(`/api/applications/completed/?cursor=${pageParam}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json()
}
