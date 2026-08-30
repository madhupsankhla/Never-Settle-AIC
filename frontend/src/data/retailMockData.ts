import type {
  FunnelStage,
  TimeSeriesTrendPoint,
  StoreComparisonPoint,
  DriverDecompositionPoint,
  RetailOrgNode,
  RetailExecutiveKpis,
} from '../types/retailRcaTypes';

// 1. Retail Conversion Funnel-Down Stages
export const RETAIL_FUNNEL_DATA: FunnelStage[] = [
  {
    id: 'f1',
    stageName: '1. Store Footfall & Walk-ins',
    count: 14240,
    pctOfTotal: 100.0,
    dropOffCount: 3560,
    dropOffPct: 25.0,
    primaryLeakageReason: 'Casual Browsing / Window Shopper Exit',
    leakageValueINR: 320000,
    leakageValueLakhs: 3.2,
    confidenceTier: 'MEDIUM',
    actionableDriver: 'Entry Displays & Front-of-House Merchandising',
  },
  {
    id: 'f2',
    stageName: '2. Try-On & Size Engagement',
    count: 10680,
    pctOfTotal: 75.0,
    dropOffCount: 4440,
    dropOffPct: 41.6,
    primaryLeakageReason: 'Hero SKU Size Stockout (UK 8 & 9 Unavailable)',
    leakageValueINR: 1340000,
    leakageValueLakhs: 13.4,
    confidenceTier: 'HIGH',
    actionableDriver: 'Dynamic Hero-Size Replenishment (Central DC)',
  },
  {
    id: 'f3',
    stageName: '3. Staff Consultation & Sizing',
    count: 6240,
    pctOfTotal: 43.8,
    dropOffCount: 2420,
    dropOffPct: 38.8,
    primaryLeakageReason: 'Fitting Queue Abandonment & Staff Lag',
    leakageValueINR: 560000,
    leakageValueLakhs: 5.6,
    confidenceTier: 'HIGH',
    actionableDriver: 'Peak Hour Staff Re-allocation & Mobile POS',
  },
  {
    id: 'f4',
    stageName: '4. Fitting Room & Intent Match',
    count: 3820,
    pctOfTotal: 26.8,
    dropOffCount: 1570,
    dropOffPct: 41.1,
    primaryLeakageReason: 'Colorway Mismatch & Price Friction',
    leakageValueINR: 260000,
    leakageValueLakhs: 2.6,
    confidenceTier: 'LOW',
    actionableDriver: 'Instant Alternative SKU Recommendation',
  },
  {
    id: 'f5',
    stageName: '5. POS Checkout (Converted)',
    count: 2250,
    pctOfTotal: 15.8,
    dropOffCount: 0,
    dropOffPct: 0.0,
    primaryLeakageReason: 'Successful POS Transaction (15.8% Conv)',
    leakageValueINR: 0,
    leakageValueLakhs: 0.0,
    confidenceTier: 'HIGH',
    actionableDriver: 'Cross-sell Loyalty & Warranty Activation',
  },
];

