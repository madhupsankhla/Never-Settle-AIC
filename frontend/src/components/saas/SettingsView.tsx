import React, { useState, useEffect, useCallback } from 'react';
import {
  Sun,
  Moon,
  Monitor,
  Type,
  Maximize2,
  Volume2,
  VolumeX,
  Bell,
  Globe,
  Clock,
  Shield,
  Trash2,
  RotateCcw,
  Save,
  CheckCircle2,
  Eye,
  Sliders,
  Palette,
  Sparkles,
  Play,
  Languages,
} from 'lucide-react';
import { useLocalization } from '../../context/LocalizationContext';
import type { PersonaType } from '../../types';

interface SettingsViewProps {
  currentPersona?: PersonaType;
  onSelectPersona?: (persona: PersonaType) => void;
  selectedScenario?: string;
  onSelectScenario?: (scenario: string) => void;
}

export interface GeneralSettingsState {
  // Appearance / Modes
  themeMode: 'light' | 'dark' | 'system';
  accentColor: 'emerald' | 'indigo' | 'violet' | 'amber';
  highContrast: boolean;

  // Display Size & Density
  fontSizeScale: number; // 90, 100, 110, 125
  layoutDensity: 'compact' | 'standard' | 'relaxed';
  enableAnimations: boolean;
  compactSidebar: boolean;

  // Language & Regional
  language: string;
  currency: string;
  dateFormat: string;
  timeZone: string;

  // Notifications & Sound
  enableSoundEffects: boolean;
  pushNotifications: boolean;
  autoRefreshInterval: string; // 'off', '30s', '1m', '5m'
  emailSummary: 'daily' | 'weekly' | 'off';

  // Privacy & Session
  sessionTimeout: string;
}

const DEFAULT_GENERAL_SETTINGS: GeneralSettingsState = {
  themeMode: 'light',
  accentColor: 'emerald',
  highContrast: false,
  fontSizeScale: 100,
  layoutDensity: 'standard',
  enableAnimations: true,
  compactSidebar: false,
  language: 'en_IN',
  currency: 'INR',
  dateFormat: 'DD/MM/YYYY',
  timeZone: 'Asia/Kolkata',
  enableSoundEffects: true,
  pushNotifications: true,
  autoRefreshInterval: 'off',
  emailSummary: 'daily',
  sessionTimeout: '30m',
};

