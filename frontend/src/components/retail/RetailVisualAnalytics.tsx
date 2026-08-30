import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Filter as FunnelIcon,
  Layers,
  ArrowDown,
  AlertTriangle,
} from 'lucide-react';
import type {
  FunnelStage,
  TimeSeriesTrendPoint,
  StoreComparisonPoint,
  DriverDecompositionPoint,
  RetailFilterState,
} from '../../types/retailRcaTypes';

interface Props {
  funnelData: FunnelStage[];
  timeSeriesData: TimeSeriesTrendPoint[];
  storeComparisonData: StoreComparisonPoint[];
  driverDecompositionData: DriverDecompositionPoint[];
  filters: RetailFilterState;
}

type ChartViewTab = 'all_charts' | 'funnel_chart' | 'line_trend' | 'bar_stores' | 'pie_drivers';

export const RetailVisualAnalytics: React.FC<Props> = ({
  funnelData,
  timeSeriesData,
  storeComparisonData,
  driverDecompositionData,
  filters,
}) => {
  const [activeTab, setActiveTab] = useState<ChartViewTab>('all_charts');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      {/* Top Header & Chart View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-1.5 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            Visual Intelligence Suite
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Line, Bar, Pie & Funnel-Down RCA Charts
          </h3>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('all_charts')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'all_charts'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            All 4 Charts
          </button>
          <button
            onClick={() => setActiveTab('funnel_chart')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'funnel_chart'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FunnelIcon className="w-3.5 h-3.5" />
            Funnel-Down
          </button>
          <button
            onClick={() => setActiveTab('line_trend')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'line_trend'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Line Trend
          </button>
          <button
            onClick={() => setActiveTab('bar_stores')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'bar_stores'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Bar Comparison
          </button>
          <button
            onClick={() => setActiveTab('pie_drivers')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'pie_drivers'
                ? 'bg-violet-500 text-slate-950 font-bold shadow-md shadow-violet-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            Pie Decomposition
          </button>
        </div>
      </div>

      {/* 1. FUNNEL-DOWN CHART SECTION */}
      {(activeTab === 'all_charts' || activeTab === 'funnel_chart') && (
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <FunnelIcon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  Retail Store Conversion Funnel-Down Analysis
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Primary Loss: Stage 3 to 4
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Step-by-step customer journey from store footfall to try-ons, size fit check, and final POS checkout.
                </p>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Final Conversion: <strong className="text-emerald-400">14.9%</strong>
            </span>
          </div>

          {/* Interactive Visual Funnel Bars */}
          <div className="space-y-3 pt-2">
            {funnelData.map((stage, idx) => {
              const widthPct = Math.max(18, stage.pctOfTotal);
              const isDropOffHotspot = stage.dropOffPct >= 40.0;

              return (
                <div key={stage.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200">{stage.stageName}</span>
                      {isDropOffHotspot && (
                        <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.2 rounded border border-rose-500/20 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Critical Drop-off ({stage.dropOffPct}%)
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-slate-300">
                      <strong className="text-white">{stage.count.toLocaleString()}</strong> shoppers{' '}
                      <span className="text-indigo-400 font-bold">({stage.pctOfTotal.toFixed(1)}%)</span>
                    </div>
                  </div>

                  {/* Funnel Bar Container */}
                  <div className="w-full bg-slate-900 h-8 rounded-xl overflow-hidden border border-slate-800 p-1 flex items-center">
                    <div
                      className={`h-full rounded-lg transition-all duration-700 flex items-center justify-between px-3 text-[11px] font-mono font-bold shadow-md ${
                        idx === 0
                          ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-slate-950'
                          : idx === 1
                          ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950'
                          : idx === 2
                          ? 'bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950'
                          : idx === 3
                          ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950'
                      }`}
                      style={{ width: `${widthPct}%` }}
                    >
                      <span className="truncate">{stage.stageName.split('. ')[1]}</span>
                      <span>{stage.pctOfTotal.toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Stage Drop-off detail */}
                  {stage.dropOffCount > 0 && (
                    <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 py-0.5">
                      <div className="flex items-center gap-1 text-slate-400">
                        <ArrowDown className="w-3 h-3 text-rose-400" />
                        <span>Drop-off: </span>
                        <strong className="text-rose-300">{stage.dropOffCount.toLocaleString()} lost</strong>
                        <span className="text-slate-500">({stage.primaryLeakageReason})</span>
                      </div>
                      {stage.leakageValueINR > 0 && (
                        <span className="text-amber-400 font-mono font-semibold">
                          Leakage: ₹{stage.leakageValueINR}L
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. LINE GRAPH: TIME SERIES TREND */}
      {(activeTab === 'all_charts' || activeTab === 'line_trend') && (
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Line Graph: Conversion Rate Drift vs Expected Baseline
                </h4>
                <p className="text-[11px] text-slate-400">
                  Tracking 8-week timeline (W26 to W33) displaying baseline anomaly separation.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-cyan-400">
              Cadence: {filters.cadence}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData} margin={{ top: 10, right: 25, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis
                  unit="%"
                  domain={[10, 22]}
                  stroke="#64748b"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(value: any, name: any) => [`${Number(value).toFixed(1)}%`, String(name)]}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
                <ReferenceLine y={18.3} stroke="#64748b" strokeDasharray="4 4" label={{ value: 'Target 18.3%', fill: '#94a3b8', fontSize: 10 }} />
                <Line
                  type="monotone"
                  name="Actual Conversion Rate"
                  dataKey="actualConversionPct"
                  stroke="#f43f5e"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#f43f5e' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  name="Expected Baseline"
                  dataKey="baselineConversionPct"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* TWO-COLUMN GRID: 3. BAR GRAPH & 4. PIE / DONUT CHART */}
      {(activeTab === 'all_charts' || activeTab === 'bar_stores' || activeTab === 'pie_drivers') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* BAR GRAPH: Store Comparison (6 or 12 cols) */}
          {(activeTab === 'all_charts' || activeTab === 'bar_stores') && (
            <div className={`${activeTab === 'all_charts' ? 'lg:col-span-7' : 'lg:col-span-12'} p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Bar Graph: Cross-Store Conversion vs Size Fill Rate
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Comparing performance across West, North, and South region stores.
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={storeComparisonData} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="storeId" stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <YAxis unit="%" domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      formatter={(value: any, name: any) => [`${Number(value).toFixed(1)}%`, String(name)]}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar name="Conversion Rate (%)" dataKey="conversionRatePct" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    <Bar name="Size Fill Rate (%)" dataKey="sizeFillRatePct" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* PIE / DONUT CHART: Driver Decomposition (5 or 12 cols) */}
          {(activeTab === 'all_charts' || activeTab === 'pie_drivers') && (
            <div className={`${activeTab === 'all_charts' ? 'lg:col-span-5' : 'lg:col-span-12'} p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between`}>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  <PieIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Pie Chart: Root Cause Attribution
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    % Decomposition of conversion deficit.
                  </p>
                </div>
              </div>

              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={driverDecompositionData}
                      dataKey="lossContributionPct"
                      nameKey="driver"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {driverDecompositionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      formatter={(value: any) => [`${Number(value).toFixed(1)}% Share`, 'Loss Attribution']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend Badges */}
              <div className="space-y-1 text-xs">
                {driverDecompositionData.slice(0, 3).map((d) => (
                  <div key={d.driver} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-slate-300 truncate">{d.driver}</span>
                    </div>
                    <span className="font-mono font-bold text-white ml-2">
                      {d.lossContributionPct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
