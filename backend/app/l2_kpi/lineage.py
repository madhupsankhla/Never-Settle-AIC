"""
Master KPI Lineage and Decomposition Tree.
Master equation: Revenue = Footfall * Conversion Rate * AOV * UPT
Conversion Rate = f(Size-Curve Fill Rate, Staff Training, Mystery Shopper, Weather Residual, Competitors, Policy)
"""
from typing import Dict, List, Any


MASTER_DECOMPOSITION = {
    "root": "revenue",
    "equation": "Revenue = Footfall * Conversion_Rate * AOV * UPT",
    "primary_branches": [
        {
            "id": "footfall",
            "name": "Footfall (Traffic)",
            "unit": "visitors",
            "drivers": ["weather_anomaly", "local_event"]
        },
        {
            "id": "conversion_rate",
            "name": "Conversion Rate",
            "unit": "%",
            "drivers": [
                "size_curve_stockout",
                "staff_training_deficit",
                "competitor_undercut",
                "tax_policy_passthrough"
            ]
        },
        {
            "id": "aov",
            "name": "Average Order Value",
            "unit": "₹",
            "drivers": ["full_price_sell_through", "markdown_policy"]
        },
        {
            "id": "upt",
            "name": "Units Per Transaction",
            "unit": "units/basket",
            "drivers": ["promotions", "category_mix"]
        }
    ]
}


def get_kpi_lineage(kpi_id: str) -> Dict[str, Any]:
    """Retrieve upstream parents, siblings, and downstream drivers for a KPI."""
    for branch in MASTER_DECOMPOSITION["primary_branches"]:
        if branch["id"] == kpi_id:
            return {
                "kpi": kpi_id,
                "parent": MASTER_DECOMPOSITION["root"],
                "siblings": [b["id"] for b in MASTER_DECOMPOSITION["primary_branches"] if b["id"] != kpi_id],
                "drivers": branch["drivers"],
                "master_equation": MASTER_DECOMPOSITION["equation"]
            }
    return {
        "kpi": kpi_id,
        "parent": "conversion_rate",
        "siblings": [],
        "drivers": [],
        "master_equation": "Sub-component"
    }
