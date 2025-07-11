#!/bin/bash

# 抖音视频下载服务 - 自启动脚本
# 简单的后台自启动方案

set -e

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 配置变量
CONTAINER_NAME="douyin-video-downloader"
PORT=9527

echo -e "${BLUE}🚀 抖音视频下载服务 - 自启动配置${NC}"
echo "=================================================="

# 检查Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker未安装，请先安装Docker${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose未安装，请先安装Docker Compose${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker环境检查通过${NC}"

# 停止现有容器（如果存在）
echo -e "${BLUE}🛑 停止现有服务...${NC}"
docker-compose down 2>/dev/null || true

# 构建并启动容器（后台运行）
echo -e "${BLUE}🔨 构建并启动服务（后台运行）...${NC}"
docker-compose up -d --build

# 等待服务启动
echo -e "${BLUE}⏳ 等待服务启动...${NC}"
sleep 5

# 检查容器状态
if docker ps | grep -q $CONTAINER_NAME; then
    echo -e "${GREEN}🎉 服务启动成功！${NC}"
    echo ""
    echo "📱 访问地址:"
    echo "   http://localhost:$PORT"
    echo ""
    echo "🔧 管理命令:"
    echo "   查看状态: docker-compose ps"
    echo "   查看日志: docker-compose logs -f"
    echo "   停止服务: docker-compose down"
    echo "   重启服务: docker-compose restart"
    echo ""
    echo -e "${YELLOW}💡 提示: 容器已设置为自动重启（restart: unless-stopped）${NC}"
    echo -e "${YELLOW}💡 系统重启后容器会自动启动${NC}"
else
    echo -e "${RED}❌ 服务启动失败，请检查日志${NC}"
    docker-compose logs
    exit 1
fi
