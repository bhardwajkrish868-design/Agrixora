import React from 'react';
import { Sparkles, TrendingUp, ShieldCheck, Landmark, Zap } from 'lucide-react';
import type { Language } from '../types';
import { DEMO_PRESETS, type DemoPreset } from '../data/regionsData';
import { useTranslation } from '../utils/i18n';

interface HeroBannerProps {
  currentLanguage: Language;
  onSelectPreset: (preset: DemoPreset) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ currentLanguage, onSelectPreset }) => {
  const t = useTranslation(currentLanguage);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-900/40">
      
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl">
        
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t.heroBadge}</span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3 leading-tight">
          {t.heroTitle}
        </h1>

        {/* Subhead */}
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">
          {t.heroDesc}
        </p>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-white/5 border border-white/10 backdrop-blur-xs p-3 rounded-xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Financial Formula</div>
              <div className="text-sm font-bold text-white">10% Margin : 90% Loan</div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-xs p-3 rounded-xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Grace Period</div>
              <div className="text-sm font-bold text-white">3 to 6 Months Moratorium</div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-xs p-3 rounded-xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Concessional Rates</div>
              <div className="text-sm font-bold text-white">6.5% - 8.0% p.a.</div>
            </div>
          </div>
        </div>

        {/* Instant Demo Presets Selector */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400/90 mb-2 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.demoPresetsTitle}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {DEMO_PRESETS.map(preset => (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className="text-left bg-white/10 hover:bg-emerald-600/30 border border-white/10 hover:border-emerald-400/50 p-2.5 rounded-xl transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-white group-hover:text-emerald-300">
                  <span className="truncate">{preset.title.split('•')[0]}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-emerald-300 font-mono">
                    {preset.badge.split(' ')[0]}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 truncate mt-1">
                  {preset.subtitle}
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
