FROM denoland/deno:1.40.2

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV PORT=9527

# 复制所有文件
COPY . .

# 暴露端口
EXPOSE 9527

# 启动应用（运行时下载依赖）
CMD ["deno", "run", "--allow-net", "--allow-read", "--allow-env", "main.ts"]

