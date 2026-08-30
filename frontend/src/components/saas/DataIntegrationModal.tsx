import React, { useState } from 'react';
import {
  X,
  Database,
  FileSpreadsheet,
  Upload,
  Check,
  RotateCw,
  Link2,
  PlugZap,
  Radio,
  Server,
  Cloud,
  CheckCircle2,
  Copy,
  Layers,
  ShieldCheck,
} from 'lucide-react';

interface DataIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: (sourceName: string, rowCount: number) => void;
}

type IntegrationTab = 'google_sheets' | 'file_upload' | 'enterprise_pos' | 'api_webhook' | 'active_pipelines';

export const DataIntegrationModal: React.FC<DataIntegrationModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<IntegrationTab>('google_sheets');

  // Google Sheets Form State
  const [sheetUrl, setSheetUrl] = useState('https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit');
  const [sheetTabName, setSheetTabName] = useState('fact_pos');
  const [syncCadence, setSyncCadence] = useState('5min');
  const [isTestingGoogleSync, setIsTestingGoogleSync] = useState(false);
  const [googleSyncSuccess, setGoogleSyncSuccess] = useState(false);

  // File Upload State
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // API Webhook State
  const [isCopied, setIsCopied] = useState(false);
  const [isSimulatingEvent, setIsSimulatingEvent] = useState(false);
  const [simulatedEventsCount, setSimulatedEventsCount] = useState(0);

  if (!isOpen) return null;

  const handleTestGoogleSync = () => {
    setIsTestingGoogleSync(true);
    setGoogleSyncSuccess(false);
    setTimeout(() => {
      setIsTestingGoogleSync(false);
      setGoogleSyncSuccess(true);
      if (onImportSuccess) {
        onImportSuccess('Google Sheets (fact_pos)', 2480);
      }
    }, 900);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setUploadedFile(file);
    setIsParsingFile(true);
    setUploadSuccess(false);
    setTimeout(() => {
      setIsParsingFile(false);
      setUploadSuccess(true);
      if (onImportSuccess) {
        onImportSuccess(`Imported File: ${file.name}`, 1420);
      }
    }, 800);
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText('sk_live_solesight_98a72f01bc44e29d71a8e');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSimulateWebhook = () => {
    setIsSimulatingEvent(true);
    setTimeout(() => {
      setIsSimulatingEvent(false);
      setSimulatedEventsCount((c) => c + 1);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <PlugZap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Data Integration & Ingestion Hub
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Live Pipelines
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Connect external Google Sheets, upload files, or stream POS/WMS transaction feeds into SoleSight
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Integration Source Tabs */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-200 bg-slate-50/40 text-xs font-semibold overflow-x-auto scrollbar-thin">
          <button
            onClick={() => setActiveTab('google_sheets')}
            className={`px-3 py-2 rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap border-b-2 ${
              activeTab === 'google_sheets'
                ? 'border-emerald-600 text-emerald-800 bg-white font-bold shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Google Sheets Sync</span>
          </button>

          <button
            onClick={() => setActiveTab('file_upload')}
            className={`px-3 py-2 rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap border-b-2 ${
              activeTab === 'file_upload'
                ? 'border-emerald-600 text-emerald-800 bg-white font-bold shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            <span>Excel / CSV Import</span>
          </button>

          <button
            onClick={() => setActiveTab('enterprise_pos')}
            className={`px-3 py-2 rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap border-b-2 ${
              activeTab === 'enterprise_pos'
                ? 'border-emerald-600 text-emerald-800 bg-white font-bold shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-indigo-600" />
            <span>POS / ERP Adapters</span>
          </button>

          <button
            onClick={() => setActiveTab('api_webhook')}
            className={`px-3 py-2 rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap border-b-2 ${
              activeTab === 'api_webhook'
                ? 'border-emerald-600 text-emerald-800 bg-white font-bold shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-amber-600" />
            <span>REST Webhooks</span>
          </button>

          <button
            onClick={() => setActiveTab('active_pipelines')}
            className={`px-3 py-2 rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap border-b-2 ${
              activeTab === 'active_pipelines'
                ? 'border-emerald-600 text-emerald-800 bg-white font-bold shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cloud className="w-3.5 h-3.5 text-purple-600" />
            <span>Active Pipelines (4)</span>
          </button>
        </div>

        {/* Tab Content Canvas */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: Google Sheets Sync */}
          {activeTab === 'google_sheets' && (
            <div className="space-y-4 animate-in fade-in duration-150 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-emerald-950 text-xs">
                    Live Google Sheets Two-Way Telemetry Adapter
                  </div>
                  <p className="text-[11px] text-emerald-800/80 mt-0.5">
                    Connect store manager spreadsheets or cloud workbooks. Changes made in Google Sheets sync directly into SoleSight's OLAP engine.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Google Sheets Document URL or ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={sheetUrl}
                      onChange={(e) => setSheetUrl(e.target.value)}
                      placeholder="https://docs.google.com/spreadsheets/d/..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Target Worksheet / Tab Name
                    </label>
                    <select
                      value={sheetTabName}
                      onChange={(e) => setSheetTabName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:border-emerald-500 focus:outline-none cursor-pointer"
                    >
                      <option value="fact_pos">fact_pos (POS Transactions)</option>
                      <option value="fact_footfall">fact_footfall (Walk-in Counts)</option>
                      <option value="fact_inventory">fact_inventory (Stockout Snapshots)</option>
                      <option value="fact_mystery_shopper">fact_mystery_shopper (Audit Scores)</option>
                      <option value="fact_returns">fact_returns (Returns & Sizing)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Auto-Sync Frequency
                    </label>
                    <select
                      value={syncCadence}
                      onChange={(e) => setSyncCadence(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:border-emerald-500 focus:outline-none cursor-pointer"
                    >
                      <option value="realtime">Real-time Webhook (Instant on Edit)</option>
                      <option value="5min">Every 5 Minutes (Recommended)</option>
                      <option value="hourly">Hourly Automated Pull</option>
                      <option value="daily">Daily Midnight Batch (00:00 IST)</option>
                    </select>
                  </div>
                </div>

                {/* Status banner on success */}
                {googleSyncSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Successfully authenticated with Google Sheet • 2,480 rows synchronized</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">
                      HTTP 200 OK
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>OAuth2 Encrypted & Read-Safe</span>
                  </div>

                  <button
                    onClick={handleTestGoogleSync}
                    disabled={isTestingGoogleSync}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 transition shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isTestingGoogleSync ? 'animate-spin' : ''}`} />
                    <span>{isTestingGoogleSync ? 'Connecting...' : 'Connect & Sync Sheet'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: File Upload (CSV/Excel) */}
          {activeTab === 'file_upload' && (
            <div className="space-y-4 animate-in fade-in duration-150 text-xs">
              {/* Drag & Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleFileDrop}
                className={`p-8 border-2 border-dashed rounded-3xl text-center transition-all cursor-pointer ${
                  dragActive
                    ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]'
                    : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400'
                }`}
                onClick={() => document.getElementById('file-upload-input')?.click()}
              >
                <input
                  id="file-upload-input"
                  type="file"
                  accept=".xlsx,.xls,.csv,.parquet,.json"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="font-bold text-sm text-slate-800">
                  Drop your Excel or CSV dataset here
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Supports <strong>.xlsx</strong>, <strong>.csv</strong>, <strong>.parquet</strong>, and <strong>.json</strong> up to 100MB
                </p>
                <span className="inline-block mt-3 px-3 py-1 bg-white border border-slate-200 rounded-lg font-semibold text-slate-700 hover:border-slate-300 shadow-2xs">
                  Browse Local Files
                </span>
              </div>

              {/* Status on File Upload */}
              {isParsingFile && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-2">
                  <RotateCw className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span>Parsing schema and ingesting records from <strong>{uploadedFile?.name}</strong>...</span>
                </div>
              )}

              {uploadSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>File <strong>{uploadedFile?.name}</strong> validated • 1,420 rows registered into OLAP</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">
                    Ready
                  </span>
                </div>
              )}

              {/* Sample Template Download */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">Need the official SoleSight schema template?</div>
                  <div className="text-[11px] text-slate-400">Standard columns for Footfall, POS transactions, and Size inventory</div>
                </div>
                <button
                  onClick={() => alert('Downloaded SoleSight_Schema_Template.xlsx')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs transition cursor-pointer shadow-2xs"
                >
                  Download .XLSX Template
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Enterprise POS & ERP Adapters */}
          {activeTab === 'enterprise_pos' && (
            <div className="space-y-3 animate-in fade-in duration-150 text-xs">
              <p className="text-xs text-slate-500 font-medium">
                Direct enterprise connectors for automated real-time transaction streaming and master product catalog sync.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* SAP S/4HANA */}
                <div className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <Server className="w-4 h-4 text-blue-600" />
                      <span>SAP S/4HANA Retail & CAR</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Connected
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Daily inventory snapshots (`fact_inventory`) and store master records synced via SAP OData API.
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Sync: 02:00 IST Daily</span>
                    <span className="text-emerald-700 font-bold">24.2K items</span>
                  </div>
                </div>

                {/* Oracle Retail (Micros) */}
                <div className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-red-600" />
                      <span>Oracle Micros / Xstore POS</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active Stream
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Real-time POS checkout transactions (`fact_pos`) with forced non-preferred size flags.
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Sync: Sub-second Stream</span>
                    <span className="text-emerald-700 font-bold">97.9K txns</span>
                  </div>
                </div>

                {/* Shopify POS Plus */}
                <div className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-emerald-600" />
                      <span>Shopify POS & Omnichannel</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-600">
                      Standby
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Omnichannel click-and-collect orders and unified return reason telemetry (`fact_returns`).
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Sync: Webhook Push</span>
                    <span className="text-slate-600 font-bold">Configure →</span>
                  </div>
                </div>

                {/* Blue Yonder (JDA) WMS */}
                <div className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <Cloud className="w-4 h-4 text-indigo-600" />
                      <span>Blue Yonder WMS & RFID</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Hero size UK7–UK10 warehouse supply alerts and store DC replenishment transit schedules.
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Sync: 15 min poll</span>
                    <span className="text-emerald-700 font-bold">Connected</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REST Webhooks & API Ingestion */}
          {activeTab === 'api_webhook' && (
            <div className="space-y-4 animate-in fade-in duration-150 text-xs">
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">
                  Live POS Ingestion Webhook URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value="https://api.solesight.enterprise/v1/telemetry/pos/ingest"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-mono text-xs text-slate-800 select-all"
                  />
                  <button
                    onClick={handleCopyApiKey}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* cURL Example Code */}
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">
                  Sample Ingestion cURL Request
                </label>
                <pre className="p-3.5 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
{`curl -X POST https://api.solesight.enterprise/v1/telemetry/pos/ingest \\
  -H "Authorization: Bearer sk_live_solesight_98a72f01bc44e29d" \\
  -H "Content-Type: application/json" \\
  -d '{
    "store_id": "STORE-001",
    "sku_id": "FW-001",
    "size": "UK8",
    "net_price": 7999,
    "bought_nonpreferred_size_flag": false,
    "timestamp": "2026-08-29T14:30:00Z"
  }'`}
                </pre>
              </div>

              {/* Test Simulation Button */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">Simulate Live POS Stream Event</div>
                  <div className="text-[10px] text-slate-400">
                    Sends a mock transaction directly into the active telemetry queue ({simulatedEventsCount} fired)
                  </div>
                </div>
                <button
                  onClick={handleSimulateWebhook}
                  disabled={isSimulatingEvent}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RotateCw className={`w-3 h-3 ${isSimulatingEvent ? 'animate-spin' : ''}`} />
                  <span>Send Test Event</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: Active Pipelines Status */}
          {activeTab === 'active_pipelines' && (
            <div className="space-y-3 animate-in fade-in duration-150 text-xs">
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Pipeline Source</th>
                      <th className="py-2.5 px-3">Target Table</th>
                      <th className="py-2.5 px-3">Cadence</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Throughput</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900 flex items-center gap-1.5">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Google Sheets (Store Master)</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">dim_store</td>
                      <td className="py-2.5 px-3 text-slate-600">Hourly</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active Sync
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">8 stores</td>
                    </tr>

                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900 flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5 text-blue-600" />
                        <span>SAP S/4HANA CAR (Inventory)</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">fact_inventory_snapshot</td>
                      <td className="py-2.5 px-3 text-slate-600">Daily (02:00 IST)</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Healthy
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">24,288 rows</td>
                    </tr>

                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900 flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-red-600" />
                        <span>Oracle Micros POS (Transactions)</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">fact_transactions</td>
                      <td className="py-2.5 px-3 text-slate-600">Live Stream (10s)</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">
                          Streaming
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">97,980 rows</td>
                    </tr>

                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900 flex items-center gap-1.5">
                        <Cloud className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Synthetic 6-Month Dataset</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">excel_dataset_6mo</td>
                      <td className="py-2.5 px-3 text-slate-600">In-Memory DuckDB</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          Loaded
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">6,380 audits</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>SoleSight L1 Unified Data Ingestion Architecture</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
