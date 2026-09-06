import React from 'react';
import { 
  Printer, 
  X, 
  Download, 
  FileCheck, 
  Building, 
  CheckCircle2, 
  AlertOctagon,
  ShieldCheck
} from 'lucide-react';

export default function PdfReportGenerator({
  indicators,
  selectedPeriod,
  onClose
}) {
  const handlePrint = () => {
    window.print();
  };

  const criticalItems = indicators.filter(i => i.status === 'CRITICAL');
  const warningItems = indicators.filter(i => i.status === 'WARNING');
  const successItems = indicators.filter(i => i.status === 'SUCCESS');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex justify-center items-center p-2 sm:p-6">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh]">
        
        {/* 工具列 (列印時隱藏) */}
        <div className="no-print bg-slate-900 text-white p-4 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-blue-600 rounded text-xs">
              <FileCheck className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                高教深耕計畫處室主管審查總表 (責任簽章網格標準版)
              </h3>
              <p className="text-[11px] text-slate-400">
                期程：{selectedPeriod} • 自動彙整實績、達成率、300字檢討與簽章網格
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>立即列印 / 另存 PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 可列印之審查總表主體 */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-900 bg-white" id="printable-area">
          
          {/* 總表公文標頭 */}
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <h1 className="text-xl font-black tracking-wide text-slate-900 mb-1">
              輔英科技大學 第二期高教深耕計畫
            </h1>
            <h2 className="text-base font-bold text-slate-800">
              各處室管考指標執行實績與未達標檢討審查總表
            </h2>
            <div className="flex justify-between items-center text-xs text-slate-600 mt-3 font-semibold">
              <span>管考期程：<b>{selectedPeriod}</b></span>
              <span>產表日期：{new Date().toLocaleDateString()}</span>
              <span>主管機關：教育部高教深耕計畫辦公室</span>
            </div>
          </div>

          {/* 數據總結大盤 */}
          <div className="grid grid-cols-4 gap-3 text-center text-xs">
            <div className="border border-slate-300 p-2.5 rounded-lg bg-slate-50">
              <span className="text-slate-500 block font-medium">總指標項數</span>
              <span className="text-lg font-black text-slate-900">{indicators.length} 項</span>
            </div>
            <div className="border border-emerald-300 p-2.5 rounded-lg bg-emerald-50">
              <span className="text-emerald-700 block font-medium">🟢 正常達標</span>
              <span className="text-lg font-black text-emerald-800">{successItems.length} 項</span>
            </div>
            <div className="border border-amber-300 p-2.5 rounded-lg bg-amber-50">
              <span className="text-amber-700 block font-medium">🟡 預警關注 (70-90%)</span>
              <span className="text-lg font-black text-amber-800">{warningItems.length} 項</span>
            </div>
            <div className="border border-red-300 p-2.5 rounded-lg bg-red-50">
              <span className="text-red-700 block font-medium">🚨 嚴重落後 (&lt;70%)</span>
              <span className="text-lg font-black text-red-800">{criticalItems.length} 項</span>
            </div>
          </div>

          {/* 1. 嚴重落後與預警指標審查明細 (重點檢討) */}
          <div className="space-y-3">
            <h3 className="text-xs font-black bg-slate-800 text-white px-3 py-1.5 rounded">
              一、重點管考指標清單 (達成率 ≤ 70% 觸發任務 B 檢討與任務 A 對帳)
            </h3>

            <table className="w-full text-left text-xs border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 text-center">
                  <th className="p-2 border-r border-slate-300 w-20">指標代碼</th>
                  <th className="p-2 border-r border-slate-300 text-left">指標項目名稱</th>
                  <th className="p-2 border-r border-slate-300 w-24">主責單位</th>
                  <th className="p-2 border-r border-slate-300 w-20">目標值</th>
                  <th className="p-2 border-r border-slate-300 w-20">當前實績</th>
                  <th className="p-2 border-r border-slate-300 w-20">達成率</th>
                  <th className="p-2 text-left">未達標原因說明與改善措施 (限制300字)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {criticalItems.map((item) => (
                  <tr key={item.id} className="align-top">
                    <td className="p-2 border-r border-slate-300 text-center font-bold text-slate-800 bg-red-50/30">
                      {item.id}
                    </td>
                    <td className="p-2 border-r border-slate-300 font-bold text-slate-900">
                      {item.measure || item.major_item}
                      <div className="text-[10px] text-slate-500 font-normal">
                        {item.base_table || '學校自填'}
                      </div>
                    </td>
                    <td className="p-2 border-r border-slate-300 text-center font-semibold">
                      {item.dept_main || item.dept}
                    </td>
                    <td className="p-2 border-r border-slate-300 text-center font-bold">
                      {item.target_val}
                    </td>
                    <td className="p-2 border-r border-slate-300 text-center font-black text-red-600">
                      {item.actual_val}
                    </td>
                    <td className="p-2 border-r border-slate-300 text-center font-black text-red-600">
                      {item.rate}%
                    </td>
                    <td className="p-2 text-[11px] leading-relaxed text-slate-800">
                      {item.improvement_plan || '尚未填報改善措施 (系統鎖定送出中)'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 2. 責任簽章網格 (Paper Sign-Off Grid) */}
          <div className="pt-4 space-y-3">
            <h3 className="text-xs font-black bg-slate-800 text-white px-3 py-1.5 rounded">
              二、行政責任簽章網格 (免帳號紙本核章封裝機制)
            </h3>
            <p className="text-[11px] text-slate-500 leading-normal">
              本表依據規格書第 3 節「紙本核章、數位封裝」規範產製。主管於線下紙本簽名蓋章後，承辦人掃描回傳系統，方可解鎖教育部官方填報正式送出。
            </p>

            {/* 簽章欄位表格 */}
            <table className="w-full text-xs border border-slate-400 text-center mt-2">
              <tbody>
                <tr className="bg-slate-100 font-bold text-slate-700 h-8">
                  <td className="border border-slate-400 w-1/4">主責業務承辦人</td>
                  <td className="border border-slate-400 w-1/4">業務處室一級主管 (核章)</td>
                  <td className="border border-slate-400 w-1/4">深耕計畫管考執行長</td>
                  <td className="border border-slate-400 w-1/4">計畫主持人 / 校長</td>
                </tr>
                <tr className="h-24">
                  <td className="border border-slate-400 p-2 align-bottom text-slate-400 text-[10px]">
                    簽名/蓋章：_______________<br />
                    日期：2026 年 ___ 月 ___ 日
                  </td>
                  <td className="border border-slate-400 p-2 align-bottom text-slate-400 text-[10px]">
                    簽名/蓋章：_______________<br />
                    日期：2026 年 ___ 月 ___ 日
                  </td>
                  <td className="border border-slate-400 p-2 align-bottom text-slate-400 text-[10px]">
                    簽名/蓋章：_______________<br />
                    日期：2026 年 ___ 月 ___ 日
                  </td>
                  <td className="border border-slate-400 p-2 align-bottom text-slate-400 text-[10px]">
                    簽名/蓋章：_______________<br />
                    日期：2026 年 ___ 月 ___ 日
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-[10px] text-slate-400 text-center pt-4 border-t border-slate-200">
            輔英科技大學 高教深耕計畫戰情室系統自動產製 • 具備教育部校基庫對帳追溯稽核效力
          </div>

        </div>

        {/* 頁尾 (列印時隱藏) */}
        <div className="no-print p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center">
          <span className="text-xs text-slate-500 font-medium">
            列印完成並紙本核章後，請至「雙軌填報沙盒」上傳掃描件以解鎖正式送出。
          </span>
          <button
            onClick={onClose}
            className="text-xs bg-slate-300 hover:bg-slate-400 text-slate-800 font-bold px-4 py-1.5 rounded-lg transition"
          >
            關閉預覽
          </button>
        </div>

      </div>
    </div>
  );
}
