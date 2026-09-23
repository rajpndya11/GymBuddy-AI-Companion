import React, { useState, useEffect } from 'react';
import { UserProfile, CompletedWorkoutSummary, StrengthLiftRecord, BodyWeightEntry } from '../types';
import {
  TrendingUp,
  Award,
  Calendar,
  Flame,
  ArrowUpRight,
  CheckCircle2,
  Dumbbell,
  Clock,
  Scale,
  Plus,
  Target,
  ShieldCheck,
  Zap,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  Activity,
  X,
  RotateCcw,
  Check
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
        return JSON.parse(saved);
      } catch {
        return INITIAL_BODY_WEIGHT_LOGS;
      }
    }
    return INITIAL_BODY_WEIGHT_LOGS;
  });

  // Workout sessions history
  const [allWorkouts, setAllWorkouts] = useState<CompletedWorkoutSummary[]>(() => {
    const saved = localStorage.getItem('gymbuddy_workout_history');
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
    return INITIAL_WORKOUT_HISTORY;
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

  // Modals state
  const [showLogLiftModal, setShowLogLiftModal] = useState(false);
  const [showLogWeightModal, setShowLogWeightModal] = useState(false);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  // Form states
  const [inputLiftId, setInputLiftId] = useState(selectedLiftId);
  const [inputLiftWeight, setInputLiftWeight] = useState<string>('47.5');
  const [inputLiftReps, setInputLiftReps] = useState<string>('8');
  const [inputWeightValue, setInputWeightValue] = useState<string>(userProfile.weight.toString());
  const [inputWeightNote, setInputWeightNote] = useState<string>('');

  // Selected lift object
  const activeLift =
    strengthLifts.find((l) => l.id === selectedLiftId) || strengthLifts[0];

  // Calculated overall metrics
  const totalCompletedWorkouts = Math.max(
    userProfile.completedWorkoutsCount,
    allWorkouts.length
  );

  const totalVolumeLifted = allWorkouts.reduce((acc, curr) => {
    return acc + (curr.totalVolumeKg || 3200);
  }, 0);

  const totalTrainingMinutes = allWorkouts.reduce((acc, curr) => {
    return acc + (curr.durationMinutes || 45);
  }, 0);

  const totalTrainingHours = (totalTrainingMinutes / 60).toFixed(1);

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
              tip: `New record of ${weightNum} kg logged! GymBuddy calibrated your next session target to ${(weightNum + 2.5).toFixed(1)} kg.`
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

  // Weight goal calculations
  const currentWeight = weightLogs[weightLogs.length - 1]?.weight || userProfile.weight;
  const initialWeight = weightLogs[0]?.weight || currentWeight;
  const weightDelta = (currentWeight - initialWeight).toFixed(1);
  const isLoss = currentWeight < initialWeight;

  // Render SVG chart for selected lift
  const renderLiftProgressionChart = () => {
    const history = activeLift.history;
    if (!history || history.length < 2) return null;

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
      <div className="w-full bg-[#0D0D0D] border border-[#222] rounded-2xl p-3 my-3">
        <div className="flex justify-between items-center mb-1 text-[11px]">
          <span className="text-[#8A8A8A] font-medium uppercase tracking-wider">
            Progression Curve (Working Weight)
          </span>
          <span className="text-[#C7FF3D] font-mono font-bold">
            {history[0].weight}kg → {history[history.length - 1].weight}kg (+
            {(history[history.length - 1].weight - history[0].weight).toFixed(1)}kg)
          </span>
        </div>

        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-28 overflow-visible">
          <defs>
            <linearGradient id="limeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C7FF3D" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#C7FF3D" stopOpacity="0.0" />
            </linearGradient>
            <filter id="chart-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          <line x1="15" y1="20" x2={chartWidth - 15} y2="20" stroke="#222" strokeDasharray="3 3" />
          <line x1="15" y1="55" x2={chartWidth - 15} y2="55" stroke="#222" strokeDasharray="3 3" />
          <line x1="15" y1="90" x2={chartWidth - 15} y2="90" stroke="#222" strokeDasharray="3 3" />

          {/* Area Fill */}
          <path d={areaD} fill="url(#limeGradient)" />

          {/* Line Path */}
          <path
            d={pathD}
            fill="none"
            stroke="#C7FF3D"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#chart-glow)"
          />

          {/* Data Points */}
          {points.map((pt, idx) => (
            <g key={idx} className="group">
              <circle cx={pt.x} cy={pt.y} r="4.5" fill="#0A0A0A" stroke="#C7FF3D" strokeWidth="2.5" />
              {/* Text label */}
              <text
                x={pt.x}
                y={pt.y - 8}
                fill="#F5F5F5"
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
                fill="#737373"
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
    <div className="w-full max-w-md mx-auto p-4 pb-28 text-[#F5F5F5] animate-fade-in space-y-6">
      {/* SCREEN TOP HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C7FF3D] flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#C7FF3D]" />
            PROGRESSION & HYPERTROPHY ANALYTICS
          </span>
          <h1 className="text-3xl font-black text-[#F5F5F5] tracking-tight mt-0.5">
            Your Progress
          </h1>
        </div>

        {/* Quick Log Action Dropdown / Buttons */}
        <div className="flex items-center gap-1.5 pt-1">
          <button
            onClick={() => {
              setInputLiftId(selectedLiftId);
              setShowLogLiftModal(true);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-[#1C1C1C] hover:bg-[#282828] border border-[#333] text-xs font-bold text-[#C7FF3D] flex items-center gap-1 shadow-sm transition-all"
            title="Log new PR or lift test"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>PR</span>
          </button>

          <button
            onClick={() => setShowLogWeightModal(true)}
            className="px-2.5 py-1.5 rounded-xl bg-[#1C1C1C] hover:bg-[#282828] border border-[#333] text-xs font-bold text-[#38BDF8] flex items-center gap-1 shadow-sm transition-all"
            title="Log body weight"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Weight</span>
          </button>
        </div>
      </div>

      {/* TIMEFRAME FILTER PILLS */}
      <div className="bg-[#121212] border border-[#242424] p-1 rounded-2xl flex items-center justify-between text-xs font-bold">
        {[
          { id: '4w', label: 'Last 4 Weeks' },
          { id: '3m', label: 'Past 3 Months' },
          { id: 'all', label: 'All-Time Records' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTimeframe(tab.id as any)}
            className={`flex-1 py-1.5 text-center rounded-xl transition-all ${
              timeframe === tab.id
                ? 'bg-[#222222] text-[#C7FF3D] shadow-md'
                : 'text-[#8A8A8A] hover:text-[#D4D4D4]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4 HIGH-IMPACT PERFORMANCE STATS (HUD TILES) */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Metric 1: Workouts */}
        <div className="bg-gradient-to-br from-[#171717] to-[#121212] border border-[#282828] rounded-2xl p-4 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A8A]">
              Workouts
            </span>
            <div className="w-6 h-6 rounded-lg bg-[#C7FF3D]/10 flex items-center justify-center">
              <Flame className="w-3.5 h-3.5 text-[#C7FF3D]" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-mono text-[#F5F5F5]">
              {totalCompletedWorkouts < 10 ? `0${totalCompletedWorkouts}` : totalCompletedWorkouts}
            </span>
            <span className="text-xs text-[#8A8A8A] font-medium">completed</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-[#C7FF3D]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C7FF3D] animate-ping" />
            <span>3-Week Active Streak 🔥</span>
          </div>
        </div>

        {/* Metric 2: Total Tonnage / Volume */}
        <div className="bg-gradient-to-br from-[#171717] to-[#121212] border border-[#282828] rounded-2xl p-4 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A8A]">
              Volume Lifted
            </span>
            <div className="w-6 h-6 rounded-lg bg-[#38BDF8]/10 flex items-center justify-center">
              <Dumbbell className="w-3.5 h-3.5 text-[#38BDF8]" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-mono text-[#F5F5F5]">
              {(totalVolumeLifted / 1000).toFixed(1)}k
            </span>
            <span className="text-xs text-[#8A8A8A] font-medium">kg total</span>
          </div>
          <div className="mt-2 text-[10px] font-semibold text-[#8A8A8A]">
            ~{Math.round(totalVolumeLifted / Math.max(1, totalCompletedWorkouts))} kg / session
          </div>
        </div>

        {/* Metric 3: Training Hours */}
        <div className="bg-gradient-to-br from-[#171717] to-[#121212] border border-[#282828] rounded-2xl p-4 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A8A]">
              Training Time
            </span>
            <div className="w-6 h-6 rounded-lg bg-[#FFB547]/10 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-[#FFB547]" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-mono text-[#F5F5F5]">
              {totalTrainingHours}
            </span>
            <span className="text-xs text-[#8A8A8A] font-medium">hrs in gym</span>
          </div>
          <div className="mt-2 text-[10px] font-semibold text-[#8A8A8A]">
            Avg 46 min / session
          </div>
        </div>

        {/* Metric 4: Mobility & Form Adherence */}
        <div className="bg-gradient-to-br from-[#171717] to-[#121212] border border-[#282828] rounded-2xl p-4 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A8A]">
              Form & Mobility
            </span>
            <div className="w-6 h-6 rounded-lg bg-[#A78BFA]/10 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A78BFA]" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-mono text-[#A78BFA]">
              100%
            </span>
            <span className="text-xs text-[#8A8A8A] font-medium">compliance</span>
          </div>
          <div className="mt-2 text-[10px] font-semibold text-[#C7FF3D]">
            Warmup & stretch completed
          </div>
        </div>
      </div>

      {/* WEEKLY ACTIVITY & SCHEDULE MATRIX */}
      <div className="bg-[#121212] border border-[#242424] rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#C7FF3D]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F5]">
              Weekly Activity & Adherence
            </h2>
          </div>
          <span className="text-[11px] font-mono font-bold text-[#C7FF3D] bg-[#C7FF3D]/10 px-2 py-0.5 rounded-full">
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
                    ? 'bg-[#19240E] border-[#C7FF3D]/40 text-[#F5F5F5]'
                    : 'bg-[#171717] border-[#262626] text-[#666]'
                }`}
              >
                <span className="text-[10px] font-bold uppercase">{item.day}</span>
                <span className="text-[9px] text-[#888] mb-1">{item.date.split(' ')[1]}</span>
                {isCompleted ? (
                  <div className="w-5 h-5 rounded-full bg-[#C7FF3D] text-black flex items-center justify-center font-black text-[10px] shadow-sm">
                    ✓
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#202020] text-[#555] flex items-center justify-center font-mono text-[9px]">
                    -
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 4 Weeks Consistency Progress Bar */}
        <div className="pt-3 border-t border-[#222]">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="font-bold uppercase tracking-wider text-[#8A8A8A] text-[10px]">
              Monthly Training Consistency
            </span>
            <span className="font-mono font-bold text-[#C7FF3D]">92% Consistency</span>
          </div>
          <div className="w-full bg-[#1C1C1C] h-2 rounded-full overflow-hidden">
            <div className="bg-[#C7FF3D] h-full w-[92%] rounded-full shadow-[0_0_8px_rgba(199,255,61,0.5)]" />
          </div>
        </div>
      </div>

      {/* STRENGTH & 1RM PROGRESSION TRACKER */}
      <div className="bg-[#121212] border border-[#242424] rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#C7FF3D]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F5]">
              Strength & 1RM Progression
            </h2>
          </div>
          <button
            onClick={() => {
              setInputLiftId(selectedLiftId);
              setShowLogLiftModal(true);
            }}
            className="text-[10px] font-bold text-[#C7FF3D] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>Record Set</span>
          </button>
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
                    ? 'bg-[#C7FF3D] text-black shadow-md'
                    : 'bg-[#1A1A1A] border border-[#282828] text-[#A3A3A3] hover:text-[#F5F5F5]'
                }`}
              >
                <span>{lift.name.split(' ')[0]}</span>
                <span className={`text-[10px] font-mono ${isSelected ? 'text-black/70' : 'text-[#777]'}`}>
                  {lift.currentWeight}kg
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Lift Deep-Dive Card */}
        <div className="mt-3 bg-[#171717] border border-[#262626] rounded-2xl p-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A8A]">
                {activeLift.category}
              </span>
              <h3 className="text-base font-black text-[#F5F5F5]">{activeLift.name}</h3>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8]">
                ESTIMATED 1RM
              </span>
              <div className="text-xl font-black font-mono text-[#38BDF8]">
                {activeLift.oneRepMax} {activeLift.unit}
              </div>
            </div>
          </div>

          {/* Current Working Weight stats */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#242424] text-center">
            <div className="bg-[#121212] p-2 rounded-xl">
              <span className="block text-[9px] uppercase font-bold text-[#8A8A8A]">Starting</span>
              <span className="text-xs font-mono font-bold text-[#A3A3A3]">
                {activeLift.initialWeight} {activeLift.unit}
              </span>
            </div>
            <div className="bg-[#121212] p-2 rounded-xl">
              <span className="block text-[9px] uppercase font-bold text-[#8A8A8A]">Current Work</span>
              <span className="text-xs font-mono font-bold text-[#F5F5F5]">
                {activeLift.currentWeight}kg × {activeLift.currentReps}
              </span>
            </div>
            <div className="bg-[#121212] p-2 rounded-xl">
              <span className="block text-[9px] uppercase font-bold text-[#C7FF3D]">Net Gain</span>
              <span className="text-xs font-mono font-bold text-[#C7FF3D]">
                +{(activeLift.currentWeight - activeLift.initialWeight).toFixed(1)} {activeLift.unit}
              </span>
            </div>
          </div>

          {/* Dynamic SVG Progression Chart */}
          {renderLiftProgressionChart()}

          {/* AI Coach Progressive Overload Calibration */}
          <div className="bg-[#1F2913]/60 border border-[#C7FF3D]/30 rounded-xl p-3 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#C7FF3D] shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C7FF3D]">
                  Next Calibration Target:
                </span>
                <span className="text-xs font-black font-mono text-[#F5F5F5]">
                  {activeLift.nextCalibration.weight} {activeLift.unit} ({activeLift.nextCalibration.reps})
                </span>
              </div>
              <p className="text-[11px] text-[#A3E635] mt-1 leading-snug">
                {activeLift.nextCalibration.tip}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MUSCLE GROUP WEEKLY VOLUME & RECOVERY */}
      <div className="bg-[#121212] border border-[#242424] rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#38BDF8]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F5]">
              Muscle Group Volume & Hypertrophy
            </h2>
          </div>
          <span className="text-[10px] text-[#8A8A8A] font-medium">Optimal: 10–20 sets/wk</span>
        </div>

        <p className="text-xs text-[#8A8A8A] mb-4">
          Weekly working sets mapped against scientific hypertrophy thresholds and muscular recovery.
        </p>

        <div className="space-y-3">
          {MUSCLE_VOLUME_DATA.map((item, idx) => {
            const pct = Math.min(100, Math.round((item.weeklySets / item.optimalMax) * 100));
            return (
              <div key={idx} className="bg-[#171717] border border-[#242424] rounded-xl p-3">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-bold text-[#F5F5F5]">{item.group}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#F5F5F5]">
                      {item.weeklySets} sets
                    </span>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        item.status === 'ready'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : item.status === 'optimal'
                          ? 'bg-[#C7FF3D]/10 text-[#C7FF3D]'
                          : 'bg-amber-500/10 text-amber-400'
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
                <div className="w-full bg-[#202020] h-2 rounded-full overflow-hidden flex">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-[#737373] mt-1">
                  <span>Minimum: {item.optimalMin} sets</span>
                  <span>Target Max: {item.optimalMax} sets</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BODY WEIGHT & COMPOSITION TRACKER */}
      <div className="bg-[#121212] border border-[#242424] rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#38BDF8]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F5]">
              Body Weight Trend
            </h2>
          </div>
          <button
            onClick={() => setShowLogWeightModal(true)}
            className="text-[10px] font-bold text-[#38BDF8] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>Log Check-in</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center mb-4">
          <div className="bg-[#171717] border border-[#262626] rounded-xl p-2.5">
            <span className="block text-[9px] uppercase font-bold text-[#8A8A8A]">Start</span>
            <span className="text-sm font-mono font-bold text-[#A3A3A3]">
              {initialWeight} kg
            </span>
          </div>

          <div className="bg-[#171717] border border-[#262626] rounded-xl p-2.5">
            <span className="block text-[9px] uppercase font-bold text-[#38BDF8]">Current</span>
            <span className="text-sm font-mono font-bold text-[#F5F5F5]">
              {currentWeight} kg
            </span>
          </div>

          <div className="bg-[#171717] border border-[#262626] rounded-xl p-2.5">
            <span className="block text-[9px] uppercase font-bold text-[#8A8A8A]">Net Change</span>
            <span
              className={`text-sm font-mono font-bold ${
                isLoss ? 'text-[#38BDF8]' : 'text-[#C7FF3D]'
              }`}
            >
              {isLoss ? `${weightDelta} kg` : `+${weightDelta} kg`}
            </span>
          </div>
        </div>

        {/* Recent Weight Check-ins */}
        <div className="space-y-1.5">
          {weightLogs.slice(-4).reverse().map((entry, idx) => (
            <div
              key={idx}
              className="bg-[#171717] border border-[#222] rounded-xl px-3 py-2 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#F5F5F5]">{entry.weight} kg</span>
                <span className="text-[10px] text-[#737373]">{entry.note || 'Check-in'}</span>
              </div>
              <span className="text-[10px] text-[#8A8A8A] font-mono">{entry.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SMART COACH WEEKLY ANALYSIS & RECOVERY */}
      <div className="bg-gradient-to-br from-[#171717] to-[#121212] border border-[#2A2A2A] rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#C7FF3D]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F5]">
            GymBuddy AI Performance Report
          </h2>
        </div>

        <div className="space-y-3">
          <div className="bg-[#1C1C1C] border border-[#292929] rounded-2xl p-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-[#F5F5F5]">Push vs. Pull Structural Balance</span>
              <span className="text-xs font-mono font-bold text-[#C7FF3D]">1.0 : 1.1 (Ideal)</span>
            </div>
            <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
              Your back and lat volume slightly exceeds your chest pushing volume. This ideal ratio prevents internal shoulder rotation and keeps your rotator cuffs resilient.
            </p>
          </div>

          <div className="bg-[#1C1C1C] border border-[#292929] rounded-2xl p-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-[#F5F5F5]">Hypertrophy Stimulus Index</span>
              <span className="text-xs font-mono font-bold text-[#38BDF8]">Strong (88%)</span>
            </div>
            <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
              You calibrated +2.5 kg overload across 4 primary lifts this month. Continue prioritizing 2.5s controlled eccentric negatives to maximize muscle tension.
            </p>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE WORKOUT SESSIONS HISTORY */}
      <div className="bg-[#121212] border border-[#242424] rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-[#C7FF3D]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F5]">
              Completed Sessions History
            </h2>
          </div>
          <span className="text-xs text-[#8A8A8A] font-semibold font-mono">
            {allWorkouts.length} Logged
          </span>
        </div>

        <div className="space-y-3">
          {allWorkouts.slice(0, 5).map((session) => {
            const isExpanded = expandedSessionId === session.id;
            return (
              <div
                key={session.id}
                className="bg-[#171717] border border-[#262626] rounded-2xl p-4 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#C7FF3D]">
                      {session.date}
                    </span>
                    <h4 className="text-sm font-bold text-[#F5F5F5] mt-0.5">
                      {session.routineTitle}
                    </h4>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-[#F5F5F5]">
                      {session.durationMinutes} min
                    </span>
                    <span className="block text-[10px] text-[#8A8A8A]">
                      {session.totalSetsLogged} sets · ~{session.totalVolumeKg || 3200}kg
                    </span>
                  </div>
                </div>

                {/* Highlight progression */}
                <div className="mt-3 bg-[#111] border border-[#222] rounded-xl p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C7FF3D]" />
                    <span className="text-[#D1D5DB] font-medium">
                      {session.highlightProgression?.exercise || 'Exercise'}:
                    </span>
                  </div>
                  <span className="font-mono font-bold text-[#C7FF3D]">
                    {session.highlightProgression?.to || 'Progressed'}
                  </span>
                </div>

                {/* Expand toggle for exercise breakdown */}
                {session.exerciseDetails && session.exerciseDetails.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-[#222]">
                    <button
                      onClick={() =>
                        setExpandedSessionId(isExpanded ? null : session.id)
                      }
                      className="w-full flex items-center justify-between text-[11px] text-[#8A8A8A] hover:text-[#C7FF3D] font-bold"
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
                            className="flex items-center justify-between text-xs p-1.5 bg-[#121212] rounded-lg"
                          >
                            <span className="text-[#E5E5E5] font-medium">{ex.name}</span>
                            <span className="font-mono font-bold text-[#A3A3A3]">
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
      </div>

      {/* MILESTONE BADGES & AWARDS */}
      <div className="bg-[#121212] border border-[#242424] rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#A78BFA]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F5]">
              Milestones & Achievements
            </h2>
          </div>
          <span className="text-xs font-bold text-[#A78BFA]">
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
                    ? 'bg-[#181818] border-[#A78BFA]/40 shadow-sm'
                    : 'bg-[#131313] border-[#222] opacity-75'
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
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#A78BFA]/20 text-[#A78BFA]">
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-[#777]">
                        {pct}%
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-[#F5F5F5] mt-1.5">{badge.title}</h4>
                  <p className="text-[10px] text-[#8A8A8A] mt-0.5 leading-snug">
                    {badge.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#222]">
                  {badge.unlocked ? (
                    <span className="text-[9px] text-[#A78BFA] font-bold">
                      {badge.unlockedDate}
                    </span>
                  ) : (
                    <div className="w-full bg-[#202020] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#C7FF3D] h-full rounded-full"
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
          <div className="w-full max-w-sm bg-[#171717] border border-[#2E2E2E] rounded-3xl p-5 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-[#C7FF3D]" />
                <h3 className="text-base font-bold text-[#F5F5F5]">Record Lift PR / Set</h3>
              </div>
              <button
                onClick={() => setShowLogLiftModal(false)}
                className="p-1.5 rounded-xl bg-[#222] text-[#8A8A8A] hover:text-[#F5F5F5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLiftPR} className="space-y-4">
              {/* Exercise Selector */}
              <div>
                <label className="block text-xs font-bold text-[#8A8A8A] uppercase mb-1.5">
                  Select Lift
                </label>
                <select
                  value={inputLiftId}
                  onChange={(e) => setInputLiftId(e.target.value)}
                  className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-3 py-2.5 text-sm font-semibold text-[#F5F5F5] focus:outline-none focus:border-[#C7FF3D]"
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
                  <label className="block text-xs font-bold text-[#8A8A8A] uppercase mb-1.5">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="400"
                    value={inputLiftWeight}
                    onChange={(e) => setInputLiftWeight(e.target.value)}
                    className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-3 py-2.5 font-mono text-base font-bold text-[#F5F5F5] focus:outline-none focus:border-[#C7FF3D]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8A8A8A] uppercase mb-1.5">
                    Reps
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    max="50"
                    value={inputLiftReps}
                    onChange={(e) => setInputLiftReps(e.target.value)}
                    className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-3 py-2.5 font-mono text-base font-bold text-[#F5F5F5] focus:outline-none focus:border-[#C7FF3D]"
                    required
                  />
                </div>
              </div>

              {/* Estimated 1RM Live Preview */}
              <div className="bg-[#121212] border border-[#242424] rounded-xl p-3 flex justify-between items-center text-xs">
                <span className="text-[#8A8A8A] font-medium">Estimated 1RM:</span>
                <span className="font-mono font-black text-[#C7FF3D] text-sm">
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
                  className="flex-1 py-3 rounded-xl bg-[#222] hover:bg-[#282828] text-xs font-bold text-[#8A8A8A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#C7FF3D] hover:bg-[#bbf02e] text-xs font-extrabold text-black shadow-lg"
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
          <div className="w-full max-w-sm bg-[#171717] border border-[#2E2E2E] rounded-3xl p-5 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#38BDF8]" />
                <h3 className="text-base font-bold text-[#F5F5F5]">Log Body Weight</h3>
              </div>
              <button
                onClick={() => setShowLogWeightModal(false)}
                className="p-1.5 rounded-xl bg-[#222] text-[#8A8A8A] hover:text-[#F5F5F5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveWeight} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#8A8A8A] uppercase mb-1.5">
                  Today's Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="250"
                  value={inputWeightValue}
                  onChange={(e) => setInputWeightValue(e.target.value)}
                  className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-3 py-2.5 font-mono text-xl font-black text-[#F5F5F5] focus:outline-none focus:border-[#38BDF8]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8A8A8A] uppercase mb-1.5">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fasted morning check-in"
                  value={inputWeightNote}
                  onChange={(e) => setInputWeightNote(e.target.value)}
                  className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-3 py-2.5 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogWeightModal(false)}
                  className="flex-1 py-3 rounded-xl bg-[#222] hover:bg-[#282828] text-xs font-bold text-[#8A8A8A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#38BDF8] hover:bg-[#20a7e6] text-xs font-extrabold text-black shadow-lg"
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
