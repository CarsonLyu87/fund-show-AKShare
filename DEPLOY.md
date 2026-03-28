# 部署指南

## 项目结构

```
fund-show-AKShare/
├── src/                    # 前端源代码
├── api/                   # Python后端API
├── public/               # 静态资源
├── package.json          # 前端依赖
├── vite.config.ts        # Vite配置
├── README.md            # 项目说明
└── DEPLOY.md            # 部署指南
```

## 部署方式

### 1. 本地开发

#### 前端开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

#### 后端API开发
```bash
# 进入API目录
cd api

# 安装Python依赖
pip install -r requirements.txt

# 启动API服务
python akshare_api.py
```

### 2. 构建生产版本

```bash
# 构建前端
npm run build

# 构建结果在 dist/ 目录
```

### 3. GitHub Pages部署

```bash
# 安装gh-pages
npm install --save-dev gh-pages

# 部署到GitHub Pages
npm run deploy
```

### 4. Vercel部署

1. 将代码推送到GitHub仓库
2. 访问 [Vercel](https://vercel.com)
3. 导入GitHub仓库
4. 配置构建命令: `npm run build`
5. 输出目录: `dist`
6. 点击部署

### 5. 自定义服务器部署

#### 前端部署
将 `dist/` 目录中的文件上传到Web服务器（如Nginx、Apache）

#### 后端API部署
```bash
# 使用gunicorn部署（推荐）
cd api
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 akshare_api:app

# 或使用systemd服务
sudo nano /etc/systemd/system/akshare-api.service
```

## 环境配置

### 前端环境变量
创建 `.env` 文件：
```env
VITE_API_URL=http://localhost:5000
VITE_APP_TITLE=基金展示系统
```

### 后端配置
修改 `api/akshare_api.py` 中的配置：
- 端口号：默认5000
- 允许的域名：CORS配置
- 默认基金列表

## 数据源配置

项目使用AKShare获取数据，确保：
1. Python环境已安装AKShare
2. 网络可以访问AKShare数据源
3. API服务正常运行

## 故障排除

### 前端构建失败
```bash
# 清理缓存
rm -rf node_modules
rm package-lock.json
npm install

# 重新构建
npm run build
```

### 后端API无法启动
```bash
# 检查Python版本
python --version

# 检查依赖
pip list | grep -E "(Flask|akshare|pandas)"

# 检查端口占用
lsof -i :5000
```

### 数据获取失败
1. 检查网络连接
2. 验证AKShare是否正常工作
3. 检查基金代码是否正确
4. 查看API日志

## 性能优化

### 前端优化
- 启用代码分割
- 使用CDN加载库
- 启用Gzip压缩
- 配置缓存策略

### 后端优化
- 启用数据缓存
- 使用连接池
- 配置请求限流
- 启用日志轮转

## 监控和维护

### 监控指标
- API响应时间
- 数据更新频率
- 错误率
- 用户访问量

### 定期维护
1. 更新依赖包
2. 清理日志文件
3. 备份配置
4. 检查数据源可用性

## 安全建议

1. 在生产环境禁用调试模式
2. 配置HTTPS
3. 设置API访问限制
4. 定期更新依赖包
5. 监控异常访问

## 扩展功能

### 计划中的功能
- [ ] 用户登录系统
- [ ] 基金对比功能
- [ ] 自定义预警设置
- [ ] 数据导出功能
- [ ] 移动端适配优化

### 数据源扩展
- 支持更多基金数据源
- 添加股票市场数据
- 集成宏观经济数据
- 添加新闻资讯