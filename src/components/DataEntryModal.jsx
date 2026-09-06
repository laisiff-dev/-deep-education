import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Upload, 
  FileCheck, 
  Lock, 
  Unlock, 
  AlertOctagon, 
  CheckCircle2, 
  FileText, 
  Calculator, 
  Layers, 
  Printer, 
  ShieldAlert,
  Info
} from 'lucide-react';

export default function DataEntryModal({
  indicator,
  onClose,
  onSaveIndicator,
  onOpenPdfReport
}) {
  if (!indicator) return null;

  // 雙軌工作流模式：'daily' (日常即時追蹤) vs 'official' (教育部官方填報沙盒)
  const [trackMode, setTrackMode] = useState('official');

  // 表單資料狀態
  const [targetVal, setTargetVal] = useState(indicator.target_num || 1000);
  const [actualVal, setActualVal] = useState(indicator.actual_num || 131);
  const [numerator, setNumerator] = useState(indicator.numerator || 131);
  const [denominator, setDenominator] = useState(indicator.denominator || 400);
  const [qualitativeText, setQualitativeText] = useState(indicator.qualitative_desc || '');
  const [improvementText, setImprovementText] = useState(indicator.improvement_plan || '');
  
  // 防呆與核章狀態
  const [dedupChecked, setDedupChecked] = useState(indicator.dedup_verified || false);
  const [hasUploadedSignedPdf, setHasUploadedSignedPdf] = useState(indicator.signed_pdf_uploaded || false);
  const [simulatedFileName, setSimulatedFileName] = useState(indicator.signed_pdf_uploaded ? '主管核章掃描回傳檔_教務長.pdf' : '');

  // 跨單位子格子
  const [subGrids, setSubGrids] = useState(indicator.sub_grids || [
    { dept: '研發處 (教師社群)', val: 200, unit: indicator.unit || '人次' },
    { dept: '學務處 (學生社團)', val: 609, unit: indicator.unit || '人次' },
    { dept: '教務處 (成長社群)', val: 0, unit: indicator.unit || '人次' }
  ]);
  const [isMainDeptApproved, setIsMainDeptApproved] = useState(true);

  // 動態計算達成率 (依填報模式)
  const calculatedRate = (() => {
    if (indicator.form_mode_id === 3) {
      // 模式三：分子 / 分母
      if (!denominator || denominator <= 0) return 0;
      return Math.round((numerator / denominator) * 10000) / 100;
    } else if (indicator.form_mode_id === 4) {
      return 100.0;
    } else {
      // 模式一 & 二：實際數 / 目標數
      if (!targetVal || targetVal <= 0) return 0;
      return Math.round((actualVal / targetVal) * 10000) / 100;
    }
  })();

  const isBelow70 = calculatedRate <= 70.0;

  // 阻斷式檢核條件 (Blocking UI Lock Check)
  const validationErrors = [];
  if (trackMode === 'official') {
    if (indicator.form_mode_id === 2 && !dedupChecked) {
      validationErrors.push('【任務 A】模式二必須勾選「已逐筆核對內容，無重複報送」');
    }
    if (indicator.form_mode_id === 3 && numerator > denominator) {
      validationErrors.push('【邏輯避錯】模式三分子不可大於分母');
    }
    if (isBelow70 && (!improvementText || improvementText.trim().length < 10)) {
      validationErrors.push('【任務 B 阻斷】達成率 ≤ 70%，必須填寫 300 字未達標原因與改善措施 (至少10字)');
    }
    if (!hasUploadedSignedPdf) {
      validationErrors.push('【行政責任封裝】必須上傳一級主管紙本核章掃描回傳檔');
    }
  }

  const isSubmitDisabled = validationErrors.length > 0;

  const handleSimulatePdfUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSimulatedFileName(file.name);
      setHasUploadedSignedPdf(true);
    } else {
      setSimulatedFileName('處室一級主管簽核總表_掃描核章檔.pdf');
      setHasUploadedSignedPdf(true);
    }
  };

  const handleSubmit = () => {
    if (isSubmitDisabled) {
      alert('⚠️ 系統處於阻斷鎖定狀態，請滿足所有檢核條件！');
      return;
    }

    const updated = {
      ...indicator,
      target_num: targetVal,
      actual_num: indicator.form_mode_id === 3 ? numerator : actualVal,
      target_val: indicator.form_mode_id === 3 ? `${denominator} ${indicator.unit || ''}` : `${targetVal} ${indicator.unit || ''}`,
      actual_val: indicator.form_mode_id === 3 ? `${numerator} ${indicator.unit || ''}` : `${actualVal} ${indicator.unit || ''}`,
      rate: calculatedRate,
      rate_formatted: `${calculatedRate.toFixed(1)}%`,
      rate_decimal: calculatedRate / 100.0,
      status: calculatedRate < 70 ? 'CRITICAL' : calculatedRate < 90 ? 'WARNING' : 'SUCCESS',
      status_text: calculatedRate < 70 ? '嚴重落後' : calculatedRate < 90 ? '預警關注' : '正常達標',
      improvement_plan: improvementText,
      qualitative_desc: qualitativeText,
      dedup_verified: dedupChecked,
      signed_pdf_uploaded: hasUploadedSignedPdf,
      final_submitted: true,
      sub_grids: subGrids
    };

    onSaveIndicator(updated);
    alert(`🎉 【${indicator.id}】填報資料已成功封裝並寫入戰情室！\n\n當期達成率：${calculatedRate}%\n狀態：已完成紙本核章數位封存。`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-slate-50 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-300 overflow-hidden animate-modal flex flex-col max-h-[92vh]">
        
        {/* 頂部 Header */}
        <div className="bg-slate-900 text-white p-5 flex justify-between items-center border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-amber-600 text-white font-black px-2 py-0.5 rounded">
                雙軌結構化填報沙盒
              </span>
              <span className="text-xs text-slate-300 font-bold">
                {indicator.form_mode || '結構化模組'}
              </span>
            </div>
            <h2 className="text-base font-extrabold text-white">
              【{indicator.id}】{indicator.measure || indicator.major_item}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 雙軌模式切換列 */}
        <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">填報軌道：</span>
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setTrackMode('daily')}
                className={`text-xs font-bold px-3 py-1 rounded-md transition ${
                  trackMode === 'daily'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2.1 日常即時追蹤 (極簡手填)
              </button>
              <button
                onClick={() => setTrackMode('official')}
                className={`text-xs font-bold px-3 py-1 rounded-md transition ${
                  trackMode === 'official'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2.2 教育部官方填報沙盒 (嚴謹管考)
              </button>
            </div>
          </div>

          <button
            onClick={onOpenPdfReport}
            className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-900 text-white font-bold px-3 py-1.5 rounded-lg transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>產製審查總表 (PDF)</span>
          </button>
        </div>

        {/* 表單填報區塊 */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* 模組一至四動態渲染 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-600" />
                <span>數據填報與公式計算 ({indicator.form_mode})</span>
              </h4>
              <span className="text-xs text-slate-500 font-bold">
                計量單位：{indicator.unit || '人次'} • 數據來源：{indicator.base_table || '學校自填'}
              </span>
            </div>

            {/* 模式一：直接線上新增 */}
            {indicator.form_mode_id === 1 && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    年度目標值 (唯讀鎖定)：
                  </label>
                  <input
                    type="number"
                    disabled
                    value={targetVal}
                    className="w-full bg-slate-100 border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">
                    當期累加實績值 (輸入累加數字)：
                  </label>
                  <input
                    type="number"
                    value={actualVal}
                    onChange={(e) => setActualVal(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-blue-400 rounded-lg p-2 text-xs font-extrabold text-blue-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* 模式二：數值手填 + 萬用佐證 + 人工防錯去重勾選 */}
            {indicator.form_mode_id === 2 && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      年度目標值 (唯讀)：
                    </label>
                    <input
                      type="number"
                      disabled
                      value={targetVal}
                      className="w-full bg-slate-100 border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-900 block mb-1">
                      核實實績值 (去重後人次)：
                    </label>
                    <input
                      type="number"
                      value={actualVal}
                      onChange={(e) => setActualVal(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-blue-400 rounded-lg p-2 text-xs font-extrabold text-blue-900 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* 心理防呆去重勾選 */}
                <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-lg">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dedupChecked}
                      onChange={(e) => setDedupChecked(e.target.checked)}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div className="text-xs">
                      <span className="font-extrabold text-blue-900">
                        【任務 A 心理防呆】已逐筆核對內容，無重複報送
                      </span>
                      <p className="text-[11px] text-blue-700 mt-0.5">
                        防範如競賽獲獎或證照由 154 人次翻倍為 308 人次之重複匯入錯誤，強制執行去重。
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* 模式三：比例/比率型動態表單 (強制拆分分子分母) */}
            {indicator.form_mode_id === 3 && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-900 block mb-1">
                      分子 (達成數/人數)：
                    </label>
                    <input
                      type="number"
                      value={numerator}
                      onChange={(e) => setNumerator(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-blue-400 rounded-lg p-2 text-xs font-extrabold text-blue-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-900 block mb-1">
                      分母 (總數/基準數)：
                    </label>
                    <input
                      type="number"
                      value={denominator}
                      onChange={(e) => setDenominator(parseFloat(e.target.value) || 1)}
                      className="w-full bg-white border border-blue-400 rounded-lg p-2 text-xs font-extrabold text-blue-900"
                    />
                  </div>
                </div>
                {numerator > denominator && (
                  <div className="p-2 bg-red-50 text-red-700 text-xs font-bold rounded border border-red-200 flex items-center gap-1">
                    <AlertOctagon className="w-3.5 h-3.5" />
                    <span>邏輯避錯提示：分子不可大於分母！</span>
                  </div>
                )}
                <div className="text-xs text-slate-500">
                  系統自動運算比率：<b>{calculatedRate}%</b> (嚴禁人工直接輸入百分比)
                </div>
              </div>
            )}

            {/* 模式四：純質性策略描述 */}
            {indicator.form_mode_id === 4 && (
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <label className="font-bold text-slate-900">
                    質性推動策略描述 (上限 500 字)：
                  </label>
                  <span className={`font-bold ${qualitativeText.length > 500 ? 'text-red-600' : 'text-slate-500'}`}>
                    {qualitativeText.length} / 500 字
                  </span>
                </div>
                <textarea
                  rows="3"
                  value={qualitativeText}
                  onChange={(e) => setQualitativeText(e.target.value)}
                  placeholder="請詳述推動策略與具體量化/質化成果..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            )}

            {/* 當前計算達成率燈號 Bar */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700">即時計算達成率：</span>
              <div className="flex items-center gap-2">
                <span className={`badge-capsule ${isBelow70 ? 'red' : calculatedRate < 90 ? 'yellow' : 'green'}`}>
                  {calculatedRate}% ({isBelow70 ? '🚨 嚴重落後' : calculatedRate < 90 ? '🟡 預警關注' : '🟢 正常達標'})
                </span>
              </div>
            </div>
          </div>

          {/* 跨單位協作動態子格子 (針對 SDGs/USR 等指標) */}
          {indicator.sub_grids && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>跨單位分填子格子 (動態長出 Grid 1, Grid 2...)</span>
                </h4>
                <span className="text-[11px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">
                  主責單位具備 Final Review 最終核定權
                </span>
              </div>

              <div className="space-y-2">
                {subGrids.map((g, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-xs font-bold text-slate-800 w-44">{g.dept}：</span>
                    <input
                      type="number"
                      value={g.val}
                      onChange={(e) => {
                        const newGrids = [...subGrids];
                        newGrids[idx].val = parseFloat(e.target.value) || 0;
                        setSubGrids(newGrids);
                        const totalSub = newGrids.reduce((a, b) => a + (b.val || 0), 0);
                        setActualVal(totalSub);
                      }}
                      className="bg-white border border-slate-300 rounded p-1 text-xs font-bold text-center w-28"
                    />
                    <span className="text-xs text-slate-500 font-bold">{g.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 任務 B：達成率 ≤ 70% 阻斷式強制管考 (Blocking UI) */}
          {isBelow70 && (
            <div className="bg-red-50 p-5 rounded-xl border-2 border-red-300 space-y-3 animate-fade-in">
              <div className="flex justify-between items-center text-red-900">
                <h4 className="text-xs font-black flex items-center gap-1.5 text-red-700">
                  <ShieldAlert className="w-4 h-4" />
                  <span>【任務 B】達成率 ≤ 70% 強制管考 (阻斷式 Blocking UI)</span>
                </h4>
                <span className={`text-xs font-bold ${improvementText.length > 300 ? 'text-red-700 font-black' : 'text-slate-500'}`}>
                  {improvementText.length} / 300 字
                </span>
              </div>
              <p className="text-[11px] text-red-700">
                本指標實績達成率僅 <b>{calculatedRate}%</b>，依管考規定承辦人必須於 300 字元限制內填寫未達標原因與具體改善措施，否則系統將鎖定【正式送出】鍵。
              </p>
              <textarea
                rows="3"
                value={improvementText}
                onChange={(e) => setImprovementText(e.target.value)}
                placeholder="請填寫未達標原因分析與後續補救改善策略 (限制 300 字，至少 10 字)..."
                className="w-full bg-white border border-red-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-red-500"
              ></textarea>
            </div>
          )}

          {/* 行政責任數位封裝：紙本核章掃描回傳機制 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-600" />
              <span>行政責任數位封裝 (主管線下紙本核章回傳)</span>
            </h4>
            <p className="text-[11px] text-slate-500">
              免維護主管線上帳號，主管於線下紙本審查總表核章後，上傳掃描檔作為解鎖正式送出之必要條件。
            </p>

            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="flex items-center gap-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold px-3 py-2 rounded-lg cursor-pointer transition">
                <Upload className="w-3.5 h-3.5" />
                <span>上傳主管紙本核章掃描檔 (PDF/JPG)</span>
                <input
                  type="file"
                  onChange={handleSimulatePdfUpload}
                  className="hidden"
                  accept=".pdf,.png,.jpg"
                />
              </label>

              {hasUploadedSignedPdf ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>已上傳：{simulatedFileName || '處室主管簽核總表.pdf'} (已驗證)</span>
                </div>
              ) : (
                <span className="text-xs text-slate-400 font-medium">
                  尚未上傳核章檔 (正式送出鍵鎖定中)
                </span>
              )}
            </div>
          </div>

          {/* 阻斷式錯誤提示清單 */}
          {validationErrors.length > 0 && trackMode === 'official' && (
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 space-y-1">
              <div className="font-extrabold flex items-center gap-1.5 text-amber-800">
                <Lock className="w-4 h-4" />
                <span>系統目前處於【正式送出鎖定】狀態，請先完成以下必要條件：</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] pl-1">
                {validationErrors.map((err, idx) => (
                  <li key={idx} className="font-bold text-rose-700">{err}</li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* 彈窗頁尾動作列 */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-between items-center">
          <button
            onClick={onClose}
            className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2 rounded-lg transition"
          >
            取消關閉
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                alert('💾 已暫存填報草稿 (日常追蹤模式，不強制鎖定)！');
                onClose();
              }}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-lg border border-slate-300 transition"
            >
              暫存草稿
            </button>

            <button
              disabled={isSubmitDisabled && trackMode === 'official'}
              onClick={handleSubmit}
              className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition ${
                isSubmitDisabled && trackMode === 'official'
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isSubmitDisabled && trackMode === 'official' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              <span>【正式送出】唯讀封存</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
