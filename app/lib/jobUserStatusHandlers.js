'use client'

export async function addUserJobStatus (job_id, status) {
    const response = await fetch(`/api/jobs`, {
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

export async function changeJobUserStatus (job_id, status) {
    const response = await fetch(`/api/jobs/update`, { 
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


