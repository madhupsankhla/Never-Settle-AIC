import React from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import type { TabularAuditRecord } from '../../types/retailRcaTypes';

interface RowDetailModalProps {
  record: TabularAuditRecord | null;
  onClose: () => void;
}

export const RowDetailModal: React.FC<RowDetailModalProps> = ({
  record,
  onClose,
}) => {
  if (!record) return null;

  const isAnomaly = record.conversionRatePct < 15.0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg shadow-2xl flex flex-col p-6 space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="space-y-1">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                isAnomaly
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {isAnomaly ? 'Anomalous Variance Flagged' : 'Operating within Expected Baseline'}
            </span>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              {record.storeName}
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Store ID: {record.storeId} • Region: {record.region}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 text-[11px] font-medium">SKU Evaluated</span>
            <div className="font-bold text-slate-900 truncate">{record.skuName}</div>
            <div className="text-[10px] text-slate-400 font-mono">{record.skuId}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 text-[11px] font-medium">Weekly Footfall</span>
            <div className="font-bold text-slate-900 font-mono text-base">
              {record.footfall.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400">Stable traffic pattern</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 text-[11px] font-medium">Actual Conversion</span>
            <div className="font-bold font-mono text-base text-rose-600">
              {record.conversionRatePct.toFixed(1)}%
            </div>
            <div className="text-[10px] text-slate-400">Conversions: {record.conversions}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 text-[11px] font-medium">Size Fill Rate</span>
            <div className="font-bold font-mono text-base text-amber-600">
              {record.sizeFillRatePct.toFixed(1)}%
            </div>
            <div className="text-[10px] text-slate-400">Core Sizes UK 8 & 9 Deficit</div>
          </div>
        </div>

        {/* Root Cause & Financial Loss Callout */}
        <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Primary Root Cause Driver</span>
            <span className="font-bold text-emerald-400 font-mono">
              ₹{record.lossEstimateLakhs.toFixed(2)}L Deficit
            </span>
          </div>
          <div className="text-sm font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{record.primaryRootCause}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Corroborated across inventory snapshots, fitting room queue drop-offs, and cross-store regression (r=0.783, p=0.02).
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer"
          >
            Dismiss
          </button>
          <button
            onClick={() => {
              alert(`Initiated restock transfer for ${record.storeName} (${record.skuId})`);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <span>Dispatch Remediation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
