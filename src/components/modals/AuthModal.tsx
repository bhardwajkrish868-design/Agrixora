import React, { useState } from 'react';
import { X, Lock, Phone, User, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import type { Language } from '../../types';
import { STATES_DATA } from '../../data/regionsData';

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
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'entrepreneur' | 'fpo_manager' | 'institutional_buyer' | 'bank_officer'>('entrepreneur');
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState('Nashik');

  if (!isOpen) return null;

  const stateObj = STATES_DATA.find(s => s.state === selectedState) || STATES_DATA[0];

  const handleStateChange = (st: string) => {
    setSelectedState(st);
    const found = STATES_DATA.find(s => s.state === st);
    if (found && found.districts.length > 0) {
      setSelectedDistrict(found.districts[0].district);
    }
  };

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const roleLabels = {
      entrepreneur: 'Rural Entrepreneur / Beneficiary',
      fpo_manager: 'FPO / SHG Federation Leader',
      institutional_buyer: 'Institutional Off-taker',
      bank_officer: 'Lead District Bank Officer'
    };

    const displayName = name.trim() || (phone ? `User +91 ${phone}` : 'Registered Beneficiary');

    onLoginSuccess({
      name: displayName,
      role: roleLabels[role] || 'Rural Entrepreneur',
      location: `${selectedDistrict}, ${selectedState}`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 rounded-3xl shadow-2xl border border-emerald-500/30 max-w-lg w-full overflow-hidden transition-all text-slate-100">
        
        {/* Visual Brand Header with Image Banner */}
        <div className="relative h-36 overflow-hidden bg-slate-950">
          <img
            src="/assets/agrixora_hero.jpg"
            alt="Agrixora"
            className="w-full h-full object-cover object-center brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-slate-300 hover:text-white bg-black/40 hover:bg-black/60 p-2 rounded-full transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40 w-fit mb-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>AGRIXORA PORTAL</span>
              </div>
              <h2 className="text-lg font-extrabold text-white tracking-tight">
                {mode === 'login' ? 'Sign In to Your Account' : 'Register New Enterprise'}
              </h2>
            </div>
            <div className="text-2xl">🌾</div>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleStandardSubmit} className="p-6 space-y-4">
          
          {/* Sign In / Register Switcher */}
          <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In (लॉग इन)</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Register (नया पंजीकरण)</span>
            </button>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name / Business Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name or enterprise name"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-white placeholder-slate-500"
                />
              </div>
            </div>
          )}

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Mobile Number (Aadhaar Linked / OTP)
            </label>
            <div className="relative">
              <div className="absolute left-3 top-2.5 text-xs font-bold text-slate-400 flex items-center gap-1 border-r border-slate-700 pr-2">
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>+91</span>
              </div>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter 10-digit mobile number"
                maxLength={10}
                className="w-full pl-16 pr-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-white font-mono"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Account Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-white cursor-pointer"
            >
              <option value="entrepreneur">Rural Entrepreneur / Micro Unit Applicant</option>
              <option value="fpo_manager">FPO / SHG Federation Leader</option>
              <option value="bank_officer">Bank Branch Manager / Field Officer</option>
              <option value="institutional_buyer">Institutional Buyer / Offtaker</option>
            </select>
          </div>

          {/* Location Selection */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                State (राज्य)
              </label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-2.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-white cursor-pointer"
              >
                {STATES_DATA.map(s => (
                  <option key={s.state} value={s.state} className="bg-slate-900 text-white">
                    {s.state}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                District (ज़िला)
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-2.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-white cursor-pointer"
              >
                {stateObj.districts.map(d => (
                  <option key={d.district} value={d.district} className="bg-slate-900 text-white">
                    {d.district}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-950 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{mode === 'login' ? 'Sign In & Access Dashboard' : 'Complete Registration & Access'}</span>
          </button>
        </form>

        {/* Footer */}
        <div className="bg-slate-950 p-3 text-center border-t border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Aadhaar e-KYC & Ministry of MSME Compliant Portal</span>
        </div>
      </div>
    </div>
  );
};
