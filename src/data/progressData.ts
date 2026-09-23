import { StrengthLiftRecord, BodyWeightEntry, CompletedWorkoutSummary } from '../types';

export const INITIAL_STRENGTH_LIFTS: StrengthLiftRecord[] = [
  {
    id: 'bench-press',
    name: 'Barbell Bench Press',
    category: 'Chest / Push',
    initialWeight: 35.0,
    currentWeight: 45.0,
    currentReps: 8,
    oneRepMax: 55.8,
    unit: 'kg',
    history: [
      { date: 'Aug 28', weight: 35.0, reps: 10, calculated1RM: 46.7 },
      { date: 'Sep 04', weight: 37.5, reps: 9, calculated1RM: 48.9 },
      { date: 'Sep 11', weight: 40.0, reps: 8, calculated1RM: 50.0 },
      { date: 'Sep 17', weight: 42.5, reps: 8, calculated1RM: 53.1 },
      { date: 'Sep 22', weight: 45.0, reps: 8, calculated1RM: 55.8 }
    ],
    nextCalibration: {
      weight: 47.5,
      reps: '6–8 reps',
      tip: 'You maintained solid scapular retraction at 45 kg. Add 2.5 kg micro-plates next session.'
    }
  },
  {
    id: 'barbell-squat',
    name: 'Barbell Back Squat',
    category: 'Legs / Quads',
    initialWeight: 40.0,
    currentWeight: 55.0,
    currentReps: 8,
    oneRepMax: 68.2,
    unit: 'kg',
    history: [
      { date: 'Aug 29', weight: 40.0, reps: 10, calculated1RM: 53.3 },
      { date: 'Sep 05', weight: 45.0, reps: 10, calculated1RM: 60.0 },
      { date: 'Sep 12', weight: 50.0, reps: 8, calculated1RM: 62.5 },
      { date: 'Sep 18', weight: 52.5, reps: 8, calculated1RM: 65.6 },
      { date: 'Sep 21', weight: 55.0, reps: 8, calculated1RM: 68.2 }
    ],
    nextCalibration: {
      weight: 57.5,
      reps: '6–8 reps',
      tip: 'Parallel depth was verified on all 3 sets. Ready to progress to 57.5 kg with focus on midfoot drive.'
    }
  },
  {
    id: 'pull-ups',
    name: 'Pull-Ups / Lat Pulldown',
    category: 'Back / Lats',
    initialWeight: 30.0,
    currentWeight: 40.0,
    currentReps: 8,
    oneRepMax: 49.6,
    unit: 'kg',
    history: [
      { date: 'Aug 28', weight: 30.0, reps: 10, calculated1RM: 40.0 },
      { date: 'Sep 04', weight: 32.5, reps: 10, calculated1RM: 43.3 },
      { date: 'Sep 11', weight: 35.0, reps: 9, calculated1RM: 45.6 },
      { date: 'Sep 17', weight: 37.5, reps: 8, calculated1RM: 46.9 },
      { date: 'Sep 22', weight: 40.0, reps: 8, calculated1RM: 49.6 }
    ],
    nextCalibration: {
      weight: 42.5,
      reps: '6–8 reps',
      tip: 'Full dead-hang lockout achieved without torso swinging. Target 42.5 kg on your next pull day.'
    }
  },
  {
    id: 'shoulder-press',
    name: 'Seated Overhead Press',
    category: 'Shoulders / Delts',
    initialWeight: 12.5,
    currentWeight: 17.5,
    currentReps: 10,
    oneRepMax: 23.3,
    unit: 'kg',
    history: [
      { date: 'Aug 30', weight: 12.5, reps: 12, calculated1RM: 17.5 },
      { date: 'Sep 06', weight: 15.0, reps: 10, calculated1RM: 20.0 },
      { date: 'Sep 13', weight: 15.0, reps: 12, calculated1RM: 21.0 },
      { date: 'Sep 19', weight: 17.5, reps: 8, calculated1RM: 21.9 },
      { date: 'Sep 22', weight: 17.5, reps: 10, calculated1RM: 23.3 }
    ],
    nextCalibration: {
      weight: 20.0,
      reps: '6–8 reps',
      tip: 'Clean vertical bar path stacked over spine. Progress to 20 kg dumbbells or barbell load.'
    }
  },
  {
    id: 'bent-row',
    name: 'Bent-Over Barbell Row',
    category: 'Upper Back / Lats',
    initialWeight: 30.0,
    currentWeight: 42.5,
    currentReps: 8,
    oneRepMax: 52.7,
    unit: 'kg',
    history: [
      { date: 'Aug 30', weight: 30.0, reps: 10, calculated1RM: 40.0 },
      { date: 'Sep 06', weight: 35.0, reps: 9, calculated1RM: 45.6 },
      { date: 'Sep 13', weight: 37.5, reps: 8, calculated1RM: 46.9 },
      { date: 'Sep 19', weight: 40.0, reps: 8, calculated1RM: 50.0 },
      { date: 'Sep 22', weight: 42.5, reps: 8, calculated1RM: 52.7 }
    ],
    nextCalibration: {
      weight: 45.0,
      reps: '8 reps',
      tip: 'Strong 45° hip hinge with zero lumbar rounding. Add +2.5 kg next pull session.'
    }
  },
  {
    id: 'bicep-curl',
    name: 'Dumbbell Bicep Curl',
    category: 'Arms / Biceps',
    initialWeight: 8.0,
    currentWeight: 12.0,
    currentReps: 10,
    oneRepMax: 16.0,
    unit: 'kg',
    history: [
      { date: 'Aug 28', weight: 8.0, reps: 12, calculated1RM: 11.2 },
      { date: 'Sep 04', weight: 9.0, reps: 10, calculated1RM: 12.0 },
      { date: 'Sep 11', weight: 10.0, reps: 10, calculated1RM: 13.3 },
      { date: 'Sep 17', weight: 11.0, reps: 10, calculated1RM: 14.7 },
      { date: 'Sep 22', weight: 12.0, reps: 10, calculated1RM: 16.0 }
    ],
    nextCalibration: {
      weight: 13.0,
      reps: '8–10 reps',
      tip: 'Strict form with elbows pinned to ribs. Calibrated for 13 kg dumbbells next cycle.'
    }
  }
];

