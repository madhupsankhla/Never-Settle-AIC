import React, { useState } from 'react';
import {
  X,
  Sliders,
  ShieldCheck,
  Zap,
  Clock,
  Database,
  CheckCircle2,
  RotateCcw,
  Save,
  Cpu,
} from 'lucide-react';

interface CausalThresholdsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface CausalBayesianThresholds {
  conversionAnomalyThresholdPct: number;
  causalConfidencePValue: '0.01' | '0.05' | '0.10';
  minStockoutDays: number;
  fittingQueueToleranceMins: number;
  benchmarkTargetConversionPct: number;
}

const DEFAULT_THRESHOLDS: CausalBayesianThresholds = {
  conversionAnomalyThresholdPct: 15,
  causalConfidencePValue: '0.05',
  minStockoutDays: 3,
  fittingQueueToleranceMins: 7,
  benchmarkTargetConversionPct: 18.3,
};

export const CausalThresholdsModal: React.FC<CausalThresholdsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [thresholds, setThresholds] = useState<CausalBayesianThresholds>(() => {
    try {
      const saved = localStorage.getItem('solesight_causal_thresholds');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_THRESHOLDS;
  });

  const [isSavedToast, setIsSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    try {
      localStorage.setItem('solesight_causal_thresholds', JSON.stringify(thresholds));
    } catch (e) {
      console.error(e);
    }
    setIsSavedToast(true);
    setTimeout(() => {
      setIsSavedToast(false);
      onClose();
    }, 1000);
  };

  const handleReset = () => {
    setThresholds(DEFAULT_THRESHOLDS);
    try {
      localStorage.setItem('solesight_causal_thresholds', JSON.stringify(DEFAULT_THRESHOLDS));
    } catch (e) {
      console.error(e);
    }
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs">
              <Sliders className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Causal & Bayesian Thresholds</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Analytical Bounds
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Configure Bayesian causal parameters and anomaly detection sensitivity
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Threshold Form Body */}
        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          {/* Card 1: Conversion Drift Sensitivity Slider */}
          <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Conversion Anomaly Threshold</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                {thresholds.conversionAnomalyThresholdPct}% Drift
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Triggers root-cause attribution when store conversion drops below target by more than this percentage.
            </p>

            <div className="space-y-1.5 pt-1">
              <input
                type="range"
                min="5"
                max="35"
                step="1"
                value={thresholds.conversionAnomalyThresholdPct}
                onChange={(e) =>
                  setThresholds({
                    ...thresholds,
                    conversionAnomalyThresholdPct: Number(e.target.value),
                  })
                }
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>5% (High Sensitivity)</span>
                <span>15% (Default)</span>
                <span>35% (Broad Variance)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Causal Significance Filter (p-value) */}
          <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Causal Significance Filter (p-value)</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono">
                p &lt; {thresholds.causalConfidencePValue}
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Minimum empirical statistical confidence required before confirming a primary causal hypothesis.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {(['0.01', '0.05', '0.10'] as const).map((pval) => (
                <button
                  key={pval}
                  type="button"
                  onClick={() => setThresholds({ ...thresholds, causalConfidencePValue: pval })}
                  className={`p-2 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                    thresholds.causalConfidencePValue === pval
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div>p &lt; {pval}</div>
                  <div className="text-[10px] font-normal opacity-80">
                    {pval === '0.01' ? 'Strict' : pval === '0.05' ? 'Standard' : 'Exploratory'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Card 3: Minimum Stockout Duration & Queue Tolerance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/90 space-y-2.5">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span>Min Stockout Duration</span>
              </span>
              <p className="text-[11px] text-slate-500 leading-tight">
                Consecutive zero-stock days required before flagging shortages.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={thresholds.minStockoutDays}
                  onChange={(e) =>
                    setThresholds({
                      ...thresholds,
                      minStockoutDays: Math.max(1, Number(e.target.value)),
                    })
                  }
                  className="w-20 p-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 bg-white text-center font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-500">Days snapshot</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/90 space-y-2.5">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-teal-600" />
                <span>Queue Tolerance</span>
              </span>
              <p className="text-[11px] text-slate-500 leading-tight">
                Fitting room wait-time friction alert threshold.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="number"
                  min="3"
                  max="20"
                  value={thresholds.fittingQueueToleranceMins}
                  onChange={(e) =>
                    setThresholds({
                      ...thresholds,
                      fittingQueueToleranceMins: Math.max(1, Number(e.target.value)),
                    })
                  }
                  className="w-20 p-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 bg-white text-center font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-500">Minutes max</span>
              </div>
            </div>
          </div>

          {/* Card 4: Benchmark Conversion Target */}
          <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/90 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>Enterprise Baseline Target Conversion</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                {thresholds.benchmarkTargetConversionPct.toFixed(1)}% Target
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <input
                type="number"
                step="0.1"
                min="10"
                max="30"
                value={thresholds.benchmarkTargetConversionPct}
                onChange={(e) =>
                  setThresholds({
                    ...thresholds,
                    benchmarkTargetConversionPct: Number(e.target.value),
                  })
                }
                className="w-24 p-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 bg-white text-center font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-500 font-medium">% POS conversion benchmark for revenue leakage</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            {isSavedToast && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Applied!</span>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Apply Thresholds</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
