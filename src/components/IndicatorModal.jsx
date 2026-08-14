import React from 'react';
import { 
  X, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  FileSpreadsheet, 
  Target, 
  Activity, 
  Lightbulb, 
  CheckSquare, 
  Copy, 
  Check 
} from 'lucide-react';

export default function IndicatorModal({ item, onClose }) {
  const [copied, setCopied] = React.useState(false);

  if (!item) return null;

  const isCritical = item.status === 'CRITICAL';
  const isWarning = item.status === 'WARNING';
  const isSuccess = item.status === 'SUCCESS';

  const handleCopy = () => {
    const text = `【${item.aspect}】${item.measure}\n指標類別：${item.type}\n主責單位：${item.dept}\n達成率：${item.rate_formatted}\n原因與改善措施：\n${item.description}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Top Header Bar */}
        <div className={`p-5 flex items-start justify-between border-b ${
          isCritical 
            ? 'bg-gradient-to-r from-rose-950/90 via-slate-900 to-slate-900 border-rose-500/40' 
            : isWarning 
            ? 'bg-gradient-to-r from-amber-950/90 via-slate-900 to-slate-900 border-amber-500/40' 
            : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="space-y-1.5 pr-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {item.id}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300">
                {item.type}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
                {item.aspect}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
              {item.measure}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-200">
          
          {/* Status & Rate Executive Summary Banner */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isCritical 
              ? 'bg-rose-950/40 border-rose-500/50' 
              : isWarning 
              ? 'bg-amber-950/40 border-amber-500/50' 
              : 'bg-emerald-950/30 border-emerald-500/40'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${
                isCritical 
                  ? 'bg-rose-600 text-white animate-pulse' 
                  : isWarning 
                  ? 'bg-amber-500 text-slate-950' 
                  : 'bg-emerald-500 text-slate-950'
              }`}>
                {isCritical && <ShieldAlert className="w-6 h-6" />}
                {isWarning && <AlertTriangle className="w-6 h-6" />}
                {isSuccess && <CheckCircle2 className="w-6 h-6" />}
              </div>

              <div>
                <span className="text-xs text-slate-400 font-medium block">管考判定狀態</span>
                <span className={`text-base font-extrabold ${
                  isCritical ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {item.status_text} (達成率 {item.rate_formatted})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div>
                <span className="text-xs text-slate-400 block">主責單位</span>
                <span className="font-bold text-slate-100 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  {item.dept}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar & Value Details */}
          <div className="glass-panel p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1 font-semibold">
                <Target className="w-4 h-4 text-cyan-400" /> 目標與實績對比
              </span>
              <span className="font-number font-extrabold text-cyan-300 text-sm">
                現況：{item.actual_val}
              </span>
            </div>

            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
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
          </div>

          {/* Root Cause & Analysis (未達標說明) */}
          <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-amber-500 space-y-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              未達標原因與現況說明
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed pl-1">
              {item.description || '目前推動進度符合原定規畫，無顯著異常。'}
            </p>
          </div>

          {/* Action Plan & Improvement Strategy (管考改善措施) */}
          <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-indigo-500 space-y-2">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-indigo-400" />
              相關改善 / 推動管考措施
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed pl-1">
              {item.note && item.note !== '無' && item.note !== '維護良好'
                ? item.note 
                : '1. 持續追蹤各局處與學院填報數據，並定期召開管考會報修正目標。\n2. 結合拔尖輔導與獎助金機制，提升學生及教師參與誘因。'}
            </p>
          </div>

          {/* Raw Fill Values / Historical Records */}
          {item.raw_vals && item.raw_vals.length > 0 && (
            <div className="glass-panel p-4 rounded-2xl space-y-2">
              <h4 className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                填報歷史與教育部核定歷程紀錄
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {item.raw_vals.map((val, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 font-mono text-[11px] whitespace-pre-line">
                    {val}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-400" />}
            {copied ? '已複製摘要' : '複製指標研析簡報'}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-950/50"
          >
            關閉視窗
          </button>
        </div>

      </div>

    </div>
  );
}
