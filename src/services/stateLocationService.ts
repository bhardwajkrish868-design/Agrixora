import { STATES_DATA } from '../data/regionsData';
import type { LocationCatchment, UserInputForm, PreBulkDemandOrder } from '../types';

export interface StateProfile {
  agroClimaticZone: string;
  keyCrops: string[];
  recommendedCategory: string;
  defaultBusinessCategory: string;
  businessTitle: string;
}

export const STATE_PROFILES: Record<string, StateProfile> = {
  'Andhra Pradesh': {
    agroClimaticZone: 'Southern Plateau & Hills (Zone 10)',
    keyCrops: ['Guntur Chilli', 'Turmeric', 'Paddy', 'Cotton', 'Mango', 'Tobacco'],
    recommendedCategory: 'Spice Processing & Cold Storage',
    defaultBusinessCategory: 'spice_grinding',
    businessTitle: 'Chilli & Turmeric Processing Hub'
  },
  'Arunachal Pradesh': {
    agroClimaticZone: 'Eastern Himalayan Region (Zone 2)',
    keyCrops: ['Organic Kiwi', 'Large Cardamom', 'Ginger', 'Orange', 'Maize'],
    recommendedCategory: 'Organic Fruit & Spice Processing',
    defaultBusinessCategory: 'spice_grinding',
    businessTitle: 'Kiwi & Cardamom Processing Center'
  },
  'Assam': {
    agroClimaticZone: 'Eastern Himalayan Region (Zone 2)',
    keyCrops: ['Orthodox Tea', 'Mustard', 'Ginger', 'Jute', 'Rice', 'Arecanut'],
    recommendedCategory: 'Tea Blending & Mustard Expeller',
    defaultBusinessCategory: 'mustard_oil_mill',
    businessTitle: 'Micro Mustard Expeller & Tea Processing Unit'
  },
  'Bihar': {
    agroClimaticZone: 'Middle Gangetic Plain (Zone 4)',
    keyCrops: ['Makhana (Foxnut)', 'Shahi Litchi', 'Maize', 'Paddy', 'Mustard', 'Potato'],
    recommendedCategory: 'Makhana Popping & Maize Value Addition',
    defaultBusinessCategory: 'spice_grinding',
    businessTitle: 'Makhana Grading, Roasting & Packaging Center'
  },
  'Chhattisgarh': {
    agroClimaticZone: 'Eastern Plateau & Hills (Zone 7)',
    keyCrops: ['Paddy', 'Kodo-Kutki Millets', 'Pulses', 'Maize', 'Minor Forest Produce'],
    recommendedCategory: 'Millet Processing & Pulses Cleaning Unit',
    defaultBusinessCategory: 'spice_grinding',
    businessTitle: 'Kodo-Kutki Millet Flour & De-hulling Unit'
  },
  'Goa': {
    agroClimaticZone: 'West Coast Plains & Ghats (Zone 12)',
    keyCrops: ['Cashew Nut', 'Coconut', 'Arecanut', 'Spices', 'Paddy'],
    recommendedCategory: 'Cashew Processing & Packaging Unit',
    defaultBusinessCategory: 'spice_grinding',
    businessTitle: 'Cashew Roasting & Vacuum Packaging Plant'
  },
  'Gujarat': {
    agroClimaticZone: 'Gujarat Plains & Hills (Zone 13)',
    keyCrops: ['Groundnut', 'Cotton', 'Cumin (Jeera)', 'Castor', 'Sesame', 'Wheat'],
    recommendedCategory: 'Groundnut Oil & Cumin Seed Processing',
    defaultBusinessCategory: 'mustard_oil_mill',
    businessTitle: 'Groundnut Cold Press Oil Expeller'
  },
  'Haryana': {
    agroClimaticZone: 'Trans-Gangetic Plain (Zone 6)',
    keyCrops: ['Basmati Rice', 'Mustard', 'Wheat', 'Sugarcane', 'Cotton', 'Dairy'],
    recommendedCategory: 'Mustard Oil Expeller & Basmati Sortex',
    defaultBusinessCategory: 'mustard_oil_mill',
    businessTitle: 'Automated Mustard Oil Extraction Plant'
  },
  'Himachal Pradesh': {
    agroClimaticZone: 'Western Himalayan Region (Zone 1)',
    keyCrops: ['Royal Apple', 'Button Mushroom', 'Off-season Garlic', 'Ginger', 'Stone Fruits'],
    recommendedCategory: 'Apple Juice Concentrate & Mushroom Processing',
    defaultBusinessCategory: 'spice_grinding',
    businessTitle: 'Mushroom Cultivation & Dehydration Unit'
  },
  'Jharkhand': {
    agroClimaticZone: 'Eastern Plateau & Hills (Zone 7)',
    keyCrops: ['Paddy', 'Lac Processing', 'Tamarind', 'Tomato', 'Mustard', 'Millets'],
    recommendedCategory: 'Tomato Purée & Tamarind Paste Unit',
    defaultBusinessCategory: 'mustard_oil_mill',
    businessTitle: 'Tomato Paste & Solar Cold Storage Hub'
  },
  'Karnataka': {
    agroClimaticZone: 'Southern Plateau & Hills (Zone 10)',
    keyCrops: ['Arabica/Robusta Coffee', 'Silk (Sericulture)', 'Arecanut', 'Maize', 'Ragi', 'Turmeric'],
    recommendedCategory: 'Coffee Curing & Millet Processing',
    defaultBusinessCategory: 'spice_grinding',
    businessTitle: 'Coffee Roasting, Grinding & Packaging Unit'
  },
  'Kerala': {
    agroClimaticZone: 'West Coast Plains & Ghats (Zone 12)',
    keyCrops: ['Black Pepper', 'Green Cardamom', 'Virgin Coconut Oil', 'Rubber', 'Banana'],
    recommendedCategory: 'Virgin Coconut Oil & Spice Processing',
    defaultBusinessCategory: 'mustard_oil_mill',
    businessTitle: 'Virgin Cold-Pressed Coconut Oil Plant'
  },
  'Madhya Pradesh': {
    agroClimaticZone: 'Central Plateau & Hills (Zone 8)',
    keyCrops: ['Soybean', 'Sharbati Wheat', 'Gram (Chana Dal)', 'Mustard', 'Garlic', 'Coriander'],
    recommendedCategory: 'Chana Dal Mill & Soybean Processing',
    defaultBusinessCategory: 'mustard_oil_mill',
    businessTitle: 'Chana Dal Cleaning, Grading & Milling Unit'
  },
  'Maharashtra': {
    agroClimaticZone: 'Western Plateau & Hills (Zone 9)',
    keyCrops: ['Nashik Grapes', 'Lasalgaon Onion', 'Soybean', 'Sugarcane', 'Pomegranate', 'Milk'],
    recommendedCategory: 'Cold Storage & Dairy Processing',
    defaultBusinessCategory: 'dairy_farming',
    businessTitle: 'Micro Milk Chilling & Paneer Production Unit'
  },
  'Manipur': {
    agroClimaticZone: 'Eastern Himalayan Region (Zone 2)',
    keyCrops: ['Chak-hao (Black Rice)', 'Kew Pineapple', 'Ginger', 'King Chilli', 'Turmeric'],
    recommendedCategory: 'Chak-hao Black Rice Milling & Packing',
    defaultBusinessCategory: 'spice_grinding',
    businessTitle: 'Black Rice Packaging & Value-Add Center'
  },
  'Meghalaya': {
    agroClimaticZone: 'Eastern Himalayan Region (Zone 2)',
    keyCrops: ['Lakadong High-Curcumin Turmeric', 'Ginger', 'Pineapple', 'Broom Grass', 'Honey'],
    recommendedCategory: 'Lakadong Turmeric Extraction & Honey Processing',
    defaultBusinessCategory: 'spice_grinding',
    businessTitle: 'Lakadong Turmeric Powdering & Extraction Unit'
  },
  'Mizoram': {
    agroClimaticZone: 'Eastern Himalayan Region (Zone 2)',
    keyCrops: ['Mizo Bird’s Eye Chilli', 'Ginger', 'Passion Fruit', 'Bamboo Shoots', 'Turmeric'],
    recommendedCategory: 'Chilli Flakes & Passion Fruit Juice Plant',
    defaultBusinessCategory: 'spice_grinding',
    businessTitle: 'Bird’s Eye Chilli Flaking & Packaging Unit'
  },
  'Nagaland': {
    agroClimaticZone: 'Eastern Himalayan Region (Zone 2)',
    keyCrops: ['Naga King Chilli (Bhut Jolokia)', 'Cardamom', 'Ginger', 'Organic Honey', 'Coffee'],
    recommendedCategory: 'Hot Sauce & Honey Bottling Unit',
    defaultBusinessCategory: 'spice_grinding',
    businessTitle: 'Naga King Chilli Sauce & Honey Bottling Plant'
  },
  'Odisha': {
    agroClimaticZone: 'East Coast Plains & Hills (Zone 11)',
    keyCrops: ['Paddy', 'Kandhamal Haldi', 'Cashew Nut', 'Ginger', 'Pulses', 'Groundnut'],
    recommendedCategory: 'Kandhamal Organic Turmeric & Cashew Hub',
    defaultBusinessCategory: 'spice_grinding',
    businessTitle: 'Kandhamal Organic Turmeric Processing Plant'
  },
  'Punjab': {
    agroClimaticZone: 'Trans-Gangetic Plain (Zone 6)',
    keyCrops: ['Sharbati Wheat', 'Basmati Rice', 'Mustard', 'Kinnow Citrus', 'Dairy Milk', 'Cotton'],
    recommendedCategory: 'Dairy Farming & Automated Milk Chilling',
    defaultBusinessCategory: 'dairy_farming',
    businessTitle: 'Modern Dairy Farming & Milk Chilling Center'
  },
  'Rajasthan': {
    agroClimaticZone: 'Western Dry Region (Zone 14)',
    keyCrops: ['Mustard', 'Cumin (Jeera)', 'Nagaur Fenugreek', 'Coriander', 'Bajra', 'Guar Gum'],
    recommendedCategory: 'Spice Grinding & Mustard Oil Expeller',
    defaultBusinessCategory: 'mustard_oil_mill',
    businessTitle: 'Mustard Oil Cold-Press & Jeera Cleaning Unit'
  },
  'Sikkim': {
    agroClimaticZone: 'Eastern Himalayan Region (Zone 2)',
    keyCrops: ['Certified Organic Large Cardamom', 'Ginger', 'Sikkim Mandarin', 'Buckwheat', 'Kiwi'],
    recommendedCategory: 'Organic Large Cardamom Curing & Grading',
    defaultBusinessCategory: 'spice_grinding',
    businessTitle: 'Certified Organic Cardamom Curing Center'
  },
  'Tamil Nadu': {
    agroClimaticZone: 'Southern Plateau & Hills (Zone 10)',
    keyCrops: ['Paddy', 'Salem Turmeric', 'Erode Turmeric', 'Coconut Copra', 'Banana', 'Tapioca'],
    recommendedCategory: 'Turmeric Polish & Cold-Pressed Copra Oil',
    defaultBusinessCategory: 'mustard_oil_mill',
    businessTitle: 'Cold-Pressed Coconut Oil & Turmeric Unit'
  },
  'Telangana': {
    agroClimaticZone: 'Southern Plateau & Hills (Zone 10)',
    keyCrops: ['Cotton', 'Nizamabad Turmeric', 'Warangal Red Chilli', 'Paddy', 'Maize', 'Soybean'],
    recommendedCategory: 'Turmeric Processing & Cotton Ginning Support',
    defaultBusinessCategory: 'spice_grinding',
    businessTitle: 'Turmeric Polishing & Spice Processing Center'
  },
  'Tripura': {
    agroClimaticZone: 'Eastern Himalayan Region (Zone 2)',
    keyCrops: ['Queen Pineapple', 'Natural Rubber', 'Orthodox Tea', 'Bamboo Shoots', 'Jute'],
    recommendedCategory: 'Pineapple Canning & Bamboo Shoot Processing',
    defaultBusinessCategory: 'spice_grinding',
    businessTitle: 'Queen Pineapple Processing & Pulping Center'
  },
  'Uttar Pradesh': {
    agroClimaticZone: 'Upper & Middle Gangetic Plain (Zone 5)',
    keyCrops: ['Mustard', 'Sugarcane Gur/Jaggery', 'Wheat', 'Potato', 'Mentha Oil', 'Mango'],
    recommendedCategory: 'Mustard Oil Expeller & Organic Jaggery',
    defaultBusinessCategory: 'mustard_oil_mill',
    businessTitle: 'High-Efficiency Mustard Oil Expeller Unit'
  },
  'Uttarakhand': {
    agroClimaticZone: 'Western Himalayan Region (Zone 1)',
    keyCrops: ['Himalayan Apple', 'Finger Millet (Mandua)', 'Munsiyari Rajma', 'Herbs & Aromatic', 'Basmati'],
    recommendedCategory: 'Millet Flour & Himalayan Herb Packaging',
    defaultBusinessCategory: 'spice_grinding',
    businessTitle: 'Himalayan Millet & Rajma Grading Plant'
  },
  'West Bengal': {
    agroClimaticZone: 'Lower Gangetic Plain (Zone 3)',
    keyCrops: ['Aman Paddy', 'Raw Jute', 'Potato Cold Storage', 'Darjeeling Tea', 'Mustard', 'Mango'],
    recommendedCategory: 'Garment Stitching & Mustard Expeller',
    defaultBusinessCategory: 'garment_stitching',
    businessTitle: 'Rural Garment Stitching & Apparel Center'
  },
  'Delhi': {
    agroClimaticZone: 'Trans-Gangetic Plain (Zone 6)',
    keyCrops: ['Hydroponic Vegetables', 'Floriculture', 'Wheat', 'Mustard', 'Dairy'],
    recommendedCategory: 'Urban Agri Packaging & Dairy Center',
    defaultBusinessCategory: 'dairy_farming',
    businessTitle: 'Milk & Fresh Produce Distribution Hub'
  },
  'Jammu and Kashmir': {
    agroClimaticZone: 'Western Himalayan Region (Zone 1)',
    keyCrops: ['Pampore Saffron', 'Kashmiri Apple', 'Kashmiri Walnut', 'Almond', 'Cherry'],
    recommendedCategory: 'Walnut Shelling & Saffron Grading Unit',
    defaultBusinessCategory: 'spice_grinding',
    businessTitle: 'Kashmir Walnut & Saffron Packaging Center'
  },
  'Ladakh': {
    agroClimaticZone: 'Western Himalayan Cold Desert (Zone 1)',
    keyCrops: ['Ladakhi Sea Buckthorn', 'Apricot (Raktsey Karpo)', 'Barley', 'Pashmina Wool'],
    recommendedCategory: 'Sea Buckthorn Juice & Apricot Drying',
    defaultBusinessCategory: 'spice_grinding',
    businessTitle: 'Sea Buckthorn Juice & Apricot Packaging Unit'
  }
};

