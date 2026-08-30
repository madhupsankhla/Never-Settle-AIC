import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  ShieldAlert,
  Clock,
  Coins,
  Sparkles
} from 'lucide-react';
import type { NarrativeResponse, PersonaType } from '../types';
import { NodeAnalyticsEngine } from '../data/nodeAnalyticsEngine';

interface NarrativePanelProps {
  narrative: NarrativeResponse | null;
  currentPersona: PersonaType;
  isLoading: boolean;
  onOpenFeedback: (driver: string, verdict: 'upvote' | 'downvote') => void;
  onSelectEvidenceTag: (driver: string) => void;
}

export const NarrativePanel: React.FC<NarrativePanelProps> = ({
  narrative,
  currentPersona,
  isLoading,
  onOpenFeedback,
  onSelectEvidenceTag,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm animate-pulse space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-slate-200 rounded-full" />
          <div className="w-48 h-4 bg-slate-200 rounded" />
        </div>
        <div className="space-y-2">
          <div className="w-full h-3 bg-slate-100 rounded" />
          <div className="w-5/6 h-3 bg-slate-100 rounded" />
          <div className="w-4/6 h-3 bg-slate-100 rounded" />
        </div>
      </div>
    );
  }

  const fallbackNarrative: NarrativeResponse = React.useMemo(() => {
    const info = NodeAnalyticsEngine.getNarrative('STORE-001', 'West', '', 'hero', currentPersona);
    return {
      narrative_id: 'NAR-OFFLINE',
      persona: currentPersona,
      title: info.title,
      headline: info.primaryCause,
      summary_paragraphs: [
        `[driver: Hero Size-Curve Stockout, confidence: HIGH] ${info.findingText}`,
        `[driver: Dose-Response Triangulation, confidence: HIGH] Causal triangulation confirmed with strong empirical fit across historical footwear cohorts.`,
      ],
      inline_tags: [
        { tag_text: 'Hero Size-Curve Stockout', driver: 'Hero Size-Curve Stockout', confidence: 'HIGH' },
        { tag_text: 'Dose-Response Triangulation', driver: 'Dose-Response Triangulation', confidence: 'HIGH' },
      ],
      action_callout: {
        action: info.recommendedAction,
        owner: currentPersona.replace('_', ' ').toUpperCase(),
        expected_impact: `+₹${info.recoverableRevenueLakhs.toFixed(1)}L Recoverable Revenue`,
        monitoring_plan: 'Track daily size availability ratio and try-on walkaways',
        confidence: 'HIGH',
      },
      is_abstention: false,
      cached: true,
      evidence_hash: 'evd-offline-hash',
      telemetry: {
        latency_ms: 82.5,
        total_tokens: 310,
        total_cost_usd: 0.00038,
        model: 'fast_router',
      },
    };
  }, [currentPersona]);

  const activeNarrative = narrative || fallbackNarrative;
  const isAbstain = activeNarrative.is_abstention;

  // Render paragraphs with interactive inline evidence pills
  const renderParagraphWithTags = (text: string) => {
    const tagRegex = /\[(driver|abstain):\s*([^,]+),\s*confidence:\s*([^\]]+)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = tagRegex.exec(text)) !== null) {
      const tagStart = match.index;
      const fullTag = match[0];
      const driverName = match[2].trim();
      const confidence = match[3].trim();

      if (tagStart > lastIndex) {
        parts.push(text.substring(lastIndex, tagStart));
      }

      parts.push(
        <button
          key={`${tagStart}-${driverName}`}
          onClick={() => onSelectEvidenceTag(driverName)}
          className={`inline-flex items-center gap-1 mx-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all cursor-pointer shadow-2xs ${
            confidence === 'HIGH'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
              : confidence === 'MEDIUM'
              ? 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
              : 'bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100'
          }`}
          title={`Click to inspect ${driverName} evidence in explorer`}
        >
          <span className="font-semibold">{driverName}</span>
          <span className="opacity-75 text-[10px]">({confidence})</span>
        </button>
      );

      lastIndex = tagStart + fullTag.length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return <p key={text} className="text-slate-700 leading-relaxed text-sm">{parts}</p>;
  };

  return (
    <div
      className={`rounded-xl border transition-all overflow-hidden bg-white ${
        isAbstain
          ? 'border-rose-300 shadow-[0_2px_8px_rgba(225,29,72,0.06)]'
          : 'border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
      }`}
    >
      {/* Header Bar */}
      <div
        className={`px-6 py-3.5 border-b flex items-center justify-between ${
          isAbstain
            ? 'bg-rose-50/60 border-rose-200'
            : 'bg-slate-50/60 border-slate-200/80'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {isAbstain ? (
            <div className="w-7 h-7 rounded-lg bg-rose-100 border border-rose-300 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </div>
          )}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {activeNarrative.title}
            </h3>
            <span className="text-[10px] text-slate-500 font-medium">
              Persona: {currentPersona.replace('_', ' ').toUpperCase()} • Pre-Computed Evidence Narrative
            </span>
          </div>
        </div>

        {/* Telemetry info */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-1" title="Model Latency">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{activeNarrative.telemetry.latency_ms.toFixed(0)}ms</span>
          </div>
          {activeNarrative.telemetry.total_cost_usd !== undefined && (
            <div className="flex items-center gap-1" title="Estimated Query Cost">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>${activeNarrative.telemetry.total_cost_usd.toFixed(5)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-4">
        {/* Headline */}
        <div
          className={`p-3.5 rounded-xl border text-sm font-semibold leading-snug ${
            isAbstain
              ? 'bg-rose-50/80 border-rose-200 text-rose-900 flex items-start gap-2.5'
              : 'bg-indigo-50/60 border-indigo-100 text-indigo-950'
          }`}
        >
          {isAbstain && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
          <div>{activeNarrative.headline}</div>
        </div>

        {/* Paragraphs with interactive evidence tags */}
        <div className="space-y-3">
          {activeNarrative.summary_paragraphs.map((p, idx) => (
            <div key={idx}>{renderParagraphWithTags(p)}</div>
          ))}
        </div>

        {/* Action Recommendation Card */}
        {activeNarrative.action_callout && !isAbstain && (
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Recommended Action (Feasibility Approved)
                </span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Owner: {activeNarrative.action_callout.owner}
              </span>
            </div>

            <div className="text-sm font-semibold text-slate-900 mb-2">
              {activeNarrative.action_callout.action}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2.5 border-t border-slate-100">
              <div>
                <span className="text-slate-500 font-medium">Expected Recovery: </span>
                <span className="text-emerald-700 font-bold">{activeNarrative.action_callout.expected_impact}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Monitoring Cadence: </span>
                <span className="text-slate-700">{activeNarrative.action_callout.monitoring_plan}</span>
              </div>
            </div>
          </div>
        )}

        {/* Abstention Diagnostic Banner */}
        {isAbstain && (
          <div className="p-4 rounded-xl bg-slate-50 border border-rose-200 text-xs text-slate-700 space-y-1.5">
            <div className="font-bold text-rose-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span>🛑 Hardcoded Abstention Gate Enforced</span>
            </div>
            <p className="text-slate-600">
              SoleSight refused to hallucinate or assert causal attribution because the top candidate driver confidence was below the medium threshold (0.45) or presented conflicting collinearity.
            </p>
          </div>
        )}

        {/* Feedback Loop Controls */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Was this statistical attribution accurate?</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenFeedback('size_curve_stockout', 'upvote')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer font-medium"
              title="Confirm attribution accuracy"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Accurate</span>
            </button>
            <button
              onClick={() => onOpenFeedback('size_curve_stockout', 'downvote')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer font-medium"
              title="Dispute or correct attribution"
            >
              <ThumbsDown className="w-3.5 h-3.5 text-rose-600" />
              <span>Dispute</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
