import type { FinancialRoadmap, RepaymentPeriod, SchemeRule, SchemeType } from '../types';

export const SCHEMES: Record<SchemeType, SchemeRule> = {
  MICRO_FINANCE: {
    id: 'MICRO_FINANCE',
    name: 'Micro Finance Scheme',
    nameHi: 'माइक्रो फाइनेंस योजना (लघु उद्योग)',
    minProjectCost: 10000,
    maxProjectCost: 140000, // Up to Rs 1.40 Lakh
    maxLoanAmount: 125000, // Max Rs 1.25 Lakh (up to 90%)
    interestRateAnnual: 6.5, // 6.5% p.a. concessional
    interestRate: 6.5,
    tenureYears: 3,
    repaymentTenureYears: 3,
    tenureQuarters: 12,
    tenureMonths: 36,
    moratoriumMonths: 3,
    moratoriumQuarters: 1,
    marginPercent: 10,
    loanPercent: 90,
    description: 'Designed for small cottage units & micro enterprises up to ₹1.40 Lakh project cost with 6.5% concessional interest.',
    descriptionHi: '₹1.40 लाख तक की छोटी इकाइयों के लिए 6.5% रियायती ब्याज दर व 3 महीने की मोहलत के साथ 3 साल का ऋण।',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  TERM_LOAN: {
    id: 'TERM_LOAN',
    name: 'Term Loan Scheme',
    nameHi: 'टर्म लोन योजना (मध्यम व दीर्घकालिक)',
    minProjectCost: 140001, // > Rs 1.40 Lakh
    maxProjectCost: 5000000, // Up to Rs 50.00 Lakh
    maxLoanAmount: 4500000, // Max Rs 45.00 Lakh (90%)
    interestRateAnnual: 8.0, // 8.0% p.a.
    interestRate: 8.0,
    tenureYears: 7,
    repaymentTenureYears: 7,
    tenureQuarters: 28,
    tenureMonths: 84,
    moratoriumMonths: 6,
    moratoriumQuarters: 2,
    marginPercent: 10,
    loanPercent: 90,
    description: 'Aimed at medium project investments between ₹1.40 Lakh and ₹50.00 Lakh with 8% interest rate and 7 years tenure.',
    descriptionHi: '₹1.40 लाख से ₹50 लाख तक के निवेश के लिए 8% ब्याज दर व 6 महीने की मोहलत सहित 7 साल का टर्म लोन।',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  EXCEEDS_CAP: {
    id: 'EXCEEDS_CAP',
    name: 'Large Enterprise / Consortium Threshold',
    nameHi: 'सीमा से अधिक (कंसोर्टियम / विशेष योजना)',
    minProjectCost: 5000001,
    maxProjectCost: 100000000,
    maxLoanAmount: 4500000,
    interestRateAnnual: 8.5,
    interestRate: 8.5,
    tenureYears: 7,
    repaymentTenureYears: 7,
    tenureQuarters: 28,
    tenureMonths: 84,
    moratoriumMonths: 6,
    moratoriumQuarters: 2,
    marginPercent: 10,
    loanPercent: 90,
    description: 'Exceeds standard ₹50 Lakh single beneficiary ceiling. Advised to structure as SHG Federation or PMEGP/CGS.',
    descriptionHi: '₹50 लाख से अधिक की परियोजना के लिए क्लस्टर आधारित या बहु-हितधारक मॉडल अनुशंसित है।',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
  }
};

export function selectSchemeForProjectCost(projectCost: number): SchemeRule {
  if (projectCost <= 140000) {
    return SCHEMES.MICRO_FINANCE;
  } else if (projectCost <= 5000000) {
    return SCHEMES.TERM_LOAN;
  } else {
    return SCHEMES.EXCEEDS_CAP;
  }
}

export function calculateFinancialRoadmap(marginCapital: number): FinancialRoadmap {
  const safeMargin = Math.max(1000, marginCapital || 10000);
  const rawProjectCost = safeMargin * 10;
  const projectCost = Math.min(rawProjectCost, 5000000);
  const scheme = selectSchemeForProjectCost(projectCost);

  let loanAmount = Math.round(projectCost * 0.90);
  if (scheme.id === 'MICRO_FINANCE' && loanAmount > 125000) {
    loanAmount = 125000;
  } else if (scheme.id === 'TERM_LOAN' && loanAmount > 4500000) {
    loanAmount = 4500000;
  }

  const capexPercent = scheme.id === 'MICRO_FINANCE' ? 0.60 : 0.70;
  const capexAmount = Math.round(projectCost * capexPercent);
  const workingCapitalAmount = projectCost - capexAmount;

  const totalQuarters = scheme.tenureQuarters;
  const moratoriumQuarters = scheme.moratoriumQuarters;
  const activeRepaymentQuarters = totalQuarters - moratoriumQuarters;
  const quarterlyRate = (scheme.interestRateAnnual / 100) / 4;

  let quarterlyEMI = 0;
  if (quarterlyRate > 0 && activeRepaymentQuarters > 0) {
    quarterlyEMI = Math.round(
      (loanAmount * quarterlyRate * Math.pow(1 + quarterlyRate, activeRepaymentQuarters)) /
      (Math.pow(1 + quarterlyRate, activeRepaymentQuarters) - 1)
    );
  } else {
    quarterlyEMI = Math.round(loanAmount / (activeRepaymentQuarters || 1));
  }

  const monthlyEMIEquivalent = Math.round(quarterlyEMI / 3);

  const quarterlyRepaymentSchedule: RepaymentPeriod[] = [];
  let balance = loanAmount;
  let totalInterestPayable = 0;

  for (let q = 1; q <= totalQuarters; q++) {
    const isMoratorium = q <= moratoriumQuarters;
    const interest = Math.round(balance * quarterlyRate);
    totalInterestPayable += interest;

    let principal = 0;
    let payment = 0;

    if (isMoratorium) {
      payment = interest;
    } else {
      payment = (q === totalQuarters) ? balance + interest : quarterlyEMI;
      principal = Math.min(balance, payment - interest);
      balance = Math.max(0, balance - principal);
    }

    const begBal = balance + principal;
    quarterlyRepaymentSchedule.push({
      periodNumber: q,
      periodLabel: isMoratorium ? `Quarter ${q} (Moratorium)` : `Quarter ${q}`,
      isMoratorium,
      beginningBalance: begBal,
      principalPayment: principal,
      interestPayment: interest,
      totalPayment: payment,
      endingBalance: balance,
      label: isMoratorium ? `Q${q} (Grace Period)` : `Quarter ${q}`,
      openingBalance: begBal,
      installment: payment,
      principalComponent: principal,
      interestComponent: interest,
      closingBalance: balance
    });
  }

  const totalMonths = scheme.tenureMonths;
  const moratoriumMonths = scheme.moratoriumMonths;
  const activeMonths = totalMonths - moratoriumMonths;
  const monthlyRate = (scheme.interestRateAnnual / 100) / 12;

  let monthlyEMI = 0;
  if (monthlyRate > 0 && activeMonths > 0) {
    monthlyEMI = Math.round(
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, activeMonths)) /
      (Math.pow(1 + monthlyRate, activeMonths) - 1)
    );
  } else {
    monthlyEMI = Math.round(loanAmount / (activeMonths || 1));
  }

  const monthlyRepaymentSchedule: RepaymentPeriod[] = [];
  let mBalance = loanAmount;

  for (let m = 1; m <= totalMonths; m++) {
    const isMoratorium = m <= moratoriumMonths;
    const interest = Math.round(mBalance * monthlyRate);
    let principal = 0;
    let payment = 0;

    if (isMoratorium) {
      payment = interest;
    } else {
      payment = (m === totalMonths) ? mBalance + interest : monthlyEMI;
      principal = Math.min(mBalance, payment - interest);
      mBalance = Math.max(0, mBalance - principal);
    }

    const begBal = mBalance + principal;
    monthlyRepaymentSchedule.push({
      periodNumber: m,
      periodLabel: isMoratorium ? `Month ${m} (Moratorium)` : `Month ${m}`,
      isMoratorium,
      beginningBalance: begBal,
      principalPayment: principal,
      interestPayment: interest,
      totalPayment: payment,
      endingBalance: mBalance,
      label: isMoratorium ? `Month ${m} (Grace)` : `Month ${m}`,
      openingBalance: begBal,
      installment: payment,
      principalComponent: principal,
      interestComponent: interest,
      closingBalance: mBalance
    });
  }

  const totalRepaymentAmount = loanAmount + totalInterestPayable;

  const turnoverRatio = scheme.id === 'MICRO_FINANCE' ? 0.32 : 0.25;
  const projectedMonthlyRevenue = Math.round(projectCost * turnoverRatio);
  const projectedMonthlyOpEx = Math.round(projectedMonthlyRevenue * 0.70);
  const operatingProfit = projectedMonthlyRevenue - projectedMonthlyOpEx;
  const projectedMonthlyNetProfit = Math.round(operatingProfit - monthlyEMIEquivalent);

  const debtServiceCoverageRatio = monthlyEMIEquivalent > 0 
    ? Number((operatingProfit / monthlyEMIEquivalent).toFixed(2)) 
    : 3.5;

  const breakEvenMonths = scheme.id === 'MICRO_FINANCE' ? 3 : 5;

  const capexItems = [
    { item: 'Core Machinery & Processing Equipment', cost: Math.round(capexAmount * 0.65), description: 'Primary production tools, motor, expeller/loom/refrigeration' },
    { item: 'Shed Preparation & Electrical Wiring', cost: Math.round(capexAmount * 0.20), description: '3-phase/single-phase power hookup, concrete base' },
    { item: 'Testing Tools, Weighing Scale & Storage', cost: Math.round(capexAmount * 0.15), description: 'Quality inspection, bins, and initial safety gear' },
  ];

  const workingCapitalItems = [
    { item: 'Raw Material Initial Stock (1-2 Months)', cost: Math.round(workingCapitalAmount * 0.60), description: 'Procurement of farm inputs / raw fabrics / seeds' },
    { item: 'Packaging Material & Branding Labels', cost: Math.round(workingCapitalAmount * 0.15), description: 'Eco-pouches, boxes, barcode/FSSAI stickers' },
    { item: 'Utilities, Wages & Contingency Reserve', cost: Math.round(workingCapitalAmount * 0.25), description: 'Electricity buffer and initial labor wages' },
  ];

  const isViable = debtServiceCoverageRatio >= 1.5;
  const viabilityRemarks = isViable
    ? `Strong Debt Service Coverage Ratio (DSCR: ${debtServiceCoverageRatio}x). The projected operating cashflow comfortably covers quarterly debt obligations with a solid buffer.`
    : `Moderate DSCR (${debtServiceCoverageRatio}x). Beneficiary should manage initial inventory tightly during the ${scheme.moratoriumMonths}-month moratorium period.`;

  return {
    marginCapital: safeMargin,
    projectCost,
    loanAmount,
    scheme,
    quarterlyEMI,
    monthlyEMIEquivalent,
    monthlyEquivalentEMI: monthlyEMIEquivalent,
    totalInterestPayable,
    totalRepaymentAmount,
    capexAmount,
    workingCapitalAmount,
    capexItems,
    workingCapitalItems,
    projectedMonthlyRevenue,
    projectedMonthlyOpEx,
    projectedMonthlyNetProfit,
    breakEvenMonths,
    debtServiceCoverageRatio,
    quarterlyRepaymentSchedule,
    monthlyRepaymentSchedule,
    isViable,
    viabilityRemarks
  };
}
