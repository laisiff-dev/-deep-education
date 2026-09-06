import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  Target, 
  Layers, 
  ChevronRight,
  Info,
  ExternalLink
} from 'lucide-react';

export default function Tier1Overview({
  indicators,
  onNavigateToTier3,
  onOpenDrawer,
  onOpenIndicatorModal,
  onOpenDataEntry
}) {
  // 分組計算：共同指標 vs 自訂指標
  const comIndicators = useMemo(() => indicators.filter(i => i.type === '共同指標' || !i.type?.includes('自訂')), [indicators]);
  const cusIndicators = useMemo(() => indicators.filter(i => i.type === '自訂指標' || i.type?.includes('自訂')), [indicators]);

  // 共同指標統計
  const comStats = useMemo(() => {
    const total = comIndicators.length || 35;
    const green = comIndicators.filter(i => i.status === 'SUCCESS').length;
    const yellow = comIndicators.filter(i => i.status === 'WARNING').length;
    const red = comIndicators.filter(i => i.status === 'CRITICAL').length;
    const avgRate = total > 0 ? (comIndicators.reduce((acc, cur) => acc + (cur.rate || 0), 0) / total).toFixed(1) : '87.4';
    return { total, green, yellow, red, avgRate };
  }, [comIndicators]);

  // 自訂指標統計
  const cusStats = useMemo(() => {
    const total = cusIndicators.length || 39;
    const green = cusIndicators.filter(i => i.status === 'SUCCESS').length;
    const yellow = cusIndicators.filter(i => i.status === 'WARNING').length;
    const red = cusIndicators.filter(i => i.status === 'CRITICAL').length;
    const avgRate = total > 0 ? (cusIndicators.reduce((acc, cur) => acc + (cur.rate || 0), 0) / total).toFixed(1) : '84.6';
    return { total, green, yellow, red, avgRate };
  }, [cusIndicators]);

  // 四大面向分組健康度計算 (針對共同指標)
  const aspectStats = useMemo(() => {
    const aspects = [
      { key: '教學創新精進', title: '教學創新精進' },
      { key: '善盡社會責任', title: '善盡社會責任' },
      { key: '產學合作連結', title: '產學合作連結' },
      { key: '提升高教公共性', title: '提升高教公共性' }
    ];

    return aspects.map(a => {
      const items = comIndicators.filter(i => i.aspect === a.key);
      const count = items.length;
      const green = items.filter(i => i.status === 'SUCCESS').length;
      const yellow = items.filter(i => i.status === 'WARNING').length;
      const red = items.filter(i => i.status === 'CRITICAL').length;
      
      const greenPct = count > 0 ? ((green / count) * 100).toFixed(1) : '0';
      const yellowPct = count > 0 ? ((yellow / count) * 100).toFixed(1) : '0';
      const redPct = count > 0 ? ((red / count) * 100).toFixed(1) : '0';

      return {
        ...a,
        count,
        green,
        yellow,
        red,
        greenPct: parseFloat(greenPct),
        yellowPct: parseFloat(yellowPct),
        redPct: parseFloat(redPct)
      };
    });
  }, [comIndicators]);

  // Bottom 8 Ranking (全校達成率最低前 8 項指標，優先介入清單)
  const bottom8List = useMemo(() => {
    return [...indicators]
      .sort((a, b) => (a.rate || 0) - (b.rate || 0))
      .slice(0, 8);
  }, [indicators]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 雙軌互動提示 Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-600 text-white text-xs font-black px-2 py-0.5 rounded">雙軌互動路徑指南</span>
            <span className="text-xs text-slate-300 font-bold">莫蘭迪多維決策看板</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <b>路徑 A (全域管考)</b>：點擊下方 <b>部定共同指標卡</b> 或 <b>自訂指標卡</b> ➔ 展開第三層面向分組例外清單 ➔ 點選指標開啟立體履歷卡。<br />
            <b>路徑 B (敏捷救火)</b>：點擊下方 <b>四大面向 100% 堆疊條</b> ➔ 首頁右側滑出第二層救火抽屜 ➔ 點選異常項目直接督導。
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onNavigateToTier3('共同指標')}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-lg transition flex items-center gap-1.5"
          >
            <span>進入部定共同管考</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 第一層：二分天下統計卡 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 🎯 部定共同績效指標卡 */}
        <div
          onClick={() => onNavigateToTier3('共同指標')}
          className="bg-white rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 bottom-0 w-2 bg-blue-600"></div>
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                <Target className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-extrabold text-blue-900 group-hover:text-blue-700 transition">
                  部定共同績效指標 (點擊展開第三層管考清單)
                </h3>
                <p className="text-xs text-slate-500 font-medium">教育部核定基準 • 校基庫對帳</p>
              </div>
            </div>
            <span className="flex items-center text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full group-hover:bg-blue-600 group-hover:text-white transition">
              展開分組清單 <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>

          <div className="flex items-baseline gap-3 my-3">
            <span className="text-3xl font-black text-slate-900">共 {comStats.total} 項</span>
            <span className="text-sm font-black text-emerald-600 flex items-center">
              <TrendingUp className="w-4 h-4 mr-0.5" /> +10.2% YoY (同期比)
            </span>
            <span className="text-xs text-slate-400 ml-auto font-bold">平均達成率 {comStats.avgRate}%</span>
          </div>

          {/* 狀態膠囊分布 */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            <span className="badge-capsule green">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>正常達標 {comStats.green} 項</span>
            </span>
            <span className="badge-capsule yellow">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              <span>預警關注 {comStats.yellow} 項</span>
            </span>
            <span className="badge-capsule red">
              <AlertOctagon className="w-3.5 h-3.5 text-red-700" />
              <span>嚴重落後 {comStats.red} 項 (觸發70%管考)</span>
            </span>
          </div>
        </div>

        {/* 🏫 學校自訂績效指標卡 */}
        <div
          onClick={() => onNavigateToTier3('自訂指標')}
          className="bg-white rounded-2xl p-6 border-2 border-emerald-200 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 bottom-0 w-2 bg-emerald-600"></div>
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                <Layers className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-extrabold text-emerald-950 group-hover:text-emerald-700 transition">
                  學校自訂績效指標 (點擊展開第三層管考清單)
                </h3>
                <p className="text-xs text-slate-500 font-medium">輔英特色發展 • 校內專案追蹤</p>
              </div>
            </div>
            <span className="flex items-center text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition">
              展開分組清單 <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>

          <div className="flex items-baseline gap-3 my-3">
            <span className="text-3xl font-black text-slate-900">共 {cusStats.total} 項</span>
            <span className="text-sm font-black text-rose-600 flex items-center">
              <TrendingDown className="w-4 h-4 mr-0.5" /> -2.1% YoY (同期比)
            </span>
            <span className="text-xs text-slate-400 ml-auto font-bold">平均達成率 {cusStats.avgRate}%</span>
          </div>

          {/* 狀態膠囊分布 */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            <span className="badge-capsule green">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>正常達標 {cusStats.green} 項</span>
            </span>
            <span className="badge-capsule yellow">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              <span>預警關注 {cusStats.yellow} 項</span>
            </span>
            <span className="badge-capsule red">
              <AlertOctagon className="w-3.5 h-3.5 text-red-700" />
              <span>嚴重落後 {cusStats.red} 項</span>
            </span>
          </div>
        </div>
      </div>

      {/* 100% 三色健康度堆疊面板 (四大面向) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-blue-700 rounded-full"></span>
              部定共同績效指標 － 面向健康度分布 (點擊特定面向直接滑出右側抽屜救火)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              以 🟢 達標 (≥90%) / 🟡 預警 (70-90%) / 🔴 落後 (&lt;70%) 堆疊呈現整體健康度
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500"></span> 達標 ≥90%</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500"></span> 預警 70-90%</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500"></span> 嚴重落後 &lt;70%</span>
          </div>
        </div>

        <div className="space-y-4">
          {aspectStats.map((aspect) => (
            <div 
              key={aspect.key}
              onClick={() => onOpenDrawer(aspect.key)}
              className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200 hover:border-blue-300 transition cursor-pointer group"
              title={`點擊滑出「${aspect.title}」面向異常指標清單`}
            >
              <div className="flex justify-between items-center mb-1.5 text-xs font-bold">
                <span className="text-slate-800 flex items-center gap-1.5 group-hover:text-blue-700 transition">
                  <span className="font-extrabold">{aspect.title}</span>
                  <span className="text-slate-500 font-normal">({aspect.count} 項指標)</span>
                </span>
                <span className="text-blue-600 font-semibold group-hover:underline flex items-center gap-0.5">
                  查看異常指標清單 <ChevronRight className="w-3 h-3" />
                </span>
              </div>

              {/* 100% 堆疊長條 */}
              <div className="h-6 w-full bg-slate-200 rounded-lg overflow-hidden flex border border-slate-300/60 shadow-inner">
                {aspect.greenPct > 0 && (
                  <div 
                    style={{ width: `${aspect.greenPct}%` }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center transition-all"
                    title={`正常達標: ${aspect.green} 項 (${aspect.greenPct}%)`}
                  >
                    {aspect.greenPct >= 10 ? `${aspect.greenPct}% (${aspect.green}項)` : ''}
                  </div>
                )}
                {aspect.yellowPct > 0 && (
                  <div 
                    style={{ width: `${aspect.yellowPct}%` }}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] flex items-center justify-center transition-all"
                    title={`預警關注: ${aspect.yellow} 項 (${aspect.yellowPct}%)`}
                  >
                    {aspect.yellowPct >= 10 ? `${aspect.yellowPct}% (${aspect.yellow}項)` : ''}
                  </div>
                )}
                {aspect.redPct > 0 && (
                  <div 
                    style={{ width: `${aspect.redPct}%` }}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold text-[10px] flex items-center justify-center transition-all"
                    title={`嚴重落後: ${aspect.red} 項 (${aspect.redPct}%)`}
                  >
                    {aspect.redPct >= 8 ? `${aspect.redPct}% (${aspect.red}項)` : ''}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 第三層：全校重點關注指標 (Bottom 8 Ranking 優先介入清單) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                全校重點關注指標 (Bottom 8 Ranking 優先介入清單)
              </h3>
              <p className="text-xs text-slate-500">
                依全校指標達成率由低至高排序之優先救火項目，需主管介入資源配置與追蹤
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
            🚨 觸發阻斷式 70% 管考
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {bottom8List.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => onOpenIndicatorModal(item)}
              className="bg-slate-50 hover:bg-white p-4 rounded-xl border border-slate-200 hover:border-red-400 hover:shadow-md transition-all cursor-pointer relative group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                    #{idx + 1} • {item.id}
                  </span>
                  <span className="badge-capsule red text-[10px] py-0.5">
                    達成率 {item.rate}%
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 line-clamp-2 mb-1.5 transition">
                  {item.measure || item.major_item}
                </h4>
                <div className="text-[11px] text-slate-500 flex items-center justify-between mb-2">
                  <span>{item.dept_main || item.dept}</span>
                  <span className="font-semibold text-slate-700">{item.actual_val} / {item.target_val}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex justify-between items-center text-[10px]">
                <span className="text-rose-600 font-bold">
                  {item.improvement_plan ? '已填改善措施' : '待填 300字檢討'}
                </span>
                <span className="text-blue-600 font-bold group-hover:underline flex items-center gap-0.5">
                  查看履歷 <ExternalLink className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
