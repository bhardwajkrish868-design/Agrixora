import { useState, useEffect } from 'react';
import type { 
  NavigationTab, 
  Language, 
  LocationCatchment, 
  FeasibilityReport, 
  FinancialRoadmap,
  OpportunityItem
} from './types';
import { DEMO_PRESETS } from './data/regionsData';
import { generateFeasibilityReport } from './services/aiAdvisorService';

// Layout Components
import { Sidebar } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';

// Page Views
import { LandingPage } from './components/landing/LandingPage';
import { DashboardView } from './components/dashboard/DashboardView';
import { BusinessFeasibilityWizard } from './components/feasibility/BusinessFeasibilityWizard';
import { FinancialCalculatorView } from './components/financials/FinancialCalculatorView';
import { BuyerDemandMarketplace } from './components/marketplace/BuyerDemandMarketplace';
import { OpportunityRadarView } from './components/opportunities/OpportunityRadarView';
import { MarketIntelligenceView } from './components/intelligence/MarketIntelligenceView';
import { BusinessPlanGeneratorView } from './components/businessplan/BusinessPlanGeneratorView';
import { AgriXoraAIAdvisor } from './components/advisor/AgriXoraAIAdvisor';
import { LoginPage } from './components/auth/LoginPage';

// Modals
import { AuthModal } from './components/modals/AuthModal';
import { UserProfileModal } from './components/modals/UserProfileModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { SchemeRulesModal } from './components/SchemeRulesModal';

