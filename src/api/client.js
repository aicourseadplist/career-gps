const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:3001/api'

export async function generateAssessment(userData) {
  const response = await fetch(`${API_BASE}/assessment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  })
  
  if (!response.ok) {
    throw new Error('Failed to generate assessment')
  }
  
  return response.json()
}

export async function generateMentorRecommendation(userData) {
  const response = await fetch(`${API_BASE}/mentor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  })
  
  if (!response.ok) {
    throw new Error('Failed to generate mentor recommendation')
  }
  
  return response.json()
}

export async function generateExecutionPlan(userData) {
  const response = await fetch(`${API_BASE}/plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  })
  
  if (!response.ok) {
    throw new Error('Failed to generate execution plan')
  }
  
  return response.json()
}

// Extract session summary, highlights, and action items from meeting notes/transcript
export async function extractMeetingInsights(meetingData) {
  const response = await fetch(`${API_BASE}/meeting/extract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(meetingData)
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.error || 'Failed to extract meeting insights')
  }

  return response.json()
}

