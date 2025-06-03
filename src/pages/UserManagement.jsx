import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, StopOutlined } from '@ant-design/icons';
import { userService } from '../services';
import { useAuth } from '../contexts/AuthContext';

const { Option } = Select;

const UserManagement = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  // 获取全部用户
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data || []);
    } catch (error) {
      messageApi.error('获取用户列表失败: ' + (error.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      fetchUsers();
    }
    // eslint-disable-next-line
  }, [currentUser]);

  // 删除用户
  const handleDelete = async (id) => {
    try {
      await userService.deleteUser(id);
      messageApi.success('删除用户成功');
      fetchUsers();
    } catch (error) {
      messageApi.error('删除用户失败: ' + (error.message || '未知错误'));
    }
  };

  // 禁用用户
  const handleDisable = async (id) => {
    try {
      await userService.disableUser(id);
      messageApi.success('用户已禁用');
      fetchUsers();
    } catch (error) {
      messageApi.error('禁用用户失败: ' + (error.message || '未知错误'));
    }
  };

  // 打开编辑弹窗
  const handleEdit = (record) => {
    setEditingUser(record);
    setEditModalVisible(true);
    editForm.setFieldsValue({
      name: record.name,
      email: record.email,
      bio: record.bio,
      role: record.role,
      status: record.status
    });
  };

  // 提交编辑
  const handleUpdate = async (values) => {
    if (!editingUser) return;
    try {
      await userService.adminUpdateUser(editingUser.id, values);
      setEditModalVisible(false);
      setEditingUser(null);
      messageApi.success('修改用户信息成功');
      fetchUsers();
    } catch (error) {
      messageApi.error('修改用户失败: ' + (error.message || '未知错误'));
    }
  };

  // 表格列
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '角色', dataIndex: 'role', key: 'role', render: (role) => <Tag color={role === 'admin' ? 'red' : 'blue'}>{role}</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'disabled' ? 'gray' : 'green'}>{status === 'disabled' ? '禁用' : '正常'}</Tag> },
    { title: '操作', key: 'action', render: (_, record) => (
      <Space>
        <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>编辑</Button>
        <Popconfirm title="确定要删除该用户吗？" onConfirm={() => handleDelete(record.id)} okText="删除" cancelText="取消">
          <Button icon={<DeleteOutlined />} size="small" danger>删除</Button>
        </Popconfirm>
        {record.status !== 'disabled' && (
          <Popconfirm title="确定要禁用该用户吗？" onConfirm={() => handleDisable(record.id)} okText="禁用" cancelText="取消">
            <Button icon={<StopOutlined />} size="small">禁用</Button>
          </Popconfirm>
        )}
      </Space>
    ) },
  ];

  return (
    <div>
      {contextHolder}
      <h2 style={{ marginBottom: 24 }}>用户管理</h2>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        bordered
        scroll={{ x: 'max-content' }}
      />
      {/* 编辑用户弹窗 */}
      <Modal
        title="编辑用户信息"
        open={editModalVisible}
        onCancel={() => { setEditModalVisible(false); setEditingUser(null); editForm.resetFields(); }}
        onOk={() => editForm.submit()}
        okText="保存"
        cancelText="取消"
        destroyOnClose
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}><Input /></Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, message: '请输入邮箱' }]}><Input /></Form.Item>
          <Form.Item name="bio" label="简介"><Input.TextArea rows={2} /></Form.Item>
          <Form.Item name="role" label="角色" rules={[{ required: true, message: '请选择角色' }]}> 
            <Select>
              <Option value="user">user</Option>
              <Option value="admin">admin</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}> 
            <Select>
              <Option value="active">正常</Option>
              <Option value="disabled">禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement; 