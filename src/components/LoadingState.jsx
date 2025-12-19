import './LoadingState.css'

function LoadingState({ message = 'Thinking...' }) {
  return (
    <div className="loading-state">
      <div className="loading-content">
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p className="loading-message">{message}</p>
      </div>
    </div>
  )
}

export default LoadingState

