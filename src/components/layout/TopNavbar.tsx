import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Globe, 
  Bell, 
  Sun, 
  Moon, 
  Menu,
  Bot,
  Key,
  Landmark
} from 'lucide-react';
import type { NavigationTab, Language, LocationCatchment } from '../../types';

interface TopNavbarProps {
  activeTab?: NavigationTab;
  onNavigate?: (tab: NavigationTab) => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  selectedLocation?: LocationCatchment;
  onLocationChange?: (loc: LocationCatchment) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAuthModal?: () => void;
  onOpenApiKeyModal?: () => void;
  onOpenSchemeModal?: () => void;
  onToggleAICoach?: () => void;
  onToggleMobileMenu?: () => void;
  user?: { name: string; role: string; location: string } | null;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onNavigate,
  currentLanguage,
  onLanguageChange,
  selectedLocation,
  isDarkMode,
  onToggleDarkMode,
  onOpenAuthModal,
  onOpenApiKeyModal,
  onOpenSchemeModal,
  onToggleAICoach,
  onToggleMobileMenu,
  user
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const NOTIFICATIONS = [
    { id: 1, title: 'New Institutional Order: 500 T Tomato (Kisan Agro)', time: '10m ago' },
    { id: 2, title: 'Micro Finance Scheme Interest Revised: 6.5% p.a.', time: '1h ago' },
    { id: 3, title: 'Your DPR Dossier is 100% Bank Appraisal Ready', time: '3h ago' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('loan') || q.includes('scheme') || q.includes('emi') || q.includes('interest')) {
      if (onNavigate) onNavigate('financials');
    } else if (q.includes('buyer') || q.includes('order') || q.includes('demand') || q.includes('tomato') || q.includes('mustard')) {
      if (onNavigate) onNavigate('marketplace');
    } else if (q.includes('radar') || q.includes('opp') || q.includes('niche')) {
      if (onNavigate) onNavigate('opportunities');
    } else if (q.includes('price') || q.includes('mandi') || q.includes('trend')) {
      if (onNavigate) onNavigate('intelligence');
    } else if (q.includes('dpr') || q.includes('plan') || q.includes('report') || q.includes('pdf')) {
      if (onNavigate) onNavigate('businessplan');
    } else {
      if (onNavigate) onNavigate('feasibility');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left Mobile Menu & Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <form onSubmit={handleSearchSubmit} className="relative w-full hidden sm:block">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                currentLanguage === 'hi'
                  ? 'व्यवसाय, 10:90 योजनाएं या थोक खरीदार खोजें (Enter दबाएं)...'
                  : 'Search business feasibility, 10:90 loans, buyer demands (Press Enter)...'
              }
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </form>
        </div>

        {/* Center/Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Active Geographic Catchment Badge */}
          {selectedLocation && (
            <button
              onClick={() => onNavigate && onNavigate('feasibility')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold hover:border-emerald-400 transition-all cursor-pointer"
              title="Active Geographic Catchment"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate max-w-[140px]">{selectedLocation.panchayat || selectedLocation.block}, {selectedLocation.district}</span>
              <span className="text-[10px] bg-emerald-200 dark:bg-emerald-800 px-1.5 py-0.5 rounded font-mono">
                {selectedLocation.catchmentRadiusKm}km
              </span>
            </button>
          )}

          {/* Scheme Modal Trigger */}
          {onOpenSchemeModal && (
            <button
              onClick={onOpenSchemeModal}
              className="hidden md:flex p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Government Scheme Policy Matrix"
            >
              <Landmark className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </button>
          )}

          {/* API Key Modal Trigger */}
          {onOpenApiKeyModal && (
            <button
              onClick={onOpenApiKeyModal}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Configure Gemini API Key"
            >
              <Key className="w-4 h-4 text-amber-500" />
            </button>
          )}

          {/* AI Advisor Floating Trigger */}
          {onToggleAICoach && (
            <button
              onClick={onToggleAICoach}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="AgriXora AI Coach"
            >
              <Bot className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </button>
          )}

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span className="capitalize">{currentLanguage === 'hi' ? 'हिन्दी' : currentLanguage === 'hinglish' ? 'Hinglish' : 'English'}</span>
            </button>

            {showLangMenu && (
              <div 
                className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setShowLangMenu(false)}
              >
                {[
                  { code: 'en', label: 'English' },
                  { code: 'hi', label: 'हिन्दी (Hindi)' },
                  { code: 'hinglish', label: 'Hinglish (Mix)' }
                ].map(l => (
                  <button
                    key={l.code}
                    onClick={() => onLanguageChange(l.code as Language)}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors ${
                      currentLanguage === l.code ? 'font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/50' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Light / Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1.5 right-1.5 animate-pulse" />
            </button>

            {showNotifications && (
              <div 
                className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-3 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setShowNotifications(false)}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700 mb-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Live Demand & Scheme Alerts</span>
                  <span className="text-[10px] text-emerald-600 font-bold">2 New</span>
                </div>
                <div className="space-y-2">
                  {NOTIFICATIONS.map(n => (
                    <div key={n.id} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-xs">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{n.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Auth / Sign In & Register Buttons */}
          {user?.name ? (
            <div className="relative">
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                title={`${user.name} (${user.role})`}
              >
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                  👤
                </div>
                <div className="hidden sm:block text-left">
                  <div className="leading-tight font-bold">{user.name.split(' ')[0]}</div>
                  <div className="text-[9px] text-emerald-200 leading-none">{user.location.split(',')[0]}</div>
                </div>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onNavigate ? onNavigate('login') : onOpenAuthModal?.()}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate ? onNavigate('register') : onOpenAuthModal?.()}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm shadow-emerald-950/40 transition-all cursor-pointer"
              >
                Register
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
