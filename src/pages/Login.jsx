import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Card, message, Typography, Modal } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services';

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  
  // 检查是否已登录
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // 处理登录操作
  const handleLogin = async (values) => {
    setLoading(true);
    
    try {
      const { username, password, remember } = values;
      await login(username, password, remember);
      messageApi.success('登录成功！');
      setLoading(false);
      setTimeout(() => navigate('/'), 0);
    } catch (error) {
      messageApi.error(error.message || '登录失败，请检查用户名和密码');
      console.error('登录失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 注册处理
  const handleRegister = async (values) => {
    setRegisterLoading(true);
    try {
      await authService.register(values);
      messageApi.success('注册成功，请登录！');
      setRegisterModalVisible(false);
      registerForm.resetFields();
    } catch (error) {
      messageApi.error(error.message || '注册失败，请检查信息');
    } finally {
      setRegisterLoading(false);
    }
  };
  
  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: '#f0f2f5' 
    }}>
      {contextHolder}
      <Card 
        style={{ 
          width: 400, 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderRadius: '8px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0 }}>电子书城</Title>
          <p style={{ color: '#888', marginTop: 8 }}>欢迎使用电子书城系统</p>
        </div>
        
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>
          
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            <div style={{ float: 'right', display: 'flex', gap: 8 }}>
              {/* <a href="#">忘记密码</a> */}
              <Button type="link" style={{ padding: 0 }} onClick={() => setRegisterModalVisible(true)}>
                注册新用户
              </Button>
            </div>
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              style={{ width: '100%' }}
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* 注册弹窗 */}
      <Modal
        title="注册新用户"
        open={registerModalVisible}
        onCancel={() => { setRegisterModalVisible(false); registerForm.resetFields(); }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={registerForm}
          layout="vertical"
          onFinish={handleRegister}
          size="large"
          validateTrigger="onSubmit"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" autoComplete="username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={["password"]}
            rules={[
              { required: true, message: '请再次输入密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请再次输入密码" autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="姓名" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ required: true, type: 'email', message: '请输入有效邮箱' }]}
          >
            <Input placeholder="邮箱" autoComplete="email" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={registerLoading} style={{ width: '100%' }}>注册</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Login; 