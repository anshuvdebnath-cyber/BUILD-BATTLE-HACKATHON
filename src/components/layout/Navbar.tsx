import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import { 
  Database,
  ChevronDown
} from 'lucide-react';

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

  const presets = [
    { id: 'Build Battle 2026 (Official)', label: 'Hackathon CSV (1,250 rows)', note: 'E-commerce & SaaS mixed' },
    { id: 'CloudScale SaaS', label: 'CloudScale B2B SaaS (500 rows)', note: 'DevOps & Enterprise cloud' },
    { id: 'FinPay Banking', label: 'FinPay Banking (420 rows)', note: 'FinTech, compliance, transactions' }
  ];

  return (
    <div className="fixed top-3.5 md:top-5 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 flex justify-center pointer-events-none">
      {/* 
        Bigger, Wider Floating Glassmorphism Navbar (Adaption Labs Aesthetic)
        - Full wide capsule: max-w-[1380px]
        - Liquid glass: bg-white/60 backdrop-blur-2xl border border-black/10 shadow-[0_16px_40px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)]
        - Generous padding and space
      */}
      <header className="pointer-events-auto w-full max-w-[1380px] rounded-full bg-white/60 backdrop-blur-2xl border border-black/10 shadow-[0_16px_40px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)] px-5 sm:px-7 py-2.5 sm:py-3 flex items-center justify-between gap-4 transition-all">
        
        {/* Left: Custom Geometric Connected Node Emblem & Wordmark */}
        <button
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-3 group cursor-pointer shrink-0 select-none"
          title="InsightFlow Platform"
        >
          {/* Custom Connected Geometric Loop Logo */}
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
              <circle cx="12" cy="12" r="2.2" fill="#2563eb" />
              <circle cx="10.5" cy="4" r="1.4" fill="currentColor" />
              <circle cx="13.5" cy="20" r="1.4" fill="#10b981" />
            </svg>
          </div>

          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-[14px] sm:text-[15px] tracking-widest uppercase text-slate-900 font-sans">
                INSIGHTFLOW
              </span>
              <span className="hidden sm:inline text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                v2.0
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-600 tracking-wider uppercase mt-1">
              Adaptive Intelligence Platform
            </span>
          </div>
        </button>

        {/* Center: Wide Navigation Pill Bar with All Tabs Cleanly Visible */}
        <nav className="flex items-center gap-1 sm:gap-1.5 bg-black/[0.03] p-1 sm:p-1.5 rounded-full border border-black/5 overflow-x-auto no-scrollbar shrink-0">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`rounded-full px-3 sm:px-3.5 py-1.5 sm:py-2 uppercase text-[10.5px] sm:text-[11px] font-semibold tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-blue-500/15 text-blue-600 font-bold shadow-2xs'
                    : 'hover:bg-black/5 text-slate-700 hover:text-black'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded-full leading-none ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-black/5 text-slate-700 border border-black/5'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Live Sync Lift Beacon & Dataset Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Quality Lift Beacon */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-50/80 border border-emerald-200/80 text-emerald-900 text-xs font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10.5px] uppercase tracking-wider text-emerald-800">Lift:</span>
            <span className="font-extrabold text-[12px]">+{qualityMetrics.qualityLiftPercentage}%</span>
          </div>

          {/* Dataset Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDatasetMenuOpen(!datasetMenuOpen)}
              className="rounded-full h-10 px-4 bg-white/70 hover:bg-white/95 border border-black/10 text-xs font-bold tracking-wide flex items-center gap-2 text-slate-800 transition-all cursor-pointer shadow-2xs hover:shadow-sm"
            >
              <Database className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden xl:inline text-[11.5px]">Hackathon CSV</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-600 transition-transform ${datasetMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {datasetMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white/95 backdrop-blur-2xl border border-black/10 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-1.5 border-b border-black/5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Select Active Dataset
                </div>
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      loadPreset(preset.id as any);
                      setDatasetMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-slate-100 transition-colors flex flex-col cursor-pointer"
                  >
                    <span className="font-semibold text-slate-800">{preset.label}</span>
                    <span className="text-[10.5px] text-slate-600">{preset.note}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

      </header>
    </div>
  );
};
