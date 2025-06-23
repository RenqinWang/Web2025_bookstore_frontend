import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Space, Popconfirm, Typography, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { bookService } from '../services';

const { Option } = Select;
const { Title } = Typography;

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [editingBook, setEditingBook] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // 获取图书和分类
  const fetchBooks = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const params = { page, page_size: pageSize };
      
      // 添加搜索参数
      if (searchText) {
        params.query = searchText;
      }
      
      // 添加分类过滤参数
      if (categoryFilter !== 'all') {
        params.category_id = categoryFilter;
      }
      
      const data = await bookService.getBooks(params);
      setBooks(data.books || []);
      setPagination({
        current: data.page || 1,
        pageSize: data.page_size || 10,
        total: data.total || 0
      });
    } catch (error) {
      messageApi.error('获取图书列表失败: ' + (error.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await bookService.getCategories();
      setCategories(data || []);
    } catch (error) {
      messageApi.error('获取分类失败: ' + (error.message || '未知错误'));
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  // 当搜索条件或分类过滤变化时重新获取数据
  useEffect(() => {
    fetchBooks(pagination.current, pagination.pageSize);
    // eslint-disable-next-line
  }, [searchText, categoryFilter]);

  // 分页切换
  const handleTableChange = (pagination) => {
    fetchBooks(pagination.current, pagination.pageSize);
  };

  // 处理搜索
  const handleSearch = (value) => {
    setSearchText(value);
  };

  // 处理分类筛选
  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
  };

  // 重置筛选条件
  const handleReset = () => {
    setSearchText('');
    setCategoryFilter('all');
  };

  // 添加图书
  const handleAddBook = async (values) => {
    try {
      await bookService.createBook(values);
      setAddModalVisible(false);
      addForm.resetFields();
      messageApi.success('添加图书成功');
      fetchBooks(pagination.current, pagination.pageSize);
    } catch (error) {
      messageApi.error('添加图书失败: ' + (error.message || '未知错误'));
    }
  };

  // 打开编辑弹窗并填充表单
  const handleEdit = (record) => {
    setEditingBook(record);
    setUpdateModalVisible(true);
    editForm.setFieldsValue({
      title: record.title,
      author: record.author,
      price: record.price,
      cover_url: record.cover_url,
      description: record.description,
      rating: record.rating,
      category_id: record.category?.id,
      stock: record.stock,
      isbn: record.isbn,
    });
  };

  // 修改图书
  const handleUpdateBook = async (values) => {
    if (!editingBook) return;
    try {
      await bookService.updateBook(editingBook.id, values);
      setUpdateModalVisible(false);
      setEditingBook(null);
      editForm.resetFields();
      messageApi.success('修改图书信息成功');
      fetchBooks(pagination.current, pagination.pageSize);
    } catch (error) {
      messageApi.error('修改图书失败: ' + (error.message || '未知错误'));
    }
  };

  // 删除图书
  const handleDeleteBook = async (id) => {
    try {
      await bookService.deleteBook(id);
      messageApi.success('删除图书成功');
      fetchBooks(pagination.current, pagination.pageSize);
    } catch (error) {
      messageApi.error('删除图书失败: ' + (error.message || '未知错误'));
    }
  };

  // 表格列定义
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '书名', dataIndex: 'title', key: 'title' },
    { title: '作者', dataIndex: 'author', key: 'author' },
    { title: 'ISBN', dataIndex: 'isbn', key: 'isbn' },
    { title: '价格', dataIndex: 'price', key: 'price', render: (v) => `¥${v}` },
    { 
      title: '库存', 
      dataIndex: 'stock', 
      key: 'stock', 
      render: (stock) => (
        <span style={{ 
          color: stock > 10 ? '#52c41a' : stock > 0 ? '#faad14' : '#f5222d',
          fontWeight: 'bold'
        }}>
          {stock} 本
        </span>
      )
    },
    { title: '封面', dataIndex: 'cover_url', key: 'cover_url', render: (url) => url ? <img src={url} alt="cover_url" style={{ width: 60, height: 80, objectFit: 'cover' }} /> : '无' },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: false },
    { title: '评分', dataIndex: 'rating', key: 'rating' },
    { title: '分类', dataIndex: ['category', 'name'], key: 'category', render: (_, record) => record.category?.name || '无' },
    { title: '操作', key: 'action', render: (_, record) => (
      <Space>
        <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>编辑</Button>
        <Popconfirm title="确定要删除这本书吗？" onConfirm={() => handleDeleteBook(record.id)} okText="删除" cancelText="取消">
          <Button icon={<DeleteOutlined />} size="small" danger>删除</Button>
        </Popconfirm>
      </Space>
    ) },
  ];

  return (
    <div>
      {contextHolder}
      <Title level={2} style={{ marginBottom: 24 }}>图书管理</Title>
      
      {/* 搜索和筛选区域 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12}>
          <Input 
            placeholder="搜索书籍（书名、作者、描述）..." 
            prefix={<SearchOutlined />} 
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
            size="large"
          />
        </Col>
        <Col xs={24} sm={8}>
          <Select
            placeholder="选择分类"
            style={{ width: '100%' }}
            value={categoryFilter}
            onChange={handleCategoryChange}
            size="large"
          >
            <Option value="all">全部分类</Option>
            {categories.length > 0 ? (
              categories.map(category => (
                <Option key={category.id} value={category.id}>{category.name}</Option>
              ))
            ) : (
              <Option value="loading" disabled>加载中...</Option>
            )}
          </Select>
        </Col>
        <Col xs={24} sm={4}>
          <Button 
            onClick={handleReset} 
            size="large" 
            style={{ width: '100%' }}
          >
            重置
          </Button>
        </Col>
      </Row>
      
      <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }} onClick={() => setAddModalVisible(true)}>
        添加图书
      </Button>
      <Table
        columns={columns}
        dataSource={books}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        bordered
        scroll={{ x: 'max-content' }}
      />
      {/* 添加图书弹窗 */}
      <Modal
        title="添加图书"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onOk={() => addForm.submit()}
        okText="添加"
        cancelText="取消"
        destroyOnClose
      >
        <Form
          form={addForm}
          layout="vertical"
          onFinish={handleAddBook}
        >
          <Form.Item name="title" label="书名" rules={[{ required: true, message: '请输入书名' }]}><Input /></Form.Item>
          <Form.Item name="author" label="作者" rules={[{ required: true, message: '请输入作者' }]}><Input /></Form.Item>
          <Form.Item name="isbn" label="ISBN" rules={[{ required: true, message: '请输入ISBN' }]}><Input /></Form.Item>
          <Form.Item name="price" label="价格" rules={[{ required: true, message: '请输入价格' }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="stock" label="库存" rules={[{ required: true, message: '请输入库存数量' }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="cover_url" label="封面图片URL"><Input /></Form.Item>
          <Form.Item name="description" label="描述"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="rating" label="评分"><InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="category_id" label="分类" rules={[{ required: true, message: '请选择分类' }]}> 
            <Select placeholder="请选择分类">
              {categories.map(cat => <Option value={cat.id} key={cat.id}>{cat.name}</Option>)}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      {/* 修改图书弹窗 */}
      <Modal
        title="修改图书"
        open={updateModalVisible}
        onCancel={() => { setUpdateModalVisible(false); setEditingBook(null); editForm.resetFields(); }}
        onOk={() => editForm.submit()}
        okText="修改"
        cancelText="取消"
        destroyOnClose
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateBook}
        >
          <Form.Item name="title" label="书名" rules={[{ required: true, message: '请输入书名' }]}><Input /></Form.Item>
          <Form.Item name="author" label="作者" rules={[{ required: true, message: '请输入作者' }]}><Input /></Form.Item>
          <Form.Item name="isbn" label="ISBN" rules={[{ required: true, message: '请输入ISBN' }]}><Input /></Form.Item>
          <Form.Item name="price" label="价格" rules={[{ required: true, message: '请输入价格' }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="stock" label="库存" rules={[{ required: true, message: '请输入库存数量' }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="cover_url" label="封面图片URL"><Input /></Form.Item>
          <Form.Item name="description" label="描述"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="rating" label="评分"><InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="category_id" label="分类" rules={[{ required: true, message: '请选择分类' }]}> 
            <Select placeholder="请选择分类">
              {categories.map(cat => (<Option value={cat.id} key={cat.id}>{cat.name}</Option>))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BookManagement;
