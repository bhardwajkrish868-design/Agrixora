import React from 'react';
import { 
  Printer, 
  Sparkles,
  MapPin,
  TrendingUp
} from 'lucide-react';
import type { FeasibilityReport, FinancialRoadmap, Language, UserInputForm, LocationCatchment } from '../../types';
import { DEMO_PRESETS } from '../../data/regionsData';

interface BusinessPlanGeneratorViewProps {
  report: FeasibilityReport | null;
  financials: FinancialRoadmap | null;
  formData?: UserInputForm;
  location?: LocationCatchment;
  currentLanguage: Language;
  onOpenFeasibility?: () => void;
}

export const BusinessPlanGeneratorView: React.FC<BusinessPlanGeneratorViewProps> = ({
  report,
  financials,
  formData: externalFormData,
  location,
  onOpenFeasibility
}) => {
  const formData = externalFormData || DEMO_PRESETS[0].formData;
  const activeVillage = location?.panchayat || formData.location.village || 'Janori';
  const activeDistrict = location?.district || formData.location.district || 'Nashik';
  const activeBlock = location?.block || formData.location.block || 'Dindori';
  const activeRadius = location?.catchmentRadiusKm || formData.location.catchmentRadiusKm || 10;

  const handlePrint = () => {
    import('../../services/printService').then(m => {
      m.printTargetElement('comprehensive-dpr-document', `AgriXora_Comprehensive_DPR_${report?.id || 'Dossier'}`);
    });
  };

  const SECTIONS = [
    { num: 1, title: 'Business Overview', desc: `${report?.businessName || 'Rural Micro Enterprise'} established in ${activeVillage}, ${activeDistrict}. Formally structured under the ${financials?.scheme.name || 'Micro Finance Scheme'}.` },
    { num: 2, title: 'Market Reach & Catchment Analysis', desc: `Estimated consumer catchment of ~${report?.marketReach.estimatedConsumerCount.toLocaleString('en-IN') || '28,400'} individuals within a ${activeRadius} km radius across ${activeBlock} block.` },
    { num: 3, title: 'Product & Service Specifications', desc: `Standard unadulterated primary processing with eco-friendly pouch packaging, verified weighing scales, and FSSAI basic compliance standards.` },
    { num: 4, title: 'Target Customer Demographics', desc: `52% rural farming households, 28% weekly village haat bulk traders, and 20% institutional off-take (local kitchens, bulk aggregators).` },
    { num: 5, title: 'Competitive Strategy & Local Moat', desc: `Competitor density in ${activeBlock} is ${report?.competitorMapping.competitorDensityPer10k || 1.4} units/10k population. Moat achieved via hygienic processing and direct farmer procurement.` },
    { num: 6, title: 'Pricing & Margin Policy', desc: `Competitive cost-plus pricing structured ~8% below distant packaged FMCG brands while maintaining a 28-35% gross operating margin.` },
    { num: 7, title: 'Operations & Raw Material Sourcing', desc: `Direct harvest procurement from local agrarian growers within 10 km, reducing transportation freight by up to 80%.` },
    { num: 8, title: 'Capital Investment Schedule (CapEx)', desc: `Total CapEx requirement of ₹${(financials?.capexAmount || 520000).toLocaleString('en-IN')} allocated for heavy processing machinery, electrical wiring, and shed preparation.` },
    { num: 9, title: 'Working Capital Reserve (OpEx)', desc: `Initial 60-day working capital buffer of ₹${(financials?.workingCapitalAmount || 280000).toLocaleString('en-IN')} covering raw material stocks, wages, and utilities.` },
    { num: 10, title: 'Means of Finance (10:90 Leverage)', desc: `10% Beneficiary Equity (₹${(financials?.marginCapital || 80000).toLocaleString('en-IN')}) + 90% Concessional Bank Loan (₹${(financials?.loanAmount || 720000).toLocaleString('en-IN')}) = ₹${(financials?.projectCost || 800000).toLocaleString('en-IN')} Total Project Cost.` },
    { num: 11, title: 'Loan Repayment & Moratorium Terms', desc: `${financials?.scheme.moratoriumMonths || 6}-month principal grace period, followed by quarterly installments of ₹${(financials?.quarterlyEMI || 36500).toLocaleString('en-IN')} at ${financials?.scheme.interestRateAnnual || 8.0}% p.a. over ${financials?.scheme.tenureYears || 7} years.` },
    { num: 12, title: 'Revenue & Cash Flow Projections', desc: `Projected monthly turnover of ₹${(financials?.projectedMonthlyRevenue || 200000).toLocaleString('en-IN')} against operating expenses of ₹${(financials?.projectedMonthlyOpEx || 140000).toLocaleString('en-IN')}, generating ₹${(financials?.projectedMonthlyNetProfit || 48000).toLocaleString('en-IN')} net monthly profit.` },
    { num: 13, title: 'Debt Service Coverage Ratio (DSCR)', desc: `DSCR calculated at ${financials?.debtServiceCoverageRatio || 3.2}x, exceeding the institutional safe lending benchmark (>1.5x).` },
    { num: 14, title: 'Risk Matrix & Mitigation Safeguards', desc: `Protection against seasonal price swings via 45-day storage inventory; strict 90% cash/UPI policy to prevent uncollateralized credit traps.` },
    { num: 15, title: 'Implementation Roadmap & Milestones', desc: `Month 1: Sanction & Udyam registration; Month 2-3: Machine installation; Month 4: Trial production & pre-bulk order delivery.` }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 dark:bg-purple-950 dark:text-purple-400 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            Institutional Bank Appraisal Dossier
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            15-Section Comprehensive Business Plan (DPR)
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-1">
            Complete investor and bank-ready Detailed Project Report formatted for Lead District Banks, NABARD, and District Industries Centres (DIC).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenFeasibility && (
            <button
              onClick={onOpenFeasibility}
              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
            >
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Modify Inputs</span>
            </button>
          )}
          <button
            onClick={handlePrint}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Download / Print DPR (PDF)</span>
          </button>
        </div>
      </div>

      {/* 15-Section Printable Document Dossier */}
      <div id="comprehensive-dpr-document" className="bg-white text-slate-950 rounded-3xl border border-slate-300 p-8 sm:p-12 shadow-xl space-y-8 font-serif">
        
        {/* Document Header & Seal */}
        <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-slate-600 font-sans font-bold">
              Government Micro-Enterprise Credit Appraisal Framework
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-slate-950 mt-1">
              DETAILED PROJECT REPORT (DPR)
            </h2>
            <div className="text-xs font-sans text-slate-600 mt-1 flex items-center gap-2">
              <span>Beneficiary: <strong className="text-slate-900">{formData.entrepreneurName || 'Rameshwar Kumar'}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {activeVillage}, {activeDistrict}</span>
            </div>
          </div>

          <div className="text-right font-sans text-xs">
            <div className="font-bold text-slate-900">DPR Ref: {report?.id || 'DPR-782910'}</div>
            <div className="text-slate-500">Date: {report?.createdAt || new Date().toLocaleDateString('en-IN')}</div>
            <div className="text-emerald-800 font-bold mt-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
              {financials?.scheme.name || 'Term Loan Scheme'}
            </div>
          </div>
        </div>

        {/* Financial Highlights Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-sans text-xs">
          <div>
            <span className="text-slate-500">Total Project Cost:</span>
            <div className="text-base font-black text-slate-900 font-mono">
              ₹{(financials?.projectCost || 800000).toLocaleString('en-IN')}
            </div>
          </div>
          <div>
            <span className="text-slate-500">Beneficiary Margin (10%):</span>
            <div className="text-base font-black text-slate-900 font-mono">
              ₹{(financials?.marginCapital || 80000).toLocaleString('en-IN')}
            </div>
          </div>
          <div>
            <span className="text-slate-500">Eligible Loan (90%):</span>
            <div className="text-base font-black text-emerald-700 font-mono">
              ₹{(financials?.loanAmount || 720000).toLocaleString('en-IN')}
            </div>
          </div>
          <div>
            <span className="text-slate-500">Interest / Tenure:</span>
            <div className="text-base font-bold text-slate-900">
              {financials?.scheme.interestRateAnnual || 8.0}% • {financials?.scheme.tenureYears || 7} Yrs
            </div>
          </div>
        </div>

        {/* 15 Sections Grid */}
        <div className="space-y-6 font-sans">
          {SECTIONS.map((sec) => (
            <div key={sec.num} className="space-y-1.5 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center">
                  {sec.num}
                </span>
                <h3 className="font-bold text-sm text-slate-900">{sec.title}</h3>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed pl-8">
                {sec.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Signatures & Bank Declaration */}
        <div className="pt-8 border-t-2 border-slate-300 font-sans text-xs grid grid-cols-2 gap-12">
          <div>
            <p className="text-slate-500 italic mb-12">
              "I confirm that all financial declarations and operational plans submitted in this DPR are truthful and I agree to deposit the 10% margin upon loan sanction."
            </p>
            <div className="border-t border-slate-900 pt-1 font-bold">
              Signature of Beneficiary / Entrepreneur
            </div>
          </div>

          <div className="text-right">
            <p className="text-slate-500 italic mb-12">
              "Recommended for credit sanction under {financials?.scheme.name || 'Term Loan Scheme'} subject to standard documentation."
            </p>
            <div className="border-t border-slate-900 pt-1 font-bold">
              Lead Bank Branch Manager / DIC Officer
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
