import type { MarketPriceTrend } from '../types';

export const COMMODITY_PRICE_TRENDS: Record<string, MarketPriceTrend[]> = {
  mustard_oil: [
    { month: 'May', farmGatePrice: 95, mandiWholesalePrice: 120, retailPrice: 155, volumeIndex: 85 },
    { month: 'Jun', farmGatePrice: 98, mandiWholesalePrice: 124, retailPrice: 158, volumeIndex: 90 },
    { month: 'Jul', farmGatePrice: 102, mandiWholesalePrice: 128, retailPrice: 162, volumeIndex: 78 },
    { month: 'Aug', farmGatePrice: 105, mandiWholesalePrice: 132, retailPrice: 165, volumeIndex: 82 },
    { month: 'Sep', farmGatePrice: 110, mandiWholesalePrice: 135, retailPrice: 168, volumeIndex: 95 },
    { month: 'Oct (Festive)', farmGatePrice: 115, mandiWholesalePrice: 142, retailPrice: 178, volumeIndex: 135 }
  ],
  raw_milk: [
    { month: 'May', farmGatePrice: 30, mandiWholesalePrice: 40, retailPrice: 50, volumeIndex: 90 },
    { month: 'Jun', farmGatePrice: 31, mandiWholesalePrice: 41, retailPrice: 50, volumeIndex: 92 },
    { month: 'Jul', farmGatePrice: 32, mandiWholesalePrice: 42, retailPrice: 52, volumeIndex: 100 },
    { month: 'Aug', farmGatePrice: 32, mandiWholesalePrice: 43, retailPrice: 52, volumeIndex: 105 },
    { month: 'Sep', farmGatePrice: 33, mandiWholesalePrice: 44, retailPrice: 54, volumeIndex: 110 },
    { month: 'Oct (Festive)', farmGatePrice: 36, mandiWholesalePrice: 48, retailPrice: 60, volumeIndex: 140 }
  ],
  tomato: [
    { month: 'May', farmGatePrice: 12, mandiWholesalePrice: 18, retailPrice: 28, volumeIndex: 120 },
    { month: 'Jun', farmGatePrice: 16, mandiWholesalePrice: 24, retailPrice: 38, volumeIndex: 100 },
    { month: 'Jul', farmGatePrice: 24, mandiWholesalePrice: 38, retailPrice: 60, volumeIndex: 70 },
    { month: 'Aug', farmGatePrice: 20, mandiWholesalePrice: 32, retailPrice: 50, volumeIndex: 80 },
    { month: 'Sep', farmGatePrice: 15, mandiWholesalePrice: 22, retailPrice: 35, volumeIndex: 110 },
    { month: 'Oct (Peak)', farmGatePrice: 18, mandiWholesalePrice: 26, retailPrice: 40, volumeIndex: 130 }
  ]
};

export const REGIONAL_DEMOGRAPHIC_STATS = [
  { metric: 'Avg Rural Catchment Population (5km)', value: '18,500 - 24,000 Persons', badge: 'Demo Data' },
  { metric: 'Household Consumer Density', value: '3,800 Households', badge: 'Demo Data' },
  { metric: 'Weekly Haat Cashflow Velocity', value: '₹4.2 Lakhs / Haat Day', badge: 'Illustrative Estimate' },
  { metric: 'Digital UPI Penetration Rate', value: '68.4% of Micro-Merchants', badge: 'Demo Data' },
  { metric: 'Average Agricultural Landholding', value: '1.4 Acres / Household', badge: 'Demo Data' }
];
