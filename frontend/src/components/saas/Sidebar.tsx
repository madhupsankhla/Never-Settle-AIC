import React, { useState, useRef, useEffect } from 'react';
import {
  Layers,
  BarChart3,
  Table2,
  Sliders,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Store,
  Compass,
  Briefcase,
  Target,
  Check,
  ChevronUp,
  UserCheck,
  LogOut,
} from 'lucide-react';
import { useLocalization } from '../../context/LocalizationContext';
import type { PersonaType } from '../../types';

export type NavItemKey = 'overview' | 'analytics' | 'table_data' | 'rca_insights' | 'settings';

interface SidebarProps {
  activeTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  userRole: PersonaType;
  onSelectPersona?: (persona: PersonaType) => void;
  onOpenHelpDocs?: () => void;
  onOpenCausalThresholds?: () => void;
  onLogout?: () => void;
}

export interface PersonaProfile {
  id: PersonaType;
  name: string;
  roleTitle: string;
  shortRole: string;
  scope: string;
  avatarInitials: string;
  avatarBg: string;
  avatarText: string;
  avatarRing: string;
  badgeBg: string;
  badgeText: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const PERSONA_PROFILES: Record<PersonaType, PersonaProfile> = {
  store_manager: {
    id: 'store_manager',
    name: 'Rahul Sharma',
    roleTitle: 'Store Operations Manager',
    shortRole: 'Store Operator',
    scope: 'STORE-001 • Puma Flagship Indiranagar',
    avatarInitials: 'RS',
    avatarBg: 'bg-emerald-600',
    avatarText: 'text-white',
    avatarRing: 'ring-emerald-500/30',
    badgeBg: 'bg-emerald-50 border-emerald-200',
    badgeText: 'text-emerald-700',
    icon: Store,
    description: 'Store footfall, shoe size fill-rates, try-on audits & localized stockouts',
  },
  regional_ops: {
    id: 'regional_ops',
    name: 'Priya Nair',
    roleTitle: 'Head of Retail & Sales Ops',
    shortRole: 'Sales / Regional Ops',
    scope: 'West & South Regional Cluster (8 Stores)',
    avatarInitials: 'PN',
    avatarBg: 'bg-blue-600',
    avatarText: 'text-white',
    avatarRing: 'ring-blue-500/30',
    badgeBg: 'bg-blue-50 border-blue-200',
    badgeText: 'text-blue-700',
    icon: Compass,
    description: 'Multi-store conversion benchmarking, cross-region transfers & staff scheduling',
  },
  marketing_growth: {
    id: 'marketing_growth',
    name: 'Vikram Mehta',
    roleTitle: 'Chief Marketing & Growth Officer',
    shortRole: 'Marketing / Growth',
    scope: 'Brand Campaigns & Footfall Conversion',
    avatarInitials: 'VM',
    avatarBg: 'bg-amber-600',
    avatarText: 'text-white',
    avatarRing: 'ring-amber-500/30',
    badgeBg: 'bg-amber-50 border-amber-200',
    badgeText: 'text-amber-700',
    icon: Target,
    description: 'Campaign footfall traffic, customer trial conversion, reviews & marketing ROAS',
  },
  cfo_finance: {
    id: 'cfo_finance',
    name: 'Ananya Verma',
    roleTitle: 'Chief Financial Officer (CFO)',
    shortRole: 'CFO / Finance',
    scope: 'Enterprise Network • All BUs & Footwear Tiers',
    avatarInitials: 'AV',
    avatarBg: 'bg-indigo-600',
    avatarText: 'text-white',
    avatarRing: 'ring-indigo-500/30',
    badgeBg: 'bg-indigo-50 border-indigo-200',
    badgeText: 'text-indigo-700',
    icon: Briefcase,
    description: 'Top-line revenue loss, gross margins, capital allocation & SLA compliance',
  },
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  userRole,
  onSelectPersona,
  onOpenHelpDocs,
  onOpenCausalThresholds,
  onLogout,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { t } = useLocalization();
  const currentProfile = PERSONA_PROFILES[userRole] || PERSONA_PROFILES.store_manager;

  const mainNavItems = [
    { key: 'overview' as NavItemKey, label: t('overview', 'Overview'), icon: Layers, badge: null },
    { key: 'analytics' as NavItemKey, label: t('analytics', 'Trend & RCA'), icon: BarChart3, badge: 'Live' },
    { key: 'table_data' as NavItemKey, label: t('table_data', 'Data Grid'), icon: Table2, badge: '6-Mo' },
    { key: 'rca_insights' as NavItemKey, label: t('rca_insights', 'AI Causal Hub'), icon: Sparkles, badge: 'AI' },
  ];

  const secondaryNavItems = [
    { key: 'settings' as NavItemKey, label: t('constraints', 'Constraints'), icon: Sliders },
    { key: 'settings' as NavItemKey, label: t('settings', 'Settings'), icon: Settings },
  ];

  const handleSwitchPersona = (personaId: PersonaType) => {
    if (onSelectPersona) {
      onSelectPersona(personaId);
    }
    setIsProfileMenuOpen(false);
  };

  return (
    <aside
      className={`relative flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out select-none z-30 shrink-0 ${
        isCollapsed ? 'w-[72px]' : 'w-[240px]'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs shrink-0 font-bold text-sm tracking-tighter">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-slate-900 tracking-tight leading-tight truncate flex items-center gap-1">
                Sole<span className="text-emerald-600">Sight</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                Enterprise RCA
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="w-6 h-6 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer hidden md:flex"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {!isCollapsed && (
          <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Platform
          </div>
        )}
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelectTab(item.key)}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all group relative cursor-pointer ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
              {!isCollapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}
              {!isCollapsed && item.badge && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                    isActive
                      ? 'bg-emerald-200/60 text-emerald-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-4 pb-1">
          <div className="h-px bg-slate-100 mx-2" />
        </div>

        {!isCollapsed && (
          <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Configuration
          </div>
        )}

        {secondaryNavItems.map((item, idx) => {
          const Icon = item.icon;
          const isConstraints = idx === 0;
          const handleClick = () => {
            if (isConstraints && onOpenCausalThresholds) {
              onOpenCausalThresholds();
            } else {
              onSelectTab(item.key);
            }
          };

          return (
            <button
              key={idx}
              onClick={handleClick}
              className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors group cursor-pointer"
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-slate-600" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Help / Support Link */}
      <div className="p-2 border-t border-slate-100">
        <button
          onClick={onOpenHelpDocs}
          className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
          title="Documentation, Help & Support Directory"
        >
          <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
          {!isCollapsed && <span>Help & Docs</span>}
        </button>
      </div>

      {/* Interactive User Profile & Persona Switcher Window (Bottom-Left) */}
      <div className="relative p-2.5 border-t border-slate-200/80 bg-slate-50/70" ref={profileMenuRef}>
        {/* Floating Profile Switcher Popover */}
        {isProfileMenuOpen && (
          <div
            className={`absolute bottom-full mb-2 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 ${
              isCollapsed ? 'left-2 w-72' : 'left-2 right-2 w-[310px]'
            }`}
          >
            {/* Popover Header */}
            <div className="px-3.5 pb-2 mb-1.5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Switch Operating Profile</span>
                </span>
                <p className="text-[10px] text-slate-400">
                  Select a persona lens to reconfigure dashboard insights
                </p>
              </div>
            </div>

            {/* Profile Options */}
            <div className="px-2 space-y-1.5">
              {(Object.keys(PERSONA_PROFILES) as PersonaType[]).map((key) => {
                const p = PERSONA_PROFILES[key];
                const isSelected = userRole === key;
                const Icon = p.icon;

                return (
                  <button
                    key={p.id}
                    onClick={() => handleSwitchPersona(p.id)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400/30 shadow-2xs'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {/* Persona Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full ${p.avatarBg} ${p.avatarText} flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ring-2 ${p.avatarRing}`}
                    >
                      {p.avatarInitials}
                    </div>

                    {/* Persona Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs text-slate-900 truncate">
                          {p.name}
                        </div>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1 mt-0.5">
                        <Icon className="w-3 h-3 text-slate-500" />
                        <span className="truncate">{p.roleTitle}</span>
                      </div>

                      <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                        {p.description}
                      </div>

                      <div className="text-[9px] font-mono text-slate-400 mt-1 truncate">
                        Scope: {p.scope}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Hint & Logout footer */}
            <div className="mt-2 pt-2 px-3 border-t border-slate-100 space-y-1.5">
              <div className="text-[10px] text-slate-400 flex items-center justify-between font-medium">
                <span>Active: <strong className="text-slate-700">{currentProfile.shortRole}</strong></span>
                <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">RBAC Enforced</span>
              </div>

              {onLogout && (
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full mt-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-900 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out of SoleSight</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Profile Card Trigger Button */}
        <button
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className={`w-full flex items-center gap-2.5 p-1.5 rounded-xl border transition-all cursor-pointer text-left ${
            isProfileMenuOpen
              ? 'bg-white border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
              : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
          }`}
          title={isCollapsed ? `${currentProfile.name} (${currentProfile.roleTitle}) - Click to switch profile` : undefined}
        >
          {/* Avatar with Status Indicator */}
          <div className="relative shrink-0">
            <div
              className={`w-8 h-8 rounded-full ${currentProfile.avatarBg} ${currentProfile.avatarText} flex items-center justify-center font-bold text-xs shadow-2xs ring-2 ${currentProfile.avatarRing}`}
            >
              {currentProfile.avatarInitials}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>

          {/* Profile Name & Designation */}
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {currentProfile.name}
                </span>
                <ChevronUp
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    isProfileMenuOpen ? 'rotate-180 text-emerald-600' : ''
                  }`}
                />
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 truncate">
                {currentProfile.shortRole}
              </span>
              <span className="text-[9px] text-slate-400 truncate">
                Click to switch persona
              </span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
