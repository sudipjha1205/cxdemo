# CX Intelligence Platform

> AI-powered customer interaction analysis. Upload any call recording or transcript and get instant agent performance analytics, compliance scores, and coaching recommendations.

---

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB running locally (`brew services start mongodb-community` on Mac)
- Anthropic API key → [console.anthropic.com](https://console.anthropic.com)

### 1. Configure backend
```bash
cd backend
cp .env.example .env
# Edit .env — set ANTHROPIC_API_KEY
```

### 2. Install & run backend
```bash
pip install -r requirements.txt
python app.py
# → http://localhost:8000
```

### 3. Install & run frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Or use the start script
```bash
chmod +x start.sh
./start.sh
```

### Or use Docker
```bash
ANTHROPIC_API_KEY=sk-ant-... docker-compose up
```

---

## Project Structure

```
cxdemo/
├── backend/
│   ├── app.py                    # Flask app factory
│   ├── constants.py              # All config — API keys live here
│   ├── requirements.txt
│   ├── routes/
│   │   ├── analysis.py           # Upload, paste, poll endpoints
│   │   ├── sessions.py           # Session history
│   │   └── health.py
│   ├── services/
│   │   ├── analysis_service.py   # Claude AI analysis engine
│   │   ├── whisper_service.py    # Audio transcription (OpenAI/Sarvam/local)
│   │   └── database.py           # MongoDB connection pool
│   ├── models/session.py
│   └── utils/file_parser.py      # Multi-format text extraction
│
└── frontend/
    ├── src/
    │   ├── App.jsx               # Router
    │   ├── pages/
    │   │   ├── LandingPage.jsx   # Hero + 3-tab upload + feature cards
    │   │   ├── DetailPage.jsx    # 4 feature detail pages with stats
    │   │   └── AnalysisPage.jsx  # Processing + results orchestrator
    │   └── components/
    │       ├── AgentDashboard.jsx  # Full metrics dashboard
    │       └── NonAgentView.jsx    # Non-agent content view
    └── index.html
```

---

## Supported File Formats

| Type | Extensions |
|------|-----------|
| Call audio | .mp3, .wav, .m4a, .ogg, .webm, .opus, .aac |
| Transcripts | .txt, .vtt, .srt, .json, .csv, .pdf, .docx, .md |

---

## API Reference

```
POST /api/v1/analysis/upload     Upload file (audio or transcript)
POST /api/v1/analysis/paste      Submit pasted text
GET  /api/v1/analysis/:id        Poll for results
GET  /api/v1/sessions/           List recent sessions
GET  /api/v1/health              Health check
```

---

## Dashboard Features

- Overall performance score with animated ring
- Predicted CSAT, churn risk, first call resolution
- Sentiment arc: opening → middle → closing
- Compliance audit: 6 SOP checkpoints with evidence
- 8-dimension radar chart
- 8 metric score bars
- Before vs After comparison panel
- Business impact: retention, revenue, coaching ROI
- Strengths & weaknesses with direct quotes and business context
- Key moments timeline with commercial significance
- Coaching plan: prioritised, with expected improvement and business outcome

---

## Audio Transcription

Configure in `constants.py`:
- `WHISPER_PROVIDER = "openai"` — OpenAI Whisper API
- `WHISPER_PROVIDER = "sarvam"` — Sarvam AI (Hindi, Tamil, Telugu, Kannada)
- `WHISPER_PROVIDER = "local"` — Local Whisper model (offline)
