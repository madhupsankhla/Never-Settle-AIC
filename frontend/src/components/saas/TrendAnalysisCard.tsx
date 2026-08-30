import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceArea,
} from 'recharts';
import {
  Calendar,
  Table as TableIcon,
  BarChart2,
  TrendingDown,
  AlertTriangle,
} from 'lucide-react';
import type { TimeSeriesTrendPoint, RetailFilterState } from '../../types/retailRcaTypes';

import { NodeAnalyticsEngine } from '../../data/nodeAnalyticsEngine';

interface TrendAnalysisCardProps {
  timeSeriesData: TimeSeriesTrendPoint[];
  onOpenYoYModal: () => void;
  onExportCsv?: () => void;
  onExportJson?: () => void;
  selectedKpi?: string;
  cadence?: RetailFilterState['cadence'];
  selectedRegion?: string;
  selectedStoreId?: string;
  selectedDriver?: string;
}

// Custom Glassmorphic Smooth Tooltip
const CustomTrendTooltip = ({ active, payload, label, unit = '%' }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-xl text-xs space-y-2 min-w-[230px] animate-in fade-in zoom-in-95 duration-100">
      <div className="flex items-center justify-between border-b border-slate-700/70 pb-1.5">
        <span className="font-bold text-white font-mono">{label}</span>
        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Observed Horizon</span>
      </div>
      <div className="space-y-1.5 pt-0.5">
        {payload.map((entry: any, index: number) => {
          const isActual = entry.dataKey === 'actual';
          const isFootfall = entry.dataKey === 'footfall';
          const isDip = isActual && Number(entry.value) < 16.0;
          const entryUnit = isFootfall ? ' walk-ins' : unit;

          return (
            <div key={index} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-300 text-[11px] truncate">
                  {entry.name}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0 font-mono font-bold">
                <span className={isDip ? 'text-rose-400' : 'text-white'}>
                  {Number(entry.value).toLocaleString(undefined, { maximumFractionDigits: 1 })}{entryUnit}
                </span>
                {isDip && <TrendingDown className="w-3 h-3 text-rose-400" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const TrendAnalysisCard: React.FC<TrendAnalysisCardProps> = ({
  timeSeriesData: _timeSeriesData,
  onOpenYoYModal,
  onExportCsv: _onExportCsv,
  onExportJson: _onExportJson,
  selectedKpi = 'conversion_rate',
  cadence = 'Weekly',
  selectedRegion = 'West',
  selectedStoreId = 'STORE-001',
  selectedDriver = 'All',
}) => {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [showFootfallLine, setShowFootfallLine] = useState(true);

  // Dynamic series generation from NodeAnalyticsEngine based on active scope
  const displayData = useMemo(() => {
    return NodeAnalyticsEngine.getTimeSeries(
      selectedStoreId,
      selectedRegion,
      selectedDriver !== 'All' ? selectedDriver : '',
      cadence,
      selectedKpi
    );
  }, [cadence, selectedRegion, selectedStoreId, selectedDriver, selectedKpi]);

  // Metric title, unit, and YAxis scale configuration
  const kpiConfig = useMemo(() => {
    switch (selectedKpi) {
      case 'footfall':
        return {
          title: 'Walk-in Footfall Volume Trend',
          unit: ' entries',
          yDomain: [200, 700],
          actualName: 'Observed Walk-in Footfall',
          baselineName: 'Target Footfall Baseline',
          secondaryName: 'Peak Hours Allocation',
        };
      case 'fill_rate':
        return {
          title: 'Core Size-Curve Fill Rate (%)',
          unit: '%',
          yDomain: [50, 100],
          actualName: 'Actual Size Fill %',
          baselineName: 'Target Service Level (90%)',
          secondaryName: 'Stockout Incidence %',
        };
      case 'revenue_recovery':
        return {
          title: 'Opportunity Loss Gap (₹ Lakhs)',
          unit: 'L',
          yDomain: [0, 30],
          actualName: 'Estimated Revenue Loss',
          baselineName: 'Allowable Tolerance Band',
          secondaryName: 'Direct Stockout Share',
        };
      default:
        return {
          title: 'Conversion Rate Trend & Footfall Overlay',
          unit: '%',
          yDomain: [10, 22],
          actualName: 'Actual Conversion Rate (%)',
          baselineName: 'Target Baseline (18.3%)',
          secondaryName: 'Core Size Fill Rate (%)',
        };
    }
  }, [selectedKpi]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
      {/* Header with Title & Granularity Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              {kpiConfig.title}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
              {cadence} Horizon
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Evaluating longitudinal conversion drift against flat footfall control and event windows
          </p>
        </div>

        {/* View Mode & Overlay Toggles */}
        <div className="flex items-center gap-2">
          {/* Toggle Footfall Line */}
          <button
            onClick={() => setShowFootfallLine(!showFootfallLine)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              showFootfallLine
                ? 'bg-sky-50 border-sky-300 text-sky-800 shadow-2xs'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700'
            }`}
            title="Toggle Footfall Overlay Line (PRD Section 4.3)"
          >
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span>Footfall Overlay</span>
          </button>

          {/* YoY Modal Trigger Button */}
          <button
            onClick={onOpenYoYModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer shadow-2xs"
            title="Compare 2026 vs 2025 Historical Baseline"
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>YoY Historical</span>
          </button>

          {/* Chart / Table Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('chart')}
              className={`p-1.5 rounded-md transition cursor-pointer ${
                viewMode === 'chart'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Chart View"
            >
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table Grid View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Driver Isolation Callout Banner */}
      {selectedDriver !== 'All' && (
        <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Isolating Driver: <strong>{selectedDriver}</strong> • Corroborated with high partial correlation (r = 0.783)
            </span>
          </div>
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider font-mono">
            Active Attribution
          </span>
        </div>
      )}

      {/* VIEW A: Chart View with Footfall Overlay & Event Shaded Bands */}
      {viewMode === 'chart' ? (
        <div className="h-[290px] w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={displayData}
              margin={{ top: 10, right: showFootfallLine ? 15 : 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradientActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="gradientBaseline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="gradientStockout" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              
              <XAxis
                dataKey="period"
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                dy={4}
              />
              
              {/* Primary Left Y-Axis: Conversion % & Fill Rate % */}
              <YAxis
                yAxisId="left"
                tick={{ fill: '#64748b', fontSize: 11 }}
                domain={kpiConfig.yDomain as any}
                unit={kpiConfig.unit}
                axisLine={false}
                tickLine={false}
                dx={-4}
              />

              {/* Secondary Right Y-Axis: Footfall Entries */}
              {showFootfallLine && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: '#0284c7', fontSize: 10, fontWeight: 500 }}
                  domain={['auto', 'auto']}
                  tickFormatter={(val) => `${Number(val).toLocaleString()}`}
                  label={{ value: 'Footfall (Entries)', angle: 90, position: 'insideRight', fill: '#0284c7', fontSize: 10, fontWeight: 600, dy: 30 }}
                  axisLine={{ stroke: '#e0f2fe' }}
                  tickLine={false}
                  dx={4}
                />
              )}

              {/* Shaded Event Bands (PRD Section 4.3) */}
              {cadence === 'Weekly' && (
                <>
                  <ReferenceArea
                    yAxisId="left"
                    x1="2026-W31"
                    x2="2026-W33"
                    fill="#ef4444"
                    fillOpacity={0.07}
                    label={{ value: 'Stockout Crisis Window', fill: '#dc2626', fontSize: 10, position: 'insideTop' }}
                  />
                  <ReferenceArea
                    yAxisId="left"
                    x1="2026-W32"
                    x2="2026-W32"
                    fill="#f59e0b"
                    fillOpacity={0.12}
                    label={{ value: 'Promo Overlap', fill: '#d97706', fontSize: 9, position: 'insideBottom' }}
                  />
                </>
              )}

              <Tooltip content={<CustomTrendTooltip unit={kpiConfig.unit} />} />

              <Legend
                verticalAlign="top"
                align="left"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '14px', fontSize: '11px', fontWeight: 600 }}
              />

              {/* Conversion Rate Area */}
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="actual"
                name={kpiConfig.actualName}
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#gradientActual)"
                dot={{ r: 4, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#ffffff', stroke: '#10b981', strokeWidth: 3 }}
                isAnimationActive={true}
              />

              {/* Target Baseline Area */}
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="baseline"
                name={kpiConfig.baselineName}
                stroke="#6366f1"
                strokeWidth={2}
                strokeDasharray="4 4"
                fill="url(#gradientBaseline)"
                dot={{ r: 3, fill: '#6366f1', stroke: '#ffffff', strokeWidth: 1.5 }}
                activeDot={{ r: 5, fill: '#6366f1', stroke: '#ffffff', strokeWidth: 2 }}
                isAnimationActive={true}
              />

              {/* Size Fill Secondary Area */}
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="secondary"
                name={kpiConfig.secondaryName}
                stroke="#f59e0b"
                strokeWidth={1.8}
                fill="url(#gradientStockout)"
                dot={{ r: 3, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 1 }}
                activeDot={{ r: 5, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 2 }}
                isAnimationActive={true}
              />

              {/* Footfall Overlay Line (PRD Section 4.3) */}
              {showFootfallLine && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="footfall"
                  name="Walk-in Footfall Volume (Flat Control)"
                  stroke="#0284c7"
                  strokeWidth={2.2}
                  strokeDasharray="5 5"
                  dot={{ r: 3.5, fill: '#0284c7', stroke: '#ffffff', strokeWidth: 1.5 }}
                  activeDot={{ r: 6, fill: '#ffffff', stroke: '#0284c7', strokeWidth: 2.5 }}
                  isAnimationActive={true}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      ) : (
        /* VIEW B: Table View */
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Horizon Period</th>
                <th className="py-2.5 px-3">Actual Conversion (%)</th>
                <th className="py-2.5 px-3">Target Baseline (%)</th>
                <th className="py-2.5 px-3">Size Fill Rate (%)</th>
                <th className="py-2.5 px-3">Walk-in Footfall</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {displayData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{row.period}</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-700">{row.actual}%</td>
                  <td className="py-2.5 px-3 text-indigo-600">{row.baseline}%</td>
                  <td className="py-2.5 px-3 text-amber-700">{row.secondary}%</td>
                  <td className="py-2.5 px-3 text-sky-700">{row.footfall.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
