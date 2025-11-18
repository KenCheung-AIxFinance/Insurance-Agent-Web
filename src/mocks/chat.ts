import type { } from 'react';

export const mockHistory = [
  { role: 'assistant', content: '您好！我是保險 RAG 助手，請問需要什麼協助？', title: '保險 RAG 助手為您服務', time: '2023-10-01 10:00:00' },
  { role: 'user', content: '健康險住院理賠怎麼申請？', title: '健康險住院理賠流程諮詢', time: '2023-10-01 10:01:00' },
  { role: 'assistant', content: '一般需提供住院證明、醫療收據等，詳細依保單條款為準。', title: '住院理賠所需文件與條款提醒', time: '2023-10-01 10:02:00' }
] as { role: 'user' | 'assistant'; content: string; title: string; time: string }[];
