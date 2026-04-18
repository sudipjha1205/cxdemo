import { useState } from 'react'
import styles from './AgentDashboard.module.css'

const IMP = { high: '#ff5f6d', medium: '#ffb740', low: '#4d9fff' }
const PRI = { high: '#ff5f6d', medium: '#ffb740', low: '#00e5a0' }
const SENT = {
  positive: { c: '#00e5a0', bg: 'rgba(0,229,160,.12)', l: 'Positive' },
  neutral: { c: '#8896a8', bg: 'rgba(136,150,168,.12)', l: 'Neutral' },
  frustrated: { c: '#ff5f6d', bg: 'rgba(255,95,109,.12)', l: 'Frustrated' },
  satisfied: { c: '#00e5a0', bg: 'rgba(0,229,160,.12)', l: 'Satisfied' },
  dissatisfied: { c: '#ff5f6d', bg: 'rgba(255,95,109,.12)', l: 'Dissatisfied' },
}

function SBadge({ val }) {
  const s = SENT[val] || SENT.neutral
  return <span className={styles.sbadge} style={{ color: s.c, background: s.bg }}>{s.l}</span>
}

function ScoreRing({ score }) {
  const color = score >= 80 ? '#00e5a0' : score >= 60 ? '#ffb740' : '#ff5f6d'
  const r = 38, c = 2 * Math.PI * r
  const offset = c - (score / 100) * c
  return (
    <div className={styles.ringWrap}>
      <svg viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
        <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7"/>
        <circle cx="45" cy="45" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeLinecap="round" strokeDasharray={c.toFixed(1)} strokeDashoffset={offset.toFixed(1)}
          transform="rotate(-90 45 45)" style={{ filter: `drop-shadow(0 0 5px ${color}88)` }}/>
      </svg>
      <div className={styles.ringInner}>
        <span className={styles.ringVal} style={{ color }}>{score}</span>
        <span className={styles.ringLbl}>/100</span>
      </div>
    </div>
  )
}

function MBar({ label, value, color }) {
  return (
    <div className={styles.mbar}>
      <div className={styles.mbarHdr}><span className={styles.mbarLbl}>{label}</span><span className={styles.mbarVal} style={{ color }}>{value}</span></div>
      <div className={styles.mbarTrack}><div className={styles.mbarFill} data-w={value} style={{ width: 0, background: color }} /></div>
    </div>
  )
}

function Radar({ mt }) {
  const pts = [
    { l: 'Empathy', v: mt.empathy_score || 0 }, { l: 'Clarity', v: mt.clarity_score || 0 },
    { l: 'Resolution', v: mt.resolution_score || 0 }, { l: 'Professional', v: mt.professionalism_score || 0 },
    { l: 'Quality', v: mt.response_quality_score || 0 }, { l: 'CES', v: mt.customer_effort_score || 0 },
    { l: 'Listening', v: mt.active_listening_score || 0 }, { l: 'Solving', v: mt.problem_solving_score || 0 },
  ]
  const n = pts.length, cx = 95, cy = 95, r = 65
  const ang = i => (i / n) * Math.PI * 2 - Math.PI / 2
  const px = (i, rad) => (cx + Math.cos(ang(i)) * rad).toFixed(1)
  const py = (i, rad) => (cy + Math.sin(ang(i)) * rad).toFixed(1)
  const grid = [0.25, 0.5, 0.75, 1].map(f =>
    `<polygon points="${Array.from({ length: n }, (_, i) => `${px(i, r * f)},${py(i, r * f)}`).join(' ')}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width=".5"/>`
  ).join('')
  const axes = Array.from({ length: n }, (_, i) =>
    `<line x1="${cx}" y1="${cy}" x2="${px(i, r)}" y2="${py(i, r)}" stroke="rgba(255,255,255,0.06)" stroke-width=".5"/>`
  ).join('')
  const dp = pts.map((p, i) => `${px(i, r * (p.v / 100))},${py(i, r * (p.v / 100))}`).join(' ')
  const lbls = pts.map((p, i) => {
    const lx = parseFloat(px(i, r + 17)), ly = parseFloat(py(i, r + 17))
    const a = lx < cx - 5 ? 'end' : lx > cx + 5 ? 'start' : 'middle'
    return `<text x="${lx.toFixed(1)}" y="${(ly + 3).toFixed(1)}" text-anchor="${a}" font-size="8.5" fill="#4d5d6e" font-family="DM Mono,monospace">${p.l}</text>`
  }).join('')
  const dots = pts.map((p, i) => `<circle cx="${px(i, r * (p.v / 100))}" cy="${py(i, r * (p.v / 100))}" r="2.5" fill="#00e5a0"/>`).join('')
  return <svg width="190" height="190" viewBox="0 0 190 190" dangerouslySetInnerHTML={{ __html: grid + axes + `<polygon points="${dp}" fill="rgba(0,229,160,0.12)" stroke="#00e5a0" stroke-width="1.5"/>` + dots + lbls }} />
}

