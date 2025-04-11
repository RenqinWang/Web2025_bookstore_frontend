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
  Breadcrumb,
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
import { cartStorage, favoriteStorage } from '../utils/storage';

const { Title, Paragraph } = Typography;

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [book, setBook] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // 查找当前书籍
    const currentBook = books.find((book) => book.id === parseInt(id));
    
    if (currentBook) {
      setBook(currentBook);
      // 检查是否已收藏
      setIsFavorite(favoriteStorage.isFavorite(currentBook.id));
    } else {
      messageApi.info('找不到该书籍');
      navigate('/');
    }
  }, [id, navigate, messageApi]);
  
  // 处理添加到购物车
  const handleAddToCart = () => {
    if (!book) return;
    
    // 使用工具类添加商品到购物车
    cartStorage.addToCart(book, quantity);
    
    // 显示成功消息
    messageApi.info(`已将 ${quantity} 本《${book.title}》添加到购物车`);
  };
  
  // 处理立即购买
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };
  
  // 处理收藏/取消收藏
  const handleToggleFavorite = () => {
    if (!book) return;
    
    if (isFavorite) {
      favoriteStorage.removeFromFavorites(book.id);
      setIsFavorite(false);
      messageApi.info(`已取消收藏《${book.title}》`);
    } else {
      favoriteStorage.addToFavorites(book);
      setIsFavorite(true);
      messageApi.info(`已收藏《${book.title}》`);
    }
  };
  
  if (!book) {
    return <div>加载中...</div>;
  }
  
  return (
    <div>
      {contextHolder}
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
        </Col>
      </Row>

      {/* 购买数量 */}
      <div style={{ 
        marginBottom: 24, 
        }}>
        <span style={{ marginRight: 10 }}>购买数量：</span>
        <InputNumber 
          min={1} 
          max={99} 
          defaultValue={quantity} 
          onChange={(value) => setQuantity(value)} 
        />
      </div>

      {/* 购买按钮 */}
      <Row 
        style={{
          gap: 16,
          width: "100%",
          display: "flex",
          flexWrap: "nowrap",
        }}
      >
          <Button 
            type="primary" 
            size="large" 
            icon={<ShoppingCartOutlined />}
            onClick={handleAddToCart}
            style={{
              flex: "auto",
            }}
          >
            加入购物车
          </Button>
          <Button 
            type="default" 
            size="large" 
            icon={<ShoppingOutlined />}
            onClick={handleBuyNow}
            style={{
              flex: "auto",
            }}
          >
            立即购买
          </Button>
          <Button 
            type={isFavorite ? "primary" : "default"}
            size="large" 
            icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
            onClick={handleToggleFavorite}
            style={{
              flex: "auto",
            }}
          >
            {isFavorite ? "已收藏" : "收藏"}
          </Button>
      </Row>
      
      {/* 图书简介 */}
      <Divider orientation="left">
        <FileTextOutlined /> 图书简介
      </Divider>
      <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
        {book.description}
      </Paragraph>
    </div>
  );
};

export default BookDetail; 