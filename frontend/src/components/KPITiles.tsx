import React from 'react';
import { ArrowDownRight, ArrowUpRight, Minus, AlertCircle } from 'lucide-react';
import type { EvidenceObject } from '../types';

interface KPITilesProps {
  evidence: EvidenceObject | null;
  selectedKpi: string;
  onSelectKpi: (kpiId: string) => void;
}

export const KPITiles: React.FC<KPITilesProps> = ({
  evidence,
  selectedKpi,
  onSelectKpi,
}) => {
  const isHero = evidence?.segment.store_id === 'STORE-014';
  const isAbstain = evidence?.abstain;

  const kpis = [
    {
      id: 'footfall',
      name: 'Footfall Traffic',
      value: isHero ? '558' : '412',
      unit: 'visitors/day',
      changePct: evidence?.footfall_status.change_pct ?? 1.2,
      zScore: 0.35,
      isMaterial: false,
      status: 'Stable Traffic',
    },
    {
      id: 'conversion_rate',
      name: 'Conversion Rate',
      value: isHero ? '15.9%' : (isAbstain ? '17.1%' : '18.5%'),
      unit: 'vs 18.5% base',
      changePct: evidence?.change_pct ?? -14.2,
      zScore: -2.48,
      isMaterial: evidence?.is_material ?? true,
      status: (evidence?.change_pct ?? -14.2) < -5 ? 'Material Anomaly' : 'Optimal',
    },
    {
      id: 'full_price_sell_through',
      name: 'Full-Price Sell-Through',
      value: isHero ? '84.2%' : '88.5%',
      unit: '≥95% list price',
      changePct: -3.8,
      zScore: -0.85,
      isMaterial: false,
      status: 'Normal Variance',
    },
    {
      id: 'size_curve_fill_rate',
      name: 'Size-Curve Fill Rate',
      value: isHero ? '68.0%' : '94.5%',
      unit: 'sizes in stock',
      changePct: isHero ? -28.0 : 0.5,
      zScore: isHero ? -3.12 : 0.1,
      isMaterial: isHero,
      status: isHero ? 'Critical Stockout' : 'Fully Stocked',
    },
    {
      id: 'size_related_return_rate',
      name: 'Fit Return Rate',
      value: isHero ? '7.4%' : '5.1%',
      unit: 'lagged sales %',
      changePct: isHero ? 45.1 : -1.2,
      zScore: isHero ? 2.15 : -0.2,
      isMaterial: isHero,
      status: isHero ? 'Corroborating Surge' : 'Baseline',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {kpis.map((kpi) => {
        const isSelected = selectedKpi === kpi.id;
        const isNegative = kpi.changePct < 0;
        const isPositive = kpi.changePct > 0;

        return (
          <div
            key={kpi.id}
            onClick={() => onSelectKpi(kpi.id)}
            className={`p-4 rounded-xl border transition-all cursor-pointer bg-white relative overflow-hidden ${
              isSelected
                ? 'border-indigo-600 ring-2 ring-indigo-600/10 shadow-sm'
                : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
            }`}
          >
            {/* Top row: Label and Materiality badge */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-semibold text-slate-600 truncate">
                {kpi.name}
              </span>
              {kpi.isMaterial ? (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 flex items-center gap-0.5">
                  <AlertCircle className="w-2.5 h-2.5" />
                  |z| &gt; 2.0
                </span>
              ) : (
                <span className="text-[10px] font-mono text-slate-400">
                  z={kpi.zScore > 0 ? `+${kpi.zScore}` : kpi.zScore}
                </span>
              )}
            </div>

            {/* Middle row: Big metric value and Delta pill */}
            <div className="flex items-baseline justify-between mt-1">
              <div className="text-2xl font-bold tracking-tight text-slate-900">
                {kpi.value}
              </div>
              <div
                className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-md ${
                  kpi.isMaterial
                    ? isNegative
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-emerald-50 text-emerald-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isNegative ? (
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                ) : isPositive ? (
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                ) : (
                  <Minus className="w-3.5 h-3.5 mr-0.5" />
                )}
                {kpi.changePct > 0 ? `+${kpi.changePct.toFixed(1)}%` : `${kpi.changePct.toFixed(1)}%`}
              </div>
            </div>

            {/* Bottom row: Subtitle & Status */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">{kpi.unit}</span>
              <span
                className={`font-medium ${
                  kpi.isMaterial ? 'text-rose-600 font-semibold' : 'text-slate-600'
                }`}
              >
                {kpi.status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
