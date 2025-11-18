# 📘 **產品需求文檔（PRD）**

\*\*產品：InsurAgent 智能保險經紀助手

版本：v2025.11

類型：**PRD**（內外部溝通標準版本）


# 1. 產品背景與機會

香港與大灣區跨境保險經紀人的銷售流程中，常見痛點包括：

* **保單條款冗長且難以快速查找內容**
* **經紀人需向客戶重寫簡化版 Proposal，但耗時且易出錯**
* **會面流程缺乏統一框架，紀錄與輸出不一致**
* **多個工具分散（計算器、PDF、公司系統），缺乏統一入口**

因此需要一個 **面向單個經紀 或經紀團隊經理** 的 **Case-based 智能 Agent 系統**，集中解決查詢、解讀、文檔生成、展示流程等核心任務。


# 2. 產品定位

### 🎯 **定位（Positioning）**

本產品旨在為香港保險經紀提供一個整合式智能 Agent 平台，協助其在客戶會面前、中、後高效準備與提供專業建議，並支援快速條款查詢、生成高可讀性提案，及以案件方式管理每一次客戶會面。


**核心價值：**
•精準檢索保單條款，提供雙版本解釋（專業版＋行外易懂版）
•讓經紀人可利用自訂模板與公司原始 Proposal，自動生成「易讀版計劃書」
•將銷售全流程重新包裝為 「Case-based 案件流程」，提升工作效率與清晰度
•支援資料上傳 (PDF / Excel)，可解析產品冊、條款、保障表與保費

### 🎯 **使用者（User Personas）**

* 個人保險經紀（AIA、保誠、友邦、FTLife…）
* 經紀團隊經理（用於團隊部署）
* 不考慮企業層（非公司內部系統）

### 🎯 **市場（Market）**

香港保險市場（面向內地客戶），跨境投保環境。


# 3. 產品目標（Product Goals）

| 目標 | 描述 |
|----|----|
| G1 | 提供可快速查詢保單條款並生成專業＋行外易懂解釋的智能 Agent |
| G2 | 讓經紀人能把公司 Proposal 上傳 → 自動生成簡化版 Proposal |
| G3 | 用 Case Workflow 導引經紀人步驟式完成會面流程 |
| G4 | 提供統一入口集中管理會面內容、文件、流程展示 |
| G5 | 產品可部署（React 前端 + Python 後端 + LangChain Agent） |


# 4. 產品範圍（Product Scope）

## ⭐ **核心功能（MVP）**

### A. Case-based 工作流程（主要框架）

每次客戶會面視為一個 Case，包含：





1. Step 1：KYC & 缺口分析（跳外部計算器）
2. Step 2：推薦產品（經紀人輸入）
3. Step 3：AI Proposal 簡化 generator（上傳模板 + Proposal PDF）
4. Step 4：投保流程講解（固定配置內容）

### B. 條款檢索與雙語解釋（AI Agent）

* 上傳各家產品冊、保單條款、FAQ
* RAG 檢索條款原文
* 生成兩種解釋：
  * **專業人士版**
  * **客戶易懂版（行外語言）**

### C. 智能 Proposal 生成模組

* 上傳保險公司提供之 Proposal（PDF/Excel）
* 自動解析：保額、保費、年期、保障表、責任等
* 套用用戶上傳模板（Docx/Markdown）生成：
  * 簡化版 Proposal
  * 專業摘要
  * 客戶可讀亮點摘要
* 輸出 PDF/Docx

### D. 模板管理

* 經紀人可上傳自己的文檔模板
* 可儲存、版本管理

### E. 外部工具入口（步驟 1，配置項）

* 教育金計算器（外部連結）
* 退休計算器
* 其他第三方工具

### F. 資料庫

* Case
* 案件內檔案
* 模板
* Proposal 轉換記錄
* 條款索引資料


# 5. 不包含（Out of Scope）

