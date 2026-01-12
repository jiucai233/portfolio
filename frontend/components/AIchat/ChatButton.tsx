import React from "react";
// 引入你新建的液态玻璃基础组件
import LiquidButton from "../ui/LiquidButton"; 
import { BsChatDots, BsX } from "react-icons/bs";

interface ChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

const ChatButton: React.FC<ChatButtonProps> = ({ onClick, isOpen }) => {
  return (

    <LiquidButton 
      onClick={onClick}
      className="text-zinc-800 dark:text-white" // 只负责传入图标颜色
    >
      {isOpen ? (
        <BsX size={28} className="animate-in fade-in zoom-in duration-300" />
      ) : (
        <BsChatDots size={24} className="animate-in fade-in zoom-in duration-300" />
      )}
    </LiquidButton>
  );
};

export default ChatButton;