#!/bin/bash

# Fund Show AKShare 部署脚本
# 作者: 小龙
# 日期: 2026-03-28

set -e

echo "🚀 开始部署 Fund Show AKShare..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 函数：打印带颜色的消息
print_message() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "命令 $1 未找到，请先安装"
        exit 1
    fi
}

# 检查必要命令
print_message "检查系统依赖..."
check_command node
check_command npm
check_command git
check_command python3

# 显示版本信息
print_message "系统信息:"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "Python: $(python3 --version)"

# 安装前端依赖
print_message "安装前端依赖..."
if [ ! -d "node_modules" ]; then
    npm install
    print_success "前端依赖安装完成"
else
    print_warning "node_modules 已存在，跳过安装"
fi

# 检查API依赖
print_message "检查API依赖..."
if [ -d "api" ]; then
    cd api
    if [ ! -f "requirements.txt" ]; then
        print_error "API目录中未找到 requirements.txt"
        exit 1
    fi
    
    print_message "安装Python依赖..."
    if command -v pip3 &> /dev/null; then
        pip3 install -r requirements.txt
    elif command -v pip &> /dev/null; then
        pip install -r requirements.txt
    else
        print_error "未找到pip或pip3，请先安装Python包管理工具"
        exit 1
    fi
    cd ..
    print_success "API依赖安装完成"
else
    print_warning "API目录不存在，跳过API依赖安装"
fi

# 构建前端
print_message "构建前端应用..."
npm run build
print_success "前端构建完成"

# 检查构建结果
if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
    print_success "构建文件生成成功"
    echo "构建文件:"
    ls -la dist/
else
    print_error "构建失败，dist目录为空或不存在"
    exit 1
fi

# 部署选项
print_message "请选择部署方式:"
echo "1) 本地预览"
echo "2) GitHub Pages"
echo "3) 仅构建"
echo "4) 启动开发服务器"
read -p "请输入选项 (1-4): " deploy_option

case $deploy_option in
    1)
        print_message "启动本地预览..."
        npm run preview
        ;;
    2)
        print_message "部署到GitHub Pages..."
        if ! command -v gh-pages &> /dev/null; then
            print_message "安装 gh-pages..."
            npm install --save-dev gh-pages
        fi
        
        # 检查git仓库
        if [ ! -d ".git" ]; then
            print_error "当前目录不是git仓库"
            read -p "是否初始化git仓库? (y/n): " init_git
            if [ "$init_git" = "y" ]; then
                git init
                git add .
                git commit -m "初始提交"
            else
                exit 1
            fi
        fi
        
        # 部署
        npm run deploy
        print_success "已部署到GitHub Pages"
        ;;
    3)
        print_success "构建完成，文件在 dist/ 目录"
        ;;
    4)
        print_message "启动开发服务器..."
        npm run dev
        ;;
    *)
        print_error "无效选项"
        exit 1
        ;;
esac

# 显示部署信息
print_success "🎉 部署完成!"
echo ""
echo "📊 项目信息:"
echo "   前端访问: http://localhost:3000 (开发)"
echo "   后端API: http://localhost:5000 (如启动)"
echo "   构建目录: dist/"
echo ""
echo "🔧 常用命令:"
echo "   npm run dev      # 启动开发服务器"
echo "   npm run build    # 构建生产版本"
echo "   npm run preview  # 预览构建结果"
echo "   npm run deploy   # 部署到GitHub Pages"
echo ""
echo "📁 项目结构:"
echo "   src/     - 前端源代码"
echo "   api/     - Python后端API"
echo "   dist/    - 构建输出"
echo "   public/  - 静态资源"
echo ""
echo "💡 提示:"
echo "   1. 确保后端API服务已启动以获取真实数据"
echo "   2. 修改 .env 文件配置环境变量"
echo "   3. 查看 README.md 获取详细使用说明"

exit 0