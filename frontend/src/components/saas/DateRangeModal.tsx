import React, { useState } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  Check,
  RotateCcw,
  Clock,
  Sliders,
  Sparkles,
} from 'lucide-react';
import type { RetailFilterState } from '../../types/retailRcaTypes';

interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRange: string;
  onSelectRange: (label: string, startDate?: string, endDate?: string, cadence?: RetailFilterState['cadence']) => void;
  currentCadence?: RetailFilterState['cadence'];
}

interface PresetOption {
  id: string;
  label: string;
  sublabel: string;
  startDate: string;
  endDate: string;
  defaultCadence: RetailFilterState['cadence'];
}

const PRESETS: PresetOption[] = [
  {
    id: '6mo',
    label: 'Mar 2026 – Aug 2026',
    sublabel: 'Full 6-Month Dataset (6,380 records)',
    startDate: '2026-03-01',
    endDate: '2026-08-31',
    defaultCadence: 'Weekly',
  },
  {
    id: 'fy2026',
    label: 'Jan 2026 – Dec 2026',
    sublabel: 'Fiscal Year 2026 Horizon',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    defaultCadence: 'Monthly',
  },
  {
    id: 'q2_anomaly',
    label: 'May 2026 – Jun 2026',
    sublabel: 'Q2 Core Stockout Period',
    startDate: '2026-05-01',
    endDate: '2026-06-30',
    defaultCadence: 'Weekly',
  },
  {
    id: 'aug2026',
    label: 'Aug 1 – Aug 31, 2026',
    sublabel: 'Latest Month (30-Day)',
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    defaultCadence: 'Daily',
  },
];

export const DateRangeModal: React.FC<DateRangeModalProps> = ({
  isOpen,
  onClose,
  currentRange,
  onSelectRange,
  currentCadence = 'Weekly',
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string | null>('6mo');
  const [startDate, setStartDate] = useState('2026-03-01');
  const [endDate, setEndDate] = useState('2026-08-31');
  const [cadence, setCadence] = useState<RetailFilterState['cadence']>(currentCadence);

  if (!isOpen) return null;

  const handleApplyPreset = (p: PresetOption) => {
    if (selectedPreset === p.id) {
      // Toggle off preset if clicked again
      setSelectedPreset(null);
    } else {
      setSelectedPreset(p.id);
      setStartDate(p.startDate);
      setEndDate(p.endDate);
      setCadence(p.defaultCadence);
    }
  };

  const handleConfirm = () => {
    const activePreset = PRESETS.find((p) => p.id === selectedPreset);
    const label = activePreset ? activePreset.label : `${startDate} – ${endDate}`;
    onSelectRange(label, startDate, endDate, cadence);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-lg shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base tracking-tight">Select Reporting Date Horizon</span>
              <p className="text-[11px] text-slate-400 font-normal">
                Currently showing: <strong className="text-slate-700 font-semibold">{currentRange}</strong> ({cadence})
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

        {/* 1. START: Aggregation Grain / Cadence (Daily, Weekly, Monthly) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>1. Aggregation Cadence</span>
            </label>
            <span className="text-[10px] text-slate-400 font-medium">Time series resolution</span>
          </div>

          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
            {(['Daily', 'Weekly', 'Monthly'] as const).map((cad) => {
              const isSelected = cadence === cad;
              return (
                <button
                  key={cad}
                  onClick={() => setCadence(cad)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {cad}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. MIDDLE: Custom Date Range Pickers */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              <span>2. Custom Date Range</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">YYYY-MM-DD</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setSelectedPreset(null);
                }}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono focus:border-emerald-500 focus:outline-none shadow-2xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setSelectedPreset(null);
                }}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono focus:border-emerald-500 focus:outline-none shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* 3. END: Quick Presets (Optional) */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>3. Quick Presets (Optional)</span>
            </label>
            <span className="text-[10px] text-slate-400">Click to autofill dates</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESETS.map((p) => {
              const isSelected = selectedPreset === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleApplyPreset(p)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/20 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{p.label}</span>
                    {isSelected && (
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 line-clamp-1">{p.sublabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            onClick={() => {
              setSelectedPreset('6mo');
              setStartDate('2026-03-01');
              setEndDate('2026-08-31');
              setCadence('Weekly');
            }}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-semibold transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset 6-Mo Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Horizon</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
