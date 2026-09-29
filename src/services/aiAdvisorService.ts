import type { FeasibilityReport, FullFeasibilityDPR, Language, LocalizedThreat, UserInputForm } from '../types';
import { getCategoryById } from '../data/businessCatalog';
import { calculateFinancialRoadmap } from '../data/schemes';

const DEFAULT_GEMINI_KEY = (typeof window !== 'undefined' ? localStorage.getItem('GRAMUDYOG_GEMINI_API_KEY') : '') || '';

export async function generateFeasibilityReport(
  formData: UserInputForm,
  apiKeyOverride?: string
): Promise<FullFeasibilityDPR> {
  const category = getCategoryById(formData.businessCategoryId);
  const financials = calculateFinancialRoadmap(
    formData.availableMarginCapital
  );

  const radiusKm = formData.location.catchmentRadiusKm || (financials.projectCost > 500000 ? 10 : 5);
  
  const activeKey = apiKeyOverride || DEFAULT_GEMINI_KEY || (import.meta.env?.VITE_GEMINI_API_KEY as string);

  if (activeKey && activeKey.trim().length > 10) {
    try {
      const geminiReport = await fetchGeminiFeasibility(formData, financials, activeKey);
      if (geminiReport) {
        return {
          report: geminiReport,
          financials,
          timestamp: new Date().toISOString()
        };
      }
    } catch (err) {
      console.warn('Gemini API call fell back to local expert engine:', err);
    }
  }

  const offlineReport = generateOfflineFeasibilityReport(formData, category, financials, radiusKm);
  return {
    report: offlineReport,
    financials,
    timestamp: new Date().toISOString()
  };
}