const DEFAULT_PROFILE: StateProfile = {
  agroClimaticZone: 'Western Plateau & Hills (Zone 9)',
  keyCrops: ['Mustard', 'Grapes', 'Onion', 'Paddy', 'Soybean', 'Pulses'],
  recommendedCategory: 'Agro-Commodity Value Addition',
  defaultBusinessCategory: 'mustard_oil_mill',
  businessTitle: 'Modern Rural Agro-Processing Unit'
};

/**
 * Get profile (crops, agro zone, recommended categories) for any State
 */
export function getStateProfile(stateName: string): StateProfile {
  return STATE_PROFILES[stateName] || DEFAULT_PROFILE;
}

/**
 * Build a structured LocationCatchment object for any State & District
 */
export function buildLocationCatchment(stateName: string, districtName?: string): LocationCatchment {
  const profile = getStateProfile(stateName);
  const stateData = STATES_DATA.find(s => s.state.toLowerCase() === stateName.toLowerCase()) || STATES_DATA[0];
  
  let districtObj = stateData.districts[0];
  if (districtName) {
    const foundDist = stateData.districts.find(d => d.district.toLowerCase() === districtName.toLowerCase());
    if (foundDist) districtObj = foundDist;
  }

  const blockObj = districtObj?.blocks?.[0] || { block: 'Block Central', villages: ['Gram Panchayat 1', 'Gram Panchayat 2'] };
  const firstVillage = blockObj.villages?.[0] || `${districtObj.district} Rural`;

  return {
    state: stateData.state,
    district: districtObj.district,
    block: blockObj.block,
    village: firstVillage,
    panchayat: `${firstVillage} Gram Panchayat`,
    areaType: 'rural',
    catchmentRadiusKm: 10,
    estimatedPopulation: 32000,
    agroClimaticZone: profile.agroClimaticZone,
    keyCrops: profile.keyCrops
  };
}

