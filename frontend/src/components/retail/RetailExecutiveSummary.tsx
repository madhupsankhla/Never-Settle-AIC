import React from 'react';
import {
  TrendingDown,
  TrendingUp,
  Percent,
  IndianRupee,
  Users,
  AlertTriangle,
  Award,
  Tv,
  FileSpreadsheet,
  Zap,
  Send,
} from 'lucide-react';
import type { RetailExecutiveKpis } from '../../types/retailRcaTypes';

interface Props {
  kpis: RetailExecutiveKpis;
  storeLabel: string;
  onOpenBoardroom: () => void;
  onOpenTableExport: () => void;
  onOpenEmailDispatch?: () => void;
}

export const RetailExecutiveSummary: React.FC<Props> = ({
  kpis,
  storeLabel,
  onOpenBoardroom,
  onOpenTableExport,
  onOpenEmailDispatch,
}) => {
  return (
    <div className="space-y-4">
      {/* Boardroom Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Executive Leadership Summary
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Target: <strong className="text-slate-200">{storeLabel}</strong> • Cycle: 2026-W33
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Retail Conversion & Root Cause Attribution Brief
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Triangulated statistical analysis of conversion rate drift, size-curve fill rate stockouts, footfall volume integrity, and estimated net recoverable revenue.
          </p>
        </div>

        {/* Boardroom Action Buttons */}
        <div className="flex items-center gap-2.5">
          {onOpenEmailDispatch && (
            <button
              onClick={onOpenEmailDispatch}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
              title="Send to Leadership or Setup Scheduled Cadence"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send to Leadership</span>
            </button>
          )}
          <button
            onClick={onOpenBoardroom}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Tv className="w-3.5 h-3.5" />
            Present to Boardroom
          </button>
          <button
            onClick={onOpenTableExport}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
            Export Brief
          </button>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Conversion Rate */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Conversion Rate
            </span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono tracking-tight">
              {kpis.conversionRatePct.toFixed(1)}%{' '}
              <span className="text-xs font-normal text-slate-400">POS Converted</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs font-medium">
              {kpis.conversionRateDeltaPct < 0 ? (
                <span className="text-rose-400 flex items-center gap-0.5">
                  <TrendingDown className="w-3.5 h-3.5" />
                  {Math.abs(kpis.conversionRateDeltaPct)}% Drift vs 18.3% Baseline
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +{kpis.conversionRateDeltaPct}% vs Baseline
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Recoverable Revenue */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Recoverable Revenue
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
              ₹{kpis.revenueRecoveryPotentialLakhs.toFixed(1)}L{' '}
              <span className="text-xs font-normal text-slate-400">Opportunity</span>
            </div>
            <div className="flex items-center justify-between mt-1.5 text-xs text-slate-400">
              <span>Gross Leakage:</span>
              <strong className="text-rose-300 font-semibold">₹{kpis.revenueLossLakhs.toFixed(1)} Lakhs</strong>
            </div>
          </div>
        </div>

        {/* Card 3: Size-Curve Stockout Rate */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Size Stockout Rate (Hero SKUs)
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-400 font-mono tracking-tight">
              {kpis.sizeCurveStockoutRatePct.toFixed(1)}%{' '}
              <span className="text-xs font-normal text-slate-400">Sizes UK 8/9</span>
            </div>
            <div className="flex items-center justify-between mt-1.5 text-xs text-slate-400">
              <span>Root Cause:</span>
              <span className="text-amber-300 font-bold flex items-center gap-1">
                <Zap className="w-3 h-3" /> Tier-1 Causal Driver
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Footfall & Mystery Shopper */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Footfall Traffic Integrity
            </span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-cyan-300 font-mono">
                {kpis.footfallTraffic.toLocaleString()}
              </span>
              <span className="text-xs text-emerald-400 font-semibold">
                +{kpis.footfallDeltaPct}% Traffic Steady
              </span>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-slate-400 pt-1 border-t border-slate-800">
              <span className="flex items-center gap-1">
                <Award className="w-3 h-3 text-indigo-400" /> Audit Score:
              </span>
              <strong className="text-indigo-300 font-mono font-bold">
                {kpis.mysteryShopperScore}/100
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
