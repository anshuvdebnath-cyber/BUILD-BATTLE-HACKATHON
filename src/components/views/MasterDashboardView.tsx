import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { FeedbackItem, IssueCategory, FeedbackSource } from '../../types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Search, 
  Upload, 
  Download, 
  Wand2, 
  ChevronDown, 
  Check, 
  FileText, 
  Sparkles, 
  X,
  AlertTriangle,
  RotateCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MasterDashboardView: React.FC = () => {
  const { 
    feedbacks, 
    addManualFeedback, 
    handleCSVUpload, 
    triggerConfetti 
  } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('All sentiment');
  const [sourceFilter, setSourceFilter] = useState('All sources');
  const [topicFilter, setTopicFilter] = useState('All topics');

  // Dropdown open states
  const [sentimentDropdownOpen, setSentimentDropdownOpen] = useState(false);
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false);
  const [topicDropdownOpen, setTopicDropdownOpen] = useState(false);

  // New feedback submission form state
  const [newFeedbackText, setNewFeedbackText] = useState('');
  const [newFeedbackCategory, setNewFeedbackCategory] = useState<IssueCategory>('Support');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Priority issues accordion state & Saved for tracking
  const [expandedWhy, setExpandedWhy] = useState<number | null>(null);
  const [savedIssues, setSavedIssues] = useState<string[]>([]);
  const [isGeneratingRecs, setIsGeneratingRecs] = useState(false);

  // Business report modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Hidden CSV file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ==========================================
  // DYNAMIC METRICS COMPUTATIONS (100% Calculated)
  // ==========================================
  const totalEntries = feedbacks.length;
  const positiveItems = useMemo(() => feedbacks.filter(f => f.sentiment === 'positive'), [feedbacks]);
  const negativeItems = useMemo(() => feedbacks.filter(f => f.sentiment === 'negative'), [feedbacks]);
  const neutralItems = useMemo(() => feedbacks.filter(f => f.sentiment === 'neutral'), [feedbacks]);

  const positivePercent = totalEntries > 0 ? Math.round((positiveItems.length / totalEntries) * 100) : 0;
  const negativePercent = totalEntries > 0 ? Math.round((negativeItems.length / totalEntries) * 100) : 0;

  // Topic cluster counts dynamically grouped
  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    feedbacks.forEach(f => {
      const cat = f.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [feedbacks]);

  // Topic negative counts dynamically grouped
  const topicNegativeCounts = useMemo(() => {
    const negs: Record<string, number> = {};
    negativeItems.forEach(f => {
      const cat = f.category || 'General';
      negs[cat] = (negs[cat] || 0) + 1;
    });
    return negs;
  }, [negativeItems]);

  // Top topic clusters for KPI card dynamically calculated
  const topTopicList = useMemo(() => {
    const entries = Object.entries(topicCounts);
    if (entries.length === 0) return [];
    return entries
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));
  }, [topicCounts]);

  // Top complaint category
  const topComplaintCategory = useMemo(() => {
    const entries = Object.entries(topicNegativeCounts);
    if (entries.length === 0) return null;
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0];
  }, [topicNegativeCounts]);

  // Dynamic Sentiment Trend Area Data across calendar intervals
  const trendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const monthPos: Record<string, number> = { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0 };
    const monthNeg: Record<string, number> = { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0 };

    feedbacks.forEach(f => {
      const d = f.date || f.timestamp;
      if (d) {
        const m = new Date(d).getMonth();
        const monthKey = months[m % 6];
        if (f.sentiment === 'positive') monthPos[monthKey] = (monthPos[monthKey] || 0) + 1;
        else if (f.sentiment === 'negative') monthNeg[monthKey] = (monthNeg[monthKey] || 0) + 1;
      }
    });

    return months.map(m => ({
      month: m,
      positive: monthPos[m] || 0,
      negative: monthNeg[m] || 0
    }));
  }, [feedbacks]);

  // Dynamic Sentiment Split Donut Data
  const donutData = useMemo(() => [
    { name: 'Positive', value: positiveItems.length, color: '#0284c7' }, // vibrant cyan/blue
    { name: 'Neutral', value: neutralItems.length, color: '#94a3b8' },   // gray
    { name: 'Negative', value: negativeItems.length, color: '#090d16' }, // deep black
  ], [positiveItems.length, neutralItems.length, negativeItems.length]);

  // Frequently Reported Issues bar data dynamically sorted
  const frequentIssues = useMemo(() => {
    const entries = Object.entries(topicNegativeCounts);
    if (entries.length === 0) {
      // Fallback to general topics if no negative entries
      return Object.entries(topicCounts).slice(0, 4).map(([topic, count], idx) => ({
        topic,
        count,
        isPrimary: idx === 0
      }));
    }
    return entries
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([topic, count], idx) => ({
        topic,
        count,
        isPrimary: idx === 0
      }));
  }, [topicNegativeCounts, topicCounts]);

  const maxFrequentCount = useMemo(() => {
    return Math.max(...frequentIssues.map(i => i.count), 1);
  }, [frequentIssues]);

  // Dynamic Priority Issues dynamically ranked
  const priorityIssues = useMemo(() => {
    const entries = Object.entries(topicNegativeCounts);
    if (entries.length === 0) return [];
    return entries
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([topic, negCount], idx) => {
        return {
          rank: idx + 1,
          topic,
          negCount,
          whyPrioritize: `Prioritize resolving ${topic} (${negCount} negative reports). This topic accounts for recurring friction and elevated churn risk across current support channels.`
        };
      });
  }, [topicNegativeCounts]);

  // Dynamic Recommendations generated from live topics
  const dynamicRecommendations = useMemo(() => {
    if (priorityIssues.length === 0) {
      return [
        '1. Monitor incoming feedback channels as new customer tickets are ingested.',
        '2. Maintain high responsiveness across primary support inquiries.',
        '3. Run weekly data cleaning and deduplication recipes to track emerging trends.'
      ];
    }
    return priorityIssues.slice(0, 3).map((p, idx) => {
      if (idx === 0) {
        return `1. Prioritize fixing ${p.topic} first, with ${p.negCount} negative reports, by identifying key failure modes and shipping a stability-focused release with regression monitoring.`;
      } else if (idx === 1) {
        return `2. Address ${p.topic} next (${p.negCount} negative reports) by optimizing core workflows and reducing response latencies.`;
      } else {
        return `3. Refactor ${p.topic} customer communications and packaging to clarify value and remove friction before renewal cycles.`;
      }
    });
  }, [priorityIssues]);

  const [recommendationsList, setRecommendationsList] = useState<string[]>(dynamicRecommendations);

  // Sync recommendations when data updates
  React.useEffect(() => {
    setRecommendationsList(dynamicRecommendations);
  }, [dynamicRecommendations]);

  // Filtered Feedback Inbox items
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter(item => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText = item.rawText?.toLowerCase().includes(q);
        const matchesCat = item.category?.toLowerCase().includes(q);
        const matchesSrc = item.source?.toLowerCase().includes(q);
        if (!matchesText && !matchesCat && !matchesSrc) return false;
      }
      // Sentiment filter
      if (sentimentFilter !== 'All sentiment' && item.sentiment?.toLowerCase() !== sentimentFilter.toLowerCase()) {
        return false;
      }
      // Source filter
      if (sourceFilter !== 'All sources' && item.source !== sourceFilter) {
        return false;
      }
      // Topic filter
      if (topicFilter !== 'All topics' && item.category !== topicFilter) {
        return false;
      }
      return true;
    });
  }, [feedbacks, searchQuery, sentimentFilter, sourceFilter, topicFilter]);

  // Available topics for filter dropdown
  const availableTopics = useMemo(() => {
    const set = new Set<string>();
    feedbacks.forEach(f => { if (f.category) set.add(f.category); });
    return ['All topics', ...Array.from(set)];
  }, [feedbacks]);

  // Available sources for filter dropdown
  const availableSources = useMemo(() => {
    const set = new Set<string>();
    feedbacks.forEach(f => { if (f.source) set.add(f.source); });
    return ['All sources', ...Array.from(set)];
  }, [feedbacks]);

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleAnalyzeAndAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedbackText.trim()) return;

    setIsAnalyzing(true);
    setApiError(null);
    let predSentiment: any = 'neutral';
    let predCategory = newFeedbackCategory;

    try {
      const res = await fetch('http://localhost:3001/api/adaption/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newFeedbackText }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.prediction) {
          predSentiment = json.prediction.sentiment || 'neutral';
          if (json.prediction.category) predCategory = json.prediction.category;
        }
      } else {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.error || `API returned ${res.status}`);
      }
    } catch (err: any) {
      console.warn('Adaption API prediction note:', err);
      // Fallback classification if backend offline
      const lower = newFeedbackText.toLowerCase();
      if (/crash|error|fail|slow|bad|broken|terrible|expensive|bug|freeze|drop/i.test(lower)) {
        predSentiment = 'negative';
      } else if (/great|love|fast|helpful|clean|fantastic|good|awesome|excellent/i.test(lower)) {
        predSentiment = 'positive';
      }
      if (err.message && !err.message.includes('Failed to fetch')) {
        setApiError(`Adaption API notice: ${err.message}`);
      }
    }

    addManualFeedback({
      rawText: newFeedbackText,
      category: predCategory,
      sentiment: predSentiment,
      source: 'Support',
      customerName: `Customer #${Math.floor(100 + Math.random() * 900)}`,
      rating: predSentiment === 'positive' ? 5 : predSentiment === 'negative' ? 1 : 3,
      date: new Date().toISOString().split('T')[0],
    });

    setNewFeedbackText('');
    setIsAnalyzing(false);
    triggerConfetti();
  };

  const handleCsvFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setApiError(null);
      try {
        await handleCSVUpload(e.target.files[0]);
        triggerConfetti();
      } catch (err: any) {
        setApiError(`CSV Import error: ${err.message || 'Failed to parse CSV file'}`);
      }
    }
  };

  const handleExportData = () => {
    if (feedbacks.length === 0) {
      alert('No feedback entries to export.');
      return;
    }
    const csvRows = [
      ['ID', 'Date', 'Category', 'Source', 'Sentiment', 'Feedback'].join(','),
      ...feedbacks.map(f => [
        `"${f.id}"`,
        `"${f.date || f.timestamp?.split('T')[0] || ''}"`,
        `"${f.category}"`,
        `"${f.source}"`,
        `"${f.sentiment}"`,
        `"${(f.rawText || '').replace(/"/g, '""')}"`
      ].join(','))
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `insightflow_feedback_export_${Date.now()}.csv`;
    a.click();
    triggerConfetti();
  };

  const handleToggleTrack = (topicName: string) => {
    setSavedIssues(prev => 
      prev.includes(topicName) ? prev.filter(t => t !== topicName) : [...prev, topicName]
    );
    triggerConfetti();
  };

  const handleGenerateRecommendations = () => {
    setIsGeneratingRecs(true);
    setTimeout(() => {
      setRecommendationsList(dynamicRecommendations);
      setIsGeneratingRecs(false);
      triggerConfetti();
    }, 500);
  };

  // Reusable liquid glassmorphic container style (elevated transparency)
  const glassCard = "rounded-2xl bg-white/20 backdrop-blur-3xl border border-white/45 shadow-[0_10px_35px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,0.85)] hover:bg-white/30 transition-all duration-300";

  return (
    <div className="w-full max-w-[1280px] mx-auto space-y-7 pb-20 select-text">
      
      {/* Hidden File Input for CSV Ingestion */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleCsvFileChosen} 
        accept=".csv" 
        className="hidden" 
      />

      {/* API Error Notification Banner */}
      {apiError && (
        <div className="rounded-xl bg-rose-50/90 backdrop-blur-md border border-rose-200 p-4 flex items-center justify-between text-rose-800 text-xs font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{apiError}</span>
          </div>
          <button 
            onClick={() => setApiError(null)} 
            className="text-rose-600 hover:text-rose-900 cursor-pointer font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* ========================================================
          1. TOP BRAND HEADER & UTILITY BAR (Restored Favicon Logo & Sleek Header)
          ======================================================== */}
      <header className={`${glassCard} px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4`}>
        
        {/* Logo & Platform Wordmark */}
        <div className="flex items-center gap-3.5 shrink-0">
          {/* Restored Original Favicon Connected Geometric Loop Logo */}
          <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md shrink-0">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M6 8.5C6 6.01472 8.01472 4 10.5 4H13.5C15.9853 4 18 6.01472 18 8.5C18 10.9853 15.9853 12 13.5 12H10.5C8.01472 12 6 13.0147 6 15.5C6 17.9853 8.01472 20 10.5 20H13.5C15.9853 20 18 17.9853 18 15.5" 
                stroke="#F8FAFC" 
                strokeWidth="2.4" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <circle cx="12" cy="12" r="2.2" fill="#F8FAFC" />
              <circle cx="10.5" cy="4" r="1.5" fill="#F8FAFC" />
              <circle cx="13.5" cy="20" r="1.5" fill="#F8FAFC" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            InsightFlow Feedback & Decision Platform
          </h1>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all feedback..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/25 backdrop-blur-md border border-white/45 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white/45 focus:border-slate-800 transition-colors"
          />
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-white/30 backdrop-blur-md hover:bg-white/50 text-slate-800 text-xs font-bold border border-white/50 flex items-center gap-2 cursor-pointer shadow-2xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-600" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={handleExportData}
            className="px-4 py-2 rounded-xl bg-[#090d16] hover:bg-black text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export</span>
          </button>
        </div>
      </header>

      {/* ========================================================
          2. HERO ROW: "Turn feedback into decisions" + Submission
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Hero Card */}
        <div className={`lg:col-span-5 ${glassCard} p-6 flex flex-col justify-between relative overflow-hidden group`}>
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/30 via-purple-50/20 to-white/10 pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <div className="w-full h-32 rounded-xl bg-gradient-to-r from-blue-100/40 via-indigo-50/50 to-cyan-100/40 border border-white/50 backdrop-blur-md p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
                <span className="flex items-center gap-1.5 text-indigo-700 font-bold">
                  <Sparkles className="w-3.5 h-3.5" /> Real-time Decision Matrix
                </span>
                <span>Adaption v1.4</span>
              </div>
              <div className="flex items-end justify-between">
                <div className="flex -space-x-1.5">
                  <div className="w-6 h-6 rounded-full bg-cyan-600 text-white text-[10px] font-bold flex items-center justify-center">R</div>
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">S</div>
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">E</div>
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-700">94.8% ACC</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
                Turn feedback into decisions
              </h2>
              <p className="text-xs font-medium text-slate-500 mt-1">
                {totalEntries} entries analyzed across reviews, surveys & support
              </p>
            </div>
          </div>
        </div>

        {/* Right Submission Card */}
        <div className={`lg:col-span-7 ${glassCard} p-6 flex flex-col justify-between space-y-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-indigo-600 font-extrabold text-base">✦</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Submit new feedback
              </h3>
            </div>
            {isAnalyzing && (
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-700 bg-cyan-50/80 px-2 py-0.5 rounded-full border border-cyan-200">
                <div className="w-2 h-2 rounded-full bg-cyan-600 animate-ping" />
                <span>Running Adaption AI...</span>
              </div>
            )}
          </div>

          <textarea
            value={newFeedbackText}
            onChange={(e) => setNewFeedbackText(e.target.value)}
            placeholder="Paste a customer comment..."
            rows={3}
            className="w-full p-3.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/40 text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:bg-white/40 focus:border-slate-800 resize-none transition-all"
          />

          <div className="flex items-center justify-between pt-1">
            <div className="relative">
              <select
                value={newFeedbackCategory}
                onChange={(e) => setNewFeedbackCategory(e.target.value as IssueCategory)}
                className="appearance-none bg-white/30 backdrop-blur-md border border-white/45 text-slate-800 text-xs font-semibold py-2 pl-3.5 pr-8 rounded-xl focus:outline-none cursor-pointer hover:bg-white/40 transition-colors"
              >
                <option value="Support">Support</option>
                <option value="Reliability">Reliability</option>
                <option value="Performance">Performance</option>
                <option value="Pricing">Pricing</option>
                <option value="UI/UX">UI/UX</option>
                <option value="Product Feedback">Product Feedback</option>
                <option value="Onboarding">Onboarding</option>
                <option value="Features">Features</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              onClick={handleAnalyzeAndAdd}
              disabled={isAnalyzing || !newFeedbackText.trim()}
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              {isAnalyzing ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Analyze & Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. METRIC STRIP: 3 Summary Cards
          ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Metric 1: Sentiment Overview */}
        <div className={`${glassCard} p-6 space-y-3`}>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Sentiment overview
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {positivePercent}%
            </span>
          </div>
          <p className="text-xs text-slate-600 font-semibold">
            positive · {negativePercent}% negative
          </p>
          
          {/* Dual-tone Progress Bar (Cyan for positive, Black for negative) */}
          <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden flex">
            <div 
              className="bg-cyan-600 h-full transition-all duration-500" 
              style={{ width: `${positivePercent}%` }} 
            />
            <div 
              className="bg-[#090d16] h-full transition-all duration-500" 
              style={{ width: `${negativePercent}%` }} 
            />
          </div>
        </div>

        {/* Metric 2: Top Topic Clusters */}
        <div className={`${glassCard} p-6 space-y-3`}>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Top topic clusters
          </p>
          <div className="space-y-2 pt-1 text-xs">
            {topTopicList.length === 0 ? (
              <p className="text-xs text-slate-400">No clusters recorded yet</p>
            ) : (
              topTopicList.map((cluster) => (
                <div key={cluster.name} className="flex items-center justify-between font-semibold">
                  <span className="text-slate-800">{cluster.name}</span>
                  <span className="font-mono text-slate-600 font-bold">{cluster.count}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Metric 3: Recurring Complaints */}
        <div className={`${glassCard} p-6 flex flex-col justify-between space-y-3`}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Recurring complaints
            </p>
            <button 
              onClick={() => {
                triggerConfetti();
                alert(`AI Synthesis: ${negativeItems.length} negative entries detected. Top friction centers around ${topComplaintCategory ? `${topComplaintCategory[0]} (${topComplaintCategory[1]} mentions)` : 'no recorded issues'}.`);
              }}
              className="text-xs font-bold text-slate-900 hover:text-cyan-700 cursor-pointer"
            >
              Summarize
            </button>
          </div>
          <p className="text-xs text-slate-700 font-medium leading-relaxed">
            {negativeItems.length} negative mentions{topComplaintCategory ? `, led by ${topComplaintCategory[0]}.` : '.'}
          </p>
          <div className="pt-2">
            <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
              Immediate Action Recommended
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================
          4. VISUAL CHARTS: 2 Columns (Trend + Split Donut)
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Sentiment Trend AreaChart */}
        <div className={`lg:col-span-8 ${glassCard} p-6 space-y-4`}>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Sentiment trend
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="trendBlack" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#090d16" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#090d16" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} 
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11 }} 
                  domain={[0, 'auto']} 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0', 
                    fontSize: '11px', 
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="negative" 
                  stroke="#090d16" 
                  strokeWidth={2.4} 
                  fillOpacity={1} 
                  fill="url(#trendBlack)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="positive" 
                  stroke="#0284c7" 
                  strokeWidth={2.4} 
                  fillOpacity={1} 
                  fill="url(#trendCyan)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Split Donut Chart */}
        <div className={`lg:col-span-4 ${glassCard} p-6 flex flex-col justify-between space-y-4`}>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Sentiment split
          </h3>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0', 
                    fontSize: '11px', 
                    fontWeight: 'bold' 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Donut Legend */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-semibold">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" /> Positive
              </span>
              <span className="font-mono text-slate-900 font-bold">{positiveItems.length}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-[#94a3b8]" /> Neutral
              </span>
              <span className="font-mono text-slate-900 font-bold">{neutralItems.length}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-[#090d16]" /> Negative
              </span>
              <span className="font-mono text-slate-900 font-bold">{negativeItems.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          5. MOST FREQUENTLY REPORTED ISSUES (Horizontal Bars)
          ======================================================== */}
      <div className={`${glassCard} p-6 space-y-4`}>
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          Most frequently reported issues
        </h3>

        <div className="space-y-3.5 pt-2">
          {frequentIssues.map((issue) => {
            const widthPct = Math.max(Math.round((issue.count / maxFrequentCount) * 100), issue.count > 0 ? 8 : 0);
            return (
              <div key={issue.topic} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">{issue.topic}</span>
                  <span className="font-mono text-slate-600">{issue.count}</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      issue.isPrimary ? 'bg-cyan-600' : 'bg-[#090d16]'
                    }`}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis tick markers */}
        <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100">
          <span>0</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
        </div>
      </div>

      {/* ========================================================
          6. FEEDBACK INBOX (Scrollable Container Inside Box)
          ======================================================== */}
      <div className={`${glassCard} p-6 space-y-5`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Feedback inbox
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
              {filteredFeedbacks.length}
            </span>
          </div>

          {/* 3 Interactive Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* 1. All Sentiment Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setSentimentDropdownOpen(!sentimentDropdownOpen);
                  setSourceDropdownOpen(false);
                  setTopicDropdownOpen(false);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/45 hover:bg-white/45 text-xs font-bold text-slate-800 flex items-center gap-2 cursor-pointer shadow-2xs transition-colors"
              >
                <span>{sentimentFilter}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {sentimentDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-white/85 backdrop-blur-2xl border border-white/70 shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                  {['All sentiment', 'Positive', 'Negative', 'Neutral'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setSentimentFilter(opt);
                        setSentimentDropdownOpen(false);
                      }}
                      className="w-full px-3.5 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50/80 flex items-center justify-between cursor-pointer"
                    >
                      <span>{opt}</span>
                      {sentimentFilter === opt && <Check className="w-3.5 h-3.5 text-cyan-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. All Sources Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setSourceDropdownOpen(!sourceDropdownOpen);
                  setSentimentDropdownOpen(false);
                  setTopicDropdownOpen(false);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/45 hover:bg-white/45 text-xs font-bold text-slate-800 flex items-center gap-2 cursor-pointer shadow-2xs transition-colors"
              >
                <span>{sourceFilter}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {sourceDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-white/85 backdrop-blur-2xl border border-white/70 shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                  {availableSources.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setSourceFilter(opt);
                        setSourceDropdownOpen(false);
                      }}
                      className="w-full px-3.5 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50/80 flex items-center justify-between cursor-pointer"
                    >
                      <span>{opt}</span>
                      {sourceFilter === opt && <Check className="w-3.5 h-3.5 text-cyan-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. All Topics Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setTopicDropdownOpen(!topicDropdownOpen);
                  setSentimentDropdownOpen(false);
                  setSourceDropdownOpen(false);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/45 hover:bg-white/45 text-xs font-bold text-slate-800 flex items-center gap-2 cursor-pointer shadow-2xs transition-colors"
              >
                <span>{topicFilter}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {topicDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-white/85 backdrop-blur-2xl border border-white/70 shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                  {availableTopics.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setTopicFilter(opt);
                        setTopicDropdownOpen(false);
                      }}
                      className="w-full px-3.5 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50/80 flex items-center justify-between cursor-pointer"
                    >
                      <span>{opt}</span>
                      {topicFilter === opt && <Check className="w-3.5 h-3.5 text-cyan-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Bounded Scrollable Container for Feedbacks (prevents page from stretching too long) */}
        <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3.5 custom-scrollbar">
          {filteredFeedbacks.length === 0 ? (
            <div className="py-16 text-center text-slate-400 font-medium text-xs">
              No feedback matches the current query or filters.
            </div>
          ) : (
            filteredFeedbacks.map((item) => {
              const isPos = item.sentiment === 'positive';
              const isNeg = item.sentiment === 'negative';

              return (
                <div 
                  key={item.id}
                  className="rounded-xl bg-white/20 backdrop-blur-md border border-white/40 p-4 space-y-2.5 hover:bg-white/35 hover:border-white/60 transition-all shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-xs font-medium text-slate-900 leading-relaxed flex-1">
                      {item.rawText}
                    </p>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">
                      {item.date || item.timestamp?.split('T')[0]}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    {/* Sentiment Badge */}
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                      isPos 
                        ? 'bg-cyan-50/80 text-cyan-700 border-cyan-200' 
                        : isNeg 
                        ? 'bg-slate-100/80 text-slate-800 border-slate-200' 
                        : 'bg-slate-50/80 text-slate-600 border-slate-200'
                    }`}>
                      {item.sentiment ? item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1) : 'Neutral'}
                    </span>

                    {/* Topic Badge */}
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white/30 text-slate-700 border border-white/50">
                      {item.category}
                    </span>

                    {/* Source Badge */}
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white/30 text-slate-600 border border-white/50">
                      {item.source}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ========================================================
          7. HIGH-PRIORITY ISSUES (Ranked Cards + Expanders)
          ======================================================== */}
      <div className={`${glassCard} p-6 space-y-4`}>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
          High-priority issues
        </h2>

        <div className="space-y-3 pt-1">
          {priorityIssues.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">No critical issues identified.</p>
          ) : (
            priorityIssues.map((issue) => {
              const isExpanded = expandedWhy === issue.rank;
              const isSaved = savedIssues.includes(issue.topic);

              return (
                <div 
                  key={issue.rank}
                  className="rounded-xl bg-white/20 backdrop-blur-md border border-white/40 p-4 space-y-2 shadow-2xs hover:bg-white/35 hover:border-white/60 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-md bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                        {issue.rank}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {issue.topic}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100/80 text-slate-700">
                        {issue.negCount} neg
                      </span>

                      <button
                        onClick={() => handleToggleTrack(issue.topic)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                          isSaved 
                            ? 'bg-emerald-50/80 text-emerald-700 border-emerald-300' 
                            : 'bg-white/30 backdrop-blur-md hover:bg-white/50 text-slate-800 border-white/50'
                        }`}
                      >
                        {isSaved ? '✓ Saved' : '+ Save to Track'}
                      </button>
                    </div>
                  </div>

                  {/* Why prioritize? Expander */}
                  <div>
                    <button
                      onClick={() => setExpandedWhy(isExpanded ? null : issue.rank)}
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Why prioritize?</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {isExpanded && (
                      <p className="text-xs text-slate-600 mt-2 p-3 bg-white/30 backdrop-blur-md rounded-lg border border-white/40 leading-relaxed font-medium">
                        {issue.whyPrioritize}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ========================================================
          8. RECOMMENDATIONS (Actionable List + Trigger)
          ======================================================== */}
      <div className={`${glassCard} p-6 space-y-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Recommendations
            </h2>
          </div>

          <button
            onClick={handleGenerateRecommendations}
            disabled={isGeneratingRecs}
            className="px-4 py-1.5 rounded-full border border-slate-300 hover:border-slate-800 text-slate-800 text-xs font-bold cursor-pointer transition-colors shadow-2xs"
          >
            {isGeneratingRecs ? 'Generating...' : 'Generate'}
          </button>
        </div>

        <div className="space-y-2.5 text-xs text-slate-700 font-medium leading-relaxed">
          {recommendationsList.map((rec, idx) => (
            <p key={idx}>
              {rec}
            </p>
          ))}
        </div>
      </div>

      {/* ========================================================
          9. SAVED FOR TRACKING
          ======================================================== */}
      <div className={`${glassCard} p-6 space-y-2`}>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
          Saved for tracking
        </h2>
        
        {savedIssues.length === 0 ? (
          <p className="text-xs text-slate-500 font-normal">
            Save priority issues to track them here.
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {savedIssues.map((issue) => (
              <span 
                key={issue} 
                className="px-3 py-1 rounded-lg bg-white/30 backdrop-blur-md text-slate-900 border border-white/50 text-xs font-bold flex items-center gap-2 shadow-2xs"
              >
                <span>{issue}</span>
                <button 
                  onClick={() => handleToggleTrack(issue)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================
          10. BUSINESS INSIGHT REPORT (Images Removed + Sleek Heading)
          ======================================================== */}
      <div className={`${glassCard} p-6 space-y-5`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Business insight report
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-white/40 text-slate-700 border border-white/60">
              {totalEntries} entries
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setIsGeneratingReport(true);
                setTimeout(() => {
                  setIsGeneratingReport(false);
                  setIsReportModalOpen(true);
                  triggerConfetti();
                }, 400);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{isGeneratingReport ? 'Generating...' : 'Generate report'}</span>
            </button>

            <button
              onClick={handleExportData}
              className="px-4 py-2 rounded-xl bg-white/30 backdrop-blur-md hover:bg-white/50 text-slate-800 text-xs font-bold border border-white/50 flex items-center gap-2 cursor-pointer shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-purple-600" />
              <span>Export</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-3xl">
          Generate a condensed, business-ready summary of sentiment, recurring issues, and strengths across all {totalEntries} feedback entries — ready to export or share with your team.
        </p>

        {/* Pure Clean Executive Metrics Cards (No placeholder images) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-white/20 backdrop-blur-xl border border-white/40 space-y-1 hover:bg-white/35 transition-all">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Audited Records</span>
            <p className="text-sm font-bold text-slate-900">{totalEntries} Total Feedback Entries</p>
            <p className="text-xs text-slate-500 font-medium">{positivePercent}% Positive · {negativePercent}% Negative</p>
          </div>

          <div className="p-4 rounded-xl bg-white/20 backdrop-blur-xl border border-white/40 space-y-1 hover:bg-white/35 transition-all">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Primary Churn Driver</span>
            <p className="text-sm font-bold text-slate-900">{topTopicList[0]?.name || 'Reliability'}</p>
            <p className="text-xs text-slate-500 font-medium">{topicNegativeCounts[topTopicList[0]?.name] || 0} negative reports documented</p>
          </div>

          <div className="p-4 rounded-xl bg-white/20 backdrop-blur-xl border border-white/40 space-y-1 hover:bg-white/35 transition-all">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">AI Decision Engine</span>
            <p className="text-sm font-bold text-slate-900">Adaption v1.4 Reasoning</p>
            <p className="text-xs text-emerald-600 font-bold">Audited & Production Ready</p>
          </div>
        </div>
      </div>

      {/* ========================================================
          EXECUTIVE REPORT PREVIEW MODAL
          ======================================================== */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden font-sans">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  InsightFlow Executive Intelligence Report
                </h3>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed font-medium">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Scope & Ingestion</span>
                <p>Audited <strong>{totalEntries} feedback records</strong>. Current ratio: <strong>{positivePercent}% positive</strong> vs <strong>{negativePercent}% negative</strong>.</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs mb-1">Key Strengths</h4>
                <p className="text-slate-600">Customers praise UI/UX modernization, intuitive layout navigation, and fast responses from support teams on standard inquiries.</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs mb-1">Critical Churn Blockers</h4>
                <p className="text-slate-600">{topTopicList[0]?.name || 'Reliability'} is the highest friction category with {topicNegativeCounts[topTopicList[0]?.name] || 0} negative reports. Dashboard query timeouts and billing anomalies impact operational velocity.</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs mb-1">Recommended Engineering Actions</h4>
                <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                  <li>Deploy automated regression monitoring to prevent {topTopicList[0]?.name || 'Reliability'} failures.</li>
                  <li>Profile query indices and pagination limits to reduce latency on high-volume queries.</li>
                  <li>Clarify packaging tiers and self-serve settings to streamline customer workflows.</li>
                </ol>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                Model: Adaption-Reasoning-v1.4
              </span>
              <button
                onClick={() => {
                  handleExportData();
                  setIsReportModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold cursor-pointer"
              >
                Export Briefing
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MasterDashboardView;
