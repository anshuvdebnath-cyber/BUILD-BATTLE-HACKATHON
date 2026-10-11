import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import { Logo } from '../common/Logo';
import { 
  Sparkles, 
  BarChart3, 
  MessageSquareText, 
  Layers, 
  Cpu, 
  FileText,
  TrendingUp,
  Database
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

  const unresolvedCount = recommendations.filter(r => r.status !== 'resolved').length;

  const navItems: { id: ActiveTab; label: string; badge?: string | number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'feedbacks', label: 'Feedback', badge: feedbacks.length },
    { 
      id: 'adaption-studio', 
      label: 'Adaptive Engine', 
      badge: hasRunAdaption ? `${qualityMetrics.adaptedGrade} (${qualityMetrics.adaptedScore})` : 'Run'
    },
    { id: 'analytics', label: 'Analytics' },
    { 
      id: 'recommendations', 
      label: 'Decisions', 
      badge: `${recommendations.length}`
    },
    { 
      id: 'tracker', 
      label: 'Issue Board', 
      badge: unresolvedCount > 0 ? unresolvedCount : undefined 
    },
    { id: 'executive-report', label: 'Executive Brief' },
  ];

  return (
    <div className="sticky top-3 z-50 px-3 sm:px-6 max-w-7xl mx-auto w-full">
      <header className="floating-navbar px-4 sm:px-5 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-md backdrop-blur-xl">
        
        {/* Left: Custom InsightFlow Logo & Quick Status */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Logo />

          {/* Mobile Right Badges */}
          <div className="flex md:hidden items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>+{qualityMetrics.qualityLiftPercentage}%</span>
            </div>
            
            <select 
              aria-label="Select dataset"
              onChange={(e) => loadPreset(e.target.value as any)}
              className="px-2 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-900 text-[11px] font-bold focus:outline-none"
              defaultValue="Build Battle 2026 (Official)"
            >
              <option value="Build Battle 2026 (Official)">Hackathon CSV</option>
              <option value="CloudScale SaaS">CloudScale</option>
              <option value="FinPay Banking">FinPay</option>
            </select>
          </div>
        </div>

        {/* Center: Navigation Pills with Responsive Horizontal Scroll */}
        <nav className="flex items-center gap-1 overflow-x-auto w-full md:w-auto no-scrollbar py-0.5 justify-start md:justify-center">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'text-slate-800 hover:text-slate-950 hover:bg-slate-100/90 font-semibold'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive 
                        ? 'bg-white/25 text-white' 
                        : 'bg-slate-200/90 text-slate-800 border border-slate-300/80'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Controls & Quality Metric Badge (Desktop) */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 border border-slate-200 text-xs text-slate-800 font-semibold shadow-2xs">
            <Database className="w-3.5 h-3.5 text-slate-600" />
            <select 
              aria-label="Select dataset"
              onChange={(e) => loadPreset(e.target.value as any)}
              className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer pr-1 text-[11.5px]"
              defaultValue="Build Battle 2026 (Official)"
            >
              <option value="Build Battle 2026 (Official)">Hackathon CSV (1,250 rows)</option>
              <option value="CloudScale SaaS">CloudScale B2B SaaS</option>
              <option value="FinPay Banking">FinPay Banking</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Lift: <strong className="font-extrabold">+{qualityMetrics.qualityLiftPercentage}%</strong></span>
          </div>
        </div>

      </header>
    </div>
  );
};
