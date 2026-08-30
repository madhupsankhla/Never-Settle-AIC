import React, { useState, useMemo } from 'react';
import {
  BarChart2,
  Table,
} from 'lucide-react';
import type { RetailFilterState, RetailOrgNode } from '../../types/retailRcaTypes';
import {
  RETAIL_FUNNEL_DATA,
  TIME_SERIES_TRENDS,
  STORE_COMPARISON_DATA,
  DRIVER_DECOMPOSITION_DATA,
  RETAIL_ORG_TREE_DATA,
  computeRetailLeadershipKpis,
} from '../../data/retailMockData';
import { RetailFilterBar } from './RetailFilterBar';
import { RetailExecutiveSummary } from './RetailExecutiveSummary';
import { RetailOrgTree } from './RetailOrgTree';
import { RetailVisualAnalytics } from './RetailVisualAnalytics';
import { RetailTableView } from './RetailTableView';
import { RetailBoardroomModal } from './RetailBoardroomModal';

interface Props {
  selectedStore: string;
  onSelectStore: (storeId: string, region: string) => void;
}

export const RetailRcaDashboard: React.FC<Props> = ({
  selectedStore,
  onSelectStore,
}) => {
  const [filters, setFilters] = useState<RetailFilterState>({
    cadence: 'Weekly',
    selectedRegion: 'West',
    selectedStoreId: selectedStore || 'STORE-014',
    selectedKpi: 'conversion_rate',
    selectedDriver: 'All',
    selectedYear: 2026,
    searchQuery: '',
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('store-STORE-014');
  const [activeMainView, setActiveMainView] = useState<'visual_analytics' | 'tabular_data'>('visual_analytics');
  const [isBoardroomOpen, setIsBoardroomOpen] = useState(false);

  // Compute Leadership KPIs
  const leadershipKpis = useMemo(() => {
    return computeRetailLeadershipKpis(filters.selectedStoreId, filters.selectedRegion);
  }, [filters.selectedStoreId, filters.selectedRegion]);

  // Handle Org Tree node click
  const handleSelectTreeNode = (node: RetailOrgNode) => {
    setSelectedNodeId(node.id);
    if (node.level === 'region') {
      const reg = node.name.includes('West') ? 'West' : node.name.includes('North') ? 'North' : 'South';
      setFilters((prev) => ({ ...prev, selectedRegion: reg, selectedStoreId: 'All' }));
      onSelectStore('All', reg);
    } else if (node.level === 'store') {
      const match = node.name.match(/STORE-\d+/);
      const storeId = match ? match[0] : 'STORE-014';
      const reg = storeId === 'STORE-001' || storeId === 'STORE-004' ? 'North' : storeId === 'STORE-007' || storeId === 'STORE-003' ? 'South' : 'West';
      setFilters((prev) => ({ ...prev, selectedStoreId: storeId, selectedRegion: reg }));
      onSelectStore(storeId, reg);
    } else if (node.level === 'enterprise' || node.level === 'businessUnit') {
      setFilters((prev) => ({ ...prev, selectedRegion: 'All', selectedStoreId: 'All' }));
      onSelectStore('All', 'All');
    }
  };

  const storeLabel =
    filters.selectedStoreId === 'All'
      ? `${filters.selectedRegion} Region (Aggregate)`
      : filters.selectedStoreId === 'STORE-014'
      ? 'STORE-014 (Mumbai High Street Flagship)'
      : filters.selectedStoreId;

  return (
    <div className="space-y-6">
      {/* 1. Global Filter Bar */}
      <RetailFilterBar filters={filters} onChangeFilters={setFilters} />

      {/* 2. Executive Leadership Index & Summary Cards */}
      <RetailExecutiveSummary
        kpis={leadershipKpis}
        storeLabel={storeLabel}
        onOpenBoardroom={() => setIsBoardroomOpen(true)}
        onOpenTableExport={() => setActiveMainView('tabular_data')}
      />

      {/* View Switcher Bar: Visual Analytics vs Tabular Data */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveMainView('visual_analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeMainView === 'visual_analytics'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Visual Analytics (Line, Bar, Pie, Funnel)
          </button>
          <button
            onClick={() => setActiveMainView('tabular_data')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeMainView === 'tabular_data'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            Tabular Form & Downloads
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Target Active: <strong className="text-indigo-400">{storeLabel}</strong>
        </div>
      </div>

      {/* 3. Main Workspace Grid: Canonical Org Tree + Visual Charts / Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (4 cols): Canonical Org Tree */}
        <div className="lg:col-span-4 h-full">
          <RetailOrgTree
            treeData={RETAIL_ORG_TREE_DATA}
            selectedNodeId={selectedNodeId}
            onSelectNode={handleSelectTreeNode}
          />
        </div>

        {/* Right Column (8 cols): Visual Analytics Suite OR Tabular View */}
        <div className="lg:col-span-8">
          {activeMainView === 'visual_analytics' ? (
            <RetailVisualAnalytics
              funnelData={RETAIL_FUNNEL_DATA}
              timeSeriesData={TIME_SERIES_TRENDS}
              storeComparisonData={STORE_COMPARISON_DATA}
              driverDecompositionData={DRIVER_DECOMPOSITION_DATA}
              filters={filters}
            />
          ) : (
            <RetailTableView />
          )}
        </div>
      </div>

      {/* Boardroom Presentation Modal */}
      <RetailBoardroomModal
        isOpen={isBoardroomOpen}
        onClose={() => setIsBoardroomOpen(false)}
        kpis={leadershipKpis}
        filters={filters}
      />
    </div>
  );
};
