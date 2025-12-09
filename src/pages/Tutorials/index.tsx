import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const tutorials = [
  {
    id: 1,
    title: "如何快速建立保險知識庫",
    description: "學習如何上傳保險相關文件，建立專業的知識庫系統",
    category: "入門指南",
    readTime: "5 分鐘",
    createdAt: "2024-01-15",
    author: "保險助手團隊",
    featured: true
  },
  {
    id: 2,
    title: "高效使用保險助手對話功能",
    description: "掌握對話技巧，獲得最精準的保險建議",
    category: "使用技巧",
    readTime: "8 分鐘",
    createdAt: "2024-01-10",
    author: "保險助手團隊",
    featured: false
  },
  {
    id: 3,
    title: "從對話生成專業文檔指南",
    description: "學習如何將對話內容轉換為專業的保險文檔",
    category: "進階功能",
    readTime: "10 分鐘",
    createdAt: "2024-01-05",
    author: "保險助手團隊",
    featured: false
  }
];

const categories = [
  { name: "入門指南", count: 3 },
  { name: "使用技巧", count: 2 },
  { name: "進階功能", count: 1 },
  { name: "最佳實踐", count: 0 }
];

export default function Tutorials() {
  return (
    <div className="container mx-auto px-4 py-8">
        {/* 頁面標題 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">教學文檔</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            學習如何使用保險助手的各種功能，從入門到精通
          </p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 側邊欄 - 分類 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">分類</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <span className="text-slate-700 hover:text-blue-600 cursor-pointer">
                    {category.name}
                  </span>
                  <Badge variant="secondary">{category.count}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 快速開始卡片 */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">快速開始</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link to="/knowledge-base/new">創建知識庫</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/chat">開始對話</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/intelligent-creation">智能創作</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 主要內容 - 教學文檔列表 */}
        <div className="lg:col-span-3">
          {/* 精選文章 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">精選文章</h2>
            {tutorials
              .filter(tutorial => tutorial.featured)
              .map((tutorial) => (
                <Card key={tutorial.id} className="mb-6 border-blue-200 bg-blue-50">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-blue-600">精選</Badge>
                      <Badge variant="outline">{tutorial.category}</Badge>
                    </div>
                    <CardTitle className="text-xl">
                      <Link to={`/tutorials/${tutorial.id}`} className="hover:text-blue-600">
                        {tutorial.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-base">
                      {tutorial.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <div className="flex items-center gap-4">
                        <span>{tutorial.author}</span>
                        <span>{tutorial.createdAt}</span>
                        <span>{tutorial.readTime}</span>
                      </div>
                      <Button size="sm" asChild>
                        <Link to={`/tutorials/${tutorial.id}`}>閱讀全文</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* 所有文章 */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">所有文章</h2>
            <div className="space-y-6">
              {tutorials.map((tutorial) => (
                <Card key={tutorial.id}>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{tutorial.category}</Badge>
                    </div>
                    <CardTitle className="text-lg">
                      <Link to={`/tutorials/${tutorial.id}`} className="hover:text-blue-600">
                        {tutorial.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      {tutorial.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <div className="flex items-center gap-4">
                        <span>{tutorial.author}</span>
                        <span>{tutorial.createdAt}</span>
                        <span>{tutorial.readTime}</span>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/tutorials/${tutorial.id}`}>閱讀</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}