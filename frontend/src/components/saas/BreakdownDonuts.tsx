import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { NodeAnalyticsEngine } from '../../data/nodeAnalyticsEngine';
import { useLocalization } from '../../context/LocalizationContext';

interface BreakdownDonutsProps {
  onSelectCategory?: (cat: string) => void;
  onSelectRegion?: (region: string) => void;
  selectedRegion?: string;
  selectedStoreId?: string;
  selectedCategory?: string;
}

export const BreakdownDonuts: React.FC<BreakdownDonutsProps> = ({
  onSelectCategory,
  onSelectRegion,
  selectedRegion = 'All',
  selectedStoreId = 'All',
  selectedCategory = '',
}) => {
  const { t } = useLocalization();

  // Dynamically compute category distribution based on active scope
  const categoryData = useMemo(() => {
    return NodeAnalyticsEngine.getCategoryBreakdown(
      selectedStoreId,
      selectedRegion,
      selectedCategory
    );
  }, [selectedStoreId, selectedRegion, selectedCategory]);

  // Dynamically compute regional distribution based on active scope
  const regionData = useMemo(() => {
    return NodeAnalyticsEngine.getRegionalBreakdown(
      selectedStoreId,
      selectedRegion,
      selectedCategory
    );
  }, [selectedStoreId, selectedRegion, selectedCategory]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. By Product Category Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              {t('by_product_category', 'By Product Category')}
            </h4>
            <p className="text-[11px] text-slate-400">{t('share_of_volume', 'Share of Total Footwear Volume')}</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
            {selectedStoreId !== 'All' ? selectedStoreId : selectedRegion !== 'All' ? `${selectedRegion} Region` : 'Enterprise'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-[120px] h-[120px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={56}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cat-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Share']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '0.5rem',
                    fontSize: '11px',
                    color: '#ffffff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-2">
            {categoryData.map((item, idx) => {
              const isSelected = selectedCategory && item.name.toLowerCase().includes(selectedCategory.toLowerCase());
              return (
                <div
                  key={idx}
                  onClick={() => onSelectCategory && onSelectCategory(item.name)}
                  className={`flex items-center justify-between text-xs p-1.5 rounded-lg transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-300 ring-1 ring-emerald-400/20'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate group-hover:text-slate-900 transition-colors font-medium">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right shrink-0 font-mono">
                    <span className="font-bold text-slate-900">{item.value}%</span>
                    <span className="text-[10px] text-slate-400 block">{item.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. By Region Breakdown Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              {t('by_region_network', 'By Region Network')}
            </h4>
            <p className="text-[11px] text-slate-400">Regional Footwear Demand Split</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
            8 Stores Total
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-[120px] h-[120px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={56}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`reg-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Regional Share']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '0.5rem',
                    fontSize: '11px',
                    color: '#ffffff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-2">
            {regionData.map((item, idx) => {
              const isSelected = selectedRegion && item.name.toLowerCase().includes(selectedRegion.toLowerCase());
              return (
                <div
                  key={idx}
                  onClick={() => onSelectRegion && onSelectRegion(item.name)}
                  className={`flex items-center justify-between text-xs p-1.5 rounded-lg transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-300 ring-1 ring-emerald-400/20'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate group-hover:text-slate-900 transition-colors font-medium">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right shrink-0 font-mono">
                    <span className="font-bold text-slate-900">{item.value}%</span>
                    <span className="text-[10px] text-slate-400 block">{item.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
