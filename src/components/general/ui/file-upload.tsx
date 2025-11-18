import React, { useCallback, useState, useId } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Card, CardContent } from "./card";
import { Loader } from "./loader";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  description?: string;
  maxFiles?: number;
  maxSize?: number; // in MB
  selectedFiles: File[]; // Make this prop required
}

export function FileUpload({
  onFilesSelected,
  accept = "*/*",
  multiple = true,
  label = "上傳文件",
  description = "拖放文件到這裡或點擊選擇文件",
  maxFiles = 10,
  maxSize = 50, // 50MB
  selectedFiles: propSelectedFiles, // Rename to avoid conflict with state
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const uniqueId = useId();

  // 移除內部 selectedFiles 狀態，直接使用 propSelectedFiles
  // const [selectedFiles, setSelectedFiles] = useState<File[]>(propSelectedFiles);

  // 移除 useEffect，因為不再需要同步內部狀態
  // useEffect(() => {
  //   setSelectedFiles(propSelectedFiles);
  // }, [propSelectedFiles]);

  const validateFiles = (files: File[]): { valid: File[]; errors: string[] } => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    if (files.length > maxFiles) {
      errors.push(`最多只能選擇 ${maxFiles} 個文件`);
      return { valid: [], errors };
    }

    for (const file of files) {
      if (file.size > maxSize * 1024 * 1024) {
        errors.push(`文件 "${file.name}" 超過 ${maxSize}MB 大小限制`);
        continue;
      }
      validFiles.push(file);
    }

    return { valid: validFiles, errors };
  };

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const fileArray = Array.from(files);
      const { valid, errors } = validateFiles(fileArray);

      if (errors.length > 0) {
        alert(errors.join("\n"));
        return;
      }

      if (valid.length > 0) {
        const newFiles = [...propSelectedFiles, ...valid];

        // 检查总文件数是否超过限制
        if (newFiles.length > maxFiles) {
          alert(`文件总数不能超过 ${maxFiles} 个`);
          return;
        }

        onFilesSelected(newFiles);
      }
    },
    [maxFiles, maxSize, onFilesSelected, propSelectedFiles]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      e.target.value = ""; // Reset input to allow selecting same file again
    },
    [handleFiles]
  );

  const removeFile = (index: number) => {
    const newFiles = [...propSelectedFiles];
    newFiles.splice(index, 1);
    onFilesSelected(newFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
            isDragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById(uniqueId)?.click()}
      >
        <div className="space-y-2">
          <div className="text-lg font-medium text-gray-700">{label}</div>
          <div className="text-sm text-gray-500">{description}</div>
          <div className="text-xs text-gray-400">
            支持多文件選擇，單個文件最大 {maxSize}MB，最多 {maxFiles} 個文件
          </div>
        </div>
        <Input
          id={uniqueId}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {propSelectedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">
            已選擇文件 ({propSelectedFiles.length})
          </div>
          {propSelectedFiles.map((file, index) => (
            <Card key={`${file.name}-${index}`}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="ml-2"
                  >
                    移除
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isUploading && <Loader label="上傳中..." />}
    </div>
  );
}