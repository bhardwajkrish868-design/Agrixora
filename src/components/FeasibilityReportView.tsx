import React from 'react';
import { 
  Users, 
  Compass, 
  Layers, 
  AlertTriangle, 
  Activity, 
  Tag, 
  MapPin, 
  CheckCircle2, 
  Store,
  Sparkles,
  Volume2
} from 'lucide-react';
import type { FeasibilityReport, Language } from '../types';

interface FeasibilityReportViewProps {
  report: FeasibilityReport;
  currentLanguage: Language;
  onSpeakSummary: () => void;
}

export const FeasibilityReportView: React.FC<FeasibilityReportViewProps> = ({
  report,
  onSpeakSummary
}) => {
  const getSaturationColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-emerald-500 text-white';
      case 'Moderate': return 'bg-blue-500 text-white';
      case 'High': return 'bg-amber-500 text-white';
      case 'Saturated': return 'bg-rose-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Feasibility Verdict & Overall Score */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Module 1: Hyper-Local Feasibility Intelligence
            </span>
            <span className="text-xs text-slate-400">ID: {report.id}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {report.businessName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5 mt-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              {report.location.village}, Block: {report.location.block}, {report.location.district}, {report.location.state}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-center">
            <div className="text-xs text-slate-500 font-semibold">Feasibility Score</div>
            <div className="text-3xl font-black text-emerald-600">{report.overallFeasibilityScore}/100</div>
          </div>
          <div className="h-10 w-px bg-slate-300" />
          <div>
            <div className="text-xs text-slate-500 font-semibold">Readiness Verdict</div>
            <div className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 mt-0.5">
              {report.readinessVerdict}
            </div>
          </div>
          <button
            onClick={onSpeakSummary}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs cursor-pointer"
            title="Listen to Voice Summary"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. MARKET REACH (5-10 km Radius Catchment) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                1. Market Reach & Consumer Catchment
              </h3>
              <p className="text-xs text-slate-500">
                Estimated consumer base within a {report.marketReach.radiusKm} km radius of {report.location.village}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl text-xs text-blue-900">
              <span className="text-slate-500 mr-1">Consumer Population:</span>
              <strong className="font-bold text-sm">~{report.marketReach.estimatedConsumerCount.toLocaleString('en-IN')}</strong>
              <span className="text-slate-500 ml-2">({report.marketReach.estimatedHouseholds.toLocaleString('en-IN')} Households)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Target Demographic Segments */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
              Primary Consumer Segments
            </h4>
            <div className="space-y-2.5">
              {report.marketReach.primaryTargetSegments.map((seg, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{seg.segment}</span>
                    <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      {seg.sharePercent}% Catchment
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{seg.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Distribution Channels */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
              Distribution & Offtake Channels
            </h4>
            <div className="space-y-2.5">
              {report.marketReach.primaryDistributionChannels.map((chan, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900">{chan.channel}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        chan.suitability === 'High' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800'
                      }`}>
                        {chan.suitability} Suitability
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{chan.rationale}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Haat & D2C Footnote */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="bg-emerald-50/60 border border-emerald-200 p-3 rounded-xl">
            <span className="font-bold text-emerald-900 block mb-1">Weekly Haat Bazaars:</span>
            <p className="text-slate-700 text-[11px]">{report.marketReach.weeklyHaatPotential}</p>
          </div>
          <div className="bg-teal-50/60 border border-teal-200 p-3 rounded-xl">
            <span className="font-bold text-teal-900 block mb-1">Direct-to-Consumer Trust:</span>
            <p className="text-slate-700 text-[11px]">{report.marketReach.directToConsumerPotential}</p>
          </div>
        </div>
      </div>

      {/* 2. OPPORTUNITY ANALYSIS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-5">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              2. Opportunity Analysis & Unserved Niches
            </h3>
            <p className="text-xs text-slate-500">
              High-margin value additions and unserved gaps in the {report.location.block} local economy
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {report.opportunity.unservedNiches.map((niche, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded">
                    Niche Opportunity #{idx + 1}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {niche.valuePotential} Potential
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1.5">{niche.title}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">{niche.explanation}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Value Additions & B2B Tieups */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Recommended Value Addition Ideas:</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {report.opportunity.valueAdditionIdeas.map((va, idx) => (
                <li key={idx} className="flex items-start justify-between gap-2 text-[11px]">
                  <span>• {va.idea}</span>
                  <span className="text-emerald-700 font-bold shrink-0">+{va.estimatedMarginBoostPercent}% Margin</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-blue-500" />
              <span>B2B Institutional Off-take Linkages:</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {report.opportunity.b2bInstitutionalTieups.map((tieup, idx) => (
                <li key={idx} className="flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>{tieup}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 3. SWOT ANALYSIS MATRIX */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-5">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              3. General Business Analysis (SWOT Matrix)
            </h3>
            <p className="text-xs text-slate-500">
              Tailored micro-enterprise breakdown for the proposed project budget
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Strengths */}
          <div className="p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50/30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                Strengths (आंतरिक ताकत)
              </h4>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                Internal Positive
              </span>
            </div>
            <div className="space-y-2.5">
              {report.swot.strengths.map((s, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded-lg border border-emerald-100">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-0.5">
                    <span>{s.point}</span>
                    <span className="text-[10px] text-emerald-700">{s.impactLevel} Impact</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{s.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50/30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                Weaknesses (कमजोरियां)
              </h4>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                Internal Challenges
              </span>
            </div>
            <div className="space-y-2.5">
              {report.swot.weaknesses.map((w, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded-lg border border-amber-100">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-0.5">
                    <span>{w.point}</span>
                    <span className="text-[10px] text-amber-700">{w.impactLevel} Impact</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{w.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Opportunities */}
          <div className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50/30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                Opportunities (बाहरी अवसर)
              </h4>
              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                External Growth
              </span>
            </div>
            <div className="space-y-2.5">
              {report.swot.opportunities.map((o, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-0.5">
                    <span>{o.point}</span>
                    <span className="text-[10px] text-blue-700">{o.impactLevel} Impact</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{o.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Threats */}
          <div className="p-4 rounded-xl border-2 border-rose-200 bg-rose-50/30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                Threats (संभावित जोखिम)
              </h4>
              <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                External Risks
              </span>
            </div>
            <div className="space-y-2.5">
              {report.swot.threats.map((tItem, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded-lg border border-rose-100">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-0.5">
                    <span>{tItem.point}</span>
                    <span className="text-[10px] text-rose-700">{tItem.impactLevel} Risk</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{tItem.detail}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 4. LOCALIZED THREATS & MITIGATION PLAYBOOK */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-5">
          <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              4. Localized Threats Identification & Mitigation Playbook
            </h3>
            <p className="text-xs text-slate-500">
              Actionable safeguards against supply bottlenecks, seasonality, single-buyer lock-in & informal credit
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {report.threats.map((threat, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{threat.riskType} Risk:</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                    {threat.severity} Severity
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-700 mb-2 leading-relaxed">{threat.description}</p>
              <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg text-xs text-emerald-950 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <strong>Mitigation Action Plan: </strong>
                  <span>{threat.mitigationStrategy}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. COMPETITOR MAPPING & SATURATION METER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-5">
          <div className="p-2 rounded-xl bg-teal-100 text-teal-700">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              5. Competitor Density & Market Saturation Mapping
            </h3>
            <p className="text-xs text-slate-500">
              Localized density estimation and strategic competitive moats in {report.location.block}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
            <div className="text-xs text-slate-500 font-semibold">Competitors in Block</div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              ~{report.competitorMapping.estimatedCompetitorCountInBlock} Units
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Estimated in 10-15 km radius</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
            <div className="text-xs text-slate-500 font-semibold">Density per 10k Population</div>
            <div className="text-2xl font-black text-blue-600 mt-1">
              {report.competitorMapping.competitorDensityPer10k}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Low-to-moderate density</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
            <div className="text-xs text-slate-500 font-semibold">Saturation Level</div>
            <div className="mt-1">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getSaturationColor(report.competitorMapping.saturationLevel)}`}>
                {report.competitorMapping.saturationLevel} ({report.competitorMapping.saturationScore}/100)
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">{report.competitorMapping.marketMaturity.split('.')[0]}</div>
          </div>
        </div>

        {/* Competitive Moat Strategy */}
        <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl">
          <h4 className="text-xs font-bold text-emerald-950 mb-2">
            Recommended Competitive Moats & Edge:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {report.competitorMapping.suggestedCompetitiveMoat.map((moat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-800 bg-white p-2 rounded-lg border border-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{moat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. PRODUCT MARKET VALUE & OPTIMAL PRICING */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-5">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              6. Product Market Value & Pricing Strategy
            </h3>
            <p className="text-xs text-slate-500">
              Unit economics, mandi comparison, and gross margins benchmarked to rural purchasing power
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3">Product / Service</th>
                <th className="p-3">Unit</th>
                <th className="p-3">Production Cost</th>
                <th className="p-3">Mandi / Wholesale</th>
                <th className="p-3">Suggested Retail</th>
                <th className="p-3">Gross Margin</th>
                <th className="p-3">Strategy Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {report.productPricing.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-slate-900">{item.productName}</td>
                  <td className="p-3 font-mono text-slate-600">{item.unit}</td>
                  <td className="p-3 font-semibold">₹{item.estimatedCostOfProduction}</td>
                  <td className="p-3 text-slate-600">₹{item.suggestedWholesalePrice}</td>
                  <td className="p-3 font-bold text-emerald-700">₹{item.suggestedRetailPrice}</td>
                  <td className="p-3">
                    <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {item.grossMarginPercent}%
                    </span>
                  </td>
                  <td className="p-3 text-[11px] text-slate-500">{item.pricingStrategyNote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
