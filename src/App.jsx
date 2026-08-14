import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import AlertTicker from './components/AlertTicker';
import SummaryCards from './components/SummaryCards';
import AspectCharts from './components/AspectCharts';
import FilterBar from './components/FilterBar';
import FourQuadrantView from './components/FourQuadrantView';
import AspectGroupedView from './components/AspectGroupedView';
import IndicatorCard from './components/IndicatorCard';
import IndicatorModal from './components/IndicatorModal';

import initialData from './indicators_data.json';
import { 
  Building2, 
  FileSpreadsheet, 
  RefreshCw, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Download,
  Info,
  Grid2X2,
  Layers
} from 'lucide-react';

export default function App() {
  const [indicators, setIndicators] = useState(initialData);
  const [aspectFilter, setAspectFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('4quadrant'); // Default: 4-Quadrant Split Screen with Dropdown selector!
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [realtimeEnabled, setRealtimeEnabled] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  // Real-time polling simulation
  useEffect(() => {
    if (!realtimeEnabled) return;
    const interval = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString());
      setIndicators(prev => {
        return prev.map(item => {
          if (Math.random() < 0.05) { // 5% chance of minor update
            const delta = (Math.random() * 0.4 - 0.2); // -0.2% ~ +0.2%
            const newRate = Math.min(100, Math.max(0, Math.round((item.rate + delta) * 10) / 10));
            let newStatus = item.status;
            if (newRate < 70) newStatus = 'CRITICAL';
            else if (newRate < 90) newStatus = 'WARNING';
            else newStatus = 'SUCCESS';

            return {
              ...item,
              rate: newRate,
              rate_formatted: `${newRate.toFixed(1)}%`,
              status: newStatus,
              status_text: newStatus === 'CRITICAL' ? '嚴重落後' : newStatus === 'WARNING' ? '預警/待加強' : '正常達標'
            };
          }
          return item;
        });
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [realtimeEnabled]);

  const handleManualRefresh = () => {
    setLastUpdated(new Date().toLocaleTimeString());
    setIndicators([...initialData]);
  };

  // Filtering logic
  const filteredIndicators = useMemo(() => {
    return indicators.filter(item => {
      // Aspect filter
      if (aspectFilter !== 'ALL' && item.aspect !== aspectFilter) return false;
      // Type filter
      if (typeFilter !== 'ALL' && item.type !== typeFilter) return false;
      // Status filter
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchMeasure = item.measure?.toLowerCase().includes(q);
        const matchAspect = item.aspect?.toLowerCase().includes(q);
        const matchDept = item.dept?.toLowerCase().includes(q);
        const matchMajor = item.major_item?.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        if (!matchMeasure && !matchAspect && !matchDept && !matchMajor && !matchDesc) return false;
      }
      return true;
    });
  }, [indicators, aspectFilter, typeFilter, statusFilter, searchQuery]);

  // Aggregate statistics
  const totalCount = indicators.length;
  const criticalItems = useMemo(() => indicators.filter(i => i.status === 'CRITICAL'), [indicators]);
  const warningItems = useMemo(() => indicators.filter(i => i.status === 'WARNING'), [indicators]);
  const successItems = useMemo(() => indicators.filter(i => i.status === 'SUCCESS'), [indicators]);
  const avgRate = useMemo(() => {
    if (totalCount === 0) return 0;
    const sum = indicators.reduce((acc, cur) => acc + cur.rate, 0);
    return (sum / totalCount).toFixed(1);
  }, [indicators, totalCount]);

  // Export CSV functionality
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "代碼,指標類別,面向,指標項目,達成率,狀態,主責單位,未達標原因說明,改善措施\n";
    filteredIndicators.forEach(i => {
      const row = [
        `"${i.id}"`,
        `"${i.type}"`,
        `"${i.aspect}"`,
        `"${i.measure.replace(/"/g, '""')}"`,
        `"${i.rate_formatted}"`,
        `"${i.status_text}"`,
        `"${i.dept}"`,
        `"${(i.description || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        `"${(i.note || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
      ].join(",");
      csvContent += row + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `高教深耕指標監控報表_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-rose-500 selection:text-white">
      
      {/* Header Bar */}
      <Header
        realtimeEnabled={realtimeEnabled}
        setRealtimeEnabled={setRealtimeEnabled}
        lastUpdated={lastUpdated}
        onManualRefresh={handleManualRefresh}
        criticalCount={criticalItems.length}
        onSelectCriticalOnly={() => setStatusFilter('CRITICAL')}
      />

      {/* Alert Ticker for Critical Items (<70%) */}
      <AlertTicker
        criticalItems={criticalItems}
        onSelectIndicator={(item) => setSelectedIndicator(item)}
      />

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        
        {/* KPI Executive Overview Cards */}
        <SummaryCards
          totalCount={totalCount}
          avgRate={avgRate}
          successCount={successItems.length}
          warningCount={warningItems.length}
          criticalCount={criticalItems.length}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Aspect Statistics & Lowest Rate Top 8 Chart */}
        <AspectCharts
          items={indicators}
          onSelectIndicator={(item) => setSelectedIndicator(item)}
        />

        {/* Interactive Filter Bar */}
        <FilterBar
          aspectFilter={aspectFilter}
          setAspectFilter={setAspectFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
          filteredCount={filteredIndicators.length}
          totalCount={totalCount}
        />

        {/* Export CSV & Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Grid2X2 className="w-4 h-4 text-rose-400" />
            <span>
              {viewMode === '4quadrant' && '四大面向4分屏戰情視圖 (下拉式選擇對應指標)'}
              {viewMode === 'aspect' && '四大面向對應指標專區'}
              {viewMode === 'grid' && '全校指標平鋪網格'}
              {viewMode === 'table' && '全校指標清單表格'}
            </span>
            {statusFilter === 'CRITICAL' && (
              <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                🚨 僅顯示嚴重落後指標 ({filteredIndicators.length}項)
              </span>
            )}
          </h2>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            匯出監控報表 (CSV)
          </button>
        </div>

        {/* 1. FOUR QUADRANT SPLIT SCREEN WITH DROPDOWNS (NEW DEFAULT!) */}
        {viewMode === '4quadrant' && (
          <FourQuadrantView
            filteredIndicators={filteredIndicators}
            onSelectIndicatorModal={(item) => setSelectedIndicator(item)}
          />
        )}

        {/* 2. ASPECT GROUPED VIEW */}
        {viewMode === 'aspect' && (
          <AspectGroupedView
            filteredIndicators={filteredIndicators}
            onSelectIndicator={(item) => setSelectedIndicator(item)}
          />
        )}

        {/* 3. FLAT GRID VIEW */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIndicators.map(item => (
              <IndicatorCard
                key={item.id}
                item={item}
                onClick={() => setSelectedIndicator(item)}
              />
            ))}
          </div>
        )}

        {/* 4. TABLE VIEW */}
        {viewMode === 'table' && (
          <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">代碼</th>
                    <th className="p-3.5">類別</th>
                    <th className="p-3.5">面向</th>
                    <th className="p-3.5">指標項目名稱</th>
                    <th className="p-3.5 text-right">達成率</th>
                    <th className="p-3.5">判定狀態</th>
                    <th className="p-3.5">主責單位</th>
                    <th className="p-3.5 text-center">研析彈窗</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredIndicators.map(item => (
                    <tr 
                      key={item.id}
                      onClick={() => setSelectedIndicator(item)}
                      className={`hover:bg-slate-900/90 transition-colors cursor-pointer ${
                        item.status === 'CRITICAL' ? 'bg-rose-950/20' : item.status === 'WARNING' ? 'bg-amber-950/10' : ''
                      }`}
                    >
                      <td className="p-3.5 font-mono text-cyan-400 font-bold">{item.id}</td>
                      <td className="p-3.5">{item.type}</td>
                      <td className="p-3.5 font-semibold text-slate-200">{item.aspect}</td>
                      <td className="p-3.5 font-bold text-white max-w-xs truncate">{item.measure}</td>
                      <td className="p-3.5 text-right font-number font-black text-sm">
                        <span className={
                          item.status === 'CRITICAL' ? 'text-rose-400 text-glow-red' : item.status === 'WARNING' ? 'text-amber-400' : 'text-emerald-400'
                        }>
                          {item.rate_formatted}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          item.status === 'CRITICAL' 
                            ? 'bg-rose-600 text-white animate-pulse' 
                            : item.status === 'WARNING' 
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' 
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {item.status_text}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-400">{item.dept}</td>
                      <td className="p-3.5 text-center">
                        <button className="px-2.5 py-1 rounded bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all text-[11px]">
                          細節
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredIndicators.length === 0 && (
          <div className="glass-panel p-12 rounded-2xl text-center space-y-3">
            <Info className="w-10 h-10 text-slate-500 mx-auto" />
            <p className="text-slate-300 font-bold">沒有找到符合篩選條件的指標</p>
            <p className="text-xs text-slate-500">請嘗試清除關鍵字搜尋或切換狀態篩選器。</p>
            <button
              onClick={() => {
                setAspectFilter('ALL');
                setTypeFilter('ALL');
                setStatusFilter('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold transition-all mt-2"
            >
              重置所有篩選
            </button>
          </div>
        )}

      </main>

      {/* Indicator Detail Slide-Over Modal */}
      {selectedIndicator && (
        <IndicatorModal
          item={selectedIndicator}
          onClose={() => setSelectedIndicator(null)}
        />
      )}

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 輔英科技大學 Fooyin University - 高教深耕計畫管考辦公室</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>資料來源：第二期高教深耕計畫指標 (115年第2次填報彙整版)</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400 font-mono">v1.2.0 4-Quadrant Dropdown Split Screen</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
