import React from 'react';
import { 
  LayoutDashboard, 
  TableProperties, 
  FileEdit, 
  Settings, 
  FileSpreadsheet, 
  RefreshCw, 
  Printer, 
  CheckCircle2, 
  Layers,
  Sparkles,
  Calendar
} from 'lucide-react';

export default function Header({
  activeNav,
  setActiveNav,
  selectedPeriod,
  setSelectedPeriod,
  realtimeEnabled,
  setRealtimeEnabled,
  lastUpdated,
  onRefresh,
  onOpenPdfReport
}) {
  const periods = [
    '114學年度結算 / 115年第2次填報 (當前期程)',
    '114-1 學期官方核定快照 (已封存)',
    '114-2 學期官方核定快照 (已封存)',
    '113 學年度歷史快照 (已封存)',
    '115-1 學期日常填報中'
  ];

  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
      {/* 頂部系統核心標題與狀態列 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap justify-between items-center gap-4">
        {/* 左側 Logo 與系統主標 */}
        <div className="flex items-center gap-3.5">
          <div className="bg-blue-900 text-white font-black px-3 py-2 rounded-xl text-sm tracking-wider shadow-sm flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-300" />
            <span>輔英 IR</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                高教深耕計畫指標即時追蹤戰情室
              </h1>
              <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200">
                v5 元數據驅動雙軌版
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Metadata-Driven 架構 • 雙軌下鑽管考 • 阻斷式 70% 改善機制 • 紙本核章數位封裝
            </p>
          </div>
        </div>

        {/* 右側快照期程、輪詢與動作按鈕 */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Snapshot 歷史快照選擇器 */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>期程快照：</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-transparent border-none text-xs font-bold text-blue-900 focus:ring-0 cursor-pointer outline-none"
            >
              {periods.map((p, idx) => (
                <option key={idx} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* 一鍵產製 PDF 審查表 */}
          <button
            onClick={onOpenPdfReport}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all"
            title="一鍵動態產製處室主管紙本審查總表"
          >
            <Printer className="w-3.5 h-3.5 text-slate-300" />
            <span>產製審查總表 (PDF)</span>
          </button>

          {/* 即時更新與手動刷新 */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
            <button
              onClick={() => setRealtimeEnabled(!realtimeEnabled)}
              className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded transition-all ${
                realtimeEnabled 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-slate-200 text-slate-600'
              }`}
              title="切換 8 秒自動輪詢模擬"
            >
              <span className={`w-2 h-2 rounded-full ${realtimeEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
              <span>{realtimeEnabled ? '即時監控中' : '已暫停'}</span>
            </button>
            <button
              onClick={onRefresh}
              className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-200 rounded transition"
              title={`最後更新：${lastUpdated} (點擊重設)`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 導覽列標籤切換 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between border-t border-slate-100 overflow-x-auto">
        <nav className="flex space-x-1 py-1.5">
          <button
            onClick={() => setActiveNav('tier1')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeNav === 'tier1'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>第一層：首頁戰情大盤</span>
          </button>

          <button
            onClick={() => setActiveNav('tier3_com')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeNav === 'tier3_com'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TableProperties className="w-4 h-4" />
            <span>第三層：部定共同指標 (35項)</span>
          </button>

          <button
            onClick={() => setActiveNav('tier3_cus')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeNav === 'tier3_cus'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>第三層：學校自訂指標 (39項)</span>
          </button>

          <button
            onClick={() => setActiveNav('entry_sandbox')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeNav === 'entry_sandbox'
                ? 'bg-amber-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileEdit className="w-4 h-4" />
            <span>雙軌填報與官方沙盒</span>
          </button>

          <button
            onClick={() => setActiveNav('admin_schema')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeNav === 'admin_schema'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>後台 Schema Mapping 配置</span>
          </button>
        </nav>

        <div className="hidden lg:flex items-center text-xs text-slate-400 font-medium py-1">
          <span>教育部高教深耕第二期管考規範 • 閾值 70% 告警連動</span>
        </div>
      </div>
    </header>
  );
}
