import { useState } from 'react'
import Header from './components/Header'
import ProgressSteps from './components/ProgressSteps'
import DirectionInput from './steps/DirectionInput'
import YouAreHere from './steps/YouAreHere'
import Confirmation from './steps/Confirmation'
import MentorRecommendation from './steps/MentorRecommendation'
import ExecutionPlan from './steps/ExecutionPlan'

function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [userData, setUserData] = useState({
    direction: '',
    background: '',
    confidence: 'exploring',
    adjustments: ''
  })
  
  // Store AI-generated data for PDF export
  const [journeyData, setJourneyData] = useState({
    assessment: null,
    mentor: null,
    plan: null
  })

  const totalSteps = 5

  const handleDirectionSubmit = (data) => {
    setUserData(prev => ({ ...prev, ...data }))
    setCurrentStep(2)
  }

  const handleAssessmentComplete = (assessment) => {
    setJourneyData(prev => ({ ...prev, assessment }))
    setCurrentStep(3)
  }

  const handleConfirmation = (adjustments) => {
    setUserData(prev => ({ ...prev, adjustments }))
    setCurrentStep(4)
  }

  const handleBackToYouAreHere = () => {
    setCurrentStep(2)
  }

  const handleMentorComplete = (mentor) => {
    setJourneyData(prev => ({ ...prev, mentor }))
    setCurrentStep(5)
  }

  const handlePlanComplete = (plan) => {
    setJourneyData(prev => ({ ...prev, plan }))
  }

  const handleStartOver = () => {
    setUserData({
      direction: '',
      background: '',
      confidence: 'exploring',
      adjustments: ''
    })
    setJourneyData({
      assessment: null,
      mentor: null,
      plan: null
    })
    setCurrentStep(1)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <DirectionInput onSubmit={handleDirectionSubmit} />
      case 2:
        return (
          <YouAreHere 
            userData={userData} 
            onContinue={handleAssessmentComplete}
          />
        )
      case 3:
        return (
          <Confirmation 
            userData={userData}
            onConfirm={handleConfirmation}
            onBack={handleBackToYouAreHere}
          />
        )
      case 4:
        return (
          <MentorRecommendation 
            userData={userData}
            onConfirm={handleMentorComplete}
            onBack={() => setCurrentStep(3)}
          />
        )
      case 5:
        return (
          <ExecutionPlan 
            userData={userData}
            journeyData={journeyData}
            onPlanReady={handlePlanComplete}
            onStartOver={handleStartOver}
          />
        )
      default:
        return <DirectionInput onSubmit={handleDirectionSubmit} />
    }
  }

  return (
    <div className="app">
      <Header onLogoClick={handleStartOver} />
      <main className="main-content">
        <div className="container">
          <ProgressSteps currentStep={currentStep} totalSteps={totalSteps} />
          {renderStep()}
        </div>
      </main>
    </div>
  )
}

export default App
