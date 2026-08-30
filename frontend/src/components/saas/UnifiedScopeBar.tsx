import React from 'react';
import {
  Building2,
  ChevronRight,
  MapPin,
  Store,
  Tag,
  X,
  Filter,
} from 'lucide-react';
import type { RetailFilterState } from '../../types/retailRcaTypes';
import { useLocalization } from '../../context/LocalizationContext';

interface UnifiedScopeBarProps {
  filters: RetailFilterState;
  onClearFilter: (key: keyof RetailFilterState) => void;
  onResetAllFilters: () => void;
  dateRangeLabel: string;
  selectedScenario?: string;
}

export const UnifiedScopeBar: React.FC<UnifiedScopeBarProps> = ({
  filters,
  onClearFilter,
  onResetAllFilters,
  dateRangeLabel,
  selectedScenario,
}) => {
  const { t } = useLocalization();
  const activeChips: { key: keyof RetailFilterState; label: string; value: string }[] = [];

  if (filters.selectedRegion && filters.selectedRegion !== 'All') {
    activeChips.push({ key: 'selectedRegion', label: 'Region', value: filters.selectedRegion });
  }

  if (filters.selectedStoreId && filters.selectedStoreId !== 'All') {
    activeChips.push({
      key: 'selectedStoreId',
      label: 'Store',
      value: filters.selectedStoreId === 'STORE-001' ? 'STORE-001 (Mumbai Flagship)' : filters.selectedStoreId,
    });
  }

  if (filters.searchQuery && filters.searchQuery.trim() !== '') {
    activeChips.push({ key: 'searchQuery', label: 'SKU / Search', value: filters.searchQuery });
  }

  if (filters.selectedDriver && filters.selectedDriver !== 'All') {
    activeChips.push({ key: 'selectedDriver', label: 'Driver Attribution', value: filters.selectedDriver });
  }

  if (filters.cadence && filters.cadence !== 'Weekly') {
    activeChips.push({ key: 'cadence', label: 'Grain', value: filters.cadence });
  }

  return (
    <div className="bg-white border-b border-slate-200/90 px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
      {/* Left: Single Consolidated Hierarchy Breadcrumb */}
      <div className="flex items-center gap-1.5 min-w-0 text-slate-500 font-medium overflow-x-auto scrollbar-none py-0.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
          {t('Current Scope', 'Current Scope')}:
        </span>

        {/* Enterprise */}
        <div className="flex items-center gap-1 shrink-0 text-slate-700 font-semibold hover:text-emerald-700 transition">
          <Building2 className="w-3 h-3 text-emerald-600" />
          <span>Puma Enterprise</span>
        </div>

        <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />

        {/* Region */}
        <div className="flex items-center gap-1 shrink-0 text-slate-700 font-semibold hover:text-emerald-700 transition">
          <MapPin className="w-3 h-3 text-blue-600" />
          <span>
            {filters.selectedRegion !== 'All' ? `${filters.selectedRegion} Region` : 'All Regions (Enterprise)'}
          </span>
        </div>

        <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />

        {/* Store */}
        <div className="flex items-center gap-1 shrink-0 text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
          <Store className="w-3 h-3 text-amber-600" />
          <span>
            {filters.selectedStoreId !== 'All'
              ? filters.selectedStoreId === 'STORE-001'
                ? 'STORE-001 (Mumbai Flagship)'
                : filters.selectedStoreId
              : 'All Stores Network'}
          </span>
        </div>

        {filters.searchQuery && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
            <div className="flex items-center gap-1 shrink-0 text-emerald-900 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <Tag className="w-3 h-3 text-emerald-600" />
              <span>{filters.searchQuery}</span>
            </div>
          </>
        )}
      </div>

      {/* Right: Active Filter Chips with One-Click Removal */}
      <div className="flex items-center gap-2 shrink-0">
        {activeChips.length > 0 ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3 h-3 text-slate-400" />
              <span>{t('filter', 'Filters')} ({activeChips.length}):</span>
            </span>

            {activeChips.map((chip) => (
              <span
                key={chip.key}
                className="inline-flex items-center gap-1 pl-2 pr-1.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold border border-slate-200 transition"
              >
                <span className="text-slate-400">{chip.label}:</span>
                <span className="font-bold text-slate-900">{chip.value}</span>
                <button
                  onClick={() => onClearFilter(chip.key)}
                  className="w-3.5 h-3.5 rounded-full hover:bg-slate-300/80 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer ml-0.5"
                  title={`Remove ${chip.label} filter`}
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}

            <button
              onClick={onResetAllFilters}
              className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline px-1 cursor-pointer"
            >
              {t('Clear All', 'Clear All')}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            {selectedScenario && (
              <span className={`px-2 py-0.5 rounded-md font-semibold border ${
                selectedScenario === 'sparse'
                  ? 'bg-amber-50 text-amber-800 border-amber-300 font-sans'
                  : selectedScenario === 'abstention'
                  ? 'bg-purple-50 text-purple-700 border-purple-200 font-sans'
                  : selectedScenario === 'normal'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-sans'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200 font-sans'
              }`}>
                {selectedScenario === 'hero'
                  ? 'STORE-001 Stockout Scenario'
                  : selectedScenario === 'sparse'
                  ? '⚡ Preset: SKU-9901 / FW-016 Trailblazer (is_sparse_history: true)'
                  : selectedScenario === 'abstention'
                  ? 'Low-Confidence Abstention Scenario'
                  : 'Normal Baseline Scenario'}
              </span>
            )}
            <span>
              Horizon: <strong>{dateRangeLabel}</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
