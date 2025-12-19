import { useState, useEffect } from 'react'
import { generateMentorRecommendation } from '../api/client'
import LoadingState from '../components/LoadingState'
import './MentorRecommendation.css'

function MentorRecommendation({ userData, onConfirm, onBack }) {
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
  }, [userData])

  const handleConfirm = () => {
    onConfirm(recommendation)
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
