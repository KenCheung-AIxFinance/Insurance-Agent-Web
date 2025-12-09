import React from 'react';
import { CheckCircle } from 'lucide-react';

interface PostSalesModuleProps {
    projectId: string;
}

const PostSalesModule: React.FC<PostSalesModuleProps> = ({ projectId }) => {
    const steps = [
        { title: '投保資料收集', status: 'pending' },
        { title: '文件清單核對', status: 'pending' },
        { title: '銀行與繳費設定', status: 'pending' },
        { title: '保單簽署與遞交', status: 'pending' },
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h3 className="text-lg font-medium text-gray-900 mb-6">投保進度追蹤</h3>
            <div className="space-y-8">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                                <span className="text-gray-500 text-sm font-medium">{index + 1}</span>
                            </div>
                        </div>
                        <div className="ml-4 min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900">{step.title}</div>
                            <div className="text-sm text-gray-500">待處理</div>
                        </div>
                        <div>
                            <CheckCircle className="w-5 h-5 text-gray-300" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostSalesModule;
