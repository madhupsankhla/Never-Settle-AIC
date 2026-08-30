"""
Config-Driven Synthetic Data Generator for SoleSight.
Generates a coherent 12-week retail dataset (2026-W22 to 2026-W33) featuring:
- Hero Scenario: STORE-014 conversion drop in 2026-W33 caused by SKU-1042 size-curve stockout + weaker staffing shift.
- Abstention Scenario: STORE-003 contradictory / low-confidence data.
- Sparse SKU: SKU-9901 newly launched with only 2 weeks of history.
- Tier 1 (internal) + Tier 2 (simulated external) tables.
"""
from typing import Dict, List, Any
from datetime import datetime, timedelta
import numpy as np
import pandas as pd


class SyntheticDataGenerator:
    def __init__(self, seed: int = 42):
        np.random.seed(seed)
        self.stores_data = [
            {"store_id": "STORE-001", "region": "North", "city_tier": "Tier-1", "square_footage": 4500, "format": "Flagship", "mall_or_high_street": "Mall", "opening_date": "2021-03-15"},
            {"store_id": "STORE-002", "region": "North", "city_tier": "Tier-2", "square_footage": 2800, "format": "Standard", "mall_or_high_street": "High Street", "opening_date": "2022-06-10"},
            {"store_id": "STORE-003", "region": "North", "city_tier": "Tier-1", "square_footage": 3600, "format": "Standard", "mall_or_high_street": "Mall", "opening_date": "2020-11-01"}, # Abstention target
            {"store_id": "STORE-004", "region": "South", "city_tier": "Tier-1", "square_footage": 5000, "format": "Flagship", "mall_or_high_street": "Mall", "opening_date": "2019-08-20"},
            {"store_id": "STORE-005", "region": "South", "city_tier": "Tier-2", "square_footage": 2500, "format": "Express", "mall_or_high_street": "High Street", "opening_date": "2023-01-15"},
            {"store_id": "STORE-007", "region": "South", "city_tier": "Tier-2", "square_footage": 3100, "format": "Standard", "mall_or_high_street": "Mall", "opening_date": "2022-09-01"}, # Sparse SKU target
            {"store_id": "STORE-011", "region": "West", "city_tier": "Tier-1", "square_footage": 4200, "format": "Standard", "mall_or_high_street": "Mall", "opening_date": "2021-04-12"},
            {"store_id": "STORE-012", "region": "West", "city_tier": "Tier-2", "square_footage": 2900, "format": "Standard", "mall_or_high_street": "High Street", "opening_date": "2022-10-05"},
            {"store_id": "STORE-014", "region": "West", "city_tier": "Tier-1", "square_footage": 4800, "format": "Flagship", "mall_or_high_street": "Mall", "opening_date": "2020-02-18"}, # Hero scenario target
            {"store_id": "STORE-015", "region": "West", "city_tier": "Tier-1", "square_footage": 3900, "format": "Standard", "mall_or_high_street": "Mall", "opening_date": "2021-07-22"},
        ]

        self.products_data = [
            {"sku_id": "SKU-1042", "style_name": "AeroGlide Runner Pro", "category": "Running", "tier": "Premium", "list_price": 8999.0, "launch_date": "2024-01-10", "size_range": "6,7,8,9,10,11", "materials": "Breathable Mesh, Carbon Plate"},
            {"sku_id": "SKU-1010", "style_name": "StreetCraft Classic Sneaker", "category": "Lifestyle", "tier": "Core", "list_price": 5499.0, "launch_date": "2023-05-15", "size_range": "6,7,8,9,10,11", "materials": "Full-grain Leather"},
            {"sku_id": "SKU-1088", "style_name": "HyperCourt Basketball Mid", "category": "Basketball", "tier": "Premium", "list_price": 10999.0, "launch_date": "2024-03-01", "size_range": "7,8,9,10,11,12", "materials": "Knit Upper, Zoom Air"},
            {"sku_id": "SKU-1025", "style_name": "TrailPulse All-Terrain", "category": "Outdoor", "tier": "Core", "list_price": 6999.0, "launch_date": "2023-09-20", "size_range": "6,7,8,9,10,11", "materials": "Vibram Rubber, GORE-TEX"},
            {"sku_id": "SKU-1055", "style_name": "FlexTraining Trainer Lite", "category": "Training", "tier": "Entry", "list_price": 3999.0, "launch_date": "2024-02-10", "size_range": "6,7,8,9,10,11", "materials": "Synthetic Mesh"},
            {"sku_id": "SKU-9901", "style_name": "SupraNova Velocity 1", "category": "Running", "tier": "Innovation", "list_price": 12999.0, "launch_date": "2026-08-01", "size_range": "7,8,9,10,11", "materials": "PEBA Foam, Supercritical Knit"}, # Sparse
        ]

    def generate_all(self, start_date: str = "2026-06-01", end_date: str = "2026-08-23") -> Dict[str, pd.DataFrame]:
        """Generate all tables and return as dict of DataFrames."""
        dates = pd.date_range(start=start_date, end=end_date, freq="D")
        dim_store = pd.DataFrame(self.stores_data)
        dim_product = pd.DataFrame(self.products_data)

        # 1. Staff
        staff_records = []
        schedule_records = []
        staff_counter = 1
        for s in self.stores_data:
            store_id = s["store_id"]
            num_staff = 6 if s["format"] == "Flagship" else 4
            store_staff_ids = []
            for _ in range(num_staff):
                sid = f"STF-{staff_counter:04d}"
                staff_counter += 1
                store_staff_ids.append(sid)
                staff_records.append({
                    "staff_id": sid,
                    "store_id": store_id,
                    "role": "Sales Associate" if _ > 1 else ("Store Manager" if _ == 0 else "Assistant Manager"),
                    "tenure_days": int(np.random.randint(90, 900)),
                })

            for d in dates:
                d_str = d.strftime("%Y-%m-%d")
                week_num = d.isocalendar()[1]
                # Hero scenario: STORE-014 in week 33 had a temporary drop in trained shift coverage
                is_hero_week = (store_id == "STORE-014" and week_num == 33)
                for sid in store_staff_ids:
                    # Scheduled hours
                    hours = 8.0 if np.random.rand() > 0.2 else 0.0
                    if hours > 0:
                        train_prob = 0.65 if is_hero_week else 0.88
                        schedule_records.append({
                            "schedule_id": f"SCH-{store_id}-{d_str}-{sid}",
                            "staff_id": sid,
                            "store_id": store_id,
                            "date": d_str,
                            "hours_worked": hours,
                            "training_completion_flag": bool(np.random.rand() < train_prob)
                        })

        dim_staff = pd.DataFrame(staff_records)
        fact_staff_schedule = pd.DataFrame(schedule_records)

        # 2. Footfall & POS Transactions
        footfall_records = []
        transaction_records = []
        tx_counter = 100000

        # Pre-assign standard size curve
        sizes_list = [6, 7, 8, 9, 10, 11]

        for d in dates:
            d_str = d.strftime("%Y-%m-%d")
            week_str = f"{d.year}-W{d.isocalendar()[1]:02d}"
            week_num = d.isocalendar()[1]
            is_weekend = d.weekday() >= 5

            for s in self.stores_data:
                store_id = s["store_id"]
                base_ff = 550 if s["format"] == "Flagship" else 350
                if is_weekend:
                    base_ff *= 1.45

                # Normal random fluctuation
                daily_ff = int(np.random.normal(base_ff, base_ff * 0.08))
                if store_id == "STORE-014" and week_num == 33:
                    # Hero: footfall is stable (+1.2%)
                    daily_ff = int(daily_ff * 1.012)

                footfall_records.append({
                    "store_id": store_id,
                    "date": d_str,
                    "entries_count": max(daily_ff, 50)
                })

                # Base conversion rate ~18.5%
                base_cr = 0.185
                if store_id == "STORE-014" and week_num == 33:
                    # Hero: conversion drops ~14.2% -> ~15.87%
                    base_cr = 0.1587
                elif store_id == "STORE-003" and week_num == 33:
                    # Abstention: conversion drop without identifiable cause
                    base_cr = 0.1600

                tx_count = int(daily_ff * base_cr)
                for _ in range(tx_count):
                    tx_counter += 1
                    # Pick SKU: SKU-1042 is high volume
                    p_weights = [0.35, 0.25, 0.15, 0.10, 0.10, 0.05]
                    prod = np.random.choice(self.products_data, p=p_weights)
                    sku_id = prod["sku_id"]

                    # If STORE-014 in week 33 and SKU-1042, sizes 8 and 9 are stocked out!
                    # So customer buys alternative size or leaves (conversion drop reflects lost sales)
                    if store_id == "STORE-014" and week_num == 33 and sku_id == "SKU-1042":
                        # Only sizes 6, 7, 10, 11 available
                        chosen_size = np.random.choice([6, 7, 10, 11])
                    else:
                        chosen_size = np.random.choice(sizes_list, p=[0.10, 0.15, 0.30, 0.25, 0.12, 0.08])

                    list_p = prod["list_price"]
                    # Most full price (sell-through)
                    discount_pct = 0.0 if np.random.rand() > 0.12 else np.random.choice([0.10, 0.15, 0.20])
                    disc_amt = round(list_p * discount_pct, 2)
                    net_p = list_p - disc_amt

                    transaction_records.append({
                        "transaction_id": f"TXN-{tx_counter}",
                        "store_id": store_id,
                        "date_time": f"{d_str}T{np.random.randint(10, 21):02d}:{np.random.randint(0, 59):02d}:00Z",
                        "sku_id": sku_id,
                        "size": chosen_size,
                        "qty": 1,
                        "list_price": list_p,
                        "discount_amount": disc_amt,
                        "net_price": net_p,
                        "payment_method": np.random.choice(["Credit Card", "UPI", "Cash"], p=[0.55, 0.35, 0.10]),
                        "staff_id": f"STF-{np.random.randint(1, len(staff_records)+1):04d}",
                        "loyalty_id": f"CUST-{np.random.randint(1000, 9999)}" if np.random.rand() > 0.4 else None
                    })

        fact_footfall = pd.DataFrame(footfall_records)
        fact_transactions = pd.DataFrame(transaction_records)

        # 3. Weekly Inventory Snapshots (with 2-day stale refresh date)
        inventory_records = []
        weekly_sundays = pd.date_range(start=start_date, end=end_date, freq="W-SUN")
        for s_date in weekly_sundays:
            snap_date = s_date.strftime("%Y-%m-%d")
            week_num = s_date.isocalendar()[1]
            for s in self.stores_data:
                store_id = s["store_id"]
                for p in self.products_data:
                    sku_id = p["sku_id"]
                    # Sparse SKU launched only on week 31
                    if sku_id == "SKU-9901" and week_num < 31:
                        continue

                    for sz in sizes_list:
                        # Stockout logic for hero scenario
                        if store_id == "STORE-014" and sku_id == "SKU-1042" and sz in [8, 9] and week_num in [32, 33]:
                            on_hand = 0
                            is_stockout = True
                            incoming_po = "PO-9941"
                            expected_restock = (s_date + timedelta(days=6)).strftime("%Y-%m-%d")
                        else:
                            on_hand = int(np.random.randint(3, 18))
                            is_stockout = False
                            incoming_po = None
                            expected_restock = None

                        inventory_records.append({
                            "snapshot_date": snap_date,
                            "store_id": store_id,
                            "sku_id": sku_id,
                            "size": sz,
                            "on_hand_units": on_hand,
                            "incoming_po_id": incoming_po,
                            "expected_restock_date": expected_restock,
                            "is_stockout": is_stockout
                        })

        fact_inventory_snapshot = pd.DataFrame(inventory_records)

        # 4. Returns
        return_records = []
        ret_counter = 1000
        for tx in transaction_records[:int(len(transaction_records) * 0.06)]: # ~6% return rate
            ret_counter += 1
            reason = np.random.choice(
                ["FIT_TOO_SMALL", "FIT_TOO_LARGE", "WRONG_SIZE", "STYLE_REGRET", "DEFECT"],
                p=[0.35, 0.25, 0.20, 0.15, 0.05]
            )
            tx_dt = datetime.fromisoformat(tx["date_time"].replace("Z", "+00:00"))
            ret_dt = (tx_dt + timedelta(days=int(np.random.randint(2, 14)))).strftime("%Y-%m-%d")
            return_records.append({
                "return_id": f"RET-{ret_counter}",
                "original_transaction_id": tx["transaction_id"],
                "store_id": tx["store_id"],
                "sku_id": tx["sku_id"],
                "size": tx["size"],
                "return_reason_code": reason,
                "return_type": "Store Return",
                "date": ret_dt
            })
        fact_returns = pd.DataFrame(return_records)

        # 5. Mystery Shopper (Monthly cadence, genuinely sparse)
        mystery_records = []
        months = ["2026-06-01", "2026-07-01", "2026-08-01"]
        audit_id = 1
        for m in months:
            for s in self.stores_data:
                audit_id += 1
                base_score = 88.0
                if s["store_id"] == "STORE-014" and m == "2026-08-01":
                    base_score = 81.0  # slight drop corroborating staff training
                mystery_records.append({
                    "audit_id": f"AUD-{audit_id:04d}",
                    "store_id": s["store_id"],
                    "date": m,
                    "overall_score": float(np.clip(np.random.normal(base_score, 4.0), 60.0, 100.0)),
                    "sizing_guidance_score": float(np.clip(np.random.normal(base_score - 2.0, 5.0), 55.0, 100.0)),
                    "tags": "friendly, sizing_assistance_slow" if base_score < 85 else "clean, attentive"
                })
        fact_mystery_shopper = pd.DataFrame(mystery_records)

        # 6. Purchase Orders
        po_records = [
            {"po_id": "PO-9941", "store_id": "STORE-014", "sku_id": "SKU-1042", "qty_ordered": 400, "order_date": "2026-08-02", "expected_delivery_date": "2026-08-16", "actual_delivery_date": "2026-08-25", "supplier_id": "SUP-101"},
            {"po_id": "PO-8812", "store_id": "STORE-001", "sku_id": "SKU-1010", "qty_ordered": 200, "order_date": "2026-07-15", "expected_delivery_date": "2026-07-28", "actual_delivery_date": "2026-07-27", "supplier_id": "SUP-102"},
        ]
        fact_purchase_orders = pd.DataFrame(po_records)

        # 7. Pricing & Margins (COGS)
        cost_records = []
        for p in self.products_data:
            cogs = round(p["list_price"] * 0.42, 2)
            cost_records.append({
                "sku_id": p["sku_id"],
                "cogs_per_unit": cogs,
                "target_margin_pct": 58.0,
                "min_allowed_discount_pct": 0.0,
                "max_allowed_discount_pct": 30.0
            })
        dim_pricing = pd.DataFrame(cost_records)

        # 8. Promotions
        dim_promotions = pd.DataFrame([
            {"promo_id": "PR-SUMMER26", "scope": "Network", "sku_scope": "Lifestyle", "start_date": "2026-06-15", "end_date": "2026-06-30", "discount_depth": 0.15, "promo_type": "Category Sale"},
            {"promo_id": "PR-MONSOON26", "scope": "West", "sku_scope": "Outdoor", "start_date": "2026-07-10", "end_date": "2026-07-24", "discount_depth": 0.20, "promo_type": "Regional Clearance"}
        ])

        # 9. Customers
        dim_customer = pd.DataFrame([
            {"customer_id": f"CUST-{i}", "enrollment_date": "2023-01-01", "home_store_id": "STORE-014" if i % 2 == 0 else "STORE-001", "lifetime_purchases": 5, "lifetime_value": 42000.0}
            for i in range(1000, 1050)
        ])

        # 10. Tier 2 Simulated External Tables
        ext_policy_events = pd.DataFrame([
            {"event_id": "POL-2026-01", "event_type": "GST_RATE_REVISION", "effective_date": "2026-07-01", "description": "Footwear GST slab revision above INR 10,000", "scope": "National"}
        ])

        ext_competitor_pricing = pd.DataFrame([
            {"competitor_name": "SoleSpeed", "comparable_sku_category": "Running", "price": 8499.0, "promo_active": False, "date_observed": "2026-08-15", "region": "West"},
            {"competitor_name": "UrbanKicks", "comparable_sku_category": "Lifestyle", "price": 5299.0, "promo_active": True, "date_observed": "2026-08-15", "region": "West"},
            {"competitor_name": "SoleSpeed", "comparable_sku_category": "Running", "price": 8499.0, "promo_active": False, "date_observed": "2026-08-15", "region": "North"},
        ])

        weather_records = []
        for d in dates:
            d_str = d.strftime("%Y-%m-%d")
            for reg in ["North", "South", "West"]:
                weather_records.append({
                    "region": reg,
                    "date": d_str,
                    "temperature": float(np.random.normal(31.0, 2.5)),
                    "precipitation_mm": float(np.random.exponential(1.5)),
                    "extreme_weather_flag": False
                })
        ext_weather = pd.DataFrame(weather_records)

        ext_local_events = pd.DataFrame([
            {"event_name": "City Marathon Expo", "event_type": "Sports", "region": "West", "date": "2026-08-08", "relevance_category": "Running"},
            {"event_name": "Regional Trade Fair", "event_type": "Commercial", "region": "North", "date": "2026-07-18", "relevance_category": "All"}
        ])

        review_records = []
        for i in range(1, 150):
            sku = "SKU-1042" if i % 3 == 0 else "SKU-1010"
            is_fit = bool(i % 4 == 0)
            review_records.append({
                "review_id": f"REV-{i:04d}",
                "source": "Online Portal",
                "store_id": "STORE-014" if i % 2 == 0 else "STORE-001",
                "sku_id": sku,
                "rating": 4 if not is_fit else 2,
                "text": "Runs narrow in size 8-9, needed half size up" if is_fit else "Great cushioning and build quality",
                "sentiment_score": -0.45 if is_fit else 0.82,
                "fit_related_flag": is_fit,
                "date": (datetime.strptime(end_date, "%Y-%m-%d") - timedelta(days=i % 60)).strftime("%Y-%m-%d")
            })
        ext_reviews = pd.DataFrame(review_records)

        campaign_records = [
            {"campaign_id": "CMP-2026-001", "campaign_name": "Spring Running Season Kickoff", "scope": "national", "store_id": None, "region": "National", "sku_scope": "FW-001;FW-002;FW-003", "channel": "social", "start_date": "2026-03-01", "end_date": "2026-03-20", "discount_depth_pct": 10.0, "spend_amount": 650000.0},
            {"campaign_id": "CMP-2026-002", "campaign_name": "Marathon Pro Store Trial Days", "scope": "region", "store_id": None, "region": "West", "sku_scope": "FW-001", "channel": "in-store", "start_date": "2026-03-05", "end_date": "2026-03-15", "discount_depth_pct": 5.0, "spend_amount": 180000.0},
            {"campaign_id": "CMP-2026-003", "campaign_name": "Trail Blazer Weekend Feature", "scope": "region", "store_id": None, "region": "West", "sku_scope": "FW-003", "channel": "email", "start_date": "2026-03-08", "end_date": "2026-03-22", "discount_depth_pct": 8.0, "spend_amount": 210000.0},
            {"campaign_id": "CMP-2026-004", "campaign_name": "Comfort Walk Everyday Push", "scope": "national", "store_id": None, "region": "National", "sku_scope": "FW-005", "channel": "social", "start_date": "2026-03-12", "end_date": "2026-03-31", "discount_depth_pct": 10.0, "spend_amount": 300000.0},
            {"campaign_id": "CMP-2026-005", "campaign_name": "Grip Trainer Gym Partnership", "scope": "region", "store_id": None, "region": "West", "sku_scope": "FW-004", "channel": "influencer", "start_date": "2026-03-18", "end_date": "2026-04-05", "discount_depth_pct": 12.0, "spend_amount": 260000.0},
            {"campaign_id": "CMP-2026-007", "campaign_name": "April Fools Flash Sale", "scope": "national", "store_id": None, "region": "National", "sku_scope": "FW-002;FW-003", "channel": "social", "start_date": "2026-04-01", "end_date": "2026-04-03", "discount_depth_pct": 25.0, "spend_amount": 300000.0},
            {"campaign_id": "CMP-2026-006", "campaign_name": "Summer Track Nitro Speed Challenge", "scope": "national", "store_id": None, "region": "National", "sku_scope": "FW-001;FW-002", "channel": "social", "start_date": "2026-04-10", "end_date": "2026-04-30", "discount_depth_pct": 15.0, "spend_amount": 820000.0},
            {"campaign_id": "CMP-2026-008", "campaign_name": "Marathon Prep Series - Mumbai", "scope": "local", "store_id": "STORE-001", "region": "Mumbai High Street", "sku_scope": "FW-001", "channel": "in-store", "start_date": "2026-04-12", "end_date": "2026-04-26", "discount_depth_pct": 8.0, "spend_amount": 150000.0},
            {"campaign_id": "CMP-2026-010", "campaign_name": "Pune Running Club Meetup Sponsorship", "scope": "local", "store_id": "STORE-005", "region": "Pune FC Road", "sku_scope": "FW-001;FW-002", "channel": "local ads", "start_date": "2026-04-18", "end_date": "2026-04-28", "discount_depth_pct": 10.0, "spend_amount": 120000.0},
            {"campaign_id": "CMP-2026-011", "campaign_name": "Ahmedabad Store Anniversary Sale", "scope": "local", "store_id": "STORE-006", "region": "Ahmedabad Palladium", "sku_scope": "FW-001;FW-003;FW-004;FW-005", "channel": "in-store", "start_date": "2026-04-20", "end_date": "2026-05-05", "discount_depth_pct": 15.0, "spend_amount": 200000.0},
            {"campaign_id": "CMP-2026-013", "campaign_name": "Nitro Speed National Push", "scope": "national", "store_id": None, "region": "National", "sku_scope": "FW-002", "channel": "social", "start_date": "2026-05-01", "end_date": "2026-05-20", "discount_depth_pct": 12.0, "spend_amount": 500000.0},
            {"campaign_id": "CMP-2026-014", "campaign_name": "Summer Trail Adventure Teaser", "scope": "national", "store_id": None, "region": "National", "sku_scope": "FW-003", "channel": "email", "start_date": "2026-05-05", "end_date": "2026-05-25", "discount_depth_pct": 10.0, "spend_amount": 280000.0},
            {"campaign_id": "CMP-2026-015", "campaign_name": "Grip Trainer Summer Fitness Drive", "scope": "region", "store_id": None, "region": "West", "sku_scope": "FW-004", "channel": "influencer", "start_date": "2026-05-10", "end_date": "2026-05-31", "discount_depth_pct": 15.0, "spend_amount": 310000.0},
            {"campaign_id": "CMP-2026-009", "campaign_name": "Nitro Running City Blitz (West Region)", "scope": "region", "store_id": None, "region": "West", "sku_scope": "FW-001;FW-002", "channel": "social", "start_date": "2026-05-15", "end_date": "2026-06-15", "discount_depth_pct": 15.0, "spend_amount": 450000.0},
            {"campaign_id": "CMP-2026-012", "campaign_name": "National Early Monsoon Teaser", "scope": "national", "store_id": None, "region": "National", "sku_scope": "FW-002;FW-004", "channel": "email", "start_date": "2026-05-22", "end_date": "2026-06-05", "discount_depth_pct": 18.0, "spend_amount": 540000.0},
            {"campaign_id": "CMP-2026-016", "campaign_name": "West Region Marathon Pro Restock Teaser", "scope": "region", "store_id": None, "region": "West", "sku_scope": "FW-001", "channel": "email", "start_date": "2026-05-28", "end_date": "2026-06-10", "discount_depth_pct": 5.0, "spend_amount": 90000.0},
            {"campaign_id": "CMP-2026-018", "campaign_name": "Mid-Monsoon Comfort Walk Feature", "scope": "national", "store_id": None, "region": "National", "sku_scope": "FW-005", "channel": "social", "start_date": "2026-06-01", "end_date": "2026-06-20", "discount_depth_pct": 12.0, "spend_amount": 260000.0},
            {"campaign_id": "CMP-2026-019", "campaign_name": "Grip Trainer Monsoon Gym Push", "scope": "national", "store_id": None, "region": "National", "sku_scope": "FW-004", "channel": "email", "start_date": "2026-06-08", "end_date": "2026-06-25", "discount_depth_pct": 10.0, "spend_amount": 240000.0},
            {"campaign_id": "CMP-2026-023", "campaign_name": "Trail Blazer Rains Ready Campaign", "scope": "national", "store_id": None, "region": "National", "sku_scope": "FW-003", "channel": "social", "start_date": "2026-06-15", "end_date": "2026-07-05", "discount_depth_pct": 15.0, "spend_amount": 330000.0},
            {"campaign_id": "CMP-2026-024", "campaign_name": "Pune DC Priority Restock Alert", "scope": "local", "store_id": "STORE-005", "region": "Pune FC Road", "sku_scope": "FW-001", "channel": "local ads", "start_date": "2026-06-25", "end_date": "2026-07-10", "discount_depth_pct": 0.0, "spend_amount": 95000.0},
            {"campaign_id": "CMP-2026-017", "campaign_name": "Monsoon Running End of Season Sale", "scope": "national", "store_id": None, "region": "National", "sku_scope": "FW-001;FW-002;FW-003;FW-004", "channel": "social", "start_date": "2026-07-01", "end_date": "2026-07-31", "discount_depth_pct": 20.0, "spend_amount": 1200000.0},
            {"campaign_id": "CMP-2026-025", "campaign_name": "July Payday Weekend Sale", "scope": "national", "store_id": None, "region": "National", "sku_scope": "All Catalog", "channel": "social", "start_date": "2026-07-04", "end_date": "2026-07-06", "discount_depth_pct": 20.0, "spend_amount": 400000.0},
            {"campaign_id": "CMP-2026-026", "campaign_name": "Nitro Speed Mid-Monsoon Refresh", "scope": "national", "store_id": None, "region": "National", "sku_scope": "FW-002", "channel": "email", "start_date": "2026-07-08", "end_date": "2026-07-22", "discount_depth_pct": 15.0, "spend_amount": 360000.0},
            {"campaign_id": "CMP-2026-020", "campaign_name": "West Region DC Replenishment Hero Push", "scope": "region", "store_id": None, "region": "West", "sku_scope": "FW-001", "channel": "local ads", "start_date": "2026-07-20", "end_date": "2026-07-31", "discount_depth_pct": 0.0, "spend_amount": 220000.0},
            {"campaign_id": "CMP-2026-027", "campaign_name": "Mumbai Store Restock Celebration", "scope": "local", "store_id": "STORE-001", "region": "Mumbai High Street", "sku_scope": "FW-001", "channel": "in-store", "start_date": "2026-07-25", "end_date": "2026-08-02", "discount_depth_pct": 10.0, "spend_amount": 130000.0},
            {"campaign_id": "CMP-2026-028", "campaign_name": "Comfort Walk Rakhi Gifting Teaser", "scope": "national", "store_id": None, "region": "National", "sku_scope": "FW-005", "channel": "social", "start_date": "2026-07-28", "end_date": "2026-08-09", "discount_depth_pct": 10.0, "spend_amount": 220000.0},
            {"campaign_id": "CMP-2026-021", "campaign_name": "Independence Freedom Run Exclusive", "scope": "national", "store_id": None, "region": "National", "sku_scope": "All Catalog", "channel": "email", "start_date": "2026-08-01", "end_date": "2026-08-18", "discount_depth_pct": 18.0, "spend_amount": 950000.0},
            {"campaign_id": "CMP-2026-029", "campaign_name": "Grip Trainer Back-to-Fitness Push", "scope": "national", "store_id": None, "region": "National", "sku_scope": "FW-004", "channel": "influencer", "start_date": "2026-08-05", "end_date": "2026-08-20", "discount_depth_pct": 12.0, "spend_amount": 300000.0},
            {"campaign_id": "CMP-2026-030", "campaign_name": "West Region Marathon Pro Stock Confidence Drive", "scope": "region", "store_id": None, "region": "West", "sku_scope": "FW-001;FW-002", "channel": "local ads", "start_date": "2026-08-08", "end_date": "2026-08-22", "discount_depth_pct": 8.0, "spend_amount": 210000.0},
            {"campaign_id": "CMP-2026-022", "campaign_name": "Raksha Bandhan Athletic Gifting Showcase", "scope": "national", "store_id": None, "region": "National", "sku_scope": "FW-002;FW-004;FW-005", "channel": "social", "start_date": "2026-08-10", "end_date": "2026-08-25", "discount_depth_pct": 15.0, "spend_amount": 720000.0},
            {"campaign_id": "CMP-2026-031", "campaign_name": "Trail Blazer Monsoon Farewell Sale", "scope": "national", "store_id": None, "region": "National", "sku_scope": "FW-003", "channel": "social", "start_date": "2026-08-15", "end_date": "2026-08-29", "discount_depth_pct": 15.0, "spend_amount": 280000.0},
            {"campaign_id": "CMP-2026-032", "campaign_name": "August Payday Weekend Flash Sale", "scope": "national", "store_id": None, "region": "National", "sku_scope": "All Catalog", "channel": "email", "start_date": "2026-08-28", "end_date": "2026-08-31", "discount_depth_pct": 22.0, "spend_amount": 380000.0},
        ]
        fact_campaigns = pd.DataFrame(campaign_records)

        return {
            "dim_store": dim_store,
            "dim_product": dim_product,
            "dim_staff": dim_staff,
            "fact_staff_schedule": fact_staff_schedule,
            "fact_transactions": fact_transactions,
            "fact_inventory_snapshot": fact_inventory_snapshot,
            "fact_footfall": fact_footfall,
            "fact_returns": fact_returns,
            "fact_mystery_shopper": fact_mystery_shopper,
            "fact_purchase_orders": fact_purchase_orders,
            "dim_pricing": dim_pricing,
            "dim_promotions": dim_promotions,
            "dim_customer": dim_customer,
            "ext_policy_events": ext_policy_events,
            "ext_competitor_pricing": ext_competitor_pricing,
            "ext_weather": ext_weather,
            "ext_local_events": ext_local_events,
            "ext_reviews": ext_reviews,
            "fact_reviews": ext_reviews,
            "fact_campaigns": fact_campaigns,
        }
