import rawDataset from './excelDataset6Mo.json';
import type { TabularAuditRecord } from '../types/retailRcaTypes';

export interface Excel6MoAuditRecord {
  store_id: string;
  region: string;
  store_format: string;
  mall_or_high_street: string;
  sku_id: string;
  sku_name: string;
  category: string;
  list_price: number;
  period_month: string;
  period_week: string;
  footfall: number;
  conversions: number;
  conversion_rate_pct: number;
  size_fill_rate_pct: number;
  revenue_lakhs: number;
  loss_estimate_lakhs: number;
  primary_root_cause: string;
}

export interface DimStoreRecord {
  store_id: string;
  region: string;
  city_tier: string;
  square_footage: number;
  format: string;
  mall_or_high_street: string;
  opening_date: string;
}

export interface DimProductRecord {
  sku_id: string;
  style_name: string;
  product_type: string;
  category: string;
  tier: string;
  list_price: number;
  size_range: string;
  launch_date: string;
}

export interface FactPosRecord {
  transaction_id: string;
  store_id: string;
  date_time: string;
  sku_id: string;
  product_type: string;
  size: string;
  qty: number;
  list_price: number;
  discount_pct: number;
  net_price: number;
  payment_method: string;
  bought_nonpreferred_size_flag: boolean;
}

export interface FactMysteryShopperRecord {
  audit_id: string;
  store_id: string;
  date: string;
  overall_score: number;
  sizing_guidance_score: number;
  tags: string | null;
}

export interface FactReturnsRecord {
  return_id: string;
  original_transaction_id: string;
  store_id: string;
  sku_id: string;
  size: string;
  return_reason_code: string;
  return_type: string;
  date: string;
  days_since_purchase: number;
}

export interface FactInventoryRecord {
  snapshot_date: string;
  snapshot_date_reported: string;
  store_id: string;
  sku_id: string;
  size: string;
  on_hand_units: number;
  is_stockout: boolean;
}

export interface FactCampaignRecord {
  campaign_id: string;
  campaign_name: string;
  scope: 'store' | 'region' | 'national' | 'local' | string;
  store_id?: string | null;
  region?: string | null;
  sku_scope: string[] | null;
  channel: 'in-store' | 'local ads' | 'social' | 'email' | 'influencer' | string;
  start_date: string;
  end_date: string;
  discount_depth_pct: number;
  spend_amount: number;
}

export interface FactReviewRecord {
  review_id: string;
  store_id: string;
  sku_id: string;
  date: string;
  rating: number; // 1-5
  sentiment: 'positive' | 'neutral' | 'negative' | string;
  fit_related_flag: boolean;
  review_text?: string;
}

