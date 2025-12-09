# Cloudflare R2 Storage Service Specification

**版本**: v1.0
**狀態**: 草稿
**目標**: 為後端開發一套基於 Cloudflare R2 的通用存儲服務 (Storage Service)，供各個 Endpoint 調用，以處理用戶上傳文檔及系統生成的報告文件。

---

## 1. 核心目標
建立一個統一的 `StorageService` 模組，封裝與 Cloudflare R2 的交互邏輯。主要功能包括：
1. **簽名 URL 生成 (Presigned URLs)**: 允許前端直接上傳/下載受保護文件，減輕後端頻寬壓力。
2. **後端直接操作**: 支持後端生成的 PDF/Excel 報告直接上傳至 R2。
3. **文件管理**: 支持文件的刪除、元數據查詢。
4. **訪問控制**: 區分公開資源 (Public) 與私有資源 (Private) 的處理策略。

---

## 2. 技術棧與配置
Cloudflare R2 兼容 AWS S3 API，建議使用 AWS SDK for JavaScript v3。

### 推薦依賴 (Node.js)
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 環境變數 (Environment Variables)
服務需讀取以下配置：
```env
# Cloudflare R2 Configuration
R2_ACCOUNT_ID="<YOUR_ACCOUNT_ID>"
R2_ACCESS_KEY_ID="<YOUR_ACCESS_KEY_ID>"
R2_SECRET_ACCESS_KEY="<YOUR_SECRET_ACCESS_KEY>"
R2_BUCKET_NAME="insuragent-storage-v1"
R2_PUBLIC_DOMAIN="https://assets.yourdomain.com" # 若有綁定自定義域名
```

---

## 3. 儲存結構規劃 (Directory Structure)
為確保文件有序且安全，建議採用以下目錄結構策略：

| 路徑模式 | 存取級別 | 用途描述 | 範例 |
| :--- | :--- | :--- | :--- |
| `public/assets/` | **Public** | 系統通用資源、預設圖片 | `public/assets/logos/app-icon.png` |
| `public/avatars/` | **Public** | 用戶頭像 (若無需隱私保護) | `public/avatars/user_123.jpg` |
| `projects/{projectId}/kyc/` | **Private** | 項目相關的 KYC 敏感已上傳文件 | `projects/p_xyz/kyc/id_card.pdf` |
| `projects/{projectId}/reports/` | **Private** | 系統生成的 PDF/Excel 報告 | `projects/p_xyz/reports/assessment.pdf` |
| `temp/uploads/` | **Private** | 臨時上傳區 (可配合 Lifecycle Policy 自動刪除) | `temp/uploads/raw_scan.jpg` |

---

## 4. 服務接口定義 (Service Interface Definition)
後端應實現一個 `StorageService` 類，提供以下標準方法。

### 4.1. 獲取上傳簽名 URL (Presigned PUT)
前端上傳文件時，不經過後端 Server，而是向後端請求一個「上傳憑證 URL」，然後前端直接 `PUT` 到該 URL。

**Interface Signature:**
```typescript
/**
 * 生成用於前端直接上傳的預簽名 URL
 * @param key 文件存儲路徑 (ex: "projects/123/kyc/doc.pdf")
 * @param contentType 文件類型 (ex: "application/pdf")
 * @param expiresIn 有效期秒數 (default: 3600)
 */
async generateUploadUrl(key: string, contentType: string, expiresIn: number = 3600): Promise<{ url: string; key: string }>
```

### 4.2. 獲取下載/預覽簽名 URL (Presigned GET)
對於私有文件 (Private)，前端無法直接通過 URL 訪問，需要後端生成帶有 Token 的 URL。

**Interface Signature:**
```typescript
/**
 * 生成用於訪問私有文件的臨時 URL
 * @param key 文件存儲路徑
 * @param expiresIn 有效期秒數 (default: 3600)
 */
async generateDownloadUrl(key: string, expiresIn: number = 3600): Promise<string>
```

### 4.3. 後端直接上傳文件 (Server-side Upload)
用於系統生成的報告 (PDF/Excel) 或處理後的圖片。

**Interface Signature:**
```typescript
/**
 * 上傳文件 Buffer 或 Stream 到 R2
 * @param fileContent Buffer 或 Stream
 * @param key 目標路徑
 * @param contentType MIME type
 */
async uploadFile(fileContent: Buffer | Readable, key: string, contentType: string): Promise<string>
```

### 4.4. 刪除文件
**Interface Signature:**
```typescript
async deleteFile(key: string): Promise<void>
```

---

## 5. 業務流程整合範例

### 場景 A: 用戶上傳 KYC 文件 (前端直傳)
1. **Frontend**: 用戶選擇文件 `passport.jpg`。
2. **Frontend -> Backend**: 請求 API `POST /api/storage/presigned-url`，帶上文件名和類型。
3. **Backend**:
   - 驗證用戶權限。
   - 決定文件存放路徑 `projects/{id}/kyc/{uuid}.jpg`。
   - 調用 `StorageService.generateUploadUrl(...)`。
   - 返回 `{ url: "https://r2...", key: "..." }`。
4. **Frontend**: 使用返回的 URL 執行 `PUT` 請求上傳文件二進制內容。
5. **Frontend -> Backend**: 上傳成功後，調用業務 API `POST /api/kyc/record`，將 `key` 存入數據庫。

### 場景 B: 系統生成 PDF 報告
1. **Backend**: 根據業務數據生成 PDF Buffer。
2. **Backend**: 定義路徑 `projects/{id}/reports/summary.pdf`。
3. **Backend**: 調用 `StorageService.uploadFile(pdfBuffer, path, ...)`。
4. **Backend**: 將文件路徑 (Key) 寫入 `reports` 資料表。

### 場景 C: 在前端顯示私有圖片
1. **Backend API**: 在返回項目詳情 JSON 時，檢測到字段含有 `file_key`。
2. **Backend**: 遍歷數據，對私有文件的 Key 調用 `StorageService.generateDownloadUrl(key)`。
3. **Backend**: 將轉換後的完整簽名 URL 返回給前端。
4. **Frontend**: 直接使用該 URL 於 `<img src="...">` 或 `<a>`。

---

## 6. 安全性與權限 (Security)
1. **Bucket 權限**: R2 Bucket 應設置為**私有 (Private)**，除非明確配置了公開訪問的 Custom Domain。
2. **CORS 配置**: 必須在 R2 Bucket 設置 CORS 規則，允許前端域名進行 `PUT` 和 `GET` 請求。
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "HEAD"],
       "AllowedOrigins": ["http://localhost:5173", "https://your-production-app.com"],
       "ExposeHeaders": ["ETag"]
     }
   ]
   ```
3. **文件名安全**: 後端生成 Key 時，應用 UUID 重命名文件，避免與用戶原始文件名衝突或包含非法字符。

---

## 7. 錯誤處理標準
- **上傳失敗**: 應捕獲 AWS SDK 錯誤，並轉換為內部標準錯誤 `StorageUploadError`。
- **文件不存在**: 獲取 Metadata 或下載連結時若文件不存在，應返回 `null` 或特定錯誤碼。
