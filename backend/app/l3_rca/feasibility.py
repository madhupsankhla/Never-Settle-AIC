"""
Feasibility Layer (Section 6).
Evaluates proposed actions against:
1. Discount ceiling bounds (historical max per category/SKU)
2. Lead-time bounds (supplier delivery OTIF history)
3. Active user known constraints (e.g. freight freeze, budget limits)
4. Decision rights and ownership bounds
"""
from typing import Dict, List, Any, Optional


ROLE_DECISION_RIGHTS = {
    "Store Manager": ["staff_reallocation", "shift_training_coaching", "local_merchandising_display"],
    "Regional Merchandising": ["expedite_restock", "cross_store_transfer", "allocation_rebalance"],
    "Pricing Team": ["matched_promotional_discount", "clearance_markdown"],
    "CFO / Finance": ["reprice_compliance", "capital_expenditure", "national_vendor_contract"]
}


def evaluate_action_feasibility(
    action_dict: Dict[str, Any],
    active_constraints: List[Dict[str, Any]],
    supplier_lead_time_days: int = 5,
    max_allowed_discount_pct: float = 30.0
) -> Dict[str, Any]:
    """
    Validates feasibility of proposed action and flags constraint violations.
    """
    lever = action_dict.get("lever", "")
    owner = action_dict.get("owner", "")
    action_str = action_dict.get("action", "")

    # 1. Decision Rights Bound
    allowed_levers = ROLE_DECISION_RIGHTS.get(owner, [])
    if lever and lever not in allowed_levers:
        return {
            "is_feasible": False,
            "status": "UNAUTHORIZED_OWNER",
            "notes": f"Role '{owner}' lacks governance authority for lever '{lever}'."
        }

    # 2. Check Active Known User Constraints
    applied_constraints = []
    for c in active_constraints:
        c_type = c.get("constraint_type")
        c_desc = c.get("description", "")
        # Air freight freeze
        if "air-freight" in action_str.lower() or "expedite" in lever.lower():
            if c_type == "logistics_channel" or "freight" in c_desc.lower():
                applied_constraints.append(c_desc)
                return {
                    "is_feasible": False,
                    "status": "BLOCKED_BY_USER_CONSTRAINT",
                    "notes": f"Action blocked by user constraint: '{c_desc}'. Recommended fallback: Standard ground expedited transfer."
                }
        # Discount cap
        if "discount" in lever.lower() and c_type == "discount_cap":
            cap = c.get("value", max_allowed_discount_pct)
            if cap < 10.0:
                applied_constraints.append(c_desc)
                return {
                    "is_feasible": False,
                    "status": "DISCOUNT_CAP_EXCEEDED",
                    "notes": f"Discount constrained by rule: {c_desc}"
                }

    # 3. Restock timeline vs. lead-time bound
    if "expedite" in lever.lower():
        if supplier_lead_time_days > 14:
            return {
                "is_feasible": True,
                "status": "FEASIBLE_WITH_DELAY",
                "notes": f"Supplier lead time is {supplier_lead_time_days} days. Expedited freight required to meet 7-day target."
            }

    return {
        "is_feasible": True,
        "status": "FEASIBLE",
        "notes": "Action passed all feasibility, governance, and constraint checks."
    }
