import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line
} from 'recharts';
import { 
  Filter, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  Activity, 
  HeartPulse, 
  ShieldCheck, 
  ArrowUpRight,
  Zap,
  Clock,
  Flame,
  Tag,
  Layers,
  ArrowRight,
  CheckCircle2,
  PieChart as PieIcon
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { feedbacks, predictiveEscalations, customerHealthScores, setActiveTab, recommendations } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');

  if (feedbacks.length === 0) {
    return (
      <div className="p-12 sm:p-16 text-center space-y-4 rounded-3xl bg-white/70 backdrop-blur-xl border border-slate-200 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center mx-auto text-purple-700">
          <Activity className="w-7 h-7" />
        </div>
        <div className="space-y-1.5 max-w-lg mx-auto">
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Analytics & Telemetry Standby
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Telemetry metrics, frequency distributions, sentiment clusters, and predictive anomaly forecasts will activate once live data is ingested and Adaption Model Training is completed.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('data-cleaning')}
          className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-black transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
        >
          <span>Open Live Ingestion & Training Hub</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  const filteredFeedbacks = feedbacks.filter(item => {
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesTier = tierFilter === 'all' || item.customerTier === tierFilter;
    return matchesCat && matchesTier;
  });

  // Category frequency data
  const categoryCounts: Record<string, number> = {};
  filteredFeedbacks.forEach(item => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });

  const categoryChartData = Object.keys(categoryCounts).map(cat => ({
    category: cat,
    count: categoryCounts[cat],
  })).sort((a, b) => b.count - a.count);

  const trendData = [
    { day: 'Oct 05', volume: 4, sentiment: 0.6 },
    { day: 'Oct 06', volume: 6, sentiment: 0.4 },
    { day: 'Oct 07', volume: 9, sentiment: -0.2 },
    { day: 'Oct 08', volume: 11, sentiment: 0.1 },
    { day: 'Oct 09', volume: 14, sentiment: -0.5 },
    { day: 'Oct 10', volume: 18, sentiment: -0.7 },
    { day: 'Oct 11', volume: 15, sentiment: -0.6 },
  ];

  const tierArrData = [
    { tier: 'Enterprise', arr: feedbacks.filter(f => f.customerTier === 'Enterprise').reduce((acc, c) => acc + c.arrValue, 0) },
    { tier: 'Pro', arr: feedbacks.filter(f => f.customerTier === 'Pro').reduce((acc, c) => acc + c.arrValue, 0) },
    { tier: 'Starter', arr: feedbacks.filter(f => f.customerTier === 'Starter').reduce((acc, c) => acc + c.arrValue, 0) },
  ];

  const posCount = feedbacks.filter(f => f.sentiment === 'positive').length;
  const neuCount = feedbacks.filter(f => f.sentiment === 'neutral').length;
  const negCount = feedbacks.filter(f => f.sentiment === 'negative').length;
  const totalFeedbackCount = feedbacks.length || 1;

  const sentimentDistribution = [
    { name: 'Positive', value: Math.round((posCount / totalFeedbackCount) * 100), count: `${posCount} items (${Math.round((posCount / totalFeedbackCount) * 100)}%)`, color: '#10b981' },
    { name: 'Neutral', value: Math.round((neuCount / totalFeedbackCount) * 100), count: `${neuCount} items (${Math.round((neuCount / totalFeedbackCount) * 100)}%)`, color: '#64748b' },
    { name: 'Negative', value: Math.round((negCount / totalFeedbackCount) * 100), count: `${negCount} items (${Math.round((negCount / totalFeedbackCount) * 100)}%)`, color: '#ef4444' },
  ];

  const weeklyTrendData = [
    { day: 'Mon', sentimentScore: 0.35, negativePct: 15 },
    { day: 'Tue', sentimentScore: 0.28, negativePct: 18 },
    { day: 'Wed', sentimentScore: 0.12, negativePct: 22 },
    { day: 'Thu', sentimentScore: -0.05, negativePct: 27 },
    { day: 'Fri', sentimentScore: -0.22, negativePct: 34 },
    { day: 'Sat', sentimentScore: -0.45, negativePct: 39 },
    { day: 'Sun', sentimentScore: -0.62, negativePct: 43 },
  ];

  const topPrdIssues = [
    { 
      rank: 1, 
      title: 'Fix Login Failures & OAuth', 
      category: 'Authentication & SSO',
      frequency: 187, 
      sentiment: -0.82, 
      score: 9.2, 
      severity: 'Critical', 
      priorityBucket: 'Fix', 
      badgeColor: 'bg-rose-50 text-rose-800 border-rose-200' 
    },
    { 
      rank: 2, 
      title: 'Slow Performance & Latency', 
      category: 'Performance & Latency',
      frequency: 143, 
      sentiment: -0.71, 
      score: 8.1, 
      severity: 'High', 
      priorityBucket: 'Plan', 
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200' 
    },
    { 
      rank: 3, 
      title: 'Missing CSV Export of Reports', 
      category: 'Reporting & Export',
      frequency: 89, 
      sentiment: -0.58, 
      score: 6.5, 
      severity: 'Medium', 
      priorityBucket: 'Monitor', 
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200' 
    },
    { 
      rank: 4, 
      title: 'Marketplace Rogue Seller Scams', 
      category: 'Fraud and Scam',
      frequency: 215, 
      sentiment: -0.96, 
      score: 9.8, 
      severity: 'Critical', 
      priorityBucket: 'Fix', 
      badgeColor: 'bg-rose-50 text-rose-800 border-rose-200' 
    },
  ];

  const keywordHeatmap = [
    { word: 'OAuth Provider', count: 187, size: 'text-sm font-extrabold text-slate-900 bg-slate-100 border border-slate-200' },
    { word: 'Latency / Freeze', count: 143, size: 'text-sm font-extrabold text-slate-900 bg-slate-100 border border-slate-200' },
    { word: 'SAML SSO Login', count: 132, size: 'text-xs font-bold text-slate-800 bg-slate-100' },
    { word: '2FA Token Error', count: 112, size: 'text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200' },
    { word: 'Escrow Payout', count: 94, size: 'text-xs font-bold text-slate-800 bg-slate-100' },
    { word: 'CSV Export', count: 89, size: 'text-xs font-semibold text-slate-800 bg-slate-100' },
    { word: 'Cart Checkout Glitch', count: 78, size: 'text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200' },
    { word: 'Double Billing Charge', count: 67, size: 'text-xs font-semibold text-slate-700 bg-slate-50' },
    { word: 'Audit Logs Delay', count: 48, size: 'text-xs font-medium text-slate-600 bg-slate-50' },
    { word: 'Dark Mode Request', count: 35, size: 'text-xs font-medium text-slate-500 bg-slate-50' },
  ];

  const channelSegments = [
    { channel: 'Customer Survey', count: '858 entries', percent: '35%', avgSentiment: '-0.42' },
    { channel: 'Zendesk Email', count: '686 entries', percent: '28%', avgSentiment: '-0.68' },
    { channel: 'App Store Review', count: '539 entries', percent: '22%', avgSentiment: '-0.31' },
    { channel: 'Intercom Chat', count: '370 entries', percent: '15%', avgSentiment: '-0.54' },
  ];

  const avgRating = (filteredFeedbacks.reduce((sum, f) => sum + f.rating, 0) / (filteredFeedbacks.length || 1)).toFixed(1);
  const avgSentiment = (filteredFeedbacks.reduce((sum, f) => sum + f.sentimentScore, 0) / (filteredFeedbacks.length || 1)).toFixed(2);

  return (
    <div className="space-y-6">
      
      {/* Analytics Header & Dynamic Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-['Inter']">
            AI-Powered Analysis Dashboard
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1">
            Section 4.3 PRD: Sentiment distribution, weekly velocity trends, top issues ranked, and keyword heatmap.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-600" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-1.5 text-xs insight-input text-slate-900 font-semibold cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Authentication & SSO">Authentication & SSO</option>
            <option value="Performance & Latency">Performance & Latency</option>
            <option value="Reporting & Export">Reporting & Export</option>
            <option value="Fraud and Scam">Fraud and Scam</option>
            <option value="Operational Issues">Operational Issues</option>
            <option value="Customer Service">Customer Service</option>
          </select>

          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3.5 py-1.5 text-xs insight-input text-slate-900 font-semibold cursor-pointer"
          >
            <option value="all">All Tiers</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Pro">Pro</option>
            <option value="Starter">Starter</option>
          </select>
        </div>
      </div>

      {/* Metric Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="insight-card p-5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Average Rating</span>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">
            {avgRating} <span className="text-xs font-semibold text-slate-400">/ 5.0</span>
          </div>
          <span className="text-xs text-slate-600 mt-1.5 block font-medium">From 2,453 customer reviews</span>
        </div>

        <div className="insight-card p-5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Net Sentiment</span>
          <div className="text-3xl font-extrabold text-rose-600 mt-1">
            -0.64
          </div>
          <span className="text-xs text-rose-700 mt-1.5 block font-bold">Negative ↑18% Last 7 Days</span>
        </div>

        <div className="insight-card p-5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Monitored ARR at Risk</span>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">
            $1,164,000
          </div>
          <span className="text-xs text-slate-600 mt-1.5 block font-medium">Active customer subscriptions</span>
        </div>

        <div className="insight-card p-5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Top Priority Score</span>
          <div className="text-3xl font-extrabold text-rose-600 mt-1">
            9.8 <span className="text-xs font-semibold text-slate-400">/ 10</span>
          </div>
          <span className="text-xs text-slate-600 mt-1.5 block font-medium">PRD Ranked Issue #1</span>
        </div>
      </div>

      {/* Row 1: PRD Sentiment Distribution (Donut) & Sentiment Trend Line */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Component 1: Sentiment Distribution (Donut Chart) */}
        <div className="lg:col-span-5 insight-card p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <PieIcon className="w-3.5 h-3.5 text-slate-700" />
                Sentiment Distribution
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                2,453 Ingested
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1">
              Overall Customer Sentiment Split
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Quick health check: % Positive, Neutral, Negative breakdown
            </p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sentimentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val) => [`${val}%`, 'Share']}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
            {sentimentDistribution.map((s) => (
              <div key={s.name} className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }}></span>
                  <span className="text-[11px] font-bold text-slate-700">{s.name}</span>
                </div>
                <div className="text-base font-extrabold text-slate-900">{s.value}%</div>
                <div className="text-[10px] text-slate-500">{s.count.split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Component 2: Sentiment Trend Line (Weekly with Action Alert) */}
        <div className="lg:col-span-7 insight-card p-6 space-y-4 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                Sentiment Trend Line (Weekly)
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                Is Sentiment Improving or Declining?
              </h2>
            </div>
            
            {/* PRD Alert Banner */}
            <div className="p-2 px-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Negative ↑18% Last 7 days — Action needed!</span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} fontWeight={600} />
                <YAxis domain={[-1.0, 1.0]} stroke="#64748b" fontSize={11} fontWeight={600} />
                <Tooltip 
                  formatter={(val: any, name: any) => [
                    name === 'sentimentScore' ? Number(val).toFixed(2) : `${val}%`, 
                    name === 'sentimentScore' ? 'Net Sentiment' : 'Negative Share'
                  ]}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sentimentScore" 
                  name="Net Sentiment"
                  stroke="#ef4444" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#ef4444' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-slate-600 font-medium pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Early pattern detection: Negative trajectory accelerated following mobile app release v2.4.1.</span>
            <button 
              onClick={() => setActiveTab('recommendations')}
              className="text-slate-900 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Ranked Fixes</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </p>
        </div>

      </div>

      {/* Row 2: PRD Top Issues (By Frequency & Impact) & Priority Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Issues Ranked Table */}
        <div className="lg:col-span-8 insight-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Section 4.3 Component: Top Issues Ranked
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                Top Issues (By Frequency & Impact Score)
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-semibold">Sorted by Impact (not just frequency)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10.5px]">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Issue Title</th>
                  <th className="py-2.5 px-3">Frequency</th>
                  <th className="py-2.5 px-3">Sentiment</th>
                  <th className="py-2.5 px-3">Impact Score</th>
                  <th className="py-2.5 px-3">Priority Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {topPrdIssues.map((issue) => (
                  <tr key={issue.rank} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-400">
                      0{issue.rank}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{issue.title}</div>
                      <div className="text-[11px] text-slate-500">{issue.category}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900">{issue.frequency}</span> mentions
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-rose-600 font-mono">{issue.sentiment}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 font-black text-slate-900 text-sm">
                        <span>{issue.score}</span>
                        <span className="text-[11px] text-slate-400 font-normal">/ 10</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${issue.badgeColor}`}>
                        {issue.severity} → {issue.priorityBucket}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Priority Matrix Explanation Card */}
        <div className="lg:col-span-4 insight-card p-6 space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              PRD Priority Decision Framework
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              Priority Matrix Rules
            </h2>
            <p className="text-xs text-slate-600 font-medium mt-1">
              "Fix everything isn't actionable; teams need a ranked list."
            </p>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
              <div>
                <strong className="text-rose-900 font-bold block">CRITICAL ➔ FIX</strong>
                <span className="text-rose-700 text-[11px]">Score &ge; 9.0 • Immediate Engineering Hotfix</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-200/80 text-rose-900 font-bold text-[10.5px]">2 Active</span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
              <div>
                <strong className="text-amber-900 font-bold block">HIGH ➔ PLAN</strong>
                <span className="text-amber-700 text-[11px]">Score 7.5–8.9 • Next Sprint Architecture Task</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-bold text-[10.5px]">1 Active</span>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
              <div>
                <strong className="text-blue-900 font-bold block">MEDIUM ➔ MONITOR / ROADMAP</strong>
                <span className="text-blue-700 text-[11px]">Score 5.0–7.4 • Product Backlog / Feature Scope</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-200/80 text-blue-900 font-bold text-[10.5px]">1 Active</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <strong className="text-slate-800 font-bold block">LOW ➔ BACKLOG</strong>
                <span className="text-slate-600 text-[11px]">Score &lt; 5.0 • Low-frequency cosmetic items</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-bold text-[10.5px]">0 Active</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 text-slate-100 text-[11px] font-mono leading-relaxed">
            <span className="text-indigo-400 font-bold"># PRD Prioritization Formula</span><br/>
            Score = (Freq × Sent_Weight) + (Cust_Impact × Rev_Proxy)
          </div>
        </div>

      </div>

      {/* Row 3: Keyword Heatmap & Customer Segments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Component 5: Keyword Heatmap */}
        <div className="lg:col-span-7 insight-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Keyword Heatmap & Topic Density
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                What's Really Bugging Customers?
              </h2>
            </div>
            <span className="text-[11px] text-slate-500 font-semibold">Size = Mention Frequency</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-center gap-2.5 min-h-[140px]">
            {keywordHeatmap.map((k) => (
              <span
                key={k.word}
                className={`px-3 py-1.5 rounded-xl cursor-default transition-transform hover:scale-105 shadow-2xs ${k.size}`}
              >
                {k.word} <strong className="ml-1 opacity-70 font-mono text-[11px]">({k.count})</strong>
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Extracted via Adaption's Adaptive Topic Extractor recipe; isolated terms with anomalous negative sentiment.
          </p>
        </div>

        {/* Component 6: Customer Segments Breakdown */}
        <div className="lg:col-span-5 insight-card p-6 space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-700" />
              Customer Segments Breakdown
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              Feedback Distribution by Ingestion Source
            </h2>
          </div>

          <div className="space-y-2.5 text-xs">
            {channelSegments.map((c) => (
              <div key={c.channel} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 font-bold block">{c.channel}</strong>
                  <span className="text-slate-500 text-[11px]">{c.count} ({c.percent} of volume)</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-rose-600 block">{c.avgSentiment}</span>
                  <span className="text-[10px] text-slate-400">Avg Sentiment</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* High-Impact Feature 1: Predictive Issue Escalation Observatory */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                <Zap className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold tracking-tight text-slate-900">
                Predictive Issue Escalation Observatory
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white">
                ML Moving-Average Velocity
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Anticipates future failures before they become widespread by projecting issue velocity & sentiment trajectory.
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
            <Activity className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>Real-time Stream Monitoring Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {predictiveEscalations.map((esc, idx) => {
            const isCritical = esc.alertLevel === 'urgent_spike';

            return (
              <div 
                key={idx}
                className={`insight-card p-5 space-y-3 relative overflow-hidden ${
                  isCritical ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    {esc.category}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    isCritical 
                      ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    <TrendingDown className="w-3 h-3" />
                    <span>+{esc.volumeGrowthRate}% Velocity</span>
                  </span>
                </div>

                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {esc.anomalyDescription}
                </p>

                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600 font-medium">
                    <span>Revenue Exposure:</span>
                    <strong className="text-rose-600 font-bold">${esc.estimatedArrExposure.toLocaleString()} ARR</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 font-medium">
                    <span>Predicted SLA Breach:</span>
                    <strong className="text-slate-900 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> ~{esc.predictedSlaBreachDays} Days
                    </strong>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('recommendations')}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                >
                  <span>Inspect Actionable Playbook</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* High-Impact Feature 7: Customer Health Score Cohorts */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                <HeartPulse className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold tracking-tight text-slate-900">
                Customer Health Score Cohorts (0–100)
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Multi-Factor Churn Formula
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Formula: Recent Sentiment (40%) + Issue Count (30%) + Critical Severity (20%) + Tier Engagement (10%)
            </p>
          </div>
        </div>

        {/* Cohort KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="insight-card p-4 border-emerald-200 bg-emerald-50/20 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Healthy Cohort (Score 80–100)
            </span>
            <div className="text-2xl font-black text-emerald-700">
              {customerHealthScores.filter(c => c.healthScore >= 80).length} Accounts
            </div>
            <p className="text-[11.5px] text-emerald-800 font-medium">Consistent positive sentiment, low recurrence</p>
          </div>

          <div className="insight-card p-4 border-amber-200 bg-amber-50/20 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-amber-600" /> Watchlist / Caution (50–79)
            </span>
            <div className="text-2xl font-black text-amber-700">
              {customerHealthScores.filter(c => c.healthScore >= 50 && c.healthScore < 80).length} Accounts
            </div>
            <p className="text-[11.5px] text-amber-800 font-medium">Moderate friction, candidate for retention check-in</p>
          </div>

          <div className="insight-card p-4 border-rose-200 bg-rose-50/20 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> At-Risk Cohort (Score &lt; 50)
            </span>
            <div className="text-2xl font-black text-rose-700">
              {customerHealthScores.filter(c => c.healthScore < 50).length} Accounts
            </div>
            <p className="text-[11.5px] text-rose-800 font-medium">Multiple severe complaints, urgent intervention required</p>
          </div>
        </div>

        {/* Account Health Roster Table */}
        <div className="insight-card overflow-hidden border border-slate-200">
          <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
              Monitored Account Health Matrix
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Showing top priority customer accounts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10.5px]">
                <tr>
                  <th className="py-2.5 px-4">Customer</th>
                  <th className="py-2.5 px-4">Tier</th>
                  <th className="py-2.5 px-4">Health Score</th>
                  <th className="py-2.5 px-4">Churn Risk</th>
                  <th className="py-2.5 px-4">Issues Reported</th>
                  <th className="py-2.5 px-4">Recommended Intervention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {customerHealthScores.slice(0, 5).map((acc) => {
                  const isCritical = acc.status === 'critical';
                  const isCaution = acc.status === 'at_risk';

                  return (
                    <tr key={acc.customerId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{acc.customerName}</div>
                        <div className="text-[11px] font-mono text-slate-400">{acc.customerId}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
                          {acc.customerTier}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 w-8">{acc.healthScore}</span>
                          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                acc.healthScore >= 80 ? 'bg-emerald-500' : acc.healthScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${acc.healthScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] uppercase ${
                          isCritical 
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : isCaution
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {acc.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {acc.openIssuesCount} issues recorded
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-semibold">
                        {acc.recommendedIntervention}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};
