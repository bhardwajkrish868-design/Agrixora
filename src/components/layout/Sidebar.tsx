import React from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  Calculator, 
  ShoppingBag, 
  Radar, 
  BarChart3, 
  FileSpreadsheet, 
  Bot, 
  FolderArchive, 
  Settings, 
  Home,
  X,
  PhoneCall,
  Landmark
} from 'lucide-react';
import type { NavigationTab, ActiveView, Language } from '../../types';

interface SidebarProps {
  activeTab?: NavigationTab;
  activeView?: ActiveView;
  onNavigate?: (tab: NavigationTab) => void;
  onSelectView?: (view: ActiveView) => void;
  onOpenSchemeModal?: () => void;
  currentLanguage: Language;
  activeOrdersCount?: number;
  isMobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  activeView,
  onNavigate,
  onSelectView,
  onOpenSchemeModal,
  currentLanguage,
  activeOrdersCount = 8,
  isMobileMenuOpen = false,
  onCloseMobileMenu
}) => {
  const currentActive = activeTab || activeView || 'landing';

  const handleSelect = (tab: NavigationTab) => {
    if (onNavigate) onNavigate(tab);
    else if (onSelectView) onSelectView(tab as ActiveView);
    if (onCloseMobileMenu) onCloseMobileMenu();
  };

  const NAV_ITEMS: { id: NavigationTab; label: string; labelHi: string; icon: React.ReactNode; badge?: string; badgeColor?: string }[] = [
    {
      id: 'landing',
      label: 'Home Overview',
      labelHi: 'मुख्य पृष्ठ',
      icon: <Home className="w-4 h-4" />
    },
    {
      id: 'dashboard',
      label: 'KPI Dashboard',
      labelHi: 'डैशबोर्ड',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'feasibility',
      label: 'Business Feasibility',
      labelHi: 'व्यवसाय व्यवहार्यता',
      icon: <MapPin className="w-4 h-4" />,
      badge: '10km Geo',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'financials',
      label: 'Financial Calculator',
      labelHi: 'स्मार्ट ऋण कैलकुलेटर',
      icon: <Calculator className="w-4 h-4" />,
      badge: '10:90',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'marketplace',
      label: 'Institutional Demand',
      labelHi: 'थोक खरीदार मांग',
      icon: <ShoppingBag className="w-4 h-4" />,
      badge: `${activeOrdersCount} Orders`,
      badgeColor: 'bg-amber-100 text-amber-900'
    },
    {
      id: 'opportunities',
      label: 'Opportunity Radar',
      labelHi: 'अवसर रडार',
      icon: <Radar className="w-4 h-4" />
    },
    {
      id: 'intelligence',
      label: 'Market Intelligence',
      labelHi: 'बाजार खुफिया विश्लेषण',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'businessplan',
      label: 'Business Plan (DPR)',
      labelHi: 'बिजनेस प्लान व DPR',
      icon: <FileSpreadsheet className="w-4 h-4" />,
      badge: 'PDF',
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'advisor',
      label: 'AI Advisor Sathi',
      labelHi: 'AI सलाहकार साथी',
      icon: <Bot className="w-4 h-4" />,
      badge: 'Voice',
      badgeColor: 'bg-teal-100 text-teal-800'
    },
    {
      id: 'reports',
      label: 'Reports & Vault',
      labelHi: 'रिपोर्ट्स वॉल्ट',
      icon: <FolderArchive className="w-4 h-4" />
    },
    {
      id: 'settings',
      label: 'Settings',
      labelHi: 'सेटिंग्स',
      icon: <Settings className="w-4 h-4" />
    },
    {
      id: 'login',
      label: 'Sign In / Register',
      labelHi: 'लॉग इन / पंजीकरण',
      icon: <Landmark className="w-4 h-4" />,
      badge: 'Portal',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full">
      {/* Top Logo & Ecosystem Header */}
      <div>
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg text-white tracking-tight">
                  AGRIXORA
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wide">
                KisanBiz Intelligence AI
              </p>
            </div>
          </div>
          {isMobileMenuOpen && onCloseMobileMenu && (
            <button
              onClick={onCloseMobileMenu}
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Ecosystem Modules
          </div>

          {NAV_ITEMS.map((item) => {
            const isActive = currentActive === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  <span>{currentLanguage === 'hi' ? item.labelHi : item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Production Assistance & Helpline Card */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-800/40 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-emerald-300 text-[11px] mb-1">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kisan & Udyami Support</span>
          </div>
          <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">
            National Micro-Enterprise & Farmer Toll-Free Helpline: <strong>1800-180-1551</strong>
          </p>
          {onOpenSchemeModal && (
            <button
              onClick={() => {
                onOpenSchemeModal();
                if (onCloseMobileMenu) onCloseMobileMenu();
              }}
              className="w-full py-1.5 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Scheme Policy Rules</span>
            </button>
          )}
        </div>

        <div className="text-[10px] text-center text-slate-500">
          AgriXora v2.5 • Unified Rural Enterprise OS
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 shrink-0 border-r border-slate-800 hidden md:flex flex-col h-screen sticky top-0 select-none">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs"
            onClick={onCloseMobileMenu}
          />
          <div className="relative w-72 max-w-[80vw] bg-slate-900 text-slate-300 h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
