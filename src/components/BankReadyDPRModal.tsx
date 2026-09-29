import React from 'react';
import { X, Printer, Landmark } from 'lucide-react';
import type { FeasibilityReport, FinancialRoadmap, UserInputForm } from '../types';

interface BankReadyDPRModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: FeasibilityReport;
  financials: FinancialRoadmap;
  formData: UserInputForm;
}

export const BankReadyDPRModal: React.FC<BankReadyDPRModalProps> = ({
  isOpen,
  onClose,
  report,
  financials,
  formData
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden">
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">Bank-Ready Detailed Project Report (DPR Dossier)</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable DPR Document Container */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-white text-slate-900 font-serif leading-normal space-y-6">
          
          {/* Header & Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-slate-600 font-sans font-bold">
                Government Micro-Enterprise Credit Appraisal Dossier
              </div>
              <h1 className="text-2xl font-bold font-sans text-slate-950 mt-1">
                DETAILED PROJECT APPRAISAL REPORT (DPR)
              </h1>
              <div className="text-xs font-sans text-slate-600 mt-1">
                For Submission to Lead District Bank / NABARD / DIC / Financing Agency
              </div>
            </div>
            <div className="text-right font-sans text-xs">
              <div className="font-bold text-slate-900">DPR Ref: {report.id}</div>
              <div className="text-slate-500">Date: {report.createdAt}</div>
              <div className="text-emerald-700 font-bold mt-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {financials.scheme.name}
              </div>
            </div>
          </div>

          {/* 1. APPLICANT & UNIT PROFILE */}
          <section className="font-sans space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider bg-slate-100 p-1.5 border-l-4 border-emerald-600 text-slate-900">
              1. Project & Entrepreneur Profile
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500">Proposed Enterprise:</span>
                <span className="font-bold text-slate-900 ml-2">{report.businessName}</span>
              </div>
              <div>
                <span className="text-slate-500">Entrepreneur Name:</span>
                <span className="font-bold text-slate-900 ml-2">{formData.entrepreneurName || 'Eligible Beneficiary'}</span>
              </div>
              <div>
                <span className="text-slate-500">Unit Location:</span>
                <span className="font-bold text-slate-900 ml-2">{report.location.village}, Block: {report.location.block}, {report.location.district}, {report.location.state}</span>
              </div>
              <div>
                <span className="text-slate-500">Experience & Infrastructure:</span>
                <span className="font-bold text-slate-900 ml-2">{formData.priorExperienceYears || 0} Yrs Experience • {formData.hasOwnLandShed ? 'Own Shed Available' : 'Rented Shed'}</span>
              </div>
            </div>
          </section>

          {/* 2. PROJECT COST & MEANS OF FINANCE */}
          <section className="font-sans space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider bg-slate-100 p-1.5 border-l-4 border-emerald-600 text-slate-900">
              2. Total Project Cost & Means of Finance (10% Margin : 90% Loan)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Cost of Project */}
              <table className="w-full text-xs border border-slate-200">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-bold">
                    <th className="p-2 text-left">Cost Component</th>
                    <th className="p-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  <tr>
                    <td className="p-2">Capital Expenditure (Machinery & Shed)</td>
                    <td className="p-2 text-right font-mono font-bold">₹{financials.capexAmount.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="p-2">Working Capital Requirement (OpEx)</td>
                    <td className="p-2 text-right font-mono font-bold">₹{financials.workingCapitalAmount.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-slate-100 font-bold text-slate-900">
                    <td className="p-2">TOTAL PROJECT COST</td>
                    <td className="p-2 text-right font-mono text-emerald-800">₹{financials.projectCost.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>

              {/* Means of Finance */}
              <table className="w-full text-xs border border-slate-200">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-bold">
                    <th className="p-2 text-left">Means of Finance</th>
                    <th className="p-2 text-center">% Share</th>
                    <th className="p-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  <tr>
                    <td className="p-2">Beneficiary Margin Equity</td>
                    <td className="p-2 text-center">10%</td>
                    <td className="p-2 text-right font-mono font-bold">₹{financials.marginCapital.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="p-2">{financials.scheme.name} Loan</td>
                    <td className="p-2 text-center font-bold text-emerald-700">90%</td>
                    <td className="p-2 text-right font-mono font-bold text-emerald-700">₹{financials.loanAmount.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-slate-100 font-bold text-slate-900">
                    <td className="p-2">TOTAL CAPITALIZATION</td>
                    <td className="p-2 text-center">100%</td>
                    <td className="p-2 text-right font-mono text-emerald-800">₹{financials.projectCost.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>

            </div>
          </section>

          {/* 3. LOAN REPAYMENT & MORATORIUM TERMS */}
          <section className="font-sans space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider bg-slate-100 p-1.5 border-l-4 border-emerald-600 text-slate-900">
              3. Loan Terms, Interest & Moratorium Schedule
            </h2>
            <div className="grid grid-cols-4 gap-2 text-xs border border-slate-200 p-3 rounded-lg bg-slate-50">
              <div>
                <span className="text-slate-500">Interest Rate:</span>
                <div className="font-bold text-slate-900">{financials.scheme.interestRateAnnual}% p.a.</div>
              </div>
              <div>
                <span className="text-slate-500">Tenure:</span>
                <div className="font-bold text-slate-900">{financials.scheme.tenureYears} Years ({financials.scheme.tenureQuarters} Quarters)</div>
              </div>
              <div>
                <span className="text-slate-500">Moratorium:</span>
                <div className="font-bold text-emerald-800">{financials.scheme.moratoriumMonths} Months Grace</div>
              </div>
              <div>
                <span className="text-slate-500">Quarterly EMI:</span>
                <div className="font-bold text-emerald-800">₹{financials.quarterlyEMI.toLocaleString('en-IN')}</div>
              </div>
            </div>
          </section>

          {/* 4. FINANCIAL VIABILITY & DSCR APPRAISAL */}
          <section className="font-sans space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider bg-slate-100 p-1.5 border-l-4 border-emerald-600 text-slate-900">
              4. Financial Viability & DSCR Appraisal
            </h2>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="border border-slate-200 p-2.5 rounded">
                <span className="text-slate-500">Projected Monthly Revenue:</span>
                <div className="font-bold text-slate-900 text-sm">₹{financials.projectedMonthlyRevenue.toLocaleString('en-IN')}</div>
              </div>
              <div className="border border-slate-200 p-2.5 rounded">
                <span className="text-slate-500">Net Monthly Surplus:</span>
                <div className="font-bold text-emerald-700 text-sm">₹{financials.projectedMonthlyNetProfit.toLocaleString('en-IN')}</div>
              </div>
              <div className="border border-slate-200 p-2.5 rounded bg-emerald-50/50">
                <span className="text-emerald-900 font-semibold">Debt Service Ratio (DSCR):</span>
                <div className="font-extrabold text-emerald-800 text-sm">{financials.debtServiceCoverageRatio}x (Healthy)</div>
              </div>
            </div>
          </section>

          {/* 5. HYPER-LOCAL FEASIBILITY SUMMARY */}
          <section className="font-sans space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider bg-slate-100 p-1.5 border-l-4 border-emerald-600 text-slate-900">
              5. Hyper-Local Market Feasibility Assessment
            </h2>
            <div className="text-xs space-y-1.5 text-slate-800 leading-relaxed">
              <p>
                <strong>Market Catchment:</strong> Estimated ~{report.marketReach.estimatedConsumerCount.toLocaleString('en-IN')} consumers within a {report.marketReach.radiusKm} km radius. High demand offtake via weekly village haats and direct farm-gate retail.
              </p>
              <p>
                <strong>Competitive Moat:</strong> Saturation index in {report.location.block} is {report.competitorMapping.saturationLevel} ({report.competitorMapping.saturationScore}/100). The proposed unit features hygienic packaging and unadulterated processing.
              </p>
            </div>
          </section>

          {/* Applicant Declaration */}
          <div className="pt-6 border-t border-slate-300 font-sans text-xs grid grid-cols-2 gap-8">
            <div>
              <p className="text-slate-500 italic mb-8">
                "I hereby declare that the information provided above is true to the best of my knowledge and I agree to deposit the 10% margin capital upon loan sanction."
              </p>
              <div className="border-t border-slate-400 pt-1 font-bold">
                Signature of Applicant / Beneficiary
              </div>
            </div>

            <div className="text-right">
              <p className="text-slate-500 italic mb-8">
                "Verified and recommended for appraisal under {financials.scheme.name}."
              </p>
              <div className="border-t border-slate-400 pt-1 font-bold">
                Bank Branch Manager / Appraisal Officer
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
