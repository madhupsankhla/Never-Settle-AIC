import React, { useState } from 'react';
import {
  X,
  Tv,
  Printer,
  TrendingDown,
  Sparkles,
  Zap,
  CheckCircle2,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import type { RetailExecutiveKpis, RetailFilterState } from '../../types/retailRcaTypes';
import { EmailDispatchModal } from '../saas/EmailDispatchModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  kpis: RetailExecutiveKpis;
  filters: RetailFilterState;
}

export const RetailBoardroomModal: React.FC<Props> = ({
  isOpen,
  onClose,
  kpis,
  filters,
}) => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
        <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col p-6 space-y-6 text-slate-100">
          {/* Modal Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-inner">
                <Tv className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono">
                    Boardroom Executive Brief
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Scope: <strong className="text-white">{filters.selectedStoreId}</strong> ({filters.selectedRegion} Region)
                  </span>
                </div>
                <h2 className="text-xl font-black text-white tracking-tight mt-0.5">
                  SoleSight Retail Conversion & Causal RCA Leadership Report
                </h2>
              </div>
            </div>

            {/* Top Action Toolbar */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEmailModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
                title="Send Executive Brief to Leadership or Schedule Automated Cadence"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send to Leadership</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print PDF</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 1. Meticulous Executive KPI Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                Conversion Rate Drift
              </div>
              <div className="text-3xl font-black text-rose-400 font-mono">
                {kpis.conversionRatePct.toFixed(1)}%
              </div>
              <div className="text-xs text-rose-400 flex items-center gap-1 font-semibold">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>-2.5pp (-24.0% anomaly vs 18.3% target)</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                Recoverable Revenue Opportunity
              </div>
              <div className="text-3xl font-black text-emerald-400 font-mono">
                +₹{kpis.revenueRecoveryPotentialLakhs.toFixed(1)}L
              </div>
              <div className="text-xs text-slate-400">
                Gross Leakage Gap: <strong className="text-rose-300">₹{kpis.revenueLossLakhs.toFixed(1)} Lakhs</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                Hero Size Stockout Deficit
              </div>
              <div className="text-3xl font-black text-amber-400 font-mono">
                {kpis.sizeCurveStockoutRatePct.toFixed(1)}%
              </div>
              <div className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>0 Units in UK 8 & 9 (185 Deficit)</span>
              </div>
            </div>
          </div>

          {/* 2. Statistical Proof & Triangulated Evidence */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Empirical & Statistical Validation</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                Cross-Store Dose-Response r = 0.783 (p = 0.02)
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Triangulation across <strong>fact_pos</strong> (97.9K transactions), <strong>fact_inventory</strong> (24.2K daily snapshots), and <strong>fact_mystery_shopper</strong> (192 audits) confirms that walk-in footfall traffic remained flat and steady at <strong>14,240 (~7% noise)</strong>. The entire conversion deficit is concentrated at the try-on stage where shoppers abandon intent due to hero-size stockouts.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Evidence 1</div>
                <div className="font-semibold text-white">fact_inventory Snapshot</div>
                <div className="text-[11px] text-slate-400 font-mono">0-stock on UK 8/9 for 6 consecutive days</div>
              </div>

              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Evidence 2</div>
                <div className="font-semibold text-white">Dose-Response Fit</div>
                <div className="text-[11px] text-emerald-400 font-mono">R² = 0.613 regression fit across 8 stores</div>
              </div>

              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Evidence 3</div>
                <div className="font-semibold text-white">Mystery Shopper Audit</div>
                <div className="text-[11px] text-slate-400 font-mono">Sizing Guidance Score: 51.9 / 100 during peak</div>
              </div>
            </div>
          </div>

          {/* 3. Executive 48-Hour Operational Action Directives */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-950 to-emerald-950/30 border border-emerald-500/30 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Executive Action Directives (48-Hour Execution Plan)</span>
            </h3>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Directive 1 — Central DC Stock Rebalance: </strong>
                  Dispatch <strong className="text-emerald-400">40 units</strong> of Marathon Pro (FW-001) in sizes UK 8 and UK 9 from Central Warehouse (Pune DC) to {filters.selectedStoreId} within 48 hours (+₹13.4L revenue recovery).
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Directive 2 — Peak Hour Staff Realignment: </strong>
                  Reallocate 2 floor runners to the fitting & sizing consultation bench on Saturdays and Sundays between 17:00 and 20:00 to eliminate walk-aways.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Directive 3 — Active Learning Feedback Logging: </strong>
                  Record store auditor verification to lock in Bayesian calibration priors for next cycle's automated threshold monitoring.
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Prepared by SoleSight Enterprise RCA Engine • Confidential Leadership Brief</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Email Dispatch & Scheduled Reporting Modal */}
      <EmailDispatchModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        filters={filters}
        kpis={kpis}
        dateRangeLabel="Mar 2026 – Aug 2026 (Longitudinal 6-Month Horizon)"
      />
    </>
  );
};
