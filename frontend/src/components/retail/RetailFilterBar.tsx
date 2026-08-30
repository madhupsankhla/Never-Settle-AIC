import React from 'react';
import {
  Calendar,
  MapPin,
  Store,
  BarChart2,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import type { RetailFilterState } from '../../types/retailRcaTypes';

interface Props {
  filters: RetailFilterState;
  onChangeFilters: (newFilters: RetailFilterState) => void;
}

export const RetailFilterBar: React.FC<Props> = ({ filters, onChangeFilters }) => {
  const handleReset = () => {
    onChangeFilters({
      cadence: 'Weekly',
      selectedRegion: 'West',
      selectedStoreId: 'STORE-014',
      selectedKpi: 'conversion_rate',
      selectedDriver: 'All',
      selectedYear: 2026,
      searchQuery: '',
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
      {/* Top Controls: Cadence, Primary KPI, Search, Reset */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
        {/* Left: Cadence */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Cadence:
          </span>
          <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
            {(['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'] as const).map((c) => (
              <button
                key={c}
                onClick={() => onChangeFilters({ ...filters, cadence: c })}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  filters.cadence === c
                    ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Center: KPI Selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Focus KPI:
          </span>
          <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
            {[
              { id: 'conversion_rate', label: 'Conversion Rate' },
              { id: 'revenue', label: 'Revenue Recovery' },
              { id: 'footfall', label: 'Store Footfall' },
              { id: 'size_fill_rate', label: 'Size Curve Fill' },
            ].map((k) => (
              <button
                key={k.id}
                onClick={() => onChangeFilters({ ...filters, selectedKpi: k.id })}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  filters.selectedKpi === k.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Quick Search & Reset */}
        <div className="flex items-center gap-3 flex-1 max-w-xs ml-auto">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search store, SKU, driver..."
              value={filters.searchQuery}
              onChange={(e) => onChangeFilters({ ...filters, searchQuery: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50 transition-colors text-xs flex items-center gap-1 cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Reset</span>
          </button>
        </div>
      </div>

      {/* Bottom Dropdowns: Region, Store, Causal Driver */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        {/* Region */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 text-cyan-400">
            <MapPin className="w-3.5 h-3.5" /> Region Territory
          </label>
          <select
            value={filters.selectedRegion}
            onChange={(e) =>
              onChangeFilters({
                ...filters,
                selectedRegion: e.target.value,
                selectedStoreId: e.target.value === 'West' ? 'STORE-014' : 'All',
              })
            }
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
          >
            <option value="All">All Operating Regions</option>
            <option value="West">West Region (Mumbai / Pune / Ahmedabad)</option>
            <option value="North">North Region (Delhi NCR / Gurugram)</option>
            <option value="South">South Region (Bengaluru / Hyderabad / Chennai)</option>
          </select>
        </div>

        {/* Store */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 text-emerald-400">
            <Store className="w-3.5 h-3.5" /> Store Location
          </label>
          <select
            value={filters.selectedStoreId}
            onChange={(e) => onChangeFilters({ ...filters, selectedStoreId: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
          >
            <option value="All">All Stores (Aggregate)</option>
            <option value="STORE-014">STORE-014 (Mumbai High Street Flagship)</option>
            <option value="STORE-011">STORE-011 (Pune Phoenix Mall)</option>
            <option value="STORE-012">STORE-012 (Ahmedabad Palladium)</option>
            <option value="STORE-001">STORE-001 (Delhi Connaught Place)</option>
            <option value="STORE-004">STORE-004 (Gurugram CyberHub)</option>
            <option value="STORE-007">STORE-007 (Bengaluru Indiranagar)</option>
            <option value="STORE-003">STORE-003 (Chennai Express Avenue)</option>
          </select>
        </div>

        {/* Causal Driver Filter */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 text-violet-400">
            <BarChart2 className="w-3.5 h-3.5" /> Root Cause Driver
          </label>
          <select
            value={filters.selectedDriver}
            onChange={(e) => onChangeFilters({ ...filters, selectedDriver: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
          >
            <option value="All">All Diagnosed Root Causes</option>
            <option value="size_stockout">Core Size-Curve Stockout (UK 8 & 9)</option>
            <option value="fitting_room">Fitting Room Wait Friction</option>
            <option value="staff_training">Staff Training Gap</option>
            <option value="competitor_promo">Competitor Flash Discount</option>
          </select>
        </div>
      </div>
    </div>
  );
};
