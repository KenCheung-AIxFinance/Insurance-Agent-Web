# 智能創作功能後端API規範

## 概述
本文檔定義了智能創作功能的後端API接口規範，讓後端工程師可以獨立開發兼容的系統，無需了解前端代碼細節。

## API端點

### POST /api/intelligent-creation

**功能描述**：處理智能創作請求，根據用戶提供的模板文件、數據文件和文本輸入生成文檔。

#### 請求格式
```typescript
interface IntelligentCreationRequest {
  templateFiles: File[];      // 模板文件（可選）
  dataFiles: File[];          // 數據文件（可選）
  userText: string;           // 用戶輸入的文本（可選）
  downloadFormat: string;     // 下載格式：'html' | 'pdf' | 'docx'
}
```

**請求特性**：
- 使用 `multipart/form-data` 格式
- 支持多文件上傳
- 文件大小限制：單個文件最大50MB
- 文件數量限制：每類文件最多10個

**FormData字段**：
- `templateFiles[]`：模板文件（可選，多文件）
- `dataFiles[]`：數據文件（可選，多文件）
- `userText`：用戶輸入文本（字符串）
- `downloadFormat`：下載格式（字符串）

#### 響應格式

**成功響應 (200)**：
```typescript
interface IntelligentCreationResponse {
  success: true;
  document: {
    content: string;          // 生成的文檔內容（HTML格式）
    previewUrl?: string;      // 預覽URL（可選）
    downloadUrl?: string;     // 下載URL（可選）
    filename: string;         // 生成的文件名
  };
  message?: string;           // 成功消息（可選）
}
```

**錯誤響應 (4xx/5xx)**：
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;             // 錯誤代碼
    message: string;          // 錯誤描述
    details?: any;            // 詳細錯誤信息（可選）
  };
}
```

#### 錯誤代碼定義

| 錯誤代碼 | HTTP狀態碼 | 描述 |
|---------|------------|------|
| `VALIDATION_ERROR` | 400 | 請求參數驗證失敗 |
| `FILE_TOO_LARGE` | 400 | 文件大小超過限制 |
| `TOO_MANY_FILES` | 400 | 文件數量超過限制 |
| `UNSUPPORTED_FORMAT` | 400 | 不支持的文件格式 |
| `PROCESSING_ERROR` | 500 | 文檔處理過程中發生錯誤 |
| `GENERATION_FAILED` | 500 | 文檔生成失敗 |

## 文件處理規範

### 文件類型支持
- **模板文件**：支持 .docx, .pdf, .html, .txt 等格式
- **數據文件**：支持 .csv, .json, .xlsx, .txt 等格式

### 文件驗證要求
1. 單個文件大小不超過50MB
2. 每類文件總數不超過10個
3. 支持的文件格式需在校驗時檢查

## 文檔生成邏輯

### 輸入處理流程
1. **文件解析**：解析上傳的模板文件和數據文件
2. **文本處理**：處理用戶輸入的文本內容
3. **數據融合**：將模板、數據和用戶文本進行智能融合
4. **格式轉換**：根據請求的格式生成最終文檔

### 輸出要求
- **HTML格式**：返回完整的HTML文檔內容
- **預覽功能**：提供可訪問的預覽URL
- **下載功能**：提供文件下載URL

## 性能要求

- **響應時間**：文檔生成應在30秒內完成
- **並發處理**：支持多用戶同時使用
- **錯誤恢復**：處理過程中的異常應有適當的錯誤處理和恢復機制

## 測試用例

### 成功場景
1. **僅文本輸入**：用戶只輸入文本，無文件上傳
2. **僅模板文件**：用戶只上傳模板文件
3. **僅數據文件**：用戶只上傳數據文件
4. **混合輸入**：用戶同時提供文本、模板和數據文件

### 錯誤場景
1. **文件過大**：上傳超過50MB的文件
2. **文件過多**：上傳超過10個文件
3. **格式不支持**：上傳不支持的文件格式
4. **服務器錯誤**：處理過程中發生內部錯誤

## 部署要求

- **API版本**：保持向後兼容
- **文檔存儲**：生成的文檔應有適當的存儲和清理機制
- **日誌記錄**：記錄關鍵操作和錯誤信息

## 更新記錄

| 版本 | 日期 | 描述 |
|------|------|------|
| 1.0 | 2024-01-01 | 初始版本 |

---

**注意**：本文檔應與前端開發團隊同步更新，確保接口規範的一致性。