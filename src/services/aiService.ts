import { api } from '@/config/api';

export const AIService = {
    /**
     * Polish the summary text using AI
     */
    polishSummary: async (text: string): Promise<{original: string; polished: string}> => {
        try {
            return await api.polishSummary(text);
        } catch (error) {
            console.error('AIService.polishSummary failed:', error);
            throw error;
        }
    },
};
