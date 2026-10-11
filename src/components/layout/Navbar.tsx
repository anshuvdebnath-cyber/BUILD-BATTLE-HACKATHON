import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Cpu, 
  BarChart3, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  Menu,
  X,
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [datasetDropdownOpen, setDatasetDropdownOpen] = useState(false);
  const unresolvedCount = recommendations.filter(r => r.status !== 'resolved').length;

  const navItems: { 
    id: ActiveTab; 
    label: string; 
    icon: React.ReactNode; 
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: <LayoutDashboard className="w-4 h-4" /> 
    },
    { 
      id: 'feedbacks', 
      label: 'Customer Feedback', 
      icon: <MessageSquare className="w-4 h-4" />,
      badge: feedbacks.length 
    },
    { 
      id: 'adaption-studio', 
      label: 'Adaptive Engine', 
      icon: <Cpu className="w-4 h-4" />,
      badge: hasRunAdaption ? qualityMetrics.adaptedGrade : 'Train',
      badgeColor: hasRunAdaption ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
    },
    { 
      id: 'analytics', 
      label: 'Analytics & Trends', 
      icon: <BarChart3 className="w-4 h-4" /> 
    },
    { 
      id: 'recommendations', 
      label: 'Executive Decisions', 
      icon: <CheckCircle2 className="w-4 h-4" />,
      badge: recommendations.length 
    },
    { 
      id: 'tracker', 
      label: 'Issue Tracker', 
      icon: <AlertCircle className="w-4 h-4" />,
      badge: unresolvedCount > 0 ? unresolvedCount : undefined,
      badgeColor: 'bg-rose-100 text-rose-800'
    },
    { 
      id: 'executive-report', 
      label: 'Executive Brief', 
      icon: <FileText className="w-4 h-4" /> 
    },
  ];

  const presets = [
    { id: 'Build Battle 2026 (Official)', label: 'Hackathon CSV (1,250 rows)', note: 'E-commerce & SaaS mixed' },
    { id: 'CloudScale SaaS', label: 'CloudScale B2B SaaS (500 rows)', note: 'DevOps & Enterprise cloud' },
    { id: 'FinPay Banking', label: 'FinPay Banking (420 rows)', note: 'FinTech, compliance, transactions' }
  ];

  return (
    <>
      {/* ========================================================
          MOBILE TOP BAR (Visible only on < md screens)
          Transparent glass bar with logo, live status, and hamburger
          ======================================================== */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 z-50 bg-white/60 backdrop-blur-2xl border-b border-black/10 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 8.5C6 6.01472 8.01472 4 10.5 4H13.5C15.9853 4 18 6.01472 18 8.5C18 10.9853 15.9853 12 13.5 12H10.5C8.01472 12 6 13.0147 6 15.5C6 17.9853 8.01472 20 10.5 20H13.5C15.9853 20 18 17.9853 18 15.5" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="2.2" fill="#2563eb" />
            </svg>
          </div>
          <span className="font-extrabold text-sm tracking-widest uppercase text-slate-900 font-sans">
            INSIGHTFLOW
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>+{qualityMetrics.qualityLiftPercentage}%</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/80 border border-black/10 text-slate-800 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* ========================================================
          TRANSPARENT LEFT SIDEBAR (Desktop fixed, Mobile sliding drawer)
          Proper space, padding, transparent glass, Adaption aesthetic
          ======================================================== */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 h-screen flex flex-col justify-between 
          bg-white/60 backdrop-blur-2xl border-r border-black/10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]
          p-6 transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Top: Brand Logo & Subtitle */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Bespoke Geometric Adaptive Loop Emblem */}
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

              <div className="flex flex-col">
                <span className="font-extrabold text-[15px] tracking-widest uppercase text-slate-900 font-sans leading-none">
                  INSIGHTFLOW
                </span>
                <span className="text-[10px] font-semibold text-slate-600 tracking-wider uppercase mt-1">
                  Adaptive Intelligence
                </span>
              </div>
            </div>

            {/* Mobile close button inside drawer */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-black/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dataset Switcher Transparent Pill */}
          <div className="relative">
            <button
              onClick={() => setDatasetDropdownOpen(!datasetDropdownOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white/70 hover:bg-white/90 border border-black/10 text-left transition-all shadow-2xs group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Database className="w-4 h-4 text-slate-600 shrink-0 group-hover:text-blue-600 transition-colors" />
                <div className="flex flex-col truncate">
                  <span className="text-[11.5px] font-bold text-slate-800 truncate">
                    Hackathon CSV (1,250 rows)
                  </span>
                  <span className="text-[10px] text-slate-600 font-medium">
                    Active Dataset
                  </span>
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-600 transition-transform ${datasetDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {datasetDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-2xl border border-black/10 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Switch Active Preset
                </div>
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      loadPreset(preset.id as any);
                      setDatasetDropdownOpen(false);
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

          {/* Navigation Section with Generous Spacing and Padding */}
          <nav className="flex flex-col gap-1.5 pt-2">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">
              Navigation
            </div>

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 cursor-pointer text-left ${
                    isActive
                      ? 'bg-blue-500/15 text-blue-600 font-bold shadow-2xs'
                      : 'text-slate-700 hover:text-black hover:bg-black/5 font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-blue-600' : 'text-slate-600 group-hover:text-black'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.badgeColor || (isActive ? 'bg-blue-600 text-white' : 'bg-black/5 text-slate-700')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Card: Engine Status & Adaption Lift */}
        <div className="pt-6 border-t border-black/5 flex flex-col gap-3">
          <div className="rounded-2xl p-3.5 bg-gradient-to-br from-white/80 to-white/50 border border-black/10 shadow-2xs flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                Adaption Engine
              </span>
              <span className="flex items-center gap-1.5 text-[10.5px] font-bold text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active</span>
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-600 font-medium">Quality Lift:</span>
              <span className="text-xs font-extrabold text-emerald-800">
                +{qualityMetrics.qualityLiftPercentage}%
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
              <span>Model Grade:</span>
              <span className="font-extrabold text-slate-800">
                {qualityMetrics.adaptedGrade} ({qualityMetrics.adaptedScore}/100)
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-600 font-medium px-1">
            <span>© 2026 InsightFlow</span>
            <span className="text-emerald-800 font-semibold">● v2.0 Live</span>
          </div>
        </div>

      </aside>
    </>
  );
};
