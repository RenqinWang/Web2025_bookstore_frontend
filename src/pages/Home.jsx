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
} from 'antd';
import { 
  SearchOutlined, 
  ReadOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { books } from '../data/bookData';

const { Meta } = Card;
const { Option } = Select;

const Home = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  
  // 获取所有类别用于筛选
  useEffect(() => {
    setCategories([...new Set(books.map(book => book.category))]);
  });
  
  
  // 过滤和搜索书籍
  const filteredBooks = books.filter(book => {
    // 类别筛选
    const categoryMatch = categoryFilter === 'all' || book.category === categoryFilter;
    
    // 搜索筛选
    const searchMatch = 
      book.title.toLowerCase().includes(searchText.toLowerCase()) ||
      book.author.toLowerCase().includes(searchText.toLowerCase()) ||
      book.description.toLowerCase().includes(searchText.toLowerCase());
    
    return categoryMatch && searchMatch;
  });
  
  // 查看书籍详情
  const viewBookDetails = (bookId) => {
    navigate(`/book/${bookId}`);
  };
  
  return (
    <div style={{ marginTop: 32 }}>
      {/* 搜索和筛选区域 */}
      <Row gutter={16} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={16}>
          <Input 
            placeholder="搜索书籍..." 
            prefix={<SearchOutlined />} 
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            size="large"
          />
        </Col>
        <Col xs={24} sm={8}>
          <Select
            placeholder="选择类别"
            style={{ width: '100%' }}
            value={categoryFilter}
            onChange={(value) => setCategoryFilter(value)}
            size="large"
          >
            <Option value="all">全部类别</Option>
            {categories.map(category => (
              <Option key={category} value={category}>{category}</Option>
            ))}
          </Select>
        </Col>
      </Row>
      
      {/* 书籍列表区域 */}
      <Divider orientation="left">
        <Space>
          <ReadOutlined />
          <span>精选图书</span>
        </Space>
      </Divider>
      
      <Row gutter={[16, 16]}>
        {filteredBooks.map(book => (
          <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
            <Card
              hoverable
              cover={<img alt={book.title} src={book.cover} height={300} style={{ objectFit: 'cover' }} />}
              onClick={() => viewBookDetails(book.id)}
            >
              <Meta
                title={book.title}
                description={
                  <>
                    <div style={{ marginBottom: 8 }}>
                      <Tag color="blue">{book.category}</Tag>
                      <span style={{ float: 'right', color: '#f50', fontWeight: 'bold' }}>
                        ¥{book.price.toFixed(2)}
                      </span>
                    </div>
                    <div>作者：{book.author}</div>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home; 