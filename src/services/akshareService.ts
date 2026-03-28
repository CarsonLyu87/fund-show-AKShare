// 模拟AKShare数据服务
// 在实际部署中，这里应该连接到Python后端API

import { FundEstimate, FundHistory, FundHolding, FundInfo } from '../types/fund';

// 默认基金列表
export const DEFAULT_FUNDS = [
  '005827', // 易方达蓝筹精选混合
  '161725', // 招商中证白酒指数
  '110011', // 易方达中小盘混合
  '519674', // 银河创新成长混合
  '002190', // 农银新能源主题
];

// 基金名称映射
export const FUND_NAMES: Record<string, string> = {
  '005827': '易方达蓝筹精选混合',
  '161725': '招商中证白酒指数(LOF)A',
  '110011': '易方达中小盘混合',
  '519674': '银河创新成长混合',
  '002190': '农银新能源主题',
};

// 模拟基金实时估值数据
export const getFundEstimate = async (fundCode: string): Promise<FundEstimate> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const baseValue = 1.5 + Math.random() * 2;
  const change = (Math.random() - 0.5) * 0.1;
  
  return {
    基金代码: fundCode,
    基金名称: FUND_NAMES[fundCode] || `基金${fundCode}`,
    单位净值: baseValue,
    日增长率: change > 0 ? `+${(change * 100).toFixed(2)}%` : `${(change * 100).toFixed(2)}%`,
    估算值: baseValue * (1 + change),
    估算增长率: change > 0 ? `+${(change * 100).toFixed(2)}%` : `${(change * 100).toFixed(2)}%`,
    更新时间: new Date().toLocaleTimeString('zh-CN'),
  };
};

// 模拟基金历史净值数据
export const getFundHistory = async (fundCode: string): Promise<FundHistory[]> => {
  // 使用fundCode参数避免警告
  console.log(`获取基金 ${fundCode} 的历史数据`);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const history: FundHistory[] = [];
  const baseValue = 1.5 + Math.random() * 2;
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const dailyChange = (Math.random() - 0.5) * 0.02;
    const value = baseValue * (1 + dailyChange * i / 30);
    
    history.push({
      净值日期: date.toISOString().split('T')[0],
      单位净值: parseFloat(value.toFixed(4)),
      累计净值: parseFloat((value * 1.1).toFixed(4)),
      日增长率: dailyChange > 0 ? `+${(dailyChange * 100).toFixed(2)}%` : `${(dailyChange * 100).toFixed(2)}%`,
    });
  }
  
  return history;
};

// 模拟基金持仓数据
export const getFundHoldings = async (fundCode: string): Promise<FundHolding[]> => {
  // 使用fundCode参数避免警告
  console.log(`获取基金 ${fundCode} 的持仓数据`);
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const holdings: FundHolding[] = [];
  const stockNames = [
    '贵州茅台', '五粮液', '宁德时代', '腾讯控股', '美团-W',
    '招商银行', '中国平安', '隆基绿能', '药明康德', '比亚迪',
  ];
  
  let remainingPercent = 100;
  
  for (let i = 0; i < 10; i++) {
    const percent = i < 9 ? Math.random() * 15 + 5 : remainingPercent;
    remainingPercent -= percent;
    
    holdings.push({
      股票代码: `00000${i + 1}`,
      股票名称: stockNames[i] || `股票${i + 1}`,
      占净值比例: `${percent.toFixed(2)}%`,
      持股数: Math.floor(Math.random() * 1000000) + 100000,
      持仓市值: Math.floor(Math.random() * 1000000000) + 100000000,
      季度: '2023Q4',
    });
  }
  
  return holdings;
};

// 模拟基金基本信息
export const getFundInfo = async (fundCode: string): Promise<FundInfo> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const managers = ['张坤', '刘彦春', '葛兰', '谢治宇', '朱少醒'];
  const custodians = ['中国工商银行', '中国建设银行', '中国银行', '招商银行', '交通银行'];
  
  return {
    基金代码: fundCode,
    基金简称: FUND_NAMES[fundCode] || `基金${fundCode}`,
    基金类型: ['混合型', '股票型', '指数型', '债券型'][Math.floor(Math.random() * 4)],
    发行日期: '2020-01-01',
    成立日期: '2020-01-15',
    资产规模: `${(Math.random() * 100 + 50).toFixed(2)}亿元`,
    份额规模: `${(Math.random() * 50 + 20).toFixed(2)}亿份`,
    基金管理人: '易方达基金管理有限公司',
    基金托管人: custodians[Math.floor(Math.random() * custodians.length)],
    基金经理: managers[Math.floor(Math.random() * managers.length)],
  };
};

// 获取所有基金数据
export const getAllFundsData = async (fundCodes: string[] = DEFAULT_FUNDS) => {
  const promises = fundCodes.map(async (code) => {
    const [estimate, history, holdings, info] = await Promise.all([
      getFundEstimate(code),
      getFundHistory(code),
      getFundHoldings(code),
      getFundInfo(code),
    ]);
    
    return {
      code,
      name: estimate.基金名称,
      estimate,
      history,
      holdings,
      info,
      lastUpdated: new Date().toLocaleString('zh-CN'),
    };
  });
  
  return Promise.all(promises);
};