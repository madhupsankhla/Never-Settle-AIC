"""
Two-Tier Model Router and Token Cost Instrumentation.
Routes routine HIGH-confidence narratives to fast/cheap model,
and complex/MEDIUM/high-materiality narratives to deeper reasoning tier.
"""
from typing import Dict, Any
from app.schemas.evidence import EvidenceObject


class ModelRouter:
    def __init__(self):
        self.fast_model = "gemini-1.5-flash"
        self.reasoning_model = "gemini-1.5-pro"

    def select_model(self, evidence: EvidenceObject) -> Dict[str, Any]:
        """
        Determines the target model tier and pricing factors based on confidence and materiality.
        """
        # If top hypothesis is HIGH confidence and change is moderate -> fast tier
        top_hypo = evidence.hypotheses[0] if evidence.hypotheses else None
        is_high_conf = top_hypo is not None and top_hypo.tier == "HIGH"
        is_moderate_magnitude = abs(evidence.change_pct) < 25.0

        if is_high_conf and is_moderate_magnitude:
            return {
                "model_name": self.fast_model,
                "tier": "fast_tier",
                "cost_per_1k_input": 0.000075,
                "cost_per_1k_output": 0.00030
            }
        else:
            return {
                "model_name": self.reasoning_model,
                "tier": "reasoning_tier",
                "cost_per_1k_input": 0.00125,
                "cost_per_1k_output": 0.00500
            }

    def compute_cost(self, prompt_tokens: int, completion_tokens: int, model_info: Dict[str, Any]) -> float:
        """Calculates estimated query cost in USD."""
        cost = (
            (prompt_tokens / 1000.0) * model_info["cost_per_1k_input"]
            + (completion_tokens / 1000.0) * model_info["cost_per_1k_output"]
        )
        return round(cost, 6)
