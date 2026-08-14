import React from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  TrendingUp,
  Layers,
  PieChart
} from 'lucide-react';

export default function SummaryCards({ 
  totalCount, 
  avgRate, 
  successCount, 
  warningCount, 
  criticalCount,
  statusFilter,
  setStatusFilter
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
      
      {/* 1. Total Indicators */}
      <div 
        onClick={() => setStatusFilter('ALL')}
        className={`glass-panel p-4 rounded-2xl cursor-pointer glass-panel-hover relative overflow-hidden transition-all ${
          statusFilter === 'ALL' ? 'border-indigo-500/80 ring-2 ring-indigo-500/30 bg-slate-900/90' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">指標總數</span>
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-number font-extrabold text-white tracking-tight">{totalCount}</span>
          <span className="text-xs text-slate-400 font-medium">全校管制指標</span>
        </div>
        <div className="mt-2.5 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-indigo-500 h-full w-full rounded-full" />
        </div>
      </div>

      {/* 2. Overall Average Achievement Rate */}
      <div className="glass-panel p-4 rounded-2xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">平均達成率</span>
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-number font-extrabold text-cyan-300 tracking-tight">{avgRate}%</span>
          <span className="text-xs text-cyan-400/90 font-medium">總體展能指數</span>
        </div>
        <div className="mt-2.5 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(avgRate, 100)}%` }}
          />
        </div>
      </div>

      {/* 3. Normal / Success >= 90% */}
      <div 
        onClick={() => setStatusFilter('SUCCESS')}
        className={`glass-panel p-4 rounded-2xl cursor-pointer glass-panel-hover relative overflow-hidden transition-all ${
          statusFilter === 'SUCCESS' ? 'border-emerald-500/80 ring-2 ring-emerald-500/30 bg-emerald-950/20' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-400/90">正常達標 (≥90%)</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-number font-extrabold text-emerald-400 tracking-tight">{successCount}</span>
          <span className="text-xs text-slate-400 font-medium">
            ({((successCount / totalCount) * 100).toFixed(1)}%)
          </span>
        </div>
        <div className="mt-2.5 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
            style={{ width: `${(successCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* 4. Warning 70% - 90% */}
      <div 
        onClick={() => setStatusFilter('WARNING')}
        className={`glass-panel p-4 rounded-2xl cursor-pointer glass-panel-hover relative overflow-hidden transition-all ${
          statusFilter === 'WARNING' ? 'border-amber-500/80 ring-2 ring-amber-500/30 bg-amber-950/20' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-400/90">預警關注 (70-90%)</span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-number font-extrabold text-amber-400 tracking-tight">{warningCount}</span>
          <span className="text-xs text-slate-400 font-medium">
            ({((warningCount / totalCount) * 100).toFixed(1)}%)
          </span>
        </div>
        <div className="mt-2.5 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-amber-500 h-full rounded-full transition-all duration-1000"
            style={{ width: `${(warningCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* 5. Critical < 70% (FLASHING RED CARD) */}
      <div 
        onClick={() => setStatusFilter('CRITICAL')}
        className={`glass-panel p-4 rounded-2xl cursor-pointer relative overflow-hidden transition-all ${
          criticalCount > 0 ? 'card-critical-flashing border-rose-500/80' : ''
        } ${statusFilter === 'CRITICAL' ? 'ring-4 ring-rose-500/50 scale-[1.02]' : ''}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 signal-dot text-rose-500" />
            <span className="text-xs font-extrabold text-rose-400">嚴重落後 (&lt;70%)</span>
          </div>
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-number font-black text-rose-400 tracking-tight text-glow-red">
            {criticalCount}
          </span>
          <span className="text-xs text-rose-300/80 font-bold">
            ({((criticalCount / totalCount) * 100).toFixed(1)}%)
          </span>
        </div>
        <div className="mt-2.5 w-full bg-slate-950/80 h-1.5 rounded-full overflow-hidden border border-rose-900/50">
          <div 
            className="bg-rose-500 h-full rounded-full animate-pulse"
            style={{ width: `${(criticalCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

    </div>
  );
}
