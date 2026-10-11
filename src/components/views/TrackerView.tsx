import React from 'react';
import { useApp } from '../../context/AppContext';
import { RecommendationItem } from '../../types';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  UserCheck
} from 'lucide-react';

export const TrackerView: React.FC = () => {
  const { recommendations, updateIssueStatus } = useApp();

  const backlogIssues = recommendations.filter(r => r.status === 'backlog');
  const inProgressIssues = recommendations.filter(r => r.status === 'in_progress');
  const resolvedIssues = recommendations.filter(r => r.status === 'resolved');

  const resolvedArr = resolvedIssues.reduce((sum, r) => sum + r.totalArrAtRisk, 0);
  const pendingArr = [...backlogIssues, ...inProgressIssues].reduce((sum, r) => sum + r.totalArrAtRisk, 0);

  const renderIssueCard = (item: RecommendationItem) => {
    const isCritical = item.severity === 'Critical';

    return (
      <div 
        key={item.id}
        className="insight-card p-4.5 space-y-3 bg-white border border-slate-200"
      >
        <div className="flex items-center justify-between">
          <span className={`text-[10.5px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
            isCritical 
              ? 'bg-rose-50 text-rose-800 border border-rose-200' 
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}>
            {item.severity}
          </span>
          <span className="text-[11px] font-mono font-bold text-slate-500">
            Score: {item.priorityScore}
          </span>
        </div>

        <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
          {item.title}
        </h3>

        <div className="text-xs text-slate-700 bg-slate-50/80 p-3 rounded-xl border border-slate-200 space-y-1 font-medium">
          <span className="text-slate-600 block">Category: <strong className="text-slate-900">{item.category}</strong></span>
          <span className="text-rose-600 font-bold block">${item.totalArrAtRisk.toLocaleString()} Churn Risk</span>
        </div>

        {item.assignee && (
          <div className="text-xs text-slate-600 flex items-center gap-1.5 font-semibold">
            <UserCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>{item.assignee}</span>
          </div>
        )}

        {/* Action Movement Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          {item.status === 'backlog' && (
            <button
              onClick={() => updateIssueStatus(item.id, 'in_progress')}
              className="w-full py-1.5 btn-outline-pill text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Move to In Progress</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          {item.status === 'in_progress' && (
            <div className="flex items-center gap-2 w-full">
              <button
                onClick={() => updateIssueStatus(item.id, 'backlog')}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs cursor-pointer font-bold"
                title="Move back to Backlog"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => updateIssueStatus(item.id, 'resolved')}
                className="flex-1 py-1.5 btn-primary-pill text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mark Resolved</span>
              </button>
            </div>
          )}

          {item.status === 'resolved' && (
            <div className="flex items-center justify-between w-full text-xs text-emerald-800 font-bold">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Resolved & Verified
              </span>
              <button
                onClick={() => updateIssueStatus(item.id, 'in_progress')}
                className="text-xs text-slate-500 hover:text-slate-900 underline cursor-pointer font-semibold"
              >
                Reopen
              </button>
            </div>
          )}
        </div>

      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-['Inter']">
            Issue Execution Board
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1">
            Convert prioritized customer insights into tracked engineering milestones and financial recovery.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-4 py-2 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold shadow-2xs">
            Recovered ARR: <strong className="font-extrabold">${resolvedArr.toLocaleString()}</strong>
          </div>
          <div className="px-4 py-2 rounded-full bg-rose-50 border border-rose-300 text-rose-900 font-bold shadow-2xs">
            Pending Churn: <strong className="font-extrabold">${pendingArr.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* 3-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Column 1: Backlog */}
        <div className="insight-card p-5 space-y-4 bg-slate-50/60">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
              <h2 className="text-sm font-bold text-slate-900">Backlog</h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold">
              {backlogIssues.length}
            </span>
          </div>

          <div className="space-y-3">
            {backlogIssues.map(renderIssueCard)}
            {backlogIssues.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-300 rounded-xl font-medium">
                No items in backlog
              </div>
            )}
          </div>
        </div>

        {/* Column 2: In Progress */}
        <div className="insight-card p-5 space-y-4 bg-white border-slate-300">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></div>
              <h2 className="text-sm font-bold text-slate-900">In Progress</h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
              {inProgressIssues.length}
            </span>
          </div>

          <div className="space-y-3">
            {inProgressIssues.map(renderIssueCard)}
            {inProgressIssues.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-300 rounded-xl font-medium">
                No tickets currently in progress
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Resolved */}
        <div className="insight-card p-5 space-y-4 bg-slate-50/60">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <h2 className="text-sm font-bold text-slate-900">Resolved & Verified</h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-300">
              {resolvedIssues.length}
            </span>
          </div>

          <div className="space-y-3">
            {resolvedIssues.map(renderIssueCard)}
            {resolvedIssues.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-300 rounded-xl font-medium">
                No resolved issues yet
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
