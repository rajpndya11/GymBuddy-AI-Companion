import React, { useState } from 'react';
import { UserProfile, FitnessGoal, ExperienceLevel, EquipmentAccess } from '../types';
import { Logo } from './Logo';
import { ArrowRight, ArrowLeft, Check, Sparkles, Dumbbell } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1); // 1 to 10, then 11 is Personalisation Summary

  // Form states - empty default name for first-time onboarding
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(24);
  const [gender, setGender] = useState('Male');
  const [height, setHeight] = useState<number>(175);
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [weight, setWeight] = useState<number>(65);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [goal, setGoal] = useState<FitnessGoal>('Build Muscle');
  const [experience, setExperience] = useState<ExperienceLevel>('Complete Beginner');
  const [scheduleDays, setScheduleDays] = useState<number>(4);
  const [duration, setDuration] = useState('45–60 min');
  const [equipment, setEquipment] = useState<EquipmentAccess>('Full Gym');

  const totalQuestions = 10;

  const handleNext = () => {
    if (step === 1 && !name.trim()) {
      return; // Require name on step 1
    }
    if (step < totalQuestions + 1) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => s - 1);
    }
  };

  const finishOnboarding = () => {
    const finalProfile: UserProfile = {
      name: name.trim() || 'Athlete',
      age: age || 24,
      gender,
      height: height || 175,
      heightUnit,
      weight: weight || 65,
      weightUnit,
      goal,
      experience,
      scheduleDays,
      duration,
      equipment,
      onboarded: true,
      streakCount: 0,
      completedWorkoutsCount: 0,
      cohort: 'new',
      dietPreference: 'veg',
      dailyBudget: 200,
      allergies: []
    };

    // Initialize fresh weight log with user's baseline weight
    const baselineWeightLog = [
      {
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weight: weight || 65,
        note: 'Starting onboarding baseline'
      }
    ];

    localStorage.setItem('gymbuddy_weight_logs', JSON.stringify(baselineWeightLog));
    localStorage.setItem('gymbuddy_workout_history', JSON.stringify([]));
    localStorage.setItem('gymbuddy_profile', JSON.stringify(finalProfile));
    onComplete(finalProfile);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex flex-col justify-between max-w-md mx-auto p-5 pb-10">
      {/* Top Bar with Step counter */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-4">
          <Logo size="sm" showTagline={false} />
          {step <= totalQuestions && (
            <span className="text-xs font-mono font-bold text-[#8A8A8A]">
              0{step} / 10
            </span>
          )}
        </div>

        {/* Segmented step bar */}
        {step <= totalQuestions && (
          <div className="w-full bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden mb-6">
            <div
              className="bg-[#C7FF3D] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / totalQuestions) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* QUESTION BODIES (Steps 1 to 10) */}
      <div className="flex-1 flex flex-col justify-center my-4 animate-fade-in">
        {step === 1 && (
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C7FF3D]">
              LET'S GET TO KNOW YOU
            </span>
            <h2 className="text-3xl font-black text-[#F5F5F5] tracking-tight mt-1 mb-2">
              What should I call you?
            </h2>
            <p className="text-xs text-[#8A8A8A] mb-6">
              Your name helps me personalise your coaching cues and sessions.
            </p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim()) {
                  handleNext();
                }
              }}
              placeholder="e.g. Alex, Sam, Jordan..."
              autoFocus
              className="w-full bg-[#121212] border border-[#2A2A2A] focus:border-[#C7FF3D] rounded-2xl p-4 text-xl font-bold text-[#F5F5F5] placeholder-[#555] focus:outline-none transition-colors"
            />
            {step === 1 && !name.trim() && (
              <p className="text-[11px] text-[#888] mt-2 italic">
                Please type your name or nickname to personalize your companion.
              </p>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C7FF3D]">
              BIOMETRIC FOUNDATION
            </span>
            <h2 className="text-3xl font-black text-[#F5F5F5] tracking-tight mt-1 mb-2">
              How old are you?
            </h2>
            <p className="text-xs text-[#8A8A8A] mb-6">
              This helps me calibrate recovery times and heart rate targets.
            </p>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value, 10) || 0)}
                placeholder="24"
                className="w-32 bg-[#121212] border border-[#2A2A2A] focus:border-[#C7FF3D] rounded-2xl p-4 text-3xl font-black text-[#F5F5F5] text-center font-mono focus:outline-none"
              />
              <span className="text-lg font-bold text-[#8A8A8A]">years young</span>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C7FF3D]">
              IDENTITY
            </span>
            <h2 className="text-3xl font-black text-[#F5F5F5] tracking-tight mt-1 mb-2">
              How do you identify?
            </h2>
            <p className="text-xs text-[#8A8A8A] mb-6">
              Used strictly to personalize metabolic rate benchmarks.
            </p>
            <div className="space-y-2.5">
              {['Male', 'Female', 'Non-binary', 'Prefer not to say'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setGender(opt);
                    handleNext();
                  }}
                  className={`w-full p-4 rounded-2xl border text-left font-bold text-sm transition-all flex items-center justify-between ${
                    gender === opt
                      ? 'bg-[#1C1C1C] border-[#C7FF3D] text-[#C7FF3D]'
                      : 'bg-[#121212] border-[#222] text-[#F5F5F5] hover:border-[#333]'
                  }`}
                >
                  <span>{opt}</span>
                  {gender === opt && <Check className="w-4 h-4 text-[#C7FF3D]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C7FF3D]">
              BODY METRICS
            </span>
            <h2 className="text-3xl font-black text-[#F5F5F5] tracking-tight mt-1 mb-2">
              How tall are you?
            </h2>
            <div className="flex gap-2 my-4">
              <button
                onClick={() => setHeightUnit('cm')}
                className={`px-3 py-1 text-xs font-bold rounded-lg border ${
                  heightUnit === 'cm'
                    ? 'bg-[#C7FF3D] text-black border-[#C7FF3D]'
                    : 'bg-[#171717] text-[#8A8A8A] border-[#2E2E2E]'
                }`}
              >
                CM
              </button>
              <button
                onClick={() => setHeightUnit('ft')}
                className={`px-3 py-1 text-xs font-bold rounded-lg border ${
                  heightUnit === 'ft'
                    ? 'bg-[#C7FF3D] text-black border-[#C7FF3D]'
                    : 'bg-[#171717] text-[#8A8A8A] border-[#2E2E2E]'
                }`}
              >
                Feet / In
              </button>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value, 10) || 0)}
                placeholder="175"
                className="w-36 bg-[#121212] border border-[#2A2A2A] focus:border-[#C7FF3D] rounded-2xl p-4 text-3xl font-black text-[#F5F5F5] text-center font-mono focus:outline-none"
              />
              <span className="text-lg font-bold text-[#8A8A8A]">{heightUnit}</span>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C7FF3D]">
              CURRENT BASELINE
            </span>
            <h2 className="text-3xl font-black text-[#F5F5F5] tracking-tight mt-1 mb-2">
              What's your current weight?
            </h2>
            <div className="flex gap-2 my-4">
              <button
                onClick={() => setWeightUnit('kg')}
                className={`px-3 py-1 text-xs font-bold rounded-lg border ${
                  weightUnit === 'kg'
                    ? 'bg-[#C7FF3D] text-black border-[#C7FF3D]'
                    : 'bg-[#171717] text-[#8A8A8A] border-[#2E2E2E]'
                }`}
              >
                KG
              </button>
              <button
                onClick={() => setWeightUnit('lb')}
                className={`px-3 py-1 text-xs font-bold rounded-lg border ${
                  weightUnit === 'lb'
                    ? 'bg-[#C7FF3D] text-black border-[#C7FF3D]'
                    : 'bg-[#171717] text-[#8A8A8A] border-[#2E2E2E]'
                }`}
              >
                LB
              </button>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value, 10) || 0)}
                placeholder="64"
                className="w-36 bg-[#121212] border border-[#2A2A2A] focus:border-[#C7FF3D] rounded-2xl p-4 text-3xl font-black text-[#F5F5F5] text-center font-mono focus:outline-none"
              />
              <span className="text-lg font-bold text-[#8A8A8A]">{weightUnit}</span>
            </div>
          </div>
        )}

        {step === 6 && (
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C7FF3D]">
              PRIMARY OBJECTIVE
            </span>
            <h2 className="text-3xl font-black text-[#F5F5F5] tracking-tight mt-1 mb-2">
              What are you working towards?
            </h2>
            <p className="text-xs text-[#8A8A8A] mb-5">
              Select one primary focus. We'll tailor rep ranges and progression logic.
            </p>
            <div className="space-y-2.5">
              {[
                { title: 'Build Muscle', desc: 'Hypertrophy rep ranges & progressive overload' },
                { title: 'Lose Fat', desc: 'Higher metabolic burn & lean definition' },
                { title: 'Get Stronger', desc: 'Compound lifts & raw force development' },
                { title: 'Improve Fitness', desc: 'Cardiovascular endurance & functional movement' },
                { title: 'Stay Active', desc: 'Consistent movement habit without burnout' }
              ].map((item) => (
                <button
                  key={item.title}
                  onClick={() => {
                    setGoal(item.title as FitnessGoal);
                    handleNext();
                  }}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${
                    goal === item.title
                      ? 'bg-[#1A1A1A] border-[#C7FF3D]'
                      : 'bg-[#121212] border-[#222] hover:border-[#333]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-[#F5F5F5]">{item.title}</span>
                    {goal === item.title && <Check className="w-4 h-4 text-[#C7FF3D]" />}
                  </div>
                  <p className="text-xs text-[#8A8A8A] mt-0.5">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 7 && (
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C7FF3D]">
              EXPERIENCE
            </span>
            <h2 className="text-3xl font-black text-[#F5F5F5] tracking-tight mt-1 mb-2">
              How comfortable are you in the gym?
            </h2>
            <p className="text-xs text-[#8A8A8A] mb-5">
              GymBuddy specializes in guiding beginners from day one.
            </p>
            <div className="space-y-2.5">
              {[
                {
                  lvl: 'Complete Beginner',
                  sub: '“I’ve just started. Need visual form guidance.”'
                },
                {
                  lvl: 'Some Experience',
                  sub: '“I know the basics, but want a structured plan.”'
                },
                {
                  lvl: 'Experienced',
                  sub: '“I already have a routine and want progress calibration.”'
                }
              ].map((item) => (
                <button
                  key={item.lvl}
                  onClick={() => {
                    setExperience(item.lvl as ExperienceLevel);
                    handleNext();
                  }}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${
                    experience === item.lvl
                      ? 'bg-[#1A1A1A] border-[#C7FF3D]'
                      : 'bg-[#121212] border-[#222] hover:border-[#333]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-[#F5F5F5]">{item.lvl}</span>
                    {experience === item.lvl && <Check className="w-4 h-4 text-[#C7FF3D]" />}
                  </div>
                  <p className="text-xs text-[#8A8A8A] mt-0.5">{item.sub}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 8 && (
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C7FF3D]">
              WEEKLY SCHEDULE
            </span>
            <h2 className="text-3xl font-black text-[#F5F5F5] tracking-tight mt-1 mb-2">
              How often can you realistically train?
            </h2>
            <p className="text-xs text-[#8A8A8A] mb-5">
              Consistency beats intensity. Start with a realistic commitment.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { days: 2, label: '2 days / week', sub: 'Ideal for busy schedules' },
                { days: 3, label: '3 days / week', sub: 'Full body balance' },
                { days: 4, label: '4 days / week', sub: 'Upper / Lower split (Recommended)' },
                { days: 5, label: '5+ days / week', sub: 'Dedicated athletes' }
              ].map((item) => (
                <button
                  key={item.days}
                  onClick={() => {
                    setScheduleDays(item.days);
                    handleNext();
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    scheduleDays === item.days
                      ? 'bg-[#1A1A1A] border-[#C7FF3D]'
                      : 'bg-[#121212] border-[#222] hover:border-[#333]'
                  }`}
                >
                  <span className="text-base font-bold text-[#F5F5F5]">{item.label}</span>
                  <span className="text-[11px] text-[#8A8A8A] mt-2">{item.sub}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 9 && (
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C7FF3D]">
              TIME COMMITMENT
            </span>
            <h2 className="text-3xl font-black text-[#F5F5F5] tracking-tight mt-1 mb-2">
              How much time do you usually have?
            </h2>
            <p className="text-xs text-[#8A8A8A] mb-5">
              Workouts include quick warmups, main lifts, and recovery stretches.
            </p>
            <div className="space-y-2.5">
              {['20–30 min', '30–45 min', '45–60 min', '60+ min'].map((dur) => (
                <button
                  key={dur}
                  onClick={() => {
                    setDuration(dur);
                    handleNext();
                  }}
                  className={`w-full p-4 rounded-2xl border text-left font-bold text-sm transition-all flex items-center justify-between ${
                    duration === dur
                      ? 'bg-[#1A1A1A] border-[#C7FF3D] text-[#C7FF3D]'
                      : 'bg-[#121212] border-[#222] text-[#F5F5F5] hover:border-[#333]'
                  }`}
                >
                  <span>{dur}</span>
                  {duration === dur && <Check className="w-4 h-4 text-[#C7FF3D]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 10 && (
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C7FF3D]">
              EQUIPMENT
            </span>
            <h2 className="text-3xl font-black text-[#F5F5F5] tracking-tight mt-1 mb-2">
              What do you have access to?
            </h2>
            <p className="text-xs text-[#8A8A8A] mb-5">
              Exercises adapt to available machines and free weights.
            </p>
            <div className="space-y-2.5">
              {[
                { title: 'Full Gym', sub: 'Barbells, dumbbells, cable towers & machines' },
                { title: 'Basic Gym', sub: 'Dumbbells, basic benches & cardio' },
                { title: 'Home Equipment', sub: 'Adjustable dumbbells & resistance bands' },
                { title: 'Bodyweight Only', sub: 'Calisthenics, mat & pull-up bar' }
              ].map((item) => (
                <button
                  key={item.title}
                  onClick={() => {
                    setEquipment(item.title as EquipmentAccess);
                    handleNext();
                  }}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${
                    equipment === item.title
                      ? 'bg-[#1A1A1A] border-[#C7FF3D]'
                      : 'bg-[#121212] border-[#222] hover:border-[#333]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-[#F5F5F5]">{item.title}</span>
                    {equipment === item.title && <Check className="w-4 h-4 text-[#C7FF3D]" />}
                  </div>
                  <p className="text-xs text-[#8A8A8A] mt-0.5">{item.sub}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 11: PERSONALISATION SUMMARY */}
        {step === 11 && (
          <div className="text-center animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-[#1C1C1C] border border-[#C7FF3D] flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Sparkles className="w-7 h-7 text-[#C7FF3D]" />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-[#C7FF3D]">
              YOUR GYMBUDDY PROFILE
            </span>
            <h2 className="text-2xl font-black text-[#F5F5F5] tracking-tight mt-1 mb-1">
              {name || 'Athlete'}
            </h2>
            <p className="text-xs text-[#8A8A8A] mb-5">
              {age} years · {height} {heightUnit} · {weight} {weightUnit}
            </p>

            {/* Profile Recap Cards */}
            <div className="bg-[#121212] border border-[#242424] rounded-2xl p-4 text-left space-y-3 mb-6">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#8A8A8A]">Goal</span>
                <span className="font-bold text-[#C7FF3D]">{goal}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-[#1C1C1C] pt-2">
                <span className="text-[#8A8A8A]">Experience</span>
                <span className="font-bold text-[#F5F5F5]">{experience}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-[#1C1C1C] pt-2">
                <span className="text-[#8A8A8A]">Training Frequency</span>
                <span className="font-bold text-[#F5F5F5]">{scheduleDays} days / week</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-[#1C1C1C] pt-2">
                <span className="text-[#8A8A8A]">Session Duration</span>
                <span className="font-bold text-[#F5F5F5]">{duration}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-[#1C1C1C] pt-2">
                <span className="text-[#8A8A8A]">Equipment Access</span>
                <span className="font-bold text-[#F5F5F5]">{equipment}</span>
              </div>
            </div>

            <p className="text-xs text-[#D1D5DB] leading-relaxed mb-4">
              “I’ve got everything I need. Your session is configured with mobility warmups, primary lifts, and recovery stretches.”
            </p>
          </div>
        )}
      </div>

      {/* BOTTOM NAV / ACTION BUTTONS */}
      <div className="pt-4 border-t border-[#1C1C1C] flex items-center gap-3">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="p-4 rounded-2xl bg-[#141414] hover:bg-[#1E1E1E] border border-[#2A2A2A] text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors btn-press"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        {step <= totalQuestions ? (
          <button
            onClick={handleNext}
            disabled={step === 1 && !name.trim()}
            className={`flex-1 py-4 px-6 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all btn-press ${
              step === 1 && !name.trim()
                ? 'bg-[#222] text-[#666] cursor-not-allowed border border-[#333]'
                : 'bg-[#C7FF3D] hover:bg-[#b8f52c] text-black'
            }`}
          >
            <span>{step === 1 && !name.trim() ? 'Enter Name to Continue' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        ) : (
          <button
            onClick={finishOnboarding}
            className="flex-1 py-4 px-6 rounded-2xl bg-[#C7FF3D] hover:bg-[#b8f52c] text-black font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all btn-press"
          >
            <span>CREATE MY WORKOUT</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        )}
      </div>
    </div>
  );
};