export const INITIAL_BODY_WEIGHT_LOGS: BodyWeightEntry[] = [
  { date: 'Aug 26', weight: 74.5, note: 'Starting onboarding baseline' },
  { date: 'Sep 02', weight: 74.1, note: 'Week 1 check-in' },
  { date: 'Sep 09', weight: 73.6, note: 'Consistent water & deficit' },
  { date: 'Sep 16', weight: 73.0, note: 'Waist felt tighter' },
  { date: 'Sep 22', weight: 72.4, note: 'Current check-in' }
];

export const INITIAL_WORKOUT_HISTORY: CompletedWorkoutSummary[] = [
  {
    id: 'session-hist-1',
    routineTitle: 'Full Upper Body Hypertrophy',
    date: 'Sep 22 (Today)',
    durationMinutes: 48,
    warmupCount: 4,
    mainCount: 6,
    stretchCount: 4,
    totalSetsLogged: 18,
    totalVolumeKg: 3560,
    highlightProgression: {
      exercise: 'Bench Press',
      from: '42.5 kg × 8',
      to: '45.0 kg × 8',
      note: 'Hit all 3 target sets with full sternum touch and smooth lockout.'
    },
    exerciseDetails: [
      { name: 'Bench Press', setsCount: 3, weight: 45.0, reps: 8 },
      { name: 'Pull-Ups / Lat Pulldown', setsCount: 3, weight: 40.0, reps: 8 },
      { name: 'Seated Shoulder Press', setsCount: 3, weight: 17.5, reps: 10 },
      { name: 'Bent-Over Barbell Row', setsCount: 3, weight: 42.5, reps: 8 },
      { name: 'Dumbbell Bicep Curl', setsCount: 3, weight: 12.0, reps: 10 },
      { name: 'Tricep Cable Pushdown', setsCount: 3, weight: 25.0, reps: 12 }
    ]
  },
  {
    id: 'session-hist-2',
    routineTitle: 'Legs & Core Power Foundation',
    date: 'Sep 20',
    durationMinutes: 52,
    warmupCount: 4,
    mainCount: 5,
    stretchCount: 4,
    totalSetsLogged: 16,
    totalVolumeKg: 4620,
    highlightProgression: {
      exercise: 'Barbell Back Squat',
      from: '52.5 kg × 8',
      to: '55.0 kg × 8',
      note: 'Maintained chest up and deep parallel depth throughout all 3 sets.'
    },
    exerciseDetails: [
      { name: 'Barbell Back Squat', setsCount: 3, weight: 55.0, reps: 8 },
      { name: 'Romanian Deadlift', setsCount: 3, weight: 60.0, reps: 8 },
      { name: 'Walking Dumbbell Lunges', setsCount: 3, weight: 14.0, reps: 12 },
      { name: 'Standing Calf Raises', setsCount: 4, weight: 35.0, reps: 15 },
      { name: 'Hanging Knee Raises', setsCount: 3, weight: 0, reps: 15 }
    ]
  },
  {
    id: 'session-hist-3',
    routineTitle: 'Upper Body Strength & Pull Focus',
    date: 'Sep 17',
    durationMinutes: 44,
    warmupCount: 4,
    mainCount: 6,
    stretchCount: 4,
    totalSetsLogged: 17,
    totalVolumeKg: 3340,
    highlightProgression: {
      exercise: 'Pull-Ups / Lat Pulldown',
      from: '35.0 kg × 9',
      to: '37.5 kg × 8',
      note: 'Zero momentum used. Clean scapular depression at top of every rep.'
    },
    exerciseDetails: [
      { name: 'Pull-Ups / Lat Pulldown', setsCount: 3, weight: 37.5, reps: 8 },
      { name: 'Incline Dumbbell Press', setsCount: 3, weight: 18.0, reps: 9 },
      { name: 'Bent-Over Barbell Row', setsCount: 3, weight: 40.0, reps: 8 },
      { name: 'Lateral Deltoid Raises', setsCount: 3, weight: 8.0, reps: 12 },
      { name: 'Hammer Bicep Curls', setsCount: 3, weight: 10.0, reps: 10 },
      { name: 'Overhead Tricep Extension', setsCount: 2, weight: 18.0, reps: 12 }
    ]
  },
  {
    id: 'session-hist-4',
    routineTitle: 'Full Upper Body Hypertrophy',
    date: 'Sep 14',
    durationMinutes: 46,
    warmupCount: 4,
    mainCount: 6,
    stretchCount: 4,
    totalSetsLogged: 18,
    totalVolumeKg: 3280,
    highlightProgression: {
      exercise: 'Bench Press',
      from: '40.0 kg × 8',
      to: '42.5 kg × 8',
      note: 'Controlled eccentric tempo; solid leg drive established on bench.'
    },
    exerciseDetails: [
      { name: 'Bench Press', setsCount: 3, weight: 42.5, reps: 8 },
      { name: 'Pull-Ups / Lat Pulldown', setsCount: 3, weight: 35.0, reps: 9 },
      { name: 'Seated Shoulder Press', setsCount: 3, weight: 15.0, reps: 12 },
      { name: 'Bent-Over Barbell Row', setsCount: 3, weight: 37.5, reps: 8 },
      { name: 'Dumbbell Bicep Curl', setsCount: 3, weight: 10.0, reps: 10 },
      { name: 'Tricep Cable Pushdown', setsCount: 3, weight: 22.5, reps: 12 }
    ]
  },
  {
    id: 'session-hist-5',
    routineTitle: 'Upper & Core Mobility Restart',
    date: 'Sep 11',
    durationMinutes: 38,
    warmupCount: 4,
    mainCount: 5,
    stretchCount: 4,
    totalSetsLogged: 15,
    totalVolumeKg: 2890,
    highlightProgression: {
      exercise: 'Seated Shoulder Press',
      from: '12.5 kg × 12',
      to: '15.0 kg × 10',
      note: 'Smooth lockout overhead without hyperextending lower back.'
    },
    exerciseDetails: [
      { name: 'Seated Shoulder Press', setsCount: 3, weight: 15.0, reps: 10 },
      { name: 'Bench Press', setsCount: 3, weight: 40.0, reps: 8 },
      { name: 'Lat Pulldown', setsCount: 3, weight: 35.0, reps: 9 },
      { name: 'Dumbbell Bicep Curl', setsCount: 3, weight: 10.0, reps: 10 },
      { name: 'Tricep Pushdown', setsCount: 3, weight: 20.0, reps: 12 }
    ]
  }
];

