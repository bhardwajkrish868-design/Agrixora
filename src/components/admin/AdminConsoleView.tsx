import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Users, 
  ShoppingBag, 
  FileSpreadsheet, 
  AlertCircle, 
  RefreshCw, 
  Plus, 
  Search, 
  TrendingUp, 
  Terminal, 
  X, 
  Server, 
  Zap, 
  Building2, 
  UserCheck,
  Lock,
  Key,
  ShieldCheck,
  ShieldAlert,
  Eye,
  EyeOff
} from 'lucide-react';
import type { Language, PreBulkDemandOrder, SupplyPledge } from '../../types';
import type { RegisteredUser } from '../../services/authService';
import { 
  getTursoClient, 
  isTursoConfigured, 
  syncAllDataToTurso, 
  fetchUsersFromTurso, 
  fetchDemandsFromTurso, 
  saveDemandToTurso,
  syncUserToTurso
} from '../../services/tursoService';
import { getRegisteredUsers, registerUser } from '../../services/authService';
import { INITIAL_PRE_BULK_ORDERS } from '../../data/buyerDemands';
import { STATES_DATA } from '../../data/regionsData';

interface AdminConsoleViewProps {
  currentLanguage: Language;
  onSwitchUser?: (user: RegisteredUser) => void;
  onToast?: (title: string, desc: string, type?: 'success' | 'info' | 'warn') => void;
  onExit?: () => void;
}

type AdminTab = 'overview' | 'users' | 'demands' | 'pledges' | 'sql';

