# LangGraph Agent 設計文檔

**產品**：智能保險經紀助手（Case-based Agent System）
**版本**：v1.0（擴展版，含非 MVP 的高完成度設計）
**語言**：繁體中文


## 概述（Summary）

本文件是面向工程與 ML/AI 團隊的 LangGraph（與 LangChain 協同）Agent 設計藍圖，目標是建立一個可組織、多 Agent 協作、可觀測且可擴展的系統，支援以下核心能力：

* 條款檢索（RAG）與雙層解釋（專業版 / 客戶版）
* Proposal（保險公司定製文件）解析與結構化（Parser）
* Template 引擎與建議書（Brief）生成（可導出 PDF/Docx）
* Case Workflow 協調（Step-based project）
* 人機協同（human-in-loop）與審計（Audit）
* 監控、評估與模型質量回饋閉環

設計將採用 **LangGraph** 作為可視化與 orchestration 平台（節點＝agents / 工具），LangChain 用於 chain-of-thought / prompt chaining 與工具連接，DeepSeek/Gemini 作為 LLM provider。


# 高階設計原則（Design Principles）



1. **分而治之（Single Responsibility）**：每個 Agent 負責單一清晰職責（檢索、解析、生成、管理）。
2. **可觀測 & 可審計（Observable & Auditable）**：所有 agent 輸入/輸出與中間狀態需被紀錄（不可省略）。
3. **人機協同（Human-in-loop）**：對於高風險或 low-confidence 輸出自動標註需人工復核。
4. **模組化 & 可替換（Pluggable）**：向量 DB、LLM、OCR 可替換（配置化）。
5. **錯誤隔離（Fail-safe）**：單個 Agent 失敗不影響整體流程，並提供回退策略。
6. **可擴展性（Scalable）**：支持垂直擴展與水平擴展（隊列 / 微服務模式）。


# LangGraph 總體拓撲（Graph Topology / Node Overview）

（文字圖示）

```
UserInteractionAgent
       ↓
CaseManagerAgent ↔ DocumentProcessorAgent → ChunkStore / EmbeddingService → VectorDB
       ↓                          ↘
PolicyQueryAgent ← Retriever ← EmbeddingService
       ↓
TemplateEngineAgent ← ProposalParserAgent ← DocumentProcessorAgent
       ↓
OutputComposerAgent → FileStorageService
       ↓
Audit & Monitoring Agent (Logging / Metrics)
```

每個框代表一個 LangGraph 節點（agent），節點之間的箭頭表示數據/控制流。


# Agent 清單與詳細規格

> 每個 Agent 部分包含：目標（Goal）、輸入（Input）、輸出（Output）、工具（Tools）、Prompt Template、錯誤/回退策略、監控指標（Metrics）。


## 1. CaseManagerAgent

**Goal**：管理 Case（專案）生命周期、協調 Case 內各 agent 的執行、維護 Case 狀態與元數據。
**Input**：`{ case_id, user_id, client_meta, action }`（action 例如 create_case, start_step, attach_file）
**Output**：Case 更新、觸發子 Agent 任務（document processing, proposal generation）
**Tools**：

* Firestore CRUD API
* Task Queue（如 Redis Queue / Celery）觸發後端任務
  **Prompt Template**：非 LLM 為主，主要為 Orchestration。
  **Errors / Fallback**：
* 若 DocumentProcessor 長時間未回應 -> 設置 case 進度為 `processing_failed`、通知使用者並預定重試（3 次）。
  **Metrics**：Case 建立時間、平均完成時間、重試次數。


## 2. DocumentProcessorAgent

**Goal**：將上傳的文件（PDF/DOCX/XLSX）解析為文字、表格與 chunk，並送 embedding pipeline 建立檢索單位（chunks）。
**Input**：`{ document_id, file_url, user_id, case_id }`
**Output**：`{ parsed_text, chunks_meta[], parsed_tables[], ocr_status }`
**Tools**：

* OCR Engine（Tesseract 或商業 OCR）
* pdfplumber / python-docx / pandas
* Storage Service（下載/上傳檔案）
* Message Bus（寫入 chunk 生成任務）
  **Processing Steps**：



1. 下載檔案
2. 如果為掃描 PDF -> OCR（多語言設定：繁中/簡中/英文）
3. 文本清洗（去除 header/footer、頁碼）
4. chunking（基於語義/段落/表格）
5. 對 chunk 發送 embedding job 至 EmbeddingService
6. 將 chunks metadata 寫入 Firestore `chunks`（扁平）
   **Prompt Template**（當需LLM協助解析複雜表格）：

