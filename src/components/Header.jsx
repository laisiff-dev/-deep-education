import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Clock, 
  Maximize2, 
  Minimize2, 
  Radio, 
  RotateCw, 
  ShieldAlert, 
  School,
  Sparkles
} from 'lucide-react';

export default function Header({ 
  realtimeEnabled, 
  setRealtimeEnabled, 
  lastUpdated, 
  onManualRefresh,
  criticalCount,
  onSelectCriticalOnly 
}) {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3.5 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Title & University Branding */}
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-rose-500/20 via-indigo-500/20 to-cyan-500/20 border border-rose-500/30 shadow-lg shadow-rose-950/40">
              <School className="w-6 h-6 text-rose-400" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 signal-dot text-rose-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  輔英科技大學
                </span>
                <span className="text-xs font-mono text-cyan-400/90 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" /> 第二期高教深耕計畫
                </span>
              </div>
              <h1 className="text-xl lg:text-2xl font-black tracking-tight text-white flex items-center gap-2 mt-0.5">
                高教深耕各項指標即時資料屏示看板
              </h1>
            </div>
          </div>

          {/* Mobile Critical Button */}
          {criticalCount > 0 && (
            <button
              onClick={onSelectCriticalOnly}
              className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/50 text-xs font-bold animate-pulse"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              {criticalCount}項告警
            </button>
          )}
        </div>

        {/* Center / Right Control Panel & Real-time Live Clock */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
          
          {/* Live Status Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${realtimeEnabled ? 'bg-emerald-400 signal-dot text-emerald-400' : 'bg-slate-500'}`} />
            <span className="text-slate-300 font-medium">{realtimeEnabled ? '即時連線中' : '靜態監控'}</span>
            <button 
              onClick={() => setRealtimeEnabled(!realtimeEnabled)}
              className={`ml-1.5 px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                realtimeEnabled 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {realtimeEnabled ? '開啟' : '關閉'}
            </button>
          </div>

          {/* Refresh Action */}
          <button
            onClick={onManualRefresh}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all active:scale-95 flex items-center gap-1.5 text-xs font-medium"
            title="手動刷新數據"
          >
            <RotateCw className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">刷新</span>
          </button>

          {/* Clock Display */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200">
            <Clock className="w-4 h-4 text-indigo-400" />
            <div className="flex flex-col text-right leading-none">
              <span className="font-number font-bold text-sm tracking-wider text-cyan-300">{timeStr}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">{dateStr}</span>
            </div>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-950/40 transition-all active:scale-95"
            title={isFullscreen ? "退出全螢幕" : "全螢幕簡報模式"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-rose-400" /> : <Maximize2 className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>

      </div>
    </header>
  );
}
