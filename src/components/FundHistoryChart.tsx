import React from 'react';
import { Card, Select } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FundHistory } from '../types/fund';

const { Option } = Select;

interface FundHistoryChartProps {
  data: FundHistory[];
  loading?: boolean;
  fundCode: string;
  fundName: string;
}

const FundHistoryChart: React.FC<FundHistoryChartProps> = ({ data, loading, fundCode, fundName }) => {
  const [timeRange, setTimeRange] = React.useState<'7d' | '30d' | '90d'>('30d');
  
  // 处理数据用于图表显示
  const chartData = React.useMemo(() => {
    let filteredData = [...data];
    
    // 根据时间范围过滤数据
    if (timeRange === '7d') {
      filteredData = data.slice(-7);
    } else if (timeRange === '30d') {
      filteredData = data.slice(-30);
    }
    // 90d使用全部数据
    
    return filteredData.map(item => ({
      日期: item.净值日期.split('-').slice(1).join('-'), // 显示月-日
      单位净值: item.单位净值,
      累计净值: item.累计净值,
      增长率: parseFloat(item.日增长率.replace('%', '')) || 0,
    }));
  }, [data, timeRange]);

  const formatTooltip = (value: number, name: string) => {
    if (name === '增长率') {
      return [`${value > 0 ? '+' : ''}${value.toFixed(2)}%`, '日增长率'];
    }
    return [value.toFixed(4), name];
  };

  return (
    <Card
      loading={loading}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{fundName} ({fundCode}) - 历史净值走势</span>
          <Select value={timeRange} onChange={setTimeRange} style={{ width: 100 }}>
            <Option value="7d">最近7天</Option>
            <Option value="30d">最近30天</Option>
            <Option value="90d">最近90天</Option>
          </Select>
        </div>
      }
      style={{ height: '100%' }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="日期" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            yAxisId="left"
            tick={{ fontSize: 12 }}
            label={{ value: '净值', angle: -90, position: 'insideLeft' }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12 }}
            label={{ value: '增长率%', angle: 90, position: 'insideRight' }}
          />
          <Tooltip formatter={formatTooltip} />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="单位净值"
            stroke="#1890ff"
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 4 }}
            name="单位净值"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="累计净值"
            stroke="#52c41a"
            strokeWidth={1.5}
            strokeDasharray="3 3"
            dot={false}
            name="累计净值"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="增长率"
            stroke="#ff4d4f"
            strokeWidth={1}
            dot={false}
            name="日增长率"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default FundHistoryChart;