// 2. Multi-Week Time Series Trend Data (Line Graph)
export const TIME_SERIES_TRENDS: TimeSeriesTrendPoint[] = [
  {
    period: '2026-W26',
    actualConversionPct: 18.4,
    baselineConversionPct: 18.0,
    footfallTraffic: 27800,
    revenueLakhs: 84.5,
    sizeStockoutRatePct: 4.2,
  },
  {
    period: '2026-W27',
    actualConversionPct: 18.1,
    baselineConversionPct: 18.2,
    footfallTraffic: 28100,
    revenueLakhs: 86.2,
    sizeStockoutRatePct: 4.5,
  },
  {
    period: '2026-W28',
    actualConversionPct: 17.8,
    baselineConversionPct: 18.0,
    footfallTraffic: 28400,
    revenueLakhs: 85.0,
    sizeStockoutRatePct: 5.1,
  },
  {
    period: '2026-W29',
    actualConversionPct: 18.2,
    baselineConversionPct: 18.3,
    footfallTraffic: 27900,
    revenueLakhs: 87.1,
    sizeStockoutRatePct: 4.8,
  },
  {
    period: '2026-W30',
    actualConversionPct: 18.5,
    baselineConversionPct: 18.3,
    footfallTraffic: 28300,
    revenueLakhs: 88.4,
    sizeStockoutRatePct: 4.0,
  },
  {
    period: '2026-W31',
    actualConversionPct: 17.2,
    baselineConversionPct: 18.2,
    footfallTraffic: 28000,
    revenueLakhs: 79.5,
    sizeStockoutRatePct: 12.4, // Beginning of stockout issue
  },
  {
    period: '2026-W32',
    actualConversionPct: 14.8,
    baselineConversionPct: 18.3,
    footfallTraffic: 28500,
    revenueLakhs: 68.2,
    sizeStockoutRatePct: 24.8,
  },
  {
    period: '2026-W33',
    actualConversionPct: 13.6, // Deepest dip (STORE-014 hero scenario)
    baselineConversionPct: 18.3,
    footfallTraffic: 28400,
    revenueLakhs: 63.8,
    sizeStockoutRatePct: 31.2, // 31.2% stockout incidence
  },
];

// 3. Store-to-Store Cross Sectional Benchmarking Data
export const STORE_BENCHMARK_DATA: StoreComparisonPoint[] = [
  {
    storeId: 'STORE-001',
    storeName: 'Mumbai High Street Flagship',
    region: 'West',
    conversionRatePct: 13.6,
    sizeFillRatePct: 68.8,
    revenueRecoveryLakhs: 24.5,
    staffAssistanceScorePct: 82.0,
    isAnomaly: true,
  },
  {
    storeId: 'STORE-005',
    storeName: 'Pune Phoenix MegaMall',
    region: 'West',
    conversionRatePct: 14.8,
    sizeFillRatePct: 72.4,
    revenueRecoveryLakhs: 18.2,
    staffAssistanceScorePct: 84.5,
    isAnomaly: true,
  },
  {
    storeId: 'STORE-006',
    storeName: 'Ahmedabad Palladium Store',
    region: 'West',
    conversionRatePct: 16.4,
    sizeFillRatePct: 81.0,
    revenueRecoveryLakhs: 11.4,
    staffAssistanceScorePct: 86.0,
    isAnomaly: false,
  },
  {
    storeId: 'STORE-002',
    storeName: 'Delhi South Extension Hub',
    region: 'North',
    conversionRatePct: 18.5,
    sizeFillRatePct: 92.1,
    revenueRecoveryLakhs: 4.2,
    staffAssistanceScorePct: 91.0,
    isAnomaly: false,
  },
  {
    storeId: 'STORE-004',
    storeName: 'Gurugram CyberHub Gallery',
    region: 'North',
    conversionRatePct: 19.1,
    sizeFillRatePct: 94.5,
    revenueRecoveryLakhs: 2.8,
    staffAssistanceScorePct: 93.0,
    isAnomaly: false,
  },
  {
    storeId: 'STORE-003',
    storeName: 'Bengaluru Brigade Road BrandStore',
    region: 'South',
    conversionRatePct: 18.9,
    sizeFillRatePct: 95.0,
    revenueRecoveryLakhs: 3.1,
    staffAssistanceScorePct: 89.5,
    isAnomaly: false,
  },
  {
    storeId: 'STORE-007',
    storeName: 'Hyderabad Jubilee Hills',
    region: 'South',
    conversionRatePct: 17.9,
    sizeFillRatePct: 88.6,
    revenueRecoveryLakhs: 6.5,
    staffAssistanceScorePct: 88.0,
    isAnomaly: false,
  },
  {
    storeId: 'STORE-008',
    storeName: 'Chennai Express Avenue',
    region: 'South',
    conversionRatePct: 15.2,
    sizeFillRatePct: 79.4,
    revenueRecoveryLakhs: 14.1,
    staffAssistanceScorePct: 76.0,
    isAnomaly: true,
  },
];

export const STORE_COMPARISON_DATA = STORE_BENCHMARK_DATA;

