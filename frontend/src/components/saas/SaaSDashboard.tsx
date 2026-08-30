import React, { useState, useMemo } from 'react';
import {
  Sidebar,
  type NavItemKey,
  PERSONA_PROFILES,
} from './Sidebar';
import { TopHeader } from './TopHeader';
import { UnifiedScopeBar } from './UnifiedScopeBar';
import { TopMetricCards } from './TopMetricCards';
import { OverviewNarrativeHero } from './OverviewNarrativeHero';
import { LeftContextPanel } from './LeftContextPanel';
import { TrendAnalysisCard } from './TrendAnalysisCard';
import { BreakdownDonuts } from './BreakdownDonuts';
import { DoseResponseScatterCard } from './DoseResponseScatterCard';
import { HypothesisRankingCard } from './HypothesisRankingCard';
import { SizeLevelBreakdownCard } from './SizeLevelBreakdownCard';
import { LaggedCorrelationCard } from './LaggedCorrelationCard';
import { WeatherResidualCard } from './WeatherResidualCard';
import { ReviewSentimentCard } from './ReviewSentimentCard';
import { DataTableSection } from './DataTableSection';
import { DatasetSummaryCard } from './DatasetSummaryCard';
import { CopilotChatDrawer } from './CopilotChatDrawer';
import { ModelCalibrationModal } from './ModelCalibrationModal';
import { YearOnYearModal } from './YearOnYearModal';
import { FilterPopover } from './FilterPopover';
import { DateRangeModal } from './DateRangeModal';
import { RowDetailModal } from './RowDetailModal';
import { DataIntegrationModal } from './DataIntegrationModal';
import { RetailBoardroomModal } from '../retail/RetailBoardroomModal';
import { ConstraintsModal } from '../ConstraintsModal';
import { TelemetryModal } from '../TelemetryModal';
import { NarrativePanel } from '../NarrativePanel';
import { EvidenceExplorer } from '../EvidenceExplorer';
import { SettingsView } from './SettingsView';
import { HelpDocsModal } from './HelpDocsModal';
import { CausalThresholdsModal } from './CausalThresholdsModal';
import {
  TIME_SERIES_TRENDS,
  RETAIL_ORG_TREE_DATA,
  computeRetailLeadershipKpis,
} from '../../data/retailMockData';
import { NodeAnalyticsEngine } from '../../data/nodeAnalyticsEngine';
import type {
  RetailFilterState,
  RetailOrgNode,
  TabularAuditRecord,
} from '../../types/retailRcaTypes';
import type {
  PersonaType,
  EvidenceObject,
  NarrativeResponse,
  KnownConstraint,
  TelemetrySummary,
} from '../../types';
import {
  Sparkles,
  ArrowDown,
  Zap,
  Network,
  X,
  Bot,
} from 'lucide-react';

interface SaaSDashboardProps {
  currentPersona: PersonaType;
  onSelectPersona: (p: PersonaType) => void;
  selectedScenario: string;
  onSelectScenario: (sc: string) => void;
  evidence: EvidenceObject | null;
  narrative: NarrativeResponse | null;
  constraints: KnownConstraint[];
  telemetry: TelemetrySummary | null;
  isLoading: boolean;
  onAddConstraint: (c: KnownConstraint) => Promise<void>;
  onDeleteConstraint: (id: string) => Promise<void>;
  onOpenFeedback: (driver: string, verdict: 'upvote' | 'downvote') => void;
  onSelectEvidenceTag: (driver: string) => void;
  selectedDriverTag: string | null;
  isOffline?: boolean;
  onLogout?: () => void;
}

