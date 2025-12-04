import { Plus } from 'lucide-react';
import { Button } from '@/components/general/ui/button';

type ProjectsHeaderProps = {
  onAddProject: () => void;
};

export const ProjectsHeader = ({ onAddProject }: ProjectsHeaderProps) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div>
      <h1 className="text-2xl font-bold tracking-tight">我的項目</h1>
      <p className="text-muted-foreground">管理您的所有保險項目</p>
    </div>
    <Button onClick={onAddProject}>
      <Plus className="mr-2 h-4 w-4" />
      新建項目
    </Button>
  </div>
);
