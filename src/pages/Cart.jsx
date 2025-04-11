import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Table, 
  Button, 
  InputNumber, 
  Image, 
  Empty, 
  Space, 
  Card, 
  message,
  Modal,
  Form,
  Input
} from 'antd';
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  LeftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { cartStorage, orderStorage } from '../utils/storage';

const { Title, Text } = Typography;

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 初始化加载购物车数据
  useEffect(() => {
    const storedCartItems = cartStorage.getCartItems();
    setCartItems(storedCartItems);
  }, []);
  
  // 更新购物车本地存储
  const updateLocalStorage = (items) => {
    cartStorage.setCartItems(items);
    setCartItems(items);
  };
  
  // 移除购物车项
  const handleRemoveItem = (id) => {
    const updatedCart = cartStorage.removeFromCart(id);
    updateLocalStorage(updatedCart);
    message.success('商品已从购物车中移除');
  };
  
  // 更新购物车项数量
  const handleQuantityChange = (id, quantity) => {
    const updatedCart = cartStorage.updateCartItemQuantity(id, quantity);
    updateLocalStorage(updatedCart);
  };
  
  const handleOk = () => {
    setIsModalOpen(false);
    cartStorage.clearCart();
    updateLocalStorage([]);
    message.success('购物车已清空');
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleClearCart = () => {
    setIsModalOpen(true);
  };
  
  // 提交订单
  const handleSubmitOrder = (values) => {
    setLoading(true);
    
    // 模拟API请求延迟
    setTimeout(() => {
      // 创建新订单
      const newOrder = {
        id: Date.now(),
        items: [...cartItems],
        totalAmount: cartStorage.calculateCartTotal(),
        status: '待发货',
        date: new Date().toISOString(),
        shippingAddress: values.address,
        contactPhone: values.phone,
        contactName: values.name
      };
      
      // 添加新订单并保存
      orderStorage.addOrder(newOrder);
      
      // 清空购物车
      cartStorage.clearCart();
      updateLocalStorage([]);
      
      setLoading(false);
      setCheckoutModalVisible(false);
      message.success('订单已提交成功！');
      
      // 跳转到订单页面
      navigate('/orders');
    }, 1500);
  };
  
  // 计算总价
  const calculateTotal = () => {
    return cartStorage.calculateCartTotal();
  };
  
  // 表格列定义
  const columns = [
    {
      title: '商品',
      dataIndex: 'cover',
      key: 'cover',
      render: (cover, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image 
            src={cover} 
            alt={record.title} 
            width={80} 
            height={120} 
            style={{ objectFit: 'cover' }}
            preview={false}
          />
          <div style={{ marginLeft: 12 }}>
            <div 
              style={{ fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => navigate(`/book/${record.id}`)}
            >
              {record.title}
            </div>
            <div style={{ color: '#888' }}>作者: {record.author}</div>
          </div>
        </div>
      ),
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: (price) => <Text type="danger">¥{price.toFixed(2)}</Text>,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (quantity, record) => (
        <InputNumber 
          min={1} 
          value={quantity} 
          onChange={(value) => handleQuantityChange(record.id, value)}
        />
      ),
    },
    {
      title: '小计',
      key: 'subtotal',
      align: 'center',
      render: (_, record) => (
        <Text type="danger" strong>
          ¥{(record.price * record.quantity).toFixed(2)}
        </Text>
      ),
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />} 
          onClick={() => handleRemoveItem(record.id)}
        >
          删除
        </Button>
      ),
    },
  ];
  
  // 检查购物车是否为空
  const isCartEmpty = cartItems.length === 0;
  
  return (
    <div>
      {contextHolder}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2}>
          <ShoppingCartOutlined style={{ marginRight: 8 }} />
          我的购物车
        </Title>
        <Space>
          <Button 
            icon={<LeftOutlined />} 
            onClick={() => navigate(-1)}
          >
            继续购物
          </Button>
          {!isCartEmpty && (
            <>
              <Button 
                danger 
                onClick={handleClearCart}
              >
                清空购物车
              </Button>
              <Modal 
                title = "是否清空购物车？"
                open = {isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                buttonText=""
                showButton={false}
                okText="确认"
                cancelText="取消"
                >
                <p>记录无法被找回</p>
              </Modal>
            </>
          )}
        </Space>
      </div>
      
      {isCartEmpty ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="购物车是空的，去添加一些商品吧！"
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
            dataSource={cartItems}
            rowKey="id"
            pagination={false}
            bordered
          />
          
          <Card style={{ marginTop: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <Space direction="vertical" align="end" size="large">
                <Space size="large">
                  <Text>商品总数:</Text>
                  <Text strong>
                    {cartStorage.getCartItemCount()} 件
                  </Text>
                </Space>
                <Space size="large">
                  <Text>订单总计:</Text>
                  <Text style={{ fontSize: 24 }} type="danger" strong>
                    ¥{calculateTotal().toFixed(2)}
                  </Text>
                </Space>
                <Button 
                  type="primary" 
                  size="large" 
                  onClick={() => setCheckoutModalVisible(true)}
                >
                  结算
                </Button>
              </Space>
            </div>
          </Card>
          
          {/* 结算模态框 */}
          <Modal
            title="订单结算"
            open={checkoutModalVisible}
            onCancel={() => setCheckoutModalVisible(false)}
            footer={null}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmitOrder}
            >
              <Form.Item
                label="收货人姓名"
                name="name"
                rules={[{ required: true, message: '请输入收货人姓名' }]}
              >
                <Input placeholder="请输入收货人姓名" />
              </Form.Item>
              
              <Form.Item
                label="联系电话"
                name="phone"
                rules={[{ required: true, message: '请输入联系电话' }]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
              
              <Form.Item
                label="收货地址"
                name="address"
                rules={[{ required: true, message: '请输入收货地址' }]}
              >
                <Input.TextArea rows={3} placeholder="请输入详细收货地址" />
              </Form.Item>
              
              <div style={{ borderTop: '1px solid #f0f0f0', margin: '16px 0', padding: '16px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>商品总价:</Text>
                  <Text type="danger">¥{calculateTotal().toFixed(2)}</Text>
                </div>
              </div>
              
              <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                <Space>
                  <Button onClick={() => setCheckoutModalVisible(false)}>
                    取消
                  </Button>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    提交订单
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Cart; 