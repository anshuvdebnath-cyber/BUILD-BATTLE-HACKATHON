import React from 'react';
import { Logo } from '../common/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="relative w-full overflow-hidden border-t border-white/50 bg-gradient-to-b from-transparent via-white/10 to-white/20 pt-20 pb-12 mt-20">
      {/* Ambient background blur elements matching Adaption's aesthetic */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[400px] w-[600px] rounded-full bg-blue-100/40 blur-[120px]"></div>
        <div className="h-[300px] w-[500px] rounded-full bg-emerald-100/30 blur-[100px] -translate-y-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Adaption-Style Editorial Slogan */}
        <div className="text-center max-w-4xl mx-auto mb-14">
          <p className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-slate-900 leading-[1.15]">
            Everything intelligent adapts.
            <span className="block font-normal text-slate-700 mt-1">
              So should customer intelligence.
            </span>
          </p>
          <p className="text-sm sm:text-base text-slate-700 mt-4 max-w-xl mx-auto font-medium">
            Bridging raw unstructured feedback, automated quality sanitization, and high-confidence decision workflows.
          </p>
        </div>

        {/* Brand Section with Large Logo & Wordmark */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-black/5">
          <div className="flex items-center gap-3">
            <Logo size="md" />
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-700 font-medium">
              Customer Decision Platform v2.0
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span>All Systems Operational</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-700">Adaption Adaptive Engine v1.4 Connected</span>
          </div>
        </div>

        {/* Legal & Copyright Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 text-[11px] text-slate-600 font-medium">
          <p>© 2026 InsightFlow, Inc. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="#privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-900 transition-colors">Terms of Service</a>
            <a href="#security" className="hover:text-slate-900 transition-colors">Security</a>
            <a href="https://github.com/anshuvdebnath-cyber/BUILD-BATTLE-HACKATHON" target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors">GitHub</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