function XCard({ title, color, hex, icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={styles.xcard}>
      <button className={styles.xcardHead} onClick={() => setOpen(!open)}>
        <div className={styles.xcardTitle}>
          <div className={styles.xiBox} style={{ background: `${hex}18`, color }}>{icon}</div>
          {title}
        </div>
        <div className={`${styles.xchev} ${open ? styles.xchevOpen : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
        </div>
      </button>
      {open && <div className={styles.xcardBody}>{children}</div>}
    </div>
  )
}

function BizTag({ text }) {
  return (
    <div className={styles.bizTag}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      {text}
    </div>
  )
}

export default function AgentDashboard({ data, onReset }) {
  const a = data.analysis
  const m = a.metadata || {}, mt = a.metrics || {}, cp = a.compliance || {}, sa = a.sentiment_arc || {}, bi = a.business_impact || {}
  const sc = a.overall_score || 0
  const scC = sc >= 80 ? '#00e5a0' : sc >= 60 ? '#ffb740' : '#ff5f6d'
  const scTier = sc >= 80 ? 'Excellent' : sc >= 65 ? 'Good' : sc >= 50 ? 'Needs work' : 'Critical'
  const chC = { low: '#00e5a0', medium: '#ffb740', high: '#ff5f6d' }[a.churn_risk] || '#ffb740'

  // Animate bars after mount
  const animRef = node => {
    if (node) {
      setTimeout(() => node.querySelectorAll('[data-w]').forEach(el => { el.style.transition = 'width 1.2s cubic-bezier(.34,1.56,.64,1)'; el.style.width = el.dataset.w + '%' }), 100)
    }
  }

  return (
    <div className={styles.root} ref={animRef}>
      {/* Header */}
      <div className={styles.hdr}>
        <div>
          <div className={styles.hdrPill}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
            {m.interaction_type === 'voice_call' ? 'Voice call' : 'Interaction'} · Agent performance analysis
          </div>
          <div className={styles.hdrTitle}>Performance Dashboard</div>
          <div className={styles.hdrSub}>{a.executive_summary}</div>
        </div>
        <div className={styles.hdrMeta}>
          {m.agent_name && <div className={styles.metaChip}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>Agent: {m.agent_name}</div>}
          {m.estimated_duration_minutes && <div className={styles.metaChip}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>~{m.estimated_duration_minutes} min</div>}
          {m.call_category && <div className={styles.metaTag} style={{ textTransform: 'capitalize' }}>{m.call_category} · {m.topic || ''}</div>}
        </div>
      </div>

      {/* Impact bar */}
      <div className={styles.impactBar}>
        {[
          { val: sc, label: 'Performance score', sub: scTier, color: scC },
          { val: a.csat_predicted || '—', label: 'Predicted CSAT', sub: 'out of 100', color: '#4d9fff' },
          { val: (a.churn_risk || 'medium').toUpperCase(), label: 'Churn risk', sub: 'post-interaction', color: chC },
          { val: a.first_call_resolution ? 'YES' : 'NO', label: 'First call resolution', sub: 'FCR status', color: a.first_call_resolution ? '#00e5a0' : '#ff5f6d' },
        ].map(item => (
          <div key={item.label} className={styles.impItem}>
            <div className={styles.impVal} style={{ color: item.color }}>{item.val}</div>
            <div className={styles.impLabel}>{item.label}</div>
            <div className={styles.impSub} style={{ color: item.color === '#4d9fff' || item.color === chC ? 'var(--t3)' : item.color }}>{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Row 1: score + sentiment + compliance */}
      <div className={styles.r3}>
        <div className={styles.card}>
          <div className={styles.cardLbl}>Overall score</div>
          <div className={styles.scoreWrap}>
            <ScoreRing score={sc} />
            <div className={styles.scoreTier} style={{ color: scC }}>{scTier}</div>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLbl}>Sentiment arc</div>
          <div className={styles.sentFlow}>
            {['opening', 'middle', 'closing'].map((ph, i) => (
              <div key={ph}>
                <div className={styles.sentPhase}>
                  <div className={styles.sentPhLbl}>{ph}</div>
                  <SBadge val={sa[ph]} />
                </div>
                {i < 2 && <div className={styles.sentArrow}>→</div>}
              </div>
            ))}
          </div>
          <div className={styles.sentFinal}><span className={styles.sentFinLbl}>Customer left</span><SBadge val={sa.customer_sentiment_final} /></div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLbl}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>Compliance — {cp.score || 0}/100</div>
          <div className={styles.compList}>
            {[['Proper greeting', cp.greeting_proper], ['Identity verified', cp.verified_identity], ['Resolution offered', cp.offered_resolution], ['Hold time managed', cp.hold_time_managed], ['Proper closing', cp.proper_closing], ['Escalation offered', cp.escalation_offered]].map(([l, v]) => (
              <div key={l} className={styles.compItem}>
                <div className={styles.compDot} style={{ background: v ? '#00e5a0' : '#ff5f6d' }} />
                <span className={styles.compItemL}>{l}</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: v ? '#00e5a0' : '#ff5f6d' }}>{v ? '✓' : '✗'}</span>
              </div>
            ))}
          </div>
          {cp.flags?.length > 0 && <div className={styles.compFlags}>{cp.flags.map((f, i) => <div key={i} className={styles.compFlag}>⚑ {f}</div>)}</div>}
        </div>
      </div>

      {/* Row 2: radar + bars */}
      <div className={styles.r2}>
        <div className={styles.card}>
          <div className={styles.cardLbl}>Performance radar — 8 dimensions</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 0' }}><Radar mt={mt} /></div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLbl}>Score breakdown</div>
          <div className={styles.mbars}>
            <MBar label="Empathy & tone" value={mt.empathy_score || 0} color="#a78bfa" />
            <MBar label="Clarity" value={mt.clarity_score || 0} color="#4d9fff" />
            <MBar label="Issue resolution" value={mt.resolution_score || 0} color="#00e5a0" />
            <MBar label="Professionalism" value={mt.professionalism_score || 0} color="#00e5a0" />
            <MBar label="Response quality" value={mt.response_quality_score || 0} color="#ffb740" />
            <MBar label="Customer effort" value={mt.customer_effort_score || 0} color="#ff5f6d" />
            <MBar label="Active listening" value={mt.active_listening_score || 0} color="#2dd4bf" />
            <MBar label="Problem solving" value={mt.problem_solving_score || 0} color="#f472b6" />
          </div>
        </div>
      </div>

      {/* Without vs With */}
      <div className={styles.solveBar}>
        <div className={styles.solveColin}>
          <div className={styles.solveTitle} style={{ color: 'var(--red)' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>Without CX Intelligence</div>
          {['Only 3–5% of calls manually reviewed', 'Compliance gaps found only after complaints', 'Generic coaching, not call-specific', 'No visibility into behaviours that drive churn'].map((t, i) => (
            <div key={i} className={styles.solveItem}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/></svg>{t}
            </div>
          ))}
        </div>
        <div className={`${styles.solveColin} ${styles.solveColinAcc}`}>
          <div className={styles.solveTitle} style={{ color: 'var(--brand)' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>With CX Intelligence</div>
          {['100% of calls analysed in <30 seconds', 'Real-time compliance flags before the next shift', 'Call-specific coaching plan per agent, automatically', 'Churn risk predicted per call before customers leave'].map((t, i) => (
            <div key={i} className={styles.solveItem}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>{t}
            </div>
          ))}
        </div>
      </div>

      {/* Business impact */}
      <div className={styles.bizCard}>
        <div className={styles.bizTitle}>Business impact — this interaction</div>
        <div className={styles.bizSub}>What this call analysis means for your bottom line, customer retention, and team performance</div>
        <div className={styles.bizGrid}>
          {[
            { ico: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, color: '#00e5a0', label: 'Customer retention', text: bi.churn_reduction || 'Churn risk reduced through proactive resolution', val: 'Retained' },
            { ico: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, color: '#4d9fff', label: 'Revenue retained', text: bi.revenue_retention || 'Customer lifetime value preserved', val: '+LTV' },
            { ico: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, color: '#a78bfa', label: 'Coaching ROI', text: bi.coaching_roi || 'Targeted coaching converts to measurable gains', val: '3× faster' },
          ].map(item => (
            <div key={item.label} className={styles.bizItem}>
              <div className={styles.bizIco} style={{ background: `rgba(${item.color === '#00e5a0' ? '0,229,160' : item.color === '#4d9fff' ? '77,159,255' : '167,139,250'},.12)`, color: item.color }}>{item.ico}</div>
              <div className={styles.bizItemL}>{item.label}</div>
              <div className={styles.bizItemS}>{item.text}</div>
              <div className={styles.bizItemV} style={{ color: item.color }}>{item.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick mini cards */}
      <div className={styles.r4}>
        {[['Empathy', '#a78bfa', mt.empathy_score || 0, 'Customer felt heard'], ['Resolution', '#00e5a0', (mt.resolution_score || 0) + '%', 'Issue solved in call'], ['Customer effort', '#ff5f6d', mt.customer_effort_score || 0, 'Lower = less friction'], ['Problem solving', '#f472b6', mt.problem_solving_score || 0, 'Solution creativity']].map(([l, c, v, s]) => (
          <div key={l} className={styles.mcard}><div className={styles.mcardL}>{l}</div><div className={styles.mcardV} style={{ color: c }}>{v}</div><div className={styles.mcardS}>{s}</div></div>
        ))}
      </div>

      {/* Expandable sections */}
      <XCard title={`Strengths (${(a.strengths || []).length})`} color="#00e5a0" hex="#00e5a0"
        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}>
        <div className={styles.swList}>
          {(a.strengths || []).map((s, i) => (
            <div key={i} className={styles.swItem}>
              <div className={styles.swItemHdr}><span className={styles.swItemTitle}>{s.title}</span><span className={styles.impBadge} style={{ color: IMP[s.impact], background: IMP[s.impact] + '18' }}>{s.impact} impact</span></div>
              <p className={styles.swItemDesc}>{s.description}</p>
              {s.quote && <blockquote className={styles.swQuote}>"{s.quote}"</blockquote>}
              {s.business_impact && <BizTag text={s.business_impact} />}
            </div>
          ))}
        </div>
      </XCard>

      <XCard title={`Weaknesses (${(a.weaknesses || []).length}) — areas to improve`} color="#ff5f6d" hex="#ff5f6d"
        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/></svg>}>
        <div className={styles.swList}>
          {(a.weaknesses || []).map((w, i) => (
            <div key={i} className={styles.swItem}>
              <div className={styles.swItemHdr}><span className={styles.swItemTitle}>{w.title}</span><span className={styles.impBadge} style={{ color: IMP[w.impact], background: IMP[w.impact] + '18' }}>{w.impact} impact</span></div>
              <p className={styles.swItemDesc}>{w.description}</p>
              {w.quote && <blockquote className={styles.swQuote}>"{w.quote}"</blockquote>}
              {w.business_impact && <BizTag text={w.business_impact} />}
            </div>
          ))}
        </div>
      </XCard>

      <XCard title={`Key moments (${(a.key_moments || []).length})`} color="#4d9fff" hex="#4d9fff"
        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}>
        <div className={styles.momList}>
          {(a.key_moments || []).map((km, i) => {
            const mc = { positive: '#00e5a0', negative: '#ff5f6d', critical: '#ffb740', neutral: '#8896a8' }[km.type] || '#8896a8'
            return (
              <div key={i} className={styles.momItem}>
                <div className={styles.momDot} style={{ background: mc }} />
                <div className={styles.momContent}>
                  <div className={styles.momMeta}><span className={styles.momType} style={{ color: mc }}>{km.type}</span><span className={styles.momTime}>{km.timestamp_hint}</span></div>
                  <p className={styles.momText}>{km.moment}</p>
                  {km.business_significance && <BizTag text={km.business_significance} />}
                </div>
              </div>
            )
          })}
        </div>
      </XCard>

      <XCard title={`Coaching plan — ${(a.coaching_recommendations || []).length} recommendations`} color="#a78bfa" hex="#a78bfa"
        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>}>
        <div className={styles.coachList}>
          {(a.coaching_recommendations || []).map((cr, i) => (
            <div key={i} className={styles.coachItem}>
              <div className={styles.coachHdr}><span className={styles.coachArea}>{cr.area}</span><span className={styles.coachPri} style={{ color: PRI[cr.priority], background: PRI[cr.priority] + '18' }}>{cr.priority} priority</span></div>
              <p className={styles.coachRec}>{cr.recommendation}</p>
              {cr.training_module && <div className={styles.coachMod}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>Training: {cr.training_module}</div>}
              {cr.expected_improvement && <div className={styles.coachBiz}>Improvement: {cr.expected_improvement}</div>}
              {cr.business_outcome && <BizTag text={cr.business_outcome} />}
            </div>
          ))}
        </div>
      </XCard>

      {/* CTA footer */}
      <div className={styles.ctaFooter}>
        <div className={styles.ctaTitle}>Analyse your entire team, every day</div>
        <div className={styles.ctaSub}>CX Intelligence processes 100% of your calls automatically — surfacing compliance gaps, predicting churn, and generating agent-specific coaching plans. Pay only for what you use, with no minimum commitment.</div>
        <div className={styles.ctaBtns}>
          <button className={styles.ctaBtn1} onClick={() => alert('Contact us at hello@cxintelligence.ai')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            Get started
          </button>
          <button className={styles.ctaBtn2} onClick={onReset}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/></svg>
            Analyse another call
          </button>
        </div>
      </div>
    </div>
  )
}
