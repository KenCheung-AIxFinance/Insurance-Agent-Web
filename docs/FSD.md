# 📘 **功能說明書（FSD）**

產品：InsurAgent 智能保險經紀助手

版本：v2025.11

類型：FSD

# 1. 產品簡介（Overview）

本系統為香港保險經紀使用的智能助手，核心功能包括：


1. **Case-based Workflow**（每個客戶會面都是一個 Case）
2. **條款檢索與 AI 解釋**（專業版 vs 行外易懂版）
3. **AI Proposal 簡化生成**（讀取保險公司 Proposal → 套用模板 → 生成客戶易讀版）
4. **模板管理（Proposal / 文檔模版）**
5. **投保流程講解**（圖文、影片）
6. 系統採用 React 前端 + Python FastAPI 後端 + LangChain/LangGraph Agent


# 2. 系統架構（System Architecture）

```
[React 前端]
        |
        v
[FastAPI 後端 REST API]
        |
        v
[AI Engine (LangChain + LangGraph + DeepSeek/Gemini)]
        |
        +--> RAG 索引（PDF 條款庫）
        +--> Proposal Parser（pdfplumber + LLM parser）
        +--> Template Renderer (Jinja2)
        |
        v
[Database]
   - Firestore（Case、Metadata、User）
   - SQL（Proposal Parsed Data、大型檔案索引）
[File Storage]
   - Firebase Storage / GCS (PDF、模板、輸出文件)
```


# 3. 角色（User Roles）

| 角色 | 權限 |
|----|----|
| 經紀人（Agent） | 建立 Case、上傳 PDF、生成文檔、查詢條款 |
| 團隊經理 | 管理模板、查看團隊統計（非 MVP） |
| 系統管理員 | 管理權限、資料庫、檔案 |


# 4. 功能模組（Functional Modules）


# ⭐ **4.1 Case Management（案件管理）**

### **4.1.1 建立 Case**

輸入欄位：

| 欄位 | 型態 | 必填 | 說明 |
|----|----|----|----|
| case_id | string | 系統自動 | UUID |
| client_name | string | Y | 客戶稱呼 |
| meeting_date | date | Y | 預計會面日期 |
| notes | string | N | 客戶背景描述 |
| status | string | 系統自動 | draft / in_progress / completed |

### 功能需求

* 能搜尋 Case（關鍵字、日期）
* 能標註 Case 狀態
* Case 資料永久儲存（除非手動刪除）


# ⭐ **4.2 Step 1：KYC 與缺口分析**

### 4.2.1 外部工具連結（Configurable）

後台需支援增減外部 URL，例如：

* 教育金計算器
* 退休儲蓄計算器
* 月供計算器

### 4.2.2 返回後輸入結果摘要

欄位：

| 欄位 | 型態 | 說明 |
|----|----|----|
| education_gap | number | 教育金缺口 |
| retirement_gap | number | 退休儲蓄 gap（如適用） |
| other_gap | string | 其他補充信息 |


# ⭐ **4.3 Step 2：產品推薦（手動輸入）**

項目不做 AI 推薦，不連接保險公司 API。

輸入：

| 欄位 | 型態 | 說明 |
|----|----|----|
| insurer | string | 保險公司 |
| product_name | string | 產品名稱 |
| configuration | json | 保額、年期等配置 |
| proposal_file | file | 上傳公司 Proposal（PDF/Excel） |


# ⭐ **4.4 Step 3：AI Proposal 簡化生成（核心功能）**

流程：

```
上傳 Proposal PDF/Excel →
AI Parser 萃取數據 →
套用模板 →
生成簡化版 Proposal（PDF/Docx/HTML）
```


## **4.4.1 Proposal Parser 功能需求**

Parser 需支援：

* AIA PDF
* Prudential PDF
* FTLife PDF
* Manulife PDF
* Excel proposal（如有）

解析內容（如檔案格式允許）：

| 欄位 | 說明 |
|----|----|
| 保額（Sum Assured） |    |
| 保費（Annual / Monthly） |    |
| 年期（Premium Term） |    |
| 保障項目表（Benefit Table） |    |
| 附加保障（Rider） |    |
| 產品描述 |    |
| 重要條款 |    |

### 4.4.1.1 Parser 技術實現

* PDF → pdfplumber + heuristics
* 若表格複雜 → 丟進 LLM（DeepSeek/Gemini）解析
* SQL 儲存解析後結構化資料（理由：可查詢、可比較、非 document database 優勢）

