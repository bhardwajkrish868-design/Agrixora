import type { OpportunityRadarItem } from '../types';

export const OPPORTUNITY_RADAR_ITEMS: OpportunityRadarItem[] = [
  {
    id: 'opp_mustard_oil',
    title: 'Mustard Oil Expeller & Cattle Feed Unit',
    category: 'Food Processing',
    demandLevel: 'Very High',
    competitionLevel: 'Moderate',
    investmentRequired: 800000, // Rs 8 Lakh
    expectedMarginPercent: 28,
    riskLevel: 'Low',
    opportunityScore: 92,
    schemeCompatibility: 'Term Loan (8.0%)',
    rationale: 'High local seed availability in Eastern UP/Bihar. Oil cake (Khal) generates instant cashflow from local dairy farmers.',
    topBuyerPledgesCount: 4
  },
  {
    id: 'opp_mini_dairy',
    title: '5-Cattle Dairy & Bulk Chilling Unit',
    category: 'Dairy',
    demandLevel: 'Very High',
    competitionLevel: 'Low',
    investmentRequired: 120000, // Rs 1.20 Lakh
    expectedMarginPercent: 34,
    riskLevel: 'Low',
    opportunityScore: 95,
    schemeCompatibility: 'Micro Finance (6.5%)',
    rationale: 'Daily recurring cashflow with fixed institutional dairy cooperative tie-ups within 5 km radius.',
    topBuyerPledgesCount: 6
  },
  {
    id: 'opp_spice_processing',
    title: 'Spice Pulverizing & Eco-Pouch Packaging',
    category: 'Food Processing',
    demandLevel: 'High',
    competitionLevel: 'Moderate',
    investmentRequired: 140000,
    expectedMarginPercent: 38,
    riskLevel: 'Low',
    opportunityScore: 89,
    schemeCompatibility: 'Micro Finance (6.5%)',
    rationale: 'High demand for unadulterated turmeric, coriander & garam masala across rural weekly haats and local dhabas.',
    topBuyerPledgesCount: 3
  },
  {
    id: 'opp_garment_uniforms',
    title: 'Semi-Industrial School Uniform & Tailoring Unit',
    category: 'Textiles',
    demandLevel: 'High',
    competitionLevel: 'Low',
    investmentRequired: 250000,
    expectedMarginPercent: 42,
    riskLevel: 'Moderate',
    opportunityScore: 86,
    schemeCompatibility: 'Term Loan (8.0%)',
    rationale: 'Government Sarva Shiksha Abhiyan annual uniform tenders and festive season ethnic apparel surge.',
    topBuyerPledgesCount: 2
  },
  {
    id: 'opp_vermicompost',
    title: 'Commercial Bio-Vermicompost Plant',
    category: 'Agriculture',
    demandLevel: 'High',
    competitionLevel: 'Low',
    investmentRequired: 90000,
    expectedMarginPercent: 55,
    riskLevel: 'Low',
    opportunityScore: 94,
    schemeCompatibility: 'Micro Finance (6.5%)',
    rationale: 'Growing shift towards organic farming, horticulture orchards, and zero-chemical soil reclamation subsidies.',
    topBuyerPledgesCount: 5
  },
  {
    id: 'opp_solar_repair',
    title: 'PM-KUSUM Solar Pump & Inverter Service Hub',
    category: 'Services',
    demandLevel: 'High',
    competitionLevel: 'Low',
    investmentRequired: 150000,
    expectedMarginPercent: 62,
    riskLevel: 'Low',
    opportunityScore: 91,
    schemeCompatibility: 'Term Loan (8.0%)',
    rationale: 'Over 120+ solar irrigation pumps installed in block with no certified local maintenance technician within 25 km.',
    topBuyerPledgesCount: 2
  },
  {
    id: 'opp_fish_rearing',
    title: 'Freshwater Pond Aquaculture & Biofloc Tank',
    category: 'Fisheries',
    demandLevel: 'Very High',
    competitionLevel: 'Low',
    investmentRequired: 350000,
    expectedMarginPercent: 45,
    riskLevel: 'Moderate',
    opportunityScore: 88,
    schemeCompatibility: 'Term Loan (8.0%)',
    rationale: 'Unmet local demand for Rohu/Katla in block markets. Currently imported from distant state hubs at inflated rates.',
    topBuyerPledgesCount: 3
  }
];