export const SettingsView: React.FC<SettingsViewProps> = () => {
  const {
    config: regionalConfig,
    setLanguage: updateContextLanguage,
    setCurrency: updateContextCurrency,
    setDateFormat: updateContextDateFormat,
    setTimeZone: updateContextTimeZone,
    t,
    formatCurrency,
    formatDate,
    formatLiveTime,
    currencySymbol,
  } = useLocalization();

  const [settings, setSettings] = useState<GeneralSettingsState>(() => {
    try {
      const saved = localStorage.getItem('solesight_general_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      ...DEFAULT_GENERAL_SETTINGS,
      language: regionalConfig.language,
      currency: regionalConfig.currency,
      dateFormat: regionalConfig.dateFormat,
      timeZone: regionalConfig.timeZone,
    };
  });

  const [activeTab, setActiveTab] = useState<'appearance' | 'display' | 'region' | 'notifications' | 'privacy'>('appearance');
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [cacheClearedToast, setCacheClearedToast] = useState(false);
  const [notifTestToast, setNotifTestToast] = useState(false);
  const [liveClock, setLiveClock] = useState(formatLiveTime());

  // Clock ticker for live timezone preview
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveClock(formatLiveTime());
    }, 1000);
    return () => clearInterval(timer);
  }, [formatLiveTime]);

  // Synthesize Web Audio chime for sound feedback
  const playSoundFeedback = useCallback((freq = 587.33, type: OscillatorType = 'sine', duration = 0.12) => {
    if (!settings.enableSoundEffects) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // ignore audio context restrictions
    }
  }, [settings.enableSoundEffects]);

  // 1. Apply Theme Mode (Dark / Light / System)
  useEffect(() => {
    const applyTheme = () => {
      const isDark =
        settings.themeMode === 'dark' ||
        (settings.themeMode === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.classList.toggle('dark', isDark);
    };

    applyTheme();

    if (settings.themeMode === 'system' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [settings.themeMode]);

  // 2. Apply Accent Color
  useEffect(() => {
    document.documentElement.dataset.accent = settings.accentColor;
  }, [settings.accentColor]);

  // 3. Apply High Contrast Mode
  useEffect(() => {
    document.documentElement.dataset.highContrast = String(settings.highContrast);
  }, [settings.highContrast]);

  // 4. Apply Font Size Scaling
  useEffect(() => {
    document.documentElement.style.fontSize = `${(settings.fontSizeScale / 100) * 16}px`;
  }, [settings.fontSizeScale]);

  // 5. Apply Layout Density
  useEffect(() => {
    document.documentElement.dataset.density = settings.layoutDensity;
  }, [settings.layoutDensity]);

  // 6. Apply Animations / Reduce Motion
  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', !settings.enableAnimations);
  }, [settings.enableAnimations]);

  // 7. Apply Language
  useEffect(() => {
    document.documentElement.lang = settings.language;
  }, [settings.language]);

  const handleSave = () => {
    try {
      localStorage.setItem('solesight_general_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
    playSoundFeedback(659.25, 'triangle', 0.2);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const handleReset = () => {
    setSettings(DEFAULT_GENERAL_SETTINGS);
    document.documentElement.style.fontSize = '16px';
    document.documentElement.classList.remove('dark');
    document.documentElement.dataset.accent = 'emerald';
    document.documentElement.dataset.density = 'standard';
    document.documentElement.dataset.highContrast = 'false';
    document.documentElement.classList.remove('reduce-motion');
    try {
      localStorage.setItem('solesight_general_settings', JSON.stringify(DEFAULT_GENERAL_SETTINGS));
    } catch (e) {
      console.error(e);
    }
    playSoundFeedback(440, 'sine', 0.15);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const handleClearCache = () => {
    try {
      localStorage.removeItem('solesight_cached_data');
      sessionStorage.clear();
    } catch {
      // ignore
    }
    playSoundFeedback(880, 'sine', 0.18);
    setCacheClearedToast(true);
    setTimeout(() => setCacheClearedToast(false), 3000);
  };

  const handleTestNotification = () => {
    playSoundFeedback(783.99, 'triangle', 0.25);
    setNotifTestToast(true);
    setTimeout(() => setNotifTestToast(false), 3500);

    if ('Notification' in window && settings.pushNotifications) {
      if (Notification.permission === 'granted') {
        new Notification('SoleSight Operational Alert', {
          body: 'Push notifications are active and connected.',
          icon: '/favicon.ico',
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs">
              <Sliders className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                General Settings & Preferences
              </h2>
              <p className="text-xs text-slate-400">
                Customize appearance, theme modes, display text size, regional formats, and notifications
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSavedToast && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Saved!</span>
            </div>
          )}

          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            title="Reset all settings to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => {
            playSoundFeedback(500);
            setActiveTab('appearance');
          }}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer shrink-0 ${
            activeTab === 'appearance'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Appearance & Modes</span>
        </button>

        <button
          onClick={() => {
            playSoundFeedback(500);
            setActiveTab('display');
          }}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer shrink-0 ${
            activeTab === 'display'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>Display Size & Layout</span>
        </button>

        <button
          onClick={() => {
            playSoundFeedback(500);
            setActiveTab('region');
          }}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer shrink-0 ${
            activeTab === 'region'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Language & Region</span>
        </button>

        <button
          onClick={() => {
            playSoundFeedback(500);
            setActiveTab('notifications');
          }}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer shrink-0 ${
            activeTab === 'notifications'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications & Sound</span>
        </button>

        <button
          onClick={() => {
            playSoundFeedback(500);
            setActiveTab('privacy');
          }}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer shrink-0 ${
            activeTab === 'privacy'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Privacy & Storage</span>
        </button>
      </div>

      {/* TAB 1: Appearance & Modes */}
      {activeTab === 'appearance' && (
        <div className="space-y-4">
          {/* Theme Mode */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Theme Mode</span>
              </h3>
              <p className="text-xs text-slate-400">
                Select your preferred interface color mode (Light, Dark, or System Sync)
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {[
                { id: 'light', label: 'Light Mode', icon: Sun, desc: 'Clean white canvas' },
                { id: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Midnight slate contrast' },
                { id: 'system', label: 'System Default', icon: Monitor, desc: 'Syncs with your OS theme' },
              ].map((theme) => {
                const isSelected = settings.themeMode === theme.id;
                const Icon = theme.icon;

                return (
                  <div
                    key={theme.id}
                    onClick={() => {
                      playSoundFeedback(600);
                      setSettings({ ...settings, themeMode: theme.id as any });
                    }}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-slate-500'}`} />
                        <span className="font-bold text-xs text-slate-900">{theme.label}</span>
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">{theme.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Accent Color Palette */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4 text-emerald-600" />
                <span>Accent Color Palette</span>
              </h3>
              <p className="text-xs text-slate-400">
                Choose primary highlight color across active buttons, badges, and charts
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              {[
                { id: 'emerald', label: 'Emerald Green', bg: 'bg-emerald-500', ring: 'ring-emerald-400' },
                { id: 'indigo', label: 'Ocean Indigo', bg: 'bg-indigo-600', ring: 'ring-indigo-400' },
                { id: 'violet', label: 'Royal Violet', bg: 'bg-purple-600', ring: 'ring-purple-400' },
                { id: 'amber', label: 'Sunset Amber', bg: 'bg-amber-500', ring: 'ring-amber-400' },
              ].map((color) => {
                const isSelected = settings.accentColor === color.id;
                return (
                  <div
                    key={color.id}
                    onClick={() => {
                      playSoundFeedback(650);
                      setSettings({ ...settings, accentColor: color.id as any });
                    }}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-slate-50 border-slate-400 ring-2 ring-slate-900/10'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full ${color.bg} shrink-0 shadow-xs`} />
                    <span className="font-bold text-xs text-slate-800">{color.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* High Contrast Mode */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-600" />
                <span>High Contrast Mode</span>
              </span>
              <p className="text-xs text-slate-400">
                Increases borders, text contrast, and outline clarity for enhanced visual accessibility
              </p>
            </div>

            <button
              onClick={() => {
                playSoundFeedback(550);
                setSettings({ ...settings, highContrast: !settings.highContrast });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.highContrast ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                  settings.highContrast ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Display Size & Layout */}
      {activeTab === 'display' && (
        <div className="space-y-4">
          {/* Display Text Size Slider */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Type className="w-4 h-4 text-emerald-600" />
                <span>Display Font & Element Size</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                {settings.fontSizeScale}%
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Scale all dashboard text, charts, cards, and buttons for comfortable reading
            </p>

            <div className="space-y-2 pt-1">
              <input
                type="range"
                min="90"
                max="125"
                step="5"
                value={settings.fontSizeScale}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    fontSizeScale: Number(e.target.value),
                  });
                }}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>Small (90%)</span>
                <span>Normal (100%)</span>
                <span>Large (110%)</span>
                <span>Extra Large (125%)</span>
              </div>
            </div>
          </div>

          {/* Layout Density */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-indigo-500" />
                <span>Layout Spacing Density</span>
              </h3>
              <p className="text-xs text-slate-400">
                Adjust vertical padding and spacing between dashboard widgets
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {[
                { id: 'compact', label: 'Compact Grid', desc: 'Maximum data on screen with tight padding' },
                { id: 'standard', label: 'Standard Balanced', desc: 'Default comfortable spacing' },
                { id: 'relaxed', label: 'Relaxed & Spacious', desc: 'Generous padding for presentation displays' },
              ].map((density) => {
                const isSelected = settings.layoutDensity === density.id;
                return (
                  <div
                    key={density.id}
                    onClick={() => {
                      playSoundFeedback(600);
                      setSettings({ ...settings, layoutDensity: density.id as any });
                    }}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-1.5 ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{density.label}</span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500">{density.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Smooth Screen Transitions & Animations */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Enable UI Animations & Transitions</span>
              </span>
              <p className="text-xs text-slate-400">
                Smooth fade-ins and chart hover effects (turn off for reduced motion)
              </p>
            </div>

            <button
              onClick={() => {
                playSoundFeedback(550);
                setSettings({ ...settings, enableAnimations: !settings.enableAnimations });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.enableAnimations ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                  settings.enableAnimations ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Language & Regional */}
      {activeTab === 'region' && (
        <div className="space-y-4">
          {/* Live Regional & Localization Interactive Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Languages className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Live Regional Configuration Preview
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Instant preview of translated terms, timezone clock, date format, and currency scales
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-600 text-[10px] font-mono font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active: {settings.language}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
              {/* Localized Greeting */}
              <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Greeting / स्वागतम्
                </span>
                <span className="text-xs font-bold text-white block truncate">
                  {t('greeting', 'Welcome back')}, Rahul Sharma
                </span>
              </div>

              {/* Localized Date Sample */}
              <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Formatted Date ({settings.dateFormat})
                </span>
                <span className="text-xs font-bold text-emerald-400 font-mono block">
                  {formatDate('2026-08-29')}
                </span>
              </div>

              {/* Live Timezone Clock */}
              <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Live Timezone Clock
                </span>
                <span className="text-xs font-bold text-amber-300 font-mono block">
                  {liveClock}
                </span>
              </div>

              {/* Converted Currency Scale */}
              <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Currency ({settings.currency})
                </span>
                <span className="text-xs font-bold text-indigo-300 font-mono block">
                  {formatCurrency(13.4)} Loss Gap
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Display Language */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>Display Language</span>
              </span>
              <p className="text-xs text-slate-400">
                Select primary language for navigation tabs, metric titles, and system alerts
              </p>

              <select
                value={settings.language}
                onChange={(e) => {
                  playSoundFeedback(550);
                  const lang = e.target.value as any;
                  setSettings((prev) => ({ ...prev, language: lang }));
                  updateContextLanguage(lang);
                }}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="en_IN">English (India) — Default</option>
                <option value="en_US">English (US)</option>
                <option value="hi_IN">Hindi (हिन्दी)</option>
                <option value="mr_IN">Marathi (मराठी)</option>
                <option value="kn_IN">Kannada (ಕನ್ನಡ)</option>
                <option value="zh_CN">Chinese (中文)</option>
                <option value="fr_FR">French (Français)</option>
                <option value="es_ES">Spanish (Español)</option>
                <option value="de_DE">German (Deutsch)</option>
              </select>
            </div>

            {/* Currency Unit */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span className="font-mono text-emerald-600 font-black">{currencySymbol}</span>
                <span>Currency & Number Formatting</span>
              </span>
              <p className="text-xs text-slate-400">
                Dynamic conversion for revenue, loss figures, and operational budgets
              </p>

              <select
                value={settings.currency}
                onChange={(e) => {
                  playSoundFeedback(550);
                  const curr = e.target.value as any;
                  setSettings((prev) => ({ ...prev, currency: curr }));
                  updateContextCurrency(curr);
                }}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="INR">Indian Rupee (₹ Lakhs & Crores)</option>
                <option value="USD">US Dollar ($ Millions / $ Thousands)</option>
                <option value="EUR">Euro (€ Millions / € Thousands)</option>
                <option value="GBP">British Pound (£ Millions / £ Thousands)</option>
              </select>
            </div>

            {/* Date Format */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span>Date Format</span>
              </span>
              <p className="text-xs text-slate-400">
                Reporting and time series calendar display format
              </p>

              <select
                value={settings.dateFormat}
                onChange={(e) => {
                  playSoundFeedback(550);
                  const fmt = e.target.value as any;
                  setSettings((prev) => ({ ...prev, dateFormat: fmt }));
                  updateContextDateFormat(fmt);
                }}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (29/08/2026)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (08/29/2026)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (2026-08-29)</option>
              </select>
            </div>

            {/* Time Zone */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-600" />
                <span>Time Zone</span>
              </span>
              <p className="text-xs text-slate-400">
                Sync snapshot timestamps and telemetry feeds with your operating region
              </p>

              <select
                value={settings.timeZone}
                onChange={(e) => {
                  playSoundFeedback(550);
                  const tz = e.target.value as any;
                  setSettings((prev) => ({ ...prev, timeZone: tz }));
                  updateContextTimeZone(tz);
                }}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="Asia/Kolkata">India Standard Time (IST UTC+05:30)</option>
                <option value="UTC">Coordinated Universal Time (UTC)</option>
                <option value="Europe/London">London (GMT / BST)</option>
                <option value="America/New_York">Eastern Time (US & Canada)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Notifications & Sound */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          {/* Push Notifications Toggle & Test Button */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600" />
                <span>Desktop Browser Push Notifications</span>
              </span>
              <p className="text-xs text-slate-400">
                Receive pop-up alerts when critical stockouts or conversion drops are detected
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleTestNotification}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-semibold text-slate-700 transition cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <Play className="w-3 h-3 text-emerald-600" />
                <span>Test Alert</span>
              </button>

              <button
                onClick={() => {
                  playSoundFeedback(550);
                  setSettings({ ...settings, pushNotifications: !settings.pushNotifications });
                }}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.pushNotifications ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                    settings.pushNotifications ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {notifTestToast && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
              <Bell className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>🔔 Test Notification: Critical alert dispatched to browser window!</span>
            </div>
          )}

          {/* Sound Effects Toggle & Test Button */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                {settings.enableSoundEffects ? (
                  <Volume2 className="w-4 h-4 text-indigo-600" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
                <span>In-App Audio Chimes & Sound Feedback</span>
              </span>
              <p className="text-xs text-slate-400">
                Play subtle audio feedback when alerts arrive, buttons click, or actions execute
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => playSoundFeedback(700, 'triangle', 0.2)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-semibold text-slate-700 transition cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <Volume2 className="w-3 h-3 text-indigo-600" />
                <span>Play Chime</span>
              </button>

              <button
                onClick={() => {
                  const next = !settings.enableSoundEffects;
                  setSettings({ ...settings, enableSoundEffects: next });
                  if (next) playSoundFeedback(600);
                }}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.enableSoundEffects ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                    settings.enableSoundEffects ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Auto Refresh Frequency */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Live Dashboard Auto-Refresh Cadence</span>
            </span>
            <p className="text-xs text-slate-400">
              Automatically sync metric cards and telemetry feeds on selected interval
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {[
                { id: 'off', label: 'Off (Manual)' },
                { id: '30s', label: 'Every 30 Seconds' },
                { id: '1m', label: 'Every 1 Minute' },
                { id: '5m', label: 'Every 5 Minutes' },
              ].map((cadence) => (
                <button
                  key={cadence.id}
                  onClick={() => {
                    playSoundFeedback(600);
                    setSettings({ ...settings, autoRefreshInterval: cadence.id });
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                    settings.autoRefreshInterval === cadence.id
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cadence.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Privacy & Storage */}
      {activeTab === 'privacy' && (
        <div className="space-y-4">
          {/* Session Auto Logout */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Inactivity Session Timeout</span>
            </span>
            <p className="text-xs text-slate-400">
              Automatically lock dashboard session after prolonged inactivity
            </p>

            <select
              value={settings.sessionTimeout}
              onChange={(e) => {
                playSoundFeedback(550);
                setSettings({ ...settings, sessionTimeout: e.target.value });
              }}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="15m">15 Minutes of inactivity</option>
              <option value="30m">30 Minutes (Default)</option>
              <option value="1h">1 Hour</option>
              <option value="never">Never (Keep session active)</option>
            </select>
          </div>

          {/* Local Cache Management */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Clear Browser Cache & Offline Storage</span>
              </span>
              <p className="text-xs text-slate-400">
                Purge locally cached telemetry records, filters, and temporary snapshots
              </p>
            </div>

            <div className="flex items-center gap-2">
              {cacheClearedToast && (
                <span className="text-xs text-emerald-700 font-bold animate-in fade-in">
                  Cache Cleared!
                </span>
              )}
              <button
                onClick={handleClearCache}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Cache</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
