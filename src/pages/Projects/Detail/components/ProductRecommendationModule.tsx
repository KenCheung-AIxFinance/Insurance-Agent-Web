import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/general/ui/button';

interface ProductRecommendationModuleProps {
    projectId: string;
}

const ProductRecommendationModule: React.FC<ProductRecommendationModuleProps> = ({ projectId }) => {
    return (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">產品推薦</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                此模組將提供結構化產品描述與 AI 智能生成簡化小冊子功能。
            </p>
            <div className="flex justify-center gap-4">
                <Button variant="outline" disabled>上傳文件</Button>
                <Button disabled>生成小冊子</Button>
            </div>
        </div>
    );
};

export default ProductRecommendationModule;
