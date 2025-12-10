import React from 'react';
import ChatInterface from '@/components/shared/ChatInterface';
import { Case } from '@/types/project';

interface FAQModuleProps {
    projectId: string;
    project?: Case;
}

const FAQModule: React.FC<FAQModuleProps> = ({ projectId, project }) => {
    return (
        <ChatInterface
            projectId={projectId}
            projectName={project?.title}
            clientName={project?.client_name}
            showOpenInNewWindow={true}
            compact={true}
        />
    );
};

export default FAQModule;
