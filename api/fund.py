import json
from datetime import datetime

# Vercel Serverless Function 入口点
def handler(request):
    """处理HTTP请求 - Vercel Serverless Function标准格式"""
    
    # 设置CORS头
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json; charset=utf-8'
    }
    
    # 处理OPTIONS请求
    if request.method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': ''
        }
    
    try:
        path = request.path
        
        if path == '/api/fund' or path == '/api/fund/':
            # 获取所有基金数据
            response = get_all_funds()
        elif path.startswith('/api/fund/'):
            # 获取单个基金数据
            fund_code = path.split('/')[-1]
            response = get_fund_data(fund_code)
        else:
            response = {
                "success": False,
                "error": "Endpoint not found",
                "timestamp": datetime.now().isoformat()
            }
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(response, ensure_ascii=False)
        }
        
    except Exception as e:
        error_response = {
            "success": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps(error_response, ensure_ascii=False)
        }

def get_all_funds():
    """获取所有基金数据"""
    default_funds = ['005827', '161725', '110011', '519674', '002190']
    
    result = []
    for code in default_funds:
        try:
            fund_data = get_fund_data(code)
            if fund_data.get('success'):
                result.append(fund_data['data'])
            else:
                result.append({
                    'code': code,
                    'name': f'基金{code}',
                    'lastUpdated': datetime.now().isoformat(),
                    'error': fund_data.get('error', 'Unknown error')
                })
        except Exception as e:
            result.append({
                'code': code,
                'name': f'基金{code}',
                'lastUpdated': datetime.now().isoformat(),
                'error': str(e)
            })
    
    return {
        "success": True,
        "data": result,
        "count": len(result),
        "timestamp": datetime.now().isoformat()
    }

def get_fund_data(fund_code):
    """获取单个基金数据"""
    try:
        # 实时估值数据 - 这个必须有，用于基金名称
        estimate = get_fund_estimate(fund_code)
        
        # 其他数据，如果获取失败使用空数据
        try:
            info = get_fund_info(fund_code)
        except:
            info = {}
        
        try:
            history = get_fund_history(fund_code)
        except Exception as e:
            print(f"获取历史数据失败 {fund_code}: {e}")
            history = []
        
        try:
            holdings = get_fund_holdings(fund_code)
        except:
            holdings = []
        
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
        print(f"获取基金数据完全失败 {fund_code}: {e}")
        return {
            "success": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

def get_fund_estimate(fund_code):
    """获取基金实时估值"""
    # 模拟数据 - 实际部署时会使用AKShare
    import hashlib
    
    # 使用hashlib替代hash，确保一致性
    code_hash = int(hashlib.md5(fund_code.encode()).hexdigest(), 16)
    
    return {
        "基金代码": fund_code,
        "基金名称": f"基金{fund_code}",
        "单位净值": 1.5 + (code_hash % 100) / 100,
        "日增长率": f"+{(code_hash % 200 - 100) / 100:.2f}%",
        "估算值": 1.5 + (code_hash % 100) / 100 + 0.005,
        "估算增长率": f"+0.50%",
        "更新时间": datetime.now().strftime("%H:%M:%S")
    }

def get_fund_history(fund_code):
    """获取基金历史净值"""
    import hashlib
    from datetime import timedelta
    
    history = []
    code_hash = int(hashlib.md5(fund_code.encode()).hexdigest(), 16)
    base_value = 1.5 + (code_hash % 100) / 100
    
    for i in range(30, -1, -1):
        date = datetime.now() - timedelta(days=i)
        
        daily_hash = int(hashlib.md5(f"{fund_code}{i}".encode()).hexdigest(), 16)
        daily_change = (daily_hash % 40 - 20) / 1000
        value = base_value * (1 + daily_change * i / 30)
        
        history.append({
            "净值日期": date.strftime("%Y-%m-%d"),
            "单位净值": round(value, 4),
            "累计净值": round(value * 1.1, 4),
            "日增长率": f"{'+' if daily_change > 0 else ''}{daily_change*100:.2f}%"
        })
    
    return history

def get_fund_holdings(fund_code):
    """获取基金持仓"""
    import hashlib
    
    stock_names = [
        '贵州茅台', '五粮液', '宁德时代', '腾讯控股', '美团-W',
        '招商银行', '中国平安', '隆基绿能', '药明康德', '比亚迪'
    ]
    
    holdings = []
    code_hash = int(hashlib.md5(fund_code.encode()).hexdigest(), 16)
    
    # 生成前9个持仓的比例（5-20%之间）
    percentages = []
    for i in range(9):
        daily_hash = int(hashlib.md5(f"{fund_code}{i}".encode()).hexdigest(), 16)
        percent = daily_hash % 16 + 5  # 5-20%
        percentages.append(percent)
    
    # 第10个持仓用剩余的比例
    total_so_far = sum(percentages)
    last_percent = 100 - total_so_far if total_so_far < 100 else 5
    
    # 确保所有比例都是正数
    percentages.append(max(1, last_percent))
    
    # 如果总和超过100，按比例缩放
    total = sum(percentages)
    if total > 100:
        percentages = [p * 100 / total for p in percentages]
    
    for i in range(10):
        daily_hash = int(hashlib.md5(f"{fund_code}{i}".encode()).hexdigest(), 16)
        
        holdings.append({
            "股票代码": f"{code_hash % 100000:06d}",
            "股票名称": stock_names[i % len(stock_names)],
            "占净值比例": f"{percentages[i]:.2f}%",
            "持股数": (daily_hash % 1000000 + 100000),
            "持仓市值": (daily_hash % 1000000000 + 100000000),
            "季度": "2023Q4"
        })
    
    return holdings

def get_fund_info(fund_code):
    """获取基金基本信息"""
    import hashlib
    
    managers = ['张坤', '刘彦春', '葛兰', '谢治宇', '朱少醒']
    custodians = ['中国工商银行', '中国建设银行', '中国银行', '招商银行', '交通银行']
    fund_types = ['混合型', '股票型', '指数型', '债券型']
    
    code_hash = int(hashlib.md5(fund_code.encode()).hexdigest(), 16)
    manager_idx = code_hash % len(managers)
    custodian_idx = code_hash % len(custodians)
    type_idx = code_hash % len(fund_types)
    
    return {
        "基金代码": fund_code,
        "基金简称": f"基金{fund_code}",
        "基金类型": fund_types[type_idx],
        "发行日期": "2020-01-01",
        "成立日期": "2020-01-15",
        "资产规模": f"{(code_hash % 100 + 50):.2f}亿元",
        "份额规模": f"{(code_hash % 50 + 20):.2f}亿份",
        "基金管理人": "易方达基金管理有限公司",
        "基金托管人": custodians[custodian_idx],
        "基金经理": managers[manager_idx]
    }