async function fetchGeminiFeasibility(
  formData: UserInputForm,
  financials: ReturnType<typeof calculateFinancialRoadmap>,
  apiKey: string
): Promise<FeasibilityReport | null> {
  const category = getCategoryById(formData.businessCategoryId);
  const prompt = `You are a Senior Rural Micro-Enterprise Consultant & Gramin Banking Specialist in India.
Generate a structured JSON feasibility report for a proposed micro-enterprise:
- Location: ${formData.location.village}, Block: ${formData.location.block}, District: ${formData.location.district}, State: ${formData.location.state}
- Area Profile: ${formData.location.areaType} (Radius: ${formData.location.catchmentRadiusKm} km)
- Business Category: ${category.name} (${category.description})
- Beneficiary Margin Capital: ₹${formData.availableMarginCapital.toLocaleString('en-IN')} (10%)
- Total Project Cost: ₹${financials.projectCost.toLocaleString('en-IN')} (100%)
- Eligible Loan: ₹${financials.loanAmount.toLocaleString('en-IN')} (90%)
- Selected Scheme: ${financials.scheme.name} (Interest: ${financials.scheme.interestRateAnnual}%, Moratorium: ${financials.scheme.moratoriumMonths} Months, Tenure: ${financials.scheme.tenureYears} Years)
- Prior Experience: ${formData.priorExperienceYears || 0} years, Has Land/Shed: ${formData.hasOwnLandShed ? 'Yes' : 'No'}

Respond ONLY with a valid JSON object strictly matching this TypeScript structure:
{
  "marketReach": {
    "radiusKm": ${formData.location.catchmentRadiusKm},
    "estimatedConsumerCount": number,
    "estimatedHouseholds": number,
    "primaryTargetSegments": [ { "segment": string, "sharePercent": number, "description": string } ],
    "primaryDistributionChannels": [ { "channel": string, "suitability": "High" | "Medium" | "Low", "rationale": string } ],
    "weeklyHaatPotential": string,
    "directToConsumerPotential": string
  },
  "opportunity": {
    "unservedNiches": [ { "title": string, "explanation": string, "valuePotential": "High" | "Medium" } ],
    "valueAdditionIdeas": [ { "idea": string, "estimatedMarginBoostPercent": number } ],
    "b2bInstitutionalTieups": [ string ],
    "localRawMaterialAdvantage": string
  },
  "swot": {
    "strengths": [ { "point": string, "detail": string, "impactLevel": "High" | "Medium" | "Low" } ],
    "weaknesses": [ { "point": string, "detail": string, "impactLevel": "High" | "Medium" | "Low" } ],
    "opportunities": [ { "point": string, "detail": string, "impactLevel": "High" | "Medium" | "Low" } ],
    "threats": [ { "point": string, "detail": string, "impactLevel": "High" | "Medium" | "Low" } ]
  },
  "threats": [
    {
      "riskType": "Supply Chain" | "Seasonality" | "Single Buyer" | "Climate/Perishability" | "Power/Infrastructure" | "Credit/Cashflow",
      "description": string,
      "severity": "High" | "Medium" | "Low",
      "mitigationStrategy": string
    }
  ],
  "competitorMapping": {
    "estimatedCompetitorCountInBlock": number,
    "competitorDensityPer10k": number,
    "saturationLevel": "Low" | "Moderate" | "High" | "Saturated",
    "saturationScore": number (0 to 100),
    "marketMaturity": string,
    "suggestedCompetitiveMoat": [ string ]
  },
  "productPricing": [
    {
      "productName": string,
      "unit": string,
      "estimatedCostOfProduction": number,
      "suggestedWholesalePrice": number,
      "suggestedRetailPrice": number,
      "localPurchasingPowerIndex": "Budget" | "Standard" | "Premium",
      "grossMarginPercent": number,
      "pricingStrategyNote": string
    }
  ],
  "overallFeasibilityScore": number (60-95),
  "readinessVerdict": "Highly Feasible" | "Feasible with Mitigation" | "Needs Restructuring",
  "keyActionPlan": [ string ]
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json'
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API Error: ${response.statusText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  const parsed = JSON.parse(text);
  return {
    id: 'REP-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    createdAt: new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' }),
    businessName: formData.customBusinessName || category.name,
    categoryName: category.name,
    location: formData.location,
    ...parsed
  };
}

function generateOfflineFeasibilityReport(
  formData: UserInputForm,
  category: ReturnType<typeof getCategoryById>,
  financials: ReturnType<typeof calculateFinancialRoadmap>,
  radiusKm: number
): FeasibilityReport {
  const isSmall = financials.scheme.id === 'MICRO_FINANCE';
  const village = formData.location.village || 'Local Gram Panchayat';
  const block = formData.location.block || 'Block HQ';
  const district = formData.location.district || 'District';
  const state = formData.location.state || 'State';

  const estimatedConsumerCount = radiusKm === 5 ? 18500 : 42000;
  const estimatedHouseholds = Math.round(estimatedConsumerCount / 5.2);

  const swot = buildCategorySWOT(village, block, isSmall, formData);
  const threats = buildCategoryThreats(block, state);
  const competitorMapping = buildCompetitorMapping(block, isSmall);
  const productPricing = buildProductPricing(category);

  const saturationScore = competitorMapping.saturationScore;
  const overallFeasibilityScore = Math.min(96, Math.max(68, Math.round(100 - (saturationScore * 0.25) + (formData.priorExperienceYears ? 6 : 0) + (formData.hasOwnLandShed ? 5 : 0))));

  const readinessVerdict = overallFeasibilityScore >= 82 
    ? 'Highly Feasible' 
    : overallFeasibilityScore >= 70 
    ? 'Feasible with Mitigation' 
    : 'Needs Restructuring';

  return {
    id: 'DPR-' + Math.floor(100000 + Math.random() * 900000),
    createdAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    businessName: formData.customBusinessName || category.name,
    categoryName: category.name,
    location: formData.location,
    marketReach: {
      radiusKm,
      estimatedConsumerCount,
      estimatedHouseholds,
      primaryTargetSegments: [
        {
          segment: 'Local Farming Households & Agrarian Families',
          sharePercent: 52,
          description: `Core consumer base in ${village} and adjacent hamlets requiring regular daily staples and farm-gate processing.`
        },
        {
          segment: 'Weekly Village Haat & Periodic Market Traders',
          sharePercent: 28,
          description: `Bulk cash buyers trading at the bi-weekly market bazaars across ${block} block.`
        },
        {
          segment: 'Local Dhabas, Small Eateries & Anganwadi Centers',
          sharePercent: 20,
          description: `Institutional repeat orders providing steady monthly cashflow buffers during off-season.`
        }
      ],
      primaryDistributionChannels: [
        {
          channel: 'Direct Farm-Gate & On-Premise Retail Counter',
          suitability: 'High',
          rationale: `Zero middleman commission, ensures 100% cash realization in ${village}.`
        },
        {
          channel: 'Weekly Village Haats (Somwar/Shaniwar Bazaars)',
          suitability: 'High',
          rationale: `Captures footfall from 8-12 surrounding feeder villages within a ${radiusKm} km radius.`
        },
        {
          channel: 'Semi-Urban Kirana & Tea Shop Supply Network',
          suitability: 'Medium',
          rationale: `Provides wholesale volume off-take at ${block} town centers.`
        }
      ],
      weeklyHaatPotential: `High demand on weekly bazaar days. Potential to liquidate 40% of weekly stock on peak haat days with immediate cash settlement.`,
      directToConsumerPotential: `High trust factor in ${village} for unadulterated, locally produced goods compared to packaged branded goods from distant cities.`
    },
    opportunity: {
      unservedNiches: [
        {
          title: 'Pure & Cold-Processed Local Value Addition',
          explanation: `Most commercial goods in ${district} contain preservatives or heavy refinement. Pure farm-fresh processing commands a 15-20% consumer preference premium.`,
          valuePotential: 'High'
        },
        {
          title: 'By-Product Monetization & Circular Revenue',
          explanation: `Monetizing processing waste (e.g. oil cakes for cattle feed, bran for poultry, dung slurry for vermiculture) creates a secondary revenue stream.`,
          valuePotential: 'High'
        },
        {
          title: 'Direct Institutional & SHG (Self-Help Group) Linkages',
          explanation: `Tie-ups with local NRLM/SRLM women self-help groups for micro-distribution and school midday meal kitchen supply.`,
          valuePotential: 'Medium'
        }
      ],
      valueAdditionIdeas: [
        { idea: 'Eco-friendly paper/jute pouch packaging with localized branding in regional script', estimatedMarginBoostPercent: 12 },
        { idea: 'Advance booking subscriptions for daily fresh milk/edible oil/flour', estimatedMarginBoostPercent: 18 },
        { idea: 'QR-code verification for purity testing and direct UPI payment incentives', estimatedMarginBoostPercent: 8 }
      ],
      b2bInstitutionalTieups: [
        `Local Dairy Cooperative Society / Chilling Center in ${block}`,
        `Gram Panchayat Mid-Day Meal Canteen & Anganwadi Centers`,
        `15+ Kirana Retailers within 7 km perimeter of ${village}`,
        `Highway Dhabas and local Sweet Shops (Mithai Bhandar)`
      ],
      localRawMaterialAdvantage: `Abundant direct farm supply of raw inputs in ${district} during harvest seasons, reducing transport freight by up to 85%.`
    },
    swot,
    threats,
    competitorMapping,
    productPricing,
    overallFeasibilityScore,
    readinessVerdict,
    keyActionPlan: [
      `1. Register micro-enterprise on Udyam Assist Platform and obtain FSSAI / local Trade License within 15 days of sanction.`,
      `2. Utilize the ${financials.scheme.moratoriumMonths}-month moratorium period strictly for machinery installation, trial run calibration, and advance vendor tie-ups.`,
      `3. Maintain separate bank account for business cashflow to ensure punctual quarterly loan installments (₹${financials.quarterlyEMI.toLocaleString('en-IN')}/quarter).`,
      `4. Secure 2 dedicated institutional bulk buyers before expanding production past 60% capacity.`
    ]
  };
}

function buildCategorySWOT(village: string, block: string, isSmall: boolean, formData: UserInputForm) {
  return {
    strengths: [
      {
        point: 'Low Operating Overhead & Family Labor Leverage',
        detail: `Operating out of ${village} eliminates high commercial urban rents and lowers daily overheads.`,
        impactLevel: 'High' as const
      },
      {
        point: 'Immediate Raw Material Proximity',
        detail: `Direct procurement from local farmers in ${block} eliminates wholesale broker margins.`,
        impactLevel: 'High' as const
      },
      {
        point: 'Concessional Interest & Debt Structure',
        detail: `${isSmall ? '6.5%' : '8.0%'} concessional interest rate provides a competitive financial advantage over local money lenders (24-36%).`,
        impactLevel: 'High' as const
      },
      {
        point: formData.hasOwnLandShed ? 'Zero Fixed Rental Liability (Owned Premises)' : 'Strategic Location on Rural Connecting Road',
        detail: formData.hasOwnLandShed ? 'Possession of own land/shed protects working capital from landlord rent escalations.' : 'High road visibility for footfall and supply vehicles.',
        impactLevel: 'Medium' as const
      }
    ],
    weaknesses: [
      {
        point: 'Initial Working Capital Sensitivity',
        detail: 'First 60-90 days require strict cashflow monitoring until regular customer receivables cycle stabilizes.',
        impactLevel: 'High' as const
      },
      {
        point: 'Dependence on Single Phase / Rural Grid Power',
        detail: 'Power fluctuations during peak summer months can disrupt automated machinery if backup is not planned.',
        impactLevel: 'Medium' as const
      },
      {
        point: 'Lack of Formal Digital Marketing Presence',
        detail: 'Initial reliance on word-of-mouth rather than organized cataloging.',
        impactLevel: 'Low' as const
      }
    ],
    opportunities: [
      {
        point: 'High Rural Consumer Shift to Fresh & Unadulterated Goods',
        detail: `Growing health awareness in rural ${block} creates strong demand for pure local processing.`,
        impactLevel: 'High' as const
      },
      {
        point: 'Synergy with Government Subsidy Portals (PMFME / PMEGP)',
        detail: 'Potential to leverage credit-linked capital subsidies to expand capacity in Year 2.',
        impactLevel: 'High' as const
      },
      {
        point: 'Festive & Marriage Season Demand Surge',
        detail: '3x volume peaks during Diwali, Eid, Chhath, Pongal, and regional wedding seasons.',
        impactLevel: 'Medium' as const
      }
    ],
    threats: [
      {
        point: 'Post-Harvest Price Volatility of Raw Produce',
        detail: 'Crop price fluctuations in mandis can compress gross margins if buffer inventory is not maintained.',
        impactLevel: 'High' as const
      },
      {
        point: 'Informal Credit Demands from Local Customers',
        detail: 'Rural village customers frequently request 15-30 day credit (Udhaar), creating liquidity crunches.',
        impactLevel: 'High' as const
      },
      {
        point: 'Monsoon Road Access & Supply Chain Delays',
        detail: 'Heavy rains can temporarily restrict movement between remote hamlets and block Mandi.',
        impactLevel: 'Medium' as const
      }
    ]
  };
}

function buildCategoryThreats(block: string, state: string): LocalizedThreat[] {
  return [
    {
      riskType: 'Seasonality',
      description: `Demand and raw material supply experience periodic 30-40% swings between peak harvest and lean monsoon months in ${state}.`,
      severity: 'High',
      mitigationStrategy: `Create a 45-day working capital raw material reserve during peak harvest when prices are lowest, and diversify product mix in off-season.`
    },
    {
      riskType: 'Credit/Cashflow',
      description: `Pressure to provide uncollateralized credit ('Khata/Udhaar') to village acquaintances leading to delayed working capital recycling.`,
      severity: 'High',
      mitigationStrategy: `Enforce a strict 90% cash/UPI policy with a 2% instant-pay discount, limiting store credit only to verified institutional buyers.`
    },
    {
      riskType: 'Single Buyer',
      description: `Over-dependence on one commercial aggregator or middleman who can unilaterally dictate procurement prices.`,
      severity: 'Medium',
      mitigationStrategy: `Maintain at least 3 distinct sales channels: 40% direct retail, 30% weekly haat stalls, 30% regional wholesale shops.`
    },
    {
      riskType: 'Power/Infrastructure',
      description: `Intermittent 3-phase grid power load shedding in rural ${block} during agricultural irrigation hours.`,
      severity: 'Medium',
      mitigationStrategy: `Schedule intensive motor/processing operations during guaranteed morning/night supply hours; budget small generator or solar inverter backup.`
    }
  ];
}

function buildCompetitorMapping(block: string, isSmall: boolean): FeasibilityReport['competitorMapping'] {
  const competitorCount = isSmall ? 4 : 2;
  const density = 1.4;

  return {
    estimatedCompetitorCountInBlock: competitorCount,
    competitorDensityPer10k: density,
    saturationLevel: 'Moderate',
    saturationScore: 38,
    marketMaturity: `Growth stage in ${block} block. Most existing players operate unorganized, obsolete machinery without hygienic packaging.`,
    suggestedCompetitiveMoat: [
      'Certified Hygienic & Food-Grade / Quality Packaging',
      'Transparent Weighing & Instant Digital Bill / QR Code Receipt',
      'Direct doorstep delivery for bulk farmer and institutional orders',
      'Loyalty stamp card (1 kg free on every 20 kg cumulative purchase)'
    ]
  };
}

function buildProductPricing(category: ReturnType<typeof getCategoryById>): FeasibilityReport['productPricing'] {
  const cost = category.avgProductionCostPerUnit;
  const mandi = category.mandiPricePerUnit;
  const retail = category.avgSellingPricePerUnit;
  const margin = Math.round(((retail - cost) / retail) * 100);

  return [
    {
      productName: `Primary Grade ${category.name}`,
      unit: category.unitType,
      estimatedCostOfProduction: cost,
      suggestedWholesalePrice: mandi,
      suggestedRetailPrice: retail,
      localPurchasingPowerIndex: 'Standard',
      grossMarginPercent: margin,
      pricingStrategyNote: `Priced 5-8% below urban packaged FMCG brands while delivering 20% higher fresh product quality.`
    },
    {
      productName: `Secondary / By-Product Grade (Bulk Pack)`,
      unit: 'Bulk Unit',
      estimatedCostOfProduction: Math.round(cost * 0.7),
      suggestedWholesalePrice: Math.round(mandi * 0.75),
      suggestedRetailPrice: Math.round(retail * 0.8),
      localPurchasingPowerIndex: 'Budget',
      grossMarginPercent: Math.round(margin * 0.85),
      pricingStrategyNote: `Enables monetization of processing derivatives, capturing price-sensitive rural consumers.`
    }
  ];
}

export async function askBusinessCoach(
  question: string,
  contextReport?: FeasibilityReport,
  contextFinancials?: ReturnType<typeof calculateFinancialRoadmap>,
  lang: Language = 'en'
): Promise<string> {
  const activeKey = (typeof window !== 'undefined' ? localStorage.getItem('GRAMUDYOG_GEMINI_API_KEY') : '') || (import.meta.env?.VITE_GEMINI_API_KEY as string);

  if (activeKey && activeKey.trim().length > 10) {
    try {
      const prompt = `You are "GramUdyog Sathi", an expert Indian rural micro-enterprise consultant and banking advisor.
Answer the user's question concisely in simple, encouraging language.
Language requested: ${lang === 'hi' ? 'Hindi (हिन्दी)' : lang === 'mr' ? 'Marathi' : lang === 'bn' ? 'Bengali' : 'English'}.
${contextReport ? `Context: Business: ${contextReport.businessName}, Location: ${contextReport.location.village}, ${contextReport.location.district}. Project Cost: ₹${contextFinancials?.projectCost}, Eligible Loan: ₹${contextFinancials?.loanAmount}, Scheme: ${contextFinancials?.scheme.name}.` : ''}

User Question: ${question}

Provide actionable, practical advice tailored to Indian rural and semi-urban reality.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${activeKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3 }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const ans = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (ans) return ans;
      }
    } catch (e) {
      console.warn('Gemini chat fallback to offline coach:', e);
    }
  }

  return getOfflineCoachAdvice(question, contextReport, contextFinancials, lang);
}

