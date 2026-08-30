import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Building2,
  MapPin,
  Store,
  Tag,
  Search,
} from 'lucide-react';
import type { RetailOrgNode } from '../../types/retailRcaTypes';

interface Props {
  treeData: RetailOrgNode;
  selectedNodeId: string | null;
  onSelectNode: (node: RetailOrgNode) => void;
}

export const RetailOrgTree: React.FC<Props> = ({
  treeData,
  selectedNodeId,
  onSelectNode,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(['org-enterprise', 'bu-premium-retail', 'reg-west', 'store-STORE-014'])
  );
  const [searchTerm, setSearchTerm] = useState('');

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    const traverse = (node: RetailOrgNode) => {
      allIds.add(node.id);
      if (node.children) node.children.forEach(traverse);
    };
    traverse(treeData);
    setExpandedNodes(allIds);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set(['org-enterprise']));
  };

  const getNodeIcon = (level: RetailOrgNode['level']) => {
    switch (level) {
      case 'enterprise':
        return <Building2 className="w-3.5 h-3.5 text-indigo-400" />;
      case 'businessUnit':
        return <Building2 className="w-3.5 h-3.5 text-cyan-400" />;
      case 'region':
        return <MapPin className="w-3.5 h-3.5 text-emerald-400" />;
      case 'store':
        return <Store className="w-3.5 h-3.5 text-amber-400" />;
      case 'category':
        return <Tag className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Store className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const renderTreeNode = (node: RetailOrgNode, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNodeId === node.id;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match = node.name.toLowerCase().includes(q);
      const childMatch = node.children?.some((c) => c.name.toLowerCase().includes(q));
      if (!match && !childMatch && depth > 0) return null;
    }

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={() => onSelectNode(node)}
          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-all duration-150 group ${
            isSelected
              ? 'bg-indigo-600/25 text-white border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
              : 'hover:bg-slate-800/60 text-slate-300'
          }`}
          style={{ paddingLeft: `${depth * 14 + 10}px` }}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {hasChildren ? (
              <button
                onClick={(e) => toggleExpand(node.id, e)}
                className="p-0.5 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
            ) : (
              <span className="w-4" />
            )}

            <span className="flex-shrink-0">{getNodeIcon(node.level)}</span>
            <span className="truncate font-medium text-slate-200 group-hover:text-white">
              {node.name}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded border font-semibold ${
                node.conversionRate < 14.5
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  : node.conversionRate < 17.0
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {node.conversionRate.toFixed(1)}%
            </span>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-0.5 border-l border-slate-800/80 ml-4 pl-1">
            {node.children!.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3.5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-1.5 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            Organizational Structure
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight">
            Store & Product Hierarchy
          </h3>
          <p className="text-[10px] text-slate-400">
            Enterprise → Business Unit → Region → Store → SKU Category
          </p>
        </div>

        <div className="flex items-center gap-1 text-[11px]">
          <button
            onClick={expandAll}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            Expand
          </button>
          <button
            onClick={collapseAll}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            Collapse
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Filter tree nodes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Hierarchy Tree View */}
      <div className="flex-1 overflow-y-auto max-h-[500px] pr-1 space-y-0.5">
        {renderTreeNode(treeData, 0)}
      </div>

      {/* Legend & Active Note */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> &lt;14.5% (Alert)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> &gt;17.0% (Optimal)
          </span>
        </div>
        <span className="text-indigo-400 font-semibold truncate max-w-[120px]">
          {selectedNodeId ? selectedNodeId.replace(/^(org|bu|reg|store|cat)-/, '') : 'Enterprise'}
        </span>
      </div>
    </div>
  );
};
