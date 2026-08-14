import React from 'react';
import { 
  Filter, 
  Search, 
  X, 
  LayoutGrid, 
  List, 
  Layers, 
  Grid2X2, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  SlidersHorizontal 
} from 'lucide-react';

export default function FilterBar({
  aspectFilter,
  setAspectFilter,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  filteredCount,
  totalCount
}) {
  const aspects = ['全部面向', '教學創新精進', '善盡社會責任', '產學合作連結', '提升高教公共性'];

  return (
    <div className="glass-panel p-4 rounded-2xl mb-6 space-y-4 shadow-xl">
      
      {/* Top Controls: Search Bar & View Mode Toggle */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Search Box */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋指標項目、關鍵字或主責單位..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Mode & Filter Summary */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap">
          <span className="text-xs text-slate-400 font-medium">
            顯示 <span className="text-cyan-300 font-bold font-number">{filteredCount}</span> / {totalCount} 項指標
          </span>

          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setViewMode('4quadrant')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                viewMode === '4quadrant' 
                  ? 'bg-gradient-to-r from-rose-600 via-indigo-600 to-cyan-600 text-white shadow-md font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid2X2 className="w-3.5 h-3.5 text-rose-400" />
              4分屏切分(下拉)
            </button>
            <button
              onClick={() => setViewMode('aspect')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                viewMode === 'aspect' 
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              按面向分組
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                viewMode === 'grid' 
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              平鋪網格
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                viewMode === 'table' 
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              清單表格
            </button>
          </div>
        </div>

      </div>

      {/* Aspect Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-slate-800/80 pt-3 no-scrollbar">
        <span className="text-xs text-slate-400 font-medium shrink-0 flex items-center gap-1 mr-1">
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" /> 面向過濾：
        </span>
        {aspects.map((asp) => {
          const isSelected = (asp === '全部面向' && aspectFilter === 'ALL') || aspectFilter === asp;
          return (
            <button
              key={asp}
              onClick={() => {
                setAspectFilter(asp === '全部面向' ? 'ALL' : asp);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-950/50'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {asp}
            </button>
          );
        })}
      </div>

      {/* Type & Status Filter Switches */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
        
        {/* Status Filter Switches */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium mr-1">達成狀況：</span>
          
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'ALL'
                ? 'bg-slate-700 text-white border border-slate-600'
                : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            全部狀態
          </button>

          <button
            onClick={() => setStatusFilter('CRITICAL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              statusFilter === 'CRITICAL'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-950/60 ring-2 ring-rose-500/50'
                : 'bg-rose-950/40 text-rose-400 border border-rose-900/60 hover:bg-rose-950/80 animate-pulse'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            🚨 嚴重落後 (&lt;70%)
          </button>

          <button
            onClick={() => setStatusFilter('WARNING')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              statusFilter === 'WARNING'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-950/60 ring-2 ring-amber-500/50'
                : 'bg-amber-950/40 text-amber-400 border border-amber-900/60 hover:bg-amber-950/80'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            ⚠️ 預警關注 (70-90%)
          </button>

          <button
            onClick={() => setStatusFilter('SUCCESS')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              statusFilter === 'SUCCESS'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/60'
                : 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 hover:bg-emerald-950/80'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            ✅ 達標良好 (≥90%)
          </button>
        </div>

        {/* Indicator Type Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">指標類別：</span>
          <div className="flex items-center p-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            {['ALL', '共同指標', '自訂指標'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-0.5 rounded-md font-medium transition-all ${
                  typeFilter === t 
                    ? 'bg-slate-700 text-white font-bold' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t === 'ALL' ? '全部' : t}
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
