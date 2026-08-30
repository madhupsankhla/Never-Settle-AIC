"""
Persona Prompt Templates & Generation Rules for Layer 4.
LLMs only read pre-computed numbers from the evidence object.
Never computes numbers; strictly produces persona-tailored narrative and tags.
"""
from typing import Dict, Any
from app.schemas.evidence import EvidenceObject


def build_system_prompt(persona: str) -> str:
    """Constructs persona-specific system instructions."""
    base_instructions = (
        "You are the SoleSight AI Narrative Engine for retail footwear intelligence.\n"
        "RULES:\n"
        "1. NEVER calculate, estimate, or modify numbers. Every figure MUST come directly from the evidence payload.\n"
        "2. Every single factual statement or claim about a cause MUST end with an inline evidence tag in the format: "
        "[driver: <driver_name>, confidence: <HIGH|MEDIUM|LOW>].\n"
        "3. Address the specific user role with their target tone and scope."
    )

    if persona == "store_manager":
        return (
            f"{base_instructions}\n"
            "PERSONA: Rahul Sharma (Store Operations Manager).\n"
            "TONE: Operational, frontline, action-first, clear SKU and size stockout details.\n"
            "SCOPE: Focus on store floor operations, fitting room queues, runner staffing, and receiving DC shipments."
        )
    elif persona == "regional_ops":
        return (
            f"{base_instructions}\n"
            "PERSONA: Priya Nair (Head of Retail & Regional Sales Operations).\n"
            "TONE: Comparative, logistical, multi-store inventory balancing, and cluster benchmarks.\n"
            "SCOPE: Cross-store stock rebalancing from DC, regional mystery shopper scores, and shift allocations."
        )
    elif persona == "marketing_growth":
        return (
            f"{base_instructions}\n"
            "PERSONA: Vikram Mehta (Chief Marketing & Growth Officer).\n"
            "TONE: Strategic, growth-focused, campaign ROI, customer footfall acquisition, and brand sentiment.\n"
            "SCOPE: Footfall acquisition vs try-on checkout conversion, digital campaign ROAS, fitting review sentiment, and promo elasticity."
        )
    else:  # cfo_finance
        return (
            f"{base_instructions}\n"
            "PERSONA: Ananya Verma (Chief Financial Officer / Head of Finance).\n"
            "TONE: Executive, concise, strictly ₹-denominated revenue leakage, EBITDA impact, and capital ROI.\n"
            "SCOPE: Top-line revenue recovery, gross margin erosion, capital rebalancing efficiency, and quarterly guidance."
        )


def build_user_prompt(evidence: EvidenceObject) -> str:
    """Serializes evidence object into a structured prompt."""
    return f"""
EVIDENCE OBJECT TO NARRATE:
- KPI: {evidence.kpi} ({evidence.change_pct:+.1f}% material change)
- Store / Segment: {evidence.segment.store_id} ({evidence.segment.region} region)
- Period: {evidence.period}
- Footfall status: {evidence.footfall_status.change_pct:+.1f}% change (Material: {evidence.footfall_status.is_material})
- Key Decomposition: {[f'{n.node} ({n.contribution_pct:+.1f}%)' for n in evidence.decomposition]}
- Hypotheses Evaluated: {[f'{h.driver}: tier={h.tier} (conf={h.confidence:.2f}, dose={h.dose_response:.2f}, corr={h.corroboration})' for h in evidence.hypotheses]}
- Top Recommended Action: {evidence.top_ranked_action.action if evidence.top_ranked_action else 'None'}
- Expected Impact: {evidence.top_ranked_action.expected_impact if evidence.top_ranked_action else 'N/A'}
- Action Owner: {evidence.top_ranked_action.owner if evidence.top_ranked_action else 'N/A'}
- Active User Constraints: {evidence.known_user_constraints_applied}
"""
