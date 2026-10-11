import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    qualityMetrics, 
    feedbacks,
    recommendations,
    hasRunAdaption
  } = useApp();

  const unresolvedCount = recommendations.filter(r => r.status !== 'resolved').length;

  const navItems: { id: ActiveTab; label: string; badge?: string | number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'feedbacks', label: 'Feedback', badge: feedbacks.length },
    { 
      id: 'adaption-studio', 
      label: 'Adaptive Engine', 
      badge: hasRunAdaption ? qualityMetrics.adaptedGrade : undefined
    },
    { id: 'analytics', label: 'Analytics' },
    { 
      id: 'recommendations', 
      label: 'Decisions', 
      badge: recommendations.length 
    },
    { 
      id: 'tracker', 
      label: 'Issues', 
      badge: unresolvedCount > 0 ? unresolvedCount : undefined 
    },
    { id: 'executive-report', label: 'Brief' },
  ];

  return (
    <div className="fixed top-4 md:top-5 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 flex justify-center pointer-events-none">
      {/* 
        Ultra-Transparent Liquid Glassmorphic Floating Navbar (Adaption Labs Style)
        - High-transparency liquid glass texture: bg-white/35 backdrop-blur-3xl backdrop-saturate-150
        - Fine white glass perimeter & top specular rim: border border-white/70 shadow-[0_20px_50px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(255,255,255,0.95)]
        - Monochrome Black & White active states (Zero blue)
      */}
      <header className="pointer-events-auto w-full max-w-6xl rounded-full bg-white/35 backdrop-blur-3xl backdrop-saturate-150 border border-white/70 shadow-[0_20px_50px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(255,255,255,0.95)] px-5 sm:px-7 py-2.5 sm:py-3 flex items-center justify-between gap-6 transition-all">
        
        {/* Left: Pure Monochrome Brand Emblem & Wordmark */}
        <button
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-3 group cursor-pointer shrink-0 select-none"
          title="InsightFlow Platform"
        >
          {/* Custom Connected Geometric Loop Logo in Pure Monochrome */}
          <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-xs">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M6 8.5C6 6.01472 8.01472 4 10.5 4H13.5C15.9853 4 18 6.01472 18 8.5C18 10.9853 15.9853 12 13.5 12H10.5C8.01472 12 6 13.0147 6 15.5C6 17.9853 8.01472 20 10.5 20H13.5C15.9853 20 18 17.9853 18 15.5" 
                stroke="currentColor" 
                strokeWidth="2.4" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <circle cx="12" cy="12" r="2.2" fill="white" />
              <circle cx="10.5" cy="4" r="1.4" fill="white" />
              <circle cx="13.5" cy="20" r="1.4" fill="white" />
            </svg>
          </div>

          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-[14px] sm:text-[15px] tracking-widest uppercase text-slate-900 font-sans">
                INSIGHTFLOW
              </span>
              <span className="hidden sm:inline text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-black/5 text-slate-800 border border-black/10">
                v2.0
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-600 tracking-wider uppercase mt-1">
              Adaptive Intelligence Platform
            </span>
          </div>
        </button>

        {/* Center/Right: Transparent Glass Nav Bar with Pure Black Active State */}
        <nav className="flex items-center gap-1 sm:gap-1.5 bg-black/[0.03] backdrop-blur-md p-1 sm:p-1.5 rounded-full border border-black/[0.06] overflow-x-auto no-scrollbar shrink-0">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 uppercase text-[10.5px] sm:text-[11px] font-semibold tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:text-black hover:bg-black/5'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded-full leading-none ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-black/5 text-slate-700 border border-black/5'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

      </header>
    </div>
  );
};
