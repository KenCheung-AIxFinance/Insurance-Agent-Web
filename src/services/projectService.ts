import { api } from '@/config/api';
import type { CreateCaseInput, Case } from '@/types/project';

export const ProjectService = {
    /**
     * Create a new project (case)
     */
    createProject: async (data: CreateCaseInput): Promise<Case> => {
        try {
            return await api.createProject(data);
        } catch (error) {
            console.error('ProjectService.createProject failed:', error);
            throw error;
        }
    },
};
