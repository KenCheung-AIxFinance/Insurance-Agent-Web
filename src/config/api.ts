export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787';

export const endpoints = {
  users_me: `${API_BASE_URL}/users/me`,
  chat: `${API_BASE_URL}/chat`,
  intelligentCreation: `${API_BASE_URL}/intelligent-creation`,
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
};