import React, { useState } from 'react';
import {
  X,
  Sliders,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Zap,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import {
  CopilotFeedbackService,
  type ActiveLearningFeedbackRecord,
} from '../../services/copilotService';

interface ModelCalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelCalibrationModal: React.FC<ModelCalibrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [ledger, setLedger] = useState<ActiveLearningFeedbackRecord[]>(
    CopilotFeedbackService.getFeedbackLedger()
  );
  const [weightsData, setWeightsData] = useState(
    CopilotFeedbackService.getCalibratedWeights()
  );
  const [activeTab, setActiveTab] = useState<'weights' | 'ledger' | 'prompt'>('weights');
  const [simulatedFeedbackToast, setSimulatedFeedbackToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulateAnalystFeedback = () => {
    // Concrete example requested in product spec:
    // "An analyst marks MEDIUM-confidence hypothesis as wrong → threshold-review lowers dose-response weight"
    const newRecord = CopilotFeedbackService.submitFeedback({
      driver: 'Peak Hours Fitting Room Wait Friction',
      storeId: 'STORE-001',
      skuId: 'FW-001',
      verdict: 'CORRECTED',
      analystRole: 'Lead Retail Operations Auditor',
      correctionReason:
        'Auditor ground truth: Sizing stockout in UK 8/9 caused 92% of try-on walk-aways; queue time was purely incidental.',
      groundTruthDriver: 'Core Size-Curve Stockout (UK 8 & 9)',
      adjustedWeightDelta: -0.08,
    });

    setLedger(CopilotFeedbackService.getFeedbackLedger());
    setWeightsData(CopilotFeedbackService.getCalibratedWeights());
    setSimulatedFeedbackToast(
      `✓ Live learning step executed (${newRecord.id}): Fitting Room Weight calibrated down by 8%, Size Stockout reinforced.`
    );

    setTimeout(() => setSimulatedFeedbackToast(null), 4000);
  };

  const handleResetLedger = () => {
    localStorage.removeItem('solesight_active_learning_ledger_v1');
    setLedger(CopilotFeedbackService.getFeedbackLedger());
    setWeightsData(CopilotFeedbackService.getCalibratedWeights());
    setSimulatedFeedbackToast('✓ Reset active learning feedback ledger to baseline.');
    setTimeout(() => setSimulatedFeedbackToast(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-3xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-slate-900">
                  Active Learning & Human Feedback Calibration Engine
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Closed Learning Loop
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Continuous Bayesian weight calibration and few-shot prompt injection driven by human analyst corrections
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Feedback Toast */}
        {simulatedFeedbackToast && (
          <div className="p-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center gap-2 shadow-lg animate-in slide-in-from-top duration-150">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{simulatedFeedbackToast}</span>
          </div>
        )}

        {/* Sub-Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-1 gap-1 text-xs font-semibold rounded-xl">
          <button
            onClick={() => setActiveTab('weights')}
            className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${
              activeTab === 'weights'
                ? 'bg-white text-slate-900 shadow-2xs font-bold text-indigo-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Calibrated Driver Weights
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${
              activeTab === 'ledger'
                ? 'bg-white text-slate-900 shadow-2xs font-bold text-indigo-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Structured Feedback Ledger ({ledger.length})
          </button>
          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${
              activeTab === 'prompt'
                ? 'bg-white text-slate-900 shadow-2xs font-bold text-indigo-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Injected Prompt Memory Bank
          </button>
        </div>

        {/* TAB 1: Calibrated Driver Weights */}
        {activeTab === 'weights' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-200/80 text-xs text-indigo-950 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong>How the Feedback Loop Operates: </strong>
                When analysts submit thumbs up/down and ground-truth corrections, the engine adjusts the Bayesian prior weights ($w_i$) for each driver domain. Future causal synthesis and ChatGPT prompt completions automatically reflect these calibrated priors.
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Prior vs. Calibrated Bayesian Weights
              </div>

              {Object.entries(weightsData.calibratedWeights).map(([driver, calWeight]) => {
                const baseWeight = weightsData.baseWeights[driver] || 0.10;
                const delta = calWeight - baseWeight;
                const pct = Math.round(calWeight * 100);

                return (
                  <div
                    key={driver}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-slate-900">{driver}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-mono">
                          Base: {Math.round(baseWeight * 100)}%
                        </span>
                        <span className="text-slate-300">→</span>
                        <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          Calibrated: {pct}%
                        </span>
                        {delta !== 0 && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono flex items-center gap-0.5 ${
                              delta > 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {delta > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {delta > 0 ? `+${Math.round(delta * 100)}%` : `${Math.round(delta * 100)}%`}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Weight Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Structured Feedback Ledger */}
        {activeTab === 'ledger' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Ground-Truth Analyst Corrections Ledger</span>
              <span className="text-[11px] font-mono text-slate-400">
                {ledger.length} Structured Records
              </span>
            </div>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {ledger.map((rec) => {
                const isCorrected = rec.verdict === 'CORRECTED';
                const isDisproven = rec.verdict === 'DISPROVEN';

                return (
                  <div
                    key={rec.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-xs bg-white px-2 py-0.5 rounded border border-slate-200">
                          {rec.id}
                        </span>
                        <span className="font-semibold text-slate-800">{rec.driver}</span>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          isCorrected
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : isDisproven
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {rec.verdict}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200/80 leading-relaxed">
                      <strong className="text-slate-900">Analyst Note: </strong>
                      {rec.correctionReason}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                      <span>
                        Auditor: <strong className="text-slate-600">{rec.analystRole}</strong> • Scope: {rec.storeId} ({rec.skuId})
                      </span>
                      <span className="text-indigo-700 font-bold">
                        Weight Delta: {rec.adjustedWeightDelta > 0 ? `+${rec.adjustedWeightDelta * 100}%` : `${rec.adjustedWeightDelta * 100}%`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: Injected Prompt Memory Bank */}
        {activeTab === 'prompt' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Dynamic Few-Shot Context Injected into ChatGPT (gpt-4o-mini)
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] leading-relaxed space-y-2 overflow-x-auto">
              <div className="text-emerald-400 font-bold">// DYNAMIC ACTIVE LEARNING INJECTION (System Prompt)</div>
              <div>[SYSTEM MEMORY: ACTIVE LEARNING RULES FROM ANALYST CORRECTIONS]</div>
              {ledger.map((rec) => (
                <div key={rec.id} className="pl-3 border-l-2 border-emerald-500/60 py-0.5 text-slate-300">
                  - Rule {rec.id} ({rec.analystRole}): {rec.calibrationRule} [Ground Truth: {rec.groundTruthDriver}]
                </div>
              ))}
              <div className="pt-2 text-slate-500">
                // Every time a user chats with the AI, these rules prevent recurring misattributions.
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions & Live Walkthrough Simulation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateAnalystFeedback}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
              title="Simulate: Analyst corrects a hypothesis to demonstrate live recalibration"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simulate Analyst Learning Step</span>
            </button>

            <button
              onClick={handleResetLedger}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              title="Reset Ledger to Default"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
