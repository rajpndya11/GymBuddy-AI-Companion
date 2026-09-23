import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  WorkoutRoutine,
  CompletedWorkoutSummary,
  UserCohort
} from './types';
import { WORKOUT_ROUTINES } from './data/workoutData';
import { HomeScreen } from './components/HomeScreen';
import { WorkoutSession } from './components/WorkoutSession';
import { WorkoutComplete } from './components/WorkoutComplete';
import { DietScreen } from './components/DietScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { Onboarding } from './components/Onboarding';
import { BuddyAIChat } from './components/BuddyAIChat';
import { Logo } from './components/Logo';
import { Home, Dumbbell, Utensils, TrendingUp, User, Sparkles } from 'lucide-react';

export default function App() {
  // Profile State: null by default for new browsers / first-time visitors
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('gymbuddy_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Exclude legacy demo data ("Raj") and ensure user has completed onboarding
        if (parsed && parsed.onboarded && parsed.name && parsed.name !== 'Raj') {
          return parsed;
        }
      } catch {
        return null;
      }
    }
    return null;
  });

  // Current active navigation tab
  const [activeTab, setActiveTab] = useState<'home' | 'workout' | 'diet' | 'progress' | 'profile'>('home');

  // Active workout routine
  const [activeRoutine, setActiveRoutine] = useState<WorkoutRoutine>(() => {
    return WORKOUT_ROUTINES[0]; // Upper body with warmup, main, and stretches
  });

  // In-session workout mode
  const [isInWorkoutSession, setIsInWorkoutSession] = useState(false);
  const [completedSummary, setCompletedSummary] = useState<CompletedWorkoutSummary | null>(null);

  // Buddy AI floating chat state
  const [isBuddyChatOpen, setIsBuddyChatOpen] = useState(false);

  // Persist profile updates only when onboarded
  useEffect(() => {
    if (userProfile && userProfile.onboarded) {
      localStorage.setItem('gymbuddy_profile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => (prev ? { ...prev, ...updated } : null));
  };

  const handleStartWorkout = () => {
    setIsInWorkoutSession(true);
    setCompletedSummary(null);
  };

  const handleFinishWorkout = (summary: CompletedWorkoutSummary) => {
    setIsInWorkoutSession(false);
    setCompletedSummary(summary);
    // Increment completed workouts count
    setUserProfile((prev) => (prev ? {
      ...prev,
      completedWorkoutsCount: prev.completedWorkoutsCount + 1,
      streakCount: prev.streakCount + 1,
      cohort: 'returning'
    } : null));
    // Also save to gymbuddy_workout_history
    try {
      const savedHistory = localStorage.getItem('gymbuddy_workout_history');
      const list = savedHistory ? JSON.parse(savedHistory) : [];
      localStorage.setItem('gymbuddy_workout_history', JSON.stringify([summary, ...list]));
    } catch {
      // ignore
    }
  };

  const handleBuddyAction = (actionType: string) => {
    if (actionType === 'switch-to-restart') {
      setActiveRoutine(WORKOUT_ROUTINES[2]); // 20-min restart
      setIsInWorkoutSession(true);
    } else if (actionType === 'start-routine') {
      setIsInWorkoutSession(true);
    } else if (actionType === 'swap-exercise') {
      // Swaps bench press with machine chest press
      if (activeRoutine.mainItems[0]) {
        activeRoutine.mainItems[0].name = 'Seated Chest Press Machine';
      }
      setIsInWorkoutSession(true);
    }
  };

  const handleRestartOnboarding = () => {
    // Clear all existing storage for a pristine restart
    localStorage.removeItem('gymbuddy_profile');
    localStorage.removeItem('gymbuddy_workout_history');
    localStorage.removeItem('gymbuddy_weight_logs');
    localStorage.removeItem('gymbuddy_strength_lifts');
    setUserProfile(null);
    setIsInWorkoutSession(false);
    setCompletedSummary(null);
    setActiveTab('home');
  };

  // 1. If not onboarded or no profile exists, immediately present interactive onboarding flow
  if (!userProfile || !userProfile.onboarded) {
    return (
      <div className="min-h-screen bg-[#0B0D14] text-[#FFFFFF] flex justify-center">
        <Onboarding
          onComplete={(newProfile) => {
            setUserProfile(newProfile);
            localStorage.setItem('gymbuddy_profile', JSON.stringify(newProfile));
            setActiveTab('home');
          }}
        />
      </div>
    );
  }

  // 2. If actively working out, show focused WorkoutSession screen
  if (isInWorkoutSession) {
    return (
      <div className="min-h-screen bg-[#0B0D14] text-[#FFFFFF] flex justify-center">
        <WorkoutSession
          routine={activeRoutine}
          onFinishWorkout={handleFinishWorkout}
          onCancel={() => setIsInWorkoutSession(false)}
        />
      </div>
    );
  }

  // 3. If finished workout, show WorkoutComplete celebration screen
  if (completedSummary) {
    return (
      <div className="min-h-screen bg-[#0B0D14] text-[#FFFFFF] flex justify-center">
        <WorkoutComplete
          summary={completedSummary}
          onViewProgress={() => {
            setCompletedSummary(null);
            setActiveTab('progress');
          }}
          onReturnHome={() => {
            setCompletedSummary(null);
            setActiveTab('home');
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0D14] text-[#FFFFFF] flex flex-col items-center justify-between">
      {/* Desktop App Shell Wrapper (mobile-first 390px-440px centered frame on large screens) */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-[#0B0D14] border-x border-[#2A2F3F] shadow-2xl relative">
        {/* Top Minimal App Header */}
        <header className="px-4 py-3 bg-[#0B0D14]/90 backdrop-blur-md sticky top-0 z-30 border-b border-[#2A2F3F] flex items-center justify-between">
          <Logo size="sm" showWordmark={true} />

          <div className="flex items-center gap-2">
            {/* Quick Session Launcher CTA in top bar */}
            <button
              onClick={handleStartWorkout}
              className="px-3.5 py-1.5 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/25 btn-press"
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Workout</span>
            </button>
          </div>
        </header>

        {/* Dynamic Screen View */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'home' && (
            <HomeScreen
              userProfile={userProfile}
              activeRoutine={activeRoutine}
              onStartWorkout={handleStartWorkout}
              onOpenBuddyChat={() => setIsBuddyChatOpen(true)}
              onNavigateTab={(tab) => setActiveTab(tab as any)}
              onSelectCohort={(c: UserCohort) => handleUpdateProfile({ cohort: c })}
            />
          )}

          {activeTab === 'workout' && (
            <div className="p-4 pb-24 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B5CF6]">
                    FULL CONTINUOUS SESSION
                  </span>
                  <h1 className="text-2xl font-black text-[#FFFFFF]">
                    Today’s Workout
                  </h1>
                </div>
                <span className="text-xs text-[#A1A8B8]">
                  ~{activeRoutine.estimatedMinutes} min
                </span>
              </div>

              {/* Reminder banner: Warmup + Main + Stretch included */}
              <div className="bg-[#131826] border border-[#2A2F3F] rounded-2xl p-3.5 flex items-center gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-ping" />
                <span className="text-[#FFFFFF]">
                  Integrated sequence: starts with <strong>warmups</strong>, transitions into{' '}
                  <strong>main lifts</strong>, and finishes with <strong>cool-down stretches</strong>.
                </span>
              </div>

              {/* Routine Card */}
              <div className="bg-[#131826] border border-[#2A2F3F] rounded-3xl p-5 shadow-xl">
                <h2 className="text-xl font-bold text-[#FFFFFF]">{activeRoutine.title}</h2>
                <p className="text-xs text-[#A1A8B8] mt-1 mb-4">{activeRoutine.subtitle}</p>

                {/* Exercises list preview */}
                <div className="space-y-2 mb-5">
                  {/* Warmups */}
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#F59E0B] mt-2">
                    Phase 1: Warmup & Mobility ({activeRoutine.warmupItems.length} Drills)
                  </div>
                  {activeRoutine.warmupItems.map((w, idx) => (
                    <div
                      key={w.id}
                      className="p-2.5 rounded-xl bg-[#0B0D14] border border-[#2A2F3F] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[#F59E0B] font-bold">0{idx + 1}</span>
                        <span className="text-[#FFFFFF] font-medium">{w.name}</span>
                      </div>
                      <span className="text-[10px] text-[#A1A8B8]">{w.durationSeconds}s hold</span>
                    </div>
                  ))}

                  {/* Main Lifts */}
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8B5CF6] mt-3">
                    Phase 2: Main Working Exercises ({activeRoutine.mainItems.length} Lifts)
                  </div>
                  {activeRoutine.mainItems.map((m, idx) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-xl bg-[#0B0D14] border border-[#2A2F3F] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[#8B5CF6] font-bold">0{idx + 1}</span>
                        <span className="text-[#FFFFFF] font-medium">{m.name}</span>
                      </div>
                      <span className="text-[10px] text-[#A1A8B8]">
                        {m.setsCount} sets × {m.targetReps} reps
                      </span>
                    </div>
                  ))}

                  {/* Stretches */}
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#C4B5FD] mt-3">
                    Phase 3: Cool-Down Stretches ({activeRoutine.stretchItems.length} Stretches)
                  </div>
                  {activeRoutine.stretchItems.map((s, idx) => (
                    <div
                      key={s.id}
                      className="p-2.5 rounded-xl bg-[#0B0D14] border border-[#2A2F3F] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[#C4B5FD] font-bold">0{idx + 1}</span>
                        <span className="text-[#FFFFFF] font-medium">{s.name}</span>
                      </div>
                      <span className="text-[10px] text-[#A1A8B8]">{s.durationSeconds}s hold</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleStartWorkout}
                  className="w-full py-4 rounded-2xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-sm shadow-xl shadow-purple-500/20 btn-press"
                >
                  START COMPLETE WORKOUT →
                </button>
              </div>
            </div>
          )}

          {activeTab === 'diet' && (
            <DietScreen
              userProfile={userProfile}
              onUpdateProfile={handleUpdateProfile}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressScreen
              userProfile={userProfile}
              onUpdateProfile={handleUpdateProfile}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileScreen
              userProfile={userProfile}
              onUpdateProfile={handleUpdateProfile}
              onRestartOnboarding={handleRestartOnboarding}
            />
          )}
        </main>

        {/* Floating "✦ Ask Buddy" AI Button */}
        <button
          onClick={() => setIsBuddyChatOpen(true)}
          className="fixed bottom-20 right-5 sm:right-[calc(50%-180px)] z-40 bg-[#131826] hover:bg-[#1E2438] text-[#FFFFFF] border border-[#2A2F3F] hover:border-[#8B5CF6] shadow-2xl px-3.5 py-2.5 rounded-full flex items-center gap-2 font-bold text-xs transition-all hover:scale-105 active:scale-95"
        >
          <div className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-ping" />
          <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span>Ask Buddy</span>
        </button>

        {/* Global Buddy AI Chat Drawer */}
        <BuddyAIChat
          userProfile={userProfile}
          activeRoutine={activeRoutine}
          isOpen={isBuddyChatOpen}
          onClose={() => setIsBuddyChatOpen(false)}
          onSelectAction={handleBuddyAction}
        />

        {/* MOBILE BOTTOM NAVIGATION BAR */}
        <nav className="sticky bottom-0 z-30 bg-[#0B0D14]/95 backdrop-blur-md border-t border-[#2A2F3F] px-3 py-2">
          <div className="flex items-center justify-between max-w-sm mx-auto">
            {/* 1. Home */}
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center flex-1 py-1 transition-colors ${
                activeTab === 'home' ? 'text-[#8B5CF6]' : 'text-[#A1A8B8] hover:text-[#A1A8B8]'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-1 tracking-tight">Home</span>
            </button>

            {/* 2. Workout */}
            <button
              onClick={() => setActiveTab('workout')}
              className={`flex flex-col items-center flex-1 py-1 transition-colors ${
                activeTab === 'workout' ? 'text-[#8B5CF6]' : 'text-[#A1A8B8] hover:text-[#A1A8B8]'
              }`}
            >
              <Dumbbell className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-1 tracking-tight">Workout</span>
            </button>

            {/* 3. Diet */}
            <button
              onClick={() => setActiveTab('diet')}
              className={`flex flex-col items-center flex-1 py-1 transition-colors ${
                activeTab === 'diet' ? 'text-[#8B5CF6]' : 'text-[#A1A8B8] hover:text-[#A1A8B8]'
              }`}
            >
              <Utensils className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-1 tracking-tight">Diet</span>
            </button>

            {/* 4. Progress */}
            <button
              onClick={() => setActiveTab('progress')}
              className={`flex flex-col items-center flex-1 py-1 transition-colors ${
                activeTab === 'progress' ? 'text-[#8B5CF6]' : 'text-[#A1A8B8] hover:text-[#A1A8B8]'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-1 tracking-tight">Progress</span>
            </button>

            {/* 5. Profile */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center flex-1 py-1 transition-colors ${
                activeTab === 'profile' ? 'text-[#8B5CF6]' : 'text-[#A1A8B8] hover:text-[#A1A8B8]'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-1 tracking-tight">Profile</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
