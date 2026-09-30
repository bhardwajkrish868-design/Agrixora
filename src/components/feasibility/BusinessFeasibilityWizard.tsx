import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Briefcase, 
  IndianRupee, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  CheckCircle2, 
  Layers, 
  Clock
} from 'lucide-react';
import type { 
  FeasibilityReport, 
  FinancialRoadmap, 
  Language, 
  UserInputForm,
  LocationCatchment,
  OpportunityItem
} from '../../types';
import { STATES_DATA, DEMO_PRESETS } from '../../data/regionsData';
import { BUSINESS_CATEGORIES } from '../../data/businessCatalog';
import { calculateFinancialRoadmap } from '../../data/schemes';
import { generateFeasibilityReport } from '../../services/aiAdvisorService';
import { FeasibilityReportView } from '../FeasibilityReportView';

interface BusinessFeasibilityWizardProps {
  currentLanguage: Language;
  activeLocation?: LocationCatchment;
  prefilledOpportunity?: OpportunityItem | null;
  formData?: UserInputForm;
  onChangeForm?: (updated: UserInputForm) => void;
  onGenerateReport?: (customForm?: UserInputForm) => Promise<void>;
  report?: FeasibilityReport | null;
  financials?: FinancialRoadmap | null;
  isLoading?: boolean;
  onReportGenerated?: (report: FeasibilityReport, financials: FinancialRoadmap) => void;
  onNavigateToFinancials?: () => void;
  onNavigateToMarketplace?: () => void;
  onNavigateToDPR?: () => void;
  userRole?: string;
}

