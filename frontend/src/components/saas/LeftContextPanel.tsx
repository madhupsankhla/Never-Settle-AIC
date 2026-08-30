import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Building2,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  ShoppingBag,
  MapPin,
  Zap,
  Store,
  Tag,
  Layers,
  Package,
  Activity,
} from 'lucide-react';
import type { RetailOrgNode } from '../../types/retailRcaTypes';
import type { PersonaType } from '../../types';
import { NodeAnalyticsEngine } from '../../data/nodeAnalyticsEngine';
import { useLocalization } from '../../context/LocalizationContext';

interface LeftContextPanelProps {
  activeSubTab: 'org' | 'summary' | 'insights';
  onChangeSubTab: (tab: 'org' | 'summary' | 'insights') => void;
  selectedNodeId: string | null;
  onSelectNode: (node: RetailOrgNode) => void;
  orgTreeData: RetailOrgNode;
  currentPersona?: PersonaType;
  selectedScenario?: string;
}

// Alternative Cross-Cutting Product Catalog Tree (Item 6)
const PRODUCT_CATALOG_TREE_DATA: RetailOrgNode = {
  id: 'prod-root',
  name: 'Puma Global Footwear Catalog',
  level: 'enterprise',
  conversionRate: 17.2,
  revenueLakhs: 248.5,
  footfall: 14240,
  children: [
    {
      id: 'cat-performance-running',
      name: 'Performance Running (Core Category)',
      level: 'businessUnit',
      conversionRate: 15.4,
      revenueLakhs: 142.0,
      footfall: 8900,
      children: [
        {
          id: 'sku-fw-001',
          name: 'FW-001 Marathon Pro (Hero SKU)',
          level: 'category',
          conversionRate: 12.8,
          revenueLakhs: 64.2,
          footfall: 4200,
        },
        {
          id: 'sku-fw-002',
          name: 'FW-002 Velocity Nitro 3',
          level: 'category',
          conversionRate: 18.2,
          revenueLakhs: 48.0,
          footfall: 2600,
        },
        {
          id: 'sku-fw-003',
          name: 'FW-003 Deviate Nitro Elite',
          level: 'category',
          conversionRate: 17.6,
          revenueLakhs: 29.8,
          footfall: 2100,
        },
      ],
    },
    {
      id: 'cat-training-gym',
      name: 'Training & Gym',
      level: 'businessUnit',
      conversionRate: 18.5,
      revenueLakhs: 62.5,
      footfall: 3100,
      children: [
        {
          id: 'sku-fw-004',
          name: 'FW-004 Fuse 2.0 Cross Trainer',
          level: 'category',
          conversionRate: 18.7,
          revenueLakhs: 38.0,
          footfall: 1900,
        },
      ],
    },
    {
      id: 'cat-lifestyle-sneakers',
      name: 'Sportstyle & Retro Sneakers',
      level: 'businessUnit',
      conversionRate: 19.4,
      revenueLakhs: 44.0,
      footfall: 2240,
      children: [
        {
          id: 'sku-fw-005',
          name: 'FW-005 Suede Classic XXI',
          level: 'category',
          conversionRate: 19.8,
          revenueLakhs: 28.5,
          footfall: 1400,
        },
      ],
    },
  ],
};

// Robust recursive search that never throws on null/undefined
const findNodeById = (node: RetailOrgNode | null | undefined, id: string | null): RetailOrgNode | null => {
  if (!id || !node) return null;
  if (node.id === id) return node;
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }
  return null;
};

const findAncestorPath = (root: RetailOrgNode | null, targetId: string | null): string[] => {
  if (!targetId || !root) return [];
  const path: string[] = [];
  const search = (node: RetailOrgNode): boolean => {
    path.push(node.id);
    if (node.id === targetId) return true;
    if (node.children && Array.isArray(node.children)) {
      for (const child of node.children) {
        if (search(child)) return true;
      }
    }
    path.pop();
    return false;
  };
  search(root);
  return path;
};

