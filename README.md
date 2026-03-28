# Fund Show AKShare

基于AKShare的基金数据展示网页，实时显示基金涨跌幅、历史净值、持仓等信息。

## 功能特性

- 📊 基金实时估值展示
- 📈 基金历史净值走势图
- 📋 基金前十大重仓股
- ℹ️ 基金基本信息
- 🔍 多基金监控支持
- ⚡ 实时数据更新

## 技术栈

- **前端**: React + TypeScript + Vite
- **UI组件**: Ant Design
- **图表**: Recharts
- **数据源**: AKShare (Python后端API)
- **部署**: GitHub Pages / Vercel

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 构建生产版本
```bash
npm run build
```

## 数据API

项目使用AKShare获取以下基金数据：

1. **实时估值**: `ak.fund_estimate_em(fund=fund_code)`
2. **历史净值**: `ak.fund_open_fund_info_em(fund=fund_code, indicator="单位净值走势")`
3. **持仓信息**: `ak.fund_portfolio_hold_em(symbol=fund_code)`
4. **基本信息**: `ak.fund_info_em(symbol=fund_code)`

## 默认监控基金

- 005827: 易方达蓝筹精选混合
- 161725: 招商中证白酒指数
- 110011: 易方达中小盘混合
- 519674: 银河创新成长混合
- 002190: 农银新能源主题

## 部署

### GitHub Pages
```bash
npm run deploy
```

### Vercel
直接导入GitHub仓库，自动部署。

## 许可证

MIT