import React from 'react';

interface XalatLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const XalatLogo: React.FC<XalatLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  // Size dimensions for logo symbol
  const symbolDimensions = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24',
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center inline-flex select-none ${className}`}>
      {/* SVG Icon Ribbon & Map Pin X */}
      <svg
        viewBox="0 0 240 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${symbolDimensions} w-auto object-contain`}
      >
        {/* Navy Blue Curve / Left Loop */}
        <path
          d="M75 125 L108 80 C118 66 110 38 90 38 C72 38 68 56 80 75 L120 125 H92 L62 82 C45 56 55 20 90 20 C125 20 142 56 120 88 L95 125 H75 Z"
          fill="#155289"
        />
        {/* Blue Pin Inner Circle */}
        <circle cx="90" cy="46" r="9" fill="#155289" />

        {/* Green Curve / Right Loop */}
        <path
          d="M165 125 L132 80 C122 66 130 38 150 38 C168 38 172 56 160 75 L120 125 H148 L178 82 C195 56 185 20 150 20 C115 20 98 56 120 88 L145 125 H165 Z"
          fill="#8BC34A"
        />

        {/* Swooping Orbit Arrow (Blue to Green Gradient) */}
        <defs>
          <linearGradient id="orbitGrad" x1="60" y1="90" x2="180" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#155289" />
            <stop offset="100%" stopColor="#8BC34A" />
          </linearGradient>
        </defs>
        
        {/* Arrow path circling round */}
        <path
          d="M58 85 C62 105 110 115 170 85 L182 92 L185 68 L162 72 L172 78 C118 105 76 95 68 80 Z"
          fill="url(#orbitGrad)"
        />
      </svg>

      {/* Text Brand: XALAT-Cİ */}
      <div className="flex items-center tracking-tight font-extrabold text-slate-900 leading-none mt-1">
        <span className="text-[#155289] text-xl font-black tracking-wider">XALAT-</span>
        <span className="text-[#8BC34A] text-xl font-black tracking-wider flex items-center">
          C
          <span className="inline-flex flex-col items-center relative -ml-0.5">
            {/* Map Pin Dot over the i */}
            <svg viewBox="0 0 24 32" className="w-3.5 h-4 text-[#8BC34A] fill-current">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20s12-11 12-20c0-6.63-5.37-12-12-12zm0 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
            </svg>
          </span>
        </span>
      </div>

      {/* Subtitle */}
      {showSubtitle && (
        <p className="text-[9px] font-semibold text-slate-600 tracking-normal mt-0.5">
          Le lien numérique pour notre collectivité
        </p>
      )}
    </div>
  );
};
