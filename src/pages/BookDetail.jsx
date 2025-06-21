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
  Spin
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
import { bookService, cartService, favoriteService } from '../services';

const { Title, Paragraph } = Typography;

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [isFavorite, setIsFavorite] = useState(false);

  // 获取图书详情
  useEffect(() => {
    const fetchBookDetail = async () => {
      setLoading(true);
      try {
        const bookData = await bookService.getBookById(parseInt(id));
        setBook(bookData);
        setIsFavorite(bookData.is_favorite);
      } catch (error) {
        messageApi.error('获取图书详情失败：' + (error.message || '未知错误'));
        console.error('获取图书详情失败:', error);
        
        // 如果获取失败，返回首页
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [id, navigate, messageApi]);
  
  // 处理添加到购物车
  const handleAddToCart = async () => {
    if (!book) return;
    
    try {
      await cartService.addToCart(book.id, quantity);
      messageApi.success(`已将 ${quantity} 本《${book.title}》添加到购物车`);
    } catch (error) {
      messageApi.error('添加到购物车失败：' + (error.message || '未知错误'));
      console.error('添加到购物车失败:', error);
    }
  };
  
  // 处理立即购买
  const handleBuyNow = async () => {
    try {
      await handleAddToCart();
      navigate('/cart');
    } catch (error) {
      console.error('购买失败:', error);
    }
  };
  
  // 处理收藏/取消收藏
  const handleToggleFavorite = async () => {
    if (!book) return;
    
    try {
      if (isFavorite) {
        await favoriteService.removeFavorite(book.id);
        setIsFavorite(false);
        messageApi.success(`已取消收藏《${book.title}》`);
      } else {
        await favoriteService.addFavorite(book.id);
        setIsFavorite(true);
        messageApi.success(`已收藏《${book.title}》`);
      }
    } catch (error) {
      messageApi.error((isFavorite ? '取消收藏' : '收藏') + '失败：' + (error.message || '未知错误'));
      console.error('收藏操作失败:', error);
    }
  };
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '500px' }}>
        <Spin size="large" />
      </div>
    );
  }
  
  if (!book) {
    return <div>找不到该书籍</div>;
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
            src={book.cover_url}
            alt={book.title}
            style={{ width: '100%', objectFit: 'cover' }}
          />
        </Col>
        
        <Col xs={24} md={14}>
          <Title level={2}>{book.title}</Title>
          
          <Paragraph>
            <Tag color="blue">{book.category.name}</Tag>
            {book.publishDate && <span style={{ marginLeft: 8 }}>{book.publishDate} 出版</span>}
            {book.pages && <span style={{ marginLeft: 8 }}>{book.pages} 页</span>}
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
            <Descriptions.Item label="ISBN">{book.isbn}</Descriptions.Item>
            {book.publishDate && <Descriptions.Item label="出版日期">{book.publishDate}</Descriptions.Item>}
            {book.pages && <Descriptions.Item label="页数">{book.pages} 页</Descriptions.Item>}
            <Descriptions.Item label="分类">{book.category.name}</Descriptions.Item>
            <Descriptions.Item label="库存">
              <span style={{ 
                color: book.stock > 10 ? '#52c41a' : book.stock > 0 ? '#faad14' : '#f5222d',
                fontWeight: 'bold'
              }}>
                {book.stock} 本
              </span>
              {book.stock === 0 && <span style={{ marginLeft: 8, color: '#f5222d' }}>(缺货)</span>}
            </Descriptions.Item>
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
          max={Math.min(99, book.stock)} 
          value={quantity} 
          onChange={(value) => setQuantity(value)} 
          disabled={book.stock === 0}
        />
        {book.stock > 0 && (
          <span style={{ marginLeft: 8, color: '#666' }}>
            库存: {book.stock} 本
          </span>
        )}
        {book.stock === 0 && (
          <span style={{ marginLeft: 8, color: '#f5222d' }}>
            暂时缺货
          </span>
        )}
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
            disabled={book.stock === 0}
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
            disabled={book.stock === 0}
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