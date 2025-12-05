import React from 'react';
import { HelpCircle } from 'lucide-react';

interface FAQModuleProps {
    projectId: string;
}

const FAQModule: React.FC<FAQModuleProps> = ({ projectId }) => {
    const faqs = [
        { q: '如何計算保險缺口？', a: '我們使用標準的財務需求分析模型，考慮您的家庭債務、現有資產與未來開支。' },
        { q: 'KYC 報告包含哪些內容？', a: '包含完整的財務狀況分析、風險承受能力評估以及初步的產品建議方向。' },
        { q: '資料安全嗎？', a: '所有的客戶資料都經過加密處理，僅供您與您的團隊存取。' },
    ];

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">常見問題 (FAQ)</h3>
            <div className="grid gap-6">
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-start">
                            <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <h4 className="text-base font-medium text-gray-900 mb-2">{faq.q}</h4>
                                <p className="text-gray-600">{faq.a}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQModule;
