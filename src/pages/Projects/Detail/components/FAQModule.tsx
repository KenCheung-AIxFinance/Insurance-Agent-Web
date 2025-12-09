import React from 'react';
import { HelpCircle } from 'lucide-react';

interface FAQModuleProps {
    projectId: string;
}

const FAQModule: React.FC<FAQModuleProps> = ({ projectId }) => {
    const faqs = [
        { q: '如何計算保險缺口？', a: '我們使用標準的財務需求分析模型，綜合考慮您的家庭債務、現有資產、未來教育基金與退休生活開支。' },
        { q: '分析報告包含哪些內容？', a: '報告將呈現完整的家庭財務健康檢查、風險承受能力評估，以及針對已識別缺口的初步保障建議。' },
        { q: '資料安全是否有保障？', a: '所有的客戶資料均經過銀行級加密處理，並嚴格均守隱私權政策，僅供您與您的專業顧問團隊存取。' },
    ];

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">智能問答庫</h3>
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
