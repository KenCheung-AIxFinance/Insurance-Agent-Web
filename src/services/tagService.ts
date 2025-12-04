import { api } from '@/config/api';
import type { Tag } from '@/types/project';

export const TagService = {
    /**
     * Fetch all global tags for the current user
     */
    getAllTags: async (): Promise<Tag[]> => {
        try {
            const tagNames = await api.getTags();
            // Convert string array to Tag objects
            return tagNames.map((name: string) => ({
                id: name,
                name: name,
            }));
        } catch (error) {
            console.error('TagService.getAllTags failed:', error);
            throw error;
        }
    },

    /**
     * Create a new global tag
     */
    createTag: async (tagName: string): Promise<Tag> => {
        try {
            const createdName = await api.createTag(tagName);
            return {
                id: createdName,
                name: createdName,
            };
        } catch (error) {
            console.error('TagService.createTag failed:', error);
            throw error;
        }
    },

    /**
     * Delete a global tag
     */
    deleteTag: async (tagName: string): Promise<void> => {
        try {
            await api.deleteTag(tagName);
        } catch (error) {
            console.error('TagService.deleteTag failed:', error);
            throw error;
        }
    },
};
