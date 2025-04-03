'use client'

export async function updateUserCompanyApplied (company_id: string, job_id: string) {
    const response = await fetch('http://localhost:3000/api/companies', { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            company_id,
            job_id
        }),
    });
}


export async function removeUserCompanyApplied (company_id: string) {
    const response = await fetch('http://localhost:3000/api/companies/remove', { 
        method: 'DELETE', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            company_id
        }),
    });
}

