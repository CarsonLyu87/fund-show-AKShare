import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Select, Button, Space, Typography, Alert, Spin } from 'antd';
import { ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import FundCard from '../components/FundCard';
import FundHistoryChart from '../components/FundHistoryChart';
import FundHoldingsTable from '../components/FundHoldingsTable';
import FundInfoPanel from '../components/FundInfoPanel';
import { getAllFundsData, DEFAULT_FUNDS } from '../services/akshareService';
import { FundData } from '../types/fund';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const HomePage: React.FC = () => {
  const [funds, setFunds] = useState<FundData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFund, setSelectedFund] = useState<string>(DEFAULT_FUNDS[0]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // 加载基金数据
  const loadFundsData = async () => {
    setLoading(true);
    try {
      const data = await getAllFundsData();
      setFunds(data);
      setLastUpdate(new Date().toLocaleString('zh-CN'));
      
      // 如果当前选中的基金不在数据中，选择第一个
      if (!data.find(f => f.code === selectedFund) && data.length > 0) {
        setSelectedFund(data[0].code);
      }
    } catch (error) {
      console.error('加载基金数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadFundsData();
  }, []);

  // 自动刷新
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      loadFundsData();
    }, 30000); // 30秒刷新一次
    
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // 获取选中的基金数据
  const selectedFundData = funds.find(f => f.code === selectedFund);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <Row justify="space-between" align="middle" style={{ height: '100%' }}>
          <Col>
            <Space>
              <Title level={3} style={{ margin: 0 }}>📊 基金展示系统</Title>
              <Text type="secondary">基于AKShare数据</Text>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={loadFundsData}
                loading={loading}
              >
                刷新数据
              </Button>
              <Button
                type={autoRefresh ? 'primary' : 'default'}
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? '停止自动刷新' : '开启自动刷新'}
              </Button>
              <Button icon={<PlusOutlined />}>添加基金</Button>
            </Space>
          </Col>
        </Row>
      </Header>
      
      <Content style={{ padding: '24px' }}>
        {loading && funds.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>正在加载基金数据...</div>
          </div>
        ) : (
          <>
            {/* 状态栏 */}
            <Alert
              message={
                <Space>
                  <span>数据更新时间: {lastUpdate}</span>
                  <span>•</span>
                  <span>监控基金数量: {funds.length} 只</span>
                  <span>•</span>
                  <span>自动刷新: {autoRefresh ? '开启' : '关闭'}</span>
                </Space>
              }
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />
            
            {/* 基金选择器 */}
            <Card style={{ marginBottom: 24 }}>
              <Row justify="space-between" align="middle">
                <Col>
                  <Title level={5} style={{ margin: 0 }}>选择基金查看详情</Title>
                </Col>
                <Col>
                  <Select
                    value={selectedFund}
                    onChange={setSelectedFund}
                    style={{ width: 200 }}
                    loading={loading}
                  >
                    {funds.map(fund => (
                      <Option key={fund.code} value={fund.code}>
                        {fund.name} ({fund.code})
                      </Option>
                    ))}
                  </Select>
                </Col>
              </Row>
            </Card>
            
            {/* 基金卡片网格 */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              {funds.map(fund => (
                <Col key={fund.code} xs={24} sm={12} md={8} lg={6} xl={4}>
                  <FundCard 
                    fund={fund.estimate!} 
                    loading={loading}
                  />
                </Col>
              ))}
            </Row>
            
            {/* 基金详情区域 */}
            {selectedFundData && (
              <>
                <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                  <Col span={24}>
                    <FundHistoryChart
                      data={selectedFundData.history || []}
                      loading={loading}
                      fundCode={selectedFundData.code}
                      fundName={selectedFundData.name}
                    />
                  </Col>
                </Row>
                
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={16}>
                    <FundHoldingsTable
                      data={selectedFundData.holdings || []}
                      loading={loading}
                      fundCode={selectedFundData.code}
                      fundName={selectedFundData.name}
                    />
                  </Col>
                  <Col xs={24} lg={8}>
                    <FundInfoPanel
                      data={selectedFundData.info!}
                      loading={loading}
                    />
                  </Col>
                </Row>
              </>
            )}
          </>
        )}
      </Content>
    </Layout>
  );
};

export default HomePage;