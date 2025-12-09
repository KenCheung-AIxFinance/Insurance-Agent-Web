import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductRecommendationModuleProps {
    projectId: string;
}

const ProductRecommendationModule: React.FC<ProductRecommendationModuleProps> = ({ projectId }) => {
    return (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">方案建議與比較</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                基於客戶需求分析結果，提供客製化的保險方案建議與比較表，並支持 AI 生成解說小冊子。
            </p>
            <div className="flex justify-center gap-4">
                <Button variant="outline" disabled>上傳方案資料</Button>
                <Button disabled>生成解說小冊子</Button>
            </div>
        </div>
    );
};

export default ProductRecommendationModule;
