export type UserCohort = 'new' | 'returning' | 'consistent' | 'inactive';

export type FitnessGoal = 'Build Muscle' | 'Lose Fat' | 'Get Stronger' | 'Improve Fitness' | 'Stay Active';

export type ExperienceLevel = 'Complete Beginner' | 'Some Experience' | 'Experienced';

export type EquipmentAccess = 'Full Gym' | 'Basic Gym' | 'Home Equipment' | 'Bodyweight Only';

export interface UserProfile {
  name: string;
  age: number;
  gender: string;
  height: number;
  heightUnit: 'cm' | 'ft';
  weight: number;
  weightUnit: 'kg' | 'lb';
  goal: FitnessGoal;
  experience: ExperienceLevel;
  scheduleDays: number;
  duration: string;
  equipment: EquipmentAccess;
  onboarded: boolean;
  streakCount: number;
  completedWorkoutsCount: number;
  lastWorkoutDate?: string;
  cohort: UserCohort;
  dietPreference: 'veg' | 'non-veg' | 'vegan' | 'eggitarian';
  dailyBudget: number; // in user currency e.g. ₹ or $
  allergies: string[];
}

export type ExercisePhaseType = 'warmup' | 'main' | 'stretch';

export interface ExerciseItem {
  id: string;
  name: string;
  phase: ExercisePhaseType;
  category: string;
  targetMuscles: string[];
  setsCount: number;
  targetReps?: number;
  targetWeight?: number;
  durationSeconds?: number; // for warmups / stretches with timed hold or work
  steps: string[];
  formTip: string;
  commonMistake: string;
  breathingCue: string;
  equipmentNeeded: string;
  visualType: string;
  videoUrl?: string;
  alternative?: {
    name: string;
    reason: string;
  };
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  estimatedMinutes: number;
  warmupItems: ExerciseItem[];
  mainItems: ExerciseItem[];
  stretchItems: ExerciseItem[];
}

export interface SetLog {
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
  timestamp?: number;
}

export interface ExerciseSessionLog {
  exerciseId: string;
  phase: ExercisePhaseType;
  exerciseName: string;
  sets: SetLog[];
}

export interface CompletedWorkoutSummary {
  id: string;
  routineTitle: string;
  date: string;
  durationMinutes: number;
  warmupCount: number;
  mainCount: number;
  stretchCount: number;
  totalSetsLogged: number;
  totalVolumeKg?: number;
  highlightProgression: {
    exercise: string;
    from: string;
    to: string;
    note: string;
  };
  exerciseDetails?: {
    name: string;
    setsCount: number;
    weight: number;
    reps: number;
  }[];
}

export interface StrengthLiftRecord {
  id: string;
  name: string;
  category: string;
  initialWeight: number;
  currentWeight: number;
  currentReps: number;
  oneRepMax: number;
  unit: string;
  history: { date: string; weight: number; reps: number; calculated1RM: number }[];
  nextCalibration: { weight: number; reps: string; tip: string };
}

export interface BodyWeightEntry {
  date: string;
  weight: number;
  note?: string;
}

// Nutrition & Diet
export interface RecipeDetails {
  prepTime: string;
  cookTime: string;
  servings: number;
  ingredients: { item: string; amount: string }[];
  instructions: string[];
  chefTip: string;
}

export interface MealItem {
  id: string;
  name: string;
  timeSlot: string; // e.g. "08:30 AM"
  scheduledHour: number; // 24hr format for countdown
  scheduledMinute: number;
  type: 'Breakfast' | 'Morning Snack' | 'Lunch' | 'Pre-Workout' | 'Dinner';
  calories: number;
  proteinGM: number;
  carbsGM: number;
  fatsGM: number;
  fiberGM: number;
  foodItems: { name: string; quantity: string }[];
  isVeg: boolean;
  isEgg: boolean;
  costTier: 'budget' | 'balanced' | 'premium';
  estimatedCost: number;
  eaten: boolean;
  recipe: RecipeDetails;
}

export interface DietPlanData {
  goal: FitnessGoal;
  targetCalories: number;
  targetProteinGM: number;
  targetCarbsGM: number;
  targetFatsGM: number;
  targetFiberGM: number;
  meals: MealItem[];
}
