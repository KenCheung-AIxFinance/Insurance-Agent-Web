import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/general/ui/card";
import { Button } from "@/components/general/ui/button";


export default function KnowledgeBaseDetail() {
  const { id } = useParams();
  const file = null; // 計劃書功能已移除

  if (!file) {
    return (
      <div className="text-center py-8 text-slate-500">
        找不到該知識庫文件。
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{file.title}</CardTitle>
        <CardDescription>{file.summary}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-slate-700">
          <p>
            <strong>文件 ID:</strong> {file.id}
          </p>
          <p>
            <strong>上傳日期:</strong> {file.createdAt}
          </p>
          <p>
            <strong>文件類型:</strong> PDF (演示)
          </p>
          <p>
            <strong>文件大小:</strong> 1.2 MB (演示)
          </p>
        </div>
        <Button asChild>
          <a href="#" target="_blank" rel="noopener noreferrer">
            預覽文件 (演示)
          </a>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/knowledge-base">返回知識庫列表</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