**→ SQL 用於 Proposal parsed data（重要！）**


## ⭐ **4.4.2 模板引擎（Template Engine）**

格式支援：

* .docx
* .md
* .html

引擎使用：

* Jinja2 渲染變數

資料流：

```
{parsed_data} + {user_template} → render → output file
```

示例變數：

```
{{ client.name }}
{{ product.name }}
{{ premium.annual }}
{{ benefit_table }}
```


## ⭐ **4.4.3 生成內容**

AI 需生成兩類內容：

### 1) 行外易懂版摘要（客戶版）

* 保障摘要（簡單語言）
* 產品亮點
* 適合人群
* 注意事項（Do / Don’t）
* 以例子說明保險責任

### 2) 經紀人摘要（專業版）

* 保單條款引用
* 保費計算邏輯
* 規則解讀

→ 最終輸出：

* PDF（一鍵導出）
* Word Docx
* 網頁版（HTML）

檔案儲存位置：

* Firebase Storage / Google Cloud Storage


# ⭐ **4.5 Step 4：投保流程講解**

固定內容，包含：


1. 信息收集
2. 所需文件
3. 體檢（若需）
4. 銀行賬戶流程
5. 簽署方式
6. 承保時間範圍
7. 常見 FAQ

管理方式：

* 後台可編輯內容（富文本）
* 支援加入圖片、影片連結（YouTube）


# ⭐ **4.6 條款檢索 + AI 解釋（RAG Agent）**

流程：

```
上傳保單條款 PDF →
向量化 →
存入向量庫 →
查詢 keyword →
AI 生成專業 + 行外易懂版解釋
```


## 4.6.1 技術需求

向量庫（Vector DB）選型：

* Firestore 不適合（非向量 DB）
* SQL 也不適合（需手動存 embeddings）

**最適：使用 Pinecone / Milvus / Qdrant（推薦 Qdrant）**

RAG 運作：

```
query → embedding → search → top_k → LLM 生成
```

輸出內容：

| 類型 | 說明 |
|----|----|
| 專業人士版 | 嚴謹，引用條款原文 |
| 客戶易懂版 | 面向行外語言，保持法律準確性 |
| 條款原文定位 | 段落文字 + PDF page index |


# 5. 資料庫設計（Database Schema）


# ⭐ 5.1 Firestore（儲存 metadata）

適合非強結構、多層次 Document 的資料：Case、User、Template Metadata。

### Collections：

### 1. `users`

```
user_id: string
name: string
email: string
role: agent | manager | admin
created_at: timestamp
updated_at: timestamp
```

### 2. `cases`

```
case_id: string,
title: string,
client_name: string,
created_by: string (user_id),
created_at: timestamp,
updated_at: timestamp,
status: "draft" | "in_progress" | "completed" | "archived",
tags: [string],
priority: "low" | "normal" | "high",
summary: string,
current_output_id: string | null
public_shareable_url: string
```

### 3. `proposal_meta`

```
proposal_id: string,
case_id: string,
file_id: string,
insurer: string,
product_name: string,
parsed_status: "pending" | "parsed" | "failed",
parsed_at: timestamp | null,
parsed_sql_id: integer | null, // FK to SQL proposal_parsed.id
created_at: timestamp
```

### 4. `files`

```
file_id: string,
case_id: string | null,
uploaded_by: string (user_id),
file_name: string,
mime_type: string,
storage_url: string,
size_bytes: int,
parsed_status: "success" |
file_type: "proposal_original" | "template" | "generated_output" | "other",
created_at: timestamp
summary: string
```

### 4. `templates`

```
template_id: string
user_id: string
template_name: string
type: proposal | summary
file_url: string
fields: array
created_at: timestamp
```

### 5. `generated_outputs`

```
template_id: string
user_id: string
template_name: string
type: proposal | summary
file_url: string
fields: array
created_at: timestamp
```

### 5. `rag_queries`

```
query_id: string,
case_id: string | null,
user_id: string,
query_text: string,
professional_answer: string,
client_answer: string,
source_refs: [ { file_id, page, snippet_id } ],
created_at: timestamp
```

### 5. `activity_logs`

```
activity_id: string,
case_id: string | null,
user_id: string,
action_type: string, // e.g. "upload_proposal", "generate_output", "rag_query"
payload_summary: string,
timestamp: timestamp
```


