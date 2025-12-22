import { useState } from 'react'
import './DirectionInput.css'

// Signals, not job titles - these represent current interests
const signals = [
  { id: 'data-insights', label: 'Working with data & insights', description: 'Numbers, patterns, making sense of information' },
  { id: 'building-products', label: 'Building products people use', description: 'Shaping what gets made and why' },
  { id: 'design-experience', label: 'Designing experiences', description: 'How things look, feel, and flow' },
  { id: 'writing-code', label: 'Writing code & systems', description: 'Making things work under the hood' },
  { id: 'storytelling-growth', label: 'Storytelling & growth', description: 'Reaching people, changing minds' },
  { id: 'leading-people', label: 'Leading people or projects', description: 'Guiding others toward outcomes' },
  { id: 'exploring', label: 'Still figuring it out', description: 'Not sure yet, and that's okay' },
  { id: 'other', label: 'Something else', description: 'None of these feel right' }
]

// How strongly they feel the pull - not commitment level
const signalStrength = [
  { id: 'curious', label: 'Just curious', description: 'Something about this caught my attention' },
  { id: 'drawn', label: 'Feeling drawn', description: 'I keep coming back to this idea' },
  { id: 'pulled', label: 'Strongly pulled', description: 'This feels like where I want to go' }
]

function DirectionInput({ onSubmit }) {
  const [signal, setSignal] = useState('')
  const [customSignal, setCustomSignal] = useState('')
  const [background, setBackground] = useState('')
  const [strength, setStrength] = useState('curious')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!signal || !background.trim()) return
    
    // Pass data forward - internally we still use 'direction' key for compatibility
    onSubmit({
      direction: signal === 'other' ? customSignal : signal,
      directionLabel: signal === 'other' 
        ? customSignal 
        : signals.find(s => s.id === signal)?.label,
      background: background.trim(),
      confidence: strength // Maps to existing key for compatibility
    })
  }

  const isValid = signal && background.trim() && (signal !== 'other' || customSignal.trim())

  return (
    <div className="direction-input fade-in">
      <div className="step-intro text-center">
        <h1 className="fade-in-delay-1">What are you drawn to?</h1>
        <p className="mt-md fade-in-delay-2">
          This isn't a decision — just a signal. 
          What's catching your interest right now?
        </p>
      </div>

      <form onSubmit={handleSubmit} className="direction-form fade-in-delay-3">
        <div className="form-section">
          <label className="section-label">What feels interesting right now</label>
          <div className="direction-grid">
            {signals.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`direction-option ${signal === s.id ? 'selected' : ''}`}
                onClick={() => setSignal(s.id)}
              >
                <span className="direction-label">{s.label}</span>
                <span className="direction-desc">{s.description}</span>
              </button>
            ))}
          </div>
          
          {signal === 'other' && (
            <div className="mt-md">
              <input
                type="text"
                placeholder="What's on your mind..."
                value={customSignal}
                onChange={(e) => setCustomSignal(e.target.value)}
                className="custom-direction-input"
              />
            </div>
          )}
        </div>

        <div className="form-section">
          <label htmlFor="background" className="section-label">
            A bit of context about you
          </label>
          <p className="text-small text-muted mb-sm">
            Whatever you'd like to share — there's no wrong answer. 
            This just helps us understand where you're coming from.
          </p>
          <textarea
            id="background"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            placeholder="A little about what I've been doing, thinking about, or curious about..."
            rows={5}
          />
        </div>

        <div className="form-section">
          <label className="section-label">How strong is this pull?</label>
          <p className="text-small text-muted mb-sm">
            No pressure — this can change. We're just capturing where you are today.
          </p>
          <div className="confidence-options">
            {signalStrength.map((level) => (
              <button
                key={level.id}
                type="button"
                className={`confidence-option ${strength === level.id ? 'selected' : ''}`}
                onClick={() => setStrength(level.id)}
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

