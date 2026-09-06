# 輔英科技大學 第二期高教深耕計畫指標 戰情與監控儀表板

> **Fooyin University - Sprout Project Dashboard**  
> 本專案為輔英科技大學「第二期高教深耕計畫」指標達成率之即時監控、預警通報與戰情分析儀表板系統。

---

## 📌 系統特點 (Key Features)

* 🚨 **即時預警跑馬燈 (Alert Ticker)**：自動篩選達成率低於 `70%` 的「嚴重落後」指標，高亮橫幅跑馬燈播報並支援單擊查看詳情。
* 📊 **高階主管 KPI 統計與分析**：即時統計全校總指標數、平均達成率、正常達標數、預警待加強數與嚴重落後數，並提供達成率最低 Top 8 指標分析圖表。
* 🖥️ **四分屏戰情視圖 (4-Quadrant View)**：同步觀測「教學創新精進」、「善盡社會責任」、「產學合作連結」、「提升高教公共性」四大面向，支援下拉式清單切換該面向之特定指標。
* 🔍 **多維度組合過濾與搜尋**：支援依「面向」、「指標類別 (共同/自訂)」、「狀態燈號」及「關鍵字 (指標、單位、原因)」進行即時搜尋。
* 📥 **一鍵 CSV 報表匯出**：匯出符合 Excel 格式（UTF-8 BOM 編碼）之完整監控與改進措施報表。
* ⚡ **即時模擬輪詢與重置**：具備動態數據更新模擬與手動重置刷新機制。

---

## 🛠️ 技術棧 (Tech Stack)

| 類別 | 技術 / 工具 | 說明 |
| :--- | :--- | :--- |
| **前端框架** | [React 18](https://react.dev/) | 現代組件化 UI 庫 |
| **建構工具** | [Vite 6](https://vitejs.dev/) | 高效能前端開發與打包工具 |
| **圖標庫** | [Lucide React](https://lucide.dev/) | 高品質現代化圖標集 |
| **樣式設計** | Vanilla CSS + Tailwind CSS (Utility classes) | 深色高對比戰情室主題 (Slate-950, Glassmorphism) |
| **CI/CD / 部署** | [GitHub Actions](https://github.com/features/actions) | 自動打包發布至 GitHub Pages |

---

## 🚀 快速啟動 (Quick Start)

### 1. 複製專案與安裝依賴

```bash
# 安裝 npm 依賴套件
npm install
```

### 2. 本地開發環境運作

```bash
npm run dev
```
啟動後瀏覽器開啟 `http://localhost:3000` 即可預覽戰情儀表板。

### 3. 生產環境打包與預覽

```bash
# 打包專案至 dist/ 目錄
npm run build

# 本地預覽打包結果
npm run preview
```

---

## 📁 專案目錄結構 (Project Structure)

```text
高教深耕指標/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages 自動化部署流程
├── public/                     # 靜態資源
├── src/
│   ├── components/             # UI 組件模組
│   │   ├── AlertTicker.jsx     # 嚴重落後指標跑馬燈
│   │   ├── AspectCharts.jsx    # 面向達成率與 Top 8 落後指標圖表
│   │   ├── AspectGroupedView.jsx # 面向分組卡片視圖
│   │   ├── FilterBar.jsx       # 組合過濾與視圖切換工具列
│   │   ├── FourQuadrantView.jsx# 四分屏戰情視圖
│   │   ├── Header.jsx          # 頂部戰情室標頭與控制按鈕
│   │   ├── IndicatorCard.jsx   # 單一指標卡片
│   │   ├── IndicatorModal.jsx  # 指標詳細資訊與歷程對話框
│   │   └── SummaryCards.jsx    # KPI 高階主管統計卡片
│   ├── App.jsx                 # 應用程式主邏輯與狀態管理
│   ├── index.css               # 全局 CSS 樣式與設計規範 (Design Tokens)
│   ├── indicators_data.json    # 深耕計畫指標主數據庫 (1900+ 行 JSON)
│   └── main.jsx                # React 入口點
├── index.html                  # HTML 頁面範本
├── package.json                # 專案依賴與腳本定義
├── README.md                   # 專案說明檔 (本檔案)
├── SPECIFICATION.md            # 詳細製作與維護規範說明檔
└── vite.config.js              # Vite 配置文件
```

---

## 📄 專案詳細規範說明檔 (Detailed Specifications)

關於資料結構格式 (JSON Schema)、達成率燈號閾值計算規範、UI 設計 Token、元件開發規範與數據維護流程，請參閱：
* 📖 [SPECIFICATION.md](file:///e:/%E6%96%87%E4%BA%AE/%E8%BC%94%E8%8B%B1%27/%E9%AB%98%E6%95%99%E6%B7%B1%E8%80%95%E6%8C%87%E6%A8%99/SPECIFICATION.md)

---

## 🚢 自動化部署 (Deployment)

本專案配置 GitHub Actions (`.github/workflows/deploy.yml`)。當代碼推動 (Push) 至 `main` 分支時，系統會自動進行打包並部署至 GitHub Pages 靜態伺服器。
