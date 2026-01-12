from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader, WebBaseLoader, TextLoader, DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
import os

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
        docs = []
        if path_or_url.startswith("http"):
            loader = WebBaseLoader(path_or_url)
            docs = loader.load()
        elif os.path.isdir(path_or_url):
            print(f"Scanning directory: {path_or_url}")
            # Load PDFs
            try:
                pdf_loader = DirectoryLoader(path_or_url, glob="**/*.pdf", loader_cls=PyPDFLoader)
                pdf_docs = pdf_loader.load()
                print(f"Found {len(pdf_docs)} PDF documents")
                docs.extend(pdf_docs)
            except Exception as e:
                print(f"Error loading PDFs: {e}")

            # Load Markdowns
            try:
                # TextLoader default encoding might need to be explicit
                md_loader = DirectoryLoader(path_or_url, glob="**/*.md", loader_cls=TextLoader, loader_kwargs={'encoding': 'utf-8'})
                md_docs = md_loader.load()
                print(f"Found {len(md_docs)} Markdown documents")
                docs.extend(md_docs)
            except Exception as e:
                print(f"Error loading Markdowns: {e}")
        elif os.path.isfile(path_or_url):
            if path_or_url.lower().endswith('.pdf'):
                loader = PyPDFLoader(path_or_url)
                docs = loader.load()
            elif path_or_url.lower().endswith('.md'):
                loader = TextLoader(path_or_url, encoding='utf-8')
                docs = loader.load()
        
        if not docs:
            print(f"No documents found or loaded from {path_or_url}")
            return

        split_docs = self.text_splitter.split_documents(docs)
        
        if self.vector_store is None:
            self.vector_store = FAISS.from_documents(split_docs, self.embeddings)
        else:
            self.vector_store.add_documents(split_docs)

    def retrieve_context(self, query: str):
        if not self.vector_store:
            return ""
        # 检索最相关的 3 条内容
        docs = self.vector_store.similarity_search(query, k=3)
        return "\n".join([f"内容片段: {d.page_content}" for d in docs])