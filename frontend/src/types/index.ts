export type PersonaType = 'store_manager' | 'regional_ops' | 'cfo_finance' | 'marketing_growth';

export interface Segment {
  store_id?: string;
  region?: string;
  network?: string;
}

export interface FootfallStatus {
  change_pct: number;
  is_material: boolean;
}

export interface DecompositionNode {
  level: string;
  node: string;
  contribution_pct: number;
  parent_node?: string | null;
}

export interface Hypothesis {
  driver: string;
  domain: string;
  confidence: number;
  tier: 'HIGH' | 'MEDIUM' | 'LOW';
  precedence: boolean;
  dose_response: number;
  corroboration?: string;
  detail?: string;
  chart_data?: any;
}

export interface TopRankedAction {
  driver: string;
  lever: string;
  action: string;
  expected_impact: string;
  estimated_recovery_val?: number;
  owner: string;
  confidence: string;
  monitoring_plan: string;
  feasibility_status?: string;
  feasibility_notes?: string;
}

export interface DataFreshness {
  pos: string;
  inventory: string;
  mystery_shopper: string;
}

export interface EvidenceObject {
  evidence_id?: string;
  kpi: string;
  segment: Segment;
  period: string;
  footfall_status: FootfallStatus;
  change_pct: number;
  is_material: boolean;
  decomposition: DecompositionNode[];
  hypotheses: Hypothesis[];
  top_ranked_action?: TopRankedAction | null;
  data_freshness: DataFreshness;
  known_user_constraints_applied: string[];
  abstain: boolean;
  abstain_reason?: string | null;
  is_sparse_history?: boolean;
}

export interface InlineEvidenceTag {
  tag_text: string;
  driver: string;
  confidence: string;
  precedence?: boolean;
  dose_response?: number;
  corroboration?: string;
}

export interface NarrativeResponse {
  narrative_id: string;
  persona: PersonaType;
  title: string;
  headline: string;
  summary_paragraphs: string[];
  inline_tags: InlineEvidenceTag[];
  action_callout?: {
    action?: string;
    owner?: string;
    expected_impact?: string;
    monitoring_plan?: string;
    confidence?: string;
    status?: string;
    guidance?: string;
    feasibility_status?: string;
  };
  is_abstention: boolean;
  abstention_reason?: string | null;
  telemetry: {
    llm_invoked?: boolean;
    model?: string;
    model_tier?: string;
    latency_ms: number;
    prompt_tokens?: number;
    completion_tokens?: number;
    total_cost_usd?: number;
  };
  cached: boolean;
  evidence_hash: string;
}

export interface KnownConstraint {
  id?: string;
  description: string;
  constraint_type: 'budget' | 'logistics_channel' | 'discount_cap' | 'lead_time_override';
  scope_region?: string;
  scope_store_id?: string;
  scope_category?: string;
  value?: number;
  effective_start: string;
  effective_end: string;
  active?: boolean;
}

export interface TelemetrySummary {
  session_queries: number;
  avg_latency_ms: number;
  total_prompt_tokens: number;
  total_completion_tokens: number;
  total_tokens: number;
  total_cost_usd: number;
  target_latency_sla_ms: number;
  sla_compliance_pct: number;
  recent_queries: Array<{
    timestamp: string;
    endpoint: string;
    latency_ms: number;
    tokens: number;
    cost_usd: number;
    model: string;
  }>;
}

export interface OrgHierarchy {
  network: string;
  regions: Record<string, Array<{
    store_id: string;
    city_tier: string;
    format: string;
    opening_date: string;
  }>>;
  products: Array<{
    sku_id: string;
    style_name: string;
    category: string;
    list_price: number;
  }>;
}