export const LeftContextPanel: React.FC<LeftContextPanelProps> = ({
  activeSubTab,
  onChangeSubTab,
  selectedNodeId,
  onSelectNode,
  orgTreeData,
  currentPersona = 'store_manager',
  selectedScenario = 'hero',
}) => {
  const { t, formatCurrency } = useLocalization();
  const [treeViewMode, setTreeViewMode] = useState<'location' | 'product'>('location');
  
  // Default: Only active path expanded on load (Fix 2)
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'org-enterprise': true,
    'bu-premium-retail': true,
    'reg-west': true,
    'store-STORE-001': true,
  });

  // Dynamically compute narrative tailored for current persona
  const narrativeInfo = React.useMemo(() => {
    const storeCode =
      selectedNodeId && selectedNodeId.startsWith('store-')
        ? selectedNodeId.replace('store-', '')
        : selectedNodeId || 'STORE-001';
    return NodeAnalyticsEngine.getNarrative(
      storeCode,
      'West',
      '',
      selectedScenario,
      currentPersona
    );
  }, [selectedNodeId, selectedScenario, currentPersona]);

  // Auto-expand ancestors when selectedNodeId or tree mode changes
  React.useEffect(() => {
    const activeTree = treeViewMode === 'location' ? orgTreeData : PRODUCT_CATALOG_TREE_DATA;
    if (selectedNodeId && activeTree) {
      const ancestors = findAncestorPath(activeTree, selectedNodeId);
      if (ancestors.length > 0) {
        const newExpanded: Record<string, boolean> = {};
        ancestors.forEach((id) => {
          newExpanded[id] = true;
        });
        setExpandedNodes(newExpanded);
      }
    }
  }, [selectedNodeId, treeViewMode, orgTreeData]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const allIds: Record<string, boolean> = {};
    const traverse = (node: RetailOrgNode) => {
      if (!node) return;
      allIds[node.id] = true;
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(traverse);
      }
    };
    const activeTree = treeViewMode === 'location' ? orgTreeData : PRODUCT_CATALOG_TREE_DATA;
    traverse(activeTree);
    setExpandedNodes(allIds);
  };

  const collapseAll = () => {
    const activeTree = treeViewMode === 'location' ? orgTreeData : PRODUCT_CATALOG_TREE_DATA;
    if (activeTree) {
      setExpandedNodes({
        [activeTree.id]: true,
      });
    }
  };

  // Resolve currently active node data dynamically with full null-safety
  const activeTreeRoot = treeViewMode === 'location' ? orgTreeData : PRODUCT_CATALOG_TREE_DATA;
  const activeNode =
    findNodeById(activeTreeRoot, selectedNodeId) ||
    findNodeById(orgTreeData, selectedNodeId) ||
    findNodeById(PRODUCT_CATALOG_TREE_DATA, selectedNodeId) ||
    activeTreeRoot;

  const displayFootfall =
    activeNode && typeof activeNode.footfall === 'number'
      ? activeNode.footfall.toLocaleString()
      : '14,240';
  const displayConvRate =
    activeNode && typeof activeNode.conversionRate === 'number'
      ? activeNode.conversionRate.toFixed(1)
      : '15.8';
  const isNegativeConv = Number(displayConvRate) < 17.0;
  const activeNodeName = activeNode?.name || 'Enterprise Network';
  const activeNodeLevel = activeNode?.level || 'enterprise';

  // Helper for tier badges and styling in top-to-bottom tree
  const getTierConfig = (level?: RetailOrgNode['level']) => {
    switch (level) {
      case 'enterprise':
        return {
          tierNum: 'T1',
          tierLabel: 'Enterprise',
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          activeBg: 'bg-emerald-50 border-emerald-500 text-emerald-950',
          icon: Building2,
          dotColor: 'bg-emerald-500',
        };
      case 'businessUnit':
        return {
          tierNum: 'T2',
          tierLabel: 'Business Unit / Category',
          badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
          activeBg: 'bg-indigo-50 border-indigo-500 text-indigo-950',
          icon: Layers,
          dotColor: 'bg-indigo-500',
        };
      case 'region':
        return {
          tierNum: 'T3',
          tierLabel: 'Region Cluster',
          badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
          activeBg: 'bg-blue-50 border-blue-500 text-blue-950',
          icon: MapPin,
          dotColor: 'bg-blue-500',
        };
      case 'store':
        return {
          tierNum: 'T4',
          tierLabel: 'Retail Store',
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
          activeBg: 'bg-amber-50 border-amber-500 text-amber-950',
          icon: Store,
          dotColor: 'bg-amber-500',
        };
      case 'category':
      default:
        return {
          tierNum: 'T5',
          tierLabel: 'Hero SKU Product',
          badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
          activeBg: 'bg-purple-50 border-purple-500 text-purple-950',
          icon: Tag,
          dotColor: 'bg-purple-500',
        };
    }
  };

  // Dynamic summary metrics tailored per persona
  const summaryMetrics = React.useMemo(() => {
    if (currentPersona === 'cfo_finance') {
      return [
        {
          label: 'Total Recoverable Leakage',
          value: `₹${narrativeInfo.recoverableRevenueLakhs.toFixed(1)}L`,
          sub: 'EBITDA & Top-line Gross Margin Recovery',
          icon: Zap,
          color: 'text-emerald-700',
          isHighlight: true,
        },
        {
          label: 'Conversion Top-Line Drag',
          value: '-24.0%',
          sub: 'Unmonetized store demand at try-on stage',
          icon: TrendingDown,
          color: 'text-rose-600',
          isAlert: true,
        },
        {
          label: 'Gross Margin Compression',
          value: '-2.1pp',
          sub: 'Lost full-price margin on hero styles',
          icon: Activity,
          color: 'text-amber-600',
          isAlert: true,
        },
        {
          label: 'Emergency Dispatch Capital ROI',
          value: '29.8x',
          sub: '₹45k logistics cost vs ₹13.4L gross recovery',
          icon: TrendingUp,
          color: 'text-emerald-600',
          isHighlight: true,
        },
      ];
    }

    if (currentPersona === 'regional_ops') {
      return [
        {
          label: 'Regional Footwear Conversion',
          value: `${displayConvRate}%`,
          sub: '-3.0pp vs North 18.8% benchmark cluster',
          icon: isNegativeConv ? TrendingDown : TrendingUp,
          color: isNegativeConv ? 'text-rose-600' : 'text-emerald-600',
          isAlert: isNegativeConv,
        },
        {
          label: 'Central DC Replenishment Lag',
          value: '6 Days',
          sub: 'Upstream transit and warehouse cycle delay',
          icon: Package,
          color: 'text-rose-600',
          isAlert: true,
        },
        {
          label: 'Mystery Sizing Guidance Score',
          value: '51.9 / 100',
          sub: 'Weekend floor runner assistance deficit',
          icon: Activity,
          color: 'text-amber-600',
          isAlert: true,
        },
        {
          label: 'Inter-Branch Stock Transfer',
          value: '40 Units',
          sub: 'Immediate rebalance from Pune to Mumbai',
          icon: Zap,
          color: 'text-emerald-700',
          isHighlight: true,
        },
      ];
    }

    if (currentPersona === 'marketing_growth') {
      return [
        {
          label: 'Nitro Campaign Footfall Lift',
          value: '+3.9%',
          sub: '14,240 walk-ins driven by Nitro Campaign',
          icon: TrendingUp,
          color: 'text-emerald-600',
          isHighlight: true,
        },
        {
          label: 'Local Campaign Ad Spend',
          value: '₹18.5L',
          sub: 'Catchment media & targeted social campaigns',
          icon: Tag,
          color: 'text-slate-900',
          isHighlight: false,
        },
        {
          label: 'Try-On to Purchase Drop-Off',
          value: '41.6%',
          sub: 'Intent blocked by rack size stockout',
          icon: TrendingDown,
          color: 'text-rose-600',
          isAlert: true,
        },
        {
          label: 'Campaign ROAS Drag',
          value: '-1.8x',
          sub: 'Stockouts dampening media acquisition return',
          icon: Zap,
          color: 'text-amber-600',
          isAlert: true,
        },
      ];
    }

    // Default Store Operations Manager
    return [
      {
        label: 'Footwear Conversion Rate',
        value: `${displayConvRate}%`,
        sub: isNegativeConv ? 'Material Anomaly Drop (-24.0% vs 18.3% target)' : 'Outperforming target baseline',
        icon: isNegativeConv ? TrendingDown : TrendingUp,
        color: isNegativeConv ? 'text-rose-600' : 'text-emerald-600',
        isAlert: isNegativeConv,
      },
      {
        label: 'Walk-in Footfall Traffic',
        value: displayFootfall,
        sub: 'Stable Control Signal (~7% normal variance)',
        icon: MapPin,
        color: 'text-slate-900',
        isHighlight: false,
      },
      {
        label: 'Core Size-Curve Fill Rate',
        value: activeNodeLevel === 'store' ? '68.4%' : '78.2%',
        sub: 'Deficit concentrated in hero sizes UK 8 & 9',
        icon: ShoppingBag,
        color: 'text-amber-600',
        isAlert: true,
      },
      {
        label: 'Opportunity Revenue Gap',
        value: activeNode?.revenueLakhs ? `₹${(activeNode.revenueLakhs * 0.18).toFixed(1)}L` : '₹13.4L',
        sub: 'Recoverable via size replenishment',
        icon: Zap,
        color: 'text-emerald-700',
        isHighlight: true,
      },
    ];
  }, [currentPersona, displayConvRate, displayFootfall, isNegativeConv, activeNodeLevel, activeNode, narrativeInfo]);

  {/* Top-to-Bottom Vertical Tree Diagram Node Renderer */}
  const renderVerticalTreeNode = (node: RetailOrgNode) => {
    if (!node) return null;
    const isExpanded = !!expandedNodes[node.id];
    const isSelected = selectedNodeId === node.id;
    const hasChildren = !!node.children && node.children.length > 0;
    const tier = getTierConfig(node.level);
    const Icon = tier.icon;

    return (
      <div key={node.id} className="relative select-none">
        {/* Node Card Box */}
        <div
          onClick={() => onSelectNode(node)}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer border shadow-2xs group ${
            isSelected
              ? `${tier.activeBg} font-semibold shadow-xs`
              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/90 hover:border-slate-300'
          }`}
        >
          {/* Tier Icon Badge */}
          <div className={`p-1.5 rounded-lg border shrink-0 ${tier.badgeBg}`}>
            <Icon className="w-3.5 h-3.5" />
          </div>

          {/* Node Text Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 leading-none mb-0.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                {tier.tierNum}
              </span>
              <span className="text-[9px] text-slate-300">•</span>
              <span className="text-[9px] font-semibold text-slate-500 truncate">
                {tier.tierLabel}
              </span>
            </div>
            <div className="truncate font-bold text-slate-900 text-xs" title={node.name}>
              {node.name}
            </div>
          </div>

          {/* Expand/Collapse Chevron Button */}
          {hasChildren ? (
            <button
              onClick={(e) => toggleExpand(node.id, e)}
              className="p-1 rounded-md hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 transition-colors shrink-0 cursor-pointer"
              title={isExpanded ? 'Collapse branch' : `Expand (${node.children?.length} sub-branches)`}
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              )}
            </button>
          ) : (
            <span className={`w-1.5 h-1.5 rounded-full ${tier.dotColor} shrink-0 opacity-60`} />
          )}
        </div>

        {/* Vertical Rail + Child Branches flowing Top to Bottom */}
        {hasChildren && isExpanded && (
          <div className="relative ml-4 pl-3.5 border-l-2 border-slate-300 space-y-2 mt-2 pt-0.5 pb-0.5">
            {node.children!.map((child) => (
              <div key={child.id} className="relative">
                <div className="w-3.5 h-px bg-slate-300 absolute -left-3.5 top-4" />
                {renderVerticalTreeNode(child)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-full overflow-hidden">
      {/* Brand & KPI Overview Header */}
      <div className="p-4 border-b border-slate-100 space-y-3 bg-slate-50/40">
        <div className="flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">
              {activeNodeLevel === 'enterprise'
                ? 'Enterprise Network'
                : `${getTierConfig(activeNodeLevel).tierLabel} Scope`}
            </div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5 truncate">
              <span className="truncate">{activeNodeName}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            </h2>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
            Active Scope
          </span>
        </div>

        {/* Distinct 2-Card Metric Split (Conversion Rate is Signal, Footfall is Control) */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Card 1: Conversion Rate (Primary Material Anomaly Signal) */}
          <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200/90 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-rose-800 uppercase tracking-wider">
              <span>Conversion Rate</span>
              <span className="px-1.5 py-0.2 rounded bg-rose-200 text-rose-900 font-bold">SIGNAL</span>
            </div>
            <div className="text-xl font-black text-rose-600 font-mono tracking-tight">
              {displayConvRate}%
            </div>
            <div className="text-[10px] font-bold text-rose-700 flex items-center gap-0.5">
              <TrendingDown className="w-3 h-3" />
              <span>-2.5pp (-24.0% anomaly)</span>
            </div>
          </div>

          {/* Card 2: Footfall Traffic (Stable Control Signal) */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <span>Store Footfall</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">CONTROL</span>
            </div>
            <div className="text-xl font-black text-slate-900 font-mono tracking-tight">
              {displayFootfall}
            </div>
            <div className="text-[10px] font-semibold text-emerald-700 flex items-center gap-0.5">
              <Activity className="w-3 h-3 text-emerald-600" />
              <span>~7% Noise (Stable)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tabs: ORG TREE / SUMMARY / INSIGHTS */}
      <div className="flex border-b border-slate-200 bg-slate-50/70 p-1 gap-1 text-xs font-semibold">
        <button
          onClick={() => onChangeSubTab('org')}
          className={`flex-1 py-1.5 rounded-md text-center transition-all cursor-pointer ${
            activeSubTab === 'org'
              ? 'bg-white text-slate-900 shadow-2xs font-bold text-emerald-700'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Org Tree
        </button>
        <button
          onClick={() => onChangeSubTab('summary')}
          className={`flex-1 py-1.5 rounded-md text-center transition-all cursor-pointer ${
            activeSubTab === 'summary'
              ? 'bg-white text-slate-900 shadow-2xs font-bold text-emerald-700'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => onChangeSubTab('insights')}
          className={`flex-1 py-1.5 rounded-md text-center transition-all cursor-pointer ${
            activeSubTab === 'insights'
              ? 'bg-white text-slate-900 shadow-2xs font-bold text-emerald-700'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Insights
        </button>
      </div>

      {/* Dynamic Content Area */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {/* SUBTAB 1: 5-Tier Canonical Structure Tree */}
        {activeSubTab === 'org' && (
          <div className="space-y-2.5 animate-in fade-in duration-150">
            {/* View Mode Pivot Selector */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-semibold">
              <button
                onClick={() => setTreeViewMode('location')}
                className={`flex-1 py-1 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  treeViewMode === 'location'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Store className="w-3 h-3" />
                <span>By Location</span>
              </button>
              <button
                onClick={() => setTreeViewMode('product')}
                className={`flex-1 py-1 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  treeViewMode === 'product'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Package className="w-3 h-3" />
                <span>By Product Catalog</span>
              </button>
            </div>

            <div className="flex items-center justify-between px-1">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {treeViewMode === 'location' ? '5-Tier Location Hierarchy' : 'Enterprise Product Catalog'}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Top-to-Bottom Vertical Flow
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px]">
                <button
                  onClick={expandAll}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200 transition-colors cursor-pointer"
                  title="Expand all branches"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200 transition-colors cursor-pointer"
                  title="Collapse all branches"
                >
                  Collapse All
                </button>
              </div>
            </div>

            {/* Vertical Tree Diagram */}
            <div className="space-y-2 pt-1">
              {activeTreeRoot && renderVerticalTreeNode(activeTreeRoot)}
            </div>
          </div>
        )}

        {/* SUBTAB 2: Summary Metrics List */}
        {activeSubTab === 'summary' && (
          <div className="space-y-2.5 animate-in fade-in duration-150">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
              Leadership-Ready Summary for {activeNodeName}
            </div>
            {summaryMetrics.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border transition-all ${
                    m.isHighlight
                      ? 'bg-emerald-50/70 border-emerald-200 shadow-2xs'
                      : m.isAlert
                      ? 'bg-rose-50/60 border-rose-200'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">{m.label}</span>
                    <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                  </div>
                  <div className={`text-base font-bold font-mono pt-0.5 ${m.color}`}>
                    {m.value}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {m.sub}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SUBTAB 3: Localized Deterministic Causal Insights */}
        {activeSubTab === 'insights' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between px-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t('Deterministic Insights', 'Deterministic Insights')}: {activeNodeName}
              </div>
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold border font-mono ${
                  narrativeInfo.confidenceTier === 'HIGH'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : narrativeInfo.confidenceTier === 'LOW'
                    ? 'bg-amber-100 text-amber-800 border-amber-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {Math.round(narrativeInfo.confidenceScore * 100)}% CONFIDENCE
              </span>
            </div>

            {/* Primary Causal Finding Card */}
            <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t(narrativeInfo.title, narrativeInfo.title)}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-700 leading-relaxed">
                {narrativeInfo.findingText}
              </p>

              {/* Evidence Citations */}
              <div className="p-2 rounded-lg bg-white border border-emerald-200/60 text-[10px] space-y-1 font-mono text-slate-600">
                {narrativeInfo.evidenceCitations.map((cit, cIdx) => (
                  <div key={cIdx} className="flex items-center justify-between">
                    <span>{cit.split(':')[0]}</span>
                    <strong className="text-emerald-700 font-bold">
                      {cit.split(':').slice(1).join(':') || 'Verified'}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Immediate Prescribed Action */}
            <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-1">
              <div className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 text-indigo-600" />
                <span>{t('Prescribed Action', 'Prescribed Action')}</span>
              </div>
              <p className="text-[11px] text-indigo-950 font-medium leading-tight">
                {narrativeInfo.recommendedAction}
              </p>
              <div className="pt-1 text-[10px] text-emerald-700 font-bold font-mono">
                +{formatCurrency(narrativeInfo.recoverableRevenueLakhs)} {t('Recoverable', 'Recoverable')}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
