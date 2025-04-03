'use client'

export async function addUserJobStatus (job_id: string, status: string) {
    const response = await fetch('http://localhost:3000/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        job_id,
        status
      }),
    });
    if (response.ok) {
    }
};

export async function changeJobUserStatus (job_id: string, status: string) {
    const response = await fetch('http://localhost:3000/api/jobs/update', { 
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            job_id,
            status 
        }),
    });
    if (response.ok) {
    }
}


