import React from 'react';
import {
  TrendingDown,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import type { RetailFilterState } from '../../types/retailRcaTypes';

import { useLocalization } from '../../context/LocalizationContext';

interface TopMetricCardsProps {
  filters: RetailFilterState;
  onOpenYoY?: () => void;
  selectedScenario?: string;
}

export const TopMetricCards: React.FC<TopMetricCardsProps> = ({
  filters,
  onOpenYoY: _onOpenYoY,
  selectedScenario = 'hero',
}) => {
  const { t, formatCurrency } = useLocalization();
  const isHealthyStore = ['STORE-002', 'STORE-004', 'STORE-003', 'STORE-007'].includes(filters.selectedStoreId);
  const isEnterprise = filters.selectedStoreId === 'All' && filters.selectedRegion === 'All';

  // Dynamic values based on active scenario and scope
  let conversionRate = 15.8;
  let conversionDelta = '-2.5pp (-24.0%)';
  let isPositive = false;
  let footfall = '14,240';
  let footfallStatus = 'Flat & Stable (±7% noise)';
  let rawRiskLakhs = 13.4;
  let rawTypicalLakhs = 56.0;
  let returnRate = '4.2%';
  let returnRateNote = '↑ +1.8pp rising, confirms stockout (3-week lag)';

  if (selectedScenario === 'normal') {
    conversionRate = isEnterprise ? 18.5 : 18.9;
    conversionDelta = '+0.6pp (+3.3%)';
    isPositive = true;
    footfall = isEnterprise ? '172,000' : '14,800';
    footfallStatus = 'Strong & Steady (+3.9% YoY)';
    rawRiskLakhs = 0.0;
    rawTypicalLakhs = isEnterprise ? 510.0 : 64.0;
    returnRate = '1.6%';
    returnRateNote = 'Optimal baseline (target met)';
  } else if (selectedScenario === 'abstention') {
    conversionRate = isEnterprise ? 16.8 : 17.1;
    conversionDelta = '-1.2pp (-6.5%) [Low Conf]';
    isPositive = false;
    footfall = isEnterprise ? '162,000' : '13,800';
    footfallStatus = 'Minor Rainy Weekend Dip (-3.1%)';
    rawRiskLakhs = 8.6;
    rawTypicalLakhs = isEnterprise ? 460.0 : 52.0;
    returnRate = '2.4%';
    returnRateNote = 'Normal baseline, multi-factor drift';
  } else {
    // hero stockout scenario
    if (isHealthyStore) {
      conversionRate = 18.8;
      conversionDelta = '+0.5pp (+2.7%)';
      isPositive = true;
      footfall = '19,500';
      rawRiskLakhs = 3.5;
      rawTypicalLakhs = 82.0;
      returnRate = '1.8%';
      returnRateNote = 'Normal baseline level';
    } else if (isEnterprise) {
      conversionRate = 17.2;
      conversionDelta = '-1.1pp (-6.0%)';
      isPositive = false;
      footfall = '168,000';
      rawRiskLakhs = 54.2;
      rawTypicalLakhs = 480.0;
      returnRate = '3.4%';
    }
  }

  const revenueAtRisk = formatCurrency(rawRiskLakhs);
  const typicalRevenue = formatCurrency(rawTypicalLakhs);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* CARD 1: Conversion Rate (SIGNAL) */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 relative overflow-hidden group hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {t('conversion_rate', 'Conversion Rate')}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200 font-mono">
            SIGNAL
          </span>
        </div>

        <div className="space-y-0.5">
          <div className="text-2xl font-black font-mono text-slate-900 tracking-tight">
            {conversionRate.toFixed(1)}%
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold">
            {isPositive ? (
              <span className="text-emerald-700 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                {conversionDelta} vs 18.3% target
              </span>
            ) : (
              <span className={`${selectedScenario === 'abstention' ? 'text-amber-600' : 'text-rose-600'} flex items-center gap-0.5`}>
                <TrendingDown className="w-3.5 h-3.5" />
                {conversionDelta} vs 18.3% target
              </span>
            )}
          </div>
        </div>

        <div className="text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-100 flex items-center justify-between">
          <span>POS Checkout Converted</span>
          <span className="font-mono text-slate-600">Target: 18.3%</span>
        </div>
      </div>

      {/* CARD 2: Footfall Traffic (CONTROL) */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 relative overflow-hidden group hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {t('footfall', 'Footfall Traffic')}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
            CONTROL
          </span>
        </div>

        <div className="space-y-0.5">
          <div className="text-2xl font-black font-mono text-slate-900 tracking-tight">
            {footfall}
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{footfallStatus}</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-100 flex items-center justify-between">
          <span>Walk-in Door Entries</span>
          <span className="font-mono text-slate-600">+0.8% YoY</span>
        </div>
      </div>

      {/* CARD 3: Revenue at Risk (NEW 3.1 - IMPACT/SIGNAL) */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 relative overflow-hidden group hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {t('revenue_at_risk', 'Revenue at Risk')}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200 font-mono">
            IMPACT
          </span>
        </div>

        <div className="space-y-0.5">
          <div className="text-2xl font-black font-mono text-amber-600 tracking-tight">
            {revenueAtRisk}
          </div>
          <div className="text-xs font-semibold text-slate-600">
            vs. <strong className="text-slate-800 font-mono">{typicalRevenue}</strong> typical weekly revenue
          </div>
        </div>

        <div className="text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-100 flex items-center justify-between">
          <span>Recoverable Opportunity</span>
          <span className="font-mono text-emerald-700 font-bold">100% via Rebalance</span>
        </div>
      </div>

      {/* CARD 4: Size-Related Return Rate (NEW 3.2 - CORROBORATION) */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 relative overflow-hidden group hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {t('return_rate', 'Size-Related Return Rate')}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-indigo-50 text-indigo-800 border border-indigo-200 font-mono">
            CORROBORATION
          </span>
        </div>

        <div className="space-y-0.5">
          <div className="text-2xl font-black font-mono text-indigo-700 tracking-tight">
            {returnRate}
          </div>
          <div className="text-[11px] font-semibold text-slate-600 leading-tight">
            {returnRateNote}
          </div>
        </div>

        <div className="text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-100 flex items-center justify-between">
          <span>Substitute Size Purchasing</span>
          <span className="font-mono text-indigo-600 font-bold">Lagged Signal</span>
        </div>
      </div>
    </div>
  );
};
