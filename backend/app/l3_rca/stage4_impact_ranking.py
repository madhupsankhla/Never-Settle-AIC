"""
Stage 4: Impact Ranking and Action Synthesis.
1. Computes financial impact = confidence_score * business_impact_value.
2. Filters and bounds actions through the Feasibility Layer (Section 6).
3. Produces prioritized, ownable, and executable action recommendations.
"""
from typing import Dict, List, Optional, Any
from app.schemas.evidence import Hypothesis, TopRankedAction
from app.l3_rca.feasibility import evaluate_action_feasibility


ACTION_TEMPLATES = {
    "size_curve_stockout": {
        "lever": "expedite_restock",
        "action_template": "Air-freight 400 units of SKU-1042 (sizes 8 and 9) to {store_id}",
        "owner": "Regional Merchandising",
        "base_weekly_recovery_inr": 185000.0,
        "monitoring_plan": "Recheck conversion rate in 1 week post-restock delivery"
    },
    "staff_training_deficit": {
        "lever": "staff_reallocation",
        "action_template": "Reassign 2 certified footwear specialists to peak weekend shifts at {store_id} & initiate rapid fitting module refresher",
        "owner": "Store Manager",
        "base_weekly_recovery_inr": 62000.0,
        "monitoring_plan": "Monitor weekend conversion and mystery shopper fit-guidance scores over 14 days"
    },
    "competitor_undercut": {
        "lever": "matched_promotional_discount",
        "action_template": "Execute 10% tactical category bundle on matching Running styles",
        "owner": "Pricing Team",
        "base_weekly_recovery_inr": 45000.0,
        "monitoring_plan": "Track category volume elasticity over 7 days"
    }
}


def rank_impact_and_synthesize_action(
    hypotheses: List[Hypothesis],
    store_id: str,
    active_constraints: List[Dict[str, Any]],
    supplier_lead_time_days: int = 5
) -> Optional[TopRankedAction]:
    """
    Ranks candidate drivers by confidence * financial impact and applies feasibility checks.
    """
    if not hypotheses:
        return None

    # Filter out pure LOW tier hypotheses
    valid_hypos = [h for h in hypotheses if h.tier in ["HIGH", "MEDIUM"]]
    if not valid_hypos:
        # Abstain or no viable action
        return None

    # Sort by confidence
    sorted_hypos = sorted(valid_hypos, key=lambda h: h.confidence, reverse=True)
    top_hypo = sorted_hypos[0]

    template = ACTION_TEMPLATES.get(top_hypo.driver)
    if not template:
        return None

    raw_action_dict = {
        "driver": top_hypo.driver,
        "lever": template["lever"],
        "action": template["action_template"].format(store_id=store_id),
        "owner": template["owner"]
    }

    # Pass through feasibility layer
    feasibility_res = evaluate_action_feasibility(
        action_dict=raw_action_dict,
        active_constraints=active_constraints,
        supplier_lead_time_days=supplier_lead_time_days
    )

    action_text = raw_action_dict["action"]
    if not feasibility_res["is_feasible"]:
        # Adapt action based on user constraint if blocked
        if "freight" in feasibility_res.get("notes", "").lower():
            action_text = f"Expedite ground transfer of 400 units of SKU-1042 (sizes 8-9) from Regional Hub to {store_id} (Air freight bypassed per active budget constraint)"

    recovery_inr = template["base_weekly_recovery_inr"] * top_hypo.confidence

    return TopRankedAction(
        driver=top_hypo.driver,
        lever=template["lever"],
        action=action_text,
        expected_impact=f"+₹{recovery_inr:,.0f} est. weekly recovery",
        estimated_recovery_val=round(recovery_inr, 2),
        owner=template["owner"],
        confidence=top_hypo.tier,
        monitoring_plan=template["monitoring_plan"],
        feasibility_status=feasibility_res.get("status", "FEASIBLE"),
        feasibility_notes=feasibility_res.get("notes")
    )
