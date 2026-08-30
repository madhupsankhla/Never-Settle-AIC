import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { NarrativeResponse, PersonaType } from '../../types';
import { NodeAnalyticsEngine } from '../../data/nodeAnalyticsEngine';
import { useLocalization } from '../../context/LocalizationContext';

interface OverviewNarrativeHeroProps {
  narrative?: NarrativeResponse | null;
  selectedStoreId?: string;
  selectedRegion?: string;
  searchQuery?: string;
  selectedScenario?: string;
  currentPersona?: PersonaType;
  onInspectEvidence?: () => void;
}

export const OverviewNarrativeHero: React.FC<OverviewNarrativeHeroProps> = ({
  selectedStoreId = 'STORE-001',
  selectedRegion = 'West',
  searchQuery = '',
  selectedScenario = 'hero',
  currentPersona = 'store_manager',
  onInspectEvidence,
}) => {
  const { t, formatCurrency } = useLocalization();
  const [isEvidenceExpanded, setIsEvidenceExpanded] = useState(false);

  // Dynamically compute narrative based on active node scope, scenario & persona
  const narrativeInfo = useMemo(() => {
    return NodeAnalyticsEngine.getNarrative(
      selectedStoreId,
      selectedRegion,
      searchQuery,
      selectedScenario,
      currentPersona
    );
  }, [selectedStoreId, selectedRegion, searchQuery, selectedScenario, currentPersona]);

  // Plain-language evidence translations tailored per persona and scenario
  const plainEvidenceList = useMemo(() => {
    if (selectedScenario === 'abstention') {
      return [
        { text: 'Rainfall and local weather explain ~32% of traffic variance', stat: 'Weather residual: 32%' },
        { text: 'Competitor promotions caused minor price-matching inquiries', stat: 'Competitor discount: 28%' },
        { text: 'Fitting room wait delays created localized friction during peak hours', stat: 'Queue delay: 40%' },
      ];
    }

    if (selectedScenario === 'normal') {
      return [
        { text: 'Full size availability maintained across all active footwear styles', stat: 'Size fill rate: 98.2%' },
        { text: 'Store conversion matches or exceeds regional targets', stat: 'Conversion: 18.9%' },
        { text: 'Healthy customer footfall and steady checkout velocities', stat: 'POS throughput: Normal' },
      ];
    }

    if (selectedScenario === 'sparse') {
      return [
        { text: 'Newly launched SKU has only 2 weekly sales observations', stat: 'Observations: 2 (< 3 threshold)' },
        { text: 'Wide tolerance bands applied to avoid false alarm alerts', stat: 'is_sparse_history: true' },
        { text: 'Baseline sales velocity calibration underway', stat: 'Calibration: Active' },
      ];
    }

    if (currentPersona === 'cfo_finance') {
      return [
        { text: 'Direct top-line revenue leakage of ₹13.4 Lakhs in STORE-001 (₹54.2L network-wide)', stat: 'Revenue at Risk: ₹13.4L' },
        { text: 'Cross-store multi-location econometric regression confirms conversion drag', stat: 'Econometric Fit: R²=0.78' },
        { text: 'Gross margin rate compressed by 2.1 percentage points due to missed full-price volume', stat: 'Margin Erosion: -2.1pp' },
      ];
    }

    if (currentPersona === 'regional_ops') {
      return [
        { text: 'Sizes 8 & 9 depleted for 6 consecutive days due to Central DC fulfillment lead-time lag', stat: 'DC Replenishment Lag: 6d' },
        { text: 'Mystery audit sizing guidance scored 51.9/100 during weekend rush shifts due to runner lag', stat: 'Floor Sizing Audit: 51.9/100' },
        { text: 'Network-wide statistical correlation confirmed across 8 regional stores', stat: 'Dose-Response: r=0.783 (p=0.02)' },
      ];
    }

    if (currentPersona === 'marketing_growth') {
      return [
        { text: 'Nitro Running Campaign generated +3.9% lift in store walk-ins (14,240 footfall)', stat: 'Nitro Campaign Lift: +3.9%' },
        { text: 'Customer try-on to purchase drop-off spiked to 41.6% due to missing advertised sizes', stat: 'Try-On Drop-off: 41.6%' },
        { text: 'Campaign ROAS efficiency dampened by on-shelf rack availability bottlenecks', stat: 'Campaign ROAS Drag: -1.8x' },
      ];
    }

    return [
      { text: 'Sizes 8 & 9 were completely out of stock for 6 consecutive days on rack', stat: 'fact_inventory: 0-stock 6d' },
      { text: 'This shortage pattern held consistently across our retail footwear network', stat: 'Dose-Response: r=0.783 (p=0.02)' },
      { text: 'Shoppers who bought non-preferred sizes returned them 3–4 weeks later', stat: 'Lagged Returns: +4.2%' },
    ];
  }, [selectedScenario, currentPersona]);

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 text-slate-900 shadow-xs space-y-4">
      {/* Header Banner: Title + ONE confidence badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-2xs ${
            selectedScenario === 'normal'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : selectedScenario === 'abstention'
              ? 'bg-amber-50 border border-amber-200 text-amber-700'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
          }`}>
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight text-slate-900">
                {t(narrativeInfo.title, narrativeInfo.title)}
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border font-mono ${
                narrativeInfo.confidenceTier === 'HIGH'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : narrativeInfo.confidenceTier === 'LOW'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {Math.round(narrativeInfo.confidenceScore * 100)}% Confidence
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Narrative Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Plain-Language Finding Statement + Collapsible Evidence */}
        <div className="lg:col-span-8 space-y-3">
          <div className="text-xs md:text-sm text-slate-700 leading-relaxed">
            <span className="font-bold text-slate-900">{t('Finding', 'Finding')}: </span>
            {narrativeInfo.findingText}
          </div>

          {/* Collapsible Evidence Section (Plain language first, technical stat secondary) */}
          <div className="pt-1">
            <button
              onClick={() => setIsEvidenceExpanded(!isEvidenceExpanded)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
            >
              <span>{t('View Supporting Evidence', 'View Supporting Evidence')} ({plainEvidenceList.length})</span>
              {isEvidenceExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {isEvidenceExpanded && (
              <div className="mt-2.5 space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200 animate-in fade-in duration-150">
                {plainEvidenceList.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 text-xs py-1">
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item.text}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {item.stat}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Prescribed Immediate Action Card */}
        <div className="lg:col-span-4 bg-emerald-50/50 rounded-xl p-3.5 border border-emerald-200/90 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('Recommended Action', 'Recommended Action')}</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500 font-mono">Feasibility: 98%</span>
          </div>

          <p className="text-xs text-slate-800 font-medium leading-tight">
            {narrativeInfo.recommendedAction}
          </p>

          <div className="pt-2 flex items-center justify-between text-[11px] border-t border-emerald-200/60">
            <span className="text-emerald-700 font-bold font-mono">
              +{formatCurrency(narrativeInfo.recoverableRevenueLakhs)} {t('Recoverable', 'Recoverable')}
            </span>
            {onInspectEvidence && (
              <button
                onClick={onInspectEvidence}
                className="text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <span>{t('View Full Analysis', 'View Full Analysis')}</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
