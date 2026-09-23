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
 * Official GymBuddy Logo & Emblem
 * Faithfully matches the user's uploaded official graphic:
 * - White muscular flexing bicep & clenched fist forming the upper & left contour of 'G'
 * - Electric lime (#C7FF3D) kinetic shelf/hook forming the dynamic lower arrow of 'G'
 * - Modern sans-serif "Gym" (Pure White) + "Buddy" (Electric Neon Lime)
 * - Tracked "AI FITNESS COMPANION" subtitle
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
    xs: 'text-[7px] tracking-[0.2em]',
    sm: 'text-[9px] tracking-[0.22em]',
    md: 'text-[10px] tracking-[0.25em]',
    lg: 'text-xs tracking-[0.28em]',
    xl: 'text-sm tracking-[0.3em]',
    '2xl': 'text-base tracking-[0.32em]'
  };

  // The Emblem SVG
  const Emblem = (
    <div
      className={`relative flex-shrink-0 flex items-center justify-center ${iconSizeMap[size]} transition-transform duration-200 hover:scale-105`}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          {glow && (
            <filter id={`emblem-glow-${size}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#C7FF3D" floodOpacity="0.45" />
            </filter>
          )}
        </defs>

        {/* --- 1. Stylized Muscular Arm & Flexed Bicep (Pure Crisp White) --- */}
        {/* Forms the upper shoulder, bicep flex peak, and clenched fist top contour of 'G' */}
        <path
          d="M 68 142
             C 48 122, 38 92, 44 65
             C 50 38, 74 22, 104 22
             C 126 22, 146 32, 156 46
             C 160 52, 157 59, 149 61
             C 140 64, 134 58, 126 53
             C 118 47, 108 44, 98 46
             C 80 50, 68 66, 68 84
             C 68 96, 74 108, 84 116
             C 96 98, 114 86, 136 82
             C 146 80, 154 86, 154 94
             C 154 102, 146 109, 136 112
             C 118 117, 104 128, 94 144
             C 88 153, 76 151, 68 142
             Z"
          fill="#FFFFFF"
        />

        {/* Inner Bicep Peak Muscle Contour Definition */}
        <path
          d="M 102 28
             C 80 28, 56 46, 50 72
             C 44 98, 54 124, 72 140
             C 58 122, 54 96, 62 72
             C 70 48, 88 38, 108 38
             C 124 38, 138 44, 148 54
             C 154 60, 158 56, 156 48
             C 146 35, 126 28, 102 28
             Z"
          fill="#FFFFFF"
          opacity="0.9"
        />

        {/* --- 2. Dynamic Kinetic Arrow & Shelf (Vibrant Electric Lime #C7FF3D) --- */}
        {/* Forms the bottom curve of 'G' and shoots inwards as the kinetic horizontal shelf */}
        <path
          d="M 92 152
             C 112 160, 134 158, 150 144
             C 166 130, 172 108, 172 88
             C 172 80, 165 75, 156 75
             C 148 75, 142 80, 142 88
             C 142 100, 136 112, 126 120
             C 116 128, 104 130, 92 128
             L 86 142
             C 88 146, 90 149, 92 152
             Z"
          fill="#C7FF3D"
          filter={glow ? `url(#emblem-glow-${size})` : undefined}
        />

        {/* The Crossbar Arrow Head */}
        <path
          d="M 166 84
             L 118 84
             C 110 84, 104 90, 104 98
             C 104 106, 110 112, 118 112
             L 148 112
             C 142 126, 130 136, 116 140
             C 108 143, 108 152, 115 155
             C 138 150, 158 132, 166 104
             C 168 96, 168 90, 166 84
             Z"
          fill="#C7FF3D"
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

  // Stacked variant (Matching the 512px / 1024px logo files uploaded by the user)
  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        {Emblem}
        <div className="mt-3 flex flex-col items-center">
          <div className="flex items-center leading-none">
            <span className={`${titleSizeMap[size]} text-[#FFFFFF]`}>Gym</span>
            <span className={`${titleSizeMap[size]} text-[#C7FF3D]`}>Buddy</span>
          </div>
          {(showTagline || size === 'lg' || size === 'xl' || size === '2xl') && (
            <span
              className={`font-semibold uppercase text-[#D4D4D4] mt-1.5 opacity-90 ${taglineSizeMap[size]}`}
            >
              AI FITNESS COMPANION
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default: Horizontal variant (Ideal for top navigation bar & compact headers)
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {Emblem}
      <div className="flex flex-col justify-center">
        <div className="flex items-center leading-none">
          <span className={`${titleSizeMap[size]} text-[#FFFFFF]`}>Gym</span>
          <span className={`${titleSizeMap[size]} text-[#C7FF3D]`}>Buddy</span>
        </div>
        {showTagline && (
          <span
            className={`font-medium uppercase text-[#A3A3A3] mt-0.5 tracking-wider ${taglineSizeMap[size]}`}
          >
            AI FITNESS COMPANION
          </span>
        )}
      </div>
    </div>
  );
};