export const BusinessFeasibilityWizard: React.FC<BusinessFeasibilityWizardProps> = ({
  currentLanguage,
  activeLocation,
  prefilledOpportunity,
  formData: externalFormData,
  onChangeForm: externalOnChangeForm,
  onGenerateReport: externalOnGenerateReport,
  report: externalReport,
  financials: externalFinancials,
  isLoading: externalIsLoading,
  onReportGenerated,
  onNavigateToFinancials,
  onNavigateToMarketplace,
  onNavigateToDPR,
  userRole
}) => {
  // Internal state if parent doesn't provide external state management
  const [internalFormData, setInternalFormData] = useState<UserInputForm>(DEMO_PRESETS[0].formData);
  const [internalReport, setInternalReport] = useState<FeasibilityReport | null>(null);
  const [internalFinancials, setInternalFinancials] = useState<FinancialRoadmap | null>(null);
  const [internalIsLoading, setInternalIsLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const activeFormData = externalFormData || internalFormData;
  const activeReport = externalReport !== undefined ? externalReport : internalReport;
  const activeFinancials = externalFinancials !== undefined ? externalFinancials : internalFinancials;
  const activeLoading = externalIsLoading !== undefined ? externalIsLoading : internalIsLoading;

  const updateFormData = (updated: UserInputForm) => {
    if (externalOnChangeForm) {
      externalOnChangeForm(updated);
    } else {
      setInternalFormData(updated);
    }
  };

  // Sync when activeLocation changes from global bar
  useEffect(() => {
    if (activeLocation) {
      updateFormData({
        ...activeFormData,
        location: {
          ...activeFormData.location,
          state: activeLocation.state,
          district: activeLocation.district,
          block: activeLocation.block,
          village: activeLocation.panchayat || activeFormData.location.village,
          gramPanchayat: activeLocation.panchayat || activeFormData.location.gramPanchayat,
          catchmentRadiusKm: activeLocation.catchmentRadiusKm,
        }
      });
    }
  }, [activeLocation]);

  // Sync when an opportunity is clicked from Radar
  useEffect(() => {
    if (prefilledOpportunity) {
      const matchedCat = BUSINESS_CATEGORIES.find(c => c.id === prefilledOpportunity.category) || BUSINESS_CATEGORIES[0];
      updateFormData({
        ...activeFormData,
        businessCategoryId: matchedCat.id,
        customBusinessName: prefilledOpportunity.title,
        availableMarginCapital: Math.max(10000, Math.round((prefilledOpportunity.suggestedProjectScale || prefilledOpportunity.investmentRequired * 10) * 0.1)),
        experienceLevel: 'intermediate',
      });
      setCurrentStep(3); // jump straight to review
    }
  }, [prefilledOpportunity]);

  const selectedStateObj = STATES_DATA.find(s => s.state === activeFormData.location.state) || STATES_DATA[0];
  const selectedDistrictObj = selectedStateObj.districts.find(d => d.district === activeFormData.location.district) || selectedStateObj.districts[0];

  const liveFinancials = calculateFinancialRoadmap(activeFormData.availableMarginCapital);

  const handleStateChange = (stateName: string) => {
    const stateObj = STATES_DATA.find(s => s.state === stateName);
    if (!stateObj) return;
    const distObj = stateObj.districts[0];
    const blockObj = distObj.blocks[0];
    updateFormData({
      ...activeFormData,
      location: {
        ...activeFormData.location,
        state: stateName,
        district: distObj.district,
        block: blockObj.block,
        village: blockObj.villages[0] || 'Main Village',
        gramPanchayat: blockObj.villages[0] + ' Gram Panchayat'
      }
    });
  };

  const handleDistrictChange = (distName: string) => {
    const distObj = selectedStateObj.districts.find(d => d.district === distName);
    if (!distObj) return;
    const blockObj = distObj.blocks[0];
    updateFormData({
      ...activeFormData,
      location: {
        ...activeFormData.location,
        district: distName,
        block: blockObj.block,
        village: blockObj.villages[0] || 'Main Village',
        gramPanchayat: blockObj.villages[0] + ' Gram Panchayat'
      }
    });
  };

  const handleBlockChange = (blkName: string) => {
    const blkObj = selectedDistrictObj.blocks.find(b => b.block === blkName);
    updateFormData({
      ...activeFormData,
      location: {
        ...activeFormData.location,
        block: blkName,
        village: blkObj?.villages[0] || activeFormData.location.village,
        gramPanchayat: (blkObj?.villages[0] || activeFormData.location.village) + ' Gram Panchayat'
      }
    });
  };

  const handleTriggerGenerate = async () => {
    if (externalOnGenerateReport) {
      await externalOnGenerateReport(activeFormData);
      setCurrentStep(5);
    } else {
      setInternalIsLoading(true);
      try {
        const res = await generateFeasibilityReport(activeFormData);
        setInternalReport(res.report);
        setInternalFinancials(res.financials);
        if (onReportGenerated) {
          onReportGenerated(res.report, res.financials);
        }
        setCurrentStep(5);
      } catch (err) {
        console.error('Feasibility generation failed:', err);
      } finally {
        setInternalIsLoading(false);
      }
    }
  };

  const handleSpeakSummary = () => {
    if (!activeReport || !activeFinancials || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const summaryText = currentLanguage === 'hi'
      ? `${activeReport.businessName} के लिए परियोजना रिपोर्ट। कुल लागत ₹${activeFinancials.projectCost.toLocaleString('en-IN')} है, जिसमें आपका 10% हिस्सा ₹${activeFinancials.marginCapital.toLocaleString('en-IN')} और 90% ऋण ₹${activeFinancials.loanAmount.toLocaleString('en-IN')} है। ${activeFinancials.scheme.name} के तहत ${activeFinancials.scheme.moratoriumMonths} महीने की मोहलत मिलेगी। यह व्यवसाय 5 से 10 किलोमीटर के दायरे में अत्यधिक व्यवहार्य है।`
      : `Feasibility assessment for ${activeReport.businessName} in ${activeReport.location.village}, ${activeReport.location.district}. Total project scale is ₹${activeFinancials.projectCost.toLocaleString('en-IN')}, unlocked with your 10% margin of ₹${activeFinancials.marginCapital.toLocaleString('en-IN')} and 90% loan of ₹${activeFinancials.loanAmount.toLocaleString('en-IN')} under ${activeFinancials.scheme.name}. Feasibility score is ${activeReport.overallFeasibilityScore} out of 100.`;

    const utterance = new SpeechSynthesisUtterance(summaryText);
    utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const role = (userRole || '').toLowerCase();
  const isFPO = role.includes('fpo') || role.includes('shg') || role === 'fpo_manager';

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* HEADER BAR */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>{isFPO ? 'FPO Cluster Infrastructure & Processing' : 'Business Intelligence & Feasibility'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {isFPO ? 'Cluster Processing Unit & Cold Chain Feasibility' : 'Project Feasibility & 10:90 Loan Scheme Check'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {isFPO
              ? 'Evaluate collective crop pooling capacity, packhouse/cold chain viability, and Agriculture Infrastructure Fund (AIF) subsidy.'
              : 'Evaluate raw material availability, local market competition, customer demand, and 10:90 loan structuring.'}
          </p>
        </div>

        {/* STEP PROGRESS INDICATOR */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl">
          {[
            { num: 1, label: 'Geography' },
            { num: 2, label: 'Business' },
            { num: 3, label: 'Capital' },
            { num: 4, label: 'Ops' },
            { num: 5, label: 'Report' }
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => {
                if (s.num === 5 && !activeReport) return;
                setCurrentStep(s.num);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentStep === s.num
                  ? 'bg-emerald-600 text-white shadow-md'
                  : currentStep > s.num
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {currentStep > s.num ? <Check className="w-3.5 h-3.5" /> : <span>{s.num}</span>}
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: GEOGRAPHIC LOCATION & MARKET */}
      {currentStep === 1 && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 animate-in fade-in">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {isFPO ? 'Step 1: Farmer Aggregation Cluster & Processing Location' : 'Step 1: Project Location & Target Market Area'}
              </h2>
              <p className="text-xs text-slate-500">
                {isFPO
                  ? 'Define the primary village cluster, gram panchayats, and target crop collection radius.'
                  : 'Identify the village, gram panchayat, block, and target customer boundary.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                State
              </label>
              <select
                value={activeFormData.location.state}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {STATES_DATA.map((s) => (
                  <option key={s.state} value={s.state}>{s.state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                District
              </label>
              <select
                value={activeFormData.location.district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {selectedStateObj.districts.map((d) => (
                  <option key={d.district} value={d.district}>{d.district}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Block / Taluka
              </label>
              <select
                value={activeFormData.location.block}
                onChange={(e) => handleBlockChange(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {selectedDistrictObj.blocks.map((b) => (
                  <option key={b.block} value={b.block}>{b.block}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Village / Habitation
              </label>
              <input
                type="text"
                value={activeFormData.location.village}
                onChange={(e) => updateFormData({
                  ...activeFormData,
                  location: { ...activeFormData.location, village: e.target.value, gramPanchayat: e.target.value + ' Gram Panchayat' }
                })}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="e.g. Janori"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-300 mb-1">
                {isFPO ? `Farmer Aggregation Radius: ${activeFormData.location.catchmentRadiusKm} km` : `Local Market Radius: ${activeFormData.location.catchmentRadiusKm} km`}
              </label>
              <input
                type="range"
                min="3"
                max="15"
                step="1"
                value={activeFormData.location.catchmentRadiusKm}
                onChange={(e) => updateFormData({
                  ...activeFormData,
                  location: { ...activeFormData.location, catchmentRadiusKm: Number(e.target.value) }
                })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-emerald-700 dark:text-emerald-400 mt-1 font-semibold">
                <span>{isFPO ? '3 km (Primary Village)' : '3 km (Immediate Village)'}</span>
                <span>{isFPO ? '7 km (FPO Cluster)' : '7 km (Cluster)'}</span>
                <span>{isFPO ? '15 km (Multi-Block Federation)' : '15 km (Semi-Urban Hub)'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isFPO ? 'Target Farmer Member Base / Cluster Capacity' : 'Estimated Local Consumer Population'}
              </label>
              <input
                type="number"
                value={activeFormData.location.estimatedPopulation}
                onChange={(e) => updateFormData({
                  ...activeFormData,
                  location: { ...activeFormData.location, estimatedPopulation: Number(e.target.value) }
                })}
                className="w-full text-xs font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                {isFPO
                  ? 'Total registered member farmers and village producer groups pooled.'
                  : 'Derived from Census 2011 + regional growth extrapolation.'}
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>{isFPO ? 'Next: Select Cluster Processing Unit' : 'Next: Select Business Sector'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: BUSINESS SECTOR */}
      {currentStep === 2 && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 animate-in fade-in">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {isFPO ? 'Step 2: Choose Cluster Processing & Post-Harvest Facility' : 'Step 2: Choose Enterprise Activity & Category'}
              </h2>
              <p className="text-xs text-slate-500">
                {isFPO
                  ? 'Select from multi-crop cold storages, dal mills, oil expellers, and packhouse facilities.'
                  : 'Pick from 13 verified rural & semi-urban micro-enterprise archetypes.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {BUSINESS_CATEGORIES.map((cat) => {
              const isSelected = activeFormData.businessCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => updateFormData({
                    ...activeFormData,
                    businessCategoryId: cat.id,
                    customBusinessName: cat.defaultActivities?.[0] || cat.name
                  })}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{cat.icon}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{cat.name}</h4>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{cat.nameHi}</p>
                    <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                      {cat.schemeEligibility || 'Eligible: Micro / Term Loan'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Specific Unit Name / Sub-Activity
            </label>
            <input
              type="text"
              value={activeFormData.customBusinessName || ''}
              onChange={(e) => updateFormData({ ...activeFormData, customBusinessName: e.target.value })}
              className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="e.g. Tomato Puree & Paste Processing Unit"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>Next: Capital & 10:90 Leverage</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CAPITAL & 10:90 LEVERAGE */}
      {currentStep === 3 && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 animate-in fade-in">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Step 3: Available Margin Capital (10% Own Contribution)
              </h2>
              <p className="text-xs text-slate-500">
                Enter your cash investment. The system automatically computes the 10x total project size and 90% loan.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Your 10% Cash Margin: <strong className="text-base text-emerald-600 font-extrabold font-mono">₹{activeFormData.availableMarginCapital.toLocaleString('en-IN')}</strong>
              </label>
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-lg">
                Multiplier: 10x Scale
              </span>
            </div>

            <input
              type="range"
              min="5000"
              max="500000"
              step="5000"
              value={activeFormData.availableMarginCapital}
              onChange={(e) => updateFormData({ ...activeFormData, availableMarginCapital: Number(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {[
                { label: '₹10,000 (Micro)', val: 10000 },
                { label: '₹14,000 (Max Micro)', val: 14000 },
                { label: '₹1,00,000 (Term Loan)', val: 100000 },
                { label: '₹5,00,000 (Max Term)', val: 500000 },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => updateFormData({ ...activeFormData, availableMarginCapital: p.val })}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                    activeFormData.availableMarginCapital === p.val
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* LIVE 10:90 CALCULATION CARD */}
            <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Auto-Routed Scheme & Financial Breakdown
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {liveFinancials.scheme.name}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white/5 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Total Project Cost</span>
                  <strong className="text-sm sm:text-base font-mono font-bold text-white">
                    ₹{liveFinancials.projectCost.toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="bg-white/5 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">90% Bank Loan</span>
                  <strong className="text-sm sm:text-base font-mono font-bold text-emerald-400">
                    ₹{liveFinancials.loanAmount.toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="bg-white/5 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Interest Rate & Grace</span>
                  <strong className="text-sm font-mono font-bold text-amber-400">
                    {liveFinancials.scheme.interestRate}% ({liveFinancials.scheme.moratoriumMonths}m Grace)
                  </strong>
                </div>
                <div className="bg-white/5 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Quarterly Repayment</span>
                  <strong className="text-sm sm:text-base font-mono font-bold text-sky-300">
                    ₹{liveFinancials.quarterlyEMI.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>Next: Operations & Logistics</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: OPERATIONS & LOGISTICS */}
      {currentStep === 4 && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 animate-in fade-in">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Step 4: Operational Readiness & Production Scale
              </h2>
              <p className="text-xs text-slate-500">
                Specify experience, machinery readiness, land ownership, and target production volume.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Entrepreneur Experience Level
              </label>
              <select
                value={activeFormData.experienceLevel}
                onChange={(e) => updateFormData({ ...activeFormData, experienceLevel: e.target.value as any })}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="beginner">Beginner / First-Time Rural Entrepreneur</option>
                <option value="intermediate">Intermediate (2–4 Years Local Farming/Trading)</option>
                <option value="experienced">Experienced (5+ Years in Agro/Food Value Addition)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Monthly Production Units (e.g. Kg, Liters, Bags)
              </label>
              <input
                type="number"
                value={activeFormData.targetMonthlyProductionUnits || 500}
                onChange={(e) => updateFormData({ ...activeFormData, targetMonthlyProductionUnits: Number(e.target.value) || 0 })}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <input
              type="checkbox"
              id="hasOwnShed"
              checked={activeFormData.hasOwnLandShed || false}
              onChange={(e) => updateFormData({ ...activeFormData, hasOwnLandShed: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="hasOwnShed" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              Possesses own Land / Shed premises in the village (Zero commercial rental liability)
            </label>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleTriggerGenerate}
              disabled={activeLoading}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-xl shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {activeLoading ? (
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 animate-spin" />
                  Synthesizing Feasibility Blueprint...
                </span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Hyper-Local Feasibility Report</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: FINAL REPORT VIEW */}
      {currentStep === 5 && activeReport && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs gap-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Report Generated Successfully • ID: <strong className="font-mono text-emerald-600">{activeReport.id}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 rounded-lg hover:text-slate-900"
              >
                Edit Inputs
              </button>
              {onNavigateToFinancials && (
                <button
                  onClick={onNavigateToFinancials}
                  className="px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg hover:bg-emerald-100"
                >
                  View Loan Details →
                </button>
              )}
              {onNavigateToMarketplace && (
                <button
                  onClick={onNavigateToMarketplace}
                  className="px-3 py-1.5 text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 rounded-lg hover:bg-teal-100"
                >
                  Find Buyers →
                </button>
              )}
              {onNavigateToDPR && (
                <button
                  onClick={onNavigateToDPR}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
                >
                  Generate DPR →
                </button>
              )}
            </div>
          </div>

          <FeasibilityReportView
            report={activeReport}
            currentLanguage={currentLanguage}
            onSpeakSummary={handleSpeakSummary}
          />
        </div>
      )}

    </div>
  );
};
