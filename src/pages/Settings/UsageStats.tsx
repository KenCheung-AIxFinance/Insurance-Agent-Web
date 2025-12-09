import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, FileText, Database } from 'lucide-react';

// Mock Data
const usageData = {
    tokensUsed: 125000,
    tokensLimit: 500000,
    documentsCreated: 45,
    documentsLimit: 100,
    storageUsed: '1.2 GB',
    storageLimit: '5 GB'
};

const UsageStats: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Token 使用量
                        </CardTitle>
                        <Zap className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{usageData.tokensUsed.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            / {usageData.tokensLimit.toLocaleString()} (本月額度)
                        </p>
                        <div className="mt-4 h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-yellow-500"
                                style={{ width: `${(usageData.tokensUsed / usageData.tokensLimit) * 100}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            建立文檔數
                        </CardTitle>
                        <FileText className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{usageData.documentsCreated}</div>
                        <p className="text-xs text-muted-foreground">
                            / {usageData.documentsLimit} (文件上限)
                        </p>
                        <div className="mt-4 h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500"
                                style={{ width: `${(usageData.documentsCreated / usageData.documentsLimit) * 100}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            儲存空間占用
                        </CardTitle>
                        <Database className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{usageData.storageUsed}</div>
                        <p className="text-xs text-muted-foreground">
                            / {usageData.storageLimit}
                        </p>
                        <div className="mt-4 h-2 w-full bg-secondary rounded-full overflow-hidden">
                            {/* Simple mock percentage for '1.2GB/5GB' approx 24% */}
                            <div
                                className="h-full bg-purple-500"
                                style={{ width: '24%' }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>近期消耗趨勢</CardTitle>
                    <CardDescription>
                        過去 7 天的 Token 消耗情況 (模擬數據)
                    </CardDescription>
                </CardHeader>
                <CardContent className="h-[200px] flex items-center justify-center border-2 border-dashed border-slate-100 rounded-md m-4 text-slate-400">
                    此處可整合 Recharts 圖表顯示每日消耗
                </CardContent>
            </Card>
        </div>
    );
};

export default UsageStats;
