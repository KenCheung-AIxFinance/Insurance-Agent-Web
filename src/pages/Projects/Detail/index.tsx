import React, { useEffect, useState } from 'react';
// Project Detail Page
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '@/config/api';
import { Case } from '@/types/project';
import { Button } from '@/components/general/ui/button';
import { Loader } from '@/components/general/ui/loader';
import { ArrowLeft, FileText, ShoppingBag, CheckCircle, HelpCircle } from 'lucide-react';
import KYCModule from './components/KYCModule';
import ProductRecommendationModule from './components/ProductRecommendationModule';
import PostSalesModule from './components/PostSalesModule';
import FAQModule from './components/FAQModule';

const ProjectDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Case | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'kyc' | 'products' | 'postsales' | 'faq'>('kyc');

    useEffect(() => {
        const fetchProject = async () => {
            if (!id) return;
            try {
                const data = await api.getProjectbyId(id);
                setProject(data);
            } catch (error) {
                console.error('Failed to fetch project:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    if (loading) {
        return <div className="flex items-center justify-center h-screen"><Loader label="載入專案中..." /></div>;
    }

    if (!project) {
        return <div className="p-8 text-center text-gray-500">找不到專案</div>;
    }

    const tabs = [
        { id: 'kyc', label: 'KYC & 需求分析', icon: FileText },
        { id: 'products', label: '產品推薦', icon: ShoppingBag },
        { id: 'postsales', label: '投保 & 售後', icon: CheckCircle },
        { id: 'faq', label: '常見問題', icon: HelpCircle },
    ] as const;

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate('/projects')}
                                className="hover:bg-gray-100"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </Button>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">{project.title}</h1>
                                <p className="text-sm text-gray-500">{project.client_name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                {project.status === 'completed' ? '已完成' :
                                    project.status === 'in_progress' ? '進行中' : '草稿'}
                            </span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-8 -mb-px overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                    group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                    ${isActive
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }
                  `}
                                >
                                    <Icon className={`
                    -ml-0.5 mr-2 h-5 w-5
                    ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                  `} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'kyc' && <KYCModule projectId={project.case_id} />}
                    {activeTab === 'products' && <ProductRecommendationModule projectId={project.case_id} />}
                    {activeTab === 'postsales' && <PostSalesModule projectId={project.case_id} />}
                    {activeTab === 'faq' && <FAQModule projectId={project.case_id} />}
                </motion.div>
            </main>
        </div>
    );
};

export default ProjectDetail;
