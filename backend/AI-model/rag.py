from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader, WebBaseLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS

class RAGConnector:
    def __init__(self, api_key: str):
        # 使用谷歌自家的 Embedding
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/text-embedding-004",
            google_api_key=api_key
        )
        self.text_splitter = RecursiveCharacterTextSplitter(chunk_size=700, chunk_overlap=100)
        self.vector_store = None

    def add_source(self, path_or_url: str):
        if path_or_url.startswith("http"):
            loader = WebBaseLoader(path_or_url)
        else:
            loader = PyPDFLoader(path_or_url)
        
        docs = loader.load_and_split(self.text_splitter)
        if self.vector_store is None:
            self.vector_store = FAISS.from_documents(docs, self.embeddings)
        else:
            self.vector_store.add_documents(docs)

    def retrieve_context(self, query: str):
        if not self.vector_store:
            return ""
        # 检索最相关的 3 条内容
        docs = self.vector_store.similarity_search(query, k=3)
        return "\n".join([f"内容片段: {d.page_content}" for d in docs])