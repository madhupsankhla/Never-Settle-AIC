import React, { useState } from 'react';
import {
  X,
  Calendar,
  Printer,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface YearOnYearModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandName?: string;
}

export const YearOnYearModal: React.FC<YearOnYearModalProps> = ({
  isOpen,
  onClose,
  brandName = 'SoleSight / Puma Flagship',
}) => {
  const [selectedView, setSelectedView] = useState('Conversion %');
  const [selectedCadence, setSelectedCadence] = useState('Monthly');
  const [selectedYearsCount, setSelectedYearsCount] = useState('3 Years (2024-2026)');

  if (!isOpen) return null;

  // Multi-Year Overlay Data (Screen 3)
  const multiYearData = [
    { month: 'Jan', y2026: 18.4, y2025: 17.9, y2024: 17.2 },
    { month: 'Feb', y2026: 18.6, y2025: 18.1, y2024: 17.5 },
    { month: 'Mar', y2026: 18.5, y2025: 18.2, y2024: 17.8 },
    { month: 'Apr', y2026: 18.7, y2025: 18.3, y2024: 18.0 },
    { month: 'May', y2026: 18.8, y2025: 18.4, y2024: 18.1 },
    { month: 'Jun', y2026: 15.8, y2025: 18.5, y2024: 18.2 }, // Stockout anomaly drop
    { month: 'Jul', y2026: 17.2, y2025: 18.2, y2024: 17.9 },
    { month: 'Aug', y2026: 18.1, y2025: 18.4, y2024: 18.0 },
    { month: 'Sep', y2026: 18.5, y2025: 18.3, y2024: 18.1 },
    { month: 'Oct', y2026: 18.6, y2025: 18.5, y2024: 18.3 },
    { month: 'Nov', y2026: 19.2, y2025: 18.9, y2024: 18.6 },
    { month: 'Dec', y2026: 19.8, y2025: 19.4, y2024: 19.0 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-4xl shadow-2xl flex flex-col p-6 space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Comparative Analysis
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span>Year-on-Year Multi-Period Comparison</span>
            </h2>
            <p className="text-xs text-slate-500">{brandName}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Row (Screen 3) */}
        <div className="flex flex-wrap items-center gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-xs">
          {/* View Dropdown */}
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium">
            <span className="text-slate-400">VIEW:</span>
            <select
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value)}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer pr-1"
            >
              <option value="Conversion %">Conversion %</option>
              <option value="Footfall Volume">Footfall Volume</option>
              <option value="Size Fill Rate">Size Fill Rate</option>
            </select>
          </div>

          {/* Cadence Dropdown */}
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium">
            <span className="text-slate-400">BY:</span>
            <select
              value={selectedCadence}
              onChange={(e) => setSelectedCadence(e.target.value)}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer pr-1"
            >
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Weekly">Weekly</option>
            </select>
          </div>

          {/* Years Dropdown */}
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium">
            <span className="text-slate-400">YEARS:</span>
            <select
              value={selectedYearsCount}
              onChange={(e) => setSelectedYearsCount(e.target.value)}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer pr-1"
            >
              <option value="3 Years (2024-2026)">3 Years (2024–2026)</option>
              <option value="2 Years (2025-2026)">2 Years (2025–2026)</option>
              <option value="5 Years (2022-2026)">5 Years (2022–2026)</option>
            </select>
          </div>

          <div className="ml-auto text-xs text-slate-400 font-medium">
            *June 2026 highlights -2.7pp stockout anomaly
          </div>
        </div>

        {/* Multi-Line Smoothed Spline Chart (Screen 3) */}
        <div className="h-[320px] w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={multiYearData}
              margin={{ top: 15, right: 15, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="yoy2026" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="yoy2025" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="yoy2024" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                dy={4}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                domain={[14, 21]}
                unit="%"
                axisLine={false}
                tickLine={false}
                dx={-4}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#ffffff',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                }}
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                formatter={(val: any) => [`${Number(val).toFixed(1)}%`]}
              />
              <Legend
                verticalAlign="top"
                align="left"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '14px', fontSize: '11px', fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="y2026"
                name="2026 (Current Fiscal)"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#yoy2026)"
                dot={{ r: 4, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#ffffff', stroke: '#10b981', strokeWidth: 3 }}
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-out"
              />
              <Area
                type="monotone"
                dataKey="y2025"
                name="2025 (Prior Year)"
                stroke="#6366f1"
                strokeWidth={2.2}
                strokeDasharray="4 4"
                fill="url(#yoy2025)"
                dot={{ r: 3, fill: '#6366f1', stroke: '#ffffff', strokeWidth: 1.5 }}
                activeDot={{ r: 5, fill: '#6366f1', stroke: '#ffffff', strokeWidth: 2 }}
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-out"
              />
              <Area
                type="monotone"
                dataKey="y2024"
                name="2024 (Baseline)"
                stroke="#94a3b8"
                strokeWidth={1.8}
                fill="url(#yoy2024)"
                dot={{ r: 2.5, fill: '#94a3b8', stroke: '#ffffff', strokeWidth: 1 }}
                activeDot={{ r: 4, fill: '#94a3b8', stroke: '#ffffff', strokeWidth: 1.5 }}
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={() => {
                alert('Full 5-Year Historical Performance Report generated.');
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-2xs cursor-pointer"
            >
              View Full Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
