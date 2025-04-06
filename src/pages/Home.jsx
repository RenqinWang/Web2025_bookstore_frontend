import React, { useState } from 'react';
import { 
  Typography, 
  Row, 
  Col, 
  Card, 
  Button, 
  Rate, 
  Divider, 
  Carousel, 
  Tag, 
  Input, 
  Space, 
  Select,
  message 
} from 'antd';
import { 
  ShoppingCartOutlined, 
  SearchOutlined, 
  EyeOutlined, 
  ReadOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { books } from '../data/bookData';

const { Title, Paragraph } = Typography;
const { Meta } = Card;
const { Option } = Select;

const Home = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // 获取所有类别用于筛选
  const categories = [...new Set(books.map(book => book.category))];
  
  // 按热门度（评分）排序书籍并选取前5本作为特色
  const featuredBooks = [...books]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);
  
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
  
  // 添加到购物车
  const addToCart = (book, event) => {
    event.stopPropagation(); // 阻止冒泡到卡片点击事件
    
    // 从本地存储获取购物车
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    // 检查书籍是否已在购物车中
    const existingItem = cartItems.find(item => item.id === book.id);
    
    if (existingItem) {
      // 更新数量
      existingItem.quantity += 1;
    } else {
      // 添加新项目
      cartItems.push({
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        cover: book.cover,
        quantity: 1
      });
    }
    
    // 保存回本地存储
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // 显示成功消息
    message.success(`《${book.title}》已添加到购物车`);
  };
  
  return (
    <div>
      {/* 顶部横幅区域 */}
      <Carousel autoplay effect="fade">
        {featuredBooks.map(book => (
          <div key={book.id}>
            <div 
              style={{ 
                height: '400px', 
                background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${book.cover})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                padding: '0 20%',
                textAlign: 'center'
              }}
            >
              <Title style={{ color: 'white', marginBottom: 8 }}>{book.title}</Title>
              <Paragraph style={{ color: 'white', fontSize: '18px', marginBottom: 24 }}>
                {book.description.substring(0, 100)}...
              </Paragraph>
              <Rate disabled defaultValue={book.rating} style={{ marginBottom: 24 }} />
              <Space>
                <Button 
                  type="primary" 
                  size="large"
                  icon={<EyeOutlined />}
                  onClick={() => viewBookDetails(book.id)}
                >
                  查看详情
                </Button>
                <Button 
                  type="default" 
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={(e) => addToCart(book, e)}
                  ghost
                >
                  加入购物车
                </Button>
              </Space>
            </div>
          </div>
        ))}
      </Carousel>
      
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
                actions={[
                  <Rate disabled defaultValue={book.rating} style={{ fontSize: '12px' }} />,
                  <Button 
                    type="primary" 
                    icon={<ShoppingCartOutlined />}
                    onClick={(e) => addToCart(book, e)}
                  >
                    加入购物车
                  </Button>
                ]}
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
    </div>
  );
};

export default Home; 