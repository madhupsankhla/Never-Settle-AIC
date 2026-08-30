import React, { useState } from 'react';
import { X, ThumbsUp, ThumbsDown, CheckCircle2 } from 'lucide-react';
import type { PersonaType } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidenceId: string;
  driver: string;
  verdict: 'upvote' | 'downvote';
  userRole: PersonaType;
  onSubmitFeedback: (data: {
    evidence_id: string;
    hypothesis_driver: string;
    verdict: 'upvote' | 'downvote';
    correction_text?: string;
    user_role: string;
  }) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  evidenceId,
  driver,
  verdict,
  userRole,
  onSubmitFeedback,
}) => {
  const [correction, setCorrection] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitFeedback({
      evidence_id: evidenceId,
      hypothesis_driver: driver,
      verdict,
      correction_text: correction.trim() || undefined,
      user_role: userRole,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setCorrection('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            {verdict === 'upvote' ? (
              <ThumbsUp className="w-5 h-5 text-emerald-600" />
            ) : (
              <ThumbsDown className="w-5 h-5 text-rose-600" />
            )}
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {verdict === 'upvote' ? 'Confirm Attribution Accuracy' : 'Dispute Causal Attribution'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <div className="text-sm font-bold text-slate-900">Feedback Logged Successfully</div>
            <div className="text-xs text-slate-500">
              Queued for the offline driver weight calibration loop.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-xs text-slate-600">
              Logging feedback for driver:{' '}
              <span className="font-mono text-indigo-700 font-bold">{driver}</span> (Evidence ID: {evidenceId})
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1 font-medium">
                Optional Correction / Ground-Truth Context
              </label>
              <textarea
                rows={3}
                placeholder={
                  verdict === 'upvote'
                    ? 'e.g., Store staff confirmed replenishment delay caused sizing gap.'
                    : 'e.g., Stockout was brief, primary drag was foot-traffic sensor calibration.'
                }
                value={correction}
                onChange={(e) => setCorrection(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                verdict === 'upvote'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-xs'
              }`}
            >
              Submit to Feedback Repository
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
