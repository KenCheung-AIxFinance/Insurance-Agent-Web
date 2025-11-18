# **API Specification（最新版）**

> 完整 REST + Streaming + Admin API

# **1. Authentication API**

### **1.1 Sign Up**

```
POST /auth/signup
```

**Request**

```json
{
  "email": "user@example.com",
  "password": "12345678",
  "displayName": "John"
}
```

**Response**

```json
{
  "userId": "USER_ID",
  "email": "user@example.com",
  "displayName": "John",
  "createdAt": 1722222222
}
```

### **1.2 Login**

```
POST /auth/login
```

**Request**

```json
{
  "email": "user@example.com",
  "password": "12345678"
}
```

**Response**

```json
{
  "userId": "USER_ID",
  "accessToken": "FIREBASE_ID_TOKEN"
}
```

### **1.3 Refresh Token**

```
POST /auth/refresh
```

**Request**

```json
{
  "refreshToken": "REFRESH_TOKEN"
}
```

**Response**

```json
{
  "accessToken": "NEW_ID_TOKEN"
}
```

# **2. Project / Document Management API**

### **2.1 Create Project**

```
POST /projects
```

**Request**

```json
{
  "name": "Math Homework Set 1",
  "description": "Algebra tasks",
  "ownerId": "USER_ID"
}
```

**Response**

```json
{
  "projectId": "proj_123",
  "createdAt": 1722222222
}
```

### **2.2 Get Project List**

```
GET /projects?ownerId=USER_ID
```

**Response**

```json
[
  {
    "projectId": "proj_123",
    "name": "Math Homework Set 1",
    "description": "Algebra tasks"
  }
]
```

### **2.3 Create Document (JSON dataset)**

```
POST /documents
```

**Request**

```json
{
  "projectId": "proj_123",
  "title": "Question Bank – Algebra",
  "contentType": "problemSet",
  "content": {
    "samples": []
  }
}
```

**Response**

```json
{
  "documentId": "doc_456",
  "createdAt": 1722222222
}
```

### **2.4 Upload Dataset File (.json / .txt)**

```
POST /documents/upload
```

**Multipart Form**

```
file=<FILE>
projectId=proj_123
```

**Response**

```json
{
  "documentId": "doc_789",
  "status": "uploaded"
}
```

# **3. Sample Editing API (Math Dataset Annotation)**

### **3.1 Create Sample**

```
POST /samples
```

**Request**

```json
{
  "documentId": "doc_456",
  "question": "Solve 2x + 3 = 11",
  "final_answer": "x = 4",
  "steps": [],
  "critique": {}
}
```

**Response**

```json
{
  "sampleId": "sample_123"
}
```

### **3.2 Update Sample**

```
PATCH /samples/:sampleId
```

**Request**

```json
{
  "steps": [
    "2x + 3 = 11",
    "2x = 8",
    "x = 4"
  ],
  "critique": {
    "isCorrect": true,
    "errors": []
  }
}
```

### **3.3 Real-time Streaming Analysis from Agent**

```
POST /samples/:sampleId/agent/analyze
```

**Optional SSE/WS Streaming**

```
GET /samples/:sampleId/agent/analyze/stream
```

**Request**

```json
{
  "question": "2x + 3 = 11",
  "final_answer": "x = 4"
}
```

**Response**

```json
{
  "steps": [...],
  "critique": {...}
}
```

# **4. Task / LLM Processing API**

### **4.1 Evaluate Math Steps (LangGraph Agent)**

```
POST /agent/evaluate
```

**Request**

```json
{
  "sampleId": "sample_123",
  "question": "Solve 2x + 3 = 11",
  "final_answer": "x = 4"
}
```

### **4.2 Generate Correct Steps**

```
POST /agent/generateSteps
```

### **4.3 Identify Error Type**

```
POST /agent/errorType
```

# **5. Admin API**

### **5.1 List All Users**

```
GET /admin/users
```

### **5.2 Global Stats**

```
GET /admin/stats
```

### **5.3 Rebuild Vector Index**

```
POST /admin/rag/rebuildIndex
```

# 🗄️ **Firestore Schema（扁平化版本，避免深層路徑）**

> 已完全依據你提出的：
> **扁平化、方便遷移 SQL、查詢效率高、避免深層結構**

# **集合結構（所有集合都是 root-level）**

## **1. users**

```
users (collection)
  └─ userId
       email
       displayName
       createdAt
       lastLoginAt
```

## **2. projects**

```
projects
  └─ projectId
       ownerId
       name
       description
       createdAt
```

## **3. documents**

> 每個文件（e.g. JSON dataset）獨立存放
> 不做深層 `projects/{id}/documents/{id}`
> 而是用 `projectId` 作 filter

```
documents
  └─ documentId
       projectId
       title
       contentType      // problemSet / essay / notes / custom
       createdAt
       updatedAt
```

## **4. samples**

> 每個 sample 都是獨立 document
> 不放在 document 下方，而是扁平化。

```
samples
  └─ sampleId
       documentId
       question
       final_answer
       steps            // array<string>
       critique         // object: isCorrect, errors[], explanation...
       metadata         // source page, difficulty, tags etc.
       createdAt
       updatedAt
```

## **5. agent_runs**

> 儲存 LangGraph Agent 的操作記錄
> 用於 debugging + 追蹤 LLM 行為

```
agent_runs
  └─ runId
       sampleId
       userId
       agentName        // "math-evaluator"