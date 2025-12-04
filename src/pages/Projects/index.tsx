import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/general/ui/card';
import { Button } from '@/components/general/ui/button';
import { Plus, Search, Filter, List, Grid, Tag, Clock, CheckCircle, FileText, Archive } from 'lucide-react';
import { Input } from '@/components/general/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { NewProjectDialog } from './NewProjectDialog';

type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  updatedAt: string;
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
};

// Mock data - will be replaced with API call
const mockProjects: Project[] = [
  {
    id: '1',
    title: '個人保險組合',
    description: '包含醫療、意外、人壽保險的綜合規劃',
    tags: ['醫療', '意外', '人壽'],
    updatedAt: '2023-12-01',
    status: 'in_progress',
  },
  {
    id: '2',
    title: '家庭保險方案',
    description: '全家人的保險規劃，涵蓋醫療、意外和教育基金',
    tags: ['家庭', '醫療', '教育'],
    updatedAt: '2023-11-28',
    status: 'draft',
  },
  {
    id: '3',
    title: '退休規劃',
    description: '長期退休儲蓄與投資規劃',
    tags: ['退休', '投資'],
    updatedAt: '2023-11-15',
    status: 'completed',
  },
  {
    id: '4',
    title: '舊有保單整理',
    description: '整理並分析現有保單內容',
    tags: ['保單整理', '分析'],
    updatedAt: '2023-10-20',
    status: 'archived',
  },
];

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

const StatusBadge = ({ status }: { status: Project['status'] }) => {
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
  const [viewType, setViewType] = React.useState<'grid' | 'list'>('grid');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleProjectCreated = () => {
    // TODO: Refresh project list from API
    console.log('Project created, refreshing list...');
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

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <TabsList>
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="active">進行中</TabsTrigger>
            <TabsTrigger value="archived">已封存</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索項目..."
                className="w-full pl-8"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <div className="flex border rounded-md">
              <Button
                variant={viewType === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="rounded-r-none h-9 w-9"
                onClick={() => setViewType('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewType === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                className="rounded-l-none h-9 w-9"
                onClick={() => setViewType('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          {viewType === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {mockProjects.map((project) => (
                <ProjectListItem key={project.id} project={project} />
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

const ProjectCard = ({ project }: { project: Project }) => (
  <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
    <a href={`/projects/${project.id}`} className="flex-1 flex flex-col">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
          <StatusBadge status={project.status} />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {project.description}
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
            更新於 {project.updatedAt}
          </div>
        </div>
      </CardContent>
    </a>
  </Card>
);

const ProjectListItem = ({ project }: { project: Project }) => (
  <Card>
    <a href={`/projects/${project.id}`} className="block">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-medium">{project.title}</h3>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {project.description}
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
            <div className="text-sm text-muted-foreground">
              更新於 {project.updatedAt}
            </div>
          </div>
        </div>
      </div>
    </a>
  </Card>
);

export default ProjectsPage;
