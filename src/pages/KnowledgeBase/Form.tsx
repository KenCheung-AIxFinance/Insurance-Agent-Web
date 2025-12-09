import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function KnowledgeBaseForm() {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim() || !file) {
      alert('請填寫文件名稱並上傳文件');
      return;
    }
    // 這裡應該是上傳文件到後端的邏輯
    console.log('上傳文件:', fileName, file, description);
    alert('文件上傳成功！');
    navigate('/knowledge-base');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>上傳知識庫文件</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fileName">文件名稱</Label>
            <Input id="fileName" value={fileName} onChange={e => setFileName(e.target.value)} placeholder="輸入文件名稱" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">選擇文件 (PDF)</Label>
            <Input id="file" type="file" accept=".pdf" onChange={handleFileChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">描述 (選填)</Label>
            <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="輸入文件描述" rows={4} />
          </div>
          <Button type="submit">上傳</Button>
        </form>
      </CardContent>
    </Card>
  );
}