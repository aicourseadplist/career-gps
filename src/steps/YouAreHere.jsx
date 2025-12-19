import { useState, useEffect } from 'react'
import { generateAssessment } from '../api/client'
import LoadingState from '../components/LoadingState'
import './YouAreHere.css'

function YouAreHere({ userData, onContinue }) {
  const [assessment, setAssessment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchAssessment() {
      try {
        setLoading(true)
        const data = await generateAssessment(userData)
        setAssessment(data)
      } catch (err) {
        console.error('Failed to generate assessment:', err)
        setError('Unable to generate assessment. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchAssessment()
  }, [userData])

  const handleContinue = () => {
    // Pass the assessment data up to App
    onContinue(assessment)
  }

  if (loading) {
    return <LoadingState message="Understanding your position..." />
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-secondary">
          Try again
        </button>
      </div>
    )
  }

  if (!assessment) return null

  return (
    <div className="you-are-here">
      <div className="step-intro text-center fade-in">
        <p className="intro-label">You Are Here</p>
        <h1>A quiet look at where you stand</h1>
        <p className="mt-md intro-note">
          This is not a judgment. It is a reflection of what you shared, 
          meant to help you see your current position clearly.
        </p>
      </div>

      <div className="direction-banner fade-in-delay-1">
        <span className="direction-prefix">Your direction</span>
        <span className="direction-name">{assessment.directionLabel}</span>
      </div>

      <div className="assessment-sections">
        {/* Current Stage */}
        <section className="assessment-section fade-in-delay-1">
          <h2 className="section-title">Current Stage</h2>
          <div className="stage-card">
            <span className="stage-label">{assessment.stage.label}</span>
            <p className="stage-description">{assessment.stage.description}</p>
          </div>
        </section>

        {/* What You Already Have */}
        <section className="assessment-section fade-in-delay-2">
          <h2 className="section-title">What you already have</h2>
          <ul className="asset-list">
            {assessment.assets.map((asset, i) => (
              <li key={i} className="asset-item">
                <div className="asset-icon">○</div>
                <div className="asset-content">
                  <p className="asset-text">{asset.text}</p>
                  <p className="asset-signal">{asset.signal}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* What's Not Yet In Place */}
        <section className="assessment-section fade-in-delay-3">
          <h2 className="section-title">What is not yet in place</h2>
          <ul className="gap-list">
            {assessment.gaps.map((gap, i) => (
              <li key={i} className="gap-item">
                <div className="gap-icon">◦</div>
                <div className="gap-content">
                  <p className="gap-text">{gap.text}</p>
                  <p className="gap-note">{gap.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Readiness Snapshot */}
        <section className="assessment-section fade-in-delay-4">
          <h2 className="section-title">Readiness Snapshot</h2>
          <div className="readiness-grid">
            {assessment.readiness.map((area, i) => (
              <div key={i} className="readiness-item">
                <div className="readiness-header">
                  <span className="readiness-name">{area.name}</span>
                  <span className={`readiness-level level-${area.level}`}>
                    {area.level}
                  </span>
                </div>
                <p className="readiness-note">{area.note}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Transition */}
      <div className="transition-block fade-in-delay-4">
        <p className="transition-text">{assessment.transition}</p>
      </div>

      <div className="step-actions fade-in-delay-4">
        <button onClick={handleContinue} className="btn btn-primary">
          This feels accurate
        </button>
      </div>
    </div>
  )
}

export default YouAreHere
