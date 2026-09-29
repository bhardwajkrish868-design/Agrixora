import React, { useState } from 'react';
import { 
  IndianRupee, 
  Calendar, 
  Clock, 
  TrendingUp, 
  FileText, 
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { FinancialRoadmap, Language } from '../types';
import { useTranslation } from '../utils/i18n';

interface FinancialRoadmapViewProps {
  financials: FinancialRoadmap;
  currentLanguage: Language;
  onOpenDPRModal: () => void;
}

export const FinancialRoadmapView: React.FC<FinancialRoadmapViewProps> = ({
  financials,
  currentLanguage,
  onOpenDPRModal
}) => {
  const t = useTranslation(currentLanguage);
  const [scheduleView, setScheduleView] = useState<'quarterly' | 'monthly'>('quarterly');
  const [showAllRows, setShowAllRows] = useState(false);

  const displayedSchedule = scheduleView === 'quarterly' 
    ? (showAllRows ? financials.quarterlyRepaymentSchedule : financials.quarterlyRepaymentSchedule.slice(0, 8))
    : (showAllRows ? financials.monthlyRepaymentSchedule : financials.monthlyRepaymentSchedule.slice(0, 12));

  return (
    <div className="space-y-6">
      
      {/* 1. MEANS OF FINANCE & CAPITAL STRUCTURING BREAKDOWN */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                1. Financial Structuring & Means of Finance
              </h3>
              <p className="text-xs text-slate-500">
                10% Beneficiary Equity amplified to 100% Project Scale via 90% Institutional Loan
              </p>
            </div>
          </div>

          <button
            onClick={onOpenDPRModal}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>{t.dprDownloadBtn}</span>
          </button>
        </div>

        {/* Visual Capital Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-700">Total Project Scale: ₹{financials.projectCost.toLocaleString('en-IN')}</span>
            <span className="text-emerald-700">100% Capitalized</span>
          </div>
          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
            <div 
              style={{ width: '10%' }} 
              className="bg-amber-500 h-full flex items-center justify-center text-[9px] font-black text-white"
              title="10% Margin Capital"
            >
              10%
            </div>
            <div 
              style={{ width: '90%' }} 
              className="bg-emerald-600 h-full flex items-center justify-center text-[9px] font-black text-white"
              title="90% Scheme Loan Assistance"
            >
              90% Scheme Loan (₹{financials.loanAmount.toLocaleString('en-IN')})
            </div>
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 mt-1">
            <span className="text-amber-700 font-semibold">• Beneficiary Margin: ₹{financials.marginCapital.toLocaleString('en-IN')} (10%)</span>
            <span className="text-emerald-700 font-semibold">• Scheme Debt: ₹{financials.loanAmount.toLocaleString('en-IN')} (90%)</span>
          </div>
        </div>

        {/* CapEx vs Working Capital Allocation Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-slate-100">
          
          {/* CapEx Breakdown */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Capital Expenditure (CapEx)
                </h4>
                <div className="text-[11px] text-slate-500">Fixed assets, machinery & shed</div>
              </div>
              <span className="text-sm font-black text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                ₹{financials.capexAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="space-y-2">
              {financials.capexItems.map((item, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-800">{item.item}</div>
                    <div className="text-[10px] text-slate-400">{item.description}</div>
                  </div>
                  <span className="font-bold text-slate-900 ml-2">₹{item.cost.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Working Capital Breakdown */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Working Capital Buffer (OpEx)
                </h4>
                <div className="text-[11px] text-slate-500">Raw materials, utilities & wages</div>
              </div>
              <span className="text-sm font-black text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                ₹{financials.workingCapitalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="space-y-2">
              {financials.workingCapitalItems.map((item, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-800">{item.item}</div>
                    <div className="text-[10px] text-slate-400">{item.description}</div>
                  </div>
                  <span className="font-bold text-slate-900 ml-2">₹{item.cost.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 2. REVENUE, OPEX & MONTHLY CASH FLOW PROJECTIONS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-5">
          <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              2. Projected Monthly Cash Flow & Viability Metrics
            </h3>
            <p className="text-xs text-slate-500">
              Estimated turnover, monthly operating expense, debt service obligations, and net take-home surplus
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-[11px] text-slate-500 font-semibold">Projected Monthly Revenue</div>
            <div className="text-lg font-black text-slate-900 mt-0.5">
              ₹{financials.projectedMonthlyRevenue.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-400">At ~70% capacity</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-[11px] text-slate-500 font-semibold">Monthly Operating Costs</div>
            <div className="text-lg font-black text-rose-600 mt-0.5">
              ₹{financials.projectedMonthlyOpEx.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-400">Inputs + utilities + labor</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-[11px] text-slate-500 font-semibold">Monthly Debt Obligation</div>
            <div className="text-lg font-black text-blue-600 mt-0.5">
              ₹{financials.monthlyEMIEquivalent.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-400">(Quarterly EMI / 3)</div>
          </div>

          <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
            <div className="text-[11px] text-emerald-800 font-semibold">Net Monthly Take-Home</div>
            <div className="text-lg font-black text-emerald-700 mt-0.5">
              ₹{financials.projectedMonthlyNetProfit.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold">Post EMI & OpEx Profit</div>
          </div>
        </div>

        {/* Debt Service Coverage Ratio (DSCR) & Break-Even Callout */}
        <div className="bg-slate-900 text-white p-4 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="sm:border-r sm:border-slate-800 pr-3">
            <div className="text-slate-400 font-semibold">Debt Service Coverage Ratio (DSCR):</div>
            <div className="text-xl font-extrabold text-emerald-400 mt-1">{financials.debtServiceCoverageRatio}x</div>
            <div className="text-[10px] text-slate-400">Benchmark &gt; 1.5x (Safe Lending Standard)</div>
          </div>

          <div className="sm:border-r sm:border-slate-800 pr-3">
            <div className="text-slate-400 font-semibold">Estimated Break-Even Timeline:</div>
            <div className="text-xl font-extrabold text-amber-300 mt-1">{financials.breakEvenMonths} Months</div>
            <div className="text-[10px] text-slate-400">Coincides with Moratorium completion</div>
          </div>

          <div>
            <div className="text-slate-400 font-semibold">Financial Viability Status:</div>
            <div className="text-sm font-bold text-teal-300 mt-1">{financials.viabilityRemarks}</div>
          </div>
        </div>
      </div>

      {/* 3. EMI & MORATORIUM REPAYMENT SCHEDULE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                3. EMI & Moratorium Amortization Schedule
              </h3>
              <p className="text-xs text-slate-500">
                {financials.scheme.moratoriumMonths}-Month Moratorium + {financials.scheme.tenureYears}-Year Repayment Schedule ({financials.scheme.interestRateAnnual}% p.a.)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-semibold">
              <button
                onClick={() => setScheduleView('quarterly')}
                className={`px-3 py-1 rounded-md transition-all ${
                  scheduleView === 'quarterly' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600'
                }`}
              >
                Quarterly (Official Scheme Standard)
              </button>
              <button
                onClick={() => setScheduleView('monthly')}
                className={`px-3 py-1 rounded-md transition-all ${
                  scheduleView === 'monthly' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600'
                }`}
              >
                Monthly Breakdown
              </button>
            </div>
          </div>
        </div>

        {/* Moratorium Badge Alert */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-4 text-xs text-amber-950 flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <strong>Moratorium Protection Activated: </strong>
            <span>
              During the initial {financials.scheme.moratoriumMonths} months ({financials.scheme.moratoriumQuarters} Quarter), principal repayment is <strong>₹0</strong>. Beneficiary only services regular simple interest (₹{(financials.quarterlyRepaymentSchedule[0]?.interestPayment || 0).toLocaleString('en-IN')}) to preserve capital for machine installation.
            </span>
          </div>
        </div>

        {/* Amortization Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3">Period</th>
                <th className="p-3">Opening Balance</th>
                <th className="p-3">Principal</th>
                <th className="p-3">Interest ({financials.scheme.interestRateAnnual}%)</th>
                <th className="p-3">Total Installment</th>
                <th className="p-3">Closing Balance</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {displayedSchedule.map((row) => (
                <tr 
                  key={row.periodNumber} 
                  className={`hover:bg-slate-50 transition-colors ${
                    row.isMoratorium ? 'bg-amber-50/40 font-semibold' : ''
                  }`}
                >
                  <td className="p-3 font-bold text-slate-900">{row.periodLabel}</td>
                  <td className="p-3 font-mono">₹{row.beginningBalance.toLocaleString('en-IN')}</td>
                  <td className="p-3 font-mono text-emerald-700">
                    {row.isMoratorium ? '₹0 (Grace)' : `₹${row.principalPayment.toLocaleString('en-IN')}`}
                  </td>
                  <td className="p-3 font-mono text-slate-600">₹{row.interestPayment.toLocaleString('en-IN')}</td>
                  <td className="p-3 font-mono font-bold text-slate-900">₹{row.totalPayment.toLocaleString('en-IN')}</td>
                  <td className="p-3 font-mono">₹{row.endingBalance.toLocaleString('en-IN')}</td>
                  <td className="p-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      row.isMoratorium 
                        ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}>
                      {row.isMoratorium ? 'Moratorium' : 'Active EMI'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Toggle View More Rows */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Total Interest over {financials.scheme.tenureYears} Years: <strong className="text-slate-800">₹{financials.totalInterestPayable.toLocaleString('en-IN')}</strong> | Total Repayment: <strong className="text-slate-800">₹{financials.totalRepaymentAmount.toLocaleString('en-IN')}</strong>
          </span>
          <button
            onClick={() => setShowAllRows(!showAllRows)}
            className="flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            <span>{showAllRows ? 'Show Less' : `View Full ${scheduleView === 'quarterly' ? financials.scheme.tenureQuarters + ' Quarters' : 'Tenure Table'}`}</span>
            {showAllRows ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

    </div>
  );
};
