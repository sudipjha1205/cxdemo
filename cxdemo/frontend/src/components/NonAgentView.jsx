import styles from './NonAgentView.module.css'

const TYPE_LABELS = { meeting_recording: 'Meeting recording', personal_conversation: 'Personal conversation', monologue: 'Monologue', interview: 'Interview', podcast: 'Podcast', lecture: 'Lecture', document: 'Document', other: 'General content' }
const HL_COLORS = { insight: '#4d9fff', decision: '#00e5a0', action_item: '#ffb740', question: '#a78bfa', concern: '#ff5f6d' }

export default function NonAgentView({ data, onReset }) {
  const a = data.analysis
  return (
    <div className={styles.root}>
      <div className={styles.banner}>
        <div className={styles.bannerIco}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <div>
          <div className={styles.bannerTitle}>Not a customer service interaction</div>
          <div className={styles.bannerSub}>This content doesn't appear to be a customer support call or chat. Here's a summary of what we found.</div>
        </div>
        <div className={styles.bannerBadge}>{TYPE_LABELS[a.content_type] || 'General content'}</div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardLbl}>Summary</div>
          <p className={styles.summaryText}>{a.summary || a.executive_summary || ''}</p>
          <div className={styles.chips}>
            {a.detected_speakers > 0 && <span className={styles.chip}>{a.detected_speakers} speakers</span>}
            {a.language && <span className={styles.chip}>{a.language}</span>}
            {a.sentiment_overall && <span className={styles.chip}>Sentiment: {a.sentiment_overall}</span>}
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLbl}>Key points</div>
          <ul className={styles.kpList}>
            {(a.key_points || []).map((p, i) => (
              <li key={i} className={styles.kpItem}>
                <span className={styles.kpNum}>{i + 1}</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {(a.content_highlights || []).length > 0 && (
        <div className={`${styles.card} ${styles.fullCard}`}>
          <div className={styles.cardLbl}>Highlights</div>
          <div className={styles.hlGrid}>
            {(a.content_highlights || []).map((h, i) => {
              const c = HL_COLORS[h.type] || '#8896a8'
              return (
                <div key={i} className={styles.hlItem}>
                  <span className={styles.hlType} style={{ color: c, background: c + '18' }}>{(h.type || '').replace('_', ' ')}</span>
                  <p className={styles.hlText}>{h.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className={styles.cta}>
        <div className={styles.ctaTitle}>Want to analyse a customer support interaction?</div>
        <p className={styles.ctaSub}>Upload a call transcript, chat log, or customer service email exchange to get agent performance metrics, compliance scores, and coaching recommendations.</p>
        <button className={styles.ctaBtn} onClick={onReset}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Try another file
        </button>
      </div>
    </div>
  )
}
