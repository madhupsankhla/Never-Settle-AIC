import React, { useState } from 'react';
import { X, Plus, Trash2, Sliders } from 'lucide-react';
import type { KnownConstraint } from '../types';

interface ConstraintsModalProps {
  isOpen: boolean;
  onClose: () => void;
  constraints: KnownConstraint[];
  onAddConstraint: (c: KnownConstraint) => void;
  onDeleteConstraint: (id: string) => void;
}

export const ConstraintsModal: React.FC<ConstraintsModalProps> = ({
  isOpen,
  onClose,
  constraints,
  onAddConstraint,
  onDeleteConstraint,
}) => {
  const [description, setDescription] = useState('');
  const [constraintType, setConstraintType] = useState<
    'budget' | 'logistics_channel' | 'discount_cap' | 'lead_time_override'
  >('logistics_channel');
  const [region, setRegion] = useState('West');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onAddConstraint({
      description,
      constraint_type: constraintType,
      scope_region: region,
      effective_start: '2026-08-01',
      effective_end: '2026-08-31',
      active: true,
    });

    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Operational Constraints Manager
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          User-defined operational bounds automatically constrain the RCA Feasibility Layer (e.g. banning air freight during regional logistics cuts).
        </p>

        {/* Existing Constraints List */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {constraints.length === 0 ? (
            <div className="p-3 text-center text-xs text-slate-400 rounded-lg bg-slate-50 border border-slate-200/80">
              No active constraints registered.
            </div>
          ) : (
            constraints.map((c) => (
              <div
                key={c.id || c.description}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-900">{c.description}</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Type: {c.constraint_type} • Scope: {c.scope_region || 'Network'}
                  </div>
                </div>
                {c.id && (
                  <button
                    onClick={() => onDeleteConstraint(c.id!)}
                    className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-white transition cursor-pointer shadow-2xs"
                    title="Remove constraint"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Add Constraint Form */}
        <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-indigo-600" />
            <span>Add New Operational Constraint</span>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Description / Policy Statement
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Ban overnight air freight to Pune DC"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Type
              </label>
              <select
                value={constraintType}
                onChange={(e) => setConstraintType(e.target.value as any)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="logistics_channel">Logistics Channel</option>
                <option value="budget">Budget Cap</option>
                <option value="discount_cap">Discount Cap</option>
                <option value="lead_time_override">Lead Time Override</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Scope Region
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="West">West Region</option>
                <option value="North">North Region</option>
                <option value="South">South Region</option>
                <option value="Network">All Network</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Constraint</span>
            </button>
          </div>
        </form>

        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
