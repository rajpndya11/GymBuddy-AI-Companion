import React from 'react';

export interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'horizontal' | 'stacked' | 'icon';
  showWordmark?: boolean;
  showTagline?: boolean;
  className?: string;
  glow?: boolean;
}

/**
 * GymBuddy Logo & Emblem
 * Faithfully matches the exact purple & lavender aesthetic from the uploaded design:
 * - Stylized athletic emblem with energetic top head dot (#C4B5FD) and dynamic sweeping 'G' body (#8B5CF6)
 * - Modern typography: "Gym" (#FFFFFF) + "Buddy" (#8B5CF6)
 * - Tagline: "Your AI Fitness Companion" (#A1A8B8)
 */
export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'horizontal',
  showWordmark = true,
  showTagline = false,
  className = '',
  glow = true
}) => {
  // Preset dimensions
  const iconSizeMap: Record<NonNullable<LogoProps['size']>, string> = {
    xs: 'w-5 h-5',
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-14 h-14',
    xl: 'w-24 h-24',
    '2xl': 'w-36 h-36'
  };

  const titleSizeMap: Record<NonNullable<LogoProps['size']>, string> = {
    xs: 'text-sm font-extrabold tracking-tight',
    sm: 'text-base font-extrabold tracking-tight',
    md: 'text-xl font-black tracking-tight',
    lg: 'text-3xl font-black tracking-tight',
    xl: 'text-5xl font-black tracking-tight',
    '2xl': 'text-6xl font-black tracking-tight'
  };

  const taglineSizeMap: Record<NonNullable<LogoProps['size']>, string> = {
    xs: 'text-[8px] tracking-normal',
    sm: 'text-[10px] tracking-normal',
    md: 'text-[11px] tracking-normal',
    lg: 'text-sm tracking-normal',
    xl: 'text-base tracking-normal',
    '2xl': 'text-lg tracking-normal'
  };

  // The Emblem SVG
  const Emblem = (
    <div
      className={`relative flex-shrink-0 flex items-center justify-center ${iconSizeMap[size]} transition-transform duration-200 hover:scale-105`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C4B5FD" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          {glow && (
            <filter id={`emblem-glow-${size}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#8B5CF6" floodOpacity="0.6" />
            </filter>
          )}
        </defs>

        {/* Head circle dot of the athletic figure */}
        <circle
          cx="50"
          cy="18"
          r="9.5"
          fill="url(#purpleGrad)"
          filter={glow ? `url(#emblem-glow-${size})` : undefined}
        />

        {/* Stylized 'G' dynamic athlete body */}
        <path
          d="M 50 35
             C 33 35 20 48 20 65
             C 20 82 33 95 50 95
             C 66 95 78 83 78 67
             L 78 63
             C 78 60 76 58 73 58
             L 50 58
             C 47 58 45 60 45 63
             C 45 66 47 68 50 68
             L 68 68
             C 66 77 59 84 50 84
             C 39 84 31 75 31 65
             C 31 54 39 46 50 46
             C 56 46 62 49 66 54
             C 68 56 71 56 73 54
             C 75 52 75 49 73 47
             C 67 40 59 35 50 35
             Z"
          fill="url(#purpleGrad)"
          filter={glow ? `url(#emblem-glow-${size})` : undefined}
        />
      </svg>
    </div>
  );

  // If icon-only variant
  if (variant === 'icon' || !showWordmark) {
    return (
      <div className={`inline-flex items-center justify-center select-none ${className}`}>
        {Emblem}
      </div>
    );
  }

  // Stacked variant
  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        {Emblem}
        <div className="mt-3 flex flex-col items-center">
          <div className="flex items-center leading-none">
            <span className={`${titleSizeMap[size]} text-[#FFFFFF]`}>Gym</span>
            <span className={`${titleSizeMap[size]} text-[#8B5CF6]`}>Buddy</span>
          </div>
          {(showTagline || size === 'lg' || size === 'xl' || size === '2xl') && (
            <span
              className={`font-medium text-[#A1A8B8] mt-1 ${taglineSizeMap[size]}`}
            >
              Your AI Fitness Companion
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default: Horizontal variant
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {Emblem}
      <div className="flex flex-col justify-center">
        <div className="flex items-center leading-none">
          <span className={`${titleSizeMap[size]} text-[#FFFFFF]`}>Gym</span>
          <span className={`${titleSizeMap[size]} text-[#8B5CF6]`}>Buddy</span>
        </div>
        {showTagline && (
          <span
            className={`font-medium text-[#A1A8B8] mt-0.5 ${taglineSizeMap[size]}`}
          >
            Your AI Fitness Companion
          </span>
        )}
      </div>
    </div>
  );
};
