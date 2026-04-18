"""
Speech-to-Text Service
Handles audio transcription before Claude analysis.

Supported providers:
  - openai:  OpenAI Whisper API (best for English)
  - sarvam:  Sarvam AI (Hindi, Tamil, Telugu, Kannada, Bengali)
  - local:   Local whisper model (offline, no API cost)
"""

import logging
from pathlib import Path
from constants import WHISPER_PROVIDER, OPENAI_API_KEY, SARVAM_API_KEY, WHISPER_MODEL

logger = logging.getLogger(__name__)


class WhisperService:
    def __init__(self):
        self.provider = WHISPER_PROVIDER

    def transcribe(self, audio_path: str, language: str = "en") -> dict:
        """Transcribe audio. Returns {"transcript": str, "language": str, "duration_seconds": float, "error": str|None}"""
        path = Path(audio_path)
        if not path.exists():
            return {"transcript": None, "language": language, "duration_seconds": 0, "error": "File not found"}
        logger.info(f"Transcribing {path.name} via {self.provider}")
        if self.provider == "openai":
            return self._openai(audio_path, language)
        elif self.provider == "sarvam":
            return self._sarvam(audio_path, language)
        elif self.provider == "local":
            return self._local(audio_path, language)
        return {"transcript": None, "error": f"Unknown provider: {self.provider}"}

    def _openai(self, path, language):
        try:
            import openai
            client = openai.OpenAI(api_key=OPENAI_API_KEY)
            with open(path, "rb") as f:
                r = client.audio.transcriptions.create(
                    model=WHISPER_MODEL, file=f,
                    language=language if language != "auto" else None,
                    response_format="verbose_json")
            return {"transcript": r.text, "language": r.language, "duration_seconds": r.duration, "error": None}
        except Exception as e:
            return {"transcript": None, "error": str(e)}

    def _sarvam(self, path, language):
        try:
            import requests
            with open(path, "rb") as f:
                r = requests.post(
                    "https://api.sarvam.ai/speech-to-text",
                    headers={"api-subscription-key": SARVAM_API_KEY},
                    files={"file": (Path(path).name, f, "audio/wav")},
                    data={"language_code": language, "model": "saarika:v1"}, timeout=120)
                r.raise_for_status()
                d = r.json()
                return {"transcript": d.get("transcript", ""), "language": d.get("language_code", language),
                        "duration_seconds": d.get("duration", 0), "error": None}
        except Exception as e:
            return {"transcript": None, "error": str(e)}

    def _local(self, path, language):
        try:
            import whisper
            model = whisper.load_model("base")
            result = model.transcribe(path, language=language if language != "auto" else None)
            return {"transcript": result["text"], "language": result.get("language", language), "error": None}
        except ImportError:
            return {"transcript": None, "error": "whisper not installed. Run: pip install openai-whisper"}
        except Exception as e:
            return {"transcript": None, "error": str(e)}


_service = None

def get_whisper_service() -> WhisperService:
    global _service
    if _service is None:
        _service = WhisperService()
    return _service