# ⭐ 5.2 SQL Database（PostgreSQL）

用於儲存 **Proposal Parsed Data**（結構化、高查詢性）。

### Table：proposal_parsed

```
proposal_id (pk)
case_id
insurer
product_name
premium_annual
premium_monthly
sum_assured
term
benefit_table (JSON)
riders (JSON)
raw_text (TEXT)
created_at
```


# ⭐ 5.3 File Storage

使用 Firebase Storage 或 GCS。

結構：

```
/users/{user_id}/cases/{case_id}/proposal/original.pdf
/users/{user_id}/cases/{case_id}/proposal/parsed.json
/users/{user_id}/templates/{template_id}/template.docx
/users/{user_id}/cases/{case_id}/output/generated.pdf
```


# 6. API 設計（REST API Spec）

格式：
`{method} {endpoint}`


## **6.1 Case**

### **POST /cases**

建立 Case

body:

```
{
  "client_name": "...",
  "meeting_date": "...",
  "notes": "..."
}
```


## **6.2 Proposal Parser**

### **POST /proposal/upload**

上傳 proposal。

multipart:

```
file
case_id
```

回傳：

```
{
  "proposal_id": "...",
  "status": "parsed",
  "parsed_fields": { ... }
}
```


## **6.3 Template System**

### **POST /templates/upload**

multipart:

```
file
type
template_name
```


### **POST /proposal/generate**

body:

```
{
  "template_id": "...",
  "parsed_data_id": "..."
}
```

回傳：

```
{ "file_url": "..." }
```


## **6.4 條款檢索（RAG）**

### **POST /rag/query**

body:

```
{
  "query": "免賠額是什麼意思？"
}
```

response:

```
{
  "professional": "...",
  "simplified": "...",
  "sources": [ { "page": 12, "text": "..." } ]
}
```


# 7. 前端功能（React）


## ⭐ 7.1 主畫面

* Case 列表
* 搜尋欄
* 新建 Case 按鈕
* 模板管理入口
* 條款檢索入口


## ⭐ 7.2 Case Editor（步驟導向）

使用「Stepper UI」：

```
Step 1 → Step 2 → Step 3 → Step 4
```

每步可儲存，顯示完成狀態（打勾）。


## ⭐ 7.3 文檔生成器 UI

* 上傳 Proposal（PDF/Excel）
* 顯示解析結果（表格 UI）
* 選擇模板
* 「生成文檔」按鈕
* 下載連結


## ⭐ 7.4 條款檢索 UI

* 文字輸入框
* 結果：
  * 專業版
  * 客戶易懂版
  * 條款原文（Highlight）


# 8. 業務規則（Business Rules）















1. 每位經紀人只能看自己 Case
2. 模板可共享給團隊經理（未來版）
3. 文檔輸出需保留生成記錄（審計需求）
4. 條款檢索結果需保留來源頁碼
5. 若 Proposal 格式無法解析 → 自動切換 LLM OCR 模式


# 9. 非功能性需求（NFR）

| 類型 | 要求 |
|----|----|
| 性能 | Proposal 解析時間 < 20 秒 |
| 可用性 | 99% uptime |
| 安全 | JWT 登入、https |
| 儲存 | Firestore 可無限水平擴展 |
| 機密性 | PDF 不會傳送至第三方，LLM 託管必須可控 |


# 10. MVP 界定（MVP Scope）

✔ Case Workflow
✔ Proposal Parser（基本解析）
✔ Template Renderer
✔ 條款檢索（RAG）
✔ 文檔下載

❌ 不做 CRM
❌ 不做團隊分析
❌ 不做自動產品推薦


# 11. 下一階段可以生成的文檔

我可以為你生成（如果你需要）：

* 🟩 **數據庫 ER Diagram**
* 🟩 **Swagger API Spec（可導入 Postman）**
* 🟩 **LangGraph Agent 設計文檔**
* 🟩 **前端 Wireframe（可生成 Figma HTML）**
* 🟩 **系統架構圖（C4 Model）**
* 🟩 **前後端專案目錄結構**
* 🟩 **開發排期（Gantt Chart）**


如果你同意本 FSD，我可以立即開始：
→ **生成後端 API Spec（詳細參數格式 + 驗證規則）**
或
→ **生成 LangChain / LangGraph Agent 完整架構與節點設計**

你想先進入哪一個階段？