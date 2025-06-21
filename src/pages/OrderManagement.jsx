import React, { useState, useEffect } from 'react';
import {
  Typography,
  Table,
  Tag,
  Button,
  Space,
  Empty,
  Modal,
  Spin,
  message,
  Image,
  Descriptions,
  Form,
  Input,
  DatePicker,
  Select,
  Card,
  Row,
  Col,
  Statistic
} from 'antd';
import {
  OrderedListOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const OrderManagement = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [searchForm] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
  });
  const [searchParams, setSearchParams] = useState({});
  
  // 检查管理员权限
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!currentUser || currentUser.role !== 'admin') {
      messageApi.error('权限不足，仅管理员可访问');
      navigate('/');
      return;
    }
  }, [isAuthenticated, currentUser, navigate, messageApi]);
  
  // 加载订单数据
  const fetchOrders = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('开始获取所有用户订单数据...', params);
      const data = await orderService.getAllOrders(params);
      console.log('获取到的订单数据:', data);
      
      if (data && data.orders) {
        setOrders(data.orders);
        setPagination(prev => ({
          ...prev,
          current: data.page || 1,
          pageSize: data.page_size || 20,
          total: data.total || 0
        }));
      } else {
        console.error('订单数据格式不正确:', data);
        setOrders([]);
        throw new Error('订单数据格式不正确');
      }
    } catch (error) {
      console.error('获取订单失败:', error);
      setError(error.message || '获取订单失败');
      messageApi.error('获取订单失败: ' + (error.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (isAuthenticated && currentUser?.role === 'admin') {
      fetchOrders();
    }
  }, [isAuthenticated, currentUser]);
  
  // 获取订单状态标签
  const getStatusTag = (status) => {
    switch (status) {
      case '待支付':
        return <Tag icon={<ClockCircleOutlined />} color="warning">待支付</Tag>;
      case '已支付':
        return <Tag icon={<CheckCircleOutlined />} color="processing">已支付</Tag>;
      case '已发货':
        return <Tag icon={<TruckOutlined />} color="processing">已发货</Tag>;
      case '已完成':
        return <Tag icon={<CheckCircleOutlined />} color="success">已完成</Tag>;
      case '已取消':
        return <Tag icon={<ExclamationCircleOutlined />} color="error">已取消</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };
  
  // 处理搜索
  const handleSearch = (values) => {
    const params = {
      page: 1,
      page_size: pagination.pageSize,
      ...searchParams
    };
    
    if (values.query) {
      params.query = values.query;
    }
    if (values.status) {
      params.status = values.status;
    }
    if (values.book_title) {
      params.book_title = values.book_title;
    }
    if (values.dateRange && values.dateRange.length === 2) {
      params.start_date = values.dateRange[0].format('YYYY-MM-DD');
      params.end_date = values.dateRange[1].format('YYYY-MM-DD');
    }
    
    setSearchParams(params);
    fetchOrders(params);
  };
  
  // 处理重置
  const handleReset = () => {
    searchForm.resetFields();
    const params = {
      page: 1,
      page_size: pagination.pageSize
    };
    setSearchParams(params);
    fetchOrders(params);
  };
  
  // 处理分页变化
  const handleTableChange = (paginationInfo) => {
    const params = {
      ...searchParams,
      page: paginationInfo.current,
      page_size: paginationInfo.pageSize
    };
    setSearchParams(params);
    fetchOrders(params);
  };
  
  // 查看订单详情
  const handleViewDetail = async (orderId) => {
    setDetailLoading(true);
    setDetailModalOpen(true);
    try {
      const data = await orderService.getOrderById(orderId);
      setOrderDetail(data && data.items ? data : (data.data ? data.data : null));
    } catch (error) {
      messageApi.error('获取订单详情失败: ' + (error.message || '未知错误'));
      setOrderDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };
  
  // 统计信息
  const getStatistics = () => {
    const totalOrders = orders.length;
    const totalAmount = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    const pendingOrders = orders.filter(order => order.status === '待支付').length;
    const completedOrders = orders.filter(order => order.status === '已完成').length;
    
    return { totalOrders, totalAmount, pendingOrders, completedOrders };
  };
  
  const stats = getStatistics();
  
  // 表格列定义
  const columns = [
    {
      title: '订单号',
      dataIndex: 'id',
      key: 'id',
      render: orderNumber => <Text copyable>{orderNumber}</Text>,
      width: 150,
    },
    // {
    //   title: '用户信息',
    //   key: 'user',
    //   render: (_, record) => (
    //     <Space direction="vertical" size={0}>
    //       <Text strong>{record.user?.name || '未知用户'}</Text>
    //       <Text type="secondary" style={{ fontSize: 12 }}>
    //         <UserOutlined /> {record.user?.username || '未知'}
    //       </Text>
    //     </Space>
    //   ),
    //   width: 120,
    // },
    {
      title: '下单时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: date => new Date(date).toLocaleString(),
      width: 160,
    },
    {
      title: '订单金额',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: amount => <Text type="danger">¥{typeof amount === 'number' ? amount.toFixed(2) : '0.00'}</Text>,
      width: 100,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: status => getStatusTag(status),
      width: 100,
    },
    {
      title: '收货信息',
      key: 'shipping',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>{record.contact_name || '未设置'}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.contact_phone || '未设置'}</Text>
        </Space>
      ),
      width: 120,
    },
    {
      title: '商品数量',
      dataIndex: 'items_count',
      key: 'items_count',
      render: count => <Tag color="blue">{count || 0}</Tag>,
      width: 80,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record.id)}
          >
            查看详情
          </Button>
        </Space>
      ),
      width: 100,
      fixed: 'right',
    },
  ];
  
  return (
    <div>
      {contextHolder}
      <Title level={2}>
        <OrderedListOutlined style={{ marginRight: 8 }} />
        订单管理
      </Title>
      
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总订单数"
              value={stats.totalOrders}
              prefix={<OrderedListOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总金额"
              value={stats.totalAmount}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待支付订单"
              value={stats.pendingOrders}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已完成订单"
              value={stats.completedOrders}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>
      
      {/* 搜索表单 */}
      <Card style={{ marginBottom: 24 }}>
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: 16 }}
        >
          {/* <Form.Item name="query" label="搜索">
            <Input
              placeholder="订单号、收货人、联系电话"
              style={{ width: 200 }}
              allowClear
            />
          </Form.Item> */}
          <Form.Item name="book_title" label="书籍名称">
            <Input
              placeholder="输入书籍名称"
              style={{ width: 150 }}
              allowClear
            />
          </Form.Item>
          {/* <Form.Item name="status" label="订单状态">
            <Select
              placeholder="选择状态"
              style={{ width: 120 }}
              allowClear
            >
              <Option value="待支付">待支付</Option>
              <Option value="已支付">已支付</Option>
              <Option value="已发货">已发货</Option>
              <Option value="已完成">已完成</Option>
              <Option value="已取消">已取消</Option>
            </Select>
          </Form.Item> */}
          <Form.Item name="dateRange" label="时间范围">
            <RangePicker
              style={{ width: 240 }}
              placeholder={['开始日期', '结束日期']}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button onClick={handleReset} icon={<ReloadOutlined />}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
      
      {/* 订单表格 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" tip="正在加载订单数据..." />
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Text type="danger">{error}</Text>
          <br />
          <Button 
            onClick={() => fetchOrders(searchParams)} 
            style={{ marginTop: 16 }}
            icon={<ReloadOutlined />}
          >
            重试
          </Button>
        </div>
      ) : orders.length === 0 ? (
        <Empty
          description="暂无订单数据"
        >
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={() => fetchOrders(searchParams)}
          >
            刷新数据
          </Button>
        </Empty>
      ) : (
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
          style={{ marginBottom: 24 }}
        />
      )}
      
      {/* 订单详情模态框 */}
      <Modal
        title="订单详情"
        open={detailModalOpen}
        onCancel={() => { setDetailModalOpen(false); setOrderDetail(null); }}
        footer={null}
        width={800}
      >
        {detailLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" tip="正在加载订单详情..." />
          </div>
        ) : orderDetail ? (
          <div>
            <Descriptions bordered column={2} size="middle" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="订单号">{orderDetail.id}</Descriptions.Item>
              <Descriptions.Item label="下单时间">{new Date(orderDetail.created_at).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="订单金额">¥{orderDetail.total_amount?.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="订单状态">{getStatusTag(orderDetail.status)}</Descriptions.Item>
              <Descriptions.Item label="收货人">{orderDetail.shipping_info ? orderDetail.shipping_info.contact_name : orderDetail.contact_name}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{orderDetail.shipping_info ? orderDetail.shipping_info.contact_phone : orderDetail.contact_phone}</Descriptions.Item>
              <Descriptions.Item label="收货地址" span={2}>{orderDetail.shipping_info ? orderDetail.shipping_info.shipping_address : orderDetail.shipping_address}</Descriptions.Item>
            </Descriptions>
            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>订单书目：</div>
            <Table
              dataSource={orderDetail.items || []}
              rowKey={item => item.id}
              pagination={false}
              size="small"
              bordered
              columns={[
                {
                  title: '封面',
                  dataIndex: ['book', 'cover'],
                  key: 'cover',
                  render: (cover, record) => (
                    <Image 
                      src={cover || (record.book && record.book.cover_url)} 
                      alt={record.book?.title} 
                      width={60} 
                      height={80} 
                      style={{ objectFit: 'cover' }} 
                    />
                  ),
                  width: 80,
                },
                {
                  title: '书名',
                  dataIndex: ['book', 'title'],
                  key: 'title',
                },
                {
                  title: '作者',
                  dataIndex: ['book', 'author'],
                  key: 'author',
                },
                {
                  title: '单价',
                  dataIndex: 'price',
                  key: 'price',
                  render: price => `¥${price?.toFixed(2)}`,
                  width: 80,
                },
                {
                  title: '数量',
                  dataIndex: 'quantity',
                  key: 'quantity',
                  width: 60,
                },
                {
                  title: '小计',
                  dataIndex: 'subtotal',
                  key: 'subtotal',
                  render: subtotal => `¥${subtotal?.toFixed(2)}`,
                  width: 80,
                },
              ]}
            />
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#888' }}>暂无详情</div>
        )}
      </Modal>
    </div>
  );
};

export default OrderManagement;