export interface MuscleVolumeTarget {
  group: string;
  weeklySets: number;
  optimalMin: number;
  optimalMax: number;
  recoveryPercent: number;
  status: 'optimal' | 'recovering' | 'ready' | 'needs-attention';
  color: string;
}

export const MUSCLE_VOLUME_DATA: MuscleVolumeTarget[] = [
  {
    group: 'Chest (Pectoralis)',
    weeklySets: 15,
    optimalMin: 12,
    optimalMax: 18,
    recoveryPercent: 95,
    status: 'optimal',
    color: '#C7FF3D'
  },
  {
    group: 'Back (Lats & Traps)',
    weeklySets: 16,
    optimalMin: 14,
    optimalMax: 20,
    recoveryPercent: 88,
    status: 'optimal',
    color: '#38BDF8'
  },
  {
    group: 'Legs (Quads & Hamstrings)',
    weeklySets: 14,
    optimalMin: 12,
    optimalMax: 18,
    recoveryPercent: 100,
    status: 'ready',
    color: '#A78BFA'
  },
  {
    group: 'Shoulders (Deltoids)',
    weeklySets: 12,
    optimalMin: 10,
    optimalMax: 16,
    recoveryPercent: 90,
    status: 'optimal',
    color: '#FFB547'
  },
  {
    group: 'Arms (Biceps & Triceps)',
    weeklySets: 11,
    optimalMin: 8,
    optimalMax: 14,
    recoveryPercent: 82,
    status: 'recovering',
    color: '#EC4899'
  },
  {
    group: 'Core & Posterior Chain',
    weeklySets: 8,
    optimalMin: 6,
    optimalMax: 12,
    recoveryPercent: 100,
    status: 'ready',
    color: '#10B981'
  }
];

