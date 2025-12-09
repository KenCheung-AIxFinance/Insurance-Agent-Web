import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { updateProfile, User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { endpoints } from '@/config/api';

const ProfileSetup: React.FC = () => {
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const user = auth.currentUser;
        if (!user) {
            setError('用戶未登入');
            setLoading(false);
            return;
        }

        try {
            // 更新 Firebase 用戶資料
            await updateProfile(user, {
                displayName: displayName.trim(),
            });

            // 調用後端 API 更新用戶資料，只檢查響應狀態碼
            const idToken = await user.getIdToken();
            const response = await fetch(endpoints.users.me, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    displayName: displayName.trim(),
                }),
            });

            if (!response.ok) {
                throw new Error('更新用戶資料失敗');
            }

            // 導航到首頁
            navigate('/');
        } catch (err: any) {
            console.error('更新資料失敗:', err);
            setError(err.message || '更新資料時發生錯誤');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center h-full">
            <div className="pointer-events-none absolute inset-0 [background:radial-gradient(40%_30%_at_20%_20%,hsl(var(--primary)/0.10),transparent_60%),radial-gradient(30%_30%_at_80%_10%,hsl(var(--primary)/0.08),transparent_60%),radial-gradient(50%_40%_at_50%_100%,hsl(var(--primary)/0.06),transparent_60%]" />
            <div className="w-full max-w-md p-6">
                <Card className="w-full shadow-soft border bg-card/95 backdrop-blur">
                    <CardHeader className="space-y-1 text-center pb-6">
                        <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary))]/70 bg-clip-text text-transparent">
                            設定個人資料
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            請填寫您的顯示名稱以繼續
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="displayName">顯示名稱</Label>
                                <Input
                                    id="displayName"
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="請輸入您的顯示名稱"
                                    className="h-11"
                                    required
                                    minLength={2}
                                    maxLength={30}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 font-medium shadow-sm"
                                disabled={loading || !displayName.trim()}
                            >
                                {loading ? '儲存中...' : '完成設定'}
                            </Button>

                            {error && (
                                <div className="p-3 bg-[hsl(var(--destructive))]/10 border border-[hsl(var(--destructive))] rounded-lg">
                                    <p className="text-[hsl(var(--destructive))] text-sm text-center">{error}</p>
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProfileSetup;
