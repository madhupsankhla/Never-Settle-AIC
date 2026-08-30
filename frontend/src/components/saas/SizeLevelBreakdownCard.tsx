import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  Layers,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

interface SizeLevelData {
  size: string;
  onHandUnits: number;
  targetDemandUnits: number;
  fillRatePct: number;
  isStockout: boolean;
}

interface SizeLevelBreakdownCardProps {
  selectedStoreId?: string;
  selectedSku?: string;
  selectedScenario?: string;
}

export const SizeLevelBreakdownCard: React.FC<SizeLevelBreakdownCardProps> = ({
  selectedStoreId = 'STORE-001',
  selectedSku = 'FW-001',
  selectedScenario = 'hero',
}) => {
  const isHealthyStore = ['STORE-002', 'STORE-004', 'STORE-003', 'STORE-007'].includes(selectedStoreId);
  const skuLabel = selectedSku && selectedSku.trim() !== '' ? selectedSku : 'FW-001 Marathon Pro';

  // Dynamic size breakdown based on active store, SKU and scenario
  const sizeData: SizeLevelData[] = useMemo(() => {
    if (selectedScenario === 'normal' || isHealthyStore) {
      return [
        { size: 'UK 4', onHandUnits: 28, targetDemandUnits: 30, fillRatePct: 93.3, isStockout: false },
        { size: 'UK 5', onHandUnits: 44, targetDemandUnits: 45, fillRatePct: 97.7, isStockout: false },
        { size: 'UK 6', onHandUnits: 68, targetDemandUnits: 70, fillRatePct: 97.1, isStockout: false },
        { size: 'UK 7', onHandUnits: 74, targetDemandUnits: 75, fillRatePct: 98.6, isStockout: false },
        { size: 'UK 8', onHandUnits: 92, targetDemandUnits: 95, fillRatePct: 96.8, isStockout: false },
        { size: 'UK 9', onHandUnits: 88, targetDemandUnits: 90, fillRatePct: 97.7, isStockout: false },
        { size: 'UK 10', onHandUnits: 48, targetDemandUnits: 50, fillRatePct: 96.0, isStockout: false },
        { size: 'UK 11', onHandUnits: 24, targetDemandUnits: 25, fillRatePct: 96.0, isStockout: false },
        { size: 'UK 12', onHandUnits: 15, targetDemandUnits: 15, fillRatePct: 100.0, isStockout: false },
      ];
    }

    if (selectedScenario === 'abstention') {
      return [
        { size: 'UK 4', onHandUnits: 25, targetDemandUnits: 30, fillRatePct: 83.3, isStockout: false },
        { size: 'UK 5', onHandUnits: 38, targetDemandUnits: 45, fillRatePct: 84.4, isStockout: false },
        { size: 'UK 6', onHandUnits: 58, targetDemandUnits: 70, fillRatePct: 82.8, isStockout: false },
        { size: 'UK 7', onHandUnits: 62, targetDemandUnits: 75, fillRatePct: 82.6, isStockout: false },
        { size: 'UK 8', onHandUnits: 78, targetDemandUnits: 95, fillRatePct: 82.1, isStockout: false },
        { size: 'UK 9', onHandUnits: 75, targetDemandUnits: 90, fillRatePct: 83.3, isStockout: false },
        { size: 'UK 10', onHandUnits: 42, targetDemandUnits: 50, fillRatePct: 84.0, isStockout: false },
        { size: 'UK 11', onHandUnits: 21, targetDemandUnits: 25, fillRatePct: 84.0, isStockout: false },
        { size: 'UK 12', onHandUnits: 14, targetDemandUnits: 15, fillRatePct: 93.3, isStockout: false },
      ];
    }

    // Deficit stockout store (hero scenario on STORE-001)
    return [
      { size: 'UK 4', onHandUnits: 28, targetDemandUnits: 30, fillRatePct: 93.3, isStockout: false },
      { size: 'UK 5', onHandUnits: 42, targetDemandUnits: 45, fillRatePct: 93.3, isStockout: false },
      { size: 'UK 6', onHandUnits: 65, targetDemandUnits: 70, fillRatePct: 92.8, isStockout: false },
      { size: 'UK 7', onHandUnits: 58, targetDemandUnits: 75, fillRatePct: 77.3, isStockout: false },
      { size: 'UK 8', onHandUnits: 0, targetDemandUnits: 95, fillRatePct: 0.0, isStockout: true },
      { size: 'UK 9', onHandUnits: 0, targetDemandUnits: 90, fillRatePct: 0.0, isStockout: true },
      { size: 'UK 10', onHandUnits: 34, targetDemandUnits: 50, fillRatePct: 68.0, isStockout: false },
      { size: 'UK 11', onHandUnits: 22, targetDemandUnits: 25, fillRatePct: 88.0, isStockout: false },
      { size: 'UK 12', onHandUnits: 15, targetDemandUnits: 15, fillRatePct: 100.0, isStockout: false },
    ];
  }, [isHealthyStore, selectedScenario]);

  const hasStockout = sizeData.some((d) => d.isStockout);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              SKU Size-Curve Stock vs. Target Demand Distribution
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200 font-mono">
              {skuLabel} • {selectedStoreId}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Stock-on-Hand units vs. expected shopper demand curve across UK footwear sizes
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasStockout ? (
            <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>0 Units in UK 8 & 9 (185 Shopper Deficit)</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Healthy Size-Curve (96.8% Average Fill Rate)</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Bar Chart */}
      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sizeData} margin={{ top: 10, right: 20, bottom: 5, left: -5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="size" tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} label={{ value: 'Units', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data: SizeLevelData = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1 font-sans">
                      <div className="flex items-center justify-between gap-3 border-b border-slate-700 pb-1">
                        <span className="font-bold text-emerald-400">Size: {label}</span>
                        {data.isStockout ? (
                          <span className="px-1.5 py-0.2 rounded bg-rose-500/30 text-rose-300 text-[10px] font-bold">
                            CRITICAL STOCKOUT
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                            {data.fillRatePct}% Fill Rate
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-[11px] space-y-0.5 pt-0.5">
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">Current Stock:</span>
                          <strong className={data.onHandUnits === 0 ? 'text-rose-400 font-bold' : 'text-white'}>
                            {data.onHandUnits} units
                          </strong>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">Target Demand:</span>
                          <span className="text-slate-200">{data.targetDemandUnits} units</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
            />
            <ReferenceLine y={0} stroke="#94a3b8" />
            <Bar dataKey="onHandUnits" name="Stock-on-Hand (Actual)" fill="#059669" radius={[4, 4, 0, 0]} />
            <Bar dataKey="targetDemandUnits" name="Target Demand Curve" fill="#94a3b8" opacity={0.4} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
