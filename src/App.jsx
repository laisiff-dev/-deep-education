import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Tier1Overview from './components/Tier1Overview';
import Tier2Drawer from './components/Tier2Drawer';
import Tier3ManagementTable from './components/Tier3ManagementTable';
import Tier4IndicatorModal from './components/Tier4IndicatorModal';
import DataEntryModal from './components/DataEntryModal';
import SchemaMappingAdmin from './components/SchemaMappingAdmin';
import PdfReportGenerator from './components/PdfReportGenerator';

import initialData from './indicators_data.json';

export default function App() {
  const [indicators, setIndicators] = useState(initialData);
  const [activeNav, setActiveNav] = useState('tier1'); // 'tier1' | 'tier3_com' | 'tier3_cus' | 'entry_sandbox' | 'admin_schema'
  const [selectedPeriod, setSelectedPeriod] = useState('114學年度結算 / 115年第2次填報 (當前期程)');
  
  // 彈窗與抽屜控制狀態
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerAspect, setDrawerAspect] = useState('教學創新精進');
  const [selectedIndicator, setSelectedIndicator] = useState(null); // for Tier 4 Modal
  const [dataEntryIndicator, setDataEntryIndicator] = useState(null); // for Data Entry Modal
  const [pdfReportOpen, setPdfReportOpen] = useState(false);

  // 即時輪詢監控
  const [realtimeEnabled, setRealtimeEnabled] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  // 8 秒機率性微幅波動模擬
  useEffect(() => {
    if (!realtimeEnabled) return;
    const interval = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString());
      setIndicators(prev => {
        return prev.map(item => {
          if (Math.random() < 0.04) { // 4% 機率微幅更新
            const delta = (Math.random() * 0.4 - 0.2); // -0.2% ~ +0.2%
            const newRate = Math.min(100, Math.max(0, Math.round((item.rate + delta) * 100) / 100));
            let newStatus = item.status;
            if (newRate < 70) newStatus = 'CRITICAL';
            else if (newRate < 90) newStatus = 'WARNING';
            else newStatus = 'SUCCESS';

            return {
              ...item,
              rate: newRate,
              rate_formatted: `${newRate.toFixed(1)}%`,
              status: newStatus,
              status_text: newStatus === 'CRITICAL' ? '嚴重落後' : newStatus === 'WARNING' ? '預警關注' : '正常達標'
            };
          }
          return item;
        });
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [realtimeEnabled]);

  const handleRefresh = () => {
    setLastUpdated(new Date().toLocaleTimeString());
    setIndicators([...initialData]);
  };

  // 儲存更新指標
  const handleSaveIndicator = (updated) => {
    setIndicators(prev => prev.map(i => i.id === updated.id ? updated : i));
  };

  // 新增指標 (第三期 117 年擴充)
  const handleAddNewIndicator = (newItem) => {
    setIndicators(prev => [newItem, ...prev]);
  };

  // 開啟抽屜
  const handleOpenDrawer = (aspectKey) => {
    setDrawerAspect(aspectKey);
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* 系統主要導覽列 */}
      <Header
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        realtimeEnabled={realtimeEnabled}
        setRealtimeEnabled={setRealtimeEnabled}
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
        onOpenPdfReport={() => setPdfReportOpen(true)}
      />

      {/* 主要內容區域 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 第一層：首頁大盤戰情視圖 */}
        {activeNav === 'tier1' && (
          <Tier1Overview
            indicators={indicators}
            onNavigateToTier3={(type) => setActiveNav(type === '共同指標' ? 'tier3_com' : 'tier3_cus')}
            onOpenDrawer={handleOpenDrawer}
            onOpenIndicatorModal={(item) => setSelectedIndicator(item)}
            onOpenDataEntry={(item) => setDataEntryIndicator(item)}
          />
        )}

        {/* 第三層：部定共同績效指標 (35項) */}
        {activeNav === 'tier3_com' && (
          <Tier3ManagementTable
            type="共同指標"
            indicators={indicators}
            onGoBack={() => setActiveNav('tier1')}
            onOpenIndicatorModal={(item) => setSelectedIndicator(item)}
            onOpenDataEntry={(item) => setDataEntryIndicator(item)}
          />
        )}

        {/* 第三層：學校自訂績效指標 (39項) */}
        {activeNav === 'tier3_cus' && (
          <Tier3ManagementTable
            type="自訂指標"
            indicators={indicators}
            onGoBack={() => setActiveNav('tier1')}
            onOpenIndicatorModal={(item) => setSelectedIndicator(item)}
            onOpenDataEntry={(item) => setDataEntryIndicator(item)}
          />
        )}

        {/* 雙軌結構化填報沙盒 */}
        {activeNav === 'entry_sandbox' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  雙軌結構化填報與官方對帳沙盒
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  選擇下方任意指標開啟四大結構化模組填報、跨單位協作與 70% 阻斷式檢討介面
                </p>
              </div>
              <span className="text-xs bg-amber-50 text-amber-800 font-bold px-3 py-1 rounded-lg border border-amber-200">
                教育部管考沙盒模式
              </span>
            </div>

            <Tier3ManagementTable
              type="共同指標"
              indicators={indicators}
              onGoBack={() => setActiveNav('tier1')}
              onOpenIndicatorModal={(item) => setSelectedIndicator(item)}
              onOpenDataEntry={(item) => setDataEntryIndicator(item)}
            />
          </div>
        )}

        {/* 後台 Schema Mapping 規格配置 */}
        {activeNav === 'admin_schema' && (
          <SchemaMappingAdmin
            indicators={indicators}
            onSaveIndicator={handleSaveIndicator}
            onAddNewIndicator={handleAddNewIndicator}
          />
        )}
      </main>

      {/* 頁腳 */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 font-medium no-print">
        © 輔英科技大學 Fooyin University • 高教深耕計畫管考辦公室 (智慧戰情雙軌下鑽 v5 旗艦完整版)
      </footer>

      {/* 第二層：面向救火抽屜面板 (Slide Drawer) */}
      <Tier2Drawer
        isOpen={drawerOpen}
        aspectKey={drawerAspect}
        indicators={indicators}
        onClose={() => setDrawerOpen(false)}
        onOpenIndicatorModal={(item) => {
          setDrawerOpen(false);
          setSelectedIndicator(item);
        }}
      />

      {/* 第四層：單項數據立體智慧履歷卡 Modal */}
      {selectedIndicator && (
        <Tier4IndicatorModal
          indicator={selectedIndicator}
          onClose={() => setSelectedIndicator(null)}
          onOpenPdfReport={() => {
            setSelectedIndicator(null);
            setPdfReportOpen(true);
          }}
        />
      )}

      {/* 結構化填報與 70% 阻斷式 Blocking UI Modal */}
      {dataEntryIndicator && (
        <DataEntryModal
          indicator={dataEntryIndicator}
          onClose={() => setDataEntryIndicator(null)}
          onSaveIndicator={handleSaveIndicator}
          onOpenPdfReport={() => {
            setDataEntryIndicator(null);
            setPdfReportOpen(true);
          }}
        />
      )}

      {/* 一鍵產製處室主管審查總表 (PDF) */}
      {pdfReportOpen && (
        <PdfReportGenerator
          indicators={indicators}
          selectedPeriod={selectedPeriod}
          onClose={() => setPdfReportOpen(false)}
        />
      )}
    </div>
  );
}
