import React from 'react';
import { Card, Descriptions, Tag, Space } from 'antd';
import { FundInfo } from '../types/fund';

interface FundInfoPanelProps {
  data: FundInfo;
  loading?: boolean;
}

const FundInfoPanel: React.FC<FundInfoPanelProps> = ({ data, loading }) => {
  const getTypeColor = (type: string) => {
    const typeMap: Record<string, string> = {
      '混合型': 'blue',
      '股票型': 'red',
      '指数型': 'green',
      '债券型': 'orange',
      '货币型': 'purple',
    };
    return typeMap[type] || 'default';
  };

  return (
    <Card
      loading={loading}
      title="基金基本信息"
      style={{ height: '100%' }}
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="基金代码">
          <Tag color="blue">{data.基金代码}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="基金简称">
          <strong>{data.基金简称}</strong>
        </Descriptions.Item>
        <Descriptions.Item label="基金类型">
          <Tag color={getTypeColor(data.基金类型)}>{data.基金类型}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="发行日期">{data.发行日期}</Descriptions.Item>
        <Descriptions.Item label="成立日期">{data.成立日期}</Descriptions.Item>
        <Descriptions.Item label="资产规模">
          <Tag color="cyan">{data.资产规模}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="份额规模">
          <Tag color="geekblue">{data.份额规模}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="基金管理人">
          <Space>
            <Tag color="purple">{data.基金管理人}</Tag>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="基金托管人">
          <Tag color="green">{data.基金托管人}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="基金经理">
          <Tag color="orange">{data.基金经理}</Tag>
        </Descriptions.Item>
      </Descriptions>
      
      <div style={{ marginTop: 16, fontSize: '12px', color: '#999' }}>
        <p>💡 数据说明：</p>
        <ul style={{ margin: 0, paddingLeft: 16 }}>
          <li>基金类型决定了投资策略和风险等级</li>
          <li>资产规模反映基金的市场认可度</li>
          <li>基金经理是基金业绩的关键因素</li>
          <li>成立时间越长，历史业绩参考价值越大</li>
        </ul>
      </div>
    </Card>
  );
};

export default FundInfoPanel;