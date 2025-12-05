import React from 'react';
import { cn } from '@/lib/utils'; // 假設你有這個，沒有的話去掉 cn 直接用 template string

// 1. 定義 Keyframes (完全還原最初設計)
// 這裡的 scan 改回用 cubic-bezier，讓它有「掃描-停頓-掃描」的節奏感
const styles = `
  @keyframes ai-border-rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes ai-scan-light {
    0% { transform: translateY(-100%); }
    50%, 100% { transform: translateY(100%); }
  }
`;

interface AIEffectWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string; // 允許傳入背景色，例如 "bg-slate-900"
  borderGradientColor?: string; // 可選：自定義流光顏色
}

export const AIEffectWrapper: React.FC<AIEffectWrapperProps> = ({
  isLoading,
  children,
  className,
  borderGradientColor = '#6366f1' // 默認 Indigo-500
}) => {
  return (
    <div className={cn("relative group rounded-xl w-full", className)}>
      <style>{styles}</style>

      {/* --- Layer 1: 流光動畫層 (比容器大，負責旋轉) --- */}
      {/* 使用 overflow-hidden 的父層來裁切這個巨大的旋轉背景 */}
      <div className="absolute -inset-[1px] rounded-[inherit] overflow-hidden pointer-events-none">
        <div
          className={cn(
            "absolute inset-[-100%] transition-opacity duration-500",
            isLoading ? "opacity-100" : "opacity-0"
          )}
          style={{
            // 核心修改：使用平滑的透明到實色漸變，沒有雜色
            background: `conic-gradient(from 90deg at 50% 50%, #0000 0%, #0000 50%, ${borderGradientColor} 100%)`,
            animation: 'ai-border-rotate 4s linear infinite',
          }}
        />
      </div>

      {/* --- Layer 2: 背景遮罩層 (創造邊框厚度) --- */}
      {/* 這裡的背景色應該與你的卡片或輸入框背景一致 */}
      <div className={cn(
        "relative rounded-[inherit] h-full w-full z-10 overflow-hidden",
        // 默認背景色，如果傳入 className 會被覆蓋
        "bg-white", 
        className
      )}>
        
        {/* --- Layer 3: 內容區域 --- */}
        <div className={cn(
          "relative transition-all duration-300 h-full",
          isLoading ? "blur-[2px] opacity-85" : ""
        )}>
          {children}
        </div>

        {/* --- Layer 4: 掃描光束 (Overlay) --- */}
        {isLoading && (
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              // 核心修改：極淡的垂直漸變，去除白色高光，去除陰影
              background: `linear-gradient(to bottom, transparent, ${borderGradientColor}33, transparent)`, // 33 is approx 20% opacity
              animation: 'ai-scan-light 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            }}
          />
        )}
      </div>
    </div>
  );
};