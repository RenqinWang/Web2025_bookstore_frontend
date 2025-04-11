import { 
  Col, 
  Card, 
  Tag, 
} from 'antd';

import { useNavigate } from 'react-router-dom';

const { Meta } = Card;

const BookCard = (book) => {
	const navigate = useNavigate();
	return (
		<Col xs={24} sm={12} md={8} lg={6} key={book.id}>
		<Card
			hoverable
			cover={<img alt={book.title} src={book.cover} height={300} style={{ objectFit: 'cover' }} />}
			onClick={() => navigate(`/book/${book.id}`)}
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
	)
}

export default BookCard;