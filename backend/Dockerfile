FROM python:3.10-slim

# 2. 设置工作目录（在容器内部的路径）
WORKDIR /app

# 3. 设置环境变量：防止 Python 生成 .pyc 字节码文件，并强制输出日志
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 4. 安装系统依赖（如 Gemini 涉及的某些底层加密库或网络组件）
# slim 镜像很小，所以需要手动加一些基础包
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 5. 先复制 requirements.txt 以利用 Docker 缓存层
# 这样如果你只改了代码没改依赖，部署速度会极快
COPY requirements.txt .

# 6. 安装 Python 依赖
RUN pip install --no-cache-dir -r requirements.txt

# 7. 复制项目所有代码到容器
COPY . .

# 8. 暴露端口（虽然 Railway 会动态分配，但这是规范做法）
EXPOSE 8000

# 9. 启动命令：使用 uvicorn 运行 FastAPI
# 注意使用 $PORT 变量，这是 Railway 等云平台的强制要求
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]