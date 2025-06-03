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
  Col,
  Spin
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
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const UserProfile = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  
  // 加载用户数据
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (currentUser) {
      // 初始化用户信息
      setUserProfile(currentUser);
      setAvatarUrl(currentUser.avatar || '');
      
      // 设置表单初始值
      form.setFieldsValue({
        name: currentUser.name || '',
        email: currentUser.email || '',
        bio: currentUser.bio || ''
      });
    }
  }, [navigate, form, currentUser, isAuthenticated]);
  
  // 处理表单提交
  const handleSubmit = async (values) => {
    if (userProfile) {
      setLoading(true);
      
      try {
        // 更新用户信息到后端
        const updatedUser = await userService.updateUserInfo(
          userProfile.id, 
          {
            name: values.name,
            email: values.email,
            bio: values.bio
          }
        );
        
        setUserProfile(updatedUser);
        setIsEditing(false);
        messageApi.success('个人信息已更新');
      } catch (error) {
        console.error('更新用户信息失败:', error);
        messageApi.error('更新个人信息失败: ' + (error.message || '未知错误'));
      } finally {
        setLoading(false);
      }
    }
  };
  
  // 头像上传前的处理
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      messageApi.error('只能上传 JPG/PNG 格式的图片！');
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      messageApi.error('图片必须小于 2MB！');
    }
    
    return isJpgOrPng && isLt2M;
  };
  
  // 处理头像上传
  const handleCustomUpload = async ({ file }) => {
    if (!userProfile || !userProfile.id) {
      messageApi.error('用户信息不完整，无法上传头像');
      return;
    }
    
    setLoading(true);
    
    try {
      // 上传头像到服务器
      const result = await userService.uploadAvatar(userProfile.id, file);
      
      if (result && result.avatarUrl) {
        setAvatarUrl(result.avatarUrl);
        messageApi.success('头像上传成功');
      } else {
        throw new Error('头像上传返回格式不正确');
      }
    } catch (error) {
      console.error('上传头像失败:', error);
      messageApi.error('上传头像失败: ' + (error.message || '未知错误'));
      
      // 在实际项目中错误时，可以使用 FileReader 模拟本地预览
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setAvatarUrl(reader.result);
      };
    } finally {
      setLoading(false);
    }
  };
  
  if (!userProfile) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" tip="正在加载用户信息..." />
      </div>
    );
  }
  
  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {contextHolder}
      <Card>
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
            {isEditing ? (
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
            ) : (
              <Avatar 
                src={userProfile.avatar} 
                size={120} 
                icon={<UserOutlined />}
                alt="用户头像" 
              />
            )}
          </Col>
          
          <Col xs={24} sm={16}>
            {isEditing ? (
              <Form 
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                  name: userProfile.name || '',
                  email: userProfile.email || '',
                  bio: userProfile.bio || ''
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
                      loading={loading}
                    >
                      保存
                    </Button>
                    <Button 
                      onClick={() => {
                        setIsEditing(false);
                        // 重置表单
                        form.setFieldsValue({
                          name: userProfile.name || '',
                          email: userProfile.email || '',
                          bio: userProfile.bio || ''
                        });
                      }}
                      disabled={loading}
                    >
                      取消
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            ) : (
              <div>
                <Title level={3}>{userProfile.name || '未设置姓名'}</Title>
                <Paragraph>
                  <Text type="secondary">
                    <MailOutlined /> {userProfile.email || '未设置邮箱'}
                  </Text>
                </Paragraph>
                <Paragraph>
                  {userProfile.bio || '这个人很懒，什么都没写...'}
                </Paragraph>
                <Button 
                  type="primary" 
                  icon={<EditOutlined />}
                  onClick={() => setIsEditing(true)}
                >
                  编辑资料
                </Button>
              </div>
            )}
          </Col>
        </Row>
        
        {!isEditing && (
          <>
            <Divider/>
            <Title level={4}>账户信息</Title>
            <Paragraph>
              <Text strong>用户名: </Text> {userProfile.username || '未知'}
            </Paragraph>
          </>
        )}
      </Card>
    </div>
  );
};

export default UserProfile;