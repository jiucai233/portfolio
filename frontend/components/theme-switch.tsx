"use client";

import { useTheme } from "@/context/theme-context";
import React from "react";
import { BsMoon, BsSun } from "react-icons/bs";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
        className="
          fixed bottom-5 right-5 w-[5rem] h-[3rem] 
          /* 1. 核心玻璃感：高透明白色背景 + 强背景模糊 */
          bg-white/15 backdrop-blur-[16px] saturate-[180%] 

          /* 2. 液态边框：极细的半透明白色边框，模拟玻璃边缘高光 */
          border border-white/30 

          /* 3. 柔和阴影：使用扩散更广、透明度更低的阴影 */
          shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_32px_0_rgba(0,0,0,0.1)]
          rounded-full flex items-center justify-center 

          /* 4. 交互：平滑的缩放反馈 */
          hover:scale-[1.1] 
          active:scale-95 
          transition-all duration-300

          /* 5. 暗色模式适配：深色玻璃感 */
          dark:bg-black/20 dark:border-white/10"
      onClick={toggleTheme}
    >
      {theme === "light" ? <BsSun /> : <BsMoon />}
    </button>
  );
}
