import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  BookOpen,
  Phone,
  Mail,
  MessageSquare,
  Search,
  Sparkles,
  Clock,
  ChevronDown,
  ChevronRight,
  Headphones,
  Copy,
  CheckCircle2,
} from 'lucide-react';

interface HelpDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCopilot?: () => void;
}

interface SupportContact {
  department: string;
  role: string;
  email: string;
  phone: string;
  mobile: string;
  hours: string;
  badge: string;
}

const SUPPORT_CONTACTS: SupportContact[] = [
  {
    department: '24/7 Store Operations Helpdesk',
    role: 'Frontline store queries, sizing stockout alerts & POS sync issues',
    email: 'retail-ops@puma-solesight.in',
    phone: '+91 80 4567 8900',
    mobile: '+91 98860 12345',
    hours: '24/7 Live Support (All Shifts)',
    badge: 'Immediate Response',
  },
  {
    department: 'Central DC & Logistics Dispatch',
    role: 'Emergency 40-unit transfers, truck scheduling & Pune DC staging',
    email: 'dc-logistics@puma-solesight.in',
    phone: '+91 20 6789 4321',
    mobile: '+91 99234 56789',
    hours: 'Mon–Sun, 06:00 – 23:00 IST',
    badge: 'Warehouse Team',
  },
  {
    department: 'Causal Analytics & Data Science Support',
    role: 'Bayesian model questions, p-value thresholds, counterfactual math',
    email: 'analytics-help@solesight.ai',
    phone: '+91 80 2345 6789',
    mobile: '+91 98450 99887',
    hours: 'Mon–Sat, 09:00 – 20:00 IST',
    badge: 'AI Engineering',
  },
  {
    department: 'Executive Escalations & Technical Lead',
    role: 'SLA guarantees, system downtime & corporate account management',
    email: 'leadership-support@solesight.ai',
    phone: '+91 80 9876 5432',
    mobile: '+91 98111 22334',
    hours: 'Mon–Fri, 09:00 – 18:00 IST',
    badge: 'Priority Desk',
  },
];

const FAQS = [
  {
    question: 'How does SoleSight isolate size stockouts from ordinary footfall drops?',
    category: 'Causal Methodology',
    answer:
      'SoleSight uses Bayesian counterfactual decomposition and cross-store dose-response regressions (r=0.783, p=0.02). When foot traffic remains flat (+7% noise) while try-on conversion collapses specifically during zero-stock periods on UK 8 & 9, the causal engine attributes lost conversion to size shortages rather than macro footfall decline.',
  },
  {
    question: 'What happens when the system enters a Low-Confidence / Abstention state?',
    category: 'AI Decisions',
    answer:
      'If the evidence contains contradictory signals (e.g. 32% weather rainfall vs 28% competitor discounts vs 40% shift delays), attribution confidence drops below threshold (P < 0.50). The system abstains from prescribing costly capital transfers and recommends an on-site audit first.',
  },
  {
    question: 'How does switching my Operating Persona change the dashboard?',
    category: 'Personalization',
    answer:
      'Each persona receives views tailored to their day-to-day role: Store Managers see floor shoe sizes & shift runner actions; Regional Leads see multi-store benchmarks & DC transfers; CFOs see ₹-denominated revenue leakage & margin ROI; Marketing Officers see campaign footfall & trial conversion yield.',
  },
  {
    question: 'How do I train and calibrate the AI Copilot?',
    category: 'Active Learning',
    answer:
      'Whenever you view hypotheses in the AI Causal Hub, clicking Thumbs Up or Thumbs Down allows you to log ground-truth domain notes. The system stores these in the Active Learning Ledger and adjusts Bayesian hypothesis weights automatically.',
  },
];

