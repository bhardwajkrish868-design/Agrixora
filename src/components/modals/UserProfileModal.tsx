import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  User, 
  MapPin, 
  ShieldCheck, 
  LogOut, 
  FileCheck2, 
  CheckCircle2,
  Landmark,
  Sparkles,
  Edit3,
  Camera,
  Upload,
  RotateCcw,
  Save,
  Building2,
  IndianRupee,
  Check
} from 'lucide-react';
import type { LocationCatchment } from '../../types';
import type { RegisteredUser } from '../../services/authService';
import { updateUserProfile, getRegisteredUsers, setActiveSessionUser } from '../../services/authService';
import { STATES_DATA } from '../../data/regionsData';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: RegisteredUser | { name: string; role: string; location: string; id?: string; state?: string; district?: string; avatar?: string; marginCapital?: number; phone?: string; enterpriseName?: string; village?: string } | null;
  selectedLocation?: LocationCatchment;
  onLogout: () => void;
  onSwitchAccount?: () => void;
  onUpdateUser?: (updatedUser: RegisteredUser) => void;
}

const AVATAR_PRESETS = [
  { id: 'farmer', emoji: '🌾', label: 'Farmer' },
  { id: 'woman_entrepreneur', emoji: '👩‍🌾', label: 'Agritech' },
  { id: 'fpo_leader', emoji: '🏢', label: 'FPO Leader' },
  { id: 'processor', emoji: '🏭', label: 'Processor' },
  { id: 'bank_officer', emoji: '🏦', label: 'Banker' },
  { id: 'merchant', emoji: '🧑‍💼', label: 'Merchant' },
  { id: 'mechanic', emoji: '🚜', label: 'Machinery' },
  { id: 'organic', emoji: '🌿', label: 'Organic' },
  { id: 'buyer', emoji: '🏬', label: 'Corporate' },
  { id: 'auditor', emoji: '🪙', label: 'Auditor' }
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  selectedLocation,
  onLogout,
  onUpdateUser
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSwitchingMode, setIsSwitchingMode] = useState(false);
  const [allRegisteredUsers, setAllRegisteredUsers] = useState<RegisteredUser[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load all registered users when switching mode is activated
  useEffect(() => {
    if (isOpen) {
      setAllRegisteredUsers(getRegisteredUsers());
    }
  }, [isOpen]);

  // Form State for editing
  const [formData, setFormData] = useState({
    name: '',
    enterpriseName: '',
    phone: '',
    state: '',
    district: '',
    village: '',
    marginCapital: 50000,
    avatar: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize form data when user changes or modal opens
  useEffect(() => {
    if (user) {
      let stateName = user.state || '';
      let districtName = user.district || '';

      if (!stateName && user.location && user.location.includes(',')) {
        const parts = user.location.split(',').map(s => s.trim());
        districtName = parts[0] || '';
        stateName = parts[1] || '';
      }

      setFormData({
        name: user.name || '',
        enterpriseName: user.enterpriseName || '',
        phone: user.phone || '9876543210',
        state: stateName || 'Maharashtra',
        district: districtName || 'Nashik',
        village: user.village || (selectedLocation?.village || 'Local Cluster'),
        marginCapital: user.marginCapital || 50000,
        avatar: user.avatar || ''
      });
      setIsEditing(false);
      setSaveSuccess(false);
    }
  }, [user, isOpen, selectedLocation]);

  if (!isOpen || !user) return null;

  // Available districts for chosen state
  const currentStateObj = STATES_DATA.find(s => s.state.toLowerCase() === formData.state.toLowerCase()) || STATES_DATA[0];
  const availableDistricts = currentStateObj ? currentStateObj.districts.map(d => d.district) : [];

  // Handle Image File Upload & Canvas Compression
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verify file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 256;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setFormData(prev => ({ ...prev, avatar: compressedDataUrl }));
        } else {
          setFormData(prev => ({ ...prev, avatar: event.target?.result as string }));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Handle Save Profile
  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Please enter a valid full name.');
      return;
    }

    setIsSaving(true);
    const userId = user.id || 'usr_current';
    
    const result = updateUserProfile(userId, {
      name: formData.name.trim(),
      enterpriseName: formData.enterpriseName.trim(),
      state: formData.state,
      district: formData.district,
      village: formData.village,
      marginCapital: Number(formData.marginCapital) || 50000,
      avatar: formData.avatar,
      location: `${formData.district}, ${formData.state}`
    });

    if (result.success && result.user) {
      if (onUpdateUser) {
        onUpdateUser(result.user);
      }
      setSaveSuccess(true);
      setTimeout(() => {
        setIsSaving(false);
        setIsEditing(false);
        setSaveSuccess(false);
      }, 600);
    } else {
      setIsSaving(false);
      alert(result.message || 'Failed to update profile.');
    }
  };

  // Render Avatar Helper
  const renderAvatarCircle = (avatarVal?: string, size = 'w-16 h-16') => {
    if (avatarVal && (avatarVal.startsWith('data:') || avatarVal.startsWith('http'))) {
      return (
        <img 
          src={avatarVal} 
          alt="Avatar" 
          className={`${size} rounded-2xl object-cover shadow-lg border-2 border-emerald-400/50`} 
        />
      );
    }
    if (avatarVal && avatarVal.length <= 4) {
      return (
        <div className={`${size} rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 border-2 border-emerald-400/40 flex items-center justify-center text-3xl shadow-lg shadow-emerald-950/60 select-none`}>
          {avatarVal}
        </div>
      );
    }
    return (
      <div className={`${size} rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-950/60`}>
        <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-2xl">
          👤
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-100 transition-all">
        
        {/* Header with Visual Banner */}
        <div className="relative bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 p-5 sm:p-6 flex items-start justify-between shrink-0">
          <div className="flex items-center gap-3">
            {renderAvatarCircle(isEditing ? formData.avatar : user.avatar, 'w-14 h-14 sm:w-16 sm:h-16')}
            
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40 w-fit mb-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>KYC Verified Profile</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
                {isEditing ? (formData.name || 'Edit Profile') : user.name}
              </h2>
              <div className="text-xs text-slate-300">
                {user.role}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 rounded-xl text-xs font-bold text-emerald-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
                title="Edit Profile"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit Profile</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white bg-black/40 hover:bg-black/60 p-2 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          
          {isEditing ? (
            /* ================= EDIT MODE ================= */
            <div className="space-y-4">
              
              {/* Profile Picture Upload & Presets */}
              <div className="bg-slate-950/80 border border-emerald-500/20 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Custom Profile Picture / Avatar</span>
                  </label>
                  {formData.avatar && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, avatar: '' }))}
                      className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Photo</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Photo Preview with Upload Button */}
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    {renderAvatarCircle(formData.avatar, 'w-20 h-20')}
                    <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold">
                      <Camera className="w-5 h-5 mb-0.5" />
                      <span>Upload</span>
                    </div>
                  </div>

                  <div className="flex-1 w-full space-y-2 text-center sm:text-left">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageFileChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Custom Photo</span>
                    </button>
                    
                    <p className="text-[10px] text-slate-400">
                      Upload any image (JPG, PNG, WebP). It is auto-compressed & saved securely.
                    </p>
                  </div>
                </div>

                {/* Avatar Presets Selection */}
                <div className="pt-2 border-t border-slate-800">
                  <div className="text-[11px] text-slate-400 mb-2 font-medium">Or choose a quick avatar preset:</div>
                  <div className="grid grid-cols-5 gap-2">
                    {AVATAR_PRESETS.map(preset => {
                      const isSelected = formData.avatar === preset.emoji;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, avatar: preset.emoji }))}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                            isSelected 
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm' 
                              : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <span className="text-xl">{preset.emoji}</span>
                          <span className="text-[9px] truncate max-w-full">{preset.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Name & Enterprise Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1 mb-1">
                    <User className="w-3 h-3 text-emerald-400" />
                    <span>Full Name / Representative *</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1 mb-1">
                    <Building2 className="w-3 h-3 text-teal-400" />
                    <span>Enterprise / Farm Name</span>
                  </label>
                  <input
                    type="text"
                    value={formData.enterpriseName}
                    onChange={(e) => setFormData(prev => ({ ...prev, enterpriseName: e.target.value }))}
                    placeholder="e.g. Kisan Agro Processing"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* State and District Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1 mb-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>Operating State *</span>
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => {
                      const newState = e.target.value;
                      const stateObj = STATES_DATA.find(s => s.state === newState);
                      const defaultDistrict = stateObj?.districts[0]?.district || '';
                      setFormData(prev => ({
                        ...prev,
                        state: newState,
                        district: defaultDistrict
                      }));
                    }}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    {STATES_DATA.map(s => (
                      <option key={s.state} value={s.state} className="bg-slate-900 text-white">
                        {s.state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1 mb-1">
                    <MapPin className="w-3 h-3 text-teal-400" />
                    <span>District / Cluster *</span>
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    {availableDistricts.map(d => (
                      <option key={d} value={d} className="bg-slate-900 text-white">
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Village and Margin Capital */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1 mb-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>Village / Gram Panchayat</span>
                  </label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) => setFormData(prev => ({ ...prev, village: e.target.value }))}
                    placeholder="e.g. Dindori, Niphad"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1 mb-1">
                    <IndianRupee className="w-3 h-3 text-amber-400" />
                    <span>Available Margin Capital (₹)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.marginCapital}
                    onChange={(e) => setFormData(prev => ({ ...prev, marginCapital: Number(e.target.value) }))}
                    placeholder="50000"
                    step="10000"
                    min="10000"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Save / Cancel Controls */}
              <div className="pt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-200" />
                      <span>Saved!</span>
                    </>
                  ) : isSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          ) : isSwitchingMode ? (
            /* ================= SWITCH ACCOUNT / ROLE MODE ================= */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Switch Role Profile</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      {allRegisteredUsers.length} Available Profiles
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select any profile to switch your active workspace instantly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSwitchingMode(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  ← Back
                </button>
              </div>

              {/* Profiles List */}
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {allRegisteredUsers.map(acc => {
                  const isCurrent = acc.id === user.id || (acc.phone === user.phone && acc.role === user.role);
                  return (
                    <div
                      key={acc.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isCurrent 
                          ? 'bg-emerald-950/40 border-emerald-500/40 ring-1 ring-emerald-500/30' 
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-lg shrink-0">
                          {acc.avatar || '🌾'}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{acc.name}</span>
                            {isCurrent && (
                              <span className="text-[9px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.2 rounded">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-emerald-400 font-medium">
                            {acc.roleLabel || acc.role}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {acc.location} • +91 {acc.phone}
                          </div>
                        </div>
                      </div>

                      {isCurrent ? (
                        <span className="text-xs font-bold text-emerald-400 px-3 py-1.5">
                          Current
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSessionUser(acc);
                            if (onUpdateUser) onUpdateUser(acc);
                            onClose();
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                        >
                          Switch
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Sign in with different mobile link */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Sign In with a Different Mobile Number</span>
                </button>
              </div>
            </div>
          ) : (
            /* ================= VIEW MODE ================= */
            <>
              {/* Registered Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Location Card */}
                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Registered Location</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    {user.location || `${formData.district}, ${formData.state}`}
                  </div>
                  {formData.village && (
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Village: {formData.village}
                    </div>
                  )}
                  {selectedLocation && (
                    <div className="text-[10px] text-emerald-400 mt-1">
                      Operating Area: {selectedLocation.catchmentRadiusKm} km radius
                    </div>
                  )}
                </div>

                {/* Scheme Eligibility */}
                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                    <Landmark className="w-3.5 h-3.5 text-teal-400" />
                    <span>Scheme Eligibility</span>
                  </div>
                  <div className="text-sm font-bold text-teal-300">
                    10% Margin → 90% Loan
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Margin: ₹{(formData.marginCapital || 50000).toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Verification Status */}
                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                    <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>DPR Bank Dossier</span>
                  </div>
                  <div className="text-sm font-bold text-amber-300">
                    PMEGP / Mudra Ready
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Instant PDF Export Enabled
                  </div>
                </div>

                {/* Portal Access Level */}
                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>Account Tier</span>
                  </div>
                  <div className="text-sm font-bold text-blue-300">
                    Full Enterprise Access
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    AI Feasibility & Buyer Orders
                  </div>
                </div>

              </div>

              {/* Security & Authentication Info */}
              <div className="bg-emerald-950/40 border border-emerald-500/20 p-3.5 rounded-2xl flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="text-xs text-slate-300">
                  <span className="font-bold text-white">Active Session: </span>
                  Your profile and custom credentials are synchronized with Turso Cloud SQLite and National Rural Enterprise standards.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile Details</span>
                </button>

                <button
                  onClick={() => {
                    setIsSwitchingMode(true);
                  }}
                  className="w-full sm:flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>Switch Account</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                  className="w-full sm:w-auto py-2.5 px-4 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 rounded-xl text-xs font-bold text-rose-300 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-3 text-center border-t border-slate-800 text-[11px] text-slate-400 shrink-0">
          AgriXora ID • Ministry of Rural Development & MSME Linked
        </div>

      </div>
    </div>
  );
};
