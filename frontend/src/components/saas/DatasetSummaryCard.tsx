import React from 'react';
import {
  Database,
  Building2,
  Package,
  Receipt,
  Star,
  RefreshCcw,
  ArrowRight,
  ShieldCheck,
  Layers,
  PlugZap,
} from 'lucide-react';

interface DatasetSummaryCardProps {
  onOpenDataGrid: () => void;
  onOpenDataIntegration?: () => void;
  totalRecords?: number;
}

export const DatasetSummaryCard: React.FC<DatasetSummaryCardProps> = ({
  onOpenDataGrid,
  onOpenDataIntegration,
  totalRecords = 6380,
}) => {
  const dataSources = [
    {
      name: 'Store Master Registry',
      source: 'dim_store',
      records: '8 Flagship Stores',
      format: 'SAP Retail Master',
      coverage: 'West, North & South Regions',
      icon: Building2,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      name: 'Master Product Catalog',
      source: 'dim_product',
      records: '26 Footwear Styles',
      format: 'Puma Core Catalog',
      coverage: 'Running, Training, Sportstyle (UK 4–12)',
      icon: Package,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      name: 'POS Transaction Stream',
      source: 'fact_pos',
      records: '97,980 Transactions',
      format: 'Oracle Micros POS',
      coverage: 'Conversions, Revenue & Sub-size Substitution',
      icon: Receipt,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      name: 'Inventory & Stockout Logs',
      source: 'fact_inventory',
      records: '24,288 Daily Snapshots',
      format: 'Blue Yonder WMS',
      coverage: 'Hero Size Availability (UK 8 & 9 Deficit)',
      icon: Layers,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
    {
      name: 'Mystery Shopper Audits',
      source: 'fact_mystery_shopper',
      records: '192 Store Inspections',
      format: 'Third-party Audits',
      coverage: 'Fitting Assistance & Wait-Time Scoring',
      icon: Star,
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    },
    {
      name: 'Returns & Sizing Logs',
      source: 'fact_returns',
      records: '3,840 Return Entries',
      format: 'Omnichannel Returns',
      coverage: 'Size Discrepancy & Fit Dissatisfaction',
      icon: RefreshCcw,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
    },
    {
      name: 'Marketing Campaigns',
      source: 'fact_campaigns',
      records: '8 Regional/National Runs',
      format: 'Meta Ads & In-Store CRM',
      coverage: 'Ad Spend, Promo Discounts & Footfall Lifts',
      icon: Database,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      name: 'Customer Reviews Feed',
      source: 'fact_reviews',
      records: '1,240 Customer Reviews',
      format: 'E-com & Store Kiosk Feedback',
      coverage: '1-5 Stars, Sentiment & Size-Fit Complaints',
      icon: Star,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Data Lineage & Ingestion Sources Summary
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
              6-Month Multi-Source Horizon
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Unified data provenance powering SoleSight RCA Engine • Benchmark dataset: <code className="text-slate-700 font-semibold font-mono">SoleSight-Synthetic-Dataset-6mo.xlsx</code>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onOpenDataIntegration && (
            <button
              onClick={onOpenDataIntegration}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              title="Open Data Integration & Ingestion Hub"
            >
              <PlugZap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Data Integration</span>
            </button>
          )}

          <button
            onClick={onOpenDataGrid}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
            title="Switch to full interactive Data Grid tab"
          >
            <span>Open Full Data Grid</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Metric Counters Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Audits</div>
          <div className="text-lg font-black font-mono text-slate-900 mt-0.5">
            {totalRecords.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-3 h-3" />
            <span>100% Schema Validated</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Time Horizon</div>
          <div className="text-lg font-black font-mono text-slate-900 mt-0.5">
            Mar – Aug 2026
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-0.5">
            26-Week Longitudinal
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Network Scope</div>
          <div className="text-lg font-black font-mono text-slate-900 mt-0.5">
            8 Stores • 3 Regions
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-0.5">
            West, North, South
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live Telemetry</div>
          <div className="text-lg font-black font-mono text-slate-900 mt-0.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>10s Sync Cadence</span>
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-0.5">
            Sub-second POS Stream
          </div>
        </div>
      </div>

      {/* 6 Ingested Data Sources Grid */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-0.5">
          Ingested Primary Tables & Sources
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {dataSources.map((ds, idx) => {
            const Icon = ds.icon;
            return (
              <div
                key={idx}
                onClick={onOpenDataGrid}
                className="p-3 rounded-xl border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/70 transition-all cursor-pointer group flex items-start gap-3 shadow-2xs"
              >
                <div className={`p-2 rounded-lg border shrink-0 ${ds.color}`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition truncate">
                      {ds.name}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded shrink-0">
                      {ds.source}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono font-semibold text-slate-700">
                    {ds.records}
                  </div>

                  <div className="text-[10px] text-slate-400 truncate" title={ds.coverage}>
                    {ds.coverage}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
