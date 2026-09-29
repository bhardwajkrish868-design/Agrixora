import React from 'react';
import { 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  MapPin,
  ShoppingBag
} from 'lucide-react';
import { OPPORTUNITY_RADAR_ITEMS } from '../../data/opportunityData';
import type { OpportunityItem, ActiveView, Language, LocationCatchment } from '../../types';

interface OpportunityRadarViewProps {
  currentLanguage: Language;
  location?: LocationCatchment;
  onLaunchFeasibility?: (item: OpportunityItem) => void;
  onSelectOpportunity?: (category: string) => void;
  onNavigateToMarketplace?: () => void;
  onSelectView?: (view: ActiveView) => void;
}

export const OpportunityRadarView: React.FC<OpportunityRadarViewProps> = ({
  location,
  onLaunchFeasibility,
  onSelectOpportunity,
  onNavigateToMarketplace,
  onSelectView
}) => {
  const handleLaunch = (opp: OpportunityItem) => {
    if (onLaunchFeasibility) {
      onLaunchFeasibility(opp);
    } else if (onSelectOpportunity) {
      onSelectOpportunity(opp.category);
      if (onSelectView) onSelectView('feasibility');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 dark:bg-purple-950 dark:text-purple-400 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            Catchment Opportunity Radar
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            Regional Opportunity Radar & Underserved Niches
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-1">
            Detecting high-demand, low-competition, high-margin business niches with verified government funding compatibility {location ? `for ${location.district}, ${location.state}` : ''}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToMarketplace && (
            <button
              onClick={onNavigateToMarketplace}
              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-amber-600" />
              <span>Buyer Marketplace</span>
            </button>
          )}
          <button
            onClick={() => {
              if (onSelectView) onSelectView('feasibility');
            }}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer shrink-0 transition-all"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Custom Feasibility</span>
          </button>
        </div>
      </div>

      {/* Catchment Info Bar if location provided */}
      {location && (
        <div className="bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/60 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-900 dark:text-purple-300">
            <MapPin className="w-4 h-4 text-purple-600" />
            <span>Catchment Region: <strong>{location.district} ({location.state})</strong> • Key Local Crops: {location.keyCrops?.join(', ') || 'Tomato, Mustard, Grapes, Pulses'}</span>
          </div>
          <span className="text-xs text-slate-500">Radius: {location.catchmentRadiusKm} km</span>
        </div>
      )}

      {/* Opportunity Radar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {OPPORTUNITY_RADAR_ITEMS.map((opp) => (
          <div
            key={opp.id}
            className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md hover:border-purple-500 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  {opp.category}
                </span>

                <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs px-2.5 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Score: {opp.opportunityScore}/100</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {opp.title}
              </h3>

              {/* 4 KPI Metrics */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400">Demand Level:</span>
                  <div className="font-extrabold text-emerald-600 dark:text-emerald-400">{opp.demandLevel}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Competition:</span>
                  <div className="font-extrabold text-blue-600 dark:text-blue-400">{opp.competitionLevel}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Required Margin:</span>
                  <div className="font-bold font-mono text-slate-800 dark:text-slate-200">
                    ₹{opp.investmentRequired.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Expected Margin:</span>
                  <div className="font-extrabold text-purple-600 dark:text-purple-400">~{opp.expectedMarginPercent}%</div>
                </div>
              </div>

              {/* Scheme Compatibility */}
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-900 dark:text-blue-300 flex items-center justify-between font-semibold">
                <span>Funding Scheme:</span>
                <span className="font-bold">{opp.schemeCompatibility}</span>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {opp.rationale}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={() => handleLaunch(opp)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Run Feasibility on This Niche</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
