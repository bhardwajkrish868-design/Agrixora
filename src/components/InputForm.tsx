import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Milk,
  Droplet,
  Scissors,
  Wheat,
  Egg,
  Sprout,
  Sun,
  ShoppingBag,
  Package,
  Building
} from 'lucide-react';
import type { Language, UserInputForm } from '../types';
import { STATES_DATA } from '../data/regionsData';
import { BUSINESS_CATEGORIES } from '../data/businessCatalog';
import { calculateFinancialRoadmap } from '../data/schemes';
import { useTranslation } from '../utils/i18n';

interface InputFormProps {
  currentLanguage: Language;
  formData: UserInputForm;
  onChange: (updated: UserInputForm) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Milk: <Milk className="w-5 h-5 text-emerald-600" />,
  Droplet: <Droplet className="w-5 h-5 text-amber-500" />,
  Scissors: <Scissors className="w-5 h-5 text-purple-600" />,
  Sparkles: <Sparkles className="w-5 h-5 text-orange-500" />,
  Egg: <Egg className="w-5 h-5 text-yellow-600" />,
  Wheat: <Wheat className="w-5 h-5 text-amber-600" />,
  Sprout: <Sprout className="w-5 h-5 text-green-600" />,
  Sun: <Sun className="w-5 h-5 text-yellow-500" />,
  ShoppingBag: <ShoppingBag className="w-5 h-5 text-blue-600" />,
  Package: <Package className="w-5 h-5 text-teal-600" />,
  Building: <Building className="w-5 h-5 text-slate-600" />
};

