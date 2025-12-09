import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader } from '@/components/ui/loader';
import { MultiSelect, Option } from "@/components/ui/multi-select";
import { mockHistory } from '../../mocks/chat';
import { mockKnowledgeBases } from '../../mocks/knowledgeBases';

type Msg = { role: 'user' | 'assistant'; content: string };

export default function ChatAssistant() {
  const [messages, setMessages] = useState<Msg[]>(mockHistory);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [selectedKnowledgeBases, setSelectedKnowledgeBases] = useState<string[]>([]);

  const knowledgeBaseOptions: Option[] = mockKnowledgeBases.map((kb) => ({
    label: kb.name,
    value: kb.id,
  }));

  const send = () => {
    if (!input.trim()) return;
    setSending(true);
    const userMsg: Msg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    // 這裡應該是將用戶問題和選定的知識庫發送到後端 API 的邏輯
    console.log('發送問題:', input.trim(), '選定的知識庫:', selectedKnowledgeBases);
    setTimeout(() => {
      const kbNames = selectedKnowledgeBases.map(id => {
        const kb = mockKnowledgeBases.find(kb => kb.id === id);
        return kb ? kb.name : '';
      }).filter(Boolean);
      const kbText = kbNames.length > 0 ? `「${kbNames.join('、')}」知識庫` : '所有知識庫';
      const reply: Msg = { role: 'assistant', content: `這是一條演示回覆：系統會基於${kbText}與規章資料庫產生回答。` };
      setMessages(prev => [...prev, reply]);
      setSending(false);
    }, 800);
  };

  return (
    <div className="grid grid-rows-[1fr_auto] gap-4 min-h-[60vh]">
      <Card className="p-4 overflow-auto">
        <div className="space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${m.role === 'user' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-800'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {sending && <Loader label="生成回覆中..." />}
        </div>
      </Card>
      <div className="flex items-center gap-2">
        <MultiSelect
          options={knowledgeBaseOptions}
          selected={selectedKnowledgeBases}
          onChange={setSelectedKnowledgeBases}
          placeholder="選擇知識庫"
          className="w-[180px]"
        />
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="輸入問題，例如：這款醫療保險的住院理賠如何申請？" rows={3} className="flex-1" />
        <Button onClick={send} disabled={sending}>發送</Button>
      </div>
    </div>
  );
}