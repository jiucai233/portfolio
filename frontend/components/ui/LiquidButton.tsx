"use client";

import React from "react";

interface LiquidButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const LiquidButton: React.FC<LiquidButtonProps> = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`
        /* 基础定位与尺寸 */
        relative flex items-center justify-center
        w-[5rem] h-[3rem] rounded-full transition-all duration-300
        
        /* 苹果液态玻璃核心公式 */
        bg-white/15 backdrop-blur-[16px] saturate-[180%]
        
        /* 液态高光边框：使用内部阴影和细边框模拟折射 */
        border border-white/30
        shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_32px_0_rgba(0,0,0,0.1)]
        
        /* 交互反馈 */
        hover:scale-[1.1] hover:bg-white/25
        active:scale-95
        
        /* 暗色模式 */
        dark:bg-black/20 dark:border-white/10
        
        ${className}
      `}
    >
      {/* 按钮表面的液态反光层 (可选) */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default LiquidButton;