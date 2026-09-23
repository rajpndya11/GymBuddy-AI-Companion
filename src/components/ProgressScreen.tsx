import React, { useState, useEffect } from 'react';
import { UserProfile, CompletedWorkoutSummary, StrengthLiftRecord, BodyWeightEntry } from '../types';
import {
  TrendingUp,
  Award,
  Calendar,
  Flame,
  CheckCircle2,
  Dumbbell,
  Clock,
  Scale,
  Plus,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  Activity,
  X,
  Calculator,
  Compass,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import {
  INITIAL_STRENGTH_LIFTS,
  INITIAL_BODY_WEIGHT_LOGS,
  INITIAL_WORKOUT_HISTORY,
  MUSCLE_VOLUME_DATA,
  MILESTONES_DATA,
  CURRENT_WEEK_SCHEDULE
} from '../data/progressData';

interface ProgressScreenProps {
  userProfile: UserProfile;
  onUpdateProfile?: (updated: Partial<UserProfile>) => void;
  workoutHistory?: CompletedWorkoutSummary[];
  onAddWorkoutSummary?: (summary: CompletedWorkoutSummary) => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  userProfile,
  onUpdateProfile,
  workoutHistory: passedHistory,
  onAddWorkoutSummary
}) => {
  // Timeframe filter: '4w' | '3m' | 'all'
  const [timeframe, setTimeframe] = useState<'4w' | '3m' | 'all'>('4w');

  // Strength Lift selection for progression tracker
  const [strengthLifts, setStrengthLifts] = useState<StrengthLiftRecord[]>(() => {
    const saved = localStorage.getItem('gymbuddy_strength_lifts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_STRENGTH_LIFTS;
      }
    }
    return INITIAL_STRENGTH_LIFTS;
  });

  const [selectedLiftId, setSelectedLiftId] = useState<string>(INITIAL_STRENGTH_LIFTS[0].id);

  // Body weight entries
  const [weightLogs, setWeightLogs] = useState<BodyWeightEntry[]>(() => {
    const saved = localStorage.getItem('gymbuddy_weight_logs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    return [
      {
        date: 'Day 1 Baseline',
        weight: userProfile.weight || 65,
        note: 'Starting onboarding baseline'
      }
    ];
  });

  // Workout sessions history
  const [allWorkouts, setAllWorkouts] = useState<CompletedWorkoutSummary[]>(() => {
    const saved = localStorage.getItem('gymbuddy_workout_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    return [];
  });

  // Sync passed history if present
  useEffect(() => {
    if (passedHistory && passedHistory.length > 0) {
      setAllWorkouts(passedHistory);
    }
  }, [passedHistory]);

  // Persist lifts & weights
  useEffect(() => {
    localStorage.setItem('gymbuddy_strength_lifts', JSON.stringify(strengthLifts));
  }, [strengthLifts]);

  useEffect(() => {
    localStorage.setItem('gymbuddy_weight_logs', JSON.stringify(weightLogs));
  }, [weightLogs]);

  useEffect(() => {
    localStorage.setItem('gymbuddy_workout_history', JSON.stringify(allWorkouts));
  }, [allWorkouts]);

  // Modals and tabs state
  const [showLogLiftModal, setShowLogLiftModal] = useState(false);
  const [showLogWeightModal, setShowLogWeightModal] = useState(false);
  const [showCalcDrawer, setShowCalcDrawer] = useState(false);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  // Form states
  const [inputLiftId, setInputLiftId] = useState(selectedLiftId);
  const [inputLiftWeight, setInputLiftWeight] = useState<string>('47.5');
  const [inputLiftReps, setInputLiftReps] = useState<string>('8');
  const [inputWeightValue, setInputWeightValue] = useState<string>(userProfile.weight.toString());
  const [inputWeightNote, setInputWeightNote] = useState<string>('');

  // 1RM interactive calculator inputs
  const [calcWeight, setCalcWeight] = useState<number>(60);
  const [calcReps, setCalcReps] = useState<number>(8);

  // Selected lift object
  const activeLift =
    strengthLifts.find((l) => l.id === selectedLiftId) || strengthLifts[0];

  // Calculated overall metrics
  const totalCompletedWorkouts = Math.max(
    userProfile.completedWorkoutsCount,
    allWorkouts.length
  );

  const totalVolumeLifted = allWorkouts.reduce((acc, curr) => {
    return acc + (curr.totalVolumeKg || 0);
  }, 0);

  const totalTrainingMinutes = allWorkouts.reduce((acc, curr) => {
    return acc + (curr.durationMinutes || 0);
  }, 0);

  const totalTrainingHours = (totalTrainingMinutes / 60).toFixed(1);

  // Body weight goal calculations
  const currentWeight = weightLogs[weightLogs.length - 1]?.weight || userProfile.weight;
  const initialWeight = weightLogs[0]?.weight || currentWeight;
  const weightDelta = (currentWeight - initialWeight).toFixed(1);
  const isLoss = currentWeight < initialWeight;

  // Target weight calculation based on goal
  const targetWeightGoal =
    userProfile.goal === 'Build Muscle'
      ? Math.round((initialWeight + 4) * 10) / 10
      : userProfile.goal === 'Lose Fat'
      ? Math.round((initialWeight - 5) * 10) / 10
      : initialWeight;

  // Weekly weight change velocity
  const weeksElapsed = Math.max(1, Math.round(weightLogs.length / 2));
  const weeklyVelocity = (Math.abs(currentWeight - initialWeight) / weeksElapsed).toFixed(2);

  // Handle saving new PR or lift set
  const handleSaveLiftPR = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(inputLiftWeight);
    const repsNum = parseInt(inputLiftReps, 10);

    if (isNaN(weightNum) || isNaN(repsNum) || weightNum <= 0 || repsNum <= 0) return;

    // Brzycki 1RM formula: weight * (36 / (37 - reps))
    const calc1RM = repsNum === 1 ? weightNum : Math.round(weightNum * (36 / (37 - repsNum)) * 10) / 10;

    const todayStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

    setStrengthLifts((prev) =>
      prev.map((item) => {
        if (item.id === inputLiftId) {
          const newHistory = [
            ...item.history,
            {
              date: todayStr,
              weight: weightNum,
              reps: repsNum,
              calculated1RM: calc1RM
            }
          ];
          return {
            ...item,
            currentWeight: weightNum,
            currentReps: repsNum,
            oneRepMax: Math.max(item.oneRepMax, calc1RM),
            history: newHistory,
            nextCalibration: {
              weight: Math.round((weightNum + 2.5) * 10) / 10,
              reps: '6–8 reps',
              tip: `New record of ${weightNum} kg logged! Calibrated next session target to ${(weightNum + 2.5).toFixed(1)} kg.`
            }
          };
        }
        return item;
      })
    );

    setShowLogLiftModal(false);
  };

  // Handle saving body weight
  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const wNum = parseFloat(inputWeightValue);
    if (isNaN(wNum) || wNum <= 20 || wNum >= 300) return;

    const todayStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

    const newEntry: BodyWeightEntry = {
      date: todayStr,
      weight: wNum,
      note: inputWeightNote.trim() || 'Daily check-in'
    };

    setWeightLogs((prev) => [...prev, newEntry]);

    if (onUpdateProfile) {
      onUpdateProfile({ weight: wNum });
    }

    setShowLogWeightModal(false);
    setInputWeightNote('');
  };

  // Calculate 1RM from interactive calculator
  const estimated1RM =
    calcReps === 1
      ? calcWeight
      : Math.round(calcWeight * (36 / (37 - calcReps)) * 10) / 10;

  // Render SVG chart for selected lift
  const renderLiftProgressionChart = () => {
    const history = activeLift.history;
    if (!history || history.length < 2) {
      return (
        <div className="w-full bg-[#0B0D14] border border-[#2A2F3F] rounded-2xl p-4 my-3 text-center">
          <p className="text-xs text-[#A1A8B8]">
            Log at least 2 sessions of {activeLift.name} to view the progression curve.
          </p>
        </div>
      );
    }

    const weights = history.map((h) => h.weight);
    const minW = Math.min(...weights) - 5;
    const maxW = Math.max(...weights) + 5;
    const rangeW = maxW - minW || 10;

    const chartWidth = 320;
    const chartHeight = 110;
    const paddingX = 25;
    const paddingY = 20;

    const points = history.map((item, idx) => {
      const x = paddingX + (idx / (history.length - 1)) * (chartWidth - paddingX * 2);
      const y = chartHeight - paddingY - ((item.weight - minW) / rangeW) * (chartHeight - paddingY * 2);
      return { x, y, ...item };
    });

    const pathD = points.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
    }, '');

    // Area fill path
    const areaD = `${pathD} L ${points[points.length - 1].x},${chartHeight} L ${points[0].x},${chartHeight} Z`;

    return (
      <div className="w-full bg-[#0B0D14] border border-[#2A2F3F] rounded-2xl p-3 my-3">
        <div className="flex justify-between items-center mb-1 text-[11px]">
          <span className="text-[#A1A8B8] font-medium uppercase tracking-wider">
            Progression Curve (Working Weight)
          </span>
          <span className="text-[#8B5CF6] font-mono font-bold">
            {history[0].weight}kg → {history[history.length - 1].weight}kg (+
            {(history[history.length - 1].weight - history[0].weight).toFixed(1)}kg)
          </span>
        </div>

        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-28 overflow-visible">
          <defs>
            <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
            </linearGradient>
            <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          <line x1="15" y1="20" x2={chartWidth - 15} y2="20" stroke="#163359" strokeDasharray="3 3" />
          <line x1="15" y1="55" x2={chartWidth - 15} y2="55" stroke="#163359" strokeDasharray="3 3" />
          <line x1="15" y1="90" x2={chartWidth - 15} y2="90" stroke="#163359" strokeDasharray="3 3" />

          {/* Area Fill */}
          <path d={areaD} fill="url(#cyanGradient)" />

          {/* Line Path */}
          <path
            d={pathD}
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#cyan-glow)"
          />

          {/* Data Points */}
          {points.map((pt, idx) => (
            <g key={idx} className="group">
              <circle cx={pt.x} cy={pt.y} r="4.5" fill="#060D17" stroke="#8B5CF6" strokeWidth="2.5" />
              <text
                x={pt.x}
                y={pt.y - 8}
                fill="#F8FAFC"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                {pt.weight}
              </text>
              <text
                x={pt.x}
                y={chartHeight - 4}
                fill="#64748B"
                fontSize="8"
                textAnchor="middle"
              >
                {pt.date}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 pb-28 text-[#FFFFFF] animate-fade-in space-y-5">
      {/* SCREEN TOP HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8B5CF6] flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#8B5CF6]" />
            PROGRESSION & HYPERTROPHY ANALYTICS
          </span>
          <h1 className="text-2xl font-black text-[#FFFFFF] tracking-tight mt-0.5">
            Your Progress
          </h1>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-1.5 pt-1">
          <button
            onClick={() => setShowCalcDrawer(!showCalcDrawer)}
            className="p-1.5 rounded-xl bg-[#131826] hover:bg-[#1E2438] border border-[#2A2F3F] text-xs font-bold text-[#8B5CF6] flex items-center gap-1 shadow-sm transition-all"
            title="1RM Calculator"
          >
            <Calculator className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setInputLiftId(selectedLiftId);
              setShowLogLiftModal(true);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-[#131826] hover:bg-[#1E2438] border border-[#2A2F3F] text-xs font-bold text-[#8B5CF6] flex items-center gap-1 shadow-sm transition-all"
            title="Log new PR or lift test"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>PR</span>
          </button>
          <button
            onClick={() => setShowLogWeightModal(true)}
            className="px-2.5 py-1.5 rounded-xl bg-[#131826] hover:bg-[#1E2438] border border-[#2A2F3F] text-xs font-bold text-[#C4B5FD] flex items-center gap-1 shadow-sm transition-all"
            title="Log body weight check-in"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Weight</span>
          </button>
        </div>
      </div>

      {/* Timeframe Scope Tabs */}
      <div className="flex bg-[#131826] p-1 rounded-xl border border-[#2A2F3F] text-xs">
        {(['4w', '3m', 'all'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTimeframe(t)}
            className={`flex-1 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all ${
              timeframe === t
                ? 'bg-[#8B5CF6] text-black shadow-md shadow-purple-500/20'
                : 'text-[#A1A8B8] hover:text-[#FFFFFF]'
            }`}
          >
            {t === '4w' ? 'Last 4 Weeks' : t === '3m' ? 'Last 3 Months' : 'All Time'}
          </button>
        ))}
      </div>

      {/* INTERACTIVE 1RM REPS CALCULATOR CARD (Expandable / Toggleable) */}
      {showCalcDrawer && (
        <div className="bg-[#131826] border border-[#8B5CF6]/40 rounded-3xl p-5 shadow-2xl relative overflow-hidden animate-scale-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#8B5CF6]" />
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#FFFFFF]">
                Live 1RM & Rep Max Estimator
              </h2>
            </div>
            <button
              onClick={() => setShowCalcDrawer(false)}
              className="p-1 rounded-lg text-[#A1A8B8] hover:text-[#FFFFFF]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-[#A1A8B8] mb-3">
            Calculate your theoretical maximums using the Brzycki & Epley scientific formula.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#A1A8B8] mb-1">
                Working Weight (kg)
              </label>
              <input
                type="number"
                min="1"
                max="400"
                value={calcWeight}
                onChange={(e) => setCalcWeight(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full bg-[#131826] border border-[#2A2F3F] rounded-xl px-3 py-2 text-sm font-mono font-bold text-[#FFFFFF] focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#A1A8B8] mb-1">
                Completed Reps
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={calcReps}
                onChange={(e) => setCalcReps(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full bg-[#131826] border border-[#2A2F3F] rounded-xl px-3 py-2 text-sm font-mono font-bold text-[#FFFFFF] focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>
          </div>

          {/* Computed Table */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#131826] border border-[#2A2F3F] rounded-xl p-2.5">
              <span className="block text-[9px] uppercase font-bold text-[#8B5CF6]">1RM (100%)</span>
              <span className="text-base font-black font-mono text-[#8B5CF6]">{estimated1RM} kg</span>
            </div>
            <div className="bg-[#131826] border border-[#2A2F3F] rounded-xl p-2.5">
              <span className="block text-[9px] uppercase font-bold text-[#A1A8B8]">5RM (87%)</span>
              <span className="text-base font-black font-mono text-[#FFFFFF]">
                {Math.round(estimated1RM * 0.87 * 10) / 10} kg
              </span>
            </div>
            <div className="bg-[#131826] border border-[#2A2F3F] rounded-xl p-2.5">
              <span className="block text-[9px] uppercase font-bold text-[#A1A8B8]">10RM (75%)</span>
              <span className="text-base font-black font-mono text-[#FFFFFF]">
                {Math.round(estimated1RM * 0.75 * 10) / 10} kg
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4 HIGH-IMPACT METRIC CARDS */}
      <div className="grid grid-cols-2 gap-3">
        {/* Metric 1: Completed Workouts */}
        <div className="bg-[#131826] border border-[#2A2F3F] rounded-2xl p-4 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A8B8]">
              Sessions
            </span>
            <div className="w-6 h-6 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center">
              <Flame className="w-3.5 h-3.5 text-[#8B5CF6]" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-mono text-[#FFFFFF]">
              {totalCompletedWorkouts}
            </span>
            <span className="text-xs text-[#A1A8B8] font-medium">completed</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-[#8B5CF6]">
            {totalCompletedWorkouts > 0 ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-ping" />
                <span>Active Streak · On Track</span>
              </>
            ) : (
              <span className="text-[#A1A8B8]">Ready for 1st workout</span>
            )}
          </div>
        </div>

        {/* Metric 2: Total Lifted Volume */}
        <div className="bg-[#131826] border border-[#2A2F3F] rounded-2xl p-4 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A8B8]">
              Volume Lifted
            </span>
            <div className="w-6 h-6 rounded-lg bg-[#C4B5FD]/10 flex items-center justify-center">
              <Dumbbell className="w-3.5 h-3.5 text-[#C4B5FD]" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-mono text-[#C4B5FD]">
              {totalVolumeLifted > 1000
                ? `${(totalVolumeLifted / 1000).toFixed(1)}t`
                : `${totalVolumeLifted}kg`}
            </span>
            <span className="text-xs text-[#A1A8B8] font-medium">tonnage</span>
          </div>
          <div className="mt-2 text-[10px] font-semibold text-[#A1A8B8]">
            {totalCompletedWorkouts > 0
              ? `~${Math.round(totalVolumeLifted / totalCompletedWorkouts)} kg / session`
              : 'Awaiting 1st session'}
          </div>
        </div>

        {/* Metric 3: Training Time */}
        <div className="bg-[#131826] border border-[#2A2F3F] rounded-2xl p-4 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A8B8]">
              Training Time
            </span>
            <div className="w-6 h-6 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-mono text-[#FFFFFF]">
              {totalTrainingHours}
            </span>
            <span className="text-xs text-[#A1A8B8] font-medium">gym hrs</span>
          </div>
          <div className="mt-2 text-[10px] font-semibold text-[#A1A8B8]">
            {totalCompletedWorkouts > 0
              ? `Avg ${Math.round(totalTrainingMinutes / totalCompletedWorkouts)} min / session`
              : 'Awaiting 1st session'}
          </div>
        </div>

        {/* Metric 4: Form & Mobility Compliance */}
        <div className="bg-[#131826] border border-[#2A2F3F] rounded-2xl p-4 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A8B8]">
              Mobility & Recovery
            </span>
            <div className="w-6 h-6 rounded-lg bg-[#818CF8]/10 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#818CF8]" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-mono text-[#818CF8]">
              98%
            </span>
            <span className="text-xs text-[#A1A8B8] font-medium">readiness</span>
          </div>
          <div className="mt-2 text-[10px] font-semibold text-[#8B5CF6]">
            Warmups & cool-downs logged
          </div>
        </div>
      </div>

      {/* RECOVERY & HYPERTROPHY READINESS INDEX */}
      <div className="bg-[#131826] border border-[#2A2F3F] rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#8B5CF6]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
              Central Nervous System & Recovery Status
            </h2>
          </div>
          <span className="text-[10px] font-bold font-mono text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded-full border border-[#10B981]/30">
            PRIMED FOR HYPERTROPHY
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-2">
          <div className="bg-[#131826] border border-[#2A2F3F] rounded-xl p-2.5">
            <span className="block text-[9px] uppercase font-bold text-[#A1A8B8]">Muscular Recovery</span>
            <span className="text-base font-black font-mono text-[#8B5CF6]">94%</span>
            <span className="block text-[9px] text-[#A1A8B8] mt-0.5">Glycogen restored</span>
          </div>
          <div className="bg-[#131826] border border-[#2A2F3F] rounded-xl p-2.5">
            <span className="block text-[9px] uppercase font-bold text-[#A1A8B8]">Joint Fatigue</span>
            <span className="text-base font-black font-mono text-[#C4B5FD]">Low</span>
            <span className="block text-[9px] text-[#A1A8B8] mt-0.5">Rotator cuffs safe</span>
          </div>
          <div className="bg-[#131826] border border-[#2A2F3F] rounded-xl p-2.5">
            <span className="block text-[9px] uppercase font-bold text-[#A1A8B8]">Next Deload</span>
            <span className="text-base font-black font-mono text-[#818CF8]">In 3 Wks</span>
            <span className="block text-[9px] text-[#A1A8B8] mt-0.5">Block cycle 2/4</span>
          </div>
        </div>
      </div>

      {/* WEEKLY ACTIVITY & SCHEDULE MATRIX */}
      <div className="bg-[#131826] border border-[#2A2F3F] rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#8B5CF6]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
              Weekly Activity & Adherence
            </h2>
          </div>
          <span className="text-[11px] font-mono font-bold text-[#8B5CF6] bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 px-2 py-0.5 rounded-full">
            {userProfile.scheduleDays} Target Days / Wk
          </span>
        </div>

        {/* 7-Day Matrix Strip */}
        <div className="grid grid-cols-7 gap-1.5 mb-4">
          {CURRENT_WEEK_SCHEDULE.map((item, idx) => {
            const isCompleted = item.status === 'completed';
            return (
              <div
                key={idx}
                className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all ${
                  isCompleted
                    ? 'bg-[#8B5CF6]/15 border-[#8B5CF6]/40 text-[#FFFFFF]'
                    : 'bg-[#131826] border-[#2A2F3F] text-[#A1A8B8]'
                }`}
              >
                <span className="text-[10px] font-bold uppercase">{item.day}</span>
                <span className="text-[9px] text-[#A1A8B8] mb-1">{item.date.split(' ')[1]}</span>
                {isCompleted ? (
                  <div className="w-5 h-5 rounded-full bg-[#8B5CF6] text-black flex items-center justify-center font-black text-[10px] shadow-sm">
                    ✓
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#0B0D14] text-[#A1A8B8] flex items-center justify-center font-mono text-[9px]">
                    -
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 4 Weeks Consistency Progress Bar */}
        <div className="pt-3 border-t border-[#2A2F3F]">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="font-bold uppercase tracking-wider text-[#A1A8B8] text-[10px]">
              Monthly Training Consistency
            </span>
            <span className="font-mono font-bold text-[#8B5CF6]">92% Consistency</span>
          </div>
          <div className="w-full bg-[#131826] h-2 rounded-full overflow-hidden border border-[#2A2F3F]">
            <div className="bg-[#8B5CF6] h-full w-[92%] rounded-full shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
          </div>
        </div>
      </div>

      {/* ALL-TIME PR HALL OF FAME TABLE */}
      <div className="bg-[#131826] border border-[#2A2F3F] rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#8B5CF6]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
              Personal Records (PR) Hall of Fame
            </h2>
          </div>
          <button
            onClick={() => {
              setInputLiftId(selectedLiftId);
              setShowLogLiftModal(true);
            }}
            className="text-[10px] font-bold text-[#8B5CF6] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>Update PR</span>
          </button>
        </div>

        <p className="text-xs text-[#A1A8B8] mb-3">
          Calculated 1RM and working set benchmarks across your primary compound movements.
        </p>

        <div className="space-y-2">
          {strengthLifts.map((lift) => (
            <div
              key={lift.id}
              onClick={() => setSelectedLiftId(lift.id)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                lift.id === selectedLiftId
                  ? 'bg-[#8B5CF6]/10 border-[#8B5CF6] shadow-md shadow-purple-500/10'
                  : 'bg-[#131826] border-[#2A2F3F] hover:bg-[#0B0D14]'
              }`}
            >
              <div>
                <div className="text-xs font-black text-[#FFFFFF]">{lift.name}</div>
                <div className="text-[10px] text-[#A1A8B8]">
                  Working: {lift.currentWeight}kg × {lift.currentReps} reps
                </div>
              </div>

              <div className="text-right flex items-center gap-3">
                <div>
                  <span className="block text-[9px] uppercase font-bold text-[#8B5CF6]">Est. 1RM</span>
                  <span className="text-sm font-black font-mono text-[#8B5CF6]">
                    {lift.oneRepMax} {lift.unit}
                  </span>
                </div>
                <div className="w-6 h-6 rounded-lg bg-[#0B0D14] flex items-center justify-center text-[#A1A8B8]">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STRENGTH & 1RM PROGRESSION TRACKER (DEEP DIVE) */}
      <div className="bg-[#131826] border border-[#2A2F3F] rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#8B5CF6]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
              Progressive Overload Curve
            </h2>
          </div>
          <span className="text-[10px] text-[#A1A8B8] font-mono">
            {activeLift.name}
          </span>
        </div>

        {/* Horizontal Lift Selector Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {strengthLifts.map((lift) => {
            const isSelected = lift.id === selectedLiftId;
            return (
              <button
                key={lift.id}
                onClick={() => setSelectedLiftId(lift.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#8B5CF6] text-white font-black shadow-md shadow-purple-500/20'
                    : 'bg-[#131826] border border-[#2A2F3F] text-[#A1A8B8] hover:text-[#FFFFFF]'
                }`}
              >
                <span>{lift.name.split(' ')[0]}</span>
                <span className={`text-[10px] font-mono ${isSelected ? 'text-black/70' : 'text-[#A1A8B8]'}`}>
                  {lift.currentWeight}kg
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Lift Deep-Dive Card */}
        <div className="mt-3 bg-[#131826] border border-[#2A2F3F] rounded-2xl p-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A8B8]">
                {activeLift.category}
              </span>
              <h3 className="text-base font-black text-[#FFFFFF]">{activeLift.name}</h3>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C4B5FD]">
                ESTIMATED 1RM
              </span>
              <div className="text-xl font-black font-mono text-[#C4B5FD]">
                {activeLift.oneRepMax} {activeLift.unit}
              </div>
            </div>
          </div>

          {/* Current Working Weight stats */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#2A2F3F] text-center">
            <div className="bg-[#0B0D14] border border-[#2A2F3F] p-2 rounded-xl">
              <span className="block text-[9px] uppercase font-bold text-[#A1A8B8]">Starting</span>
              <span className="text-xs font-mono font-bold text-[#A1A8B8]">
                {activeLift.initialWeight} {activeLift.unit}
              </span>
            </div>
            <div className="bg-[#0B0D14] border border-[#2A2F3F] p-2 rounded-xl">
              <span className="block text-[9px] uppercase font-bold text-[#A1A8B8]">Current Work</span>
              <span className="text-xs font-mono font-bold text-[#FFFFFF]">
                {activeLift.currentWeight}kg × {activeLift.currentReps}
              </span>
            </div>
            <div className="bg-[#0B0D14] border border-[#2A2F3F] p-2 rounded-xl">
              <span className="block text-[9px] uppercase font-bold text-[#8B5CF6]">Net Gain</span>
              <span className="text-xs font-mono font-bold text-[#8B5CF6]">
                +{(activeLift.currentWeight - activeLift.initialWeight).toFixed(1)} {activeLift.unit}
              </span>
            </div>
          </div>

          {/* Dynamic SVG Progression Chart */}
          {renderLiftProgressionChart()}

          {/* AI Coach Progressive Overload Calibration */}
          <div className="bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 rounded-xl p-3 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8B5CF6]">
                  Next Calibration Target:
                </span>
                <span className="text-xs font-black font-mono text-[#FFFFFF]">
                  {activeLift.nextCalibration.weight} {activeLift.unit} ({activeLift.nextCalibration.reps})
                </span>
              </div>
              <p className="text-[11px] text-[#C4B5FD] mt-1 leading-snug">
                {activeLift.nextCalibration.tip}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MUSCLE GROUP WEEKLY VOLUME & RECOVERY */}
      <div className="bg-[#131826] border border-[#2A2F3F] rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#8B5CF6]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
              Muscle Group Volume & Hypertrophy
            </h2>
          </div>
          <span className="text-[10px] text-[#A1A8B8] font-medium">Optimal: 10–20 sets/wk</span>
        </div>

        <p className="text-xs text-[#A1A8B8] mb-4">
          Weekly working sets mapped against scientific hypertrophy thresholds and muscular recovery.
        </p>

        <div className="space-y-3">
          {MUSCLE_VOLUME_DATA.map((item, idx) => {
            const pct = Math.min(100, Math.round((item.weeklySets / item.optimalMax) * 100));
            return (
              <div key={idx} className="bg-[#131826] border border-[#2A2F3F] rounded-xl p-3">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-bold text-[#FFFFFF]">{item.group}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#FFFFFF]">
                      {item.weeklySets} sets
                    </span>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        item.status === 'ready'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : item.status === 'optimal'
                          ? 'bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {item.status === 'ready'
                        ? 'Primed 100%'
                        : item.status === 'optimal'
                        ? 'Optimal Zone'
                        : 'Recovering'}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#0B0D14] h-2 rounded-full overflow-hidden flex border border-[#2A2F3F]/50">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-[#A1A8B8] mt-1">
                  <span>Minimum: {item.optimalMin} sets</span>
                  <span>Target Max: {item.optimalMax} sets</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BODY WEIGHT, VELOCITY & TIMELINE PROJECTION */}
      <div className="bg-[#131826] border border-[#2A2F3F] rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#C4B5FD]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
              Body Weight Trend & Velocity
            </h2>
          </div>
          <button
            onClick={() => setShowLogWeightModal(true)}
            className="text-[10px] font-bold text-[#C4B5FD] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>Log Check-in</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center mb-3">
          <div className="bg-[#131826] border border-[#2A2F3F] rounded-xl p-2.5">
            <span className="block text-[9px] uppercase font-bold text-[#A1A8B8]">Start</span>
            <span className="text-sm font-mono font-bold text-[#A1A8B8]">
              {initialWeight} kg
            </span>
          </div>

          <div className="bg-[#131826] border border-[#2A2F3F] rounded-xl p-2.5">
            <span className="block text-[9px] uppercase font-bold text-[#8B5CF6]">Current</span>
            <span className="text-sm font-mono font-bold text-[#FFFFFF]">
              {currentWeight} kg
            </span>
          </div>

          <div className="bg-[#131826] border border-[#2A2F3F] rounded-xl p-2.5">
            <span className="block text-[9px] uppercase font-bold text-[#A1A8B8]">Net Change</span>
            <span
              className={`text-sm font-mono font-bold ${
                isLoss ? 'text-[#C4B5FD]' : 'text-[#8B5CF6]'
              }`}
            >
              {isLoss ? `${weightDelta} kg` : `+${weightDelta} kg`}
            </span>
          </div>
        </div>

        {/* Velocity Banner */}
        <div className="bg-[#131826] border border-[#2A2F3F] rounded-xl p-3 mb-4 flex items-center justify-between text-xs">
          <div>
            <div className="font-bold text-[#FFFFFF]">Rate of Progress</div>
            <div className="text-[10px] text-[#A1A8B8]">
              Target Goal: {targetWeightGoal} kg ({userProfile.goal})
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-black text-[#8B5CF6]">
              ~{weeklyVelocity} kg / wk
            </span>
            <span className="block text-[9px] text-[#A1A8B8]">Sustainable Pace</span>
          </div>
        </div>

        {/* Recent Weight Check-ins */}
        <div className="space-y-1.5">
          {weightLogs.slice(-4).reverse().map((entry, idx) => (
            <div
              key={idx}
              className="bg-[#131826] border border-[#2A2F3F] rounded-xl px-3 py-2 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#FFFFFF]">{entry.weight} kg</span>
                <span className="text-[10px] text-[#A1A8B8]">{entry.note || 'Check-in'}</span>
              </div>
              <span className="text-[10px] text-[#A1A8B8] font-mono">{entry.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SMART COACH BIOMECHANICAL AUDIT */}
      <div className="bg-[#131826] border border-[#2A2F3F] rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
            GymBuddy AI Structural Analysis
          </h2>
        </div>

        <div className="space-y-3">
          <div className="bg-[#131826] border border-[#2A2F3F] rounded-2xl p-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-[#FFFFFF]">Push vs. Pull Structural Balance</span>
              <span className="text-xs font-mono font-bold text-[#8B5CF6]">1.0 : 1.1 (Ideal)</span>
            </div>
            <p className="text-[11px] text-[#A1A8B8] leading-relaxed">
              Your posterior chain and back volume slightly exceeds your chest pushing volume. This ratio prevents internal shoulder rotation and keeps your rotator cuffs healthy.
            </p>
          </div>

          <div className="bg-[#131826] border border-[#2A2F3F] rounded-2xl p-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-[#FFFFFF]">Hypertrophy Stimulus Index</span>
              <span className="text-xs font-mono font-bold text-[#C4B5FD]">Optimal (88%)</span>
            </div>
            <p className="text-[11px] text-[#A1A8B8] leading-relaxed">
              You calibrated +2.5 kg overload across compound lifts this cycle. Maintain strict 2.5-second controlled eccentric descent to maximize muscle tension.
            </p>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE WORKOUT SESSIONS HISTORY */}
      <div className="bg-[#131826] border border-[#2A2F3F] rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-[#8B5CF6]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
              Completed Sessions History
            </h2>
          </div>
          <span className="text-xs text-[#A1A8B8] font-semibold font-mono">
            {allWorkouts.length} Logged
          </span>
        </div>

        {allWorkouts.length === 0 ? (
          <div className="bg-[#131826] border border-[#2A2F3F] rounded-2xl p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center mx-auto mb-2.5">
              <Dumbbell className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#FFFFFF] mb-1">No Completed Sessions Yet</h4>
            <p className="text-xs text-[#A1A8B8] max-w-xs mx-auto mb-2">
              Finish your first workout session to unlock your lift logs, training volume, and progression analytics.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {allWorkouts.slice(0, 5).map((session) => {
              const isExpanded = expandedSessionId === session.id;
              return (
                <div
                  key={session.id}
                  className="bg-[#131826] border border-[#2A2F3F] rounded-2xl p-4 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#8B5CF6]">
                        {session.date}
                      </span>
                      <h4 className="text-sm font-bold text-[#FFFFFF] mt-0.5">
                        {session.routineTitle}
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-[#FFFFFF]">
                        {session.durationMinutes} min
                      </span>
                      <span className="block text-[10px] text-[#A1A8B8]">
                        {session.totalSetsLogged} sets · ~{session.totalVolumeKg || 0}kg
                      </span>
                    </div>
                  </div>

                  {/* Highlight progression */}
                  <div className="mt-3 bg-[#0B0D14] border border-[#2A2F3F] rounded-xl p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8B5CF6]" />
                      <span className="text-[#A1A8B8] font-medium">
                        {session.highlightProgression?.exercise || 'Exercise'}:
                      </span>
                    </div>
                    <span className="font-mono font-bold text-[#8B5CF6]">
                      {session.highlightProgression?.to || 'Progressed'}
                    </span>
                  </div>

                  {/* Expand toggle for exercise breakdown */}
                  {session.exerciseDetails && session.exerciseDetails.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-[#2A2F3F]">
                      <button
                        onClick={() =>
                          setExpandedSessionId(isExpanded ? null : session.id)
                        }
                        className="w-full flex items-center justify-between text-[11px] text-[#A1A8B8] hover:text-[#8B5CF6] font-bold"
                      >
                        <span>
                          {isExpanded ? 'Hide Lifts Breakdown' : 'View Exercises & Sets'}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="mt-2 space-y-1.5 pt-1">
                          {session.exerciseDetails.map((ex, exIdx) => (
                            <div
                              key={exIdx}
                              className="flex items-center justify-between text-xs p-2 bg-[#0B0D14] border border-[#2A2F3F]/60 rounded-lg"
                            >
                              <span className="text-[#FFFFFF] font-medium">{ex.name}</span>
                              <span className="font-mono font-bold text-[#C4B5FD]">
                                {ex.setsCount} sets × {ex.weight}kg ({ex.reps} reps)
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MILESTONE BADGES & AWARDS */}
      <div className="bg-[#131826] border border-[#2A2F3F] rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#818CF8]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
              Milestones & Achievements
            </h2>
          </div>
          <span className="text-xs font-bold text-[#818CF8]">
            3 Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {MILESTONES_DATA.map((badge) => {
            const pct = Math.min(100, Math.round((badge.currentValue / badge.targetValue) * 100));
            return (
              <div
                key={badge.id}
                className={`border rounded-2xl p-3 flex flex-col justify-between transition-all ${
                  badge.unlocked
                    ? 'bg-[#131826] border-[#818CF8]/40 shadow-sm'
                    : 'bg-[#0B0D14] border-[#2A2F3F] opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base">
                      {badge.icon === 'trophy'
                        ? '🏆'
                        : badge.icon === 'flame'
                        ? '🔥'
                        : badge.icon === 'shield'
                        ? '🛡️'
                        : badge.icon === 'dumbbell'
                        ? '🏋️'
                        : '⚡'}
                    </span>
                    {badge.unlocked ? (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#818CF8]/20 text-[#818CF8]">
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-[#A1A8B8]">
                        {pct}%
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-[#FFFFFF] mt-1.5">{badge.title}</h4>
                  <p className="text-[10px] text-[#A1A8B8] mt-0.5 leading-snug">
                    {badge.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#2A2F3F]">
                  {badge.unlocked ? (
                    <span className="text-[9px] text-[#818CF8] font-bold">
                      {badge.unlockedDate}
                    </span>
                  ) : (
                    <div className="w-full bg-[#0B0D14] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#8B5CF6] h-full rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================================================================= */}
      {/* MODAL 1: LOG NEW LIFT PR / SET */}
      {/* ================================================================= */}
      {showLogLiftModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#131826] border border-[#2A2F3F] rounded-3xl p-5 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-[#8B5CF6]" />
                <h3 className="text-base font-bold text-[#FFFFFF]">Record Lift PR / Set</h3>
              </div>
              <button
                onClick={() => setShowLogLiftModal(false)}
                className="p-1.5 rounded-xl bg-[#131826] border border-[#2A2F3F] text-[#A1A8B8] hover:text-[#FFFFFF]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLiftPR} className="space-y-4">
              {/* Exercise Selector */}
              <div>
                <label className="block text-xs font-bold text-[#A1A8B8] uppercase mb-1.5">
                  Select Lift
                </label>
                <select
                  value={inputLiftId}
                  onChange={(e) => setInputLiftId(e.target.value)}
                  className="w-full bg-[#131826] border border-[#2A2F3F] rounded-xl px-3 py-2.5 text-sm font-semibold text-[#FFFFFF] focus:outline-none focus:border-[#8B5CF6]"
                >
                  {strengthLifts.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Weight & Reps Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#A1A8B8] uppercase mb-1.5">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="400"
                    value={inputLiftWeight}
                    onChange={(e) => setInputLiftWeight(e.target.value)}
                    className="w-full bg-[#131826] border border-[#2A2F3F] rounded-xl px-3 py-2.5 font-mono text-base font-bold text-[#FFFFFF] focus:outline-none focus:border-[#8B5CF6]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A1A8B8] uppercase mb-1.5">
                    Reps
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    max="50"
                    value={inputLiftReps}
                    onChange={(e) => setInputLiftReps(e.target.value)}
                    className="w-full bg-[#131826] border border-[#2A2F3F] rounded-xl px-3 py-2.5 font-mono text-base font-bold text-[#FFFFFF] focus:outline-none focus:border-[#8B5CF6]"
                    required
                  />
                </div>
              </div>

              {/* Estimated 1RM Live Preview */}
              <div className="bg-[#131826] border border-[#2A2F3F] rounded-xl p-3 flex justify-between items-center text-xs">
                <span className="text-[#A1A8B8] font-medium">Estimated 1RM:</span>
                <span className="font-mono font-black text-[#8B5CF6] text-sm">
                  {parseFloat(inputLiftWeight) > 0 && parseInt(inputLiftReps, 10) > 0
                    ? (
                        parseInt(inputLiftReps, 10) === 1
                          ? parseFloat(inputLiftWeight)
                          : parseFloat(inputLiftWeight) * (36 / (37 - parseInt(inputLiftReps, 10)))
                      ).toFixed(1)
                    : '--'}{' '}
                  kg
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogLiftModal(false)}
                  className="flex-1 py-3 rounded-xl bg-[#131826] border border-[#2A2F3F] hover:bg-[#0B0D14] text-xs font-bold text-[#A1A8B8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-black text-black shadow-lg shadow-purple-500/20"
                >
                  Save Lift PR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 2: LOG BODY WEIGHT */}
      {/* ================================================================= */}
      {showLogWeightModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#131826] border border-[#2A2F3F] rounded-3xl p-5 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#C4B5FD]" />
                <h3 className="text-base font-bold text-[#FFFFFF]">Log Body Weight</h3>
              </div>
              <button
                onClick={() => setShowLogWeightModal(false)}
                className="p-1.5 rounded-xl bg-[#131826] border border-[#2A2F3F] text-[#A1A8B8] hover:text-[#FFFFFF]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveWeight} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#A1A8B8] uppercase mb-1.5">
                  Today's Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="250"
                  value={inputWeightValue}
                  onChange={(e) => setInputWeightValue(e.target.value)}
                  className="w-full bg-[#131826] border border-[#2A2F3F] rounded-xl px-3 py-2.5 font-mono text-xl font-black text-[#FFFFFF] focus:outline-none focus:border-[#C4B5FD]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A1A8B8] uppercase mb-1.5">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fasted morning check-in"
                  value={inputWeightNote}
                  onChange={(e) => setInputWeightNote(e.target.value)}
                  className="w-full bg-[#131826] border border-[#2A2F3F] rounded-xl px-3 py-2.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#C4B5FD]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogWeightModal(false)}
                  className="flex-1 py-3 rounded-xl bg-[#131826] border border-[#2A2F3F] hover:bg-[#0B0D14] text-xs font-bold text-[#A1A8B8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#C4B5FD] hover:bg-[#0284c7] text-xs font-black text-black shadow-lg"
                >
                  Save Check-in
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
