# Fund Show AKShare

基于AKShare的基金数据展示网页，完全云端部署，无需本地运行。

## 🚀 架构特点

**完全云端解决方案**：
```
用户浏览器 → Vercel前端页面 → Vercel Python API (Serverless) → AKShare → 返回数据
```

**无需本地运行**，所有服务都在Vercel上自动运行。

## 功能特性

- 📊 基金实时估值展示
- 📈 基金历史净值走势图
- 📋 基金前十大重仓股
- ℹ️ 基金基本信息
- 🔍 多基金监控支持
- ⚡ 实时数据更新
- ☁️ 完全云端部署

## 技术架构

### 前端层
- **React 18** + **TypeScript** + **Vite**
- **Ant Design** UI组件库
- **Recharts** 数据可视化

### 后端层 (Vercel Serverless)
- **Python 3.9+** Serverless Functions
- **AKShare** 金融数据库
- **自动扩展**，无需服务器管理

### 部署平台
- **Vercel** - 全栈部署平台
- **边缘网络** - 全球快速访问
- **自动CI/CD** - Git推送即部署

## 快速开始

### 1. 部署到Vercel
1. 访问 [Vercel](https://vercel.com)
2. 导入GitHub仓库: `CarsonLyu87/fund-show-AKShare`
3. 点击部署，无需额外配置

### 2. 本地开发
```bash
# 克隆仓库
git clone https://github.com/CarsonLyu87/fund-show-AKShare.git
cd fund-show-AKShare

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 3. 构建生产版本
```bash
npm run build
```

## API接口

项目部署后，自动提供以下API：

### 获取所有基金数据
```
GET /api/fund
```

### 获取单个基金数据
```
GET /api/fund/{基金代码}
```

### 响应格式
```json
{
  "success": true,
  "data": [...],
  "timestamp": "2026-03-28T04:42:00Z"
}
```

## 默认监控基金

- 005827: 易方达蓝筹精选混合
- 161725: 招商中证白酒指数(LOF)A
- 110011: 易方达中小盘混合
- 519674: 银河创新成长混合
- 002190: 农银新能源主题

## 项目结构

```
fund-show-AKShare/
├── api/                    # Vercel Serverless Functions
│   ├── fund.py           # Python API处理
│   └── requirements.txt  # Python依赖
├── src/                  # 前端React代码
├── public/              # 静态资源
├── vercel.json          # Vercel配置
├── vite.config.ts       # Vite配置
└── package.json         # 前端依赖
```

## 数据流程

1. **用户访问** Vercel部署的网站
2. **前端请求** `/api/fund` 接口
3. **Vercel执行** Python Serverless Function
4. **Python调用** AKShare获取最新数据
5. **返回JSON** 给前端显示
6. **完全自动化**，无需人工干预

## 优势

- ✅ **无需服务器管理** - Vercel全托管
- ✅ **全球边缘网络** - 快速访问
- ✅ **自动扩展** - 根据流量自动扩容
- ✅ **免费额度** - Vercel提供免费套餐
- ✅ **实时数据** - AKShare提供最新基金数据
- ✅ **开源免费** - 完全开源，可自定义

## 许可证

MIT