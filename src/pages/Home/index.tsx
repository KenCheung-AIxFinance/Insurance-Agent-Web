import React from "react";
import useSWR from "swr";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/general/ui/card";
import { Button } from "@/components/general/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MessagesSquare, FolderOpen, FileText } from "lucide-react";

import { mockHistory } from "@/mocks/chat";
import { Empty } from "@/components/general/ui/empty";
import { FaWandMagicSparkles } from "react-icons/fa6";

// 本頁使用 SWR 模擬加載與空狀態，後續可無縫切換至真實 API。
const fetchDelay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetchKnowledgeBases = async () => {
  await fetchDelay(800);
  // 後續替換為: await fetch(endpoints.knowledgeBases).then(res => res.json())
  return []; // 計劃書功能已移除
};

const fetchRecentChats = async () => {
  await fetchDelay(900);
  // demo：取最近 3 條訊息
  return mockHistory.slice(-5);
};

const fetchRecentDocs = async () => {
  await fetchDelay(700);
  // 初期無數據，用於展示 Empty 狀態；接入後端後替換為真實列表
  return [] as { id: string; title: string; createdAt: string }[];
};

function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const {
    data: kbs,
    isLoading: kbLoading,
    error: kbError,
  } = useSWR("home/kbs", fetchKnowledgeBases, { revalidateOnFocus: false });
  const {
    data: chats,
    isLoading: chatLoading,
    error: chatError,
  } = useSWR("home/chats", fetchRecentChats, { revalidateOnFocus: false });
  const {
    data: docs,
    isLoading: docLoading,
    error: docError,
  } = useSWR("home/docs", fetchRecentDocs, { revalidateOnFocus: false });

  return (
    <div className="space-y-6">
      {/* 快速動作區塊 */}
      <div className="bg-muted/50 rounded-lg p-6 border border-border">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
              快速開始
            </h2>
            <p className="text-muted-foreground">
              選擇一個快速動作開始使用保險助手
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button asChild>
              <Link to="/knowledge-base/new">創建知識庫</Link>
            </Button>
            <Button asChild>
              <Link to="/chat">開始對話</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="relative inline-flex overflow-hidden rounded-md p-[1px] focus:outline-none"
            >
              <Link to="/intelligent-creation">
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-md px-3 py-1 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                  <FaWandMagicSparkles className="mr-2 h-4 w-4" />
                  智能創作
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 新手教學區塊 */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            新手教學
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center text-center space-y-3">
              <FolderOpen className="h-12 w-12 text-primary mb-2" />
              <h3 className="font-semibold text-lg text-slate-800">
                1. 建立知識庫
              </h3>
              <p className="text-sm text-slate-600">
                上傳保險相關文件，建立你的專業知識庫
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <MessagesSquare className="h-12 w-12 text-primary mb-2" />
              <h3 className="font-semibold text-lg text-slate-800">
                2. 開始對話
              </h3>
              <p className="text-sm text-slate-600">
                向保險助手提問，獲得專業的保險建議
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <FileText className="h-12 w-12 text-primary mb-2" />
              <h3 className="font-semibold text-lg text-slate-800">
                3. 生成文檔
              </h3>
              <p className="text-sm text-slate-600">
                基於對話或知識庫內容，快速生成專業文檔
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-800">
          最近活動
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* 知識庫模塊 */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              知識庫
            </CardTitle>
          </CardHeader>
          <CardContent>
            {kbLoading && <ListSkeleton rows={4} />}
            {kbError && (
              <Empty
                title="載入失敗"
                description="請稍後重試"
                action={
                  <Button size="sm" asChild>
                    <Link to="/knowledge-base">前往管理</Link>
                  </Button>
                }
              />
            )}
            {!kbLoading && !kbError && (!kbs || kbs.length === 0) && (
              <Empty
                title="暫無知識庫"
                description="建立第一個知識庫開始使用"
                action={
                  <Button size="sm" asChild>
                    <Link to="/knowledge-base/new">新建知識庫</Link>
                  </Button>
                }
              />
            )}
            {!kbLoading && !kbError && kbs && kbs.length > 0 && (
              <div className="space-y-3">
                {kbs.slice(0, 5).map((kb: any) => (
                  <div
                    key={kb.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-800 line-clamp-1">
                        {kb.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {kb.createdAt}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/knowledge-base/${kb.id}`}>查看</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 最近對話模塊 */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessagesSquare className="h-5 w-5" />
              最近對話
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chatLoading && <ListSkeleton rows={4} />}
            {chatError && (
              <Empty
                title="載入失敗"
                description="請稍後重試"
                action={
                  <Button size="sm" asChild>
                    <Link to="/chat">去對話</Link>
                  </Button>
                }
              />
            )}
            {!chatLoading && !chatError && (!chats || chats.length === 0) && (
              <Empty
                title="尚無對話"
                description="向保險助手提出你的第一個問題"
                action={
                  <Button size="sm" asChild>
                    <Link to="/chat">開始聊天</Link>
                  </Button>
                }
              />
            )}
            {!chatLoading && !chatError && chats && chats.length > 0 && (
              <div className="space-y-3">
                {chats.map((m: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-800 line-clamp-1">
                        {m.title || "無標題對話"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {m.time || m.timestamp || ""}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/chat">查看</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 最近文檔生成模塊 */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              最近文檔生成
            </CardTitle>
          </CardHeader>
          <CardContent>
            {docLoading && <ListSkeleton rows={4} />}
            {docError && (
              <Empty
                title="載入失敗"
                description="請稍後重試"
                action={
                  <Button size="sm" asChild>
                    <Link to="/intelligent-creation">去創建</Link>
                  </Button>
                }
              />
            )}
            {!docLoading && !docError && (!docs || docs.length === 0) && (
              <Empty
                title="暫無生成記錄"
                description="從知識庫或聊天生成你的第一份文檔"
                action={
                  <Button size="sm" asChild>
                    <Link to="/intelligent-creation">新建文檔</Link>
                  </Button>
                }
              />
            )}
            {!docLoading && !docError && docs && docs.length > 0 && (
              <div className="space-y-3">
                {docs.map((d: any) => (
                  <div key={d.id} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-slate-800 line-clamp-1">
                        {d.title}
                      </div>
                      <div className="text-xs text-slate-500">
                        {d.createdAt}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/intelligent-creation">查看</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