export const FACT_CAMPAIGNS_DATASET: FactCampaignRecord[] = [
  {
    "campaign_id": "CMP-2026-001",
    "campaign_name": "Spring Running Season Kickoff",
    "scope": "national",
    "store_id": null,
    "region": null,
    "sku_scope": [
      "FW-001",
      "FW-002",
      "FW-003"
    ],
    "channel": "social",
    "start_date": "2026-03-01",
    "end_date": "2026-03-20",
    "discount_depth_pct": 10.0,
    "spend_amount": 650000.0
  },
  {
    "campaign_id": "CMP-2026-002",
    "campaign_name": "Marathon Pro Store Trial Days",
    "scope": "region",
    "store_id": null,
    "region": "West",
    "sku_scope": [
      "FW-001"
    ],
    "channel": "in-store",
    "start_date": "2026-03-05",
    "end_date": "2026-03-15",
    "discount_depth_pct": 5.0,
    "spend_amount": 180000.0
  },
  {
    "campaign_id": "CMP-2026-003",
    "campaign_name": "Trail Blazer Weekend Feature",
    "scope": "region",
    "store_id": null,
    "region": "West",
    "sku_scope": [
      "FW-003"
    ],
    "channel": "email",
    "start_date": "2026-03-08",
    "end_date": "2026-03-22",
    "discount_depth_pct": 8.0,
    "spend_amount": 210000.0
  },
  {
    "campaign_id": "CMP-2026-004",
    "campaign_name": "Comfort Walk Everyday Push",
    "scope": "national",
    "store_id": null,
    "region": null,
    "sku_scope": [
      "FW-005"
    ],
    "channel": "social",
    "start_date": "2026-03-12",
    "end_date": "2026-03-31",
    "discount_depth_pct": 10.0,
    "spend_amount": 300000.0
  },
  {
    "campaign_id": "CMP-2026-005",
    "campaign_name": "Grip Trainer Gym Partnership",
    "scope": "region",
    "store_id": null,
    "region": "West",
    "sku_scope": [
      "FW-004"
    ],
    "channel": "influencer",
    "start_date": "2026-03-18",
    "end_date": "2026-04-05",
    "discount_depth_pct": 12.0,
    "spend_amount": 260000.0
  },
  {
    "campaign_id": "CMP-2026-007",
    "campaign_name": "April Fools Flash Sale",
    "scope": "national",
    "store_id": null,
    "region": null,
    "sku_scope": [
      "FW-002",
      "FW-003"
    ],
    "channel": "social",
    "start_date": "2026-04-01",
    "end_date": "2026-04-03",
    "discount_depth_pct": 25.0,
    "spend_amount": 300000.0
  },
  {
    "campaign_id": "CMP-2026-006",
    "campaign_name": "Summer Track Nitro Speed Challenge",
    "scope": "national",
    "store_id": null,
    "region": null,
    "sku_scope": [
      "FW-001",
      "FW-002"
    ],
    "channel": "social",
    "start_date": "2026-04-10",
    "end_date": "2026-04-30",
    "discount_depth_pct": 15.0,
    "spend_amount": 820000.0
  },
  {
    "campaign_id": "CMP-2026-008",
    "campaign_name": "Marathon Prep Series - Mumbai",
    "scope": "local",
    "store_id": "STORE-001",
    "region": "West",
    "sku_scope": [
      "FW-001"
    ],
    "channel": "in-store",
    "start_date": "2026-04-12",
    "end_date": "2026-04-26",
    "discount_depth_pct": 8.0,
    "spend_amount": 150000.0
  },
  {
    "campaign_id": "CMP-2026-010",
    "campaign_name": "Pune Running Club Meetup Sponsorship",
    "scope": "local",
    "store_id": "STORE-005",
    "region": "West",
    "sku_scope": [
      "FW-001",
      "FW-002"
    ],
    "channel": "local ads",
    "start_date": "2026-04-18",
    "end_date": "2026-04-28",
    "discount_depth_pct": 10.0,
    "spend_amount": 120000.0
  },
  {
    "campaign_id": "CMP-2026-011",
    "campaign_name": "Ahmedabad Store Anniversary Sale",
    "scope": "local",
    "store_id": "STORE-006",
    "region": "West",
    "sku_scope": [
      "FW-001",
      "FW-003",
      "FW-004",
      "FW-005"
    ],
    "channel": "in-store",
    "start_date": "2026-04-20",
    "end_date": "2026-05-05",
    "discount_depth_pct": 15.0,
    "spend_amount": 200000.0
  },
  {
    "campaign_id": "CMP-2026-013",
    "campaign_name": "Nitro Speed National Push",
    "scope": "national",
    "store_id": null,
    "region": null,
    "sku_scope": [
      "FW-002"
    ],
    "channel": "social",
    "start_date": "2026-05-01",
    "end_date": "2026-05-20",
    "discount_depth_pct": 12.0,
    "spend_amount": 500000.0
  },
  {
    "campaign_id": "CMP-2026-014",
    "campaign_name": "Summer Trail Adventure Teaser",
    "scope": "national",
    "store_id": null,
    "region": null,
    "sku_scope": [
      "FW-003"
    ],
    "channel": "email",
    "start_date": "2026-05-05",
    "end_date": "2026-05-25",
    "discount_depth_pct": 10.0,
    "spend_amount": 280000.0
  },
  {
    "campaign_id": "CMP-2026-015",
    "campaign_name": "Grip Trainer Summer Fitness Drive",
    "scope": "region",
    "store_id": null,
    "region": "West",
    "sku_scope": [
      "FW-004"
    ],
    "channel": "influencer",
    "start_date": "2026-05-10",
    "end_date": "2026-05-31",
    "discount_depth_pct": 15.0,
    "spend_amount": 310000.0
  },
  {
    "campaign_id": "CMP-2026-009",
    "campaign_name": "Nitro Running City Blitz (West Region)",
    "scope": "region",
    "store_id": null,
    "region": "West",
    "sku_scope": [
      "FW-001",
      "FW-002"
    ],
    "channel": "social",
    "start_date": "2026-05-15",
    "end_date": "2026-06-15",
    "discount_depth_pct": 15.0,
    "spend_amount": 450000.0
  },
  {
    "campaign_id": "CMP-2026-012",
    "campaign_name": "National Early Monsoon Teaser",
    "scope": "national",
    "store_id": null,
    "region": null,
    "sku_scope": [
      "FW-002",
      "FW-004"
    ],
    "channel": "email",
    "start_date": "2026-05-22",
    "end_date": "2026-06-05",
    "discount_depth_pct": 18.0,
    "spend_amount": 540000.0
  },
  {
    "campaign_id": "CMP-2026-016",
    "campaign_name": "West Region Marathon Pro Restock Teaser",
    "scope": "region",
    "store_id": null,
    "region": "West",
    "sku_scope": [
      "FW-001"
    ],
    "channel": "email",
    "start_date": "2026-05-28",
    "end_date": "2026-06-10",
    "discount_depth_pct": 5.0,
    "spend_amount": 90000.0
  },
  {
    "campaign_id": "CMP-2026-018",
    "campaign_name": "Mid-Monsoon Comfort Walk Feature",
    "scope": "national",
    "store_id": null,
    "region": null,
    "sku_scope": [
      "FW-005"
    ],
    "channel": "social",
    "start_date": "2026-06-01",
    "end_date": "2026-06-20",
    "discount_depth_pct": 12.0,
    "spend_amount": 260000.0
  },
  {
    "campaign_id": "CMP-2026-019",
    "campaign_name": "Grip Trainer Monsoon Gym Push",
    "scope": "national",
    "store_id": null,
    "region": null,
    "sku_scope": [
      "FW-004"
    ],
    "channel": "email",
    "start_date": "2026-06-08",
    "end_date": "2026-06-25",
    "discount_depth_pct": 10.0,
    "spend_amount": 240000.0
  },
  {
    "campaign_id": "CMP-2026-023",
    "campaign_name": "Trail Blazer Rains Ready Campaign",
    "scope": "national",
    "store_id": null,
    "region": null,
    "sku_scope": [
      "FW-003"
    ],
    "channel": "social",
    "start_date": "2026-06-15",
    "end_date": "2026-07-05",
    "discount_depth_pct": 15.0,
    "spend_amount": 330000.0
  },
  {
    "campaign_id": "CMP-2026-024",
    "campaign_name": "Pune DC Priority Restock Alert",
    "scope": "local",
    "store_id": "STORE-005",
    "region": "West",
    "sku_scope": [
      "FW-001"
    ],
    "channel": "local ads",
    "start_date": "2026-06-25",
    "end_date": "2026-07-10",
    "discount_depth_pct": 0.0,
    "spend_amount": 95000.0
  },
  {
    "campaign_id": "CMP-2026-017",
    "campaign_name": "Monsoon Running End of Season Sale",
    "scope": "national",
    "store_id": null,
    "region": null,
    "sku_scope": [
      "FW-001",
      "FW-002",
      "FW-003",
      "FW-004"
    ],
    "channel": "social",
    "start_date": "2026-07-01",
    "end_date": "2026-07-31",
    "discount_depth_pct": 20.0,
    "spend_amount": 1200000.0
  },
  {
    "campaign_id": "CMP-2026-025",
    "campaign_name": "July Payday Weekend Sale",
    "scope": "national",
    "store_id": null,
    "region": null,
    "sku_scope": null,
    "channel": "social",
    "start_date": "2026-07-04",
    "end_date": "2026-07-06",
    "discount_depth_pct": 20.0,
    "spend_amount": 400000.0
  },
  {
    "campaign_id": "CMP-2026-026",
    "campaign_name": "Nitro Speed Mid-Monsoon Refresh",
    "scope": "national",
    "store_id": null,
    "region": null,
    "sku_scope": [
      "FW-002"
    ],
    "channel": "email",
    "start_date": "2026-07-08",
    "end_date": "2026-07-22",
    "discount_depth_pct": 15.0,
    "spend_amount": 360000.0
  },
  {
    "campaign_id": "CMP-2026-020",
    "campaign_name": "West Region DC Replenishment Hero Push",
    "scope": "region",
    "store_id": null,
    "region": "West",
    "sku_scope": [
      "FW-001"
    ],
    "channel": "local ads",
    "start_date": "2026-07-20",
    "end_date": "2026-07-31",
    "discount_depth_pct": 0.0,
    "spend_amount": 220000.0
  },
  {
    "campaign_id": "CMP-2026-027",
    "campaign_name": "Mumbai Store Restock Celebration",
    "scope": "local",
    "store_id": "STORE-001",
    "region": "West",
    "sku_scope": [
      "FW-001"
    ],
    "channel": "in-store",
    "start_date": "2026-07-25",
    "end_date": "2026-08-02",
    "discount_depth_pct": 10.0,
    "spend_amount": 130000.0
  },
  {
    "campaign_id": "CMP-2026-028",
    "campaign_name": "Comfort Walk Rakhi Gifting Teaser",
    "scope": "national",
    "store_id": null,
    "region": null,
    "sku_scope": [
      "FW-005"
    ],
    "channel": "social",
    "start_date": "2026-07-28",
    "end_date": "2026-08-09",
    "discount_depth_pct": 10.0,
    "spend_amount": 220000.0
  },
  {
    "campaign_id": "CMP-2026-021",
    "campaign_name": "Independence Freedom Run Exclusive",
    "scope": "national",
    "store_id": null,
    "region": null,
    "sku_scope": null,
    "channel": "email",
    "start_date": "2026-08-01",
    "end_date": "2026-08-18",
    "discount_depth_pct": 18.0,
    "spend_amount": 950000.0
  },
  {
    "campaign_id": "CMP-2026-029",
    "campaign_name": "Grip Trainer Back-to-Fitness Push",
    "scope": "national",
    "store_id": null,
    "region": null,
    "sku_scope": [
      "FW-004"
    ],
    "channel": "influencer",
    "start_date": "2026-08-05",
    "end_date": "2026-08-20",
    "discount_depth_pct": 12.0,
    "spend_amount": 300000.0
  },
  {
    "campaign_id": "CMP-2026-030",
    "campaign_name": "West Region Marathon Pro Stock Confidence Drive",
    "scope": "region",
    "store_id": null,
    "region": "West",
    "sku_scope": [
      "FW-001",
      "FW-002"
    ],
    "channel": "local ads",
    "start_date": "2026-08-08",
    "end_date": "2026-08-22",
    "discount_depth_pct": 8.0,
    "spend_amount": 210000.0
  },
  {
    "campaign_id": "CMP-2026-022",
    "campaign_name": "Raksha Bandhan Athletic Gifting Showcase",
    "scope": "national",
    "store_id": null,
    "region": null,
    "sku_scope": [
      "FW-002",
      "FW-004",
      "FW-005"
    ],
    "channel": "social",
    "start_date": "2026-08-10",
    "end_date": "2026-08-25",
    "discount_depth_pct": 15.0,
    "spend_amount": 720000.0
  },
  {
    "campaign_id": "CMP-2026-031",
    "campaign_name": "Trail Blazer Monsoon Farewell Sale",
    "scope": "national",
    "store_id": null,
    "region": null,
    "sku_scope": [
      "FW-003"
    ],
    "channel": "social",
    "start_date": "2026-08-15",
    "end_date": "2026-08-29",
    "discount_depth_pct": 15.0,
    "spend_amount": 280000.0
  },
  {
    "campaign_id": "CMP-2026-032",
    "campaign_name": "August Payday Weekend Flash Sale",
    "scope": "national",
    "store_id": null,
    "region": null,
    "sku_scope": null,
    "channel": "email",
    "start_date": "2026-08-28",
    "end_date": "2026-08-31",
    "discount_depth_pct": 22.0,
    "spend_amount": 380000.0
  }
];

