import React, { useState } from 'react';
import { Globe, BookOpen, Key, Bot } from 'lucide-react';
import type { Language } from '../types';
import { LANGUAGE_OPTIONS, useTranslation } from '../utils/i18n';

interface NavbarProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenSchemeModal: () => void;
  onOpenApiKeyModal: () => void;
  onToggleAICoach: () => void;
  isAICoachOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLanguage,
  onLanguageChange,
  onOpenSchemeModal,
  onOpenApiKeyModal,
  onToggleAICoach,
  isAICoachOpen
}) => {
  const t = useTranslation(currentLanguage);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <span className="font-black text-xl tracking-tight">गु</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">
                {t.appName}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                AI Advisory + 90% Loan Router
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Scheme Rules Guide Button */}
          <button
            onClick={onOpenSchemeModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="View Official Scheme Guidelines"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">Scheme Matrix</span>
          </button>

          {/* AI Coach Toggle */}
          <button
            onClick={onToggleAICoach}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-xs ${
              isAICoachOpen
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Coach Sathi</span>
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenApiKeyModal}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative"
            title="Configure Gemini API Key"
          >
            <Key className="w-4 h-4" />
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:border-emerald-500 rounded-lg shadow-2xs transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{LANGUAGE_OPTIONS.find(l => l.code === currentLanguage)?.native || 'Language'}</span>
            </button>

            {langMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setLangMenuOpen(false)}
              >
                <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Select Language / भाषा
                </div>
                {LANGUAGE_OPTIONS.map(opt => (
                  <button
                    key={opt.code}
                    onClick={() => onLanguageChange(opt.code)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                      currentLanguage === opt.code ? 'font-bold text-emerald-700 bg-emerald-50/60' : 'text-slate-700'
                    }`}
                  >
                    <span>{opt.native}</span>
                    <span className="text-[11px] text-slate-400">{opt.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
