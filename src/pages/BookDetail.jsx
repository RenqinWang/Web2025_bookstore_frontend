import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Image, 
  Typography, 
  Descriptions, 
  Button, 
  Rate, 
  InputNumber, 
  Divider,
  Tag,
  message,
  Breadcrumb
} from 'antd';
import { 
  ShoppingCartOutlined, 
  HomeOutlined, 
  BookOutlined, 
  ShoppingOutlined,
  HeartOutlined,
  HeartFilled,
  FileTextOutlined
} from '@ant-design/icons';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { books } from '../data/bookData';

const { Title, Paragraph } = Typography;

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [book, setBook] = useState(null);
  const [similarBooks, setSimilarBooks] = useState([]);
  
  useEffect(() => {
    // 查找当前书籍
    const currentBook = books.find(b => b.id === parseInt(id));
    
    if (currentBook) {
      setBook(currentBook);
      
      // 获取相似书籍（同类别但不是当前书籍）
      const similar = books
        .filter(b => b.category === currentBook.category && b.id !== currentBook.id)
        .slice(0, 3); // 只取3本
      
      setSimilarBooks(similar);
      
      // 检查是否是收藏的书籍
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      setLiked(favorites.includes(parseInt(id)));
    } else {
      message.error('找不到该书籍');
      navigate('/');
    }
  }, [id, navigate]);
  
  // 处理添加到购物车
  const handleAddToCart = () => {
    if (!book) return;
    
    // 从本地存储获取购物车
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    // 检查书籍是否已在购物车中
    const existingItem = cartItems.find(item => item.id === book.id);
    
    if (existingItem) {
      // 更新数量
      existingItem.quantity += quantity;
    } else {
      // 添加新项目
      cartItems.push({
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        cover: book.cover,
        quantity: quantity
      });
    }
    
    // 保存回本地存储
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // 显示成功消息
    message.success(`已将 ${quantity} 本《${book.title}》添加到购物车`);
  };
  
  // 处理立即购买
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };
  
  // 处理收藏/取消收藏
  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (liked) {
      // 取消收藏
      const newFavorites = favorites.filter(id => id !== book.id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      message.success(`已取消收藏《${book.title}》`);
    } else {
      // 添加收藏
      favorites.push(book.id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      message.success(`已收藏《${book.title}》`);
    }
    
    setLiked(!liked);
  };
  
  if (!book) {
    return <div>加载中...</div>;
  }
  
  return (
    <div>
      {/* 面包屑导航 */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/"><HomeOutlined /> 首页</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/"><BookOutlined /> 书籍列表</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{book.title}</Breadcrumb.Item>
      </Breadcrumb>
      
      {/* 书籍详情 */}
      <Row gutter={[32, 16]}>
        <Col xs={24} md={10}>
          <Image
            src={book.cover}
            alt={book.title}
            style={{ width: '100%', objectFit: 'cover' }}
          />
        </Col>
        
        <Col xs={24} md={14}>
          <Title level={2}>{book.title}</Title>
          
          <Paragraph>
            <Tag color="blue">{book.category}</Tag>
            <span style={{ marginLeft: 8 }}>{book.publishDate} 出版</span>
            <span style={{ marginLeft: 8 }}>{book.pages} 页</span>
          </Paragraph>
          
          <div style={{ marginBottom: 16 }}>
            <Rate disabled defaultValue={book.rating} />
            <span style={{ marginLeft: 8 }}>{book.rating} 分</span>
          </div>
          
          <div style={{ 
            fontSize: '24px', 
            color: '#f50', 
            marginBottom: 16,
            fontWeight: 'bold'
          }}>
            ¥{book.price.toFixed(2)}
          </div>
          
          <Descriptions bordered column={1} size="small" style={{ marginBottom: 24 }}>
            <Descriptions.Item label="作者">{book.author}</Descriptions.Item>
            <Descriptions.Item label="出版日期">{book.publishDate}</Descriptions.Item>
            <Descriptions.Item label="页数">{book.pages} 页</Descriptions.Item>
            <Descriptions.Item label="分类">{book.category}</Descriptions.Item>
          </Descriptions>
          
          <div style={{ marginBottom: 24 }}>
            <span style={{ marginRight: 16 }}>购买数量：</span>
            <InputNumber 
              min={1} 
              max={99} 
              defaultValue={quantity} 
              onChange={value => setQuantity(value)} 
            />
          </div>
          
          <div style={{ display: 'flex', gap: 16 }}>
            <Button 
              type="primary" 
              size="large" 
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
            >
              加入购物车
            </Button>
            <Button 
              type="default" 
              size="large" 
              icon={<ShoppingOutlined />}
              onClick={handleBuyNow}
            >
              立即购买
            </Button>
            <Button 
              type={liked ? "primary" : "default"}
              size="large" 
              icon={liked ? <HeartFilled /> : <HeartOutlined />}
              onClick={handleToggleFavorite}
              danger={liked}
            >
              {liked ? '已收藏' : '收藏'}
            </Button>
          </div>
        </Col>
      </Row>
      
      {/* 书籍详情描述 */}
      <Divider orientation="left">
        <FileTextOutlined /> 图书简介
      </Divider>
      <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
        {book.description}
      </Paragraph>
      
      {/* 相似书籍推荐 */}
      {similarBooks.length > 0 && (
        <>
          <Divider orientation="left">猜您喜欢</Divider>
          <Row gutter={[16, 16]}>
            {similarBooks.map(similar => (
              <Col xs={24} sm={8} key={similar.id}>
                <div 
                  style={{ 
                    display: 'flex', 
                    cursor: 'pointer',
                    border: '1px solid #f0f0f0',
                    padding: 8,
                    borderRadius: 4
                  }}
                  onClick={() => navigate(`/book/${similar.id}`)}
                >
                  <Image 
                    src={similar.cover} 
                    alt={similar.title} 
                    width={80} 
                    height={120}
                    style={{ objectFit: 'cover' }}
                    preview={false}
                  />
                  <div style={{ marginLeft: 12, flex: 1 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{similar.title}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{similar.author}</div>
                    <div style={{ color: '#f50', marginTop: 4 }}>¥{similar.price.toFixed(2)}</div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
};

export default BookDetail; 