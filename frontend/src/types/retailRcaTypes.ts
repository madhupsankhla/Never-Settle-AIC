export interface FunnelStage {
  id: string;
  stageName: string;
  count: number;
  pctOfTotal: number;
  dropOffCount: number;
  dropOffPct: number;
  primaryLeakageReason: string;
  leakageValueINR: number;
  leakageValueLakhs: number;
  confidenceTier?: 'HIGH' | 'MEDIUM' | 'LOW';
  actionableDriver: string;
}

export interface TimeSeriesTrendPoint {
  period: string; // e.g. 'Wk 28', 'Wk 29', 'Wk 30', 'Wk 31', 'Wk 32', 'Wk 33'
  actualConversionPct: number;
  baselineConversionPct: number;
  footfallTraffic: number;
  revenueLakhs: number;
  sizeStockoutRatePct: number;
}

export interface StoreComparisonPoint {
  storeId: string;
  storeName: string;
  region: string;
  conversionRatePct: number;
  sizeFillRatePct: number;
  revenueRecoveryLakhs: number;
  staffAssistanceScorePct: number;
  isAnomaly: boolean;
}

export interface DriverDecompositionPoint {
  driver: string;
  domain: string;
  lossContributionPct: number;
  lossRevenueLakhs: number;
  confidenceScore: number;
  tier: 'HIGH' | 'MEDIUM' | 'LOW';
  color: string;
}

export interface RetailOrgNode {
  id: string;
  name: string;
  level: 'enterprise' | 'businessUnit' | 'region' | 'store' | 'category';
  conversionRate: number;
  revenueLakhs: number;
  footfall: number;
  unitsCount?: number;
  children?: RetailOrgNode[];
}

export interface RetailFilterState {
  cadence: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
  selectedRegion: string; // 'All' | 'West' | 'North' | 'South' | 'East'
  selectedStoreId: string; // 'All' | 'STORE-014' | etc.
  selectedKpi: string; // 'conversion_rate' | 'revenue' | 'footfall' | 'size_fill_rate'
  selectedDriver: string; // 'All' | specific driver
  selectedYear: number;
  searchQuery: string;
}

export interface RetailExecutiveKpis {
  conversionRatePct: number;
  conversionRateDeltaPct: number;
  revenueLossLakhs: number;
  revenueRecoveryPotentialLakhs: number;
  footfallTraffic: number;
  footfallDeltaPct: number;
  sizeCurveStockoutRatePct: number;
  mysteryShopperScore: number;
  avgBasketSize: number;
}

export interface TabularAuditRecord {
  id: string;
  period: string;
  storeId: string;
  storeName: string;
  region: string;
  category: string;
  skuId: string;
  skuName: string;
  footfall: number;
  tryOns: number;
  conversions: number;
  conversionRatePct: number;
  sizeFillRatePct: number;
  primaryRootCause: string;
  revenueLakhs: number;
  lossEstimateLakhs: number;
  isAnomaly?: boolean;
}
