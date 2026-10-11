import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    qualityMetrics, 
    loadPreset,
    feedbacks,
    recommendations,
    hasRunAdaption
  } = useApp();

  const [datasetMenuOpen, setDatasetMenuOpen] = useState(false);
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
    <div className="fixed top-3 md:top-4 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
      <header className="pointer-events-auto w-full max-w-7xl flex items-center justify-between xl:justify-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-0.5">
        
        {/* Island 1: Adaption-Style Logo Pill with Hover-Expand Wordmark */}
        <button
          onClick={() => setActiveTab('overview')}
          className="backdrop-blur-xl bg-white/70 hover:bg-white/90 text-slate-900 rounded-[120px] h-[36px] px-3.5 border border-black/10 flex items-center gap-2 group transition-all duration-300 hover:shadow-md cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.05)] shrink-0"
          title="InsightFlow Platform"
        >
          {/* Custom Geometric Logo Icon */}
          <div className="w-[18px] h-[18px] flex items-center justify-center shrink-0 text-slate-900 transition-transform duration-300 group-hover:scale-110">
            <svg 
              width="18" 
              height="18" 
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
              <circle cx="12" cy="12" r="2.2" fill="#2563eb" />
              <circle cx="10.5" cy="4" r="1.4" fill="currentColor" />
              <circle cx="13.5" cy="20" r="1.4" fill="#10b981" />
            </svg>
          </div>

          {/* Smooth hover reveal of wordmark */}
          <span className="overflow-hidden max-w-0 group-hover:max-w-[140px] transition-all duration-300 ease-in-out whitespace-nowrap font-extrabold text-[11px] tracking-widest uppercase text-slate-900">
            INSIGHTFLOW
          </span>
        </button>

        {/* Island 2: Floating Pill Center Nav Links */}
        <nav className="rounded-[120px] p-1 bg-white/70 backdrop-blur-xl border border-black/10 flex items-center gap-0.5 sm:gap-1 shadow-[0_2px_10px_rgba(0,0,0,0.05)] shrink-0 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`rounded-[16px] py-1 px-2.5 sm:px-3 uppercase text-[10.5px] sm:text-[11px] tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-blue-500/15 text-blue-600 font-bold shadow-2xs'
                    : 'hover:bg-black/5 text-slate-700 hover:text-black font-semibold'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded-full leading-none ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-black/5 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Island 3: Adaption-Style Action & Live Sync Pill */}
        <div className="relative shrink-0">
          <button
            onClick={() => setDatasetMenuOpen(!datasetMenuOpen)}
            className="rounded-[120px] h-[36px] px-3 sm:px-3.5 bg-white/70 hover:bg-white/90 backdrop-blur-xl border border-black/10 text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 text-slate-800 transition-all cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:shadow-md"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="hidden sm:inline">LIVE SYNC</span>
            <span className="text-[9.5px] sm:text-[10px] text-slate-700 font-extrabold bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded-full">
              +{qualityMetrics.qualityLiftPercentage}%
            </span>
            <svg className="w-3 h-3 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dataset Switcher Dropdown */}
          {datasetMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white/95 backdrop-blur-2xl border border-black/10 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 border-b border-black/5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Select Dataset Preset
              </div>
              {[
                { id: 'Build Battle 2026 (Official)', label: 'Hackathon CSV (1,250 rows)', note: 'E-commerce & SaaS mixed' },
                { id: 'CloudScale SaaS', label: 'CloudScale B2B SaaS (500 rows)', note: 'DevOps & Enterprise cloud' },
                { id: 'FinPay Banking', label: 'FinPay Banking (420 rows)', note: 'FinTech, compliance, transactions' }
              ].map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    loadPreset(preset.id as any);
                    setDatasetMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-100 transition-colors flex flex-col cursor-pointer"
                >
                  <span className="font-semibold text-slate-800">{preset.label}</span>
                  <span className="text-[10.5px] text-slate-600">{preset.note}</span>
                </button>
              ))}
            </div>
          )}
        </div>

      </header>
    </div>
  );
};
