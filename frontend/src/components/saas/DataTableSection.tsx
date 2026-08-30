import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Activity,
  Pause,
  Play,
  FileSpreadsheet,
  Building2,
  ShoppingBag,
  Receipt,
  Package,
  Star,
  RefreshCcw,
  Calendar,
  PlugZap,
  Megaphone,
  MessageSquare,
} from 'lucide-react';
import {
  EXCEL_6MO_DATASET,
  getExcel6MoTabularRecords,
  type FactCampaignRecord,
  type FactReviewRecord,
  type DimStoreRecord,
  type DimProductRecord,
  type FactPosRecord,
  type FactInventoryRecord,
  type FactMysteryShopperRecord,
  type FactReturnsRecord,
} from '../../data/excelDataset';
import { DataIntegrationModal } from './DataIntegrationModal';
import type { TabularAuditRecord } from '../../types/retailRcaTypes';

interface DataTableSectionProps {
  onSelectRecord: (record: TabularAuditRecord) => void;
  regionFilter?: string;
  storeFilter?: string;
  searchFilter?: string;
  isStandaloneView?: boolean;
}

type ActiveSheetTab =
  | 'performance_audits'
  | 'dim_store'
  | 'dim_product'
  | 'fact_pos'
  | 'fact_inventory'
  | 'fact_mystery'
  | 'fact_returns'
  | 'fact_campaigns'
  | 'fact_reviews';

