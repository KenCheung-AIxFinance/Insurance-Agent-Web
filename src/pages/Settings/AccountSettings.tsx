import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
// ... existing imports ...

const AccountSettings: React.FC = () => {
    const { user } = useAuth();
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [loading, setLoading] = useState(false);

    // Password Change State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Image Cropping State
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageDataUrl = await readFile(file);
            setImageSrc(imageDataUrl as string);
            setIsDialogOpen(true);
        }
    };

    const readFile = (file: File) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => resolve(reader.result), false);
            reader.readAsDataURL(file);
        });
    };

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const showCroppedImage = async () => {
        if (!imageSrc || !croppedAreaPixels) return;
        try {
            setLoading(true);
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

            // In a real app, you would upload this blob to Firebase Storage or your backend
            // For now, we'll just demonstrate the flow or implementing updating photoURL if supported
            // Note: Firebase Auth updateProfile takes a URL, so we need to upload first.
            // Since we don't have storage setup explicitly in this task scope, we might need a workaround or mock it.
            // However, the user asked for "avatar setting" including cropping. 
            // I will assume for now we might mock the upload or if I can't upload, I'll alert the user.

            // TODO: Implement actual file upload to getting a URL
            toast.info("頭像裁切成功！(實際檔案上傳功能需連接儲存服務)");

            setIsDialogOpen(false);
        } catch (e) {
            console.error(e);
            toast.error("裁切失敗");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        // ... existing implementation ...
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordLoading(true);

        if (newPassword !== confirmPassword) {
            toast.error('兩次輸入的新密碼不符');
            setPasswordLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            toast.error('新密碼長度至少需要 6 個字元');
            setPasswordLoading(false);
            return;
        }

        if (!user || !user.email) return;

        try {
            // 1. Re-authenticate
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);

            // 2. Update Password
            await updatePassword(user, newPassword);

            toast.success('密碼已更新，請下次登入時使用新密碼');

            // Clear fields
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            console.error(error);
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
                toast.error('目前密碼錯誤');
            } else if (error.code === 'auth/weak-password') {
                toast.error('新密碼強度不足');
            } else if (error.code === 'auth/requires-recent-login') {
                toast.error('需要重新登入才能修改密碼');
            } else {
                toast.error('更新密碼失敗: ' + error.message);
            }
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>個人資料</CardTitle>
                <CardDescription>
                    更新您的個人資訊與頭像
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative group">
                        <Avatar className="h-24 w-24 cursor-pointer ring-2 ring-offset-2 ring-transparent group-hover:ring-primary transition-all">
                            <AvatarImage src={user?.photoURL || ''} />
                            <AvatarFallback className="text-2xl bg-slate-100">
                                {user?.displayName?.charAt(0) || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <Label
                            htmlFor="avatar-upload"
                            className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity"
                        >
                            <Camera className="w-6 h-6" />
                        </Label>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onFileChange}
                        />
                    </div>
                    <div className="space-y-1 text-center sm:text-left">
                        <h3 className="font-medium text-lg">{user?.displayName || '使用者'}</h3>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                    <div className="space-y-2">
                        <Label htmlFor="displayName">顯示名稱</Label>
                        <Input
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                    </div>
                    <Button disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        儲存變更
                    </Button>
                </form>

                {/* Password Change Section - Only for Email/Password users */}
                {user?.providerData.some(p => p.providerId === 'password') && (
                    <>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">安全設定</span>
                            </div>
                        </div>

                        <div className="space-y-4 max-w-md">
                            <h3 className="text-lg font-medium">修改密碼</h3>
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">目前密碼</Label>
                                    <Input
                                        id="currentPassword"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">新密碼</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">確認新密碼</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <Button type="submit" variant="outline" disabled={passwordLoading}>
                                    {passwordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    更新密碼
                                </Button>
                            </form>
                        </div>
                    </>
                )}

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>裁切頭像</DialogTitle>
                            <DialogDescription>
                                拖曳調整位置，滾動或使用滑桿縮放
                            </DialogDescription>
                        </DialogHeader>
                        <div className="relative h-64 w-full bg-slate-100 rounded-md overflow-hidden">
                            {imageSrc && (
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                    cropShape="round"
                                    showGrid={false}
                                />
                            )}
                        </div>
                        <div className="py-2">
                            <Label className="text-xs text-slate-500 mb-1 block">縮放</Label>
                            <Slider
                                value={[zoom]}
                                min={1}
                                max={3}
                                step={0.1}
                                onValueChange={(value: number[]) => setZoom(value[0])}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>取消</Button>
                            <Button onClick={showCroppedImage} disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                確認裁切
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
};

export default AccountSettings;
