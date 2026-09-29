import type { UserInputForm } from '../types';

export interface StateData {
  state: string;
  districts: {
    district: string;
    blocks: {
      block: string;
      villages: string[];
    }[];
  }[];
}

export const STATES_DATA: StateData[] = [
  {
    state: 'Uttar Pradesh',
    districts: [
      {
        district: 'Varanasi',
        blocks: [
          { block: 'Arajiline', villages: ['Raja Talab', 'Bikapur', 'Kharawan', 'Shahbanspur'] },
          { block: 'Kashi Vidyapeeth', villages: ['Manduadih', 'Shivpur', 'Lohta', 'Rohania'] },
          { block: 'Pindra', villages: ['Phulpur', 'Sindhora', 'Basni', 'Koirajpur'] }
        ]
      },
      {
        district: 'Gorakhpur',
        blocks: [
          { block: 'Pipraich', villages: ['Maharajganj Rd', 'Bishunpur', 'Belghat'] },
          { block: 'Sahjanwa', villages: ['Bhadohi', 'Ghagha', 'Chhapia'] }
        ]
      }
    ]
  },
  {
    state: 'Maharashtra',
    districts: [
      {
        district: 'Satara',
        blocks: [
          { block: 'Karad', villages: ['Koregaon', 'Masur', 'Shenoli', 'Umbraj'] },
          { block: 'Patan', villages: ['Dhebewadi', 'Tarale', 'Helwak'] }
        ]
      },
      {
        district: 'Pune',
        blocks: [
          { block: 'Baramati', villages: ['Malegaon', 'Songaon', 'Katewadi'] },
          { block: 'Shirur', villages: ['Shikrapur', 'Narayangaon', 'Pabal'] }
        ]
      }
    ]
  },
  {
    state: 'West Bengal',
    districts: [
      {
        district: 'Birbhum',
        blocks: [
          { block: 'Bolpur-Sriniketan', villages: ['Ilambazar', 'Supur', 'Kasba', 'Kankalitala'] },
          { block: 'Suri I', villages: ['Alunda', 'Khatanga', 'Karidhya'] }
        ]
      }
    ]
  },
  {
    state: 'Tamil Nadu',
    districts: [
      {
        district: 'Namakkal',
        blocks: [
          { block: 'Rasipuram', villages: ['Pattanam', 'Vennandur', 'Mangalapuram'] },
          { block: 'Tiruchengode', villages: ['Mallasamudram', 'Elachipalayam', 'Kokkarayanpettai'] }
        ]
      }
    ]
  },
  {
    state: 'Madhya Pradesh',
    districts: [
      {
        district: 'Indore',
        blocks: [
          { block: 'Mhow', villages: ['Harsola', 'Manpur', 'Kodariya'] },
          { block: 'Depalpur', villages: ['Gautampura', 'Betma', 'Ralamandal'] }
        ]
      }
    ]
  },
  {
    state: 'Bihar',
    districts: [
      {
        district: 'Muzaffarpur',
        blocks: [
          { block: 'Kanti', villages: ['Damodarpur', 'Madhuban', 'Kolhua'] },
          { block: 'Motipur', villages: ['Singhasani', 'Tajpur', 'Barkurwa'] }
        ]
      }
    ]
  },
  {
    state: 'Rajasthan',
    districts: [
      {
        district: 'Jaipur',
        blocks: [
          { block: 'Chamu', villages: ['Kala Dera', 'Bhojpura', 'Kishanpura'] },
          { block: 'Sanganer', villages: ['Muhana', 'Vatika', 'Nevta'] }
        ]
      }
    ]
  }
];

export interface RegionalArchetype {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  formData: UserInputForm;
}

export type DemoPreset = RegionalArchetype;

export const REGIONAL_ARCHETYPES: RegionalArchetype[] = [
  {
    id: 'preset_oil_mill',
    title: 'Ramesh Patel • Mustard Oil Expeller',
    subtitle: 'Varanasi, UP (₹80,000 Margin -> ₹8 Lakh Project)',
    badge: 'Term Loan (8%)',
    formData: {
      location: {
        state: 'Uttar Pradesh',
        district: 'Varanasi',
        block: 'Arajiline',
        village: 'Raja Talab',
        pinCode: '221311',
        areaType: 'rural',
        catchmentRadiusKm: 10
      },
      businessCategoryId: 'mustard_oil_mill',
      availableMarginCapital: 80000,
      entrepreneurName: 'Ramesh Patel',
      priorExperienceYears: 3,
      hasOwnLandShed: true,
      electricityAvailabilityHours: 18,
      preferredLanguage: 'en'
    }
  },
  {
    id: 'preset_micro_dairy',
    title: 'Sunita Gaikwad • Dairy Farming Unit',
    subtitle: 'Satara, Maharashtra (₹12,000 Margin -> ₹1.2 Lakh Project)',
    badge: 'Micro Finance (6.5%)',
    formData: {
      location: {
        state: 'Maharashtra',
        district: 'Satara',
        block: 'Karad',
        village: 'Umbraj',
        pinCode: '415109',
        areaType: 'rural',
        catchmentRadiusKm: 5
      },
      businessCategoryId: 'dairy_farming',
      availableMarginCapital: 12000,
      entrepreneurName: 'Sunita Gaikwad',
      priorExperienceYears: 2,
      hasOwnLandShed: true,
      electricityAvailabilityHours: 16,
      preferredLanguage: 'hi'
    }
  },
  {
    id: 'preset_garments',
    title: 'Anil Sen • Garment Stitching Center',
    subtitle: 'Birbhum, West Bengal (₹25,000 Margin -> ₹2.5 Lakh Project)',
    badge: 'Term Loan (8%)',
    formData: {
      location: {
        state: 'West Bengal',
        district: 'Birbhum',
        block: 'Bolpur-Sriniketan',
        village: 'Ilambazar',
        pinCode: '731214',
        areaType: 'semi-urban',
        catchmentRadiusKm: 10
      },
      businessCategoryId: 'garment_stitching',
      availableMarginCapital: 25000,
      entrepreneurName: 'Anil Sen',
      priorExperienceYears: 4,
      hasOwnLandShed: false,
      electricityAvailabilityHours: 20,
      preferredLanguage: 'en'
    }
  },
  {
    id: 'preset_spices',
    title: 'Meena Sharma • Spice Grinding & Packaging',
    subtitle: 'Jaipur, Rajasthan (₹14,000 Margin -> ₹1.4 Lakh Project)',
    badge: 'Micro Finance (6.5%)',
    formData: {
      location: {
        state: 'Rajasthan',
        district: 'Jaipur',
        block: 'Chamu',
        village: 'Kala Dera',
        pinCode: '303801',
        areaType: 'rural',
        catchmentRadiusKm: 5
      },
      businessCategoryId: 'spice_grinding',
      availableMarginCapital: 14000,
      entrepreneurName: 'Meena Sharma',
      priorExperienceYears: 1,
      hasOwnLandShed: true,
      electricityAvailabilityHours: 16,
      preferredLanguage: 'hi'
    }
  }
];

export const DEMO_PRESETS = REGIONAL_ARCHETYPES;
