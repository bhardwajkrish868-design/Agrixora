import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Filter, 
  X, 
  Check, 
  MapPin, 
  TrendingUp, 
  Truck, 
  Sparkles, 
  FileText, 
  Building2, 
  Printer, 
  Users, 
  FileSpreadsheet
} from 'lucide-react';
import type { 
  PreBulkDemandOrder, 
  Language, 
  LocationCatchment, 
  InstitutionalDemand 
} from '../../types';
import { BUYER_DEMAND_ORDERS } from '../../data/buyerDemands';
import { getStateDemandOrders } from '../../services/stateLocationService';
import { getSessionUser } from '../../services/authService';
import confetti from 'canvas-confetti';

interface BuyerDemandMarketplaceProps {
  orders?: PreBulkDemandOrder[];
  onCommitSupply?: (orderId: string, quantity: number, producerName: string, contact: string, village: string) => void;
  onPostNewDemand?: (newOrder: PreBulkDemandOrder) => void;
  currentLanguage: Language;
  activeLocation?: LocationCatchment;
  preselectedDemand?: InstitutionalDemand | null;
  onPledgeCreated?: (pledge: { buyerName: string; committedQuantity: number; unit: string }) => void;
  onNavigateToFeasibility?: () => void;
  userRole?: string;
  userName?: string;
}

interface SupplyPledgeRecord {
  id: string;
  orderId: string;
  product: string;
  buyerName: string;
  producerName: string;
  producerContact: string;
  producerVillage: string;
  district: string;
  state: string;
  quantityTonnes: number;
  offeredPrice: number;
  status: 'Pledged' | 'Sample Approved' | 'LOI Issued' | 'Escrow Funded';
  date: string;
}

