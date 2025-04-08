import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Avatar, 
  Typography, 
  Divider, 
  Form, 
  Input, 
  Button, 
  message, 
  Upload, 
  Space,
  Row,
  Col
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  EditOutlined, 
  SaveOutlined, 
  UploadOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const UserProfile = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState('');
  
  // 加载用户数据
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('currentUser'));
    if (userInfo) {
      // 如果用户还没有email和bio字段，添加默认值
      if (!userInfo.email) {
        userInfo.email = '';
      }
      if (!userInfo.bio) {
        userInfo.bio = '';
      }
      
      setCurrentUser(userInfo);
      setAvatarUrl(userInfo.avatar);
      
      // 设置表单初始值
      form.setFieldsValue({
        name: userInfo.name,
        email: userInfo.email,
        bio: userInfo.bio
      });
    } else {
      navigate('/login');
    }
  }, [navigate, form]);
  
  // 处理表单提交
  const handleSubmit = (values) => {
    if (currentUser) {
      // 更新用户信息
      const updatedUser = {
        ...currentUser,
        name: values.name,
        email: values.email,
        bio: values.bio,
        avatar: avatarUrl
      };
      
      // 保存到本地存储
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      setIsEditing(false);
      message.success('个人信息已更新');
    }
  };
  
  // 头像上传前的处理
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 格式的图片！');
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片必须小于 2MB！');
    }
    
    return isJpgOrPng && isLt2M;
  };
  
  // 处理自定义上传
  const handleCustomUpload = ({ file }) => {
    // 在实际项目中，这里应该是上传到服务器
    // 这里我们使用FileReader模拟本地预览
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setAvatarUrl(reader.result);
    };
  };
  
  if (!currentUser) {
    return <div>加载中...</div>;
  }
  
  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Card>
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
            {(
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                customRequest={handleCustomUpload}
              >
                {avatarUrl ? (
                  <Avatar 
                    src={avatarUrl} 
                    size={120} 
                    alt="用户头像" 
                  />
                ) : (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>上传头像</div>
                  </div>
                )}
              </Upload>
            )}
          </Col>
          
          <Col xs={24} sm={16}>
            {(
              <Form 
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                  name: currentUser.name,
                  email: currentUser.email,
                  bio: currentUser.bio
                }}
              >
                <Form.Item
                  name="name"
                  label="姓名"
                  rules={[{ required: true, message: '请输入您的姓名' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="请输入姓名" />
                </Form.Item>
                
                <Form.Item
                  name="email"
                  label="电子邮箱"
                  rules={[
                    { type: 'email', message: '邮箱格式不正确' },
                    { required: true, message: '请输入您的邮箱' }
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="请输入电子邮箱" />
                </Form.Item>
                
                <Form.Item
                  name="bio"
                  label="自我介绍"
                >
                  <TextArea 
                    rows={4} 
                    placeholder="介绍一下自己吧..." 
                  />
                </Form.Item>
                
                <Form.Item>
                  <Space>
                    <Button 
                      type="primary" 
                      htmlType="submit"
                      icon={<SaveOutlined />}
                    >
                      保存
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            ) }
          </Col>
        </Row>
        
        {!isEditing && (
          <>
            <Divider/>
            <Title level={4}>账户信息</Title>
            <Paragraph>
              <Text strong>用户名: </Text> {currentUser.username}
            </Paragraph>
          </>
        )}
      </Card>
    </div>
  );
};

export default UserProfile;