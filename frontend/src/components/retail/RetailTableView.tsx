import React, { useState } from 'react';
import {
  Download,
  FileJson,
  Printer,
  Search,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
} from 'lucide-react';
import { generateRetailTabularRecords } from '../../data/retailMockData';

export const RetailTableView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const records = generateRetailTabularRecords();

  const filtered = records.filter(
    (r) =>
      r.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.storeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.skuName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.primaryRootCause.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExportCSV = () => {
    const headers = [
      'Record ID',
      'Period',
      'Store ID',
      'Store Name',
      'Region',
      'Product Category',
      'SKU ID',
      'SKU Style Name',
      'Footfall',
      'Try-Ons',
      'Conversions',
      'Conversion Rate %',
      'Size Fill Rate %',
      'Primary Diagnosed Root Cause',
      'Revenue (Lakhs)',
      'Est. Loss (Lakhs)',
    ];

    const rows = filtered.map((r) => [
      r.id,
      r.period,
      r.storeId,
      `"${r.storeName}"`,
      r.region,
      `"${r.category}"`,
      r.skuId,
      `"${r.skuName}"`,
      r.footfall,
      r.tryOns,
      r.conversions,
      r.conversionRatePct,
      r.sizeFillRatePct,
      `"${r.primaryRootCause}"`,
      r.revenueLakhs,
      r.lossEstimateLakhs,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'SoleSight_Retail_RCA_Audit_Log.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(filtered, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'SoleSight_Retail_RCA_Data.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-1.5 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Tabular Data & Audit Grid
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Store Footwear Performance Records ({filtered.length} rows)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search table..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors w-44 sm:w-56"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-indigo-600/20"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          <button
            onClick={handleExportJSON}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 border border-slate-700 transition-colors cursor-pointer"
            title="Download JSON"
          >
            <FileJson className="w-3.5 h-3.5 text-cyan-400" />
            JSON
          </button>

          <button
            onClick={() => window.print()}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 border border-slate-700 transition-colors cursor-pointer"
            title="Print Table"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Period</th>
              <th className="py-2.5 px-3">Store Location</th>
              <th className="py-2.5 px-3">SKU & Category</th>
              <th className="py-2.5 px-3 text-right">Footfall</th>
              <th className="py-2.5 px-3 text-right">Try-Ons</th>
              <th className="py-2.5 px-3 text-right">Conversion %</th>
              <th className="py-2.5 px-3 text-right">Size Fill %</th>
              <th className="py-2.5 px-3">Diagnosed Driver</th>
              <th className="py-2.5 px-3 text-right">Est. Loss</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
            {paginated.map((r) => (
              <tr key={r.id} className="hover:bg-slate-800/40 transition-colors font-sans">
                <td className="py-2 px-3 text-slate-400 font-mono text-xs">{r.period}</td>
                <td className="py-2 px-3 font-medium text-slate-200">
                  {r.storeId} ({r.storeName.split(' ')[0]})
                </td>
                <td className="py-2 px-3 text-slate-300">
                  <div className="font-semibold text-slate-100">{r.skuName}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{r.skuId} • {r.category}</div>
                </td>
                <td className="py-2 px-3 text-right font-mono text-slate-300">
                  {r.footfall.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-right font-mono text-slate-300">
                  {r.tryOns.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-right font-mono font-bold">
                  <span
                    className={
                      r.conversionRatePct < 14.0
                        ? 'text-rose-400'
                        : r.conversionRatePct < 17.0
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }
                  >
                    {r.conversionRatePct}%
                  </span>
                </td>
                <td className="py-2 px-3 text-right font-mono text-cyan-300">
                  {r.sizeFillRatePct}%
                </td>
                <td className="py-2 px-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      r.primaryRootCause.includes('Stockout')
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : r.primaryRootCause.includes('Queue')
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {r.primaryRootCause}
                  </span>
                </td>
                <td className="py-2 px-3 text-right font-mono font-bold text-rose-400">
                  ₹{r.lossEstimateLakhs}L
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <div>
          Showing page <strong className="text-white">{currentPage}</strong> of{' '}
          <strong className="text-white">{totalPages}</strong>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded bg-slate-950 border border-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded bg-slate-950 border border-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
