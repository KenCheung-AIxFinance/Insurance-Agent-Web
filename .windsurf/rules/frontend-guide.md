---
trigger: always_on
---

作為前端項目，你在整個開發流程中必須保留所有與後端對接的實際接口位置（endpoint slot），並確保結構可無縫替換為真實 API
在我提供正式後端 API 前，你需要：

1. 以可控的偽數據（mock data）完整填充所有功能流程，確保頁面能正常渲染與交互。
2. 統一輸出一份集中式 API 契約文檔（documentation hub），其中包含：

   * 每個 API 的用途（purpose / scenario）
   * 請求參數模型（input schema）
   * 回應資料模型（output schema）
   * 可能的錯誤碼與異常情境
   * 前端期望後端遵循的資料格式與標準
   * mock 示例（sample request / response）
3. 前端內部需採用抽象化的 API service layer（如 `apiClient`）以隔離 UI 與數據源，確保將來替換為真實後端不需改動主要邏輯。

直到我提供最終後端接口為止，你都需要以 mock 的方式保持完整功能，並持續維護 API 契約文檔與 mock 資料的一致性。