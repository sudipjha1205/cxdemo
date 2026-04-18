"""File Parser — extracts text from various formats."""

import logging, json, csv
from pathlib import Path

logger = logging.getLogger(__name__)

AUDIO_EXTENSIONS = {".mp3", ".wav", ".m4a", ".ogg", ".webm", ".opus", ".aac", ".flac"}
TRANSCRIPT_EXTENSIONS = {".txt", ".md", ".vtt", ".srt", ".json", ".csv", ".pdf", ".docx", ".doc"}
ALL_SUPPORTED = AUDIO_EXTENSIONS | TRANSCRIPT_EXTENSIONS

def parse_file(filepath: str) -> dict:
    path = Path(filepath)
    ext = path.suffix.lower()
    if ext in AUDIO_EXTENSIONS:
        return {"content": None, "format": "audio", "word_count": 0, "error": "audio_file", "is_audio": True}
    try:
        if ext in {".txt", ".md"}:
            return _text(filepath)
        elif ext == ".vtt":
            return _vtt(filepath)
        elif ext == ".srt":
            return _srt(filepath)
        elif ext == ".json":
            return _json(filepath)
        elif ext == ".csv":
            return _csv(filepath)
        elif ext == ".pdf":
            return _pdf(filepath)
        elif ext in {".docx", ".doc"}:
            return _docx(filepath)
        else:
            return {"content": None, "format": "unknown", "word_count": 0, "error": f"Unsupported: {ext}"}
    except Exception as e:
        logger.error(f"Parse failed {filepath}: {e}")
        return {"content": None, "format": ext, "word_count": 0, "error": str(e)}

def _text(fp):
    with open(fp, "r", encoding="utf-8", errors="replace") as f:
        c = f.read()
    return {"content": c, "format": "text", "word_count": len(c.split()), "error": None}

def _vtt(fp):
    with open(fp, "r", encoding="utf-8") as f:
        lines = [l.strip() for l in f if l.strip() and not l.startswith("WEBVTT") and "-->" not in l and not l.strip().isdigit()]
    c = "\n".join(lines)
    return {"content": c, "format": "vtt", "word_count": len(c.split()), "error": None}

def _srt(fp):
    with open(fp, "r", encoding="utf-8") as f:
        lines = [l.strip() for l in f if l.strip() and not l.strip().isdigit() and "-->" not in l]
    c = "\n".join(lines)
    return {"content": c, "format": "srt", "word_count": len(c.split()), "error": None}

def _json(fp):
    with open(fp) as f:
        data = json.load(f)
    lines = []
    if isinstance(data, list):
        for item in data:
            spk = item.get("speaker", item.get("name", "Speaker"))
            txt = item.get("text", item.get("content", item.get("transcript", "")))
            if txt: lines.append(f"{spk}: {txt}")
    elif isinstance(data, dict):
        if "transcript" in data: lines.append(data["transcript"])
        elif "messages" in data:
            for msg in data["messages"]: lines.append(f"{msg.get('from','?')}: {msg.get('body','')}")
    c = "\n".join(lines) if lines else json.dumps(data)
    return {"content": c, "format": "json", "word_count": len(c.split()), "error": None}

def _csv(fp):
    rows = []
    with open(fp, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames or []
        sc = next((h for h in headers if h.lower() in ["sender","from","name","agent","user","speaker"]), headers[0] if headers else "Sender")
        mc = next((h for h in headers if h.lower() in ["message","text","content","body","transcript"]), headers[-1] if headers else "Message")
        for row in reader:
            if row.get(mc): rows.append(f"{row.get(sc,'?')}: {row.get(mc,'')}")
    c = "\n".join(rows)
    return {"content": c, "format": "csv", "word_count": len(c.split()), "error": None}

def _pdf(fp):
    try:
        import pdfplumber
        with pdfplumber.open(fp) as pdf:
            c = "\n".join(p.extract_text() or "" for p in pdf.pages)
        return {"content": c, "format": "pdf", "word_count": len(c.split()), "error": None}
    except ImportError:
        return {"content": None, "format": "pdf", "word_count": 0, "error": "pip install pdfplumber"}

def _docx(fp):
    try:
        from docx import Document
        doc = Document(fp)
        c = "\n".join(p.text for p in doc.paragraphs if p.text.strip())
        return {"content": c, "format": "docx", "word_count": len(c.split()), "error": None}
    except ImportError:
        return {"content": None, "format": "docx", "word_count": 0, "error": "pip install python-docx"}
