import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';

const tutorialData = {
  id: 1,
  title: "如何快速建立保險知識庫",
  description: "學習如何上傳保險相關文件，建立專業的知識庫系統",
  content: `
# 如何快速建立保險知識庫

建立一個完善的保險知識庫是使用保險助手的第一步，也是最重要的一步。本文將指導您如何快速建立您的專屬保險知識庫。

## 為什麼需要建立知識庫？

保險知識庫可以幫助您：
- 集中管理所有保險相關文件
- 快速查找特定保險條款
- 為對話功能提供專業背景知識
- 自動生成專業文檔

## 步驟一：準備上傳文件

在開始之前，請準備好以下類型的文件：

### 支持的文件格式
- **PDF 文件** - 保險條款、保單說明書
- **Word 文檔** - 保險計劃說明、產品介紹
- **Excel 表格** - 保費計算表、產品對比
- **文本文件** - 常見問題、操作指南

### 文件準備建議
1. **文件命名規範**：使用清晰的文件名稱，如"人壽保險條款-2024.pdf"
2. **文件大小限制**：單個文件不超過 10MB
3. **內容質量**：確保文件內容清晰可讀

## 步驟二：創建知識庫

### 1. 進入知識庫頁面
點擊導航欄中的"知識庫"或從首頁的快速動作區域點擊"創建知識庫"。

### 2. 填寫基本信息
- **知識庫名稱**：為您的知識庫取一個有意義的名稱
- **描述**：簡要描述知識庫的用途和內容
- **分類**：選擇合適的分類（可選）

### 3. 上傳文件
- 點擊"選擇文件"按鈕
- 選擇要上傳的文件
- 支持批量上傳多個文件
- 上傳過程中可以查看進度

## 步驟三：管理知識庫

### 文件管理功能
- **預覽文件**：在線查看文件內容
- **重新上傳**：替換現有文件
- **刪除文件**：移除不需要的文件
- **下載文件**：下載原始文件

### 知識庫設置
- **編輯信息**：修改知識庫名稱和描述
- **權限管理**：設置訪問權限（如果支持）
- **備份功能**：定期備份重要知識庫

## 最佳實踐

### 1. 分類整理
建議將文件按類型分類：
- 保險條款類
- 產品介紹類
- 操作指南類
- 常見問題類

### 2. 定期更新
- 每月檢查一次知識庫內容
- 及時更新過時的文件
- 添加新的保險產品信息

### 3. 質量控制
- 確保文件內容準確無誤
- 檢查文件格式是否正確
- 驗證文件內容完整性

## 常見問題

### Q: 上傳文件失敗怎麼辦？
A: 請檢查文件大小是否超過限制，或嘗試重新上傳。

### Q: 可以上傳多少個文件？
A: 目前沒有限制文件數量，但建議根據實際需要上傳。

### Q: 上傳的文件安全嗎？
A: 所有文件都會進行安全檢查，確保沒有惡意內容。

## 下一步

成功建立知識庫後，您可以：
- 開始使用對話功能獲取保險建議
- 基於知識庫內容生成專業文檔
- 分享知識庫給團隊成員（如果支持）

---

希望這篇指南能幫助您快速建立保險知識庫。如有任何問題，請隨時聯繫我們的客服團隊。
`,
  category: "入門指南",
  readTime: "5 分鐘",
  createdAt: "2024-01-15",
  author: "保險助手團隊",
  tags: ["知識庫", "入門", "文件上傳", "保險"],
  featured: true
};

export default function TutorialDetail() {
  const { id } = useParams();
  const tutorial = tutorialData;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 返回按鈕 */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="pl-0">
          <Link to="/tutorials" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回教學文檔
          </Link>
        </Button>
      </div>

      {/* 文章標題區域 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          {tutorial.featured && <Badge className="bg-blue-600">精選</Badge>}
          <Badge variant="outline">{tutorial.category}</Badge>
        </div>

        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          {tutorial.title}
        </h1>

        <p className="text-xl text-slate-600 mb-6">
          {tutorial.description}
        </p>

        {/* 文章元信息 */}
        <div className="flex items-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{tutorial.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{tutorial.createdAt}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{tutorial.readTime}</span>
          </div>
        </div>
      </div>

      {/* 標籤 */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tutorial.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>

      {/* 文章內容 */}
      <Card>
        <CardContent className="p-8">
          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: tutorial.content.replace(/\n/g, '<br>') }}
          />
        </CardContent>
      </Card>

      {/* 相關文章推薦 */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">推薦閱讀</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                <Link to="/tutorials/2" className="hover:text-blue-600">
                  高效使用保險助手對話功能
                </Link>
              </CardTitle>
              <CardDescription>
                掌握對話技巧，獲得最精準的保險建議
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                <Link to="/tutorials/3" className="hover:text-blue-600">
                  從對話生成專業文檔指南
                </Link>
              </CardTitle>
              <CardDescription>
                學習如何將對話內容轉換為專業的保險文檔
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* 行動呼籲 */}
      <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            準備好開始了嗎？
          </h3>
          <p className="text-slate-600 mb-4">
            立即創建您的第一個知識庫，體驗保險助手的強大功能
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild>
              <Link to="/knowledge-base/new">創建知識庫</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/tutorials">查看更多教學</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}