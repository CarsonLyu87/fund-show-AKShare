import React from 'react';
import { Card, Table, Tag, Space } from 'antd';
import { FundHolding } from '../types/fund';

interface FundHoldingsTableProps {
  data: FundHolding[];
  loading?: boolean;
  fundCode: string;
  fundName: string;
}

const FundHoldingsTable: React.FC<FundHoldingsTableProps> = ({ data, loading, fundCode, fundName }) => {
  const columns = [
    {
      title: '股票代码',
      dataIndex: '股票代码',
      key: '股票代码',
      width: 100,
    },
    {
      title: '股票名称',
      dataIndex: '股票名称',
      key: '股票名称',
      width: 120,
      render: (text: string) => (
        <Tag color="blue" style={{ fontSize: '12px' }}>
          {text}
        </Tag>
      ),
    },
    {
      title: '占净值比例',
      dataIndex: '占净值比例',
      key: '占净值比例',
      width: 120,
      sorter: (a: FundHolding, b: FundHolding) => {
        const aVal = parseFloat(a.占净值比例.replace('%', ''));
        const bVal = parseFloat(b.占净值比例.replace('%', ''));
        return aVal - bVal;
      },
      render: (text: string) => {
        const percent = parseFloat(text.replace('%', ''));
        let color = 'default';
        if (percent > 8) color = 'red';
        else if (percent > 5) color = 'orange';
        else if (percent > 3) color = 'green';
        
        return (
          <Tag color={color} style={{ fontWeight: 'bold' }}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: '持股数(万股)',
      dataIndex: '持股数',
      key: '持股数',
      width: 120,
      render: (value: number) => `${(value / 10000).toFixed(2)}`,
      sorter: (a: FundHolding, b: FundHolding) => a.持股数 - b.持股数,
    },
    {
      title: '持仓市值(亿元)',
      dataIndex: '持仓市值',
      key: '持仓市值',
      width: 140,
      render: (value: number) => `${(value / 100000000).toFixed(2)}`,
      sorter: (a: FundHolding, b: FundHolding) => a.持仓市值 - b.持仓市值,
    },
    {
      title: '季度',
      dataIndex: '季度',
      key: '季度',
      width: 80,
      render: (text: string) => (
        <Tag color="purple">{text}</Tag>
      ),
    },
  ];

  // 计算总持仓比例
  const totalPercentage = data.reduce((sum, item) => {
    return sum + parseFloat(item.占净值比例.replace('%', ''));
  }, 0);

  return (
    <Card
      loading={loading}
      title={
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div>{fundName} ({fundCode}) - 前十大重仓股</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            总持仓比例: <Tag color="cyan">{totalPercentage.toFixed(2)}%</Tag>
            <span style={{ marginLeft: 16 }}>
              数据季度: <Tag color="purple">{data[0]?.季度 || '未知'}</Tag>
            </span>
          </div>
        </Space>
      }
      style={{ height: '100%' }}
    >
      <Table
        columns={columns}
        dataSource={data.map((item, index) => ({ ...item, key: index }))}
        pagination={false}
        scroll={{ y: 400 }}
        size="small"
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={2}>
                <strong>合计</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <Tag color="cyan" style={{ fontWeight: 'bold' }}>
                  {totalPercentage.toFixed(2)}%
                </Tag>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3}>
                <strong>
                  {(
                    data.reduce((sum, item) => sum + item.持股数, 0) / 10000
                  ).toFixed(2)}
                </strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4}>
                <strong>
                  {(
                    data.reduce((sum, item) => sum + item.持仓市值, 0) / 100000000
                  ).toFixed(2)}
                </strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5}>
                <Tag color="purple">{data[0]?.季度 || '未知'}</Tag>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </Card>
  );
};

export default FundHoldingsTable;