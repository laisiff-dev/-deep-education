import React from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Building2, 
  Target, 
  Activity, 
  ArrowRight,
  FileText
} from 'lucide-react';

export default function IndicatorCard({ item, onClick }) {
  const isCritical = item.status === 'CRITICAL';
  const isWarning = item.status === 'WARNING';
  const isSuccess = item.status === 'SUCCESS';

  return (
    <div
      onClick={onClick}
      className={`glass-panel p-4 rounded-2xl cursor-pointer relative overflow-hidden transition-all duration-300 flex flex-col justify-between group ${
        isCritical 
          ? 'card-critical-flashing border-rose-500/90 hover:scale-[1.02]' 
          : isWarning 
          ? 'card-warning-pulsing border-amber-500/70 hover:scale-[1.01]' 
          : 'card-success-glow hover:border-emerald-500/60 hover:scale-[1.01]'
      }`}
    >
      
      {/* Top Card Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-950/80 text-cyan-300 border border-cyan-800/40">
              {item.type}
            </span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-300 border border-slate-800">
              {item.aspect}
            </span>
          </div>

          {/* Status Badge */}
          {isCritical && (
            <span className="flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-md shadow-rose-950/80 animate-pulse border border-rose-400/50">
              <ShieldAlert className="w-3.5 h-3.5" />
              🚨 嚴重落後
            </span>
          )}

          {isWarning && (
            <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <AlertTriangle className="w-3.5 h-3.5" />
              ⚠️ 預警關注
            </span>
          )}

          {isSuccess && (
            <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              正常達標
            </span>
          )}
        </div>

        {/* Measure Name */}
        <h3 className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors leading-snug line-clamp-2 min-h-[2.5rem]">
          {item.measure}
        </h3>

        {/* Responsible Department */}
        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
          <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="truncate">{item.dept}</span>
        </div>
      </div>

      {/* Rate & Progress Section */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        
        {/* Target vs Actual */}
        <div className="flex items-end justify-between mb-1.5">
          <div className="text-xs">
            <span className="text-slate-400 block text-[10px]">目標現況</span>
            <span className="font-semibold text-slate-200 text-xs">{item.actual_val}</span>
          </div>

          <div className="text-right">
            <span className="text-slate-400 block text-[10px]">達成率</span>
            <span className={`font-number font-black text-xl leading-none ${
              isCritical 
                ? 'text-rose-400 text-glow-red' 
                : isWarning 
                ? 'text-amber-400 text-glow-amber' 
                : 'text-emerald-400 text-glow-emerald'
            }`}>
              {item.rate_formatted}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950/80 h-2 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
          <div 
            className={`h-full rounded-full transition-all duration-700 ${
              isCritical 
                ? 'bg-gradient-to-r from-rose-600 to-rose-400 animate-pulse' 
                : isWarning 
                ? 'bg-gradient-to-r from-amber-600 to-amber-400' 
                : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
            }`}
            style={{ width: `${Math.min(item.rate, 100)}%` }}
          />
        </div>

        {/* Hover Click Action */}
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-cyan-300 transition-colors">
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3 text-indigo-400" />
            查看研析與改善措施
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all" />
        </div>

      </div>

    </div>
  );
}
