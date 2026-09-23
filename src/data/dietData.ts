import { DietPlanData, MealItem } from '../types';

export const BASE_MEALS: MealItem[] = [
  {
    id: 'meal-breakfast',
    name: 'Anabolic Power Oatmeal & Whey Bowl',
    timeSlot: '08:30 AM',
    scheduledHour: 8,
    scheduledMinute: 30,
    type: 'Breakfast',
    calories: 520,
    proteinGM: 36,
    carbsGM: 64,
    fatsGM: 12,
    fiberGM: 9,
    isVeg: true,
    isEgg: false,
    costTier: 'budget',
    estimatedCost: 80,
    foodItems: [
      { name: 'Rolled Oats', quantity: '75g' },
      { name: 'Low-Fat Milk / Soy Milk', quantity: '200ml' },
      { name: 'Whey Protein / Plant Protein Powder', quantity: '1 scoop (30g)' },
      { name: 'Chia Seeds & Crushed Almonds', quantity: '15g' },
      { name: 'Sliced Banana', quantity: '1 medium (100g)' }
    ],
    eaten: false,
    recipe: {
      prepTime: '5 mins',
      cookTime: '5 mins',
      servings: 1,
      ingredients: [
        { item: 'Rolled Oats', amount: '75 grams' },
        { item: 'Milk or Soy Milk', amount: '200 ml' },
        { item: 'Water', amount: '100 ml' },
        { item: 'Protein Powder (Vanilla/Chocolate)', amount: '1 scoop (30g)' },
        { item: 'Chia Seeds', amount: '1 tbsp (10g)' },
        { item: 'Banana', amount: '1 sliced' },
        { item: 'Cinnamon powder', amount: '1 pinch' }
      ],
      instructions: [
        'Add oats, milk, and water into a small pot over medium heat.',
        'Simmer for 3-4 minutes while stirring occasionally until thick and creamy.',
        'Remove from heat and let cool for 60 seconds (prevents protein powder from clumping).',
        'Stir in protein powder and chia seeds vigorously until smooth and glossy.',
        'Top with freshly sliced banana, a dash of cinnamon, and enjoy warm!'
      ],
      chefTip: 'Adding protein powder off the boil keeps the texture silky instead of grainy.'
    }
  },
  {
    id: 'meal-snack-morning',
    name: 'Greek Yogurt & Sprouted Moong Crunch',
    timeSlot: '11:15 AM',
    scheduledHour: 11,
    scheduledMinute: 15,
    type: 'Morning Snack',
    calories: 260,
    proteinGM: 22,
    carbsGM: 28,
    fatsGM: 5,
    fiberGM: 7,
    isVeg: true,
    isEgg: false,
    costTier: 'budget',
    estimatedCost: 45,
    foodItems: [
      { name: 'Greek Yogurt / Thick Curd', quantity: '150g' },
      { name: 'Steamed Sprouted Moong Beans', quantity: '60g' },
      { name: 'Diced Cucumber & Tomato', quantity: '50g' },
      { name: 'Chaat Masala & Lemon Squeeze', quantity: 'To taste' }
    ],
    eaten: false,
    recipe: {
      prepTime: '5 mins',
      cookTime: '0 mins',
      servings: 1,
      ingredients: [
        { item: 'Greek Curd / Hung Curd', amount: '150g' },
        { item: 'Sprouted Green Moong (steamed)', amount: '60g' },
        { item: 'Finely chopped cucumber', amount: '30g' },
        { item: 'Fresh lemon juice', amount: '1 tsp' },
        { item: 'Pink Himalayan salt & roasted cumin', amount: '1/2 tsp' }
      ],
      instructions: [
        'Place cold hung curd in a small mixing bowl.',
        'Toss in the steamed sprouted moong and diced cucumbers for crunch.',
        'Drizzle fresh lemon juice and sprinkle roasted cumin / chaat masala.',
        'Fold together gently. High in gut-friendly probiotics and fiber!'
      ],
      chefTip: 'Steaming the sprouted moong for 2 minutes softens the fiber for easier digestion.'
    }
  },
  {
    id: 'meal-lunch',
    name: 'Grilled Herb Chicken / Soya Paneer Power Plate',
    timeSlot: '01:45 PM',
    scheduledHour: 13,
    scheduledMinute: 45,
    type: 'Lunch',
    calories: 640,
    proteinGM: 48,
    carbsGM: 72,
    fatsGM: 14,
    fiberGM: 11,
    isVeg: false,
    isEgg: false,
    costTier: 'balanced',
    estimatedCost: 140,
    foodItems: [
      { name: 'Herb Grilled Chicken Breast (or Paneer/Tofu 150g)', quantity: '180g' },
      { name: 'Brown Rice / Steamed Quinoa', quantity: '140g cooked' },
      { name: 'Yellow Dal / Black Bean Lentils', quantity: '1 bowl (120g)' },
      { name: 'Steamed Broccoli & French Beans', quantity: '100g' },
      { name: 'Olive Oil drizzle', quantity: '1 tsp (5ml)' }
    ],
    eaten: false,
    recipe: {
      prepTime: '10 mins',
      cookTime: '15 mins',
      servings: 1,
      ingredients: [
        { item: 'Chicken Breast or Firm Paneer/Tofu', amount: '180g' },
        { item: 'Cooked Brown Rice or Rotis', amount: '140g / 2 rotis' },
        { item: 'Broccoli florets & green beans', amount: '100g' },
        { item: 'Garlic paste, black pepper, oregano', amount: '1 tbsp' },
        { item: 'Olive oil', amount: '1 tsp' }
      ],
      instructions: [
        'Marinate chicken breast (or paneer cubes) with minced garlic, black pepper, oregano, and pinch of salt.',
        'Heat a non-stick skillet on medium-high with 1 tsp olive oil.',
        'Sear chicken for 5-6 minutes per side until golden and internal temperature reaches 74°C / 165°F (for paneer, sear 3 mins until edges crisp).',
        'Steam broccoli and green beans for 4 minutes until vibrant green and tender-crisp.',
        'Plate alongside warm brown rice and seasoned yellow lentils.'
      ],
      chefTip: 'Rest the cooked chicken for 3 minutes before slicing to keep it succulent and juicy.'
    }
  },
  {
    id: 'meal-preworkout',
    name: 'Fast-Acting Pre-Workout Fuel',
    timeSlot: '05:00 PM',
    scheduledHour: 17,
    scheduledMinute: 0,
    type: 'Pre-Workout',
    calories: 240,
    proteinGM: 10,
    carbsGM: 42,
    fatsGM: 3,
    fiberGM: 5,
    isVeg: true,
    isEgg: false,
    costTier: 'budget',
    estimatedCost: 35,
    foodItems: [
      { name: 'Whole Wheat Toast', quantity: '2 slices' },
      { name: 'Natural Peanut Butter', quantity: '1 tbsp (16g)' },
      { name: 'Sliced Banana or Black Coffee', quantity: '1 banana / 1 cup' }
    ],
    eaten: false,
    recipe: {
      prepTime: '2 mins',
      cookTime: '2 mins',
      servings: 1,
      ingredients: [
        { item: 'Whole wheat bread', amount: '2 slices' },
        { item: '100% natural peanut butter (no added sugar)', amount: '1 tbsp' },
        { item: 'Fresh banana slices', amount: '1/2 banana' },
        { item: 'Black coffee or green tea', amount: '1 cup (optional)' }
      ],
      instructions: [
        'Toast bread slices to golden crispiness.',
        'Spread natural peanut butter evenly across both slices.',
        'Top with thin coin slices of banana.',
        'Consume 45-60 minutes before your workout for sustained glycogen and zero digestive sluggishness.'
      ],
      chefTip: 'Caffeine from black coffee paired with rapid carbohydrates maximizes workout drive.'
    }
  },
  {
    id: 'meal-dinner',
    name: 'Overnight Muscle Recovery Feast',
    timeSlot: '08:45 PM',
    scheduledHour: 20,
    scheduledMinute: 45,
    type: 'Dinner',
    calories: 550,
    proteinGM: 44,
    carbsGM: 50,
    fatsGM: 14,
    fiberGM: 10,
    isVeg: true,
    isEgg: true,
    costTier: 'budget',
    estimatedCost: 110,
    foodItems: [
      { name: 'Boiled / Scrambled Whole Eggs or Tofu Scramble', quantity: '3 whole eggs + 2 egg whites' },
      { name: 'Whole Wheat Multigrain Rotis', quantity: '2 pieces' },
      { name: 'Mixed Veggie Curry (Spinach & Peas)', quantity: '150g' },
      { name: 'Fresh Rainbow Salad', quantity: '1 bowl' }
    ],
    eaten: false,
    recipe: {
      prepTime: '8 mins',
      cookTime: '12 mins',
      servings: 1,
      ingredients: [
        { item: 'Fresh eggs (or 150g tofu for vegan)', amount: '3 whole + 2 whites' },
        { item: 'Whole wheat rotis / chapatis', amount: '2 rotis' },
        { item: 'Spinach and green peas', amount: '100g' },
        { item: 'Chopped onions, tomatoes, green chilli', amount: '1/2 cup' },
        { item: 'Turmeric and coriander powder', amount: '1/2 tsp each' }
      ],
      instructions: [
        'In a pan, sauté onions and green chillies in 1/2 tsp oil until aromatic.',
        'Add chopped spinach and green peas with turmeric and pinch of salt; cook for 3 minutes.',
        'Whisk the eggs in a bowl and pour directly into the pan (or crumble firm tofu).',
        'Scramble gently on low heat until soft curds form, taking care not to overdry.',
        'Serve with warm whole-wheat chapatis and crisp sliced cucumbers.'
      ],
      chefTip: 'Slower-digesting proteins before sleep promote continuous overnight muscle protein synthesis.'
    }
  }
];

export const DIET_QUESTIONS = [
  {
    question: 'How much protein do I actually need as a beginner?',
    answer: 'Aim for 1.6 to 2.0 grams of protein per kilogram of body weight. For a 65 kg individual, that is roughly 105g–130g daily spread across 3 to 4 meals.'
  },
  {
    question: 'Why is fiber so important for gym results?',
    answer: 'Fiber (aim for 30–38g daily) slows glucose absorption, prevents energy crashes, supports healthy digestion of high-protein diets, and keeps you full while maintaining lean body composition.'
  },
  {
    question: 'What is the ideal pre-workout meal timing?',
    answer: 'Have a carb-focused snack (like banana + toast with peanut butter) 45–60 minutes before training. Avoid heavy fats or large volumes right before lifting.'
  },
  {
    question: 'What are the most budget-friendly protein sources?',
    answer: 'Soya chunks (52% protein by weight, extremely affordable), whole eggs, roasted chana (Bengal gram), low-fat paneer, Greek curd, and lentils/dals paired with rice.'
  },
  {
    question: 'Should I take protein shakes immediately after a workout?',
    answer: 'The "anabolic window" is flexible! Having your post-workout meal or shake within 1–2 hours after training is plenty of time for optimal recovery.'
  }
];
