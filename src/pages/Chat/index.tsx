import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatInterface from '@/components/shared/ChatInterface';
import { Case } from '@/types/project';
import { api } from '@/config/api';
import { Loader } from '@/components/ui/loader';
import { MessageSquare, FolderOpen, User, DollarSign, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const ChatPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [projects, setProjects] = useState<Case[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<Case | null>(null);
    const [loading, setLoading] = useState(true);

    // Load projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await api.getMyProjects();
                setProjects(data);

                // Check if there's a project in URL params
                const projectParam = searchParams.get('project');
                if (projectParam) {
                    setSelectedProjectId(projectParam);
                    const project = data.find((p: Case) => p.case_id === projectParam);
                    setSelectedProject(project || null);
                }
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [searchParams]);

    const handleProjectSelect = (projectId: string | null) => {
        setSelectedProjectId(projectId);
        if (projectId) {
            const project = projects.find(p => p.case_id === projectId);
            setSelectedProject(project || null);
            setSearchParams({ project: projectId });
        } else {
            setSelectedProject(null);
            setSearchParams({});
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader label="載入中..." />
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <MessageSquare className="w-7 h-7 mr-3 text-indigo-600" />
                    智能問答助手
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    選擇一個項目進行深入討論，或使用通用模式詢問保險相關問題
                </p>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Project List */}
                <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
                    <div className="p-4">
                        <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                            <FolderOpen className="w-4 h-4 mr-2" />
                            選擇項目
                        </h2>

                        {/* General Mode Option */}
                        <button
                            onClick={() => handleProjectSelect(null)}
                            className={cn(
                                "w-full text-left p-3 rounded-lg mb-2 transition-all",
                                !selectedProjectId
                                    ? "bg-indigo-50 border-2 border-indigo-500 text-indigo-900"
                                    : "bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700"
                            )}
                        >
                            <div className="flex items-center">
                                <div className={cn(
                                    "w-2 h-2 rounded-full mr-3",
                                    !selectedProjectId ? "bg-indigo-500" : "bg-gray-300"
                                )}></div>
                                <span className="font-medium">💬 通用對話</span>
                            </div>
                            <p className="text-xs text-gray-500 ml-5 mt-1">一般保險知識咨詢</p>
                        </button>

                        {/* Project List */}
                        <div className="space-y-2">
                            {projects.map(project => (
                                <button
                                    key={project.case_id}
                                    onClick={() => handleProjectSelect(project.case_id)}
                                    className={cn(
                                        "w-full text-left p-3 rounded-lg transition-all",
                                        selectedProjectId === project.case_id
                                            ? "bg-indigo-50 border-2 border-indigo-500"
                                            : "bg-white border border-gray-200 hover:bg-gray-50"
                                    )}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full mr-3",
                                                selectedProjectId === project.case_id ? "bg-indigo-500" : "bg-gray-300"
                                            )}></div>
                                            <span className="font-medium text-gray-900 text-sm">
                                                📁 {project.client_name}
                                            </span>
                                        </div>
                                        <span className={cn(
                                            "text-xs px-2 py-0.5 rounded-full",
                                            project.status === 'in_progress' ? "bg-blue-100 text-blue-700" :
                                                project.status === 'completed' ? "bg-green-100 text-green-700" :
                                                    "bg-gray-100 text-gray-600"
                                        )}>
                                            {project.status === 'in_progress' ? '進行中' :
                                                project.status === 'completed' ? '已完成' : '草稿'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 ml-5 line-clamp-1">
                                        {project.title}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Center - Chat Interface */}
                <div className="flex-1 p-6">
                    <ChatInterface
                        projectId={selectedProjectId || undefined}
                        projectName={selectedProject?.title}
                        clientName={selectedProject?.client_name}
                        showOpenInNewWindow={false}
                        className="h-full"
                    />
                </div>

                {/* Right Sidebar - Project Info */}
                {selectedProject && (
                    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto p-6">
                        <h2 className="text-sm font-semibold text-gray-700 mb-4">項目信息</h2>

                        <div className="space-y-4">
                            {/* Client Info */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <User className="w-4 h-4 mr-2" />
                                    客戶資料
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-gray-500">姓名：</span>
                                        <span className="text-gray-900 font-medium">{selectedProject.client_name}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">項目：</span>
                                        <span className="text-gray-900">{selectedProject.title}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">狀態：</span>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded text-xs",
                                            selectedProject.status === 'in_progress' ? "bg-blue-100 text-blue-700" :
                                                selectedProject.status === 'completed' ? "bg-green-100 text-green-700" :
                                                    "bg-gray-100 text-gray-600"
                                        )}>
                                            {selectedProject.status === 'in_progress' ? '進行中' :
                                                selectedProject.status === 'completed' ? '已完成' : '草稿'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            {selectedProject.tags && selectedProject.tags.length > 0 && (
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <TrendingUp className="w-4 h-4 mr-2" />
                                        標籤
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.tags.map((tag, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-white text-blue-700 text-xs rounded-full border border-blue-200">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Mock KYC Summary */}
                            <div className="bg-purple-50 rounded-lg p-4">
                                <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    保障概覽
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-gray-500">保障缺口：</span>
                                        <span className="text-purple-900 font-semibold">HK$ 1.5M</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">月預算：</span>
                                        <span className="text-gray-900">HK$ 3,000 - 5,000</span>
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            {selectedProject.summary && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-sm font-medium text-gray-700 mb-2">摘要</div>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {selectedProject.summary}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
