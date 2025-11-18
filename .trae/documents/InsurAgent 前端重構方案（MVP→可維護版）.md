## 改造目標

* 提升可維護性與可讀性，降低頁面/元件複雜度
* 建立一致的 UI/樣式與目錄規範，清除死碼與錯誤用法
* 強化 API 封裝與錯誤處理，完善本地開發聯調能力
* 引入基本測試與型別約束，確保最小可行的質量保障

## 現狀與問題摘要

* 巨型頁面：`src/pages/IntelligentCreation/DocumentCreator.tsx`（\~372 行）、`src/pages/Home/index.tsx`（\~334 行）結構臃腫、耦合高
* 未使用導入：`src/components/Layout.tsx:1-3`（`NavLink`/`cn`）、`src/pages/IntelligentCreation/DocumentCreator.tsx:33`（`remark-parse`）
* Tailwind 插件錯用：`src/index.css:4` 使用 `@plugin`，應移至 `tailwind.config.js` 的 `plugins`
* Tailwind 重複定義：`tailwind.config.js:61-99` 動畫/關鍵幀重複條目需清理
* 死碼：`src/App.css` 未被引用
* API 類型與錯誤薄弱：`src/config/api.ts:13-53` 使用 `any`，錯誤僅 `throw Error`，無統一結構/超時/中止
* 本地聯調跨域：`vite.config.ts:12-15` 未設置 `server.proxy`，依賴 `VITE_API_BASE_URL`
* 測試缺失：項目無自有 `*.test.*` 覆蓋
* 設計一致性：`DESIGN_ISSUES.md` 指出色彩/變體/間距/導入路徑不一致

## 重構原則

* 小步快跑、可回滾：每一項改動獨立、可測，可在 Git 中逐步提交
* 明確邊界：UI 組件（無業務）、複合組件（頁面子區塊）、業務 hooks（副作用）分層
* 類型優先：以 TypeScript 型別驅動 API 與資料流
* 一致優於完美：優先統一規範與目錄結構

## 具體改造項

### 1. 頁面拆分與邏輯下沉

* `DocumentCreator` 拆為三個子組件（目錄 `src/pages/IntelligentCreation/components/`）：
  * `ChatStream.tsx`（消息列表與滾動）：承載 `messages`、`Loader`、`MessageItem`
  * `ControlPanel.tsx`（文本輸入/格式選擇/操作按鈕）：承載 `userText`/`downloadFormat`/操作 callback
  * `FileManagerDialog.tsx`（文件上傳/管理）：承載 `templateFiles`/`dataFiles`
* 將 API 調用與副作用抽到 `src/hooks/useIntelligentCreation.ts`：
  * `generate(payload, signal)` 支援 `AbortController`、超時、錯誤歸一化
  * 以 `IntelligentCreationPayload`/`IntelligentCreationResponse` 型別約束
* `Home` 拆分骨架/空狀態/卡片為小組件，保留頁面組裝職責

### 2. API 封裝與錯誤處理

* 新增 `src/lib/http.ts` 基礎封裝：
  * `request<T>(url, init)`：JSON 解析、錯誤歸一化（`{ code, message }`）、超時、取消支持
  * 統一返回 `Result<T, ApiError>` 風格，頁面僅感知成功/失敗
* `src/config/api.ts`：
  * 定義 `IntelligentCreationPayload`/`...Response` 型別（移除 `any`）
  * 使用上層 `request`，移除散落的 `console.log`
  * 錯誤透過 `useApp()`/Toast 呈現（保留最小全局錯誤上下文）

### 3. 本地聯調與環境配置

* `vite.config.ts` 增加 `server.proxy`：
  * 將 `'/api'` 代理到 `VITE_API_BASE_URL`，避免跨域
  * `endpoints` 調整為 `'/api/...'` 前綴，消除硬編碼基址
* `.env.example` 明確 `VITE_API_BASE_URL` 並補充註解

### 4. UI/樣式一致性與目錄整合

* 移除 CSS 中插件：刪除 `src/index.css:4` 的 `@plugin`，以 `tailwind.config.js` 的 `plugins` 為準
* 清理 Tailwind 重複鍵：移除 `tailwind.config.js:61-99` 重複 `accordion-*` 條目
* 目錄統一：將 `src/components/general/ui/*` 與 `src/components/ui/*` 合併為 `src/components/ui/*`
  * 以 shadcn 風格為基線，保留自定義變體（`success`/`warning`）並在 `DESIGN_SYSTEM.md` 標準化
* 文案與色彩：按 `DESIGN_ISSUES.md` 將硬編碼顏色替換為語義色（`text-foreground`/`text-muted-foreground` 等）

### 5. 清理與微調

* 刪除未用文件：`src/App.css`
* 移除未用導入：
  * `src/components/Layout.tsx:1-3` 移除 `NavLink`、`cn`
  * `src/pages/IntelligentCreation/DocumentCreator.tsx:33` 移除 `remark-parse`
* 調整 `package.json` 構建腳本：
  * 將 `build` 改為 `"tsc --noEmit && vite build"` 或補上 `tsconfig.json` 的 `references` 以匹配 `tsc -b`

### 6. 型別與資料流

* 為 `mocks`、頁面 props、組件回調補齊基本型別，移除 `any`
* 在路由頁面使用明確的本地 state 與 props 介面，減少隱式資料耦合

### 7. 基礎測試與質量保障

* 引入 `vitest` + `@testing-library/react`（開發依賴）：
  * 測試 `lib/utils.ts` 的 `cn`
  * 測試 `http.request` 錯誤歸一化
  * 煙霧測試 `DocumentCreator` 拆分後的子組件（渲染/基本交互）
* 新增 `lint` 檢查：未使用導入、未使用變數、顯式 `any` 風險

## 交付產出

* 重構後目錄：`components/ui`、`hooks`、`lib` 清晰分層
* 拆分後的 `DocumentCreator` 與 `Home` 子組件
* 統一 API 封裝與型別、錯誤處理
* 修正的 Tailwind 與樣式用法，一致的 UI 變體
* 本地代理與 `.env` 配置，確保開發/測試可用
* 最小測試覆蓋與改良的構建腳本

## 風險與回滾

* 風險：路由/導入路徑調整導致相對引用失效
* 緩解：保留原介面，分步遷移；每步附帶煙霧測試與預覽驗證
* 回滾：每子任務獨立提交，可單獨 revert

## 時程與批次

* 批次 1（UI/樣式/清理，\~0.5 天）：移除未用導入與文件、修正 Tailwind 插件與重複鍵、統一色彩
* 批次 2（頁面拆分與 hooks，\~1 天）：`DocumentCreator`/`Home` 拆分、抽離 API 至 hooks
* 批次 3（API/代理/型別，\~0.5 天）：封裝 `http`、補齊型別、配置 `server.proxy`
* 批次 4（測試與腳本，\~0.5 天）：接入 Vitest/RTL、完善 `build` 腳本

## 驗收標準

* `npm run dev` 無跨域問題；路由與功能正常
* `npm run build` 成功；`lint` 零重大問題（未使用導入清理）
* 重要頁面複雜度下降（單檔 < 200 行），副作用集中於 hooks
* API 返回與錯誤以一致結構處理；最小測試綠燈


