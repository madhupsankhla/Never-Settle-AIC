import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend,
} from 'recharts';
import {
  CloudSun,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface SignalPoint {
  week: string;
  convZ: number;
  footfallZ: number;
  actualConv: number;
  footfall: number;
  event: string;
}

const SIGNAL_DETECTION_SERIES: SignalPoint[] = [
  { week: '05-18', convZ: 0.06, footfallZ: -0.83, actualConv: 16.6, footfall: 3003, event: 'Baseline Normal' },
  { week: '05-25', convZ: 0.24, footfallZ: -0.25, actualConv: 16.7, footfall: 3153, event: 'Pre-Stockout Baseline' },
  { week: '06-01', convZ: -5.44, footfallZ: -0.25, actualConv: 13.0, footfall: 3150, event: 'Stockout Anomaly' },
  { week: '06-08', convZ: -2.22, footfallZ: -0.37, actualConv: 13.0, footfall: 3110, event: 'Persistent Stockout' },
  { week: '06-15', convZ: -1.70, footfallZ: -0.43, actualConv: 12.7, footfall: 3120, event: 'Supply Chain Friction' },
  { week: '06-22', convZ: 0.72, footfallZ: -1.17, actualConv: 17.0, footfall: 2913, event: 'DC Recovery' },
  { week: '06-29', convZ: 0.22, footfallZ: -2.45, actualConv: 16.0, footfall: 2488, event: 'Monsoon Rain Spike' },
];

export const WeatherResidualCard: React.FC<{ selectedStoreId?: string }> = ({
  selectedStoreId: _selectedStoreId = 'STORE-001',
}) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
      {/* Header: Title + ONE plain language badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 shadow-2xs">
              <CloudSun className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Was This Caused by Weather?
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
              Not Weather Related
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Rain and weekend patterns explain normal traffic shifts — but this drop occurred during dry, steady footfall.
          </p>
        </div>
      </div>

      {/* Main Signal Decomposition Chart */}
      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={SIGNAL_DETECTION_SERIES} margin={{ top: 10, right: 15, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis domain={[-6, 2]} tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload as SignalPoint;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1">
                      <div className="font-bold border-b border-slate-700 pb-1 flex justify-between">
                        <span>Week {label}</span>
                        <span className="text-teal-400 font-normal">{pt.event}</span>
                      </div>
                      <div className="font-mono text-[11px] space-y-0.5 pt-0.5">
                        <div>Sales Conversion: <strong>{pt.actualConv}%</strong></div>
                        <div>Store Footfall: <strong>{pt.footfall.toLocaleString()} walk-ins</strong></div>
                        <div className={pt.convZ < -2 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                          Conversion Shock: {pt.convZ}
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', paddingBottom: '8px' }}
            />
            <ReferenceLine y={-2.0} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Anomaly Level', fill: '#dc2626', fontSize: 10, position: 'insideBottomRight' }} />
            <Line
              type="monotone"
              dataKey="convZ"
              name="Sales Conversion Pattern"
              stroke="#e11d48"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#e11d48' }}
            />
            <Line
              type="monotone"
              dataKey="footfallZ"
              name="Footfall Traffic Pattern"
              stroke="#0ea5e9"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: '#0ea5e9' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Collapsible Technical Details (Statistical Model & Coefficients) */}
      <div className="border-t border-slate-100 pt-2">
        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition cursor-pointer"
        >
          <span>Show statistical model</span>
          {showTechnicalDetails ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {showTechnicalDetails && (
          <div className="mt-2.5 space-y-2 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5 font-mono">
                <div className="text-[10px] text-slate-400 font-bold uppercase">OLS Model Fit</div>
                <div className="font-bold text-slate-900 text-sm">R² = 0.314</div>
                <div className="text-[10px] text-slate-500">Weather Baseline OLS</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5 font-mono">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Precipitation Coeff</div>
                <div className="font-bold text-rose-600 text-sm">-1.21 / mm</div>
                <div className="text-[10px] text-slate-500">Monsoon Rain Friction</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5 font-mono">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Weekend Lift Coeff</div>
                <div className="font-bold text-emerald-600 text-sm">+117.2 entries</div>
                <div className="text-[10px] text-slate-500">Saturday/Sunday Surge</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5 font-mono">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Anomaly Attribution</div>
                <div className="font-bold text-indigo-600 text-sm">Disentangled</div>
                <div className="text-[10px] text-slate-500">Weather vs Stockout</div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Z-score signal decomposition controls for historical rainfall and seasonal temperature swings, isolating the sharp -5.44σ conversion drop as an inventory stockout event.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
