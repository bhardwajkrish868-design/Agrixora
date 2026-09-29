import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight,
  ShoppingBag,
  TrendingUp
} from 'lucide-react';
import type { NavigationTab, Language } from '../../types';
import { calculateFinancialRoadmap } from '../../data/schemes';

interface LandingPageProps {
  onNavigate?: (tab: NavigationTab) => void;
  onStartAnalysis?: () => void;
  onExploreOpportunities?: () => void;
  onSelectView?: (view: NavigationTab) => void;
  currentLanguage?: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onStartAnalysis,
  onExploreOpportunities,
  onSelectView
}) => {
  // Live Interactive Scheme Calculator Widget State on Landing Page
  const [simulatorMargin, setSimulatorMargin] = useState<number>(100000); // 1 Lakh
  const simulatorFinancials = calculateFinancialRoadmap(simulatorMargin);

  const handleGoToFeasibility = () => {
    if (onNavigate) onNavigate('feasibility');
    else if (onStartAnalysis) onStartAnalysis();
    else if (onSelectView) onSelectView('feasibility');
  };

  const handleGoToMarketplace = () => {
    if (onNavigate) onNavigate('marketplace');
    else if (onExploreOpportunities) onExploreOpportunities();
    else if (onSelectView) onSelectView('marketplace');
  };

  const handleGoToOpportunities = () => {
    if (onNavigate) onNavigate('opportunities');
    else if (onExploreOpportunities) onExploreOpportunities();
    else if (onSelectView) onSelectView('opportunities');
  };

  return (
    <div className="space-y-16 pb-16 max-w-6xl mx-auto">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white p-8 sm:p-14 border border-emerald-900/50 shadow-2xl">
        
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Unified Rural Enterprise Platform • PS 26091 + PS 26033</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none text-white">
            Build Smarter. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              Borrow Smarter. Grow Smarter.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            AI-powered business feasibility, 90% loan auto-routing, and institutional buyer demand connectivity for rural & semi-urban entrepreneurs across India.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleGoToFeasibility}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer scale-100 hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze My Business Feasibility</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleGoToMarketplace}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Browse Active Buyer Demands</span>
            </button>
          </div>

          {/* Mini Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10 text-left">
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <div className="text-[11px] text-slate-400">Capital Amplification</div>
              <div className="text-lg font-black text-emerald-400">10% Margin → 100% Scale</div>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <div className="text-[11px] text-slate-400">Catchment Analysis</div>
              <div className="text-lg font-black text-teal-300">5–10 km Geo-Fenced</div>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <div className="text-[11px] text-slate-400">Repayment Grace</div>
              <div className="text-lg font-black text-amber-300">3–6 Months Moratorium</div>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <div className="text-[11px] text-slate-400">Pre-Bulk Demand</div>
              <div className="text-lg font-black text-sky-400">Instant Buyer Pledging</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. THREE-STEP UNIFIED WORKFLOW */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            End-to-End Entrepreneur Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            How AgriXora Bridges Idea, Capital & Market
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            From discovering untapped opportunities in your block to securing a 90% loan and pre-selling your harvest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-black text-xl">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Hyper-Local Market Validation
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Define your 5–10 km catchment. Our AI evaluates competitor density, raw material clusters, local pricing benchmarks, and risk factors.
            </p>
            <button
              onClick={handleGoToFeasibility}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Explore Catchment Intelligence</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center font-black text-xl">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              10:90 Smart Scheme Router
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Input your available margin capital. The engine auto-routes between Micro Finance (≤ ₹1.4L @ 6.5%) and Term Loan (≤ ₹50L @ 8%) with quarterly EMIs.
            </p>
            <button
              onClick={() => {
                if (onNavigate) onNavigate('financials');
                else if (onSelectView) onSelectView('financials');
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Simulate Loan Eligibility</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center font-black text-xl">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Pre-Bulk Buyer Contracts
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Lock in guaranteed sales before launching production. Browse active institutional orders from verified FMCG processors, FPOs, and aggregators.
            </p>
            <button
              onClick={handleGoToMarketplace}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <span>Browse Active Demands</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* 3. LIVE 10:90 LEVERAGE SIMULATOR WIDGET */}
      <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 dark:from-slate-900 dark:via-emerald-950/40 dark:to-slate-900 border-2 border-emerald-500/40 shadow-lg space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-200/60 dark:bg-emerald-950 px-3 py-1 rounded-full">
              Live Scheme Eligibility Simulator
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
              See What ₹{simulatorMargin.toLocaleString('en-IN')} Unlocks
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Move the slider to see how 10% own equity translates into 10x total project capacity.
            </p>
          </div>

          <button
            onClick={() => {
              if (onNavigate) onNavigate('financials');
              else if (onSelectView) onSelectView('financials');
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Open Advanced Calculator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Slider */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
              Your 10% Margin Capital:
            </span>

            <div className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400 font-mono bg-emerald-50 dark:bg-slate-900 px-5 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800">
              ₹{simulatorMargin.toLocaleString('en-IN')}
            </div>
          </div>

          <input
            type="range"
            min="5000"
            max="500000"
            step="5000"
            value={simulatorMargin}
            onChange={(e) => setSimulatorMargin(Number(e.target.value))}
            className="w-full h-3 bg-emerald-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />

          <div className="flex justify-between text-[11px] font-semibold text-slate-500">
            <span>₹5,000 (₹50k Project)</span>
            <span>₹14,000 (Micro Max)</span>
            <span>₹1,00,000 (₹10L Project)</span>
            <span>₹5,00,000 (₹50L Term Max)</span>
          </div>
        </div>

        {/* Live Calculation Output Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-2xl bg-slate-900 text-white">
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Total Project Cost</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              ₹{simulatorFinancials.projectCost.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Available Margin / 10% (10x)</div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold uppercase">Maximum Loan (90%)</div>
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
              ₹{simulatorFinancials.loanAmount.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">{simulatorFinancials.scheme.interestRate}% Concessional Rate</div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
            <div className="text-[11px] text-blue-800 dark:text-blue-300 font-semibold uppercase">Routed Scheme</div>
            <div className="text-base font-extrabold text-blue-900 dark:text-blue-200 mt-1 line-clamp-1">
              {simulatorFinancials.scheme.name}
            </div>
            <div className="text-[10px] text-blue-700 dark:text-blue-400 mt-0.5">{simulatorFinancials.scheme.repaymentTenureYears} Years • {simulatorFinancials.scheme.moratoriumMonths}M Moratorium</div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
            <div className="text-[11px] text-amber-800 dark:text-amber-300 font-semibold uppercase">Estimated Quarterly EMI</div>
            <div className="text-2xl font-black text-amber-900 dark:text-amber-300 mt-1">
              ₹{simulatorFinancials.quarterlyEMI.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5">≈ ₹{simulatorFinancials.monthlyEquivalentEMI.toLocaleString('en-IN')}/month post grace</div>
          </div>

        </div>
      </section>

      {/* 4. DUAL-MODULE HIGHLIGHT (Feasibility + Market Demand) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Feasibility Module Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
            📊
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
              Feasibility Intelligence
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Hyper-Local Business Feasibility & Scheme Router
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Provides rural entrepreneurs with institutional-grade market research, 5–10 km catchment analysis, competitor density mapping, and 10:90 loan structuring.
            </p>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>5-10 km radius consumer & household demographic estimation</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Full 4-quadrant SWOT Matrix & localized threat mitigation</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Micro Finance (6.5%) vs Term Loan (8%) auto-selection</span>
            </li>
          </ul>
          <button
            onClick={handleGoToFeasibility}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Launch Feasibility Engine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Demand & Marketplace Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-lg">
            🛒
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 px-2.5 py-0.5 rounded-full">
              Pre-Bulk Off-Take
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Institutional Demand & Pre-Bulk Buyer Marketplace
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Connects newly funded rural producers directly with corporate food processors, retail aggregators, and state agencies with guaranteed pre-bulk contracts.
            </p>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Real-time pre-bulk orders (e.g. 500 T Tomato, 120 T Mustard Oil)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Producer pledge management & collection center logistics</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Opportunity Radar ranking underserved local market niches</span>
            </li>
          </ul>
          <div className="flex gap-2">
            <button
              onClick={handleGoToMarketplace}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Active Buyer Demands</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleGoToOpportunities}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
            >
              Opportunity Radar
            </button>
          </div>
        </div>

      </section>

      {/* 5. BIG CTA BAR */}
      <section className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-8 sm:p-12 rounded-3xl text-center space-y-4 shadow-xl">
        <h2 className="text-2xl sm:text-4xl font-black">
          Ready to Launch Your Village Enterprise?
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto leading-relaxed">
          Access institutional-grade AI consulting, 90% loan eligibility certificates, and active buyer contracts in less than 2 minutes.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleGoToFeasibility}
            className="px-6 py-3.5 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 font-extrabold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Start Free Feasibility Study</span>
          </button>
          <button
            onClick={handleGoToMarketplace}
            className="px-6 py-3.5 rounded-2xl bg-emerald-950/60 hover:bg-emerald-950/80 border border-white/20 text-white font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 text-amber-300" />
            <span>Explore Buyer Contracts</span>
          </button>
        </div>
      </section>

    </div>
  );
};
