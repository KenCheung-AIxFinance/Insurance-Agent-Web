import { api } from '@/config/api';
import type { CreateCaseInput, Case } from '@/types/project';

export const ProjectService = {
    /**
     * Get all projects for the current user
     */
    getMyProjects: async (): Promise<Case[]> => {
        try {
            const projects = await api.getMyProjects();
            return projects;
        } catch (error) {
            console.error('ProjectService.getMyProjects failed:', error);
            throw error;
        }
    },

    /**
     * Create a new project (case)
     */
    createProject: async (data: CreateCaseInput): Promise<Case> => {
        try {
            const project = await api.createProject(data);
            console.log(project);
            return project;
        } catch (error) {
            console.error('ProjectService.createProject failed:', error);
            throw error;
        }
    },

    /**
     * Get project by ID
     */
    getProject: async (projectId: string): Promise<Case> => {
        try {
            return await api.getProjectbyId(projectId);
        } catch (error) {
            console.error('ProjectService.getProject failed:', error);
            throw error;
        }
    },

    /**
     * Delete a project by ID
     */
    deleteProject: async (projectId: string): Promise<void> => {
        try {
            await api.deleteProject(projectId);
        } catch (error) {
            console.error('ProjectService.deleteProject failed:', error);
            throw error;
        }
    },

    /**
     * Update a project
     */
    updateProject: async (caseId: string, data: Partial<CreateCaseInput>): Promise<Case> => {
        try {
            return await api.updateProject(caseId, data);
        } catch (error) {
            console.error('ProjectService.updateProject failed:', error);
            throw error;
        }
    },
};
