import React from 'react';
import { 
  Sparkles, 
  Landmark, 
  ShoppingBag, 
  MapPin, 
  Bot, 
  FileSpreadsheet, 
  ArrowRight, 
  Activity, 
  Coins, 
  ShieldCheck, 
  TrendingUp, 
  Building2, 
  Wheat, 
  Truck 
} from 'lucide-react';
import type { 
  NavigationTab, 
  ActiveView, 
  FeasibilityReport, 
  FinancialRoadmap, 
  Language, 
  PreBulkDemandOrder,
  LocationCatchment
} from '../../types';
import { INITIAL_PRE_BULK_ORDERS } from '../../data/buyerDemands';

interface DashboardViewProps {
  onNavigate?: (tab: NavigationTab) => void;
  onSelectView?: (view: ActiveView) => void;
  report?: FeasibilityReport | null;
  latestReport?: FeasibilityReport | null;
  financials?: FinancialRoadmap | null;
  latestFinancials?: FinancialRoadmap | null;
  buyerOrders?: PreBulkDemandOrder[];
  currentLanguage?: Language;
  location?: LocationCatchment;
  userRole?: string;
  userName?: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onSelectView,
  report: propReport,
  latestReport,
  financials: propFinancials,
  latestFinancials,
  buyerOrders: propOrders,
  location,
  userRole = 'entrepreneur',
  userName
}) => {
  const report = latestReport || propReport;
  const financials = latestFinancials || propFinancials;
  const buyerOrders = propOrders || INITIAL_PRE_BULK_ORDERS;

  const navigateTo = (tab: NavigationTab) => {
    if (onNavigate) onNavigate(tab);
    else if (onSelectView) onSelectView(tab as ActiveView);
  };

  const activeVillage = location?.panchayat || location?.village || report?.location.village || 'Janori';
  const activeDistrict = location?.district || report?.location.district || 'Nashik';
  const activeState = location?.state || report?.location.state || 'Maharashtra';

  const role = (userRole || '').toLowerCase();
  const isBankOfficer = role.includes('bank') || role === 'bank_officer';
  const isBuyer = role.includes('buyer') || role.includes('trader') || role === 'institutional_buyer';
  const isFPO = role.includes('fpo') || role.includes('shg') || role === 'fpo_manager';

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* 1. ROLE-TAILORED TOP HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 border border-emerald-900/40 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {isBankOfficer
                  ? 'Bank Credit Appraisal & Risk Assessment Desk'
                  : isBuyer
                  ? 'Institutional Off-taker Procurement Hub'
                  : isFPO
                  ? 'FPO Cluster Infrastructure & Procurement Command'
                  : 'Rural Enterprise & 10:90 Loan Command Center'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {isBankOfficer
                ? `Loan Credit Appraisal Desk • ${userName || activeDistrict}`
                : isBuyer
                ? `Direct Sourcing & Procurement Desk • ${userName || activeState}`
                : isFPO
                ? `FPO Farmer Aggregation Hub • ${userName || activeDistrict}`
                : userName 
                ? `Namaste, ${userName}! Ready to Scale Your Enterprise?` 
                : 'Turn Your Local Idea Into a Fundable Business'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isBankOfficer
                ? `Auditing borrower DPR project reports, DSCR debt coverage, and 10:90 scheme compliance for applicants across ${activeDistrict}, ${activeState}.`
                : isBuyer
                ? `Contracting guaranteed commodity purchase agreements with verified rural FPOs and micro-enterprises in ${activeDistrict}, ${activeState}.`
                : isFPO
                ? `Managing collective crop pooling, cluster-level cold chain processing, and bulk institutional contracts for ${activeVillage}, ${activeDistrict}.`
                : `AI-powered feasibility, 90% loan auto-routing, and institutional buyer demand connectivity for ${activeVillage}, ${activeDistrict}.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {isBankOfficer ? (
              <>
                <button
                  onClick={() => navigateTo('financials')}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-lg shadow-amber-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>DSCR Stress Testing</span>
                </button>
                <button
                  onClick={() => navigateTo('businessplan')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Audit Applicant DPR</span>
                </button>
              </>
            ) : isBuyer ? (
              <>
                <button
                  onClick={() => navigateTo('marketplace')}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-slate-950 font-black text-xs shadow-lg shadow-amber-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Manage Purchase Contracts</span>
                </button>
                <button
                  onClick={() => navigateTo('intelligence')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mandi Price Trends</span>
                </button>
              </>
            ) : isFPO ? (
              <>
                <button
                  onClick={() => navigateTo('marketplace')}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-slate-950 font-black text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Pool Member Supply (50-500T)</span>
                </button>
                <button
                  onClick={() => navigateTo('feasibility')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cluster Processing Unit</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigateTo('feasibility')}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start Business Analysis</span>
                </button>
                <button
                  onClick={() => navigateTo('advisor')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Talk to AI Advisor</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. ROLE-SPECIFIC KPI METRICS */}
      {isBankOfficer ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => navigateTo('businessplan')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md hover:border-amber-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Active Loan Applications
              </span>
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">14 Cases</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>District: {activeDistrict}</span>
              <span className="text-amber-600 font-bold group-hover:translate-x-1 transition-transform">Audit →</span>
            </div>
          </div>

          <div 
            onClick={() => navigateTo('financials')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md hover:border-blue-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Average DSCR Health
              </span>
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">1.84x</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>Benchmark: &gt; 1.50x (Safe)</span>
              <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform">Stress Test →</span>
            </div>
          </div>

          <div 
            onClick={() => navigateTo('financials')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                10:90 Equity Compliance
              </span>
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">100%</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>10% Margin Verified</span>
              <span className="text-emerald-600 font-bold group-hover:translate-x-1 transition-transform">Verify →</span>
            </div>
          </div>

          <div 
            onClick={() => navigateTo('intelligence')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md hover:border-purple-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Sanctioned Portfolio
              </span>
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400">
                <Landmark className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-purple-600 dark:text-purple-400 font-mono">₹1.42 Cr</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>CGTMSE Covered</span>
              <span className="text-purple-600 font-bold group-hover:translate-x-1 transition-transform">Details →</span>
            </div>
          </div>
        </div>
      ) : isBuyer ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => navigateTo('marketplace')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md hover:border-amber-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Active Buy Contracts
              </span>
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {buyerOrders.length} Contracts
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>State: {activeState}</span>
              <span className="text-amber-600 font-bold group-hover:translate-x-1 transition-transform">View →</span>
            </div>
          </div>

          <div 
            onClick={() => navigateTo('marketplace')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Committed Supply (Tonnes)
              </span>
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">652 T</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>FPO / Farmer Pledges</span>
              <span className="text-emerald-600 font-bold group-hover:translate-x-1 transition-transform">Track →</span>
            </div>
          </div>

          <div 
            onClick={() => navigateTo('intelligence')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md hover:border-teal-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Procurement Hubs
              </span>
              <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-teal-600 dark:text-teal-400 font-mono">8 Mandis</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>Farm-gate Direct Collection</span>
              <span className="text-teal-600 font-bold group-hover:translate-x-1 transition-transform">Map →</span>
            </div>
          </div>

          <div 
            onClick={() => navigateTo('intelligence')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md hover:border-purple-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Wholesale Price Index
              </span>
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-purple-600 dark:text-purple-400 font-mono">+4.8%</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>eNAM Mandi Benchmark</span>
              <span className="text-purple-600 font-bold group-hover:translate-x-1 transition-transform">Trends →</span>
            </div>
          </div>
        </div>
      ) : isFPO ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => navigateTo('marketplace')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md hover:border-teal-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Member Farmers
              </span>
              <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400">
                <Wheat className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-teal-600 dark:text-teal-400 font-mono">340 Kisan</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>Cluster: {activeDistrict}</span>
              <span className="text-teal-600 font-bold group-hover:translate-x-1 transition-transform">Members →</span>
            </div>
          </div>

          <div 
            onClick={() => navigateTo('marketplace')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md hover:border-amber-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Bulk Demand Orders
              </span>
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {buyerOrders.length} Bulk Leads
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>50 - 500 Tonnes Orders</span>
              <span className="text-amber-600 font-bold group-hover:translate-x-1 transition-transform">Pool Supply →</span>
            </div>
          </div>

          <div 
            onClick={() => navigateTo('feasibility')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Processing Capacity
              </span>
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">450 MT</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>Cleaning / Sortex / Cold Hub</span>
              <span className="text-emerald-600 font-bold group-hover:translate-x-1 transition-transform">Units →</span>
            </div>
          </div>

          <div 
            onClick={() => navigateTo('businessplan')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md hover:border-purple-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                SFAC / NABARD Grants
              </span>
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400">
                <Landmark className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-purple-600 dark:text-purple-400 font-mono">₹15 Lakh</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>Equity Matching Grant</span>
              <span className="text-purple-600 font-bold group-hover:translate-x-1 transition-transform">DPR →</span>
            </div>
          </div>
        </div>
      ) : (
        /* RURAL ENTREPRENEUR DASHBOARD CARDS */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => navigateTo('feasibility')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Feasibility Score
              </span>
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {report?.overallFeasibilityScore || 88}/100
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>{report?.readinessVerdict || 'Highly Feasible'}</span>
              <span className="text-emerald-600 font-bold group-hover:translate-x-1 transition-transform">View →</span>
            </div>
          </div>

          <div 
            onClick={() => navigateTo('financials')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md hover:border-blue-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Eligible Loan (90%)
              </span>
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400">
                <Landmark className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">
              ₹{(financials?.loanAmount || 900000).toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>10% Equity: ₹{(financials?.marginCapital || 100000).toLocaleString('en-IN')}</span>
              <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform">10:90 →</span>
            </div>
          </div>

          <div 
            onClick={() => navigateTo('financials')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md hover:border-amber-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Scheme & Interest
              </span>
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 truncate">
              {financials?.scheme.name || 'Term Loan Scheme'}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>{financials?.scheme.interestRateAnnual || 8}% p.a. • 3y Tenure</span>
              <span className="text-amber-600 font-bold group-hover:translate-x-1 transition-transform">Rules →</span>
            </div>
          </div>

          <div 
            onClick={() => navigateTo('marketplace')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md hover:border-purple-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Buyer Demand Lock
              </span>
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-purple-600 dark:text-purple-400 font-mono">
              {buyerOrders.length} Buyers
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>Pre-bulk buyback contracts</span>
              <span className="text-purple-600 font-bold group-hover:translate-x-1 transition-transform">Pledge →</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. QUICK ACTION & WORKSPACE LAUNCHER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => navigateTo(isBankOfficer ? 'businessplan' : isBuyer ? 'marketplace' : 'feasibility')}
          className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mb-3">
              {isBankOfficer ? <FileSpreadsheet className="w-5 h-5" /> : isBuyer ? <ShoppingBag className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isBankOfficer ? 'DPR Project Report Appraisal' : isBuyer ? 'Post Commodity Demand' : isFPO ? 'Cluster Cold Chain & Processing' : 'Project Feasibility Check'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {isBankOfficer
                ? 'Assess detailed project cost, debt service ratio and machinery invoices submitted by entrepreneurs.'
                : isBuyer
                ? 'Publish bulk commodity requirements with guaranteed price settlement for regional producers.'
                : isFPO
                ? 'Check collective crop pooling, cold storage capacity, and AIF subsidy feasibility for farmer clusters.'
                : 'Evaluate raw material availability, local market competition, and target customer demand.'}
            </p>
          </div>
          <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <span>Open Tool</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div 
          onClick={() => navigateTo('financials')}
          className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-blue-500 transition-all cursor-pointer flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center mb-3">
              <Landmark className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              10:90 Govt Loan Calculator
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Calculate 90% loan amount against 10% own equity with subsidized 6.5% - 8% interest rates, moratorium periods, and PMEGP/Mudra schemes.
            </p>
          </div>
          <div className="text-xs font-bold text-blue-600 flex items-center gap-1">
            <span>Calculate Roadmaps</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div 
          onClick={() => navigateTo('advisor')}
          className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-teal-500 transition-all cursor-pointer flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center mb-3">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              AI Udyami Sathi (24/7 Advisor)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Instant voice and text guidance tailored to {activeState}'s agro-processing hubs, machinery suppliers, and state subsidy frameworks.
            </p>
          </div>
          <div className="text-xs font-bold text-teal-600 flex items-center gap-1">
            <span>Ask AI Advisor</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

    </div>
  );
};
