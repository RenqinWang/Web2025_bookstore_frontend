import React, { useEffect, useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Divider, 
  Tag, 
  Input, 
  Space, 
  Select,
  message,
  Spin,
  Alert
} from 'antd';
import { 
  SearchOutlined, 
  ReadOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { bookService } from '../services';
import BookCard from '../components/BookCard';

const { Meta } = Card;
const { Option } = Select;

const Home = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  
  // 获取所有类别用于筛选
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('开始获取分类数据...');
        const data = await bookService.getCategories();
        console.log('获取到的分类数据:', data);
        
        // 确保数据是数组
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error('分类数据不是数组:', data);
          setCategories([]);
        }
      } catch (error) {
        console.error('获取分类失败:', error);
        setError('获取分类失败: ' + (error.message || '未知错误'));
        messageApi.error('获取分类失败：' + (error.message || '未知错误'));
        setCategories([]);
      }
    };
    
    fetchCategories();
  }, [messageApi]);
  
  // 获取书籍数据
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('开始获取图书数据...');
        const params = {};
        if (searchText) {
          params.query = searchText;
        }
        if (categoryFilter !== 'all') {
          params.category_id = categoryFilter;
        }
        
        console.log('请求参数:', params);
        const data = await bookService.getBooks(params);
        console.log('获取到的图书数据:', data);
        
        // 处理响应数据
        if (data && data.books && Array.isArray(data.books)) {
          // 标准格式: { books: [], total: 0, ... }
          setBooks(data.books);
        } else if (Array.isArray(data)) {
          // 直接返回数组
          setBooks(data);
        } else {
          console.error('图书数据格式不正确:', data);
          setBooks([]);
          setError('图书数据格式不正确');
        }
      } catch (error) {
        console.error('获取图书失败:', error);
        setError('获取图书失败: ' + (error.message || '未知错误'));
        messageApi.error('获取图书失败：' + (error.message || '未知错误'));
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    
    // 使用防抖处理搜索
    const debounceTimer = setTimeout(() => {
      fetchBooks();
    }, 500);
    
    return () => clearTimeout(debounceTimer);
  }, [searchText, categoryFilter, messageApi]);
  
  // 处理搜索
  const handleSearch = (value) => {
    setSearchText(value);
  };
  
  // 处理分类筛选
  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
  };
  
  return (
    <div style={{ marginTop: 32 }}>
      {contextHolder}
      {/* 搜索和筛选区域 */}
      <Row gutter={16} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={16}>
          <Input 
            placeholder="搜索书籍..." 
            prefix={<SearchOutlined />} 
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
            size="large"
          />
        </Col>
        <Col xs={24} sm={8}>
          <Select
            placeholder="选择类别"
            style={{ width: '100%' }}
            value={categoryFilter}
            onChange={handleCategoryChange}
            size="large"
          >
            <Option value="all">全部类别</Option>
            {categories.length > 0 ? (
              categories.map(category => (
                <Option key={category.id} value={category.id}>{category.name}</Option>
              ))
            ) : (
              <Option value="loading" disabled>加载中...</Option>
            )}
          </Select>
        </Col>
      </Row>
      
      {/* 显示错误信息 */}
      {error && (
        <Alert
          message="错误"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      
      {/* 书籍列表区域 */}
      <Divider orientation="left">
        <Space>
          <ReadOutlined />
          <span>精选图书</span>
        </Space>
      </Divider>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" tip="正在加载图书数据..." />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {books.length > 0 ? (
            books.map((book) => (
              <BookCard key={book.id} {...book} />
            ))
          ) : (
            <Col span={24} style={{ textAlign: 'center', padding: '50px 0' }}>
              没有找到符合条件的图书
            </Col>
          )}
        </Row>
      )}
    </div>
  );
};

export default Home; 