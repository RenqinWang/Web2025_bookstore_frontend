import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { users } from '../data/bookData';
import { userStorage } from '../utils/storage';

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // 检查是否已登录
  useEffect(() => {
    const currentUser = userStorage.getCurrentUser();
    if (currentUser) {
      navigate('/');
    }
  }, [navigate]);
  
  // 处理登录操作
  const handleLogin = (values) => {
    setLoading(true);
    
    // 模拟登录延迟
    setTimeout(() => {
      const { username, password } = values;
      const user = users.find(
        (u) => u.username === username && u.password === password
      );
      
      if (user) {
        // 登录成功
        const userInfo = { ...user };
        delete userInfo.password; // 不存储密码
        userStorage.setCurrentUser(userInfo);
        message.success('登录成功！');
        navigate('/');
      } else {
        // 登录失败
        message.error('用户名或密码错误！');
      }
      
      setLoading(false);
    }, 1000);
  };
  
  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: '#f0f2f5' 
    }}>
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
              placeholder="用户名: admin 或 user" 
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="密码: admin123 或 user123"
            />
          </Form.Item>
          
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            
            <a href="#" style={{ float: 'right' }}>
              忘记密码
            </a>
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
    </div>
  );
};

export default Login; 