export const FACT_REVIEWS_DATASET: FactReviewRecord[] = [
  {
    "review_id": "REV-2026-8002",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-03-01",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Mumbai store \u2014 Comfortable out of the box, no break-in period needed."
  },
  {
    "review_id": "REV-2026-8013",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-03-01",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Comfortable out of the box, no break-in period needed."
  },
  {
    "review_id": "REV-2026-8015",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-03-01",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Pune store \u2014 Fantastic cushioning, wore them for my long run this weekend and no complaints."
  },
  {
    "review_id": "REV-2026-8011",
    "store_id": "STORE-006",
    "sku_id": "FW-002",
    "date": "2026-03-02",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Perfect for my gym sessions, great grip and support."
  },
  {
    "review_id": "REV-2026-8019",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-03-02",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Pune store \u2014 Well stocked store, friendly staff, got the color and size I wanted."
  },
  {
    "review_id": "REV-2026-8007",
    "store_id": "STORE-005",
    "sku_id": "FW-003",
    "date": "2026-03-03",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Trail Blazer at Pune store \u2014 Store had my exact size in stock, walked out happy in under 5 minutes."
  },
  {
    "review_id": "REV-2026-8028",
    "store_id": "STORE-005",
    "sku_id": "FW-002",
    "date": "2026-03-03",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Nitro Speed at Pune store \u2014 Comfortable out of the box, no break-in period needed."
  },
  {
    "review_id": "REV-2026-8006",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-03-04",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Mumbai store \u2014 Well stocked store, friendly staff, got the color and size I wanted."
  },
  {
    "review_id": "REV-2026-8023",
    "store_id": "STORE-001",
    "sku_id": "FW-004",
    "date": "2026-03-04",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": false,
    "review_text": "Decent shoe overall, had to wait a bit while staff checked the backroom for my size."
  },
  {
    "review_id": "REV-2026-8030",
    "store_id": "STORE-001",
    "sku_id": "FW-003",
    "date": "2026-03-04",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Trail Blazer at Mumbai store \u2014 Fantastic cushioning, wore them for my long run this weekend and no complaints."
  },
  {
    "review_id": "REV-2026-8029",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-03-05",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Well stocked store, friendly staff, got the color and size I wanted."
  },
  {
    "review_id": "REV-2026-8003",
    "store_id": "STORE-001",
    "sku_id": "FW-004",
    "date": "2026-03-06",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Grip Trainer at Mumbai store \u2014 Loved the design and grip, would definitely recommend to fellow runners."
  },
  {
    "review_id": "REV-2026-8027",
    "store_id": "STORE-001",
    "sku_id": "FW-005",
    "date": "2026-03-06",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": true,
    "review_text": "Comfort Walk at Mumbai store \u2014 Store had my exact size in stock, walked out happy in under 5 minutes."
  },
  {
    "review_id": "REV-2026-8024",
    "store_id": "STORE-006",
    "sku_id": "FW-001",
    "date": "2026-03-07",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Great fit and super comfortable cushioning for my daily runs."
  },
  {
    "review_id": "REV-2026-8004",
    "store_id": "STORE-001",
    "sku_id": "FW-002",
    "date": "2026-03-12",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Been using these for a month now, holding up really well."
  },
  {
    "review_id": "REV-2026-8018",
    "store_id": "STORE-005",
    "sku_id": "FW-002",
    "date": "2026-03-15",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Nitro Speed at Pune store \u2014 Good product but the store took a while to locate my size on the floor."
  },
  {
    "review_id": "REV-2026-8021",
    "store_id": "STORE-001",
    "sku_id": "FW-002",
    "date": "2026-03-15",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Nitro Speed at Mumbai store \u2014 Exactly the shoe I needed, staff helped me find the right size quickly."
  },
  {
    "review_id": "REV-2026-8014",
    "store_id": "STORE-001",
    "sku_id": "FW-003",
    "date": "2026-03-17",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Fit is okay, slightly snug in the midfoot, needed some guidance from staff."
  },
  {
    "review_id": "REV-2026-8010",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-03-18",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Mumbai store \u2014 Picked this up as a gift, packaging and quality were excellent."
  },
  {
    "review_id": "REV-2026-8012",
    "store_id": "STORE-005",
    "sku_id": "FW-002",
    "date": "2026-03-18",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Comfortable out of the box, no break-in period needed."
  },
  {
    "review_id": "REV-2026-8022",
    "store_id": "STORE-006",
    "sku_id": "FW-001",
    "date": "2026-03-18",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Ahmedabad store \u2014 Fantastic cushioning, wore them for my long run this weekend and no complaints."
  },
  {
    "review_id": "REV-2026-8005",
    "store_id": "STORE-001",
    "sku_id": "FW-002",
    "date": "2026-03-20",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Nitro Speed at Mumbai store \u2014 Decent shoe overall, had to wait a bit while staff checked the backroom for my size."
  },
  {
    "review_id": "REV-2026-8008",
    "store_id": "STORE-006",
    "sku_id": "FW-003",
    "date": "2026-03-22",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Great fit and super comfortable cushioning for my daily runs."
  },
  {
    "review_id": "REV-2026-8009",
    "store_id": "STORE-001",
    "sku_id": "FW-005",
    "date": "2026-03-23",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Perfect for my gym sessions, great grip and support."
  },
  {
    "review_id": "REV-2026-8001",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-03-24",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Mumbai store \u2014 Comfortable out of the box, no break-in period needed."
  },
  {
    "review_id": "REV-2026-8026",
    "store_id": "STORE-006",
    "sku_id": "FW-002",
    "date": "2026-03-24",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": true,
    "review_text": "Been using these for a month now, holding up really well."
  },
  {
    "review_id": "REV-2026-8016",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-03-27",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Loved the design and grip, would definitely recommend to fellow runners."
  },
  {
    "review_id": "REV-2026-8020",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-03-30",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Been using these for a month now, holding up really well."
  },
  {
    "review_id": "REV-2026-8017",
    "store_id": "STORE-001",
    "sku_id": "FW-002",
    "date": "2026-03-31",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Store had my exact size in stock, walked out happy in under 5 minutes."
  },
  {
    "review_id": "REV-2026-8025",
    "store_id": "STORE-006",
    "sku_id": "FW-002",
    "date": "2026-03-31",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Nitro Speed at Ahmedabad store \u2014 Been using these for a month now, holding up really well."
  },
  {
    "review_id": "REV-2026-8114",
    "store_id": "STORE-006",
    "sku_id": "FW-003",
    "date": "2026-04-04",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Trail Blazer at Ahmedabad store \u2014 Perfect for my gym sessions, great grip and support."
  },
  {
    "review_id": "REV-2026-8102",
    "store_id": "STORE-001",
    "sku_id": "FW-003",
    "date": "2026-04-05",
    "rating": 1,
    "sentiment": "negative",
    "fit_related_flag": false,
    "review_text": "Trail Blazer at Mumbai store \u2014 Bought a size up since my usual size was unavailable, it pinched my toes during my run. Initiated a return."
  },
  {
    "review_id": "REV-2026-8105",
    "store_id": "STORE-001",
    "sku_id": "FW-005",
    "date": "2026-04-05",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Picked this up as a gift, packaging and quality were excellent."
  },
  {
    "review_id": "REV-2026-8118",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-04-05",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Comfortable enough, though I expected a bit more cushioning for the price."
  },
  {
    "review_id": "REV-2026-8124",
    "store_id": "STORE-001",
    "sku_id": "FW-004",
    "date": "2026-04-05",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Grip Trainer at Mumbai store \u2014 Store had my exact size in stock, walked out happy in under 5 minutes."
  },
  {
    "review_id": "REV-2026-8103",
    "store_id": "STORE-006",
    "sku_id": "FW-001",
    "date": "2026-04-09",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Ahmedabad store \u2014 Great fit and super comfortable cushioning for my daily runs."
  },
  {
    "review_id": "REV-2026-8111",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-04-09",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Mumbai store \u2014 Good product but the store took a while to locate my size on the floor."
  },
  {
    "review_id": "REV-2026-8129",
    "store_id": "STORE-006",
    "sku_id": "FW-001",
    "date": "2026-04-11",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Ahmedabad store \u2014 Perfect for my gym sessions, great grip and support."
  },
  {
    "review_id": "REV-2026-8115",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-04-13",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Picked this up as a gift, packaging and quality were excellent."
  },
  {
    "review_id": "REV-2026-8127",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-04-13",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Perfect for my gym sessions, great grip and support."
  },
  {
    "review_id": "REV-2026-8122",
    "store_id": "STORE-005",
    "sku_id": "FW-004",
    "date": "2026-04-14",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": false,
    "review_text": "Grip Trainer at Pune store \u2014 Comfortable enough, though I expected a bit more cushioning for the price."
  },
  {
    "review_id": "REV-2026-8125",
    "store_id": "STORE-005",
    "sku_id": "FW-002",
    "date": "2026-04-14",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Great fit and super comfortable cushioning for my daily runs."
  },
  {
    "review_id": "REV-2026-8101",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-04-15",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Mumbai store \u2014 Comfortable out of the box, no break-in period needed."
  },
  {
    "review_id": "REV-2026-8121",
    "store_id": "STORE-006",
    "sku_id": "FW-001",
    "date": "2026-04-15",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Ahmedabad store \u2014 Picked this up as a gift, packaging and quality were excellent."
  },
  {
    "review_id": "REV-2026-8123",
    "store_id": "STORE-006",
    "sku_id": "FW-001",
    "date": "2026-04-16",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Exactly the shoe I needed, staff helped me find the right size quickly."
  },
  {
    "review_id": "REV-2026-8112",
    "store_id": "STORE-001",
    "sku_id": "FW-004",
    "date": "2026-04-17",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Grip Trainer at Mumbai store \u2014 Store had my exact size in stock, walked out happy in under 5 minutes."
  },
  {
    "review_id": "REV-2026-8104",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-04-21",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Comfortable out of the box, no break-in period needed."
  },
  {
    "review_id": "REV-2026-8119",
    "store_id": "STORE-005",
    "sku_id": "FW-004",
    "date": "2026-04-23",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Grip Trainer at Pune store \u2014 Store had my exact size in stock, walked out happy in under 5 minutes."
  },
  {
    "review_id": "REV-2026-8113",
    "store_id": "STORE-001",
    "sku_id": "FW-005",
    "date": "2026-04-24",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Comfort Walk at Mumbai store \u2014 Well stocked store, friendly staff, got the color and size I wanted."
  },
  {
    "review_id": "REV-2026-8117",
    "store_id": "STORE-005",
    "sku_id": "FW-004",
    "date": "2026-04-24",
    "rating": 2,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Grip Trainer at Pune store \u2014 Bought a size up since my usual size was unavailable, it pinched my toes during my run. Initiated a return."
  },
  {
    "review_id": "REV-2026-8130",
    "store_id": "STORE-005",
    "sku_id": "FW-004",
    "date": "2026-04-24",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Grip Trainer at Pune store \u2014 Well stocked store, friendly staff, got the color and size I wanted."
  },
  {
    "review_id": "REV-2026-8110",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-04-25",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Perfect for my gym sessions, great grip and support."
  },
  {
    "review_id": "REV-2026-8120",
    "store_id": "STORE-006",
    "sku_id": "FW-004",
    "date": "2026-04-25",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Grip Trainer at Ahmedabad store \u2014 Had to try a couple of sizes before settling on the right one."
  },
  {
    "review_id": "REV-2026-8126",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-04-25",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Comfortable out of the box, no break-in period needed."
  },
  {
    "review_id": "REV-2026-8108",
    "store_id": "STORE-006",
    "sku_id": "FW-001",
    "date": "2026-04-26",
    "rating": 2,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Size curve availability was terrible during peak hours, several other customers had the same problem."
  },
  {
    "review_id": "REV-2026-8116",
    "store_id": "STORE-006",
    "sku_id": "FW-001",
    "date": "2026-04-26",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Ahmedabad store \u2014 Been using these for a month now, holding up really well."
  },
  {
    "review_id": "REV-2026-8109",
    "store_id": "STORE-006",
    "sku_id": "FW-004",
    "date": "2026-04-27",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Grip Trainer at Ahmedabad store \u2014 Store had my exact size in stock, walked out happy in under 5 minutes."
  },
  {
    "review_id": "REV-2026-8106",
    "store_id": "STORE-001",
    "sku_id": "FW-002",
    "date": "2026-04-28",
    "rating": 2,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Nitro Speed at Mumbai store \u2014 Had to settle for a size that didn't fit because my true size was missing from the shelf."
  },
  {
    "review_id": "REV-2026-8107",
    "store_id": "STORE-006",
    "sku_id": "FW-005",
    "date": "2026-04-30",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Loved the design and grip, would definitely recommend to fellow runners."
  },
  {
    "review_id": "REV-2026-8128",
    "store_id": "STORE-006",
    "sku_id": "FW-005",
    "date": "2026-04-30",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Comfort Walk at Ahmedabad store \u2014 Great fit and super comfortable cushioning for my daily runs."
  },
  {
    "review_id": "REV-2026-8214",
    "store_id": "STORE-001",
    "sku_id": "FW-002",
    "date": "2026-05-02",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Loved the design and grip, would definitely recommend to fellow runners."
  },
  {
    "review_id": "REV-2026-8228",
    "store_id": "STORE-001",
    "sku_id": "FW-004",
    "date": "2026-05-02",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Been using these for a month now, holding up really well."
  },
  {
    "review_id": "REV-2026-8219",
    "store_id": "STORE-006",
    "sku_id": "FW-002",
    "date": "2026-05-03",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Nitro Speed at Ahmedabad store \u2014 Exactly the shoe I needed, staff helped me find the right size quickly."
  },
  {
    "review_id": "REV-2026-8206",
    "store_id": "STORE-006",
    "sku_id": "FW-002",
    "date": "2026-05-06",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Fantastic cushioning, wore them for my long run this weekend and no complaints."
  },
  {
    "review_id": "REV-2026-8226",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-05-06",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Fantastic cushioning, wore them for my long run this weekend and no complaints."
  },
  {
    "review_id": "REV-2026-8212",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-05-07",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Mumbai store \u2014 Loved the design and grip, would definitely recommend to fellow runners."
  },
  {
    "review_id": "REV-2026-8234",
    "store_id": "STORE-005",
    "sku_id": "FW-002",
    "date": "2026-05-07",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Store had my exact size in stock, walked out happy in under 5 minutes."
  },
  {
    "review_id": "REV-2026-8201",
    "store_id": "STORE-006",
    "sku_id": "FW-001",
    "date": "2026-05-08",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Ahmedabad store \u2014 Store had my exact size in stock, walked out happy in under 5 minutes."
  },
  {
    "review_id": "REV-2026-8230",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-05-08",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Mumbai store \u2014 Loved the design and grip, would definitely recommend to fellow runners."
  },
  {
    "review_id": "REV-2026-8225",
    "store_id": "STORE-001",
    "sku_id": "FW-002",
    "date": "2026-05-09",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Been using these for a month now, holding up really well."
  },
  {
    "review_id": "REV-2026-8227",
    "store_id": "STORE-006",
    "sku_id": "FW-001",
    "date": "2026-05-09",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Perfect for my gym sessions, great grip and support."
  },
  {
    "review_id": "REV-2026-8220",
    "store_id": "STORE-005",
    "sku_id": "FW-002",
    "date": "2026-05-10",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Nitro Speed at Pune store \u2014 Been using these for a month now, holding up really well."
  },
  {
    "review_id": "REV-2026-8222",
    "store_id": "STORE-006",
    "sku_id": "FW-001",
    "date": "2026-05-10",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Ahmedabad store \u2014 Fantastic cushioning, wore them for my long run this weekend and no complaints."
  },
  {
    "review_id": "REV-2026-8205",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-05-11",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Marathon Pro at Mumbai store \u2014 Decent shoe overall, had to wait a bit while staff checked the backroom for my size."
  },
  {
    "review_id": "REV-2026-8208",
    "store_id": "STORE-006",
    "sku_id": "FW-002",
    "date": "2026-05-11",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Nitro Speed at Ahmedabad store \u2014 Loved the design and grip, would definitely recommend to fellow runners."
  },
  {
    "review_id": "REV-2026-8235",
    "store_id": "STORE-001",
    "sku_id": "FW-002",
    "date": "2026-05-13",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Nitro Speed at Mumbai store \u2014 Fit is okay, slightly snug in the midfoot, needed some guidance from staff."
  },
  {
    "review_id": "REV-2026-8217",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-05-14",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Fit is okay, slightly snug in the midfoot, needed some guidance from staff."
  },
  {
    "review_id": "REV-2026-8218",
    "store_id": "STORE-006",
    "sku_id": "FW-001",
    "date": "2026-05-14",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Picked this up as a gift, packaging and quality were excellent."
  },
  {
    "review_id": "REV-2026-8229",
    "store_id": "STORE-001",
    "sku_id": "FW-002",
    "date": "2026-05-15",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Had to try a couple of sizes before settling on the right one."
  },
  {
    "review_id": "REV-2026-8211",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-05-16",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Marathon Pro at Pune store \u2014 Had to try a couple of sizes before settling on the right one."
  },
  {
    "review_id": "REV-2026-8215",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-05-16",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Mumbai store \u2014 Great fit and super comfortable cushioning for my daily runs."
  },
  {
    "review_id": "REV-2026-8231",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-05-16",
    "rating": 2,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Second time this month the store doesn't have my size in Marathon Pro. Getting frustrating."
  },
  {
    "review_id": "REV-2026-8223",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-05-18",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": true,
    "review_text": "Great fit and super comfortable cushioning for my daily runs."
  },
  {
    "review_id": "REV-2026-8203",
    "store_id": "STORE-001",
    "sku_id": "FW-002",
    "date": "2026-05-19",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Nitro Speed at Mumbai store \u2014 Fit is okay, slightly snug in the midfoot, needed some guidance from staff."
  },
  {
    "review_id": "REV-2026-8207",
    "store_id": "STORE-006",
    "sku_id": "FW-002",
    "date": "2026-05-19",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": false,
    "review_text": "Nitro Speed at Ahmedabad store \u2014 Decent shoe overall, had to wait a bit while staff checked the backroom for my size."
  },
  {
    "review_id": "REV-2026-8216",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-05-19",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Fit is okay, slightly snug in the midfoot, needed some guidance from staff."
  },
  {
    "review_id": "REV-2026-8213",
    "store_id": "STORE-001",
    "sku_id": "FW-002",
    "date": "2026-05-20",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Nitro Speed at Mumbai store \u2014 Good product but the store took a while to locate my size on the floor."
  },
  {
    "review_id": "REV-2026-8210",
    "store_id": "STORE-005",
    "sku_id": "FW-003",
    "date": "2026-05-21",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Trail Blazer at Pune store \u2014 Great fit and super comfortable cushioning for my daily runs."
  },
  {
    "review_id": "REV-2026-8224",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-05-22",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Fantastic cushioning, wore them for my long run this weekend and no complaints."
  },
  {
    "review_id": "REV-2026-8233",
    "store_id": "STORE-005",
    "sku_id": "FW-004",
    "date": "2026-05-22",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Grip Trainer at Pune store \u2014 Been using these for a month now, holding up really well."
  },
  {
    "review_id": "REV-2026-8202",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-05-25",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Decent shoe overall, had to wait a bit while staff checked the backroom for my size."
  },
  {
    "review_id": "REV-2026-8221",
    "store_id": "STORE-001",
    "sku_id": "FW-003",
    "date": "2026-05-26",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Store had my exact size in stock, walked out happy in under 5 minutes."
  },
  {
    "review_id": "REV-2026-8232",
    "store_id": "STORE-006",
    "sku_id": "FW-004",
    "date": "2026-05-26",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Grip Trainer at Ahmedabad store \u2014 Comfortable out of the box, no break-in period needed."
  },
  {
    "review_id": "REV-2026-8204",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-05-28",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Had to try a couple of sizes before settling on the right one."
  },
  {
    "review_id": "REV-2026-8236",
    "store_id": "STORE-005",
    "sku_id": "FW-002",
    "date": "2026-05-28",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Nitro Speed at Pune store \u2014 Comfortable enough, though I expected a bit more cushioning for the price."
  },
  {
    "review_id": "REV-2026-8209",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-05-29",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Marathon Pro at Mumbai store \u2014 Fit is okay, slightly snug in the midfoot, needed some guidance from staff."
  },
  {
    "review_id": "REV-2026-8306",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-06-01",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Marathon Pro at Mumbai store \u2014 Fit is okay, slightly snug in the midfoot, needed some guidance from staff."
  },
  {
    "review_id": "REV-2026-8315",
    "store_id": "STORE-006",
    "sku_id": "FW-001",
    "date": "2026-06-01",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Ahmedabad store \u2014 Picked this up as a gift, packaging and quality were excellent."
  },
  {
    "review_id": "REV-2026-8325",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-06-01",
    "rating": 2,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Marathon Pro at Pune store \u2014 Second time this month the store doesn't have my size in Marathon Pro. Getting frustrating."
  },
  {
    "review_id": "REV-2026-8334",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-06-01",
    "rating": 2,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Marathon Pro at Mumbai store \u2014 Second time this month the store doesn't have my size in Marathon Pro. Getting frustrating."
  },
  {
    "review_id": "REV-2026-8346",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-06-02",
    "rating": 2,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "UK 8 was out of stock so the salesperson pushed me toward a different size. It didn't fit well."
  },
  {
    "review_id": "REV-2026-8360",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-06-02",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Perfect for my gym sessions, great grip and support."
  },
  {
    "review_id": "REV-2026-8313",
    "store_id": "STORE-006",
    "sku_id": "FW-003",
    "date": "2026-06-03",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Perfect for my gym sessions, great grip and support."
  },
  {
    "review_id": "REV-2026-8320",
    "store_id": "STORE-006",
    "sku_id": "FW-004",
    "date": "2026-06-03",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Picked this up as a gift, packaging and quality were excellent."
  },
  {
    "review_id": "REV-2026-8326",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-06-03",
    "rating": 2,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Marathon Pro at Mumbai store \u2014 Returning my pair, had to buy a half size larger because the right size was out of stock and it hurt my heel."
  },
  {
    "review_id": "REV-2026-8329",
    "store_id": "STORE-006",
    "sku_id": "FW-001",
    "date": "2026-06-03",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Well stocked store, friendly staff, got the color and size I wanted."
  },
  {
    "review_id": "REV-2026-8319",
    "store_id": "STORE-001",
    "sku_id": "FW-005",
    "date": "2026-06-04",
    "rating": 2,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Comfort Walk at Mumbai store \u2014 Substituted size didn't work out, requesting an exchange once the correct size is back in stock."
  },
  {
    "review_id": "REV-2026-8330",
    "store_id": "STORE-005",
    "sku_id": "FW-002",
    "date": "2026-06-04",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Perfect for my gym sessions, great grip and support."
  },
  {
    "review_id": "REV-2026-8348",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-06-04",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": true,
    "review_text": "Marathon Pro at Mumbai store \u2014 Loved the design and grip, would definitely recommend to fellow runners."
  },
  {
    "review_id": "REV-2026-8342",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-06-06",
    "rating": 2,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Bought a size up since my usual size was unavailable, it pinched my toes during my run. Initiated a return."
  },
  {
    "review_id": "REV-2026-8321",
    "store_id": "STORE-001",
    "sku_id": "FW-005",
    "date": "2026-06-07",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Fit is okay, slightly snug in the midfoot, needed some guidance from staff."
  },
  {
    "review_id": "REV-2026-8303",
    "store_id": "STORE-001",
    "sku_id": "FW-002",
    "date": "2026-06-08",
    "rating": 1,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Nitro Speed at Mumbai store \u2014 UK 8 was out of stock so the salesperson pushed me toward a different size. It didn't fit well."
  },
  {
    "review_id": "REV-2026-8343",
    "store_id": "STORE-005",
    "sku_id": "FW-003",
    "date": "2026-06-08",
    "rating": 1,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Neither UK 8 nor UK 9 were available on the rack. Very disappointing inventory availability."
  },
  {
    "review_id": "REV-2026-8310",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-06-09",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Fit is okay, slightly snug in the midfoot, needed some guidance from staff."
  },
  {
    "review_id": "REV-2026-8322",
    "store_id": "STORE-005",
    "sku_id": "FW-003",
    "date": "2026-06-09",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Trail Blazer at Pune store \u2014 Fit is okay, slightly snug in the midfoot, needed some guidance from staff."
  },
  {
    "review_id": "REV-2026-8336",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-06-09",
    "rating": 2,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Marathon Pro at Pune store \u2014 Second time this month the store doesn't have my size in Marathon Pro. Getting frustrating."
  },
  {
    "review_id": "REV-2026-8304",
    "store_id": "STORE-006",
    "sku_id": "FW-001",
    "date": "2026-06-10",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Store had my exact size in stock, walked out happy in under 5 minutes."
  },
  {
    "review_id": "REV-2026-8302",
    "store_id": "STORE-006",
    "sku_id": "FW-004",
    "date": "2026-06-11",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Been using these for a month now, holding up really well."
  },
  {
    "review_id": "REV-2026-8349",
    "store_id": "STORE-006",
    "sku_id": "FW-001",
    "date": "2026-06-12",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Well stocked store, friendly staff, got the color and size I wanted."
  },
  {
    "review_id": "REV-2026-8337",
    "store_id": "STORE-001",
    "sku_id": "FW-002",
    "date": "2026-06-13",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": true,
    "review_text": "Fantastic cushioning, wore them for my long run this weekend and no complaints."
  },
  {
    "review_id": "REV-2026-8339",
    "store_id": "STORE-005",
    "sku_id": "FW-002",
    "date": "2026-06-13",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Been using these for a month now, holding up really well."
  },
  {
    "review_id": "REV-2026-8316",
    "store_id": "STORE-005",
    "sku_id": "FW-004",
    "date": "2026-06-14",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": true,
    "review_text": "Grip Trainer at Pune store \u2014 Great fit and super comfortable cushioning for my daily runs."
  },
  {
    "review_id": "REV-2026-8340",
    "store_id": "STORE-005",
    "sku_id": "FW-002",
    "date": "2026-06-14",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Nitro Speed at Pune store \u2014 Good product but the store took a while to locate my size on the floor."
  },
  {
    "review_id": "REV-2026-8341",
    "store_id": "STORE-001",
    "sku_id": "FW-002",
    "date": "2026-06-14",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Perfect for my gym sessions, great grip and support."
  },
  {
    "review_id": "REV-2026-8317",
    "store_id": "STORE-001",
    "sku_id": "FW-004",
    "date": "2026-06-15",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Grip Trainer at Mumbai store \u2014 Comfortable out of the box, no break-in period needed."
  },
  {
    "review_id": "REV-2026-8345",
    "store_id": "STORE-001",
    "sku_id": "FW-005",
    "date": "2026-06-15",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Fantastic cushioning, wore them for my long run this weekend and no complaints."
  },
  {
    "review_id": "REV-2026-8359",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-06-15",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Decent shoe overall, had to wait a bit while staff checked the backroom for my size."
  },
  {
    "review_id": "REV-2026-8318",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-06-16",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Mumbai store \u2014 Fantastic cushioning, wore them for my long run this weekend and no complaints."
  },
  {
    "review_id": "REV-2026-8338",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-06-16",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Perfect for my gym sessions, great grip and support."
  },
  {
    "review_id": "REV-2026-8312",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-06-17",
    "rating": 2,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Size curve availability was terrible during peak hours, several other customers had the same problem."
  },
  {
    "review_id": "REV-2026-8324",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-06-17",
    "rating": 1,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Had to settle for a size that didn't fit because my true size was missing from the shelf."
  },
  {
    "review_id": "REV-2026-8314",
    "store_id": "STORE-001",
    "sku_id": "FW-003",
    "date": "2026-06-18",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Fantastic cushioning, wore them for my long run this weekend and no complaints."
  },
  {
    "review_id": "REV-2026-8350",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-06-18",
    "rating": 2,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Marathon Pro at Pune store \u2014 Substituted size didn't work out, requesting an exchange once the correct size is back in stock."
  },
  {
    "review_id": "REV-2026-8311",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-06-19",
    "rating": 2,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Size curve availability was terrible during peak hours, several other customers had the same problem."
  },
  {
    "review_id": "REV-2026-8323",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-06-19",
    "rating": 1,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Visited specifically for Marathon Pro in UK 9 but the shelf was empty, staff said out of stock. Left without buying."
  },
  {
    "review_id": "REV-2026-8331",
    "store_id": "STORE-006",
    "sku_id": "FW-002",
    "date": "2026-06-19",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Nitro Speed at Ahmedabad store \u2014 Been using these for a month now, holding up really well."
  },
  {
    "review_id": "REV-2026-8332",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-06-19",
    "rating": 2,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Returning my pair, had to buy a half size larger because the right size was out of stock and it hurt my heel."
  },
  {
    "review_id": "REV-2026-8357",
    "store_id": "STORE-006",
    "sku_id": "FW-001",
    "date": "2026-06-19",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Perfect for my gym sessions, great grip and support."
  },
  {
    "review_id": "REV-2026-8309",
    "store_id": "STORE-005",
    "sku_id": "FW-002",
    "date": "2026-06-20",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Fantastic cushioning, wore them for my long run this weekend and no complaints."
  },
  {
    "review_id": "REV-2026-8335",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-06-20",
    "rating": 1,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Returning my pair, had to buy a half size larger because the right size was out of stock and it hurt my heel."
  },
  {
    "review_id": "REV-2026-8307",
    "store_id": "STORE-006",
    "sku_id": "FW-001",
    "date": "2026-06-23",
    "rating": 2,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Had to settle for a size that didn't fit because my true size was missing from the shelf."
  },
  {
    "review_id": "REV-2026-8308",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-06-23",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Mumbai store \u2014 Comfortable enough, though I expected a bit more cushioning for the price."
  },
  {
    "review_id": "REV-2026-8351",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-06-23",
    "rating": 2,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "UK 8.5 was out of stock so the salesperson pushed me toward a different size. It didn't fit well."
  },
  {
    "review_id": "REV-2026-8328",
    "store_id": "STORE-001",
    "sku_id": "FW-003",
    "date": "2026-06-24",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Trail Blazer at Mumbai store \u2014 Fantastic cushioning, wore them for my long run this weekend and no complaints."
  },
  {
    "review_id": "REV-2026-8352",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-06-24",
    "rating": 2,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Substituted size didn't work out, requesting an exchange once the correct size is back in stock."
  },
  {
    "review_id": "REV-2026-8354",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-06-24",
    "rating": 1,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Returning my pair, had to buy a half size larger because the right size was out of stock and it hurt my heel."
  },
  {
    "review_id": "REV-2026-8333",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-06-25",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Fit is okay, slightly snug in the midfoot, needed some guidance from staff."
  },
  {
    "review_id": "REV-2026-8344",
    "store_id": "STORE-001",
    "sku_id": "FW-003",
    "date": "2026-06-25",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Picked this up as a gift, packaging and quality were excellent."
  },
  {
    "review_id": "REV-2026-8353",
    "store_id": "STORE-001",
    "sku_id": "FW-005",
    "date": "2026-06-25",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Comfort Walk at Mumbai store \u2014 Loved the design and grip, would definitely recommend to fellow runners."
  },
  {
    "review_id": "REV-2026-8301",
    "store_id": "STORE-006",
    "sku_id": "FW-005",
    "date": "2026-06-26",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Perfect for my gym sessions, great grip and support."
  },
  {
    "review_id": "REV-2026-8327",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-06-26",
    "rating": 1,
    "sentiment": "negative",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Mumbai store \u2014 Substituted size didn't work out, requesting an exchange once the correct size is back in stock."
  },
  {
    "review_id": "REV-2026-8356",
    "store_id": "STORE-006",
    "sku_id": "FW-002",
    "date": "2026-06-26",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Fantastic cushioning, wore them for my long run this weekend and no complaints."
  },
  {
    "review_id": "REV-2026-8305",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-06-28",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Been using these for a month now, holding up really well."
  },
  {
    "review_id": "REV-2026-8358",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-06-28",
    "rating": 1,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Store was out of my usual size, tried to squeeze into a smaller one but gave up and left."
  },
  {
    "review_id": "REV-2026-8347",
    "store_id": "STORE-001",
    "sku_id": "FW-002",
    "date": "2026-06-29",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": false,
    "review_text": "Had to try a couple of sizes before settling on the right one."
  },
  {
    "review_id": "REV-2026-8355",
    "store_id": "STORE-001",
    "sku_id": "FW-002",
    "date": "2026-06-29",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Nitro Speed at Mumbai store \u2014 Comfortable enough, though I expected a bit more cushioning for the price."
  },
  {
    "review_id": "REV-2026-8416",
    "store_id": "STORE-001",
    "sku_id": "FW-005",
    "date": "2026-07-02",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Comfort Walk at Mumbai store \u2014 Well stocked store, friendly staff, got the color and size I wanted."
  },
  {
    "review_id": "REV-2026-8435",
    "store_id": "STORE-001",
    "sku_id": "FW-002",
    "date": "2026-07-02",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Nitro Speed at Mumbai store \u2014 Comfortable out of the box, no break-in period needed."
  },
  {
    "review_id": "REV-2026-8422",
    "store_id": "STORE-005",
    "sku_id": "FW-002",
    "date": "2026-07-03",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Nitro Speed at Pune store \u2014 Comfortable out of the box, no break-in period needed."
  },
  {
    "review_id": "REV-2026-8429",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-07-03",
    "rating": 2,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Marathon Pro at Pune store \u2014 Ended up buying online because the store never had my size in stock for over two weeks."
  },
  {
    "review_id": "REV-2026-8433",
    "store_id": "STORE-006",
    "sku_id": "FW-002",
    "date": "2026-07-03",
    "rating": 2,
    "sentiment": "negative",
    "fit_related_flag": false,
    "review_text": "Nitro Speed at Ahmedabad store \u2014 Had to settle for a size that didn't fit because my true size was missing from the shelf."
  },
  {
    "review_id": "REV-2026-8403",
    "store_id": "STORE-005",
    "sku_id": "FW-002",
    "date": "2026-07-04",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Nitro Speed at Pune store \u2014 Fit is okay, slightly snug in the midfoot, needed some guidance from staff."
  },
  {
    "review_id": "REV-2026-8415",
    "store_id": "STORE-005",
    "sku_id": "FW-005",
    "date": "2026-07-05",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Comfort Walk at Pune store \u2014 Decent shoe overall, had to wait a bit while staff checked the backroom for my size."
  },
  {
    "review_id": "REV-2026-8421",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-07-05",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Mumbai store \u2014 Picked this up as a gift, packaging and quality were excellent."
  },
  {
    "review_id": "REV-2026-8437",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-07-05",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Pune store \u2014 Great fit and super comfortable cushioning for my daily runs."
  },
  {
    "review_id": "REV-2026-8438",
    "store_id": "STORE-006",
    "sku_id": "FW-002",
    "date": "2026-07-05",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Nitro Speed at Ahmedabad store \u2014 Picked this up as a gift, packaging and quality were excellent."
  },
  {
    "review_id": "REV-2026-8405",
    "store_id": "STORE-001",
    "sku_id": "FW-002",
    "date": "2026-07-08",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Comfortable out of the box, no break-in period needed."
  },
  {
    "review_id": "REV-2026-8431",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-07-08",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Pune store \u2014 Picked this up as a gift, packaging and quality were excellent."
  },
  {
    "review_id": "REV-2026-8445",
    "store_id": "STORE-001",
    "sku_id": "FW-002",
    "date": "2026-07-08",
    "rating": 2,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Nitro Speed at Mumbai store \u2014 Ended up buying online because the store never had my size in stock for over two weeks."
  },
  {
    "review_id": "REV-2026-8413",
    "store_id": "STORE-001",
    "sku_id": "FW-003",
    "date": "2026-07-10",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Trail Blazer at Mumbai store \u2014 Been using these for a month now, holding up really well."
  },
  {
    "review_id": "REV-2026-8420",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-07-10",
    "rating": 2,
    "sentiment": "negative",
    "fit_related_flag": false,
    "review_text": "Substituted size didn't work out, requesting an exchange once the correct size is back in stock."
  },
  {
    "review_id": "REV-2026-8446",
    "store_id": "STORE-006",
    "sku_id": "FW-003",
    "date": "2026-07-10",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Perfect for my gym sessions, great grip and support."
  },
  {
    "review_id": "REV-2026-8417",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-07-11",
    "rating": 1,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Neither UK 8 nor UK 9 were available on the rack. Very disappointing inventory availability."
  },
  {
    "review_id": "REV-2026-8423",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-07-11",
    "rating": 2,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Store was out of my usual size, tried to squeeze into a smaller one but gave up and left."
  },
  {
    "review_id": "REV-2026-8407",
    "store_id": "STORE-001",
    "sku_id": "FW-004",
    "date": "2026-07-12",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Picked this up as a gift, packaging and quality were excellent."
  },
  {
    "review_id": "REV-2026-8425",
    "store_id": "STORE-001",
    "sku_id": "FW-003",
    "date": "2026-07-12",
    "rating": 2,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Size curve availability was terrible during peak hours, several other customers had the same problem."
  },
  {
    "review_id": "REV-2026-8414",
    "store_id": "STORE-006",
    "sku_id": "FW-001",
    "date": "2026-07-14",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Ahmedabad store \u2014 Perfect for my gym sessions, great grip and support."
  },
  {
    "review_id": "REV-2026-8440",
    "store_id": "STORE-001",
    "sku_id": "FW-003",
    "date": "2026-07-14",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Trail Blazer at Mumbai store \u2014 Picked this up as a gift, packaging and quality were excellent."
  },
  {
    "review_id": "REV-2026-8409",
    "store_id": "STORE-001",
    "sku_id": "FW-004",
    "date": "2026-07-15",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Grip Trainer at Mumbai store \u2014 Great fit and super comfortable cushioning for my daily runs."
  },
  {
    "review_id": "REV-2026-8402",
    "store_id": "STORE-006",
    "sku_id": "FW-003",
    "date": "2026-07-16",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": true,
    "review_text": "Store had my exact size in stock, walked out happy in under 5 minutes."
  },
  {
    "review_id": "REV-2026-8410",
    "store_id": "STORE-001",
    "sku_id": "FW-004",
    "date": "2026-07-16",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Great fit and super comfortable cushioning for my daily runs."
  },
  {
    "review_id": "REV-2026-8428",
    "store_id": "STORE-001",
    "sku_id": "FW-003",
    "date": "2026-07-16",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Trail Blazer at Mumbai store \u2014 Good product but the store took a while to locate my size on the floor."
  },
  {
    "review_id": "REV-2026-8406",
    "store_id": "STORE-005",
    "sku_id": "FW-002",
    "date": "2026-07-17",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": true,
    "review_text": "Perfect for my gym sessions, great grip and support."
  },
  {
    "review_id": "REV-2026-8443",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-07-17",
    "rating": 2,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Neither UK 8 nor UK 9 were available on the rack. Very disappointing inventory availability."
  },
  {
    "review_id": "REV-2026-8426",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-07-18",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Mumbai store \u2014 Picked this up as a gift, packaging and quality were excellent."
  },
  {
    "review_id": "REV-2026-8439",
    "store_id": "STORE-005",
    "sku_id": "FW-004",
    "date": "2026-07-19",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Grip Trainer at Pune store \u2014 Picked this up as a gift, packaging and quality were excellent."
  },
  {
    "review_id": "REV-2026-8441",
    "store_id": "STORE-006",
    "sku_id": "FW-004",
    "date": "2026-07-19",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Comfortable out of the box, no break-in period needed."
  },
  {
    "review_id": "REV-2026-8434",
    "store_id": "STORE-005",
    "sku_id": "FW-004",
    "date": "2026-07-22",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Grip Trainer at Pune store \u2014 Perfect for my gym sessions, great grip and support."
  },
  {
    "review_id": "REV-2026-8442",
    "store_id": "STORE-006",
    "sku_id": "FW-001",
    "date": "2026-07-22",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Ahmedabad store \u2014 Great fit and super comfortable cushioning for my daily runs."
  },
  {
    "review_id": "REV-2026-8418",
    "store_id": "STORE-001",
    "sku_id": "FW-004",
    "date": "2026-07-23",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Grip Trainer at Mumbai store \u2014 Been using these for a month now, holding up really well."
  },
  {
    "review_id": "REV-2026-8419",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-07-23",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Well stocked store, friendly staff, got the color and size I wanted."
  },
  {
    "review_id": "REV-2026-8412",
    "store_id": "STORE-006",
    "sku_id": "FW-002",
    "date": "2026-07-26",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Loved the design and grip, would definitely recommend to fellow runners."
  },
  {
    "review_id": "REV-2026-8401",
    "store_id": "STORE-001",
    "sku_id": "FW-005",
    "date": "2026-07-27",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Fantastic cushioning, wore them for my long run this weekend and no complaints."
  },
  {
    "review_id": "REV-2026-8408",
    "store_id": "STORE-001",
    "sku_id": "FW-002",
    "date": "2026-07-27",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Been using these for a month now, holding up really well."
  },
  {
    "review_id": "REV-2026-8427",
    "store_id": "STORE-005",
    "sku_id": "FW-002",
    "date": "2026-07-27",
    "rating": 1,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Substituted size didn't work out, requesting an exchange once the correct size is back in stock."
  },
  {
    "review_id": "REV-2026-8436",
    "store_id": "STORE-005",
    "sku_id": "FW-002",
    "date": "2026-07-27",
    "rating": 2,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Nitro Speed at Pune store \u2014 UK 9.5 was out of stock so the salesperson pushed me toward a different size. It didn't fit well."
  },
  {
    "review_id": "REV-2026-8430",
    "store_id": "STORE-006",
    "sku_id": "FW-001",
    "date": "2026-07-28",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Comfortable out of the box, no break-in period needed."
  },
  {
    "review_id": "REV-2026-8404",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-07-29",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Pune store \u2014 Picked this up as a gift, packaging and quality were excellent."
  },
  {
    "review_id": "REV-2026-8411",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-07-29",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Mumbai store \u2014 Loved the design and grip, would definitely recommend to fellow runners."
  },
  {
    "review_id": "REV-2026-8432",
    "store_id": "STORE-006",
    "sku_id": "FW-004",
    "date": "2026-07-30",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Been using these for a month now, holding up really well."
  },
  {
    "review_id": "REV-2026-8424",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-07-31",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Pune store \u2014 Comfortable out of the box, no break-in period needed."
  },
  {
    "review_id": "REV-2026-8444",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-07-31",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Fantastic cushioning, wore them for my long run this weekend and no complaints."
  },
  {
    "review_id": "REV-2026-8524",
    "store_id": "STORE-005",
    "sku_id": "FW-005",
    "date": "2026-08-02",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Store had my exact size in stock, walked out happy in under 5 minutes."
  },
  {
    "review_id": "REV-2026-8510",
    "store_id": "STORE-006",
    "sku_id": "FW-005",
    "date": "2026-08-03",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": true,
    "review_text": "Comfort Walk at Ahmedabad store \u2014 Loved the design and grip, would definitely recommend to fellow runners."
  },
  {
    "review_id": "REV-2026-8515",
    "store_id": "STORE-001",
    "sku_id": "FW-002",
    "date": "2026-08-03",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": true,
    "review_text": "Comfortable out of the box, no break-in period needed."
  },
  {
    "review_id": "REV-2026-8520",
    "store_id": "STORE-005",
    "sku_id": "FW-005",
    "date": "2026-08-03",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Loved the design and grip, would definitely recommend to fellow runners."
  },
  {
    "review_id": "REV-2026-8503",
    "store_id": "STORE-006",
    "sku_id": "FW-001",
    "date": "2026-08-04",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Exactly the shoe I needed, staff helped me find the right size quickly."
  },
  {
    "review_id": "REV-2026-8537",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-08-06",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Loved the design and grip, would definitely recommend to fellow runners."
  },
  {
    "review_id": "REV-2026-8518",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-08-07",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": true,
    "review_text": "Well stocked store, friendly staff, got the color and size I wanted."
  },
  {
    "review_id": "REV-2026-8513",
    "store_id": "STORE-005",
    "sku_id": "FW-005",
    "date": "2026-08-08",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Been using these for a month now, holding up really well."
  },
  {
    "review_id": "REV-2026-8528",
    "store_id": "STORE-001",
    "sku_id": "FW-003",
    "date": "2026-08-08",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Been using these for a month now, holding up really well."
  },
  {
    "review_id": "REV-2026-8529",
    "store_id": "STORE-006",
    "sku_id": "FW-003",
    "date": "2026-08-08",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Exactly the shoe I needed, staff helped me find the right size quickly."
  },
  {
    "review_id": "REV-2026-8511",
    "store_id": "STORE-001",
    "sku_id": "FW-002",
    "date": "2026-08-09",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Nitro Speed at Mumbai store \u2014 Picked this up as a gift, packaging and quality were excellent."
  },
  {
    "review_id": "REV-2026-8530",
    "store_id": "STORE-001",
    "sku_id": "FW-004",
    "date": "2026-08-09",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Great fit and super comfortable cushioning for my daily runs."
  },
  {
    "review_id": "REV-2026-8512",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-08-10",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Replenishment finally came through, picked up my usual size without any hassle."
  },
  {
    "review_id": "REV-2026-8509",
    "store_id": "STORE-005",
    "sku_id": "FW-004",
    "date": "2026-08-11",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Grip Trainer at Pune store \u2014 Store had my exact size in stock, walked out happy in under 5 minutes."
  },
  {
    "review_id": "REV-2026-8534",
    "store_id": "STORE-006",
    "sku_id": "FW-004",
    "date": "2026-08-11",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Great fit and super comfortable cushioning for my daily runs."
  },
  {
    "review_id": "REV-2026-8517",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-08-14",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": true,
    "review_text": "Been using these for a month now, holding up really well."
  },
  {
    "review_id": "REV-2026-8516",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-08-15",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Pune store \u2014 Picked this up as a gift, packaging and quality were excellent."
  },
  {
    "review_id": "REV-2026-8522",
    "store_id": "STORE-005",
    "sku_id": "FW-002",
    "date": "2026-08-15",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Replenishment finally came through, picked up my usual size without any hassle."
  },
  {
    "review_id": "REV-2026-8519",
    "store_id": "STORE-001",
    "sku_id": "FW-005",
    "date": "2026-08-16",
    "rating": 2,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Comfort Walk at Mumbai store \u2014 Neither UK 8 nor UK 9 were available on the rack. Very disappointing inventory availability."
  },
  {
    "review_id": "REV-2026-8531",
    "store_id": "STORE-006",
    "sku_id": "FW-004",
    "date": "2026-08-16",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Grip Trainer at Ahmedabad store \u2014 Great fit and super comfortable cushioning for my daily runs."
  },
  {
    "review_id": "REV-2026-8526",
    "store_id": "STORE-001",
    "sku_id": "FW-005",
    "date": "2026-08-17",
    "rating": 2,
    "sentiment": "negative",
    "fit_related_flag": true,
    "review_text": "Visited specifically for Comfort Walk in UK 9 but the shelf was empty, staff said out of stock. Left without buying."
  },
  {
    "review_id": "REV-2026-8539",
    "store_id": "STORE-001",
    "sku_id": "FW-004",
    "date": "2026-08-17",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": true,
    "review_text": "Store is fully stocked again! Got my exact size within minutes. Best experience in a while."
  },
  {
    "review_id": "REV-2026-8514",
    "store_id": "STORE-005",
    "sku_id": "FW-003",
    "date": "2026-08-18",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Store is fully stocked again! Got my exact size within minutes. Best experience in a while."
  },
  {
    "review_id": "REV-2026-8540",
    "store_id": "STORE-005",
    "sku_id": "FW-002",
    "date": "2026-08-18",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": true,
    "review_text": "Nitro Speed at Pune store \u2014 Replenishment finally came through, picked up my usual size without any hassle."
  },
  {
    "review_id": "REV-2026-8505",
    "store_id": "STORE-005",
    "sku_id": "FW-005",
    "date": "2026-08-19",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Stock situation has clearly improved, staff confirmed a fresh shipment arrived this week."
  },
  {
    "review_id": "REV-2026-8507",
    "store_id": "STORE-006",
    "sku_id": "FW-005",
    "date": "2026-08-19",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Comfort Walk at Ahmedabad store \u2014 Well stocked store, friendly staff, got the color and size I wanted."
  },
  {
    "review_id": "REV-2026-8535",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-08-19",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Marathon Pro at Mumbai store \u2014 Fit is okay, slightly snug in the midfoot, needed some guidance from staff."
  },
  {
    "review_id": "REV-2026-8504",
    "store_id": "STORE-006",
    "sku_id": "FW-005",
    "date": "2026-08-21",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Good news - my size is back in stock. Bought two pairs this time just in case."
  },
  {
    "review_id": "REV-2026-8533",
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "date": "2026-08-21",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Comfortable out of the box, no break-in period needed."
  },
  {
    "review_id": "REV-2026-8527",
    "store_id": "STORE-005",
    "sku_id": "FW-005",
    "date": "2026-08-22",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Comfort Walk at Pune store \u2014 Comfortable enough, though I expected a bit more cushioning for the price."
  },
  {
    "review_id": "REV-2026-8536",
    "store_id": "STORE-006",
    "sku_id": "FW-002",
    "date": "2026-08-22",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Been using these for a month now, holding up really well."
  },
  {
    "review_id": "REV-2026-8501",
    "store_id": "STORE-006",
    "sku_id": "FW-001",
    "date": "2026-08-23",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Marathon Pro at Ahmedabad store \u2014 Store is fully stocked again! Got my exact size within minutes. Best experience in a while."
  },
  {
    "review_id": "REV-2026-8502",
    "store_id": "STORE-001",
    "sku_id": "FW-003",
    "date": "2026-08-23",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Trail Blazer at Mumbai store \u2014 Had to try a couple of sizes before settling on the right one."
  },
  {
    "review_id": "REV-2026-8521",
    "store_id": "STORE-001",
    "sku_id": "FW-003",
    "date": "2026-08-24",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Trail Blazer at Mumbai store \u2014 Fantastic cushioning, wore them for my long run this weekend and no complaints."
  },
  {
    "review_id": "REV-2026-8508",
    "store_id": "STORE-005",
    "sku_id": "FW-002",
    "date": "2026-08-28",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Nitro Speed at Pune store \u2014 Decent shoe overall, had to wait a bit while staff checked the backroom for my size."
  },
  {
    "review_id": "REV-2026-8538",
    "store_id": "STORE-005",
    "sku_id": "FW-001",
    "date": "2026-08-28",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": true,
    "review_text": "Marathon Pro at Pune store \u2014 Great fit and super comfortable cushioning for my daily runs."
  },
  {
    "review_id": "REV-2026-8523",
    "store_id": "STORE-005",
    "sku_id": "FW-003",
    "date": "2026-08-29",
    "rating": 3,
    "sentiment": "neutral",
    "fit_related_flag": true,
    "review_text": "Decent shoe overall, had to wait a bit while staff checked the backroom for my size."
  },
  {
    "review_id": "REV-2026-8506",
    "store_id": "STORE-001",
    "sku_id": "FW-005",
    "date": "2026-08-30",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Loved the design and grip, would definitely recommend to fellow runners."
  },
  {
    "review_id": "REV-2026-8525",
    "store_id": "STORE-001",
    "sku_id": "FW-005",
    "date": "2026-08-30",
    "rating": 5,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Picked this up as a gift, packaging and quality were excellent."
  },
  {
    "review_id": "REV-2026-8532",
    "store_id": "STORE-006",
    "sku_id": "FW-004",
    "date": "2026-08-30",
    "rating": 4,
    "sentiment": "positive",
    "fit_related_flag": false,
    "review_text": "Grip Trainer at Ahmedabad store \u2014 Store had my exact size in stock, walked out happy in under 5 minutes."
  }
];

