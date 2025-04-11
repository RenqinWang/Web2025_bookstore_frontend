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
import { orderStorage } from '../utils/storage';

const { Title, Text } = Typography;

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  
  // 加载订单数据
  useEffect(() => {
    const storedOrders = orderStorage.getOrders();
    setOrders(storedOrders.sort((a, b) => new Date(b.date) - new Date(a.date)));
  }, []);
  
  // 获取订单状态标签
  const getStatusTag = (status) => {
    switch (status) {
      case '待发货':
        return <Tag icon={<ClockCircleOutlined />} color="warning">待发货</Tag>;
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
      render: amount => <Text type="danger">¥{amount.toFixed(2)}</Text>,
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
          <Text>{record.contactName}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.contactPhone}</Text>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
            <>
              <Button 
                size="small" 
                danger 
                onClick={(orderId) => { 
                  setIsModalOpen(true);
                  setCurrentOrderId(record.id);
                } }
              >
                取消订单
              </Button>
              <Modal
                title = "是否确认取消？"
                open = {isModalOpen}
                onOk = {() => {
                  setIsModalOpen(false)
                  const updatedOrders = orderStorage.updateOrderStatus(currentOrderId, '已取消');
                  setOrders(updatedOrders.sort((a, b) => new Date(b.date) - new Date(a.date)));
                }}
                onCancel = {() => {
                  setIsModalOpen(false)
                }}
                >
                <p>金额将会被退还</p>
              </Modal>
            </>
        </Space>
      ),
    },
  ];
  
  return (
    <div>
      <Title level={2}>
        <OrderedListOutlined style={{ marginRight: 8 }} />
        我的订单
      </Title>
      
      {orders.length === 0 ? (
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
    </div>
  );
};

export default Orders; 