export const BuyerDemandMarketplace: React.FC<BuyerDemandMarketplaceProps> = ({
  orders: externalOrders,
  onCommitSupply: externalOnCommitSupply,
  onPostNewDemand: externalOnPostNewDemand,
  activeLocation,
  preselectedDemand,
  onPledgeCreated,
  onNavigateToFeasibility,
  userRole: propUserRole,
  userName: propUserName
}) => {
  const sessionUser = getSessionUser();
  const userRole = (propUserRole || sessionUser?.role || 'entrepreneur').toLowerCase();
  const userName = propUserName || sessionUser?.name || 'Verified Partner';
  const currentState = activeLocation?.state || sessionUser?.state || 'Maharashtra';
  const currentDistrict = activeLocation?.district || sessionUser?.district || 'Nashik';

  const isBuyer = userRole.includes('buyer') || userRole.includes('trader') || userRole === 'institutional_buyer';

  // Base list merged with dynamic state-specific orders
  const initialMergedOrders = useMemo(() => {
    const base = externalOrders || BUYER_DEMAND_ORDERS;
    const stateCustomOrders = getStateDemandOrders(currentState, currentDistrict);
    
    // Merge without duplicate IDs
    const existingIds = new Set(base.map(o => o.id));
    const toAdd = stateCustomOrders.filter(o => !existingIds.has(o.id));
    return [...toAdd, ...base];
  }, [externalOrders, currentState, currentDistrict]);

  const [ordersList, setOrdersList] = useState<PreBulkDemandOrder[]>(initialMergedOrders);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [geoFilter, setGeoFilter] = useState<'all' | 'state'>('state');
  const [activePledgeOrder, setActivePledgeOrder] = useState<PreBulkDemandOrder | null>(null);
  const [showPostDemandModal, setShowPostDemandModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'demands' | 'pledges' | 'clusters' | 'loi'>(isBuyer ? 'demands' : 'demands');
  const [selectedLoiOrder, setSelectedLoiOrder] = useState<PreBulkDemandOrder | null>(null);

  // Supply Pledges Live Registry
  const [pledgesRegistry, setPledgesRegistry] = useState<SupplyPledgeRecord[]>([
    {
      id: 'PLG-101',
      orderId: 'ORD-MH-01',
      product: 'Export Grade Red Onion (Nashik Special)',
      buyerName: 'MahaAgro Export Consortium Ltd',
      producerName: 'Sahyadri Farmers Producer Co.',
      producerContact: '+91 98223 45678',
      producerVillage: 'Dindori Cluster',
      district: 'Nashik',
      state: 'Maharashtra',
      quantityTonnes: 50,
      offeredPrice: 28000,
      status: 'LOI Issued',
      date: '28 Sep 2026'
    },
    {
      id: 'PLG-102',
      orderId: 'ORD-MH-02',
      product: 'High-Curcumin Turmeric (Salem/Waigaon Grade)',
      buyerName: 'Patanjali Agro & Spice Processing Unit',
      producerName: 'Godavari Krishi Vikas FPO',
      producerContact: '+91 94231 87654',
      producerVillage: 'Niphad Gram',
      district: 'Nashik',
      state: 'Maharashtra',
      quantityTonnes: 20,
      offeredPrice: 115000,
      status: 'Sample Approved',
      date: '29 Sep 2026'
    },
    {
      id: 'PLG-103',
      orderId: 'ORD-MH-03',
      product: 'A2 Desi Cow Ghee & Whey Solids',
      buyerName: 'Mother Dairy Rural Procurement Wing',
      producerName: 'Gir Ganga Dairy Cooperative',
      producerContact: '+91 97654 32109',
      producerVillage: 'Sinnar Taluka',
      district: 'Nashik',
      state: 'Maharashtra',
      quantityTonnes: 15,
      offeredPrice: 650000,
      status: 'Escrow Funded',
      date: '29 Sep 2026'
    }
  ]);

  // Sync ordersList whenever state changes
  useEffect(() => {
    setOrdersList(initialMergedOrders);
  }, [initialMergedOrders]);

  // Form State for Pledging Supply
  const [pledgeQty, setPledgeQty] = useState<number>(5);
  const [producerName, setProducerName] = useState<string>(sessionUser?.name || 'Local Rural Producer');
  const [producerContact, setProducerContact] = useState<string>(sessionUser?.phone || '9876543210');
  const [producerVillage, setProducerVillage] = useState<string>(
    activeLocation?.panchayat || activeLocation?.village || 'Local Panchayat'
  );
  const [pledgeSuccess, setPledgeSuccess] = useState(false);

  // Form State for Posting Demand (Off-taker)
  const [newBuyerName, setNewBuyerName] = useState(isBuyer ? userName : '');
  const [newBuyerType, setNewBuyerType] = useState('Institutional Food Processor');
  const [newProduct, setNewProduct] = useState('');
  const [newCategory, setNewCategory] = useState('Food Processing');
  const [newQualityGrade, setNewQualityGrade] = useState('Grade A (Moisture < 10%, Export Spec)');
  const [newQty, setNewQty] = useState(100);
  const [newPrice, setNewPrice] = useState(35000);
  const [newLocation, setNewLocation] = useState(`${currentDistrict} Mandi Hub`);
  const [newPaymentTerms, setNewPaymentTerms] = useState('100% Direct Bank Transfer within 48h (Escrow Backed)');

  // Synchronize when preselectedDemand is passed
  useEffect(() => {
    if (preselectedDemand) {
      const match = ordersList.find(o => o.id === preselectedDemand.id);
      if (match) {
        setActivePledgeOrder(match);
      }
    }
  }, [preselectedDemand, ordersList]);

  // Sync user info if activeLocation or session changes
  useEffect(() => {
    if (activeLocation?.panchayat || activeLocation?.village) {
      setProducerVillage(activeLocation.panchayat || activeLocation.village || 'Local Panchayat');
    }
    if (sessionUser?.name) {
      setProducerName(sessionUser.name);
    }
    if (sessionUser?.phone) {
      setProducerContact(sessionUser.phone);
    }
  }, [activeLocation, sessionUser]);

  const CATEGORIES = ['All', 'Food Processing', 'Dairy', 'Agriculture', 'Textiles', 'Poultry'];

  // Filter & Prioritize based on user's registered state
  const displayedOrders = useMemo(() => {
    let list = ordersList;

    // Filter by Category
    if (selectedCategory !== 'All') {
      list = list.filter(o => o.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    }

    // Filter by Geo
    if (geoFilter === 'state') {
      const stateMatches = list.filter(o => o.state.toLowerCase() === currentState.toLowerCase());
      if (stateMatches.length > 0) {
        list = stateMatches;
      }
    }

    // Sort: user's registered state orders float to the top
    return [...list].sort((a, b) => {
      const aIsState = a.state.toLowerCase() === currentState.toLowerCase() ? 1 : 0;
      const bIsState = b.state.toLowerCase() === currentState.toLowerCase() ? 1 : 0;
      return bIsState - aIsState;
    });
  }, [ordersList, selectedCategory, geoFilter, currentState]);

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePledgeOrder) return;

    if (externalOnCommitSupply) {
      externalOnCommitSupply(activePledgeOrder.id, pledgeQty, producerName, producerContact, producerVillage);
    } else {
      setOrdersList(prev => prev.map(o => {
        if (o.id === activePledgeOrder.id) {
          return {
            ...o,
            committedQuantityTonnes: Math.min(o.requiredQuantityTonnes, o.committedQuantityTonnes + pledgeQty)
          };
        }
        return o;
      }));
    }

    // Add to live pledges registry
    const newPlg: SupplyPledgeRecord = {
      id: 'PLG-' + Date.now().toString().slice(-4),
      orderId: activePledgeOrder.id,
      product: activePledgeOrder.product,
      buyerName: activePledgeOrder.buyerName,
      producerName: producerName || 'Local Enterprise',
      producerContact: producerContact || '+91 98000 00000',
      producerVillage: producerVillage || currentDistrict,
      district: currentDistrict,
      state: currentState,
      quantityTonnes: pledgeQty,
      offeredPrice: activePledgeOrder.offeredPricePerUnit,
      status: 'Pledged',
      date: 'Today'
    };
    setPledgesRegistry(prev => [newPlg, ...prev]);

    if (onPledgeCreated) {
      onPledgeCreated({
        buyerName: activePledgeOrder.buyerName,
        committedQuantity: pledgeQty,
        unit: activePledgeOrder.unit,
      });
    }

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    setPledgeSuccess(true);
    setTimeout(() => {
      setPledgeSuccess(false);
      const targetOrder = activePledgeOrder;
      setActivePledgeOrder(null);
      // Open LOI certificate preview
      setSelectedLoiOrder(targetOrder);
    }, 1200);
  };

  const handlePostDemandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrd: PreBulkDemandOrder = {
      id: 'ORD-CUSTOM-' + Date.now(),
      buyerName: newBuyerName || `${userName} Procurement Desk`,
      buyerType: newBuyerType,
      product: newProduct || 'Grade-A Agri Commodity',
      category: newCategory,
      qualityGrade: newQualityGrade,
      requiredQuantityTonnes: Number(newQty) || 50,
      committedQuantityTonnes: 0,
      offeredPricePerUnit: Number(newPrice) || 25000,
      unit: 'Tonne',
      deliveryDate: '25 December 2026',
      location: newLocation || `${currentDistrict} Mandi Hub`,
      district: currentDistrict,
      state: currentState,
      pickupMode: 'Farm-gate Collection Center',
      paymentTerms: newPaymentTerms,
      verifiedBuyerBadge: true,
      notes: 'Direct institutional off-take contract with bank comfort guarantee.'
    };

    if (externalOnPostNewDemand) {
      externalOnPostNewDemand(newOrd);
    } else {
      setOrdersList(prev => [newOrd, ...prev]);
    }
    setShowPostDemandModal(false);
    confetti({ particleCount: 50, spread: 50 });
  };

  const stateOrdersCount = ordersList.filter(o => o.state.toLowerCase() === currentState.toLowerCase()).length;
  const totalDemandTonnes = ordersList.reduce((acc, o) => acc + o.requiredQuantityTonnes, 0);
  const totalCommittedTonnes = ordersList.reduce((acc, o) => acc + o.committedQuantityTonnes, 0);

  // State-specific FPO Clusters
  const FPO_CLUSTERS = [
    {
      name: `${currentDistrict} Agro Producers Cooperative Ltd`,
      specialty: 'Primary Aggregation, Grading & Solar Dehydration',
      members: 420,
      monthlyCapacity: '120 Tonnes/Month',
      verifiedRating: '4.9 ★',
      compliance: 'FSSAI & NABARD Registered'
    },
    {
      name: `${currentState} Krishak Federation Producer Co.`,
      specialty: 'Cold Pressed Edible Oils & Spices Processing',
      members: 850,
      monthlyCapacity: '250 Tonnes/Month',
      verifiedRating: '4.8 ★',
      compliance: 'e-NAM & APEDA Certified'
    },
    {
      name: `${currentDistrict} SHG Mahila Udyog Sangh`,
      specialty: 'Makhana / Pulse Milling & Customized Packaging',
      members: 310,
      monthlyCapacity: '80 Tonnes/Month',
      verifiedRating: '5.0 ★',
      compliance: 'MSME & NULM Aligned'
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* 1. TOP HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl border border-emerald-900/40 shadow-xl p-6 sm:p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {isBuyer ? 'Institutional Off-taker Procurement Hub' : 'Guaranteed Forward Linkages & Buybacks'}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                {currentState} ({currentDistrict})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isBuyer ? 'Institutional Procurement & Buyback Desk' : 'Institutional Off-taker Buyback Contracts'}
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isBuyer
                ? `Contract guaranteed commodity volumes with verified rural FPOs and processing units in ${currentState}. Issue bank-ready LOIs to secure high-quality farm-gate supplies.`
                : `Lock in pre-season purchase contracts with verified institutional buyers (ITC, BigBasket, Patanjali). Verified off-taker contracts guarantee cash flows and fast-track 90% bank loan approvals.`}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onNavigateToFeasibility && (
              <button
                onClick={onNavigateToFeasibility}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Feasibility Check</span>
              </button>
            )}
            <button
              onClick={() => setShowPostDemandModal(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{isBuyer ? 'Issue Buyback Contract / LOI' : 'Post Off-taker Demand'}</span>
            </button>
          </div>
        </div>

        {/* Top KPI Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Sourcing Demand</div>
            <div className="text-base sm:text-lg font-black text-white mt-0.5 font-mono">
              {totalDemandTonnes.toLocaleString('en-IN')} Tonnes
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Across {ordersList.length} Active Contracts</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400">FPO Supply Committed</div>
            <div className="text-base sm:text-lg font-black text-emerald-400 mt-0.5 font-mono">
              {totalCommittedTonnes.toLocaleString('en-IN')} Tonnes
            </div>
            <div className="text-[10px] text-slate-300 mt-0.5">
              {Math.round((totalCommittedTonnes / (totalDemandTonnes || 1)) * 100)}% Fulfilled
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400">Escrow Payment Term</div>
            <div className="text-base sm:text-lg font-black text-teal-300 mt-0.5 font-mono">
              T + 48 Hours
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Direct DBT Settlement</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400">Bank Loan Underwriting</div>
            <div className="text-base sm:text-lg font-black text-amber-300 mt-0.5 font-mono">
              100% Comfort
            </div>
            <div className="text-[10px] text-amber-400/90 mt-0.5">Triple-A Forward Guarantee</div>
          </div>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('demands')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'demands'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Active Buyback Contracts ({ordersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pledges')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'pledges'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>FPO Supply Pledges ({pledgesRegistry.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('clusters')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'clusters'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Regional Supplier Clusters</span>
          </button>
        </div>

        {/* Geo Selector Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setGeoFilter('state')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              geoFilter === 'state'
                ? 'bg-slate-900 dark:bg-slate-700 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>{currentState} Only ({stateOrdersCount})</span>
          </button>
          <button
            onClick={() => setGeoFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              geoFilter === 'all'
                ? 'bg-slate-900 dark:bg-slate-700 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            All India ({ordersList.length})
          </button>
        </div>
      </div>

      {/* 3. TAB 1: ACTIVE CONTRACTS & DEMANDS */}
      {activeTab === 'demands' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 items-center bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
            <span className="text-xs font-bold text-slate-500 mr-2">Category:</span>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedOrders.map(order => {
              const progressPercent = Math.min(100, Math.round((order.committedQuantityTonnes / order.requiredQuantityTonnes) * 100));
              const remainingTonnes = Math.max(0, order.requiredQuantityTonnes - order.committedQuantityTonnes);
              const isLocalState = order.state.toLowerCase() === currentState.toLowerCase();

              return (
                <div
                  key={order.id}
                  className={`bg-white dark:bg-slate-900 rounded-3xl border shadow-sm hover:shadow-md transition-all p-5 sm:p-6 flex flex-col justify-between space-y-4 ${
                    isLocalState 
                      ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' 
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div>
                    {/* Header with Badges */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                          {order.category}
                        </span>
                        {isLocalState && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-emerald-500" />
                            {order.state} Priority
                          </span>
                        )}
                      </div>

                      {order.verifiedBuyerBadge && (
                        <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full shrink-0">
                          <ShieldCheck className="w-3 h-3 text-amber-600" />
                          <span>Bank Verified</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {order.product}
                    </h3>

                    <div className="text-xs text-slate-500 mb-3 font-semibold mt-0.5">
                      Off-taker: <strong className="text-slate-800 dark:text-slate-200">{order.buyerName}</strong> ({order.buyerType})
                    </div>

                    {/* Price & Location Details */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-800 space-y-2 mb-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">Guaranteed Floor Rate:</span>
                        <strong className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                          ₹{order.offeredPricePerUnit.toLocaleString('en-IN')} / {order.unit}
                        </strong>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">Quality Spec:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px] truncate max-w-[170px]">
                          {order.qualityGrade}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">Delivery Center:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px] truncate max-w-[170px] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          {order.location}, {order.state}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">Payment Terms:</span>
                        <span className="font-semibold text-teal-600 dark:text-teal-400 text-[11px]">
                          {order.paymentTerms}
                        </span>
                      </div>
                    </div>

                    {/* Procurement Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-600 dark:text-slate-400">
                          Pledged: <strong className="text-slate-900 dark:text-white font-mono">{order.committedQuantityTonnes} {order.unit}</strong>
                        </span>
                        <span className="text-slate-500 font-mono">
                          Quota: {order.requiredQuantityTonnes} {order.unit}
                        </span>
                      </div>

                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>{progressPercent}% Contracted</span>
                        <span className="text-amber-600 dark:text-amber-400 font-bold">{remainingTonnes} {order.unit} Open</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => {
                        setActivePledgeOrder(order);
                        setPledgeQty(Math.min(remainingTonnes > 0 ? remainingTonnes : 5, 10));
                      }}
                      disabled={remainingTonnes <= 0}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        remainingTonnes <= 0
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>
                        {remainingTonnes <= 0 ? '100% Contracted' : isBuyer ? 'Manage Supply Allocation' : `Pledge Supply (${order.state})`}
                      </span>
                    </button>

                    <button
                      onClick={() => setSelectedLoiOrder(order)}
                      className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-500" />
                      <span>View Bank LOI Guarantee</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. TAB 2: FPO SUPPLY PLEDGES & PIPELINE */}
      {activeTab === 'pledges' && (
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Farm-Gate Commitments</h3>
              <p className="text-xs text-slate-500">Live commodity pledges committed by local FPOs & rural processing units.</p>
            </div>
            <div className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30 font-mono">
              {pledgesRegistry.length} Registered Pledges
            </div>
          </div>

          <div className="space-y-3">
            {pledgesRegistry.map(plg => (
              <div
                key={plg.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold font-mono">
                      {plg.id}
                    </span>
                    <span className="text-xs font-bold text-slate-500">• {plg.date}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      plg.status === 'LOI Issued'
                        ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-500/30'
                        : plg.status === 'Escrow Funded'
                        ? 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-500/30'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                    }`}>
                      {plg.status}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {plg.product}
                  </h4>

                  <div className="text-xs text-slate-600 dark:text-slate-300 flex flex-wrap items-center gap-3">
                    <span>Producer: <strong className="text-slate-900 dark:text-white">{plg.producerName}</strong></span>
                    <span>Contact: <span className="font-mono text-emerald-600 dark:text-emerald-400">{plg.producerContact}</span></span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {plg.producerVillage}, {plg.district}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                  <div className="text-left sm:text-right">
                    <div className="text-xs text-slate-400">Committed Supply</div>
                    <div className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      {plg.quantityTonnes} Tonnes (₹{((plg.quantityTonnes * plg.offeredPrice) / 100000).toFixed(2)} L)
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const matchOrder = ordersList.find(o => o.id === plg.orderId) || ordersList[0];
                      setSelectedLoiOrder(matchOrder);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
                    <span>Download LOI</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB 3: REGIONAL SUPPLIER CLUSTERS & FPOs */}
      {activeTab === 'clusters' && (
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Verified Farmer Producer Collectives & Processing Units in {currentState}
              </h3>
              <p className="text-xs text-slate-500">
                Direct farm-gate sourcing network with audited grading & aggregation infrastructure.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              NABARD / SFAC Synchronized
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FPO_CLUSTERS.map((fpo, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-emerald-500 font-bold">{fpo.verifiedRating}</span>
                    <span className="px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-[10px] font-bold">
                      {fpo.compliance}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {fpo.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {fpo.specialty}
                  </p>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Farmer Members:</span>
                      <strong className="text-slate-900 dark:text-white font-mono">{fpo.members} Farmers</strong>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Monthly Output:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{fpo.monthlyCapacity}</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowPostDemandModal(true)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-emerald-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Send Buyback Proposal</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PLEDGE SUPPLY MODAL */}
      {activePledgeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setActivePledgeOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {pledgeSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Supply Pledge Recorded!</h3>
                <p className="text-xs text-slate-500">
                  Off-taker notification sent. Generating your official Bank Buyback Guarantee Letter (LOI)...
                </p>
              </div>
            ) : (
              <form onSubmit={handlePledgeSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    Producer Supply Commitment
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {activePledgeOrder.product}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Buyer: {activePledgeOrder.buyerName} • Offered Rate: ₹{activePledgeOrder.offeredPricePerUnit.toLocaleString('en-IN')}/{activePledgeOrder.unit}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Pledge Quantity ({activePledgeOrder.unit})
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={activePledgeOrder.requiredQuantityTonnes - activePledgeOrder.committedQuantityTonnes}
                      value={pledgeQty}
                      onChange={(e) => setPledgeQty(Number(e.target.value))}
                      className="w-full text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Producer / FPO Name
                    </label>
                    <input
                      type="text"
                      value={producerName}
                      onChange={(e) => setProducerName(e.target.value)}
                      className="w-full text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Contact Mobile (+91)
                    </label>
                    <input
                      type="tel"
                      value={producerContact}
                      onChange={(e) => setProducerContact(e.target.value)}
                      className="w-full text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Village / District Location
                    </label>
                    <input
                      type="text"
                      value={producerVillage}
                      onChange={(e) => setProducerVillage(e.target.value)}
                      className="w-full text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActivePledgeOrder(null)}
                    className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    Confirm & Generate LOI
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* POST DEMAND MODAL (OFF-TAKER) */}
      {showPostDemandModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowPostDemandModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handlePostDemandSubmit} className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                  Institutional Off-taker Desk
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Issue Bulk Buyback Contract & LOI
                </h3>
                <p className="text-xs text-slate-500">
                  Broadcast your procurement specifications to verified rural FPOs and processing enterprises across {currentState}.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Off-taker / Corporate Entity Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Swadeshi Agro Processing Ltd"
                    value={newBuyerName}
                    onChange={(e) => setNewBuyerName(e.target.value)}
                    className="w-full text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Buyer Category
                    </label>
                    <select
                      value={newBuyerType}
                      onChange={(e) => setNewBuyerType(e.target.value)}
                      className="w-full text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
                    >
                      <option value="Food Processor">Food Processor</option>
                      <option value="Export Aggregator">Export Aggregator</option>
                      <option value="FMCG Corporate">FMCG Corporate</option>
                      <option value="Retail Chain">Retail Chain</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Sector
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
                    >
                      <option value="Food Processing">Food Processing</option>
                      <option value="Dairy">Dairy</option>
                      <option value="Agriculture">Agriculture</option>
                      <option value="Textiles">Textiles</option>
                      <option value="Poultry">Poultry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Commodity Required
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. High-Curcumin Waigaon Turmeric / Organic Mustard"
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                    className="w-full text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Quality & Packaging Specifications
                  </label>
                  <input
                    type="text"
                    value={newQualityGrade}
                    onChange={(e) => setNewQualityGrade(e.target.value)}
                    placeholder="e.g. Moisture < 10%, Foreign Matter < 1%, 50kg Jute Bags"
                    className="w-full text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Target Volume (Tonnes)
                    </label>
                    <input
                      type="number"
                      value={newQty}
                      onChange={(e) => setNewQty(Number(e.target.value))}
                      className="w-full text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Floor Price (₹/Tonne)
                    </label>
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Procurement Terminal / Mandi Hub
                  </label>
                  <input
                    type="text"
                    placeholder={`e.g. ${currentDistrict} Cold Storage Hub`}
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Terms & Settlement
                  </label>
                  <input
                    type="text"
                    value={newPaymentTerms}
                    onChange={(e) => setNewPaymentTerms(e.target.value)}
                    className="w-full text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPostDemandModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-slate-950 text-xs font-black shadow-md cursor-pointer"
                >
                  Publish Buyback Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. OFFICIAL LETTER OF INTENT (LOI) / BANK BUYBACK GUARANTEE MODAL */}
      {selectedLoiOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-300 shadow-2xl relative max-h-[90vh] overflow-y-auto font-sans">
            <button
              onClick={() => setSelectedLoiOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer no-print"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Target Printable LOI Container */}
            <div id="loi-certificate-document" className="space-y-4">
              {/* Formal Certificate Header */}
              <div className="border-b-2 border-emerald-700 pb-4 text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-emerald-800 font-extrabold text-sm uppercase tracking-wider">
                  <Building2 className="w-4 h-4" />
                  <span>Formal Institutional Off-take & Buyback Guarantee</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  LETTER OF INTENT (LOI) FOR BANK CREDIT APPRAISAL
                </h2>
                <p className="text-[11px] text-slate-500">
                  Issued under the National Agricultural & Rural Enterprise Financing Framework (Aligned with NABARD / AIF / PMEGP Guidelines)
                </p>
              </div>

              {/* Certificate Body */}
              <div className="py-4 space-y-4 text-xs leading-relaxed text-slate-700">
                <div className="flex justify-between items-center text-[11px] text-slate-500 border-b border-slate-200 pb-2">
                  <span>Contract Ref: <strong className="font-mono text-slate-900">{selectedLoiOrder.id}-LOI</strong></span>
                  <span>Date: <strong className="font-mono text-slate-900">30 September 2026</strong></span>
                  <span>State: <strong className="font-mono text-slate-900">{selectedLoiOrder.state}</strong></span>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <div className="font-bold text-emerald-900">TO THE CREDIT SANCTIONING AUTHORITY / BRANCH MANAGER</div>
                  <p className="text-[11px] text-emerald-800">
                    Lead Lending Bank / NABARD / Scheduled Commercial Bank Branch ({currentDistrict}, {currentState})
                  </p>
                </div>

                <p>
                  This certifies that <strong>{selectedLoiOrder.buyerName}</strong> ({selectedLoiOrder.buyerType}) has entered into a binding pre-season off-take agreement with registered rural producers and FPO enterprises located in <strong>{selectedLoiOrder.location}, {selectedLoiOrder.state}</strong> for the procurement of:
                </p>

                {/* Spec Table */}
                <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                  <div className="grid grid-cols-2 bg-slate-100 p-2.5 font-bold border-b border-slate-200">
                    <span>Parameter</span>
                    <span>Agreed Terms</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5 border-b border-slate-100">
                    <span className="text-slate-500">Commodity / Produce:</span>
                    <span className="font-bold text-slate-900">{selectedLoiOrder.product}</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5 border-b border-slate-100">
                    <span className="text-slate-500">Committed Procurement Volume:</span>
                    <span className="font-bold text-slate-900 font-mono">{selectedLoiOrder.requiredQuantityTonnes} {selectedLoiOrder.unit}s</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5 border-b border-slate-100">
                    <span className="text-slate-500">Guaranteed Floor Price:</span>
                    <span className="font-bold text-emerald-700 font-mono">₹{selectedLoiOrder.offeredPricePerUnit.toLocaleString('en-IN')} per {selectedLoiOrder.unit}</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5 border-b border-slate-100">
                    <span className="text-slate-500">Quality Specification:</span>
                    <span className="font-bold text-slate-900">{selectedLoiOrder.qualityGrade}</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5 bg-slate-50">
                    <span className="text-slate-500">Escrow Payment Terms:</span>
                    <span className="font-bold text-teal-800">{selectedLoiOrder.paymentTerms}</span>
                  </div>
                </div>

                {/* Bank Comfort Clause */}
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Bank Underwriting Guarantee Clause:</strong> This Letter of Intent constitutes an irrevocable forward linkage commitment. In accordance with the 10:90 concessional credit policy, revenues generated from this contract shall be escrow-routed directly toward loan debt servicing (DSCR &gt; 2.2x).
                  </div>
                </div>

                {/* Signatures */}
                <div className="pt-4 flex justify-between items-end border-t border-slate-200 text-[11px]">
                  <div>
                    <div className="w-32 h-10 border-b border-dashed border-slate-400 flex items-center justify-center text-slate-400 italic">
                      Digitally Verified
                    </div>
                    <div className="font-bold text-slate-900 mt-1">Authorized Off-taker Signatory</div>
                    <div className="text-slate-500">{selectedLoiOrder.buyerName}</div>
                  </div>

                  <div className="text-right">
                    <div className="w-32 h-10 border-b border-dashed border-slate-400 flex items-center justify-end text-emerald-600 font-bold font-mono">
                      AGRIXORA-KYC-OK
                    </div>
                    <div className="font-bold text-slate-900 mt-1">AgriXora Registry Platform</div>
                    <div className="text-slate-500">Govt. MSME / AIF Gateway</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-200 no-print">
              <button
                onClick={() => setSelectedLoiOrder(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  import('../../services/printService').then(m => {
                    m.printTargetElement('loi-certificate-document', `Bank_LOI_Guarantee_${selectedLoiOrder.id}`);
                  });
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save Bank LOI PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
