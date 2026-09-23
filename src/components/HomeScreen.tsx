import React, { useState } from 'react';
import { UserProfile, WorkoutRoutine, UserCohort, ExerciseItem } from '../types';
import { Play, Sparkles, Calendar, ArrowRight, User, Film, X } from 'lucide-react';
import { ExerciseVisualizer } from './ExerciseVisualizer';

interface HomeScreenProps {
  userProfile: UserProfile;
  activeRoutine: WorkoutRoutine;
  onStartWorkout: () => void;
  onOpenBuddyChat: () => void;
  onNavigateTab: (tab: string) => void;
  onSelectCohort?: (cohort: UserCohort) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userProfile,
  activeRoutine,
  onStartWorkout,
  onOpenBuddyChat,
  onNavigateTab,
  onSelectCohort
}) => {
  const [previewExercise, setPreviewExercise] = useState<ExerciseItem | null>(null);
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  // Calculate total sequence: warmups + main exercises + stretches
  const totalExercisesCount =
    activeRoutine.warmupItems.length +
    activeRoutine.mainItems.length +
    activeRoutine.stretchItems.length;

  // Cohort-based dynamic messaging
  const getGreetingMessage = () => {
    switch (userProfile.cohort) {
      case 'new':
        return 'Welcome to GymBuddy. Ready for your foundation session?';
      case 'consistent':
        return `You've completed 4 workouts this week. Outstanding momentum!`;
      case 'inactive':
        return `It's been a few days. Let's ease back in with a low-friction session.`;
      default:
        return 'Ready for today’s workout?';
    }
  };

  const getAIInsight = () => {
    switch (userProfile.cohort) {
      case 'new':
        return 'I’ve prepared a simple routine starting with 3 joint warmups, followed by key lifts and recovery stretches.';
      case 'consistent':
        return 'You handled 40 kg easily last session. Today I’ve prepared a calibrated +2.5 kg progression on your bench press.';
      case 'inactive':
        return 'Recommended: 20-min restart session to reactivate muscle memory without overwhelming soreness.';
      default:
        return 'Based on your goal and recovery, I’ve prepared an upper-body session with dynamic mobility and static stretches.';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 pb-24 text-[#FFFFFF] animate-fade-in space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xs font-semibold text-[#A1A8B8] block">
            {todayFormatted}
          </span>
          <h1 className="text-2xl font-black text-[#FFFFFF] tracking-tight">
            Good morning, {userProfile.name || 'Athlete'} 👋
          </h1>
        </div>

        {/* Profile Avatar button */}
        <button
          onClick={() => onNavigateTab('profile')}
          className="w-10 h-10 rounded-full bg-[#0B0D14] border border-[#2A2F3F] flex items-center justify-center text-[#8B5CF6] hover:border-[#8B5CF6] transition-colors shadow-sm"
          aria-label="Profile"
        >
          <User className="w-4 h-4 text-[#8B5CF6]" />
        </button>
      </div>

      {/* Cohort Demo Switcher Pill (for instant testing) */}
      {onSelectCohort && (
        <div className="bg-[#131826] border border-[#2A2F3F] rounded-xl p-2 flex items-center justify-between text-[11px]">
          <span className="text-[#A1A8B8] font-semibold pl-1">Cohort State:</span>
          <div className="flex gap-1">
            {(['new', 'returning', 'consistent', 'inactive'] as UserCohort[]).map((c) => (
              <button
                key={c}
                onClick={() => onSelectCohort(c)}
                className={`px-2 py-0.5 rounded-md font-extrabold uppercase text-[10px] transition-all ${
                  userProfile.cohort === c
                    ? 'bg-[#8B5CF6] text-white shadow-sm shadow-purple-500/25'
                    : 'text-[#A1A8B8] hover:text-[#FFFFFF]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Status / Question */}
      <div className="text-sm text-[#A1A8B8] font-medium">
        {getGreetingMessage()}
      </div>

      {/* MAIN WORKOUT CARD (Hero Element) */}
      <div className="relative bg-gradient-to-b bg-[#131826] border border-[#2A2F3F] rounded-3xl p-5 shadow-2xl overflow-hidden">
        {/* Subtle accent blur corner */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#8B5CF6] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" />
            TODAY'S WORKOUT
          </span>
          <span className="text-xs font-semibold text-[#A1A8B8] bg-[#0B0D14] px-2.5 py-0.5 rounded-full border border-[#2A2F3F]">
            ~{activeRoutine.estimatedMinutes} min
          </span>
        </div>

        <h2 className="text-2xl font-black text-[#FFFFFF] tracking-tight">
          {activeRoutine.title}
        </h2>
        <p className="text-xs text-[#A1A8B8] mt-1 mb-4">
          {activeRoutine.subtitle}
        </p>

        {/* 3-Phase Breakdown inside the workout */}
        <div className="bg-[#131826] border border-[#2A2F3F] rounded-2xl p-3 mb-5 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#F59E0B] uppercase">1. Warmup</span>
            <span className="text-sm font-bold text-[#FFFFFF]">
              {activeRoutine.warmupItems.length} Drills
            </span>
          </div>
          <div className="flex flex-col border-x border-[#2A2F3F]">
            <span className="text-[10px] font-bold text-[#8B5CF6] uppercase">2. Main</span>
            <span className="text-sm font-bold text-[#FFFFFF]">
              {activeRoutine.mainItems.length} Lifts
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#818CF8] uppercase">3. Stretch</span>
            <span className="text-sm font-bold text-[#FFFFFF]">
              {activeRoutine.stretchItems.length} Stretches
            </span>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-between text-xs text-[#A1A8B8] mb-2">
          <span>Flow Progress</span>
          <span className="font-mono text-[#FFFFFF]">0 / {totalExercisesCount} exercises</span>
        </div>
        <div className="w-full bg-[#0B0D14] h-1.5 rounded-full overflow-hidden mb-5">
          <div className="w-0 bg-gradient-to-r from-[#8B5CF6] to-[#C4B5FD] h-full rounded-full" />
        </div>

        {/* Exercise Video Previews */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs text-[#A1A8B8] mb-2">
            <span className="flex items-center gap-1">
              <Film className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>Real Video Form Demonstrations</span>
            </span>
            <span className="text-[10px] text-[#8B5CF6] font-semibold">Tap to study form</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {activeRoutine.mainItems.map((ex) => (
              <button
                key={ex.id}
                onClick={() => setPreviewExercise(ex)}
                className="px-2.5 py-1.5 rounded-xl bg-[#0B0D14] hover:bg-[#1E2438] border border-[#2A2F3F] text-left shrink-0 transition-colors flex items-center gap-1.5 text-xs text-[#FFFFFF]"
              >
                <Film className="w-3 h-3 text-[#8B5CF6]" />
                <span className="font-semibold">{ex.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Primary CTA (Signature Cyan) */}
        <button
          onClick={onStartWorkout}
          className="w-full py-4 px-6 rounded-2xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-purple-500/20 transition-all btn-press"
        >
          <span>START WORKOUT</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>

      {/* Real Exercise Video Demonstration Modal */}
      {previewExercise && (
        <div className="fixed inset-0 z-50 bg-[#0B0D14]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#131826] border border-[#2A2F3F] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-3.5 bg-[#0B0D14] border-b border-[#2A2F3F] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#8B5CF6] tracking-wider block">
                  {previewExercise.videoUrl ? 'Video Demonstration & Form Guide' : 'Biomechanical Movement Guide'}
                </span>
                <h3 className="text-base font-black text-white">{previewExercise.name}</h3>
              </div>
              <button
                onClick={() => setPreviewExercise(null)}
                className="p-2 rounded-xl bg-[#1E2438] text-[#A1A8B8] hover:text-white"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 overflow-y-auto">
              <ExerciseVisualizer exercise={previewExercise} />
            </div>
          </div>
        </div>
      )}

      {/* AI INSIGHT CARD */}
      <div className="bg-[#131826] border border-[#2A2F3F] rounded-2xl p-4 flex items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/25 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#8B5CF6]">
                ✦ GYMBUDDY AI
              </span>
              <span className="text-[10px] text-[#A1A8B8]">Adaptive Coach</span>
            </div>
            <p className="text-xs text-[#A1A8B8] mt-1 leading-relaxed">
              “{getAIInsight()}”
            </p>
          </div>
        </div>
        <button
          onClick={onOpenBuddyChat}
          className="px-3 py-1.5 rounded-full bg-[#0B0D14] hover:bg-[#1E2438] border border-[#2A2F3F] text-[11px] font-bold text-[#8B5CF6] shrink-0 flex items-center gap-1 transition-colors"
        >
          <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
          <span>Ask Buddy</span>
        </button>
      </div>

      {/* WEEKLY CONSISTENCY TRACKER */}
      <div className="bg-[#131826] border border-[#2A2F3F] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#8B5CF6]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
              THIS WEEK
            </span>
          </div>
          <span className="text-xs font-bold text-[#8B5CF6]">3 / 4 workouts</span>
        </div>

        {/* 7 Days tracker */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {[
            { day: 'Mon', completed: true },
            { day: 'Tue', completed: true },
            { day: 'Wed', completed: false },
            { day: 'Thu', completed: true },
            { day: 'Fri', completed: false },
            { day: 'Sat', completed: false },
            { day: 'Sun', completed: false }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-xl flex flex-col items-center justify-center border transition-all ${
                item.completed
                  ? 'bg-[#8B5CF6]/15 border-[#8B5CF6]/40 text-[#8B5CF6]'
                  : 'bg-[#0B0D14] border-[#2A2F3F] text-[#475569]'
              }`}
            >
              <span className="text-[10px] font-bold uppercase mb-1">{item.day}</span>
              <span className="text-xs font-black">
                {item.completed ? '●' : '○'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* PROGRESS SNAPSHOT METRICS */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-[#131826] border border-[#2A2F3F] rounded-2xl p-3 flex flex-col items-center text-center">
          <span className="text-3xl font-black text-[#FFFFFF] font-mono">
            {userProfile.completedWorkoutsCount < 10
              ? `0${userProfile.completedWorkoutsCount}`
              : userProfile.completedWorkoutsCount}
          </span>
          <span className="text-[10px] uppercase font-semibold text-[#A1A8B8] mt-1">
            Workouts
          </span>
        </div>

        <div className="bg-[#131826] border border-[#2A2F3F] rounded-2xl p-3 flex flex-col items-center text-center">
          <span className="text-3xl font-black text-[#8B5CF6] font-mono">82%</span>
          <span className="text-[10px] uppercase font-semibold text-[#A1A8B8] mt-1">
            Consistency
          </span>
        </div>

        <div className="bg-[#131826] border border-[#2A2F3F] rounded-2xl p-3 flex flex-col items-center text-center">
          <span className="text-3xl font-black text-[#FFFFFF] font-mono">+12%</span>
          <span className="text-[10px] uppercase font-semibold text-[#A1A8B8] mt-1">
            Strength
          </span>
        </div>
      </div>

      {/* QUICK FLOATING ASSISTANT BANNER */}
      <div className="bg-gradient-to-r bg-[#131826] border border-[#2A2F3F] rounded-2xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#8B5CF6] text-white font-black flex items-center justify-center text-sm shadow-sm">
            ✦
          </div>
          <div>
            <div className="text-xs font-bold text-[#FFFFFF]">Need real-time advice?</div>
            <div className="text-[10px] text-[#A1A8B8]">Ask about weight, form, or energy</div>
          </div>
        </div>

        <button
          onClick={onOpenBuddyChat}
          className="px-3.5 py-1.5 rounded-xl bg-[#0B0D14] hover:bg-[#1E2438] border border-[#2A2F3F] text-xs font-bold text-[#8B5CF6] transition-colors btn-press"
        >
          Ask Buddy →
        </button>
      </div>
    </div>
  );
};
