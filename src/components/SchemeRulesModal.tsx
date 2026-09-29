import React from 'react';
import { X, Percent, Clock } from 'lucide-react';
import { SCHEMES } from '../data/schemes';

interface SchemeRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SchemeRulesModal: React.FC<SchemeRulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Official Institutional Scheme Guidelines
            </h2>
            <p className="text-xs text-slate-500">
              Government-backed micro-enterprise credit architecture for rural & semi-urban units
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Key Rule Callout */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-600 text-white mt-0.5">
              <Percent className="w-4 h-4" />
            </div>
            <div className="text-xs text-emerald-900 space-y-1">
              <p className="font-bold text-sm text-emerald-950">
                The 10% Beneficiary Margin Rule
              </p>
              <p>
                Beneficiaries are only required to contribute <span className="font-bold underline">10% Available Margin Capital</span>. The funding agency extends up to <span className="font-bold underline">90% of the Total Feasible Project Cost</span> as concessional debt.
              </p>
            </div>
          </div>

          {/* Scheme Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Scheme Tier 1: Micro Finance */}
            <div className="rounded-xl border-2 border-emerald-400 bg-emerald-50/30 p-5 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                Tier 1 : Micro Units
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900 mb-1">
                  {SCHEMES.MICRO_FINANCE.name}
                </h3>
                <p className="text-xs text-emerald-700 font-medium mb-4">
                  {SCHEMES.MICRO_FINANCE.nameHi}
                </p>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-emerald-100">
                    <span className="text-slate-600">Project Cost Ceiling:</span>
                    <span className="font-bold text-slate-900">Up to ₹1.40 Lakh (₹1,40,000)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-emerald-100">
                    <span className="text-slate-600">Max Loan Support (90%):</span>
                    <span className="font-bold text-emerald-700">Up to ₹1.25 Lakh (₹1,25,000)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-emerald-100">
                    <span className="text-slate-600">Beneficiary Margin (10%):</span>
                    <span className="font-bold text-slate-900">Up to ₹14,000</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-emerald-100">
                    <span className="text-slate-600">Concessional Interest:</span>
                    <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">6.5% p.a.</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-emerald-100">
                    <span className="text-slate-600">Total Loan Tenure:</span>
                    <span className="font-bold text-slate-900">3 Years (36 Months / 12 Quarters)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-emerald-100">
                    <span className="text-slate-600">Moratorium Period:</span>
                    <span className="font-bold text-emerald-900">3 Months (1 Quarter Grace)</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-200/60 text-[11px] text-slate-600">
                Ideal for: Cottage crafts, tailoring shops, single-milch animal, small spice packaging units.
              </div>
            </div>

            {/* Scheme Tier 2: Term Loan */}
            <div className="rounded-xl border-2 border-blue-400 bg-blue-50/30 p-5 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                Tier 2 : Larger Projects
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900 mb-1">
                  {SCHEMES.TERM_LOAN.name}
                </h3>
                <p className="text-xs text-blue-700 font-medium mb-4">
                  {SCHEMES.TERM_LOAN.nameHi}
                </p>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-blue-100">
                    <span className="text-slate-600">Project Cost Range:</span>
                    <span className="font-bold text-slate-900">₹1.40 Lakh to ₹50.00 Lakh</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-blue-100">
                    <span className="text-slate-600">Max Loan Support (90%):</span>
                    <span className="font-bold text-blue-700">Up to ₹45.00 Lakh (₹45,00,000)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-blue-100">
                    <span className="text-slate-600">Beneficiary Margin (10%):</span>
                    <span className="font-bold text-slate-900">₹14,000 to ₹5,00,000</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-blue-100">
                    <span className="text-slate-600">Interest Rate:</span>
                    <span className="font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">8.0% p.a.</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-blue-100">
                    <span className="text-slate-600">Total Loan Tenure:</span>
                    <span className="font-bold text-slate-900">7 Years (84 Months / 28 Quarters)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-blue-100">
                    <span className="text-slate-600">Moratorium Period:</span>
                    <span className="font-bold text-blue-900">6 Months (2 Quarters Grace)</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-blue-200/60 text-[11px] text-slate-600">
                Ideal for: Oil expellers, mini dal mills, commercial dairy units, poultry farms, bio-fertilizer plants.
              </div>
            </div>

          </div>

          {/* Moratorium Explanation */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              What is the Moratorium Period?
            </h4>
            <p className="leading-relaxed">
              During the 3-month (Micro Finance) or 6-month (Term Loan) moratorium, the entrepreneur is exempted from principal debt payments. This grants crucial breathing room to purchase machinery, complete electrical wiring, obtain food safety licenses, and initiate sales before quarterly repayments commence.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Close Matrix
          </button>
        </div>

      </div>
    </div>
  );
};