export const InputForm: React.FC<InputFormProps> = ({
  currentLanguage,
  formData,
  onChange,
  onSubmit,
  isLoading
}) => {
  const t = useTranslation(currentLanguage);

  const liveFinancials = calculateFinancialRoadmap(formData.availableMarginCapital);

  const selectedStateObj = STATES_DATA.find(s => s.state === formData.location.state) || STATES_DATA[0];
  const selectedDistrictObj = selectedStateObj.districts.find(d => d.district === formData.location.district) || selectedStateObj.districts[0];

  const handleStateChange = (stateName: string) => {
    const stateObj = STATES_DATA.find(s => s.state === stateName);
    if (!stateObj) return;
    const distObj = stateObj.districts[0];
    const blockObj = distObj.blocks[0];
    onChange({
      ...formData,
      location: {
        ...formData.location,
        state: stateName,
        district: distObj.district,
        block: blockObj.block,
        village: blockObj.villages[0] || 'Main Village'
      }
    });
  };

  const handleDistrictChange = (distName: string) => {
    const distObj = selectedStateObj.districts.find(d => d.district === distName);
    if (!distObj) return;
    const blockObj = distObj.blocks[0];
    onChange({
      ...formData,
      location: {
        ...formData.location,
        district: distName,
        block: blockObj.block,
        village: blockObj.villages[0] || 'Main Village'
      }
    });
  };

  const handleBlockChange = (blkName: string) => {
    const blkObj = selectedDistrictObj.blocks.find(b => b.block === blkName);
    onChange({
      ...formData,
      location: {
        ...formData.location,
        block: blkName,
        village: blkObj?.villages[0] || formData.location.village
      }
    });
  };

  const QUICK_CAPITAL_PRESETS = [
    { label: '₹10,000', value: 10000, note: '₹1.00L Project' },
    { label: '₹14,000', value: 14000, note: '₹1.40L (Micro Max)' },
    { label: '₹25,000', value: 25000, note: '₹2.50L Project' },
    { label: '₹50,000', value: 50000, note: '₹5.00L Project' },
    { label: '₹1,00,000', value: 100000, note: '₹10.0L Project' },
    { label: '₹2,50,000', value: 250000, note: '₹25.0L Project' },
    { label: '₹5,00,000', value: 500000, note: '₹50.0L (Term Max)' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-8">
      
      {/* SECTION 1: GEOGRAPHIC LOCATION */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{t.step1}</h2>
              <p className="text-xs text-slate-500">{t.geoTitle}</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
            Gram Panchayat Level
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* State */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">State / राज्य</label>
            <select
              value={formData.location.state}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              {STATES_DATA.map(s => (
                <option key={s.state} value={s.state}>{s.state}</option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">District / जिला</label>
            <select
              value={formData.location.district}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              {selectedStateObj.districts.map(d => (
                <option key={d.district} value={d.district}>{d.district}</option>
              ))}
            </select>
          </div>

          {/* Block / Tehsil */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Block / Tehsil / प्रखंड</label>
            <select
              value={formData.location.block}
              onChange={(e) => handleBlockChange(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              {selectedDistrictObj?.blocks.map(b => (
                <option key={b.block} value={b.block}>{b.block}</option>
              ))}
            </select>
          </div>

          {/* Village / Gram Panchayat */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Village / Gram Panchayat</label>
            <input
              type="text"
              value={formData.location.village}
              onChange={(e) => onChange({
                ...formData,
                location: { ...formData.location, village: e.target.value }
              })}
              placeholder="Enter Village Name"
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

        </div>

        {/* Catchment Radius & Area Profile */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <div className="text-xs font-bold text-slate-800">Feasibility Catchment Radius</div>
              <div className="text-[11px] text-slate-500">Immediate consumer & distribution radius</div>
            </div>
            <div className="flex gap-2">
              {[5, 10].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => onChange({
                    ...formData,
                    location: { ...formData.location, catchmentRadiusKm: r as 5 | 10 }
                  })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    formData.location.catchmentRadiusKm === r
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {r} km Radius
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <div className="text-xs font-bold text-slate-800">Area Economy Profile</div>
              <div className="text-[11px] text-slate-500">Demographic purchasing power context</div>
            </div>
            <div className="flex gap-1.5">
              {(['rural', 'semi-urban', 'peri-urban'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onChange({
                    ...formData,
                    location: { ...formData.location, areaType: type }
                  })}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    formData.location.areaType === type
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: AVAILABLE MARGIN CAPITAL & LIVE SCHEME ROUTER */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{t.step2}</h2>
              <p className="text-xs text-slate-500">{t.marginCapitalDesc}</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full">
            10% Margin → 90% Loan
          </span>
        </div>

        {/* Interactive Capital Input & Slider */}
        <div className="bg-gradient-to-br from-slate-50 to-emerald-50/40 p-5 rounded-2xl border border-emerald-200/80 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                {t.marginCapital}
              </label>
              <div className="text-xs text-slate-500">
                Enter your exact ready cash (Self-contribution)
              </div>
            </div>

            <div className="relative max-w-xs w-full">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-lg">
                ₹
              </span>
              <input
                type="number"
                min="1000"
                max="5000000"
                step="1000"
                value={formData.availableMarginCapital}
                onChange={(e) => onChange({
                  ...formData,
                  availableMarginCapital: Number(e.target.value) || 0
                })}
                className="w-full pl-9 pr-4 py-2.5 text-lg font-black text-slate-900 bg-white border-2 border-emerald-500 rounded-xl shadow-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {QUICK_CAPITAL_PRESETS.map(preset => (
              <button
                key={preset.value}
                type="button"
                onClick={() => onChange({
                  ...formData,
                  availableMarginCapital: preset.value
                })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  formData.availableMarginCapital === preset.value
                    ? 'bg-emerald-700 text-white shadow-xs font-bold'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/50'
                }`}
              >
                <span>{preset.label}</span>
                <span className="text-[10px] ml-1 opacity-75">({preset.note.split(' ')[0]})</span>
              </button>
            ))}
          </div>

          {/* Range Slider */}
          <div className="space-y-1">
            <input
              type="range"
              min="5000"
              max="500000"
              step="5000"
              value={Math.min(500000, formData.availableMarginCapital)}
              onChange={(e) => onChange({
                ...formData,
                availableMarginCapital: Number(e.target.value)
              })}
              className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] font-semibold text-slate-500">
              <span>₹5,000 (₹50k Unit)</span>
              <span>₹14,000 (Micro Tier Max)</span>
              <span>₹1,00,000 (₹10L Unit)</span>
              <span>₹5,00,000 (₹50L Term Max)</span>
            </div>
          </div>
        </div>

        {/* LIVE FINANCIAL SCHEME AUTO-ROUTING PREVIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-900 text-white shadow-md">
          
          <div className="p-2 border-r border-slate-800">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              {t.projectCost}
            </div>
            <div className="text-lg font-black text-emerald-400 mt-0.5">
              ₹{liveFinancials.projectCost.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-400">10x of your margin</div>
          </div>

          <div className="p-2 border-r border-slate-800">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              {t.loanAmount}
            </div>
            <div className="text-lg font-black text-teal-300 mt-0.5">
              ₹{liveFinancials.loanAmount.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-teal-400 font-semibold">90% Scheme Loan</div>
          </div>

          <div className="p-2 border-r border-slate-800">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Routed Scheme
            </div>
            <div className="text-xs font-bold text-amber-300 mt-1 line-clamp-1">
              {liveFinancials.scheme.name}
            </div>
            <div className="text-[10px] text-slate-300">
              {liveFinancials.scheme.interestRateAnnual}% • {liveFinancials.scheme.tenureYears} Yrs • {liveFinancials.scheme.moratoriumMonths}M Grace
            </div>
          </div>

          <div className="p-2">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              {t.quarterlyEmi}
            </div>
            <div className="text-lg font-black text-white mt-0.5">
              ₹{liveFinancials.quarterlyEMI.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-400">
              ≈ ₹{liveFinancials.monthlyEMIEquivalent.toLocaleString('en-IN')}/month
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 3: PROPOSED BUSINESS CATEGORY */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{t.step3}</h2>
              <p className="text-xs text-slate-500">{t.bizTitle}</p>
            </div>
          </div>
          <span className="text-xs text-slate-500">
            {BUSINESS_CATEGORIES.length} Rural Sectors
          </span>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {BUSINESS_CATEGORIES.map(cat => {
            const isSelected = formData.businessCategoryId === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => onChange({ ...formData, businessCategoryId: cat.id })}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-white shadow-2xs border border-slate-100">
                      {CATEGORY_ICONS[cat.icon] || <Building className="w-5 h-5 text-emerald-600" />}
                    </div>
                    {isSelected && (
                      <span className="p-1 rounded-full bg-emerald-600 text-white">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 line-clamp-1">{cat.name}</h3>
                  <div className="text-[11px] text-emerald-700 font-medium line-clamp-1 mb-1.5">{cat.nameHi}</div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{cat.description}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-600">
                  <span>CapEx/OpEx: {Math.round(cat.typicalCapexPercent * 100)}% / {Math.round(cat.typicalOpexPercent * 100)}%</span>
                  <span className="font-semibold text-emerald-700">₹{cat.avgSellingPricePerUnit}/{cat.unitType}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional Entrepreneur Profile Details */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Entrepreneur Name (Optional)</label>
            <input
              type="text"
              value={formData.entrepreneurName || ''}
              onChange={(e) => onChange({ ...formData, entrepreneurName: e.target.value })}
              placeholder="e.g. Ramesh Patel"
              className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Prior Experience (Years)</label>
            <input
              type="number"
              min="0"
              max="40"
              value={formData.priorExperienceYears || 0}
              onChange={(e) => onChange({ ...formData, priorExperienceYears: Number(e.target.value) || 0 })}
              className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <input
              type="checkbox"
              id="ownLandShed"
              checked={formData.hasOwnLandShed || false}
              onChange={(e) => onChange({ ...formData, hasOwnLandShed: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="ownLandShed" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Possesses own Land / Shed premises
            </label>
          </div>
        </div>

      </div>

      {/* GENERATE BUTTON */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-base shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Synthesizing Hyper-Local Feasibility Blueprint & DPR...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>{t.generateReportBtn}</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

    </div>
  );
};
