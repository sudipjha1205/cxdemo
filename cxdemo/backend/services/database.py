"""MongoDB connection manager — single pool shared across the app."""

from pymongo import MongoClient
import os, logging

logger = logging.getLogger(__name__)
_client = None
_db = None

def get_db():
    global _client, _db
    if _db is None:
        from constants import MONGO_URI, MONGO_DB_NAME, MONGO_TIMEOUT_MS
        _client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=MONGO_TIMEOUT_MS)
        _client.admin.command("ping")
        _db = _client[MONGO_DB_NAME]
        _ensure_indexes()
        logger.info(f"Connected to MongoDB: {MONGO_DB_NAME}")
    return _db

def _ensure_indexes():
    _db.sessions.create_index("created_at")
    _db.sessions.create_index("session_type")
    _db.analyses.create_index("session_id")
    _db.analyses.create_index("created_at")
