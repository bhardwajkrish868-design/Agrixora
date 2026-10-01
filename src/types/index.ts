export type Language = 'en' | 'hi' | 'hinglish' | 'mr' | 'bn' | 'ta' | 'te' | 'kn' | 'gu';

export type ActiveView = 
  | 'landing'
  | 'dashboard'
  | 'feasibility'
  | 'financials'
  | 'loanroadmap'
  | 'marketplace'
  | 'opportunities'
  | 'intelligence'
  | 'businessplan'
  | 'advisor'
  | 'reports'
  | 'profile'
  | 'settings'
  | 'login'
  | 'register'
  | 'admin';

export type NavigationTab = ActiveView;

export type SchemeType = 'MICRO_FINANCE' | 'TERM_LOAN' | 'EXCEEDS_CAP';

export interface SchemeRule {
  id: SchemeType;
  name: string;
  nameHi: string;
  minProjectCost: number;
  maxProjectCost: number;
  maxLoanAmount: number;
  interestRateAnnual: number;
  interestRate: number; // shorthand alias
  tenureYears: number;
  repaymentTenureYears: number; // shorthand alias
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
  sector: 'Agriculture' | 'Dairy' | 'Food Processing' | 'Poultry' | 'Fisheries' | 'Textiles' | 'Retail' | 'Manufacturing' | 'Services' | 'Handicrafts' | 'Other';
  typicalCapexPercent: number;
  typicalOpexPercent: number;
  standardMarginMin: number;
  standardMarginMax: number;
  unitType: string;
  avgProductionCostPerUnit: number;
  avgSellingPricePerUnit: number;
  mandiPricePerUnit: number;
  description: string;
  defaultActivities?: string[];
  schemeEligibility?: string;
}

export interface LocationInput {
  state: string;
  district: string;
  block: string;
  village: string;
  gramPanchayat?: string;
  pinCode?: string;
  areaType: 'rural' | 'semi-urban' | 'peri-urban';
  catchmentRadiusKm: 5 | 10 | number;
  estimatedPopulation?: number;
  agroClimaticZone?: string;
  keyCrops?: string[];
  panchayat?: string;
}

export type LocationCatchment = {
  state: string;
  district: string;
  block: string;
  village?: string;
  panchayat?: string;
  gramPanchayat?: string;
  pinCode?: string;
  areaType?: 'rural' | 'semi-urban' | 'peri-urban';
  catchmentRadiusKm: number;
  estimatedPopulation?: number;
  agroClimaticZone?: string;
  keyCrops?: string[];
};

export interface UserInputForm {
  location: LocationInput;
  businessCategoryId: string;
  customBusinessName?: string;
  availableMarginCapital: number; // e.g. 100000 (Rs 1,00,000)
  entrepreneurName?: string;
  priorExperienceYears?: number;
  experienceLevel?: 'beginner' | 'intermediate' | 'experienced';
  hasOwnLandShed?: boolean;
  electricityAvailabilityHours?: number;
  targetMonthlyProductionUnits?: number;
  preferredLanguage: Language;
}

export interface RepaymentPeriod {
  periodNumber: number;
  periodLabel: string;
  isMoratorium: boolean;
  beginningBalance: number;
  principalPayment: number;
  interestPayment: number;
  totalPayment: number;
  endingBalance: number;
  // Shorthand aliases for tables
  label?: string;
  openingBalance?: number;
  installment?: number;
  principalComponent?: number;
  interestComponent?: number;
  closingBalance?: number;
}

export interface FinancialRoadmap {
  marginCapital: number;
  projectCost: number;
  loanAmount: number;
  scheme: SchemeRule;
  quarterlyEMI: number;
  monthlyEMIEquivalent: number;
  monthlyEquivalentEMI: number; // alias
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
  debtServiceCoverageRatio: number; // DSCR
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
  riskType: 'Supply Chain' | 'Seasonality' | 'Single Buyer' | 'Climate/Perishability' | 'Power/Infrastructure' | 'Credit/Cashflow' | 'Transportation';
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

/* =========================================================
   PS 26033 INTEGRATED TYPES: BUYER DEMAND & OPPORTUNITY RADAR
   ========================================================= */

export interface PreBulkDemandOrder {
  id: string;
  buyerName: string;
  buyerType: 'Food Processor' | 'Retail Aggregator' | 'Government / State Agency' | 'Dairy Federation' | 'FPO Network' | 'Exporter' | string;
  buyerLogoUrl?: string;
  product: string;
  category: string;
  qualityGrade: 'Grade A (Export / Premium)' | 'Grade B (Standard Commercial)' | 'Organic Certified' | string;
  requiredQuantityTonnes: number;
  committedQuantityTonnes: number;
  offeredPricePerUnit: number;
  unit: 'Tonne' | 'Kg' | 'Litre' | 'Crate' | string;
  deliveryDate: string;
  location: string;
  district: string;
  state: string;
  pickupMode: 'Farm-gate Collection Center' | 'Mandi Drop-off' | 'Hub Delivery' | string;
  paymentTerms: '100% Direct Bank Transfer within 48h' | '50% Advance + 50% on Delivery' | 'Escrow Protected' | string;
  verifiedBuyerBadge: boolean;
  notes: string;
}

export type InstitutionalDemand = PreBulkDemandOrder;

export interface SupplyPledge {
  id: string;
  orderId: string;
  producerName: string;
  producerContact: string;
  pledgedQuantity: number;
  village: string;
  pledgedAt: string;
  status: 'Confirmed' | 'Under Inspection' | 'Delivered';
}

export interface OpportunityRadarItem {
  id: string;
  title: string;
  category: string;
  demandLevel: 'High' | 'Very High' | 'Moderate' | string;
  competitionLevel: 'Low' | 'Moderate' | 'High' | string;
  investmentRequired: number;
  suggestedProjectScale?: number; // project cost
  expectedMarginPercent: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | string;
  opportunityScore: number; // 0 - 100
  schemeCompatibility: 'Micro Finance (6.5%)' | 'Term Loan (8.0%)' | string;
  rationale: string;
  topBuyerPledgesCount: number;
}

export type OpportunityItem = OpportunityRadarItem;

export interface MarketPriceTrend {
  month: string;
  farmGatePrice: number;
  mandiWholesalePrice: number;
  retailPrice: number;
  volumeIndex: number;
}

export interface CompleteBusinessPlan {
  businessOverview: string;
  marketAnalysis: string;
  productServiceSpecs: string;
  targetDemographics: string;
  competitiveStrategy: string;
  pricingPolicy: string;
  operationalPlan: string;
  capitalInvestment: string;
  loanStructuringPlan: string;
  revenueProjectionsYear1to3: string;
  operatingExpensesBreakdown: string;
  profitAndLossStatement: string;
  riskMatrixAndMitigation: string;
  implementationMilestones: { month: string; milestone: string; status: 'Done' | 'In Progress' | 'Planned' }[];
}
