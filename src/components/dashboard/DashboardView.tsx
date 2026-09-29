import React from 'react';
import { 
  Sparkles, 
  Landmark, 
  ShoppingBag, 
  MapPin, 
  Bot, 
  FileSpreadsheet, 
  Radar, 
  ArrowRight, 
  Clock, 
  CheckCircle2,
  Activity,
  Award
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
  onOpenJudgeDemo?: () => void;
  report?: FeasibilityReport | null;
  latestReport?: FeasibilityReport | null;
  financials?: FinancialRoadmap | null;
  latestFinancials?: FinancialRoadmap | null;
  buyerOrders?: PreBulkDemandOrder[];
  currentLanguage?: Language;
  location?: LocationCatchment;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onSelectView,
  onOpenJudgeDemo,
  report: propReport,
  latestReport,
  financials: propFinancials,
  latestFinancials,
  buyerOrders: propOrders,
  location
}) => {
  const report = latestReport || propReport;
  const financials = latestFinancials || propFinancials;
  const buyerOrders = propOrders || INITIAL_PRE_BULK_ORDERS;

  const navigateTo = (tab: NavigationTab) => {
    if (onNavigate) onNavigate(tab);
    else if (onSelectView) onSelectView(tab as ActiveView);
  };

  const activeVillage = location?.panchayat || report?.location.village || 'Janori';
  const activeDistrict = location?.district || report?.location.district || 'Nashik';

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* 1. TOP HERO / WELCOME BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 border border-emerald-900/40 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Unified Agri-FinTech & Business Intelligence Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Turn Your Local Idea Into a Fundable Business
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              AI-powered feasibility, 90% loan auto-routing, and institutional buyer demand connectivity for {activeVillage}, {activeDistrict}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
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
          </div>
        </div>
      </div>

      {/* 2. CORE KPI DASHBOARD CARDS (8 High-Density Visual Metric Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Feasibility Score */}
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

        {/* Card 2: 10% Margin → 90% Loan */}
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

        {/* Card 3: Government Scheme */}
        <div 
          onClick={() => navigateTo('financials')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md hover:border-amber-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Routed Scheme
            </span>
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white line-clamp-1">
            {financials?.scheme.name || 'Term Loan Scheme'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>{financials?.scheme.interestRateAnnual || 8.0}% • {financials?.scheme.moratoriumMonths || 6}M Grace</span>
            <span className="text-amber-600 font-bold group-hover:translate-x-1 transition-transform">Details →</span>
          </div>
        </div>

        {/* Card 4: Institutional Orders */}
        <div 
          onClick={() => navigateTo('marketplace')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md hover:border-purple-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Buyer Demands
            </span>
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-purple-600 dark:text-purple-400 font-mono">
            {buyerOrders.length} Orders
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>Pre-Bulk Off-Take</span>
            <span className="text-purple-600 font-bold group-hover:translate-x-1 transition-transform">Market →</span>
          </div>
        </div>

      </div>

      {/* 3. DUAL-ECOSYSTEM SPOTLIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Module 1: Feasibility Spotlight */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
                PS 26091
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Hyper-Local Catchment Intelligence
              </h3>
            </div>
            <button
              onClick={() => navigateTo('feasibility')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Full Study</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 dark:text-emerald-300">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Catchment: {activeVillage}, {activeDistrict} (10 km Radius)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div>
                <span className="text-slate-500">Estimated Reach:</span>
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {report?.marketReach.estimatedConsumerCount.toLocaleString('en-IN') || '28,400'} Consumers
                </div>
              </div>
              <div>
                <span className="text-slate-500">Competitor Density:</span>
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {report?.competitorMapping.competitorDensityPer10k || 1.4} / 10k Population
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Verified raw material surplus within 5 km radius</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>High margin value addition opportunity identified</span>
            </div>
          </div>
        </div>

        {/* Module 2: Demand & Marketplace Spotlight */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-100 text-amber-900 font-bold text-xs">
                PS 26033
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Pre-Bulk Buyer Orders
              </h3>
            </div>
            <button
              onClick={() => navigateTo('marketplace')}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {buyerOrders.slice(0, 2).map((ord) => (
              <div
                key={ord.id}
                onClick={() => navigateTo('marketplace')}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-amber-400 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{ord.product}</div>
                  <div className="text-[10px] text-slate-500">{ord.buyerName} • ₹{ord.offeredPricePerUnit.toLocaleString('en-IN')}/{ord.unit}</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  {ord.requiredQuantityTonnes} {ord.unit} Required
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigateTo('opportunities')}
              className="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5"
            >
              <Radar className="w-3.5 h-3.5" />
              <span>Opportunity Radar</span>
            </button>
            <button
              onClick={() => navigateTo('businessplan')}
              className="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Generate DPR</span>
            </button>
          </div>
        </div>

      </div>

      {/* SIH Judge Demo Evaluation Banner */}
      {onOpenJudgeDemo && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">SIH Judge Automated Walkthrough</h4>
              <p className="text-xs text-slate-500">
                Experience the unified 5-step journey across Catchment Feasibility, 10:90 Leverage, and Buyer Demand.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenJudgeDemo}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer shrink-0 transition-all active:scale-95"
          >
            Launch Judge Demo →
          </button>
        </div>
      )}

    </div>
  );
};
