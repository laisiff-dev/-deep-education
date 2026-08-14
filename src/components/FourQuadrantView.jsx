import React, { useState } from 'react';
import { 
  BookOpen, 
  HeartHandshake, 
  Briefcase, 
  GraduationCap, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown, 
  Building2, 
  Target, 
  Lightbulb, 
  CheckSquare, 
  ArrowLeft, 
  ArrowRight,
  Maximize2,
  FileSpreadsheet
} from 'lucide-react';

const ASPECT_META = {
  '教學創新精進': {
    icon: BookOpen,
    color: 'from-blue-600 to-indigo-700',
    border: 'border-indigo-500/50',
    bg: 'bg-indigo-950/20',
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    text: 'text-indigo-400'
  },
  '善盡社會責任': {
    icon: HeartHandshake,
    color: 'from-emerald-600 to-teal-700',
    border: 'border-emerald-500/50',
    bg: 'bg-emerald-950/20',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    text: 'text-emerald-400'
  },
  '產學合作連結': {
    icon: Briefcase,
    color: 'from-amber-600 to-orange-700',
    border: 'border-amber-500/50',
    bg: 'bg-amber-950/20',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    text: 'text-amber-400'
  },
  '提升高教公共性': {
    icon: GraduationCap,
    color: 'from-cyan-600 to-blue-700',
    border: 'border-cyan-500/50',
    bg: 'bg-cyan-950/20',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-800/50',
    text: 'text-cyan-400'
  }
};

