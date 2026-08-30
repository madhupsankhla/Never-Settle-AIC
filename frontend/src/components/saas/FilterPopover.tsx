import React from 'react';
import {
  X,
  RotateCcw,
  Check,
  Filter,
} from 'lucide-react';
import type { RetailFilterState } from '../../types/retailRcaTypes';

interface FilterPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  filters: RetailFilterState;
  onChangeFilters: React.Dispatch<React.SetStateAction<RetailFilterState>>;
}

export const FilterPopover: React.FC<FilterPopoverProps> = ({
  isOpen,
  onClose,
  filters,
  onChangeFilters,
}) => {
  if (!isOpen) return null;

  const handleReset = () => {
    onChangeFilters({
      cadence: 'Weekly',
      selectedRegion: 'All',
      selectedStoreId: 'STORE-001',
      selectedKpi: 'conversion_rate',
      selectedDriver: 'All',
      selectedYear: 2026,
      searchQuery: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-sm shadow-2xl p-5 space-y-4 animate-in slide-in-from-top-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Filter className="w-4 h-4 text-emerald-600" />
            <span>Dashboard Filter Controls</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Controls Form */}
        <div className="space-y-3.5 text-xs">
          {/* Cadence */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Cadence Grain</label>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-lg">
              {(['Daily', 'Weekly', 'Monthly'] as const).map((cad) => (
                <button
                  key={cad}
                  onClick={() => onChangeFilters((prev) => ({ ...prev, cadence: cad }))}
                  className={`py-1 rounded-md font-semibold transition cursor-pointer ${
                    filters.cadence === cad
                      ? 'bg-white text-slate-900 shadow-2xs font-bold text-emerald-700'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {cad}
                </button>
              ))}
            </div>
          </div>

          {/* Region */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Region Filter</label>
            <select
              value={filters.selectedRegion}
              onChange={(e) =>
                onChangeFilters((prev) => ({ ...prev, selectedRegion: e.target.value }))
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:border-emerald-500 focus:outline-none cursor-pointer"
            >
              <option value="All">All Regions (Enterprise Aggregate)</option>
              <option value="West">West Region (Mumbai, Pune, Ahmedabad)</option>
              <option value="North">North Region (Delhi, Gurugram)</option>
              <option value="South">South Region (Bengaluru, Chennai)</option>
            </select>
          </div>

          {/* Target Store Location */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Target Facility / Store</label>
            <select
              value={filters.selectedStoreId}
              onChange={(e) =>
                onChangeFilters((prev) => ({ ...prev, selectedStoreId: e.target.value }))
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:border-emerald-500 focus:outline-none cursor-pointer"
            >
              <option value="STORE-001">STORE-001 (Mumbai High Street Flagship)</option>
              <option value="STORE-002">STORE-002 (North Standard)</option>
              <option value="STORE-003">STORE-003 (Chennai Mall Express)</option>
              <option value="STORE-004">STORE-004 (Gurugram Flagship)</option>
              <option value="STORE-007">STORE-007 (Bengaluru Standard)</option>
              <option value="STORE-014">STORE-014 (West Performance Hub)</option>
              <option value="All">All Stores (Rollup)</option>
            </select>
          </div>

          {/* Focus KPI */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Primary KPI Metric</label>
            <select
              value={filters.selectedKpi}
              onChange={(e) =>
                onChangeFilters((prev) => ({ ...prev, selectedKpi: e.target.value }))
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:border-emerald-500 focus:outline-none cursor-pointer"
            >
              <option value="conversion_rate">Conversion Rate (%)</option>
              <option value="footfall">Footfall Entries</option>
              <option value="fill_rate">Size-Curve Fill Rate (%)</option>
              <option value="revenue_recovery">Recoverable Revenue (₹)</option>
            </select>
          </div>

          {/* Root Cause Driver Filter */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Candidate Driver Isolation</label>
            <select
              value={filters.selectedDriver}
              onChange={(e) =>
                onChangeFilters((prev) => ({ ...prev, selectedDriver: e.target.value }))
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:border-emerald-500 focus:outline-none cursor-pointer"
            >
              <option value="All">All Candidate Drivers</option>
              <option value="Stockout">Core Size-Curve Stockout (UK 8/9)</option>
              <option value="Staffing">Staff Guidance & Training Gap</option>
              <option value="Competitor">Competitor Pricing Undercut</option>
              <option value="Weather">Extreme Weather / Rain Friction</option>
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-medium transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};
