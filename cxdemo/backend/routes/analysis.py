"""Analysis routes — upload, paste, poll."""

from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os, threading, logging
from datetime import datetime, timezone

from services.database import get_db
from services.analysis_service import AnalysisService
from services.whisper_service import get_whisper_service
from utils.file_parser import parse_file, ALL_SUPPORTED, AUDIO_EXTENSIONS
from models.session import AnalysisSession

logger = logging.getLogger(__name__)
analysis_bp = Blueprint("analysis", __name__)

def _ext(filename): return "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
def allowed(f): return _ext(f) in ALL_SUPPORTED
def is_audio(f): return _ext(f) in AUDIO_EXTENSIONS

def _run_analysis(session_id, content, app, audio_path=None):
    with app.app_context():
        db = get_db()
        try:
            db.sessions.update_one({"_id": session_id}, {"$set": {"status": "processing", "updated_at": datetime.now(timezone.utc)}})
            if audio_path:
                db.sessions.update_one({"_id": session_id}, {"$set": {"status": "transcribing"}})
                result = get_whisper_service().transcribe(audio_path)
                if result.get("error"):
                    raise Exception(f"Transcription failed: {result['error']}")
                content = result["transcript"]
                if audio_path and os.path.exists(audio_path):
                    os.remove(audio_path)
            if not content or len(content.strip()) < 50:
                raise Exception("Content too short to analyse.")
            service = AnalysisService()
            analysis = service.analyze_full(content)
            is_agent = analysis.get("is_agent_interaction", True)
            db.sessions.update_one({"_id": session_id}, {"$set": {
                "status": "complete" if is_agent else "not_agent_interaction",
                "is_agent_interaction": is_agent,
                "analysis": analysis,
                "overall_score": analysis.get("overall_score"),
                "csat_predicted": analysis.get("csat_predicted"),
                "churn_risk": analysis.get("churn_risk"),
                "updated_at": datetime.now(timezone.utc),
            }})
        except Exception as e:
            logger.error(f"Analysis failed {session_id}: {e}")
            db.sessions.update_one({"_id": session_id}, {"$set": {"status": "failed", "error_message": str(e), "updated_at": datetime.now(timezone.utc)}})

@analysis_bp.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400
    file = request.files["file"]
    if not file.filename:
        return jsonify({"error": "No file selected"}), 400
    filename = secure_filename(file.filename)
    if not allowed(filename):
        return jsonify({"error": f"Unsupported file type"}), 400

    session = AnalysisSession(file_name=filename, file_type=filename.rsplit(".", 1)[-1].lower(), input_method="upload")
    save_path = os.path.join(current_app.config["UPLOAD_FOLDER"], f"{session.session_id}_{filename}")
    file.save(save_path)
    session.file_size_bytes = os.path.getsize(save_path)

    audio_path, content = None, None
    if is_audio(filename):
        session.file_type = "audio"
        audio_path = save_path
    else:
        parsed = parse_file(save_path)
        os.remove(save_path)
        if not parsed.get("content"):
            return jsonify({"error": parsed.get("error", "Could not extract text")}), 400
        content = parsed["content"]
        session.word_count = parsed["word_count"]
        if len(content.strip()) < 50:
            return jsonify({"error": "Content too short. Minimum 50 characters."}), 400

    db = get_db()
    db.sessions.insert_one(session.to_mongo())
    app = current_app._get_current_object()
    threading.Thread(target=_run_analysis, args=(session.session_id, content, app, audio_path), daemon=True).start()

    return jsonify({"session_id": session.session_id, "status": "processing", "file_name": filename, "is_audio": audio_path is not None}), 202

@analysis_bp.route("/paste", methods=["POST"])
def paste_text():
    data = request.get_json()
    if not data or not data.get("content"):
        return jsonify({"error": "No content provided"}), 400
    content = data["content"].strip()
    if len(content) < 50:
        return jsonify({"error": "Content too short. Minimum 50 characters."}), 400
    if len(content) > 150000:
        return jsonify({"error": "Content too long. Maximum 150,000 characters."}), 400

    session = AnalysisSession(file_name="pasted_content.txt", file_type="text", input_method="paste", word_count=len(content.split()))
    db = get_db()
    db.sessions.insert_one(session.to_mongo())
    app = current_app._get_current_object()
    threading.Thread(target=_run_analysis, args=(session.session_id, content, current_app._get_current_object()), daemon=True).start()

    return jsonify({"session_id": session.session_id, "status": "processing"}), 202

@analysis_bp.route("/<session_id>", methods=["GET"])
def get_analysis(session_id):
    db = get_db()
    doc = db.sessions.find_one({"_id": session_id})
    if not doc:
        return jsonify({"error": "Session not found"}), 404
    doc["session_id"] = doc.pop("_id")
    for f in ["created_at", "updated_at"]:
        if f in doc and hasattr(doc[f], "isoformat"):
            doc[f] = doc[f].isoformat()
    return jsonify(doc), 200
