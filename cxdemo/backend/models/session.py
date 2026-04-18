"""Data models for MongoDB documents."""

from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from typing import Optional, Dict, Any
import uuid

def utcnow(): return datetime.now(timezone.utc)
def new_id(): return str(uuid.uuid4())

@dataclass
class AnalysisSession:
    session_id: str = field(default_factory=new_id)
    created_at: datetime = field(default_factory=utcnow)
    updated_at: datetime = field(default_factory=utcnow)
    file_name: Optional[str] = None
    file_type: str = "text"
    file_size_bytes: int = 0
    input_method: str = "upload"
    word_count: int = 0
    status: str = "pending"
    error_message: Optional[str] = None
    is_agent_interaction: bool = True
    analysis: Optional[Dict[str, Any]] = None

    def to_mongo(self) -> dict:
        d = asdict(self)
        d["_id"] = d.pop("session_id")
        return d

    @classmethod
    def from_mongo(cls, doc: dict) -> "AnalysisSession":
        doc = dict(doc)
        doc["session_id"] = doc.pop("_id")
        return cls(**{k: v for k, v in doc.items() if k in cls.__dataclass_fields__})
