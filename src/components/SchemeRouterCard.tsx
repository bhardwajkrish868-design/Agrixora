import React from 'react';
import { Landmark, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import type { FinancialRoadmap } from '../types';

interface SchemeRouterCardProps {
  financials: FinancialRoadmap;
  onOpenMatrix: () => void;
}

export const SchemeRouterCard: React.FC<SchemeRouterCardProps> = ({ financials, onOpenMatrix }) => {
  const isMicro = financials.scheme.id === 'MICRO_FINANCE';

  return (
    <div className="bg-white rounded-2xl border-2 border-emerald-500/80 shadow-lg p-6 relative overflow-hidden">
      
      {/* Decorative Top Pill */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Module 2: Smart Financial Engine & Scheme Router
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              {financials.scheme.name}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-black border ${
            isMicro ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-blue-100 text-blue-900 border-blue-300'
          }`}>
            {isMicro ? 'Tier 1 : Up to ₹1.40 Lakh' : 'Tier 2 : ₹1.40L - ₹50.00L'}
          </span>
          <button
            onClick={onOpenMatrix}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline flex items-center gap-0.5"
          >
            <span>Scheme Matrix</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 4-Box Key Loan Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">
            Beneficiary Margin (10%)
          </div>
          <div className="text-lg font-black text-slate-900 mt-0.5">
            ₹{financials.marginCapital.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-500">Your upfront cash</div>
        </div>

        <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
          <div className="text-[11px] font-semibold text-emerald-800 uppercase">
            Total Feasible Project Cost
          </div>
          <div className="text-lg font-black text-emerald-700 mt-0.5">
            ₹{financials.projectCost.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold">10x Capital Amplification</div>
        </div>

        <div className="bg-teal-50 p-3.5 rounded-xl border border-teal-200">
          <div className="text-[11px] font-semibold text-teal-800 uppercase">
            Maximum Loan Amount (90%)
          </div>
          <div className="text-lg font-black text-teal-700 mt-0.5">
            ₹{financials.loanAmount.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-teal-600 font-semibold">
            {financials.scheme.interestRateAnnual}% Interest p.a.
          </div>
        </div>

        <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200">
          <div className="text-[11px] font-semibold text-amber-800 uppercase">
            Grace Period (Moratorium)
          </div>
          <div className="text-lg font-black text-amber-900 mt-0.5">
            {financials.scheme.moratoriumMonths} Months
          </div>
          <div className="text-[10px] text-amber-700 font-semibold">
            {financials.scheme.moratoriumQuarters} Quarter Principal Grace
          </div>
        </div>

      </div>

      {/* Scheme Selection Logic Breakdown */}
      <div className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-white text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Routing Logic Evaluation:</span>
        </div>
        <p className="leading-relaxed text-slate-300">
          {isMicro ? (
            <>
              <strong>Logic A Triggered:</strong> Total Feasible Project Cost of <strong>₹{financials.projectCost.toLocaleString('en-IN')}</strong> is &le; ₹1.40 Lakh. The engine automatically routed you to the <strong>Micro Finance Scheme</strong> with concessional <strong>6.5% interest</strong>, a <strong>3-year tenure</strong>, and a <strong>3-month moratorium</strong>.
            </>
          ) : (
            <>
              <strong>Logic B Triggered:</strong> Total Feasible Project Cost of <strong>₹{financials.projectCost.toLocaleString('en-IN')}</strong> is &gt; ₹1.40 Lakh (within ₹50.00 Lakh threshold). The engine automatically routed you to the <strong>Term Loan Scheme</strong> with an <strong>8.0% interest rate</strong>, a <strong>7-year tenure</strong>, and a <strong>6-month moratorium</strong>.
            </>
          )}
        </p>
      </div>

    </div>
  );
};
