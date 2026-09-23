import { WorkoutRoutine, ExerciseItem } from '../types';

// Warm-up library
export const WARMUP_EXERCISES: Record<string, ExerciseItem> = {
  armCircles: {
    id: 'w-arm-circles',
    name: 'Arm Circles & Chest Openers',
    phase: 'warmup',
    category: 'Dynamic Mobility',
    targetMuscles: ['Shoulders', 'Chest', 'Rotator Cuff'],
    setsCount: 1,
    durationSeconds: 45,
    targetReps: 15,
    steps: [
      'Stand upright with feet shoulder-width apart and arms outstretched laterally.',
      'Perform small, controlled forward circles, gradually widening the diameter.',
      'Reverse direction for 20 seconds, then transition into rhythmic chest openers.'
    ],
    formTip: 'Keep your core braced and avoid shrugging your neck. Let the shoulders rotate fluidly.',
    commonMistake: 'Rushing through jerky motions without engaging the scapular stabilizers.',
    breathingCue: 'Inhale as your chest expands, exhale as your hands cross forward.',
    equipmentNeeded: 'None (Bodyweight)',
    visualType: 'arm-circles',
    alternative: {
      name: 'Wall Angel Slides',
      reason: 'If standing circles feel tight on shoulders, slide arms along a flat wall.'
    }
  },
  catCow: {
    id: 'w-cat-cow',
    name: 'Cat-Cow & Torso Mobility',
    phase: 'warmup',
    category: 'Spinal Decompression',
    targetMuscles: ['Spine', 'Thoracic Core', 'Lower Back'],
    setsCount: 1,
    durationSeconds: 45,
    targetReps: 10,
    steps: [
      'Position hands directly beneath shoulders and knees beneath hips on the mat.',
      'Inhale deeply as you arch your spine, dropping the belly and lifting the gaze (Cow).',
      'Exhale slowly while tucking the chin and rounding your back upward (Cat).'
    ],
    formTip: 'Initiate each wave of motion from the pelvis up to the base of the skull.',
    commonMistake: 'Over-extending your neck rather than articulating each spinal vertebra.',
    breathingCue: 'Inhale on Cow (extension), deep exhale on Cat (flexion).',
    equipmentNeeded: 'Exercise Mat',
    visualType: 'cat-cow',
    alternative: {
      name: 'Seated Torso Twists',
      reason: 'If floor kneeling is uncomfortable, perform seated spinal rotations.'
    }
  },
  hipOpenerSquats: {
    id: 'w-hip-openers',
    name: 'Bodyweight Air Squats & Hip Openers',
    phase: 'warmup',
    category: 'Lower Body Activation',
    targetMuscles: ['Hips', 'Glutes', 'Quadriceps', 'Ankles'],
    setsCount: 1,
    durationSeconds: 45,
    targetReps: 12,
    steps: [
      'Stand with feet just outside hip-width, toes turned out 15 degrees.',
      'Send hips backward and down smoothly into a deep, comfortable bodyweight squat.',
      'Pause for 1 second at the bottom with elbows gently nudging the inner knees outward.',
      'Drive evenly through the midfoot and heel to stand tall.'
    ],
    formTip: 'Keep your chest proud and spine neutral. Do not collapse knees inward.',
    commonMistake: 'Rising up onto toes or letting the chest collapse onto the knees.',
    breathingCue: 'Inhale on descent, exhale as you drive up through the floor.',
    equipmentNeeded: 'None (Bodyweight)',
    visualType: 'hip-squat',
    alternative: {
      name: 'Assisted Pole Squats',
      reason: 'Hold a gym rack or sturdy bar for balance if ankle mobility is restricted.'
    }
  },
  scapularPulls: {
    id: 'w-scapular-pulls',
    name: 'Scapular Pull-Downs & Shoulder Rolls',
    phase: 'warmup',
    category: 'Scapular Activation',
    targetMuscles: ['Lats', 'Upper Traps', 'Rhomboids'],
    setsCount: 1,
    durationSeconds: 45,
    targetReps: 12,
    steps: [
      'Stand tall or hang from a bar with arms extended overhead.',
      'Without bending elbows, depress and pinch your shoulder blades down toward back pockets.',
      'Hold the active retracted position for 1 second, then relax back up with control.'
    ],
    formTip: 'Arms stay completely straight—this isolates the scapular muscles.',
    commonMistake: 'Bending elbows and turning the warmup into a mini bicep pull.',
    breathingCue: 'Exhale as you pull shoulder blades down, inhale as they elevate.',
    equipmentNeeded: 'Pull-up bar or resistance band',
    visualType: 'scap-pull',
    alternative: {
      name: 'Resistance Band Pull-Aparts',
      reason: 'Hold a light band at chest height and pull apart with straight arms.'
    }
  }
};

