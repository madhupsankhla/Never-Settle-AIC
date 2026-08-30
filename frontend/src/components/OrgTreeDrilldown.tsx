import React from 'react';
import {
  Store,
  MapPin,
  Package,
  ShieldAlert,
  Lock,
  Building2
} from 'lucide-react';
import type { OrgHierarchy, PersonaType } from '../types';

interface OrgTreeDrilldownProps {
  orgData: OrgHierarchy | null;
  selectedStore: string;
  onSelectStore: (storeId: string, region: string) => void;
  selectedRegion: string;
  onSelectRegion: (reg: string) => void;
  currentPersona: PersonaType;
  accessDeniedError: string | null;
}

export const OrgTreeDrilldown: React.FC<OrgTreeDrilldownProps> = ({
  orgData,
  selectedStore,
  onSelectStore,
  selectedRegion,
  onSelectRegion,
  currentPersona,
  accessDeniedError,
}) => {
  if (!orgData) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-4 animate-pulse text-xs text-slate-400">
        Loading retail store hierarchy...
      </div>
    );
  }

  const isStoreManager = currentPersona === 'store_manager';
  const assignedStore = 'STORE-014';

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Store Hierarchy
          </h3>
        </div>
        <span className="text-[11px] font-medium text-slate-400">
          10 Active Stores
        </span>
      </div>

      {/* Access Denied Alert if RBAC triggered */}
      {accessDeniedError && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-rose-900">Access Denied (403)</div>
            <div className="text-[11px] text-rose-700 mt-0.5">{accessDeniedError}</div>
          </div>
        </div>
      )}

      {/* Regions & Stores list */}
      <div className="space-y-2.5">
        {Object.entries(orgData.regions).map(([regionName, stores]) => {
          const isRegionActive = selectedRegion === regionName;

          return (
            <div
              key={regionName}
              className={`rounded-lg border transition-all ${
                isRegionActive
                  ? 'bg-slate-50/70 border-slate-200'
                  : 'bg-white border-slate-200/60 hover:border-slate-300'
              }`}
            >
              {/* Region Bar */}
              <div
                onClick={() => onSelectRegion(regionName)}
                className="flex items-center justify-between p-2.5 cursor-pointer rounded-t-lg hover:bg-slate-100/50"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-800">
                    {regionName} Region
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {stores.length} units
                </span>
              </div>

              {/* Stores in Region */}
              <div className="p-2 pt-0 space-y-1">
                {stores.map((s) => {
                  const isSelected = selectedStore === s.store_id;
                  const isHeroTarget = s.store_id === 'STORE-014';
                  const isAbstainTarget = s.store_id === 'STORE-003';
                  const isRestrictedForSM = isStoreManager && s.store_id !== assignedStore;

                  return (
                    <button
                      key={s.store_id}
                      onClick={() => onSelectStore(s.store_id, regionName)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50 text-indigo-900 border border-indigo-200 font-semibold shadow-2xs'
                          : isRestrictedForSM
                          ? 'text-slate-400 hover:bg-rose-50/50 hover:text-rose-700'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Store className={`w-3 h-3 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <span>{s.store_id}</span>
                        <span className="text-[10px] text-slate-400">
                          ({s.format})
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isHeroTarget && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            Hero Target
                          </span>
                        )}
                        {isAbstainTarget && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                            Abstain Target
                          </span>
                        )}
                        {isRestrictedForSM && (
                          <span title="Server-side restricted for Store Manager">
                            <Lock className="w-3 h-3 text-slate-400" />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tracked Footwear Line Highlight */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5 mb-2 text-[11px] font-semibold text-slate-500">
          <Package className="w-3.5 h-3.5 text-indigo-600" />
          <span>Core Product Catalogue</span>
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/70">
            <span className="font-semibold text-slate-800">SKU-1042</span>
            <span className="text-slate-500 text-[11px]">AeroGlide Runner Pro (₹8,999)</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/70">
            <span className="font-semibold text-slate-800">SKU-1010</span>
            <span className="text-slate-500 text-[11px]">StreetCraft Classic (₹5,499)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
