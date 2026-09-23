import React, { useState, useEffect } from 'react';
import { Play, Pause, Plus, FastForward, Sparkles } from 'lucide-react';

interface RestTimerModalProps {
  initialSeconds?: number;
  exerciseName: string;
  nextSetInfo: string;
  onComplete: () => void;
  onSkip: () => void;
}

export const RestTimerModal: React.FC<RestTimerModalProps> = ({
  initialSeconds = 45,
  exerciseName,
  nextSetInfo,
  onComplete,
  onSkip
}) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isPaused, onComplete]);

  const addTime = (secs: number) => {
    setTimeLeft((prev) => prev + secs);
    setTotalSeconds((prev) => prev + secs);
  };

  const progressPercent = Math.max(0, Math.min(100, ((totalSeconds - timeLeft) / totalSeconds) * 100));

  // Circular stroke calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-[#121212] border border-[#2A2A2A] rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
        {/* Rest Header */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1C1C] border border-[#2E2E2E] mb-4">
          <span className="w-2 h-2 rounded-full bg-[#C7FF3D] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#C7FF3D]">
            REST INTERVAL
          </span>
        </div>

        <h3 className="text-xl font-bold text-[#F5F5F5]">{exerciseName}</h3>
        <p className="text-xs text-[#8A8A8A] mt-1 mb-6">{nextSetInfo}</p>

        {/* Circular Countdown Ring */}
        <div className="relative w-44 h-44 flex items-center justify-center mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="88"
              cy="88"
              r={radius}
              stroke="#242424"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="88"
              cy="88"
              r={radius}
              stroke="#C7FF3D"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-300 ease-linear"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold tracking-tight text-[#F5F5F5] font-mono">
              {timeLeft}
            </span>
            <span className="text-[11px] uppercase font-semibold text-[#8A8A8A] tracking-wider mt-0.5">
              Seconds
            </span>
          </div>
        </div>

        {/* AI Rest Tip */}
        <div className="w-full bg-[#171717] border border-[#262626] rounded-xl p-3 mb-6 text-left flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-[#A78BFA] shrink-0 mt-0.5" />
          <p className="text-xs text-[#A3A3A3] leading-relaxed">
            <span className="text-[#F5F5F5] font-semibold">Buddy Tip: </span>
            Inhale deeply through your nose, relax your shoulders, and shake out arm tension before the next set.
          </p>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center gap-3 w-full mb-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex-1 py-3 px-4 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] border border-[#2E2E2E] text-xs font-semibold text-[#F5F5F5] flex items-center justify-center gap-2 transition-all btn-press"
          >
            {isPaused ? <Play className="w-4 h-4 text-[#C7FF3D]" /> : <Pause className="w-4 h-4" />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>

          <button
            onClick={() => addTime(15)}
            className="flex-1 py-3 px-4 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] border border-[#2E2E2E] text-xs font-semibold text-[#C7FF3D] flex items-center justify-center gap-1.5 transition-all btn-press"
          >
            <Plus className="w-4 h-4" />
            +15 Sec
          </button>
        </div>

        {/* Skip Button */}
        <button
          onClick={onSkip}
          className="w-full py-3.5 px-4 rounded-xl bg-[#C7FF3D] hover:bg-[#b8f52c] text-black font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg btn-press"
        >
          <span>I'm Ready Now</span>
          <FastForward className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