// Main strength & hypertrophy exercises
export const MAIN_EXERCISES: Record<string, ExerciseItem> = {
  benchPress: {
    id: 'm-bench-press',
    name: 'Bench Press',
    phase: 'main',
    category: 'Horizontal Push',
    targetMuscles: ['Pectorals (Chest)', 'Triceps', 'Anterior Deltoids'],
    setsCount: 3,
    targetReps: 10,
    targetWeight: 40,
    steps: [
      'Set your shoulders flat against the bench and grip the bar slightly wider than shoulder width.',
      'Lower the bar with smooth control toward your mid-chest, keeping elbows tucked at ~60°.',
      'Drive the bar upward in a slight J-curve until arms are extended without locking hard.'
    ],
    formTip: 'Plant both feet firmly into the floor and keep your shoulder blades pinched together.',
    commonMistake: 'Flaring elbows 90° out to the sides or bouncing the barbell off the sternum.',
    breathingCue: 'Inhale smoothly on the descent, exhale forcefully through the concentric press.',
    equipmentNeeded: 'Flat Bench & Barbell',
    visualType: 'bench-press',
    videoUrl: '/videos/bench-press.mp4',
    alternative: {
      name: 'Seated Chest Press Machine',
      reason: 'Provides a guided path with zero stabilization anxiety for beginners.'
    }
  },
  pullUps: {
    id: 'm-pull-ups',
    name: 'Pull-Ups / Lat Pulldown',
    phase: 'main',
    category: 'Vertical Pull',
    targetMuscles: ['Latissimus Dorsi (Lats)', 'Rhomboids', 'Biceps'],
    setsCount: 3,
    targetReps: 10,
    targetWeight: 35,
    steps: [
      'Grip the bar slightly wider than shoulder width with an overhand grip.',
      'Depress your shoulders down and drive your elbows toward your ribs with chest held proud.',
      'Squeeze your lats at the bottom pause, then return under controlled eccentric resistance.'
    ],
    formTip: 'Think about driving your elbows into your back pockets rather than pulling with your hands.',
    commonMistake: 'Swinging the torso backward or using excessive momentum to complete reps.',
    breathingCue: 'Inhale at the top, exhale smoothly as you pull down to collarbone level.',
    equipmentNeeded: 'Lat Pulldown Machine or Cable Station',
    visualType: 'pull-ups',
    videoUrl: '/videos/pull-ups.mp4',
    alternative: {
      name: 'Underhand Close-Grip Pulldown',
      reason: 'Easier on the shoulder joints and provides strong bicep assistance.'
    }
  },
  seatedShoulderPress: {
    id: 'm-shoulder-press',
    name: 'Seated Shoulder Press',
    phase: 'main',
    category: 'Vertical Push',
    targetMuscles: ['Anterior & Lateral Deltoids', 'Triceps', 'Upper Traps'],
    setsCount: 3,
    targetReps: 10,
    targetWeight: 15,
    steps: [
      'Sit on an upright bench with dumbbells at shoulder height, palms angled slightly inward.',
      'Press both weights smoothly overhead until arms are extended above your crown.',
      'Lower under control back to ear level over 2 full seconds before the next repetition.'
    ],
    formTip: 'Keep your lower back supported flat against the backrest without arching your spine.',
    commonMistake: 'Pressing weights forward in front of the face or letting weights clank together overhead.',
    breathingCue: 'Inhale as weights touch ear level, exhale as you press vertically.',
    equipmentNeeded: 'Adjustable Bench & Dumbbells',
    visualType: 'shoulder-press',
    videoUrl: '/videos/shoulder-press.mp4',
    alternative: {
      name: 'Machine Overhead Press',
      reason: 'Offers locked vertical safety handles for beginners learning shoulder mechanics.'
    }
  },
  bentOverRow: {
    id: 'm-bent-row',
    name: 'Bent-Over Barbell Row',
    phase: 'main',
    category: 'Horizontal Pull',
    targetMuscles: ['Latissimus Dorsi', 'Middle Trapezius', 'Posterior Deltoids', 'Core'],
    setsCount: 3,
    targetReps: 10,
    targetWeight: 35,
    steps: [
      'Hinge at hips at a 45-degree angle with knees soft and spine locked straight.',
      'Pull the bar toward your belly button, driving your elbows back behind your torso.',
      'Pause for a beat to squeeze your mid-back, then lower with deliberate control.'
    ],
    formTip: 'Maintain a rigid neutral spine from tailbone to crown. Look at the floor 6 feet ahead.',
    commonMistake: 'Rounding the lower back like a fishing rod or standing up to jerk the weight.',
    breathingCue: 'Inhale in the hinged hang, exhale as you draw the bar into your waist.',
    equipmentNeeded: 'Barbell or Dumbbells',
    visualType: 'bent-row',
    videoUrl: '/videos/bent-row.mp4',
    alternative: {
      name: 'Seated Cable Row',
      reason: 'Removes lower back hinge fatigue while delivering identical mid-back recruitment.'
    }
  },
  dumbbellCurl: {
    id: 'm-dumbbell-curl',
    name: 'Dumbbell Bicep Curl',
    phase: 'main',
    category: 'Arm Isolation',
    targetMuscles: ['Biceps Brachii', 'Brachialis', 'Forearms'],
    setsCount: 3,
    targetReps: 12,
    targetWeight: 12,
    steps: [
      'Stand tall with dumbbells resting at your thighs, palms facing forward or neutral.',
      'Keep elbows pinned gently at your sides as you curl both weights up toward shoulders.',
      'Squeeze your biceps hard at the peak for 1 second, then lower slowly over 2-3 seconds.'
    ],
    formTip: 'Your upper arms should act as motionless hinges—only your forearms move.',
    commonMistake: 'Swinging the torso or throwing your elbows forward to cheat the weight up.',
    breathingCue: 'Exhale on the curl upward, inhale as you lower the dumbbells smoothly.',
    equipmentNeeded: 'Dumbbells',
    visualType: 'dumbbell-curl',
    videoUrl: '/videos/bicep-curl.mp4',
    alternative: {
      name: 'EZ-Bar Cable Curl',
      reason: 'Constant tension throughout the movement with reduced wrist strain.'
    }
  },
  tricepPushdown: {
    id: 'm-tricep-pushdown',
    name: 'Tricep Cable Pushdown',
    phase: 'main',
    category: 'Arm Isolation',
    targetMuscles: ['Triceps Brachii (Lateral & Medial Head)'],
    setsCount: 3,
    targetReps: 12,
    targetWeight: 20,
    steps: [
      'Grip the cable rope or straight bar with elbows bent at 90° tucked closely to your ribs.',
      'Push the attachment straight downward until your arms are fully extended.',
      'At the bottom, flare the rope slightly outward to emphasize peak tricep contraction.',
      'Return up to 90° with control without letting elbows travel forward.'
    ],
    formTip: 'Keep your elbows glued to your sides; do not let them drift back and forth.',
    commonMistake: 'Leaning your bodyweight over the bar to push down with chest and shoulders.',
    breathingCue: 'Exhale as you press downward, inhale as hands rise to chest height.',
    equipmentNeeded: 'Cable Tower & Rope',
    visualType: 'tricep-pushdown',
    alternative: {
      name: 'Overhead Dumbbell Extension',
      reason: 'Trains the long head of the tricep if cables are occupied in the gym.'
    }
  },
  gobletSquat: {
    id: 'm-goblet-squat',
    name: 'Goblet / Barbell Squat',
    phase: 'main',
    category: 'Lower Body Compound',
    targetMuscles: ['Quadriceps', 'Gluteus Maximus', 'Hamstrings', 'Core'],
    setsCount: 3,
    targetReps: 10,
    targetWeight: 40,
    steps: [
      'Hold a dumbbell vertically against your upper chest, elbows tucked inside knees.',
      'Brace your core and sit your hips back and down until thighs reach parallel with the floor.',
      'Keep weight balanced across midfoot and heel, keeping chest high.',
      'Drive powerfully through the floor to return to a tall standing posture.'
    ],
    formTip: 'Push knees gently outward in the direction of your toes as you descend.',
    commonMistake: 'Caving knees inward or letting heels lift off the floor.',
    breathingCue: 'Deep belly inhale at the top, brace core on descent, exhale on drive up.',
    equipmentNeeded: 'Dumbbell or Kettlebell',
    visualType: 'squat',
    videoUrl: '/videos/squat.mp4',
    alternative: {
      name: 'Leg Press Machine',
      reason: 'Provides back support and removes balance demands while building quad strength.'
    }
  }
};