export default function FourQuadrantView({ filteredIndicators, onSelectIndicatorModal }) {
  const aspectNames = ['教學創新精進', '善盡社會責任', '產學合作連結', '提升高教公共性'];

  // State to track currently selected indicator ID for each of the 4 quadrants
  const [selectedIds, setSelectedIds] = useState(() => {
    const initialMap = {};
    aspectNames.forEach(asp => {
      const items = filteredIndicators.filter(i => i.aspect === asp);
      // Prioritize critical <70% item as default selection if exists!
      const critical = items.find(i => i.status === 'CRITICAL');
      initialMap[asp] = critical ? critical.id : (items[0] ? items[0].id : null);
    });
    return initialMap;
  });

  const handleSelectChange = (aspectName, id) => {
    setSelectedIds(prev => ({
      ...prev,
      [aspectName]: id
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* 4 Quadrants Grid Layout (2x2 Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {aspectNames.map((aspectName, quadrantIndex) => {
          const aspectItems = filteredIndicators.filter(i => i.aspect === aspectName);
          const meta = ASPECT_META[aspectName] || ASPECT_META['教學創新精進'];
          const IconComp = meta.icon;

          const totalCount = aspectItems.length;
          const criticalItems = aspectItems.filter(i => i.status === 'CRITICAL');
          const warningItems = aspectItems.filter(i => i.status === 'WARNING');
          const avgRate = totalCount > 0 ? (aspectItems.reduce((acc, cur) => acc + cur.rate, 0) / totalCount).toFixed(1) : '0';

          // Current active item in this quadrant
          const activeId = selectedIds[aspectName] || (aspectItems[0] ? aspectItems[0].id : null);
          const activeItem = aspectItems.find(i => i.id === activeId) || aspectItems[0];
          const activeIndex = aspectItems.findIndex(i => i.id === activeId);

          const isCriticalActive = activeItem?.status === 'CRITICAL';
          const isWarningActive = activeItem?.status === 'WARNING';
          const isSuccessActive = activeItem?.status === 'SUCCESS';

          return (
            <div 
              key={aspectName}
              className={`glass-panel rounded-3xl overflow-hidden border ${meta.border} flex flex-col justify-between transition-all duration-300 shadow-2xl ${
                criticalItems.length > 0 ? 'ring-1 ring-rose-500/30' : ''
              }`}
            >
              
              {/* Quadrant Header */}
              <div className={`p-4 border-b border-slate-800/80 flex items-center justify-between ${meta.bg}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${meta.color} text-white shadow-md`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                        Quadrant 0{quadrantIndex + 1}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${meta.badge}`}>
                        {totalCount}項指標
                      </span>
                    </div>
                    <h2 className="text-base font-extrabold text-white leading-tight">
                      {aspectName}
                    </h2>
                  </div>
                </div>

                {/* Aspect Overall Stats */}
                <div className="flex items-center gap-2 text-right">
                  <div>
                    <span className="text-[10px] text-slate-400 block">面向平均</span>
                    <span className="font-number font-black text-cyan-300 text-sm">{avgRate}%</span>
                  </div>
                  {criticalItems.length > 0 && (
                    <span className="px-2 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs animate-pulse flex items-center gap-1 shadow-md shadow-rose-950">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      {criticalItems.length}落後
                    </span>
                  )}
                </div>
              </div>

              {/* DROPDOWN SELECTOR FOR INDICATORS (核心要求：下拉式選擇器) */}
              <div className="p-4 bg-slate-900/90 border-b border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <ChevronDown className="w-4 h-4 text-cyan-400" />
                    請選擇要檢視之對應指標：
                  </label>
                  <span className="text-[11px] text-slate-400 font-number">
                    ({activeIndex + 1} / {totalCount})
                  </span>
                </div>

                <div className="relative">
                  <select
                    value={activeId || ''}
                    onChange={(e) => handleSelectChange(aspectName, e.target.value)}
                    className={`w-full appearance-none bg-slate-950 text-slate-100 font-medium text-xs rounded-xl px-3.5 py-2.5 pr-10 border transition-all cursor-pointer focus:outline-none focus:ring-2 ${
                      isCriticalActive 
                        ? 'border-rose-500 text-rose-300 focus:ring-rose-500/50 bg-rose-950/30' 
                        : isWarningActive 
                        ? 'border-amber-500 text-amber-300 focus:ring-amber-500/50 bg-amber-950/20' 
                        : 'border-slate-700 text-slate-200 focus:ring-indigo-500/50'
                    }`}
                  >
                    {aspectItems.map((item) => {
                      const icon = item.status === 'CRITICAL' ? '🚨' : item.status === 'WARNING' ? '⚠️' : '✅';
                      return (
                        <option 
                          key={item.id} 
                          value={item.id}
                          className="bg-slate-900 text-slate-100 py-1"
                        >
                          {icon} [{item.rate_formatted}] {item.measure} ({item.status_text})
                        </option>
                      );
                    })}
                  </select>

                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Active Selected Indicator Detail Card (畫面特寫呈現區) */}
              {activeItem ? (
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between bg-slate-950/50">
                  
                  {/* Item Headline & Rate */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
                            {activeItem.id}
                          </span>
                          <span className="text-[10px] text-slate-400">{activeItem.type}</span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                          {activeItem.measure}
                        </h3>
                      </div>

                      {/* Status & Rate Badge */}
                      <div className="text-right shrink-0">
                        <span className={`font-number font-black text-2xl leading-none ${
                          isCriticalActive 
                            ? 'text-rose-400 text-glow-red animate-pulse' 
                            : isWarningActive 
                            ? 'text-amber-400 text-glow-amber' 
                            : 'text-emerald-400 text-glow-emerald'
                        }`}>
                          {activeItem.rate_formatted}
                        </span>
                        <div className="mt-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isCriticalActive 
                              ? 'bg-rose-600 text-white animate-pulse' 
                              : isWarningActive 
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                              : 'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            {activeItem.status_text}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & Value */}
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>實績：<strong className="text-slate-200">{activeItem.actual_val}</strong></span>
                        <span>主責：<strong className="text-indigo-300">{activeItem.dept}</strong></span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800 p-0.5">
                        <div 
                          className={`h-full rounded-full transition-all duration-700 ${
                            isCriticalActive 
                              ? 'bg-gradient-to-r from-rose-600 to-rose-400 animate-pulse' 
                              : isWarningActive 
                              ? 'bg-gradient-to-r from-amber-600 to-amber-400' 
                              : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                          }`}
                          style={{ width: `${Math.min(activeItem.rate, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cause & Action Analysis */}
                  <div className="space-y-2.5">
                    {/* Cause */}
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs">
                      <span className="font-bold text-amber-400 flex items-center gap-1 mb-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> 未達標原因說明
                      </span>
                      <p className="text-[11px] text-slate-300 line-clamp-3 leading-relaxed">
                        {activeItem.description || '目前推動進度正常。'}
                      </p>
                    </div>

                    {/* Action */}
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs">
                      <span className="font-bold text-indigo-400 flex items-center gap-1 mb-1">
                        <CheckSquare className="w-3.5 h-3.5 text-indigo-400" /> 相關改善 / 推動管考措施
                      </span>
                      <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                        {activeItem.note && activeItem.note !== '無' ? activeItem.note : '按進度進行定期追蹤與輔導。'}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 text-xs">
                    {/* Prev / Next Indicator Arrows */}
                    <div className="flex items-center gap-1">
                      <button
                        disabled={activeIndex <= 0}
                        onClick={() => handleSelectChange(aspectName, aspectItems[activeIndex - 1].id)}
                        className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
                        title="上一項指標"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={activeIndex >= totalCount - 1}
                        onClick={() => handleSelectChange(aspectName, aspectItems[activeIndex + 1].id)}
                        className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
                        title="下一項指標"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Open Full Modal Button */}
                    <button
                      onClick={() => onSelectIndicatorModal(activeItem)}
                      className="px-3 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/40 text-[11px] font-bold transition-all flex items-center gap-1"
                    >
                      <Maximize2 className="w-3 h-3" />
                      展開完整研析
                    </button>
                  </div>

                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs">
                  此面向無符合條件的指標
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
