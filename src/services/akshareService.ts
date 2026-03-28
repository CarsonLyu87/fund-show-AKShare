// Vercel API数据服务
// 连接到部署在Vercel上的Python Serverless Functions

import { FundData, FundEstimate, FundHistory, FundHolding, FundInfo } from '../types/fund';

// 默认基金列表
export const DEFAULT_FUNDS = [
  '005827', // 易方达蓝筹精选混合
  '161725', // 招商中证白酒指数(LOF)A
  '110011', // 易方达中小盘混合
  '519674', // 银河创新成长混合
  '002190', // 农银新能源主题
];

// API基础URL - 根据环境变化
const API_BASE_URL = import.meta.env.PROD 
  ? window.location.origin  // 生产环境使用当前域名
  : 'http://localhost:3000'; // 开发环境

// 获取所有基金数据
export const getAllFundsData = async (fundCodes: string[] = DEFAULT_FUNDS): Promise<FundData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/fund`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || '获取数据失败');
    }

    // 转换API返回的数据格式
    return result.data.map((item: any) => ({
      code: item.code,
      name: item.name,
      estimate: item.estimate,
      history: item.history,
      holdings: item.holdings,
      info: item.info,
      lastUpdated: item.lastUpdated,
    }));
    
  } catch (error) {
    console.error('获取基金数据失败:', error);
    
    // 如果API失败，返回模拟数据作为后备
    return getMockFundsData(fundCodes);
  }
};

// 模拟数据作为后备方案
const getMockFundsData = async (fundCodes: string[]): Promise<FundData[]> => {
  const fundNames: Record<string, string> = {
    '005827': '易方达蓝筹精选混合',
    '161725': '招商中证白酒指数(LOF)A',
    '110011': '易方达中小盘混合',
    '519674': '银河创新成长混合',
    '002190': '农银新能源主题',
  };

  const mockData: FundData[] = [];
  
  for (const code of fundCodes) {
    const baseValue = 1.5 + (parseInt(code) % 100) / 100;
    const change = (parseInt(code) % 200 - 100) / 10000;
    
    // 模拟实时估值
    const estimate: FundEstimate = {
      基金代码: code,
      基金名称: fundNames[code] || `基金${code}`,
      单位净值: baseValue,
      日增长率: change > 0 ? `+${(change * 100).toFixed(2)}%` : `${(change * 100).toFixed(2)}%`,
      估算值: baseValue * (1 + change),
      估算增长率: change > 0 ? `+${(change * 100).toFixed(2)}%` : `${(change * 100).toFixed(2)}%`,
      更新时间: new Date().toLocaleTimeString('zh-CN'),
    };

    // 模拟历史数据
    const history: FundHistory[] = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dailyChange = (parseInt(code + i.toString()) % 40 - 20) / 1000;
      const value = baseValue * (1 + dailyChange * i / 30);
      
      history.push({
        净值日期: date.toISOString().split('T')[0],
        单位净值: parseFloat(value.toFixed(4)),
        累计净值: parseFloat((value * 1.1).toFixed(4)),
        日增长率: dailyChange > 0 ? `+${(dailyChange * 100).toFixed(2)}%` : `${(dailyChange * 100).toFixed(2)}%`,
      });
    }

    // 模拟持仓数据
    const stockNames = [
      '贵州茅台', '五粮液', '宁德时代', '腾讯控股', '美团-W',
      '招商银行', '中国平安', '隆基绿能', '药明康德', '比亚迪',
    ];
    
    const holdings: FundHolding[] = [];
    let remainingPercent = 100;
    
    for (let i = 0; i < 10; i++) {
      const percent = i < 9 ? (parseInt(code + i.toString()) % 15 + 5) : remainingPercent;
      remainingPercent -= percent;
      
      holdings.push({
        股票代码: `${parseInt(code) % 100000}`.padStart(6, '0'),
        股票名称: stockNames[i % stockNames.length],
        占净值比例: `${percent.toFixed(2)}%`,
        持股数: (parseInt(code + i.toString()) % 1000000 + 100000),
        持仓市值: (parseInt(code + i.toString()) % 1000000000 + 100000000),
        季度: '2023Q4',
      });
    }

    // 模拟基本信息
    const managers = ['张坤', '刘彦春', '葛兰', '谢治宇', '朱少醒'];
    const custodians = ['中国工商银行', '中国建设银行', '中国银行', '招商银行', '交通银行'];
    const fundTypes = ['混合型', '股票型', '指数型', '债券型'];
    
    const info: FundInfo = {
      基金代码: code,
      基金简称: fundNames[code] || `基金${code}`,
      基金类型: fundTypes[parseInt(code) % fundTypes.length],
      发行日期: '2020-01-01',
      成立日期: '2020-01-15',
      资产规模: `${(parseInt(code) % 100 + 50).toFixed(2)}亿元`,
      份额规模: `${(parseInt(code) % 50 + 20).toFixed(2)}亿份`,
      基金管理人: '易方达基金管理有限公司',
      基金托管人: custodians[parseInt(code) % custodians.length],
      基金经理: managers[parseInt(code) % managers.length],
    };

    mockData.push({
      code,
      name: estimate.基金名称,
      estimate,
      history,
      holdings,
      info,
      lastUpdated: new Date().toLocaleString('zh-CN'),
    });
  }

  return mockData;
};