```
You are a document parser. Extract the following fields from this document: product_name, benefit_table, premiums, sum_assured, riders.
Return as JSON.
```

**Errors / Fallback**：

* OCR 失敗：回退至人工上傳更高清檔，或提示使用者重新上傳
* 表格無法結構化：標記 `requires_manual_review = true`
  **Metrics**：解析成功率、平均解析時間、manual_review_rate。


## 3. EmbeddingService

**Goal**：計算 chunk 的 embeddings 並將其注入向量庫（FAISS / Qdrant / Pinecone）。
**Input**：`{ chunk_id, text }`
**Output**：`{ chunk_id, vector_id }`（並在 `chunks` 中記錄 vector_id / retrievable）
**Tools**：

* DeepSeek/Gemini Embedding API 或 OpenAI embeddings（視選型）
* Vector DB Client（Qdrant / Pinecone / pgvector）
  **Notes**：
* 向量不儲存在 Firestore（cost/讀寫不佳），僅保存在 VectorDB，Firestore 存 chunks meta 與 source mapping。
  **Metrics**：embedding 延遲、批次吞吐量、向量 DB 存儲使用量。


## 4. Retriever（檢索封裝，可做為 PolicyQueryAgent 的子工具）

**Goal**：按 query embedding 從 VectorDB 檢索 top_k chunks，並返回原文片段與元數據。
**Input**：`{ query, top_k=5, filter: {company, doc_type, date_range} }`
**Output**：`[ {chunk_id, text, score, doc_id, page} ]`
**Tools**：

* Vector DB Search API
* MMR / Reranker（可選）
  **Notes**：
* 支援 filter 條件（document metadata）
  **Metrics**：平均檢索延遲、top1_hit_rate（基於人工標注 testset）。


## 5. PolicyQueryAgent

**Goal**：對外提供條款查詢功能：給出條款原文來源、專業解釋（給經紀）和客戶易懂版。
**Input**：

```
{
 "case_id": "...",
 "user_id": "...",
 "query": "什麼情況下豁免保費適用？",
 "filters": { "company": "AIA" }
}
```

**Output**：

```
{
 "sources": [{document_id, filename, page, chunk_id, snippet}],
 "professional_answer": "...",
 "consumer_answer": "...",
 "confidence": 0.87,
 "needs_review": false
}
```

**Tools**：

* Retriever（top_k）
* LLM Generator（DeepSeek/Gemini）
* Prompt Template Manager（模組化 prompt）
  **Prompt Templates**：

*Retriever Summarization Prompt (system-level)*

```
你是保險條款專家。根據以下引文（來源標註），回答問題：{query}
請先列出最相關的原文段落（含文件名與頁碼），再給出「專業版回答」，最後給出「客戶易懂版」。回答每一部分時請明確標註來源。
引文：
{chunks}
```

*Professionally-focused Prompt (for LLM)*

```
系統：你是保險法律/產品專家，回覆應覆蓋法條與保單解釋，使用嚴謹語氣（繁體中文）。回答需精簡、條列化，並引用來源。

輸入：{query}
引用內容：
{chunk_texts_with_source}

輸出格式 JSON:
{
  "sources": [{ "document_id":"", "filename":"", "page":1, "snippet": "..." }],
  "professional_answer": "....",
  "consumer_answer": "....",
  "confidence": 0.0
}
```

**Confidence Estimation**：

* LLM 需同時輸出 confidence（可用模型 logprob proxy 或檢索相似度均值 + LLM 自評）。
* 若 confidence < threshold (e.g., 0.6) → `needs_review=true`，並觸發 human review workflow（標記 Case 為需人工審核）。

**Errors / Fallback**：

* 檢索無結果：回傳「未在上傳文件中找到，建議上傳相關條款」
* LLM 生成內容包含「确信」不高的診斷時，自動加上 disclaimer 並標註「請人工複核」。
  **Metrics**：回答準確率（人工抽樣評估）、平均生成時間、need_review_rate。


## 6. ProposalParserAgent

**Goal**：針對保險公司生產之 Proposal（常含定制數字），抽取結構化字段（保費、保額、年期、coverages、riders、表格）。
**Input**：`{ document_id, user_id, case_id }`
**Output**：`{ parsed_data: {product_name, premium, term, benefits[], riders[], raw_text}, parse_confidence }`
**Tools**：

* DocumentProcessorAgent（OCR + chunking）
* LLM assisted parser（當 heuristics 失敗）
* SQL DB（Postgres）存 parsed_data（便於查詢、比較）
  **Parsing Strategy**：



