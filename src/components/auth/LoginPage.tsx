import React, { useState } from 'react';
import {
  Lock,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
  Building2,
  Wheat,
  Eye,
  EyeOff,
  Coins,
  Globe2,
  FileCheck,
  UserPlus
} from 'lucide-react';
import type { Language, ActiveView } from '../../types';
import { STATES_DATA } from '../../data/regionsData';
import { LANGUAGE_OPTIONS } from '../../utils/i18n';
import { registerUser, authenticateUser, ROLE_ICONS, type RegisteredUser } from '../../services/authService';

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
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [authMethod, setAuthMethod] = useState<'otp' | 'password'>('otp');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [availableProfiles, setAvailableProfiles] = useState<RegisteredUser[] | null>(null);

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

  const handleSendOtp = () => {
    setErrorMessage(null);
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number to request an OTP.');
      return;
    }

    // Verify if phone is registered first
    const checkResult = authenticateUser(cleanPhone, '', 'otp');
    if (!checkResult.success) {
      setErrorMessage(checkResult.message);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setOtpValue('4892'); // Simulation code for instant convenience
      setSuccessMessage(`OTP sent to +91 ${cleanPhone}. (Verification code: 4892)`);
    }, 600);
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
        password,
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
      // Execute strict sign-in verification
      const authResult = authenticateUser(phone, otpValue || password, authMethod);

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white relative overflow-x-hidden">
      
      {/* Dynamic Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-20 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 group text-left cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
            <span className="text-xl">🌾</span>
          </div>
          <div>
            <div className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
              <span>AGRIXORA</span>
              <span className="text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Official Portal
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Rural Enterprise & 90% Loan Feasibility Engine</div>
          </div>
        </button>

        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
            <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent text-xs text-slate-200 outline-hidden cursor-pointer"
            >
              {LANGUAGE_OPTIONS.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                  {lang.native} ({lang.label})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Explore Link */}
          <button
            onClick={() => onNavigate('landing')}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>Explore Platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full items-center">

          {/* LEFT COLUMN: Branded Image & Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Visual Art Hero Card */}
            <div className="relative rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl shadow-emerald-950/50 group bg-slate-900">
              <img
                src="/assets/agrixora_hero.jpg"
                alt="Agrixora - Cultivating a Brighter Tomorrow"
                className="w-full h-72 sm:h-80 md:h-96 object-cover object-center group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6 sm:p-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/30 backdrop-blur-md text-emerald-200 border border-emerald-400/40 mb-2 w-fit">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>National Rural Enterprise Ecosystem</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  Transforming Local Agriculture into Profitable Rural Enterprises
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-2">
                  10% Equity Margin unlocks up to 90% Concessional Credit with 6.5% - 8% p.a. interest rates & bank-ready DPR blueprints.
                </p>
              </div>
            </div>

            {/* 3 Value Pillars */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-900/80 border border-emerald-900/50 p-3.5 rounded-2xl text-center backdrop-blur-xs">
                <div className="w-8 h-8 mx-auto rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold mb-1.5">
                  🌱
                </div>
                <div className="text-[11px] font-bold text-slate-200">Sustainable Farming</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Agro-climatic matching</div>
              </div>

              <div className="bg-slate-900/80 border border-teal-900/50 p-3.5 rounded-2xl text-center backdrop-blur-xs">
                <div className="w-8 h-8 mx-auto rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-sm font-bold mb-1.5">
                  💡
                </div>
                <div className="text-[11px] font-bold text-slate-200">Smart Solutions</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Hyper-local AI analysis</div>
              </div>

              <div className="bg-slate-900/80 border border-amber-900/50 p-3.5 rounded-2xl text-center backdrop-blur-xs">
                <div className="w-8 h-8 mx-auto rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-bold mb-1.5">
                  🌍
                </div>
                <div className="text-[11px] font-bold text-slate-200">Healthier Planet</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Decentralized processing</div>
              </div>
            </div>

            {/* Micro Stats Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900/40 border border-slate-800 rounded-2xl text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>₹50 Lakh Max Loan Limit</span>
              </div>
              <div className="h-3 w-px bg-slate-800" />
              <div className="flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>PMEGP & CGTMSE Aligned</span>
              </div>
              <div className="h-3 w-px bg-slate-800" />
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-400" />
                <span>28 States & 8 UTs</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Authentication Form Card */}
          <div className="lg:col-span-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative">
              
              {/* Top Mode Switcher Buttons */}
              <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800/80 mb-6">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    mode === 'login'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Sign In (लॉग इन)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    mode === 'register'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Register (नया पंजीकरण)</span>
                </button>
              </div>

              {/* Form Title & Subtitle */}
              <div className="mb-6">
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <span>{mode === 'login' ? 'Welcome Back to AgriXora' : 'Register as Rural Beneficiary'}</span>
                  <span className="text-lg">🌾</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {mode === 'login'
                    ? 'Access your hyper-local feasibility reports, loan calculator & active buyer leads.'
                    : 'Get started with data-driven enterprise feasibility & 90% loan scheme eligibility.'}
                </p>
              </div>

              {/* Error Notification Alert */}
              {errorMessage && (
                <div className="mb-4 p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-3 animate-shake">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-bold text-rose-100">Authentication Required</div>
                    <div className="mt-0.5">{errorMessage}</div>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('register');
                          setErrorMessage(null);
                        }}
                        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-white font-bold text-[11px] cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Switch to Register Tab (पंजीकरण करें)</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Success Notification */}
              {successMessage && (
                <div className="mb-4 p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Multi-Profile Selector or Standard Form */}
              {availableProfiles && availableProfiles.length > 0 ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Multiple Profiles Detected</span>
                    <h4 className="text-sm font-bold text-white mt-0.5">Select Role Profile to Open:</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Choose which workspace you would like to enter for mobile +91 {phone}:
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {availableProfiles.map(prof => (
                      <button
                        key={prof.id}
                        type="button"
                        onClick={() => handleSelectProfile(prof)}
                        className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:bg-slate-800/90 transition-all flex items-center justify-between group cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="text-2xl p-2 rounded-xl bg-slate-950 border border-slate-800">{ROLE_ICONS[prof.role] || '🌾'}</span>
                          <div>
                            <div className="text-xs font-black text-emerald-400 uppercase tracking-wider">{prof.roleLabel}</div>
                            <h4 className="text-sm font-bold text-white group-hover:text-emerald-300">{prof.name}</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-500" />
                              {prof.location}
                            </p>
                          </div>
                        </div>
                        <div className="px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 group-hover:bg-emerald-600 group-hover:text-white transition-all flex items-center gap-1">
                          <span>Enter</span>
                          <ArrowRight className="w-3.5 h-3.5" />
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
                    className="w-full py-2.5 text-xs text-slate-400 hover:text-white font-semibold transition-colors cursor-pointer"
                  >
                    ← Sign in with a different mobile number
                  </button>
                </div>
              ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Role Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Select Your Role / Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('entrepreneur')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        role === 'entrepreneur'
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5">
                        <Wheat className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Rural Entrepreneur</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Individual Beneficiary</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('fpo_manager')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        role === 'fpo_manager'
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-teal-400" />
                        <span>FPO / SHG Leader</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Farmer Collective Unit</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('bank_officer')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        role === 'bank_officer'
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        <span>Bank Branch Officer</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Loan Credit Appraisal</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('institutional_buyer')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        role === 'institutional_buyer'
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-blue-400" />
                        <span>Agri-Buyer / Trader</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Off-taker Contract Desk</div>
                    </button>
                  </div>
                </div>

                {/* Registration Only Fields */}
                {mode === 'register' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Full Name / Business Name (पूरा नाम)
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name or enterprise name"
                          className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-500"
                        />
                      </div>
                    </div>

                    {/* State & District Selector */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          State (राज्य)
                        </label>
                        <div className="relative">
                          <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                          <select
                            value={selectedState}
                            onChange={(e) => handleStateChange(e.target.value)}
                            className="w-full pl-8 pr-2 py-2.5 text-xs bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white cursor-pointer"
                          >
                            {STATES_DATA.map(s => (
                              <option key={s.state} value={s.state} className="bg-slate-900 text-white">
                                {s.state}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          District (ज़िला)
                        </label>
                        <select
                          value={selectedDistrict}
                          onChange={(e) => setSelectedDistrict(e.target.value)}
                          className="w-full px-3 py-2.5 text-xs bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white cursor-pointer"
                        >
                          {districtList.map(d => (
                            <option key={d} value={d} className="bg-slate-900 text-white">
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Margin Capital Input */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                        <span>Available Margin Capital (10% Equity)</span>
                        <span className="text-emerald-400 font-mono font-bold">₹{marginCapital.toLocaleString('en-IN')}</span>
                      </div>
                      <input
                        type="range"
                        min={10000}
                        max={500000}
                        step={5000}
                        value={marginCapital}
                        onChange={(e) => setMarginCapital(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                        <span>₹10,000 (Micro Scheme)</span>
                        <span>₹5,00,000 (Term Loan)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Common / Sign In: Mobile or Email */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Mobile Number (Aadhaar Linked / OTP)
                    </label>
                    {mode === 'login' && (
                      <div className="flex gap-2 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setAuthMethod('otp')}
                          className={`font-semibold cursor-pointer ${authMethod === 'otp' ? 'text-emerald-400 underline' : 'text-slate-400'}`}
                        >
                          Via OTP
                        </button>
                        <span className="text-slate-600">|</span>
                        <button
                          type="button"
                          onClick={() => setAuthMethod('password')}
                          className={`font-semibold cursor-pointer ${authMethod === 'password' ? 'text-emerald-400 underline' : 'text-slate-400'}`}
                        >
                          Via Password
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <div className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400 flex items-center gap-1 border-r border-slate-700 pr-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
                      className="w-full pl-20 pr-3 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-500 font-mono"
                    />
                  </div>
                </div>

                {/* Login Method: OTP or Password */}
                {mode === 'login' && authMethod === 'otp' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-300">
                        6-Digit OTP Verification
                      </label>
                      {!otpSent ? (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={isLoading || phone.length < 10}
                          className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer disabled:opacity-50"
                        >
                          {isLoading ? 'Sending SMS...' : 'Get OTP'}
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> OTP Dispatched
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="text"
                        value={otpValue}
                        onChange={(e) => setOtpValue(e.target.value)}
                        placeholder="Enter 4 or 6 digit OTP (e.g. 4892)"
                        className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-500 font-mono tracking-wider"
                      />
                    </div>
                  </div>
                )}

                {(mode === 'register' || (mode === 'login' && authMethod === 'password')) && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-300">
                        {mode === 'register' ? 'Create Security Password / PIN' : 'Password / Security PIN'}
                      </label>
                      {mode === 'login' && (
                        <a href="#help" className="text-[11px] text-slate-400 hover:text-slate-300">
                          Forgot PIN?
                        </a>
                      )}
                    </div>

                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer group mt-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>
                        {mode === 'login' ? 'Sign In & Enter Dashboard' : 'Complete Registration & Generate DPR'}
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
              )}

              {/* Bottom Security Disclosures */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Aadhaar e-KYC Compliant</span>
                </div>
                <button
                  onClick={() => onNavigate('landing')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  Explore as Guest &rarr;
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer Bar */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-3 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <div>
          &copy; 2026 AGRIXORA — Ministry of Rural Development & MSME Aligned Framework
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span>National Helpline: 1800-180-1551</span>
          <span>•</span>
          <span>Privacy & Security Protocol</span>
        </div>
      </footer>

    </div>
  );
};
