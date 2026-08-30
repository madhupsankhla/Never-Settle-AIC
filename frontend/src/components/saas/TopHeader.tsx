import React, { useState, useRef, useEffect } from 'react';
import {
  Filter,
  Calendar,
  Bell,
  Sliders,
  Layers,
  Tv,
  Sparkles,
  X,
  CheckCircle2,
  CheckCheck,
  AlertTriangle,
  Info,
  ArrowRight,
} from 'lucide-react';
import type { PersonaType } from '../../types';
import { useLocalization } from '../../context/LocalizationContext';

export interface NotificationItem {
  id: string;
  type: 'critical' | 'learning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  storeId?: string;
  badge?: string;
}

export const PERSONA_NOTIFICATIONS: Record<PersonaType, NotificationItem[]> = {
  store_manager: [
    {
      id: 'notif-sm-1',
      type: 'critical',
      title: 'Immediate Rack Stockout: STORE-001 Indiranagar',
      message: 'FW-001 Marathon Pro is at 0 stock in core sizes UK 8 & 9 for 6 consecutive days. 4,440 customer try-on walkaways recorded.',
      timestamp: '5m ago',
      isRead: false,
      storeId: 'STORE-001',
      badge: 'Floor Alert',
    },
    {
      id: 'notif-sm-2',
      type: 'critical',
      title: 'Weekend Staffing & Runner Lag',
      message: 'Mystery shopper sizing assistance score dropped to 51.9/100 during Saturday rush. Shift runner reallocation recommended.',
      timestamp: '25m ago',
      isRead: false,
      storeId: 'STORE-001',
      badge: 'Staffing Audit',
    },
    {
      id: 'notif-sm-3',
      type: 'info',
      title: 'Footfall Surge: 14,240 Walk-ins',
      message: 'Campaign-driven walk-ins remain healthy (+3.9% lift). Ensure display shoe pairs are tied and tagged.',
      timestamp: '1h ago',
      isRead: false,
      storeId: 'STORE-001',
      badge: 'Traffic Inflow',
    },
    {
      id: 'notif-sm-4',
      type: 'success',
      title: 'Emergency DC Replenishment In Transit',
      message: 'Rebalance request for 40 units of UK 8/9 approved from Pune Central DC. Delivery expected Thursday 09:00 AM.',
      timestamp: '3h ago',
      isRead: true,
      storeId: 'STORE-001',
      badge: 'Stock Inbound',
    },
  ],
  regional_ops: [
    {
      id: 'notif-ro-1',
      type: 'critical',
      title: 'West Cluster Conversion Drag (-3.0pp Gap)',
      message: 'West Region conversion fell to 15.8% vs North Region benchmark of 18.8%. Revenue leakage concentrated in Mumbai and Pune flagships.',
      timestamp: '12m ago',
      isRead: false,
      storeId: 'STORE-001',
      badge: 'Cluster Benchmark',
    },
    {
      id: 'notif-ro-2',
      type: 'critical',
      title: 'Central DC Replenishment Lag (6-Day Delay)',
      message: 'Lead-time transit breach detected on supplier SUP-101. Order PO-9941 delayed by 6 days across West stores.',
      timestamp: '45m ago',
      isRead: false,
      storeId: 'STORE-005',
      badge: 'Supply Chain SLA',
    },
    {
      id: 'notif-ro-3',
      type: 'info',
      title: 'Inter-Branch Stock Transfer Feasibility',
      message: 'Pune Central DC has 140 surplus units of UK 8/9. Automated transfer proposal ready for Regional Director authorization.',
      timestamp: '2h ago',
      isRead: false,
      storeId: 'STORE-005',
      badge: 'Stock Rebalance',
    },
    {
      id: 'notif-ro-4',
      type: 'success',
      title: 'North Region SOP Audit Passed (91.0/100)',
      message: 'North Region flagship stores logged 0 stockouts with 94.0% size fill rate. Cross-regional SOP shared to West store managers.',
      timestamp: '5h ago',
      isRead: true,
      storeId: 'STORE-002',
      badge: 'Best Practice',
    },
  ],
  cfo_finance: [
    {
      id: 'notif-cfo-1',
      type: 'critical',
      title: '₹13.4L Top-Line Revenue Leakage at STORE-001',
      message: 'Severe conversion drop (-24.0%) on hero SKU FW-001 Marathon Pro created ₹13.4L direct revenue gap (₹54.2L portfolio total).',
      timestamp: '8m ago',
      isRead: false,
      storeId: 'STORE-001',
      badge: 'EBITDA Risk',
    },
    {
      id: 'notif-cfo-2',
      type: 'critical',
      title: 'Gross Margin Compression: -2.1pp Drag',
      message: 'Unmonetized store traffic eroded realized gross margin on high-margin performance running category (target 58% vs actual 55.9%).',
      timestamp: '30m ago',
      isRead: false,
      storeId: 'STORE-001',
      badge: 'Margin Analysis',
    },
    {
      id: 'notif-cfo-3',
      type: 'info',
      title: 'Capital Expenditure Authorization: ₹45,000',
      message: 'Emergency express freight cost of ₹45K approved to recover ₹13.4L top-line revenue, yielding 29.8x financial ROI.',
      timestamp: '1h ago',
      isRead: false,
      storeId: 'STORE-001',
      badge: 'CapEx & ROI',
    },
    {
      id: 'notif-cfo-4',
      type: 'success',
      title: 'Q3 Financial Working Capital Model Updated',
      message: 'Longitudinal reconciliation across 6-month POS transactions and returns ledger synced. Cash flow projections positive.',
      timestamp: '4h ago',
      isRead: true,
      badge: 'Financial Audit',
    },
  ],
  marketing_growth: [
    {
      id: 'notif-mg-1',
      type: 'critical',
      title: 'Campaign ROAS Degradation: 41.6% Try-On Drop',
      message: 'Nitro Running City Blitz generated +3.9% walk-in surge (14,240 visits), but purchase conversion collapsed due to rack stockouts on advertised sizes.',
      timestamp: '15m ago',
      isRead: false,
      storeId: 'STORE-001',
      badge: 'ROAS Leakage',
    },
    {
      id: 'notif-mg-2',
      type: 'critical',
      title: 'Customer Review Sentiment Alert (83% Fit Issues)',
      message: 'fact_reviews logged spike in negative ratings during June. Top complaint: "Neither UK 8 nor UK 9 available on display".',
      timestamp: '50m ago',
      isRead: false,
      storeId: 'STORE-001',
      badge: 'Customer Voice',
    },
    {
      id: 'notif-mg-3',
      type: 'info',
      title: 'Marketing Budget Allocation: ₹18.5L Active Spend',
      message: '32 marketing campaigns tracking on schedule across Social, Email, and In-Store channels with 15% promotional discount elasticity.',
      timestamp: '2h ago',
      isRead: false,
      badge: 'Campaign Media',
    },
    {
      id: 'notif-mg-4',
      type: 'success',
      title: 'Post-Restock Review Sentiment Rebound (4.7★)',
      message: 'August post-restock customer review sentiment recovered to 4.7/5 stars with positive remarks on size availability.',
      timestamp: '6h ago',
      isRead: true,
      storeId: 'STORE-001',
      badge: 'Brand Recovery',
    },
  ],
};