1. 嘗試 heuristics parse（表格檢測）
2. 若 heuristics 成功率低或檢測到不規則表格 -> 呼叫 LLM parser（提示模板，返回 JSON）
3. Validate parsed JSON（schema validate）
   **Sample LLM Parser Prompt**：

```
請從下列文本中抽取：product_name, premium_annual, premium_monthly, sum_assured, term, benefit_table（以 JSON array），riders（JSON array）。若無該欄位，請以 null 表示。只回傳 JSON。
```

**Errors / Fallback**：

* parser_confidence 低 -> 標註 requires_manual_review
  **Metrics**：parsed_fields_coverage、parser_accuracy（人工標註測試集）。


## 7. TemplateEngineAgent

**Goal**：將 parsed_data 與 template（Jinja2/Markdown）合成最終建議書草稿，並可觸發 LLM 生成行外語言段落（若 template 欄位要求）。
**Input**：

```
{ template_id, parsed_data, client_meta, tone: "consumer" | "professional" }
```

**Output**：

```
{ rendered_markdown, rendered_html, generated_sections: [{section_id, source, confidence}] }
```

**Tools**：

* Jinja2 渲染器（主體模板）
* LLM（for generated copy: highlights, easy-explain sentences）
* PDF generator（weasyprint / wkhtmltopdf）
  **Rendering Strategy**：
* Step1：渲染靜態欄位（{{product_name}} 等）
* Step2：對需要「文案生成」的 template blocks 呼叫 LLM（提供 parsed_data context + style instructions）
* Step3：合併並輸出（markdown → PDF / DOCX）
  **Prompt Template（for copygen）**：

```
你是寫給一般消費者的文案專家，請根據下列保障資料生成三句簡短的「亮點說明」，每句不超過 22 字。資料：{benefits_summary}
```

**Errors / Fallback**：

* 若 LLM 生成帶不確定措辭 -> 在生成 section 加上 footnote「請經紀查證」
  **Metrics**：template_render_time、Generated copy acceptance rate（人工評分）。


## 8. OutputComposerAgent

**Goal**：整合 TemplateEngine 的輸出與 Case 資料，生成可下載/分享檔案（PDF/DOCX/HTML），上傳 Storage 並在 Firestore 產生記錄。
**Input**：`{ rendered_html, case_id, user_id, metadata }`
**Output**：`{ file_url, file_type, size, checksum }`
**Tools**：

* HTML → PDF converter（weasyprint/wkhtmltopdf）
* Docx generator（python-docx 或 pandoc）
* Storage API（Firebase Storage / GCS）
  **Errors / Fallback**：生成失敗通知 user 並保存中間 markdown 以供重試。
  **Metrics**：file_generation_time、file_size。


## 9. UserInteractionAgent (Frontend Chat / Actions)

**Goal**：處理使用者直接互動（UI 請求），收集 input 並呼叫相應的 LangGraph 根節點，回傳結果給前端並格式化顯示。
**Input**：UI 事件（query, upload, generate）
**Output**：標準化 Response objects（see API Spec）
**Tools**：

* REST Gateway（FastAPI）
* Short-term cache（Redis）以加速常見 query
  **Notes**：
* 負責對 long-running tasks（如 parser, embedding）以非同步方式回報狀態給 UI（websocket 或 polling）。


## 10. Audit & Monitoring Agent

**Goal**：收集所有 agent 的 inputs/outputs & metadata（不存 LLM raw tokens unless necessary），提供審計視圖（trace），並產生 QA dataset 用於後續模型 fine-tune。
**Input**：所有 agents 的事件 stream
**Output**：logs + metrics + alerts
**Tools**：

* Observability stack（Prometheus + Grafana）
* Log storage（Elastic / Cloud Logging）
* Trace Storage（Audit DB in Firestore/SQL）
  **Retention**：生成記錄至少保留 7 年（視合規）——但目前客戶不要求合規，所以紀錄期可配置。
  **Metrics**：latency, error_rate, manual_review_rate, correctness_rate（sampled）。


# Agent-to-Tool Contracts（Tool API Spec）

> 每個 agent 使用一組工具，以下列出關鍵工具接口（供工程團隊實作）

### Tool: VectorDB.search(query_embedding, top_k, filters=None)

* input: embedding: list\[float\], top_k: int, filters: dict
* output: \[{chunk_id, score, text, doc_id, page}\]

### Tool: Embedding.compute(text_batch)

* input: list\[str\]
* output: list\[vector\]

### Tool: Storage.upload(file_path, dest_key)

