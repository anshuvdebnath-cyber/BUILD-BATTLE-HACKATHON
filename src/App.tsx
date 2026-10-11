import React from 'react';
import { AppProvider } from './context/AppContext';
import { BackgroundShader } from './components/common/BackgroundShader';
import { MasterDashboardView } from './components/views/MasterDashboardView';

const MainContent: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-transparent text-[#090d16] selection:bg-purple-900 selection:text-white flex flex-col font-sans">
      {/* Dynamic Animated Chromatic Mesh Shaders (Lilac / White background) */}
      <BackgroundShader />

      {/* Main Master Dashboard Container */}
      <main className="flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
        <MasterDashboardView />
      </main>

      {/* Subtle Bottom Accent Footer */}
      <footer className="py-6 text-center text-xs text-slate-500 font-medium z-10 border-t border-slate-200/50 bg-white/30 backdrop-blur-md">
        © 2026 InsightFlow • Enterprise Feedback & Decision Intelligence Platform
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
