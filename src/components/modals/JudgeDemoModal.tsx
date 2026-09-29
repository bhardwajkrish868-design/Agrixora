import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Landmark, 
  ShoppingBag, 
  FileSpreadsheet, 
  Award,
  RotateCcw
} from 'lucide-react';
import type { NavigationTab, ActiveView, UserInputForm, Language } from '../../types';
import { DEMO_PRESETS } from '../../data/regionsData';
import confetti from 'canvas-confetti';

interface JudgeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tab: NavigationTab) => void;
  onSelectView?: (view: ActiveView) => void;
  onLoadDemoPreset?: (form: UserInputForm) => void;
  currentLang?: Language;
}

export const JudgeDemoModal: React.FC<JudgeDemoModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectView,
  onLoadDemoPreset
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  if (!isOpen) return null;

  const navigateTo = (tab: NavigationTab) => {
    if (onNavigate) onNavigate(tab);
    else if (onSelectView) onSelectView(tab as ActiveView);
  };

  const DEMO_STEPS = [
    {
      title: '1. Rural Location & Catchment Setup',
      icon: <MapPin className="w-5 h-5 text-emerald-600" />,
      tag: 'PS 26091 Feasibility',
      targetTab: 'feasibility' as NavigationTab,
      headline: 'Rameshwar Dairy & Agro • Janori Gram Panchayat (Nashik, MH)',
      details: [
        'Geographic Profile: Rural agrarian cluster with 28,400 population within 10 km radius.',
        'Proposed Enterprise: Tomato Puree & Cold-Pressed Mustard Oil Unit.',
        'Raw Material: Abundant local harvest from farmers within 5 km.'
      ]
    },
    {
      title: '2. Hyper-Local Market & SWOT Analysis',
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
      tag: 'Module 1 Intelligence',
      targetTab: 'feasibility' as NavigationTab,
      headline: 'Feasibility Score: 92/100 (Highly Feasible)',
      details: [
        'Market Catchment: 52% direct farmer consumers + 28% weekly village haat buyers.',
        'Competitive Density: 1.4 units per 10k population (Low-Moderate Saturation).',
        'Mitigation Playbook: 45-day raw seed storage inventory against post-harvest price swings.'
      ]
    },
    {
      title: '3. 10:90 Leverage & Scheme Auto-Router',
      icon: <Landmark className="w-5 h-5 text-blue-600" />,
      tag: 'Module 2 Smart Calculator',
      targetTab: 'financials' as NavigationTab,
      headline: '₹80,000 Margin unlocks ₹8,00,000 Project Scale',
      details: [
        'Formula: Project Cost = ₹80,000 / 10% = ₹8,00,000 (10x Amplification).',
        'Scheme Selection: Term Loan Scheme (8.0% p.a., 7-year tenure).',
        'Moratorium: 6-Month principal grace period (₹0 principal during machine installation).'
      ]
    },
    {
      title: '4. Institutional Buyer Demand Marketplace',
      icon: <ShoppingBag className="w-5 h-5 text-purple-600" />,
      tag: 'PS 26033 Integration',
      targetTab: 'marketplace' as NavigationTab,
      headline: 'Guaranteed 500 Tonne Pre-Bulk Purchase Contract',
      details: [
        'Buyer: Kisan Agro Food Processing Ltd (Verified Institutional Aggregator).',
        'Contract Price: ₹18,500/Tonne with 100% direct bank transfer.',
        'Pre-Order Pledge: Rameshwar pledges 25 Tonnes/month, securing 85% of capacity.'
      ]
    },
    {
      title: '5. 15-Section Bank DPR & Sanction Ready',
      icon: <FileSpreadsheet className="w-5 h-5 text-emerald-600" />,
      tag: 'Bank Dossier',
      targetTab: 'businessplan' as NavigationTab,
      headline: 'Lead Bank Appraisal Ready (DSCR: 3.2x)',
      details: [
        'Means of Finance: 10% Margin (₹80k) + 90% Debt (₹7.20L).',
        'Projected Financials: ₹2.0L monthly revenue, ₹48k net surplus post EMI.',
        '1-Click PDF Export: Ready for submission to Lead District Bank & DIC.'
      ]
    }
  ];

  const currentStep = DEMO_STEPS[currentStepIndex];

  const handleNextStep = () => {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      navigateTo('dashboard');
      onClose();
    }
  };

  const handleJumpToTab = (tab: NavigationTab) => {
    navigateTo(tab);
    onClose();
  };

  const handlePresetSelect = (idx: number) => {
    const preset = DEMO_PRESETS[idx];
    if (onLoadDemoPreset) {
      onLoadDemoPreset(preset.formData);
    }
    navigateTo('feasibility');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl">
              <Award className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight">SIH Evaluation Walkthrough</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/40 text-amber-300">
                  Step {currentStepIndex + 1} of 5
                </span>
              </div>
              <p className="text-xs text-white/90">
                End-to-end simulation combining PS 26091 (Feasibility) + PS 26033 (Demand Marketplace)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-5 h-1.5 bg-slate-100 dark:bg-slate-800">
          {DEMO_STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`h-full transition-all ${
                idx <= currentStepIndex
                  ? 'bg-gradient-to-r from-amber-500 to-emerald-600'
                  : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Active Step Content */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full">
                {currentStep.tag}
              </span>
              <button
                onClick={() => handleJumpToTab(currentStep.targetTab)}
                className="text-xs font-bold text-slate-500 hover:text-emerald-600 flex items-center gap-1 underline"
              >
                Jump to Live View →
              </button>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                {currentStep.icon}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {currentStep.title}
                </h4>
                <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {currentStep.headline}
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              {currentStep.details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Preset Pickers */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Or Load a Pre-Configured SIH Regional Benchmark:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {DEMO_PRESETS.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => handlePresetSelect(idx)}
                  className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-left bg-white dark:bg-slate-800 transition-all cursor-pointer group"
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 line-clamp-1">
                    {p.title}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">
                    {p.formData.location.district}, {p.formData.location.state}
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setCurrentStepIndex(0)}
            className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Flow</span>
          </button>

          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <button
                onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
                className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100"
              >
                Previous
              </button>
            )}

            <button
              onClick={handleNextStep}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
            >
              <span>{currentStepIndex === DEMO_STEPS.length - 1 ? 'Finish & Explore Ecosystem' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
