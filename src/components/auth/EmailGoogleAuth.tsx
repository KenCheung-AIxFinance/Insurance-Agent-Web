import React, { useState } from 'react';
import { auth } from '../../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
} from 'firebase/auth';
import { Input } from '../general/ui/input';
import { Button } from '../general/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../general/ui/card';
import { Label } from '../general/ui/label';

interface EmailGoogleAuthProps {
  onLoginSuccess: () => void;
}

const EmailGoogleAuth: React.FC<EmailGoogleAuthProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const handleEmailPasswordAuth = async () => {
    setError(null);
    setLoading(true);
    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        try {
          await sendEmailVerification(userCredential.user);
        } catch (e) {
          console.error('Error sending verification email:', e);
        }
        setRegisteredEmail(email);
        setVerificationSent(true);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        const user = auth.currentUser;
        if (user && !user.emailVerified) {
          try {
            await sendEmailVerification(user);
          } catch (e) {
            console.error('Error sending verification email during login flow:', e);
          }
          setRegisteredEmail(email);
          setVerificationSent(true);
        } else {
          onLoginSuccess();
        }
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Error with Email/Password auth:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message);
      console.error("Error with Google auth:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkVerificationStatus = async () => {
    setError(null);
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('找不到使用者，請重新登入或重新註冊');
        return;
      }
      await user.reload();
      if (user.emailVerified) {
        setVerificationSent(false);
        onLoginSuccess();
      } else {
        setError('尚未驗證，請前往您的信箱確認（包含垃圾郵件）');
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error checking verification status:', err);
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    setError(null);
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('找不到使用者，請重新登入或重新註冊');
        return;
      }
      await sendEmailVerification(user);
      setError('已重新發送驗證郵件，請檢查收件匣');
    } catch (err: any) {
      setError(err.message);
      console.error('Error resending verification email:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-soft border bg-card/95 backdrop-blur">
      <CardHeader className="space-y-1 text-center pb-6">
        <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary))]/70 bg-clip-text text-transparent">
          {isRegistering ? '註冊帳號' : '歡迎回來'}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {isRegistering ? '創建您的帳號開始使用' : '登入您的帳號繼續使用'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Google 登入按鈕 */}
        <Button
          onClick={handleGoogleAuth}
          className="w-full h-11 border-input bg-background text-foreground hover:bg-muted transition-colors shadow-sm"
          disabled={loading}
          variant="outline"
          aria-label="使用 Google 登入"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {loading ? '登入中...' : '使用 Google 登入'}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">或</span>
          </div>
        </div>

        {/* 電子郵件/密碼表單 */}
        {verificationSent ? (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-[hsl(var(--muted))] rounded-md">
              <p className="text-sm text-muted-foreground">已向 <strong>{registeredEmail}</strong> 發送驗證郵件。請點擊郵件中的連結完成驗證後，按下下方「我已驗證」以完成登入。</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={checkVerificationStatus} className="flex-1" disabled={loading}>我已驗證</Button>
              <Button variant="outline" onClick={resendVerification} className="flex-1" disabled={loading}>重新發送</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                電子郵件
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                密碼
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 transition-colors"
                required
              />
            </div>

            <Button
              onClick={handleEmailPasswordAuth}
              className="w-full h-11 font-medium shadow-sm"
              disabled={loading}
            >
              {loading ? (isRegistering ? '註冊中...' : '登入中...') : (isRegistering ? '註冊帳號' : '登入帳號')}
            </Button>
          </div>
        )}

        {/* 切換註冊/登入 */}
        <div className="text-center pt-2">
          <Button
            variant="ghost"
            className="text-sm text-muted-foreground hover:text-foreground hover:bg-transparent"
            onClick={() => setIsRegistering(!isRegistering)}
            disabled={loading}
          >
            {isRegistering ? '已有帳號？點此登入' : '沒有帳號？點此註冊'}
          </Button>
        </div>

        {/* 錯誤訊息 */}
        {error && (
          <div className="p-3 bg-[hsl(var(--destructive))]/10 border border-[hsl(var(--destructive))] rounded-lg">
            <p className="text-[hsl(var(--destructive))] text-sm text-center">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailGoogleAuth;
