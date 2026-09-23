import React from 'react';
import { Trophy, ArrowRight, CheckCircle2, Flame, Sparkles, Dumbbell, Clock } from 'lucide-react';
import { CompletedWorkoutSummary } from '../types';

interface WorkoutCompleteProps {
  summary: CompletedWorkoutSummary;
  onViewProgress: () => void;
  onReturnHome: () => void;
}

export const WorkoutComplete: React.FC<WorkoutCompleteProps> = ({
  summary,
  onViewProgress,
  onReturnHome
}) => {
  return (
    <div className="w-full max-w-md mx-auto p-5 pb-12 flex flex-col items-center text-center animate-fade-in">
      {/* Celebration Trophy Badge */}
      <div className="relative mt-4 mb-5">
        <div className="w-20 h-20 rounded-3xl bg-[#1A1A1A] border-2 border-[#C7FF3D] flex items-center justify-center shadow-xl pulse-lime">
          <Trophy className="w-10 h-10 text-[#C7FF3D]" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[#C7FF3D] text-black flex items-center justify-center font-bold text-xs shadow-md">
          ✓
        </div>
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-[#C7FF3D] mb-1">
        SESSION FINISHED
      </span>
      <h1 className="text-3xl font-extrabold text-[#F5F5F5] tracking-tight">
        WORKOUT COMPLETE
      </h1>
      <p className="text-sm text-[#8A8A8A] mt-2 mb-7 max-w-xs">
        “You showed up. That's what matters. Your muscles are primed to rebuild stronger.”
      </p>

      {/* 4 Stat Metrics Grid */}
      <div className="grid grid-cols-3 gap-2.5 w-full mb-5">
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-3 flex flex-col items-center">
          <Clock className="w-4 h-4 text-[#8A8A8A] mb-1" />
          <span className="text-2xl font-black text-[#F5F5F5]">
            {summary.durationMinutes}
          </span>
          <span className="text-[10px] uppercase font-semibold text-[#8A8A8A] mt-0.5">
            Minutes
          </span>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-3 flex flex-col items-center">
          <Dumbbell className="w-4 h-4 text-[#C7FF3D] mb-1" />
          <span className="text-2xl font-black text-[#C7FF3D]">
            {summary.mainCount}
          </span>
          <span className="text-[10px] uppercase font-semibold text-[#8A8A8A] mt-0.5">
            Lifts + {summary.warmupCount + summary.stretchCount} Mob
          </span>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-3 flex flex-col items-center">
          <Flame className="w-4 h-4 text-[#FFB547] mb-1" />
          <span className="text-2xl font-black text-[#F5F5F5]">
            {summary.totalSetsLogged}
          </span>
          <span className="text-[10px] uppercase font-semibold text-[#8A8A8A] mt-0.5">
            Sets Logged
          </span>
        </div>
      </div>

      {/* Warmup + Lift + Stretch Breakdown pill */}
      <div className="w-full bg-[#121212] border border-[#242424] rounded-2xl p-3.5 mb-5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#C7FF3D]" />
          <span className="text-[#D4D4D4] font-medium">Warmup to Cool-Down</span>
        </div>
        <span className="font-bold text-[#C7FF3D]">
          {summary.warmupCount} Warmup · {summary.mainCount} Main · {summary.stretchCount} Stretch
        </span>
      </div>

      {/* TODAY'S WIN Progression Card */}
      <div className="w-full bg-gradient-to-br from-[#171717] to-[#121212] border border-[#2E2E2E] rounded-2xl p-4.5 mb-6 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 bg-[#C7FF3D]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#C7FF3D] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C7FF3D]" />
            TODAY'S WIN
          </span>
          <span className="text-[10px] font-semibold text-[#8A8A8A] bg-[#222] px-2 py-0.5 rounded-full">
            Progression Calibrated
          </span>
        </div>

        <h4 className="text-base font-bold text-[#F5F5F5]">
          {summary.highlightProgression.exercise}
        </h4>

        <div className="flex items-center gap-3 my-2 font-mono">
          <span className="text-sm font-semibold text-[#8A8A8A] line-through">
            {summary.highlightProgression.from}
          </span>
          <ArrowRight className="w-4 h-4 text-[#C7FF3D]" />
          <span className="text-lg font-black text-[#C7FF3D]">
            {summary.highlightProgression.to}
          </span>
        </div>

        <p className="text-xs text-[#9CA3AF] leading-relaxed">
          {summary.highlightProgression.note}
        </p>

        <div className="mt-3 pt-3 border-t border-[#262626] flex items-center gap-2 text-[11px] text-[#A78BFA]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA] animate-ping" />
          <span>GymBuddy AI has automatically updated your next routine load.</span>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full space-y-3">
        <button
          onClick={onViewProgress}
          className="w-full py-4 px-6 rounded-2xl bg-[#C7FF3D] hover:bg-[#bbf32e] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl transition-all btn-press"
        >
          <span>SEE MY PROGRESS</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onReturnHome}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#171717] hover:bg-[#202020] border border-[#2E2E2E] text-[#F5F5F5] font-semibold text-xs transition-all btn-press"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};