* input: local_path, dest_key
* output: {url, checksum, size}

### Tool: OCR.process(file_url)

* input: file_url
* output: {pages: \[{page_num, text}\], ocr_confidence}

### Tool: PDFParser.extract_tables(file_url)

* input: file_url
* output: \[{ table_id, headers, rows }\]

### Tool: LLM.generate(prompt, temperature, max_tokens, stop_tokens, function_schema=None)

* input: prompt string / messages
* output: { text, tokens_used, logprobs (optional) }


# Prompt 管理（Prompt Engineering）

* 所有 prompt 應在 Prompt Manager 中版本化（PromptStore），並支援 A/B 測試。
* Prompt template 必須包含 `system` 指令（角色定位）、`context`（retrieved chunks / parsed_data）、`instruction`（任務）。
* 每次 prompt 呼叫需追蹤版本 id、模板 id 與輸出 hash（便於回溯）。


# Confidence Estimation 與 Human-in-loop 規則

**Confidence score** 由以下組合估算：

* retriever_score_mean（top_k 相似度均值）
* LLM self-assessed confidence（若可）
* parsed_data_consistency（是否有 conflicting fields）

**策略**：

* `confidence >= 0.8`：自動回傳給使用者（標示 auto）
* `0.6 <= confidence < 0.8`：回傳給使用者 BUT 顯示 disclaimer（建議人工複核）
* `confidence < 0.6`：標註 `needs_review=true`、發送到 human-review queue（團隊經理或 QA 去審）

**Human Review Flow**：



1. human receives task（UI list）
2. 人工打分（accept / modify / reject）與修改後回寫 `chunks` 或 `proposals`（closing the loop）
3. 修改結果 feed back into training dataset


# 審計（Audit）與隱私

* 每次 Agent 輸入與輸出（包括使用的 top_k chunks metadata）皆需記錄在 Audit DB。
* 不儲存敏感原文（如身分證號）於 logs；如必要，做 PII 掩碼或加密。
* API keys / LLM keys 不放前端，後端密鑰管理使用 Secret Manager。


# Observability & Metrics（可量化指標）

**系統層級**：

* Uptime（%）
* Avg Response Time（ms）
* 99th Percentile Latency

**Agent 層級**：

* PolicyQueryAnswer Accuracy（人工抽查）
* Retriever top1 hit rate
* Parser success rate
* TemplateRender success rate
* ManualReview Rate（%）

**業務指標**：

* 每 case 平均時間節省（估算）
* 經紀 adoption rate（活躍用戶/付費用戶）
* 生成建議書的轉化率（後端可接 CRM 時）


# 測試策略（Testing）

**單元測試**：

* DocumentProcessor: 各種 PDF、scanned PDF、DOCX、XLSX 測試集
* Parser: schema 驗證測試（JSON 填滿 vs 缺失）
* Retriever: vector DB mock 測試

**集成測試**：

* end-to-end case：從上傳檔案到 PDF 生成，一條 pipeline 測試
* 模擬 low-resource LLM（stub）測 LLM 回退行為

**驗收測試（UAT）**：

* 與業務方定義 50 個典型案件（cover various insurers）做人工評分，要求：
  * 條款檢索 top1 正確率 ≥ 90%
  * 建議書欄位對應率 ≥ 85%


# 部署與運維（Deployment & Ops）

**建議架構**：

* Containerized services（Docker）
* Orchestrator：Kubernetes（GKE / EKS）或 Docker Compose for small-scale
* Persistent Storage：GCS / Firebase Storage
* Vector DB：向量 DB 託管（Pinecone 或 Qdrant on k8s）
* Secrets：Secret Manager（GCP/AWS）
* CI/CD：GitHub Actions → Build, Test, Deploy

**Scaling**：

* Embedding & LLM calls：水平擴展（worker pool）
* Retriever：向量 DB 調整副本數量 / shards
* File processing：使用 job queue，避免阻塞 API threads

**Cost 控制**：

* Embedding batching（減少 API calls）
* LLM temperature / token limit 管控
* Cache frequent queries（Redis）


# 安全考量（Security）

* TLS everywhere（HTTPS）
* Authentication：OAuth2 / JWT for frontends
* Authorization：Role-based access control（RBAC）
* Data encryption at rest（Storage）與 in transit
* PII Masking / Redaction：Parser 檢測身份號、銀行帳號等並 Mask


# Data Schema / Example Messages

### PolicyQueryAgent Request Example

