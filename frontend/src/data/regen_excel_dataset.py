import json

with open('d:/SoleSight/frontend/src/data/parsed_campaigns.json', 'r') as f:
    campaigns = json.load(f)

with open('d:/SoleSight/frontend/src/data/parsed_reviews.json', 'r') as f:
    reviews = json.load(f)

header = """import rawDataset from './excelDataset6Mo.json';
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

"""

camp_str = "export const FACT_CAMPAIGNS_DATASET: FactCampaignRecord[] = " + json.dumps(campaigns, indent=2) + ";\n\n"
rev_str = "export const FACT_REVIEWS_DATASET: FactReviewRecord[] = " + json.dumps(reviews, indent=2) + ";\n\n"

footer = """export const EXCEL_6MO_DATASET = {
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
"""

with open('d:/SoleSight/frontend/src/data/excelDataset.ts', 'w') as f:
    f.write(header + camp_str + rev_str + footer)

print("Regenerated excelDataset.ts successfully.")
