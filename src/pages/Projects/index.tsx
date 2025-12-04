import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/general/ui/card';
import { Button } from '@/components/general/ui/button';
import { Plus, Search, Filter, List, Grid, Tag, Clock, CheckCircle, FileText, Archive, Loader2 } from 'lucide-react';
import { Input } from '@/components/general/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { NewProjectDialog } from './NewProjectDialog';
import { ProjectService } from '@/services/projectService';
import type { Case } from '@/types/project';

// Using the Case type from project.ts

const statusConfig = {
  draft: {
    label: '草稿',
    icon: FileText,
    className: 'bg-gray-100 text-gray-800',
  },
  in_progress: {
    label: '進行中',
    icon: Clock,
    className: 'bg-blue-100 text-blue-800',
  },
  completed: {
    label: '已完成',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-800',
  },
  archived: {
    label: '已封存',
    icon: Archive,
    className: 'bg-gray-200 text-gray-600',
  },
};

const StatusBadge = ({ status }: { status: 'draft' | 'in_progress' | 'completed' | 'archived' }) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ProjectService.getMyProjects();
      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError('無法載入項目列表，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectCreated = () => {
    fetchProjects();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">我的項目</h1>
          <p className="text-muted-foreground">管理您的所有保險項目</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新建項目
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <TabsList>
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="draft">草稿</TabsTrigger>
            <TabsTrigger value="in_progress">進行中</TabsTrigger>
            <TabsTrigger value="completed">已完成</TabsTrigger>
            <TabsTrigger value="archived">已封存</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜尋項目..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex border rounded-md">
              <Button
                variant={viewType === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-9 w-9 rounded-r-none"
                onClick={() => setViewType('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewType === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-9 w-9 rounded-l-none border-l"
                onClick={() => setViewType('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value={activeTab} className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2">載入中...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              <p>{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={fetchProjects}
              >
                重試
              </Button>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">尚未建立任何項目</p>
              <Button 
                className="mt-4"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                創建新項目
              </Button>
            </div>
          ) : viewType === 'grid' ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects
                .filter(project => {
                  const searchLower = searchTerm.toLowerCase();
                  return (
                    project.title.toLowerCase().includes(searchLower) ||
                    (project.summary && project.summary.toLowerCase().includes(searchLower)) ||
                    project.client_name.toLowerCase().includes(searchLower) ||
                    project.tags.some(tag => tag.toLowerCase().includes(searchLower))
                  );
                })
                .filter(project => 
                  activeTab === 'all' || project.status === activeTab
                )
                .map((project) => (
                  <ProjectCard key={project.case_id} project={project} />
                ))}
            </div>
          ) : (
            <div className="space-y-4">
              {projects
                .filter(project => {
                  const searchLower = searchTerm.toLowerCase();
                  return (
                    project.title.toLowerCase().includes(searchLower) ||
                    (project.summary && project.summary.toLowerCase().includes(searchLower)) ||
                    project.client_name.toLowerCase().includes(searchLower) ||
                    project.tags.some(tag => tag.toLowerCase().includes(searchLower))
                  );
                })
                .filter(project => 
                  activeTab === 'all' || project.status === activeTab
                )
                .map((project) => (
                  <ProjectListItem key={project.case_id} project={project} />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <NewProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
};

const ProjectCard = ({ project }: { project: Case }) => (
  <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
    <a href={`/projects/${project.case_id}`} className="flex-1 flex flex-col">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
          <StatusBadge status={project.status} />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {project.summary}
        </p>
        <div className="mt-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-nowrap gap-1 mb-3 overflow-hidden">
                  {project.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={tag + index}
                      className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="inline-flex items-center rounded-md bg-muted/50 px-2 py-1 text-xs font-medium text-muted-foreground/80">
                      +{project.tags.length - 3}個
                    </span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs" side="bottom" align="start">
                <div className="flex flex-wrap gap-1">
                  {project.tags.map((tag, index) => (
                    <span
                      key={tag + index}
                      className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="text-xs text-muted-foreground">
            更新於 {new Date(project.updated_at).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </a>
  </Card>
);

const ProjectListItem = ({ project }: { project: Case }) => (
  <Card>
    <a href={`/projects/${project.case_id}`} className="block">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-medium">{project.title}</h3>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {project.summary}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="ml-4 flex-shrink-0">
            <div className="text-xs text-muted-foreground">
              更新於 {new Date(project.updated_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </a>
  </Card>
);

export default ProjectsPage;
