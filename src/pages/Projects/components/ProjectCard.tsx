import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Pin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Case } from '@/types/project';
import { StatusBadge } from './StatusBadge';

type ProjectCardProps = {
  project: Case;
};

export const ProjectCard = ({ project }: ProjectCardProps) => (
  <Card className="h-full flex flex-col hover:shadow-md transition-shadow group">
    <Link to={`/projects/${project.case_id}`} className="flex-1 flex flex-col">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg line-clamp-1">
            {project.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {project.pinned && (
              <Pin className="h-4 w-4 text-amber-500" />
            )}
            <StatusBadge status={project.status} />
          </div>
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
                      key={`${tag}-${index}`}
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
                      key={`tooltip-${tag}-${index}`}
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
    </Link>
  </Card>
);
