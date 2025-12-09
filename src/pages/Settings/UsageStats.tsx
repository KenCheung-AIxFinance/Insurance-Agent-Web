import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, FileText, Database, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Mock Data Generation
const generateMockData = () => {
    const data = [];
    const today = new Date();
    for (let i = 30; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            tokens: Math.floor(Math.random() * 2000) + 1000 + (Math.sin(i / 3) * 500), // Random wave-like data
            documents: Math.floor(Math.random() * 5) + 1,
        });
    }
    return data;
};

const usageData = {
    tokensUsed: 125000,
    tokensLimit: 500000,
    documentsCreated: 45,
    documentsLimit: 100,
    storageUsed: '1.2 GB',
    storageLimit: '5 GB'
};

const chartData = generateMockData();

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

            <Card className="col-span-4 overflow-hidden">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>近期消耗趨勢</CardTitle>
                            <CardDescription>
                                過去 30 天的 Token 消耗情況
                            </CardDescription>
                        </div>
                        <div className="flex items-center text-sm font-medium text-green-500 bg-green-50 px-3 py-1 rounded-full">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            +12.5% vs 上月
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pl-0">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    minTickGap={30}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                    itemStyle={{ color: '#8884d8', fontWeight: 600 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="tokens"
                                    stroke="#8884d8"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorTokens)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UsageStats;
