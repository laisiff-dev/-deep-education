import React, { useState } from 'react';
import { 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Layers, 
  Database, 
  Sliders, 
  CheckCircle2, 
  Save,
  Search,
  Sparkles
} from 'lucide-react';

export default function SchemaMappingAdmin({
  indicators,
  onSaveIndicator,
  onAddNewIndicator
}) {
  const [selectedItem, setSelectedItem] = useState(indicators[0] || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // 表單設定狀態
  const [formData, setFormData] = useState({
    id: selectedItem?.id || 'COM_036',
    measure: selectedItem?.measure || '',
    type: selectedItem?.type || '共同指標',
    period: selectedItem?.period || '第二期',
    aspect: selectedItem?.aspect || '教學創新精進',
    warning_threshold: selectedItem?.warning_threshold || 0.70,
    dept_main: selectedItem?.dept_main || '教務處學生組',
    dept_co: selectedItem?.dept_co || [],
    unit: selectedItem?.unit || '人次',
    form_mode_id: selectedItem?.form_mode_id || 1,
    base_table: selectedItem?.base_table || '校基庫 表 4-8-2',
    target_val: selectedItem?.target_val || '100 人次',
    status_lock: '進行中'
  });

  const handleSelectIndicator = (item) => {
    setSelectedItem(item);
    setFormData({
      id: item.id || '',
      measure: item.measure || item.major_item || '',
      type: item.type || '共同指標',
      period: item.period || '第二期',
      aspect: item.aspect || '教學創新精進',
      warning_threshold: item.warning_threshold || 0.70,
      dept_main: item.dept_main || item.dept || '教務處學生組',
      dept_co: item.dept_co || [],
      unit: item.unit || '人次',
      form_mode_id: item.form_mode_id || 1,
      base_table: item.base_table || '學校自填',
      target_val: item.target_val || '100 人次',
      status_lock: item.final_submitted ? '已截止鎖定' : '進行中'
    });
    setIsEditing(true);
  };

  const handleSaveSchema = () => {
    const updated = {
      ...(selectedItem || {}),
      id: formData.id,
      measure: formData.measure,
      type: formData.type,
      period: formData.period,
      aspect: formData.aspect,
      warning_threshold: formData.warning_threshold,
      dept_main: formData.dept_main,
      dept_co: formData.dept_co,
      unit: formData.unit,
      form_mode_id: formData.form_mode_id,
      form_mode: formData.form_mode_id === 1 ? '模式一: 直接線上新增' 
        : formData.form_mode_id === 2 ? '模式二: 數值手填+防錯勾選'
        : formData.form_mode_id === 3 ? '模式三: 比例/比率型表單'
        : '模式四: 純質性策略描述',
      base_table: formData.base_table,
      target_val: formData.target_val,
      final_submitted: formData.status_lock === '已截止鎖定'
    };

    onSaveIndicator(updated);
    alert(`✅ 【${formData.id}】後台 Schema Mapping 配置已儲存！\n系統已自動同步前端渲染規則。`);
  };

  const handleCreateNew = () => {
    const newId = `COM_${indicators.length + 1 < 100 ? '0' : ''}${indicators.length + 1}`;
    setFormData({
      id: newId,
      measure: '117年新興 AI 應用與跨領域學習推動成效',
      type: '共同指標',
      period: '第三期',
      aspect: '教學創新精進',
      warning_threshold: 0.70,
      dept_main: '教務處學生組',
      dept_co: ['研發處', '共同教育中心'],
      unit: '人次',
      form_mode_id: 1,
      base_table: '校基庫 表 3-5',
      target_val: '500 人次',
      status_lock: '進行中'
    });
    setSelectedItem(null);
    setIsEditing(true);
  };

  const filtered = indicators.filter(i => {
    const q = searchTerm.toLowerCase();
    return (i.id || '').toLowerCase().includes(q) || (i.measure || '').toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 標題與說明卡 */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-md border border-slate-800 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 bg-blue-600 rounded text-xs">
              <Sliders className="w-4 h-4" />
            </span>
            <h2 className="text-base font-extrabold text-white">
              後台指標建置與 Schema Mapping 規格配置端 (管考指揮棒)
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            元數據驅動 (Metadata-Driven) 架構：指標定義、預警閾值與前端完全解耦，支援 117 年第三期計畫零程式碼無痛改版
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>新增指標 Schema (117期)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 左側：指標列表與搜尋 (5 欄) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col h-[750px]">
          <div className="mb-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="搜尋 Schema 指標代碼或名稱..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="overflow-y-auto space-y-1.5 flex-1 pr-1">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectIndicator(item)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                  selectedItem?.id === item.id
                    ? 'bg-blue-50 border-blue-400 font-bold text-blue-950 shadow-xs'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-extrabold bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                    {item.id}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {item.form_mode?.split(':')[0] || '模式一'}
                  </span>
                </div>
                <div className="font-bold line-clamp-1">{item.measure || item.major_item}</div>
                <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                  <span>{item.aspect}</span>
                  <span>{item.dept_main || item.dept}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右側：五大配置區塊詳細表單 (8 欄) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-y-auto max-h-[750px] space-y-6">
          
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                <span>指標技術屬性與 Schema 欄位定義 ({formData.id})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">參照建議書第 5 節標準化配置</p>
            </div>
            <button
              onClick={handleSaveSchema}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>儲存 Schema 設定</span>
            </button>
          </div>

          {/* 區塊 1：指標基本屬性 */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-blue-900 border-l-3 border-blue-600 pl-2">
              1. 指標基本屬性 (索引與分組核心)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">指標代碼 (Varchar 20)：</label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">指標類別 (Boolean/Enum)：</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-800"
                >
                  <option value="共同指標">共同指標 (部定 35 項)</option>
                  <option value="自訂指標">自訂指標 (學校 39 項)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">項目名稱 (Varchar 255 參照計畫書)：</label>
                <input
                  type="text"
                  value={formData.measure}
                  onChange={(e) => setFormData({ ...formData, measure: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">所屬面向 (連動四分屏與堆疊條)：</label>
                <select
                  value={formData.aspect}
                  onChange={(e) => setFormData({ ...formData, aspect: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-800"
                >
                  <option value="教學創新精進">教學創新精進</option>
                  <option value="善盡社會責任">善盡社會責任</option>
                  <option value="產學合作連結">產學合作連結</option>
                  <option value="提升高教公共性">提升高教公共性</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">告警閾值 (Float 預設 0.70)：</label>
                <input
                  type="number"
                  step="0.05"
                  value={formData.warning_threshold}
                  onChange={(e) => setFormData({ ...formData, warning_threshold: parseFloat(e.target.value) || 0.70 })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* 區塊 2：權限分流與協辦單位 */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-black text-blue-900 border-l-3 border-blue-600 pl-2">
              2. 權限分流與協辦填報邏輯
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">主責單位 (單選，具最終核定權)：</label>
                <select
                  value={formData.dept_main}
                  onChange={(e) => setFormData({ ...formData, dept_main: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-800"
                >
                  <option value="教務處學生組">教務處學生組</option>
                  <option value="教務處課註組">教務處課註組</option>
                  <option value="教務處教師組">教務處教師組</option>
                  <option value="學務處課指組">學務處課指組</option>
                  <option value="學務處處本部">學務處處本部</option>
                  <option value="學務處原資中心">學務處原資中心</option>
                  <option value="研發處">研發處</option>
                  <option value="共同教育中心">共同教育中心</option>
                  <option value="高教深耕計畫辦公室">高教深耕計畫辦公室</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">年度目標值 (包含單位)：</label>
                <input
                  type="text"
                  value={formData.target_val}
                  onChange={(e) => setFormData({ ...formData, target_val: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* 區塊 3：填報模組控制 */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-black text-blue-900 border-l-3 border-blue-600 pl-2">
              3. 填報模組控制與計量單位
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">適用填報模式 (模式一至四)：</label>
                <select
                  value={formData.form_mode_id}
                  onChange={(e) => setFormData({ ...formData, form_mode_id: parseInt(e.target.value, 10) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-blue-900"
                >
                  <option value={1}>模式一：直接線上新增 (單純數值累加)</option>
                  <option value={2}>模式二：數值手填 + 萬用佐證 + 去重防錯勾選</option>
                  <option value={3}>模式三：比例/比率型表單 (強制拆分分子分母)</option>
                  <option value={4}>模式四：純質性策略描述 (大文本域 300/500字)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">衡量計量單位：</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-800"
                >
                  <option value="人次">人次</option>
                  <option value="人">人</option>
                  <option value="件數">件數</option>
                  <option value="比率">比率 (%)</option>
                  <option value="門">門 (課程類)</option>
                  <option value="家數">家數 (產學類)</option>
                  <option value="免">免 (質性類)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 區塊 4：管考維度與校基庫對帳元數據 */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-black text-blue-900 border-l-3 border-blue-600 pl-2">
              4. 管考維度與校基庫對帳元數據
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">資料來源 (校基庫對帳編號)：</label>
                <select
                  value={formData.base_table}
                  onChange={(e) => setFormData({ ...formData, base_table: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-800"
                >
                  <option value="校基庫 表 4-8-2">校基庫 表 4-8-2 (證照通過)</option>
                  <option value="校基庫 表 4-8-1">校基庫 表 4-8-1 (競賽獲獎)</option>
                  <option value="校基庫 表 4-8-3">校基庫 表 4-8-3 (英文證照)</option>
                  <option value="校基庫 表 1-7">校基庫 表 1-7 (教師研習)</option>
                  <option value="校基庫 表 3-5">校基庫 表 3-5 (創新教學)</option>
                  <option value="校基庫 表 4-6">校基庫 表 4-6 (專業實習)</option>
                  <option value="校基庫 表 1-1">校基庫 表 1-1</option>
                  <option value="學校自填">學校自填</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">檢核鎖定狀態：</label>
                <select
                  value={formData.status_lock}
                  onChange={(e) => setFormData({ ...formData, status_lock: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-800"
                >
                  <option value="進行中">進行中 (開放日常填報)</option>
                  <option value="準備結算">準備結算 (發送對帳通知)</option>
                  <option value="強制管考中">強制管考中 (觸發 70% 阻斷)</option>
                  <option value="已截止鎖定">已截止鎖定 (全域唯讀)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              onClick={() => alert('已模擬延期手動配置：已開放教務處與學務處填報權限至 2026/12/31。')}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-lg border border-slate-300 transition flex items-center gap-1"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>延期手動配置</span>
            </button>
            <button
              onClick={handleSaveSchema}
              className="text-xs bg-blue-900 hover:bg-blue-800 text-white font-bold px-5 py-2 rounded-lg transition shadow-xs flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>確認套用此指標 Schema</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
