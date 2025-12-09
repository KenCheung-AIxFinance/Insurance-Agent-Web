import { Case } from '@/types/project';
import { ProjectListItem } from './ProjectListItem';
import { ProjectContextMenu } from '@/pages/Projects/components/ProjectContextMenu';

type ProjectsListProps = {
  projects: Case[];
  onEdit: (project: Case) => void;
  onDelete: (projectId: string) => Promise<void>;
  onPinToggle: (projectId: string, pinned: boolean) => Promise<void>;
};

export const ProjectsList = ({
  projects,
  onEdit,
  onDelete,
  onPinToggle,
}: ProjectsListProps) => (
  <div className="space-y-4">
    {projects.map((project) => (
      <ProjectContextMenu
        key={project.case_id}
        project={project}
        onEdit={onEdit}
        onDelete={onDelete}
        onPinToggle={onPinToggle}
      >
        <div>
          <ProjectListItem project={project} />
        </div>
      </ProjectContextMenu>
    ))}
  </div>
);