export const DataTableSection: React.FC<DataTableSectionProps> = ({
  onSelectRecord,
  regionFilter,
  storeFilter,
  searchFilter,
  isStandaloneView = false,
}) => {
  const [activeSheet, setActiveSheet] = useState<ActiveSheetTab>('performance_audits');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = isStandaloneView ? 10 : 8;

  // 6-Month Live Data Records State
  const [auditRecords, setAuditRecords] = useState<TabularAuditRecord[]>(() => getExcel6MoTabularRecords());
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [liveEventCount, setLiveEventCount] = useState(6380);
  const [recentlyUpdatedIds, setRecentlyUpdatedIds] = useState<Set<string>>(new Set());
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);

  // React to prop changes from canonical tree clicks
  useEffect(() => {
    if (regionFilter !== undefined) {
      setSelectedRegion(regionFilter);
    }
  }, [regionFilter]);

  useEffect(() => {
    if (searchFilter !== undefined) {
      setSearchTerm(searchFilter);
    }
  }, [searchFilter]);

  // Timed counter for "Updated Xs ago"
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastUpdated.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [lastUpdated]);

  // Timely live update simulation on the 6-month dataset
  const triggerDataUpdate = useCallback(() => {
    setAuditRecords((prev) => {
      const targetIndex = Math.floor(Math.random() * Math.min(prev.length, 30));
      const updatedIds = new Set<string>();

      const next = prev.map((rec, idx) => {
        if (idx === targetIndex || idx === (targetIndex + 5) % prev.length) {
          updatedIds.add(rec.id);
          const footfallDelta = Math.floor(Math.random() * 12) + 3;
          const newFootfall = rec.footfall + footfallDelta;
          const conversionDelta = Math.random() > 0.35 ? Math.floor(Math.random() * 4) + 1 : 0;
          const newConversions = rec.conversions + conversionDelta;
          const newRate = Number(((newConversions / newFootfall) * 100).toFixed(2));
          const sizeFillDelta = Number((Math.random() * 0.6 - 0.3).toFixed(1));
          const newSizeFill = Math.min(100, Math.max(45, Number((rec.sizeFillRatePct + sizeFillDelta).toFixed(1))));

          return {
            ...rec,
            footfall: newFootfall,
            conversions: newConversions,
            conversionRatePct: newRate,
            sizeFillRatePct: newSizeFill,
            tryOns: rec.tryOns + Math.floor(footfallDelta * 0.6),
          };
        }
        return rec;
      });

      setRecentlyUpdatedIds(updatedIds);
      setTimeout(() => setRecentlyUpdatedIds(new Set()), 2000);
      return next;
    });

    setLastUpdated(new Date());
    setSecondsAgo(0);
    setLiveEventCount((c) => c + 2);
  }, []);

  // Periodic interval for timely live data updates (every 10s)
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      triggerDataUpdate();
    }, 10000);

    return () => clearInterval(interval);
  }, [isLiveStreaming, triggerDataUpdate]);

  // Manual Refresh Button Click Handler
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    triggerDataUpdate();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Filter 6-Month Performance Audits with resilient keyword and store matching
  const filteredAuditRecords = useMemo(() => {
    return auditRecords.filter((r) => {
      let matchSearch = true;
      if (searchTerm && searchTerm.trim() !== '') {
        const terms = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
        const targetString = `${r.storeName} ${r.skuName} ${r.storeId} ${r.skuId} ${r.primaryRootCause} ${r.category}`.toLowerCase();
        matchSearch = terms.some((t) => targetString.includes(t));
      }

      const matchRegion =
        !selectedRegion || selectedRegion === 'All' || r.region.toLowerCase() === selectedRegion.toLowerCase();

      const matchStore =
        !storeFilter ||
        storeFilter === 'All' ||
        r.storeId.toLowerCase() === storeFilter.toLowerCase() ||
        r.storeName.toLowerCase().includes(storeFilter.toLowerCase());

      const matchMonth =
        selectedMonth === 'All' || r.period.includes(selectedMonth);

      const isAnomaly = r.conversionRatePct < 15.0;
      const matchStatus =
        selectedStatus === 'All' ||
        (selectedStatus === 'Anomalous' && isAnomaly) ||
        (selectedStatus === 'Normal' && !isAnomaly);

      return matchSearch && matchRegion && matchStore && matchMonth && matchStatus;
    });
  }, [auditRecords, searchTerm, selectedRegion, storeFilter, selectedMonth, selectedStatus]);

  // Filter Store Master Records
  const filteredStores = useMemo(() => {
    return (EXCEL_6MO_DATASET.dimStore || []).filter((s: DimStoreRecord) => {
      const matchSearch =
        s.store_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.format.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.mall_or_high_street.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRegion =
        selectedRegion === 'All' || s.region.toLowerCase() === selectedRegion.toLowerCase();
      return matchSearch && matchRegion;
    });
  }, [searchTerm, selectedRegion]);

  // Filter Product Catalog Records
  const filteredProducts = useMemo(() => {
    return (EXCEL_6MO_DATASET.dimProduct || []).filter((p: DimProductRecord) => {
      return (
        p.style_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm]);

  // Filter POS Transactions Sample
  const filteredPos = useMemo(() => {
    return (EXCEL_6MO_DATASET.factPosSample || []).filter((t: FactPosRecord) => {
      const matchSearch =
        t.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.sku_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.store_id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });
  }, [searchTerm]);

  // Filter Inventory Snapshots Sample
  const filteredInventory = useMemo(() => {
    return (EXCEL_6MO_DATASET.factInventorySample || []).filter((inv: FactInventoryRecord) => {
      const matchSearch =
        inv.store_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.sku_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.size.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });
  }, [searchTerm]);

  // Filter Mystery Audits
  const filteredMystery = useMemo(() => {
    return (EXCEL_6MO_DATASET.factMysteryShopper || []).filter((m: FactMysteryShopperRecord) => {
      return (
        m.audit_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.store_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.tags && m.tags.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
  }, [searchTerm]);

  // Filter Returns Sample
  const filteredReturns = useMemo(() => {
    return (EXCEL_6MO_DATASET.factReturnsSample || []).filter((ret: FactReturnsRecord) => {
      return (
        ret.return_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ret.sku_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ret.return_reason_code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm]);

  // Filter Marketing Campaigns (fact_campaigns)
  const filteredCampaigns = useMemo(() => {
    return (EXCEL_6MO_DATASET.factCampaigns || []).filter((c: FactCampaignRecord) => {
      const matchSearch =
        c.campaign_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.campaign_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.channel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.scope.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.region && c.region.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.store_id && c.store_id.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchRegion =
        selectedRegion === 'All' ||
        c.scope === 'national' ||
        (c.region && c.region.toLowerCase().includes(selectedRegion.toLowerCase())) ||
        (c.store_id && c.store_id.toLowerCase().includes(selectedRegion.toLowerCase()));

      const matchMonth =
        selectedMonth === 'All' ||
        c.start_date.startsWith(selectedMonth) ||
        c.end_date.startsWith(selectedMonth);

      return matchSearch && matchRegion && matchMonth;
    });
  }, [searchTerm, selectedRegion, selectedMonth]);

  // Filter Customer Reviews (fact_reviews)
  const filteredReviews = useMemo(() => {
    return (EXCEL_6MO_DATASET.factReviews || []).filter((rev: FactReviewRecord) => {
      const matchSearch =
        rev.review_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rev.store_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rev.sku_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rev.sentiment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rev.review_text && rev.review_text.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchRegion =
        selectedRegion === 'All' ||
        (selectedRegion === 'West' && ['STORE-001', 'STORE-005', 'STORE-006'].includes(rev.store_id)) ||
        (selectedRegion === 'North' && ['STORE-002', 'STORE-004'].includes(rev.store_id)) ||
        (selectedRegion === 'South' && ['STORE-003', 'STORE-007', 'STORE-008'].includes(rev.store_id));

      const matchMonth =
        selectedMonth === 'All' || rev.date.startsWith(selectedMonth);

      return matchSearch && matchRegion && matchMonth;
    });
  }, [searchTerm, selectedRegion, selectedMonth]);

  // Current records list and pagination
  const currentListLength =
    activeSheet === 'performance_audits'
      ? filteredAuditRecords.length
      : activeSheet === 'dim_store'
      ? filteredStores.length
      : activeSheet === 'dim_product'
      ? filteredProducts.length
      : activeSheet === 'fact_pos'
      ? filteredPos.length
      : activeSheet === 'fact_inventory'
      ? filteredInventory.length
      : activeSheet === 'fact_mystery'
      ? filteredMystery.length
      : activeSheet === 'fact_returns'
      ? filteredReturns.length
      : activeSheet === 'fact_campaigns'
      ? filteredCampaigns.length
      : filteredReviews.length;

  const totalPages = Math.ceil(currentListLength / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedAudits = filteredAuditRecords.slice(startIndex, endIndex);
  const paginatedStores = filteredStores.slice(startIndex, endIndex);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  const paginatedPos = filteredPos.slice(startIndex, endIndex);
  const paginatedInventory = filteredInventory.slice(startIndex, endIndex);
  const paginatedMystery = filteredMystery.slice(startIndex, endIndex);
  const paginatedReturns = filteredReturns.slice(startIndex, endIndex);
  const paginatedCampaigns = filteredCampaigns.slice(startIndex, endIndex);
  const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

  // CSV Export for active sheet
  const exportCsv = () => {
    let headers: string[] = [];
    let rows: any[][] = [];

    if (activeSheet === 'performance_audits') {
      headers = [
        'Record ID', 'Period', 'Store ID', 'Store Name', 'Region', 'Category',
        'SKU ID', 'SKU Name', 'Footfall', 'Conversions', 'Conversion Rate %',
        'Size Fill Rate %', 'Loss Gap (Lakhs)', 'Primary Root Cause'
      ];
      rows = filteredAuditRecords.map((r: TabularAuditRecord) => [
        r.id, r.period, r.storeId, `"${r.storeName}"`, r.region, r.category,
        r.skuId, `"${r.skuName}"`, r.footfall, r.conversions, r.conversionRatePct.toFixed(2),
        r.sizeFillRatePct.toFixed(1), r.lossEstimateLakhs.toFixed(2), `"${r.primaryRootCause}"`
      ]);
    } else if (activeSheet === 'dim_store') {
      headers = ['Store ID', 'Region', 'City Tier', 'Square Footage', 'Format', 'Location Type', 'Opening Date'];
      rows = filteredStores.map((s: DimStoreRecord) => [s.store_id, s.region, s.city_tier, s.square_footage, s.format, s.mall_or_high_street, s.opening_date]);
    } else if (activeSheet === 'dim_product') {
      headers = ['SKU ID', 'Style Name', 'Product Type', 'Category', 'Tier', 'List Price (INR)', 'Size Range', 'Launch Date'];
      rows = filteredProducts.map((p: DimProductRecord) => [p.sku_id, `"${p.style_name}"`, p.product_type, p.category, p.tier, p.list_price, p.size_range, p.launch_date]);
    } else if (activeSheet === 'fact_campaigns') {
      headers = ['Campaign ID', 'Campaign Name', 'Scope', 'Target Store / Region', 'SKUs Covered', 'Channel', 'Start Date', 'End Date', 'Discount Depth %', 'Spend Amount (INR)'];
      rows = filteredCampaigns.map((c: FactCampaignRecord) => [
        c.campaign_id, `"${c.campaign_name}"`, c.scope, c.store_id || c.region || 'National', `"${(c.sku_scope || ['All Catalog']).join(', ')}"`,
        c.channel, c.start_date, c.end_date, c.discount_depth_pct, c.spend_amount
      ]);
    } else if (activeSheet === 'fact_reviews') {
      headers = ['Review ID', 'Store ID', 'SKU ID', 'Date', 'Rating (1-5)', 'Sentiment', 'Fit Related Flag', 'Review Text'];
      rows = filteredReviews.map((rev: FactReviewRecord) => [
        rev.review_id, rev.store_id, rev.sku_id, rev.date, rev.rating, rev.sentiment, rev.fit_related_flag ? 'YES' : 'NO', `"${rev.review_text || ''}"`
      ]);
    }

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SoleSight_6Mo_Dataset_${activeSheet}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
      {/* 1. Live Telemetry Stream Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
        <div className="flex items-center gap-3">
          {/* Live Pulsing Dot */}
          <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
            <span className="relative flex h-2.5 w-2.5">
              {isLiveStreaming && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isLiveStreaming ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
              />
            </span>
            <span className="text-[11px] font-bold text-slate-800 tracking-tight">
              {isLiveStreaming ? '6-MONTH LIVE EXCEL STREAM' : 'STREAM PAUSED'}
            </span>
          </div>

          {/* Last Updated Ticker */}
          <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-slate-400" />
            <span>Updated {secondsAgo === 0 ? 'just now' : `${secondsAgo}s ago`}</span>
          </span>

          <span className="hidden sm:inline text-slate-300">|</span>

          {/* Dataset span tag */}
          <span className="hidden sm:inline text-xs text-slate-600 font-mono">
            <strong className="text-slate-900">{liveEventCount.toLocaleString()}</strong> 6-month records loaded (Mar 2026 – Aug 2026)
          </span>
        </div>

        {/* Live Controls: Integration Hub, Refresh Button & Auto-refresh Toggle */}
        <div className="flex items-center gap-2">
          {/* Data Integration Modal Trigger */}
          <button
            onClick={() => setIsIntegrationModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            title="Connect Google Sheets, Import Files, or Stream APIs"
          >
            <PlugZap className="w-3.5 h-3.5" />
            <span>Data Integration</span>
          </button>

          {/* Interactive Refresh Button with Rotating Icon */}
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100/90 text-slate-700 font-semibold border border-slate-200 text-xs flex items-center gap-1.5 transition-all shadow-2xs hover:border-slate-300 cursor-pointer disabled:opacity-50"
            title="Refresh dataset from Excel immediately"
          >
            <RotateCw
              className={`w-3.5 h-3.5 text-emerald-600 transition-transform ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            />
            <span>Refresh</span>
          </button>

          {/* Toggle Pause / Resume Live Stream */}
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-2xs ${
              isLiveStreaming
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/70'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
            title={isLiveStreaming ? 'Pause auto-sync' : 'Resume auto-sync'}
          >
            {isLiveStreaming ? (
              <Pause className="w-3.5 h-3.5 text-emerald-700" />
            ) : (
              <Play className="w-3.5 h-3.5 text-slate-700" />
            )}
          </button>
        </div>
      </div>

      {/* 2. Excel Sheet Tabs Switcher */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-semibold scrollbar-thin">
        <button
          onClick={() => {
            setActiveSheet('performance_audits');
            setCurrentPage(1);
          }}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSheet === 'performance_audits'
              ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-300 shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
          <span>6-Month Performance Audits ({filteredAuditRecords.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveSheet('dim_store');
            setCurrentPage(1);
          }}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSheet === 'dim_store'
              ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-300 shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-indigo-600" />
          <span>Store Master (dim_store)</span>
        </button>

        <button
          onClick={() => {
            setActiveSheet('dim_product');
            setCurrentPage(1);
          }}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSheet === 'dim_product'
              ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-300 shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5 text-cyan-600" />
          <span>Product Catalog (dim_product)</span>
        </button>

        <button
          onClick={() => {
            setActiveSheet('fact_pos');
            setCurrentPage(1);
          }}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSheet === 'fact_pos'
              ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-300 shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Receipt className="w-3.5 h-3.5 text-amber-600" />
          <span>POS Transactions (fact_pos)</span>
        </button>

        <button
          onClick={() => {
            setActiveSheet('fact_inventory');
            setCurrentPage(1);
          }}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSheet === 'fact_inventory'
              ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-300 shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-3.5 h-3.5 text-purple-600" />
          <span>Inventory & Stockouts</span>
        </button>

        <button
          onClick={() => {
            setActiveSheet('fact_mystery');
            setCurrentPage(1);
          }}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSheet === 'fact_mystery'
              ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-300 shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Star className="w-3.5 h-3.5 text-yellow-600" />
          <span>Mystery Audits</span>
        </button>

        <button
          onClick={() => {
            setActiveSheet('fact_returns');
            setCurrentPage(1);
          }}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSheet === 'fact_returns'
              ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-300 shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <RefreshCcw className="w-3.5 h-3.5 text-rose-600" />
          <span>Returns Log</span>
        </button>

        <button
          onClick={() => {
            setActiveSheet('fact_campaigns');
            setCurrentPage(1);
          }}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSheet === 'fact_campaigns'
              ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-300 shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5 text-indigo-600" />
          <span>Marketing Campaigns (fact_campaigns)</span>
        </button>

        <button
          onClick={() => {
            setActiveSheet('fact_reviews');
            setCurrentPage(1);
          }}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSheet === 'fact_reviews'
              ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-300 shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
          <span>Customer Reviews (fact_reviews)</span>
        </button>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>
              {activeSheet === 'performance_audits'
                ? '6-Month Store & SKU Performance Audit Grid'
                : activeSheet === 'dim_store'
                ? 'Store Master Registry (dim_store)'
                : activeSheet === 'dim_product'
                ? 'Master Footwear Catalog (dim_product)'
                : activeSheet === 'fact_pos'
                ? 'Live POS Transaction Stream (fact_pos)'
                : activeSheet === 'fact_inventory'
                ? 'Store Inventory Snapshots & Stockouts (fact_inventory)'
                : activeSheet === 'fact_mystery'
                ? 'Mystery Shopper Store Guidance Audits (fact_mystery)'
                : activeSheet === 'fact_campaigns'
                ? 'Marketing Campaigns & Ad Promotions (fact_campaigns)'
                : activeSheet === 'fact_reviews'
                ? 'Customer Reviews & Fit Sentiment Feed (fact_reviews)'
                : 'Customer Returns Log (fact_returns)'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
              {currentListLength} entries
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Source: <code className="font-mono text-slate-700">SoleSight-Synthetic-Dataset-6mo.xlsx</code> (Accenture Innovation Challenge)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search table..."
              className="bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none w-36 sm:w-44 transition-all"
            />
          </div>

          {/* Month Selector for 6 Months */}
          {activeSheet === 'performance_audits' && (
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs">
              <Calendar className="w-3 h-3 text-slate-400" />
              <select
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="All">All 6 Months (Mar–Aug)</option>
                <option value="2026-08">Aug 2026 (W31–W34)</option>
                <option value="2026-07">Jul 2026 (W27–W30)</option>
                <option value="2026-06">Jun 2026 (W22–W26 Anomaly)</option>
                <option value="2026-05">May 2026 (W18–W21)</option>
                <option value="2026-04">Apr 2026 (W14–W17)</option>
                <option value="2026-03">Mar 2026 (W09–W13)</option>
              </select>
            </div>
          )}

          {/* Region Filter */}
          {(activeSheet === 'performance_audits' || activeSheet === 'dim_store') && (
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="All">All Regions</option>
              <option value="West">West Region</option>
              <option value="North">North Region</option>
              <option value="South">South Region</option>
            </select>
          )}

          {/* Status Filter */}
          {activeSheet === 'performance_audits' && (
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Anomalous">Flagged Anomalies</option>
              <option value="Normal">Normal Baseline</option>
            </select>
          )}

          {/* Data Integration Hub Button */}
          <button
            onClick={() => setIsIntegrationModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            title="Integrate Google Sheets, ERPs, or upload datasets"
          >
            <PlugZap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Data Integration</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={exportCsv}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            title="Download CSV table export"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 4. Table Views */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 min-h-[300px]">
        {/* A. Performance Audits Table */}
        {activeSheet === 'performance_audits' && (
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Period</th>
                <th className="py-2.5 px-3">Store Location</th>
                <th className="py-2.5 px-3">SKU & Category</th>
                <th className="py-2.5 px-3">Footfall</th>
                <th className="py-2.5 px-3">Conversions</th>
                <th className="py-2.5 px-3">Conv. Rate</th>
                <th className="py-2.5 px-3">Size Fill %</th>
                <th className="py-2.5 px-3">Loss Gap</th>
                <th className="py-2.5 px-3">Primary Root Cause</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedAudits.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertTriangle className="w-6 h-6 text-amber-500" />
                      <span className="font-semibold text-slate-800">No records matching current filters</span>
                      <p className="text-xs text-slate-400 max-w-sm">
                        Filters for search "{searchTerm}" or region "{selectedRegion}" yielded 0 rows.
                      </p>
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedRegion('All');
                          setSelectedMonth('All');
                          setSelectedStatus('All');
                        }}
                        className="mt-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer shadow-2xs"
                      >
                        Reset Filters & Show All 6,380 Records
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedAudits.map((row) => {
                  const isAnomaly = row.conversionRatePct < 15.0;
                  const isRecentlyUpdated = recentlyUpdatedIds.has(row.id);

                  return (
                    <tr
                      key={row.id}
                      onClick={() => onSelectRecord(row)}
                      className={`transition-colors cursor-pointer group ${
                        isRecentlyUpdated ? 'bg-emerald-50/90' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-600 whitespace-nowrap">
                        {row.period}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {row.storeName}
                          </span>
                          {isRecentlyUpdated && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500 text-white animate-pulse">
                              SYNC
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {row.storeId} • {row.region}
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-slate-800">{row.skuName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {row.skuId} • {row.category}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">
                        {row.footfall.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">
                        {row.conversions.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold">
                        <span
                          className={
                            isAnomaly
                              ? 'text-rose-600'
                              : row.conversionRatePct < 17
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                          }
                        >
                          {row.conversionRatePct.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            row.sizeFillRatePct < 75
                              ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {row.sizeFillRatePct.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                        ₹{row.lossEstimateLakhs.toFixed(2)}L
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            isAnomaly
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {isAnomaly ? (
                            <AlertTriangle className="w-3 h-3 text-rose-500" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          )}
                          <span>{row.primaryRootCause}</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectRecord(row);
                          }}
                          className="p-1 rounded-md text-slate-400 hover:text-emerald-700 hover:bg-slate-100 transition cursor-pointer"
                          title="Inspect record details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}

        {/* B. Store Master (dim_store) Table */}
        {activeSheet === 'dim_store' && (
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Store ID</th>
                <th className="py-2.5 px-3">Region</th>
                <th className="py-2.5 px-3">City Tier</th>
                <th className="py-2.5 px-3">Format</th>
                <th className="py-2.5 px-3">Location Type</th>
                <th className="py-2.5 px-3">Square Footage</th>
                <th className="py-2.5 px-3">Opening Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStores.map((s: DimStoreRecord) => (
                <tr key={s.store_id} className="hover:bg-slate-50/80 transition-colors font-mono">
                  <td className="py-2.5 px-3 font-bold text-slate-900 font-sans">{s.store_id}</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-semibold">{s.region}</td>
                  <td className="py-2.5 px-3 text-slate-600">{s.city_tier}</td>
                  <td className="py-2.5 px-3 text-slate-800 font-sans">{s.format}</td>
                  <td className="py-2.5 px-3 text-slate-600 font-sans">{s.mall_or_high_street}</td>
                  <td className="py-2.5 px-3 text-slate-700">{s.square_footage.toLocaleString()} sq.ft</td>
                  <td className="py-2.5 px-3 text-slate-500">{s.opening_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* C. Product Catalog (dim_product) Table */}
        {activeSheet === 'dim_product' && (
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">SKU ID</th>
                <th className="py-2.5 px-3">Style Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Product Type</th>
                <th className="py-2.5 px-3">Tier</th>
                <th className="py-2.5 px-3">List Price</th>
                <th className="py-2.5 px-3">Size Range</th>
                <th className="py-2.5 px-3">Launch Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedProducts.map((p: DimProductRecord) => (
                <tr key={p.sku_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-700">{p.sku_id}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{p.style_name}</td>
                  <td className="py-2.5 px-3 text-slate-700">{p.category}</td>
                  <td className="py-2.5 px-3 text-slate-600">{p.product_type}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {p.tier}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">₹{p.list_price.toLocaleString()}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{p.size_range}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">{p.launch_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* D. POS Transactions (fact_pos) Table */}
        {activeSheet === 'fact_pos' && (
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Txn ID</th>
                <th className="py-2.5 px-3">Store ID</th>
                <th className="py-2.5 px-3">Date Time</th>
                <th className="py-2.5 px-3">SKU ID</th>
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Qty</th>
                <th className="py-2.5 px-3">Net Price</th>
                <th className="py-2.5 px-3">Payment</th>
                <th className="py-2.5 px-3">Forced Size Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {paginatedPos.map((t: FactPosRecord) => (
                <tr key={t.transaction_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-900">{t.transaction_id}</td>
                  <td className="py-2.5 px-3 text-indigo-600">{t.store_id}</td>
                  <td className="py-2.5 px-3 text-slate-500">{t.date_time}</td>
                  <td className="py-2.5 px-3 text-slate-800">{t.sku_id}</td>
                  <td className="py-2.5 px-3 font-bold text-amber-700">{t.size}</td>
                  <td className="py-2.5 px-3 text-slate-700">{t.qty}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">₹{t.net_price}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-600">{t.payment_method}</td>
                  <td className="py-2.5 px-3 font-sans">
                    {t.bought_nonpreferred_size_flag ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        Forced Compromise
                      </span>
                    ) : (
                      <span className="text-slate-400">Normal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* E. Inventory & Stockouts (fact_inventory) Table */}
        {activeSheet === 'fact_inventory' && (
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Snapshot Date</th>
                <th className="py-2.5 px-3">Store ID</th>
                <th className="py-2.5 px-3">SKU ID</th>
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">On Hand Units</th>
                <th className="py-2.5 px-3">Stockout Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {paginatedInventory.map((inv: FactInventoryRecord, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 text-slate-500">{inv.snapshot_date}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{inv.store_id}</td>
                  <td className="py-2.5 px-3 text-indigo-600">{inv.sku_id}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-800">{inv.size}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{inv.on_hand_units}</td>
                  <td className="py-2.5 px-3 font-sans">
                    {inv.is_stockout ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1 w-fit">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        <span>STOCKOUT DEFICIT</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit">
                        In Stock
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* F. Mystery Audits Table */}
        {activeSheet === 'fact_mystery' && (
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Audit ID</th>
                <th className="py-2.5 px-3">Store ID</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Overall Score</th>
                <th className="py-2.5 px-3">Sizing Guidance Score</th>
                <th className="py-2.5 px-3">Audit Tags & Observations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedMystery.map((m: FactMysteryShopperRecord) => (
                <tr key={m.audit_id} className="hover:bg-slate-50/80 transition-colors font-mono">
                  <td className="py-2.5 px-3 font-bold text-slate-900">{m.audit_id}</td>
                  <td className="py-2.5 px-3 text-indigo-600">{m.store_id}</td>
                  <td className="py-2.5 px-3 text-slate-500">{m.date}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{m.overall_score}/100</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-700">{m.sizing_guidance_score}/100</td>
                  <td className="py-2.5 px-3 font-sans text-slate-600">{m.tags || 'Standard protocol followed'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* G. Returns Table */}
        {activeSheet === 'fact_returns' && (
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Return ID</th>
                <th className="py-2.5 px-3">Store ID</th>
                <th className="py-2.5 px-3">SKU ID</th>
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Return Reason</th>
                <th className="py-2.5 px-3">Return Type</th>
                <th className="py-2.5 px-3">Days Since Purchase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {paginatedReturns.map((r: FactReturnsRecord) => (
                <tr key={r.return_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-900">{r.return_id}</td>
                  <td className="py-2.5 px-3 text-indigo-600">{r.store_id}</td>
                  <td className="py-2.5 px-3 text-slate-800">{r.sku_id}</td>
                  <td className="py-2.5 px-3 font-bold text-amber-700">{r.size}</td>
                  <td className="py-2.5 px-3 font-sans text-rose-700 font-medium">{r.return_reason_code}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-600">{r.return_type}</td>
                  <td className="py-2.5 px-3 text-slate-500">{r.days_since_purchase} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* H. Marketing Campaigns (fact_campaigns) Table */}
        {activeSheet === 'fact_campaigns' && (
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Campaign ID</th>
                <th className="py-2.5 px-3">Campaign Name</th>
                <th className="py-2.5 px-3">Scope & Geography</th>
                <th className="py-2.5 px-3">Channel</th>
                <th className="py-2.5 px-3">Active Window</th>
                <th className="py-2.5 px-3">Discount Depth</th>
                <th className="py-2.5 px-3">Ad Spend Amount</th>
                <th className="py-2.5 px-3">SKU Scope</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedCampaigns.map((c: FactCampaignRecord) => (
                <tr key={c.campaign_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{c.campaign_id}</td>
                  <td className="py-2.5 px-3 font-bold text-indigo-900">{c.campaign_name}</td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      c.scope === 'national'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : c.scope === 'region'
                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {c.scope}: {c.store_id || c.region || 'All India'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-700 capitalize font-medium">{c.channel}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                    {c.start_date} → {c.end_date}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-amber-600">
                    {c.discount_depth_pct > 0 ? `${c.discount_depth_pct}% off` : 'Full Price'}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                    ₹{c.spend_amount.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                    {(c.sku_scope || ['All Catalog']).join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* I. Customer Reviews (fact_reviews) Table */}
        {activeSheet === 'fact_reviews' && (
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Review ID</th>
                <th className="py-2.5 px-3">Store ID</th>
                <th className="py-2.5 px-3">SKU ID</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Rating</th>
                <th className="py-2.5 px-3">Sentiment</th>
                <th className="py-2.5 px-3">Fit/Sizing Flag</th>
                <th className="py-2.5 px-3">Customer Review Text</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedReviews.map((rev: FactReviewRecord) => (
                <tr key={rev.review_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{rev.review_id}</td>
                  <td className="py-2.5 px-3 font-mono text-indigo-600 font-bold">{rev.store_id}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-800">{rev.sku_id}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">{rev.date}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-amber-500">
                      {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      rev.sentiment === 'positive'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : rev.sentiment === 'negative'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {rev.sentiment}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-sans">
                    {rev.fit_related_flag ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        Size / Fit Issue
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">General</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-700 max-w-xs truncate" title={rev.review_text}>
                    {rev.review_text || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 5. Pagination Footer */}
      <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
        <div>
          Showing <span className="font-bold text-slate-900">{Math.min(currentListLength, startIndex + 1)}</span>–
          <span className="font-bold text-slate-900">{Math.min(currentListLength, endIndex)}</span> of{' '}
          <span className="font-bold text-slate-900">{currentListLength.toLocaleString()}</span> entries
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-md border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 font-mono font-semibold text-slate-700">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-md border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Data Integration Hub Modal */}
      <DataIntegrationModal
        isOpen={isIntegrationModalOpen}
        onClose={() => setIsIntegrationModalOpen(false)}
        onImportSuccess={(_sourceName, count) => {
          setLiveEventCount((c) => c + count);
        }}
      />
    </div>
  );
};
