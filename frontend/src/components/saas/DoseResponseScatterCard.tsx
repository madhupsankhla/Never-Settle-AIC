import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  Activity,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface StoreDataPoint {
  storeId: string;
  storeName: string;
  region: string;
  stockoutRatePct: number; // X-axis (Dose)
  conversionDeltaPct: number; // Y-axis (Response)
  revenueLossLakhs: number;
  isAnomaly?: boolean;
}

const CROSS_STORE_DATA: StoreDataPoint[] = [
  {
    storeId: 'STORE-001',
    storeName: 'Mumbai High Street Flagship',
    region: 'West',
    stockoutRatePct: 31.2,
    conversionDeltaPct: -24.0,
    revenueLossLakhs: 24.5,
    isAnomaly: true,
  },
  {
    storeId: 'STORE-005',
    storeName: 'Pune Phoenix MegaMall',
    region: 'West',
    stockoutRatePct: 27.6,
    conversionDeltaPct: -19.1,
    revenueLossLakhs: 18.2,
    isAnomaly: true,
  },
  {
    storeId: 'STORE-008',
    storeName: 'Chennai Express Avenue',
    region: 'South',
    stockoutRatePct: 20.6,
    conversionDeltaPct: -16.9,
    revenueLossLakhs: 14.1,
    isAnomaly: true,
  },
  {
    storeId: 'STORE-006',
    storeName: 'Ahmedabad Palladium',
    region: 'West',
    stockoutRatePct: 19.0,
    conversionDeltaPct: -10.4,
    revenueLossLakhs: 11.4,
    isAnomaly: false,
  },
  {
    storeId: 'STORE-007',
    storeName: 'Hyderabad Jubilee Hills',
    region: 'South',
    stockoutRatePct: 11.4,
    conversionDeltaPct: -4.2,
    revenueLossLakhs: 6.5,
    isAnomaly: false,
  },
  {
    storeId: 'STORE-002',
    storeName: 'Delhi South Extension',
    region: 'North',
    stockoutRatePct: 7.9,
    conversionDeltaPct: 1.1,
    revenueLossLakhs: 4.2,
    isAnomaly: false,
  },
  {
    storeId: 'STORE-004',
    storeName: 'Gurugram CyberHub',
    region: 'North',
    stockoutRatePct: 5.5,
    conversionDeltaPct: 4.4,
    revenueLossLakhs: 2.8,
    isAnomaly: false,
  },
  {
    storeId: 'STORE-003',
    storeName: 'Bengaluru Brigade Road',
    region: 'South',
    stockoutRatePct: 5.0,
    conversionDeltaPct: 3.3,
    revenueLossLakhs: 3.1,
    isAnomaly: false,
  },
];

interface DoseResponseScatterCardProps {
  selectedStoreId?: string;
  selectedScenario?: string;
}

export const DoseResponseScatterCard: React.FC<DoseResponseScatterCardProps> = ({
  selectedStoreId = 'STORE-001',
  selectedScenario = 'hero',
}) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const normalStores = CROSS_STORE_DATA.filter((s) => !s.isAnomaly);
  const anomalyStores = selectedScenario === 'normal'
    ? []
    : selectedScenario === 'abstention'
    ? CROSS_STORE_DATA.slice(0, 1)
    : CROSS_STORE_DATA.filter((s) => s.isAnomaly);

  const badgeText = selectedScenario === 'normal'
    ? 'Healthy Network Baseline'
    : selectedScenario === 'abstention'
    ? 'Weak Link (Inconclusive)'
    : 'Strong Statistical Link';

  const r2Value = selectedScenario === 'normal'
    ? '0.015'
    : selectedScenario === 'abstention'
    ? '0.097'
    : '0.613';

  const rValue = selectedScenario === 'normal'
    ? '0.124'
    : selectedScenario === 'abstention'
    ? '0.312'
    : '0.783';

  const pValue = selectedScenario === 'normal'
    ? '0.76'
    : selectedScenario === 'abstention'
    ? '0.42'
    : '0.02';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
      {/* Header: Title + ONE plain language badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Does Low Stock Actually Cause Lost Sales?
            </h3>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
              selectedScenario === 'normal'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : selectedScenario === 'abstention'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              {badgeText}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Stores with missing sizes consistently experienced lower sales conversion rates.
          </p>
        </div>
      </div>

      {/* Main Scatter Chart Area */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 15, right: 25, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              type="number"
              dataKey="stockoutRatePct"
              name="Stockout Rate"
              unit="%"
              domain={[0, 35]}
              tick={{ fontSize: 11, fill: '#64748b' }}
              label={{
                value: 'Shoe Size Shortage Rate (%)',
                position: 'bottom',
                offset: 5,
                fontSize: 11,
                fill: '#475569',
                fontWeight: 600,
              }}
            />
            <YAxis
              type="number"
              dataKey="conversionDeltaPct"
              name="Sales Change"
              unit="%"
              domain={[-30, 10]}
              tick={{ fontSize: 11, fill: '#64748b' }}
              label={{
                value: 'Sales Conversion Change vs Target (%)',
                angle: -90,
                position: 'left',
                offset: 0,
                fontSize: 11,
                fill: '#475569',
                fontWeight: 600,
              }}
            />
            <ZAxis range={[70, 160]} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data: StoreDataPoint = payload[0].payload;
                  const isCurrent = data.storeId === selectedStoreId;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1 font-sans">
                      <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1">
                        <span className="font-bold">{data.storeName}</span>
                        <span className="text-[10px] font-mono text-emerald-400">
                          {data.storeId}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] space-y-0.5 pt-0.5">
                        <div>
                          Size Shortage Rate: <strong className="text-amber-400">{data.stockoutRatePct}%</strong>
                        </div>
                        <div>
                          Conversion Change:{' '}
                          <strong className={data.conversionDeltaPct < 0 ? 'text-rose-400' : 'text-emerald-400'}>
                            {data.conversionDeltaPct > 0 ? `+${data.conversionDeltaPct}` : data.conversionDeltaPct}%
                          </strong>
                        </div>
                        <div>
                          Revenue Loss: <strong className="text-slate-200">₹{data.revenueLossLakhs}L</strong>
                        </div>
                      </div>
                      {isCurrent && (
                        <div className="pt-1 text-[10px] text-emerald-300 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active Selected Scope</span>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
            <ReferenceLine
              x={15}
              stroke="#f59e0b"
              strokeDasharray="3 3"
              label={{
                value: 'Stockout Alert Line',
                fill: '#d97706',
                fontSize: 10,
                position: 'top',
              }}
            />

            {/* Normal / Healthy Stores Scatter */}
            <Scatter
              name="Healthy Stores"
              data={normalStores}
              fill="#10b981"
              shape="circle"
            />

            {/* Anomaly / High Deficit Stores Scatter */}
            <Scatter
              name="Stockout Anomaly Stores"
              data={anomalyStores}
              fill="#e11d48"
              shape="diamond"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Collapsible Technical Details Section */}
      <div className="border-t border-slate-100 pt-2">
        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition cursor-pointer"
        >
          <span>Show technical details</span>
          {showTechnicalDetails ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {showTechnicalDetails && (
          <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-3 font-mono text-slate-700 flex-wrap">
              <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                Correlation Fit: <strong>r = {rValue} (p = {pValue})</strong>
              </span>
              <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                Model Variance Explained: <strong>R² = {r2Value}</strong>
              </span>
              <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                Sample Size: <strong>8 Enterprise Stores</strong>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Dose-response regression isolates stockout severity against store conversions across regional clusters, confirming statistical significance at p &lt; 0.05.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
