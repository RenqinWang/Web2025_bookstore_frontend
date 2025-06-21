import React, { useEffect, useState } from 'react';
import { Card, Statistic, Table, Row, Col, DatePicker, message, Spin, Typography, Divider } from 'antd';
import { Bar } from '@ant-design/plots';
import { useAuth } from '../contexts/AuthContext';
import { userService, bookService } from '../services';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const Statistics = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser && currentUser.role === 'admin';

  // 个人购书统计
  const [personalStats, setPersonalStats] = useState(null);
  const [personalLoading, setPersonalLoading] = useState(true);
  const [personalRange, setPersonalRange] = useState([]);

  // 热销榜
  const [bestSellers, setBestSellers] = useState([]);
  const [bestSellersLoading, setBestSellersLoading] = useState(false);
  const [bestSellersRange, setBestSellersRange] = useState([]);

  // 用户消费榜
  const [topUsers, setTopUsers] = useState([]);
  const [topUsersLoading, setTopUsersLoading] = useState(false);
  const [topUsersRange, setTopUsersRange] = useState([]);

  // 个人购书统计加载
  const fetchPersonalStats = async (range = []) => {
    setPersonalLoading(true);
    try {
      const params = {};
      if (range.length === 2) {
        params.start_date = range[0].format('YYYY-MM-DD');
        params.end_date = range[1].format('YYYY-MM-DD');
      }
      const data = await userService.getPurchaseStatistics(params);
      setPersonalStats(data);
      console.log(personalStats);
    } catch (e) {
      message.error('获取个人购书统计失败');
    } finally {
      setPersonalLoading(false);
    }
  };

  // 热销榜加载
  const fetchBestSellers = async (range = []) => {
    setBestSellersLoading(true);
    try {
      const params = { limit: 10 };
      if (range.length === 2) {
        params.start_date = range[0].format('YYYY-MM-DD');
        params.end_date = range[1].format('YYYY-MM-DD');
      }
      const data = await bookService.getBestSellers(params);
      setBestSellers(data);
    } catch (e) {
      message.error('获取热销榜失败');
    } finally {
      setBestSellersLoading(false);
    }
  };

  // 用户消费榜加载
  const fetchTopUsers = async (range = []) => {
    setTopUsersLoading(true);
    try {
      const params = { limit: 10 };
      if (range.length === 2) {
        params.start_date = range[0].format('YYYY-MM-DD');
        params.end_date = range[1].format('YYYY-MM-DD');
      }
      const data = await userService.getTopUsers(params);
      setTopUsers(data);
    } catch (e) {
      message.error('获取用户消费榜失败');
    } finally {
      setTopUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonalStats();
    if (isAdmin) {
      fetchBestSellers();
      fetchTopUsers();
    }
    // eslint-disable-next-line
  }, [currentUser]);

  // 个人购书统计表格
  const personalColumns = [
    { title: '书名', dataIndex: 'title', key: 'title' },
    { title: 'ISBN', dataIndex: 'isbn', key: 'isbn' },
    { title: '购买本数', dataIndex: 'quantity', key: 'quantity' },
  ];

  // 热销榜表格
  const bestSellersColumns = [
    {
      title: '封面',
      dataIndex: ['book', 'cover'],
      key: 'cover',
      render: (cover) => cover ? <img src={cover} alt="cover" style={{ width: 40, height: 56, objectFit: 'cover', borderRadius: 4 }} /> : null
    },
    { title: '书名', dataIndex: ['book', 'title'], key: 'title' },
    { title: '作者', dataIndex: ['book', 'author'], key: 'author' },
    { title: 'ISBN', dataIndex: ['book', 'isbn'], key: 'isbn' },
    { title: '销量', dataIndex: 'sold_quantity', key: 'sold_quantity' },
  ];

  // 用户消费榜表格
  const topUsersColumns = [
    { title: '用户名', dataIndex: ['user', 'username'], key: 'username' },
    { title: '姓名', dataIndex: ['user', 'name'], key: 'name' },
    { title: '累计消费金额', dataIndex: 'total_amount', key: 'total_amount', render: v => `¥${v?.toFixed(2)}` },
  ];

  // 热销榜柱状图数据
  const bestSellersBarData = bestSellers.map(item => ({
    title: item.book.title,
    销量: item.sold_quantity
  }));

  // 个人购书统计柱状图数据
  const personalBarData = (personalStats?.books || []).map(item => ({
    title: item.title,
    本数: item.quantity
  }));

  return (
    <div>
      <Title level={2}>统计数据</Title>
      <Card style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 8, fontWeight: 'bold' }}>时间范围：</div>
        <RangePicker
          value={personalRange}
          onChange={dates => {
            setPersonalRange(dates);
            fetchPersonalStats(dates || []);
          }}
          style={{ marginBottom: 16 }}
        />
        <Row gutter={24} align="middle">
          <Col span={12}>
            <Statistic title="购书总本数" value={personalStats?.total_books || 0} />
          </Col>
          <Col span={12}>
            <Statistic title="购书总金额" value={personalStats?.total_amount ? `¥${personalStats.total_amount.toFixed(2)}` : '¥0.00'} />
          </Col>
        </Row>
        <Divider />
        <Spin spinning={personalLoading}>
          <Table
            columns={personalColumns}
            dataSource={personalStats?.books || []}
            rowKey={item => item.book_id}
            pagination={false}
            style={{ marginBottom: 16 }}
          />
          <Bar
            data={personalBarData}
            yField="本数"
            xField="title"
            seriesField="title"
            legend={false}
            height={300}
            color="#1890ff"
            style={{ marginTop: 16 }}
            yAxis={{ title: { text: '本数' } }}
            xAxis={{ title: { text: '书名' } }}
          />
        </Spin>
      </Card>

      {isAdmin && (
        <>
          <Card title="热销榜（销量TOP10）" style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 8, fontWeight: 'bold' }}>时间范围：</div>
            <RangePicker
              value={bestSellersRange}
              onChange={dates => {
                setBestSellersRange(dates);
                fetchBestSellers(dates || []);
              }}
              style={{ marginBottom: 16 }}
            />
            <Spin spinning={bestSellersLoading}>
              <Table
                columns={bestSellersColumns}
                dataSource={bestSellers}
                rowKey={item => item.book.id}
                pagination={false}
                style={{ marginBottom: 16 }}
              />
              <Bar
                data={bestSellersBarData}
                xField="title"
                yField="销量"
                seriesField="title"
                legend={false}
                height={300}
                color="#faad14"
                style={{ marginTop: 16 }}
                xAxis={{ title: { text: '销量' } }}
                yAxis={{ title: { text: '书名' } }}
              />
            </Spin>
          </Card>

          <Card title="用户消费榜（TOP10）">
            <div style={{ marginBottom: 8, fontWeight: 'bold' }}>时间范围：</div>
            <RangePicker
              value={topUsersRange}
              onChange={dates => {
                setTopUsersRange(dates);
                fetchTopUsers(dates || []);
              }}
              style={{ marginBottom: 16 }}
            />
            <Spin spinning={topUsersLoading}>
              <Table
                columns={topUsersColumns}
                dataSource={topUsers}
                rowKey={item => item.user.id}
                pagination={false}
              />
            </Spin>
          </Card>
        </>
      )}
    </div>
  );
};

export default Statistics; 