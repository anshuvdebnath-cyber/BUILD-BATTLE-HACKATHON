import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { BackgroundShader } from './components/common/BackgroundShader';
import { OverviewView } from './components/views/OverviewView';
import { FeedbackView } from './components/views/FeedbackView';
import { DataCleaning } from './components/DataCleaning';
import { AdaptionStudioView } from './components/views/AdaptionStudioView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { RecommendationsView } from './components/views/RecommendationsView';
import { TrackerView } from './components/views/TrackerView';
import { ExecutiveReportView } from './components/views/ExecutiveReportView';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-[#090d16] selection:bg-slate-900 selection:text-white flex flex-col font-sans">
      {/* Dynamic Animated Chromatic Mesh Shaders (Adaption Labs Style) */}
      <BackgroundShader />

      {/* Bigger, Wider Floating Glassmorphism Navbar (Adaption Labs Style) */}
      <Navbar />

      {/* Main Content View with generous top padding to clear the wide floating navbar */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-16 z-10">
        {activeTab === 'overview' && <OverviewView />}
        {activeTab === 'data-cleaning' && <DataCleaning />}
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