// 4. Root Cause Driver Decomposition (Pie / Donut Chart)
export const DRIVER_DECOMPOSITION_DATA: DriverDecompositionPoint[] = [
  {
    driver: 'Core Size-Curve Stockout (UK 8 & 9)',
    domain: 'Inventory / Supply Chain',
    lossContributionPct: 54.0,
    lossRevenueLakhs: 34.5,
    confidenceScore: 0.94,
    tier: 'HIGH',
    color: '#f59e0b', // Amber
  },
  {
    driver: 'Peak Hours Fitting Room Wait Friction',
    domain: 'Store Operations',
    lossContributionPct: 22.0,
    lossRevenueLakhs: 14.0,
    confidenceScore: 0.82,
    tier: 'HIGH',
    color: '#06b6d4', // Cyan
  },
  {
    driver: 'Competitor Promotional Price Undercut (-20%)',
    domain: 'Market / Commercial',
    lossContributionPct: 14.0,
    lossRevenueLakhs: 8.9,
    confidenceScore: 0.74,
    tier: 'MEDIUM',
    color: '#ec4899', // Pink
  },
  {
    driver: 'Staff Shift Sizing Guidance Lag',
    domain: 'Human Resources',
    lossContributionPct: 7.0,
    lossRevenueLakhs: 4.5,
    confidenceScore: 0.65,
    tier: 'MEDIUM',
    color: '#8b5cf6', // Purple
  },
  {
    driver: 'Secondary POS Cash Counter Latency',
    domain: 'Store IT',
    lossContributionPct: 3.0,
    lossRevenueLakhs: 1.9,
    confidenceScore: 0.58,
    tier: 'LOW',
    color: '#64748b', // Slate
  },
];

