import { 
  Col, 
  Card, 
  Tag, 
} from 'antd';

import { useNavigate } from 'react-router-dom';

const { Meta } = Card;

const BookCard = (book) => {
	const navigate = useNavigate();
	
	// 如果缺少关键属性，显示空白
	if (!book || !book.id || !book.title) {
		console.warn('BookCard 缺少必要属性:', book);
		return null;
	}
	
	// 确保价格是数字
	const price = typeof book.price === 'number' ? book.price.toFixed(2) : '0.00';
	
	// 处理分类显示
	const categoryName = book.category ? (
		typeof book.category === 'object' ? 
			(book.category.name || '未分类') : 
			(typeof book.category === 'string' ? book.category : '未分类')
	) : '未分类';
	
	// 处理封面图片
	const coverUrl = book.cover_url || 'https://via.placeholder.com/300x400?text=No+Image';
	
	return (
		<Col xs={24} sm={12} md={8} lg={6} key={book.id}>
		<Card
			hoverable
			cover={<img alt={book.title} src={coverUrl} height={300} style={{ objectFit: 'cover' }} />}
			onClick={() => navigate(`/book/${book.id}`)}
		>
			<Meta
				title={book.title}
				description={
					<>
						<div style={{ marginBottom: 8 }}>
							<Tag color="blue">{categoryName}</Tag>
							<span style={{ float: 'right', color: '#f50', fontWeight: 'bold' }}>
								¥{price}
							</span>
						</div>
						<div>作者：{book.author || '未知'}</div>
					</>
				}
			/>
		</Card>
	</Col>
	)
}

export default BookCard;