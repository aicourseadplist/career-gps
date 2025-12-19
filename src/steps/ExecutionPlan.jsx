import { useState, useEffect } from 'react'
import { generateExecutionPlan } from '../api/client'
import { downloadJourneyPDF } from '../components/JourneyPDF'
import LoadingState from '../components/LoadingState'
import './ExecutionPlan.css'

function ExecutionPlan({ userData, journeyData, onPlanReady, onStartOver }) {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [downloading, setDownloading] = useState(false)
  const [pdfError, setPdfError] = useState(null)
  
  // Interactive state
  const [completedTasks, setCompletedTasks] = useState({})
  const [expandedSkills, setExpandedSkills] = useState({})
  const [expandedPhases, setExpandedPhases] = useState({ day30: true, day60: false, day90: false })
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    async function fetchPlan() {
      try {
        setLoading(true)
        const data = await generateExecutionPlan(userData)
        setPlan(data)
        onPlanReady(data)
      } catch (err) {
        console.error('Failed to generate plan:', err)
        setError('Unable to generate your plan. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchPlan()
  }, [userData])

  const toggleTask = (phaseKey, taskIndex) => {
    const key = `${phaseKey}-${taskIndex}`
    setCompletedTasks(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleSkill = (index) => {
    setExpandedSkills(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const togglePhase = (phase) => {
    setExpandedPhases(prev => ({ ...prev, [phase]: !prev[phase] }))
  }

  const getProgress = () => {
    if (!plan) return 0
    const totalTasks = 
      (plan.phasedPath?.day30?.tasks?.length || 0) +
      (plan.phasedPath?.day60?.tasks?.length || 0) +
      (plan.phasedPath?.day90?.tasks?.length || 0)
    const completed = Object.values(completedTasks).filter(Boolean).length
    return totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0
  }

  const handleDownloadPDF = async () => {
    if (!plan || !journeyData.assessment) {
      setPdfError('Please wait for your plan to finish loading.')
      return
    }
    
    setDownloading(true)
    setPdfError(null)
    
    try {
      await downloadJourneyPDF(
        userData, 
        journeyData.assessment, 
        journeyData.mentor || null, 
        plan
      )
    } catch (err) {
      console.error('Failed to download PDF:', err)
      setPdfError('Failed to generate PDF. Please try again or check the browser console.')
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return <LoadingState message="Creating your detailed personalized roadmap..." />
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <button onClick={onStartOver} className="btn btn-secondary">Start over</button>
      </div>
    )
  }

  if (!plan) return null

  const progress = getProgress()

  return (
    <div className="execution-plan-v2">
      {/* Header */}
      <div className="plan-header fade-in">
        <p className="plan-label">Your Execution Plan</p>
        <h1>Your Personalized Roadmap</h1>
        <p className="plan-intro">
          This is not just a document — it is your action plan. Check off tasks as you complete them.
        </p>
        
        {/* Progress bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-text">{progress}% complete</span>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="plan-tabs fade-in-delay-1">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          Skills & Tools
        </button>
        <button 
          className={`tab ${activeTab === 'roadmap' ? 'active' : ''}`}
          onClick={() => setActiveTab('roadmap')}
        >
          90-Day Roadmap
        </button>
        <button 
          className={`tab ${activeTab === 'actions' ? 'active' : ''}`}
          onClick={() => setActiveTab('actions')}
        >
          Quick Actions
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="tab-panel fade-in">
            {/* Direction Confirmation */}
            <section className="plan-section">
              <div className="section-header">
                <span className="section-number">01</span>
                <h2>Your Direction</h2>
              </div>
              <div className="direction-confirmation">
                <h3>{plan.directionLabel}</h3>
                <p>{plan.directionConfirmation}</p>
              </div>
            </section>

            {/* Quick Wins */}
            {plan.quickWins && plan.quickWins.length > 0 && (
              <section className="plan-section">
                <div className="section-header">
                  <span className="section-number">⚡</span>
                  <h2>Start Today — Quick Wins</h2>
                </div>
                <p className="section-intro">Actions you can take right now, in under 30 minutes each.</p>
                <div className="quick-wins-grid">
                  {plan.quickWins.map((win, i) => (
                    <div key={i} className="quick-win-card">
                      <h4>{win.action}</h4>
                      <p className="impact">{win.impact}</p>
                      {win.steps && (
                        <ol className="steps-list">
                          {win.steps.map((step, j) => (
                            <li key={j}>{step}</li>
                          ))}
                        </ol>
                      )}
                      <button className="btn btn-small btn-accent">Start This</button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Success Metrics */}
            {plan.successMetrics && plan.successMetrics.length > 0 && (
              <section className="plan-section">
                <div className="section-header">
                  <span className="section-number">📊</span>
                  <h2>How to Measure Progress</h2>
                </div>
                <div className="metrics-grid">
                  {plan.successMetrics.map((metric, i) => (
                    <div key={i} className="metric-card">
                      <h4>{metric.metric}</h4>
                      <div className="metric-targets">
                        <div className="target">
                          <span className="target-label">30 days</span>
                          <span className="target-value">{metric.target30}</span>
                        </div>
                        <div className="target">
                          <span className="target-label">60 days</span>
                          <span className="target-value">{metric.target60}</span>
                        </div>
                        <div className="target">
                          <span className="target-label">90 days</span>
                          <span className="target-value">{metric.target90}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Potential Blockers */}
            {plan.potentialBlockers && plan.potentialBlockers.length > 0 && (
              <section className="plan-section">
                <div className="section-header">
                  <span className="section-number">🛡️</span>
                  <h2>Anticipating Challenges</h2>
                </div>
                <div className="blockers-list">
                  {plan.potentialBlockers.map((item, i) => (
                    <div key={i} className="blocker-card">
                      <div className="blocker-problem">
                        <span className="blocker-icon">⚠️</span>
                        <span>{item.blocker}</span>
                      </div>
                      <div className="blocker-solution">
                        <span className="solution-icon">✓</span>
                        <span>{item.solution}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Closing */}
            <section className="plan-closing">
              <div className="closing-content">
                <p className="closing-text">{plan.closingReassurance}</p>
              </div>
            </section>
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === 'skills' && (
          <div className="tab-panel fade-in">
            {/* Hard Skills */}
            <section className="plan-section">
              <div className="section-header">
                <span className="section-number">02</span>
                <h2>Hard Skills to Master</h2>
              </div>
              <div className="skills-detailed-list">
                {plan.hardSkills.map((skill, i) => (
                  <div key={i} className={`skill-detailed-card ${expandedSkills[i] ? 'expanded' : ''}`}>
                    <div className="skill-header-row" onClick={() => toggleSkill(i)}>
                      <div className="skill-main">
                        <span className="skill-name">{skill.skill}</span>
                        <span className={`skill-priority ${skill.priority}`}>{skill.priority}</span>
                      </div>
                      <span className="expand-icon">{expandedSkills[i] ? '−' : '+'}</span>
                    </div>
                    <p className="skill-why">{skill.why}</p>
                    
                    {expandedSkills[i] && (
                      <div className="skill-details">
                        {skill.currentLevel && (
                          <div className="skill-levels">
                            <div className="level-item">
                              <span className="level-label">Current</span>
                              <span className="level-value">{skill.currentLevel}</span>
                            </div>
                            <span className="level-arrow">→</span>
                            <div className="level-item">
                              <span className="level-label">Target</span>
                              <span className="level-value">{skill.targetLevel}</span>
                            </div>
                          </div>
                        )}
                        
                        {skill.learningPath && (
                          <div className="learning-path">
                            <h5>Learning Path</h5>
                            <p>{skill.learningPath}</p>
                          </div>
                        )}
                        
                        {skill.resources && skill.resources.length > 0 && (
                          <div className="resources-section">
                            <h5>Recommended Resources</h5>
                            <div className="resources-list">
                              {skill.resources.map((resource, j) => (
                                <a 
                                  key={j} 
                                  href={resource.url?.startsWith('http') ? resource.url : '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="resource-item"
                                >
                                  <span className="resource-type">{resource.type}</span>
                                  <span className="resource-name">{resource.name}</span>
                                  {resource.timeEstimate && (
                                    <span className="resource-time">{resource.timeEstimate}</span>
                                  )}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {skill.practiceProject && (
                          <div className="practice-project">
                            <h5>Practice Project</h5>
                            <p>{skill.practiceProject}</p>
                            <button className="btn btn-small btn-secondary">Start Project</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Soft Skills */}
            <section className="plan-section">
              <div className="section-header">
                <span className="section-number">03</span>
                <h2>Soft Skills to Develop</h2>
              </div>
              <div className="soft-skills-detailed">
                {plan.softSkills.map((skill, i) => (
                  <div key={i} className="soft-skill-detailed-card">
                    <h4>{skill.skill}</h4>
                    <p className="soft-skill-why">{skill.why}</p>
                    {skill.howToDevelop && (
                      <div className="how-to-develop">
                        <strong>How to develop:</strong> {skill.howToDevelop}
                      </div>
                    )}
                    {skill.dailyPractice && (
                      <div className="daily-practice">
                        <span className="practice-icon">🔄</span>
                        <span>Daily practice: {skill.dailyPractice}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Tools */}
            <section className="plan-section">
              <div className="section-header">
                <span className="section-number">04</span>
                <h2>Tools & Technologies</h2>
              </div>
              <div className="tools-detailed-grid">
                {(Array.isArray(plan.tools) ? plan.tools : []).map((tool, i) => {
                  const toolObj = typeof tool === 'string' ? { name: tool } : tool
                  return (
                    <div key={i} className="tool-detailed-card">
                      <div className="tool-header">
                        <span className="tool-name">{toolObj.name}</span>
                        {toolObj.category && <span className="tool-category">{toolObj.category}</span>}
                      </div>
                      {toolObj.why && <p className="tool-why">{toolObj.why}</p>}
                      {toolObj.getStarted && (
                        <div className="tool-start">
                          <strong>Get started:</strong> {toolObj.getStarted}
                        </div>
                      )}
                      {toolObj.freeOption && (
                        <div className="tool-free">
                          <span className="free-badge">Free option:</span> {toolObj.freeOption}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          </div>
        )}

        {/* ROADMAP TAB */}
        {activeTab === 'roadmap' && (
          <div className="tab-panel fade-in">
            <section className="plan-section">
              <div className="section-header">
                <span className="section-number">05</span>
                <h2>Your 90-Day Journey</h2>
              </div>
              
              {['day30', 'day60', 'day90'].map((phaseKey) => {
                const phase = plan.phasedPath?.[phaseKey]
                if (!phase) return null
                
                const phaseLabel = phaseKey === 'day30' ? 'Days 1-30' : phaseKey === 'day60' ? 'Days 31-60' : 'Days 61-90'
                const phaseTasks = phase.tasks || (Array.isArray(phase) ? phase.map(t => ({ task: t })) : [])
                const completedCount = phaseTasks.filter((_, i) => completedTasks[`${phaseKey}-${i}`]).length
                
                return (
                  <div key={phaseKey} className={`phase-card ${expandedPhases[phaseKey] ? 'expanded' : ''}`}>
                    <div className="phase-header" onClick={() => togglePhase(phaseKey)}>
                      <div className="phase-info">
                        <span className="phase-label">{phaseLabel}</span>
                        <span className="phase-theme">{phase.theme || (phaseKey === 'day30' ? 'Foundation' : phaseKey === 'day60' ? 'Building' : 'Momentum')}</span>
                      </div>
                      <div className="phase-meta">
                        <span className="phase-progress">{completedCount}/{phaseTasks.length} done</span>
                        <span className="expand-icon">{expandedPhases[phaseKey] ? '−' : '+'}</span>
                      </div>
                    </div>
                    
                    {expandedPhases[phaseKey] && (
                      <div className="phase-content">
                        {phase.goals && (
                          <div className="phase-goals">
                            <h5>Goals for this phase</h5>
                            <ul>
                              {phase.goals.map((goal, i) => (
                                <li key={i}>{goal}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="phase-tasks">
                          <h5>Tasks</h5>
                          {phaseTasks.map((taskObj, i) => {
                            const task = typeof taskObj === 'string' ? { task: taskObj } : taskObj
                            const isCompleted = completedTasks[`${phaseKey}-${i}`]
                            
                            return (
                              <div key={i} className={`task-item ${isCompleted ? 'completed' : ''}`}>
                                <label className="task-checkbox">
                                  <input 
                                    type="checkbox" 
                                    checked={isCompleted || false}
                                    onChange={() => toggleTask(phaseKey, i)}
                                  />
                                  <span className="checkmark"></span>
                                </label>
                                <div className="task-content">
                                  <span className="task-name">{task.task}</span>
                                  {task.details && <p className="task-details">{task.details}</p>}
                                  <div className="task-meta">
                                    {task.deliverable && (
                                      <span className="task-deliverable">📦 {task.deliverable}</span>
                                    )}
                                    {task.estimatedHours && (
                                      <span className="task-time">⏱️ {task.estimatedHours}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        
                        {phase.milestone && (
                          <div className="phase-milestone">
                            <span className="milestone-icon">🎯</span>
                            <span>Milestone: {phase.milestone}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </section>
          </div>
        )}

        {/* ACTIONS TAB */}
        {activeTab === 'actions' && (
          <div className="tab-panel fade-in">
            {/* Weekly Actions */}
            <section className="plan-section">
              <div className="section-header">
                <span className="section-number">06</span>
                <h2>Weekly Habits</h2>
              </div>
              <p className="section-intro">Consistent small actions compound into big results.</p>
              <div className="weekly-actions-detailed">
                {plan.weeklyActions.map((action, i) => {
                  const actionObj = typeof action === 'string' ? { action } : action
                  return (
                    <div key={i} className="weekly-action-card">
                      <div className="action-main">
                        <span className="action-text">{actionObj.action}</span>
                        <span className="action-frequency">{actionObj.frequency}</span>
                      </div>
                      {actionObj.duration && (
                        <div className="action-duration">⏱️ {actionObj.duration} per session</div>
                      )}
                      {actionObj.why && (
                        <p className="action-why">{actionObj.why}</p>
                      )}
                      {actionObj.howToTrack && (
                        <div className="action-track">
                          <strong>Track progress:</strong> {actionObj.howToTrack}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Quick Wins again for easy access */}
            {plan.quickWins && plan.quickWins.length > 0 && (
              <section className="plan-section">
                <div className="section-header">
                  <span className="section-number">⚡</span>
                  <h2>Do It Now</h2>
                </div>
                <div className="quick-wins-list">
                  {plan.quickWins.map((win, i) => (
                    <div key={i} className="quick-win-action">
                      <div className="win-content">
                        <h4>{win.action}</h4>
                        <p>{win.impact}</p>
                      </div>
                      <button className="btn btn-accent">Start →</button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="plan-actions fade-in-delay-4">
        {pdfError && (
          <div className="pdf-error">
            <p>{pdfError}</p>
          </div>
        )}
        <button 
          onClick={handleDownloadPDF} 
          className="btn btn-primary download-btn"
          disabled={downloading || !plan || !journeyData.assessment}
        >
          {downloading ? 'Generating PDF...' : 'Download Full Plan (PDF)'}
        </button>
        <button onClick={onStartOver} className="btn btn-secondary">
          Start New Session
        </button>
      </div>
    </div>
  )
}

export default ExecutionPlan
