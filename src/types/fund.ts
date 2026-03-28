export interface FundEstimate {
  基金代码: string;
  基金名称: string;
  单位净值: number;
  日增长率: string;
  估算值: number;
  估算增长率: string;
  更新时间: string;
}

export interface FundHistory {
  净值日期: string;
  单位净值: number;
  累计净值: number;
  日增长率: string;
}

export interface FundHolding {
  股票代码: string;
  股票名称: string;
  占净值比例: string;
  持股数: number;
  持仓市值: number;
  季度: string;
}

export interface FundInfo {
  基金代码: string;
  基金简称: string;
  基金类型: string;
  发行日期: string;
  成立日期: string;
  资产规模: string;
  份额规模: string;
  基金管理人: string;
  基金托管人: string;
  基金经理: string;
}

export interface FundData {
  code: string;
  name: string;
  estimate?: FundEstimate;
  history?: FundHistory[];
  holdings?: FundHolding[];
  info?: FundInfo;
  lastUpdated: string;
}