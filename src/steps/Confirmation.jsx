import { useState } from 'react'
import './Confirmation.css'

function Confirmation({ userData, onConfirm, onBack }) {
  const [adjustments, setAdjustments] = useState('')
  const [hasAdjustments, setHasAdjustments] = useState(false)

  const handleConfirm = () => {
    onConfirm(adjustments.trim())
  }

  return (
    <div className="confirmation fade-in">
      <div className="step-intro text-center">
        <h1>Does this feel right?</h1>
        <p className="mt-md">
          Take a moment to reflect. If something feels off or incomplete, 
          you can adjust before we continue.
        </p>
      </div>

      <div className="confirmation-options fade-in-delay-1">
        <button 
          className={`confirmation-option ${!hasAdjustments ? 'selected' : ''}`}
          onClick={() => setHasAdjustments(false)}
        >
          <span className="option-icon">✓</span>
          <div className="option-content">
            <span className="option-title">Yes, this is accurate</span>
            <span className="option-desc">The assessment reflects where I am right now</span>
          </div>
        </button>

        <button 
          className={`confirmation-option ${hasAdjustments ? 'selected' : ''}`}
          onClick={() => setHasAdjustments(true)}
        >
          <span className="option-icon">+</span>
          <div className="option-content">
            <span className="option-title">I'd like to add some context</span>
            <span className="option-desc">There's something I want to clarify or expand on</span>
          </div>
        </button>
      </div>

      {hasAdjustments && (
        <div className="adjustments-section fade-in">
          <label htmlFor="adjustments" className="adjustments-label">
            What would you like to add or clarify?
          </label>
          <p className="text-small text-muted mb-sm">
            This could be experience you forgot to mention, 
            a nuance about your situation, or anything that felt missing.
          </p>
          <textarea
            id="adjustments"
            value={adjustments}
            onChange={(e) => setAdjustments(e.target.value)}
            placeholder="I should also mention that... / One thing that's different is..."
            rows={4}
          />
        </div>
      )}

      <div className="confirmation-summary fade-in-delay-2">
        <div className="summary-header">
          <h3>What happens next</h3>
        </div>
        <p className="summary-text">
          Based on your situation, we'll suggest a mentor who can help you 
          gain clarity on specific questions. After your conversation, 
          you'll receive a personalized plan for moving forward.
        </p>
      </div>

      <div className="step-actions fade-in-delay-2">
        <button onClick={onBack} className="btn btn-ghost">
          ← Review assessment
        </button>
        <button onClick={handleConfirm} className="btn btn-primary">
          Continue
        </button>
      </div>
    </div>
  )
}

export default Confirmation

