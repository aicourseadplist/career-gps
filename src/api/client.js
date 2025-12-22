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

// Read.ai integration functions
export async function connectReadAi(apiKey) {
  const response = await fetch(`${API_BASE}/readai/connect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey })
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.error || 'Failed to connect to Read.ai')
  }

  return response.json()
}

export async function fetchReadAiMeetings(apiKey, limit = 10) {
  const response = await fetch(`${API_BASE}/readai/meetings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey, limit })
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.error || 'Failed to fetch meetings from Read.ai')
  }

  return response.json()
}

export async function disconnectReadAi() {
  // Clear stored API key
  localStorage.removeItem('readai_api_key')
  localStorage.removeItem('readai_connected')
  return { success: true }
}

