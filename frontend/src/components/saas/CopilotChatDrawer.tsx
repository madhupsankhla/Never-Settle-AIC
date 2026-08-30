import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Bot,
  User,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Info,
} from 'lucide-react';
import {
  CopilotFeedbackService,
  type ChatMessageItem,
} from '../../services/copilotService';
import type { RetailFilterState } from '../../types/retailRcaTypes';

interface CopilotChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: RetailFilterState;
  onOpenCalibrationModal: () => void;
  userName?: string;
  userRole?: string;
}

const createInitialMessage = (name: string, storeId: string): ChatMessageItem => ({
  id: 'msg-1',
  role: 'assistant',
  content: `Hi **${name}**, I'm here from the Shor side team to help you out!

I've been looking over our store numbers and inventory trends. If you'd like to check what's happening at **${storeId || 'STORE-001'}**, look into stock shortages, or figure out why footfalls aren't converting into sales, just ask me anything.

How can I help you today?`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
});

const SUGGESTED_PROMPTS = [
  'Why did conversion drop 24% at STORE-001 this week?',
  'Show stockout status for FW-001 Marathon Pro across UK sizes',
  'What happens if we rebalance 40 units from Pune DC?',
  'How did analyst feedback adjust our confidence weights?',
];

const renderFormattedContent = (content: string, isUser: boolean) => {
  if (!content) return null;
  const lines = content.split('\n');
  return (
    <div className="space-y-1.5 font-sans leading-relaxed">
      {lines.map((line, lIdx) => {
        if (!line.trim()) {
          return <div key={lIdx} className="h-1.5" />;
        }
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        const renderedParts = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong
                key={pIdx}
                className={`font-bold ${isUser ? 'text-white' : 'text-slate-900 font-bold'}`}
              >
                {part.slice(2, -2)}
              </strong>
            );
          }
          return <React.Fragment key={pIdx}>{part}</React.Fragment>;
        });

        return <p key={lIdx} className="m-0">{renderedParts}</p>;
      })}
    </div>
  );
};

