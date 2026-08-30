import React, { useState } from 'react';
import {
  Scale,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Hypothesis {
  rank: number;
  driver: string;
  category: 'Supply Chain' | 'Store Ops' | 'Commercial' | 'Store IT' | 'Marketing' | 'Customer Feedback';
  confidenceScore: number;
  status: 'CONFIRMED PRIMARY' | 'CORROBORATING' | 'DISPROVEN' | 'MINOR DRIVER';
  lossContributionPct: number;
  lossRevenueLakhs: number;
  evidenceCitation: string;
  verdictReason: string;
}

interface HypothesisRankingCardProps {
  selectedScenario?: string;
}

const SCENARIO_HYPOTHESES: Record<string, Hypothesis[]> = {
  hero: [
    {
      rank: 1,
      driver: 'Missing Core Sizes (UK 8 & 9 on Marathon Pro)',
      category: 'Supply Chain',
      confidenceScore: 0.94,
      status: 'CONFIRMED PRIMARY',
      lossContributionPct: 54.0,
      lossRevenueLakhs: 13.4,
      evidenceCitation: 'fact_inventory: 0-stock 6d on FW-001 (UK8/9) • Dose-Response r=0.783, p=0.02',
      verdictReason: 'Main Cause: Shelf was empty in popular sizes, causing ready-to-buy customers to leave empty-handed.',
    },
    {
      rank: 2,
      driver: 'Customer Review Sizing Dissatisfaction (fact_reviews)',
      category: 'Customer Feedback',
      confidenceScore: 0.88,
      status: 'CORROBORATING',
      lossContributionPct: 0.0,
      lossRevenueLakhs: 0.0,
      evidenceCitation: 'fact_reviews: 12 reviews, negative sentiment (83%), 75% fit-related mentions',
      verdictReason: 'Corroborating Signal: Customer complaints about missing sizes spiked 2 weeks ahead of returns, confirming shoppers left without UK 8 & 9.',
    },
    {
      rank: 3,
      driver: 'Regional Marketing Campaign Overlap (fact_campaigns)',
      category: 'Marketing',
      confidenceScore: 0.64,
      status: 'MINOR DRIVER',
      lossContributionPct: 0.0,
      lossRevenueLakhs: 0.0,
      evidenceCitation: 'fact_campaigns: "Nitro Running City Blitz" active 2026-05-25 to 2026-06-25, 15% off • Regional scope capped at MEDIUM confidence',
      verdictReason: 'Evaluated: Campaign successfully drove +3.9% foot traffic lift, but regional scope cannot explain store-specific conversion anomaly.',
    },
    {
      rank: 4,
      driver: 'Fitting Room Wait Times During Peak Hours',
      category: 'Store Ops',
      confidenceScore: 0.82,
      status: 'CORROBORATING',
      lossContributionPct: 22.0,
      lossRevenueLakhs: 5.6,
      evidenceCitation: 'fact_mystery_shopper: Sizing guidance score 51.9/100 • Peak queue 8.4 mins',
      verdictReason: 'Contributing Factor: Weekend evening trial room delays added secondary friction.',
    },
    {
      rank: 5,
      driver: 'Competitor Discounts on Other Shoes',
      category: 'Commercial',
      confidenceScore: 0.42,
      status: 'DISPROVEN',
      lossContributionPct: 0.0,
      lossRevenueLakhs: 0.0,
      evidenceCitation: 'Market pricing crawl: Competitor discount limited to legacy lifestyle models, not Marathon Pro.',
      verdictReason: 'Ruled Out: Competitor promotions were only on older sneakers, not top performance shoes.',
    },
    {
      rank: 6,
      driver: 'Cash Counter Register Latency',
      category: 'Store IT',
      confidenceScore: 0.58,
      status: 'MINOR DRIVER',
      lossContributionPct: 3.0,
      lossRevenueLakhs: 1.9,
      evidenceCitation: 'fact_pos: Terminal-2 heartbeat latency 4.2s on weekend peak',
      verdictReason: 'Minor Factor: Slight terminal delay at checkout, but customers did not abandon baskets.',
    },
  ],
  abstention: [
    {
      rank: 1,
      driver: 'Trial Room Staffing Delays',
      category: 'Store Ops',
      confidenceScore: 0.40,
      status: 'MINOR DRIVER',
      lossContributionPct: 40.0,
      lossRevenueLakhs: 3.4,
      evidenceCitation: 'fact_mystery_shopper: Ambiguous queue readings • Multiple conflicting shift records',
      verdictReason: 'Inconclusive: Conflicting audit logs prevent definitive attribution.',
    },
    {
      rank: 2,
      driver: 'Heavy Weekend Rain Shower',
      category: 'Store Ops',
      confidenceScore: 0.32,
      status: 'MINOR DRIVER',
      lossContributionPct: 32.0,
      lossRevenueLakhs: 2.8,
      evidenceCitation: 'Weather API: 22mm rainfall recorded on Sunday, but mall walk-ins were unaffected.',
      verdictReason: 'Inconclusive: Some walk-ins slowed, but mall stores showed normal traffic.',
    },
    {
      rank: 3,
      driver: 'Competitor Promotional Campaign',
      category: 'Commercial',
      confidenceScore: 0.28,
      status: 'MINOR DRIVER',
      lossContributionPct: 28.0,
      lossRevenueLakhs: 2.4,
      evidenceCitation: 'Ad intelligence feed: 15% discount banner detected on nearby rival outlet.',
      verdictReason: 'Inconclusive: Not enough data to measure cross-store impact.',
    },
    {
      rank: 4,
      driver: 'Product Stock Shortage',
      category: 'Supply Chain',
      confidenceScore: 0.12,
      status: 'DISPROVEN',
      lossContributionPct: 0.0,
      lossRevenueLakhs: 0.0,
      evidenceCitation: 'fact_inventory: On-hand inventory counts are healthy (96.5% fill rate).',
      verdictReason: 'Ruled Out: Shoe inventory on the floor is well stocked.',
    },
  ],
  normal: [
    {
      rank: 1,
      driver: 'Optimal Shoe Size Coverage Across All Racks',
      category: 'Supply Chain',
      confidenceScore: 0.98,
      status: 'CONFIRMED PRIMARY',
      lossContributionPct: 0.0,
      lossRevenueLakhs: 0.0,
      evidenceCitation: 'fact_inventory: 98.2% full-curve size fill rate across all 26 styles.',
      verdictReason: 'Healthy: Full size availability is driving steady retail conversions.',
    },
    {
      rank: 2,
      driver: 'Fast Sizing Assistance by Store Runners',
      category: 'Store Ops',
      confidenceScore: 0.91,
      status: 'CORROBORATING',
      lossContributionPct: 0.0,
      lossRevenueLakhs: 0.0,
      evidenceCitation: 'fact_mystery_shopper: 94.2/100 staff sizing responsiveness score.',
      verdictReason: 'Healthy: Floor staff efficiently fetched requested sizes with zero queue buildup.',
    },
    {
      rank: 3,
      driver: 'Running Campaign Customer Walk-ins',
      category: 'Commercial',
      confidenceScore: 0.88,
      status: 'CORROBORATING',
      lossContributionPct: 0.0,
      lossRevenueLakhs: 0.0,
      evidenceCitation: 'Campaign telemetry: Nitro running campaign boosted high-intent foot traffic (+3.9%).',
      verdictReason: 'Healthy: Ad traffic converted smoothly into completed purchases.',
    },
    {
      rank: 4,
      driver: 'Smooth POS Cash Counter Checkouts',
      category: 'Store IT',
      confidenceScore: 0.95,
      status: 'CORROBORATING',
      lossContributionPct: 0.0,
      lossRevenueLakhs: 0.0,
      evidenceCitation: 'fact_pos: <1.2s transaction processing across all terminals.',
      verdictReason: 'Healthy: Fast checkout with no bottlenecks.',
    },
  ],
};

export const HypothesisRankingCard: React.FC<HypothesisRankingCardProps> = ({
  selectedScenario = 'hero',
}) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const hypotheses = SCENARIO_HYPOTHESES[selectedScenario] || SCENARIO_HYPOTHESES.hero;

  const headerBadge = selectedScenario === 'normal'
    ? 'All Factors Healthy'
    : selectedScenario === 'abstention'
    ? 'Multiple Mixed Signals'
    : 'Primary Cause Identified';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
      {/* Header: Title + ONE plain language badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs">
              <Scale className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Other Possible Causes We Checked
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
              {headerBadge}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            We tested stock levels, trial room delays, competitor prices, and checkout speed.
          </p>
        </div>
      </div>

      {/* Ranked Hypotheses Cards (Plain Language First) */}
      <div className="space-y-2.5">
        {hypotheses.map((h) => {
          const isPrimary = h.status === 'CONFIRMED PRIMARY';
          const isDisproven = h.status === 'DISPROVEN';
          const isCorroborating = h.status === 'CORROBORATING';

          return (
            <div
              key={h.rank}
              className={`p-3.5 rounded-xl border transition-all space-y-2 ${
                isPrimary
                  ? 'bg-rose-50/40 border-rose-200 shadow-2xs'
                  : isDisproven
                  ? 'bg-slate-50/50 border-slate-200 opacity-80'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold flex items-center justify-center font-mono shrink-0">
                    {h.rank}
                  </span>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-2 flex-wrap">
                      <span>{h.driver}</span>
                      <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold border ${
                        isPrimary
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : isDisproven
                          ? 'bg-slate-100 text-slate-600 border-slate-300'
                          : isCorroborating
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        {isPrimary ? 'Primary Driver' : isDisproven ? 'Ruled Out' : isCorroborating ? 'Verified' : 'Minor Factor'}
                      </span>
                    </div>
                  </div>
                </div>

                {h.lossRevenueLakhs > 0 && (
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-rose-600 font-mono">
                      -₹{h.lossRevenueLakhs.toFixed(1)}L
                    </span>
                  </div>
                )}
              </div>

              {/* Plain-Language Verdict Explanation */}
              <p className="text-xs text-slate-600 leading-tight pl-7">
                {h.verdictReason}
              </p>

              {/* Technical Evidence String (Shown only when technical details expanded) */}
              {showTechnicalDetails && (
                <div className="pl-7 pt-1 text-[10px] font-mono text-slate-400 border-t border-slate-100 flex items-center justify-between">
                  <span>Citation: {h.evidenceCitation}</span>
                  <span>Confidence: {Math.round(h.confidenceScore * 100)}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Collapsible Technical Details Section */}
      <div className="border-t border-slate-100 pt-2">
        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition cursor-pointer"
        >
          <span>Show technical details</span>
          {showTechnicalDetails ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {showTechnicalDetails && (
          <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 leading-relaxed animate-in fade-in duration-150">
            Bayesian causal elimination calculates posterior attribution probabilities by pitting competing hypotheses against historical baseline priors and active learning corrections.
          </div>
        )}
      </div>
    </div>
  );
};
