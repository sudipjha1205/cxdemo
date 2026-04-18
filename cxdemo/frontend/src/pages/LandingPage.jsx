import { useState, useRef, useCallback } from 'react'
import { api } from '../utils/api.js'
import styles from './LandingPage.module.css'

const SAMPLE = `Agent: Thank you for calling TechSupport, this is Priya speaking. How can I help you today?

Customer: Hi Priya, I've been waiting on hold for 45 minutes! My internet has been down since yesterday morning and I work from home. This is completely unacceptable.

Agent: I completely understand your frustration, and I sincerely apologize for the wait time and for the inconvenience this outage has caused. Let me pull up your account right away. Can I get the phone number on the account?

Customer: It's 9876543210. I've already called twice this week and nobody fixed it!

Agent: I can see your account here. I notice you've contacted us twice — I'm truly sorry we haven't resolved this sooner. There's a known outage in your area affecting around 200 customers. Our technical team has been working on it and the estimated resolution time is 2 hours from now.

Customer: 2 more hours?! I have a client deadline at 3 PM! Can someone come out now?

Agent: I completely hear you on the deadline pressure. Let me check if we can expedite a technician visit... I do see we can schedule an emergency visit but the earliest slot would be after 3 PM. What I can do right now is activate a mobile hotspot on your account at no charge so you can meet your deadline, and I'll also apply a 3-day credit to your bill for this outage. Would that work for you?

Customer: Oh, that actually helps a lot. Yes please do that.

Agent: Perfect. I've activated the hotspot feature on your account — you'll get an SMS with setup instructions in the next 2 minutes. I've also applied a 3-day credit of Rs 150. Is there anything else I can help you with today?

Customer: No, thank you. I really appreciate you actually solving it this time.

Agent: I'm glad we could find a solution. I've also escalated a note so the technician will call you before 3 PM with an update on the outage restoration. Have a productive rest of your day!`

const FEATURES = [
  {
    key: 'quality', color: '#00e5a0', bg: 'rgba(0,229,160,0.12)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    label: 'Real-time quality scoring',
    desc: 'Every interaction scored across 30+ dimensions instantly — no manual sampling.',
  },
  {
    key: 'compliance', color: '#4d9fff', bg: 'rgba(77,159,255,0.12)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    label: 'Automated compliance audit',
    desc: 'Instantly check every agent against your SOPs — greeting, verification, escalation, closing.',
  },
  {
    key: 'coaching', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
    label: 'AI coaching recommendations',
    desc: 'Prioritised, agent-specific coaching tied directly to what happened in each call.',
  },
  {
    key: 'bizimpact', color: '#ffb740', bg: 'rgba(255,183,64,0.12)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    label: 'Business impact metrics',
    desc: 'See how agent performance translates to CSAT, churn risk, and revenue retention.',
  },
]

const STATS = [
  { value: '97%', label: 'Analysis accuracy' },
  { value: '<30s', label: 'Time to insight' },
  { value: '30+', label: 'Metrics tracked' },
  { value: 'Pay', label: 'As you use' },
]