export const CopilotChatDrawer: React.FC<CopilotChatDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onOpenCalibrationModal,
  userName = 'Rahul Sharma',
  userRole = 'Store Operations Manager',
}) => {
  const [messages, setMessages] = useState<ChatMessageItem[]>(() => [
    createInitialMessage(userName, filters.selectedStoreId || 'STORE-001'),
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeCorrectionMsgId, setActiveCorrectionMsgId] = useState<string | null>(null);

  // Correction Form State
  const [selectedDriver, setSelectedDriver] = useState('Peak Hours Fitting Room Wait Friction');
  const [correctionReason, setCorrectionReason] = useState('');
  const [groundTruthDriver, setGroundTruthDriver] = useState('Core Size-Curve Stockout (UK 8 & 9)');
  const [weightDelta, setWeightDelta] = useState(-0.10);
  const [feedbackSuccessToast, setFeedbackSuccessToast] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length <= 1 && prev[0]?.id === 'msg-1') {
        return [createInitialMessage(userName, filters.selectedStoreId || 'STORE-001')];
      }
      return prev;
    });
  }, [userName, filters.selectedStoreId]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessageItem = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const chatHistory = [...messages, userMsg].map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

      const reply = await CopilotFeedbackService.sendChatMessage(chatHistory, {
        selectedStoreId: filters.selectedStoreId,
        selectedRegion: filters.selectedRegion,
        searchQuery: filters.searchQuery,
        userName,
        userRole,
      });

      const assistantMsg: ChatMessageItem = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: 'gpt-4o-mini',
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Feedback & Ground Truth Correction to Active Learning Engine
  const handleSubmitCorrection = (msgId: string) => {
    if (!correctionReason.trim()) return;

    const newFeedback = CopilotFeedbackService.submitFeedback({
      driver: selectedDriver,
      storeId: filters.selectedStoreId || 'STORE-001',
      skuId: filters.searchQuery || 'FW-001',
      verdict: 'CORRECTED',
      analystRole: 'Senior Operations Analyst',
      correctionReason,
      groundTruthDriver,
      adjustedWeightDelta: weightDelta,
    });

    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId
          ? {
              ...m,
              feedbackGiven: 'CORRECTED',
              feedbackNote: `Recalibrated: ${selectedDriver} (${weightDelta * 100}%)`,
              adjustedDriver: selectedDriver,
            }
          : m
      )
    );

    setActiveCorrectionMsgId(null);
    setCorrectionReason('');
    setFeedbackSuccessToast(`✓ Ground truth logged (${newFeedback.id}). Weight adjusted by ${weightDelta * 100}% for future queries.`);

    setTimeout(() => {
      setFeedbackSuccessToast(null);
    }, 4000);
  };

  // Quick Thumbs Up Confirmation
  const handleConfirmFinding = (msgId: string) => {
    CopilotFeedbackService.submitFeedback({
      driver: 'Core Size-Curve Stockout (UK 8 & 9)',
      storeId: filters.selectedStoreId || 'STORE-001',
      skuId: filters.searchQuery || 'FW-001',
      verdict: 'CONFIRMED',
      analystRole: 'Store Operations Manager',
      correctionReason: 'Analyst verified stockout finding with floor inventory audit.',
      groundTruthDriver: 'Core Size-Curve Stockout (UK 8 & 9)',
      adjustedWeightDelta: 0.05,
    });

    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, feedbackGiven: 'CONFIRMED' } : m))
    );

    setFeedbackSuccessToast('✓ Confirmed finding logged. Bayesian confidence score reinforced (+5%).');
    setTimeout(() => setFeedbackSuccessToast(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Top Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  SoleSight AI Copilot
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ChatGPT (gpt-4o-mini)
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Scope: <strong className="text-slate-700">{filters.selectedStoreId}</strong> ({filters.selectedRegion} Region)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenCalibrationModal}
              className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-500 hover:text-slate-800 transition cursor-pointer text-xs font-semibold flex items-center gap-1"
              title="Inspect Active Learning Ledger & Model Calibration"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline text-[11px]">Calibration</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-slate-200/70 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Learning Status Banner */}
        <div className="px-4 py-2 bg-emerald-50/70 border-b border-emerald-200/60 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-emerald-900 font-semibold">
            <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Active Learning Loop: Human feedback dynamically calibrates future weights</span>
          </div>
          <button
            onClick={onOpenCalibrationModal}
            className="text-emerald-700 hover:text-emerald-950 font-bold underline shrink-0 cursor-pointer"
          >
            View Ledger
          </button>
        </div>

        {/* Success Toast */}
        {feedbackSuccessToast && (
          <div className="m-3 p-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center gap-2 shadow-lg animate-in slide-in-from-top duration-150">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedbackSuccessToast}</span>
          </div>
        )}

        {/* Messages Canvas */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs space-y-2 leading-relaxed ${
                    isUser
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 border border-slate-200/80 text-slate-800'
                  }`}
                >
                  {/* Markdown formatted content */}
                  {renderFormattedContent(msg.content, isUser)}

                  <div className="flex items-center justify-between text-[10px] opacity-70 pt-1 border-t border-current/10 font-mono">
                    <span>{msg.timestamp}</span>
                    {msg.model && <span>{msg.model}</span>}
                  </div>

                  {/* Human Feedback Controls on Assistant Messages ("Mechanism to Learn") */}
                  {!isUser && (
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                        <Info className="w-3 h-3 text-slate-400" />
                        <span>Analyst Feedback:</span>
                      </span>

                      {msg.feedbackGiven ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{msg.feedbackNote || 'Logged to Active Learning Store'}</span>
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleConfirmFinding(msg.id)}
                            className="px-2 py-1 rounded-md bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                            title="Confirm this finding as accurate ground truth"
                          >
                            <ThumbsUp className="w-3 h-3 text-emerald-600" />
                            <span>Confirm</span>
                          </button>

                          <button
                            onClick={() =>
                              setActiveCorrectionMsgId(
                                activeCorrectionMsgId === msg.id ? null : msg.id
                              )
                            }
                            className="px-2 py-1 rounded-md bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-700 hover:text-rose-800 text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                            title="Submit correction to recalibrate AI model weights"
                          >
                            <ThumbsDown className="w-3 h-3 text-rose-500" />
                            <span>Correct & Recalibrate</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Inline Active Learning Correction Form */}
                  {!isUser && activeCorrectionMsgId === msg.id && (
                    <div className="mt-3 p-3 rounded-xl bg-white border border-rose-200 space-y-2.5 text-slate-900 shadow-sm animate-in zoom-in-95 duration-150">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900 border-b border-slate-100 pb-1.5">
                        <span className="flex items-center gap-1 text-rose-600">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Human-in-the-Loop Model Correction</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Structured Active Learning</span>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                          Target Hypothesis Driver to Recalibrate
                        </label>
                        <select
                          value={selectedDriver}
                          onChange={(e) => setSelectedDriver(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 font-medium"
                        >
                          <option value="Peak Hours Fitting Room Wait Friction">Peak Hours Fitting Room Wait Friction</option>
                          <option value="Competitor Promotional Price Undercut (-20%)">Competitor Promotional Price Undercut (-20%)</option>
                          <option value="Staff Shift Sizing Guidance Lag">Staff Shift Sizing Guidance Lag</option>
                          <option value="Core Size-Curve Stockout (UK 8 & 9)">Core Size-Curve Stockout (UK 8 & 9)</option>
                          <option value="Secondary POS Cash Counter Latency">Secondary POS Cash Counter Latency</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                          Actual Ground-Truth Driver
                        </label>
                        <select
                          value={groundTruthDriver}
                          onChange={(e) => setGroundTruthDriver(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 font-medium"
                        >
                          <option value="Core Size-Curve Stockout (UK 8 & 9)">Core Size-Curve Stockout (UK 8 & 9)</option>
                          <option value="Peak Hours Fitting Room Wait Friction">Peak Hours Fitting Room Wait Friction</option>
                          <option value="Staff Shift Sizing Guidance Lag">Staff Shift Sizing Guidance Lag</option>
                          <option value="Competitor Promotional Price Undercut (-20%)">Competitor Promotional Price Undercut (-20%)</option>
                          <option value="Secondary POS Cash Counter Latency">Secondary POS Cash Counter Latency</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                          Ground Truth Correction Reason
                        </label>
                        <textarea
                          rows={2}
                          value={correctionReason}
                          onChange={(e) => setCorrectionReason(e.target.value)}
                          placeholder="e.g. Disproven: Competitor discount was only on legacy sneakers, not Marathon Pro."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="flex items-center justify-between gap-3 text-[11px]">
                        <div className="flex-1">
                          <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                            Suggested Weight Delta ({weightDelta * 100 > 0 ? `+${weightDelta * 100}%` : `${weightDelta * 100}%`})
                          </label>
                          <input
                            type="range"
                            min="-0.20"
                            max="0.20"
                            step="0.02"
                            value={weightDelta}
                            onChange={(e) => setWeightDelta(parseFloat(e.target.value))}
                            className="w-full accent-rose-600 cursor-pointer"
                          />
                        </div>

                        <div className="flex items-center gap-1.5 pt-3">
                          <button
                            onClick={() => setActiveCorrectionMsgId(null)}
                            className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 text-[11px] font-semibold cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSubmitCorrection(msg.id)}
                            disabled={!correctionReason.trim()}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-[11px] font-bold shadow-xs cursor-pointer flex items-center gap-1"
                          >
                            <span>Save to Memory</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-slate-400 italic">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <span>SoleSight AI is reasoning across dataset & active learning rules...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/60 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-400 font-semibold shrink-0">Suggestions:</span>
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 font-medium shrink-0 transition text-[10px] cursor-pointer shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about stores, stockouts, or submit ground-truth..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition shadow-xs cursor-pointer shrink-0"
              title="Send Prompt"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
