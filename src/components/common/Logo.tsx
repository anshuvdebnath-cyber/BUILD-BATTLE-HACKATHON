import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  inverted?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = true,
  inverted = false
}) => {
  const sizeMap = {
    sm: { box: 'w-6 h-6', svg: 16, text: 'text-xs tracking-wider' },
    md: { box: 'w-8 h-8', svg: 20, text: 'text-sm tracking-wider' },
    lg: { box: 'w-10 h-10', svg: 24, text: 'text-base tracking-widest' },
    xl: { box: 'w-14 h-14', svg: 34, text: 'text-2xl tracking-widest' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Geometric Emblem: Custom Continuous Flow & Connected Intelligence Nodes */}
      <div 
        className={`flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${currentSize.box} ${
          inverted ? 'bg-white text-black' : 'bg-slate-900 text-white'
        }`}
      >
        <svg 
          width={currentSize.svg} 
          height={currentSize.svg} 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Continuous flowing geometric circuit */}
          <path 
            d="M6 8.5C6 6.01472 8.01472 4 10.5 4H13.5C15.9853 4 18 6.01472 18 8.5C18 10.9853 15.9853 12 13.5 12H10.5C8.01472 12 6 13.0147 6 15.5C6 17.9853 8.01472 20 10.5 20H13.5C15.9853 20 18 17.9853 18 15.5" 
            stroke="currentColor" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* Central intelligence node */}
          <circle cx="12" cy="12" r="2.2" fill={inverted ? "#2563eb" : "#38bdf8"} />
          {/* Terminal nodes */}
          <circle cx="10.5" cy="4" r="1.4" fill="currentColor" />
          <circle cx="13.5" cy="20" r="1.4" fill={inverted ? "#10b981" : "#34d399"} />
        </svg>
      </div>

      {showText && (
        <span 
          className={`font-extrabold uppercase font-sans ${currentSize.text} ${
            inverted ? 'text-white' : 'text-slate-900'
          }`}
        >
          INSIGHTFLOW
        </span>
      )}
    </div>
  );
};
