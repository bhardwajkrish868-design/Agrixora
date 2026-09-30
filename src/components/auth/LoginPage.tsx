import React, { useState } from 'react';
import {
  Lock,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
  Building2,
  Wheat,
  Coins,
  Globe2,
  UserPlus,
  Eye,
  EyeOff,
  Database
} from 'lucide-react';
import type { Language, ActiveView } from '../../types';
import { STATES_DATA } from '../../data/regionsData';
import { LANGUAGE_OPTIONS, useLoginTranslation } from '../../utils/i18n';
import { applyPageLanguage } from '../../services/translatorService';
import { registerUser, authenticateUser, getAccountsByPhone, ROLE_ICONS, type RegisteredUser } from '../../services/authService';

interface LoginPageProps {
  initialMode?: 'login' | 'register';
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onLoginSuccess: (user: { name: string; role: string; location: string; state?: string; district?: string; marginCapital?: number }) => void;
  onNavigate: (view: ActiveView) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  initialMode = 'login',
  currentLang,
  onLanguageChange,
  onLoginSuccess,
  onNavigate
}) => {
  const t = useLoginTranslation(currentLang);
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [availableProfiles, setAvailableProfiles] = useState<RegisteredUser[] | null>(null);

  const handleLanguageSelect = (newLang: Language) => {
    onLanguageChange(newLang);
    applyPageLanguage(newLang);
  };

  // Form fields (Clean production state, no demo defaults)
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<'entrepreneur' | 'fpo_manager' | 'institutional_buyer' | 'bank_officer'>('entrepreneur');
  const [selectedState, setSelectedState] = useState<string>('Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Nashik');
  const [marginCapital, setMarginCapital] = useState<number>(25000);

  const stateObj = STATES_DATA.find(s => s.state === selectedState) || STATES_DATA[0];
  const districtList = stateObj.districts.map(d => d.district);

  const handleStateChange = (st: string) => {
    setSelectedState(st);
    const found = STATES_DATA.find(s => s.state === st);
    if (found && found.districts.length > 0) {
      setSelectedDistrict(found.districts[0].district);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    if (mode === 'register') {
      // Execute strict registration
      const regResult = registerUser({
        name,
        phone,
        password: password || '123456',
        role,
        state: selectedState,
        district: selectedDistrict,
        marginCapital
      });

      if (!regResult.success || !regResult.user) {
        setIsLoading(false);
        setErrorMessage(regResult.message);
        return;
      }

      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess({
          name: regResult.user!.name,
          role: regResult.user!.roleLabel,
          location: regResult.user!.location,
          state: regResult.user!.state,
          district: regResult.user!.district,
          marginCapital: regResult.user!.marginCapital
        });
        onNavigate('dashboard');
      }, 500);

    } else {
      // Execute sign-in verification with mobile & password
      const authResult = authenticateUser(phone, password, 'password');

      if (!authResult.success) {
        setIsLoading(false);
        setErrorMessage(authResult.message);
        return;
      }

      // If multiple accounts found on this number, prompt user to select which profile to open
      if (authResult.accounts && authResult.accounts.length > 1) {
        setIsLoading(false);
        setAvailableProfiles(authResult.accounts);
        setSuccessMessage(`Found ${authResult.accounts.length} profiles for +91 ${phone}. Choose which role to open.`);
        return;
      }

      if (!authResult.user) {
        setIsLoading(false);
        setErrorMessage('Failed to resolve account. Please try again.');
        return;
      }

      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess({
          name: authResult.user!.name,
          role: authResult.user!.roleLabel,
          location: authResult.user!.location,
          state: authResult.user!.state,
          district: authResult.user!.district,
          marginCapital: authResult.user!.marginCapital
        });
        onNavigate('dashboard');
      }, 500);
    }
  };

  const handleSelectProfile = (profile: RegisteredUser) => {
    setIsLoading(true);
    authenticateUser(profile.phone, '', 'otp', profile.id);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: profile.name,
        role: profile.roleLabel,
        location: profile.location,
        state: profile.state,
        district: profile.district,
        marginCapital: profile.marginCapital
      });
      onNavigate('dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen lg:h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white relative lg:overflow-hidden">
      
      {/* Dynamic Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-20 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 sm:px-6 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
            <span className="text-lg">🌾</span>
          </div>
          <div>
            <div className="font-extrabold text-base sm:text-lg text-white tracking-tight flex items-center gap-1.5">
              <span>AGRIXORA</span>
              <span className="text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                {t.portalBadge}
              </span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-400">{t.portalTagline}</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Admin Console Entry Button */}
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className="flex items-center gap-1.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 hover:border-indigo-400 text-indigo-200 hover:text-white px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-950/50 cursor-pointer group"
            title="Open Admin Console & Turso Cloud Database Studio"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span>Admin Console</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
            <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={currentLang}
              onChange={(e) => handleLanguageSelect(e.target.value as Language)}
              className="bg-transparent text-xs text-slate-200 outline-hidden cursor-pointer"
            >
              {LANGUAGE_OPTIONS.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                  {lang.native} ({lang.label})
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-3 sm:px-5 lg:px-6 py-1.5 sm:py-2 flex items-center justify-center min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 lg:gap-6 w-full items-center">

          {/* LEFT COLUMN: Clean Branded Hero */}
          <div className="lg:col-span-5 space-y-2">
            {/* Normal Clean Image */}
            <div className="rounded-2xl overflow-hidden border border-emerald-500/30 shadow-xl shadow-emerald-950/40 bg-slate-900">
              <img
                src="/assets/agrixora_hero.jpg"
                alt="Agrixora - Cultivating a Brighter Tomorrow"
                className="w-full aspect-[16/8] max-h-[145px] sm:max-h-[165px] object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>

            {/* Clean Info Card Below */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 sm:p-3 backdrop-blur-md space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{t.heroBadge}</span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-white leading-snug">
                {t.heroTitle}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                {t.heroDesc}
              </p>

              <div className="grid grid-cols-2 gap-1.5 pt-0.5 text-xs">
                <div className="p-1.5 sm:p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 text-slate-300">
                  <div className="font-extrabold text-emerald-400 text-xs sm:text-sm">{t.statCreditVal}</div>
                  <div className="text-[8.5px] text-slate-400 mt-0.5">{t.statCreditLabel}</div>
                </div>
                <div className="p-1.5 sm:p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 text-slate-300">
                  <div className="font-extrabold text-teal-400 text-xs sm:text-sm">{t.statInterestVal}</div>
                  <div className="text-[8.5px] text-slate-400 mt-0.5">{t.statInterestLabel}</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Authentication Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl p-3 sm:p-4 backdrop-blur-xl relative max-h-[calc(100vh-80px)] overflow-y-auto lg:overflow-visible">
              
              {/* Mode Switcher Buttons */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80 mb-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                    setAvailableProfiles(null);
                  }}
                  className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mode === 'login'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{t.signInTab}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage(null);
                    setAvailableProfiles(null);
                  }}
                  className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mode === 'register'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{t.registerTab}</span>
                </button>
              </div>

              {/* Form Title */}
              <div className="mb-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5">
                  <span>{mode === 'login' ? t.welcomeLoginTitle : t.welcomeRegisterTitle}</span>
                  <span className="text-xs">🌾</span>
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-400">
                  {mode === 'login' ? t.welcomeLoginDesc : t.welcomeRegisterDesc}
                </p>
              </div>

              {/* Error Notification Alert */}
              {errorMessage && (
                <div className="mb-3 p-2.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 animate-shake">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-bold text-rose-100 text-xs">Action Required</div>
                    <div className="mt-0.5 text-[11px]">{errorMessage}</div>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('register');
                          setErrorMessage(null);
                        }}
                        className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-900/80 hover:bg-rose-800 text-white font-bold text-[10px] cursor-pointer"
                      >
                        <UserPlus className="w-3 h-3" />
                        <span>Switch to Register Tab (पंजीकरण करें)</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Success Notification */}
              {successMessage && (
                <div className="mb-2 p-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-[10px] truncate">{successMessage}</span>
                </div>
              )}

              {/* Multi-Profile Selector or Standard Form */}
              {availableProfiles && availableProfiles.length > 0 ? (
                <div className="space-y-2">
                  <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                    <div>
                      <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">Multiple Profiles Detected</div>
                      <h4 className="text-xs font-bold text-white">Select Role Profile for +91 {phone}:</h4>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                      {availableProfiles.length} Accounts
                    </span>
                  </div>

                  {/* 2x2 Compact Grid of Profiles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {availableProfiles.map(prof => (
                      <button
                        key={prof.id}
                        type="button"
                        onClick={() => handleSelectProfile(prof)}
                        className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:bg-slate-800/90 transition-all flex items-center justify-between group cursor-pointer text-left shadow-sm"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm p-1 rounded-lg bg-slate-950 border border-slate-800 shrink-0">
                            {ROLE_ICONS[prof.role] || '🌾'}
                          </span>
                          <div className="min-w-0">
                            <div className="text-[8.5px] font-extrabold text-emerald-400 uppercase tracking-wider truncate">
                              {prof.roleLabel.replace(' / Beneficiary', '').replace(' Federation', '')}
                            </div>
                            <h4 className="text-[11px] font-bold text-white group-hover:text-emerald-300 truncate">
                              {prof.name}
                            </h4>
                            <p className="text-[9.5px] text-slate-400 truncate flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                              <span className="truncate">{prof.location}</span>
                            </p>
                          </div>
                        </div>
                        <div className="px-2 py-0.5 rounded-lg bg-emerald-600/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/30 group-hover:bg-emerald-600 group-hover:text-white transition-all flex items-center gap-0.5 shrink-0 ml-1">
                          <span>Enter</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setAvailableProfiles(null);
                      setSuccessMessage(null);
                    }}
                    className="w-full py-0.5 text-[10px] text-slate-400 hover:text-white font-semibold transition-colors cursor-pointer"
                  >
                    ← Sign in with a different mobile number
                  </button>
                </div>
              ) : (
              <form onSubmit={handleSubmit} autoComplete="off" className="space-y-2.5">
                
                {/* Mode: REGISTER */}
                {mode === 'register' && (
                  <>
                    {/* Real-time Multi-Profile Detection Banner */}
                    {(() => {
                      const cleanP = phone.trim().replace(/\D/g, '');
                      const accounts: RegisteredUser[] = cleanP.length === 10 ? getAccountsByPhone(cleanP) : [];
                      if (accounts.length === 0) return null;
                      return (
                        <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/90 via-slate-900 to-emerald-950/90 border border-emerald-500/40 text-xs shadow-lg shadow-emerald-950/40 animate-fadeIn">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                              <span>{accounts.length} Existing Role(s) on +91 {cleanP}</span>
                            </span>
                            <span className="text-[9px] text-slate-400">Click to Open or Register New</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {accounts.map((acc: RegisteredUser) => (
                              <button
                                key={acc.id}
                                type="button"
                                onClick={() => handleSelectProfile(acc)}
                                className="p-1.5 rounded-lg bg-slate-950/90 border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-900/40 transition-all text-left flex items-center justify-between group cursor-pointer shadow-xs"
                                title={`1-Click Sign In as ${acc.roleLabel}`}
                              >
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span className="text-xs">{ROLE_ICONS[acc.role]}</span>
                                  <div className="min-w-0">
                                    <div className="text-[10px] font-bold text-white group-hover:text-emerald-300 truncate">
                                      {acc.name}
                                    </div>
                                    <div className="text-[8.5px] font-semibold text-emerald-400 truncate">
                                      {acc.roleLabel.replace(' / Beneficiary', '').replace(' Federation', '').replace('Lead District ', '')}
                                    </div>
                                  </div>
                                </div>
                                <div className="px-1.5 py-0.5 rounded bg-emerald-600/30 text-emerald-300 text-[8.5px] font-bold flex items-center gap-0.5 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all ml-1">
                                  <span>Log In</span>
                                  <ArrowRight className="w-2 h-2" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Role Selector */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-semibold text-slate-300">
                          Select Your Role / Category (अपनी भूमिका चुनें)
                        </label>
                        {(() => {
                          const cleanP = phone.trim().replace(/\D/g, '');
                          const accounts: RegisteredUser[] = cleanP.length === 10 ? getAccountsByPhone(cleanP) : [];
                          if (accounts.length === 0) return null;
                          return (
                            <span className="text-[9px] text-emerald-400 font-medium">
                              Roles with ✓ already created
                            </span>
                          );
                        })()}
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        {/* Rural Entrepreneur */}
                        {(() => {
                          const cleanP = phone.trim().replace(/\D/g, '');
                          const accounts: RegisteredUser[] = cleanP.length === 10 ? getAccountsByPhone(cleanP) : [];
                          const existing = accounts.find((a: RegisteredUser) => a.role === 'entrepreneur');
                          return (
                            <button
                              type="button"
                              onClick={() => setRole('entrepreneur')}
                              className={`p-1.5 sm:p-2 rounded-xl border text-left text-xs transition-all cursor-pointer relative ${
                                role === 'entrepreneur'
                                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-xs'
                                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <div className="font-bold flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5 truncate">
                                  <Wheat className="w-3 h-3 text-emerald-400 shrink-0" />
                                  <span className="truncate">Rural Entrepreneur</span>
                                </div>
                                {existing && (
                                  <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                                    ✓ Registered
                                  </span>
                                )}
                              </div>
                              <div className="text-[9px] text-slate-400 mt-0.5">
                                {existing ? `Active: ${existing.name}` : 'Individual Beneficiary'}
                              </div>
                            </button>
                          );
                        })()}

                        {/* FPO / SHG Leader */}
                        {(() => {
                          const cleanP = phone.trim().replace(/\D/g, '');
                          const accounts: RegisteredUser[] = cleanP.length === 10 ? getAccountsByPhone(cleanP) : [];
                          const existing = accounts.find((a: RegisteredUser) => a.role === 'fpo_manager');
                          return (
                            <button
                              type="button"
                              onClick={() => setRole('fpo_manager')}
                              className={`p-1.5 sm:p-2 rounded-xl border text-left text-xs transition-all cursor-pointer relative ${
                                role === 'fpo_manager'
                                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-xs'
                                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <div className="font-bold flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5 truncate">
                                  <Building2 className="w-3 h-3 text-teal-400 shrink-0" />
                                  <span className="truncate">FPO / SHG Leader</span>
                                </div>
                                {existing && (
                                  <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                                    ✓ Registered
                                  </span>
                                )}
                              </div>
                              <div className="text-[9px] text-slate-400 mt-0.5">
                                {existing ? `Active: ${existing.name}` : 'Farmer Collective Unit'}
                              </div>
                            </button>
                          );
                        })()}

                        {/* Bank Branch Officer */}
                        {(() => {
                          const cleanP = phone.trim().replace(/\D/g, '');
                          const accounts: RegisteredUser[] = cleanP.length === 10 ? getAccountsByPhone(cleanP) : [];
                          const existing = accounts.find((a: RegisteredUser) => a.role === 'bank_officer');
                          return (
                            <button
                              type="button"
                              onClick={() => setRole('bank_officer')}
                              className={`p-1.5 sm:p-2 rounded-xl border text-left text-xs transition-all cursor-pointer relative ${
                                role === 'bank_officer'
                                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-xs'
                                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <div className="font-bold flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5 truncate">
                                  <Coins className="w-3 h-3 text-amber-400 shrink-0" />
                                  <span className="truncate">Bank Branch Officer</span>
                                </div>
                                {existing && (
                                  <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                                    ✓ Registered
                                  </span>
                                )}
                              </div>
                              <div className="text-[9px] text-slate-400 mt-0.5">
                                {existing ? `Active: ${existing.name}` : 'Loan Credit Appraisal'}
                              </div>
                            </button>
                          );
                        })()}

                        {/* Agri-Buyer / Trader */}
                        {(() => {
                          const cleanP = phone.trim().replace(/\D/g, '');
                          const accounts: RegisteredUser[] = cleanP.length === 10 ? getAccountsByPhone(cleanP) : [];
                          const existing = accounts.find((a: RegisteredUser) => a.role === 'institutional_buyer');
                          return (
                            <button
                              type="button"
                              onClick={() => setRole('institutional_buyer')}
                              className={`p-1.5 sm:p-2 rounded-xl border text-left text-xs transition-all cursor-pointer relative ${
                                role === 'institutional_buyer'
                                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-xs'
                                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <div className="font-bold flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5 truncate">
                                  <Building2 className="w-3 h-3 text-blue-400 shrink-0" />
                                  <span className="truncate">Agri-Buyer / Trader</span>
                                </div>
                                {existing && (
                                  <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                                    ✓ Registered
                                  </span>
                                )}
                              </div>
                              <div className="text-[9px] text-slate-400 mt-0.5">
                                {existing ? `Active: ${existing.name}` : 'Off-taker Contract Desk'}
                              </div>
                            </button>
                          );
                        })()}
                      </div>

                      {/* If selected role is already registered, provide instant 1-click shortcut */}
                      {(() => {
                        const cleanP = phone.trim().replace(/\D/g, '');
                        const accounts: RegisteredUser[] = cleanP.length === 10 ? getAccountsByPhone(cleanP) : [];
                        const existingForSelected = accounts.find((a: RegisteredUser) => a.role === role);
                        if (!existingForSelected) return null;
                        return (
                          <div className="mt-1.5 p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs flex items-center justify-between gap-2 animate-fadeIn">
                            <div className="text-[10px] text-emerald-200">
                              <span className="font-bold">{existingForSelected.name}</span> is already registered as this role!
                            </div>
                            <button
                              type="button"
                              onClick={() => handleSelectProfile(existingForSelected)}
                              className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[9px] flex items-center gap-0.5 cursor-pointer shrink-0"
                            >
                              <span>Log In Now</span>
                              <ArrowRight className="w-2 h-2" />
                            </button>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="regName" className="block text-[11px] font-semibold text-slate-300 mb-0.5">
                          Full Name (पूरा नाम)
                        </label>
                        <div className="relative">
                          <User className="w-3 h-3 absolute left-2.5 top-2 text-slate-400" />
                          <input
                            type="text"
                            id="regName"
                            name="regName"
                            autoComplete="off"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Ramesh Kumar"
                            className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="regPhone" className="block text-[11px] font-semibold text-slate-300 mb-0.5">
                          Mobile Number (मोबाइल)
                        </label>
                        <div className="relative flex items-center">
                          <div className="absolute left-2 text-slate-400 font-bold text-xs flex items-center gap-0.5 pointer-events-none">
                            <Phone className="w-3 h-3 text-emerald-400" />
                            <span>+91</span>
                          </div>
                          <input
                            type="tel"
                            id="regPhone"
                            name="regPhone"
                            autoComplete="off"
                            maxLength={10}
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="10-digit number"
                            className="w-full pl-11 pr-2.5 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-500 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* State & District */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-0.5">
                          State (राज्य)
                        </label>
                        <select
                          value={selectedState}
                          onChange={(e) => handleStateChange(e.target.value)}
                          className="w-full px-2 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg focus:ring-1 focus:ring-emerald-500 text-white cursor-pointer"
                        >
                          {STATES_DATA.map((s) => (
                            <option key={s.state} value={s.state} className="bg-slate-900 text-white">
                              {s.state}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-0.5">
                          District (ज़िला)
                        </label>
                        <select
                          value={selectedDistrict}
                          onChange={(e) => setSelectedDistrict(e.target.value)}
                          className="w-full px-2 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg focus:ring-1 focus:ring-emerald-500 text-white cursor-pointer"
                        >
                          {districtList.map((d) => (
                            <option key={d} value={d} className="bg-slate-900 text-white">
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Margin Capital (if applicable) */}
                    {(role === 'entrepreneur' || role === 'fpo_manager') && (
                      <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                        <div className="flex items-center justify-between mb-0.5">
                          <label className="text-[11px] font-semibold text-slate-300">
                            Available Margin Capital (₹ मार्जिन पूंजी)
                          </label>
                          <span className="text-[11px] text-emerald-400 font-bold font-mono">
                            ₹{marginCapital.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="10000"
                          max="500000"
                          step="5000"
                          value={marginCapital}
                          onChange={(e) => setMarginCapital(Number(e.target.value))}
                          className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                        />
                      </div>
                    )}

                    {/* Password / PIN */}
                    <div>
                      <label htmlFor="regPassword" className="block text-[11px] font-semibold text-slate-300 mb-0.5">
                        Security PIN / Password (सुरक्षा पिन)
                      </label>
                      <div className="relative">
                        <Lock className="w-3 h-3 absolute left-2.5 top-2 text-slate-400" />
                        <input
                          type="password"
                          id="regPassword"
                          name="regPassword"
                          autoComplete="new-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create 6-digit security PIN"
                          className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-500 font-mono"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Mode: LOGIN */}
                {mode === 'login' && (
                  <>
                    {/* Mobile Number Field */}
                    <div>
                      <label htmlFor="loginPhone" className="block text-[11px] font-semibold text-slate-300 mb-0.5">
                        {t.mobileLabel}
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute left-2.5 text-slate-400 font-bold text-xs flex items-center gap-0.5 pointer-events-none">
                          <Phone className="w-3 h-3 text-emerald-400" />
                          <span>+91</span>
                        </div>
                        <input
                          type="tel"
                          id="loginPhone"
                          name="loginPhone"
                          autoComplete="off"
                          maxLength={10}
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={t.mobilePlaceholder}
                          className="w-full pl-12 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-500 font-mono"
                        />
                      </div>
                    </div>

                    {/* Password / PIN Field */}
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <label htmlFor="loginPassword" className="text-[11px] font-semibold text-slate-300">
                          {t.passwordLabel}
                        </label>
                      </div>

                      <div className="relative flex items-center">
                        <Lock className="w-3 h-3 absolute left-2.5 top-2 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="loginPassword"
                          name="loginPassword"
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={t.passwordPlaceholder}
                          className="w-full pl-8 pr-8 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 text-slate-400 hover:text-slate-200 cursor-pointer p-1"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 px-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs sm:text-sm rounded-lg shadow-md shadow-emerald-950/60 transition-all flex items-center justify-center gap-1.5 cursor-pointer group mt-1"
                >
                  {isLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>
                        {mode === 'login' ? t.submitLogin : t.submitRegister}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
              )}

              {/* Bottom Security Disclosures */}
              <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <div className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{t.compliance}</span>
                </div>
                <div className="text-slate-500 font-mono text-[9px]">
                  256-Bit SSL Encrypted
                </div>
              </div>

              {/* System Admin Quick Launcher */}
              <div className="mt-2 p-1.5 sm:p-2 rounded-xl bg-gradient-to-r from-slate-950 via-indigo-950/30 to-slate-950 border border-indigo-500/25 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-md bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                    <Database className="w-3 h-3" />
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-[11px] font-bold text-slate-200 flex items-center gap-1">
                      <span>{t.adminTitle}</span>
                      <span className="text-[7.5px] font-bold px-1 py-0.1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase">
                        Turso Cloud
                      </span>
                    </div>
                    <div className="text-[8.5px] sm:text-[9.5px] text-slate-400">{t.adminDesc}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] shadow-sm shadow-indigo-950 flex items-center gap-1 transition-all cursor-pointer shrink-0"
                >
                  <span>{t.openAdmin}</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer Bar */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 py-1 text-center text-[9.5px] sm:text-[10px] text-slate-400 max-w-7xl mx-auto w-full shrink-0">
        {t.footerText}
      </footer>

    </div>
  );
};

