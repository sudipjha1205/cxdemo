"""Claude AI Analysis Service — core intelligence engine."""

import anthropic, json, logging
from constants import ANTHROPIC_API_KEY, CLAUDE_MODEL, CLAUDE_MAX_TOKENS

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are an expert Customer Experience (CX) analyst with 15+ years of experience 
evaluating customer support interactions. Analyse call transcripts, chat logs, and interaction 
documents with precision and objectivity. Always respond with valid JSON only. No markdown."""

AGENT_ANALYSIS_PROMPT = """Analyse this customer interaction and return ONLY a JSON object with this EXACT structure.
All scores are 0-100. Be specific and reference actual content from the transcript.

{{
  "is_agent_interaction": true,
  "interaction_type": "voice_call",
  "metadata": {{
    "estimated_duration_minutes": 8,
    "agent_name": "name or null",
    "customer_name": "name or null",
    "language": "English",
    "topic": "one line summary",
    "call_category": "billing|technical|complaint|inquiry|other"
  }},
  "overall_score": 78,
  "csat_predicted": 82,
  "churn_risk": "low|medium|high",
  "first_call_resolution": true,
  "sentiment_arc": {{
    "opening": "frustrated|neutral|positive",
    "middle": "frustrated|neutral|positive",
    "closing": "frustrated|neutral|positive",
    "customer_sentiment_final": "satisfied|neutral|dissatisfied"
  }},
  "strengths": [
    {{
      "title": "Strength title",
      "description": "Specific evidence from the transcript",
      "impact": "high|medium|low",
      "quote": "Direct quote or null",
      "business_impact": "How this helps retention or CSAT"
    }}
  ],
  "weaknesses": [
    {{
      "title": "Weakness title",
      "description": "Specific evidence",
      "impact": "high|medium|low",
      "quote": "Direct quote or null",
      "business_impact": "How fixing this improves revenue or reduces churn"
    }}
  ],
  "compliance": {{
    "score": 85,
    "greeting_proper": true,
    "verified_identity": true,
    "offered_resolution": true,
    "proper_closing": true,
    "escalation_offered": false,
    "hold_time_managed": true,
    "flags": ["List any compliance issues"]
  }},
  "metrics": {{
    "empathy_score": 72,
    "clarity_score": 85,
    "resolution_score": 90,
    "professionalism_score": 88,
    "response_quality_score": 76,
    "customer_effort_score": 65,
    "active_listening_score": 80,
    "problem_solving_score": 88
  }},
  "key_moments": [
    {{
      "type": "positive|negative|critical|neutral",
      "moment": "Description of key moment",
      "timestamp_hint": "Early|Mid|Late",
      "business_significance": "Why this matters commercially"
    }}
  ],
  "coaching_recommendations": [
    {{
      "priority": "high|medium|low",
      "area": "Skill area",
      "recommendation": "Specific actionable advice",
      "training_module": "Suggested training focus",
      "expected_improvement": "Metric improvement e.g. Score 70 to 85",
      "business_outcome": "Measurable business result"
    }}
  ],
  "business_impact": {{
    "csat_impact": "CSAT impact statement",
    "churn_reduction": "Churn impact statement",
    "revenue_retention": "Revenue impact statement",
    "coaching_roi": "Coaching ROI statement"
  }},
  "executive_summary": "2-3 sentence manager-ready summary"
}}

Provide 3-5 items for strengths, weaknesses, key_moments, coaching_recommendations.

TRANSCRIPT/CONTENT:
{content}"""

NON_AGENT_PROMPT = """Analyse this content and return ONLY a JSON object:

{{
  "is_agent_interaction": false,
  "content_type": "meeting_recording|personal_conversation|monologue|interview|podcast|lecture|document|other",
  "detected_speakers": 2,
  "language": "English",
  "topic": "Main topic",
  "summary": "3-4 sentence summary",
  "key_points": ["point 1", "point 2", "point 3"],
  "sentiment_overall": "positive|neutral|negative|mixed",
  "content_highlights": [
    {{"type": "insight|decision|action_item|question|concern", "text": "Notable moment"}}
  ],
  "executive_summary": "One sentence summary"
}}

CONTENT:
{content}"""


class AnalysisService:
    def __init__(self):
        if not ANTHROPIC_API_KEY:
            raise ValueError("ANTHROPIC_API_KEY not set in constants.py / .env")
        self.client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
        self.model = CLAUDE_MODEL
        self.max_tokens = CLAUDE_MAX_TOKENS

    def _call_claude(self, prompt: str) -> dict:
        message = self.client.messages.create(
            model=self.model,
            max_tokens=self.max_tokens,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": prompt}]
        )
        raw = message.content[0].text.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        return json.loads(raw.strip())

    def _detect_type(self, content: str) -> bool:
        prompt = f"""Is this a customer support / service agent interaction? Return ONLY:
{{"is_agent_interaction": true or false, "confidence": 0.0-1.0}}
Content (first 500 chars): {content[:500]}"""
        try:
            result = self._call_claude(prompt)
            return result.get("is_agent_interaction", True)
        except Exception:
            return True

    def analyze_full(self, content: str) -> dict:
        is_agent = self._detect_type(content)
        if is_agent:
            prompt = AGENT_ANALYSIS_PROMPT.format(content=content[:8000])
        else:
            prompt = NON_AGENT_PROMPT.format(content=content[:8000])
        result = self._call_claude(prompt)
        result["is_agent_interaction"] = is_agent
        return result