export const SaaSDashboard: React.FC<SaaSDashboardProps> = ({
  currentPersona,
  onSelectPersona,
  selectedScenario,
  onSelectScenario,
  evidence,
  narrative,
  constraints,
  telemetry,
  isLoading,
  onAddConstraint,
  onDeleteConstraint,
  onOpenFeedback,
  onSelectEvidenceTag,
  selectedDriverTag,
  isOffline = false,
  onLogout,
}) => {
  // Navigation & Layout State
  const [activeNav, setActiveNav] = useState<NavItemKey>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileTreeOpen, setIsMobileTreeOpen] = useState(false);

  // Left Context Panel Sub-Tab & Node Selection
  const [activeSubTab, setActiveSubTab] = useState<'org' | 'summary' | 'insights'>('org');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('store-STORE-001');

  // Filter State
  const [filters, setFilters] = useState<RetailFilterState>({
    cadence: 'Weekly',
    selectedRegion: 'West',
    selectedStoreId: 'STORE-001',
    selectedKpi: 'conversion_rate',
    selectedDriver: 'All',
    selectedYear: 2026,
    searchQuery: '',
  });

  // Date Range State
  const [dateRangeLabel, setDateRangeLabel] = useState('Mar 2026 – Aug 2026');
  const [isDateRangeModalOpen, setIsDateRangeModalOpen] = useState(false);

  // Modal States
  const [isYoYModalOpen, setIsYoYModalOpen] = useState(false);
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);
  const [isBoardroomOpen, setIsBoardroomOpen] = useState(false);
  const [isConstraintsOpen, setIsConstraintsOpen] = useState(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
  const [isDataIntegrationOpen, setIsDataIntegrationOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isCalibrationOpen, setIsCalibrationOpen] = useState(false);
  const [isHelpDocsOpen, setIsHelpDocsOpen] = useState(false);
  const [isCausalThresholdsOpen, setIsCausalThresholdsOpen] = useState(false);
  const [selectedTableRow, setSelectedTableRow] = useState<TabularAuditRecord | null>(null);

  // Dynamically compute Funnel metrics based on selected node in Org Tree & Scenario
  const dynamicFunnel = useMemo(() => {
    return NodeAnalyticsEngine.getFunnel(
      filters.selectedStoreId,
      filters.selectedRegion,
      filters.searchQuery,
      selectedScenario
    );
  }, [filters.selectedStoreId, filters.selectedRegion, filters.searchQuery, selectedScenario]);

  const totalFunnelLeakage = useMemo(() => {
    return dynamicFunnel.reduce((acc, stage) => acc + stage.leakageValueLakhs, 0);
  }, [dynamicFunnel]);

  // Handle filter clearing from Unified Scope Bar
  const handleClearFilter = (key: keyof RetailFilterState) => {
    setFilters((prev) => ({
      ...prev,
      [key]:
        key === 'selectedRegion' || key === 'selectedStoreId' || key === 'selectedDriver'
          ? 'All'
          : key === 'searchQuery'
          ? ''
          : 'Weekly',
    }));
  };

  const handleResetAllFilters = () => {
    setFilters({
      cadence: 'Weekly',
      selectedRegion: 'All',
      selectedStoreId: 'All',
      selectedKpi: 'conversion_rate',
      selectedDriver: 'All',
      selectedYear: 2026,
      searchQuery: '',
    });
  };

  // Handle Org Tree node selection across all Canonical Tiers & Product Catalog
  const handleSelectTreeNode = (node: RetailOrgNode) => {
    setSelectedNodeId(node.id);

    if (node.level === 'enterprise' || node.level === 'businessUnit') {
      if (node.id.startsWith('cat-') || node.id.startsWith('prod-')) {
        setFilters((prev) => ({
          ...prev,
          searchQuery: node.name.replace(/\(.*\)/, '').trim(),
        }));
      } else {
        setFilters((prev) => ({
          ...prev,
          selectedRegion: 'All',
          selectedStoreId: 'All',
          searchQuery: '',
        }));
      }
    } else if (node.level === 'region') {
      let reg = 'West';
      if (node.name.toLowerCase().includes('north') || node.id.includes('north')) reg = 'North';
      else if (node.name.toLowerCase().includes('south') || node.id.includes('south')) reg = 'South';
      else if (node.name.toLowerCase().includes('west') || node.id.includes('west')) reg = 'West';

      setFilters((prev) => ({
        ...prev,
        selectedRegion: reg,
        selectedStoreId: 'All',
        searchQuery: '',
      }));
    } else if (node.level === 'store') {
      const match = node.name.match(/STORE-\d+/);
      const storeId = match ? match[0] : (node.id.replace('store-', '') || 'STORE-001');

      let reg = 'West';
      if (['STORE-002', 'STORE-004'].includes(storeId) || node.name.toLowerCase().includes('delhi') || node.name.toLowerCase().includes('gurugram')) {
        reg = 'North';
      } else if (['STORE-007', 'STORE-003', 'STORE-008'].includes(storeId) || node.name.toLowerCase().includes('bengaluru') || node.name.toLowerCase().includes('chennai') || node.name.toLowerCase().includes('hyderabad')) {
        reg = 'South';
      } else {
        reg = 'West';
      }

      setFilters((prev) => ({
        ...prev,
        selectedRegion: reg,
        selectedStoreId: storeId,
        searchQuery: '',
      }));
    } else if (node.level === 'category') {
      const skuMatch = node.name.match(/FW-\d+|SKU-\d+/);
      const skuCode = skuMatch ? skuMatch[0] : node.name.split(' ')[0];

      let storeId = filters.selectedStoreId;
      let reg = filters.selectedRegion;

      if (node.id.includes('delhi')) {
        storeId = 'STORE-002';
        reg = 'North';
      } else if (node.id.includes('pune')) {
        storeId = 'STORE-005';
        reg = 'West';
      } else if (node.id.includes('ahm')) {
        storeId = 'STORE-006';
        reg = 'West';
      } else if (node.id.includes('ggn')) {
        storeId = 'STORE-004';
        reg = 'North';
      } else if (node.id.includes('blr')) {
        storeId = 'STORE-003';
        reg = 'South';
      } else if (node.id.includes('hyd')) {
        storeId = 'STORE-007';
        reg = 'South';
      } else if (node.id.includes('chn')) {
        storeId = 'STORE-008';
        reg = 'South';
      }

      setFilters((prev) => ({
        ...prev,
        selectedStoreId: storeId,
        selectedRegion: reg,
        searchQuery: skuCode,
      }));
    }

    setIsMobileTreeOpen(false);
  };

  const activeFilterCount =
    (filters.selectedRegion !== 'All' ? 1 : 0) +
    (filters.selectedStoreId !== 'All' ? 1 : 0) +
    (filters.selectedDriver !== 'All' ? 1 : 0) +
    (filters.cadence !== 'Weekly' ? 1 : 0);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-900 antialiased selection:bg-emerald-500 selection:text-white relative">
      {/* 1. Left Global Navigation Sidebar */}
      <Sidebar
        activeTab={activeNav}
        onSelectTab={(tab) => {
          setActiveNav(tab);
          if (tab === 'rca_insights') setActiveSubTab('insights');
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        userRole={currentPersona}
        onSelectPersona={onSelectPersona}
        onOpenHelpDocs={() => setIsHelpDocsOpen(true)}
        onOpenCausalThresholds={() => setIsCausalThresholdsOpen(true)}
        onLogout={onLogout}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative z-10">
        {/* Top Header */}
        <TopHeader
          breadcrumb={
            activeNav === 'overview'
              ? 'Overview'
              : activeNav === 'analytics'
              ? 'Trend & RCA Analytics'
              : activeNav === 'table_data'
              ? 'Data Grid'
              : activeNav === 'settings'
              ? 'Settings & Parameters'
              : 'AI Causal Insights'
          }
          activePersona={currentPersona}
          selectedScenario={selectedScenario}
          onSelectScenario={onSelectScenario}
          dateRangeLabel={dateRangeLabel}
          onOpenDateRange={() => setIsDateRangeModalOpen(true)}
          onOpenFilterPopover={() => setIsFilterPopoverOpen(true)}
          onOpenConstraints={() => setIsConstraintsOpen(true)}
          onOpenBoardroom={() => setIsBoardroomOpen(true)}
          onOpenCopilot={() => setIsCopilotOpen(true)}
          activeFilterCount={activeFilterCount}
          isOffline={isOffline}
        />

        {/* Mobile Hierarchy Tree Drawer Toggle */}
        <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200">
          <button
            onClick={() => setIsMobileTreeOpen(true)}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 cursor-pointer"
          >
            <Network className="w-4 h-4 text-emerald-600" />
            <span>Open Org Hierarchy Tree</span>
          </button>
          <span className="text-xs font-mono text-slate-500 font-semibold truncate max-w-[200px]">
            {filters.selectedStoreId} ({filters.selectedRegion})
          </span>
        </div>

        {/* FIXED-HEIGHT TWO-PANE DASHBOARD LAYOUT (Independent Scroll Panes) */}
        <div className="flex-1 flex h-[calc(100vh-64px)] overflow-hidden relative">
          {/* PANE 1: Left Hierarchy Tree & Context Panel (Independent Scroll Container) */}
          <aside className="hidden lg:block w-80 xl:w-96 shrink-0 h-full overflow-y-auto border-r border-slate-200 bg-white p-4">
            <LeftContextPanel
              activeSubTab={activeSubTab}
              onChangeSubTab={setActiveSubTab}
              selectedNodeId={selectedNodeId}
              onSelectNode={handleSelectTreeNode}
              orgTreeData={RETAIL_ORG_TREE_DATA}
              currentPersona={currentPersona}
              selectedScenario={selectedScenario}
            />
          </aside>

          {/* Mobile Overlay Drawer */}
          {isMobileTreeOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
              <div className="w-80 max-w-[85vw] h-full bg-white shadow-2xl p-4 overflow-y-auto flex flex-col space-y-3 animate-in slide-in-from-left duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Network className="w-4 h-4 text-emerald-600" />
                    <span>Hierarchy Navigation</span>
                  </span>
                  <button
                    onClick={() => setIsMobileTreeOpen(false)}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <LeftContextPanel
                    activeSubTab={activeSubTab}
                    onChangeSubTab={setActiveSubTab}
                    selectedNodeId={selectedNodeId}
                    onSelectNode={handleSelectTreeNode}
                    orgTreeData={RETAIL_ORG_TREE_DATA}
                    currentPersona={currentPersona}
                    selectedScenario={selectedScenario}
                  />
                </div>
              </div>
              <div className="flex-1" onClick={() => setIsMobileTreeOpen(false)} />
            </div>
          )}

          {/* PANE 2: Right Main Analytics Suite (Independent Scroll Container) */}
          <main className="flex-1 h-full overflow-y-auto bg-slate-50 flex flex-col min-w-0">
            {/* Sticky Scope Bar */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xs border-b border-slate-200/80 shadow-2xs">
              <UnifiedScopeBar
                filters={filters}
                onClearFilter={handleClearFilter}
                onResetAllFilters={handleResetAllFilters}
                dateRangeLabel={dateRangeLabel}
                selectedScenario={selectedScenario}
              />
            </div>

            {/* Scrollable Analytics Content Canvas */}
            <div className="p-4 md:p-6 space-y-6 flex-1">
              {/* TAB 1: Standalone Data Grid Tab */}
              {activeNav === 'table_data' && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <DataTableSection
                    onSelectRecord={(row) => setSelectedTableRow(row)}
                    regionFilter={filters.selectedRegion}
                    storeFilter={filters.selectedStoreId}
                    searchFilter={filters.searchQuery}
                    isStandaloneView={true}
                  />
                </div>
              )}

              {/* TAB 2: Standalone Trend & RCA Analytics View */}
              {activeNav === 'analytics' && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <TrendAnalysisCard
                    timeSeriesData={TIME_SERIES_TRENDS}
                    onOpenYoYModal={() => setIsYoYModalOpen(true)}
                    selectedKpi={filters.selectedKpi}
                    cadence={filters.cadence}
                    selectedRegion={filters.selectedRegion}
                    selectedStoreId={filters.selectedStoreId}
                    selectedDriver={filters.selectedDriver}
                  />

                  <BreakdownDonuts
                    onSelectCategory={(cat) => setFilters((p) => ({ ...p, searchQuery: cat }))}
                    onSelectRegion={(reg) => {
                      const r = reg.includes('West') ? 'West' : reg.includes('North') ? 'North' : 'South';
                      setFilters((p) => ({ ...p, selectedRegion: r }));
                    }}
                    selectedRegion={filters.selectedRegion}
                    selectedStoreId={filters.selectedStoreId}
                    selectedCategory={filters.searchQuery}
                  />

                  <DoseResponseScatterCard selectedStoreId={filters.selectedStoreId} selectedScenario={selectedScenario} />
                  <WeatherResidualCard selectedStoreId={filters.selectedStoreId} />
                  <LaggedCorrelationCard selectedStoreId={filters.selectedStoreId} />
                  <ReviewSentimentCard selectedStoreId={filters.selectedStoreId} />
                  <HypothesisRankingCard selectedScenario={selectedScenario} />
                  <SizeLevelBreakdownCard selectedStoreId={filters.selectedStoreId} selectedSku={filters.searchQuery} selectedScenario={selectedScenario} />
                </div>
              )}

              {/* TAB 3: Standalone AI Causal Hub View */}
              {activeNav === 'rca_insights' && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                      <Sparkles className="w-4 h-4" />
                      <span>AI Narrative Action Engine & Triangulated Evidence</span>
                    </div>
                    <button
                      onClick={() => setIsTelemetryOpen(true)}
                      className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-mono cursor-pointer"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Telemetry SLA</span>
                    </button>
                  </div>

                  <NarrativePanel
                    narrative={narrative}
                    currentPersona={currentPersona}
                    isLoading={isLoading}
                    onOpenFeedback={onOpenFeedback}
                    onSelectEvidenceTag={onSelectEvidenceTag}
                  />

                  <EvidenceExplorer
                    evidence={evidence}
                    selectedDriverFromTag={
                      filters.selectedDriver !== 'All' ? filters.selectedDriver : selectedDriverTag
                    }
                  />
                </div>
              )}

              {/* TAB 4: SETTINGS & CONFIGURATIONS VIEW */}
              {activeNav === 'settings' && (
                <div className="animate-in fade-in duration-150">
                  <SettingsView
                    currentPersona={currentPersona}
                    onSelectPersona={onSelectPersona}
                    selectedScenario={selectedScenario}
                    onSelectScenario={onSelectScenario}
                  />
                </div>
              )}

              {/* TAB 5: COMPLETE OVERVIEW TAB */}
              {activeNav === 'overview' && (
                <>
                  {/* 0. Top 4-Card Locked KPI Metric Row (PRD Section 3) */}
                  <TopMetricCards
                    filters={filters}
                    onOpenYoY={() => setIsYoYModalOpen(true)}
                    selectedScenario={selectedScenario}
                  />

                  {/* 1. Inline AI Narrative Hero Card with Confidence + Citations */}
                  <OverviewNarrativeHero
                    narrative={narrative}
                    selectedStoreId={filters.selectedStoreId}
                    selectedRegion={filters.selectedRegion}
                    searchQuery={filters.searchQuery}
                    selectedScenario={selectedScenario}
                    currentPersona={currentPersona}
                    onInspectEvidence={() => setActiveNav('rca_insights')}
                  />

                  {/* 2. Primary Multi-Week Trend Analysis Card */}
                  <TrendAnalysisCard
                    timeSeriesData={TIME_SERIES_TRENDS}
                    onOpenYoYModal={() => setIsYoYModalOpen(true)}
                    selectedKpi={filters.selectedKpi}
                    cadence={filters.cadence}
                    selectedRegion={filters.selectedRegion}
                    selectedStoreId={filters.selectedStoreId}
                    selectedDriver={filters.selectedDriver}
                  />

                  {/* 3. Category & Regional Breakdown Donut Cards */}
                  <BreakdownDonuts
                    onSelectCategory={(cat) => setFilters((p) => ({ ...p, searchQuery: cat }))}
                    onSelectRegion={(reg) => {
                      const r = reg.includes('West') ? 'West' : reg.includes('North') ? 'North' : 'South';
                      setFilters((p) => ({ ...p, selectedRegion: r }));
                    }}
                    selectedRegion={filters.selectedRegion}
                    selectedStoreId={filters.selectedStoreId}
                    selectedCategory={filters.searchQuery}
                  />

                  {/* 4. 5-Stage Retail Footwear Conversion Funnel Section */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                          <Zap className="w-4 h-4 text-emerald-600" />
                          <span>5-Stage Retail Conversion & Size-Match Funnel</span>
                        </h3>
                        <p className="text-xs text-slate-400">
                          Step-by-step shopper progression from walk-in footfall to POS checkout with leakage valuation
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 shadow-2xs">
                        -₹{totalFunnelLeakage.toFixed(1)}L Total Drop-off Leakage
                      </span>
                    </div>

                    {/* Funnel Stages Progression */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      {dynamicFunnel.map((stage, idx) => {
                        const isAnomaly = stage.id === 'f2';
                        return (
                          <div
                            key={stage.id}
                            className={`p-3.5 rounded-xl border transition-all ${
                              isAnomaly
                                ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-400/20 shadow-xs'
                                : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                              <span>Stage 0{idx + 1}</span>
                              <span className="font-mono text-slate-700">{stage.pctOfTotal.toFixed(1)}%</span>
                            </div>

                            <div className="font-bold text-xs text-slate-900 mt-1 truncate" title={stage.stageName}>
                              {stage.stageName}
                            </div>

                            <div className="text-lg font-black font-mono text-slate-900 my-1">
                              {stage.count.toLocaleString()}
                            </div>

                            {stage.dropOffCount > 0 ? (
                              <div className="pt-2 border-t border-slate-200/70 text-[10px] space-y-1.5">
                                <div className="flex items-center justify-between text-rose-600 font-semibold">
                                  <span className="flex items-center gap-0.5">
                                    <ArrowDown className="w-3 h-3" /> Drop-off
                                  </span>
                                  <span className="font-mono">-{stage.dropOffCount.toLocaleString()}</span>
                                </div>

                                <div className="space-y-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <span
                                      className="text-slate-600 font-medium truncate"
                                      title={stage.primaryLeakageReason}
                                    >
                                      {stage.primaryLeakageReason}
                                    </span>
                                    {stage.confidenceTier && (
                                      <span
                                        className={`px-1.5 py-0.2 rounded text-[8px] font-bold shrink-0 ${
                                          stage.confidenceTier === 'HIGH'
                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                            : stage.confidenceTier === 'MEDIUM'
                                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                                        }`}
                                      >
                                        {stage.confidenceTier}
                                      </span>
                                    )}
                                  </div>

                                  <div className="font-mono font-bold text-rose-600 text-xs">
                                    -₹{stage.leakageValueLakhs.toFixed(1)}L loss
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="pt-2 border-t border-slate-200/70 text-[10px] space-y-1 text-emerald-700 font-semibold">
                                <div className="flex items-center gap-1">
                                  <span>✓ POS Converted</span>
                                </div>
                                <div className="font-mono text-emerald-800 font-bold">
                                  15.8% Final Rate
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 5. Data Lineage & Sources Provenance Summary Card */}
                  <DatasetSummaryCard
                    onOpenDataGrid={() => setActiveNav('table_data')}
                    onOpenDataIntegration={() => setIsDataIntegrationOpen(true)}
                  />
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Floating AI Copilot Pill (Bottom Right) */}
      <button
        onClick={() => setIsCopilotOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-2xl flex items-center gap-2.5 transition-all transform hover:scale-105 cursor-pointer border border-emerald-400/40 ring-4 ring-emerald-500/20"
        title="Open SoleSight AI Copilot (Powered by ChatGPT)"
      >
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
          <Bot className="w-3.5 h-3.5 text-white" />
        </div>
        <span>AI Copilot & Feedback Engine</span>
        <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
      </button>

      {/* Side-Drawer: AI Copilot & In-Message Feedback Engine */}
      <CopilotChatDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        filters={filters}
        userName={PERSONA_PROFILES[currentPersona]?.name || 'Rahul Sharma'}
        userRole={PERSONA_PROFILES[currentPersona]?.roleTitle || 'Store Operations Manager'}
        onOpenCalibrationModal={() => {
          setIsCopilotOpen(false);
          setIsCalibrationOpen(true);
        }}
      />

      {/* Modal: Active Learning & Model Calibration Audit Drawer */}
      <ModelCalibrationModal
        isOpen={isCalibrationOpen}
        onClose={() => setIsCalibrationOpen(false)}
      />

      {/* Modals & Popovers */}
      <DataIntegrationModal
        isOpen={isDataIntegrationOpen}
        onClose={() => setIsDataIntegrationOpen(false)}
      />

      <DateRangeModal
        isOpen={isDateRangeModalOpen}
        onClose={() => setIsDateRangeModalOpen(false)}
        currentRange={dateRangeLabel}
        currentCadence={filters.cadence}
        onSelectRange={(label, _start, _end, newCadence) => {
          setDateRangeLabel(label);
          if (newCadence) {
            setFilters((prev) => ({ ...prev, cadence: newCadence }));
          }
        }}
      />

      <YearOnYearModal
        isOpen={isYoYModalOpen}
        onClose={() => setIsYoYModalOpen(false)}
        brandName="SoleSight Enterprise / Puma Performance Hub"
      />

      <FilterPopover
        isOpen={isFilterPopoverOpen}
        onClose={() => setIsFilterPopoverOpen(false)}
        filters={filters}
        onChangeFilters={setFilters}
      />

      <RowDetailModal
        record={selectedTableRow}
        onClose={() => setSelectedTableRow(null)}
      />

      <RetailBoardroomModal
        isOpen={isBoardroomOpen}
        onClose={() => setIsBoardroomOpen(false)}
        kpis={computeRetailLeadershipKpis(filters.selectedStoreId, filters.selectedRegion)}
        filters={filters}
      />

      <ConstraintsModal
        isOpen={isConstraintsOpen}
        onClose={() => setIsConstraintsOpen(false)}
        constraints={constraints}
        onAddConstraint={onAddConstraint}
        onDeleteConstraint={onDeleteConstraint}
      />

      <TelemetryModal
        isOpen={isTelemetryOpen}
        onClose={() => setIsTelemetryOpen(false)}
        telemetry={telemetry}
      />

      <HelpDocsModal
        isOpen={isHelpDocsOpen}
        onClose={() => setIsHelpDocsOpen(false)}
        onOpenCopilot={() => setIsCopilotOpen(true)}
      />

      <CausalThresholdsModal
        isOpen={isCausalThresholdsOpen}
        onClose={() => setIsCausalThresholdsOpen(false)}
      />
    </div>
  );
};
