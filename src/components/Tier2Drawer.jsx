import React, { useMemo } from 'react';
import { 
  X, 
  AlertOctagon, 
  AlertTriangle, 
  ChevronRight, 
  FileText, 
  Layers, 
  CheckCircle2, 
  ExternalLink,
  Flame,
  ArrowRight
} from 'lucide-react';

export default function Tier2Drawer({
  isOpen,
  aspectKey,
  indicators,
  onClose,
  onOpenIndicatorModal
}) {
  if (!isOpen) return null;

  // 篩選出該面向之異常指標 (落後 <70% 與 預警 70-90%)
  const aspectIndicators = useMemo(() => {
    return indicators.filter(i => (i.aspect === aspectKey || !aspectKey) && (i.type === '共同指標' || !i.type?.includes('自訂')));
  }, [indicators, aspectKey]);

  const criticalList = useMemo(() => {
    return aspectIndicators.filter(i => i.status === 'CRITICAL');
  }, [aspectIndicators]);

  const warningList = useMemo(() => {
    return aspectIndicators.filter(i => i.status === 'WARNING');
  }, [aspectIndicators]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* 背景遮罩 */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-slate-50 shadow-2xl flex flex-col animate-slide-in border-l border-slate-200">
          
          {/* 抽屜頁頭 */}
          <div className="p-5 bg-white border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 bg-red-100 text-red-700 rounded">
                  <Flame className="w-4 h-4" />
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  {aspectKey ? `${aspectKey} － 救火督導面板` : '異常指標督導面板'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                集中檢視落後與預警指標，支援 300字檢討與跨單位對帳
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 抽屜內容主體 */}
          <div className="p-5 overflow-y-auto space-y-6 flex-1">
            
            {/* 🚨 嚴重落後指標清單 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="badge-capsule red text-xs py-1">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>嚴重落後指標 (達成率 &lt; 70% / 共 {criticalList.length} 項)</span>
                </span>
                <span className="text-[11px] text-red-600 font-bold">觸發任務 A/B 阻斷管考</span>
              </div>

              {criticalList.length === 0 ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 text-center font-bold">
                  🎉 本面向無任何嚴重落後指標！
                </div>
              ) : (
                <div className="space-y-3">
                  {criticalList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onOpenIndicatorModal(item)}
                      className="bg-white p-4 rounded-xl border-l-4 border-l-red-500 border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {item.id} • {item.dept_main || item.dept}
                        </span>
                        <span className="text-xs font-black text-red-600">
                          {item.rate}%
                        </span>
                      </div>

                      <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-blue-700 transition mb-2">
                        {item.measure || item.major_item}
                      </h4>

                      <div className="flex justify-between text-xs text-slate-600 mb-2 bg-slate-50 p-2 rounded-lg font-medium">
                        <span>當年目標：<strong className="text-slate-900">{item.target_val}</strong></span>
                        <span>官方實績：<strong className="text-red-600">{item.actual_val}</strong></span>
                      </div>

                      {/* 改善措施或去重說明 */}
                      {item.improvement_plan && (
                        <div className="p-2.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-900 leading-relaxed">
                          <span className="font-bold flex items-center gap-1 mb-1 text-red-800">
                            <FileText className="w-3.5 h-3.5" /> 📝 300字檢討改善措施：
                          </span>
                          <p className="line-clamp-3 text-[11px]">{item.improvement_plan}</p>
                        </div>
                      )}

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex justify-end items-center text-[11px] text-blue-600 font-bold group-hover:underline">
                        <span>開啟第四層智慧數據履歷卡</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 🟡 預警關注指標清單 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="badge-capsule yellow text-xs py-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>預警關注指標 (達成率 70% ~ 90% / 共 {warningList.length} 項)</span>
                </span>
                <span className="text-[11px] text-amber-700 font-bold">密切追蹤進度</span>
              </div>

              {warningList.length === 0 ? (
                <div className="p-4 bg-slate-100 text-slate-600 text-xs rounded-xl text-center font-medium">
                  本面向無預警關注指標
                </div>
              ) : (
                <div className="space-y-3">
                  {warningList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onOpenIndicatorModal(item)}
                      className="bg-white p-4 rounded-xl border-l-4 border-l-amber-500 border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {item.id} • {item.dept_main || item.dept}
                        </span>
                        <span className="text-xs font-black text-amber-600">
                          {item.rate}%
                        </span>
                      </div>

                      <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-blue-700 transition mb-2">
                        {item.measure || item.major_item}
                      </h4>

                      <div className="flex justify-between text-xs text-slate-600 mb-2 bg-slate-50 p-2 rounded-lg font-medium">
                        <span>當年目標：<strong className="text-slate-900">{item.target_val}</strong></span>
                        <span>當前實績：<strong className="text-amber-700">{item.actual_val}</strong></span>
                      </div>

                      {/* 跨單位子格子明細 (針對 SDGs/USR 等指標) */}
                      {item.sub_grids && item.sub_grids.length > 0 && (
                        <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-lg text-xs text-blue-900 mb-2">
                          <span className="font-bold flex items-center gap-1 mb-1 text-blue-800">
                            <Layers className="w-3.5 h-3.5" /> 📊 跨單位動態彙總明細：
                          </span>
                          <div className="space-y-1 text-[11px]">
                            {item.sub_grids.map((sub, sidx) => (
                              <div key={sidx} className="flex justify-between">
                                <span>{sub.dept}</span>
                                <span className="font-bold">{sub.val} {sub.unit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex justify-end items-center text-[11px] text-blue-600 font-bold group-hover:underline">
                        <span>開啟第四層智慧數據履歷卡</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* 抽屜頁尾 */}
          <div className="p-4 bg-white border-t border-slate-200 flex justify-between items-center">
            <span className="text-xs text-slate-500 font-medium">
              雙軌敏捷救火面板 • 點擊卡片開啟立體履歷
            </span>
            <button
              onClick={onClose}
              className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-3 py-1.5 rounded-lg transition"
            >
              關閉面板
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