```json
{
  "case_id": "case_123",
  "user_id": "user_abc",
  "query": "若受保人因酒駕受傷是否理賠？",
  "filters": {
    "company": "AIA",
    "doc_type": "clause"
  },
  "top_k": 5
}
```

### PolicyQueryAgent Response Example

```json
{
  "sources": [
    {"document_id":"doc_1","filename":"AIA_terms_2024.pdf","page":12,"chunk_id":"c_121","snippet":"若受保人於酒後駕駛下受傷，保單不承保..."}
  ],
  "professional_answer": "根據 AIA 條款第 12 頁第 3 款，因酒後駕駛導致之傷害屬除外責任，該情形不在承保範圍內。例外條款：若能證明非因酒精影響導致的意外......",
  "consumer_answer": "如果傷害是因駕車時喝酒造成的，這份保單通常不會付錢。若可以證明事故跟喝酒無關，有例外可能會理賠。",
  "confidence": 0.82,
  "needs_review": false
}
```


# 監督學習與品質回饋（Continuous Improvement）

* 人工審核結果進入 QA dataset → 定期 retrain / fine-tune prompt 或下一層 LLM（若有自訓能力）
* 收集「被用戶標記為不準確」的案例，建立 negative examples，調整 retriever weighting 與 prompt phrasing。
* 定期 A/B 測試不同 prompt templates（衡量 user acceptance）。


# 系統 / 技術架構圖

## 4.1 高層次架構說明（元件）

* **Client**：React/Next.js 或 Streamlit（MVP），負責 UI 與呼叫後端 API。TLS
* **API Gateway / Load Balancer**：Nginx / AWS ALB
* **Auth Service**：JWT issuing（可用 Firebase Auth 或自建 Keycloak）
* **Backend API（FastAPI）**：提供 REST endpoints（cases, files, rag, proposal）
* **Worker Queue**：Celery / RQ / Cloud Tasks，處理長任務（ingest, parse, embed, generate）
* **Storage**：Firebase Storage / S3（檔案）
* **Metadata DB**：Firestore（扁平化 collections）
* **Relational DB**：Postgres（proposal_parsed, audit_summaries）
* **Vector DB**：Qdrant / Pinecone / Milvus / pgvector
* **LLM Provider**：DeepSeek/Gemini via LangChain (or self-hosted)
* **LangChain / LangGraph Orchestrator**：部署在 backend 或 dedicated orchestration service
* **Monitoring & Logging**：Prometheus + Grafana, ELK 或 Cloud Logging
* **CI/CD**：GitHub Actions → deploy to Kubernetes / cloud run / ECS
* **Observability**：Sentry / OpenTelemetry for trace

## 4.2 高階架構圖

```
                                ┌──────────────────────────────┐
                                │          Client (UI)         │
                                │ React/Next.js  or Streamlit  │
                                └─────────────┬────────────────┘
                                              │ HTTPS (JWT)
                                              ▼
                                ┌──────────────────────────────┐
                                │        API Gateway / LB      │
                                └─────────────┬────────────────┘
                                              │
                                              ▼
           ┌──────────────────────────────────────────────────────────────┐
           │                         Backend API (FastAPI)                │
           │  - Auth validation    - Cases API    - Template API          │
           │  - Files endpoints    - RAG endpoints - Proposal endpoints    │
           └────────────┬────────────────┬───────────────────┬───────────┘
                        │                │                   │
            enqueue job │                │                   │ synchronous
                        ▼                ▼                   ▼
                ┌──────────────┐   ┌──────────────┐    ┌──────────────┐
                │ Worker Queue │   │ LangChain/   │    │  File/Storage│
                │ Celery/RQ    │   │ LangGraph    │    │  Firebase S3 │
                └──────┬───────┘   └─────┬────────┘    └──────┬───────┘
                       │                  │                     │
           background  │                  │ embedding/LLM calls  │
                       ▼                  ▼                     ▼
   ┌────────────────────────┐       ┌─────────────┐       ┌────────────┐
   │  Ingest/Parser Worker  │       │  LLM Layer  │       │  Vector DB │
   │  - pdfplumber/ocr      │       │  DeepSeek   │       │  Qdrant    │
   └───────┬────────────────┘       └─────┬───────┘       └───┬────────┘
           │                             │                   │
           ▼                             ▼                   ▼
   ┌─────────────────────────┐   ┌──────────────────┐   ┌──────────────┐
   │ Firestore (flat meta)   │   │ PostgreSQL       │   │  Monitoring  │
   │ - users, cases, docs... │   │ - proposal_parsed│   │  Prom/Graf   │
   └─────────────────────────┘   └──────────────────┘   └──────────────┘
```


