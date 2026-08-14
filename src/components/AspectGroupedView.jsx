import React from 'react';
import IndicatorCard from './IndicatorCard';
import { 
  BookOpen, 
  HeartHandshake, 
  Briefcase, 
  GraduationCap, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp,
  Layers
} from 'lucide-react';

const ASPECT_CONFIG = {
  '教學創新精進': {
    icon: BookOpen,
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-indigo-500/40',
    bgColor: 'bg-indigo-950/20',
    textColor: 'text-indigo-400',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    desc: '深化跨域學習、創新教學課程、ESP/EMI英語與程式設計能力提升'
  },
  '善盡社會責任': {
    icon: HeartHandshake,
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500/40',
    bgColor: 'bg-emerald-950/20',
    textColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    desc: '推動 USR 大學社會責任、SDGs 永續發展融入課程與師生社群'
  },
  '產學合作連結': {
    icon: Briefcase,
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-500/40',
    bgColor: 'bg-amber-950/20',
    textColor: 'text-amber-400',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    desc: '強化產業鏈結、產學雙師共教、三創競賽與校外計畫承接成效'
  },
  '提升高教公共性': {
    icon: GraduationCap,
    color: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-500/40',
    bgColor: 'bg-cyan-950/20',
    textColor: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-800/50',
    desc: '協助經濟或文化不利學生獲得輔導、班排名提升與專業證照考取'
  }
};

export default function AspectGroupedView({ filteredIndicators, onSelectIndicator }) {
  const aspectNames = ['教學創新精進', '善盡社會責任', '產學合作連結', '提升高教公共性'];

  // State to track collapsed/expanded aspect sections
  const [collapsedAspects, setCollapsedAspects] = React.useState({});

  const toggleCollapse = (name) => {
    setCollapsedAspects(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <div className="space-y-8">
      
      {/* Sticky Quick Jump Bar */}
      <div className="sticky top-[68px] z-30 bg-slate-950/90 backdrop-blur-xl py-2 px-4 rounded-xl border border-slate-800/80 flex items-center gap-2 overflow-x-auto shadow-xl no-scrollbar">
        <span className="text-xs text-slate-400 font-bold shrink-0 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-indigo-400" /> 面向快速定位：
        </span>
        {aspectNames.map(name => {
          const config = ASPECT_CONFIG[name];
          const count = filteredIndicators.filter(i => i.aspect === name).length;
          const criticalCount = filteredIndicators.filter(i => i.aspect === name && i.status === 'CRITICAL').length;
          return (
            <a
              key={name}
              href={`#aspect-${name}`}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white transition-all shrink-0 flex items-center gap-1.5"
            >
              <config.icon className={`w-3.5 h-3.5 ${config.textColor}`} />
              <span>{name}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-400 font-number">{count}</span>
              {criticalCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title={`${criticalCount}項落後`} />
              )}
            </a>
          );
        })}
      </div>

      {/* Render Each Aspect Group */}
      {aspectNames.map((aspectName) => {
        const itemsInAspect = filteredIndicators.filter(i => i.aspect === aspectName);
        if (itemsInAspect.length === 0) return null;

        const config = ASPECT_CONFIG[aspectName] || ASPECT_CONFIG['教學創新精進'];
        const IconComponent = config.icon;

        const totalInAspect = itemsInAspect.length;
        const criticalCount = itemsInAspect.filter(i => i.status === 'CRITICAL').length;
        const warningCount = itemsInAspect.filter(i => i.status === 'WARNING').length;
        const successCount = itemsInAspect.filter(i => i.status === 'SUCCESS').length;
        
        const avgRate = (itemsInAspect.reduce((acc, cur) => acc + cur.rate, 0) / totalInAspect).toFixed(1);
        const isCollapsed = collapsedAspects[aspectName];

        return (
          <section 
            key={aspectName}
            id={`aspect-${aspectName}`}
            className={`glass-panel rounded-3xl overflow-hidden border ${config.borderColor} transition-all duration-300 shadow-2xl`}
          >
            
            {/* Aspect Group Header Bar */}
            <div className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 ${config.bgColor}`}>
              
              <div className="flex items-start md:items-center gap-3.5">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${config.color} text-white shadow-lg shadow-indigo-950/50`}>
                  <IconComponent className="w-6 h-6" />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg md:text-xl font-black text-white tracking-tight">
                      {aspectName}
                    </h2>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${config.badgeBg}`}>
                      {totalInAspect} 項對應指標
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl">
                    {config.desc}
                  </p>
                </div>
              </div>

              {/* Aspect Stats & Expand Button */}
              <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-slate-800/60 pt-3 md:pt-0">
                
                {/* Stats Breakdown Pills */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] text-slate-400">平均達成率</span>
                    <span className="font-number font-extrabold text-cyan-300 text-base">{avgRate}%</span>
                  </div>

                  <div className="h-8 w-px bg-slate-800 mx-1" />

                  <div className="flex items-center gap-1.5 text-[11px]">
                    {criticalCount > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold animate-pulse flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        {criticalCount}落後
                      </span>
                    )}
                    {warningCount > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {warningCount}預警
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {successCount}達標
                    </span>
                  </div>
                </div>

                {/* Collapse / Expand Toggle Button */}
                <button
                  onClick={() => toggleCollapse(aspectName)}
                  className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white transition-all ml-2"
                  title={isCollapsed ? "展開此面向指標" : "收合此面向指標"}
                >
                  {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                </button>

              </div>

            </div>

            {/* Aspect Progress Bar */}
            <div className="w-full bg-slate-950 h-1.5 overflow-hidden flex">
              <div 
                className="bg-emerald-500 h-full transition-all duration-700"
                style={{ width: `${(successCount / totalInAspect) * 100}%` }}
                title={`正常達標: ${successCount}項`}
              />
              <div 
                className="bg-amber-500 h-full transition-all duration-700"
                style={{ width: `${(warningCount / totalInAspect) * 100}%` }}
                title={`預警關注: ${warningCount}項`}
              />
              <div 
                className="bg-rose-500 h-full animate-pulse transition-all duration-700"
                style={{ width: `${(criticalCount / totalInAspect) * 100}%` }}
                title={`嚴重落後: ${criticalCount}項`}
              />
            </div>

            {/* Indicator Cards Grid for this Aspect */}
            {!isCollapsed && (
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-950/40">
                {itemsInAspect.map((item) => (
                  <IndicatorCard
                    key={item.id}
                    item={item}
                    onClick={() => onSelectIndicator(item)}
                  />
                ))}
              </div>
            )}

          </section>
        );
      })}

    </div>
  );
}
