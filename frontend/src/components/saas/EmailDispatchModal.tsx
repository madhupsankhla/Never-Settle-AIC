import React, { useState } from 'react';
import {
  X,
  Mail,
  Send,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  FileSpreadsheet,
  Link2,
  Users,
  ShieldCheck,
} from 'lucide-react';
import type { RetailFilterState, RetailExecutiveKpis } from '../../types/retailRcaTypes';

interface EmailDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: RetailFilterState;
  kpis: RetailExecutiveKpis;
  dateRangeLabel: string;
}

export const EmailDispatchModal: React.FC<EmailDispatchModalProps> = ({
  isOpen,
  onClose,
  filters,
  kpis,
  dateRangeLabel,
}) => {
  const [activeTab, setActiveTab] = useState<'send_now' | 'schedule'>('send_now');
  const [recipients, setRecipients] = useState<string[]>([
    'cfo@puma.com',
    'vp_operations@puma.com',
    'regional_director_west@puma.com',
    'store_lead_mumbai@puma.com',
  ]);
  const [newEmailInput, setNewEmailInput] = useState('');
  const [subject, setSubject] = useState(
    `[SoleSight Executive Brief] ${filters.selectedStoreId} Conversion Drift & +₹13.4L Size Recovery Plan`
  );
  const [executiveNote, setExecutiveNote] = useState(
    `Executive Summary for leadership review: Conversion at ${filters.selectedStoreId} dropped 24.0% this cycle due to core stockouts in sizes UK 8 & 9 on Marathon Pro (FW-001). Rebalancing 40 units from Pune DC will recover ₹13.4L.`
  );
  const [includePdf, setIncludePdf] = useState(true);
  const [includeExcel, setIncludeExcel] = useState(true);
  const [includeInteractiveLink, setIncludeInteractiveLink] = useState(true);

  // Scheduled Reporting State
  const [cadence, setCadence] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');
  const [deliveryTime, setDeliveryTime] = useState('09:00 IST');
  const [autoAlertThreshold, setAutoAlertThreshold] = useState(true);
  const [isSentToast, setIsSentToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddEmail = () => {
    if (newEmailInput.trim() && newEmailInput.includes('@') && !recipients.includes(newEmailInput.trim())) {
      setRecipients([...recipients, newEmailInput.trim()]);
      setNewEmailInput('');
    }
  };

  const handleRemoveEmail = (email: string) => {
    setRecipients(recipients.filter((r) => r !== email));
  };

  const handleSendNow = () => {
    setIsSentToast(`✓ Executive Summary successfully dispatched to ${recipients.length} leadership recipients.`);
    setTimeout(() => {
      setIsSentToast(null);
      onClose();
    }, 2500);
  };

  const handleSaveSchedule = () => {
    setIsSentToast(`✓ ${cadence} Executive Reporting Pipeline activated (${deliveryTime}).`);
    setTimeout(() => {
      setIsSentToast(null);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-2xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-slate-900">
                  Leadership Email Dispatch & Scheduled Reporting
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                  Meticulous Executive Brief
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Share meticulously synthesized RCA briefs, recovery targets, and evidence with designated leadership
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Toast */}
        {isSentToast && (
          <div className="p-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center gap-2 shadow-lg animate-in slide-in-from-top duration-150">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{isSentToast}</span>
          </div>
        )}

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-1 gap-1 text-xs font-semibold rounded-xl">
          <button
            onClick={() => setActiveTab('send_now')}
            className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'send_now'
                ? 'bg-white text-slate-900 shadow-2xs font-bold text-emerald-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Immediate Executive Brief</span>
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'schedule'
                ? 'bg-white text-slate-900 shadow-2xs font-bold text-emerald-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Automated Cadence Schedule</span>
          </button>
        </div>

        {/* TAB 1: Send Immediate Executive Brief */}
        {activeTab === 'send_now' && (
          <div className="space-y-4 animate-in fade-in duration-150 text-xs">
            {/* Leadership Recipients */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Designated Leadership Recipients ({recipients.length})</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">C-Suite, Regional Leads & Store Managers</span>
              </label>

              <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl min-h-[44px]">
                {recipients.map((email) => (
                  <span
                    key={email}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 font-mono text-[11px] shadow-2xs"
                  >
                    <span>{email}</span>
                    <button
                      onClick={() => handleRemoveEmail(email)}
                      className="text-slate-400 hover:text-rose-600 ml-0.5 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="email"
                  value={newEmailInput}
                  onChange={(e) => setNewEmailInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddEmail();
                    }
                  }}
                  placeholder="Add another leadership email address..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddEmail}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer border border-slate-200"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Email Subject Line</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-500 shadow-2xs"
              />
            </div>

            {/* Executive Note Textarea */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Executive Synthesis & Prescribed Action Note
              </label>
              <textarea
                rows={3}
                value={executiveNote}
                onChange={(e) => setExecutiveNote(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 leading-relaxed focus:outline-none focus:border-emerald-500 shadow-2xs"
              />
            </div>

            {/* Inclusions & Attachments */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Included Attachments & Verification Proofs
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-emerald-300">
                  <input
                    type="checkbox"
                    checked={includePdf}
                    onChange={(e) => setIncludePdf(e.target.checked)}
                    className="accent-emerald-600 rounded"
                  />
                  <FileText className="w-4 h-4 text-rose-500" />
                  <span className="font-semibold text-slate-800">PDF Leadership Brief</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-emerald-300">
                  <input
                    type="checkbox"
                    checked={includeExcel}
                    onChange={(e) => setIncludeExcel(e.target.checked)}
                    className="accent-emerald-600 rounded"
                  />
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-800">Excel Data Audit</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-emerald-300">
                  <input
                    type="checkbox"
                    checked={includeInteractiveLink}
                    onChange={(e) => setIncludeInteractiveLink(e.target.checked)}
                    className="accent-emerald-600 rounded"
                  />
                  <Link2 className="w-4 h-4 text-indigo-600" />
                  <span className="font-semibold text-slate-800">Live Dashboard Link</span>
                </label>
              </div>
            </div>

            {/* Meticulous Brief Snapshot Card */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                <span>Meticulous KPI Snapshot Included</span>
                <span className="font-mono text-emerald-800 font-bold">{dateRangeLabel}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                <div className="p-2 bg-white rounded-xl border border-emerald-200/80">
                  <div className="text-[10px] text-slate-400 font-bold">CONVERSION RATE</div>
                  <div className="font-mono font-black text-rose-600 text-sm">
                    {kpis.conversionRatePct.toFixed(1)}%
                  </div>
                  <div className="text-[9px] text-rose-700 font-semibold">-24.0% Drift</div>
                </div>
                <div className="p-2 bg-white rounded-xl border border-emerald-200/80">
                  <div className="text-[10px] text-slate-400 font-bold">LEAKAGE GAP</div>
                  <div className="font-mono font-black text-rose-600 text-sm">
                    -₹{kpis.revenueLossLakhs.toFixed(1)}L
                  </div>
                  <div className="text-[9px] text-slate-500">Gross Deficit</div>
                </div>
                <div className="p-2 bg-white rounded-xl border border-emerald-200/80">
                  <div className="text-[10px] text-slate-400 font-bold">RECOVERABLE</div>
                  <div className="font-mono font-black text-emerald-700 text-sm">
                    +₹{kpis.revenueRecoveryPotentialLakhs.toFixed(1)}L
                  </div>
                  <div className="text-[9px] text-emerald-800 font-semibold">UK 8/9 Rebalance</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Automated Cadence Schedule */}
        {activeTab === 'schedule' && (
          <div className="space-y-4 animate-in fade-in duration-150 text-xs">
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex items-start gap-2.5 text-indigo-950">
              <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Scheduled Executive Reporting Pipeline: </strong>
                Automatically compile and dispatch the meticulous executive RCA report to leadership and designated store managers on your chosen reporting frequency.
              </div>
            </div>

            {/* Cadence Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Dispatch Cadence Frequency</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Daily', 'Weekly', 'Monthly'] as const).map((cad) => (
                  <button
                    key={cad}
                    type="button"
                    onClick={() => setCadence(cad)}
                    className={`py-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      cadence === cad
                        ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/20 text-emerald-950 font-bold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-white text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{cad} Report</div>
                    <div className="text-[10px] text-slate-400 font-normal">
                      {cad === 'Daily' ? 'Every morning (08:30 IST)' : cad === 'Weekly' ? 'Every Monday (09:00 IST)' : '1st of every month'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Time & Threshold Triggers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Target Delivery Time</label>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium"
                >
                  <option value="08:30 IST">08:30 IST (Pre-Store Opening)</option>
                  <option value="09:00 IST">09:00 IST (Executive Standup)</option>
                  <option value="18:00 IST">18:00 IST (End-of-Day Wrap)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Anomaly Trigger Condition</label>
                <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <input
                    type="checkbox"
                    checked={autoAlertThreshold}
                    onChange={(e) => setAutoAlertThreshold(e.target.checked)}
                    className="accent-emerald-600 rounded"
                  />
                  <span className="text-[11px] text-slate-700 font-medium">
                    Priority alert if conversion drop &gt; 15%
                  </span>
                </div>
              </div>
            </div>

            {/* Pipeline Status */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-700 font-semibold">Status: Pipeline Configured & Active</span>
              </div>
              <span className="text-emerald-700 font-bold">Puma Executive Distribution</span>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>End-to-End Encrypted Leadership Channel</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>

            {activeTab === 'send_now' ? (
              <button
                onClick={handleSendNow}
                disabled={recipients.length === 0}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Executive Brief</span>
              </button>
            ) : (
              <button
                onClick={handleSaveSchedule}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Save Reporting Schedule</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