❌ 不接入微信
❌ 不分析聊天內容
❌ 不做保單推薦算法
❌ 不做 CRM
❌ 不做客戶管理
❌ 不需考慮法律與合規（由經紀人自負）
❌ 不做保險公司 API 直連


# 6. 使用者流程（User Flow）

## **6.1 Case Workflow 主流程（最核心）**

### **（1）經紀人建立 Case**

輸入：

* 客戶稱呼
* 會面日期
* 基本情境（備註）

→ 建立成功後出現四個流程步驟


### **（2）Step 1：KYC & 缺口分析**

* 系統顯示可配置外部計算器按鈕
* 經紀人自行跳轉
* 回來後填寫結果摘要（如：兒童教育金缺口 $450,000 HKD）


### **（3）Step 2：推薦產品（手動）**

* 不需要 AI
* 經紀人輸入：
  * 推薦保險公司
  * 推薦產品名稱
  * 配置（基本保額等）

並上傳公司給出的客制 Proposal PDF/Excel。


### **（4）Step 3：AI Proposal 簡化（最重要模塊）**

流程：

```
上傳 Proposal -> AI 自動解析 -> 套模板 -> 生成簡化版 Proposal
```

輸出內容：

* 行外能看懂的產品介紹
* 保障摘要
* 保費對比圖（若模板需要）
* 優點亮點
* 風險提示（可選）

→ 可多次生成不同版本。


### **（5）Step 4：投保流程講解（固定內容）**

支持：

* 固定文字
* 圖片
* 圖表
* 影片嵌入（如經紀人錄影講解流程）

作為會面最後的教育步驟。


# 7. 用戶界面（UI 結構）

### **首頁**

* 開新 Case
* 直接使用工具（獨立入口）
  * 條款檢索
  * Proposal 簡化工具
  * 模板管理

### **Case 頁面**

```
Case 名稱：陳小姐（教育金規劃）
進度條： Step1 → Step2 → Step3 → Step4

Step 1：KYC / 缺口分析
Step 2：推薦產品與上傳 Proposal
Step 3：AI 簡化 Proposal 生成
Step 4：投保流程講解
```

### **AI 條款檢索頁**

* 聊天式界面
* 顯示條款原文
* 顯示簡化解釋


# 8. 技術架構（Technical Architecture）

## **前端：React / Next.js**

* UI Flow
* 狀態管理（Redux / Recoil）
* PDF Viewer
* 文檔預覽

## **後端：Python + FastAPI**

微服務包含：




1. LangChain Agent Service
2. Proposal Parser Service（PDF/Excel → 結構化 JSON）
3. Template Engine（Jinja2 + LLM Hybrid 模式）
4. RAG 檢索服務（Faiss / Chroma）
5. Case / File / Template 管理 API
6. Auth（Token-based）

## **AI 層：LangChain + Gemini/DeepSeek**

### Agent 任務角色：

* 條款檢索與原文定位
* 專業版解釋
* 行外易懂版解釋
* 文檔生成（Proposal）

## **資料庫：PostgreSQL**

主要數據表：

* case
* case_files
* proposal_raw
* proposal_simplified
* templates
* terms_index
* user


# 9. MVP 邊界（MVP Scope Boundary）

### **Must-Have（必要）**

* Case Workflow （4 Steps）
* 條款 RAG + 雙層解釋
* Proposal 上傳 + 模板簡化
* 模板管理
* PDF 匯出
* React + Python + LangChain 架構完成

### **Nice-to-Have（可延伸）**

* 模板市場（讓經紀人交換模板）
* Proposal 數據比對
* 多公司 Proposal 對比圖表
* 自動計算器（在系統內置）


# 10. 未來路線（Future Roadmap）

| 時間 | 功能 |
|----|----|
| Phase 2 | 模板商城 / 共享模板 |
| Phase 3 | 給客戶的展示模式（類 PowerPoint） |
| Phase 4 | Proposal 數據統計 / 團隊報表 |
| Phase 5 | AI 自動寫建議書（多版本） |
| Phase 6 | CRM 模組（按 Case 維護客戶） |


