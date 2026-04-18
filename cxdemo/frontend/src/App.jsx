import { useState } from 'react'
import LandingPage from './pages/LandingPage.jsx'
import DetailPage from './pages/DetailPage.jsx'
import AnalysisPage from './pages/AnalysisPage.jsx'

export default function App() {
  const [view, setView] = useState('landing')
  const [sessionId, setSessionId] = useState(null)
  const [detailKey, setDetailKey] = useState(null)

  const openDetail = (key) => { setDetailKey(key); setView('detail') }
  const startAnalysis = (id) => { setSessionId(id); setView('analysis') }
  const goHome = () => { setView('landing'); setSessionId(null); setDetailKey(null) }

  if (view === 'detail') return <DetailPage featureKey={detailKey} onBack={goHome} onAnalyse={() => setView('landing')} />
  if (view === 'analysis') return <AnalysisPage sessionId={sessionId} onReset={goHome} />
  return <LandingPage onSessionStart={startAnalysis} onOpenDetail={openDetail} />
}
