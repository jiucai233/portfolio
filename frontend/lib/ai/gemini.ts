import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const getGeminiResponse = async (messages: any[], systemPrompt: string) => {
  // 未来如果你用 LangChain，就在这里替换为 ChatGoogleGenerativeAI
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
  
  const chat = model.startChat({
    history: messages.slice(0, -1), // 传入历史记录
    generationConfig: { maxOutputTokens: 1000 },
  });

  // 注入 System Prompt 的技巧：Gemini 1.5 支持 systemInstruction
  // 或者在对话开始前拼接一条模拟对话
  const result = await chat.sendMessage(messages[messages.length - 1].content);
  return result.response.text();
};