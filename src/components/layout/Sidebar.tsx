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
  X,
  PhoneCall,
  Landmark,
  ShieldCheck
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
  userRole?: string;
  userName?: string;
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
  onCloseMobileMenu,
  userRole
}) => {
  const currentActive = activeTab || activeView || 'dashboard';

  const handleSelect = (tab: NavigationTab) => {
    if (onNavigate) onNavigate(tab);
    else if (onSelectView) onSelectView(tab as ActiveView);
    if (onCloseMobileMenu) onCloseMobileMenu();
  };

  // Define role-specific navigation items so users only see what is strictly relevant to them
  const getNavItemsForRole = (role?: string) => {
    const r = (role || '').toLowerCase();

    // 1. BANK BRANCH OFFICER
    if (r.includes('bank') || r === 'bank_officer') {
      return [
        {
          id: 'dashboard' as NavigationTab,
          label: 'Credit Appraisal Desk',
          labelHi: 'ऋण मूल्यांकन डैशबोर्ड',
          icon: <LayoutDashboard className="w-4 h-4" />,
          badge: 'Live',
          badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
        },
        {
          id: 'financials' as NavigationTab,
          label: 'DSCR & Stress Testing',
          labelHi: 'DSCR व ऋण व्यवहार्यता',
          icon: <Calculator className="w-4 h-4" />,
          badge: '10:90',
          badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
        },
        {
          id: 'businessplan' as NavigationTab,
          label: 'Applicant DPR Audit',
          labelHi: 'DPR सत्यापन व ऑडिट',
          icon: <FileSpreadsheet className="w-4 h-4" />,
          badge: 'Audit',
          badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
        },
        {
          id: 'intelligence' as NavigationTab,
          label: 'Mandi & Asset Valuation',
          labelHi: 'मंडी दर व मूल्यांकन',
          icon: <BarChart3 className="w-4 h-4" />
        },
        {
          id: 'advisor' as NavigationTab,
          label: 'Credit Policy AI Sathi',
          labelHi: 'ऋण नीति AI सलाहकार',
          icon: <Bot className="w-4 h-4" />,
          badge: 'AI',
          badgeColor: 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
        }
      ];
    }

    // 2. AGRI-BUYER / INSTITUTIONAL OFF-TAKER
    if (r.includes('buyer') || r.includes('trader') || r === 'institutional_buyer') {
      return [
        {
          id: 'marketplace' as NavigationTab,
          label: 'Off-taker Demand Desk',
          labelHi: 'खरीदार मांग व अनुबंध',
          icon: <ShoppingBag className="w-4 h-4" />,
          badge: `${activeOrdersCount} Orders`,
          badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
        },
        {
          id: 'intelligence' as NavigationTab,
          label: 'Live Mandi Price Trends',
          labelHi: 'लाइव मंडी दर रुझान',
          icon: <BarChart3 className="w-4 h-4" />,
          badge: 'eNAM',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
        },
        {
          id: 'opportunities' as NavigationTab,
          label: 'Regional Supply Clusters',
          labelHi: 'क्षेत्रीय आपूर्ति क्लस्टर',
          icon: <Radar className="w-4 h-4" />
        },
        {
          id: 'dashboard' as NavigationTab,
          label: 'Procurement Dashboard',
          labelHi: 'खरीद डैशबोर्ड',
          icon: <LayoutDashboard className="w-4 h-4" />
        },
        {
          id: 'advisor' as NavigationTab,
          label: 'Procurement AI Advisor',
          labelHi: 'खरीद AI सलाहकार',
          icon: <Bot className="w-4 h-4" />,
          badge: 'AI',
          badgeColor: 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
        }
      ];
    }

    // 3. FPO / SHG FEDERATION LEADER
    if (r.includes('fpo') || r.includes('shg') || r === 'fpo_manager') {
      return [
        {
          id: 'dashboard' as NavigationTab,
          label: 'FPO Cluster Dashboard',
          labelHi: 'FPO क्लस्टर डैशबोर्ड',
          icon: <LayoutDashboard className="w-4 h-4" />,
          badge: 'Cluster',
          badgeColor: 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
        },
        {
          id: 'marketplace' as NavigationTab,
          label: 'Bulk Buyer Demand (50-500T)',
          labelHi: 'थोक खरीदार मांग (50-500T)',
          icon: <ShoppingBag className="w-4 h-4" />,
          badge: `${activeOrdersCount} Orders`,
          badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
        },
        {
          id: 'feasibility' as NavigationTab,
          label: 'Processing Units & Cold Chain',
          labelHi: 'प्रोसेसिंग यूनिट व कोल्ड चेन',
          icon: <MapPin className="w-4 h-4" />,
          badge: 'FPO',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
        },
        {
          id: 'intelligence' as NavigationTab,
          label: 'Mandi Price Intelligence',
          labelHi: 'मंडी खुफिया विश्लेषण',
          icon: <BarChart3 className="w-4 h-4" />
        },
        {
          id: 'opportunities' as NavigationTab,
          label: 'Opportunity Radar',
          labelHi: 'अवसर रडार',
          icon: <Radar className="w-4 h-4" />
        },
        {
          id: 'businessplan' as NavigationTab,
          label: 'FPO DPR & Equity Grants',
          labelHi: 'FPO DPR व इक्विटी ग्रांट',
          icon: <FileSpreadsheet className="w-4 h-4" />,
          badge: 'PDF',
          badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
        },
        {
          id: 'advisor' as NavigationTab,
          label: 'FPO Advisor Sathi',
          labelHi: 'FPO सलाहकार साथी',
          icon: <Bot className="w-4 h-4" />
        }
      ];
    }

    // 4. RURAL ENTREPRENEUR / DEFAULT
    return [
      {
        id: 'dashboard' as NavigationTab,
        label: 'My Business Dashboard',
        labelHi: 'मेरा बिजनेस डैशबोर्ड',
        icon: <LayoutDashboard className="w-4 h-4" />,
        badge: 'Active',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
      },
      {
        id: 'opportunities' as NavigationTab,
        label: 'Top Business Ideas',
        labelHi: 'सर्वश्रेष्ठ बिजनेस विचार',
        icon: <Radar className="w-4 h-4" />,
        badge: 'Radar',
        badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
      },
      {
        id: 'feasibility' as NavigationTab,
        label: 'Project Feasibility Check',
        labelHi: 'व्यवसाय व्यवहार्यता जांच',
        icon: <MapPin className="w-4 h-4" />,
        badge: 'AI Viability',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
      },
      {
        id: 'financials' as NavigationTab,
        label: '10:90 Govt Loan Calculator',
        labelHi: '10:90 स्मार्ट ऋण कैलकुलेटर',
        icon: <Calculator className="w-4 h-4" />,
        badge: '10:90',
        badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
      },
      {
        id: 'businessplan' as NavigationTab,
        label: 'Bank DPR Project Report',
        labelHi: 'बैंक DPR प्रोजेक्ट रिपोर्ट',
        icon: <FileSpreadsheet className="w-4 h-4" />,
        badge: 'Bank PDF',
        badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
      },
      {
        id: 'marketplace' as NavigationTab,
        label: 'Institutional Buyer Orders',
        labelHi: 'खरीदार मांग व अनुबंध',
        icon: <ShoppingBag className="w-4 h-4" />,
        badge: `${activeOrdersCount} Orders`,
        badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
      },
      {
        id: 'intelligence' as NavigationTab,
        label: 'Live Mandi Wholesale Prices',
        labelHi: 'लाइव मंडी थोक भाव',
        icon: <BarChart3 className="w-4 h-4" />,
        badge: 'eNAM',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
      },
      {
        id: 'advisor' as NavigationTab,
        label: 'AI Udyami Sathi (Advisor)',
        labelHi: 'AI उद्यमी साथी (सलाहकार)',
        icon: <Bot className="w-4 h-4" />,
        badge: '24/7 AI',
        badgeColor: 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
      }
    ];
  };

  const navItems = getNavItemsForRole(userRole);

  const getRoleIcon = (role?: string) => {
    const r = (role || '').toLowerCase();
    if (r.includes('bank')) return '🪙';
    if (r.includes('buyer') || r.includes('trader')) return '🏢';
    if (r.includes('fpo') || r.includes('shg')) return '🏢';
    return '🌾';
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full">
      {/* Top Logo & Ecosystem Header */}
      <div>
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20">
              {getRoleIcon(userRole)}
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
              <p className="text-[10px] text-slate-400 font-mono tracking-wide truncate max-w-[130px]">
                Rural Enterprise OS
              </p>
            </div>
          </div>
          {isMobileMenuOpen && onCloseMobileMenu && (
            <button
              onClick={onCloseMobileMenu}
              className="md:hidden text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Role Badge Indicator */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-bold text-slate-300 truncate max-w-[170px]">
              {userRole === 'fpo_manager'
                ? 'FPO Federation Leader'
                : userRole === 'institutional_buyer'
                ? 'Institutional Buyer'
                : userRole === 'bank_officer'
                ? 'Bank Appraisal Officer'
                : 'Rural Entrepreneur'}
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Dedicated Role Workspace
          </div>

          {navItems.map((item) => {
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
            National Helpline: <strong>1800-180-1551</strong>
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
          AgriXora • Unified Rural Enterprise OS
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
