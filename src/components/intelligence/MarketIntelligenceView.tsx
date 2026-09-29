import React, { useState } from 'react';
import { 
  Info,
  Sparkles,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { COMMODITY_PRICE_TRENDS, REGIONAL_DEMOGRAPHIC_STATS } from '../../data/marketIntelligenceData';
import type { Language, LocationCatchment, NavigationTab } from '../../types';

interface MarketIntelligenceViewProps {
  currentLanguage: Language;
  location?: LocationCatchment;
  onNavigate?: (tab: NavigationTab) => void;
}

export const MarketIntelligenceView: React.FC<MarketIntelligenceViewProps> = ({
  location,
  onNavigate
}) => {
  const [selectedCommodity, setSelectedCommodity] = useState<'mustard_oil' | 'raw_milk' | 'tomato'>('mustard_oil');
  const trends = COMMODITY_PRICE_TRENDS[selectedCommodity];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-100 dark:bg-teal-950 dark:text-teal-400 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Econometric Intelligence & Pricing Engine
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              Demo Data Layer (Illustrative Estimate)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            Regional Market & Price Intelligence
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-1">
            Tracking farm-gate procurement rates, mandi wholesale benchmarks, retail consumer margins, and seasonal demand volatility {location ? `for ${location.district}, ${location.state}` : ''}.
          </p>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('feasibility')}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer shrink-0 transition-all"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Validate Business Idea</span>
          </button>
        )}
      </div>

      {/* Catchment Info Bar if location provided */}
      {location && (
        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 dark:text-emerald-300">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Active Catchment: <strong>{location.panchayat || location.block}, {location.district} ({location.state})</strong> • Radius: {location.catchmentRadiusKm} km</span>
          </div>
          <span className="text-xs text-slate-500">Agro Zone: {location.agroClimaticZone}</span>
        </div>
      )}

      {/* Data Honesty Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-950 dark:text-amber-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong>Data Transparency Disclosure: </strong>
          <span>
            The figures below represent our econometric benchmark model calibrated for Indian rural clusters. The platform architecture is pre-configured for live AGMARKNET and eNAM API integration upon national deployment.
          </span>
        </div>
      </div>

      {/* Demographic KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {REGIONAL_DEMOGRAPHIC_STATS.map((stat, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase line-clamp-1">{stat.metric}</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{stat.badge}</span>
            </div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Interactive Price Trend Chart & Benchmark */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Price Realization Matrix (Farm-Gate vs Mandi vs Retail)
            </h3>
            <p className="text-xs text-slate-500">6-Month trend analysis across supply chain nodes</p>
          </div>

          <div className="flex gap-2">
            {[
              { id: 'mustard_oil', label: 'Mustard Oil (₹/L)' },
              { id: 'raw_milk', label: 'Raw Milk (₹/L)' },
              { id: 'tomato', label: 'Tomato (₹/Kg)' }
            ].map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCommodity(c.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCommodity === c.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Trend Bars */}
        <div className="space-y-4">
          <div className="grid grid-cols-6 gap-2 text-center text-xs font-bold text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-700">
            {trends.map(t => <span key={t.month}>{t.month}</span>)}
          </div>

          <div className="grid grid-cols-6 gap-2">
            {trends.map(t => (
              <div key={t.month} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2 text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">Retail Price</div>
                  <div className="font-extrabold text-emerald-600 dark:text-emerald-400">₹{t.retailPrice}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Mandi Price</div>
                  <div className="font-bold text-blue-600 dark:text-blue-400">₹{t.mandiWholesalePrice}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Farm Gate</div>
                  <div className="font-semibold text-slate-600 dark:text-slate-300">₹{t.farmGatePrice}</div>
                </div>
                <div className="pt-1 border-t border-slate-200 dark:border-slate-700 text-[10px] font-bold text-purple-600">
                  Vol: {t.volumeIndex}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs pt-2 border-t border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-600" /> Suggested Direct Retail Counter Price</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-600" /> APMC Mandi Wholesale Benchmark</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-500" /> Direct Farm-Gate Procurement Rate</span>
        </div>
      </div>

    </div>
  );
};
