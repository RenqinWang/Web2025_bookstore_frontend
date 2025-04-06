import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import { 
  HomeOutlined, 
  BookOutlined, 
  ShoppingCartOutlined, 
  OrderedListOutlined, 
  UserOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // 模拟当前登录用户信息
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
  
  // 处理登出
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };
  
  // 用户菜单项
  const userMenuItems = [
    {
      key: 'profile',
      label: '个人信息',
      icon: <UserOutlined />
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: handleLogout
    }
  ];
  
  // 如果未登录，重定向到登录页
  if (!currentUser) {
    navigate('/login');
    return null;
  }
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
      >
        <div className="logo" style={{ 
          height: '16px', 
          margin: '16px', 
          textAlign: 'center', 
          fontSize: '18px', 
          fontWeight: 'bold',
          color: '#1890ff'
        }}>
          {collapsed ? '圕' : '交圕藏经阁'}
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          items={[
            // {
            //   key: '/',
            //   icon: <HomeOutlined />,
            //   label: <Link to="/">主页</Link>,
            // },
            {
              key: '/',
              icon: <BookOutlined />,
              label: <Link to="/">书籍列表</Link>,
            },
            {
              key: '/cart',
              icon: <ShoppingCartOutlined />,
              label: <Link to="/cart">购物车</Link>,
            },
            {
              key: '/orders',
              icon: <OrderedListOutlined />,
              label: <Link to="/orders">我的订单</Link>,
            },
            {
              key: '/profile',
              icon: <UserOutlined/>,
              label: < Link to="/profile">个人信息</Link>
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          padding: '0 16px', 
          background: '#fff', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Avatar src={currentUser.avatar || null} icon={<UserOutlined />} />
                <span style={{ marginLeft: 8 }}>{currentUser.name}</span>
              </div>
            </Dropdown>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ 
            padding: 24, 
            minHeight: 360, 
            background: '#fff',
            borderRadius: '4px'
          }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 