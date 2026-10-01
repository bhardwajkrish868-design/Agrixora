import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileText,
  ShieldCheck,
  Building2,
  ExternalLink,
  Coins,
  Wheat,
  Sliders,
  Sparkles,
  Printer,
  Award,
  Clock,
  XCircle,
  Info,
  MapPin
} from 'lucide-react';
import type { Language, NavigationTab } from '../../types';

interface LoanRoadmapViewProps {
  currentLanguage: Language;
  onNavigate?: (tab: NavigationTab) => void;
  userMargin?: number;
  userState?: string;
  userDistrict?: string;
}

export const LoanRoadmapView: React.FC<LoanRoadmapViewProps> = ({
  currentLanguage,
  onNavigate,
  userMargin = 50000,
  userState = 'Maharashtra',
  userDistrict = 'Nashik'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'journey' | 'utilization' | 'compliance' | 'checklist' | 'portals'>('journey');
  
  // Interactive Project Cost & Loan Simulator
  const [projectCost, setProjectCost] = useState<number>(() => {
    return userMargin ? userMargin * 10 : 1000000;
  });
  const marginPercentage = 10;
  const loanPercentage = 90;
  
  const marginAmount = (projectCost * marginPercentage) / 100;
  const loanAmount = (projectCost * loanPercentage) / 100;
  
  // Fund Allocation Splits (Approved Standard Bank Ratios)
  const machineryAmount = Math.round(loanAmount * 0.55);
  const civilShedAmount = Math.round(loanAmount * 0.20);
  const workingCapitalAmount = Math.round(loanAmount * 0.15);
  const statutorySolarAmount = Math.round(loanAmount * 0.10);

  const isHindi = currentLanguage === 'hi';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5 animate-fadeIn max-w-7xl mx-auto pb-12">
      
      {/* Visual Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>{isHindi ? '10:90 ऋण स्वीकृति व १००% सही उपयोग मार्गदर्शिका' : '10:90 Concessional Credit & Fund Roadmap'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              {isHindi 
                ? 'लोन कैसे लें और पैसा कहाँ-कहाँ खर्च कर सकते हैं?' 
                : 'How to Secure 10:90 Bank Loan & Permissible Fund Utilization'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isHindi
                ? 'पीएमएफएमई (PMFME), पीएमईजीपी (PMEGP), एआईएफ (AIF) योजनाओं के तहत बिना किसी बिचौलिए के ऋण प्राप्त करने की पूरी प्रक्रिया और बैंक ऑडिट-स्वीकृत खर्च दिशा-निर्देश।'
                : 'Step-by-step roadmap to obtain subsidized bank credit with 10% promoter equity and exact compliance matrix for machinery, civil shed, and raw material allocations.'}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-semibold">
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>{userDistrict}, {userState}</span>
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>10% Margin : 90% Loan</span>
              </span>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Up to 35% Capital Subsidy</span>
              </span>
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>CGTMSE Collateral-Free</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate && onNavigate('businessplan')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>{isHindi ? 'बैंक DPR तैयार करें' : 'Generate Bank DPR'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              title="Print Loan Roadmap Dossier"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>{isHindi ? 'प्रिंट / सेव PDF' : 'Print Guide'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sub-Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-slate-900/80 dark:bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md no-print">
        <button
          onClick={() => setActiveSubTab('journey')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'journey'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{isHindi ? '१. लोन लेने की प्रक्रिया (6 Steps)' : '1. Loan Process (6 Steps)'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('utilization')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'utilization'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{isHindi ? '२. पैसे का सही उपयोग (Fund Split)' : '2. Fund Allocation (Usage)'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('compliance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'compliance'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isHindi ? '३. क्या मान्य है / क्या नहीं (Audit)' : '3. Permissible vs Prohibited'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('checklist')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'checklist'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{isHindi ? '४. जरूरी दस्तावेज व इंटरव्यू' : '4. Document Checklist & Prep'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('portals')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'portals'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>{isHindi ? '५. सरकारी पोर्टल लिंक्स' : '5. Govt Application Portals'}</span>
        </button>
      </div>

      {/* TAB 1: 6-STEP LOAN ACQUISITION ROADMAP */}
      {activeSubTab === 'journey' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 text-slate-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>{isHindi ? '१०:९० ऋण स्वीकृति की सम्पूर्ण ६-चरणीय यात्रा' : 'The Complete 6-Step 10:90 Loan Journey'}</span>
                  <span className="text-emerald-400">🌾</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isHindi
                    ? 'AgriXora रिपोर्ट बनाने से लेकर बैंक खाते में 90% लोन व सब्सिडी क्रेडिट होने तक का चरणबद्ध मार्गदर्शन।'
                    : 'From generating your certified DPR to receiving 90% bank loan disbursement and DBT capital subsidy credit.'}
                </p>
              </div>
              <div className="px-3 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 w-fit">
                <Clock className="w-3.5 h-3.5" />
                <span>{isHindi ? 'औसतन समय: 21 से 30 दिन' : 'Avg. Duration: 21 to 30 Days'}</span>
              </div>
            </div>

            {/* Step Grid Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 relative flex flex-col justify-between hover:border-emerald-400 transition-all group">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                      STEP 01
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Day 1</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                    {isHindi ? 'व्यवहार्यता जांच व बैंक DPR निर्माण' : 'Feasibility Check & Bank DPR'}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isHindi
                      ? 'AgriXora पर अपने क्षेत्र (५-१० किमी) की कच्ची सामग्री का विश्लेषण करें और बैंक-मान्य DPR (5-वर्षीय लाभ-हानि व DSCR) 1-क्लिक में डाउनलोड करें।'
                      : 'Run catchment feasibility on AgriXora and download your audited 5-year bank-ready DPR containing DSCR (>1.75x) and IRR metrics.'}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-emerald-400 font-bold flex items-center justify-between">
                  <span>{isHindi ? 'AgriXora द्वारा स्वतः पूर्ण' : 'Auto-Generated by AgriXora'}</span>
                  <span>✓</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 relative flex flex-col justify-between hover:border-teal-500 transition-all group">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-teal-400 bg-teal-950 px-2.5 py-0.5 rounded-full border border-teal-500/40">
                      STEP 02
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Day 2 - 3</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white group-hover:text-teal-300 transition-colors">
                    {isHindi ? 'उद्यम MSME व आधार e-KYC' : 'Udyam MSME & Aadhaar e-KYC'}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isHindi
                      ? 'उद्यम पोर्टल (udyamregistration.gov.in) पर अपने उद्यम का निशुल्क 5 मिनट में पंजीकरण करें। पैन कार्ड और आधार लिंक बैंक खाता तैयार रखें।'
                      : 'Complete free 5-minute registration on the Udyam portal to get your Udyam MSME Certificate and keep Aadhaar-linked bank account active.'}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400 font-semibold flex items-center justify-between">
                  <span>{isHindi ? 'निःशुल्क सरकारी पोर्टल' : 'Free Government Portal'}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 relative flex flex-col justify-between hover:border-blue-500 transition-all group">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-blue-400 bg-blue-950 px-2.5 py-0.5 rounded-full border border-blue-500/40">
                      STEP 03
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Day 4 - 7</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white group-hover:text-blue-300 transition-colors">
                    {isHindi ? 'सरकारी पोर्टल पर सब्सिडी आवेदन' : 'Govt Subsidy Portal Application'}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isHindi
                      ? 'JanSamarth.in, PMFME या PMEGP पोर्टल पर आवेदन करें। AgriXora DPR और मशीनरी कोटेशन अपलोड करके अपनी पसंदीदा बैंक शाखा चुनें।'
                      : 'File application on JanSamarth / PMFME / PMEGP. Upload your AgriXora DPR, machinery vendor quotations, and select preferred bank branch.'}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-blue-400 font-semibold flex items-center justify-between">
                  <span>{isHindi ? 'JanSamarth / PMFME' : 'JanSamarth / PMFME Portal'}</span>
                  <span>↗</span>
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 relative flex flex-col justify-between hover:border-amber-500 transition-all group">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                      STEP 04
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Day 8 - 15</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white group-hover:text-amber-300 transition-colors">
                    {isHindi ? 'बैंक फील्ड निरीक्षण व क्रेडिट ऑडिट' : 'Bank Branch Field Appraisal'}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isHindi
                      ? 'बैंक फील्ड ऑफिसर आपके स्थल (शेड/जमीन) का भौतिक निरीक्षण करेंगे। AgriXora का "Credit Appraisal Memo" और ऑफ-टेकर खरीद अनुबंध प्रस्तुत करें।'
                      : 'Bank manager inspects unit site. Present your AgriXora verified feasibility dossier and institutional forward buyback contract.'}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-amber-400 font-semibold flex items-center justify-between">
                  <span>{isHindi ? 'DSCR > 1.75x द्वारा आसान स्वीकृति' : 'DSCR > 1.75x Approval'}</span>
                  <span>🏦</span>
                </div>
              </div>

              {/* Step 5 */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 relative flex flex-col justify-between hover:border-indigo-500 transition-all group">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-indigo-400 bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-500/40">
                      STEP 05
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Day 16 - 20</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                    {isHindi ? 'ऋण स्वीकृति व १०% मार्जिन जमा' : 'Loan Sanction & 10% Margin'}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isHindi
                      ? 'बैंक से औपचारिक स्वीकृति पत्र (Sanction Letter) प्राप्त होने पर अपनी 10% स्वयं की मार्जिन पूंजी चालू खाते में जमा करें।'
                      : 'Upon receipt of formal Bank Sanction Letter, deposit your 10% promoter equity margin money into the designated project current account.'}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-indigo-400 font-semibold flex items-center justify-between">
                  <span>{isHindi ? '१०% प्रमोटर योगदान' : '10% Promoter Margin'}</span>
                  <span>💰</span>
                </div>
              </div>

              {/* Step 6 */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-950 to-teal-950/60 border border-emerald-500/40 relative flex flex-col justify-between hover:border-emerald-400 transition-all group">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-300 bg-emerald-900/80 px-2.5 py-0.5 rounded-full border border-emerald-400/50">
                      STEP 06 (FINAL)
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">Day 21 - 30</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-emerald-200 group-hover:text-emerald-100 transition-colors">
                    {isHindi ? '९०% ऋण वितरण व सब्सिडी डीबीटी' : '90% Loan Disbursal & Subsidy DBT'}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isHindi
                      ? 'बैंक सीधे मशीनरी सप्लायर को RTGS से भुगतान करता है और सरकारी सब्सिडी (35%) आपके खाते में TDR/DBT के रूप में क्रेडिट हो जाती है।'
                      : 'Bank releases 90% term loan directly to machinery vendors via RTGS. Capital subsidy (up to 35%) is credited to your bank account via DBT.'}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-emerald-500/30 text-[11px] text-emerald-300 font-bold flex items-center justify-between">
                  <span>{isHindi ? 'यूनिट चालू व उत्पादन शुरू!' : 'Unit Live & Commissioned!'}</span>
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                </div>
              </div>

            </div>

            {/* Bottom Tip */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
              <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <span className="font-bold text-emerald-300">
                  {isHindi ? 'विशेष लाभ (AgriXora Advantage): ' : 'AgriXora Advantage: '}
                </span>
                {isHindi
                  ? 'AgriXora का DPR और ऑफ-टेकर खरीद अनुबंध संलग्न करने से बैंक में ऋण अस्वीकृति (Rejection) की संभावना 85% तक कम हो जाती है।'
                  : 'Attaching an AgriXora audited DPR and verified buyback contract reduces loan rejection rates by over 85% at public and private sector banks.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SMART FUND ALLOCATION & UTILIZATION CALCULATOR */}
      {activeSubTab === 'utilization' && (
        <div className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 text-slate-100 space-y-6">
            
            {/* Header & Slider */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <span>{isHindi ? 'लोन की राशि का सही व प्रमाणित आवंटन' : 'Smart Loan Fund Allocation Simulator'}</span>
                    <span className="text-teal-400">🎛️</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isHindi
                      ? 'अपनी परियोजना लागत चुनें और देखें कि बैंक व सरकारी नियमों के अनुसार किस मद में कितना पैसा खर्च करना अनिवार्य है।'
                      : 'Select your total enterprise CAPEX/OPEX to see the statutory percentage & rupee allocation required for bank audit compliance.'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">{isHindi ? 'कुल परियोजना लागत' : 'Total Project Cost'}</div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                    ₹{projectCost.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Slider Component */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>₹1,00,000 (Micro Unit)</span>
                  <span className="font-bold text-white">Slide to Adjust Project Cost</span>
                  <span>₹1,00,00,000 (₹1 Crore Scale)</span>
                </div>
                <input
                  type="range"
                  min="200000"
                  max="10000000"
                  step="50000"
                  value={projectCost}
                  onChange={(e) => setProjectCost(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400">{isHindi ? '१०% स्वयं की मार्जिन' : '10% Promoter Margin'}</div>
                    <div className="font-bold text-amber-400 font-mono mt-0.5">₹{marginAmount.toLocaleString('en-IN')}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400">{isHindi ? '९०% बैंक रियायती ऋण' : '90% Bank Loan'}</div>
                    <div className="font-bold text-emerald-400 font-mono mt-0.5">₹{loanAmount.toLocaleString('en-IN')}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400">{isHindi ? 'संभावित सब्सिडी (35%)' : 'PMFME/PMEGP Subsidy'}</div>
                    <div className="font-bold text-teal-400 font-mono mt-0.5">₹{Math.min(projectCost * 0.35, 1000000).toLocaleString('en-IN')}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400">{isHindi ? 'ब्याज दर (AIF सबवेंशन)' : 'Effective Interest Rate'}</div>
                    <div className="font-bold text-blue-400 font-mono mt-0.5">6.5% - 7.5% p.a.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4-Pillar Fund Allocation Matrix */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {isHindi ? 'ऋण राशि का अनिवार्य खर्च विवरण (बैंक ऑडिट अनुरूप):' : 'Mandatory Bank-Audited Fund Utilization Breakdown:'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                
                {/* 1. Machinery */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Wheat className="w-3.5 h-3.5" />
                      <span>{isHindi ? '१. मशीनरी व उपकरण (55%)' : '1. Machinery & Line (55%)'}</span>
                    </span>
                  </div>
                  <div className="text-lg font-black text-white font-mono">
                    ₹{machineryAmount.toLocaleString('en-IN')}
                  </div>
                  <ul className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-slate-800">
                    <li>• {isHindi ? 'कोल्ड-प्रेस / ग्रेडर / ड्रायर मशीनें' : 'Primary processing machines'}</li>
                    <li>• {isHindi ? 'ऑटोमैटिक पैकेजिंग व सीलिंग लाइन' : 'Packaging & filling units'}</li>
                    <li>• {isHindi ? 'मशीनरी डिलीवरी व इंस्टालेशन' : 'Freight & commissioning'}</li>
                  </ul>
                </div>

                {/* 2. Civil Shed & Works */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-blue-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{isHindi ? '२. शेड व निर्माण कार्य (20%)' : '2. Civil Shed & Elect. (20%)'}</span>
                    </span>
                  </div>
                  <div className="text-lg font-black text-white font-mono">
                    ₹{civilShedAmount.toLocaleString('en-IN')}
                  </div>
                  <ul className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-slate-800">
                    <li>• {isHindi ? 'हाइजीनिक प्रोसेसिंग शेड व फ्लोरिंग' : 'Food-grade processing shed'}</li>
                    <li>• {isHindi ? '३-फेज पावर कनेक्शन व वायरिंग' : '3-Phase industrial wiring'}</li>
                    <li>• {isHindi ? 'कच्चा व तैयार माल स्टोरेज रैक' : 'Storage racks & water lines'}</li>
                  </ul>
                </div>

                {/* 3. Working Capital & Raw Material */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5" />
                      <span>{isHindi ? '३. कच्चा माल व वर्किंग कैपिटल (15%)' : '3. Working Capital (15%)'}</span>
                    </span>
                  </div>
                  <div className="text-lg font-black text-white font-mono">
                    ₹{workingCapitalAmount.toLocaleString('en-IN')}
                  </div>
                  <ul className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-slate-800">
                    <li>• {isHindi ? '३-६ माह का कच्चा माल (किसान खरीद)' : 'First 3 months raw crop purchase'}</li>
                    <li>• {isHindi ? 'फूड-ग्रेड पाउच, बोतलें व लेबल' : 'Packaging pouches & labels'}</li>
                    <li>• {isHindi ? 'प्रारंभिक लेबर व बिजली बिल' : 'Initial utility & handling buffer'}</li>
                  </ul>
                </div>

                {/* 4. Statutory Licenses & Solar */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-teal-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{isHindi ? '४. लाइसेंस, FSSAI व सोलर (10%)' : '4. Licenses & Solar (10%)'}</span>
                    </span>
                  </div>
                  <div className="text-lg font-black text-white font-mono">
                    ₹{statutorySolarAmount.toLocaleString('en-IN')}
                  </div>
                  <ul className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-slate-800">
                    <li>• {isHindi ? 'FSSAI लाइसेंस व लैब टेस्टिंग किट' : 'FSSAI license & quality tests'}</li>
                    <li>• {isHindi ? 'सोलर पावर बैकअप / इनवर्टर' : 'Solar power backup system'}</li>
                    <li>• {isHindi ? 'ब्रांडिंग, बारकोड व जीएसटी' : 'Barcodes, GST & local trade NOC'}</li>
                  </ul>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: PERMISSIBLE VS PROHIBITED EXPENSES (BANK AUDIT GUIDELINES) */}
      {activeSubTab === 'compliance' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 text-slate-100 space-y-6">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>{isHindi ? 'ऋण राशि के अनुमत (Permissible) एवं वर्जित (Prohibited) खर्चे' : 'Permissible vs Prohibited Expenses Matrix'}</span>
                <span className="text-amber-400">⚖️</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isHindi
                  ? 'बैंक और सरकारी सब्सिडी ऑडिट में किसी भी तरह की आपत्ति या सब्सिडी रद्दीकरण (Cancelation) से बचने के लिए इन नियमों का पालन करें।'
                  : 'Strict compliance guide to prevent bank audit disallowances and ensure 100% DBT capital subsidy retention.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Permissible Column */}
              <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-4">
                <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-sm border-b border-emerald-500/30 pb-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>{isHindi ? '✅ पूर्णतः मान्य खर्चे (Permissible - Approved)' : '✅ Permissible & Eligible for Subsidy'}</span>
                </div>

                <div className="space-y-3 text-xs text-slate-200">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">1.</span>
                    <div>
                      <strong className="text-white">{isHindi ? 'प्रोसेसिंग मशीनरी व टूलींग: ' : 'Agro-processing Machinery: '}</strong>
                      {isHindi ? 'नई प्रमाणित मशीनें (GST बिल व कोटेशन के साथ)।' : 'Brand new certified machinery with GST invoices & manufacturer warranties.'}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">2.</span>
                    <div>
                      <strong className="text-white">{isHindi ? 'प्रोसेसिंग शेड व विद्युतीकरण: ' : 'Civil Shed & Power: '}</strong>
                      {isHindi ? 'यूनिट का शेड निर्माण, कंक्रीट फ्लोरिंग, 3-फेज ट्रांसफार्मर / इंडस्ट्रियल वायरिंग।' : 'Processing shed construction, flooring, and dedicated electrical load wiring.'}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">3.</span>
                    <div>
                      <strong className="text-white">{isHindi ? 'कच्चा माल व पैकेजिंग स्टॉक: ' : 'Raw Material & Packaging: '}</strong>
                      {isHindi ? 'किसानों से खरीदा गया शुरुआती कच्चा माल, फूड-ग्रेड पैकेजिंग मटेरियल।' : 'First cycle raw crop inventory purchased from local farmers + food grade packaging.'}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">4.</span>
                    <div>
                      <strong className="text-white">{isHindi ? 'लैब टेस्टिंग उपकरण व FSSAI: ' : 'Quality Testing & FSSAI: '}</strong>
                      {isHindi ? 'मॉइस्चर मीटर, रिफ्रेक्टोमीटर, FSSAI लाइसेंसिंग, बारकोड शुल्क।' : 'Moisture meters, lab testing kits, FSSAI regulatory fees, barcode allocations.'}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">5.</span>
                    <div>
                      <strong className="text-white">{isHindi ? 'ग्रीन एनर्जी व सोलर बैकअप: ' : 'Solar & Green Energy: '}</strong>
                      {isHindi ? 'प्रोसेसिंग यूनिट चलाने हेतु सोलर पैनल व हाइब्रिड इनवर्टर।' : 'Solar PV installations and hybrid inverters for uninterrupted power.'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Prohibited Column */}
              <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-4">
                <div className="flex items-center gap-2 text-rose-300 font-extrabold text-sm border-b border-rose-500/30 pb-2.5">
                  <XCircle className="w-5 h-5 text-rose-400" />
                  <span>{isHindi ? '❌ कतई गैर-मान्य खर्चे (Strictly Prohibited)' : '❌ Strictly Prohibited (Audit Violation)'}</span>
                </div>

                <div className="space-y-3 text-xs text-slate-200">
                  <div className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">1.</span>
                    <div>
                      <strong className="text-white">{isHindi ? 'निजी जमीन या प्लॉट की खरीद: ' : 'Purchase of Real Estate / Land: '}</strong>
                      {isHindi ? 'लोन की राशि से निजी जमीन खरीदना पूर्णतः गैरकानूनी है।' : 'Using bank loan funds to purchase real estate or speculative land plots.'}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">2.</span>
                    <div>
                      <strong className="text-white">{isHindi ? 'पुराने निजी कर्जों का भुगतान: ' : 'Settlement of Pre-existing Loans: '}</strong>
                      {isHindi ? 'साहूकार या किसी अन्य निजी लोन को चुकाने में इस्तेमाल नहीं किया जा सकता।' : 'Diverting project funds to pay off personal debts, informal loans, or credit cards.'}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">3.</span>
                    <div>
                      <strong className="text-white">{isHindi ? 'पुरानी / कबाड़ मशीनरी की खरीद: ' : 'Second-Hand / Used Machinery: '}</strong>
                      {isHindi ? 'बिना बिल व अप्रूवल के सेकंड-हैंड मशीन खरीदने पर सब्सिडी तुरंत खारिज होती है।' : 'Second-hand uncertified machinery without OEM warranty and GST e-invoices.'}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">4.</span>
                    <div>
                      <strong className="text-white">{isHindi ? 'निजी वाहन या लक्जरी सामान: ' : 'Personal Vehicles / Luxury Items: '}</strong>
                      {isHindi ? 'निजी कार, बाइक या घरेलू इलेक्ट्रॉनिक्स खरीदना सख्त मना है।' : 'Passenger vehicles, personal motorcycles, or non-commercial home electronics.'}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">5.</span>
                    <div>
                      <strong className="text-white">{isHindi ? 'शेयर बाजार या सट्टेबाजी: ' : 'Speculative Stock Trading: '}</strong>
                      {isHindi ? 'फंड का किसी भी गैर-व्यवसायिक निवेश में ट्रांसफर प्रतिबंधित है।' : 'Trading in equity markets, commodities speculation, or unauthorized transfers.'}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Warning Callout */}
            <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <span className="font-bold text-amber-300">
                  {isHindi ? 'बैंक डिस्बर्सल नियम: ' : 'Bank Disbursal Compliance: '}
                </span>
                {isHindi
                  ? 'बैंक मशीनरी का 90% पैसा सीधे वेंडर के बैंक खाते में RTGS करता है (कैश में नहीं मिलता)। इसलिए हमेशा केवल GST-पंजीकृत वेंडर से ही कोटेशन लें।'
                  : 'Banks disburse machinery funds directly to vendor current accounts via RTGS upon invoice submission, ensuring zero cash leakage and full audit safety.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DOCUMENT CHECKLIST & INTERVIEW PREPARATION */}
      {activeSubTab === 'checklist' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 text-slate-100 space-y-6">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>{isHindi ? 'बैंक ऋण आवेदन हेतु अनिवार्य दस्तावेज व इंटरव्यू गाइड' : 'Mandatory Document Dossier & Banker Interview Guide'}</span>
                <span className="text-blue-400">📋</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isHindi
                  ? 'बैंक शाखा जाने से पहले यह 8 दस्तावेज फाइल में तैयार रखें ताकि पहली ही मुलाकात में लोन स्वीकृत हो सके।'
                  : 'Keep this 8-point documentary checklist ready before visiting your lead bank manager to secure fast-track loan sanction.'}
              </p>
            </div>

            {/* 8-Point Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <h5 className="font-bold text-white">{isHindi ? 'AgriXora विस्तृत प्रोजेक्ट रिपोर्ट (DPR)' : 'AgriXora Detailed Project Report (DPR)'}</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">{isHindi ? '5-वर्षीय लाभ-हानि खाता, कैश फ्लो, और DSCR (> 1.75x) वित्तीय अनुपात।' : '5-year audited financial statement with DSCR, IRR, BEP and sensitivity testing.'}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <h5 className="font-bold text-white">{isHindi ? 'उद्यम MSME पंजीकरण प्रमाण पत्र' : 'Udyam MSME Registration Certificate'}</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">{isHindi ? 'udyamregistration.gov.in से 5 मिनट में जनरेट किया गया डिजिटल सर्टिफिकेट।' : 'Digital MSME Udyam Certificate generated free from official government portal.'}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <h5 className="font-bold text-white">{isHindi ? 'आवेदक के KYC दस्तावेज (आधार व पैन कार्ड)' : 'Applicant KYC (Aadhaar & PAN Card)'}</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">{isHindi ? 'आधार लिंक मोबाइल नंबर, पैन कार्ड और 3 पासपोर्ट साइज फोटो।' : 'Aadhaar linked to active mobile for OTP, PAN card, and 3 passport size photos.'}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">4</span>
                <div>
                  <h5 className="font-bold text-white">{isHindi ? 'मशीनरी वेंडर से प्रोफोर्मा इनवॉइस (कोटेशन)' : 'Machinery Vendor Proforma Quotation'}</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">{isHindi ? 'GST नंबर युक्त 2 अलग-अलग सप्लायर से मशीनरी का आधिकारिक कोटेशन।' : 'Formal machinery proforma quotation with GST details from verified OEM suppliers.'}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">5</span>
                <div>
                  <h5 className="font-bold text-white">{isHindi ? 'स्थल प्रमाण (जमीन खतौनी / 5-वर्षीय किराया अनुबंध)' : 'Premises Proof (7/12 Land Record / Rent Deed)'}</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">{isHindi ? 'स्वयं की जमीन का 7/12 खसरा-खतौनी या ₹100 स्टांप पर 5 साल का लीज एग्रीमेंट।' : 'Land title deed / 7/12 extract or 5-year notarized registered lease deed on stamp paper.'}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">6</span>
                <div>
                  <h5 className="font-bold text-white">{isHindi ? '६ माह का बैंक स्टेटमेंट' : '6-Month Savings Bank Account Statement'}</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">{isHindi ? '10% मार्जिन मनी की उपलब्धता दर्शाने वाला बैंक खाता स्टेटमेंट।' : 'Savings account statement reflecting 10% promoter equity margin money availability.'}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">7</span>
                <div>
                  <h5 className="font-bold text-white">{isHindi ? 'जाति व श्रेणी प्रमाण पत्र (यदि लागू हो)' : 'Category / Caste Certificate (If Applicable)'}</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">{isHindi ? 'SC/ST/OBC/महिला/दिव्यांग उद्यमियों के लिए 35% विशेष सब्सिडी हेतु।' : 'Required for special 35% subsidy tier for Women, SC/ST, OBC, or Ex-servicemen.'}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">8</span>
                <div>
                  <h5 className="font-bold text-white">{isHindi ? 'संस्थागत खरीदार खरीद अनुबंध (LoI)' : 'Institutional Buyback Agreement (LoI)'}</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">{isHindi ? 'AgriXora मार्केटप्लेस से FMCG / थोक खरीदार का खरीद वादा पत्र।' : 'Formal purchase agreement / letter of intent from verified bulk FMCG off-taker.'}</p>
                </div>
              </div>

            </div>

            {/* Top 3 Banker Questions */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>{isHindi ? 'बैंक मैनेजर के शीर्ष ३ सवाल और सही उत्तर (Interview Tips):' : 'Top 3 Bank Manager Questions & Winning Answers:'}</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-white">Q1: "कच्चा माल कहाँ से लाओगे और क्या वो साल भर मिलेगा?"</div>
                  <div className="text-slate-300 mt-1 text-[11px]">
                    👉 <em>उत्तर:</em> "सर, AgriXora Catchment Radar के अनुसार हमारे 10 किमी क्षेत्र में 450+ टन कच्चा माल उपलब्ध है और हमने स्थानीय किसान समूह से अनुबंध किया हुआ है।"
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-white">Q2: "तैयार माल कहाँ बेचोगे? पैसा फंसेगा तो नहीं?"</div>
                  <div className="text-slate-300 mt-1 text-[11px]">
                    👉 <em>उत्तर:</em> "सर, हमारे पास AgriXora Marketplace के तहत ITC / स्थानीय एग्रो होलसेलर का पूर्व-हस्ताक्षरित खरीद अनुबंध है जो सीधे बैंक खाते में भुगतान की गारंटी देता है।"
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-white">Q3: "महीने की EMI समय पर कैसे भरोगे?"</div>
                  <div className="text-slate-300 mt-1 text-[11px]">
                    👉 <em>उत्तर:</em> "सर, हमारे DPR में DSCR 2.1x है, यानी EMI से दुगना शुद्ध मुनाफा पहले वर्ष से ही निकल रहा है।"
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 5: OFFICIAL GOVERNMENT SCHEME PORTAL LAUNCHPAD */}
      {activeSubTab === 'portals' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 text-slate-100 space-y-6">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>{isHindi ? 'आधिकारिक सरकारी सब्सिडी व ऋण पोर्टल' : 'Official Government Scheme Portals'}</span>
                <span className="text-teal-400">🏛️</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isHindi
                  ? 'AgriXora DPR डाउनलोड करने के बाद इन आधिकारिक पोर्टल्स पर सीधे 1-क्लिक में ऑनलाइन आवेदन करें।'
                  : 'Direct official government portals to file online applications for concessional credit and DBT capital subsidies.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* JanSamarth */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 flex flex-col justify-between hover:border-emerald-400 transition-all group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                      National Credit Portal
                    </span>
                    <span className="text-xs font-bold text-slate-400">13 Schemes</span>
                  </div>
                  <h4 className="text-base font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                    JanSamarth Portal (जनसमर्थ पोर्टल)
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isHindi
                      ? 'भारत सरकार का एकीकृत क्रेडिट पोर्टल जहां PMEGP, AIF और सभी प्रमुख कृषि व व्यावसायिक लोन 1 ही जगह से अप्लाई होते हैं।'
                      : 'Government of India single-window credit platform connecting beneficiaries directly to 125+ commercial banks and lending institutions.'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-emerald-400">jansamarth.in</span>
                  <a
                    href="https://www.jansamarth.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <span>{isHindi ? 'पोर्टल पर जाएं' : 'Open Portal'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* PMFME */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-teal-500/30 flex flex-col justify-between hover:border-teal-400 transition-all group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-400 bg-teal-950 px-2.5 py-0.5 rounded-full border border-teal-500/40">
                      MoFPI Scheme
                    </span>
                    <span className="text-xs font-bold text-amber-300">35% Subsidy (₹10L)</span>
                  </div>
                  <h4 className="text-base font-extrabold text-white group-hover:text-teal-300 transition-colors">
                    PMFME Scheme Portal (पीएमएफएमई)
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isHindi
                      ? 'खाद्य प्रसंस्करण उद्योग मंत्रालय की प्रमुख योजना। व्यक्तिगत व FPO इकाइयों के लिए 35% क्रेडिट-लिंक्ड कैपिटल सब्सिडी (अधिकतम ₹10 लाख)।'
                      : 'Ministry of Food Processing Industries flagship scheme offering 35% credit-linked capital subsidy for micro food processing units.'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-teal-400">pmfme.mofpi.gov.in</span>
                  <a
                    href="https://pmfme.mofpi.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <span>{isHindi ? 'पोर्टल पर जाएं' : 'Open Portal'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* PMEGP */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-blue-500/30 flex flex-col justify-between hover:border-blue-400 transition-all group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400 bg-blue-950 px-2.5 py-0.5 rounded-full border border-blue-500/40">
                      KVIC / MSME
                    </span>
                    <span className="text-xs font-bold text-amber-300">Up to 35% Margin Money</span>
                  </div>
                  <h4 className="text-base font-extrabold text-white group-hover:text-blue-300 transition-colors">
                    PMEGP e-Portal (पीएमईजीपी)
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isHindi
                      ? 'सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय का रोजगार सृजन कार्यक्रम। ग्रामीण क्षेत्रों में विनिर्माण हेतु ₹50 लाख तक प्रोजेक्ट पर 35% सब्सिडी।'
                      : 'Prime Ministers Employment Generation Programme offering 25% to 35% subsidy for manufacturing projects up to ₹50 Lakhs.'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-blue-400">kviconline.gov.in/pmegpeportal</span>
                  <a
                    href="https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <span>{isHindi ? 'पोर्टल पर जाएं' : 'Open Portal'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* AIF */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-indigo-500/30 flex flex-col justify-between hover:border-indigo-400 transition-all group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-500/40">
                      Ministry of Agriculture
                    </span>
                    <span className="text-xs font-bold text-emerald-300">3% Subvention (₹2 Cr)</span>
                  </div>
                  <h4 className="text-base font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                    Agriculture Infrastructure Fund (AIF)
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isHindi
                      ? 'पोस्ट-हार्वेस्ट और कोल्ड चेन इन्फ्रास्ट्रक्चर के लिए ₹2 करोड़ तक के ऋण पर 7 वर्षों हेतु 3% ब्याज छूट और CGTMSE गारंटी शुल्क सरकार द्वारा।'
                      : 'Post-harvest processing and cold storage fund providing 3% interest subvention for 7 years on term loans up to ₹2 Crore.'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-indigo-400">agriinfra.dac.gov.in</span>
                  <a
                    href="https://agriinfra.dac.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <span>{isHindi ? 'पोर्टल पर जाएं' : 'Open Portal'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
