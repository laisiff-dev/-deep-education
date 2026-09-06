import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  FileSpreadsheet, 
  MessageSquare, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function Tier3ManagementTable({
  type = '共同指標',
  indicators,
  onGoBack,
  onOpenIndicatorModal,
  onOpenDataEntry
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAspect, setSelectedAspect] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // 篩選指定類別 (共同指標 or 自訂指標)
  const baseIndicators = useMemo(() => {
    return indicators.filter(i => {
      if (type === '共同指標') {
        return i.type === '共同指標' || !i.type?.includes('自訂');
      } else {
        return i.type === '自訂指標' || i.type?.includes('自訂');
      }
    });
  }, [indicators, type]);

  // 搜尋與多重過濾
  const filteredList = useMemo(() => {
    return baseIndicators.filter(i => {
      if (selectedAspect !== 'ALL' && i.aspect !== selectedAspect) return false;
      if (selectedStatus !== 'ALL' && i.status !== selectedStatus) return false;
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        const m = (i.measure || '').toLowerCase();
        const maj = (i.major_item || '').toLowerCase();
        const id = (i.id || '').toLowerCase();
        const d = (i.dept_main || i.dept || '').toLowerCase();
        if (!m.includes(q) && !maj.includes(q) && !id.includes(q) && !d.includes(q)) return false;
      }
      return true;
    });
  }, [baseIndicators, selectedAspect, selectedStatus, searchTerm]);

  // 四大面向分組，面向內嚴格按「落後 -> 預警 -> 達標」排序
  const aspectGroups = useMemo(() => {
    const aspects = ['教學創新精進', '善盡社會責任', '產學合作連結', '提升高教公共性'];
    const statusPriority = { 'CRITICAL': 1, 'WARNING': 2, 'SUCCESS': 3 };

    return aspects.map(aspectName => {
      const items = filteredList
        .filter(i => i.aspect === aspectName)
        .sort((a, b) => {
          const pA = statusPriority[a.status] || 99;
          const pB = statusPriority[b.status] || 99;
          if (pA !== pB) return pA - pB;
          return (a.rate || 0) - (b.rate || 0); // 同狀態下達成率低者排前面
        });

      const total = items.length;
      const criticalCount = items.filter(i => i.status === 'CRITICAL').length;
      const warningCount = items.filter(i => i.status === 'WARNING').length;
      const successCount = items.filter(i => i.status === 'SUCCESS').length;

      return {
        aspectName,
        items,
        total,
        criticalCount,
        warningCount,
        successCount
      };
    }).filter(g => g.total > 0 || selectedAspect === 'ALL');
  }, [filteredList, selectedAspect]);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* 頂部導覽與返回列 */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onGoBack}
            className="flex items-center gap-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回首頁大盤</span>
          </button>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span>{type === '共同指標' ? '🎯 部定共同績效指標管考清單 (35項)' : '🏫 學校自訂績效指標管考清單 (39項)'}</span>
              <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded border border-slate-300">
                依例外優先排序：落後 ➔ 預警 ➔ 達標
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              可點擊指標項目下鑽至第四層立體履歷卡，或點選右側動作按鈕進行去重對帳與審查檢討
            </p>
          </div>
        </div>

        {/* 搜尋與篩選列 */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="搜尋指標名稱、代碼、單位..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>

          <select
            value={selectedAspect}
            onChange={(e) => setSelectedAspect(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none"
          >
            <option value="ALL">全部面向</option>
            <option value="教學創新精進">教學創新精進</option>
            <option value="善盡社會責任">善盡社會責任</option>
            <option value="產學合作連結">產學合作連結</option>
            <option value="提升高教公共性">提升高教公共性</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none"
          >
            <option value="ALL">全部燈號</option>
            <option value="CRITICAL">🚨 嚴重落後 (&lt;70%)</option>
            <option value="WARNING">🟡 預警關注 (70-90%)</option>
            <option value="SUCCESS">🟢 正常達標 (≥90%)</option>
          </select>
        </div>
      </div>

      {/* 各面向分組列表 */}
      <div className="space-y-6">
        {aspectGroups.map((group) => (
          <div 
            key={group.aspectName}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            {/* 面向標題與燈號彙總 */}
            <div className="bg-slate-100/80 px-5 py-3.5 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-700"></span>
                <h3 className="text-sm font-extrabold text-blue-950">
                  {group.aspectName}
                </h3>
                <span className="text-xs text-slate-500 font-bold bg-slate-200/80 px-2 py-0.5 rounded-full">
                  共 {group.total} 項指標
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                {group.criticalCount > 0 && (
                  <span className="badge-capsule red text-[11px]">
                    🚨 嚴重落後 {group.criticalCount} 項
                  </span>
                )}
                {group.warningCount > 0 && (
                  <span className="badge-capsule yellow text-[11px]">
                    🟡 預警關注 {group.warningCount} 項
                  </span>
                )}
                <span className="badge-capsule green text-[11px]">
                  🟢 達標 {group.successCount} 項
                </span>
              </div>
            </div>

            {/* 管考表格 */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 text-slate-500 font-bold border-b border-slate-200 text-center">
                    <th className="py-2.5 px-3 w-24">管考狀態</th>
                    <th className="py-2.5 px-4 text-left">指標項目與衡量子項目 (例外優先排序)</th>
                    <th className="py-2.5 px-3 w-32">主責單位</th>
                    <th className="py-2.5 px-3 w-24">當年目標</th>
                    <th className="py-2.5 px-3 w-24">當前實績</th>
                    <th className="py-2.5 px-4 w-44 text-left">達成率與進度條</th>
                    <th className="py-2.5 px-3 w-24">YoY 同期比</th>
                    <th className="py-2.5 px-3 w-28">管理督導動作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {group.items.map((item) => {
                    const isCritical = item.status === 'CRITICAL';
                    const isWarning = item.status === 'WARNING';
                    const isSuccess = item.status === 'SUCCESS';

                    const rowBgClass = isCritical 
                      ? 'hover:bg-red-50/40 bg-red-50/10' 
                      : isWarning 
                      ? 'hover:bg-amber-50/40' 
                      : 'hover:bg-blue-50/30';

                    return (
                      <tr 
                        key={item.id}
                        onClick={() => onOpenIndicatorModal(item)}
                        className={`transition cursor-pointer group ${rowBgClass}`}
                      >
                        {/* 狀態徽章 */}
                        <td className="py-3 px-3 text-center">
                          {isCritical && (
                            <span className="badge-capsule red w-full justify-center">
                              🚨 嚴重落後
                            </span>
                          )}
                          {isWarning && (
                            <span className="badge-capsule yellow w-full justify-center">
                              ⚠️ 預警關注
                            </span>
                          )}
                          {isSuccess && (
                            <span className="badge-capsule green w-full justify-center">
                              🟢 正常達標
                            </span>
                          )}
                        </td>

                        {/* 指標名稱與描述 */}
                        <td className="py-3 px-4 text-left">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded group-hover:bg-blue-100 group-hover:text-blue-900 transition">
                              {item.id}
                            </span>
                            <span className="font-extrabold text-slate-900 group-hover:text-blue-700 transition">
                              {item.measure || item.major_item}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                            {item.base_table ? `${item.base_table} • ` : ''}{item.major_item}
                            {item.dedup_verified ? ' (已由主責覆核去重)' : ''}
                          </div>
                        </td>

                        {/* 主責單位 */}
                        <td className="py-3 px-3 text-center font-bold text-slate-700">
                          {item.dept_main || item.dept}
                        </td>

                        {/* 當年目標 */}
                        <td className="py-3 px-3 text-center font-bold text-slate-800">
                          {item.target_val}
                        </td>

                        {/* 當前實績 */}
                        <td className="py-3 px-3 text-center font-extrabold">
                          <span className={isCritical ? 'text-red-600' : isWarning ? 'text-amber-700' : 'text-emerald-700'}>
                            {item.actual_val}
                          </span>
                        </td>

                        {/* 達成率進度條 */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${Math.min(100, item.rate || 0)}%` }}
                                className={`h-full rounded-full transition-all ${
                                  isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                              ></div>
                            </div>
                            <span className={`text-xs font-black w-12 text-right ${
                              isCritical ? 'text-red-600' : isWarning ? 'text-amber-700' : 'text-emerald-700'
                            }`}>
                              {item.rate}%
                            </span>
                          </div>
                        </td>

                        {/* YoY 同期比 */}
                        <td className="py-3 px-3 text-center font-extrabold">
                          {(item.yoy_rate || 0) >= 0 ? (
                            <span className="text-emerald-600">▲ +{item.yoy_rate}%</span>
                          ) : (
                            <span className="text-rose-600">▼ {item.yoy_rate}%</span>
                          )}
                        </td>

                        {/* 管理督導動作按鈕 */}
                        <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          {isCritical && (
                            <button
                              onClick={() => onOpenDataEntry(item)}
                              className="text-[11px] font-bold bg-red-100 hover:bg-red-200 text-red-800 px-2.5 py-1 rounded-md transition shadow-xs w-full flex items-center justify-center gap-1"
                              title="開啟任務 B 阻斷式檢討填報"
                            >
                              <FileText className="w-3 h-3" />
                              <span>{item.form_mode_id === 2 ? '去重對帳' : '審查檢討'}</span>
                            </button>
                          )}
                          {isWarning && (
                            <button
                              onClick={() => onOpenDataEntry(item)}
                              className="text-[11px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-800 px-2.5 py-1 rounded-md transition shadow-xs w-full flex items-center justify-center gap-1"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>留言追蹤</span>
                            </button>
                          )}
                          {isSuccess && (
                            <button
                              onClick={() => onOpenIndicatorModal(item)}
                              className="text-[11px] font-bold bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-2.5 py-1 rounded-md transition shadow-xs w-full flex items-center justify-center gap-1"
                            >
                              <ShieldCheck className="w-3 h-3" />
                              <span>核章履歷</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
