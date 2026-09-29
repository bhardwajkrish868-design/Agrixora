import React from 'react';
import { 
  X, 
  User, 
  MapPin, 
  ShieldCheck, 
  LogOut, 
  FileCheck2, 
  CheckCircle2,
  Landmark,
  Sparkles
} from 'lucide-react';
import type { LocationCatchment } from '../../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name: string; role: string; location: string } | null;
  selectedLocation?: LocationCatchment;
  onLogout: () => void;
  onSwitchAccount: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  selectedLocation,
  onLogout,
  onSwitchAccount
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden text-slate-100 transition-all">
        
        {/* Header with Visual Banner */}
        <div className="relative h-32 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-950/60">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-2xl">
                👤
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40 w-fit mb-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>KYC Verified Profile</span>
              </div>
              <h2 className="text-lg font-extrabold text-white leading-tight">
                {user.name}
              </h2>
              <div className="text-xs text-slate-300">
                {user.role}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-black/40 hover:bg-black/60 p-2 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Registered Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Location Card */}
            <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Registered Location</span>
              </div>
              <div className="text-sm font-bold text-white">
                {user.location}
              </div>
              {selectedLocation && (
                <div className="text-[11px] text-emerald-400 mt-1">
                  Catchment: {selectedLocation.catchmentRadiusKm} km radius
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
                Micro (6.5%) & Term (8%) Active
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
              Your identity is grounded in the National Rural Enterprise registry. All project reports and margin calculations are synchronized with local APMC mandi benchmarks.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onSwitchAccount();
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
              className="w-full sm:flex-1 py-2.5 px-4 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 rounded-xl text-xs font-bold text-rose-300 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out (लॉग आउट)</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-3 text-center border-t border-slate-800 text-[11px] text-slate-400">
          AgriXora ID • Ministry of Rural Development & MSME Linked
        </div>

      </div>
    </div>
  );
};