export default function LandingPage({ onSessionStart, onOpenDetail }) {
  const [tab, setTab] = useState('audio')
  const [dragging, setDragging] = useState({ audio: false, transcript: false })
  const [files, setFiles] = useState({ audio: null, transcript: null })
  const [pasteText, setPasteText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const audioRef = useRef(null)
  const transcriptRef = useRef(null)

  const handleDrag = useCallback((e, type, entering) => {
    e.preventDefault()
    setDragging(d => ({ ...d, [type]: entering }))
  }, [])

  const handleDrop = useCallback((e, type) => {
    e.preventDefault()
    setDragging(d => ({ ...d, [type]: false }))
    const f = e.dataTransfer.files[0]
    if (f) setFiles(fs => ({ ...fs, [type]: f }))
  }, [])

  const handleFile = (e, type) => {
    if (e.target.files[0]) setFiles(fs => ({ ...fs, [type]: e.target.files[0] }))
  }

  const clearFile = (type) => {
    setFiles(fs => ({ ...fs, [type]: null }))
    if (type === 'audio' && audioRef.current) audioRef.current.value = ''
    if (type === 'transcript' && transcriptRef.current) transcriptRef.current.value = ''
  }

  const canSubmit = (tab === 'audio' && files.audio) ||
    (tab === 'transcript' && files.transcript) ||
    (tab === 'paste' && pasteText.trim().length >= 50)

  const handleSubmit = async () => {
    setError(null)
    setLoading(true)
    try {
      let result
      if (tab === 'audio') result = await api.uploadFile(files.audio)
      else if (tab === 'transcript') result = await api.uploadFile(files.transcript)
      else result = await api.pasteText(pasteText.trim())
      onSessionStart(result.session_id)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const FileZone = ({ type, accept, formats, icon }) => {
    const file = files[type]
    const isDragging = dragging[type]
    const ref = type === 'audio' ? audioRef : transcriptRef
    return (
      <div
        className={`${styles.dz} ${isDragging ? styles.dzOver : ''} ${file ? styles.dzHasFile : ''}`}
        onDragEnter={e => handleDrag(e, type, true)}
        onDragOver={e => handleDrag(e, type, true)}
        onDragLeave={e => handleDrag(e, type, false)}
        onDrop={e => handleDrop(e, type)}
        onClick={() => !file && ref.current?.click()}
      >
        <input ref={ref} type="file" accept={accept} onChange={e => handleFile(e, type)} style={{ display: 'none' }} />
        {file ? (
          <div className={styles.filePrev}>
            <div className={styles.fileIco}>{icon}</div>
            <div className={styles.fileInfo}>
              <span className={styles.fileName}>{file.name}</span>
              <span className={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</span>
            </div>
            <button className={styles.fileRemove} onClick={e => { e.stopPropagation(); clearFile(type) }}>×</button>
          </div>
        ) : (
          <div className={styles.dzContent}>
            <div className={styles.dzIco}>{icon}</div>
            <div className={styles.dzTitle}>{type === 'audio' ? 'Drop your call recording here' : 'Drop your transcript file here'}</div>
            <div className={styles.dzFormats}>{formats}</div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <div className={styles.orb1} /><div className={styles.orb2} />
      <nav className={styles.nav}>
        <div className={styles.logo}><span className={styles.logoBadge}>CX</span><span className={styles.logoTxt}>Intelligence</span></div>
      </nav>
      <main className={styles.main}>
        <h1 className={styles.heroTitle}>Turn every call into</h1>
        <span className={styles.heroTitleLine2}>measurable growth</span>
        <p className={styles.heroSub}>Upload a customer call or transcript and get a full agent performance analysis — scores, compliance, coaching, and business impact — in under 30 seconds.</p>

        <div className={styles.stats}>
          {STATS.map(s => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statVal}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.ucard}>
          <div className={styles.ucardTitle}>Analyse an interaction</div>
          <div className={styles.ucardSub}>Upload a call recording, transcript file, or paste raw text — our AI handles the rest.</div>

          <div className={styles.tabs}>
            {[
              { id: 'audio', label: 'Call audio', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg> },
              { id: 'transcript', label: 'Transcript file', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
              { id: 'paste', label: 'Paste text', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg> },
            ].map(t => (
              <button key={t.id} className={`${styles.tab} ${tab === t.id ? styles.tabOn : ''}`} onClick={() => setTab(t.id)}>
                <span className={styles.tabIco}>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>

          {tab === 'audio' && (
            <FileZone type="audio" accept=".mp3,.wav,.m4a,.ogg,.webm,.opus,.aac"
              formats=".mp3 · .wav · .m4a · .ogg · .webm · .opus"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>}
            />
          )}
          {tab === 'transcript' && (
            <FileZone type="transcript" accept=".txt,.md,.vtt,.srt,.json,.csv,.pdf,.docx"
              formats=".txt · .vtt · .srt · .json · .csv · .pdf · .docx"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>}
            />
          )}
          {tab === 'paste' && (
            <div className={styles.pasteWrap}>
              <textarea className={styles.pasteArea} rows={7}
                placeholder={"Paste your call transcript, chat export, or interaction text here...\n\nAgent: Thank you for calling...\nCustomer: Hi, I need help with..."}
                value={pasteText} onChange={e => setPasteText(e.target.value)}
              />
              <div className={styles.pasteFooter}>
                <span className={styles.pasteCount}>{pasteText.length.toLocaleString()} chars</span>
                <button className={styles.sampleBtn} onClick={() => setPasteText(SAMPLE)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Load sample call
                </button>
              </div>
            </div>
          )}

          {error && <div className={styles.errBox}>⚠ {error}</div>}

          <button className={`${styles.analyseBtn} ${(!canSubmit || loading) ? styles.analyseBtnDisabled : ''}`}
            onClick={handleSubmit} disabled={!canSubmit || loading}>
            {loading ? <><span className={styles.btnSpinner} />Starting analysis...</> : (
              <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>Analyse interaction<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg></>
            )}
          </button>
          <div className={styles.ucardNote}>Your data is processed securely and not stored beyond the session</div>
        </div>

        <div className={styles.hiw}>
          <div className={styles.hiwTitle}>How it works</div>
          <div className={styles.hiwRow}>
            {[
              { label: 'Upload', sub: 'Call audio or transcript file', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> },
              { label: 'Transcribe', sub: 'Speech converted to text automatically', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg> },
              { label: 'Analyse', sub: 'AI scores every performance dimension', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg> },
              { label: 'Dashboard', sub: 'Full metrics + coaching plan', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
            ].map((s, i, arr) => (
              <div key={s.label} className={styles.hiwStep}>
                <div className={styles.hiwIco}>{s.icon}</div>
                <div className={styles.hiwLabel}>{s.label}</div>
                <div className={styles.hiwSub}>{s.sub}</div>
                {i < arr.length - 1 && <div className={styles.hiwArrow}>→</div>}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.featureGrid}>
          {FEATURES.map(f => (
            <div key={f.key} className={styles.fcard} onClick={() => onOpenDetail(f.key)}>
              <div className={styles.fcardHead}>
                <div className={styles.fcardIco} style={{ background: f.bg, color: f.color }}>{f.icon}</div>
                <div className={styles.fcardArrow}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg></div>
              </div>
              <div className={styles.fcardLabel}>{f.label}</div>
              <div className={styles.fcardDesc}>{f.desc}</div>
              <div className={styles.fcardBadge} style={{ background: f.bg, color: f.color }}>Learn more →</div>
            </div>
          ))}
        </div>
      </main>
      <footer className={styles.footer}>© 2025 CX Intelligence. All rights reserved.</footer>
    </div>
  )
}