/**
 * Generate a pre-configured UserInputForm matched to the user's State, District and margin
 */
export function buildTailoredFormData(
  userName: string, 
  stateName: string, 
  districtName: string, 
  marginCapital: number = 50000
): UserInputForm {
  const loc = buildLocationCatchment(stateName, districtName);
  const profile = getStateProfile(stateName);

  return {
    location: {
      state: loc.state,
      district: loc.district,
      block: loc.block,
      village: loc.village || `${loc.district} Rural`,
      gramPanchayat: loc.panchayat || `${loc.district} Gram Panchayat`,
      pinCode: '110001',
      areaType: 'rural',
      catchmentRadiusKm: loc.catchmentRadiusKm
    },
    businessCategoryId: profile.defaultBusinessCategory,
    availableMarginCapital: marginCapital,
    entrepreneurName: userName || 'Local Rural Entrepreneur',
    priorExperienceYears: 2,
    hasOwnLandShed: true,
    electricityAvailabilityHours: 18,
    preferredLanguage: 'en'
  };
}

/**
 * Generate state-customized demand orders for any state in India
 */
export function getStateDemandOrders(stateName: string, districtName: string): PreBulkDemandOrder[] {
  const profile = getStateProfile(stateName);
  const loc = buildLocationCatchment(stateName, districtName);

  const crop1 = profile.keyCrops[0] || 'Commodity';
  const crop2 = profile.keyCrops[1] || 'Produce';

  return [
    {
      id: `ORD-LOCAL-${stateName.substring(0, 3).toUpperCase()}-1`,
      buyerName: `${stateName} Agro Processing & Mega Food Cluster`,
      buyerType: 'Food Processor',
      product: `${crop1} (Commercial Grade)`,
      category: 'Food Processing / Agriculture',
      qualityGrade: 'Grade A (Export / Premium)',
      requiredQuantityTonnes: 150,
      committedQuantityTonnes: 45,
      offeredPricePerUnit: 32000,
      unit: 'Tonne',
      deliveryDate: '15 December 2026',
      location: `${loc.district} Agro Industrial Terminal`,
      district: loc.district,
      state: stateName,
      pickupMode: 'Farm-gate Collection Center',
      paymentTerms: '100% Direct Bank Transfer within 48h',
      verifiedBuyerBadge: true,
      notes: `Direct local off-take contract for ${crop1} producers in ${loc.district}. Guaranteed minimum floor price.`
    },
    {
      id: `ORD-LOCAL-${stateName.substring(0, 3).toUpperCase()}-2`,
      buyerName: `National Spices & FMCG Aggregation Federation`,
      buyerType: 'Retail Aggregator',
      product: `Processed ${crop2} & Value-Add Extracts`,
      category: 'Food Processing',
      qualityGrade: 'Organic / Standard Commercial',
      requiredQuantityTonnes: 80,
      committedQuantityTonnes: 28,
      offeredPricePerUnit: 125000,
      unit: 'Tonne',
      deliveryDate: '28 November 2026',
      location: `${loc.district} Central Cold Hub`,
      district: loc.district,
      state: stateName,
      pickupMode: 'Mandi Drop-off',
      paymentTerms: '50% Advance + 50% on Delivery',
      verifiedBuyerBadge: true,
      notes: `Targeting local FPOs and MSME entrepreneurs across ${stateName}. Direct bank settlement.`
    }
  ];
}