// Post-workout stretching & cool-down exercises
export const STRETCH_EXERCISES: Record<string, ExerciseItem> = {
  doorwayChestStretch: {
    id: 's-chest-stretch',
    name: 'Doorway Chest & Shoulder Stretch',
    phase: 'stretch',
    category: 'Static Mobility',
    targetMuscles: ['Pectoralis Major', 'Anterior Deltoid', 'Bicep Tendons'],
    setsCount: 1,
    durationSeconds: 45,
    steps: [
      'Stand inside a doorway or next to a gym rack pillar.',
      'Place your forearm against the door frame with elbow bent at 90 degrees.',
      'Gently step one foot forward and rotate your chest away until you feel a gentle opening stretch.',
      'Hold smoothly without bouncing for 20 seconds, then switch to the other side.'
    ],
    formTip: 'Relax into the stretch and breathe deep into the belly. Never force through joint pain.',
    commonMistake: 'Aggressively wrenching the shoulder joint rather than feeling muscle elongation.',
    breathingCue: 'Deep 4-second belly inhale, slow 6-second relaxing exhale.',
    equipmentNeeded: 'Doorframe or Squat Rack Pillar',
    visualType: 'chest-stretch',
    alternative: {
      name: 'Clasped Hands Behind Back',
      reason: 'Interlace fingers behind your lower back and gently straighten arms.'
    }
  },
  overheadLatStretch: {
    id: 's-lat-stretch',
    name: 'Overhead Lat & Tricep Stretch',
    phase: 'stretch',
    category: 'Upper Body Decompression',
    targetMuscles: ['Latissimus Dorsi', 'Triceps Long Head', 'Intercostals'],
    setsCount: 1,
    durationSeconds: 45,
    steps: [
      'Reach one arm up overhead, bend the elbow so hand rests behind your neck.',
      'Use the opposite hand to gently guide the elbow back and slightly sideways.',
      'Hold the lengthening stretch for 20 seconds, then switch arms with an easy breath.'
    ],
    formTip: 'Stand tall with ribs held neutral; do not excessively arch the lower back.',
    commonMistake: 'Pulling the neck forward with the hand rather than stretching the arm.',
    breathingCue: 'Exhale and visualize the side of your back lengthening.',
    equipmentNeeded: 'None (Bodyweight)',
    visualType: 'overhead-lat-stretch',
    alternative: {
      name: 'Rack-Assisted Lat Hang',
      reason: 'Hold onto a rack bar at hip height and sit hips back to lengthen the back.'
    }
  },
  standingQuadStretch: {
    id: 's-quad-stretch',
    name: 'Standing Quad & Hip Flexor Stretch',
    phase: 'stretch',
    category: 'Lower Body Release',
    targetMuscles: ['Quadriceps', 'Psoas / Hip Flexors'],
    setsCount: 1,
    durationSeconds: 45,
    steps: [
      'Stand tall next to a wall or bench for light balance support.',
      'Bend one knee backward and hold your ankle or foot with your hand.',
      'Gently pull the heel toward your glute while keeping both knees aligned together.',
      'Hold for 20 seconds, then transition to the opposite leg.'
    ],
    formTip: 'Squeeze the glute of the stretching leg to deepen the hip flexor release.',
    commonMistake: 'Flaring the knee out sideways or hyper-extending the lumbar spine.',
    breathingCue: 'Smooth continuous diaphragmatic breaths to trigger parasympathetic recovery.',
    equipmentNeeded: 'Wall or Bench (for balance)',
    visualType: 'quad-stretch',
    alternative: {
      name: 'Half-Kneeling Hip Flexor Stretch',
      reason: 'Kneel on one knee on a mat to stabilize balance completely.'
    }
  },
  childsPose: {
    id: 's-childs-pose',
    name: "Child's Pose & Recovery Breathing",
    phase: 'stretch',
    category: 'Full Body Down-Regulation',
    targetMuscles: ['Spinal Erectors', 'Lats', 'Glutes', 'Nervous System'],
    setsCount: 1,
    durationSeconds: 60,
    steps: [
      'Kneel on the gym mat with big toes touching and knees spread comfortably wide.',
      'Sit hips back onto your heels and walk both hands out in front of you across the mat.',
      'Rest your forehead gently on the mat and sink your chest toward the floor.',
      'Inhale deeply through your nose for 4 seconds, and exhale slowly through mouth for 6 seconds.'
    ],
    formTip: 'Let all tension drain from your neck, shoulders, and lower back with each breath.',
    commonMistake: 'Keeping hips hoisted up high in the air instead of sinking back toward heels.',
    breathingCue: 'Slow 4-second box breaths to signal your body that workout effort is finished.',
    equipmentNeeded: 'Exercise Mat',
    visualType: 'childs-pose',
    alternative: {
      name: 'Seated Forward Fold',
      reason: 'Sit with legs extended and gently fold forward toward shins.'
    }
  }
};

