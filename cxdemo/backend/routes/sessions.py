from flask import Blueprint, jsonify, request
from services.database import get_db

sessions_bp = Blueprint("sessions", __name__)

@sessions_bp.route("/", methods=["GET"])
def list_sessions():
    db = get_db()
    limit = min(int(request.args.get("limit", 20)), 100)
    cursor = db.sessions.find({}, {"analysis.coaching_recommendations": 0}).sort("created_at", -1).limit(limit)
    sessions = []
    for doc in cursor:
        doc["session_id"] = doc.pop("_id")
        for f in ["created_at", "updated_at"]:
            if f in doc and hasattr(doc[f], "isoformat"):
                doc[f] = doc[f].isoformat()
        sessions.append(doc)
    return jsonify({"sessions": sessions, "count": len(sessions)}), 200
