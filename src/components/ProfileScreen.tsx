import React, { useState } from 'react';
import { UserProfile, FitnessGoal, EquipmentAccess, ExperienceLevel } from '../types';
import {
  User,
  Settings,
  Target,
  Calendar,
  Clock,
  Dumbbell,
  Shield,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Eye,
  Layers,
  Check,
  Copy
} from 'lucide-react';
import { Logo } from './Logo';

interface ProfileScreenProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onRestartOnboarding: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userProfile,
  onUpdateProfile,
  onRestartOnboarding
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [showV2Roadmap, setShowV2Roadmap] = useState(false);
  const [showLogoGuide, setShowLogoGuide] = useState(false);
  const [previewSize, setPreviewSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>('lg');
  const [previewVariant, setPreviewVariant] = useState<'horizontal' | 'stacked' | 'icon'>('stacked');
  const [copiedSvg, setCopiedSvg] = useState(false);

  // Edit draft states
  const [draftName, setDraftName] = useState(userProfile.name);
  const [draftAge, setDraftAge] = useState(userProfile.age);
  const [draftGoal, setDraftGoal] = useState<FitnessGoal>(userProfile.goal);
  const [draftWeight, setDraftWeight] = useState(userProfile.weight);
  const [draftHeight, setDraftHeight] = useState(userProfile.height);
  const [draftExperience, setDraftExperience] = useState<ExperienceLevel>(userProfile.experience);
  const [draftEquipment, setDraftEquipment] = useState<EquipmentAccess>(userProfile.equipment);
  const [draftScheduleDays, setDraftScheduleDays] = useState(userProfile.scheduleDays);

  const saveProfileEdits = () => {
    onUpdateProfile({
      name: draftName.trim() || userProfile.name,
      age: draftAge || userProfile.age,
      goal: draftGoal,
      weight: draftWeight || userProfile.weight,
      height: draftHeight || userProfile.height,
      experience: draftExperience,
      equipment: draftEquipment,
      scheduleDays: draftScheduleDays
    });
    setShowEditModal(false);
  };

  const toggleWeightUnit = () => {
    const nextUnit = userProfile.weightUnit === 'kg' ? 'lb' : 'kg';
    const convertedWeight =
      nextUnit === 'lb'
        ? Math.round(userProfile.weight * 2.20462)
        : Math.round(userProfile.weight / 2.20462);

    onUpdateProfile({
      weightUnit: nextUnit,
      weight: convertedWeight
    });
  };

  const toggleHeightUnit = () => {
    const nextUnit = userProfile.heightUnit === 'cm' ? 'ft' : 'cm';
    onUpdateProfile({ heightUnit: nextUnit });
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 pb-24 text-[#F5F5F5] animate-fade-in space-y-4">
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#C7FF3D]">
          ACCOUNT & PREFERENCES
        </span>
        <h1 className="text-3xl font-black text-[#F5F5F5] tracking-tight">
          Your Profile
        </h1>
      </div>

      {/* User Card */}
      <div className="bg-gradient-to-br from-[#171717] to-[#121212] border border-[#262626] rounded-3xl p-5 shadow-xl flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[#1F1F1F] border-2 border-[#C7FF3D] flex items-center justify-center font-black text-2xl text-[#C7FF3D] shadow-md">
          {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'A'}
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-bold text-[#F5F5F5]">{userProfile.name || 'Athlete'}</h2>
          <p className="text-xs text-[#8A8A8A] mt-0.5">
            {userProfile.age} yrs · {userProfile.height} {userProfile.heightUnit} · {userProfile.weight}{' '}
            {userProfile.weightUnit}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#C7FF3D]/15 text-[#C7FF3D] border border-[#C7FF3D]/30">
              {userProfile.goal}
            </span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#222] text-[#A3A3A3]">
              {userProfile.experience}
            </span>
          </div>
        </div>
      </div>

      {/* Routine Configuration Details */}
      <div className="bg-[#121212] border border-[#242424] rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A8A8A]">
          Active Routine Setup
        </h3>

        <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#1C1C1C]">
          <div className="flex items-center gap-2.5 text-[#D4D4D4]">
            <Target className="w-4 h-4 text-[#C7FF3D]" />
            <span>Primary Focus</span>
          </div>
          <span className="font-bold text-[#F5F5F5]">{userProfile.goal}</span>
        </div>

        <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#1C1C1C]">
          <div className="flex items-center gap-2.5 text-[#D4D4D4]">
            <Calendar className="w-4 h-4 text-[#C7FF3D]" />
            <span>Training Frequency</span>
          </div>
          <span className="font-bold text-[#F5F5F5]">{userProfile.scheduleDays} days / week</span>
        </div>

        <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#1C1C1C]">
          <div className="flex items-center gap-2.5 text-[#D4D4D4]">
            <Clock className="w-4 h-4 text-[#C7FF3D]" />
            <span>Workout Duration</span>
          </div>
          <span className="font-bold text-[#F5F5F5]">{userProfile.duration}</span>
        </div>

        <div className="flex items-center justify-between text-xs py-1.5">
          <div className="flex items-center gap-2.5 text-[#D4D4D4]">
            <Dumbbell className="w-4 h-4 text-[#C7FF3D]" />
            <span>Equipment Setup</span>
          </div>
          <span className="font-bold text-[#F5F5F5]">{userProfile.equipment}</span>
        </div>
      </div>

      {/* Units & Settings */}
      <div className="bg-[#121212] border border-[#242424] rounded-2xl p-4 space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A8A8A]">
          Preferences & Units
        </h3>

        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-[#D4D4D4]">Weight Unit</span>
          <button
            onClick={toggleWeightUnit}
            className="px-3 py-1 text-xs font-bold font-mono rounded-lg bg-[#1C1C1C] border border-[#2E2E2E] text-[#C7FF3D] hover:bg-[#252525] transition-colors"
          >
            {userProfile.weightUnit.toUpperCase()} (Toggle)
          </button>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-[#D4D4D4]">Height Unit</span>
          <button
            onClick={toggleHeightUnit}
            className="px-3 py-1 text-xs font-bold font-mono rounded-lg bg-[#1C1C1C] border border-[#2E2E2E] text-[#C7FF3D] hover:bg-[#252525] transition-colors"
          >
            {userProfile.heightUnit.toUpperCase()} (Toggle)
          </button>
        </div>
      </div>

      {/* Brand Assets & Logo Size Guide */}
      <button
        onClick={() => setShowLogoGuide(true)}
        className="w-full bg-[#121212] hover:bg-[#181818] border border-[#242424] rounded-2xl p-4 flex items-center justify-between transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#1C1C1C] border border-[#2E2E2E] flex items-center justify-center overflow-hidden">
            <Logo size="xs" variant="icon" glow={true} />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-[#F5F5F5] flex items-center gap-1.5">
              <span>Official Brand Assets & Logo Guide</span>
              <span className="text-[9px] bg-[#C7FF3D]/20 text-[#C7FF3D] px-1.5 py-0.5 rounded-full font-mono font-bold">
                NEW
              </span>
            </div>
            <div className="text-[10px] text-[#8A8A8A]">
              Resolution guide, SVG vector & app icon breakdown
            </div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-[#8A8A8A]" />
      </button>

      {/* V2 Future Capabilities Preview (Anti-Slop Clean Roadmap) */}
      <button
        onClick={() => setShowV2Roadmap(true)}
        className="w-full bg-[#121212] hover:bg-[#181818] border border-[#242424] rounded-2xl p-4 flex items-center justify-between transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#A78BFA]/15 border border-[#A78BFA]/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#A78BFA]" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-[#F5F5F5]">V2 Capabilities Roadmap</div>
            <div className="text-[10px] text-[#8A8A8A]">Camera AI form analysis, wearables & voice</div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-[#8A8A8A]" />
      </button>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-2">
        <button
          onClick={() => setShowEditModal(true)}
          className="w-full py-3.5 px-4 rounded-xl bg-[#1C1C1C] hover:bg-[#242424] border border-[#2E2E2E] text-xs font-bold text-[#F5F5F5] transition-colors btn-press flex items-center justify-center gap-2"
        >
          <span>Edit Profile & Preferences</span>
        </button>

        <button
          onClick={() => setShowResetConfirmModal(true)}
          className="w-full py-3 px-4 rounded-xl bg-transparent hover:bg-[#1A1A1A] text-xs font-semibold text-[#8A8A8A] hover:text-[#FF5C5C] transition-colors flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Profile & Start Fresh</span>
        </button>
      </div>

      {/* RESET CONFIRMATION MODAL */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#161616] border border-[#2E2E2E] rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-black text-[#F5F5F5]">
                Reset Profile & Retake Onboarding?
              </h3>
              <p className="text-xs text-[#8A8A8A] mt-1.5 leading-relaxed">
                This will clear your saved settings and data. You will be taken to the fresh interactive onboarding flow to set up your profile from scratch.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className="py-2.5 rounded-xl bg-[#222] hover:bg-[#2A2A2A] text-xs font-bold text-[#A3A3A3] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowResetConfirmModal(false);
                  onRestartOnboarding();
                }}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-lg transition-colors btn-press"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-sm bg-[#141414] border border-[#2E2E2E] rounded-3xl p-5 shadow-2xl my-6">
            <h3 className="text-base font-bold text-[#F5F5F5] mb-4">Edit Profile & Plan</h3>

            <div className="space-y-3 mb-5 max-h-[65vh] overflow-y-auto pr-1">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8A8A8A] block mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-[#1C1C1C] border border-[#333] rounded-xl px-3 py-2 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#C7FF3D]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8A8A8A] block mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={draftAge}
                    onChange={(e) => setDraftAge(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-[#1C1C1C] border border-[#333] rounded-xl px-3 py-2 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#C7FF3D]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8A8A8A] block mb-1">
                    Weight ({userProfile.weightUnit})
                  </label>
                  <input
                    type="number"
                    value={draftWeight}
                    onChange={(e) => setDraftWeight(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-[#1C1C1C] border border-[#333] rounded-xl px-3 py-2 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#C7FF3D]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8A8A8A] block mb-1">
                    Height ({userProfile.heightUnit})
                  </label>
                  <input
                    type="number"
                    value={draftHeight}
                    onChange={(e) => setDraftHeight(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-[#1C1C1C] border border-[#333] rounded-xl px-3 py-2 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#C7FF3D]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8A8A8A] block mb-1">
                  Primary Fitness Goal
                </label>
                <select
                  value={draftGoal}
                  onChange={(e) => setDraftGoal(e.target.value as FitnessGoal)}
                  className="w-full bg-[#1C1C1C] border border-[#333] rounded-xl px-3 py-2 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#C7FF3D]"
                >
                  <option value="Build Muscle">Build Muscle</option>
                  <option value="Lose Fat">Lose Fat</option>
                  <option value="Get Stronger">Get Stronger</option>
                  <option value="Improve Fitness">Improve Fitness</option>
                  <option value="Stay Active">Stay Active</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8A8A8A] block mb-1">
                  Experience Level
                </label>
                <select
                  value={draftExperience}
                  onChange={(e) => setDraftExperience(e.target.value as ExperienceLevel)}
                  className="w-full bg-[#1C1C1C] border border-[#333] rounded-xl px-3 py-2 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#C7FF3D]"
                >
                  <option value="Complete Beginner">Complete Beginner</option>
                  <option value="Some Experience">Some Experience</option>
                  <option value="Experienced">Experienced</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8A8A8A] block mb-1">
                  Equipment Access
                </label>
                <select
                  value={draftEquipment}
                  onChange={(e) => setDraftEquipment(e.target.value as EquipmentAccess)}
                  className="w-full bg-[#1C1C1C] border border-[#333] rounded-xl px-3 py-2 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#C7FF3D]"
                >
                  <option value="Full Gym">Full Gym</option>
                  <option value="Basic Gym">Basic Gym</option>
                  <option value="Home Equipment">Home Equipment</option>
                  <option value="Bodyweight Only">Bodyweight Only</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8A8A8A] block mb-1">
                  Schedule (Days Per Week)
                </label>
                <select
                  value={draftScheduleDays}
                  onChange={(e) => setDraftScheduleDays(parseInt(e.target.value, 10) || 3)}
                  className="w-full bg-[#1C1C1C] border border-[#333] rounded-xl px-3 py-2 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#C7FF3D]"
                >
                  <option value={2}>2 Days / Week</option>
                  <option value={3}>3 Days / Week</option>
                  <option value={4}>4 Days / Week</option>
                  <option value={5}>5 Days / Week</option>
                  <option value={6}>6 Days / Week</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#222] text-[#8A8A8A] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={saveProfileEdits}
                className="flex-1 py-2.5 rounded-xl bg-[#C7FF3D] text-black text-xs font-bold btn-press"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* V2 ROADMAP MODAL */}
      {showV2Roadmap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#141414] border border-[#2E2E2E] rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#A78BFA]" />
                <h3 className="text-sm font-bold text-[#F5F5F5]">V2 Capabilities Roadmap</h3>
              </div>
              <button
                onClick={() => setShowV2Roadmap(false)}
                className="text-xs text-[#8A8A8A] hover:text-[#F5F5F5]"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#8A8A8A] mb-4">
              Features queued for future versions while maintaining beginner simplicity:
            </p>

            <div className="space-y-2 text-xs mb-5">
              <div className="bg-[#1C1C1C] p-2.5 rounded-xl border border-[#2A2A2A]">
                <div className="font-bold text-[#C7FF3D]">📷 Camera-Based Form Analysis</div>
                <p className="text-[10px] text-[#8A8A8A]">Real-time joint tracking on phone camera</p>
              </div>
              <div className="bg-[#1C1C1C] p-2.5 rounded-xl border border-[#2A2A2A]">
                <div className="font-bold text-[#A78BFA]">🎙️ Live Audio Voice Coach</div>
                <p className="text-[10px] text-[#8A8A8A]">Spoken countdowns and rep encouragement in ear</p>
              </div>
              <div className="bg-[#1C1C1C] p-2.5 rounded-xl border border-[#2A2A2A]">
                <div className="font-bold text-[#60A5FA]">⌚ Smartwatch Integration</div>
                <p className="text-[10px] text-[#8A8A8A]">Heart-rate synchronization and haptic rest bells</p>
              </div>
            </div>

            <button
              onClick={() => setShowV2Roadmap(false)}
              className="w-full py-2.5 rounded-xl bg-[#C7FF3D] text-black text-xs font-bold btn-press"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* OFFICIAL LOGO & RESOLUTION GUIDE MODAL */}
      {showLogoGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md max-h-[90vh] bg-[#121212] border border-[#2E2E2E] rounded-3xl p-5 shadow-2xl flex flex-col overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#242424] mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#1C1C1C] border border-[#333] flex items-center justify-center">
                  <Layers className="w-3.5 h-3.5 text-[#C7FF3D]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F5F5F5]">Official GymBuddy Logo Assets</h3>
                  <p className="text-[10px] text-[#8A8A8A]">Vector resolution & sizing guide</p>
                </div>
              </div>
              <button
                onClick={() => setShowLogoGuide(false)}
                className="w-7 h-7 rounded-full bg-[#1C1C1C] hover:bg-[#252525] text-[#8A8A8A] hover:text-[#F5F5F5] flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            {/* Live Interactive Preview Box */}
            <div className="bg-[#080808] border border-[#242424] rounded-2xl p-6 flex flex-col items-center justify-center min-h-[170px] relative overflow-hidden mb-4 shadow-inner">
              {/* Subtle background grid pattern */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 1px 1px, #C7FF3D 1px, transparent 0)',
                  backgroundSize: '24px 24px'
                }}
              />

              <Logo
                size={previewSize}
                variant={previewVariant}
                showWordmark={previewVariant !== 'icon'}
                showTagline={previewVariant === 'stacked'}
                glow={true}
              />
            </div>

            {/* Interactive Controls */}
            <div className="space-y-3 mb-4">
              {/* Variant Switcher */}
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8A8A8A] block mb-1.5">
                  Display Variant
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'stacked', label: 'Stacked (512px)' },
                    { id: 'horizontal', label: 'Horizontal (Bar)' },
                    { id: 'icon', label: 'Icon (Emblem)' }
                  ].map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setPreviewVariant(v.id as any)}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all ${
                        previewVariant === v.id
                          ? 'bg-[#C7FF3D] text-black shadow-sm'
                          : 'bg-[#1C1C1C] text-[#8A8A8A] hover:text-[#F5F5F5]'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Switcher */}
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8A8A8A] block mb-1.5">
                  Preset Dimensions
                </label>
                <div className="grid grid-cols-6 gap-1">
                  {[
                    { id: 'xs', label: '16px' },
                    { id: 'sm', label: '32px' },
                    { id: 'md', label: '48px' },
                    { id: 'lg', label: '128px' },
                    { id: 'xl', label: '256px' },
                    { id: '2xl', label: '512px' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setPreviewSize(s.id as any)}
                      className={`py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                        previewSize === s.id
                          ? 'bg-[#2E2E2E] text-[#C7FF3D] border border-[#C7FF3D]'
                          : 'bg-[#1A1A1A] text-[#8A8A8A] hover:text-[#D4D4D4]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Which Size Is Perfect Guide */}
            <div className="border-t border-[#222] pt-3.5 space-y-2 mb-4">
              <h4 className="text-[11px] font-bold text-[#F5F5F5] uppercase tracking-wider mb-2">
                Which Logo Size Is Perfect for You?
              </h4>

              <div className="space-y-2 text-xs">
                <div className="bg-[#181818] p-2.5 rounded-xl border border-[#262626]">
                  <div className="flex items-center justify-between font-bold text-[#F5F5F5]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C7FF3D]" />
                      32x32 & 48x48 (Favicon)
                    </span>
                    <span className="text-[10px] text-[#C7FF3D] font-mono">ACTIVE IN BROWSER</span>
                  </div>
                  <p className="text-[10px] text-[#8A8A8A] mt-0.5">
                    Perfect for browser tab icons and bookmarks. We linked this to HTML &lt;head&gt; as SVG for pixel-perfect scaling.
                  </p>
                </div>

                <div className="bg-[#181818] p-2.5 rounded-xl border border-[#262626]">
                  <div className="flex items-center justify-between font-bold text-[#F5F5F5]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA]" />
                      180x180 (Apple Touch Icon)
                    </span>
                    <span className="text-[10px] text-[#60A5FA] font-mono">iOS HOMESCREEN</span>
                  </div>
                  <p className="text-[10px] text-[#8A8A8A] mt-0.5">
                    The official Apple standard for when a user selects &ldquo;Add to Home Screen&rdquo; on iPhone/iPad Safari.
                  </p>
                </div>

                <div className="bg-[#181818] p-2.5 rounded-xl border border-[#262626]">
                  <div className="flex items-center justify-between font-bold text-[#F5F5F5]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]" />
                      512x512 (PWA & Android)
                    </span>
                    <span className="text-[10px] text-[#A78BFA] font-mono">APP MANIFEST</span>
                  </div>
                  <p className="text-[10px] text-[#8A8A8A] mt-0.5">
                    Standard PWA splash screen & Google Play icon. Used in the stacked logo variant across marketing.
                  </p>
                </div>

                <div className="bg-[#181818] p-2.5 rounded-xl border border-[#262626]">
                  <div className="flex items-center justify-between font-bold text-[#F5F5F5]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                      1024x1024 & 2048x2048
                    </span>
                    <span className="text-[10px] text-[#F59E0B] font-mono">STORE & PRINT</span>
                  </div>
                  <p className="text-[10px] text-[#8A8A8A] mt-0.5">
                    App Store submission masters, high-resolution hero promotional banners, and print merchandise.
                  </p>
                </div>

                <div className="bg-[#181818] p-2.5 rounded-xl border border-[#262626]">
                  <div className="flex items-center justify-between font-bold text-[#C7FF3D]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C7FF3D]" />
                      SVG Vector (In-App)
                    </span>
                    <span className="text-[10px] text-[#C7FF3D] font-mono">USED EVERYWHERE</span>
                  </div>
                  <p className="text-[10px] text-[#8A8A8A] mt-0.5">
                    Infinite resolution without pixelation at any zoom level, weighing only 1.2 KB for lightning-fast loads.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText('<Logo size="md" variant="horizontal" />');
                  setCopiedSvg(true);
                  setTimeout(() => setCopiedSvg(false), 2000);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] border border-[#2E2E2E] text-xs font-semibold text-[#D4D4D4] flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedSvg ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#C7FF3D]" />
                    <span className="text-[#C7FF3D]">Copied Component!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy React Code</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowLogoGuide(false)}
                className="py-2.5 px-5 rounded-xl bg-[#C7FF3D] text-black text-xs font-bold btn-press"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
