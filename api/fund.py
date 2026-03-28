from http.server import BaseHTTPRequestHandler
import json
import os
import sys
from datetime import datetime

# 添加AKShare到路径
try:
    import akshare as ak
    AKSHARE_AVAILABLE = True
except ImportError:
    AKSHARE_AVAILABLE = False
    print("AKShare not available, using mock data")

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_GET(self):
        # 设置CORS头
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        try:
            if self.path == '/api/fund' or self.path == '/api/fund/':
                # 获取所有基金数据
                response = self.get_all_funds()
            elif self.path.startswith('/api/fund/'):
                # 获取单个基金数据
                fund_code = self.path.split('/')[-1]
                response = self.get_fund_data(fund_code)
            else:
                response = {
                    "success": False,
                    "error": "Endpoint not found",
                    "timestamp": datetime.now().isoformat()
                }
            
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
            
        except Exception as e:
            error_response = {
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
            self.wfile.write(json.dumps(error_response, ensure_ascii=False).encode('utf-8'))
    
    def get_all_funds(self):
        """获取所有基金数据"""
        default_funds = ['005827', '161725', '110011', '519674', '002190']
        
        result = []
        for code in default_funds:
            try:
                fund_data = self.get_fund_data(code)
                if fund_data.get('success'):
                    result.append(fund_data['data'])
            except:
                # 如果获取失败，添加基础信息
                result.append({
                    'code': code,
                    'name': f'基金{code}',
                    'lastUpdated': datetime.now().isoformat(),
                    'error': 'Failed to fetch data'
                })
        
        return {
            "success": True,
            "data": result,
            "count": len(result),
            "timestamp": datetime.now().isoformat()
        }
    
    def get_fund_data(self, fund_code):
        """获取单个基金数据"""
        try:
            # 基金基本信息
            info = self.get_fund_info(fund_code)
            
            # 历史净值数据
            history = self.get_fund_history(fund_code)
            
            # 持仓数据
            holdings = self.get_fund_holdings(fund_code)
            
            # 实时估值数据
            estimate = self.get_fund_estimate(fund_code)
            
            return {
                "success": True,
                "data": {
                    "code": fund_code,
                    "name": estimate.get("基金名称", f"基金{fund_code}"),
                    "estimate": estimate,
                    "history": history,
                    "holdings": holdings,
                    "info": info,
                    "lastUpdated": datetime.now().isoformat()
                },
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    def get_fund_estimate(self, fund_code):
        """获取基金实时估值"""
        if not AKSHARE_AVAILABLE:
            # 模拟数据
            return {
                "基金代码": fund_code,
                "基金名称": f"基金{fund_code}",
                "单位净值": 1.5 + (hash(fund_code) % 100) / 100,
                "日增长率": f"+{(hash(fund_code) % 200 - 100) / 100:.2f}%",
                "估算值": 1.5 + (hash(fund_code) % 100) / 100 + 0.005,
                "估算增长率": f"+0.50%",
                "更新时间": datetime.now().strftime("%H:%M:%S")
            }
        
        try:
            # 尝试使用AKShare获取实时数据
            # 注意：AKShare的实时估值函数可能需要特定格式
            data = ak.fund_value_estimation_em(symbol=fund_code)
            if not data.empty:
                return data.iloc[-1].to_dict()
        except:
            pass
        
        # 如果AKShare失败，返回模拟数据
        return {
            "基金代码": fund_code,
            "基金名称": f"基金{fund_code}",
            "单位净值": 1.5,
            "日增长率": "+0.50%",
            "估算值": 1.505,
            "估算增长率": "+0.50%",
            "更新时间": "15:00:00"
        }
    
    def get_fund_history(self, fund_code):
        """获取基金历史净值"""
        if not AKSHARE_AVAILABLE:
            return self.get_mock_history(fund_code)
        
        try:
            data = ak.fund_open_fund_info_em(symbol=fund_code, indicator="单位净值走势")
            if not data.empty:
                return data.to_dict('records')
        except Exception as e:
            print(f"Error fetching history for {fund_code}: {e}")
        
        return self.get_mock_history(fund_code)
    
    def get_fund_holdings(self, fund_code):
        """获取基金持仓"""
        if not AKSHARE_AVAILABLE:
            return self.get_mock_holdings(fund_code)
        
        try:
            data = ak.fund_portfolio_hold_em(symbol=fund_code)
            if not data.empty:
                # 只返回前10大重仓股
                return data.head(10).to_dict('records')
        except Exception as e:
            print(f"Error fetching holdings for {fund_code}: {e}")
        
        return self.get_mock_holdings(fund_code)
    
    def get_fund_info(self, fund_code):
        """获取基金基本信息"""
        if not AKSHARE_AVAILABLE:
            return self.get_mock_info(fund_code)
        
        try:
            data = ak.fund_info_em(symbol=fund_code)
            if not data.empty:
                return data.iloc[0].to_dict()
        except Exception as e:
            print(f"Error fetching info for {fund_code}: {e}")
        
        return self.get_mock_info(fund_code)
    
    def get_mock_history(self, fund_code):
        """生成模拟历史数据"""
        history = []
        base_value = 1.5 + (hash(fund_code) % 100) / 100
        
        for i in range(30, -1, -1):
            date = datetime.now()
            date = date.replace(day=date.day - i)
            
            daily_change = (hash(f"{fund_code}{i}") % 40 - 20) / 1000
            value = base_value * (1 + daily_change * i / 30)
            
            history.append({
                "净值日期": date.strftime("%Y-%m-%d"),
                "单位净值": round(value, 4),
                "累计净值": round(value * 1.1, 4),
                "日增长率": f"{'+' if daily_change > 0 else ''}{daily_change*100:.2f}%"
            })
        
        return history
    
    def get_mock_holdings(self, fund_code):
        """生成模拟持仓数据"""
        stock_names = [
            '贵州茅台', '五粮液', '宁德时代', '腾讯控股', '美团-W',
            '招商银行', '中国平安', '隆基绿能', '药明康德', '比亚迪'
        ]
        
        holdings = []
        remaining_percent = 100
        
        for i in range(10):
            percent = i < 9 and (hash(f"{fund_code}{i}") % 15 + 5) or remaining_percent
            remaining_percent -= percent
            
            holdings.append({
                "股票代码": f"{hash(fund_code) % 100000:06d}",
                "股票名称": stock_names[i % len(stock_names)],
                "占净值比例": f"{percent:.2f}%",
                "持股数": (hash(f"{fund_code}{i}") % 1000000 + 100000),
                "持仓市值": (hash(f"{fund_code}{i}") % 1000000000 + 100000000),
                "季度": "2023Q4"
            })
        
        return holdings
    
    def get_mock_info(self, fund_code):
        """生成模拟基金信息"""
        managers = ['张坤', '刘彦春', '葛兰', '谢治宇', '朱少醒']
        custodians = ['中国工商银行', '中国建设银行', '中国银行', '招商银行', '交通银行']
        fund_types = ['混合型', '股票型', '指数型', '债券型']
        
        manager_idx = hash(fund_code) % len(managers)
        custodian_idx = hash(fund_code) % len(custodians)
        type_idx = hash(fund_code) % len(fund_types)
        
        return {
            "基金代码": fund_code,
            "基金简称": f"基金{fund_code}",
            "基金类型": fund_types[type_idx],
            "发行日期": "2020-01-01",
            "成立日期": "2020-01-15",
            "资产规模": f"{(hash(fund_code) % 100 + 50):.2f}亿元",
            "份额规模": f"{(hash(fund_code) % 50 + 20):.2f}亿份",
            "基金管理人": "易方达基金管理有限公司",
            "基金托管人": custodians[custodian_idx],
            "基金经理": managers[manager_idx]
        }