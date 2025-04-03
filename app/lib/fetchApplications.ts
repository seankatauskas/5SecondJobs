'use client'

import { auth } from '@/auth';

export async function fetchSearchApplications({ pageParam }) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/applications/search/?cursor=${pageParam}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json()
}

export async function fetchReviewedApplications({ pageParam }) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/applications/reviewed/?cursor=${pageParam}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json()
}

export async function fetchCompletedApplications({ pageParam }) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/applications/completed/?cursor=${pageParam}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json()
}
