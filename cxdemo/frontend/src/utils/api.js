const BASE = (import.meta.env.VITE_API_URL ?? '') + '/api/v1'

export const api = {
  async uploadFile(file) {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(`${BASE}/analysis/upload`, { method: 'POST', body: form })
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Upload failed') }
    return res.json()
  },
  async pasteText(content) {
    const res = await fetch(`${BASE}/analysis/paste`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Submission failed') }
    return res.json()
  },
  async getAnalysis(sessionId) {
    const res = await fetch(`${BASE}/analysis/${sessionId}`)
    if (!res.ok) throw new Error('Session not found')
    return res.json()
  },
}

export async function pollAnalysis(sessionId, onUpdate, maxAttempts = 60) {
  for (let i = 0; i < maxAttempts; i++) {
    const data = await api.getAnalysis(sessionId)
    onUpdate(data)
    if (['complete', 'failed', 'not_agent_interaction'].includes(data.status)) return data
    await new Promise(r => setTimeout(r, 2000))
  }
  throw new Error('Analysis timed out')
}
