import React from 'react';
import { Card, Statistic, Tag, Progress, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { FundEstimate } from '../types/fund';

interface FundCardProps {
  fund: FundEstimate;
  loading?: boolean;
}

const FundCard: React.FC<FundCardProps> = ({ fund, loading }) => {
  const growthRate = parseFloat(fund.日增长率.replace('%', ''));
  const isPositive = growthRate > 0;
  const isNegative = growthRate < 0;
  
  const formatValue = (value: number) => {
    return value.toFixed(4);
  };

  return (
    <Card
      loading={loading}
      title={
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{fund.基金名称}</div>
          <Tag color="blue">{fund.基金代码}</Tag>
        </Space>
      }
      extra={
        <Tag color={isPositive ? 'success' : isNegative ? 'error' : 'default'}>
          {isPositive ? <ArrowUpOutlined /> : isNegative ? <ArrowDownOutlined /> : null}
          {fund.日增长率}
        </Tag>
      }
      style={{ height: '100%' }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Statistic
          title="单位净值"
          value={formatValue(fund.单位净值)}
          precision={4}
          valueStyle={{ color: '#1890ff' }}
        />
        
        <Statistic
          title="估算净值"
          value={formatValue(fund.估算值)}
          precision={4}
          valueStyle={{ 
            color: isPositive ? '#3f8600' : isNegative ? '#cf1322' : '#d4d4d4',
            fontWeight: 'bold'
          }}
        />
        
        <div>
          <div style={{ marginBottom: 8, fontSize: '12px', color: '#666' }}>
            估值准确度
          </div>
          <Progress 
            percent={Math.abs(growthRate) * 10} 
            size="small"
            strokeColor={isPositive ? '#52c41a' : '#ff4d4f'}
            showInfo={false}
          />
        </div>
        
        <div style={{ fontSize: '12px', color: '#999', textAlign: 'right' }}>
          更新时间: {fund.更新时间}
        </div>
      </Space>
    </Card>
  );
};

export default FundCard;