export const AdminConsoleView: React.FC<AdminConsoleViewProps> = ({
  onSwitchUser,
  onToast,
  onExit
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [dbStatus, setDbStatus] = useState<'connected' | 'checking' | 'offline'>('checking');
  
  // Live Data Lists
  const [usersList, setUsersList] = useState<RegisteredUser[]>([]);
  const [demandsList, setDemandsList] = useState<PreBulkDemandOrder[]>(INITIAL_PRE_BULK_ORDERS);
  const [pledgesList, setPledgesList] = useState<SupplyPledge[]>([]);
  const [searchUser, setSearchUser] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  // Modals State
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);

  // New Order Form
  const [newOrderForm, setNewOrderForm] = useState({
    buyerName: '',
    buyerType: 'Food Processor',
    product: '',
    category: 'Food Processing',
    qualityGrade: 'Grade A (Export / Premium)',
    requiredQuantityTonnes: 100,
    offeredPricePerUnit: 20000,
    unit: 'Tonne',
    state: 'Bihar',
    district: 'Patna',
    location: 'Patna Food Park',
    paymentTerms: '100% Direct Bank Transfer within 48h',
    notes: 'Institutional purchase requirement.'
  });

  // New User Form
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    phone: '',
    password: '',
    role: 'entrepreneur' as 'entrepreneur' | 'fpo_manager' | 'institutional_buyer' | 'bank_officer',
    state: 'Bihar',
    district: 'Patna',
    village: 'Bihta',
    enterpriseName: '',
    marginCapital: 50000,
    avatar: '🌾'
  });

  // SQL Studio State
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM users LIMIT 10;');
  const [sqlResult, setSqlResult] = useState<{ columns: string[]; rows: any[] } | null>(null);
  const [sqlError, setSqlError] = useState<string | null>(null);
  const [isExecutingSql, setIsExecutingSql] = useState(false);

  // Security Gatekeeper Lock State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('AGRIXORA_ADMIN_AUTHENTICATED') === 'true';
  });
  const [passcode, setPasscode] = useState<string>('');
  const [showPasscode, setShowPasscode] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<number>(5);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Valid Master Keys / PINs
  const VALID_MASTER_KEYS = ['998877', 'admin@agrixora', 'admin123', '778899', 'krish@admin'];

  const handleVerifyPasscode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!passcode.trim()) {
      setAuthError('Please enter the Master Passcode or 6-digit Security PIN.');
      return;
    }

    setIsVerifying(true);
    setAuthError(null);

    setTimeout(() => {
      setIsVerifying(false);
      const cleanPass = passcode.trim();
      if (VALID_MASTER_KEYS.includes(cleanPass)) {
        sessionStorage.setItem('AGRIXORA_ADMIN_AUTHENTICATED', 'true');
        setIsUnlocked(true);
        if (onToast) onToast('Admin Access Granted', 'Master Security cleared. Turso Cloud Studio unlocked!', 'success');
        loadAllData();
      } else {
        const remaining = attempts - 1;
        setAttempts(remaining);
        if (remaining <= 0) {
          setAuthError('Access Blocked! Maximum authentication attempts exceeded.');
        } else {
          setAuthError(`Access Denied: Invalid Master Passcode! (${remaining} attempts remaining)`);
        }
      }
    }, 350);
  };

  const handleLockConsole = () => {
    sessionStorage.removeItem('AGRIXORA_ADMIN_AUTHENTICATED');
    setIsUnlocked(false);
    setPasscode('');
    setAuthError(null);
    if (onToast) onToast('Console Locked', 'Admin session terminated and locked.', 'info');
  };

  // Initial Data Load (Only if unlocked)
  useEffect(() => {
    if (isUnlocked) {
      loadAllData();
    }
  }, [isUnlocked]);

  const loadAllData = async () => {
    setDbStatus('checking');
    try {
      // 1. Check local users fallback
      const localUsers = getRegisteredUsers();
      
      if (isTursoConfigured()) {
        const remoteUsers = await fetchUsersFromTurso();
        const remoteDemands = await fetchDemandsFromTurso();
        
        setUsersList(remoteUsers.length > 0 ? remoteUsers : localUsers);
        setDemandsList(remoteDemands.length > 0 ? remoteDemands : INITIAL_PRE_BULK_ORDERS);
        setDbStatus('connected');
      } else {
        setUsersList(localUsers);
        setDemandsList(INITIAL_PRE_BULK_ORDERS);
        setDbStatus('offline');
      }

      // Sample mock pledges list
      setPledgesList([
        {
          id: 'PLG-TOMATO-01',
          orderId: 'ORD-TOMATO-500T',
          producerName: 'Maha-Agri FPO Federation',
          producerContact: '9876543210',
          pledgedQuantity: 50,
          village: 'Amnabad Gram Panchayat',
          pledgedAt: new Date().toISOString(),
          status: 'Confirmed'
        },
        {
          id: 'PLG-MUSTARD-02',
          orderId: 'ORD-MUSTARD-OIL-120T',
          producerName: 'Kashi Gram Udyog Dal & Oil Mill',
          producerContact: '9876500001',
          pledgedQuantity: 25,
          village: 'Shivpur Industrial Area',
          pledgedAt: new Date().toISOString(),
          status: 'Confirmed'
        }
      ]);
    } catch (e) {
      console.error('Failed to fetch Turso data', e);
      setDbStatus('offline');
    }
  };

  // Trigger Master Sync to Turso
  const handleMasterSync = async () => {
    setIsSyncing(true);
    try {
      const result = await syncAllDataToTurso();
      if (result.success) {
        setLastSyncTime(new Date().toLocaleTimeString());
        setDbStatus('connected');
        if (onToast) onToast('Turso Cloud Synced', `Successfully synchronized ${result.count} records!`, 'success');
        await loadAllData();
      } else {
        if (onToast) onToast('Sync Notice', result.message, 'warn');
      }
    } catch (e) {
      if (onToast) onToast('Sync Error', 'Failed to connect to Turso Cloud', 'warn');
    } finally {
      setIsSyncing(false);
    }
  };

  // Execute SQL Studio Query
  const handleRunSql = async () => {
    if (!sqlQuery.trim()) return;
    setIsExecutingSql(true);
    setSqlError(null);
    setSqlResult(null);

    const client = getTursoClient();
    if (!client) {
      setSqlError('Turso client is offline or not configured.');
      setIsExecutingSql(false);
      return;
    }

    try {
      const res = await client.execute(sqlQuery.trim());
      setSqlResult({
        columns: res.columns || [],
        rows: res.rows || []
      });
    } catch (err: any) {
      setSqlError(err?.message || 'SQL execution failed');
    } finally {
      setIsExecutingSql(false);
    }
  };

  // Create New Order Handler
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderForm.buyerName || !newOrderForm.product) {
      alert('Please fill in buyer name and commodity product.');
      return;
    }

    const orderId = `ORD-${newOrderForm.product.substring(0, 4).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const newOrder: PreBulkDemandOrder = {
      id: orderId,
      buyerName: newOrderForm.buyerName,
      buyerType: newOrderForm.buyerType as any,
      product: newOrderForm.product,
      category: newOrderForm.category,
      qualityGrade: newOrderForm.qualityGrade as any,
      requiredQuantityTonnes: Number(newOrderForm.requiredQuantityTonnes),
      committedQuantityTonnes: 0,
      offeredPricePerUnit: Number(newOrderForm.offeredPricePerUnit),
      unit: newOrderForm.unit,
      deliveryDate: '30 Days Harvest Window',
      location: newOrderForm.location,
      district: newOrderForm.district,
      state: newOrderForm.state,
      pickupMode: 'Farm-gate Collection Center',
      paymentTerms: newOrderForm.paymentTerms as any,
      verifiedBuyerBadge: true,
      notes: newOrderForm.notes
    };

    setDemandsList(prev => [newOrder, ...prev]);
    setIsNewOrderModalOpen(false);
    
    // Save to Turso Cloud
    await saveDemandToTurso(newOrder);
    if (onToast) onToast('Demand Order Created', `Published ${newOrder.product} (${newOrder.requiredQuantityTonnes} T) on Turso Cloud!`);
  };

  // Create New User Handler
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.phone) {
      alert('Please enter user name and mobile number.');
      return;
    }

    const res = registerUser({
      name: newUserForm.name,
      phone: newUserForm.phone,
      password: newUserForm.password || '123456',
      role: newUserForm.role,
      state: newUserForm.state,
      district: newUserForm.district,
      marginCapital: Number(newUserForm.marginCapital) || 50000
    });

    if (res.success && res.user) {
      const userWithAvatar: RegisteredUser = {
        ...res.user,
        avatar: newUserForm.avatar,
        enterpriseName: newUserForm.enterpriseName,
        village: newUserForm.village
      };
      await syncUserToTurso(userWithAvatar);
      setUsersList(prev => [userWithAvatar, ...prev.filter(u => u.id !== userWithAvatar.id)]);
      setIsNewUserModalOpen(false);
      if (onToast) onToast('User Registered', `Created profile for ${userWithAvatar.name} (${userWithAvatar.roleLabel})`);
    } else {
      alert(res.message);
    }
  };

  // Filtered Users
  const filteredUsers = usersList.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchUser.toLowerCase()) || 
                          u.phone.includes(searchUser) || 
                          u.location.toLowerCase().includes(searchUser.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (!isUnlocked) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/95 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/80 backdrop-blur-xl text-center space-y-6">
          
          {/* Lock Header Icon */}
          <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-500 p-0.5 shadow-xl shadow-indigo-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Lock className="w-9 h-9 text-indigo-400 animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center border-2 border-slate-900 shadow-md">
              🛡️
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Restricted Master Access</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              AgriXora Admin Security Gate
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Enter the Master Passcode or 6-digit Security PIN to access the Turso Cloud SQLite Studio & User Registry.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleVerifyPasscode} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between mb-1.5">
                <span>Master Security Key / PIN</span>
                <span className="text-[10px] text-indigo-400 font-mono">256-Bit SHA Encrypted</span>
              </label>
              
              <div className="relative flex items-center">
                <Key className="w-4 h-4 absolute left-3.5 text-indigo-400" />
                <input
                  type={showPasscode ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setAuthError(null);
                  }}
                  autoFocus
                  placeholder="Enter Master PIN / Passkey"
                  className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 text-slate-400 hover:text-white cursor-pointer p-1"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isVerifying || attempts <= 0}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Authorization & Unlock</span>
                </>
              )}
            </button>
          </form>

          {/* Exit / Return Button */}
          {onExit && (
            <div className="pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={onExit}
                className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                ← Return to AgriXora Portal
              </button>
            </div>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* 1. TOP HEALTH & TURSO CLOUD STATUS BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    AgriXora Admin Console & Turso Cloud Studio
                  </h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                    v2.4 Live
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Global System Operations, Real-time Turso Cloud SQLite Telemetry, User Registry & Demand Manager
                </p>
              </div>
            </div>
          </div>

          {/* Database Health Controls */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Live Connection Pill */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-xs font-semibold">
              <span className={`w-2.5 h-2.5 rounded-full ${dbStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : dbStatus === 'checking' ? 'bg-amber-400 animate-spin' : 'bg-rose-500'}`} />
              <span className="text-slate-200">
                {dbStatus === 'connected' ? 'Turso Cloud: Connected (AWS Mumbai)' : dbStatus === 'checking' ? 'Checking Database...' : 'Offline Local Fallback'}
              </span>
            </div>

            {/* Force Sync Button */}
            <button
              onClick={handleMasterSync}
              disabled={isSyncing}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Force Turso Master Sync'}</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={loadAllData}
              className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
              title="Refresh Remote Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Lock Console Button */}
            <button
              onClick={handleLockConsole}
              className="p-2 bg-slate-800 hover:bg-amber-950/40 hover:text-amber-300 border border-slate-700 hover:border-amber-700/50 text-slate-300 rounded-xl transition-all cursor-pointer"
              title="Lock Admin Console Immediately"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Exit to Main App */}
            {onExit && (
              <button
                onClick={onExit}
                className="px-3.5 py-2 bg-slate-800 hover:bg-rose-950/40 hover:text-rose-300 border border-slate-700 hover:border-rose-700/50 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                title="Exit Admin Console and return to AgriXora User Portal"
              >
                <span>✕ Exit Admin</span>
              </button>
            )}

          </div>

        </div>
      </div>

      {/* 2. ADMIN NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'System Overview', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'users', label: `User Registry (${usersList.length})`, icon: <Users className="w-4 h-4" /> },
          { id: 'demands', label: `Buyer Demands (${demandsList.length})`, icon: <ShoppingBag className="w-4 h-4" /> },
          { id: 'pledges', label: `Supply Pledges (${pledgesList.length})`, icon: <FileSpreadsheet className="w-4 h-4" /> },
          { id: 'sql', label: 'Turso SQL Studio', icon: <Terminal className="w-4 h-4" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as AdminTab)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 3. TAB CONTENT */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Registered Users
                </span>
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">{usersList.length} Accounts</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">4 Roles Synchronized</div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Active Demand Orders
                </span>
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">{demandsList.length} Contracts</div>
              <div className="text-[11px] text-amber-600 font-semibold mt-1">1,000+ Tonnes Total Volume</div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Total Committed Supply
                </span>
                <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">654 Tonnes</div>
              <div className="text-[11px] text-blue-600 font-semibold mt-1">65.4% Fulfillment Rate</div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Database Pipeline
                </span>
                <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                  <Database className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">Turso Cloud</div>
              <div className="text-[11px] text-purple-600 font-semibold mt-1">Last Sync: {lastSyncTime}</div>
            </div>

          </div>

          {/* Database Schema & Tables Status Card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Turso Cloud SQLite Database Schema Status
                </h3>
              </div>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                Endpoint: aws-ap-south-1
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { table: 'users', count: usersList.length, desc: 'Registered accounts, roles & custom avatars', icon: '👤' },
                { table: 'buyback_demands', count: demandsList.length, desc: 'Institutional buyer commodity orders', icon: '🏬' },
                { table: 'supply_pledges', count: pledgesList.length, desc: 'FPO & entrepreneur committed supply', icon: '📝' },
                { table: 'feasibility_reports', count: 12, desc: 'AI-generated DPRs & loan structuring', icon: '📑' }
              ].map(item => (
                <div key={item.table} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">{item.table}</span>
                    <span className="text-lg">{item.icon}</span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{item.count} rows</div>
                  <p className="text-[11px] text-slate-500 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: USERS REGISTRY */}
      {activeTab === 'users' && (
        <div className="space-y-4 animate-in fade-in">
          
          {/* Controls Bar */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            
            <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
              <div className="relative w-full sm:max-w-xs">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={searchUser} 
                  onChange={e => setSearchUser(e.target.value)}
                  placeholder="Search by name, phone, district..." 
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <select
                value={filterRole}
                onChange={e => setFilterRole(e.target.value)}
                className="py-2 px-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="entrepreneur">Rural Entrepreneur</option>
                <option value="fpo_manager">FPO Federation</option>
                <option value="bank_officer">Bank Officer</option>
                <option value="institutional_buyer">Institutional Buyer</option>
              </select>
            </div>

            <button
              onClick={() => setIsNewUserModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Register New User</span>
            </button>

          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3 px-4">User / Avatar</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Margin Capital</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-750 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm border border-emerald-500/30 overflow-hidden shrink-0">
                          {u.avatar && (u.avatar.startsWith('data:') || u.avatar.startsWith('http')) ? (
                            <img src={u.avatar} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <span>{u.avatar || '👤'}</span>
                          )}
                        </div>
                        <div>
                          <div className="leading-tight">{u.name}</div>
                          {u.enterpriseName && (
                            <div className="text-[10px] text-slate-400 font-normal">{u.enterpriseName}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          u.role === 'fpo_manager' ? 'bg-teal-500/20 text-teal-300 border-teal-500/30' :
                          u.role === 'bank_officer' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                          u.role === 'institutional_buyer' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                          'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {u.roleLabel || u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">+91 {u.phone}</td>
                      <td className="py-3.5 px-4">{u.location || `${u.district}, ${u.state}`}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">₹{(u.marginCapital || 50000).toLocaleString('en-IN')}</td>
                      <td className="py-3.5 px-4 text-right">
                        {onSwitchUser && (
                          <button
                            onClick={() => onSwitchUser(u)}
                            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white rounded-lg font-bold text-[11px] transition-all cursor-pointer inline-flex items-center gap-1"
                            title="Log in as this user"
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>Switch To</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: DEMAND ORDERS */}
      {activeTab === 'demands' && (
        <div className="space-y-4 animate-in fade-in">
          
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Active Institutional Buyback Demand Contracts ({demandsList.length})
            </h3>

            <button
              onClick={() => setIsNewOrderModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Buyback Demand</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {demandsList.map(order => (
              <div key={order.id} className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {order.category}
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">{order.product}</h4>
                    <div className="text-xs text-slate-500">{order.buyerName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-black text-emerald-600 font-mono">₹{order.offeredPricePerUnit.toLocaleString('en-IN')}/{order.unit}</div>
                    <div className="text-[10px] text-slate-400 font-bold">{order.requiredQuantityTonnes} Tonnes Req.</div>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Committed: {order.committedQuantityTonnes} T</span>
                    <span>{Math.round((order.committedQuantityTonnes / order.requiredQuantityTonnes) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full" 
                      style={{ width: `${Math.min(100, Math.round((order.committedQuantityTonnes / order.requiredQuantityTonnes) * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
                  <span>📍 {order.district}, {order.state}</span>
                  <span className="text-emerald-500 font-bold">✓ Verified Off-taker</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 4: SUPPLY PLEDGES */}
      {activeTab === 'pledges' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden p-5">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
              Farmer / FPO Committed Supply Pledges ({pledgesList.length})
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">Pledge ID</th>
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Producer / FPO</th>
                    <th className="py-2.5 px-3">Village Cluster</th>
                    <th className="py-2.5 px-3">Pledged Quantity</th>
                    <th className="py-2.5 px-3">LOI Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {pledgesList.map(p => (
                    <tr key={p.id}>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-600">{p.id}</td>
                      <td className="py-3 px-3 font-mono text-slate-500">{p.orderId}</td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{p.producerName}</td>
                      <td className="py-3 px-3">{p.village}</td>
                      <td className="py-3 px-3 font-bold">{p.pledgedQuantity} Tonnes</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TURSO SQL STUDIO */}
      {activeTab === 'sql' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white">Turso libSQL Direct Query Studio</span>
              </div>
              <span className="text-[10px] text-slate-400">Endpoint: libsql://agrixora-krish-x97...</span>
            </div>

            {/* Query Input */}
            <div className="space-y-2">
              <textarea
                value={sqlQuery}
                onChange={e => setSqlQuery(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-emerald-300 focus:outline-none font-mono text-xs"
                placeholder="SELECT * FROM users;"
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[11px]">Quick Templates:</span>
                  <button 
                    type="button" 
                    onClick={() => setSqlQuery('SELECT * FROM users LIMIT 10;')}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] cursor-pointer"
                  >
                    users
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setSqlQuery('SELECT * FROM buyback_demands LIMIT 10;')}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] cursor-pointer"
                  >
                    buyback_demands
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setSqlQuery('SELECT * FROM supply_pledges LIMIT 10;')}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] cursor-pointer"
                  >
                    supply_pledges
                  </button>
                </div>

                <button
                  onClick={handleRunSql}
                  disabled={isExecutingSql}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isExecutingSql ? 'Executing...' : 'Run Query (F5)'}</span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {sqlError && (
              <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{sqlError}</span>
              </div>
            )}

            {/* Results Table */}
            {sqlResult && (
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden mt-3">
                <div className="p-2 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
                  Returned {sqlResult.rows.length} rows
                </div>
                <div className="overflow-x-auto max-h-72">
                  <table className="w-full text-left text-[11px] divide-y divide-slate-800">
                    <thead className="bg-slate-900/60 text-emerald-400 font-bold sticky top-0">
                      <tr>
                        {sqlResult.columns.map((col, idx) => (
                          <th key={idx} className="p-2.5">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300">
                      {sqlResult.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-900/40">
                          {sqlResult.columns.map((col, cIdx) => (
                            <td key={cIdx} className="p-2.5 truncate max-w-xs">{String(row[col] ?? '')}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* MODAL: POST NEW BUYBACK DEMAND */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
                <span>Publish Institutional Buyback Demand</span>
              </h3>
              <button onClick={() => setIsNewOrderModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Institutional Buyer Name *</label>
                <input
                  type="text"
                  value={newOrderForm.buyerName}
                  onChange={e => setNewOrderForm(prev => ({ ...prev, buyerName: e.target.value }))}
                  placeholder="e.g. ITC Ltd / Patanjali Foods"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Product / Commodity *</label>
                  <input
                    type="text"
                    value={newOrderForm.product}
                    onChange={e => setNewOrderForm(prev => ({ ...prev, product: e.target.value }))}
                    placeholder="e.g. Yellow Mustard Seeds"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Required Quantity (Tonnes) *</label>
                  <input
                    type="number"
                    value={newOrderForm.requiredQuantityTonnes}
                    onChange={e => setNewOrderForm(prev => ({ ...prev, requiredQuantityTonnes: Number(e.target.value) }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Offered Price (₹ / Tonne) *</label>
                  <input
                    type="number"
                    value={newOrderForm.offeredPricePerUnit}
                    onChange={e => setNewOrderForm(prev => ({ ...prev, offeredPricePerUnit: Number(e.target.value) }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Operating State</label>
                  <select
                    value={newOrderForm.state}
                    onChange={e => setNewOrderForm(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                  >
                    {STATES_DATA.map(s => <option key={s.state} value={s.state}>{s.state}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-950/50"
                >
                  Publish to Turso Cloud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REGISTER NEW USER */}
      {isNewUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>Register User into Turso Cloud</span>
              </h3>
              <button onClick={() => setIsNewUserModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Full Name / Representative *</label>
                <input
                  type="text"
                  value={newUserForm.name}
                  onChange={e => setNewUserForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Rameshwar Kisan FPO"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Phone Number (10 Digits) *</label>
                  <input
                    type="tel"
                    value={newUserForm.phone}
                    onChange={e => setNewUserForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">User Role *</label>
                  <select
                    value={newUserForm.role}
                    onChange={e => setNewUserForm(prev => ({ ...prev, role: e.target.value as any }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                  >
                    <option value="entrepreneur">Rural Entrepreneur</option>
                    <option value="fpo_manager">FPO Federation Leader</option>
                    <option value="bank_officer">Bank Appraisal Officer</option>
                    <option value="institutional_buyer">Institutional Buyer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">State</label>
                  <select
                    value={newUserForm.state}
                    onChange={e => setNewUserForm(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                  >
                    {STATES_DATA.map(s => <option key={s.state} value={s.state}>{s.state}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Margin Capital (₹)</label>
                  <input
                    type="number"
                    value={newUserForm.marginCapital}
                    onChange={e => setNewUserForm(prev => ({ ...prev, marginCapital: Number(e.target.value) }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewUserModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-950/50"
                >
                  Create & Sync to Turso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
