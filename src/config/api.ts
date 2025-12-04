export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787';

import type { Case } from '@/types/project';

export const endpoints = {
  users: {
    me: `${API_BASE_URL}/users/me`,
  },
  chat: `${API_BASE_URL}/chat`,
  intelligentCreation: `${API_BASE_URL}/intelligent-creation`,
  cases: {
    base: `${API_BASE_URL}/cases`,
    me: `${API_BASE_URL}/cases/me`,
    polishSummary: `${API_BASE_URL}/cases/polish-summary`,
  },
  tags: {
    base: `${API_BASE_URL}/global_tags`,
    myTags: `${API_BASE_URL}/global_tags/me`,
  },
};

// 預留：未來可替換為實際 fetch/axios 調用
export const api = {

  createPlan: async (_payload: unknown) => { /* POST */ },
  chat: async (_message: string) => { /* POST */ },
  generateIntelligentCreation: async (data: any) => {
    try {
      const formData = new FormData();

      // 添加文件
      if (data.templateFiles) {
        data.templateFiles.forEach((file: File) => {
          formData.append('templateFiles[]', file);
        });
      }
      if (data.dataFiles) {
        data.dataFiles.forEach((file: File) => {
          formData.append('dataFiles[]', file);
        });
      }

      // 添加文本数据
      if (data.userText) {
        formData.append('userText', data.userText);
      }

      // 添加下载格式
      if (data.downloadFormat) {
        formData.append('downloadFormat', data.downloadFormat);
      }

      const response = await fetch(endpoints.intelligentCreation, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  },

  // Helper function to get authenticated headers with Firebase ID token
  getAuthHeaders: async (): Promise<HeadersInit> => {
    try {
      const { auth } = await import('@/firebase');
      const user = auth.currentUser;

      if (!user) {
        throw new Error('User not authenticated');
      }

      const idToken = await user.getIdToken();

      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      };
    } catch (error) {
      console.error('Failed to get auth headers:', error);
      throw error;
    }
  },

  // Project/Case Management
  getMyProjects: async () => {
    try {
      const headers = await api.getAuthHeaders();
      const response = await fetch(endpoints.cases.me, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch user projects:', error);
      throw error;
    }
  },

  getProjectbyId: async (projectId: string) => {
    try {
      const headers = await api.getAuthHeaders();
      const response = await fetch(`${endpoints.cases.base}/${projectId}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch project:', error);
      throw error;
    }
  },

  createProject: async (data: any) => {
    try {
      const headers = await api.getAuthHeaders();

      const response = await fetch(endpoints.cases.base, {
        method: 'POST',
        headers,
        body: JSON.stringify(data), // Backend will extract user_id from token
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  },

  // Tag Management - using real backend endpoints
  getTags: async () => {
    try {
      const headers = await api.getAuthHeaders();

      // Backend extracts user_id from token
      const response = await fetch(endpoints.tags.myTags, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Backend returns { user_id: string, tags: string[] }
      return data.tags || [];
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      // Return empty array if user has no tags yet
      return [];
    }
  },

  createTag: async (name: string) => {
    try {
      const headers = await api.getAuthHeaders();

      // Backend extracts user_id from token
      const response = await fetch(endpoints.tags.myTags, {
        method: 'POST',
        headers,
        body: JSON.stringify({ tag: name }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Backend returns the updated tags array
      // Return the newly created tag name
      return name;
    } catch (error) {
      console.error('Failed to create tag:', error);
      throw error;
    }
  },

  deleteTag: async (tagName: string) => {
    try {
      const headers = await api.getAuthHeaders();
      const encodedTagName = encodeURIComponent(tagName);
      // Backend extracts user_id from token
      const response = await fetch(`${endpoints.tags.myTags}/${encodedTagName}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to delete tag:', error);
      throw error;
    }
  },

  // Case Polishing
  polishSummary: async (content: string): Promise<{original: string; polished: string}> => {
    try {
      const headers = await api.getAuthHeaders();
      const response = await fetch(endpoints.cases.polishSummary, {
        method: 'POST',
        headers,
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to polish summary:', error);
      throw error;
    }
  },

  /**
   * Update a project
   */
  updateProject: async (caseId: string, data: Partial<Case>): Promise<Case> => {
    try {
      const headers = await api.getAuthHeaders();
      const response = await fetch(`${endpoints.cases.base}/${caseId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  },

  /**
   * Delete a project by ID
   */
  deleteProject: async (projectId: string): Promise<void> => {
    try {
      const headers = await api.getAuthHeaders();
      const response = await fetch(`${endpoints.cases.base}/${projectId}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  },
};