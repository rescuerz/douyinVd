#!/bin/bash

# 抖音无水印视频下载服务 - 快速启动脚本
# 简化版Docker部署

set -e

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🎵 抖音无水印视频下载服务 - Docker快速部署${NC}"
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

# 构建并启动服务
echo -e "${BLUE}🔨 构建并启动服务...${NC}"
docker-compose -f docker-compose.yml up -d --build

# 等待服务启动
echo -e "${BLUE}⏳ 等待服务启动...${NC}"
sleep 5

# 检查服务状态
if docker-compose -f docker-compose.yml ps | grep -q "Up"; then
    echo -e "${GREEN}🎉 服务启动成功！${NC}"
    echo ""
    echo "📱 访问地址:"
    echo "   http://localhost:9527"
    echo ""
    echo "🔧 管理命令:"
    echo "   查看状态: docker-compose -f docker-compose.yml ps"
    echo "   查看日志: docker-compose -f docker-compose.yml logs -f"
    echo "   停止服务: docker-compose -f docker-compose.yml down"
    echo "   重启服务: docker-compose -f docker-compose.yml restart"
    echo ""
    echo -e "${YELLOW}💡 提示: 在浏览器中打开 http://localhost:9527 开始使用${NC}"
else
    echo -e "${RED}❌ 服务启动失败，请检查日志${NC}"
    docker-compose -f docker-compose.yml logs
    exit 1
fi
