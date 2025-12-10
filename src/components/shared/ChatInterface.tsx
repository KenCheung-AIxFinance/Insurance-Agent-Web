import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader } from '@/components/ui/loader';
import { useNavigate } from 'react-router-dom';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface ChatContext {
    project_id: string;
    project_name: string;
    client_name?: string;
}

interface ChatInterfaceProps {
    projectId?: string;
    projectName?: string;
    clientName?: string;
    showOpenInNewWindow?: boolean;
    className?: string;
    compact?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
    projectId,
    projectName,
    clientName,
    showOpenInNewWindow = false,
    className = '',
    compact = false
}) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: projectId
                ? `你好！我是你的專案智能助手。我已經閱讀了${clientName || '此項目'}的 KYC 資料與相關文件。有什麼我可以幫你的嗎？`
                : '你好！我是智能助手。你可以詢問保險相關問題，或選擇一個項目進行深入討論。',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load conversation history when projectId changes
    useEffect(() => {
        if (projectId) {
            // TODO: Fetch conversation history from API
            // const history = await api.getConversationHistory(projectId);
            // setMessages(history);
        } else {
            // Reset to general mode
            setMessages([{
                id: '1',
                role: 'assistant',
                content: '你好！我是智能助手。你可以詢問保險相關問題，或選擇一個項目進行深入討論。',
                timestamp: new Date()
            }]);
        }
    }, [projectId]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsLoading(true);

        // Simulate AI Response
        setTimeout(() => {
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: generateMockResponse(text, projectId),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsLoading(false);
        }, 1500);
    };

    const generateMockResponse = (query: string, hasProjectContext?: string): string => {
        if (hasProjectContext) {
            if (query.includes('缺口') || query.includes('保額')) {
                return '根據 KYC 分析，客戶目前的身故保障缺口約為 150 萬港幣。建議優先考慮增加定期人壽保險。';
            }
            if (query.includes('危疾') || query.includes('critical')) {
                return '客戶目前的危疾保障只有公司團體醫療，並無獨立危疾單。考慮到客戶家族有心臟病史，建議配置一份多重賠付的危疾險。';
            }
            if (query.includes('預算') || query.includes('budget')) {
                return '客戶表示每月可用於保險的預算約為 HK$ 3,000 - 5,000。這個預算足夠配置一份 "定期人壽 + 自願醫保" 的組合。';
            }
            return '收到你的問題。基於目前的項目資料，我建議你可以進一步上傳最新的保單建議書，讓我能進行更詳細的比較分析。';
        } else {
            return '這是通用模式的回答。如果你想針對特定客戶案件進行討論，請從左側選擇一個項目。';
        }
    };

    const suggestedPrompts = projectId ? [
        "分析目前的保障缺口",
        "推薦適合的危疾產品",
        "客戶的預算範圍是多少？",
        "如何解釋「不可爭議條款」？"
    ] : [
        "什麼是自願醫保？",
        "如何計算保障缺口？",
        "定期人壽和終身人壽的分別？"
    ];

    const handleOpenInNewWindow = () => {
        if (projectId) {
            navigate(`/chat?project=${projectId}`);
        }
    };

    return (
        <div className={cn("bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col", compact ? "h-[600px]" : "h-full", className)}>
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900">
                            {projectId ? `智能專案助手` : '智能助手'}
                        </h3>
                        {projectId && (
                            <p className="text-xs text-gray-500 flex items-center">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                                當前項目：{projectName || clientName}
                            </p>
                        )}
                        {!projectId && (
                            <p className="text-xs text-gray-500 flex items-center">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
                                通用模式 • Online
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setMessages([messages[0]])}>
                        <RefreshCw className="w-4 h-4 text-gray-400" />
                    </Button>
                    {showOpenInNewWindow && projectId && (
                        <Button variant="ghost" size="sm" onClick={handleOpenInNewWindow}>
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex items-start max-w-[80%]",
                            msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                        )}
                    >
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm",
                            msg.role === 'user' ? "bg-gray-800 ml-3" : "bg-white mr-3 border border-gray-200"
                        )}>
                            {msg.role === 'user' ? (
                                <User className="w-4 h-4 text-white" />
                            ) : (
                                <Bot className="w-5 h-5 text-indigo-600" />
                            )}
                        </div>
                        <div className={cn(
                            "p-4 rounded-2xl shadow-sm text-sm leading-relaxed",
                            msg.role === 'user'
                                ? "bg-gray-900 text-white rounded-tr-sm"
                                : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm"
                        )}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start max-w-[80%]">
                        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 mt-1 mr-3">
                            <Bot className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-sm shadow-sm">
                            <Loader className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
                {messages.length < 3 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {suggestedPrompts.map((prompt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSendMessage(prompt)}
                                className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full hover:bg-indigo-100 transition-colors"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage(inputValue)}
                        placeholder={projectId ? "詢問有關此案件的任何問題..." : "詢問保險相關問題..."}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        disabled={isLoading}
                    />
                    <Button
                        onClick={() => handleSendMessage(inputValue)}
                        disabled={isLoading || !inputValue.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 w-12 px-0"
                    >
                        <Send className="w-4 h-4 text-white" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
