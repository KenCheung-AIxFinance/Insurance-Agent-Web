import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/general/ui/card";
import { Button } from "@/components/general/ui/button";
import { Loader } from "@/components/general/ui/loader";
import { Textarea } from "@/components/general/ui/textarea";
import { Input } from "@/components/general/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUpload } from "@/components/general/ui/file-upload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { api } from "@/config/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AiMessageDisplay from "@/components/ai/AiMessageDisplay";
import remarkParse from "remark-parse";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaRegCopy, FaCheck, FaDownload, FaEye } from "react-icons/fa";
import MessageItem from "@/components/ai/MessageItem";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

export default function DocumentCreator() {
  const [templateFiles, setTemplateFiles] = useState<File[]>([]);
  const [dataFiles, setDataFiles] = useState<File[]>([]);
  const [userText, setUserText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: `# 智能創作助手\n\n歡迎使用智能創作功能！您可以：\n\n1. **上傳模板文件** - 支持多文件選擇和拖放\n2. **上傳數據文件** - 提供數據源文件\n3. **輸入創作需求** - 描述您想要生成的文檔內容\n4. **選擇輸出格式** - HTML、PDF、DOCX、PPTX\n\n請開始您的創作之旅！`,
    },
  ]);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<
    "pptx" | "pdf" | "docx" | "html"
  >("html");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false); // 控制文件管理彈窗的開關

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTemplateFilesSelected = (files: File[]) => {
    setTemplateFiles(files);
  };

  const handleDataFilesSelected = (files: File[]) => {
    setDataFiles(files);
  };

  const handleUserTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserText(e.target.value);
  };

  const handleGenerateDocument = async () => {
    if (
      userText.trim() === "" &&
      templateFiles.length === 0 &&
      dataFiles.length === 0
    ) {
      setError("請至少提供文字描述、模板文件或數據文件");
      return;
    }

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: `**創作需求：** ${userText}\n**模板文件：** ${templateFiles.length} 個\n**數據文件：** ${dataFiles.length} 個`,
      sender: "user",
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setGenerating(true);
    setLoading(true);
    setError(null);

    console.log("Sending template files:", templateFiles);
    console.log("Sending data files:", dataFiles);

    try {
      // 顯示生成狀態
      const aiResponseText = `正在為您生成文檔...\n\n**創作需求：** ${userText}\n**模板文件：** ${
        templateFiles.length
      } 個\n**數據文件：** ${
        dataFiles.length
      } 個\n**輸出格式：** ${downloadFormat.toUpperCase()}`;
      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: "ai",
      };
      setMessages((prevMessages) => [...prevMessages, newAiMessage]);

      // 調用真實API
      const response = await api.generateIntelligentCreation({
        templateFiles,
        dataFiles,
        userText,
        downloadFormat,
      });

      // 處理API響應
      console.log("API Response:", response);
      if (response && response.success) {
        const generatedDocument =
          response.document ||
          response.html ||
          `
<!DOCTYPE html>
<html>
<head>
    <title>智能創作文檔</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { background: #f0f8ff; padding: 20px; border-radius: 8px; }
        .content { margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>智能創作文檔</h1>
        <p>基於您的需求生成：${userText}</p>
        <p>生成時間：${new Date().toLocaleString()}</p>
    </div>
    <div class="content">
        <h2>文檔內容</h2>
        <p>這是一個基於您提供的模板和數據生成的HTML文檔。</p>
        <ul>
            <li>模板文件數量：${templateFiles.length}</li>
            <li>數據文件數量：${dataFiles.length}</li>
            <li>用戶輸入：${userText}</li>
        </ul>
    </div>
</body>
</html>`;

        setGeneratedDocument(generatedDocument);
        const blobUrl = URL.createObjectURL(
          new Blob([generatedDocument], { type: "text/html" })
        );
        setPreviewUrl(blobUrl);
        console.log(blobUrl);

        const successMessage: Message = {
          id: (Date.now() + 2).toString(),
          // text: `✅ 文檔生成成功！\n\n**生成結果：**\n- 格式：${downloadFormat.toUpperCase()}\n- 大小：約 ${generatedDocument.length} 字符\n- 狀態：已完成\n\n您現在可以預覽或下載生成的文檔。`,
          text: response.message,
          sender: "ai",
        };
        setMessages((prevMessages) => [...prevMessages, successMessage]);
      } else {
        throw new Error(response.message || "API返回未知錯誤");
      }
    } catch (err: any) {
      console.error("生成文檔時發生錯誤:", err);

      // 顯示錯誤消息
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: `❌ 文檔生成失敗！\n\n**錯誤信息：**\n${
          err instanceof Error ? err.message : "未知錯誤"
        }\n\n請檢查您的輸入並重試。`,
        sender: "ai",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);

      setError("生成文檔失敗，請稍後重試");
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedDocument) {
      const blob = new Blob([generatedDocument], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `智能創作-${new Date()
        .toISOString()
        .replace(/[:.-]/g, "")}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* 聊天消息區域 */}
      <div className="flex-1 overflow-y-auto bg-gray-50 px-40 pb-4 pt-16">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
        {loading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
              <Loader label="AI 正在生成文檔中..." />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 創作控制面板 - 固定在底部 */}
      <div className="border-t p-4 bg-white mt-auto">
        {/* 文本輸入區域 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            創作需求描述
          </label>
          <Textarea
            placeholder="請詳細描述您想要生成的文檔內容、格式要求和特殊需求..."
            value={userText}
            onChange={handleUserTextChange}
            className="w-full min-h-[80px]"
          />
        </div>

        {/* 控制按鈕和選項 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">輸出格式：</span>
              <Select
                onValueChange={(v) =>
                  setDownloadFormat(v as typeof downloadFormat)
                }
                defaultValue={downloadFormat}
              >
                <SelectTrigger className="w-[100px] h-8">
                  <SelectValue placeholder="選擇格式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="docx">DOCX</SelectItem>
                  <SelectItem value="pptx">PPTX</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Dialog
              open={isFileManagerOpen}
              onOpenChange={setIsFileManagerOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  管理文件 ({templateFiles.length + dataFiles.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>文件管理</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      模板文件上傳
                    </label>
                    <FileUpload
                      onFilesSelected={handleTemplateFilesSelected}
                      maxFiles={5}
                      maxSize={10 * 1024 * 1024}
                      accept=".docx,.pdf,.pptx,.txt,.html"
                      selectedFiles={templateFiles}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      數據文件上傳
                    </label>
                    <FileUpload
                      onFilesSelected={handleDataFilesSelected}
                      maxFiles={10}
                      maxSize={10 * 1024 * 1024}
                      accept=".csv,.xlsx,.json,.txt,.pdf"
                      selectedFiles={dataFiles}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      關閉
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex items-center space-x-2">
            {previewUrl && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(previewUrl, "_blank")}
                  className="flex items-center space-x-1"
                >
                  <FaEye size={14} />
                  <span>預覽</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="flex items-center space-x-1"
                >
                  <FaDownload size={14} />
                  <span>下載</span>
                </Button>
              </>
            )}

            <Button
              onClick={handleGenerateDocument}
              disabled={
                generating ||
                (userText.trim() === "" &&
                  templateFiles.length === 0 &&
                  dataFiles.length === 0)
              }
              className="px-6"
            >
              {generating ? "生成中..." : "生成文檔"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-2">錯誤：{error}</div>
        )}
      </div>
    </div>
  );
}
