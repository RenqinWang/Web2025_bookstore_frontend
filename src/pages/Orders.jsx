import React, { useState, useEffect } from 'react';
import {
  Typography,
  Table,
  Tag,
  Button,
  Space,
  Collapse,
  Empty,
  Modal,
  Spin,
  message,
  Image,
  Descriptions,
  Form,
  Input,
  DatePicker,
  Select
} from 'antd';
import {
  OrderedListOutlined,
  ShoppingOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Orders = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [searchForm] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
  });
  const [searchParams, setSearchParams] = useState({});
  
  // 字段适配函数
  const adaptOrder = (order) => ({
    ...order,
    totalAmount: order.total_amount,
    date: order.created_at,
    contactName: order.contact_name,
    contactPhone: order.contact_phone,
  });
  
  // 加载订单数据
  const fetchOrders = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getOrders(params);
      // 兼容API返回格式
      let orderList = [];
      let total = 0, page = 1, pageSize = 10;
      if (Array.isArray(data)) {
        orderList = data;
        total = data.length;
      } else if (data && Array.isArray(data.orders)) {
        orderList = data.orders;
        total = data.total || 0;
        page = data.page || 1;
        pageSize = data.page_size || 10;
      }
      setOrders(orderList.map(adaptOrder).sort((a, b) => new Date(b.date) - new Date(a.date)));
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize: pageSize,
        total: total
      }));
    } catch (error) {
      setOrders([]);
      setError(error.message || '获取订单失败');
      messageApi.error('获取订单失败: ' + (error.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders({ page: 1, page_size: pagination.pageSize });
    // eslint-disable-next-line
  }, [navigate, isAuthenticated]);
  
  // 搜索/筛选
  const handleSearch = (values) => {
    const params = {
      page: 1,
      page_size: pagination.pageSize
    };
    if (values.status) params.status = values.status;
    if (values.query) params.query = values.query;
    if (values.dateRange && values.dateRange.length === 2) {
      params.start_date = values.dateRange[0].format('YYYY-MM-DD');
      params.end_date = values.dateRange[1].format('YYYY-MM-DD');
    }
    setSearchParams(params);
    fetchOrders(params);
  };
  
  // 重置
  const handleReset = () => {
    searchForm.resetFields();
    const params = { page: 1, page_size: pagination.pageSize };
    setSearchParams(params);
    fetchOrders(params);
  };
  
  // 分页变化
  const handleTableChange = (paginationInfo) => {
    const params = {
      ...searchParams,
      page: paginationInfo.current,
      page_size: paginationInfo.pageSize
    };
    setSearchParams(params);
    fetchOrders(params);
  };
  
  // 获取订单状态标签
  const getStatusTag = (status) => {
    switch (status) {
      case '待支付':
        return <Tag icon={<ClockCircleOutlined />} color="warning">待支付</Tag>;
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
  
  // 处理取消订单
  const handleCancelOrder = async () => {
    if (!currentOrderId) return;
    setLoading(true);
    try {
      await orderService.cancelOrder(currentOrderId);
      // 刷新订单列表
      fetchOrders(searchParams);
      messageApi.success('订单已成功取消');
    } catch (error) {
      messageApi.error('取消订单失败: ' + (error.message || '未知错误'));
    } finally {
      setIsModalOpen(false);
      setLoading(false);
    }
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
  
  // 表格列定义
  const columns = [
    {
      title: '订单号',
      dataIndex: 'id',
      key: 'id',
      render: id => <Text copyable>{id}</Text>,
    },
    {
      title: '下单时间',
      dataIndex: 'date',
      key: 'date',
      render: date => new Date(date).toLocaleString(),
    },
    {
      title: '订单金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: amount => <Text type="danger">¥{typeof amount === 'number' ? amount.toFixed(2) : '0.00'}</Text>,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: status => getStatusTag(status),
    },
    {
      title: '收货信息',
      key: 'shipping',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>{record.contactName || '未设置'}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.contactPhone || '未设置'}</Text>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.status !== '已取消' && (
              <Button 
                size="small" 
                danger 
              onClick={() => { 
                  setIsModalOpen(true);
                  setCurrentOrderId(record.id);
              }}
              disabled={loading}
              >
                取消订单
              </Button>
          )}
          <Button
            size="small"
            onClick={() => handleViewDetail(record.id)}
            disabled={loading}
          >
            查看详情
          </Button>
        </Space>
      ),
    },
  ];
  
  return (
    <div>
      {contextHolder}
      <Title level={2}>
        <OrderedListOutlined style={{ marginRight: 8 }} />
        我的订单
      </Title>
      
      {/* 筛选表单 */}
      <Form
        form={searchForm}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 16 }}
      >
        <Form.Item name="status" label="订单状态">
          <Select placeholder="全部" style={{ width: 120 }} allowClear>
            <Option value="待支付">待支付</Option>
            <Option value="已发货">已发货</Option>
            <Option value="已完成">已完成</Option>
            <Option value="已取消">已取消</Option>
          </Select>
        </Form.Item>
        <Form.Item name="query" label="搜索">
          <Input placeholder="订单号/收货人/手机号/书名" allowClear style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name="dateRange" label="下单时间">
          <RangePicker style={{ width: 240 }} />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">搜索</Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </Form.Item>
      </Form>
      
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
          >
            重试
          </Button>
        </div>
      ) : orders.length === 0 ? (
        <Empty
          description="您还没有订单，去购物吧！"
        >
          <Button
            type="primary"
            icon={<ShoppingOutlined />}
            onClick={() => navigate('/')}
          >
            去购物
          </Button>
        </Empty>
      ) : (
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          pagination={pagination}
          onChange={handleTableChange}
          style={{ marginBottom: 24 }}
        />
      )}
      
      <Modal
        title="是否确认取消？"
        open={isModalOpen}
        onOk={handleCancelOrder}
        confirmLoading={loading}
        onCancel={() => setIsModalOpen(false)}
      >
        <p>金额将会被退还</p>
      </Modal>
      
      <Modal
        title="订单详情"
        open={detailModalOpen}
        onCancel={() => { setDetailModalOpen(false); setOrderDetail(null); }}
        footer={null}
        width={700}
      >
        {detailLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" tip="正在加载订单详情..." />
          </div>
        ) : orderDetail ? (
          <div>
            <Descriptions bordered column={1} size="middle" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="订单号">{orderDetail.id}</Descriptions.Item>
              <Descriptions.Item label="下单时间">{new Date(orderDetail.created_at).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="订单金额">¥{orderDetail.total_amount?.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="订单状态">{getStatusTag(orderDetail.status)}</Descriptions.Item>
              <Descriptions.Item label="收货人">{orderDetail.shipping_info ? orderDetail.shipping_info.contact_name : orderDetail.contact_name}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{orderDetail.shipping_info ? orderDetail.shipping_info.contact_phone : orderDetail.contact_phone}</Descriptions.Item>
              <Descriptions.Item label="收货地址">{orderDetail.shipping_info ? orderDetail.shipping_info.shipping_address : orderDetail.shipping_address}</Descriptions.Item>
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
                    <Image src={cover || (record.book && record.book.cover_url)} alt={record.book?.title} width={60} height={80} style={{ objectFit: 'cover' }} />
                  ),
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
                },
                {
                  title: '数量',
                  dataIndex: 'quantity',
                  key: 'quantity',
                },
                {
                  title: '小计',
                  dataIndex: 'subtotal',
                  key: 'subtotal',
                  render: subtotal => `¥${subtotal?.toFixed(2)}`,
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

export default Orders; 