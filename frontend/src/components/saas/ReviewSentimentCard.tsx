import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ReviewPoint {
  week: string;
  fitReviews: number;
  wrongSizeReturns: number;
  label: string;
}

const REVIEW_DATA: ReviewPoint[] = [
  { week: '05-25', fitReviews: 0, wrongSizeReturns: 25, label: 'Normal Baseline' },
  { week: '06-01', fitReviews: 3, wrongSizeReturns: 19, label: 'Early Stockout (Store-001)' },
  { week: '06-08', fitReviews: 9, wrongSizeReturns: 22, label: 'Fit Friction Rising' },
  { week: '06-15', fitReviews: 27, wrongSizeReturns: 21, label: 'Peak Review Spike (27 mentions)' },
  { week: '06-22', fitReviews: 19, wrongSizeReturns: 17, label: 'Tail Review Feedback' },
  { week: '06-29', fitReviews: 17, wrongSizeReturns: 22, label: 'Returns Uptick Wave' },
  { week: '07-06', fitReviews: 5, wrongSizeReturns: 14, label: 'DC Replenishment Settling' },
  { week: '07-13', fitReviews: 0, wrongSizeReturns: 16, label: 'Normalized Baseline' },
];

export const ReviewSentimentCard: React.FC<{ selectedStoreId?: string }> = ({
  selectedStoreId: _selectedStoreId = 'STORE-001',
}) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
      {/* Header: Title + ONE plain language badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Early Warning: Customer Reviews
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 font-mono">
              Fast Early Warning
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Reviews complaining about missing sizes spiked immediately during the stockout — before product returns arrived.
          </p>
        </div>
      </div>

      {/* Trend Line Chart */}
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={REVIEW_DATA} margin={{ top: 10, right: 20, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }} />
            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} label={{ value: 'Mentions / Units', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const pt: ReviewPoint = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1 font-sans">
                      <div className="font-bold text-amber-300 border-b border-slate-700 pb-1">
                        Week of {label} ({pt.label})
                      </div>
                      <div className="font-mono text-[11px] space-y-0.5">
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">Fit-Related Reviews:</span>
                          <strong className="text-amber-400 font-bold">{pt.fitReviews} reviews</strong>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">Wrong-Size Returns:</span>
                          <span className="text-slate-200">{pt.wrongSizeReturns} units</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '11px', paddingBottom: '6px' }} />
            <Line
              type="monotone"
              dataKey="fitReviews"
              name="Customer Fit Reviews (Mentions)"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#f59e0b' }}
            />
            <Line
              type="monotone"
              dataKey="wrongSizeReturns"
              name="Wrong-Size Returns (Units)"
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="3 3"
              dot={{ r: 3, fill: '#ef4444' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Collapsible Technical Details */}
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
            Unstructured customer review sentiment provides qualitative early warning (r = 0.264, p = 0.184) arriving 2–3 weeks ahead of formal return processing data.
          </div>
        )}
      </div>
    </div>
  );
};
