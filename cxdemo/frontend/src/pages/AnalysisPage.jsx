import { useState, useEffect } from 'react'
import { pollAnalysis } from '../utils/api.js'
import AgentDashboard from '../components/AgentDashboard.jsx'
import NonAgentView from '../components/NonAgentView.jsx'
import styles from './AnalysisPage.module.css'

const STEPS = [
  { id: 'parse', label: 'Parsing content', duration: 700 },
  { id: 'detect', label: 'Detecting interaction type', duration: 1100 },
  { id: 'analyse', label: 'Running AI analysis', duration: 12000 },
  { id: 'score', label: 'Computing 30+ performance metrics', duration: 1500 },
  { id: 'coach', label: 'Generating business impact report', duration: 1100 },
]

function ProcessingView({ currentStep }) {
  return (
    <div className={styles.procWrap}>
      <div className={styles.scanner}>
        <div className={styles.scanGrid} id="sg" />
        <div className={styles.scanLine} />
        <div className={styles.scanRings} />
        <div className={styles.scanIco}>
          <div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
            </svg>
          </div>
        </div>
      </div>
      <h2 className={styles.procTitle}>Analysing interaction</h2>
      <p className={styles.procSub}>AI is reading the transcript and computing performance signals</p>
      <div className={styles.stepList}>
        {STEPS.map((step, i) => {
          const done = i < currentStep, active = i === currentStep
          return (
            <div key={step.id} className={`${styles.step} ${done ? styles.stepDone : ''} ${active ? styles.stepActive : ''}`}>
              <div className={styles.stepInd}>
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round"><path d="M2 6l3 3 5-5"/></svg>
                ) : active ? (
                  <div className={styles.stepSpin} />
                ) : (
                  <div className={styles.stepDot} />
                )}
              </div>
              <span className={styles.stepLabel}>{step.label}</span>
              {active && <span className={styles.stepCursor}>|</span>}
            </div>
          )
        })}
      </div>
      <p className={styles.procNote}>This typically takes 15–30 seconds</p>
    </div>
  )
}

export default function AnalysisPage({ sessionId, onReset }) {
  const [sessionData, setSessionData] = useState(null)
  const [error, setError] = useState(null)
  const [stepIdx, setStepIdx] = useState(0)

  useEffect(() => {
    let stepTimer, cur = 0
    const advance = () => {
      if (cur < STEPS.length - 1) {
        stepTimer = setTimeout(() => { cur++; setStepIdx(cur); advance() }, STEPS[cur].duration)
      }
    }
    advance()
    pollAnalysis(sessionId, setSessionData).catch(err => setError(err.message))
    return () => clearTimeout(stepTimer)
  }, [sessionId])

  const status = sessionData?.status
  const isComplete = status === 'complete' || status === 'not_agent_interaction'
  const isFailed = status === 'failed'

  return (
    <div className={styles.root}>
      <div className={styles.orb1} /><div className={styles.orb2} />
      <nav className={styles.nav}>
        <button className={styles.backBtn} onClick={onReset}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          New analysis
        </button>
        <div className={styles.logo}><span className={styles.logoBadge}>CX</span><span className={styles.logoTxt}>Intelligence</span></div>
        {isComplete
          ? <span className={styles.statusPill} style={{ color: 'var(--brand)' }}>● Analysis complete</span>
          : <span className={styles.statusPill} style={{ color: 'var(--amber)' }}>Analysing...</span>
        }
      </nav>
      <main className={styles.main}>
        {!isComplete && !isFailed && !error && <ProcessingView currentStep={stepIdx} />}
        {(isFailed || error) && (
          <div className={styles.errorState}>
            <div className={styles.errorIcon}>⚠</div>
            <h2>Analysis failed</h2>
            <p>{sessionData?.error_message || error || 'Something went wrong. Please try again.'}</p>
            <button className={styles.retryBtn} onClick={onReset}>Try again</button>
          </div>
        )}
        {isComplete && sessionData?.analysis && (
          sessionData.is_agent_interaction
            ? <AgentDashboard data={sessionData} onReset={onReset} />
            : <NonAgentView data={sessionData} onReset={onReset} />
        )}
      </main>
    </div>
  )
}
