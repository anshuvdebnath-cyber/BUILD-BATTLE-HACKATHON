import React from 'react';

interface LogoProps {
  className?: string;
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', showSubtitle = true }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Bespoke InsightFlow Custom Geometric Glyph */}
      <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-sm border border-slate-700/30 overflow-hidden">
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-white transform transition-transform hover:scale-105"
        >
          {/* Abstract dual-current stream representing customer feedback into decision flow */}
          <path 
            d="M4 12C4 8 7 5 11 5C15 5 18 8 18 12C18 16 15 19 11 19" 
            stroke="white" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
          />
          <path 
            d="M9 12C9 10 10.5 8.5 12.5 8.5C14.5 8.5 16 10 16 12C16 14 14.5 15.5 12.5 15.5" 
            stroke="#38bdf8" 
            strokeWidth="2" 
            strokeLinecap="round" 
          />
          <circle cx="12.5" cy="12" r="1.5" fill="#10b981" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-extrabold text-[17px] tracking-tight text-slate-900 font-['Inter']">
            InsightFlow
          </span>
          <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
            v2.0
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10.5px] font-semibold text-slate-500 mt-0.5 tracking-tight">
            Customer Decision Platform
          </span>
        )}
      </div>
    </div>
  );
};
