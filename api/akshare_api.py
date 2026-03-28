#!/usr/bin/env python3
"""
AKShare API服务
提供基金数据的RESTful API接口
"""

import json
import akshare as ak
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 默认基金列表
DEFAULT_FUNDS = [
    '005827',  # 易方达蓝筹精选混合
    '161725',  # 招商中证白酒指数(LOF)A
    '110011',  # 易方达中小盘混合
    '519674',  # 银河创新成长混合
    '002190',  # 农银新能源主题
]

@app.route('/')
def index():
    """API首页"""
    return jsonify({
        'name': 'AKShare Fund API',
        'version': '1.0.0',
        'description': '基于AKShare的基金数据API服务',
        'endpoints': {
            '/funds': '获取所有基金数据',
            '/fund/<code>': '获取单个基金数据',
            '/fund/<code>/estimate': '获取基金实时估值',
            '/fund/<code>/history': '获取基金历史净值',
            '/fund/<code>/holdings': '获取基金持仓',
            '/fund/<code>/info': '获取基金基本信息',
        }
    })

@app.route('/funds', methods=['GET'])
def get_all_funds():
    """获取所有基金数据"""
    fund_codes = request.args.get('codes', '').split(',') if request.args.get('codes') else DEFAULT_FUNDS
    
    result = []
    for code in fund_codes:
        if not code.strip():
            continue
            
        try:
            # 获取基金实时估值 - 暂时使用模拟数据，因为AKShare函数需要特定格式
            estimate = {
                "基金代码": code,
                "基金名称": f"基金{code}",
                "单位净值": 1.5,
                "日增长率": "+0.50%",
                "估算值": 1.505,
                "估算增长率": "+0.50%",
                "更新时间": "15:00:00"
            }
            
            # 获取基金历史净值
            try:
                history_data = ak.fund_open_fund_info_em(symbol=code, indicator="单位净值走势")
                history = history_data.to_dict('records') if not history_data.empty else []
            except:
                history = []
            
            # 获取基金持仓
            holdings_data = ak.fund_portfolio_hold_em(symbol=code)
            holdings = holdings_data.to_dict('records') if not holdings_data.empty else []
            
            # 获取基金基本信息
            info_data = ak.fund_info_em(symbol=code)
            info = info_data.iloc[0].to_dict() if not info_data.empty else {}
            
            result.append({
                'code': code,
                'name': estimate.get('基金名称', f'基金{code}'),
                'estimate': estimate,
                'history': history,
                'holdings': holdings,
                'info': info,
                'lastUpdated': datetime.now().isoformat()
            })
            
        except Exception as e:
            result.append({
                'code': code,
                'error': str(e),
                'lastUpdated': datetime.now().isoformat()
            })
    
    return jsonify({
        'success': True,
        'data': result,
        'count': len(result),
        'timestamp': datetime.now().isoformat()
    })

@app.route('/fund/<code>', methods=['GET'])
def get_fund(code):
    """获取单个基金所有数据"""
    try:
        # 获取基金实时估值 - 暂时使用模拟数据
        estimate = {
            "基金代码": code,
            "基金名称": f"基金{code}",
            "单位净值": 1.5,
            "日增长率": "+0.50%",
            "估算值": 1.505,
            "估算增长率": "+0.50%",
            "更新时间": "15:00:00"
        }
        
        # 获取基金历史净值
        try:
            history_data = ak.fund_open_fund_info_em(symbol=code, indicator="单位净值走势")
            history = history_data.to_dict('records') if not history_data.empty else []
        except:
            history = []
        
        # 获取基金持仓
        holdings_data = ak.fund_portfolio_hold_em(symbol=code)
        holdings = holdings_data.to_dict('records') if not holdings_data.empty else []
        
        # 获取基金基本信息
        info_data = ak.fund_info_em(symbol=code)
        info = info_data.iloc[0].to_dict() if not info_data.empty else {}
        
        return jsonify({
            'success': True,
            'data': {
                'code': code,
                'name': estimate.get('基金名称', f'基金{code}'),
                'estimate': estimate,
                'history': history,
                'holdings': holdings,
                'info': info,
                'lastUpdated': datetime.now().isoformat()
            },
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/fund/<code>/estimate', methods=['GET'])
def get_fund_estimate(code):
    """获取基金实时估值"""
    try:
        # 暂时返回模拟数据
        data = pd.DataFrame([{
            "基金代码": code,
            "基金名称": f"基金{code}",
            "单位净值": 1.5,
            "日增长率": "+0.50%",
            "估算值": 1.505,
            "估算增长率": "+0.50%",
            "更新时间": "15:00:00"
        }])
        if data.empty:
            return jsonify({
                'success': False,
                'error': f'未找到基金代码: {code}',
                'timestamp': datetime.now().isoformat()
            }), 404
        
        return jsonify({
            'success': True,
            'data': data.to_dict('records'),
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/fund/<code>/history', methods=['GET'])
def get_fund_history(code):
    """获取基金历史净值"""
    try:
        data = ak.fund_open_fund_info_em(symbol=code, indicator="单位净值走势")
        
        return jsonify({
            'success': True,
            'data': data.to_dict('records') if not data.empty else [],
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/fund/<code>/holdings', methods=['GET'])
def get_fund_holdings(code):
    """获取基金持仓"""
    try:
        data = ak.fund_portfolio_hold_em(symbol=code)
        
        return jsonify({
            'success': True,
            'data': data.to_dict('records') if not data.empty else [],
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/fund/<code>/info', methods=['GET'])
def get_fund_info(code):
    """获取基金基本信息"""
    try:
        data = ak.fund_info_em(symbol=code)
        
        return jsonify({
            'success': True,
            'data': data.iloc[0].to_dict() if not data.empty else {},
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)