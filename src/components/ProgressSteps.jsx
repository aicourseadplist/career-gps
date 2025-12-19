function ProgressSteps({ currentStep, totalSteps }) {
  return (
    <div className="progress-steps">
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1
        let className = 'progress-step'
        if (stepNum < currentStep) className += ' completed'
        if (stepNum === currentStep) className += ' active'
        return <div key={stepNum} className={className} />
      })}
    </div>
  )
}

export default ProgressSteps

