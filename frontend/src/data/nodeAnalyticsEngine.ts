/**
 * SoleSight Dynamic Node Analytics Engine
 * Computes live, responsive time-series trends, donut breakdowns, 5-stage funnels,
 * and statistical metrics based on the currently selected node in the Org Tree hierarchy.
 */

import { EXCEL_6MO_DATASET, type Excel6MoAuditRecord } from './excelDataset';
import type {
  FunnelStage,
} from '../types/retailRcaTypes';

export interface CategoryShareItem {
  name: string;
  value: number;
  color: string;
  count: string;
  revenueLakhs: number;
}

export interface RegionShareItem {
  name: string;
  value: number;
  color: string;
  count: string;
  storeCount: number;
}

export interface ScopeNarrativeInfo {
  title: string;
  findingText: string;
  headlineMetric: string;
  headlineDelta: string;
  isAnomaly: boolean;
  confidenceScore: number;
  confidenceTier: 'HIGH' | 'MEDIUM' | 'LOW';
  primaryCause: string;
  evidenceCitations: string[];
  recommendedAction: string;
  recoverableRevenueLakhs: number;
}

export class NodeAnalyticsEngine {
  /**
   * Filter 6-month records matching the given scope
   */
  private static filterRecords(storeId: string, region: string, searchQuery: string): Excel6MoAuditRecord[] {
    return (EXCEL_6MO_DATASET.auditRecords || []).filter((r: Excel6MoAuditRecord) => {
      // 1. Store Filter
      if (storeId && storeId !== 'All') {
        const normStore = storeId.replace('store-', '').trim();
        if (r.store_id !== normStore && !r.store_id.includes(normStore)) {
          return false;
        }
      }

      // 2. Region Filter
      if (region && region !== 'All') {
        const normReg = region.toLowerCase();
        if (!r.region.toLowerCase().includes(normReg)) {
          return false;
        }
      }

      // 3. SKU / Search Query
      if (searchQuery && searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesSku = r.sku_id.toLowerCase().includes(q) || r.sku_name.toLowerCase().includes(q);
        const matchesCat = r.category.toLowerCase().includes(q);
        if (!matchesSku && !matchesCat) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Dynamic Time-Series Trend Generator based on active scope
   */
  static getTimeSeries(
    storeId: string,
    region: string,
    searchQuery: string,
    cadence: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly' = 'Weekly',
    _kpi: string = 'conversion_rate'
  ): { period: string; actual: number; baseline: number; secondary: number; footfall: number; label?: string }[] {
    const records = this.filterRecords(storeId, region, searchQuery);

    // If monthly cadence requested
    if (cadence === 'Monthly') {
      const months = ['2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08'];
      const monthNames = ['March 2026', 'April 2026', 'May 2026', 'June 2026 (Stockout Dip)', 'July 2026', 'August 2026'];

      return months.map((m, idx) => {
        const monthRecs = records.filter((r) => r.period_month === m);
        const totalFootfall = monthRecs.reduce((acc, cur) => acc + cur.footfall, 0) || 12800;
        const totalConv = monthRecs.reduce((acc, cur) => acc + cur.conversions, 0);
        const avgConv = totalFootfall > 0 ? Number(((totalConv / totalFootfall) * 100).toFixed(1)) : 17.5;
        const avgFill = monthRecs.length > 0
          ? Number((monthRecs.reduce((acc, cur) => acc + cur.size_fill_rate_pct, 0) / monthRecs.length).toFixed(1))
          : 85.0;

        return {
          period: m,
          actual: avgConv,
          baseline: 18.3,
          secondary: avgFill,
          footfall: totalFootfall,
          label: monthNames[idx],
        };
      });
    }

    if (cadence === 'Daily') {
      // 10-day simulated daily horizon for the latest month
      const days = [
        { d: 'Aug 17', factor: 1.01 },
        { d: 'Aug 18', factor: 0.99 },
        { d: 'Aug 19', factor: 1.02 },
        { d: 'Aug 20', factor: 0.98 },
        { d: 'Aug 21', factor: 0.95 },
        { d: 'Aug 22', factor: 1.01 },
        { d: 'Aug 23', factor: 1.03 },
        { d: 'Aug 24', factor: 0.97 },
        { d: 'Aug 25', factor: 1.00 },
        { d: 'Aug 26', factor: 1.02 },
      ];

      // Base conversion from records
      const totalFootfall = records.reduce((acc, cur) => acc + cur.footfall, 0) || 14240;
      const totalConv = records.reduce((acc, cur) => acc + cur.conversions, 0);
      const baseConv = totalFootfall > 0 ? (totalConv / totalFootfall) * 100 : 17.2;

      return days.map((day) => ({
        period: day.d,
        actual: Number((baseConv * day.factor).toFixed(1)),
        baseline: 18.3,
        secondary: Number((85 * day.factor).toFixed(1)),
        footfall: Math.round((totalFootfall / 7) * day.factor),
      }));
    }

    // Default: 8-Week Longitudinal Sequence (2026-W26 to 2026-W33)
    const weeks = ['2026-W26', '2026-W27', '2026-W28', '2026-W29', '2026-W30', '2026-W31', '2026-W32', '2026-W33'];

    return weeks.map((w) => {
      const weekRecs = records.filter((r) => r.period_week === w);

      if (weekRecs.length > 0) {
        const footfall = weekRecs.reduce((acc, cur) => acc + cur.footfall, 0);
        const convs = weekRecs.reduce((acc, cur) => acc + cur.conversions, 0);
        const actualRate = footfall > 0 ? Number(((convs / footfall) * 100).toFixed(1)) : 17.5;
        const avgFillRate = Number((weekRecs.reduce((acc, cur) => acc + cur.size_fill_rate_pct, 0) / weekRecs.length).toFixed(1));

        return {
          period: w,
          actual: actualRate,
          baseline: 18.3,
          secondary: avgFillRate,
          footfall: footfall || 3150,
        };
      }

      // Fallback modeled curves based on store profile
      let baselineActual = 18.2;
      let stockoutDrop = 0;

      if (storeId === 'STORE-001' || storeId === 'STORE-014' || (region === 'West' && storeId === 'All')) {
        // Severe stockout in W32/W33
        if (w === '2026-W31') stockoutDrop = 1.0;
        if (w === '2026-W32') stockoutDrop = 3.5;
        if (w === '2026-W33') stockoutDrop = 4.7;
      } else if (storeId === 'STORE-005' || storeId === 'STORE-008') {
        // Moderate stockout
        if (w === '2026-W32') stockoutDrop = 2.0;
        if (w === '2026-W33') stockoutDrop = 3.2;
      } else if (storeId === 'STORE-002' || storeId === 'STORE-004' || region === 'North') {
        // Peak efficiency store
        baselineActual = 18.8;
      } else if (storeId === 'STORE-003' || storeId === 'STORE-007') {
        baselineActual = 18.5;
      }

      return {
        period: w,
        actual: Number((baselineActual - stockoutDrop).toFixed(1)),
        baseline: 18.3,
        secondary: Number((88 - stockoutDrop * 6).toFixed(1)),
        footfall: 3150 + Math.round((Math.sin(weeks.indexOf(w)) * 120)),
      };
    });
  }

  /**
   * Dynamic Product Category Breakdown Donut Data
   */
  static getCategoryBreakdown(storeId: string, region: string, searchQuery: string): CategoryShareItem[] {
    const records = this.filterRecords(storeId, region, searchQuery);

    const categories = [
      { name: 'Performance Running', color: '#059669', defaultPct: 48, defaultCount: 1842 },
      { name: 'Training & Gym', color: '#3b82f6', defaultPct: 32, defaultCount: 1210 },
      { name: 'Sportstyle & Retro', color: '#d97706', defaultPct: 20, defaultCount: 780 },
    ];

    if (records.length === 0) {
      return categories.map((c) => ({
        name: c.name,
        value: c.defaultPct,
        color: c.color,
        count: `${c.defaultCount.toLocaleString()} pairs`,
        revenueLakhs: Number((c.defaultPct * 0.85).toFixed(1)),
      }));
    }

    const totalRevenue = records.reduce((acc, cur) => acc + cur.revenue_lakhs, 0) || 1;
    const catMap: Record<string, { count: number; rev: number }> = {
      'Performance Running': { count: 0, rev: 0 },
      'Training & Gym': { count: 0, rev: 0 },
      'Sportstyle & Retro': { count: 0, rev: 0 },
    };

    records.forEach((r) => {
      const cat = (r.category || '').toLowerCase();
      let targetName = 'Performance Running';
      if (cat.includes('train') || cat.includes('gym')) {
        targetName = 'Training & Gym';
      } else if (cat.includes('sport') || cat.includes('retro') || cat.includes('lifestyle')) {
        targetName = 'Sportstyle & Retro';
      }
      catMap[targetName].count += (r.conversions || 1);
      catMap[targetName].rev += (r.revenue_lakhs || 0.1);
    });

    return categories.map((c) => {
      const found = catMap[c.name] || { count: c.defaultCount, rev: 1.0 };
      const computedCount = found.count > 0 ? found.count : c.defaultCount;
      const pct = Math.max(5, Math.round((found.rev / totalRevenue) * 100)) || c.defaultPct;
      return {
        name: c.name,
        value: pct,
        color: c.color,
        count: `${computedCount.toLocaleString()} pairs`,
        revenueLakhs: Number((found.rev > 0 ? found.rev : c.defaultPct * 0.85).toFixed(1)),
      };
    });
  }

  /**
   * Dynamic Regional Breakdown Donut Data
   */
  static getRegionalBreakdown(_storeId: string, _region: string, searchQuery: string): RegionShareItem[] {
    const records = this.filterRecords('All', 'All', searchQuery);

    const regions = [
      { name: 'West Region (Mumbai / Pune / AHM)', key: 'west', color: '#3b82f6', defaultPct: 42, defaultCount: 2240, storeCount: 3 },
      { name: 'North Region (Delhi NCR / GGN)', key: 'north', color: '#059669', defaultPct: 35, defaultCount: 1850, storeCount: 2 },
      { name: 'South Region (BLR / HYD / MAA)', key: 'south', color: '#d97706', defaultPct: 23, defaultCount: 1210, storeCount: 3 },
    ];

    if (records.length === 0) {
      return regions.map((r) => ({
        name: r.name,
        value: r.defaultPct,
        color: r.color,
        count: `${r.defaultCount.toLocaleString()} pairs`,
        storeCount: r.storeCount,
      }));
    }

    const totalConv = records.reduce((acc, cur) => acc + cur.conversions, 0) || 1;
    const regMap: Record<string, number> = { west: 0, north: 0, south: 0 };

    records.forEach((r) => {
      const reg = (r.region || '').toLowerCase();
      const k = reg.includes('north')
        ? 'north'
        : reg.includes('south')
        ? 'south'
        : 'west';
      regMap[k] += (r.conversions || 1);
    });

    return regions.map((r) => {
      const c = regMap[r.key] || 0;
      const finalCount = c > 0 ? c : r.defaultCount;
      const pct = Math.max(5, Math.round((finalCount / totalConv) * 100)) || r.defaultPct;
      return {
        name: r.name,
        value: pct,
        color: r.color,
        count: `${finalCount.toLocaleString()} pairs`,
        storeCount: r.storeCount,
      };
    });
  }

  /**
   * Dynamic 5-Stage Conversion Funnel based on active scope & scenario
   */
  static getFunnel(
    storeId: string,
    region: string,
    _searchQuery: string,
    selectedScenario: string = 'hero'
  ): FunnelStage[] {
    const isNorthHealthy = storeId === 'STORE-002' || storeId === 'STORE-004' || region === 'North';
    const isEnterprise = storeId === 'All' && region === 'All';

    // Scenario: Normal Baseline (18.9% conversion, zero stockout bottlenecks)
    if (selectedScenario === 'normal') {
      return [
        {
          id: 'f1',
          stageName: '1. Store Footfall & Walk-ins',
          count: 14800,
          pctOfTotal: 100.0,
          dropOffCount: 2960,
          dropOffPct: 20.0,
          primaryLeakageReason: 'Casual Browsing & Window Visitors',
          leakageValueINR: 120000,
          leakageValueLakhs: 1.2,
          confidenceTier: 'HIGH',
          actionableDriver: 'Entrance Merchandising',
        },
        {
          id: 'f2',
          stageName: '2. Try-On & Size Engagement',
          count: 11840,
          pctOfTotal: 80.0,
          dropOffCount: 2360,
          dropOffPct: 19.9,
          primaryLeakageReason: 'Optimal Size Fill (97.8% On-Shelf Availability)',
          leakageValueINR: 0,
          leakageValueLakhs: 0.0,
          confidenceTier: 'HIGH',
          actionableDriver: 'Maintain Full-Curve Stock Coverage',
        },
        {
          id: 'f3',
          stageName: '3. Staff Consultation & Sizing',
          count: 9480,
          pctOfTotal: 64.1,
          dropOffCount: 1890,
          dropOffPct: 19.9,
          primaryLeakageReason: 'Staff Sizing Assistance (High Efficiency)',
          leakageValueINR: 0,
          leakageValueLakhs: 0.0,
          confidenceTier: 'HIGH',
          actionableDriver: 'Maintain Staff Alignment',
        },
        {
          id: 'f4',
          stageName: '4. Fitting Room & Intent Match',
          count: 7590,
          pctOfTotal: 51.3,
          dropOffCount: 4790,
          dropOffPct: 63.1,
          primaryLeakageReason: 'Normal Style / Color Preference Selection',
          leakageValueINR: 180000,
          leakageValueLakhs: 1.8,
          confidenceTier: 'MEDIUM',
          actionableDriver: 'Cross-Sell Performance Socks',
        },
        {
          id: 'f5',
          stageName: '5. POS Checkout (Converted)',
          count: 2800,
          pctOfTotal: 18.9,
          dropOffCount: 0,
          dropOffPct: 0.0,
          primaryLeakageReason: 'Target Exceeded POS Conversions (18.9% vs 18.3%)',
          leakageValueINR: 0,
          leakageValueLakhs: 0.0,
          confidenceTier: 'HIGH',
          actionableDriver: 'Store Recognition & Best Practice Sharing',
        },
      ];
    }

    // Scenario: Abstention / Contradictory Low-Confidence
    if (selectedScenario === 'abstention') {
      return [
        {
          id: 'f1',
          stageName: '1. Store Footfall & Walk-ins',
          count: 13800,
          pctOfTotal: 100.0,
          dropOffCount: 2480,
          dropOffPct: 18.0,
          primaryLeakageReason: 'Local Storm Weather Residual (32% variance)',
          leakageValueINR: 280000,
          leakageValueLakhs: 2.8,
          confidenceTier: 'LOW',
          actionableDriver: 'Inclement Weather Floor Layout',
        },
        {
          id: 'f2',
          stageName: '2. Try-On & Size Engagement',
          count: 11320,
          pctOfTotal: 82.0,
          dropOffCount: 2600,
          dropOffPct: 23.0,
          primaryLeakageReason: 'Competitor Price Sensitivity (28% variance)',
          leakageValueINR: 240000,
          leakageValueLakhs: 2.4,
          confidenceTier: 'LOW',
          actionableDriver: 'Competitor Price Match Verification',
        },
        {
          id: 'f3',
          stageName: '3. Staff Consultation & Sizing',
          count: 8720,
          pctOfTotal: 63.2,
          dropOffCount: 2880,
          dropOffPct: 33.0,
          primaryLeakageReason: 'Fitting Queue Shift Friction (40% variance)',
          leakageValueINR: 340000,
          leakageValueLakhs: 3.4,
          confidenceTier: 'LOW',
          actionableDriver: 'Floor Shift Balancing',
        },
        {
          id: 'f4',
          stageName: '4. Fitting Room & Intent Match',
          count: 5840,
          pctOfTotal: 42.3,
          dropOffCount: 3480,
          dropOffPct: 59.6,
          primaryLeakageReason: 'Ambiguous Contradictory Intent Signals',
          leakageValueINR: 190000,
          leakageValueLakhs: 1.9,
          confidenceTier: 'LOW',
          actionableDriver: 'Manual Store Manager Audit',
        },
        {
          id: 'f5',
          stageName: '5. POS Checkout (Converted)',
          count: 2360,
          pctOfTotal: 17.1,
          dropOffCount: 0,
          dropOffPct: 0.0,
          primaryLeakageReason: 'Sub-Target POS Conversions (17.1% vs 18.3%)',
          leakageValueINR: 0,
          leakageValueLakhs: 0.0,
          confidenceTier: 'LOW',
          actionableDriver: 'Trigger On-Site Auditor Audit',
        },
      ];
    }

    // Scenario: Sparse History (SKU-9901 / FW-016 Trailblazer, < 3 observations)
    if (selectedScenario === 'sparse') {
      return [
        {
          id: 'f1',
          stageName: '1. Store Footfall & Walk-ins',
          count: 14200,
          pctOfTotal: 100.0,
          dropOffCount: 2270,
          dropOffPct: 16.0,
          primaryLeakageReason: 'New Product Display Launch Browsing',
          leakageValueINR: 0,
          leakageValueLakhs: 0.0,
          confidenceTier: 'LOW',
          actionableDriver: 'Product Launch Merchandising',
        },
        {
          id: 'f2',
          stageName: '2. Try-On & Size Engagement',
          count: 11930,
          pctOfTotal: 84.0,
          dropOffCount: 2380,
          dropOffPct: 20.0,
          primaryLeakageReason: 'Initial Sizing Curve Exploration',
          leakageValueINR: 0,
          leakageValueLakhs: 0.0,
          confidenceTier: 'LOW',
          actionableDriver: 'Monitor Early Size Velocity',
        },
        {
          id: 'f3',
          stageName: '3. Staff Consultation & Sizing',
          count: 9550,
          pctOfTotal: 67.3,
          dropOffCount: 1910,
          dropOffPct: 20.0,
          primaryLeakageReason: 'Sales Rep Product Feature Pitch',
          leakageValueINR: 0,
          leakageValueLakhs: 0.0,
          confidenceTier: 'LOW',
          actionableDriver: 'Staff Product Knowledge',
        },
        {
          id: 'f4',
          stageName: '4. Fitting Room & Intent Match',
          count: 7640,
          pctOfTotal: 53.8,
          dropOffCount: 4740,
          dropOffPct: 62.0,
          primaryLeakageReason: 'Early Price & Cushion Feel Evaluation',
          leakageValueINR: 0,
          leakageValueLakhs: 0.0,
          confidenceTier: 'LOW',
          actionableDriver: 'Collect Try-on Feedback',
        },
        {
          id: 'f5',
          stageName: '5. POS Checkout (Converted)',
          count: 2900,
          pctOfTotal: 17.6,
          dropOffCount: 0,
          dropOffPct: 0.0,
          primaryLeakageReason: 'Sparse History: 2 observations (< 3 threshold). Anomaly alerts suppressed.',
          leakageValueINR: 0,
          leakageValueLakhs: 0.0,
          confidenceTier: 'LOW',
          actionableDriver: 'Allow Baseline History to Accumulate',
        },
      ];
    }

    if (isEnterprise) {
      return [
        {
          id: 'f1',
          stageName: '1. Store Footfall & Walk-ins',
          count: 168000,
          pctOfTotal: 100.0,
          dropOffCount: 42000,
          dropOffPct: 25.0,
          primaryLeakageReason: 'Casual Browsing / Window Shoppers',
          leakageValueINR: 2400000,
          leakageValueLakhs: 24.0,
          confidenceTier: 'MEDIUM',
          actionableDriver: 'Entry Displays & Front Merchandising',
        },
        {
          id: 'f2',
          stageName: '2. Try-On & Size Engagement',
          count: 126000,
          pctOfTotal: 75.0,
          dropOffCount: 48000,
          dropOffPct: 38.1,
          primaryLeakageReason: 'West & South Region Core Stockout (UK 8/9)',
          leakageValueINR: 3450000,
          leakageValueLakhs: 34.5,
          confidenceTier: 'HIGH',
          actionableDriver: 'Inter-Store Hub Replenishment',
        },
        {
          id: 'f3',
          stageName: '3. Staff Consultation & Sizing',
          count: 78000,
          pctOfTotal: 46.4,
          dropOffCount: 28000,
          dropOffPct: 35.9,
          primaryLeakageReason: 'Peak Hours Fitting Staff Assistance Lag',
          leakageValueINR: 1400000,
          leakageValueLakhs: 14.0,
          confidenceTier: 'HIGH',
          actionableDriver: 'Weekend Shift Sizing Runners',
        },
        {
          id: 'f4',
          stageName: '4. Fitting Room & Intent Match',
          count: 50000,
          pctOfTotal: 29.8,
          dropOffCount: 21100,
          dropOffPct: 42.2,
          primaryLeakageReason: 'Price Elasticity & Color Preference',
          leakageValueINR: 890000,
          leakageValueLakhs: 8.9,
          confidenceTier: 'LOW',
          actionableDriver: 'Instant Style Substitute Recommendation',
        },
        {
          id: 'f5',
          stageName: '5. POS Checkout (Converted)',
          count: 28900,
          pctOfTotal: 17.2,
          dropOffCount: 0,
          dropOffPct: 0.0,
          primaryLeakageReason: 'Successful Network POS Conversions (17.2% Rate)',
          leakageValueINR: 0,
          leakageValueLakhs: 0.0,
          confidenceTier: 'HIGH',
          actionableDriver: 'Loyalty Retention & Warranty Activation',
        },
      ];
    }

    if (isNorthHealthy) {
      return [
        {
          id: 'f1',
          stageName: '1. Store Footfall & Walk-ins',
          count: 19500,
          pctOfTotal: 100.0,
          dropOffCount: 3900,
          dropOffPct: 20.0,
          primaryLeakageReason: 'Casual Browsing',
          leakageValueINR: 280000,
          leakageValueLakhs: 2.8,
          confidenceTier: 'MEDIUM',
          actionableDriver: 'Entrance Merchandising',
        },
        {
          id: 'f2',
          stageName: '2. Try-On & Size Engagement',
          count: 15600,
          pctOfTotal: 80.0,
          dropOffCount: 3120,
          dropOffPct: 20.0,
          primaryLeakageReason: 'Optimal Supply Chain (94.0% Size Fill)',
          leakageValueINR: 120000,
          leakageValueLakhs: 1.2,
          confidenceTier: 'HIGH',
          actionableDriver: 'Maintain High Service Level',
        },
        {
          id: 'f3',
          stageName: '3. Staff Consultation & Sizing',
          count: 12480,
          pctOfTotal: 64.0,
          dropOffCount: 3740,
          dropOffPct: 30.0,
          primaryLeakageReason: 'Normal Trial Filter',
          leakageValueINR: 150000,
          leakageValueLakhs: 1.5,
          confidenceTier: 'MEDIUM',
          actionableDriver: 'Staff Training',
        },
        {
          id: 'f4',
          stageName: '4. Fitting Room & Intent Match',
          count: 8740,
          pctOfTotal: 44.8,
          dropOffCount: 5133,
          dropOffPct: 58.7,
          primaryLeakageReason: 'Color / Premium Price Filter',
          leakageValueINR: 210000,
          leakageValueLakhs: 2.1,
          confidenceTier: 'LOW',
          actionableDriver: 'Upsell Bundle Promos',
        },
        {
          id: 'f5',
          stageName: '5. POS Checkout (Converted)',
          count: 3607,
          pctOfTotal: 18.5,
          dropOffCount: 0,
          dropOffPct: 0.0,
          primaryLeakageReason: 'High Benchmark POS Conversion (18.5% Conv)',
          leakageValueINR: 0,
          leakageValueLakhs: 0.0,
          confidenceTier: 'HIGH',
          actionableDriver: 'Replicate Best Practices to West Region',
        },
      ];
    }

    // Default Hero Anomaly Store (STORE-001 Mumbai High Street)
    return [
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
  }

  /**
   * Contextual Narrative Generator tailored to active node, scenario & persona
   */
  static getNarrative(
    storeId: string,
    region: string,
    _searchQuery: string,
    selectedScenario: string = 'hero',
    persona: string = 'store_manager'
  ): ScopeNarrativeInfo {
    const isNorth = storeId === 'STORE-002' || storeId === 'STORE-004' || (storeId === 'All' && region === 'North');
    const isSouth = storeId === 'STORE-003' || storeId === 'STORE-007' || (storeId === 'All' && region === 'South');
    const isEnterprise = storeId === 'All' && region === 'All';
    const storeLabel = storeId !== 'All' ? storeId : 'West Region (Mumbai / Pune)';

    if (selectedScenario === 'normal') {
      if (persona === 'cfo_finance') {
        return {
          title: `Optimal Portfolio Performance & Margin Briefing: ${storeLabel}`,
          findingText: `Footwear network conversion is operating at an optimal 18.9% (+3.3% above plan). Revenue generation is robust with healthy realized gross margins of 58.2% and zero material capital leakage across all footwear categories.`,
          headlineMetric: '18.9%',
          headlineDelta: '+0.6pp (+3.3% above target)',
          isAnomaly: false,
          confidenceScore: 0.98,
          confidenceTier: 'HIGH',
          primaryCause: 'Healthy Revenue Throughput & High Full-Price Sell-Through',
          evidenceCitations: ['[1] Portfolio Conversion: 18.9%', '[2] Gross Margin: 58.2%', '[3] Zero Material Leakage'],
          recommendedAction: 'Maintain current working capital allocation and continue standard inventory cycle replenishments.',
          recoverableRevenueLakhs: 0.0,
        };
      }
      if (persona === 'regional_ops') {
        return {
          title: `Regional Operational Benchmark Briefing: ${storeLabel}`,
          findingText: `All regional stores are performing smoothly within target parameters with conversion averaging 18.9%. Central DC fulfillment lead time is within SLA (2.1 days) and size-curve fill rate is at 98.2% across core lines.`,
          headlineMetric: '18.9%',
          headlineDelta: '+0.6pp (+3.3% vs benchmark)',
          isAnomaly: false,
          confidenceScore: 0.98,
          confidenceTier: 'HIGH',
          primaryCause: 'Optimal Supply Chain Logistics & Full Size Availability',
          evidenceCitations: ['[1] Size-Fill Rate: 98.2%', '[2] DC Transit Lead Time: 2.1d (SLA Pass)', '[3] Mystery Audit: 94.2/100'],
          recommendedAction: 'Maintain standard regional logistics schedules and use store scheduling protocols as cluster benchmark.',
          recoverableRevenueLakhs: 0.0,
        };
      }
      if (persona === 'marketing_growth') {
        return {
          title: `Campaign Yield & Acquisition Benchmark: ${storeLabel}`,
          findingText: `Marketing campaign acquisition is converting efficiently at 18.9% (+3.3% ahead of target). Shopper trial-to-purchase funnel friction is minimal, maximizing return on ad spend (ROAS 4.2x across active campaigns).`,
          headlineMetric: '18.9%',
          headlineDelta: '+3.3% Campaign Conversion',
          isAnomaly: false,
          confidenceScore: 0.98,
          confidenceTier: 'HIGH',
          primaryCause: 'High Ad Intent Matched with Full Size Availability',
          evidenceCitations: ['[1] Nitro Campaign ROAS: 4.2x', '[2] Customer Sentiment: 94% Positive', '[3] Zero Size Drop-offs'],
          recommendedAction: 'Scale regional digital media ad budget into high-performing retail catchments.',
          recoverableRevenueLakhs: 0.0,
        };
      }
      return {
        title: `Optimal Baseline Performance: ${storeLabel}`,
        findingText: `Store conversion is running ahead of plan at 18.9% (vs 18.3% target). Full size-curve coverage across UK 6–11 and prompt sizing consultation kept customer try-on walk-aways at historical lows.`,
        headlineMetric: '18.9%',
        headlineDelta: '+0.6pp (+3.3% above target)',
        isAnomaly: false,
        confidenceScore: 0.98,
        confidenceTier: 'HIGH',
        primaryCause: 'Optimal Full-Curve Size Availability & Merchandising',
        evidenceCitations: ['[1] fact_inventory fill: 98.2%', '[2] Zero Stockout Incidences', '[3] Sizing Score: 94.2/100'],
        recommendedAction: 'Maintain current inventory safety stocks and standard shift allocations.',
        recoverableRevenueLakhs: 0.0,
      };
    }

    if (selectedScenario === 'abstention') {
      if (persona === 'cfo_finance') {
        return {
          title: `Capital Risk & Causal Inconclusive Briefing: ${storeLabel}`,
          findingText: `Financial causal attribution is currently inconclusive (P=0.40 confidence). Revenue variation is fragmented across rainy weather disruption (32%), promotional price matching (28%), and trial queue friction (40%). Committing unverified capital replenishment poses dead-stock risk.`,
          headlineMetric: '17.1%',
          headlineDelta: '-1.2pp (-6.5% drift) [Abstention]',
          isAnomaly: true,
          confidenceScore: 0.40,
          confidenceTier: 'LOW',
          primaryCause: 'Multi-Factor Signal Ambiguity (Abstention Enforced)',
          evidenceCitations: ['[1] Dispersed Cross-Store Scatter: R²=0.22', '[2] Capital Allocation Risk: High', '[3] Conflicting Econometric Coefficients'],
          recommendedAction: 'Hold emergency capital transfers until an on-site physical stock count validates true store-level demand.',
          recoverableRevenueLakhs: 8.6,
        };
      }
      if (persona === 'regional_ops') {
        return {
          title: `Regional Operational Diagnostic (Abstention): ${storeLabel}`,
          findingText: `Operational signals at ${storeLabel} show high variance with conflicting drivers: rainy weekend traffic drop (32%), competitor discounts (28%), and peak fitting queue friction (40%). Attribution confidence (P=0.40) falls below the regional intervention threshold.`,
          headlineMetric: '17.1%',
          headlineDelta: '-1.2pp (-6.5% drift) [Abstention]',
          isAnomaly: true,
          confidenceScore: 0.40,
          confidenceTier: 'LOW',
          primaryCause: 'Operational Collinearity & Signal Ambiguity',
          evidenceCitations: ['[1] Inconsistent Sizing Audit Reports', '[2] Multi-Store Variance Spread', '[3] Uncorrelated Transit Lags'],
          recommendedAction: 'Dispatch a Regional Operations Field Specialist to conduct a physical floor sizing audit before executing inter-store inventory transfers.',
          recoverableRevenueLakhs: 8.6,
        };
      }
      if (persona === 'marketing_growth') {
        return {
          title: `Campaign Elasticity & Signal Noise Alert: ${storeLabel}`,
          findingText: `Campaign ROI signals are ambiguous at ${storeLabel}. While active ad campaigns generated steady impressions, traffic variance is split between inclement monsoon rainfall (32%) and competitor promotional discounts (28%). Marketing attribution confidence is capped at LOW (P=0.40).`,
          headlineMetric: '17.1%',
          headlineDelta: '-1.2pp (-6.5% drift) [Abstention]',
          isAnomaly: true,
          confidenceScore: 0.40,
          confidenceTier: 'LOW',
          primaryCause: 'Campaign Acquisition Intent vs Weather/Competitor Noise',
          evidenceCitations: ['[1] Competitor Discount Gap: -20%', '[2] Weather Residual Ambiguity: 32%', '[3] Campaign ROAS Elasticity Split'],
          recommendedAction: 'Maintain current digital campaign flighting and avoid changing regional ad budgets until clean signal emerges.',
          recoverableRevenueLakhs: 8.6,
        };
      }
      return {
        title: `Floor Operations Diagnostic (Abstention): ${storeLabel}`,
        findingText: `Causal attribution confidence is below decision threshold (P=0.40). Contradictory signals across local weather rain (32%), competitor price promotion (28%), and peak shift delays (40%) prevent deterministic root-cause assignment. On-site audit verification recommended.`,
        headlineMetric: '17.1%',
        headlineDelta: '-1.2pp (-6.5% drift) [Low Confidence]',
        isAnomaly: true,
        confidenceScore: 0.40,
        confidenceTier: 'LOW',
        primaryCause: 'Multi-Factor Signal Ambiguity (Abstention Triggered)',
        evidenceCitations: ['[1] Conflicting Mystery Audit Reports', '[2] Dispersed Cross-Store Scatter', '[3] Weather Residual Ambiguity'],
        recommendedAction: 'Dispatch store operations auditor to perform physical floor sizing audit before executing capital transfers.',
        recoverableRevenueLakhs: 8.6,
      };
    }

    if (selectedScenario === 'sparse') {
      if (persona === 'cfo_finance') {
        return {
          title: `New SKU Portfolio Intake Briefing: SKU-9901 (FW-016 Trailblazer)`,
          findingText: `Newly launched SKU-9901 (FW-016 Trailblazer) has accumulated only 2 weekly sales observations (< 3 threshold). The engine flagged is_sparse_history: true and activated wide ±4.5σ tolerance bands, suppressing premature inventory impairment write-offs or false financial alarms.`,
          headlineMetric: '17.6%',
          headlineDelta: '±0.1pp (Sparse History — Tolerance Bands Active)',
          isAnomaly: false,
          confidenceScore: 0.50,
          confidenceTier: 'LOW',
          primaryCause: 'New Product Launch Calibration (Financial Baseline Forming)',
          evidenceCitations: [
            '[1] Observations: 2 (< 3 threshold)',
            '[2] is_sparse_history: true (±4.5σ wide band)',
            '[3] Financial Anomaly Suppressed'
          ],
          recommendedAction: 'Allow commercial sales data to mature over 2 more weekly cycles before establishing working capital reorder benchmarks.',
          recoverableRevenueLakhs: 0.0,
        };
      }
      if (persona === 'regional_ops') {
        return {
          title: `New SKU Cluster Rollout Diagnostic: SKU-9901 (FW-016 Trailblazer)`,
          findingText: `Initial distribution of FW-016 Trailblazer across regional stores is in its initial 2-week launch window. With sparse history (< 3 observations), standard anomaly detection is softened (±4.5σ band) to prevent unwarranted transfer requests while sell-through patterns settle.`,
          headlineMetric: '17.6%',
          headlineDelta: '±0.1pp (Sparse History — Tolerance Bands Active)',
          isAnomaly: false,
          confidenceScore: 0.50,
          confidenceTier: 'LOW',
          primaryCause: 'Initial Store Placement Phase (Sparse History)',
          evidenceCitations: [
            '[1] Store Distribution: 8 / 8 Stores',
            '[2] 2 Weekly Observations Logged',
            '[3] False Anomaly Alarm Suppressed'
          ],
          recommendedAction: 'Monitor initial weekly intake velocity across regional clusters without modifying core replenishment schedules.',
          recoverableRevenueLakhs: 0.0,
        };
      }
      if (persona === 'marketing_growth') {
        return {
          title: `New Product Launch Trajectory: SKU-9901 (FW-016 Trailblazer)`,
          findingText: `FW-016 Trailblazer launched this month and has logged 2 weekly cycles. Initial social media teaser impressions are converting steadily (17.6% conversion). The system flagged sparse history (< 3 observations), ensuring campaign evaluation accounts for early launch adoption ramp.`,
          headlineMetric: '17.6%',
          headlineDelta: '±0.1pp (Sparse History — Tolerance Bands Active)',
          isAnomaly: false,
          confidenceScore: 0.50,
          confidenceTier: 'LOW',
          primaryCause: 'Early Launch Adoption Ramp (Sparse History)',
          evidenceCitations: [
            '[1] 2 Weeks of Launch Campaign Data',
            '[2] Conversion: 17.6% (Healthy Initial Ramp)',
            '[3] Zero False Drop Alerts'
          ],
          recommendedAction: 'Continue planned launch social ad campaign flighting to build consumer awareness for Trail Blazer.',
          recoverableRevenueLakhs: 0.0,
        };
      }
      return {
        title: `Sparse-History SKU Diagnostic: SKU-9901 (FW-016 Trailblazer)`,
        findingText: `Newly launched SKU-9901 (FW-016 Trailblazer) has only 2 weekly observations (< 3 threshold). The engine flagged is_sparse_history: true and expanded tolerance bands to ±4.5σ, successfully suppressing premature false-positive anomaly alarms while sales velocity establishes baseline.`,
        headlineMetric: '17.6%',
        headlineDelta: '±0.1pp (Sparse History — Tolerance Bands Active)',
        isAnomaly: false,
        confidenceScore: 0.50,
        confidenceTier: 'LOW',
        primaryCause: 'Sparse-History SKU Calibration (Alarm Suppressed)',
        evidenceCitations: [
          '[1] Observations: 2 (< 3 threshold)',
          '[2] is_sparse_history: true (±4.5σ wide band)',
          '[3] False-positive anomaly suppressed per PRD §6'
        ],
        recommendedAction: 'Allow baseline sales history to accumulate over next 2 reporting cycles before applying standard ±2σ anomaly boundaries.',
        recoverableRevenueLakhs: 0.0,
      };
    }

    if (isEnterprise) {
      if (persona === 'cfo_finance') {
        return {
          title: 'Enterprise Portfolio Revenue Leakage Briefing',
          findingText: 'Network-wide revenue at risk is ₹54.2 Lakhs driven by supply chain stockouts concentrated in West Region flagships. North Region maintains an 18.8% conversion benchmark with zero material capital leakage.',
          headlineMetric: '₹54.2L',
          headlineDelta: '-1.1pp conversion drift (-6.0%)',
          isAnomaly: false,
          confidenceScore: 0.96,
          confidenceTier: 'HIGH',
          primaryCause: 'Regional Inventory Allocation Imbalance',
          evidenceCitations: ['[1] fact_inventory network fill: 85.2%', '[2] Gross Margin Drag: 3.2pp', '[3] 6,380 Longitudinal Audits'],
          recommendedAction: 'Authorize ₹1.2L inter-DC logistics rebalance to recover ₹54.2L top-line revenue (45.1x ROI).',
          recoverableRevenueLakhs: 54.2,
        };
      }
      return {
        title: 'Enterprise Footwear Network Causal Synthesis',
        findingText:
          'Network-wide Footwear Conversion stands at 17.2% (vs 18.3% target). Regional variance shows West Region underperforming due to stockouts in Mumbai (STORE-001) and Pune (STORE-005), while North Region maintains high performance benchmark (18.8%).',
        headlineMetric: '17.2%',
        headlineDelta: '-1.1pp (-6.0% network drift)',
        isAnomaly: false,
        confidenceScore: 0.96,
        confidenceTier: 'HIGH',
        primaryCause: 'Regional Inventory Imbalance (Central DC)',
        evidenceCitations: ['[1] fact_inventory network fill: 85.2%', '[2] Multi-Store Dose-Response r=0.783', '[3] 6,380 Longitudinal Audits'],
        recommendedAction: 'Reallocate 240 units from North DC overstock to West Region Flagships.',
        recoverableRevenueLakhs: 54.2,
      };
    }

    if (isNorth) {
      const sName = storeId !== 'All' ? storeId : 'North Region Cluster';
      return {
        title: `Optimal Benchmark Performance: ${sName}`,
        findingText: `Conversion in ${sName} is performing strongly at 18.5%–19.1% (above the 18.3% baseline target). Supply chain fill rate is healthy at 94.0%, and mystery audits confirm high sizing guidance effectiveness (91.0/100).`,
        headlineMetric: '18.8%',
        headlineDelta: '+0.5pp (+2.7% above baseline)',
        isAnomaly: false,
        confidenceScore: 0.98,
        confidenceTier: 'HIGH',
        primaryCause: 'Optimal Supply Chain & High Size-Fill Rate',
        evidenceCitations: ['[1] fact_inventory UK8/9 fill: 94.0%', '[2] Mystery Audit Score: 91.0/100', '[3] Zero stockout incidences'],
        recommendedAction: 'Document North Region SOPs and inventory staging protocols as network benchmark.',
        recoverableRevenueLakhs: 3.5,
      };
    }

    if (isSouth) {
      const sName = storeId !== 'All' ? storeId : 'South Region Cluster';
      return {
        title: `Regional Performance Overview: ${sName}`,
        findingText: `Conversion in ${sName} averaged 17.6%. While Bengaluru (STORE-003) and Hyderabad (STORE-007) are healthy at 18.9% and 17.9%, Chennai (STORE-008) experienced try-on drop-offs with stockouts on Suede Classic XXI.`,
        headlineMetric: '17.6%',
        headlineDelta: '-0.7pp (-3.8% variance)',
        isAnomaly: false,
        confidenceScore: 0.91,
        confidenceTier: 'HIGH',
        primaryCause: 'Localized Sizing Lag in Chennai Express',
        evidenceCitations: ['[1] fact_inventory Chennai fill: 79.4%', '[2] Staff assistance score: 76.0/100'],
        recommendedAction: 'Dispatch 30 units of lifestyle footwear to Chennai Express Avenue.',
        recoverableRevenueLakhs: 14.1,
      };
    }

    // Default Hero Anomaly: STORE-001 (Mumbai Flagship) tailored per Persona
    if (persona === 'cfo_finance') {
      return {
        title: `CFO Financial Risk Briefing: ${storeLabel}`,
        findingText: `Top-line conversion drag of -24.0% at ${storeLabel} created ₹13.4 Lakhs in direct recoverable revenue leakage (and ₹24.8 Lakhs total drop-off leakage). Footfall remained stable at 14,240, confirming demand was present but unmonetized due to stock shortages on high-margin SKU FW-001 Marathon Pro.`,
        headlineMetric: '₹13.4L Risk',
        headlineDelta: '-24.0% conversion drop (₹13.4L leakage)',
        isAnomaly: true,
        confidenceScore: 0.94,
        confidenceTier: 'HIGH',
        primaryCause: 'High-Margin SKU Size-Curve Stockout (UK 8 & 9)',
        evidenceCitations: ['[1] Direct Revenue Leakage: ₹13,40,000', '[2] Cross-Store Regression: R²=0.78', '[3] Gross Margin Impact: -2.1pp'],
        recommendedAction: 'Approve ₹45,000 emergency DC dispatch to capture ₹13,40,000 gross revenue (29.8x ROI).',
        recoverableRevenueLakhs: 13.4,
      };
    }

    if (persona === 'regional_ops') {
      return {
        title: `Regional Logistics & Sales Ops Diagnostic: ${storeLabel}`,
        findingText: `${storeLabel} conversion fell to 15.8% (vs 18.8% North benchmark). Root-cause triangulation confirms upstream fulfillment failure on FW-001 (UK 8 & 9 at 0 stock for 6 days). Mystery shopper sizing guidance scored 51.9/100 during weekend rush shifts due to floor runner lag.`,
        headlineMetric: '15.8% (West)',
        headlineDelta: '-3.0pp vs Regional Benchmark (18.8%)',
        isAnomaly: true,
        confidenceScore: 0.94,
        confidenceTier: 'HIGH',
        primaryCause: 'Regional Warehouse Allocation Lag & Floor Runner Lag',
        evidenceCitations: ['[1] fact_inventory: 0-stock 6d on UK 8/9', '[2] Sizing Guidance Audit: 51.9/100', '[3] Dose-Response r=0.783 (p=0.02)'],
        recommendedAction: 'Trigger inter-branch transfer of 40 units from Pune DC and adjust weekend runner schedules.',
        recoverableRevenueLakhs: 13.4,
      };
    }

    if (persona === 'marketing_growth') {
      return {
        title: `Campaign Traffic & Trial Conversion Diagnostic: ${storeLabel}`,
        findingText: `The Nitro Running Campaign successfully drove 14,240 customer walk-ins (+3.9% footfall lift), validating media campaign acquisition. However, purchase conversion collapsed by 24.0% at the try-on stage because advertised core sizes UK 8 & 9 were missing on the shelf, dampening campaign ROAS.`,
        headlineMetric: '+3.9% Footfall',
        headlineDelta: '-24.0% Try-on Conversion Drag',
        isAnomaly: true,
        confidenceScore: 0.94,
        confidenceTier: 'HIGH',
        primaryCause: 'Campaign Footfall Intent Blocked by Rack Size Stockout',
        evidenceCitations: ['[1] Nitro Campaign Footfall: +3.9%', '[2] Size Stockout Friction on Hero SKU', '[3] Customer Try-On Walk-Away: 41.6%'],
        recommendedAction: 'Coordinate emergency replenishment of core sizes to protect campaign acquisition ROAS.',
        recoverableRevenueLakhs: 13.4,
      };
    }

    // Store Operations Manager (Rahul Sharma)
    return {
      title: `Store Operations Floor Briefing: ${storeLabel}`,
      findingText: `Conversion dropped 24.0% at ${storeLabel} this week (15.8% actual vs 18.3% target), while walk-in footfall traffic remained flat & stable at 14,240 (~7% noise). The material deficit is deterministically driven by a hero size-curve stockout on Marathon Pro (FW-001) in core sizes UK 8 & UK 9.`,
      headlineMetric: '15.8%',
      headlineDelta: '-2.5pp (-24.0% anomaly drop)',
      isAnomaly: true,
      confidenceScore: 0.94,
      confidenceTier: 'HIGH',
      primaryCause: 'Hero Size-Curve Stockout (UK 8 & 9 Unavailable)',
      evidenceCitations: ['[1] fact_inventory UK8/9: 0-stock 6d', '[2] Dose-Response: r=0.783 (p=0.02)', '[3] Mystery Audit: Sizing 51.9/100'],
      recommendedAction: `Trigger emergency stock rebalance of 40 units of UK 8/9 from Pune Central DC to ${storeLabel}.`,
      recoverableRevenueLakhs: 13.4,
    };
  }
}
