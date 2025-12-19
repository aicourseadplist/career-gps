import { useState } from 'react'
import './DirectionInput.css'

const directions = [
  { id: 'data-analyst', label: 'Data Analyst', description: 'Working with data to find insights' },
  { id: 'product-manager', label: 'Product Manager', description: 'Guiding product strategy and execution' },
  { id: 'ux-designer', label: 'UX Designer', description: 'Crafting user experiences' },
  { id: 'software-engineer', label: 'Software Engineer', description: 'Building and maintaining software' },
  { id: 'marketing', label: 'Marketing', description: 'Growing brands and audiences' },
  { id: 'interview-prep', label: 'Interview Preparation', description: 'Preparing for upcoming interviews' },
  { id: 'career-pivot', label: 'Career Pivot', description: 'Transitioning to a new field' },
  { id: 'other', label: 'Something else', description: 'A direction not listed here' }
]

const confidenceLevels = [
  { id: 'exploring', label: 'Still exploring', description: 'I have a general interest but many questions' },
  { id: 'leaning', label: 'Leaning toward this', description: 'This feels right, but I want to be sure' },
  { id: 'committed', label: 'Committed', description: 'I know this is my path, just need clarity on how' }
]

function DirectionInput({ onSubmit }) {
  const [direction, setDirection] = useState('')
  const [customDirection, setCustomDirection] = useState('')
  const [background, setBackground] = useState('')
  const [confidence, setConfidence] = useState('exploring')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!direction || !background.trim()) return
    
    onSubmit({
      direction: direction === 'other' ? customDirection : direction,
      directionLabel: direction === 'other' 
        ? customDirection 
        : directions.find(d => d.id === direction)?.label,
      background: background.trim(),
      confidence
    })
  }

  const isValid = direction && background.trim() && (direction !== 'other' || customDirection.trim())

  return (
    <div className="direction-input fade-in">
      <div className="step-intro text-center">
        <h1 className="fade-in-delay-1">Where are you heading?</h1>
        <p className="mt-md fade-in-delay-2">
          Tell us about the direction you've chosen. 
          There's no right or wrong answer here — just your current thinking.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="direction-form fade-in-delay-3">
        <div className="form-section">
          <label className="section-label">Your chosen direction</label>
          <div className="direction-grid">
            {directions.map((d) => (
              <button
                key={d.id}
                type="button"
                className={`direction-option ${direction === d.id ? 'selected' : ''}`}
                onClick={() => setDirection(d.id)}
              >
                <span className="direction-label">{d.label}</span>
                <span className="direction-desc">{d.description}</span>
              </button>
            ))}
          </div>
          
          {direction === 'other' && (
            <div className="mt-md">
              <input
                type="text"
                placeholder="Describe your direction..."
                value={customDirection}
                onChange={(e) => setCustomDirection(e.target.value)}
                className="custom-direction-input"
              />
            </div>
          )}
        </div>

        <div className="form-section">
          <label htmlFor="background" className="section-label">
            A bit about your background
          </label>
          <p className="text-small text-muted mb-sm">
            Share what you've done so far — work, studies, projects, or explorations. 
            Even informal experience counts.
          </p>
          <textarea
            id="background"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            placeholder="I studied... I've worked as... I've been learning..."
            rows={5}
          />
        </div>

        <div className="form-section">
          <label className="section-label">How certain do you feel?</label>
          <p className="text-small text-muted mb-sm">
            This helps us understand where you are mentally, not to judge your readiness.
          </p>
          <div className="confidence-options">
            {confidenceLevels.map((level) => (
              <button
                key={level.id}
                type="button"
                className={`confidence-option ${confidence === level.id ? 'selected' : ''}`}
                onClick={() => setConfidence(level.id)}
              >
                <span className="confidence-label">{level.label}</span>
                <span className="confidence-desc">{level.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!isValid}
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  )
}

export default DirectionInput

