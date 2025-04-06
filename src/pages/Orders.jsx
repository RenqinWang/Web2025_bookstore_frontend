import React, { useState, useEffect } from 'react';
import {
  Typography,
  Table,
  Tag,
  Button,
  Space,
  Collapse,
  List,
  Avatar,
  Descriptions,
  Empty,
  Modal,
  Divider
} from 'antd';
import {
  OrderedListOutlined,
  ShoppingOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  
  // 加载订单数据
  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
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
  
  // 取消订单
  const handleCancelOrder = (orderId) => {
    Modal.confirm({
      title: '确认取消订单？',
      content: '取消订单后无法恢复，确定要继续吗？',
      onOk: () => {
        const updatedOrders = orders.map(order => {
          if (order.id === orderId) {
            return { ...order, status: '已取消' };
          }
          return order;
        });
        
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        setOrders(updatedOrders);
      }
    });
  };
  
  // 确认收货
  const handleConfirmReceive = (orderId) => {
    Modal.confirm({
      title: '确认收到商品？',
      content: '确认收货后，订单将标记为已完成状态',
      onOk: () => {
        const updatedOrders = orders.map(order => {
          if (order.id === orderId) {
            return { ...order, status: '已完成' };
          }
          return order;
        });
        
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        setOrders(updatedOrders);
      }
    });
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
          {record.status === '待发货' && (
            <Button 
              size="small" 
              danger 
              onClick={() => handleCancelOrder(record.id)}
            >
              取消订单
            </Button>
          )}
          {record.status === '已发货' && (
            <Button 
              size="small" 
              type="primary" 
              onClick={() => handleConfirmReceive(record.id)}
            >
              确认收货
            </Button>
          )}
          <Button
            size="small"
            type="link"
            onClick={() => {
              // 模拟查看订单详情，这里简单地展开折叠面板
              const element = document.getElementById(`panel-${record.id}`);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            查看详情
          </Button>
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
        <>
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            style={{ marginBottom: 24 }}
          />
          
          <Title level={3}>
            <FileTextOutlined style={{ marginRight: 8 }} />
            订单详情
          </Title>
          
          <Collapse accordion>
            {orders.map(order => (
              <Panel 
                header={
                  <Space>
                    <span>订单号：{order.id}</span>
                    <span>|</span>
                    <span>下单时间：{new Date(order.date).toLocaleString()}</span>
                    <span>|</span>
                    {getStatusTag(order.status)}
                  </Space>
                } 
                key={order.id}
                id={`panel-${order.id}`}
              >
                <Descriptions title="订单信息" bordered size="small" column={2}>
                  <Descriptions.Item label="收货人">{order.contactName}</Descriptions.Item>
                  <Descriptions.Item label="联系电话">{order.contactPhone}</Descriptions.Item>
                  <Descriptions.Item label="收货地址" span={2}>{order.shippingAddress}</Descriptions.Item>
                  <Descriptions.Item label="订单状态">{getStatusTag(order.status)}</Descriptions.Item>
                  <Descriptions.Item label="订单金额">
                    <Text type="danger">¥{order.totalAmount.toFixed(2)}</Text>
                  </Descriptions.Item>
                </Descriptions>
                
                <Divider orientation="left">商品列表</Divider>
                
                <List
                  itemLayout="horizontal"
                  dataSource={order.items}
                  renderItem={item => (
                    <List.Item
                      actions={[
                        <Text type="secondary">x{item.quantity}</Text>,
                        <Text type="danger">¥{(item.price * item.quantity).toFixed(2)}</Text>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar shape="square" size={64} src={item.cover} />}
                        title={
                          <a onClick={() => navigate(`/book/${item.id}`)}>{item.title}</a>
                        }
                        description={`作者: ${item.author} | 单价: ¥${item.price.toFixed(2)}`}
                      />
                    </List.Item>
                  )}
                />
                
                <div style={{ textAlign: 'right', marginTop: 16 }}>
                  <Space>
                    {order.status === '待发货' && (
                      <Button danger onClick={() => handleCancelOrder(order.id)}>
                        取消订单
                      </Button>
                    )}
                    {order.status === '已发货' && (
                      <Button type="primary" onClick={() => handleConfirmReceive(order.id)}>
                        确认收货
                      </Button>
                    )}
                    <Button onClick={() => navigate('/')}>继续购物</Button>
                  </Space>
                </div>
              </Panel>
            ))}
          </Collapse>
        </>
      )}
    </div>
  );
};

export default Orders; 