import React, { useEffect, useState } from 'react';
import { Button } from '@/components/general/ui/button';
import { Plus, Loader2, FileText, Clock, CheckCircle, Archive } from 'lucide-react';
import { NewProjectDialog } from './NewProjectDialog';
import { ProjectService } from '@/services/projectService';
import { toast } from 'sonner';
import type { Case, CreateCaseInput } from '@/types/project';
import { ProjectsHeader } from './components/ProjectsHeader';
import { ProjectsFilter } from './components/ProjectsFilter';
import { ProjectsGrid } from './components/ProjectsGrid';
import { ProjectsList } from './components/ProjectsList';

// Status configuration for the status badge
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
  const [editingProject, setEditingProject] = useState<Case | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState<{
    field: 'updated_at' | 'created_at' | 'title' | 'client_name';
    order: 'asc' | 'desc';
  }>({ field: 'updated_at', order: 'desc' });

  // Handle pin toggle
  const handlePinToggle = async (projectId: string, pinned: boolean) => {
    try {
      const project = projects.find(p => p.case_id === projectId);
      if (!project) return;

      project.pinned = pinned;
      
      await ProjectService.updateProject(projectId, project);
      
      // Update local state to reflect the change immediately
      setProjects(projects.map(project => 
        project.case_id === projectId ? { ...project, pinned } : project
      ));
    } catch (error) {
      console.error('Failed to update pin status:', error);
      toast.error(pinned ? '置頂失敗' : '取消置頂失敗');
    }
  };

  // Memoize the sorted and filtered projects for better performance
  const sortedAndFilteredProjects: Case[] = React.useMemo(() => {
    return projects
      .filter((project: Case) => {
        if (searchTerm.trim() === '') return true;
        const searchLower = searchTerm.toLowerCase();
        return (
          project.title.toLowerCase().includes(searchLower) ||
          (project.client_name || '').toLowerCase().includes(searchLower) ||
          (project.summary || '').toLowerCase().includes(searchLower) ||
          (project.tags || []).some((tag: string) => tag.toLowerCase().includes(searchLower))
        );
      })
      .filter((project: Case) => 
        activeTab === 'all' || project.status === activeTab
      )
      .sort((a: Case, b: Case) => {
        // Pinned items always come first
        if (a.pinned !== b.pinned) {
          return a.pinned ? -1 : 1;
        }
        
        let comparison = 0;
        // Handle different sort fields
        if (sortBy.field === 'title' || sortBy.field === 'client_name') {
          const aValue = a[sortBy.field] || '';
          const bValue = b[sortBy.field] || '';
          comparison = aValue.localeCompare(bValue);
        } else if (sortBy.field === 'updated_at' || sortBy.field === 'created_at') {
          const aDate = new Date(a[sortBy.field] || 0).getTime();
          const bDate = new Date(b[sortBy.field] || 0).getTime();
          comparison = aDate - bDate;
        }
        
        // Apply sort order
        return sortBy.order === 'asc' ? comparison : -comparison;
      });
  }, [projects, searchTerm, activeTab, sortBy]);

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
    setIsDialogOpen(false);
  };

  const handleEditProject = (project: Case) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const handleUpdateProject = async (data: CreateCaseInput) => {
    if (!editingProject) return;
    
    try {
      await ProjectService.updateProject(editingProject.case_id, data);
      toast.success('項目已更新');
      fetchProjects();
      setIsDialogOpen(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Failed to update project:', error);
      toast.error('更新項目時發生錯誤');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await ProjectService.deleteProject(projectId);
      toast.success('項目已刪除');
      fetchProjects(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast.error('刪除項目時發生錯誤');
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <ProjectsHeader onAddProject={() => setIsDialogOpen(true)} />

      <ProjectsFilter
        activeTab={activeTab}
        searchTerm={searchTerm}
        viewType={viewType}
        onTabChange={setActiveTab}
        onSearchChange={setSearchTerm}
        onViewChange={setViewType}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={fetchProjects}
          >
            重試
          </Button>
        </div>
      ) : sortedAndFilteredProjects.length === 0 ? (
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
        <ProjectsGrid
          projects={sortedAndFilteredProjects}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
          onPinToggle={handlePinToggle}
        />
      ) : (
        <ProjectsList
          projects={sortedAndFilteredProjects}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
          onPinToggle={handlePinToggle}
        />
      )}

      <NewProjectDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingProject(null);
        }}
        project={editingProject}
        onProjectCreated={handleProjectCreated}
        onProjectUpdated={handleUpdateProject}
      />
    </div>
  );
};

export default ProjectsPage;
