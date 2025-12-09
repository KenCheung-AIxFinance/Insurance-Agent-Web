import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Case } from '@/types/project';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Trash2, Pencil, Copy, ExternalLink, Pin, PinOff } from 'lucide-react';

type ProjectContextMenuProps = {
  children: React.ReactNode;
  project: Case;
  onEdit?: (project: Case) => void;
  onDelete?: (projectId: string) => Promise<void>;
  onPinToggle?: (projectId: string, pinned: boolean) => Promise<void>;
};

export function ProjectContextMenu({
  children,
  project,
  onEdit,
  onDelete,
  onPinToggle,
}: ProjectContextMenuProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!onDelete) return;
    
    try {
      setIsDeleting(true);
      await onDelete(project.case_id);
    } catch (error) {
      console.error('Failed to delete project:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    onEdit?.(project);
  };

  const handleOpenInNewTab = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(`/projects/${project.case_id}`, '_blank');
  };

  const handleTogglePin = async () => {
    if (!onPinToggle) return;
    try {
      await onPinToggle(project.case_id, !project.pinned);
    } catch (error) {
      console.error('Failed to toggle pin status:', error);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={handleOpenInNewTab}>
          <ExternalLink className="mr-2 h-4 w-4" />
          在新分頁開啟
        </ContextMenuItem>
        {onPinToggle && (
          <ContextMenuItem onClick={handleTogglePin}>
            {project.pinned ? (
              <>
                <PinOff className="mr-2 h-4 w-4" />
                取消置頂
              </>
            ) : (
              <>
                <Pin className="mr-2 h-4 w-4" />
                置頂項目
              </>
            )}
          </ContextMenuItem>
        )}
        {onEdit && (
          <ContextMenuItem onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            編輯
          </ContextMenuItem>
        )}
        {onDelete && (
          <ContextMenuItem 
            onClick={handleDelete}
            className="text-destructive focus:text-destructive"
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? '刪除中...' : '刪除'}
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
