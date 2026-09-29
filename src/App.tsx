import { useState, useEffect } from 'react';
import { 
  MapPin, 
  TrendingUp, 
} from 'lucide-react';
import type { FeasibilityReport, FinancialRoadmap, Language, UserInputForm } from './types';
import { DEMO_PRESETS, type DemoPreset } from './data/regionsData';
import { generateFeasibilityReport } from './services/aiAdvisorService';

// Components
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { InputForm } from './components/InputForm';
import { SchemeRouterCard } from './components/SchemeRouterCard';
import { FeasibilityReportView } from './components/FeasibilityReportView';
import { FinancialRoadmapView } from './components/FinancialRoadmapView';
import { SchemeRulesModal } from './components/SchemeRulesModal';
import { BankReadyDPRModal } from './components/BankReadyDPRModal';
import { AICoachDrawer } from './components/AICoachDrawer';
import { ApiKeyModal } from './components/ApiKeyModal';

export function App() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  // Form State initialized with realistic default
  const [formData, setFormData] = useState<UserInputForm>(DEMO_PRESETS[0].formData);

  // Generated Outputs
  const [report, setReport] = useState<FeasibilityReport | null>(null);
  const [financials, setFinancials] = useState<FinancialRoadmap | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'feasibility' | 'financials'>('feasibility');

  // Modals & Drawers
  const [isSchemeModalOpen, setIsSchemeModalOpen] = useState<boolean>(false);
  const [isDPRModalOpen, setIsDPRModalOpen] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isAICoachOpen, setIsAICoachOpen] = useState<boolean>(false);

  // Auto-generate initial report on mount
  useEffect(() => {
    handleGenerate();
  }, []);

  const handleGenerate = async (customForm?: UserInputForm) => {
    const targetForm = customForm || formData;
    setIsLoading(true);
    try {
      const result = await generateFeasibilityReport(targetForm);
      setReport(result.report);
      setFinancials(result.financials);
    } catch (err) {
      console.error('Report generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset: DemoPreset) => {
    setFormData(preset.formData);
    handleGenerate(preset.formData);
  };

  const handleSpeakSummary = () => {
    if (!report || !financials || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const summaryText = currentLanguage === 'hi'
      ? `${report.businessName} के लिए परियोजना रिपोर्ट। कुल लागत ₹${financials.projectCost.toLocaleString('en-IN')} है, जिसमें आपका 10% मार्जिन ₹${financials.marginCapital.toLocaleString('en-IN')} और 90% ऋण ₹${financials.loanAmount.toLocaleString('en-IN')} है। ${financials.scheme.name} के तहत ${financials.scheme.moratoriumMonths} महीने की मोहलत मिलेगी और त्रैमासिक किस्त ₹${financials.quarterlyEMI.toLocaleString('en-IN')} होगी। यह व्यवसाय अत्यधिक व्यवहार्य है।`
      : `Feasibility assessment for ${report.businessName} in ${report.location.village}. Total project scale is ₹${financials.projectCost.toLocaleString('en-IN')}, unlocked with your 10% margin of ₹${financials.marginCapital.toLocaleString('en-IN')} and 90% loan of ₹${financials.loanAmount.toLocaleString('en-IN')} under ${financials.scheme.name}. You get a ${financials.scheme.moratoriumMonths}-month moratorium with quarterly EMI of ₹${financials.quarterlyEMI.toLocaleString('en-IN')}. Project feasibility score is ${report.overallFeasibilityScore} out of 100.`;

    const utterance = new SpeechSynthesisUtterance(summaryText);
    utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onOpenSchemeModal={() => setIsSchemeModalOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onToggleAICoach={() => setIsAICoachOpen(!isAICoachOpen)}
        isAICoachOpen={isAICoachOpen}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* Hero Section with Live Metrics & Demo Presets */}
        <HeroBanner
          currentLanguage={currentLanguage}
          onSelectPreset={handleSelectPreset}
        />

        {/* Dynamic 2-Column or Stack Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (5 Cols on Large Screen): 3-Step Input Form */}
          <div className="lg:col-span-5 space-y-6">
            <InputForm
              currentLanguage={currentLanguage}
              formData={formData}
              onChange={setFormData}
              onSubmit={() => handleGenerate()}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column (7 Cols on Large Screen): Scheme Router & Generated Modules */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Live Scheme Router Card */}
            {financials && (
              <SchemeRouterCard
                financials={financials}
                onOpenMatrix={() => setIsSchemeModalOpen(true)}
              />
            )}

            {/* Tab Navigation */}
            {report && financials && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-1.5 flex flex-wrap gap-1">
                <button
                  onClick={() => setActiveTab('feasibility')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'feasibility'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Module 1: Feasibility Blueprint</span>
                </button>

                <button
                  onClick={() => setActiveTab('financials')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'financials'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Module 2: Financial Roadmap & EMI</span>
                </button>
              </div>
            )}

            {/* Active Tab View */}
            {report && financials && activeTab === 'feasibility' && (
              <FeasibilityReportView
                report={report}
                currentLanguage={currentLanguage}
                onSpeakSummary={handleSpeakSummary}
              />
            )}

            {report && financials && activeTab === 'financials' && (
              <FinancialRoadmapView
                financials={financials}
                currentLanguage={currentLanguage}
                onOpenDPRModal={() => setIsDPRModalOpen(true)}
              />
            )}

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              गु
            </div>
            <div>
              <span className="font-bold text-slate-200">GramUdyog AI</span>
              <span className="mx-2 text-slate-600">•</span>
              <span>Democratizing Institutional Business Advisory for Rural India</span>
            </div>
          </div>
          <div className="text-slate-500 text-[11px]">
            Compliant with Micro Finance (&le; ₹1.40L @ 6.5%) & Term Loan (&le; ₹50.00L @ 8%) Guidelines
          </div>
        </div>
      </footer>

      {/* Modals & Slide-out Panels */}
      <SchemeRulesModal
        isOpen={isSchemeModalOpen}
        onClose={() => setIsSchemeModalOpen(false)}
      />

      {report && financials && (
        <BankReadyDPRModal
          isOpen={isDPRModalOpen}
          onClose={() => setIsDPRModalOpen(false)}
          report={report}
          financials={financials}
          formData={formData}
        />
      )}

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      <AICoachDrawer
        isOpen={isAICoachOpen}
        onClose={() => setIsAICoachOpen(false)}
        report={report || undefined}
        financials={financials || undefined}
        currentLanguage={currentLanguage}
      />

    </div>
  );
}
export default App;
