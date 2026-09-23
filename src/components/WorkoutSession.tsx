import React, { useState, useEffect } from 'react';
import { WorkoutRoutine, ExerciseItem, CompletedWorkoutSummary } from '../types';
import { ExerciseVisualizer } from './ExerciseVisualizer';
import { RestTimerModal } from './RestTimerModal';
import {
  X,
  Check,
  Plus,
  Minus,
  Sparkles,
  ChevronRight,
  ListOrdered,
  RotateCcw,
  ArrowRight
} from 'lucide-react';

interface WorkoutSessionProps {
  routine: WorkoutRoutine;
  onFinishWorkout: (summary: CompletedWorkoutSummary) => void;
  onCancel: () => void;
}

export const WorkoutSession: React.FC<WorkoutSessionProps> = ({
  routine,
  onFinishWorkout,
  onCancel
}) => {
  // UNIFIED WORKOUT SEQUENCE: Warmups FIRST, Main Exercises SECOND, Stretches LAST!
  // All in one continuous workout flow, no separate sections!
  const fullExerciseSequence: ExerciseItem[] = [
    ...routine.warmupItems,
    ...routine.mainItems,
    ...routine.stretchItems
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentExercise = fullExerciseSequence[currentIndex] || fullExerciseSequence[0];

  // Set & rep tracking for current exercise
  const [currentSet, setCurrentSet] = useState(1);
  const [targetWeight, setTargetWeight] = useState(currentExercise.targetWeight || 40);
  const [targetReps, setTargetReps] = useState(currentExercise.targetReps || 10);

  // Timed hold for warmups / stretches
  const [timedSecondsLeft, setTimedSecondsLeft] = useState<number>(
    currentExercise.durationSeconds || 45
  );
  const [isTimedRunning, setIsTimedRunning] = useState(false);

  // Button micro-interaction states
  const [isCompletingSet, setIsCompletingSet] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showOverviewDrawer, setShowOverviewDrawer] = useState(false);

  // Total session stats tracker
  const [totalSetsLogged, setTotalSetsLogged] = useState(0);
  const [startTime] = useState(Date.now());

  // Reset exercise-specific state when navigating to a new exercise
  useEffect(() => {
    setCurrentSet(1);
    setTargetWeight(currentExercise.targetWeight || 40);
    setTargetReps(currentExercise.targetReps || 10);
    setTimedSecondsLeft(currentExercise.durationSeconds || 45);
    setIsTimedRunning(false);
  }, [currentIndex, currentExercise]);

  // Handle timer countdown for warmups/stretches
  useEffect(() => {
    if (!isTimedRunning) return;
    if (timedSecondsLeft <= 0) {
      setIsTimedRunning(false);
      return;
    }
    const interval = setInterval(() => {
      setTimedSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimedRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimedRunning, timedSecondsLeft]);

  // Phase categorization helpers
  const isWarmupPhase = currentExercise.phase === 'warmup';
  const isStretchPhase = currentExercise.phase === 'stretch';
  const isMainPhase = currentExercise.phase === 'main';

  // Calculate phase index (e.g. Warmup 1 of 3)
  const getPhaseDisplay = () => {
    if (isWarmupPhase) {
      const wIdx = routine.warmupItems.findIndex((e) => e.id === currentExercise.id) + 1;
      return `WARMUP ${wIdx} / ${routine.warmupItems.length}`;
    }
    if (isStretchPhase) {
      const sIdx = routine.stretchItems.findIndex((e) => e.id === currentExercise.id) + 1;
      return `COOL-DOWN STRETCH ${sIdx} / ${routine.stretchItems.length}`;
    }
    const mIdx = routine.mainItems.findIndex((e) => e.id === currentExercise.id) + 1;
    return `MAIN LIFT ${mIdx} / ${routine.mainItems.length}`;
  };

  // Complete a set or mobility drill
  const handleCompleteSet = () => {
    if (isCompletingSet) return;
    setIsCompletingSet(true);

    // Haptic vibration on mobile
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([30, 40, 45]);
      } catch {
        // Safe catch
      }
    }

    setTotalSetsLogged((prev) => prev + 1);

    setTimeout(() => {
      setIsCompletingSet(false);

      if (isWarmupPhase || isStretchPhase) {
        // Warmups & stretches typically have 1 set or timed drill, advance immediately
        advanceToNextExercise();
      } else {
        // Main strength exercise: check if more sets remain
        if (currentSet < currentExercise.setsCount) {
          setShowRestTimer(true);
        } else {
          // Finished all sets of this lift
          advanceToNextExercise();
        }
      }
    }, 600);
  };

  const handleRestFinished = () => {
    setShowRestTimer(false);
    setCurrentSet((prev) => prev + 1);
  };

  const advanceToNextExercise = () => {
    if (currentIndex < fullExerciseSequence.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Finished all warmups, lifts, and stretches!
      finishWorkoutSession();
    }
  };

  const finishWorkoutSession = () => {
    const elapsedMinutes = Math.max(
      15,
      Math.round((Date.now() - startTime) / (1000 * 60)) || routine.estimatedMinutes
    );

    const calculatedVolume = routine.mainItems.reduce((acc, item) => {
      const weight = item.targetWeight || 35;
      const reps = item.targetReps || 10;
      const sets = item.setsCount || 3;
      return acc + (weight * reps * sets);
    }, 0);

    const exerciseDetails = routine.mainItems.map((item) => ({
      name: item.name,
      setsCount: item.setsCount || 3,
      weight: item.targetWeight || 35,
      reps: item.targetReps || 10
    }));

    const summary: CompletedWorkoutSummary = {
      id: `session-${Date.now()}`,
      routineTitle: routine.title,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      durationMinutes: elapsedMinutes,
      warmupCount: routine.warmupItems.length,
      mainCount: routine.mainItems.length,
      stretchCount: routine.stretchItems.length,
      totalSetsLogged: totalSetsLogged || 16,
      totalVolumeKg: calculatedVolume || 3420,
      highlightProgression: {
        exercise: routine.mainItems[0]?.name || 'Bench Press',
        from: `${targetWeight} kg × 10`,
        to: `${(targetWeight + 2.5).toFixed(1)} kg × 8`,
        note: 'You executed each set with solid control. GymBuddy calibrated your next session target with +2.5 kg.'
      },
      exerciseDetails
    };

    onFinishWorkout(summary);
  };

  return (
    <div className="relative w-full max-w-md mx-auto min-h-screen bg-[#0B0D14] text-[#FFFFFF] pb-10 flex flex-col">
      {/* Top Sticky Header */}
      <div className="sticky top-0 z-30 bg-[#0B0D14]/95 backdrop-blur-md px-4 py-3 border-b border-[#2A2F3F] flex items-center justify-between">
        <button
          onClick={() => setShowExitConfirm(true)}
          className="p-1.5 rounded-xl bg-[#131826] hover:bg-[#1E2438] text-[#A1A8B8] hover:text-[#FFFFFF] border border-[#2A2F3F] transition-colors"
          aria-label="Exit Workout"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Unified Phase Pill */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isWarmupPhase
                  ? 'bg-[#8B5CF6]'
                  : isStretchPhase
                  ? 'bg-[#C4B5FD]'
                  : 'bg-[#8B5CF6]'
              }`}
            />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFFFFF]">
              {getPhaseDisplay()}
            </span>
          </div>
          <span className="text-[10px] text-[#A1A8B8] mt-0.5">
            Step {currentIndex + 1} of {fullExerciseSequence.length}
          </span>
        </div>

        {/* Workout Sequence Overview Drawer Trigger */}
        <button
          onClick={() => setShowOverviewDrawer(true)}
          className="p-1.5 rounded-xl bg-[#131826] hover:bg-[#1E2438] text-[#A1A8B8] hover:text-[#FFFFFF] border border-[#2A2F3F] transition-colors"
          aria-label="View Workout Sequence"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>

      {/* Segmented Phase Progress Track */}
      <div className="px-4 pt-2.5 pb-1 flex gap-1 w-full">
        {fullExerciseSequence.map((item, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const color =
            item.phase === 'warmup'
              ? 'bg-[#8B5CF6]'
              : item.phase === 'stretch'
              ? 'bg-[#C4B5FD]'
              : 'bg-[#8B5CF6]';

          return (
            <div
              key={idx}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                isDone ? color : isCurrent ? `${color} opacity-90 scale-y-125 shadow-sm shadow-purple-500/50` : 'bg-[#0B0D14]'
              }`}
            />
          );
        })}
      </div>

      {/* Main Content Body */}
      <div className="px-4 py-3 flex-1 flex flex-col">
        {/* Phase Transition Banner */}
        {isWarmupPhase && (
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
              <span className="text-[#8B5CF6] font-semibold">Phase 1: Warmup & Joint Mobility</span>
            </div>
            <span className="text-[10px] text-[#A1A8B8]">Prime muscles before heavy sets</span>
          </div>
        )}

        {isMainPhase && (
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
              <span className="text-[#8B5CF6] font-semibold">Phase 2: Main Working Exercises</span>
            </div>
            <span className="text-[10px] text-[#A1A8B8]">Strength & Muscle building</span>
          </div>
        )}

        {isStretchPhase && (
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-[#C4B5FD]/10 border border-[#C4B5FD]/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C4B5FD]" />
              <span className="text-[#C4B5FD] font-semibold">Phase 3: Post-Workout Stretches</span>
            </div>
            <span className="text-[10px] text-[#A1A8B8]">Decompress & speed recovery</span>
          </div>
        )}

        {/* Exercise Title Header */}
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black text-[#FFFFFF] tracking-tight">
              {currentExercise.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-[#A1A8B8]">
                {currentExercise.targetMuscles.join(' · ')}
              </span>
            </div>
          </div>
        </div>

        {/* Exercise Biomechanical Visualizer */}
        <div className="mb-4">
          <ExerciseVisualizer exercise={currentExercise} phaseLabel={getPhaseDisplay()} />
        </div>

        {/* INTERACTIVE CONTROLS SECTION */}
        {isMainPhase ? (
          /* Main Lift: Sets, Weight, Reps adjusters */
          <div className="bg-[#131826] border border-[#2A2F3F] rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2A2F3F]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A1A8B8]">
                ACTIVE SET
              </span>
              <span className="text-xs font-bold text-[#8B5CF6] px-2.5 py-0.5 rounded-md bg-[#8B5CF6]/15 border border-[#8B5CF6]/25">
                SET {currentSet} OF {currentExercise.setsCount}
              </span>
            </div>

            {/* Adjusters Row */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Weight Adjuster */}
              <div className="bg-[#131826] border border-[#2A2F3F] rounded-xl p-3 flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A8B8] mb-1">
                  Weight (KG)
                </span>
                <div className="flex items-center justify-between w-full">
                  <button
                    onClick={() => setTargetWeight((w) => Math.max(0, w - 2.5))}
                    className="w-8 h-8 rounded-lg bg-[#0B0D14] hover:bg-[#163359] text-[#FFFFFF] flex items-center justify-center font-bold text-sm btn-press"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xl font-black text-[#FFFFFF] font-mono">
                    {targetWeight}
                  </span>
                  <button
                    onClick={() => setTargetWeight((w) => w + 2.5)}
                    className="w-8 h-8 rounded-lg bg-[#0B0D14] hover:bg-[#163359] text-[#FFFFFF] flex items-center justify-center font-bold text-sm btn-press"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Reps Adjuster */}
              <div className="bg-[#131826] border border-[#2A2F3F] rounded-xl p-3 flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A8B8] mb-1">
                  Reps Target
                </span>
                <div className="flex items-center justify-between w-full">
                  <button
                    onClick={() => setTargetReps((r) => Math.max(1, r - 1))}
                    className="w-8 h-8 rounded-lg bg-[#0B0D14] hover:bg-[#163359] text-[#FFFFFF] flex items-center justify-center font-bold text-sm btn-press"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xl font-black text-[#FFFFFF] font-mono">
                    {targetReps}
                  </span>
                  <button
                    onClick={() => setTargetReps((r) => r + 1)}
                    className="w-8 h-8 rounded-lg bg-[#0B0D14] hover:bg-[#163359] text-[#FFFFFF] flex items-center justify-center font-bold text-sm btn-press"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Complete Set Button with tactile micro-interaction */}
            <button
              onClick={handleCompleteSet}
              disabled={isCompletingSet}
              className={`w-full py-4 px-6 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-xl ${
                isCompletingSet
                  ? 'bg-[#10B981] text-white scale-[1.02]'
                  : 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-black shadow-purple-500/20 btn-press font-black'
              }`}
            >
              {isCompletingSet ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 animate-checkmark text-white stroke-[3]" />
                  </div>
                  <span>✓ SET COMPLETE</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>COMPLETE SET</span>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </div>
              )}
            </button>
          </div>
        ) : (
          /* Warmup or Stretch Phase: Timed Hold / Mobility Completion */
          <div className="bg-[#131826] border border-[#2A2F3F] rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2A2F3F]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A1A8B8]">
                {isWarmupPhase ? 'DYNAMIC MOBILITY DRILL' : 'RECOVERY STRETCH HOLD'}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                  isWarmupPhase
                    ? 'text-[#8B5CF6] bg-[#8B5CF6]/15 border border-[#8B5CF6]/25'
                    : 'text-[#C4B5FD] bg-[#C4B5FD]/15 border border-[#C4B5FD]/25'
                }`}
              >
                {currentExercise.durationSeconds || 45} SEC TARGET
              </span>
            </div>

            {/* Timed countdown card */}
            <div className="flex items-center justify-between bg-[#131826] border border-[#2A2F3F] rounded-xl p-3 mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsTimedRunning(!isTimedRunning)}
                  className="w-10 h-10 rounded-xl bg-[#0B0D14] hover:bg-[#163359] text-[#FFFFFF] flex items-center justify-center transition-colors btn-press"
                >
                  {isTimedRunning ? (
                    <span className="text-xs font-bold text-[#EF4444]">PAUSE</span>
                  ) : (
                    <span className="text-xs font-bold text-[#8B5CF6]">START</span>
                  )}
                </button>
                <div>
                  <div className="text-xs font-semibold text-[#A1A8B8]">Hold / Rep Timer</div>
                  <div className="text-2xl font-black font-mono text-[#FFFFFF]">
                    00:{timedSecondsLeft < 10 ? `0${timedSecondsLeft}` : timedSecondsLeft}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setTimedSecondsLeft(currentExercise.durationSeconds || 45)}
                className="p-2 rounded-lg bg-[#0B0D14] text-[#A1A8B8] hover:text-[#FFFFFF]"
                aria-label="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Next / Complete Drill Button */}
            <button
              onClick={handleCompleteSet}
              disabled={isCompletingSet}
              className={`w-full py-4 px-6 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-xl ${
                isWarmupPhase
                  ? 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white btn-press font-black'
                  : 'bg-[#C4B5FD] hover:bg-[#6366F1] text-white btn-press font-black'
              }`}
            >
              {isCompletingSet ? (
                <span>✓ DRILL COMPLETE</span>
              ) : (
                <div className="flex items-center gap-2">
                  <span>{isWarmupPhase ? 'COMPLETE WARMUP DRILL' : 'COMPLETE STRETCH'}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>
          </div>
        )}

        {/* Alternative Exercise Suggestion */}
        {currentExercise.alternative && (
          <div className="bg-[#131826] border border-[#2A2F3F] rounded-xl p-3 flex items-start justify-between gap-3 text-xs">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#8B5CF6] font-bold">Swap Option: </span>
                <span className="text-[#FFFFFF] font-semibold">{currentExercise.alternative.name}</span>
                <p className="text-[11px] text-[#A1A8B8] mt-0.5">
                  {currentExercise.alternative.reason}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                // Update name
                currentExercise.name = currentExercise.alternative!.name;
              }}
              className="text-[10px] font-bold text-[#8B5CF6] hover:underline shrink-0 bg-[#131826] border border-[#2A2F3F] px-2 py-1 rounded-md"
            >
              Use Swap
            </button>
          </div>
        )}
      </div>

      {/* Rest Timer Modal */}
      {showRestTimer && (
        <RestTimerModal
          initialSeconds={45}
          exerciseName={currentExercise.name}
          nextSetInfo={`Set ${currentSet + 1} of ${currentExercise.setsCount} (${targetWeight} kg × ${targetReps})`}
          onComplete={handleRestFinished}
          onSkip={handleRestFinished}
        />
      )}

      {/* Full Workout Overview Drawer Modal */}
      {showOverviewDrawer && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md mx-auto bg-[#131826] border-t border-[#2A2F3F] rounded-t-3xl p-5 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2F3F]">
              <div>
                <h3 className="text-base font-bold text-[#FFFFFF]">Today's Complete Flow</h3>
                <p className="text-xs text-[#A1A8B8]">
                  Warmup → Main Lifts → Recovery Stretch
                </p>
              </div>
              <button
                onClick={() => setShowOverviewDrawer(false)}
                className="p-1.5 rounded-lg bg-[#131826] border border-[#2A2F3F] text-[#A1A8B8] hover:text-[#FFFFFF]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto py-3 space-y-2 flex-1">
              {fullExerciseSequence.map((item, idx) => {
                const isCurrent = idx === currentIndex;
                const isDone = idx < currentIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowOverviewDrawer(false);
                    }}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-colors ${
                      isCurrent
                        ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]'
                        : isDone
                        ? 'bg-[#0B0D14] border-[#2A2F3F] opacity-70'
                        : 'bg-[#131826] border-[#2A2F3F] hover:bg-[#0B0D14]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                          isDone
                            ? 'bg-[#8B5CF6] text-black'
                            : isCurrent
                            ? 'bg-[#8B5CF6]/20 text-[#8B5CF6]'
                            : 'bg-[#0B0D14] text-[#A1A8B8]'
                        }`}
                      >
                        {isDone ? '✓' : idx + 1}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-[#FFFFFF]">{item.name}</div>
                        <div className="text-[10px] text-[#A1A8B8]">
                          {item.phase.toUpperCase()} · {item.targetMuscles[0]}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-[#A1A8B8]" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Workout Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-[#131826] border border-[#2A2F3F] rounded-2xl p-5 text-center shadow-2xl">
            <h4 className="text-base font-bold text-[#FFFFFF] mb-1">Pause Workout?</h4>
            <p className="text-xs text-[#A1A8B8] mb-5">
              You've logged {totalSetsLogged} sets so far. You can return or end the session.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="w-full py-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-black text-xs btn-press shadow-md shadow-purple-500/20"
              >
                Keep Going
              </button>
              <button
                onClick={onCancel}
                className="w-full py-2.5 rounded-xl bg-[#131826] border border-[#2A2F3F] text-[#EF4444] font-semibold text-xs hover:bg-[#0B0D14] btn-press"
              >
                End Session Early
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
