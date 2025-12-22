import { useState, useEffect } from 'react'
import './FollowUpsAndReminders.css'

// API base URL
function getApiBase() {
  const storedUrl = localStorage.getItem('api_url')
  if (storedUrl) return `${storedUrl}/api`
  if (import.meta.env.VITE_API_URL) return `${import.meta.env.VITE_API_URL}/api`
  const hostname = window.location.hostname
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `http://${hostname}:3001/api`
  }
  return 'http://localhost:3001/api'
}

const API_BASE = getApiBase()

function FollowUpsAndReminders({ meetingInsights, userData, onActionItemAdd }) {
  const [followUps, setFollowUps] = useState(null)
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(false)
  const [storedMeetings, setStoredMeetings] = useState([])

  // Load stored meetings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('cago_meetings')
    if (stored) {
      try {
        const meetings = JSON.parse(stored)
        setStoredMeetings(meetings)
        // Extract reminders from stored meetings
        const allReminders = meetings.flatMap(m => 
          (m.actionItems || []).map(item => ({
            ...item,
            meetingTitle: m.title,
            meetingDate: m.date
          }))
        )
        setReminders(allReminders)
      } catch (e) {
        console.error('Failed to load stored meetings:', e)
      }
    }
  }, [])

  // Store current meeting insights
  useEffect(() => {
    if (meetingInsights && meetingInsights.actionItems) {
      const meeting = {
        id: `meeting-${Date.now()}`,
        title: meetingInsights.title || 'Recent conversation',
        date: new Date().toISOString(),
        summary: meetingInsights.summary,
        highlights: meetingInsights.highlights,
        actionItems: meetingInsights.actionItems
      }

      const updated = [meeting, ...storedMeetings].slice(0, 10) // Keep last 10
      localStorage.setItem('cago_meetings', JSON.stringify(updated))
      setStoredMeetings(updated)

      // Update reminders
      const newReminders = meetingInsights.actionItems.map(item => ({
        ...item,
        meetingTitle: meeting.title,
        meetingDate: meeting.date
      }))
      setReminders(prev => [...newReminders, ...prev])
    }
  }, [meetingInsights])

  // Generate AI follow-ups when meeting insights are available
  useEffect(() => {
    if (meetingInsights && storedMeetings.length > 0 && !followUps) {
      generateFollowUps()
    }
  }, [meetingInsights, storedMeetings])

  const generateFollowUps = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/meeting/followups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recentMeetings: storedMeetings.slice(0, 5),
          currentMeeting: meetingInsights,
          userContext: userData
        })
      })

      if (response.ok) {
        const data = await response.json()
        setFollowUps(data)
      }
    } catch (error) {
      console.error('Failed to generate follow-ups:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUpcomingReminders = () => {
    return reminders
      .filter(r => r.due && !r.completed)
      .sort((a, b) => {
        // Simple priority sorting
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        return priorityOrder[a.priority || 'medium'] - priorityOrder[b.priority || 'medium']
      })
      .slice(0, 5)
  }

  const upcomingReminders = getUpcomingReminders()

  // Only show if we have meeting insights or stored meetings
  if (!meetingInsights && storedMeetings.length === 0 && !loading) {
    return null
  }

  return (
    <div className="followups-reminders-section">
      {/* AI-Powered Follow-ups */}
      {followUps && (
        <div className="followups-box">
          <div className="followups-header">
            <span className="followups-icon">🤖</span>
            <h4>AI Suggestions: What to do next</h4>
          </div>
          <p className="followups-intro">{followUps.context}</p>
          
          <div className="followups-list">
            {followUps.suggestions?.map((suggestion, i) => (
              <div key={i} className="followup-item">
                <span className="followup-priority">{suggestion.priority === 'high' ? '⚡' : '•'}</span>
                <div className="followup-content">
                  <span className="followup-text">{suggestion.action}</span>
                  {suggestion.reason && (
                    <span className="followup-reason">{suggestion.reason}</span>
                  )}
                  {suggestion.timing && (
                    <span className="followup-timing">Suggested: {suggestion.timing}</span>
                  )}
                </div>
                {onActionItemAdd && (
                  <button
                    className="btn btn-small btn-secondary"
                    onClick={() => {
                      onActionItemAdd({
                        text: suggestion.action,
                        priority: suggestion.priority || 'medium',
                        due: suggestion.timing || 'This week'
                      })
                    }}
                  >
                    Add
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reminders */}
      {upcomingReminders.length > 0 && (
        <div className="reminders-box">
          <div className="reminders-header">
            <span className="reminders-icon">⏰</span>
            <h4>Upcoming reminders</h4>
          </div>
          <p className="reminders-intro">Action items from your recent meetings</p>
          
          <div className="reminders-list">
            {upcomingReminders.map((reminder, i) => (
              <div key={i} className={`reminder-item priority-${reminder.priority || 'medium'}`}>
                <input
                  type="checkbox"
                  id={`reminder-${i}`}
                  checked={reminder.completed || false}
                  onChange={() => {
                    const updated = reminders.map((r, idx) => 
                      idx === reminders.indexOf(reminder) 
                        ? { ...r, completed: !r.completed }
                        : r
                    )
                    setReminders(updated)
                  }}
                />
                <label htmlFor={`reminder-${i}`} className="reminder-content">
                  <span className="reminder-text">{reminder.text}</span>
                  <div className="reminder-meta">
                    {reminder.due && (
                      <span className="reminder-due">{reminder.due}</span>
                    )}
                    {reminder.meetingTitle && (
                      <span className="reminder-source">From: {reminder.meetingTitle}</span>
                    )}
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="followups-loading">
          <span>Generating follow-ups...</span>
        </div>
      )}
    </div>
  )
}

export default FollowUpsAndReminders

