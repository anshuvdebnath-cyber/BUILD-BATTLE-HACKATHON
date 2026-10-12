import React from 'react';
import { AppProvider } from './context/AppContext';
import { BackgroundShader } from './components/common/BackgroundShader';
import { MasterDashboardView } from './components/views/MasterDashboardView';
import { Footer } from './components/layout/Footer';

const MainContent: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-transparent text-[#090d16] selection:bg-purple-900 selection:text-white flex flex-col font-sans">
      {/* Dynamic Animated Chromatic Mesh Shaders (Lilac / White background) */}
      <BackgroundShader />

      {/* Main Master Dashboard Container */}
      <main className="flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 z-10">
        <MasterDashboardView />
      </main>

      {/* Comprehensive Adaption-Style Footer */}
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
