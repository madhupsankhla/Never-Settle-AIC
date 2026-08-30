import React from 'react';
import {
  Sliders,
  Zap,
  Layers,
  Store,
  Compass,
  Briefcase,
  Sun,
  Moon,
} from 'lucide-react';
import type { PersonaType } from '../types';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentPersona: PersonaType;
  onSelectPersona: (p: PersonaType) => void;
  selectedScenario: string;
  onSelectScenario: (sc: string) => void;
  onOpenConstraints: () => void;
  onOpenTelemetry: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleDarkMode,
  currentPersona,
  onSelectPersona,
  selectedScenario,
  onSelectScenario,
  onOpenConstraints,
  onOpenTelemetry,
}) => {
  const personas: { id: PersonaType; label: string; roleDesc: string; icon: React.ReactNode }[] = [
    {
      id: 'store_manager',
      label: 'Store Manager',
      roleDesc: 'STORE-014 Operational Floor',
      icon: <Store className="w-3.5 h-3.5" />,
    },
    {
      id: 'regional_ops',
      label: 'Regional Ops',
      roleDesc: 'West Region Cross-Store',
      icon: <Compass className="w-3.5 h-3.5" />,
    },
    {
      id: 'cfo_finance',
      label: 'CFO / Finance',
      roleDesc: 'Network Aggregate / Financial Recovery',
      icon: <Briefcase className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <header
      className={`border-b sticky top-0 z-40 px-6 py-3 shadow-md backdrop-blur-md transition-colors ${
        isDarkMode
          ? 'bg-slate-950/95 border-slate-800 text-slate-100'
          : 'bg-white/95 border-slate-200/90 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center shadow-md text-white">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight flex items-center gap-1">
                Sole<span className="text-indigo-500">Sight</span>
              </h1>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-800 text-indigo-300'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                }`}
              >
                Retail RCA Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-normal">
              Deterministic Statistical Root Cause Analysis & Decision Intelligence
            </p>
          </div>
        </div>

        {/* Persona Switcher */}
        <div
          className={`flex items-center p-1 rounded-xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}
        >
          {personas.map((p) => {
            const active = currentPersona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPersona(p.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  active
                    ? isDarkMode
                      ? 'bg-slate-800 text-white shadow-sm font-semibold border border-slate-700'
                      : 'bg-white text-slate-900 shadow-sm border border-slate-200 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={p.roleDesc}
              >
                <span className={active ? 'text-indigo-400' : 'text-slate-500'}>
                  {p.icon}
                </span>
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Controls: Scenario, Constraints, Telemetry, Theme Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Scenario Selector */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <select
              value={selectedScenario}
              onChange={(e) => onSelectScenario(e.target.value)}
              className="bg-transparent text-xs text-slate-300 font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="hero">Scenario: STORE-014 Stockout</option>
              <option value="abstention">Scenario: STORE-003 Low-Conf</option>
              <option value="normal">Scenario: Normal Baseline</option>
            </select>
          </div>

          {/* Constraints Manager */}
          <button
            onClick={onOpenConstraints}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
              isDarkMode
                ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs'
            }`}
            title="Manage Operational Constraints"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span>Constraints</span>
          </button>

          {/* Telemetry Modal */}
          <button
            onClick={onOpenTelemetry}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
              isDarkMode
                ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs'
            }`}
            title="System Telemetry & Query Stats"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400 font-mono">Telemetry</span>
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-amber-300 hover:bg-slate-800'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
