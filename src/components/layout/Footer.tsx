import React, { useState } from 'react';
import { Logo } from '../common/Logo';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="relative w-full overflow-hidden border-t border-slate-200/80 bg-gradient-to-b from-transparent via-slate-50/70 to-slate-100/90 pt-24 pb-12 mt-28">
      {/* Ambient background blur elements matching Adaption's aesthetic */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[400px] w-[600px] rounded-full bg-blue-100/40 blur-[120px]"></div>
        <div className="h-[300px] w-[500px] rounded-full bg-emerald-100/30 blur-[100px] -translate-y-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Adaption-Style Editorial Slogan */}
        <div className="text-center max-w-4xl mx-auto mb-10">
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

        {/* Adaption-Style Center Newsletter Pill */}
        <div className="max-w-md mx-auto mb-12">
          {subscribed ? (
            <div className="rounded-[120px] py-3 px-6 bg-emerald-50 border border-emerald-300 text-emerald-800 text-center text-xs font-semibold shadow-xs">
              ✓ Subscribed to the Adaptive Intelligence Network!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="rounded-[120px] p-1.5 bg-white/90 backdrop-blur-xl border border-black/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex items-center gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Join the intelligence brief..."
                className="w-full bg-transparent px-4 py-2 text-xs text-slate-800 placeholder-slate-600 focus:outline-none font-medium"
              />
              <button
                type="submit"
                className="rounded-[120px] bg-slate-900 hover:bg-black text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer shrink-0 flex items-center gap-1.5 shadow-xs"
              >
                <span>Subscribe</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          )}
        </div>

        {/* Social Pill Buttons matching Adaption's social strip */}
        <div className="flex items-center justify-center gap-3 mb-16">
          {/* X (Twitter) */}
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-slate-900 text-slate-700 hover:text-white border border-black/10 flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105"
            title="X (Twitter)"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-slate-900 text-slate-700 hover:text-white border border-black/10 flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105"
            title="LinkedIn"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>

          {/* Discord */}
          <a
            href="https://discord.com"
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-slate-900 text-slate-700 hover:text-white border border-black/10 flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105"
            title="Discord"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/anshuvdebnath-cyber/BUILD-BATTLE-HACKATHON"
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-slate-900 text-slate-700 hover:text-white border border-black/10 flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105"
            title="GitHub Repository"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          </a>
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
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
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
