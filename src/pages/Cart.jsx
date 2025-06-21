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
  Input,
  Spin
} from 'antd';
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  LeftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { cartService, orderService } from '../services';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

const Cart = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState({ total_quantity: 0, total_amount: 0 });
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 获取购物车数据
  const fetchCartData = async () => {
    setLoading(true);
    try {
      const cartData = await cartService.getCart();
      setCartItems(cartData.items || []);
      setCartTotal({
        total_quantity: cartData.total_quantity || 0,
        total_amount: cartData.total_amount || 0
      });
    } catch (error) {
      messageApi.error('获取购物车失败：' + (error.message || '未知错误'));
      console.error('获取购物车失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 初始化加载购物车数据
  useEffect(() => {
    fetchCartData();
  }, []);
  
  // 移除购物车项
  const handleRemoveItem = async (id) => {
    try {
      await cartService.removeFromCart(id);
      fetchCartData(); // 重新获取购物车数据
      messageApi.success('商品已从购物车中移除');
    } catch (error) {
      messageApi.error('移除商品失败：' + (error.message || '未知错误'));
      console.error('移除商品失败:', error);
    }
  };
  
  // 更新购物车项数量
  const handleQuantityChange = async (id, quantity) => {
    try {
      await cartService.updateCartItem(id, quantity);
      fetchCartData(); // 重新获取购物车数据
    } catch (error) {
      messageApi.error('更新数量失败：' + (error.message || '未知错误'));
      console.error('更新数量失败:', error);
    }
  };
  
  // 清空购物车确认
  const handleOk = async () => {
    setIsModalOpen(false);
    try {
      await cartService.clearCart();
      fetchCartData(); // 重新获取购物车数据
      messageApi.success('购物车已清空');
    } catch (error) {
      messageApi.error('清空购物车失败：' + (error.message || '未知错误'));
      console.error('清空购物车失败:', error);
    }
  };
  
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  
  const handleClearCart = () => {
    setIsModalOpen(true);
  };
  
  // 提交订单
  const handleSubmitOrder = async (values) => {
    setSubmitting(true);
    console.log("正在提交订单");
    
    try {
      // 准备订单数据
      const orderData = {
        items: cartItems.map(item => ({
          book_id: item.book.id,
          quantity: item.quantity
        })),
        shipping_address: values.address,
        contact_name: values.name,
        contact_phone: values.phone
      };

      console.log(orderData);
      
      // 创建订单
      const result = await orderService.createOrder(orderData);
      console.log(result);
      
      messageApi.success('订单已提交成功！');
      setCheckoutModalVisible(false);

      await cartService.clearCart();
      //fetchCartData(); // 重新获取购物车数据
      messageApi.success('购物车已清空');
      
      // 跳转到订单页面
      navigate('/orders');
    } catch (error) {
      messageApi.error('提交订单失败：' + (error.message || '未知错误'));
      console.error('提交订单失败:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  // 表格列定义
  const columns = [
    {
      title: '商品',
      dataIndex: 'book',
      key: 'book',
      render: (book) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image 
            src={book.cover_url} 
            alt={book.title} 
            width={80} 
            height={120} 
            style={{ objectFit: 'cover' }}
            preview={false}
          />
          <div style={{ marginLeft: 12 }}>
            <div 
              style={{ fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => navigate(`/book/${book.id}`)}
            >
              {book.title}
            </div>
            <div style={{ color: '#888' }}>作者: {book.author}</div>
          </div>
        </div>
      ),
    },
    {
      title: '单价',
      dataIndex: 'book',
      key: 'price',
      align: 'center',
      render: (book) => <Text type="danger">¥{book.price.toFixed(2)}</Text>,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (quantity, record) => (
        <InputNumber 
          min={1} 
          max={99}
          value={quantity} 
          onChange={(value) => handleQuantityChange(record.id, value)}
        />
      ),
    },
    {
      title: '小计',
      dataIndex: 'subtotal',
      key: 'subtotal',
      align: 'center',
      render: (subtotal) => (
        <Text type="danger" strong>
          ¥{subtotal.toFixed(2)}
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
  const isCartEmpty = !loading && cartItems.length === 0;
  
  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      );
    }
    
    if (isCartEmpty) {
      return (
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
      );
    }
    
    return (
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
                  {cartTotal.total_quantity} 件
                </Text>
              </Space>
              <Space size="large">
                <Text>订单总计:</Text>
                <Text style={{ fontSize: 24 }} type="danger" strong>
                  ¥{cartTotal.total_amount.toFixed(2)}
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
          width={500}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmitOrder}
            initialValues={{
              name: currentUser?.name || '',
              phone: '',
              address: ''
            }}
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
                <Text type="danger">¥{cartTotal.total_amount.toFixed(2)}</Text>
              </div>
            </div>
            
            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setCheckoutModalVisible(false)}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  提交订单
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  };
  
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
                title="是否清空购物车？"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="确认"
                cancelText="取消"
              >
                <p>清空后购物车记录将无法被找回</p>
              </Modal>
            </>
          )}
        </Space>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default Cart; 