export const EXCEL_6MO_DATASET = {
  ...(rawDataset as any),
  factCampaigns: FACT_CAMPAIGNS_DATASET,
  factReviews: FACT_REVIEWS_DATASET,
};

export function getExcel6MoTabularRecords(): TabularAuditRecord[] {
  return ((rawDataset as any).auditRecords || []).map((r: any, idx: number) => ({
    id: `rec-${idx + 1}`,
    period: r.period_week || r.period_month || '2026-W23',
    storeId: r.store_id,
    storeName: r.store_id === 'STORE-001' ? 'Indiranagar Flagship (Mumbai)' : r.store_id,
    region: r.region,
    category: r.category,
    skuId: r.sku_id,
    skuName: r.sku_name,
    footfall: r.footfall,
    conversions: r.conversions,
    conversionRatePct: r.conversion_rate_pct,
    sizeFillRatePct: r.size_fill_rate_pct,
    revenueLakhs: r.revenue_lakhs,
    lossEstimateLakhs: r.loss_estimate_lakhs,
    primaryRootCause: r.primary_root_cause,
  }));
}

// Helper getters for synthetic data tables
export function getFactCampaigns(): FactCampaignRecord[] {
  return FACT_CAMPAIGNS_DATASET;
}

export function getFactReviews(): FactReviewRecord[] {
  return FACT_REVIEWS_DATASET;
}
