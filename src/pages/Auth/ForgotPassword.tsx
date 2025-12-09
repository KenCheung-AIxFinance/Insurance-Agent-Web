import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Mail } from 'lucide-react';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            setEmailSent(true);
            toast.success('密碼重置郵件已發送，請檢查您的信箱');
        } catch (error: any) {
            console.error('Password reset error:', error);
            if (error.code === 'auth/user-not-found') {
                toast.error('找不到此電子郵件對應的帳號');
            } else if (error.code === 'auth/invalid-email') {
                toast.error('電子郵件格式不正確');
            } else {
                toast.error('發送重置郵件失敗: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen">
            <div className="pointer-events-none absolute inset-0 [background:radial-gradient(40%_30%_at_20%_20%,hsl(var(--primary)/0.10),transparent_60%),radial-gradient(30%_30%_at_80%_10%,hsl(var(--primary)/0.08),transparent_60%),radial-gradient(50%_40%_at_50%_100%,hsl(var(--primary)/0.06),transparent_60%]" />
            <div className="w-full max-w-md p-6">
                <Card className="w-full shadow-soft border bg-card/95 backdrop-blur">
                    <CardHeader className="space-y-1 text-center pb-6">
                        <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary))]/70 bg-clip-text text-transparent">
                            忘記密碼
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            {emailSent
                                ? '我們已將重置連結發送至您的信箱'
                                : '輸入您的電子郵件，我們將發送密碼重置連結'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!emailSent ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">電子郵件</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            className="h-11 pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11 font-medium shadow-sm"
                                    disabled={loading}
                                >
                                    {loading ? '發送中...' : '發送重置連結'}
                                </Button>

                                <div className="text-center">
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        返回登入
                                    </Link>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                                    <p className="text-sm text-green-800">
                                        請檢查 <strong>{email}</strong> 的收件匣
                                    </p>
                                    <p className="text-xs text-green-600 mt-2">
                                        如果沒有收到郵件，請檢查垃圾郵件資料夾
                                    </p>
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => setEmailSent(false)}
                                >
                                    重新發送
                                </Button>

                                <div className="text-center">
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        返回登入
                                    </Link>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;