// 5. 5-Tier Canonical Organizational Tree Structure:
// Enterprise -> Business Unit -> Region -> Store -> Product SKU
export const RETAIL_ORG_TREE_DATA: RetailOrgNode = {
  id: 'org-enterprise',
  name: 'SoleSight Footwear Enterprise Network',
  level: 'enterprise',
  conversionRate: 17.2,
  revenueLakhs: 480.5,
  footfall: 168000,
  unitsCount: 10,
  children: [
    {
      id: 'bu-premium-retail',
      name: 'Premium Performance Retail BU',
      level: 'businessUnit',
      conversionRate: 16.8,
      revenueLakhs: 320.0,
      footfall: 110000,
      children: [
        {
          id: 'reg-west',
          name: 'West Region (Mumbai / Pune / Ahmedabad)',
          level: 'region',
          conversionRate: 14.9,
          revenueLakhs: 142.0,
          footfall: 52000,
          children: [
            {
              id: 'store-STORE-001',
              name: 'STORE-001 (Mumbai High Street Flagship)',
              level: 'store',
              conversionRate: 13.6,
              revenueLakhs: 63.8,
              footfall: 28400,
              children: [
                {
                  id: 'sku-fw-001',
                  name: 'FW-001 Marathon Pro (Hero SKU)',
                  level: 'category',
                  conversionRate: 11.2,
                  revenueLakhs: 28.4,
                  footfall: 14200,
                },
                {
                  id: 'sku-fw-002',
                  name: 'FW-002 Velocity Nitro 3',
                  level: 'category',
                  conversionRate: 15.8,
                  revenueLakhs: 21.2,
                  footfall: 8800,
                },
                {
                  id: 'sku-fw-003',
                  name: 'FW-003 Deviate Nitro Elite',
                  level: 'category',
                  conversionRate: 16.4,
                  revenueLakhs: 14.2,
                  footfall: 5400,
                },
                {
                  id: 'sku-fw-004',
                  name: 'FW-004 Fuse 2.0 Trainer',
                  level: 'category',
                  conversionRate: 17.8,
                  revenueLakhs: 18.0,
                  footfall: 4200,
                },
                {
                  id: 'sku-fw-005',
                  name: 'FW-005 Suede Classic XXI',
                  level: 'category',
                  conversionRate: 19.2,
                  revenueLakhs: 22.5,
                  footfall: 3600,
                },
              ],
            },
            {
              id: 'store-STORE-005',
              name: 'STORE-005 (Pune Phoenix MegaMall)',
              level: 'store',
              conversionRate: 14.8,
              revenueLakhs: 46.2,
              footfall: 15200,
              children: [
                {
                  id: 'sku-fw-001-pune',
                  name: 'FW-001 Marathon Pro',
                  level: 'category',
                  conversionRate: 13.8,
                  revenueLakhs: 24.0,
                  footfall: 9200,
                },
                {
                  id: 'sku-fw-004-pune',
                  name: 'FW-004 Fuse 2.0 Trainer',
                  level: 'category',
                  conversionRate: 16.2,
                  revenueLakhs: 22.2,
                  footfall: 6000,
                },
              ],
            },
            {
              id: 'store-STORE-006',
              name: 'STORE-006 (Ahmedabad Palladium)',
              level: 'store',
              conversionRate: 16.4,
              revenueLakhs: 32.0,
              footfall: 8400,
              children: [
                {
                  id: 'sku-fw-002-ahm',
                  name: 'FW-002 Velocity Nitro 3',
                  level: 'category',
                  conversionRate: 16.8,
                  revenueLakhs: 18.0,
                  footfall: 4800,
                },
              ],
            },
          ],
        },
        {
          id: 'reg-north',
          name: 'North Region (Delhi NCR / Gurugram)',
          level: 'region',
          conversionRate: 18.8,
          revenueLakhs: 98.0,
          footfall: 32000,
          children: [
            {
              id: 'store-STORE-002',
              name: 'STORE-002 (Delhi South Extension)',
              level: 'store',
              conversionRate: 18.5,
              revenueLakhs: 58.0,
              footfall: 19500,
              children: [
                {
                  id: 'sku-fw-001-delhi',
                  name: 'FW-001 Marathon Pro',
                  level: 'category',
                  conversionRate: 18.2,
                  revenueLakhs: 32.0,
                  footfall: 11000,
                },
                {
                  id: 'sku-fw-005-delhi',
                  name: 'FW-005 Suede Classic XXI',
                  level: 'category',
                  conversionRate: 19.4,
                  revenueLakhs: 26.0,
                  footfall: 8500,
                },
              ],
            },
            {
              id: 'store-STORE-004',
              name: 'STORE-004 (Gurugram CyberHub)',
              level: 'store',
              conversionRate: 19.1,
              revenueLakhs: 40.0,
              footfall: 12500,
              children: [
                {
                  id: 'sku-fw-003-ggn',
                  name: 'FW-003 Deviate Nitro Elite',
                  level: 'category',
                  conversionRate: 19.1,
                  revenueLakhs: 40.0,
                  footfall: 12500,
                },
              ],
            },
          ],
        },
        {
          id: 'reg-south',
          name: 'South Region (Bengaluru / Hyderabad / Chennai)',
          level: 'region',
          conversionRate: 17.6,
          revenueLakhs: 80.0,
          footfall: 26000,
          children: [
            {
              id: 'store-STORE-003',
              name: 'STORE-003 (Bengaluru Brigade Road)',
              level: 'store',
              conversionRate: 18.9,
              revenueLakhs: 45.0,
              footfall: 14500,
              children: [
                {
                  id: 'sku-fw-001-blr',
                  name: 'FW-001 Marathon Pro',
                  level: 'category',
                  conversionRate: 18.9,
                  revenueLakhs: 45.0,
                  footfall: 14500,
                },
              ],
            },
            {
              id: 'store-STORE-007',
              name: 'STORE-007 (Hyderabad Jubilee Hills)',
              level: 'store',
              conversionRate: 17.9,
              revenueLakhs: 25.0,
              footfall: 8500,
              children: [
                {
                  id: 'sku-fw-002-hyd',
                  name: 'FW-002 Velocity Nitro 3',
                  level: 'category',
                  conversionRate: 17.9,
                  revenueLakhs: 25.0,
                  footfall: 8500,
                },
              ],
            },
            {
              id: 'store-STORE-008',
              name: 'STORE-008 (Chennai Express Avenue)',
              level: 'store',
              conversionRate: 15.2,
              revenueLakhs: 35.0,
              footfall: 11500,
              children: [
                {
                  id: 'sku-fw-005-chn',
                  name: 'FW-005 Suede Classic XXI',
                  level: 'category',
                  conversionRate: 15.2,
                  revenueLakhs: 35.0,
                  footfall: 11500,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// 6. Compute Leadership KPIs based on active filters
export function computeRetailLeadershipKpis(
  storeId: string,
  region: string
): RetailExecutiveKpis {
  if (storeId === 'STORE-001' || storeId === 'STORE-014' || (storeId === 'All' && region === 'West')) {
    return {
      conversionRatePct: 13.6,
      conversionRateDeltaPct: -25.7, // -4.7 percentage points vs 18.3% baseline
      revenueLossLakhs: 24.5,
      revenueRecoveryPotentialLakhs: 21.8,
      footfallTraffic: 28400,
      footfallDeltaPct: 2.1, // Material footfall steady, conversion drop
      sizeCurveStockoutRatePct: 31.2,
      mysteryShopperScore: 78.4,
      avgBasketSize: 1.42,
    };
  }

  if (storeId === 'STORE-005' || storeId === 'STORE-011') {
    return {
      conversionRatePct: 14.8,
      conversionRateDeltaPct: -19.1,
      revenueLossLakhs: 18.2,
      revenueRecoveryPotentialLakhs: 15.4,
      footfallTraffic: 15200,
      footfallDeltaPct: 1.5,
      sizeCurveStockoutRatePct: 27.6,
      mysteryShopperScore: 82.0,
      avgBasketSize: 1.38,
    };
  }

  if (storeId === 'STORE-006' || storeId === 'STORE-012') {
    return {
      conversionRatePct: 16.4,
      conversionRateDeltaPct: -10.4,
      revenueLossLakhs: 11.4,
      revenueRecoveryPotentialLakhs: 9.2,
      footfallTraffic: 8400,
      footfallDeltaPct: 0.5,
      sizeCurveStockoutRatePct: 19.0,
      mysteryShopperScore: 86.0,
      avgBasketSize: 1.45,
    };
  }

  if (storeId === 'STORE-002') {
    return {
      conversionRatePct: 18.5,
      conversionRateDeltaPct: 1.1,
      revenueLossLakhs: 4.2,
      revenueRecoveryPotentialLakhs: 3.5,
      footfallTraffic: 19500,
      footfallDeltaPct: 4.2,
      sizeCurveStockoutRatePct: 7.9,
      mysteryShopperScore: 91.0,
      avgBasketSize: 1.62,
    };
  }

  if (storeId === 'STORE-004') {
    return {
      conversionRatePct: 19.1,
      conversionRateDeltaPct: 4.4,
      revenueLossLakhs: 2.8,
      revenueRecoveryPotentialLakhs: 2.1,
      footfallTraffic: 12500,
      footfallDeltaPct: 5.0,
      sizeCurveStockoutRatePct: 5.5,
      mysteryShopperScore: 93.0,
      avgBasketSize: 1.68,
    };
  }

  if (storeId === 'STORE-003' || storeId === 'STORE-007') {
    return {
      conversionRatePct: 18.9,
      conversionRateDeltaPct: 3.3,
      revenueLossLakhs: 3.1,
      revenueRecoveryPotentialLakhs: 2.5,
      footfallTraffic: 14500,
      footfallDeltaPct: 2.8,
      sizeCurveStockoutRatePct: 5.0,
      mysteryShopperScore: 89.5,
      avgBasketSize: 1.60,
    };
  }

  if (storeId === 'STORE-008') {
    return {
      conversionRatePct: 15.2,
      conversionRateDeltaPct: -16.9,
      revenueLossLakhs: 14.1,
      revenueRecoveryPotentialLakhs: 11.5,
      footfallTraffic: 11500,
      footfallDeltaPct: -0.8,
      sizeCurveStockoutRatePct: 20.6,
      mysteryShopperScore: 76.0,
      avgBasketSize: 1.35,
    };
  }

  // Network Aggregate
  return {
    conversionRatePct: 17.2,
    conversionRateDeltaPct: -6.0,
    revenueLossLakhs: 63.8,
    revenueRecoveryPotentialLakhs: 54.2,
    footfallTraffic: 168000,
    footfallDeltaPct: 3.4,
    sizeCurveStockoutRatePct: 14.8,
    mysteryShopperScore: 84.6,
    avgBasketSize: 1.58,
  };
}

// 7. Tabular Records Generator for Export
export function generateRetailTabularRecords() {
  return [
    {
      id: 'REC-001',
      period: '2026-W33',
      storeId: 'STORE-001',
      storeName: 'Mumbai High Street Flagship',
      region: 'West',
      category: 'Performance Running',
      skuId: 'FW-001',
      skuName: 'Marathon Pro',
      footfall: 14200,
      tryOns: 8240,
      conversions: 1590,
      conversionRatePct: 11.2,
      sizeFillRatePct: 58.4,
      primaryRootCause: 'Stockout: UK 8 & 9',
      revenueLakhs: 28.4,
      lossEstimateLakhs: 16.2,
    },
    {
      id: 'REC-002',
      period: '2026-W33',
      storeId: 'STORE-001',
      storeName: 'Mumbai High Street Flagship',
      region: 'West',
      category: 'Lifestyle Sneaker',
      skuId: 'FW-005',
      skuName: 'Suede Classic XXI',
      footfall: 8800,
      tryOns: 5100,
      conversions: 1390,
      conversionRatePct: 15.8,
      sizeFillRatePct: 78.0,
      primaryRootCause: 'Fitting Room Queue Latency',
      revenueLakhs: 21.2,
      lossEstimateLakhs: 5.4,
    },
    {
      id: 'REC-003',
      period: '2026-W33',
      storeId: 'STORE-001',
      storeName: 'Mumbai High Street Flagship',
      region: 'West',
      category: 'Performance Running',
      skuId: 'FW-003',
      skuName: 'Deviate Nitro Elite',
      footfall: 5400,
      tryOns: 3132,
      conversions: 885,
      conversionRatePct: 16.4,
      sizeFillRatePct: 88.5,
      primaryRootCause: 'Normal Variance',
      revenueLakhs: 14.2,
      lossEstimateLakhs: 2.9,
    },
    {
      id: 'REC-004',
      period: '2026-W33',
      storeId: 'STORE-005',
      storeName: 'Pune Phoenix Mall',
      region: 'West',
      category: 'Performance Running',
      skuId: 'FW-001',
      skuName: 'Marathon Pro',
      footfall: 9200,
      tryOns: 5336,
      conversions: 1270,
      conversionRatePct: 13.8,
      sizeFillRatePct: 69.2,
      primaryRootCause: 'Stockout: UK 8',
      revenueLakhs: 24.0,
      lossEstimateLakhs: 10.8,
    },
    {
      id: 'REC-005',
      period: '2026-W33',
      storeId: 'STORE-002',
      storeName: 'Delhi South Extension Hub',
      region: 'North',
      category: 'Performance Running',
      skuId: 'FW-001',
      skuName: 'Marathon Pro',
      footfall: 12000,
      tryOns: 7200,
      conversions: 2220,
      conversionRatePct: 18.5,
      sizeFillRatePct: 94.0,
      primaryRootCause: 'Optimal Supply Chain',
      revenueLakhs: 38.0,
      lossEstimateLakhs: 1.2,
    },
    {
      id: 'REC-006',
      period: '2026-W33',
      storeId: 'STORE-003',
      storeName: 'Bengaluru Brigade Road BrandStore',
      region: 'South',
      category: 'Performance Running',
      skuId: 'FW-001',
      skuName: 'Marathon Pro',
      footfall: 11000,
      tryOns: 6600,
      conversions: 2080,
      conversionRatePct: 18.9,
      sizeFillRatePct: 95.0,
      primaryRootCause: 'Optimal Supply Chain',
      revenueLakhs: 36.5,
      lossEstimateLakhs: 1.0,
    },
  ];
}
