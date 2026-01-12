import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import uvicorn
import google.generativeai as genai
from dotenv import load_dotenv
from rag import RAGConnector  # 确保你创建了上个回复中的这个文件

# 1. 基础配置
load_dotenv()
app = FastAPI(title="Portfolio AI Service", version="1.0.0")

# 2. 初始化 Gemini 与 RAG 引擎
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.5-flash') 

# 初始化 RAGConnector (使用 Google Embedding)
# 注意：你需要安装 langchain-google-genai
rag = RAGConnector(api_key=api_key)

# ---------------------------------------------------------
# 重点：在服务启动时挂载数据（只执行一次）
# ---------------------------------------------------------
@app.on_event("startup")
async def startup_event():
    try:
        # 挂载本地 RAGsource 目录 (包含 PDF 和 Markdown 博客)
        base_dir = os.path.dirname(os.path.abspath(__file__))
        rag_source_dir = os.path.join(base_dir, "RAGsource")
        
        if os.path.exists(rag_source_dir):
            print(f"Loading RAG sources from: {rag_source_dir}")
            rag.add_source(rag_source_dir)
            print("RAG 数据挂载成功")
        else:
            print(f"Warning: RAGsource directory not found at {rag_source_dir}")
            
    except Exception as e:
        print(f"RAG 初始化失败: {e}")

# 3. 数据模型
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

# 4. 路由逻辑
@app.post("/v1/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        user_input = request.messages[-1].content
        
        # --- RAG 核心逻辑开始 ---
        # 1. 检索上下文
        context = rag.retrieve_context(user_input)
        
        # 2. 构建增强 Prompt
        # 采用“结论先行”的结构化指令
        system_instruction = f"""
        你是一位延世大学在读学生的个人助理。
        you are an AI assistant for a student studying at Yonsei University.
        your task is to answer questions based on the provided 【reference materials】.
        【references】：
        {context if context else "the reference materials are not found, please answer based on general knowledge and inform the user."}
        
        you should：
        - respond in the certain language used in the user's question.
        - be formal and concise, avoid unnecessary elaboration.
        - use the provided 【reference materials】 to answer the question.
        - if the answer is not found in the 【reference materials】, respond with "Based on the provided materials, I do not have sufficient information to answer that question."
        """
        # --- RAG 核心逻辑结束 ---

        # 生成回复 (合并上下文与用户输入)
        response = model.generate_content(f"{system_instruction}\n\n用户问题：{user_input}")
        
        return {"content": response.text}
    
    except Exception as e:
        print(f"AI Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "healthy", "rag_ready": rag.vector_store is not None}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)