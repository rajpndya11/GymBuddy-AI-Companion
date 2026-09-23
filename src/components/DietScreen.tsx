import React, { useState, useEffect } from 'react';
import { UserProfile, MealItem, RecipeDetails } from '../types';
import { BASE_MEALS, DIET_QUESTIONS } from '../data/dietData';
import {
  Clock,
  Flame,
  CheckCircle2,
  Circle,
  Sparkles,
  BookOpen,
  X,
  Edit3,
  HelpCircle,
  AlertCircle,
  DollarSign
} from 'lucide-react';

interface DietScreenProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const DietScreen: React.FC<DietScreenProps> = ({
  userProfile,
  onUpdateProfile
}) => {
  // Meals state with eaten toggle
  const [meals, setMeals] = useState<MealItem[]>(() => {
    const saved = localStorage.getItem('gymbuddy_meals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return BASE_MEALS;
      }
    }
    return BASE_MEALS;
  });

  // Active filter
  const [dietPref, setDietPref] = useState<'veg' | 'non-veg' | 'vegan' | 'eggitarian'>(
    userProfile.dietPreference || 'veg'
  );

  // Manual budget typing state
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [customBudgetInput, setCustomBudgetInput] = useState<string>(
    userProfile.dailyBudget ? userProfile.dailyBudget.toString() : '200'
  );

  // Selected recipe modal state
  const [selectedRecipe, setSelectedRecipe] = useState<{
    mealName: string;
    recipe: RecipeDetails;
  } | null>(null);

  // Remainder countdown calculation
  const [countdownText, setCountdownText] = useState('');
  const [nextMealName, setNextMealName] = useState('');
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  // Persist meals changes
  useEffect(() => {
    localStorage.setItem('gymbuddy_meals', JSON.stringify(meals));
  }, [meals]);

  // Live remainder countdown clock
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      // Find next scheduled meal that hasn't passed or wrap to tomorrow breakfast
      let upcoming = meals.find((m) => {
        const mealMinutes = m.scheduledHour * 60 + m.scheduledMinute;
        return mealMinutes > currentMinutes;
      });

      if (!upcoming) {
        upcoming = meals[0]; // Next day's breakfast
      }

      setNextMealName(upcoming.name);

      let diffMinutes =
        upcoming.scheduledHour * 60 + upcoming.scheduledMinute - currentMinutes;
      if (diffMinutes < 0) {
        diffMinutes += 24 * 60; // Next day
      }

      const hours = Math.floor(diffMinutes / 60);
      const mins = diffMinutes % 60;
      const secs = 59 - now.getSeconds();

      setCountdownText(
        `${hours}h ${mins < 10 ? '0' : ''}${mins}m ${secs < 10 ? '0' : ''}${secs}s`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [meals]);

  // Dynamic Macro Targets based on Goal & Weight
  const baseWeightKg =
    userProfile.weightUnit === 'lb'
      ? Math.round(userProfile.weight * 0.453592)
      : userProfile.weight || 65;

  let targetCalories = 2200;
  let targetProteinGM = Math.round(baseWeightKg * 2.0); // 2g per kg for beginners
  let targetCarbsGM = Math.round(baseWeightKg * 3.5);
  let targetFatsGM = Math.round(baseWeightKg * 0.9);
  let targetFiberGM = 34; // Essential fiber benchmark

  if (userProfile.goal === 'Lose Fat') {
    targetCalories = Math.round(baseWeightKg * 28);
    targetProteinGM = Math.round(baseWeightKg * 2.2);
    targetCarbsGM = Math.round(baseWeightKg * 2.5);
    targetFatsGM = Math.round(baseWeightKg * 0.8);
    targetFiberGM = 38;
  } else if (userProfile.goal === 'Build Muscle') {
    targetCalories = Math.round(baseWeightKg * 36);
    targetProteinGM = Math.round(baseWeightKg * 2.0);
    targetCarbsGM = Math.round(baseWeightKg * 4.2);
    targetFatsGM = Math.round(baseWeightKg * 1.0);
    targetFiberGM = 35;
  } else if (userProfile.goal === 'Get Stronger') {
    targetCalories = Math.round(baseWeightKg * 34);
    targetProteinGM = Math.round(baseWeightKg * 2.1);
    targetCarbsGM = Math.round(baseWeightKg * 3.8);
    targetFatsGM = Math.round(baseWeightKg * 1.0);
    targetFiberGM = 32;
  }

  // Calculate eaten totals
  const consumedCalories = meals
    .filter((m) => m.eaten)
    .reduce((acc, m) => acc + m.calories, 0);
  const consumedProtein = meals
    .filter((m) => m.eaten)
    .reduce((acc, m) => acc + m.proteinGM, 0);
  const consumedCarbs = meals
    .filter((m) => m.eaten)
    .reduce((acc, m) => acc + m.carbsGM, 0);
  const consumedFats = meals
    .filter((m) => m.eaten)
    .reduce((acc, m) => acc + m.fatsGM, 0);
  const consumedFiber = meals
    .filter((m) => m.eaten)
    .reduce((acc, m) => acc + m.fiberGM, 0);

  const toggleMealEaten = (id: string) => {
    setMeals((prev) =>
      prev.map((m) => (m.id === id ? { ...m, eaten: !m.eaten } : m))
    );
  };

  const handleSaveCustomBudget = () => {
    const parsed = parseInt(customBudgetInput, 10);
    if (!isNaN(parsed) && parsed > 0) {
      onUpdateProfile({ dailyBudget: parsed });
    }
    setIsEditingBudget(false);
  };

  // Filter meals based on diet preference
  const filteredMeals = meals.filter((meal) => {
    if (dietPref === 'veg') return meal.isVeg;
    if (dietPref === 'vegan') return meal.isVeg && !meal.isEgg;
    if (dietPref === 'eggitarian') return meal.isVeg || meal.isEgg;
    return true; // non-veg includes all
  });

  return (
    <div className="w-full max-w-md mx-auto p-4 pb-24 text-[#FFFFFF] animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B5CF6]">
            PERSONALIZED FUEL
          </span>
          <h1 className="text-2xl font-black text-[#FFFFFF] tracking-tight">
            Diet & Nutrition
          </h1>
        </div>

        {/* Reminders Toggle */}
        <button
          onClick={() => setRemindersEnabled(!remindersEnabled)}
          className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors flex items-center gap-1.5 ${
            remindersEnabled
              ? 'bg-[#8B5CF6]/15 border-[#8B5CF6]/30 text-[#8B5CF6]'
              : 'bg-[#131826] border-[#2A2F3F] text-[#A1A8B8]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{remindersEnabled ? 'Reminders On' : 'Muted'}</span>
        </button>
      </div>

      {/* REMAINDER EATING TIME BANNER */}
      <div className="w-full bg-gradient-to-r from-[#141414] via-[#1A1A1A] to-[#141414] border border-[#2A2F3F] rounded-2xl p-4 mb-5 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">
              NEXT EATING WINDOW
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-[#FFFFFF] bg-[#222] px-2 py-0.5 rounded-md">
            {countdownText}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-[#FFFFFF] truncate max-w-[230px]">
              {nextMealName}
            </div>
            <div className="text-[11px] text-[#A1A8B8]">
              Nutrient timing keeps your energy consistent and metabolism firing.
            </div>
          </div>
        </div>
      </div>

      {/* DIETARY PREFERENCE SELECTOR PILLS */}
      <div className="flex gap-1.5 mb-5 bg-[#131826] p-1 rounded-xl border border-[#2A2F3F]">
        {(['veg', 'non-veg', 'eggitarian', 'vegan'] as const).map((pref) => (
          <button
            key={pref}
            onClick={() => {
              setDietPref(pref);
              onUpdateProfile({ dietPreference: pref });
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg capitalize transition-all ${
              dietPref === pref
                ? 'bg-[#8B5CF6] text-black shadow-md'
                : 'text-[#A1A8B8] hover:text-[#FFFFFF]'
            }`}
          >
            {pref === 'eggitarian' ? 'Eggitarian' : pref}
          </button>
        ))}
      </div>

      {/* DAILY CALORIE & MACRO METRICS CARD */}
      <div className="bg-[#131826] border border-[#2A2F3F] rounded-2xl p-4 mb-5">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2A2F3F]">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#FFB547]" />
            <span className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">
              Daily Target ({userProfile.goal})
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-[#8B5CF6]">
            {consumedCalories} / {targetCalories} kcal
          </span>
        </div>

        {/* 4 Macro Bars: Protein, Carbs, Fats, Fiber (GM) */}
        <div className="grid grid-cols-4 gap-2">
          {/* Protein */}
          <div className="bg-[#131826] border border-[#2A2F3F] rounded-xl p-2.5 flex flex-col items-center text-center">
            <span className="text-[10px] uppercase font-bold text-[#8B5CF6]">Protein</span>
            <span className="text-base font-black text-[#FFFFFF] font-mono mt-0.5">
              {consumedProtein}
            </span>
            <span className="text-[10px] text-[#A1A8B8]">/ {targetProteinGM}g</span>
            <div className="w-full bg-[#222] h-1 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#8B5CF6] h-full rounded-full"
                style={{
                  width: `${Math.min(100, (consumedProtein / targetProteinGM) * 100)}%`
                }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div className="bg-[#131826] border border-[#2A2F3F] rounded-xl p-2.5 flex flex-col items-center text-center">
            <span className="text-[10px] uppercase font-bold text-[#60A5FA]">Carbs</span>
            <span className="text-base font-black text-[#FFFFFF] font-mono mt-0.5">
              {consumedCarbs}
            </span>
            <span className="text-[10px] text-[#A1A8B8]">/ {targetCarbsGM}g</span>
            <div className="w-full bg-[#222] h-1 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#60A5FA] h-full rounded-full"
                style={{
                  width: `${Math.min(100, (consumedCarbs / targetCarbsGM) * 100)}%`
                }}
              />
            </div>
          </div>

          {/* Fats */}
          <div className="bg-[#131826] border border-[#2A2F3F] rounded-xl p-2.5 flex flex-col items-center text-center">
            <span className="text-[10px] uppercase font-bold text-[#FFB547]">Fats</span>
            <span className="text-base font-black text-[#FFFFFF] font-mono mt-0.5">
              {consumedFats}
            </span>
            <span className="text-[10px] text-[#A1A8B8]">/ {targetFatsGM}g</span>
            <div className="w-full bg-[#222] h-1 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#FFB547] h-full rounded-full"
                style={{
                  width: `${Math.min(100, (consumedFats / targetFatsGM) * 100)}%`
                }}
              />
            </div>
          </div>

          {/* Fiber */}
          <div className="bg-[#131826] border border-[#2A2F3F] rounded-xl p-2.5 flex flex-col items-center text-center">
            <span className="text-[10px] uppercase font-bold text-[#A78BFA]">Fiber</span>
            <span className="text-base font-black text-[#FFFFFF] font-mono mt-0.5">
              {consumedFiber}
            </span>
            <span className="text-[10px] text-[#A1A8B8]">/ {targetFiberGM}g</span>
            <div className="w-full bg-[#222] h-1 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#A78BFA] h-full rounded-full"
                style={{
                  width: `${Math.min(100, (consumedFiber / targetFiberGM) * 100)}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* DAILY BUDGET SPEND TRACKER WITH MANUAL BUDGET TYPING OPTION */}
      <div className="bg-[#131826] border border-[#2A2F3F] rounded-2xl p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#8B5CF6]" />
            <span className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">
              Daily Diet Budget
            </span>
          </div>
          <button
            onClick={() => setIsEditingBudget(!isEditingBudget)}
            className="text-[11px] font-bold text-[#8B5CF6] flex items-center gap-1 hover:underline"
          >
            <Edit3 className="w-3 h-3" />
            <span>{isEditingBudget ? 'Cancel' : 'Custom Budget'}</span>
          </button>
        </div>

        {/* Manual Budget Typing Input */}
        {isEditingBudget ? (
          <div className="bg-[#181818] p-3 rounded-xl border border-[#2A2F3F] mb-3 flex items-center gap-2 animate-fade-in">
            <span className="text-sm font-bold text-[#8B5CF6]">₹ / $</span>
            <input
              type="number"
              value={customBudgetInput}
              onChange={(e) => setCustomBudgetInput(e.target.value)}
              placeholder="e.g. 200"
              className="flex-1 bg-[#101010] border border-[#333] rounded-lg px-3 py-1.5 text-sm font-mono text-[#FFFFFF] focus:outline-none focus:border-[#8B5CF6]"
            />
            <button
              onClick={handleSaveCustomBudget}
              className="px-3 py-1.5 bg-[#8B5CF6] text-white font-bold text-xs rounded-lg btn-press"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-[#A1A8B8] mb-2">
            <span>
              Target Spend:{' '}
              <strong className="text-[#FFFFFF] font-mono text-sm">
                ₹{userProfile.dailyBudget || 200} / day
              </strong>
            </span>
            <span className="text-[11px] text-[#8B5CF6] bg-[#8B5CF6]/10 px-2 py-0.5 rounded">
              High-Protein Budget Friendly
            </span>
          </div>
        )}

        <p className="text-[11px] text-[#A1A8B8] leading-relaxed">
          Smart savings tip: Bulk-buying soya chunks, whole eggs, and oats provides 50g+ complete protein under ₹70/day.
        </p>
      </div>

      {/* MEALS SCHEDULE & RECIPE EXPLORER */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-[#FFFFFF]">Today's Meals</h2>
          <span className="text-xs text-[#A1A8B8]">{filteredMeals.length} planned meals</span>
        </div>

        <div className="space-y-3">
          {filteredMeals.map((meal) => (
            <div
              key={meal.id}
              className={`p-4 rounded-2xl border transition-all ${
                meal.eaten
                  ? 'bg-[#101010] border-[#2A2F3F] opacity-75'
                  : 'bg-[#131826] border-[#2A2F3F] hover:border-[#333]'
              }`}
            >
              {/* Meal Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleMealEaten(meal.id)}
                    className="mt-0.5 text-[#8B5CF6] hover:scale-110 transition-transform btn-press"
                    aria-label="Toggle eaten"
                  >
                    {meal.eaten ? (
                      <CheckCircle2 className="w-5 h-5 text-[#8B5CF6] fill-[#8B5CF6]/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#666]" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A8B8]">
                        {meal.timeSlot} · {meal.type}
                      </span>
                      {meal.isVeg && (
                        <span className="text-[9px] font-bold text-[#4ADE80] bg-[#4ADE80]/15 px-1.5 py-0.2 rounded border border-[#4ADE80]/30">
                          VEG
                        </span>
                      )}
                    </div>
                    <h3
                      className={`text-sm font-bold text-[#FFFFFF] mt-0.5 ${
                        meal.eaten ? 'line-through text-[#A1A8B8]' : ''
                      }`}
                    >
                      {meal.name}
                    </h3>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-[#8B5CF6]">
                    {meal.calories} kcal
                  </span>
                  <div className="text-[10px] text-[#A1A8B8] font-mono">
                    {meal.proteinGM}g protein
                  </div>
                </div>
              </div>

              {/* Ingredients Preview */}
              <div className="mt-3 pt-2.5 border-t border-[#2A2F3F] flex flex-wrap gap-1.5">
                {meal.foodItems.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-[#131826] text-[#D1D5DB] px-2 py-0.5 rounded-md border border-[#282828]"
                  >
                    {item.name} <strong className="text-[#8B5CF6]">({item.quantity})</strong>
                  </span>
                ))}
              </div>

              {/* View Recipe Button */}
              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={() =>
                    setSelectedRecipe({
                      mealName: meal.name,
                      recipe: meal.recipe
                    })
                  }
                  className="text-xs font-bold text-[#8B5CF6] hover:text-[#7C3AED] flex items-center gap-1.5 bg-[#131826] hover:bg-[#252525] px-3 py-1.5 rounded-xl border border-[#2A2F3F] transition-colors btn-press"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span>View Recipe & Prep</span>
                </button>

                <span className="text-[10px] text-[#A1A8B8] font-mono">
                  Est. ₹{meal.estimatedCost}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ALLERGY AWARENESS CHECKLIST */}
      <div className="bg-[#131826] border border-[#2A2F3F] rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-[#FFB547]" />
          <span className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">
            Allergy & Intolerance Safe
          </span>
        </div>
        <p className="text-[11px] text-[#A1A8B8] mb-3">
          Select any foods you avoid to exclude them from your recipes:
        </p>

        <div className="flex flex-wrap gap-2">
          {['Dairy / Lactose', 'Gluten', 'Peanuts & Nuts', 'Soy', 'Eggs', 'Seafood'].map(
            (allergy) => {
              const isSelected = userProfile.allergies?.includes(allergy);
              return (
                <button
                  key={allergy}
                  onClick={() => {
                    const current = userProfile.allergies || [];
                    const updated = isSelected
                      ? current.filter((a) => a !== allergy)
                      : [...current, allergy];
                    onUpdateProfile({ allergies: updated });
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-[#FF5C5C]/20 border-[#FF5C5C] text-[#FF5C5C]'
                      : 'bg-[#131826] border-[#2A2A2A] text-[#A1A8B8] hover:text-[#FFFFFF]'
                  }`}
                >
                  {isSelected ? `✕ ${allergy}` : `+ ${allergy}`}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* INTERACTIVE DIET QUESTIONS & ANSWERS ACCORDION */}
      <div className="bg-[#131826] border border-[#2A2F3F] rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-[#A78BFA]" />
          <span className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">
            Common Beginner Diet Questions
          </span>
        </div>

        <div className="space-y-2.5">
          {DIET_QUESTIONS.map((q, idx) => (
            <div key={idx} className="bg-[#131826] border border-[#2A2F3F] rounded-xl p-3">
              <div className="text-xs font-bold text-[#FFFFFF] flex items-start gap-2">
                <span className="text-[#8B5CF6]">Q:</span>
                <span>{q.question}</span>
              </div>
              <p className="text-[11px] text-[#9CA3AF] mt-1.5 pl-4 leading-relaxed border-l-2 border-[#8B5CF6]/40">
                {q.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* VIEW RECIPE MODAL (MAKING SURE QC IS 100% OPERATIONAL) */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-[#131826] border border-[#2A2F3F] rounded-3xl p-5 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#2A2F3F]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B5CF6]">
                  PREP & COOK GUIDE
                </span>
                <h3 className="text-base font-bold text-[#FFFFFF] leading-snug">
                  {selectedRecipe.mealName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecipe(null)}
                className="p-1.5 rounded-lg bg-[#222] text-[#A1A8B8] hover:text-[#FFFFFF] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Recipe Body */}
            <div className="overflow-y-auto py-3 space-y-4 flex-1 pr-1">
              {/* Timing metrics */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-[#131826] p-2 rounded-xl border border-[#2A2A2A]">
                  <span className="text-[10px] text-[#A1A8B8] uppercase block">Prep Time</span>
                  <span className="text-xs font-bold text-[#FFFFFF]">
                    {selectedRecipe.recipe.prepTime}
                  </span>
                </div>
                <div className="bg-[#131826] p-2 rounded-xl border border-[#2A2A2A]">
                  <span className="text-[10px] text-[#A1A8B8] uppercase block">Cook Time</span>
                  <span className="text-xs font-bold text-[#FFFFFF]">
                    {selectedRecipe.recipe.cookTime}
                  </span>
                </div>
              </div>

              {/* Ingredients List */}
              <div>
                <h4 className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider mb-2">
                  Ingredients & Portions (Grams)
                </h4>
                <div className="space-y-1.5">
                  {selectedRecipe.recipe.ingredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1 border-b border-[#1E1E1E]"
                    >
                      <span className="text-[#E5E7EB]">{ing.item}</span>
                      <span className="font-mono font-bold text-[#8B5CF6] text-[11px]">
                        {ing.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div>
                <h4 className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider mb-2">
                  Cooking Directions
                </h4>
                <div className="space-y-2">
                  {selectedRecipe.recipe.instructions.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#D1D5DB]">
                      <span className="w-5 h-5 rounded-md bg-[#222] border border-[#333] text-[#8B5CF6] font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chef Tip */}
              <div className="bg-[#131826] border border-[#2A2A2A] rounded-xl p-3 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#A78BFA] shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#A3A3A3] leading-relaxed">
                  <strong className="text-[#FFFFFF]">Chef Tip: </strong>
                  {selectedRecipe.recipe.chefTip}
                </p>
              </div>
            </div>

            {/* Close CTA */}
            <div className="pt-3 border-t border-[#2A2F3F]">
              <button
                onClick={() => setSelectedRecipe(null)}
                className="w-full py-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs transition-colors btn-press"
              >
                Done / Back to Diet Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
