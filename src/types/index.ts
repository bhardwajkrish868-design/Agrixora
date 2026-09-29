export type Language = 'en' | 'hi' | 'mr' | 'bn' | 'ta' | 'te' | 'kn' | 'gu';

export type SchemeType = 'MICRO_FINANCE' | 'TERM_LOAN' | 'EXCEEDS_CAP';

export interface SchemeRule {
  id: SchemeType;
  name: string;
  nameHi: string;
  minProjectCost: number;
  maxProjectCost: number;
  maxLoanAmount: number;
  interestRateAnnual: number;
  tenureYears: number;
  tenureQuarters: number;
  tenureMonths: number;
  moratoriumMonths: number;
  moratoriumQuarters: number;
  marginPercent: number; // 10%
  loanPercent: number; // 90%
  description: string;
  descriptionHi: string;
  badgeColor: string;
}

export interface BusinessCategoryInfo {
  id: string;
  name: string;
  nameHi: string;
  icon: string;
  typicalCapexPercent: number;
  typicalOpexPercent: number;
  standardMarginMin: number;
  standardMarginMax: number;
  unitType: string;
  avgProductionCostPerUnit: number;
  avgSellingPricePerUnit: number;
  mandiPricePerUnit: number;
  description: string;
}

export interface LocationInput {
  state: string;
  district: string;
  block: string;
  village: string;
  pinCode?: string;
  areaType: 'rural' | 'semi-urban' | 'peri-urban';
  catchmentRadiusKm: 5 | 10;
}

export interface UserInputForm {
  location: LocationInput;
  businessCategoryId: string;
  customBusinessName?: string;
  availableMarginCapital: number; // e.g. 100000 (Rs 1,00,000)
  entrepreneurName?: string;
  priorExperienceYears?: number;
  hasOwnLandShed?: boolean;
  electricityAvailabilityHours?: number;
  preferredLanguage: Language;
}

export interface RepaymentPeriod {
  periodNumber: number; // 1 to total quarters or months
  periodLabel: string; // e.g. "Q1 (Moratorium)"
  isMoratorium: boolean;
  beginningBalance: number;
  principalPayment: number;
  interestPayment: number;
  totalPayment: number;
  endingBalance: number;
}

export interface FinancialRoadmap {
  marginCapital: number;
  projectCost: number;
  loanAmount: number;
  scheme: SchemeRule;
  quarterlyEMI: number;
  monthlyEMIEquivalent: number;
  totalInterestPayable: number;
  totalRepaymentAmount: number;
  capexAmount: number;
  workingCapitalAmount: number;
  capexItems: { item: string; cost: number; description: string }[];
  workingCapitalItems: { item: string; cost: number; description: string }[];
  projectedMonthlyRevenue: number;
  projectedMonthlyOpEx: number;
  projectedMonthlyNetProfit: number;
  breakEvenMonths: number;
  debtServiceCoverageRatio: number; // DSCR = Net Operating Income / Debt Service
  quarterlyRepaymentSchedule: RepaymentPeriod[];
  monthlyRepaymentSchedule: RepaymentPeriod[];
  isViable: boolean;
  viabilityRemarks: string;
}

export interface MarketReachAnalysis {
  radiusKm: number;
  estimatedConsumerCount: number;
  estimatedHouseholds: number;
  primaryTargetSegments: { segment: string; sharePercent: number; description: string }[];
  primaryDistributionChannels: { channel: string; suitability: 'High' | 'Medium' | 'Low'; rationale: string }[];
  weeklyHaatPotential: string;
  directToConsumerPotential: string;
}

export interface OpportunityAnalysis {
  unservedNiches: { title: string; explanation: string; valuePotential: 'High' | 'Medium' }[];
  valueAdditionIdeas: { idea: string; estimatedMarginBoostPercent: number }[];
  b2bInstitutionalTieups: string[];
  localRawMaterialAdvantage: string;
}

export interface SWOTItem {
  point: string;
  detail: string;
  impactLevel: 'High' | 'Medium' | 'Low';
}

export interface SWOTAnalysis {
  strengths: SWOTItem[];
  weaknesses: SWOTItem[];
  opportunities: SWOTItem[];
  threats: SWOTItem[];
}

export interface LocalizedThreat {
  riskType: 'Supply Chain' | 'Seasonality' | 'Single Buyer' | 'Climate/Perishability' | 'Power/Infrastructure' | 'Credit/Cashflow';
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  mitigationStrategy: string;
}

export interface CompetitorMapping {
  estimatedCompetitorCountInBlock: number;
  competitorDensityPer10k: number;
  saturationLevel: 'Low' | 'Moderate' | 'High' | 'Saturated';
  saturationScore: number; // 0 to 100
  marketMaturity: string;
  suggestedCompetitiveMoat: string[];
}

export interface ProductPricingItem {
  productName: string;
  unit: string;
  estimatedCostOfProduction: number;
  suggestedWholesalePrice: number;
  suggestedRetailPrice: number;
  localPurchasingPowerIndex: 'Budget' | 'Standard' | 'Premium';
  grossMarginPercent: number;
  pricingStrategyNote: string;
}

export interface FeasibilityReport {
  id: string;
  createdAt: string;
  businessName: string;
  categoryName: string;
  location: LocationInput;
  marketReach: MarketReachAnalysis;
  opportunity: OpportunityAnalysis;
  swot: SWOTAnalysis;
  threats: LocalizedThreat[];
  competitorMapping: CompetitorMapping;
  productPricing: ProductPricingItem[];
  overallFeasibilityScore: number; // 0 to 100
  readinessVerdict: 'Highly Feasible' | 'Feasible with Mitigation' | 'Needs Restructuring';
  keyActionPlan: string[];
}

export interface FullFeasibilityDPR {
  report: FeasibilityReport;
  financials: FinancialRoadmap;
  timestamp: string;
}
