import { useNavigate, useLocation } from 'react-router-dom';
import React from 'react';
import { Button } from '@/components/general/ui/button';
import { 
  ArrowLeft, 
  Settings, 
  Share2, 
  FileText, 
  MessageSquareText, 
  ShoppingBag, 
  CheckCircle, 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Archive 
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

type ProjectLayoutProps = {
  project: {
    case_id: string;
    title: string;
    status: 'draft' | 'in_progress' | 'completed' | 'archived';
    client_name: string;
    created_at: string;
    updated_at: string;
    tags?: string[];
  };
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
};

// 獨立於主應用的項目編輯器佈局
// 這個組件應該直接包裹在 App 路由中，不包含在主 Layout 中
const ProjectLayout = ({ project, activeTab, onTabChange, children }: ProjectLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'kyc', label: 'KYC & 需求分析', icon: FileText },
    { id: 'products', label: '產品推薦', icon: ShoppingBag },
    { id: 'postsales', label: '投保 & 售後', icon: CheckCircle },
    { id: 'faq', label: '常見問題', icon: HelpCircle },
  ] as const;

  const getStatusBadge = (status: 'draft' | 'in_progress' | 'completed' | 'archived') => {
    type StatusConfig = {
      bg: string;
      text: string;
      icon: React.ComponentType<{ className?: string }>;
    };
    
    const statusConfigs: Record<string, StatusConfig> = {
      completed: { bg: 'bg-emerald-50', text: 'text-emerald-800', icon: CheckCircle2 },
      in_progress: { bg: 'bg-blue-50', text: 'text-blue-800', icon: Clock },
      draft: { bg: 'bg-amber-50', text: 'text-amber-800', icon: AlertCircle },
      archived: { bg: 'bg-gray-100', text: 'text-gray-800', icon: Archive },
    };
    
    const statusConfig = statusConfigs[status] || statusConfigs.draft;
    const Icon = statusConfig.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status === 'completed' ? '已完成' : 
         status === 'in_progress' ? '進行中' : 
         status === 'archived' ? '已封存' : '草稿'}
      </span>
    );
  };

  return (
    <div className="fixed inset-20 bg-white flex flex-col" style={{ zIndex: 50 }}>
      {/* 頂部導航欄 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/projects')}
                className="text-gray-600 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回專案列表
              </Button>
              <div className="h-6 w-px bg-gray-200" />
              <h1 className="text-lg font-semibold text-gray-900">{project.title}</h1>
              {getStatusBadge(project.status)}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="gap-1.5 text-gray-600 hover:bg-gray-50 border-gray-200">
                <Share2 className="h-4 w-4" />
                分享
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 text-gray-600 hover:bg-gray-50 border-gray-200">
                <MessageSquareText className="h-4 w-4" />
                新增備註
              </Button>
              <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
                <FileText className="h-4 w-4" />
                導出報告
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* 二級導航 */}
        <div className="border-t border-gray-100 bg-white">
          <div className="px-6">
            <Tabs 
              value={activeTab}
              onValueChange={onTabChange}
              className="w-full"
            >
              <TabsList className="w-full justify-start h-auto p-0 bg-white rounded-none border-b-0">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id}
                      className={cn(
                        "group relative py-3 px-4 text-sm font-medium rounded-none border-b-2 border-transparent",
                        isActive 
                          ? 'text-blue-600 border-b-2 border-blue-500' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      )}
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
          </div>
        </div>
      </header>

      {/* 頁面內容 */}
      <main className="flex-1 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* 項目概覽卡片 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">客戶姓名</p>
                <p className="font-medium text-gray-900">{project.client_name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">建立日期</p>
                <p className="font-medium text-gray-900">
                  {new Date(project.created_at).toLocaleDateString('zh-TW')}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">最後更新</p>
                <p className="font-medium text-gray-900">
                  {new Date(project.updated_at).toLocaleString('zh-TW')}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">標籤</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags && project.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {tag}
                    </span>
                  ))}
                  {project.tags && project.tags.length > 2 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                      +{project.tags.length - 2} 更多
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 主要內容區域 */}
          <div className="bg-white rounded-lg flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectLayout;
