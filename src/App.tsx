import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { OverviewView } from './components/views/OverviewView';
import { FeedbackView } from './components/views/FeedbackView';
import { AdaptionStudioView } from './components/views/AdaptionStudioView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { RecommendationsView } from './components/views/RecommendationsView';
import { TrackerView } from './components/views/TrackerView';
import { ExecutiveReportView } from './components/views/ExecutiveReportView';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] selection:bg-blue-500 selection:text-white flex flex-col">
      {/* Bigger, Wider Floating Glassmorphism Navbar (Adaption Labs Style) */}
      <Navbar />

      {/* Main Content View with generous top padding to clear the wide floating navbar */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-16">
        {activeTab === 'overview' && <OverviewView />}
        {activeTab === 'feedbacks' && <FeedbackView />}
        {activeTab === 'adaption-studio' && <AdaptionStudioView />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'recommendations' && <RecommendationsView />}
        {activeTab === 'tracker' && <TrackerView />}
        {activeTab === 'executive-report' && <ExecutiveReportView />}
      </main>

      {/* Full Adaption Labs-style Footer */}
      <Footer />
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