// Preset routines: Each has warmups BEFORE, main exercises in the MIDDLE, and stretches AFTER
export const WORKOUT_ROUTINES: WorkoutRoutine[] = [
  {
    id: 'routine-upper-body',
    title: 'Upper Body Power & Form',
    subtitle: 'Balanced chest, back & arm development',
    category: 'Upper Body',
    estimatedMinutes: 42,
    warmupItems: [
      WARMUP_EXERCISES.armCircles,
      WARMUP_EXERCISES.catCow,
      WARMUP_EXERCISES.scapularPulls
    ],
    mainItems: [
      MAIN_EXERCISES.benchPress,
      MAIN_EXERCISES.pullUps,
      MAIN_EXERCISES.seatedShoulderPress,
      MAIN_EXERCISES.bentOverRow,
      MAIN_EXERCISES.dumbbellCurl,
      MAIN_EXERCISES.tricepPushdown
    ],
    stretchItems: [
      STRETCH_EXERCISES.doorwayChestStretch,
      STRETCH_EXERCISES.overheadLatStretch,
      STRETCH_EXERCISES.childsPose
    ]
  },
  {
    id: 'routine-full-body-beginner',
    title: 'Beginner Full Body Foundation',
    subtitle: 'Simple, effective foundational routine',
    category: 'Full Body',
    estimatedMinutes: 32,
    warmupItems: [
      WARMUP_EXERCISES.armCircles,
      WARMUP_EXERCISES.hipOpenerSquats,
      WARMUP_EXERCISES.catCow
    ],
    mainItems: [
      MAIN_EXERCISES.gobletSquat,
      MAIN_EXERCISES.benchPress,
      MAIN_EXERCISES.pullUps,
      MAIN_EXERCISES.seatedShoulderPress,
      MAIN_EXERCISES.dumbbellCurl
    ],
    stretchItems: [
      STRETCH_EXERCISES.standingQuadStretch,
      STRETCH_EXERCISES.doorwayChestStretch,
      STRETCH_EXERCISES.childsPose
    ]
  },
  {
    id: 'routine-20min-restart',
    title: '20-Min Low-Friction Restart',
    subtitle: 'Gentle warmup, 3 key lifts & restorative cool-down',
    category: '20-Min Restart',
    estimatedMinutes: 20,
    warmupItems: [
      WARMUP_EXERCISES.armCircles,
      WARMUP_EXERCISES.catCow
    ],
    mainItems: [
      MAIN_EXERCISES.benchPress,
      MAIN_EXERCISES.pullUps,
      MAIN_EXERCISES.gobletSquat
    ],
    stretchItems: [
      STRETCH_EXERCISES.doorwayChestStretch,
      STRETCH_EXERCISES.childsPose
    ]
  }
];
