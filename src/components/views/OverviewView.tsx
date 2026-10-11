import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  DollarSign, 
  AlertOctagon, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Layers,
  AlertTriangle,
  CheckCircle2,
  Database,
  FileCheck,
  Cpu,
  BarChart3,
  BookOpen,
  ArrowUpRight,
  Play,
  X,
  Target,
  Clock,
  Search,
  ListOrdered
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const OverviewView: React.FC = () => {
  const { 
    feedbacks, 
    recommendations, 
    qualityMetrics, 
    setActiveTab,
    predictiveEscalations,
    customerHealthScores,
    setActivePlaybook,
    triggerConfetti
  } = useApp();

  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);
  const [processingStep, setProcessingStep] = useState(4);

  const runProcessingSimulator = () => {
    setIsProcessingModalOpen(true);
    setProcessingStep(1);
    setTimeout(() => setProcessingStep(2), 700);
    setTimeout(() => setProcessingStep(3), 1500);
    setTimeout(() => {
      setProcessingStep(4);
      triggerConfetti();
    }, 2300);
  };

  const totalArrAtRisk = recommendations
    .filter(r => r.status !== 'resolved')
    .reduce((sum, r) => sum + r.totalArrAtRisk, 0);

  const criticalIssuesCount = recommendations.filter(
    r => r.severity === 'Critical' && r.status !== 'resolved'
  ).length;

  const negativeCount = feedbacks.filter(f => f.sentiment === 'negative').length;
  const positiveCount = feedbacks.filter(f => f.sentiment === 'positive').length;
  const neutralCount = feedbacks.filter(f => f.sentiment === 'neutral' || f.sentiment === 'mixed').length;

  const sentimentData = [
    { name: 'Negative', value: negativeCount, color: '#ef4444' },
    { name: 'Positive', value: positiveCount, color: '#10b981' },
    { name: 'Neutral / Mixed', value: neutralCount, color: '#64748b' },
  ];

  const topAnomaly = predictiveEscalations[0];
  const atRiskAccounts = customerHealthScores.filter(c => c.status === 'at_risk' || c.status === 'critical').length;
  const avgHealthScore = Math.round(
    customerHealthScores.reduce((acc, c) => acc + c.healthScore, 0) / (customerHealthScores.length || 1)
  );

  return (
    <div className="space-y-6">
      
      {/* Real-time Predictive Escalation Anomaly Alert Banner */}
      {topAnomaly && (
        <div className="p-4 sm:p-4.5 rounded-2xl bg-rose-50/90 border border-rose-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0 text-rose-700 mt-0.5">
              <AlertTriangle className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold uppercase text-[10.5px] px-2 py-0.5 rounded-full bg-rose-200/70 text-rose-900 border border-rose-300">
                  Predictive Anomaly Detected
                </span>
                <span className="font-bold text-rose-900 text-xs">
                  {topAnomaly.title}
                </span>
              </div>
              <p className="text-rose-800 font-medium mt-1 leading-relaxed">
                {topAnomaly.anomalyDescription} <strong>Est. ARR at Risk: ${topAnomaly.estimatedArrExposure.toLocaleString()}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <button
              onClick={() => {
                const rec = recommendations.find(r => r.category === topAnomaly.category);
                if (rec?.playbook) setActivePlaybook(rec.playbook);
                setActiveTab('recommendations');
              }}
              className="px-4 py-1.5 rounded-full bg-rose-950 text-white font-bold text-xs hover:bg-rose-900 cursor-pointer shadow-xs flex items-center gap-1.5 whitespace-nowrap"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Launch Playbook</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className="px-3.5 py-1.5 rounded-full bg-white text-rose-900 font-semibold text-xs border border-rose-300 hover:bg-rose-100 cursor-pointer whitespace-nowrap"
            >
              View Velocity Trends
            </button>
          </div>
        </div>
      )}

      {/* Top Banner with PRD Tagline */}
      <div className="insight-card p-6 sm:p-8 bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-900 text-xs font-bold border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                InsightFlow Command Center
              </span>
              <span className="text-xs text-slate-600 font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                48-Hour Hackathon Sprint
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Domain: <strong className="text-slate-900 font-bold">{qualityMetrics.domainDetected}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-['Inter'] leading-tight">
              Transform Raw Feedback into Actionable Intelligence
            </h1>

            <p className="text-sm font-semibold text-indigo-900/90 leading-relaxed max-w-xl">
              "Transform raw feedback into actionable intelligence with AI-powered analytics."
            </p>

            <p className="text-xs font-normal text-slate-600 leading-relaxed max-w-xl">
              Help businesses prioritize what to fix next by automatically analyzing feedback sentiment, identifying patterns, and scoring issues by impact — built for Product Managers, Customer Success Teams, Founders, and Business Analysts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={runProcessingSimulator}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Simulate PRD Processing Flow</span>
            </button>
            <button
              onClick={() => setActiveTab('feedbacks')}
              className="w-full sm:w-auto px-5 py-2.5 btn-outline-pill text-xs flex items-center justify-center gap-2 cursor-pointer font-semibold"
            >
              <span>Import Your Feedback</span>
            </button>
          </div>
        </div>
      </div>

      {/* PRD Section 2: The Business Problem InsightFlow Solves */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              PRD Section 2: Problem Statement & Opportunity
            </span>
            <h2 className="text-base font-bold text-slate-900">
              The 5 Pain Points Businesses Face with Feedback
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Existing tools lack AI-driven prioritization
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
            <strong className="text-slate-900 font-bold block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> Volume Overload
            </strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              1000s of pieces of feedback across reviews, tickets, emails with no way to find signals in noise.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
            <strong className="text-slate-900 font-bold block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Analysis Paralysis
            </strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              No clarity on which problems affect the most customers or revenue; teams freeze on decisions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
            <strong className="text-slate-900 font-bold block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span> Slow Decisions
            </strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Manual categorization takes weeks; by then, unresolved issues have cascaded into churn.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
            <strong className="text-slate-900 font-bold block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Missed Patterns
            </strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Recurring problems only surface after accumulating complaints instead of at initial onset.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 bg-indigo-50/20 border-indigo-200">
            <strong className="text-indigo-950 font-bold block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span> No Prioritization
            </strong>
            <p className="text-slate-700 text-[11px] leading-relaxed">
              "Fix everything" isn't actionable; product and engineering teams need an ROI-ranked list.
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Data Pipeline Architecture Interactive Visualizer */}
      <div className="insight-card p-6 bg-white border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Feedback Data Pipeline Architecture
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              End-to-end ingestion, Adaptive quality enrichment, clustering, and decision output flow
            </p>
          </div>

          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Pipeline Status: Active & Operational
          </span>
        </div>

        {/* 4 Architectural Pipeline Stages matching diagram */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 text-xs">
          
          {/* Stage 1: Data Input / Validation */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 px-2 py-0.5 rounded bg-amber-100 border border-amber-200">
                1. Data Input & Validation
              </span>
              <Database className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">CSV Data Ingestion</h3>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                Multi-channel feedback ingestion with schema validation, malformed row quarantine, and auto-normalization.
              </p>
            </div>
            <div className="pt-2 border-t border-amber-200/80 text-[10.5px] text-amber-900 font-semibold flex items-center justify-between">
              <span>{feedbacks.length} Rows Ingested</span>
              <span>Schema Verified ✓</span>
            </div>
          </div>

          {/* Stage 2: Data Quality & Enrichment */}
          <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 px-2 py-0.5 rounded bg-sky-100 border border-sky-200">
                2. Adaptive Quality
              </span>
              <Cpu className="w-4 h-4 text-sky-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Deduplication & SFT</h3>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                Adaptive Data recipes prune noisy duplicate reviews and map raw text into role-mapped instruction pairs.
              </p>
            </div>
            <div className="pt-2 border-t border-sky-200/80 text-[10.5px] text-sky-900 font-semibold flex items-center justify-between">
              <span>{qualityMetrics.duplicateRowsEliminated} Dupes Pruned</span>
              <span className="font-bold">+{qualityMetrics.qualityLiftPercentage}% Lift</span>
            </div>
          </div>

          {/* Stage 3: Analysis & Categorization */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 px-2 py-0.5 rounded bg-emerald-100 border border-emerald-200">
                3. Analysis & Clustering
              </span>
              <BarChart3 className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Domain Bucketing</h3>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                Categorization into Fraud, Operations, Service, and Product with actionability and financial exposure scoring.
              </p>
            </div>
            <div className="pt-2 border-t border-emerald-200/80 text-[10.5px] text-emerald-900 font-semibold flex items-center justify-between">
              <span>4 Core Domains</span>
              <span>Filtered & Clustered ✓</span>
            </div>
          </div>

          {/* Stage 4: Output & Execution */}
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 px-2 py-0.5 rounded bg-purple-100 border border-purple-200">
                4. Output & Action
              </span>
              <FileCheck className="w-4 h-4 text-purple-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Decisions & Playbooks</h3>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                Ranked priority recommendations, automated resolution playbooks, and 3-column Kanban issue tracking.
              </p>
            </div>
            <div className="pt-2 border-t border-purple-200/80 text-[10.5px] text-purple-900 font-semibold flex items-center justify-between">
              <span>{recommendations.length} Action Items</span>
              <span className="font-bold">Playbooks Ready ✓</span>
            </div>
          </div>

        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="insight-card p-5">
          <div className="flex items-center justify-between text-slate-500 text-xs uppercase tracking-wider mb-2 font-semibold">
            <span>Revenue at Churn Risk</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            ${totalArrAtRisk.toLocaleString()}
          </div>
          <p className="text-xs text-rose-600 mt-2 flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Across {recommendations.filter(r => r.status !== 'resolved').length} active issues
          </p>
        </div>

        {/* KPI 2 */}
        <div className="insight-card p-5">
          <div className="flex items-center justify-between text-slate-500 text-xs uppercase tracking-wider mb-2 font-semibold">
            <span>Quality Lift Score</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {qualityMetrics.adaptedScore} / 10.0
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Grade {qualityMetrics.adaptedGrade}
            </span>
          </div>
          <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> +{qualityMetrics.qualityLiftPercentage}% lift from baseline ({qualityMetrics.baselineScore})
          </p>
        </div>

        {/* KPI 3 */}
        <div className="insight-card p-5">
          <div className="flex items-center justify-between text-slate-500 text-xs uppercase tracking-wider mb-2 font-semibold">
            <span>Critical Blockers</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {criticalIssuesCount} High-Severity
          </div>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 font-medium">
            Requires immediate executive triage
          </p>
        </div>

        {/* KPI 4 */}
        <div className="insight-card p-5">
          <div className="flex items-center justify-between text-slate-500 text-xs uppercase tracking-wider mb-2 font-semibold">
            <span>Monitored Feedback</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {feedbacks.length} Reviews
          </div>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Deduplicated & Grounded
          </p>
        </div>

      </div>

      {/* Main Grid: Directives & Sentiment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Priority Directives */}
        <div className="lg:col-span-2 insight-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Priority Action Directives
              </h2>
              <p className="text-xs font-normal text-slate-500">
                Derived from causal pattern analysis and account churn vulnerability
              </p>
            </div>
            <button
              onClick={() => setActiveTab('recommendations')}
              className="text-xs text-slate-900 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recommendations.slice(0, 3).map((rec) => (
              <div 
                key={rec.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all bg-slate-50/50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      rec.severity === 'Critical' 
                        ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}>
                      {rec.severity}
                    </span>
                    <span className="text-xs text-slate-500">
                      Score: <strong className="text-slate-900 font-semibold">{rec.priorityScore}/100</strong>
                    </span>
                  </div>
                  <span className="text-xs font-bold text-rose-600">
                    ${rec.totalArrAtRisk.toLocaleString()} at Risk
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-slate-900">
                  {rec.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2">
                  <strong className="text-slate-800 font-medium">Root Cause:</strong> {rec.rootCauseAnalysis}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-500">
                    Projected Lift: <span className="text-emerald-700 font-semibold">{rec.expectedCSATLift}</span>
                  </span>
                  <button
                    onClick={() => setActiveTab('tracker')}
                    className="text-slate-900 hover:text-black font-semibold flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    <span>Track on Board</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Sentiment Radar */}
        <div className="insight-card p-6 space-y-5">
          <div className="pb-3 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900">
              Sentiment Distribution
            </h2>
            <p className="text-xs font-normal text-slate-500">
              Breakdown across all multi-channel customer reviews
            </p>
          </div>

          <div className="h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Sentiment legend */}
          <div className="space-y-2 text-xs">
            {sentimentData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-700 font-medium">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900">
                  {item.value} ({Math.round((item.value / feedbacks.length) * 100 || 0)}%)
                </span>
              </div>
            ))}
          </div>

          {/* Deduplication Summary Card */}
          <div className="pt-3 border-t border-slate-200 text-xs space-y-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-semibold text-slate-800 block">
                Prompt Deduplication Active
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                Condensed {qualityMetrics.duplicateRowsEliminated} redundant complaints into unique, high-signal actionable decision directives.
              </p>
              <button
                onClick={() => setActiveTab('adaption-studio')}
                className="w-full mt-2 py-1.5 btn-outline-pill text-xs text-center cursor-pointer font-medium"
              >
                Inspect Adaptive Studio
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* PRD Section 4.2: Processing Your Data Screen Modal */}
      {isProcessingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Processing Your Data (Adaption Pipeline)
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold">
                    PRD Section 4.2 Ingestion & Fine-Tuning Execution
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsProcessingModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Stepper Body */}
            <div className="p-6 space-y-4 text-xs">
              
              {/* Step 1: CSV Imported */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 font-bold">CSV Imported (2,453 entries)</strong>
                    <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Completed</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">Parsed customer_id, feedback_text, timestamp, and source channel metadata.</p>
                </div>
              </div>

              {/* Step 2: Quality Enhancement via Adaption */}
              <div className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                processingStep >= 2 ? 'bg-slate-50 border-slate-200' : 'bg-white opacity-40 border-slate-100'
              }`}>
                {processingStep >= 2 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 font-bold">Data Quality Enhancement via Adaption...</strong>
                    <span className="text-[10.5px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">Adaptive Recipes</span>
                  </div>
                  <ul className="text-slate-600 text-[11px] space-y-0.5 pl-2 list-disc font-medium">
                    <li>Deduplication: Removed 127 duplicate entries (-5.2%)</li>
                    <li>Standardization: Cleaned text for AI & expanded abbreviations</li>
                    <li>Enrichment: Mapped Prompt, Context & Remediation roles</li>
                  </ul>
                </div>
              </div>

              {/* Step 3: Data Quality Complete */}
              <div className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                processingStep >= 3 ? 'bg-emerald-50/40 border-emerald-200' : 'bg-white opacity-40 border-slate-100'
              }`}>
                {processingStep >= 3 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-emerald-950 font-bold">Data Quality Complete (2,326 cleaned entries)</strong>
                    <span className="text-[11px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">Quality Score: 94/100</span>
                  </div>
                  <p className="text-emerald-800 text-[11px] mt-0.5">Higher score = cleaner, more consistent domain data for custom fine-tuning.</p>
                </div>
              </div>

              {/* Step 4: AI Training Initialization */}
              <div className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                processingStep >= 4 ? 'bg-slate-900 text-white border-slate-800' : 'bg-white opacity-40 border-slate-100'
              }`}>
                {processingStep >= 4 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="font-bold text-white">AI Training Initialization & Classifier Status</strong>
                    <span className="text-[10.5px] font-bold text-emerald-400 bg-white/10 px-2 py-0.5 rounded">Accuracy: 87.3%</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Status: Trained custom feedback classifier. Learns YOUR business terminology & classifies all future feedback with 85%+ accuracy.
                  </p>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">
                ✓ Ready for Decision Execution
              </span>
              <button
                onClick={() => {
                  setIsProcessingModalOpen(false);
                  setActiveTab('recommendations');
                }}
                className="px-5 py-2 btn-primary-pill text-xs font-bold cursor-pointer flex items-center gap-1.5"
              >
                <span>Go to Ranked Recommendations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
