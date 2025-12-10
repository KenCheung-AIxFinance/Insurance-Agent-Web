import React, { useState, useRef } from 'react';
import { ShoppingBag, Upload, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';

interface ProductRecommendationModuleProps {
    projectId: string;
}

const ProductRecommendationModule: React.FC<ProductRecommendationModuleProps> = ({ projectId }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            // Simulate upload delay
            setTimeout(() => {
                setUploadedFile(file.name);
                setIsUploading(false);
            }, 1000);
        }
    };

    const handleGenerateClick = () => {
        setIsGenerating(true);
        // Simulate generation delay
        setTimeout(() => {
            setIsGenerating(false);
            alert('解說小冊子已生成並發送至您的信箱！');
        }, 1500);
    };

    return (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">方案建議與比較</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                基於客戶需求分析結果，提供客製化的保險方案建議與比較表，並支持 AI 生成解說小冊子。
            </p>

            {uploadedFile && (
                <div className="mb-6 flex items-center justify-center text-sm text-green-600 font-medium">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    已上傳: {uploadedFile}
                </div>
            )}

            <div className="flex justify-center gap-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.png,.jpg"
                />

                <Button
                    variant="outline"
                    onClick={handleUploadClick}
                    disabled={isUploading}
                >
                    {isUploading ? <Loader className="mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                    {uploadedFile ? '重新上傳' : '上傳方案資料'}
                </Button>

                <Button
                    onClick={handleGenerateClick}
                    disabled={!uploadedFile || isGenerating || isUploading}
                    className={!uploadedFile ? "opacity-50 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 text-white"}
                >
                    {isGenerating ? <Loader className="text-white mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    生成解說小冊子
                </Button>
            </div>
        </div>
    );
};

export default ProductRecommendationModule;
