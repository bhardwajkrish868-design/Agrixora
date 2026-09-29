import React, { useState } from 'react';
import { X, Lock, Mail, User, CheckCircle2 } from 'lucide-react';
import type { Language } from '../../types';
import { getTranslation } from '../../utils/i18n';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; role: string; location: string }) => void;
  currentLang: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentLang,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('entrepreneur@agrixora.in');
  const [name, setName] = useState('Rameshwar Kumar');
  const [role, setRole] = useState<'entrepreneur' | 'fpo_manager' | 'institutional_buyer' | 'bank_officer'>('entrepreneur');
  const [stateDistrict, setStateDistrict] = useState('Nashik, Maharashtra');

  if (!isOpen) return null;

  const t = getTranslation(currentLang);

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const roleLabels = {
      entrepreneur: 'Rural Entrepreneur / Beneficiary',
      fpo_manager: 'FPO / SHG Federation Leader',
      institutional_buyer: 'Institutional Off-taker',
      bank_officer: 'Lead District Bank Officer'
    };

    onLoginSuccess({
      name: name || 'Rameshwar Kumar',
      role: roleLabels[role] || 'Rural Entrepreneur',
      location: stateDistrict,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full overflow-hidden transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-100 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm text-2xl">
              🌾
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {mode === 'login' ? 'AgriXora Enterprise Sign In' : 'Join AgriXora Network'}
              </h2>
              <p className="text-emerald-100 text-xs">
                {t.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleStandardSubmit} className="p-6 space-y-4">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              New Beneficiary
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name / Entity Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rameshwar Kumar"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email or Mobile Number (Aadhaar / e-KYC Linked)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com or 10-digit mobile"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password / OTP PIN
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="password"
                defaultValue="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              User Role / Account Category
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            >
              <option value="entrepreneur">Rural / Semi-Urban Entrepreneur (Applicant)</option>
              <option value="fpo_manager">FPO / SHG Federation Leader</option>
              <option value="institutional_buyer">Institutional Pre-Bulk Buyer / Offtaker</option>
              <option value="bank_officer">Bank Branch Manager / Lead Field Officer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Registered Block / District
            </label>
            <input
              type="text"
              value={stateDistrict}
              onChange={(e) => setStateDistrict(e.target.value)}
              placeholder="e.g. Nashik, Maharashtra"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 mt-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            {mode === 'login' ? 'Continue to AgriXora' : 'Register & Verify'}
          </button>
        </form>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-950 p-3 text-center border-t border-slate-200 dark:border-slate-800">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Protected by Aadhaar e-KYC integration sandbox & 256-bit encryption.
          </p>
        </div>
      </div>
    </div>
  );
};
