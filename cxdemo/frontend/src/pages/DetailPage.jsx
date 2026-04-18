import styles from './DetailPage.module.css'

const DETAILS = {
  quality: {
    color: '#00e5a0', bg: 'rgba(0,229,160,0.1)', bdrColor: 'rgba(0,229,160,0.2)', label: 'Quality Scoring',
    title: 'Real-time quality scoring',
    sub: 'Every customer interaction scored across 30+ performance dimensions in under 30 seconds — without a single human reviewer.',
    prob: {
      title: 'The problem: quality is invisible without measurement',
      sub: 'Most support teams audit fewer than 5% of calls — leaving 95% of agent interactions completely invisible to management.',
      stats: [{ v: '95%', l: 'Calls never reviewed' }, { v: '68%', l: 'Issues found only after complaints' }, { v: '4.2×', l: 'Cost of reactive vs proactive QA' }],
      items: ['Manual QA sampling means team leads listen to 3–5 calls per agent per week — missing chronic behaviour patterns entirely', 'Agents receive feedback 1–2 weeks after the call, making real-time correction nearly impossible', 'Inconsistent scoring by different reviewers creates bias and unfair performance evaluations', 'Without objective metrics, high-performers and low-performers are indistinguishable on paper', 'Failed SOP adherence goes undetected until it causes a churn event or complaint escalation'],
    },
    sol: {
      title: 'How real-time scoring changes everything',
      sub: 'Analyse 100% of interactions automatically. Every agent, every call, every day — with consistent, objective scoring.',
      stats: [{ v: '100%', l: 'Call coverage' }, { v: '97%', l: 'Scoring accuracy' }, { v: '28×', l: 'More calls reviewed' }],
      items: ['Every call scored on 8 core dimensions: empathy, clarity, resolution, professionalism, response quality, customer effort, active listening, problem-solving', '30+ derived metrics including talk-time ratio, silence patterns, escalation triggers, and sentiment trajectory', 'Trend tracking across weeks and months — see if agents improve after coaching sessions', 'Anomaly detection flags calls that need urgent attention before they become complaints', 'Team-level benchmarks let managers compare across agents fairly and objectively'],
    },
    howsteps: [
      { n: 1, l: 'Upload any interaction format', s: 'MP3, WAV, M4A, OGG for audio — or TXT, VTT, SRT, CSV, JSON, DOCX, PDF for transcripts.' },
      { n: 2, l: 'Automatic content extraction', s: 'Audio is transcribed to text. All formats are normalised into a clean interaction structure.' },
      { n: 3, l: 'AI scores each dimension', s: 'Each of the 30+ metrics is computed from the transcript using specialised analysis. Scores are calibrated against industry benchmarks.' },
      { n: 4, l: 'Dashboard delivered in under 30 seconds', s: 'Performance scores, charts, and prioritised insights appear instantly.' },
    ],
    metrics: [
      { l: 'Empathy score', s: 'Acknowledgment, validation, and emotional attunement' },
      { l: 'Clarity score', s: 'How clearly information was communicated without jargon' },
      { l: 'Resolution score', s: 'Whether the customer\'s core issue was fully resolved' },
      { l: 'Professionalism', s: 'Tone, language, and policy adherence throughout the call' },
      { l: 'Response quality', s: 'Accuracy, completeness, and relevance of answers given' },
      { l: 'Customer effort score', s: 'How hard the customer had to work to get their issue resolved' },
      { l: 'Active listening', s: 'Follow-up questions, paraphrasing, and confirmation behaviours' },
      { l: 'Problem solving', s: 'Creativity and effectiveness of solutions offered' },
      { l: 'Sentiment trajectory', s: 'How customer mood shifted from opening to close' },
      { l: 'Talk-time ratio', s: 'Agent vs customer speaking time balance' },
      { l: 'Hold time management', s: 'Frequency and handling of holds throughout the call' },
      { l: 'Escalation signals', s: 'Triggers indicating an unresolved or escalating situation' },
    ],
  },
  compliance: {
    color: '#4d9fff', bg: 'rgba(77,159,255,0.1)', bdrColor: 'rgba(77,159,255,0.2)', label: 'Compliance Audit',
    title: 'Automated compliance audit',
    sub: 'Check every agent against your SOP in real-time — greeting, identity verification, escalation protocol, and closing — across every single call.',
    prob: {
      title: 'The problem: compliance gaps are invisible and expensive',
      sub: 'Undetected compliance failures cause legal exposure, regulatory fines, and customer churn — and most businesses don\'t discover them until the damage is done.',
      stats: [{ v: '72%', l: 'Compliance gaps missed in manual QA' }, { v: '₹2.5Cr', l: 'Avg cost of a DPDP/TRAI violation' }, { v: '41%', l: 'Churn linked to poor agent process' }],
      items: ['Identity verification is skipped in an estimated 34% of calls — exposing companies to DPDP Act 2023 liability', 'Escalation paths are not offered to repeat-contact customers in 58% of cases, accelerating churn', 'Greeting and closing scripts deviate from SOP silently — with no system to catch it', 'Manual compliance audits are inconsistent — different reviewers score the same behaviour differently', 'Compliance training delivered as PDFs is forgotten within 2 weeks without reinforcement from real call feedback'],
    },
    sol: {
      title: 'Real-time compliance checking on every interaction',
      sub: 'AI checks every call against your compliance checklist automatically — with evidence and quotes from the actual transcript.',
      stats: [{ v: '100%', l: 'Call compliance coverage' }, { v: '6+', l: 'Compliance checkpoints' }, { v: 'Zero', l: 'Manual reviewer hours' }],
      items: ['6 core compliance checkpoints: proper greeting, identity verification, resolution offered, hold time managed, escalation offered, proper closing', 'Each checkpoint backed by a direct quote from the transcript — no ambiguity', 'Compliance score (0–100) per call, per agent, and per team across any time period', 'Automatic flagging of high-risk calls for manager review before the next shift', 'Compliance trend tracking catches systemic training gaps before they become systemic failures'],
    },
    howsteps: [
      { n: 1, l: 'Define your compliance checklist', s: 'Configure your SOP checkpoints in the dashboard. Defaults include the 6 universal CX compliance items.' },
      { n: 2, l: 'AI reads every call against your SOP', s: 'Each checkpoint is verified by searching the transcript for specific language patterns, actions, and sequences.' },
      { n: 3, l: 'Evidence extracted and cited', s: 'For each pass/fail, the AI extracts the exact quote or absence of quote that determined the verdict.' },
      { n: 4, l: 'Flags delivered before the next shift', s: 'High-risk compliance failures are surfaced to managers immediately — not in a weekly report.' },
    ],
    metrics: [
      { l: 'Greeting compliance', s: 'Opening statement matches your defined SOP greeting protocol' },
      { l: 'Identity verification', s: 'Agent confirmed account holder identity before accessing data' },
      { l: 'Resolution offered', s: 'A concrete resolution or next step was provided to the customer' },
      { l: 'Hold time managed', s: 'Holds were explained, timed, and customer returned to appropriately' },
      { l: 'Escalation offered', s: 'Repeat-contact or unresolved customers were offered an escalation path' },
      { l: 'Proper closing', s: 'Call ended per SOP — confirmation of resolution and sign-off language' },
      { l: 'DPDP Act readiness', s: 'Data access preceded by proper identity confirmation per Act requirements' },
      { l: 'Sensitive data handling', s: 'No PII disclosed without verification; no inappropriate data requests' },
      { l: 'Compliance score trend', s: 'Agent\'s rolling compliance score over the past 30 days' },
      { l: 'Flag severity rating', s: 'High / medium / low risk classification per compliance failure' },
      { l: 'SOP deviation pattern', s: 'Which specific script steps are most frequently skipped' },
      { l: 'Coaching trigger detection', s: 'Compliance failures that should trigger immediate retraining' },
    ],
  },
  coaching: {
    color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', bdrColor: 'rgba(167,139,250,0.2)', label: 'AI Coaching',
    title: 'AI coaching recommendations',
    sub: 'Every call generates a specific, evidence-backed coaching plan for that agent — tied to actual moments in the interaction, not generic advice.',
    prob: {
      title: 'The problem: coaching is generic, delayed, and doesn\'t stick',
      sub: 'Most support teams spend enormous time on coaching that doesn\'t change agent behaviour because it\'s disconnected from real call moments.',
      stats: [{ v: '3–4wk', l: 'Avg delay from call to coaching' }, { v: '₹18K', l: 'Cost per new agent onboarding' }, { v: '62%', l: 'Coaching not linked to specific calls' }],
      items: ['Agents receive feedback weeks after the call — disconnected from the actual behaviour in the moment', 'Team leads spend 5+ hours per week writing coaching notes manually from sample call reviews', 'Generic training modules (PDFs, videos) don\'t address the specific patterns each agent exhibits', 'New agent ramp time averages 6–8 weeks because training is not personalised to individual gaps', 'High-performing agents receive the same generic training as struggling agents — wasting everyone\'s time'],
    },
    sol: {
      title: 'Call-specific coaching for every agent, automatically',
      sub: 'Each call generates an agent-specific coaching plan — with the exact moment, expected improvement, and business outcome of fixing it.',
      stats: [{ v: '3×', l: 'Faster agent improvement' }, { v: '40%', l: 'Reduction in new hire ramp time' }, { v: 'Zero', l: 'Coaching prep time for managers' }],
      items: ['Each coaching item is tied to a specific moment in the call with a direct quote — the agent knows exactly what to change', 'Priority ranking (high/medium/low) tells managers which issue to address first for maximum impact', 'Expected metric improvement quantified per coaching item — e.g. "Compliance score: 78 → 95 in 2 weeks"', 'Business outcome stated per recommendation — measurable result of applying the coaching', 'Training module suggestion per item — links directly to relevant retraining content'],
    },
    howsteps: [
      { n: 1, l: 'AI identifies behavioural gaps', s: 'During analysis, the AI isolates the specific moments where the agent\'s behaviour diverged from best practice.' },
      { n: 2, l: 'Root cause is determined', s: 'For each gap, the AI determines whether it\'s a knowledge gap, skill gap, or habit gap — each requiring a different coaching approach.' },
      { n: 3, l: 'Coaching plan is written', s: 'A prioritised, actionable plan is written for this specific agent based on this specific call — not a template.' },
      { n: 4, l: 'Impact is quantified', s: 'Each coaching item includes the metric it will improve, by how much, and the business outcome — so managers can prioritise by ROI.' },
    ],
    metrics: [
      { l: 'Coaching priority score', s: 'High/medium/low ranking by business impact' },
      { l: 'Skill area identification', s: 'Empathy, clarity, compliance, problem-solving, or listening' },
      { l: 'Direct quote evidence', s: 'The exact moment in the call that triggered the recommendation' },
      { l: 'Expected metric improvement', s: 'Quantified improvement to a specific score' },
      { l: 'Training module mapping', s: 'Recommended training content matched to the skill gap' },
      { l: 'Business outcome statement', s: 'The measurable business result if coaching is applied' },
      { l: 'Coaching trend tracking', s: 'Whether previous recommendations have been actioned' },
      { l: 'Agent improvement velocity', s: 'How quickly scores improve after coaching sessions' },
      { l: 'Team coaching coverage', s: 'Which agents have active plans vs which have been neglected' },
      { l: 'Ramp time tracking', s: 'New agent time-to-proficiency vs team benchmark' },
      { l: 'Repeat issue detection', s: 'Flags if an agent fails on the same dimension across multiple calls' },
      { l: 'ROI per coaching session', s: 'Estimated revenue or CSAT impact of each intervention' },
    ],
  },
  bizimpact: {
    color: '#ffb740', bg: 'rgba(255,183,64,0.1)', bdrColor: 'rgba(255,183,64,0.2)', label: 'Business Impact',
    title: 'Business impact metrics',
    sub: 'Translate agent performance directly into the business outcomes that matter — CSAT, churn risk, revenue retention, and cost savings.',
    prob: {
      title: 'The problem: CX performance is measured in feelings, not numbers',
      sub: 'Most businesses know their customer service is "good" or "bad" but cannot quantify how agent behaviour connects to revenue, churn, or growth.',
      stats: [{ v: '89%', l: 'Customers who churn after bad service' }, { v: '₹4,200', l: 'Avg annual value of one lost customer' }, { v: '5×', l: 'Cost to acquire vs retain a customer' }],
      items: ['Without analytics, managers cannot prove to leadership that coaching investment translates to revenue retention', 'CSAT surveys capture only 8–12% of customers — the silent majority who churn go unmeasured', 'Repeat call rates are tracked globally but not attributed to specific agent behaviours causing them', 'Churn signals in calls (frustration, comparison mentions, cancellation language) go undetected without analysis', 'The ROI of support quality investment is invisible — making it the first budget cut when times are tough'],
    },
    sol: {
      title: 'Making CX impact visible and measurable',
      sub: 'Every call analysis surfaces the business outcomes at stake — predicted CSAT, churn risk, revenue retained, and the coaching ROI to fix the gaps.',
      stats: [{ v: '+18pts', l: 'Avg CSAT improvement in 90 days' }, { v: '34%', l: 'Reduction in repeat calls' }, { v: '₹87L', l: 'Annual revenue retained per 50-agent team' }],
      items: ['Predicted CSAT score per call — see how the customer is likely to rate the interaction before the survey goes out', 'Churn risk classification (low/medium/high) based on frustration signals, repeat contacts, and unresolved issues', 'First Call Resolution (FCR) tracking — the single metric most correlated with both CSAT and operational cost', 'Revenue impact quantified per call — how much annual revenue is at risk based on this customer\'s churn probability', 'Coaching ROI calculated — how much revenue improvement results from fixing each identified agent gap'],
    },
    howsteps: [
      { n: 1, l: 'Churn signals extracted from the call', s: 'Language patterns indicating frustration, competitor mentions, escalation intent, and satisfaction are detected and scored.' },
      { n: 2, l: 'CSAT is predicted using interaction data', s: 'Predicted CSAT is computed from empathy, resolution, and effort scores — calibrated against real CSAT survey benchmarks.' },
      { n: 3, l: 'Revenue impact is quantified', s: 'Customer lifetime value, repeat call cost, and churn probability are combined to show the revenue at stake per interaction.' },
      { n: 4, l: 'Business outcome connected to coaching', s: 'Each coaching recommendation includes its expected impact on business metrics — closing the loop from call to revenue.' },
    ],
    metrics: [
      { l: 'Predicted CSAT score', s: 'Estimated CSAT if customer were surveyed right now' },
      { l: 'Churn risk classification', s: 'Low / medium / high risk based on sentiment and resolution signals' },
      { l: 'First Call Resolution', s: 'Whether the issue was fully resolved without a follow-up contact' },
      { l: 'Customer effort score', s: 'How much friction the customer experienced — highly correlated with churn' },
      { l: 'Revenue at risk', s: 'Estimated annual revenue if this customer churns' },
      { l: 'Revenue retained', s: 'Estimated revenue saved by a successful resolution in this call' },
      { l: 'Repeat call probability', s: 'Likelihood the customer will need to call back about the same issue' },
      { l: 'NPS signal detection', s: 'Promoter / detractor language detected in the conversation' },
      { l: 'Coaching ROI per item', s: 'Revenue impact of applying each specific coaching recommendation' },
      { l: 'CSAT trend by agent', s: 'How each agent\'s predicted CSAT has trended over 30 days' },
      { l: 'Churn cohort tracking', s: 'Which call types and agents generate the most churn risk' },
      { l: 'Support cost per resolution', s: 'Operational cost attribution per call category and complexity' },
    ],
  },
}

