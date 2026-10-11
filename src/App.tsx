import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { OverviewView } from './components/views/OverviewView';
import { FeedbackView } from './components/views/FeedbackView';
import { AdaptionStudioView } from './components/views/AdaptionStudioView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { RecommendationsView } from './components/views/RecommendationsView';
import { TrackerView } from './components/views/TrackerView';
import { ExecutiveReportView } from './components/views/ExecutiveReportView';
import { Logo } from './components/common/Logo';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0f172a]">
      {/* Floating Sticky Glass Navbar */}
      <Navbar />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && <OverviewView />}
        {activeTab === 'feedbacks' && <FeedbackView />}
        {activeTab === 'adaption-studio' && <AdaptionStudioView />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'recommendations' && <RecommendationsView />}
        {activeTab === 'tracker' && <TrackerView />}
        {activeTab === 'executive-report' && <ExecutiveReportView />}
      </main>

      {/* Custom Minimalist Footer */}
      <footer className="border-t border-slate-200 bg-white/90 py-6 text-xs text-slate-600 print:hidden mt-12 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-medium">
          <div className="flex items-center gap-2">
            <Logo showSubtitle={false} />
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-semibold">Intelligent Customer Decision Platform</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="text-slate-600">Frontend Arena Build Battle 2026</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-900 font-bold">Adaptive Intelligence Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
