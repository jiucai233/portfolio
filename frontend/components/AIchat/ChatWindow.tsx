import React, { useRef, useEffect } from "react";
import { Send } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import dynamic from 'next/dynamic';
import 'react-resizable/css/styles.css';
import remarkGfm from 'remark-gfm';

const ResizableBox = dynamic(
  () => import('react-resizable').then((mod) => mod.ResizableBox),
  { ssr: false } 
);
interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatWindowProps {
  messages: Message[];
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, input, setInput, onSend, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    /* 1. 用 ResizableBox 包裹原有的容器
      2. 初始值设为 [384, 480] (对应 md:w-[24rem] h-[30rem])
      3. resizeHandles 定义拉伸方向
    */
    <ResizableBox
      width={384} 
      height={480}
      minConstraints={[320, 400]} // 限制最小拉伸尺寸
      maxConstraints={[600, 800]} // 限制最大拉伸尺寸
      resizeHandles={['sw', 'nw', 'se', 'ne', 'w', 'e', 'n', 's']}
      className="relative z-50 mb-4" // z-50 确保不被底层内容遮挡
    >
      {/* 内部容器必须设为 w-full h-full */}
      <div className="bg-white dark:bg-zinc-900 w-full h-full rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-black/5 animate-in slide-in-from-bottom-2">
        
        {/* Header - 保持原样 */}
        <div className="bg-blue-600 p-4 text-white">
          <h3 className="font-bold text-sm">Yingjun's Chatbot</h3>
          <p className="text-[10px] opacity-80">Powered by Gemini</p>
        </div>

        {/* Message List */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-200">
          {messages.length === 0 && (
            <p className="text-xs text-gray-500 text-center mt-10">Ask me about my research or projects.</p>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                msg.role === "user" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
              }`}>
                {/* PROSE 优化：
                  Tailwind Typography 插件会根据父容器宽度自动调整。
                  使用 prose-sm 适合这种侧边聊天窗。
                */}
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && <div className="text-xs text-gray-400 animate-pulse">Thinking...</div>}
        </div>

        {/* Input Field - 底部固定 */}
        <div className="p-3 border-t dark:border-zinc-800 flex gap-2 bg-gray-50 dark:bg-zinc-900/50">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSend()}
            placeholder="Type your question..."
            className="flex-1 bg-white dark:bg-zinc-800 border border-black/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600 text-sm"
          />
          <button 
            onClick={onSend} 
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </ResizableBox>
  );
};

export default ChatWindow;