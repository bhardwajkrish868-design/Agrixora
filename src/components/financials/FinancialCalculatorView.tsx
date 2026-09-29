import React, { useState } from 'react';
import { 
  Landmark, 
  FileText, 
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import type { FinancialRoadmap, FeasibilityReport, Language } from '../../types';
import { calculateFinancialRoadmap } from '../../data/schemes';

interface FinancialCalculatorViewProps {
  currentMargin?: number;
  onChangeMargin?: (newMargin: number) => void;
  currentLanguage: Language;
  initialFinancials?: FinancialRoadmap | null;
  initialReport?: FeasibilityReport | null;
  onOpenDPRModal?: () => void;
  onOpenSchemeModal?: () => void;
  onNavigateToDPR?: () => void;
}

export const FinancialCalculatorView: React.FC<FinancialCalculatorViewProps> = ({
  currentMargin: externalMargin,
  onChangeMargin: externalOnChangeMargin,
  initialFinancials,
  onOpenDPRModal,
  onOpenSchemeModal,
  onNavigateToDPR
}) => {
  const [internalMargin, setInternalMargin] = useState<number>(
    initialFinancials?.marginCapital || 10000
  );
  const [scheduleView, setScheduleView] = useState<'quarterly' | 'monthly'>('quarterly');
  const [showAllRows, setShowAllRows] = useState(false);

  const activeMargin = externalMargin !== undefined ? externalMargin : internalMargin;

  const handleMarginChange = (val: number) => {
    if (externalOnChangeMargin) {
      externalOnChangeMargin(val);
    } else {
      setInternalMargin(val);
    }
  };

  const financials = calculateFinancialRoadmap(activeMargin);
  const isMicro = financials.scheme.id === 'MICRO_FINANCE';

  const displayedSchedule = scheduleView === 'quarterly'
    ? (showAllRows ? financials.quarterlyRepaymentSchedule : financials.quarterlyRepaymentSchedule.slice(0, 8))
    : (showAllRows ? financials.monthlyRepaymentSchedule : financials.monthlyRepaymentSchedule.slice(0, 12));

  const QUICK_MARGINS = [
    { label: '₹10,000', value: 10000, note: '₹1.0L Scale' },
    { label: '₹14,000', value: 14000, note: '₹1.4L (Micro Max)' },
    { label: '₹25,000', value: 25000, note: '₹2.5L Scale' },
    { label: '₹50,000', value: 50000, note: '₹5.0L Scale' },
    { label: '₹1,00,000', value: 100000, note: '₹10.0L Scale' },
    { label: '₹2,50,000', value: 250000, note: '₹25.0L Scale' },
    { label: '₹5,00,000', value: 500000, note: '₹50.0L (Term Max)' }
  ];

  const handleDPRClick = () => {
    if (onNavigateToDPR) {
      onNavigateToDPR();
    } else if (onOpenDPRModal) {
      onOpenDPRModal();
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            PS 26091 Module 2 • 10:90 Leverage & Amortization Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            Smart Scheme Loan Calculator
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-1">
            Calculate your borrowing power, automatic scheme routing logic (Micro Finance vs Term Loan), moratorium grace periods, and amortization tables.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenSchemeModal && (
            <button
              onClick={onOpenSchemeModal}
              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
            >
              <Landmark className="w-4 h-4 text-emerald-600" />
              <span>Scheme Policy Rules</span>
            </button>
          )}
          <button
            onClick={handleDPRClick}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer shrink-0 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Bank DPR</span>
          </button>
        </div>
      </div>

      {/* Interactive Margin Capital Slider Box */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-emerald-500/80 shadow-md p-6 sm:p-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              Available Margin Capital (Beneficiary 10% Equity)
            </label>
            <span className="text-xs text-slate-500">
              The upfront cash amount you have ready to invest. 10x multiplier unlocks 90% loan.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-400">₹</span>
            <input
              type="number"
              min="1000"
              max="5000000"
              step="1000"
              value={activeMargin}
              onChange={(e) => handleMarginChange(Number(e.target.value) || 0)}
              className="text-2xl font-black text-slate-900 dark:text-white font-mono bg-slate-50 dark:bg-slate-900 border-2 border-emerald-500 rounded-2xl px-4 py-2 w-48 text-right outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="5000"
            max="500000"
            step="2500"
            value={activeMargin}
            onChange={(e) => handleMarginChange(Number(e.target.value))}
            className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[11px] font-semibold text-slate-400">
            <span>₹5,000 (₹50k Project)</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">₹14,000 (Micro Max)</span>
            <span>₹2,50,000 (₹25L Project)</span>
            <span className="text-teal-600 dark:text-teal-400 font-bold">₹5,00,000 (Term Max)</span>
          </div>
        </div>

        {/* Quick Presets Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {QUICK_MARGINS.map((q) => (
            <button
              key={q.value}
              onClick={() => handleMarginChange(q.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeMargin === q.value
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <span>{q.label}</span>
              <span className="opacity-75 font-normal ml-1">({q.note})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Auto-Routed Scheme Decision Card */}
      <div className={`p-6 sm:p-8 rounded-3xl border-2 transition-all ${
        isMicro 
          ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500' 
          : 'bg-teal-50/70 dark:bg-teal-950/40 border-teal-500'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isMicro ? 'bg-emerald-600 text-white' : 'bg-teal-600 text-white'
              }`}>
                {financials.scheme.name}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Auto-Selected via Project Size: ₹{financials.projectCost.toLocaleString('en-IN')}
              </span>
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {financials.scheme.nameHi}
            </h2>

            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {financials.scheme.description}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Scale</span>
              <strong className="text-lg font-mono font-black text-slate-900 dark:text-white">
                ₹{financials.projectCost.toLocaleString('en-IN')}
              </strong>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">90% Loan Amount</span>
              <strong className="text-lg font-mono font-black text-emerald-600 dark:text-emerald-400">
                ₹{financials.loanAmount.toLocaleString('en-IN')}
              </strong>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Interest Rate</span>
              <strong className="text-lg font-mono font-black text-amber-600 dark:text-amber-400">
                {financials.scheme.interestRate}% p.a.
              </strong>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Moratorium</span>
              <strong className="text-lg font-mono font-black text-blue-600 dark:text-blue-400">
                {financials.scheme.moratoriumMonths} Months
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Repayment Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Quarterly EMI
          </span>
          <h3 className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            ₹{financials.quarterlyEMI.toLocaleString('en-IN')}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            Payable every 3 months after the {financials.scheme.moratoriumMonths}-month moratorium.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Monthly Equivalent
          </span>
          <h3 className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            ₹{financials.monthlyEquivalentEMI.toLocaleString('en-IN')}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            Calculated as Quarterly EMI / 3 for monthly cashflow planning.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Total Repayment Tenure
          </span>
          <h3 className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            {financials.scheme.repaymentTenureYears} Years
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            {financials.quarterlyRepaymentSchedule.length} total quarters (including grace period).
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Total Interest Payable
          </span>
          <h3 className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
            ₹{financials.totalInterestPayable.toLocaleString('en-IN')}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            Concessional interest rate subsidized under rural development mandate.
          </p>
        </div>
      </div>

      {/* Amortization Schedule Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Detailed Amortization & Repayment Schedule
            </h3>
            <p className="text-xs text-slate-500">
              Complete principal, interest, and remaining balance timeline.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
            <button
              onClick={() => setScheduleView('quarterly')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                scheduleView === 'quarterly'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Quarterly Schedule
            </button>
            <button
              onClick={() => setScheduleView('monthly')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                scheduleView === 'monthly'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Monthly Equivalent
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Period</th>
                <th className="py-3 px-3">Opening Balance</th>
                <th className="py-3 px-3">EMI / Installment</th>
                <th className="py-3 px-3">Principal</th>
                <th className="py-3 px-3">Interest</th>
                <th className="py-3 px-3 text-right">Closing Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {displayedSchedule.map((row: any) => {
                const isMoratorium = row.isMoratorium;
                return (
                  <tr
                    key={row.periodNumber}
                    className={isMoratorium ? 'bg-amber-50/60 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200' : 'hover:bg-slate-50 dark:hover:bg-slate-900/50'}
                  >
                    <td className="py-2.5 px-3 font-bold font-sans">
                      {row.label}
                      {isMoratorium && (
                        <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-semibold">
                          Moratorium
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">₹{row.openingBalance.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                      ₹{row.installment.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">
                      ₹{row.principalComponent.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-amber-600 dark:text-amber-400">
                      ₹{row.interestComponent.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold">
                      ₹{row.closingBalance.toLocaleString('en-IN')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center pt-2">
          <button
            onClick={() => setShowAllRows(!showAllRows)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-1.5 transition-all"
          >
            {showAllRows ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>Show Less Rows</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>View Complete {scheduleView === 'quarterly' ? financials.quarterlyRepaymentSchedule.length : financials.monthlyRepaymentSchedule.length}-Period Schedule</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};
