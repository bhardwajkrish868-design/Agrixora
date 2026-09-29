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
  Sparkles
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
}

export const BuyerDemandMarketplace: React.FC<BuyerDemandMarketplaceProps> = ({
  orders: externalOrders,
  onCommitSupply: externalOnCommitSupply,
  onPostNewDemand: externalOnPostNewDemand,
  activeLocation,
  preselectedDemand,
  onPledgeCreated,
  onNavigateToFeasibility
}) => {
  const sessionUser = getSessionUser();
  const currentState = activeLocation?.state || sessionUser?.state || 'Maharashtra';
  const currentDistrict = activeLocation?.district || sessionUser?.district || 'Nashik';

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

  // Form State for Posting Demand
  const [newBuyerName, setNewBuyerName] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [newQty, setNewQty] = useState(100);
  const [newPrice, setNewPrice] = useState(25000);
  const [newLocation, setNewLocation] = useState('');

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
  }, [activeLocation]);

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
      // If we have state matches, prioritize them, else show all
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
      setActivePledgeOrder(null);
    }, 1500);
  };

  const handlePostDemandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrd: PreBulkDemandOrder = {
      id: 'ORD-CUSTOM-' + Date.now(),
      buyerName: newBuyerName || `${currentState} Agro Processing Cluster`,
      buyerType: 'Food Processor',
      product: newProduct || 'Agri Commodity',
      category: 'Food Processing',
      qualityGrade: 'Grade A (Export / Premium)',
      requiredQuantityTonnes: Number(newQty) || 50,
      committedQuantityTonnes: 0,
      offeredPricePerUnit: Number(newPrice) || 20000,
      unit: 'Tonne',
      deliveryDate: '20 December 2026',
      location: newLocation || `${currentDistrict} Mandi Hub`,
      district: currentDistrict,
      state: currentState,
      pickupMode: 'Farm-gate Collection Center',
      paymentTerms: '100% Direct Bank Transfer within 48h',
      verifiedBuyerBadge: true,
      notes: 'Direct institutional off-take contract.'
    };

    if (externalOnPostNewDemand) {
      externalOnPostNewDemand(newOrd);
    } else {
      setOrdersList(prev => [newOrd, ...prev]);
    }
    setShowPostDemandModal(false);
  };

  const stateOrdersCount = ordersList.filter(o => o.state.toLowerCase() === currentState.toLowerCase()).length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 dark:bg-amber-950 dark:text-amber-400 px-3 py-1 rounded-full">
              Demand-First Marketplace
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 px-3 py-1 rounded-full flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Tailored for: {currentState} ({currentDistrict})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Institutional Demand & Pre-Bulk Contracts
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-1">
            Lock in guaranteed purchase contracts from verified food processors, state agencies, and corporate retail aggregators tailored to <strong>{currentState}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToFeasibility && (
            <button
              onClick={onNavigateToFeasibility}
              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Feasibility Check</span>
            </button>
          )}
          <button
            onClick={() => setShowPostDemandModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer shrink-0 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Post Buyer Demand</span>
          </button>
        </div>
      </div>

      {/* State / Pan-India Filter & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        
        {/* Geo Selector Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setGeoFilter('state')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              geoFilter === 'state'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{currentState} ({stateOrdersCount})</span>
          </button>
          <button
            onClick={() => setGeoFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              geoFilter === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            All India ({ordersList.length})
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
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
              className={`bg-white dark:bg-slate-800 rounded-3xl border shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4 ${
                isLocalState 
                  ? 'border-emerald-500/60 dark:border-emerald-500/50 ring-2 ring-emerald-500/20' 
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <div>
                {/* Header with State priority badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                      {order.category}
                    </span>
                    {isLocalState && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        {order.state} Demand
                      </span>
                    )}
                  </div>

                  {order.verifiedBuyerBadge && (
                    <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full shrink-0">
                      <ShieldCheck className="w-3 h-3 text-amber-600" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {order.product}
                </h3>

                <div className="text-xs text-slate-500 mb-3 font-semibold mt-1">
                  Buyer: <strong className="text-slate-700 dark:text-slate-300">{order.buyerName}</strong> ({order.buyerType})
                </div>

                {/* Price & Location Card */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-2 mb-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Offered Rate:</span>
                    <strong className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      ₹{order.offeredPricePerUnit.toLocaleString('en-IN')} / {order.unit}
                    </strong>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Procurement Hub:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px] truncate max-w-[160px] flex items-center gap-1">
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

                {/* Demand Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600 dark:text-slate-400">
                      Pledged: <strong className="text-slate-900 dark:text-white font-mono">{order.committedQuantityTonnes} {order.unit}</strong>
                    </span>
                    <span className="text-slate-500 font-mono">
                      Target: {order.requiredQuantityTonnes} {order.unit}
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{progressPercent}% Committed</span>
                    <span className="text-amber-600 font-bold">{remainingTonnes} {order.unit} Remaining</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  setActivePledgeOrder(order);
                  setPledgeQty(Math.min(remainingTonnes, 5));
                }}
                disabled={remainingTonnes <= 0}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-4 ${
                  remainingTonnes <= 0
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>{remainingTonnes <= 0 ? 'Order 100% Fulfilled' : `Commit Supply for ${order.state}`}</span>
              </button>
            </div>
          );
        })}
      </div>

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
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Supply Pledge Confirmed!</h3>
                <p className="text-xs text-slate-500">
                  Buyer notification sent. The off-take agreement has been recorded under your Village Enterprise dossier for {activePledgeOrder.state}.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePledgeSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    Producer Supply Pledge
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {activePledgeOrder.product} for {activePledgeOrder.buyerName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Offered: ₹{activePledgeOrder.offeredPricePerUnit.toLocaleString('en-IN')} / {activePledgeOrder.unit} • State: {activePledgeOrder.state}
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
                      Producer / Enterprise Name
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
                      Panchayat / Village Location
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
                    Confirm Pledge
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* POST DEMAND MODAL */}
      {showPostDemandModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setShowPostDemandModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handlePostDemandSubmit} className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                  Institutional Off-taker
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Post Bulk Purchase Contract
                </h3>
                <p className="text-xs text-slate-500">
                  Broadcast your commodity requirements to verified rural FPOs and SHG clusters in {currentState}.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Buyer / Enterprise Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Swadeshi FMCG Ltd"
                    value={newBuyerName}
                    onChange={(e) => setNewBuyerName(e.target.value)}
                    className="w-full text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Product Required
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Grade-A Cold-Pressed Mustard Oil"
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                    className="w-full text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Required Quantity (Tonnes)
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
                      Offered Price (₹/Tonne)
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
                    Procurement Terminal / Hub
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
              </div>

              <div className="flex gap-2 pt-2">
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
                  Publish Demand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