export interface MilestoneBadge {
  id: string;
  title: string;
  description: string;
  category: 'strength' | 'consistency' | 'technique' | 'milestone';
  icon: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  unlocked: boolean;
  unlockedDate?: string;
}

export const MILESTONES_DATA: MilestoneBadge[] = [
  {
    id: 'century-club',
    title: 'Century Club',
    description: 'Log 100 total working sets across your training',
    category: 'consistency',
    icon: 'trophy',
    currentValue: 128,
    targetValue: 100,
    unit: 'sets',
    unlocked: true,
    unlockedDate: 'Unlocked Sep 17'
  },
  {
    id: 'iron-streak',
    title: 'Iron Consistency',
    description: 'Maintain 3 consecutive weeks meeting scheduled training days',
    category: 'consistency',
    icon: 'flame',
    currentValue: 3,
    targetValue: 3,
    unit: 'weeks',
    unlocked: true,
    unlockedDate: 'Unlocked Sep 21'
  },
  {
    id: 'mobility-master',
    title: 'Mobility & Form Devotee',
    description: 'Complete 100% of warmup and cooldown mobility drills in 5 sessions',
    category: 'technique',
    icon: 'shield',
    currentValue: 5,
    targetValue: 5,
    unit: 'sessions',
    unlocked: true,
    unlockedDate: 'Unlocked Sep 20'
  },
  {
    id: 'bench-bodyweight',
    title: 'Bodyweight Bench Press',
    description: 'Hit a calculated 1RM equal to your bodyweight (72.4 kg)',
    category: 'strength',
    icon: 'dumbbell',
    currentValue: 55.8,
    targetValue: 72.4,
    unit: 'kg',
    unlocked: false
  },
  {
    id: 'volume-titan',
    title: '50K Volume Titan',
    description: 'Lift a cumulative 50,000 kg in total training tonnage',
    category: 'milestone',
    icon: 'zap',
    currentValue: 24350,
    targetValue: 50000,
    unit: 'kg',
    unlocked: false
  },
  {
    id: 'squat-depth',
    title: 'Squat Mastery',
    description: 'Reach a calculated 1RM of 75 kg on Barbell Back Squat',
    category: 'strength',
    icon: 'target',
    currentValue: 68.2,
    targetValue: 75.0,
    unit: 'kg',
    unlocked: false
  }
];

export const CURRENT_WEEK_SCHEDULE = [
  { day: 'Mon', date: 'Sep 16', status: 'rest', label: 'Rest Day' },
  { day: 'Tue', date: 'Sep 17', status: 'completed', label: 'Upper Push/Pull', duration: '44 min' },
  { day: 'Wed', date: 'Sep 18', status: 'rest', label: 'Active Walk' },
  { day: 'Thu', date: 'Sep 19', status: 'rest', label: 'Rest Day' },
  { day: 'Fri', date: 'Sep 20', status: 'completed', label: 'Legs & Core', duration: '52 min' },
  { day: 'Sat', date: 'Sep 21', status: 'rest', label: 'Mobility & Rest' },
  { day: 'Sun', date: 'Sep 22', status: 'completed', label: 'Upper Hypertrophy', duration: '48 min' }
];
