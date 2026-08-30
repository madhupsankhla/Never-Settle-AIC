"""
Hard-Coded Abstention Gate for Layer 4.
Guarantees that low-confidence or contradictory evidence objects return
a transparent clarification template and NEVER prompt an LLM to hallucinate causes.
"""
from typing import Optional, Dict, Any
from app.schemas.evidence import EvidenceObject
from app.schemas.narrative import NarrativeResponse, InlineEvidenceTag


def evaluate_abstention_gate(
    evidence: EvidenceObject,
    persona: str,
    evidence_hash: str
) -> Optional[NarrativeResponse]:
    """
    Checks if evidence object triggers hardcoded abstention.
    Returns NarrativeResponse with abstention banner if triggered, else None.
    """
    if not evidence.abstain and evidence.top_ranked_action is not None:
        return None

    reason = evidence.abstain_reason or "Statistical thresholds not met for causal attribution."

    if persona == "store_manager":
        headline = "⚠️ Unattributed Conversion Movement - Clarification Required"
        paragraphs = [
            f"We detected a {abs(evidence.change_pct):.1f}% drop in conversion for {evidence.segment.store_id or 'your store'}, but existing telemetry does not reveal a definitive root cause.",
            f"Reason: {reason}",
            "Recommended Action: Please inspect floor conditions, localized footfall counter alignment, or any unrecorded stock shrinkage before taking corrective merchandising action."
        ]
    elif persona == "regional_ops":
        headline = "⚠️ Inconclusive Cross-Store Signal - Diagnostic Hold"
        paragraphs = [
            f"Movement in {evidence.segment.store_id or 'target unit'} ({evidence.change_pct:+.1f}%) cannot be confidently separated from random noise or multi-variable co-linearity.",
            f"Diagnostic finding: {reason}",
            "Guidance: Defer regional stock rebalancing until next inventory refresh cycle to avoid premature logistics cost."
        ]
    else:  # cfo_finance
        headline = "⚠️ Conversion Anomaly - Insufficient Causal Confidence (Abstained)"
        paragraphs = [
            f"Segment {evidence.segment.store_id or 'Store'}: {evidence.change_pct:+.1f}% conversion movement recorded in {evidence.period}.",
            f"Model Abstention: {reason}",
            "Financial Impact: Unverified at HIGH confidence. No capital or pricing actions recommended at this stage."
        ]

    return NarrativeResponse(
        narrative_id=f"ABS-{evidence.evidence_id or '0000'}",
        persona=persona,
        title="SoleSight Causal Integrity Gate",
        headline=headline,
        summary_paragraphs=paragraphs,
        inline_tags=[
            InlineEvidenceTag(
                tag_text="[abstain: true, confidence: LOW]",
                driver="unverified_signal",
                confidence="LOW",
                precedence=False,
                dose_response=0.18,
                corroboration=reason
            )
        ],
        action_callout={
            "status": "ABSTAINED",
            "guidance": "Awaiting refreshed POS & sensor telemetry. No action surfaced."
        },
        is_abstention=True,
        abstention_reason=reason,
        telemetry={
            "llm_invoked": False,
            "latency_ms": 1.2,
            "prompt_tokens": 0,
            "completion_tokens": 0,
            "total_cost_usd": 0.0,
            "model_tier": "gate_bypass"
        },
        cached=False,
        evidence_hash=evidence_hash
    )
