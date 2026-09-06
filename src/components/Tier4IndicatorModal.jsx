import React from 'react';
import { 
  X, 
  Target, 
  Award, 
  TrendingUp, 
  TrendingDown, 
  FileSpreadsheet, 
  FileText, 
  Download, 
  Eye, 
  ShieldCheck, 
  Clock, 
  Building, 
  CheckCircle2, 
  AlertOctagon,
  Printer
} from 'lucide-react';

export default function Tier4IndicatorModal({
  indicator,
  onClose,
  onOpenPdfReport
}) {
  if (!indicator) return null;

  const isCritical = indicator.status === 'CRITICAL';
  const isWarning = indicator.status === 'WARNING';
  const isSuccess = indicator.status === 'SUCCESS';

  // 預設系科拆解數據 (若無則提供對應預設值)
  const collegeDist = indicator.college_distribution || [
    { name: '護理學院', val: Math.round((indicator.actual_num || 100) * 0.475), percent: 47.5, color: 'bg-blue-600' },
    { name: '醫事健康學院', val: Math.round((indicator.actual_num || 100) * 0.300), percent: 30.0, color: 'bg-emerald-600' },
    { name: '環境與生命科學院', val: Math.round((indicator.actual_num || 100) * 0.137), percent: 13.7, color: 'bg-amber-600' },
    { name: '人文管理學院', val: Math.round((indicator.actual_num || 100) * 0.088), percent: 8.8, color: 'bg-purple-600' }
  ];

  // 稽核日誌 (若無則動態生成預設日誌)
  const auditTrail = indicator.audit_trail || [
    { time: '2026/10/12 14:20', actor: '承辦人 (業務單位)', action: `完成日常填報累加實績值：${indicator.actual_val}` },
    { time: '2026/10/15 09:30', actor: '教育部系統同步', action: `校基庫對帳元數據對接 (${indicator.base_table || '學校自填'})，數據核定鎖定` },
    { time: '2026/11/05 16:00', actor: '高教深耕辦公室', action: '一級主管完成紙本核章掃描回傳，行政責任封裝完成' }
  ];

  const handleDownloadExcel = () => {
    alert(`📥 模擬下載已排除重複報送之對帳名冊清單：\n【${indicator.id}_${indicator.measure || indicator.major_item}_採計明細.xlsx】\n\n狀態：MD5 Checksum 已驗證，資料去重完成！`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex justify-center items-center p-4 sm:p-6">
      <div className="bg-slate-50 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-300 overflow-hidden animate-modal flex flex-col max-h-[90vh]">
        
        {/* 頂部深色專業 Header */}
        <div className="bg-slate-900 text-white p-5 flex justify-between items-start border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-blue-600 text-white font-black px-2 py-0.5 rounded">
                第四層 • 單項數據立體智慧履歷卡
              </span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {indicator.final_submitted ? 'STATUS: LOCKED & VERIFIED (已唯讀封存)' : 'STATUS: IN REVIEW (管考審查中)'}
              </span>
            </div>
            <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              <span>{indicator.id}：{indicator.measure || indicator.major_item}</span>
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-1">
              {indicator.type || '部定共同績效指標'} • 主責單位：{indicator.dept_main || indicator.dept} • 數據來源：{indicator.base_table || '學校自填'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 彈窗主體可滾動內容 */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* 四合一立體大字體指標卡 (Grid 1) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
              <span className="text-xs text-slate-500 font-bold block mb-1">🎯 114學年度目標值</span>
              <span className="text-xl font-black text-slate-900">{indicator.target_val}</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
              <span className="text-xs text-slate-500 font-bold block mb-1">📊 教育部官方核定值</span>
              <span className="text-xl font-black text-blue-700">{indicator.actual_val}</span>
            </div>

            <div className={`p-4 rounded-xl border text-center shadow-xs ${
              isCritical ? 'bg-red-50 border-red-200' : isWarning ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
            }`}>
              <span className={`text-xs font-bold block mb-1 ${
                isCritical ? 'text-red-700' : isWarning ? 'text-amber-700' : 'text-emerald-700'
              }`}>
                {isCritical ? '🚨 目前達成率 (落後)' : isWarning ? '🟡 目前達成率 (預警)' : '🟢 目前達成率 (達標)'}
              </span>
              <span className={`text-xl font-black ${
                isCritical ? 'text-red-700' : isWarning ? 'text-amber-700' : 'text-emerald-700'
              }`}>
                {indicator.rate}%
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
              <span className="text-xs text-slate-500 font-bold block mb-1">⚖️ YoY 去年同期比</span>
              <span className={`text-xl font-black flex items-center justify-center gap-0.5 ${
                (indicator.yoy_rate || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {(indicator.yoy_rate || 0) >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                {(indicator.yoy_rate || 0) >= 0 ? `+${indicator.yoy_rate}%` : `${indicator.yoy_rate}%`}
              </span>
            </div>
          </div>

          {/* 中間雙網格：學院拆解與簽核佐證 (Grid 2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 左：系科/學院數據貢獻分流與溯源 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h4 className="text-xs font-extrabold text-slate-900 border-l-3 border-blue-600 pl-2 mb-3">
                學院/系科數據貢獻分流與溯源 (去重對帳)
              </h4>
              <p className="text-[11px] text-slate-500 mb-3">
                全校實績 {indicator.actual_val} 依各學院回報核算貢獻佔比：
              </p>
              
              <div className="space-y-3">
                {collegeDist.map((c, cidx) => (
                  <div key={cidx}>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>{c.name}</span>
                      <span>{c.val} {indicator.unit || '人次'} ({c.percent}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${c.percent}%` }}
                        className={`h-full rounded-full ${c.color || 'bg-blue-600'}`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 右：簽核佐證 (免維護主管線上帳號之行政責任數位封裝) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h4 className="text-xs font-extrabold text-slate-900 border-l-3 border-blue-600 pl-2 mb-3">
                簽核佐證與責任封裝 (免維護主管線上帳號)
              </h4>
              
              <div className="space-y-3">
                {/* Excel 去重採計名冊 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">
                        {indicator.id}_採計明細_{indicator.dept_main || '業務組'}.xlsx
                      </h5>
                      <p className="text-[10px] text-slate-500">
                        已由系統後台排除學號與項目重複 • 1.2 MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadExcel}
                    className="flex items-center gap-1 text-xs font-bold text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>下載</span>
                  </button>
                </div>

                {/* 主管紙本核章掃描回傳 PDF */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-blue-100 text-blue-800 rounded-lg">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">
                        處室一級主管簽章審查總表.pdf
                      </h5>
                      <p className="text-[10px] text-slate-500">
                        處室主管線下實體核章掃描回傳檔 • 狀態：唯讀鎖定
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onOpenPdfReport}
                    className="flex items-center gap-1 text-xs font-bold text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>預覽列印</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 底部雙網格：具體推動成果 / 改善措施 與 Audit Trail 日誌 (Grid 3) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 左：質性成果或 300 字改善措施 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h4 className="text-xs font-extrabold text-slate-900 border-l-3 border-blue-600 pl-2 mb-2">
                {isCritical ? '📝 未達標原因說明與改善措施 (限制 300 字)' : '💡 日常推動具體成果 (質性描述)'}
              </h4>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed min-h-[100px]">
                {indicator.improvement_plan || indicator.qualitative_desc || '持續深化教學品質與學生實務技能輔導，按計畫目標落實各項推動作為。'}
              </div>
              <div className="text-right text-[10px] text-slate-400 font-bold mt-1">
                字數：{(indicator.improvement_plan || indicator.qualitative_desc || '').length} / 300 字
              </div>
            </div>

            {/* 右：系統管考與對帳稽核日誌 (Audit Trail) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h4 className="text-xs font-extrabold text-slate-900 border-l-3 border-blue-600 pl-2 mb-3">
                系統管考與對帳稽核日誌 (Audit Trail)
              </h4>
              <div className="space-y-2.5">
                {auditTrail.map((log, lidx) => (
                  <div key={lidx} className="flex items-start gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                    <div>
                      <span className="font-bold text-slate-900">{log.time}</span>
                      <span className="text-slate-500 ml-1.5 font-medium">({log.actor})</span>
                      <p className="text-slate-600 text-[11px] mt-0.5">{log.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* 彈窗頁尾 */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-between items-center">
          <span className="text-xs text-slate-500 font-medium">
            © 輔英科技大學 - 高教深耕計畫管考辦公室 (智慧立體數據履歷卡)
          </span>
          <div className="flex gap-2">
            <button
              onClick={onOpenPdfReport}
              className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-900 text-white font-bold px-3 py-1.5 rounded-lg transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>匯出核章總表</span>
            </button>
            <button
              onClick={onClose}
              className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-1.5 rounded-lg transition"
            >
              關閉
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
