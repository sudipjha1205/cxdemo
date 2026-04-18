"""
constants.py — Central configuration for CX Intelligence Platform
All API keys and settings live here. Never expose to the frontend.
"""

import os
from dotenv import load_dotenv

load_dotenv()

# ── Anthropic / Claude ─────────────────────────────────────────────────────
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
CLAUDE_MODEL = "claude-sonnet-4-5"
CLAUDE_MAX_TOKENS = 4096

# ── MongoDB ────────────────────────────────────────────────────────────────
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/cxintelligence")
MONGO_DB_NAME = "cxintelligence"
MONGO_TIMEOUT_MS = 5000

# ── File upload ────────────────────────────────────────────────────────────
MAX_UPLOAD_SIZE_MB = 100
MAX_TEXT_LENGTH = 150_000

AUDIO_EXTENSIONS = {".mp3", ".wav", ".m4a", ".ogg", ".webm", ".opus", ".aac", ".flac"}
TRANSCRIPT_EXTENSIONS = {".txt", ".md", ".vtt", ".srt", ".json", ".csv", ".pdf", ".docx", ".doc"}
ALL_SUPPORTED_EXTENSIONS = AUDIO_EXTENSIONS | TRANSCRIPT_EXTENSIONS

# ── Speech-to-text ─────────────────────────────────────────────────────────
# Options: "openai" | "sarvam" (Indian languages) | "local" (offline whisper)
WHISPER_PROVIDER = os.getenv("WHISPER_PROVIDER", "openai")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY", "")
WHISPER_MODEL = "whisper-1"

# ── Analysis settings ──────────────────────────────────────────────────────
MIN_CONTENT_LENGTH = 50
ANALYSIS_TIMEOUT_SECONDS = 120
BACKGROUND_THREAD_POOL_SIZE = 10

# ── Feature flags ──────────────────────────────────────────────────────────
ENABLE_AUDIO_TRANSCRIPTION = True
ENABLE_MULTI_LANGUAGE = True

# ── CORS ───────────────────────────────────────────────────────────────────
_frontend_url = os.getenv("FRONTEND_URL", "")
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    *([_frontend_url] if _frontend_url else []),
]
