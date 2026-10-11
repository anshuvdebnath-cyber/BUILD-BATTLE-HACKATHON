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
  Plus, 
  ChevronDown, 
  Check, 
  FileText, 
  Sparkles, 
  CheckCircle2,
  X,
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SCREENSHOT_PRIORITY_ISSUES, SCREENSHOT_RECOMMENDATIONS } from '../../data/mockData';

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

  // Priority issues accordion state & Saved for tracking
  const [expandedWhy, setExpandedWhy] = useState<number | null>(null);
  const [savedIssues, setSavedIssues] = useState<string[]>([]);
  const [recommendationsList, setRecommendationsList] = useState<string[]>(SCREENSHOT_RECOMMENDATIONS);
  const [isGeneratingRecs, setIsGeneratingRecs] = useState(false);

  // Business report modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Hidden CSV file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ==========================================
  // METRICS COMPUTATIONS
  // ==========================================
  const totalEntries = feedbacks.length;
  const positiveItems = feedbacks.filter(f => f.sentiment === 'positive');
  const negativeItems = feedbacks.filter(f => f.sentiment === 'negative');
  const neutralItems = feedbacks.filter(f => f.sentiment === 'neutral');

  const positivePercent = totalEntries > 0 ? Math.round((positiveItems.length / totalEntries) * 100) : 0;
  const negativePercent = totalEntries > 0 ? Math.round((negativeItems.length / totalEntries) * 100) : 0;

  // Topic cluster counts
  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    feedbacks.forEach(f => {
      counts[f.category] = (counts[f.category] || 0) + 1;
    });
    return counts;
  }, [feedbacks]);

  // Topic negative counts
  const topicNegativeCounts = useMemo(() => {
    const negs: Record<string, number> = {};
    feedbacks.filter(f => f.sentiment === 'negative').forEach(f => {
      negs[f.category] = (negs[f.category] || 0) + 1;
    });
    return negs;
  }, [feedbacks]);

  // Top topic clusters for KPI card
  const topTopicList = useMemo(() => {
    return [
      { name: 'Reliability', count: topicCounts['Reliability'] || 4 },
      { name: 'Performance', count: topicCounts['Performance'] || 5 },
      { name: 'Pricing', count: topicCounts['Pricing'] || 4 },
    ];
  }, [topicCounts]);

  // Recharts: Sentiment Trend Area Data
  const trendData = [
    { month: 'Jan', positive: 1.0, negative: 3.0 },
    { month: 'Feb', positive: 2.0, negative: 2.0 },
    { month: 'Mar', positive: 1.2, negative: 2.0 },
    { month: 'Apr', positive: 2.1, negative: 3.1 },
    { month: 'May', positive: 2.1, negative: 1.0 },
    { month: 'Jun', positive: 1.0, negative: 1.0 },
  ];

  // Recharts: Sentiment Split Donut Data
  const donutData = [
    { name: 'Positive', value: positiveItems.length || 9, color: '#0284c7' }, // vibrant cyan/blue
    { name: 'Neutral', value: neutralItems.length || 3, color: '#94a3b8' },   // gray
    { name: 'Negative', value: negativeItems.length || 12, color: '#090d16' }, // black
  ];

  // Frequently Reported Issues bar data
  const frequentIssues = [
    { topic: 'Reliability', count: topicNegativeCounts['Reliability'] || 4, isPrimary: true },
    { topic: 'Pricing', count: topicNegativeCounts['Pricing'] || 3, isPrimary: false },
    { topic: 'Onboarding', count: topicNegativeCounts['Onboarding'] || 1, isPrimary: false },
    { topic: 'Features', count: topicNegativeCounts['Features'] || 0, isPrimary: false },
  ];

  // Filtered Feedback Inbox items
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter(item => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText = item.rawText.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        const matchesSrc = item.source.toLowerCase().includes(q);
        if (!matchesText && !matchesCat && !matchesSrc) return false;
      }
      // Sentiment filter
      if (sentimentFilter !== 'All sentiment' && item.sentiment.toLowerCase() !== sentimentFilter.toLowerCase()) {
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

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleAnalyzeAndAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedbackText.trim()) return;

    setIsAnalyzing(true);
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
      }
    } catch (err) {
      console.warn('Live predict fallback:', err);
      const lower = newFeedbackText.toLowerCase();
      if (/crash|error|fail|slow|bad|broken|terrible|expensive/i.test(lower)) predSentiment = 'negative';
      else if (/great|love|fast|helpful|clean|fantastic|good/i.test(lower)) predSentiment = 'positive';
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
      await handleCSVUpload(e.target.files[0]);
      triggerConfetti();
    }
  };

  const handleExportData = () => {
    const csvRows = [
      ['ID', 'Date', 'Category', 'Source', 'Sentiment', 'Feedback'].join(','),
      ...feedbacks.map(f => [
        `"${f.id}"`,
        `"${f.date || f.timestamp?.split('T')[0] || ''}"`,
        `"${f.category}"`,
        `"${f.source}"`,
        `"${f.sentiment}"`,
        `"${f.rawText.replace(/"/g, '""')}"`
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
      setRecommendationsList([
        `1. Prioritize fixing ${topTopicList[0].name} first, since it is the leading topic with high customer friction, by deploying automated regression monitors.`,
        `2. Address ${topTopicList[1].name} next by isolating slow query latencies to restore day-to-day workflow efficiency.`,
        `3. Refactor ${topTopicList[2].name} messaging and tiered onboarding packaging to remove surprise costs and protect renewal retention.`
      ]);
      setIsGeneratingRecs(false);
      triggerConfetti();
    }, 600);
  };

  return (
    <div className="w-full max-w-[1240px] mx-auto space-y-6 pb-20 select-text">
      
      {/* Hidden File Input for CSV Ingestion */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleCsvFileChosen} 
        accept=".csv" 
        className="hidden" 
      />

      {/* ========================================================
          1. TOP BRAND HEADER & UTILITY BAR (Screenshot 1)
          ======================================================== */}
      <div className="space-y-3">
        <p className="text-[13px] font-medium text-slate-500 tracking-tight">
          InsightFlow Customer Feedback Analytics Platform
        </p>

        <header className="rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] px-5 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Platform Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 leading-tight tracking-tight">
                InsightFlow
              </h1>
              <p className="text-[11px] font-medium text-slate-500 leading-none">
                Feedback & Decision Platform
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-lg w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all feedback..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 transition-all"
            />
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200/90 flex items-center gap-2 cursor-pointer shadow-2xs transition-colors"
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
      </div>

      {/* ========================================================
          2. HERO ROW: "Turn feedback into decisions" + Submission (Screenshot 1)
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Hero Card */}
        <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200/90 p-6 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden group">
          {/* Subtle light mesh background illustration */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/40 via-purple-50/30 to-white pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <div className="w-full h-32 rounded-xl bg-gradient-to-r from-blue-100/70 via-indigo-50/80 to-cyan-100/60 border border-blue-100/80 p-4 flex flex-col justify-between">
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
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-sans">
                Turn feedback into decisions
              </h2>
              <p className="text-xs font-medium text-slate-500 mt-1">
                {totalEntries} entries analyzed across reviews, surveys & support
              </p>
            </div>
          </div>
        </div>

        {/* Right Submission Card */}
        <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200/90 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-indigo-600 font-extrabold text-sm">✦</span>
            <h3 className="text-sm font-bold text-slate-900">
              Submit new feedback
            </h3>
          </div>

          <textarea
            value={newFeedbackText}
            onChange={(e) => setNewFeedbackText(e.target.value)}
            placeholder="Paste a customer comment..."
            rows={3}
            className="w-full p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 resize-none transition-all"
          />

          <div className="flex items-center justify-between pt-1">
            <select
              value={newFeedbackCategory}
              onChange={(e) => setNewFeedbackCategory(e.target.value as IssueCategory)}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none cursor-pointer hover:border-slate-400 transition-colors"
            >
              <option value="Support">Support</option>
              <option value="Reliability">Reliability</option>
              <option value="Performance">Performance</option>
              <option value="Pricing">Pricing</option>
              <option value="UI/UX">UI/UX</option>
              <option value="Features">Features</option>
              <option value="Onboarding">Onboarding</option>
            </select>

            <button
              onClick={handleAnalyzeAndAdd}
              disabled={isAnalyzing || !newFeedbackText.trim()}
              className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-all ${
                isAnalyzing || !newFeedbackText.trim()
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-cyan-600 hover:bg-cyan-700 text-white'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{isAnalyzing ? 'Analyzing...' : 'Analyze & Add'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================
          3. METRICS ROW: Sentiment Overview | Topic Clusters | Recurring Complaints (Screenshot 1)
          ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Metric 1: Sentiment Overview */}
        <div className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-3">
          <p className="text-xs font-semibold text-slate-500">
            Sentiment overview
          </p>
          <div className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
            {positivePercent}%
          </div>
          <p className="text-xs text-slate-500 font-medium">
            positive · {negativePercent}% negative
          </p>
          
          {/* Dual-tone Progress Bar: Cyan (Positive) & Black (Negative) */}
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
        <div className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-3">
          <p className="text-xs font-semibold text-slate-500">
            Top topic clusters
          </p>
          <div className="space-y-2 pt-1 text-xs">
            {topTopicList.map((cluster) => (
              <div key={cluster.name} className="flex items-center justify-between font-semibold">
                <span className="text-slate-800">{cluster.name}</span>
                <span className="font-mono text-slate-600">{cluster.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Metric 3: Recurring Complaints */}
        <div className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">
              Recurring complaints
            </p>
            <button 
              onClick={() => {
                triggerConfetti();
                alert(`AI Synthesis: ${negativeItems.length} negative entries detected. Top friction centers around Reliability (${topicNegativeCounts['Reliability'] || 4}) and Performance (${topicNegativeCounts['Performance'] || 3}).`);
              }}
              className="text-xs font-bold text-slate-900 hover:text-cyan-700 cursor-pointer"
            >
              Summarize
            </button>
          </div>
          <p className="text-xs text-slate-700 font-medium leading-relaxed">
            {negativeItems.length} negative mentions, led by Reliability and Performance.
          </p>
          <div className="pt-2">
            <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
              Immediate Action Recommended
            </span>
          </div>
        </div>

      </div>

      {/* ========================================================
          4. CHARTS ROW: Sentiment Trend + Sentiment Split (Screenshot 2)
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Sentiment Trend (Spline Area Chart) */}
        <div className="lg:col-span-8 rounded-2xl bg-white border border-slate-200/90 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
          <h3 className="text-xs font-semibold text-slate-500">
            Sentiment trend
          </h3>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="blackGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#090d16" stopOpacity={0.20} />
                    <stop offset="95%" stopColor="#090d16" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={{ stroke: '#e2e8f0' }} 
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  domain={[0, 4]} 
                  ticks={[0, 1, 2, 3, 4]} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#090d16', 
                    borderRadius: '8px', 
                    border: 'none', 
                    fontSize: '11px', 
                    color: '#fff' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="positive" 
                  stroke="#0284c7" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#cyanGradient)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="negative" 
                  stroke="#090d16" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#blackGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Sentiment Split (Donut Chart) */}
        <div className="lg:col-span-4 rounded-2xl bg-white border border-slate-200/90 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-4">
          <h3 className="text-xs font-semibold text-slate-500">
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
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-semibold">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-800">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-600"></span> Positive
              </span>
              <span className="font-mono text-slate-600">{positiveItems.length || 9}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-800">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-400"></span> Neutral
              </span>
              <span className="font-mono text-slate-600">{neutralItems.length || 3}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-800">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#090d16]"></span> Negative
              </span>
              <span className="font-mono text-slate-600">{negativeItems.length || 12}</span>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================
          5. MOST FREQUENTLY REPORTED ISSUES (Screenshot 3)
          ======================================================== */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
        <h3 className="text-xs font-semibold text-slate-500">
          Most frequently reported issues
        </h3>

        <div className="space-y-3 pt-1">
          {frequentIssues.map((issue) => (
            <div key={issue.topic} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span>{issue.topic}</span>
                <span className="font-mono text-slate-500">{issue.count}</span>
              </div>
              <div className="w-full h-4 rounded bg-slate-100/80 overflow-hidden relative">
                <div 
                  className={`h-full transition-all duration-500 ${
                    issue.isPrimary ? 'bg-cyan-600' : 'bg-[#090d16]'
                  }`}
                  style={{ width: `${(issue.count / 4) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Dashed Grid Markers (0, 1, 2, 3, 4) */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100">
          <span>0</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
        </div>
      </div>

      {/* ========================================================
          6. FEEDBACK INBOX (Screenshots 3, 4, 5, 6, 7)
          ======================================================== */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
        
        {/* Header & Filter Pill Dropdowns */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              Feedback inbox
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
              {filteredFeedbacks.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            
            {/* Filter 1: Sentiment Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setSentimentDropdownOpen(!sentimentDropdownOpen);
                  setSourceDropdownOpen(false);
                  setTopicDropdownOpen(false);
                }}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>{sentimentFilter}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>
              {sentimentDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-30 text-xs">
                  {['All sentiment', 'Positive', 'Neutral', 'Negative'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setSentimentFilter(opt);
                        setSentimentDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 font-semibold text-slate-800 flex items-center justify-between"
                    >
                      <span>{opt}</span>
                      {sentimentFilter === opt && <Check className="w-3 h-3 text-cyan-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter 2: Source Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setSourceDropdownOpen(!sourceDropdownOpen);
                  setSentimentDropdownOpen(false);
                  setTopicDropdownOpen(false);
                }}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>{sourceFilter}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>
              {sourceDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-30 text-xs">
                  {['All sources', 'Review', 'Survey', 'Support'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setSourceFilter(opt);
                        setSourceDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 font-semibold text-slate-800 flex items-center justify-between"
                    >
                      <span>{opt}</span>
                      {sourceFilter === opt && <Check className="w-3 h-3 text-cyan-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter 3: Topic Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setTopicDropdownOpen(!topicDropdownOpen);
                  setSentimentDropdownOpen(false);
                  setSourceDropdownOpen(false);
                }}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>{topicFilter}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>
              {topicDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-30 text-xs">
                  {[
                    'All topics',
                    'Performance',
                    'Pricing',
                    'UI/UX',
                    'Support',
                    'Features',
                    'Reliability',
                    'Onboarding',
                  ].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setTopicFilter(opt);
                        setTopicDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 font-semibold text-slate-800 flex items-center justify-between"
                    >
                      <span>{opt}</span>
                      {topicFilter === opt && <Check className="w-3 h-3 text-cyan-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Feedback List Cards */}
        <div className="space-y-3">
          {filteredFeedbacks.map((item) => {
            const isPos = item.sentiment === 'positive';
            const isNeg = item.sentiment === 'negative';

            return (
              <div 
                key={item.id}
                className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition-colors space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <p className="font-medium text-slate-900 leading-relaxed pr-4">
                    {item.rawText}
                  </p>
                  <span className="font-mono text-[11px] text-slate-400 shrink-0">
                    {item.date || item.timestamp?.split('T')[0] || '2024-03-20'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-semibold">
                  {/* Sentiment Badge */}
                  <span className={`px-2 py-0.5 rounded border ${
                    isPos 
                      ? 'border-cyan-300 bg-cyan-50 text-cyan-700' 
                      : isNeg 
                      ? 'border-slate-300 bg-slate-100 text-slate-800' 
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}>
                    {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
                  </span>

                  {/* Topic Badge */}
                  <span className="px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-700">
                    {item.category}
                  </span>

                  {/* Source Badge */}
                  <span className="px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-700">
                    {item.source}
                  </span>
                </div>
              </div>
            );
          })}

          {filteredFeedbacks.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-400">
              No feedback items match your current filter selection.
            </div>
          )}
        </div>

      </div>

      {/* ========================================================
          7. HIGH-PRIORITY ISSUES (Screenshots 7, 8, 9)
          ======================================================== */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
        <h3 className="text-xs font-semibold text-slate-500">
          High-priority issues
        </h3>

        <div className="space-y-3">
          {SCREENSHOT_PRIORITY_ISSUES.map((issue) => {
            const isExpanded = expandedWhy === issue.rank;
            const isTracked = savedIssues.includes(issue.topic);

            return (
              <div 
                key={issue.rank}
                className="p-4 rounded-xl border border-slate-200/90 bg-white space-y-2.5 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded bg-[#090d16] text-white text-[11px] font-bold flex items-center justify-center">
                      {issue.rank}
                    </span>
                    <strong className="text-xs font-bold text-slate-900">
                      {issue.topic}
                    </strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded border border-slate-300 bg-white text-slate-800">
                      {issue.negCount} neg
                    </span>

                    <button
                      onClick={() => handleToggleTrack(issue.topic)}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                        isTracked 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {isTracked ? '✓ Saved' : '+ Save to Track'}
                    </button>
                  </div>
                </div>

                {/* Collapsible "Why prioritize?" link */}
                <div>
                  <button
                    onClick={() => setExpandedWhy(isExpanded ? null : issue.rank)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Why prioritize?</span>
                    <span className="text-[10px]">{isExpanded ? '▴' : '▾'}</span>
                  </button>

                  {isExpanded && (
                    <div className="mt-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium animate-in fade-in duration-150">
                      {issue.whyPrioritize}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          8. RECOMMENDATIONS (Screenshot 9)
          ======================================================== */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Recommendations
            </h3>
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
          9. SAVED FOR TRACKING (Screenshot 8, 10)
          ======================================================== */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-2">
        <h3 className="text-sm font-bold text-slate-900">
          Saved for tracking
        </h3>
        
        {savedIssues.length === 0 ? (
          <p className="text-xs text-slate-500 font-normal">
            Save priority issues to track them here.
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {savedIssues.map((issue) => (
              <span 
                key={issue} 
                className="px-3 py-1 rounded-lg bg-slate-100 text-slate-900 border border-slate-200 text-xs font-bold flex items-center gap-2"
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
          10. BUSINESS INSIGHT REPORT (Screenshot 8, 10)
          ======================================================== */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Left Column: Stacked Visual Media Cards (matching screenshot) */}
          <div className="w-full sm:w-[260px] lg:w-[280px] shrink-0 space-y-3">
            {/* Top Photo: Team reviewing executive dashboard */}
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-2xs aspect-[16/10] bg-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80" 
                alt="Executive insight briefing team" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Bottom Graphic: Multi-stage InsightFlow pipeline diagram */}
            <div className="rounded-xl border border-slate-200 shadow-2xs aspect-[16/10] bg-white p-3 flex flex-col justify-between">
              <div className="grid grid-cols-3 gap-1 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-[8px] font-bold text-slate-400 uppercase">[1]</span>
                  <span className="text-[7.5px] font-bold text-slate-700 leading-tight">PREDICTIVE SCAN</span>
                  <span className="text-[10px] font-black text-cyan-600 mt-0.5">1,245</span>
                  <div className="w-full h-3 mt-1 flex items-end justify-center">
                    <svg className="w-full h-3 text-cyan-500" viewBox="0 0 40 12" fill="none">
                      <path d="M0 10 L8 8 L16 11 L24 4 L32 7 L40 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                <div className="flex flex-col items-center border-x border-slate-100 px-1">
                  <span className="text-[8px] font-bold text-slate-400 uppercase">[2]</span>
                  <span className="text-[7.5px] font-bold text-slate-700 leading-tight">HIGH RISK</span>
                  <span className="text-[10px] font-black text-slate-900 mt-0.5">725</span>
                  <div className="w-5 h-5 rounded-full border-2 border-slate-800 border-t-cyan-500 flex items-center justify-center text-[7px] font-bold mt-0.5">
                    78%
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[8px] font-bold text-slate-400 uppercase">[3]</span>
                  <span className="text-[7.5px] font-bold text-slate-700 leading-tight">ALL CLEAR</span>
                  <span className="text-[10px] font-black text-emerald-600 mt-0.5">76</span>
                  <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[8px] mt-1 font-bold">
                    ✓
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[7.5px] text-slate-400 font-medium">
                <span>Adaption-v1.4</span>
                <span className="text-cyan-600 font-bold">Audited & Verified</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Buttons, Divider, and Description */}
          <div className="flex-1 w-full space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-slate-900">
                  Business insight report
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
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
                  className="px-4 py-2 rounded-lg bg-[#0e7490] hover:bg-[#155e75] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>{isGeneratingReport ? 'Generating...' : 'Generate report'}</span>
                </button>

                <button
                  onClick={handleExportData}
                  className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 flex items-center gap-2 cursor-pointer shadow-2xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-purple-600" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-3xl">
              Generate a condensed, business-ready summary of sentiment, recurring issues, and strengths across all {totalEntries} feedback entries — ready to export or share with your team.
            </p>
          </div>

        </div>
      </div>

      {/* ========================================================
          EXECUTIVE REPORT PREVIEW MODAL
          ======================================================== */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
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
                <p className="text-slate-600">Customers praise UI/UX redesign, modern dark mode polish, and quick support ticket response times on simple inquiries.</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs mb-1">Critical Churn Blockers</h4>
                <p className="text-slate-600">Reliability is 100% negative with recurring billing errors and peak-hour checkout drops. Query latency on dashboards degrades daily workflow velocity.</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs mb-1">Recommended Engineering Actions</h4>
                <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                  <li>Ship immediate stability hotfix for payment card tokenization and database connections.</li>
                  <li>Profile search query indices and dashboard entry pagination to eliminate 504 timeouts.</li>
                  <li>Clarify pricing tier packaging to prevent friction during contract expansion.</li>
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
