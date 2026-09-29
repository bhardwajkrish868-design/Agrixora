import React, { useState } from 'react';
import { X, Lock, Phone, User, CheckCircle2, AlertCircle, Sparkles, ShieldCheck, UserPlus, ArrowRight, MapPin } from 'lucide-react';
import type { Language } from '../../types';
import { STATES_DATA } from '../../data/regionsData';
import { registerUser, authenticateUser, ROLE_ICONS, type RegisteredUser } from '../../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; role: string; location: string; state?: string; district?: string; marginCapital?: number }) => void;
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [availableProfiles, setAvailableProfiles] = useState<RegisteredUser[] | null>(null);

  if (!isOpen) return null;

  const stateObj = STATES_DATA.find(s => s.state === selectedState) || STATES_DATA[0];

  const handleStateChange = (st: string) => {
    setSelectedState(st);
    const found = STATES_DATA.find(s => s.state === st);
    if (found && found.districts.length > 0) {
      setSelectedDistrict(found.districts[0].district);
    }
  };

  const handleSelectProfile = (profile: RegisteredUser) => {
    authenticateUser(profile.phone, '', 'otp', profile.id);
    onLoginSuccess({
      name: profile.name,
      role: profile.roleLabel,
      location: profile.location,
      state: profile.state,
      district: profile.district,
      marginCapital: profile.marginCapital
    });
    onClose();
  };

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (mode === 'register') {
      const regResult = registerUser({
        name,
        phone,
        role,
        state: selectedState,
        district: selectedDistrict
      });

      if (!regResult.success || !regResult.user) {
        setErrorMessage(regResult.message);
        return;
      }

      onLoginSuccess({
        name: regResult.user.name,
        role: regResult.user.roleLabel,
        location: regResult.user.location,
        state: regResult.user.state,
        district: regResult.user.district,
        marginCapital: regResult.user.marginCapital
      });
      onClose();

    } else {
      const authResult = authenticateUser(phone, '', 'otp');

      if (!authResult.success) {
        setErrorMessage(authResult.message);
        return;
      }

      if (authResult.accounts && authResult.accounts.length > 1) {
        setAvailableProfiles(authResult.accounts);
        return;
      }

      if (!authResult.user) {
        setErrorMessage('Account resolution failed.');
        return;
      }

      onLoginSuccess({
        name: authResult.user.name,
        role: authResult.user.roleLabel,
        location: authResult.user.location,
        state: authResult.user.state,
        district: authResult.user.district,
        marginCapital: authResult.user.marginCapital
      });
      onClose();
    }
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

        {/* Multi-Profile Selector or Standard Form */}
        {availableProfiles && availableProfiles.length > 0 ? (
          <div className="p-6 space-y-4">
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Multiple Profiles</span>
              <h4 className="text-sm font-bold text-white mt-0.5">Select Profile to Sign In:</h4>
              <p className="text-xs text-slate-300 mt-1">
                Multiple role accounts found for mobile +91 {phone}:
              </p>
            </div>

            <div className="space-y-2">
              {availableProfiles.map(prof => (
                <button
                  key={prof.id}
                  type="button"
                  onClick={() => handleSelectProfile(prof)}
                  className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500 hover:bg-slate-800/80 transition-all flex items-center justify-between group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl p-2 rounded-xl bg-slate-900 border border-slate-800">{ROLE_ICONS[prof.role] || '🌾'}</span>
                    <div>
                      <div className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">{prof.roleLabel}</div>
                      <h4 className="text-xs font-bold text-white group-hover:text-emerald-300">{prof.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {prof.location}
                      </p>
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 group-hover:bg-emerald-600 group-hover:text-white transition-all flex items-center gap-1">
                    <span>Open</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setAvailableProfiles(null)}
              className="w-full py-2 text-xs text-slate-400 hover:text-white font-semibold transition-colors cursor-pointer"
            >
              ← Sign in with a different number
            </button>
          </div>
        ) : (
        <form onSubmit={handleStandardSubmit} className="p-6 space-y-4">
          
          {/* Sign In / Register Switcher */}
          <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
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
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
              }}
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

          {/* Error Alert Box */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div>{errorMessage}</div>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMessage(null);
                    }}
                    className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-900 hover:bg-rose-800 text-white font-bold text-[10px] cursor-pointer"
                  >
                    <UserPlus className="w-3 h-3" />
                    <span>Register Now (नया पंजीकरण करें)</span>
                  </button>
                )}
              </div>
            </div>
          )}

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
        )}

        {/* Footer */}
        <div className="bg-slate-950 p-3 text-center border-t border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Aadhaar e-KYC & Ministry of MSME Compliant Portal</span>
        </div>
      </div>
    </div>
  );
};
