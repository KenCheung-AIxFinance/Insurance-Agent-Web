import { Case } from '@/types/project';
import { ProjectCard } from './ProjectCard';
import { ProjectContextMenu } from '@/pages/Projects/components/ProjectContextMenu';

type ProjectsGridProps = {
  projects: Case[];
  onEdit: (project: Case) => void;
  onDelete: (projectId: string) => Promise<void>;
  onPinToggle: (projectId: string, pinned: boolean) => Promise<void>;
};

export const ProjectsGrid = ({
  projects,
  onEdit,
  onDelete,
  onPinToggle,
}: ProjectsGridProps) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {projects.map((project) => (
      <ProjectContextMenu
        key={project.case_id}
        project={project}
        onEdit={onEdit}
        onDelete={onDelete}
        onPinToggle={onPinToggle}
      >
        <div>
          <ProjectCard project={project} />
        </div>
      </ProjectContextMenu>
    ))}
  </div>
);
