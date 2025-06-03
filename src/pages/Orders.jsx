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
  message
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

const Orders = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  
  // 加载订单数据
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      
      // 字段适配函数
      const adaptOrder = (order) => ({
        ...order,
        totalAmount: order.total_amount,
        date: order.created_at,
        contactName: order.contact_name,
        contactPhone: order.contact_phone,
      });
      
      try {
        console.log('开始获取订单数据...');
        const data = await orderService.getOrders();
        console.log('获取到的订单数据:', data);
        
        if (Array.isArray(data)) {
          setOrders(data.map(adaptOrder).sort((a, b) => new Date(b.date) - new Date(a.date)));
        } else if (data && Array.isArray(data.orders)) {
          setOrders(data.orders.map(adaptOrder).sort((a, b) => new Date(b.date) - new Date(a.date)));
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
    
    fetchOrders();
    //console.log(orders);
  }, [navigate, isAuthenticated, messageApi]);
  
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
      console.log('开始取消订单, ID:', currentOrderId);
      await orderService.cancelOrder(currentOrderId);
      
      // 刷新订单列表
      const updatedOrders = await orderService.getOrders();
      setOrders(
        Array.isArray(updatedOrders) 
          ? updatedOrders.map(adaptOrder).sort((a, b) => new Date(b.date) - new Date(a.date))
          : updatedOrders.orders.map(adaptOrder).sort((a, b) => new Date(b.date) - new Date(a.date))
      );
      
      messageApi.success('订单已成功取消');
    } catch (error) {
      console.error('取消订单失败:', error);
      messageApi.error('取消订单失败: ' + (error.message || '未知错误'));
    } finally {
      setIsModalOpen(false);
      setLoading(false);
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
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" tip="正在加载订单数据..." />
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Text type="danger">{error}</Text>
          <br />
          <Button 
            onClick={() => window.location.reload()} 
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
          pagination={{ pageSize: 5 }}
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
    </div>
  );
};

export default Orders; 