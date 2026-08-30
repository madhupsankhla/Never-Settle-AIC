import React, { useState } from 'react';
import {
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShoppingBag,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { PREDEFINED_USERS, type UserAccount } from '../../types/authTypes';

interface LoginPageProps {
  onLoginSuccess: (user: UserAccount) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Please enter your username or email.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const cleanId = username.trim().toLowerCase();
      const matched = PREDEFINED_USERS.find(
        (u) =>
          (u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId) &&
          u.password === password
      );

      if (matched) {
        setIsLoading(false);
        onLoginSuccess(matched);
      } else {
        setIsLoading(false);
        setErrorMessage('Invalid username or password.');
      }
    }, 250);
  };

  const handleSelectPreset = (user: UserAccount) => {
    setActivePresetId(user.id);
    setUsername(user.username);
    setPassword(user.password);
    setErrorMessage('');
  };

  const handleQuickLogin = (user: UserAccount) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(user);
    }, 180);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 sm:px-6 font-sans text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-xs">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-1.5">
              <span>Sole</span>
              <span className="text-emerald-400">Sight</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Sign in to your retail workspace</p>
          </div>
        </div>

        {/* Minimal Login Card */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-5">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="e.g. rahul.sharma"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Minimal Quick-Select Roles */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-medium">Quick sign-in demo roles:</span>
              <span className="text-[10px] text-slate-500">1-click login</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {PREDEFINED_USERS.map((user) => {
                const isSelected = activePresetId === user.id || username === user.username;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleQuickLogin(user)}
                    onMouseEnter={() => handleSelectPreset(user)}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500/60 text-white'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg ${user.avatarBg} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}
                    >
                      {user.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-[11px] truncate leading-tight">
                        {user.name}
                      </div>
                      <div className="text-[9px] text-slate-400 truncate mt-0.5">
                        {user.position.split('(')[0].trim()}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="text-center text-[11px] text-slate-500 font-medium">
          SoleSight Retail Intelligence • Role-Based Access
        </div>
      </div>
    </div>
  );
};
