import { Link, NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/general/ui/button';
import { cn } from '@/lib/utils';
import { auth } from '../../src/firebase';
import { signOut, User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("登出時發生錯誤:", error);
    }
  };

  // 獲取用戶名稱或電子郵件的首字母大寫作為頭像
  const getUserInitials = (user: User | null) => {
    if (!user) return 'U';
    if (user.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    return user.email ? user.email.charAt(0).toUpperCase() : 'U';
  };

  const getUserDisplayName = (user: User | null) => {
    if (!user) return '';
    return user.displayName || user.email?.split('@')[0] || '使用者';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200 shadow-soft">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary" />
            <span className="font-semibold text-slate-900">InsurAgent</span>
          </Link>
          <nav className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link to="/overview">概覽</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/projects">專案</Link>
            </Button>
            <Button variant="ghost" asChild><Link to="/knowledge-base">知識庫</Link></Button>
            <Button variant="ghost" asChild><Link to="/chat">智能問答</Link></Button>
            <Button variant="ghost" asChild><Link to="/intelligent-creation">智能創作</Link></Button>
            <Button variant="ghost" asChild><Link to="/tutorials">教學文檔</Link></Button>
            {currentUser && location.pathname !== '/login' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 pl-2 pr-3 h-9">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={currentUser.photoURL || undefined} />
                      <AvatarFallback className="text-xs">
                        {getUserInitials(currentUser)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">
                      {getUserDisplayName(currentUser)}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {currentUser.displayName || '未設定名稱'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>登出</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto px-4 py-6 w-full">
        {children}
      </main>
      <footer className="border-t border-slate-200 text-sm text-slate-500">
        <div className="max-w-6xl mx-auto px-4 py-4">© 2025 InsurAgent</div>
      </footer>
    </div>
  );
}