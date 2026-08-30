"""
System-wide Telemetry & Performance Instrumentation.
Tracks latency, token usage, cost, and query counts.
"""
import time
from typing import Dict, List, Any


class TelemetryTracker:
    def __init__(self):
        self.session_queries: int = 0
        self.total_latency_ms: float = 0.0
        self.total_prompt_tokens: int = 0
        self.total_completion_tokens: int = 0
        self.total_estimated_cost_usd: float = 0.0
        self.query_log: List[Dict[str, Any]] = []

    def record_query(
        self,
        endpoint: str,
        latency_ms: float,
        prompt_tokens: int = 0,
        completion_tokens: int = 0,
        cost_usd: float = 0.0,
        model_name: str = "fast_router"
    ):
        self.session_queries += 1
        self.total_latency_ms += latency_ms
        self.total_prompt_tokens += prompt_tokens
        self.total_completion_tokens += completion_tokens
        self.total_estimated_cost_usd += cost_usd

        self.query_log.append({
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "endpoint": endpoint,
            "latency_ms": round(latency_ms, 2),
            "tokens": prompt_tokens + completion_tokens,
            "cost_usd": round(cost_usd, 6),
            "model": model_name
        })

    def get_summary(self) -> Dict[str, Any]:
        avg_lat = (self.total_latency_ms / self.session_queries) if self.session_queries > 0 else 0.0
        return {
            "session_queries": self.session_queries,
            "avg_latency_ms": round(avg_lat, 2),
            "total_prompt_tokens": self.total_prompt_tokens,
            "total_completion_tokens": self.total_completion_tokens,
            "total_tokens": self.total_prompt_tokens + self.total_completion_tokens,
            "total_cost_usd": round(self.total_estimated_cost_usd, 6),
            "target_latency_sla_ms": 5000,
            "sla_compliance_pct": 100.0 if avg_lat < 5000 else 85.0,
            "recent_queries": self.query_log[-10:]
        }


# Global singleton tracker
global_telemetry = TelemetryTracker()
