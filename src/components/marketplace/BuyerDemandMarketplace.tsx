import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Plus, 
  Filter, 
  X,
  Check,
  MapPin,
  TrendingUp,
  Truck
} from 'lucide-react';
import type { 
  PreBulkDemandOrder, 
  Language, 
  LocationCatchment, 
  InstitutionalDemand 
} from '../../types';
import { BUYER_DEMAND_ORDERS } from '../../data/buyerDemands';
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
  const [ordersList, setOrdersList] = useState<PreBulkDemandOrder[]>(
    externalOrders || BUYER_DEMAND_ORDERS
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePledgeOrder, setActivePledgeOrder] = useState<PreBulkDemandOrder | null>(null);
  const [showPostDemandModal, setShowPostDemandModal] = useState(false);

  // Form State for Pledging Supply
  const [pledgeQty, setPledgeQty] = useState<number>(5);
  const [producerName, setProducerName] = useState<string>('Rameshwar Kumar');
  const [producerContact, setProducerContact] = useState<string>('9876543210');
  const [producerVillage, setProducerVillage] = useState<string>(
    activeLocation?.panchayat || 'Janori Village'
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

  // Sync village if activeLocation changes
  useEffect(() => {
    if (activeLocation?.panchayat) {
      setProducerVillage(activeLocation.panchayat);
    }
  }, [activeLocation]);

  const CATEGORIES = ['All', 'Food Processing', 'Dairy', 'Agriculture', 'Textiles', 'Poultry'];

  const filteredOrders = selectedCategory === 'All'
    ? ordersList
    : ordersList.filter(o => o.category.toLowerCase().includes(selectedCategory.toLowerCase()));

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
      buyerName: newBuyerName || 'State Agro Processing Cluster',
      buyerType: 'Food Processor',
      product: newProduct || 'Agri Commodity',
      category: 'Food Processing',
      qualityGrade: 'Grade A (Export / Premium)',
      requiredQuantityTonnes: Number(newQty) || 50,
      committedQuantityTonnes: 0,
      offeredPricePerUnit: Number(newPrice) || 20000,
      unit: 'Tonne',
      deliveryDate: '20 December 2026',
      location: newLocation || 'Regional Mandi Hub',
      district: activeLocation?.district || 'Central',
      state: activeLocation?.state || 'Maharashtra',
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

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 dark:bg-amber-950 dark:text-amber-400 px-3 py-1 rounded-full">
            PS 26033 Integration: Demand-First Marketplace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            Institutional Demand & Pre-Bulk Buyer Marketplace
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-1">
            Lock in guaranteed purchase contracts from verified food processors, state agencies, and corporate retail aggregators before initiating production.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToFeasibility && (
            <button
              onClick={onNavigateToFeasibility}
              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
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

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 items-center">
        <Filter className="w-4 h-4 text-slate-400 mr-1" />
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map(order => {
          const progressPercent = Math.min(100, Math.round((order.committedQuantityTonnes / order.requiredQuantityTonnes) * 100));
          const remainingTonnes = Math.max(0, order.requiredQuantityTonnes - order.committedQuantityTonnes);

          return (
            <div
              key={order.id}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header with verified badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                      {order.category}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {order.product}
                    </h3>
                  </div>

                  {order.verifiedBuyerBadge && (
                    <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full shrink-0">
                      <ShieldCheck className="w-3 h-3 text-amber-600" />
                      <span>Verified Buyer</span>
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-500 mb-3 font-semibold">
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
                      {order.location}
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
                <span>{remainingTonnes <= 0 ? 'Order 100% Fulfilled' : 'Commit / Pledge Supply Capacity'}</span>
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
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
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
                  Buyer notification sent. The off-take agreement has been recorded under your Village Enterprise dossier.
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
                    Offered: ₹{activePledgeOrder.offeredPricePerUnit.toLocaleString('en-IN')} / {activePledgeOrder.unit}
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
                      className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Contact Mobile (WhatsApp / Aadhaar Linked)
                    </label>
                    <input
                      type="text"
                      value={producerContact}
                      onChange={(e) => setProducerContact(e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Production Village & Block
                    </label>
                    <input
                      type="text"
                      value={producerVillage}
                      onChange={(e) => setProducerVillage(e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-xs text-emerald-900 dark:text-emerald-300 font-semibold">
                    Total Estimated Contract Value: <strong className="font-mono text-emerald-700 dark:text-emerald-400">₹{(pledgeQty * activePledgeOrder.offeredPricePerUnit).toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActivePledgeOrder(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Lock Contract</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* POST NEW DEMAND MODAL */}
      {showPostDemandModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setShowPostDemandModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handlePostDemandSubmit} className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                  Institutional Off-taker Registration
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Post Institutional Pre-Bulk Demand
                </h3>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Buyer / Enterprise Name
                  </label>
                  <input
                    type="text"
                    value={newBuyerName}
                    onChange={(e) => setNewBuyerName(e.target.value)}
                    placeholder="e.g. Sahyadri Farmers Producer Co."
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Commodity / Product Required
                  </label>
                  <input
                    type="text"
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                    placeholder="e.g. Cold-Pressed Mustard Oil"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
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
                      className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
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
                      className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Procurement Mandi / Hub Location
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Nashik APMC Mandi, Maharashtra"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostDemandModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md"
                >
                  Publish Pre-Bulk Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
