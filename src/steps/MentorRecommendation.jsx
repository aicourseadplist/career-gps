import { useState, useEffect } from 'react'
import { generateMentorRecommendation, extractMeetingInsights, connectReadAi, fetchReadAiMeetings, disconnectReadAi } from '../api/client'
import LoadingState from '../components/LoadingState'
import FollowUpsAndReminders from '../components/FollowUpsAndReminders'
import './MentorRecommendation.css'

function MentorRecommendation({ userData, onConfirm, onBack }) {
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notes, setNotes] = useState('')
  const [meetingTitle, setMeetingTitle] = useState('')
  const [extracting, setExtracting] = useState(false)
  const [extractError, setExtractError] = useState(null)
  const [meetingInsights, setMeetingInsights] = useState(null)
  const [showReadAiHelp, setShowReadAiHelp] = useState(false)
  const [readAiApiKey, setReadAiApiKey] = useState('')
  const [readAiConnected, setReadAiConnected] = useState(false)
  const [readAiConnecting, setReadAiConnecting] = useState(false)
  const [readAiFetching, setReadAiFetching] = useState(false)
  const [readAiError, setReadAiError] = useState(null)
  const [readAiMeetings, setReadAiMeetings] = useState([])

  useEffect(() => {
    async function fetchRecommendation() {
      try {
        setLoading(true)
        const data = await generateMentorRecommendation(userData)
        setRecommendation(data)
      } catch (err) {
        console.error('Failed to generate recommendation:', err)
        setError('Unable to find a mentor match. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendation()
    
    // Check if Read.ai is already connected
    const storedKey = localStorage.getItem('readai_api_key')
    const storedStatus = localStorage.getItem('readai_connected')
    if (storedKey && storedStatus === 'true') {
      setReadAiApiKey(storedKey)
      setReadAiConnected(true)
    }
  }, [userData])

  const handleConnectReadAi = async () => {
    if (!readAiApiKey.trim()) {
      setReadAiError('Please enter your Read.ai API key')
      return
    }

    setReadAiConnecting(true)
    setReadAiError(null)

    try {
      await connectReadAi(readAiApiKey)
      localStorage.setItem('readai_api_key', readAiApiKey)
      localStorage.setItem('readai_connected', 'true')
      setReadAiConnected(true)
      setShowReadAiHelp(false)
    } catch (err) {
      console.error('Failed to connect Read.ai:', err)
      setReadAiError(err.message || 'Failed to connect. Please check your API key.')
    } finally {
      setReadAiConnecting(false)
    }
  }

  const handleFetchReadAiMeetings = async () => {
    const apiKey = readAiApiKey || localStorage.getItem('readai_api_key')
    if (!apiKey) {
      setReadAiError('Please connect Read.ai first')
      return
    }

    setReadAiFetching(true)
    setReadAiError(null)

    try {
      const result = await fetchReadAiMeetings(apiKey, 10)
      setReadAiMeetings(result.meetings || [])
      
      // If meetings found, show them in a selectable list
      if (result.meetings && result.meetings.length > 0) {
        setShowReadAiHelp(false)
      } else {
        setReadAiError('No recent meetings found')
      }
    } catch (err) {
      console.error('Failed to fetch Read.ai meetings:', err)
      setReadAiError(err.message || 'Failed to fetch meetings. Please try again.')
    } finally {
      setReadAiFetching(false)
    }
  }

  const handleSelectReadAiMeeting = async (meeting) => {
    setExtracting(true)
    setExtractError(null)
    setMeetingTitle(meeting.title || 'Read.ai Meeting')

    try {
      const insights = await extractMeetingInsights({
        title: meeting.title || 'Read.ai Meeting',
        notes: meeting.transcript || meeting.summary || meeting.notes || ''
      })
      setMeetingInsights(insights)
      setNotes(meeting.transcript || meeting.summary || meeting.notes || '')
    } catch (err) {
      console.error('Failed to process Read.ai meeting:', err)
      setExtractError(err.message || 'Failed to process meeting')
    } finally {
      setExtracting(false)
    }
  }

  const handleDisconnectReadAi = async () => {
    await disconnectReadAi()
    setReadAiApiKey('')
    setReadAiConnected(false)
    setReadAiMeetings([])
    setReadAiError(null)
  }

  const handleConfirm = () => {
    // Pass mentor recommendation plus any meeting insights forward
    onConfirm({
      ...recommendation,
      meetingInsights
    })
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Handle text files directly in browser
    if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result
        if (typeof text === 'string') {
          setNotes(text)
          setExtractError(null)
        }
      }
      reader.onerror = () => {
        setExtractError('Unable to read file. Please try again or paste your notes instead.')
      }
      reader.readAsText(file)
      return
    }

    // For PDFs and other files, send to backend for extraction
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      setExtracting(true)
      setExtractError(null)
      
      try {
        const formData = new FormData()
        formData.append('file', file)
        if (meetingTitle) formData.append('title', meetingTitle)

        const API_BASE = import.meta.env.VITE_API_URL 
          ? `${import.meta.env.VITE_API_URL}/api`
          : 'http://localhost:3001/api'

        const response = await fetch(`${API_BASE}/meeting/extract-file`, {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || 'Failed to extract text from PDF')
        }

        const data = await response.json()
        setNotes(data.text || '')
        setExtractError(null)
        
        // Auto-extract if we got text
        if (data.text && data.text.trim()) {
          setTimeout(() => handleExtract(), 500)
        }
      } catch (err) {
        console.error('PDF extraction error:', err)
        setExtractError(err.message || 'Unable to read PDF. Please paste the text content instead.')
      } finally {
        setExtracting(false)
      }
      return
    }

    setExtractError('Please upload a text file (.txt) or PDF (.pdf), or paste your notes directly.')
  }

  const handleExtract = async () => {
    if (!notes.trim()) {
      setExtractError('Add some notes or transcript first.')
      return
    }

    setExtracting(true)
    setExtractError(null)

    try {
      const insights = await extractMeetingInsights({
        title: meetingTitle || 'Conversation notes',
        notes
      })
      setMeetingInsights(insights)
    } catch (err) {
      console.error('Failed to extract meeting insights:', err)
      setExtractError(err.message || 'Unable to extract insights. Please try again.')
    } finally {
      setExtracting(false)
    }
  }

  if (loading) {
    return <LoadingState message="Finding the right mentor for you..." />
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <button onClick={onBack} className="btn btn-secondary">
          Go back
        </button>
      </div>
    )
  }

  if (!recommendation) return null

  const { mentor, matchReasons, sessionExpectations, questionsToAsk, whatToPrepare } = recommendation

  return (
    <div className="mentor-recommendation fade-in">
      <div className="step-intro text-center">
        <h1>Your Mentor Match</h1>
        <p className="mt-md">
          Based on your background and goals, here is someone 
          who can provide the clarity you are looking for.
        </p>
      </div>

      {/* Mentor Card */}
      <div className="mentor-card fade-in-delay-1">
        <div className="mentor-header">
          <div className="mentor-avatar">
            {mentor.initials}
          </div>
          <div className="mentor-info">
            <h2 className="mentor-name">{mentor.name}</h2>
            <p className="mentor-title">{mentor.title}</p>
            <p className="mentor-experience">{mentor.experience}</p>
          </div>
        </div>

        <div className="mentor-details">
          <div className="mentor-section">
            <h3>Areas of focus</h3>
            <ul className="specialty-list">
              {mentor.specialties.map((specialty, i) => (
                <li key={i}>{specialty}</li>
              ))}
            </ul>
          </div>

          <div className="mentor-section">
            <h3>Approach</h3>
            <p className="mentor-approach">{mentor.approach}</p>
          </div>
        </div>
      </div>

      {/* Why This Match */}
      <div className="match-reasoning fade-in-delay-2">
        <h3 className="section-title">Why This Mentor</h3>
        <div className="reasoning-list">
          {matchReasons.map((reason, i) => (
            <div key={i} className="reasoning-item">
              <span className="reasoning-label">{reason.title}</span>
              <p className="reasoning-text">{reason.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Meeting Notes → Session Insights */}
      <div className="session-section fade-in-delay-2 meeting-notes-section">
        <div className="meeting-section-header">
          <div>
            <h3 className="section-title">Bring in notes from a recent conversation</h3>
            <p className="section-subtitle">
              Connect Read.ai for automatic sync, or upload/paste meeting notes. 
              We&apos;ll extract session summaries, highlights, and action items.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-ghost readai-connect-btn"
            onClick={() => setShowReadAiHelp(!showReadAiHelp)}
          >
            {showReadAiHelp ? 'Hide' : 'Connect Read.ai'}
          </button>
        </div>

        {showReadAiHelp && (
          <div className="readai-help-box">
            {!readAiConnected ? (
              <>
                <h4>Connect Read.ai</h4>
                <p>Enter your Read.ai API key to fetch meetings directly:</p>
                <div className="readai-connect-form">
                  <input
                    type="password"
                    placeholder="Enter your Read.ai API key"
                    value={readAiApiKey}
                    onChange={(e) => setReadAiApiKey(e.target.value)}
                    className="readai-api-input"
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleConnectReadAi}
                    disabled={readAiConnecting || !readAiApiKey.trim()}
                  >
                    {readAiConnecting ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
                <p className="readai-note">
                  Get your API key from Read.ai → Settings → Integrations → API Key
                </p>
                {readAiError && (
                  <div className="readai-error">{readAiError}</div>
                )}
              </>
            ) : (
              <>
                <div className="readai-connected-header">
                  <h4>✓ Read.ai Connected</h4>
                  <button
                    type="button"
                    className="btn btn-ghost btn-small"
                    onClick={handleDisconnectReadAi}
                  >
                    Disconnect
                  </button>
                </div>
                <div className="readai-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleFetchReadAiMeetings}
                    disabled={readAiFetching}
                  >
                    {readAiFetching ? 'Fetching...' : 'Fetch Recent Meetings'}
                  </button>
                </div>
                {readAiError && (
                  <div className="readai-error">{readAiError}</div>
                )}
                {readAiMeetings.length > 0 && (
                  <div className="readai-meetings-list">
                    <h5>Select a meeting:</h5>
                    {readAiMeetings.map((meeting, i) => (
                      <button
                        key={i}
                        type="button"
                        className="readai-meeting-item"
                        onClick={() => handleSelectReadAiMeeting(meeting)}
                      >
                        <div className="meeting-item-title">{meeting.title || 'Untitled Meeting'}</div>
                        {meeting.date && (
                          <div className="meeting-item-date">
                            {new Date(meeting.date).toLocaleDateString()}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="meeting-input-grid">
          <div className="meeting-input-column">
            <label className="field-label" htmlFor="meeting-title">
              Optional title
            </label>
            <input
              id="meeting-title"
              type="text"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              placeholder="e.g., Career chat with Sarah, 1:1 with manager..."
            />

            <label className="field-label" htmlFor="meeting-notes">
              Notes or transcript
            </label>
            <textarea
              id="meeting-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste notes from Read.ai or your own writing. Bullet points are fine."
              rows={6}
            />

            <div className="meeting-input-hint">
              <span>Or upload a file:</span>
              <input
                type="file"
                accept=".txt,.pdf,.docx,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileUpload}
                disabled={extracting}
              />
              <span className="file-hint">Supports .txt, .pdf, and .docx files</span>
            </div>

            {extractError && (
              <div className="meeting-error">
                {extractError}
              </div>
            )}

            <button
              type="button"
              className="btn btn-secondary meeting-extract-btn"
              onClick={handleExtract}
              disabled={extracting || !notes.trim()}
            >
              {extracting ? 'Extracting insights...' : 'Summarize & extract action items'}
            </button>
          </div>

          {meetingInsights && (
            <div className="meeting-output-column">
              <h4 className="output-title">Session summary</h4>
              <p className="output-summary">{meetingInsights.summary}</p>

              {Array.isArray(meetingInsights.highlights) && meetingInsights.highlights.length > 0 && (
                <>
                  <h4 className="output-title">Highlights</h4>
                  <ul className="output-list">
                    {meetingInsights.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </>
              )}

              {Array.isArray(meetingInsights.actionItems) && meetingInsights.actionItems.length > 0 && (
                <>
                  <h4 className="output-title">Action items from this session</h4>
                  <ul className="output-list">
                    {meetingInsights.actionItems.map((item, i) => (
                      <li key={i}>
                        <span className="action-text">{item.text}</span>
                        {item.due && (
                          <span className="action-meta"> · {item.due}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* AI Follow-ups & Reminders */}
      <FollowUpsAndReminders
        meetingInsights={meetingInsights}
        userData={userData}
        onActionItemAdd={(item) => {
          // Store action item for later use
          const stored = localStorage.getItem('cago_action_items') || '[]'
          const items = JSON.parse(stored)
          items.push({ ...item, id: `action-${Date.now()}`, createdAt: new Date().toISOString() })
          localStorage.setItem('cago_action_items', JSON.stringify(items))
        }}
      />

      {/* What to Expect - Personalized */}
      {sessionExpectations && sessionExpectations.length > 0 && (
        <div className="session-section fade-in-delay-2">
          <h3 className="section-title">What to Expect From Your Session</h3>
          <p className="section-subtitle">Specific topics you will cover based on your situation</p>
          <div className="expectations-list">
            {sessionExpectations.map((exp, i) => {
              const expObj = typeof exp === 'string' ? { topic: exp } : exp
              return (
                <div key={i} className="expectation-card">
                  <div className="expectation-topic">{expObj.topic}</div>
                  {expObj.outcome && (
                    <div className="expectation-outcome">
                      <span className="outcome-label">You will understand:</span> {expObj.outcome}
                    </div>
                  )}
                  {expObj.why && (
                    <div className="expectation-why">{expObj.why}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Questions to Ask */}
      {questionsToAsk && questionsToAsk.length > 0 && (
        <div className="session-section fade-in-delay-3">
          <h3 className="section-title">Questions to Ask</h3>
          <p className="section-subtitle">Prepared specifically for your situation</p>
          <div className="questions-list">
            {questionsToAsk.map((q, i) => {
              const qObj = typeof q === 'string' ? { question: q } : q
              return (
                <div key={i} className="question-card">
                  <div className="question-icon">?</div>
                  <div className="question-content">
                    <p className="question-text">"{qObj.question}"</p>
                    {qObj.context && (
                      <p className="question-context">{qObj.context}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* What to Prepare */}
      {whatToPrepare && whatToPrepare.length > 0 && (
        <div className="session-section fade-in-delay-3">
          <h3 className="section-title">What to Prepare</h3>
          <p className="section-subtitle">Come ready to make the most of your time</p>
          <div className="prepare-list">
            {whatToPrepare.map((item, i) => {
              const prepObj = typeof item === 'string' ? { item } : item
              return (
                <div key={i} className="prepare-card">
                  <div className="prepare-number">{i + 1}</div>
                  <div className="prepare-content">
                    <div className="prepare-item">{prepObj.item}</div>
                    {prepObj.why && (
                      <div className="prepare-why">{prepObj.why}</div>
                    )}
                    {prepObj.howTo && (
                      <div className="prepare-howto">
                        <span className="howto-label">How:</span> {prepObj.howTo}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="step-actions fade-in-delay-4">
        <button onClick={onBack} className="btn btn-ghost">
          ← Back
        </button>
        <button onClick={handleConfirm} className="btn btn-primary">
          Continue to Your Plan
        </button>
      </div>
    </div>
  )
}

export default MentorRecommendation
