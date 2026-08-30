import React from 'react';
import { X, Activity, Clock, Cpu, DollarSign, Zap } from 'lucide-react';
import type { TelemetrySummary } from '../types';

interface TelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
  telemetry: TelemetrySummary | null;
}

export const TelemetryModal: React.FC<TelemetryModalProps> = ({
  isOpen,
  onClose,
  telemetry,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              System Telemetry & Performance
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[10px] text-slate-500 font-semibold uppercase flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              Avg Latency
            </div>
            <div className="text-lg font-bold text-slate-900">
              {telemetry ? `${telemetry.avg_latency_ms.toFixed(0)} ms` : '--'}
            </div>
            <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
              SLA: &lt;5000ms
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[10px] text-slate-500 font-semibold uppercase flex items-center gap-1 mb-1">
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              Queries
            </div>
            <div className="text-lg font-bold text-slate-900">
              {telemetry ? telemetry.session_queries : 0}
            </div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">
              Session runs
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[10px] text-slate-500 font-semibold uppercase flex items-center gap-1 mb-1">
              <Cpu className="w-3.5 h-3.5 text-purple-600" />
              Total Tokens
            </div>
            <div className="text-lg font-bold text-slate-900">
              {telemetry ? telemetry.total_tokens.toLocaleString() : 0}
            </div>
            <div className="text-[10px] text-purple-700 font-medium mt-0.5">
              Two-tier routed
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[10px] text-slate-500 font-semibold uppercase flex items-center gap-1 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-amber-600" />
              Session Cost
            </div>
            <div className="text-lg font-bold text-slate-900">
              {telemetry ? `$${telemetry.total_cost_usd.toFixed(4)}` : '$0.0000'}
            </div>
            <div className="text-[10px] text-amber-700 font-medium mt-0.5">
              USD Est.
            </div>
          </div>
        </div>

        {/* Query Log */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Query Trace History
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {telemetry?.recent_queries && telemetry.recent_queries.length > 0 ? (
              telemetry.recent_queries.slice().reverse().map((q, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-600 font-semibold">{q.endpoint}</span>
                    <span className="text-slate-500">{q.model}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700">
                    <span>{q.latency_ms}ms</span>
                    <span className="text-emerald-600">${q.cost_usd.toFixed(5)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-xs text-slate-400 rounded-lg bg-slate-50">
                No recent traces logged yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