function getOfflineCoachAdvice(
  q: string,
  report?: FeasibilityReport,
  fin?: ReturnType<typeof calculateFinancialRoadmap>,
  lang: Language = 'en'
): string {
  const query = q.toLowerCase();

  if (query.includes('license') || query.includes('fssai') || query.includes('udyam') || query.includes('लाइसेंस')) {
    if (lang === 'hi') {
      return `ग्रामीण सूक्ष्म उद्यम के लिए आपको मुख्य रूप से 3 दस्तावेज़ चाहिए: 
1. **उद्यम असिस्ट (Udyam Registration)**: यह msme.gov.in पर आधार कार्ड से निःशुल्क 5 मिनट में बन जाता है।
2. **FSSAI बेसिक रजिस्ट्रेशन** (यदि खाद्य/डेयरी/मसाला है): ₹100 वार्षिक शुल्क पर नजदीकी जन सेवा केंद्र (CSC) से बनता है।
3. **ग्राम पंचायत एनओसी / ट्रेड प्रमाण पत्र**: स्थानीय प्रधान या ब्लॉक विकास अधिकारी (BDO) कार्यालय से।`;
    }
    return `For a rural micro-enterprise, you typically need 3 basic registrations:
1. **Udyam Registration**: Free online registration on udyamregistration.gov.in using Aadhaar card.
2. **FSSAI Basic Registration** (if food/dairy/agro processing): Costs ₹100/year via nearest CSC center.
3. **Gram Panchayat Trade NOC**: Obtained from local Village Pradhan/Sarpanch or BDO office.`;
  }

  if (query.includes('moratorium') || query.includes('मोहलत') || query.includes('repayment') || query.includes('emi')) {
    if (lang === 'hi') {
      return `आपकी चुनी हुई योजना में **${fin?.scheme.moratoriumMonths || 3} महीने की मोहलत (Moratorium)** है। इसका मतलब है कि पहले ${fin?.scheme.moratoriumMonths || 3} महीनों में आपको केवल मूलधन चुकाने से छूट मिलेगी ताकि आप मशीनरी स्थापित करके उत्पादन शुरू कर सकें। इसके बाद आपकी तिमाही ईएमआई ₹${fin?.quarterlyEMI.toLocaleString('en-IN') || '---'} होगी।`;
    }
    return `Under your scheme, you get a **${fin?.scheme.moratoriumMonths || 3}-Month Moratorium**. During this period, principal repayment is deferred so you can set up machinery, calibrate production, and build customer orders before regular quarterly repayments (₹${fin?.quarterlyEMI.toLocaleString('en-IN') || '---'}/quarter) begin.`;
  }

  if (query.includes('subsidy') || query.includes('pmegp') || query.includes('pmfme') || query.includes('सब्सिडी')) {
    if (lang === 'hi') {
      return `आप इस प्रोजेक्ट को केंद्र व राज्य की प्रमुख योजनाओं से जोड़ सकते हैं:
1. **PMEGP (प्रधानमंत्री रोजगार सृजन कार्यक्रम)**: ग्रामीण क्षेत्र में 25% से 35% तक बैक-एंडेड पूंजीगत सब्सिडी।
2. **PMFME योजना**: सूक्ष्म खाद्य प्रसंस्करण इकाइयों के लिए 35% क्रेडिट-लिंक्ड सब्सिडी (अधिकतम ₹10 लाख)।
3. **मुद्रा योजना (MUDRA / KCC)**: संपार्श्विक मुक्त (Collateral Free) बैंक ऋण सहायता।`;
    }
    return `You can synergize this loan with leading government subsidy schemes:
1. **PMEGP**: Provides 25% to 35% margin money subsidy for rural non-farm enterprises.
2. **PMFME Scheme**: 35% credit-linked capital subsidy (up to ₹10 Lakh) for micro food processing units.
3. **Mudra / Stand-Up India**: Collateral-free credit facilitation through Lead District Banks.`;
  }

  if (lang === 'hi') {
    return `आपके ${report?.businessName || 'व्यवसाय'} के लिए सबसे महत्वपूर्ण है कि 10% पूंजी (₹${fin?.marginCapital.toLocaleString('en-IN') || '---'}) का उपयोग सही समय पर करें और 90% बैंक ऋण (₹${fin?.loanAmount.toLocaleString('en-IN') || '---'}) से मुख्य मशीनरी और शुरुआती 45 दिनों का कच्चा माल सुरक्षित करें। स्थानीय साप्ताहिक हाट में सीधे नकद बिक्री को प्राथमिकता दें।`;
  }
  return `For your ${report?.businessName || 'micro-enterprise'}, ensure your 10% margin equity (₹${fin?.marginCapital.toLocaleString('en-IN') || '---'}) is backed by the 90% scheme loan (₹${fin?.loanAmount.toLocaleString('en-IN') || '---'}). Allocate 65% for durable machinery and 35% for working capital buffer. Focus on direct cash sales at local weekly haats to maintain healthy liquidity.`;
}
