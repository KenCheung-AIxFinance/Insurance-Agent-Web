import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/config/api';
import { Case } from '@/types/project';
import { Button } from '@/components/general/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/general/ui/card';
import { 
  FileText, 
  User, 
  Calendar, 
  Tag, 
  ChevronDown, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  Package, 
  Headphones, 
  HelpCircle, 
  ChevronUp, 
  ChevronLeft, 
  MoreVertical, 
  Share2, 
  MessageSquareText,
  ShoppingBag,
  CheckCircle,
  Edit, 
  Trash2, 
  Copy, 
  Download, 
  Printer, 
  Plus, 
  X, 
  Check, 
  Loader2, 
  Info 
} from 'lucide-react';
import KYCModule from './components/KYCModule';
import ProductRecommendationModule from './components/ProductRecommendationModule';
import PostSalesModule from './components/PostSalesModule';
import FAQModule from './components/FAQModule';

const ProjectDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Case | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('kyc');
    const [isClientInfoOpen, setIsClientInfoOpen] = useState(true);

    const statusVariant = {
        completed: { bg: 'bg-emerald-50', text: 'text-emerald-800', icon: CheckCircle2 },
        in_progress: { bg: 'bg-blue-50', text: 'text-blue-800', icon: Clock },
        draft: { bg: 'bg-amber-50', text: 'text-amber-800', icon: AlertCircle },
        archived: { bg: 'bg-gray-100', text: 'text-gray-800', icon: AlertCircle },
    } as const;

    useEffect(() => {
        const fetchProject = async () => {
            if (!id) return;
            try {
                // 模擬API延遲
                await new Promise(resolve => setTimeout(resolve, 800));
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

    const getStatusBadge = (status: 'draft' | 'in_progress' | 'completed' | 'archived') => {
        const statusConfig = statusVariant[status] || statusVariant.draft;
        const Icon = statusConfig.icon;
        
        return (
            <Badge className={`${statusConfig.bg} ${statusConfig.text} hover:opacity-80 gap-1`}>
                <Icon className="h-3.5 w-3.5" />
                {status === 'completed' ? '已完成' : 
                 status === 'in_progress' ? '進行中' : 
                 status === 'archived' ? '已封存' : '草稿'}
            </Badge>
        );
    };

    const tabs = [
        { id: 'kyc', label: 'KYC & 需求分析', icon: FileText },
        { id: 'products', label: '產品推薦', icon: ShoppingBag },
        { id: 'postsales', label: '投保 & 售後', icon: CheckCircle },
        { id: 'faq', label: '常見問題', icon: HelpCircle },
    ] as const;

    if (loading) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="outline" size="icon" onClick={() => navigate('/projects')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Skeleton className="h-10 w-64" />
                </div>
                <div className="grid gap-6">
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">找不到專案</h2>
                <p className="text-gray-500 mb-6">請確認專案ID是否正確，或返回專案列表</p>
                <Button onClick={() => navigate('/projects')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> 返回專案列表
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 頂部導航欄 */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate('/projects')}
                                className="text-gray-500 hover:bg-gray-100 mr-2"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div className="flex items-center space-x-4">
                                <h1 className="text-xl font-semibold text-gray-900">{project.title}</h1>
                                {getStatusBadge(project.status)}
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Button variant="outline" size="sm" className="gap-1.5">
                                <Share2 className="h-4 w-4" />
                                分享
                            </Button>
                            <Button size="sm" className="gap-1.5">
                                <FileText className="h-4 w-4" />
                                導出報告
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* 頁面內容 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* 客戶資訊卡片 */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                    <div className="lg:col-span-8 space-y-6">
                        <Card className="overflow-hidden">
                            <CardHeader className="bg-gray-50 border-b p-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-base font-semibold text-gray-900">客戶概覽</h2>
                                    <Button variant="ghost" size="sm" className="text-sm text-blue-600 hover:bg-blue-50">
                                        編輯資訊
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="flex items-start space-x-3">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <User className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">客戶姓名</p>
                                            <p className="text-base font-medium text-gray-900 mt-1">{project.client_name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <Calendar className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">建立日期</p>
                                            <p className="text-base font-medium text-gray-900 mt-1">
                                                {new Date(project.created_at).toLocaleDateString('zh-TW')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="p-2 bg-purple-50 rounded-lg">
                                            <Tag className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">標籤</p>
                                            <div className="flex flex-wrap gap-1.5 mt-1">
                                                {project.tags?.slice(0, 3).map((tag) => (
                                                    <Badge key={tag} variant="outline" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                                {project.tags?.length > 3 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{project.tags.length - 3} 更多
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    
                    <div className="lg:col-span-4">
                        <Card className="h-full">
                            <CardHeader className="bg-gray-50 border-b p-4">
                                <h2 className="text-base font-semibold text-gray-900">進度概覽</h2>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700">KYC 完成度</span>
                                            <span className="text-sm font-medium text-gray-900">75%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700">產品推薦</span>
                                            <span className="text-sm font-medium text-gray-900">3 項</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700">最後更新</span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(project.updated_at).toLocaleString('zh-TW')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <Button variant="outline" className="w-full" size="sm">
                                        <MessageSquareText className="h-4 w-4 mr-2" />
                                        新增備註
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* 主要內容區塊 */}
                <Card className="overflow-hidden">
                    <CardHeader className="border-b p-0">
                        <Tabs 
                            defaultValue="kyc" 
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full"
                        >
                            <TabsList className="w-full justify-start h-auto p-0 bg-transparent rounded-none">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <TabsTrigger 
                                            key={tab.id} 
                                            value={tab.id}
                                            className={`
                                                group relative py-4 px-6 text-sm font-medium rounded-none border-b-2 border-transparent
                                                ${isActive 
                                                    ? 'text-blue-600 border-b-2 border-blue-500' 
                                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
                                            `}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Icon className={`h-4 w-4 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                                                <span>{tab.label}</span>
                                            </div>
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>
                        </Tabs>
                    </CardHeader>

                    <CardContent className="p-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.15, ease: "easeInOut" }}
                                className="h-full"
                            >
                                {activeTab === 'kyc' && <KYCModule projectId={project.case_id} />}
                                {activeTab === 'products' && <ProductRecommendationModule projectId={project.case_id} />}
                                {activeTab === 'postsales' && <PostSalesModule projectId={project.case_id} />}
                                {activeTab === 'faq' && <FAQModule projectId={project.case_id} />}
                            </motion.div>
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProjectDetail;
