import React from 'react';
import { BarChart2, PieChart, ShieldAlert, Award, ChevronRight } from 'lucide-react';

export default function AspectCharts({ items, onSelectIndicator }) {
  // 1. Group by Aspect
  const aspectNames = ['教學創新精進', '善盡社會責任', '產學合作連結', '提升高教公共性'];
  
  const aspectStats = aspectNames.map(name => {
    const aspectItems = items.filter(i => i.aspect === name);
    const total = aspectItems.length;
    const avg = total > 0 ? (aspectItems.reduce((acc, cur) => acc + cur.rate, 0) / total) : 0;
    const critical = aspectItems.filter(i => i.status === 'CRITICAL').length;
    const warning = aspectItems.filter(i => i.status === 'WARNING').length;
    const success = aspectItems.filter(i => i.status === 'SUCCESS').length;
    return { name, total, avg: round(avg, 1), critical, warning, success };
  });

  function round(val, decimals) {
    return Number(Math.round(val + 'e' + decimals) + 'e-' + decimals);
  }

  // 2. Top 8 lowest rate items
  const sortedLowest = [...items].sort((a, b) => a.rate - b.rate).slice(0, 8);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
      
      {/* Aspect Breakdown Statistics (7 cols) */}
      <div className="lg:col-span-7 glass-panel p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <PieChart className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white">四大面向達成率維度統計</h2>
          </div>
          <span className="text-xs text-slate-400">指標涵蓋率 100%</span>
        </div>

        <div className="space-y-4">
          {aspectStats.map((asp) => (
            <div key={asp.name} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-200 text-sm">{asp.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">共 {asp.total} 項指標</span>
                  <span className="font-number font-extrabold text-cyan-300 text-sm">平均 {asp.avg}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-700" 
                  style={{ width: `${(asp.success / asp.total) * 100}%` }}
                  title={`正常達標: ${asp.success}項`}
                />
                <div 
                  className="bg-amber-500 h-full transition-all duration-700" 
                  style={{ width: `${(asp.warning / asp.total) * 100}%` }}
                  title={`預警關注: ${asp.warning}項`}
                />
                <div 
                  className="bg-rose-500 h-full animate-pulse transition-all duration-700" 
                  style={{ width: `${(asp.critical / asp.total) * 100}%` }}
                  title={`嚴重落後: ${asp.critical}項`}
                />
              </div>

              {/* Stat breakdown badges */}
              <div className="flex items-center justify-between text-[11px] mt-2 text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    達標 {asp.success}
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    預警 {asp.warning}
                  </span>
                  <span className="flex items-center gap-1 text-rose-400 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 signal-dot text-rose-400" />
                    落後 {asp.critical}
                  </span>
                </div>
                <span className="text-slate-500 text-[10px]">比重 {Math.round((asp.total / items.length) * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Lowest Achievement Rates (5 cols) */}
      <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border border-rose-950/40">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              重點關注指標 (達成率最低 Top 8)
            </h2>
          </div>
          <span className="text-[11px] text-rose-400 font-semibold animate-pulse">需優先介入</span>
        </div>

        <div className="space-y-2.5">
          {sortedLowest.map((item, idx) => (
            <div 
              key={item.id}
              onClick={() => onSelectIndicator(item)}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-900 transition-all cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-5 h-5 rounded-md flex items-center justify-center font-number text-xs font-bold shrink-0 ${
                  idx < 3 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-slate-800 text-slate-400'
                }`}>
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-rose-300 transition-colors">
                    {item.measure}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">[{item.aspect}]</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`font-number font-black text-xs px-2 py-0.5 rounded border ${
                  item.rate < 70 
                    ? 'bg-rose-950/80 text-rose-400 border-rose-500/60 animate-pulse' 
                    : 'bg-amber-950/80 text-amber-400 border-amber-500/60'
                }`}>
                  {item.rate_formatted}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