export const HelpDocsModal: React.FC<HelpDocsModalProps> = ({
  isOpen,
  onClose,
  onOpenCopilot,
}) => {
  const [activeTab, setActiveTab] = useState<'contacts' | 'guide' | 'faqs'>('contacts');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(text);
    setTimeout(() => setCopiedEmail(null), 2500);
  };

  const filteredFaqs = FAQS.filter(
    (f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Help, Documentation & Support Center</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  24/7 Operations Desk
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Contact information, emergency dispatch hotlines, and platform documentation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Header Navigation Tabs */}
        <div className="flex items-center justify-between px-6 pt-3 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('contacts')}
              className={`pb-2.5 px-2 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'contacts'
                  ? 'border-emerald-600 text-emerald-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contact Directory & Support Hotlines</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`pb-2.5 px-2 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'guide'
                  ? 'border-emerald-600 text-emerald-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>User Quick-Start Guide</span>
            </button>

            <button
              onClick={() => setActiveTab('faqs')}
              className={`pb-2.5 px-2 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'faqs'
                  ? 'border-emerald-600 text-emerald-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Frequently Asked Questions</span>
            </button>
          </div>

          {/* Quick AI Assistant Button */}
          {onOpenCopilot && (
            <button
              onClick={() => {
                onClose();
                onOpenCopilot();
              }}
              className="mb-2 px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Ask AI Copilot Directly</span>
            </button>
          )}
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-5">
          {/* TAB 1: Support Hotlines & Email Contacts */}
          {activeTab === 'contacts' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-950">
                      Need immediate assistance with store stockouts or data clarifications?
                    </div>
                    <div className="text-[11px] text-emerald-800">
                      Our 24/7 Retail Operations team is available across Bangalore, Mumbai, and Pune hubs.
                    </div>
                  </div>
                </div>
                <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-emerald-800 border border-emerald-300 shadow-2xs font-mono">
                  SLA: &lt; 5 min response
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SUPPORT_CONTACTS.map((contact, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:border-slate-300 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900">{contact.department}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {contact.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">{contact.role}</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                      {/* Email */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-slate-600 font-mono text-[11px]">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <a
                            href={`mailto:${contact.email}`}
                            className="hover:text-emerald-700 underline font-medium"
                          >
                            {contact.email}
                          </a>
                        </div>
                        <button
                          onClick={() => handleCopy(contact.email)}
                          className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                          title="Copy Email"
                        >
                          {copiedEmail === contact.email ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Phone & Mobile */}
                      <div className="flex items-center justify-between text-[11px] text-slate-700">
                        <div className="flex items-center gap-1.5 font-mono">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <a href={`tel:${contact.phone}`} className="hover:underline font-bold">
                            {contact.phone}
                          </a>
                        </div>
                        <div className="font-mono text-slate-500">
                          Mob: <a href={`tel:${contact.mobile}`} className="hover:underline text-slate-800 font-semibold">{contact.mobile}</a>
                        </div>
                      </div>

                      {/* Hours */}
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{contact.hours}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: User Quick-Start Guide */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Platform Navigation Quick-Start</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                        1
                      </span>
                      <span>Explore AI Causal Narratives</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      The top banner generates human-readable explanations pinpointing specific shoe models and missing sizes.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                        2
                      </span>
                      <span>Switch Scenarios in Top Bar</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Test different scenarios (Hero Stockout, Low-Confidence Abstention, Normal Baseline) to see how the dashboard updates.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                        3
                      </span>
                      <span>Use Persona Lens</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Switch between Store Manager, Regional Ops, CFO, and Marketing Officer to see insights customized to your role.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                        4
                      </span>
                      <span>AI Copilot Assistance</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Click the top AI Copilot button anytime to ask questions about sales, stockouts, or retail terms in plain English.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                <h4 className="text-xs font-bold text-slate-900">Key Metric Definitions</h4>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div>
                    <strong className="text-slate-900 font-mono">Conversion Rate:</strong> Percentage of shoppers who entered the store and completed a footwear purchase at POS.
                  </div>
                  <div>
                    <strong className="text-slate-900 font-mono">Revenue at Risk:</strong> Estimated rupee loss attributable to out-of-stock hero sizes (e.g. ₹13.4 Lakhs on UK 8 & 9).
                  </div>
                  <div>
                    <strong className="text-slate-900 font-mono">Dose-Response (r):</strong> Statistical correlation between store stockout severity and conversion drop across all 8 stores.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Frequently Asked Questions (FAQ) */}
          {activeTab === 'faqs' && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search questions or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-2">
                {filteredFaqs.map((faq, idx) => {
                  const isExpanded = expandedFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 bg-white overflow-hidden transition shadow-2xs"
                    >
                      <button
                        onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                        className="w-full p-3.5 flex items-center justify-between text-left gap-3 hover:bg-slate-50 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                            {faq.category}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{faq.question}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-3.5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Puma Enterprise Retail Intelligence • SoleSight v2.4
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