function CheckIcon({ color }) {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
}
function CrossIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
}

export default function DetailPage({ featureKey, onBack, onAnalyse }) {
  const d = DETAILS[featureKey]
  if (!d) return null

  return (
    <div className={styles.root}>
      <div className={styles.orb1} /><div className={styles.orb2} />
      <nav className={styles.nav}>
        <button className={styles.backBtn} onClick={onBack}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
        <div className={styles.logo}><span className={styles.logoBadge}>CX</span><span className={styles.logoTxt}>Intelligence</span></div>
        <div />
      </nav>

      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.heroPill} style={{ background: d.bg, color: d.color }}>{d.label}</div>
          <h1 className={styles.heroTitle}>{d.title}</h1>
          <p className={styles.heroSub}>{d.sub}</p>
        </div>

        <div className={styles.body}>
          {/* Problem */}
          <div className={styles.probCard}>
            <div className={styles.probTitle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {d.prob.title}
            </div>
            <div className={styles.probSub}>{d.prob.sub}</div>
            <div className={styles.statGrid}>
              {d.prob.stats.map(s => (
                <div key={s.l} className={styles.probStat}>
                  <div className={styles.probStatVal}>{s.v}</div>
                  <div className={styles.probStatLabel}>{s.l}</div>
                </div>
              ))}
            </div>
            <div className={styles.itemList}>
              {d.prob.items.map((item, i) => (
                <div key={i} className={styles.listItem}>
                  <CrossIcon />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Solution */}
          <div className={styles.solCard} style={{ background: d.bg, borderColor: d.bdrColor }}>
            <div className={styles.solTitle} style={{ color: d.color }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={d.color} strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              {d.sol.title}
            </div>
            <div className={styles.probSub}>{d.sol.sub}</div>
            <div className={styles.statGrid}>
              {d.sol.stats.map(s => (
                <div key={s.l} className={styles.solStat} style={{ background: d.bg, borderColor: d.bdrColor }}>
                  <div className={styles.solStatVal} style={{ color: d.color }}>{s.v}</div>
                  <div className={styles.probStatLabel}>{s.l}</div>
                </div>
              ))}
            </div>
            <div className={styles.itemList}>
              {d.sol.items.map((item, i) => (
                <div key={i} className={styles.listItem}>
                  <CheckIcon color={d.color} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className={styles.howCard}>
            <div className={styles.sectionTitle}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--t3)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              How it works
            </div>
            <div className={styles.howSteps}>
              {d.howsteps.map(s => (
                <div key={s.n} className={styles.howStep}>
                  <div className={styles.howStepNum} style={{ background: d.bg, color: d.color }}>{s.n}</div>
                  <div>
                    <div className={styles.howStepLabel}>{s.l}</div>
                    <div className={styles.howStepSub}>{s.s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics grid */}
          <div className={styles.metricsCard}>
            <div className={styles.sectionTitle}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--t3)" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              Metrics tracked in this module
            </div>
            <div className={styles.metricsGrid}>
              {d.metrics.map(m => (
                <div key={m.l} className={styles.metricItem}>
                  <div className={styles.metricLabel} style={{ color: d.color }}>{m.l}</div>
                  <div className={styles.metricSub}>{m.s}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className={styles.ctaCard}>
            <div className={styles.ctaTitle}>See {d.label} in action</div>
            <div className={styles.ctaSub}>Upload a real call or transcript and see these metrics generated live from your own data in under 30 seconds.</div>
            <div className={styles.ctaBtns}>
              <button className={styles.ctaBtn1} onClick={onAnalyse}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                Try it now
              </button>
              <button className={styles.ctaBtn2} onClick={onBack}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                Back to home
              </button>
            </div>
          </div>
        </div>
      </main>
      <footer className={styles.footer}>© 2025 CX Intelligence. All rights reserved.</footer>
    </div>
  )
}