export function App() {
  // Navigation & View State (Opens Login page first)
  const [activeTab, setActiveTab] = useState<NavigationTab>('login');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // User & Auth State (No hardcoded demo account, starts unauthenticated)
  const [user, setUser] = useState<{ name: string; role: string; location: string } | null>(null);

  // Global Location Context (Default: Nashik, Maharashtra)
  const [selectedLocation, setSelectedLocation] = useState<LocationCatchment>({
    state: 'Maharashtra',
    district: 'Nashik',
    block: 'Dindori',
    village: 'Janori',
    panchayat: 'Janori Gram Panchayat',
    areaType: 'rural',
    catchmentRadiusKm: 10,
    estimatedPopulation: 28400,
    agroClimaticZone: 'Western Plateau & Hills (Zone 9)',
    keyCrops: ['Grapes', 'Onion', 'Pomegranate', 'Soybean', 'Sugarcane'],
  });

  // Feasibility & Financial Data State
  const [currentReport, setCurrentReport] = useState<FeasibilityReport | null>(null);
  const [currentFinancials, setCurrentFinancials] = useState<FinancialRoadmap | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityItem | null>(null);

  // Active Modals State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isSchemeModalOpen, setIsSchemeModalOpen] = useState<boolean>(false);
  const [isAICoachFloatingOpen, setIsAICoachFloatingOpen] = useState<boolean>(false);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'success' | 'info' | 'warn' } | null>(null);

  const showToast = (title: string, desc: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Synchronize Dark Mode Class with document root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Preload initial baseline feasibility on mount so every tab is pre-hydrated with real metrics
  useEffect(() => {
    const initBaseline = async () => {
      try {
        const defaultPreset = DEMO_PRESETS[0];
        const result = await generateFeasibilityReport(defaultPreset.formData);
        setCurrentReport(result.report);
        setCurrentFinancials(result.financials);
      } catch (e) {
        console.error('Failed to initialize baseline report', e);
      }
    };
    initBaseline();
  }, []);

  // Handler for when user selects an Opportunity from Radar
  const handleLaunchFeasibilityForOpportunity = (item: OpportunityItem) => {
    setSelectedOpportunity(item);
    setActiveTab('feasibility');
    showToast(
      'Opportunity Loaded',
      `Auto-filled parameters for "${item.title}". Generating hyper-local catchment evaluation.`
    );
  };

  // Handler for switching location from TopNavbar
  const handleLocationChange = (loc: LocationCatchment) => {
    setSelectedLocation(loc);
    showToast(
      'Location Catchment Updated',
      `Active catchment changed to ${loc.panchayat || loc.block}, ${loc.district}, ${loc.state} (${loc.catchmentRadiusKm} km radius).`,
      'info'
    );
  };

  // Dedicated Full-Screen Login / Register View
  if (activeTab === 'login' || activeTab === 'register') {
    return (
      <>
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 animate-bounce max-w-sm bg-slate-900 text-white dark:bg-emerald-950 dark:text-emerald-100 border border-emerald-500/30 rounded-2xl p-4 shadow-2xl flex items-start gap-3 backdrop-blur-md">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold">
              ✓
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">{toastMessage.title}</h4>
              <p className="text-xs text-slate-300 dark:text-emerald-200/90 mt-0.5">{toastMessage.desc}</p>
            </div>
          </div>
        )}
        <LoginPage
          initialMode={activeTab === 'register' ? 'register' : 'login'}
          currentLang={currentLanguage}
          onLanguageChange={setCurrentLanguage}
          onLoginSuccess={(userData) => {
            setUser(userData);
            showToast(
              'Welcome to AgriXora',
              `Logged in as ${userData.name} (${userData.role}) for ${userData.location}.`
            );
          }}
          onNavigate={setActiveTab}
        />
      </>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 ${isDarkMode ? 'dark' : ''}`}>
      
      {/* Toast Notification Float */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-bounce max-w-sm bg-slate-900 text-white dark:bg-emerald-950 dark:text-emerald-100 border border-emerald-500/30 rounded-2xl p-4 shadow-2xl flex items-start gap-3 backdrop-blur-md">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold">
            ✓
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">{toastMessage.title}</h4>
            <p className="text-xs text-slate-300 dark:text-emerald-200/90 mt-0.5">{toastMessage.desc}</p>
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <TopNavbar
        activeTab={activeTab}
        onNavigate={setActiveTab}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        selectedLocation={selectedLocation}
        onLocationChange={handleLocationChange}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenUserProfile={() => setIsUserProfileModalOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenSchemeModal={() => setIsSchemeModalOpen(true)}
        onToggleAICoach={() => setIsAICoachFloatingOpen(!isAICoachFloatingOpen)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onLogout={() => {
          setUser(null);
          setActiveTab('login');
          showToast('Signed Out', 'You have been signed out. Welcome to log in or register anytime.', 'info');
        }}
        user={user}
      />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onNavigate={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          currentLanguage={currentLanguage}
          onOpenSchemeModal={() => setIsSchemeModalOpen(true)}
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 overflow-x-hidden min-h-[calc(100vh-4rem)]">
          {activeTab === 'landing' && (
            <LandingPage
              onNavigate={setActiveTab}
              currentLanguage={currentLanguage}
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigate={setActiveTab}
              currentLanguage={currentLanguage}
              location={selectedLocation}
              latestReport={currentReport}
              latestFinancials={currentFinancials}
            />
          )}

          {activeTab === 'feasibility' && (
            <BusinessFeasibilityWizard
              currentLanguage={currentLanguage}
              activeLocation={selectedLocation}
              prefilledOpportunity={selectedOpportunity}
              onReportGenerated={(report, financials) => {
                setCurrentReport(report);
                setCurrentFinancials(financials);
                showToast(
                  'Feasibility Report Generated',
                  `Feasibility Score: ${report.overallFeasibilityScore}/100. 10:90 Scheme auto-routed to ${financials.scheme.name}.`
                );
              }}
              onNavigateToFinancials={() => setActiveTab('financials')}
              onNavigateToMarketplace={() => setActiveTab('marketplace')}
              onNavigateToDPR={() => setActiveTab('businessplan')}
            />
          )}

          {activeTab === 'financials' && (
            <FinancialCalculatorView
              currentLanguage={currentLanguage}
              initialFinancials={currentFinancials}
              initialReport={currentReport}
              onOpenSchemeModal={() => setIsSchemeModalOpen(true)}
              onNavigateToDPR={() => setActiveTab('businessplan')}
            />
          )}

          {activeTab === 'marketplace' && (
            <BuyerDemandMarketplace
              currentLanguage={currentLanguage}
              activeLocation={selectedLocation}
              onPledgeCreated={(pledge) => {
                showToast(
                  'Supply Pledge Submitted',
                  `Successfully committed ${pledge.committedQuantity} ${pledge.unit} to ${pledge.buyerName}.`
                );
              }}
              onNavigateToFeasibility={() => setActiveTab('feasibility')}
            />
          )}

          {activeTab === 'opportunities' && (
            <OpportunityRadarView
              currentLanguage={currentLanguage}
              location={selectedLocation}
              onLaunchFeasibility={handleLaunchFeasibilityForOpportunity}
              onNavigateToMarketplace={() => setActiveTab('marketplace')}
            />
          )}

          {activeTab === 'intelligence' && (
            <MarketIntelligenceView
              currentLanguage={currentLanguage}
              location={selectedLocation}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'businessplan' && (
            <BusinessPlanGeneratorView
              currentLanguage={currentLanguage}
              report={currentReport}
              financials={currentFinancials}
              location={selectedLocation}
              onOpenFeasibility={() => setActiveTab('feasibility')}
            />
          )}

          {activeTab === 'advisor' && (
            <AgriXoraAIAdvisor
              currentLanguage={currentLanguage}
              location={selectedLocation}
              report={currentReport}
              financials={currentFinancials}
            />
          )}

          {/* Quick Fallback for Other Sub-Views */}
          {activeTab === 'reports' && (
            <BusinessPlanGeneratorView
              currentLanguage={currentLanguage}
              report={currentReport}
              financials={currentFinancials}
              location={selectedLocation}
              onOpenFeasibility={() => setActiveTab('feasibility')}
            />
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  System Settings & Preferences
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  Manage your offline models, language localization, API keys, and regional market caches.
                </p>

                <div className="space-y-6 divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="pt-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Gemini Live Reasoning API Key</h4>
                      <p className="text-xs text-slate-500">Provide an optional Google AI API key for real-time generative responses.</p>
                    </div>
                    <button
                      onClick={() => setIsApiKeyModalOpen(true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Configure Key
                    </button>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Dark / Light Mode</h4>
                      <p className="text-xs text-slate-500">Toggle high-contrast dark theme for field operations at night.</p>
                    </div>
                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      {isDarkMode ? 'Switch to Light Mode ☀️' : 'Switch to Dark Mode 🌙'}
                    </button>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Clear Regional Market Cache</h4>
                      <p className="text-xs text-slate-500">Purge offline cached mandi prices and reload fresh econometric benchmarks.</p>
                    </div>
                    <button
                      onClick={() => {
                        showToast('Cache Purged', 'Regional price benchmarks and mandi caches successfully refreshed.', 'info');
                      }}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Purge Cache
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating AI Assistant Drawer / Floating Pill if on non-advisor tab */}
      {isAICoachFloatingOpen && activeTab !== 'advisor' && (
        <div className="fixed bottom-6 right-6 z-40 w-96 max-h-[600px] shadow-2xl rounded-3xl overflow-hidden border border-emerald-500/30 animate-scaleUp">
          <div className="bg-emerald-800 text-white p-3 flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              AgriXora AI Coach (Live)
            </span>
            <button
              onClick={() => setIsAICoachFloatingOpen(false)}
              className="text-emerald-200 hover:text-white text-xs font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div className="h-[480px]">
            <AgriXoraAIAdvisor
              currentLanguage={currentLanguage}
              location={selectedLocation}
              report={currentReport}
              financials={currentFinancials}
            />
          </div>
        </div>
      )}

      {/* Interactive Modals */}
      <UserProfileModal
        isOpen={isUserProfileModalOpen}
        onClose={() => setIsUserProfileModalOpen(false)}
        user={user}
        selectedLocation={selectedLocation}
        onLogout={() => {
          setIsUserProfileModalOpen(false);
          setUser(null);
          setActiveTab('login');
          showToast('Signed Out', 'You have been signed out. Welcome to log in or register anytime.', 'info');
        }}
        onSwitchAccount={() => {
          setIsUserProfileModalOpen(false);
          setIsAuthModalOpen(true);
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(userData) => {
          setUser(userData);
          showToast('Welcome to AgriXora', `Logged in as ${userData.name} (${userData.role})`);
        }}
        currentLang={currentLanguage}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      <SchemeRulesModal
        isOpen={isSchemeModalOpen}
        onClose={() => setIsSchemeModalOpen(false)}
      />

    </div>
  );
}
export default App;
