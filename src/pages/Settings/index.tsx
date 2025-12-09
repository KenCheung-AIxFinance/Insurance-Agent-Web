import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountSettings from './AccountSettings';
import UsageStats from './UsageStats';

const SettingsPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-800">用戶設定與數據</h2>
                <p className="text-slate-500">管理您的個人資料並查看使用統計</p>
            </div>

            <Tabs defaultValue="account" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="account">帳號設定</TabsTrigger>
                    <TabsTrigger value="usage">使用量統計</TabsTrigger>
                </TabsList>

                <TabsContent value="account">
                    <AccountSettings />
                </TabsContent>

                <TabsContent value="usage">
                    <UsageStats />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SettingsPage;
