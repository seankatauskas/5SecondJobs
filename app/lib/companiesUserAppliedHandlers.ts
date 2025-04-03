'use client'

export async function updateUserCompanyApplied (company_id: string, job_id: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/companies`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            company_id,
            job_id
        }),
    });
}


export async function removeUserCompanyApplied (company_id: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/companies/remove`, { 
        method: 'DELETE', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            company_id
        }),
    });
}

