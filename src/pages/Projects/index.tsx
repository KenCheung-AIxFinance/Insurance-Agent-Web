import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/general/ui/card';
import { Button } from '@/components/general/ui/button';
import { Plus, Search, Filter, List, Grid, Tag } from 'lucide-react';
import { Input } from '@/components/general/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  updatedAt: string;
  color?: string;
};

// Mock data - will be replaced with API call
const mockProjects: Project[] = [
  {
    id: '1',
    title: '個人保險組合',
    description: '包含醫療、意外、人壽保險的綜合規劃',
    tags: ['醫療', '意外', '人壽'],
    updatedAt: '2023-12-01',
    color: 'bg-blue-100 text-blue-800',
  },
  {
    id: '2',
    title: '家庭保險方案',
    description: '全家人的保險規劃，涵蓋醫療、意外和教育基金',
    tags: ['家庭', '醫療', '教育'],
    updatedAt: '2023-11-28',
    color: 'bg-green-100 text-green-800',
  },
  {
    id: '3',
    title: '退休規劃',
    description: '長期退休儲蓄與投資規劃',
    tags: ['退休', '投資'],
    updatedAt: '2023-11-15',
    color: 'bg-purple-100 text-purple-800',
  },
];

const ProjectsPage = () => {
  const [viewType, setViewType] = React.useState<'grid' | 'list'>('grid');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">我的項目</h1>
          <p className="text-muted-foreground">管理您的所有保險項目</p>
        </div>
        <Button asChild>
          <a href="/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            新建項目
          </a>
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
    </div>
  );
};

const ProjectCard = ({ project }: { project: Project }) => (
  <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
    <a href={`/projects/${project.id}`} className="flex-1 flex flex-col">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.color}`}>
            {project.tags[0]}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {project.description}
        </p>
        <div className="mt-auto">
          <div className="flex flex-wrap gap-1 mb-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
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
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-medium truncate">{project.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.color}`}>
                {project.tags[0]}
              </span>
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
