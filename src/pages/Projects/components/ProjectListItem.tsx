import { Card } from '@/components/general/ui/card';
import { Pin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Case } from '@/types/project';
import { StatusBadge } from './StatusBadge';

type ProjectListItemProps = {
  project: Case;
};

export const ProjectListItem = ({ project }: ProjectListItemProps) => (
  <Card className="group">
    <Link to={`/projects/${project.case_id}`} className="block">
      <div className="p-4 relative">
        {project.pinned && (
          <div className="absolute top-2 right-2">
            <Pin className="h-4 w-4 text-amber-500" />
          </div>
        )}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm">
                {project.title}
              </h3>
              {project.pinned && (
                <Pin className="h-3 w-3 text-amber-500" />
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={project.status} />
            </div>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {project.summary}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {project.tags.map((tag, index) => (
                <span
                  key={`tag-${tag}-${index}`}
                  className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              更新於 {new Date(project.updated_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </Link>
  </Card>
);