interface TopHeaderProps {
  breadcrumb: string;
  activePersona?: PersonaType;
  selectedScenario: string;
  onSelectScenario: (sc: string) => void;
  dateRangeLabel: string;
  onOpenDateRange: () => void;
  onOpenFilterPopover: () => void;
  onOpenConstraints: () => void;
  onOpenBoardroom: () => void;
  onOpenCopilot?: () => void;
  activeFilterCount: number;
  isOffline?: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  breadcrumb,
  activePersona = 'store_manager',
  selectedScenario,
  onSelectScenario,
  dateRangeLabel,
  onOpenDateRange,
  onOpenFilterPopover,
  onOpenConstraints,
  onOpenBoardroom,
  onOpenCopilot,
  activeFilterCount,
  isOffline = false,
}) => {
  const { t } = useLocalization();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    () => PERSONA_NOTIFICATIONS[activePersona] || PERSONA_NOTIFICATIONS.store_manager
  );
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'critical'>('all');
  const notifRef = useRef<HTMLDivElement>(null);

  // Sync notifications when activePersona changes
  useEffect(() => {
    setNotifications(PERSONA_NOTIFICATIONS[activePersona] || PERSONA_NOTIFICATIONS.store_manager);
  }, [activePersona]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === 'unread') return !n.isRead;
    if (filterType === 'critical') return n.type === 'critical';
    return true;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'learning':
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-teal-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getIconBg = (type: NotificationItem['type']) => {
    switch (type) {
      case 'critical':
        return 'bg-rose-50 border-rose-200';
      case 'learning':
        return 'bg-emerald-50 border-emerald-200';
      case 'success':
        return 'bg-teal-50 border-teal-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-4 sticky top-0 z-50 shadow-2xs">
      {/* Left: Breadcrumbs & Context */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <span>SoleSight</span>
          <span>/</span>
          <span className="text-slate-900 font-bold tracking-tight truncate">{t(breadcrumb, breadcrumb)}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Live AI Copilot Trigger Button */}
        {onOpenCopilot && (
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer group"
            title="Chat with SoleSight AI Copilot (Powered by ChatGPT gpt-4o-mini)"
          >
            <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
            <span>{t('copilot', 'AI Copilot')}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
          </button>
        )}

        {/* Date Period Indicator Button (Clickable Calendar) */}
        <button
          onClick={onOpenDateRange}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300 text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs group"
          title="Click to change reporting date range"
        >
          <Calendar className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
          <span>{dateRangeLabel}</span>
        </button>

        {/* Filter Popover Trigger Button */}
        <button
          onClick={onOpenFilterPopover}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
            activeFilterCount > 0
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-2xs'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
          title="Open Global Filters Popover"
        >
          <Filter className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t('filter', 'Filter')}</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Scenario Selector */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs">
          <Layers className="w-3.5 h-3.5 text-indigo-500" />
          <select
            value={selectedScenario}
            onChange={(e) => onSelectScenario(e.target.value)}
            className="bg-transparent text-xs text-slate-700 font-medium focus:outline-none cursor-pointer pr-1"
          >
            <option value="hero">Scenario: STORE-001 Stockout</option>
            <option value="abstention">Scenario: Contradictory Low-Conf</option>
            <option value="sparse">Scenario: SKU-9901 (Sparse History)</option>
            <option value="normal">Scenario: Normal Baseline</option>
          </select>
        </div>

        {/* Live / Offline Pre-Cached Indicator */}
        <div
          className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
            isOffline
              ? 'bg-amber-50 text-amber-800 border-amber-300'
              : 'bg-emerald-50 text-emerald-800 border-emerald-300'
          }`}
          title={
            isOffline
              ? 'Offline Demo Mode: Running 100% locally from cached 6-month DuckDB/Excel dataset'
              : 'Connected to Live Python / DuckDB / AI Causal Engine'
          }
        >
          <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
          <span>{isOffline ? 'Offline Demo Cache (6-Mo)' : 'Live Engine'}</span>
        </div>

        {/* Constraints Manager */}
        <button
          onClick={onOpenConstraints}
          className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition cursor-pointer shadow-2xs"
          title="Operational Constraints Manager"
        >
          <Sliders className="w-4 h-4 text-slate-500" />
        </button>

        {/* Interactive Notifications Bell & Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative p-2 rounded-lg border transition cursor-pointer shadow-2xs ${
              isNotifOpen
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            title="Notifications & Operational Alerts"
          >
            <Bell className="w-4 h-4 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Popover Dropdown */}
          {isNotifOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-[100] animate-in fade-in zoom-in-95 duration-150 overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-slate-900 tracking-tight">
                        Notifications & Alerts
                      </h3>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-500 text-white">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400">Live operational & causal telemetry feed</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[10px] text-emerald-700 hover:text-emerald-900 font-semibold px-2 py-1 rounded-md hover:bg-emerald-50 transition cursor-pointer flex items-center gap-1"
                      title="Mark all notifications as read"
                    >
                      <CheckCheck className="w-3 h-3" />
                      <span>Mark all read</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsNotifOpen(false)}
                    className="w-7 h-7 rounded-lg hover:bg-slate-200/70 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="px-4 py-2 border-b border-slate-100 bg-white flex items-center gap-1.5 text-[11px]">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                    filterType === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilterType('unread')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                    filterType === 'unread'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setFilterType('critical')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                    filterType === 'critical'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Critical ({notifications.filter((n) => n.type === 'critical').length})
                </button>
              </div>

              {/* Notifications List */}
              <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto opacity-60" />
                    <div className="text-xs font-bold text-slate-700">All caught up!</div>
                    <p className="text-[11px] text-slate-400">No notifications in this filter.</p>
                  </div>
                ) : (
                  filteredNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleToggleRead(notif.id)}
                      className={`p-3.5 transition-colors cursor-pointer flex gap-3 ${
                        notif.isRead ? 'bg-white hover:bg-slate-50' : 'bg-emerald-50/30 hover:bg-emerald-50/60'
                      }`}
                    >
                      {/* Icon */}
                      <div
                        className={`w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${getIconBg(
                          notif.type
                        )}`}
                      >
                        {getIcon(notif.type)}
                      </div>

                      {/* Body */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-xs font-bold text-slate-900 leading-snug">
                            {notif.title}
                          </span>
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          )}
                        </div>

                        <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                          {notif.message}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                          <span className="font-mono">{notif.timestamp}</span>
                          {notif.badge && (
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                notif.type === 'critical'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}
                            >
                              {notif.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px]">
                {onOpenCopilot ? (
                  <button
                    onClick={() => {
                      setIsNotifOpen(false);
                      onOpenCopilot();
                    }}
                    className="text-emerald-700 hover:text-emerald-950 font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ask Copilot to investigate</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ) : (
                  <span className="text-slate-400">SoleSight Active Intelligence</span>
                )}

                <button
                  onClick={() => setIsNotifOpen(false)}
                  className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Primary CTA: Present / Boardroom Modal */}
        <button
          onClick={onOpenBoardroom}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Tv className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Executive Brief</span>
        </button>
      </div>
    </header>
  );
};

