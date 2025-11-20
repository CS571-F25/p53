import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { Container, Row, Col, Button } from 'react-bootstrap';
import CardItem from './CardItem';
import { getUserCards, getUserById } from '../utils/storage';

export default function UserCollection() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = () => {
    const userData = getUserById(userId);
    const userCards = getUserCards(userId);

    setUser(userData);
    setCards(userCards);
  };

  if (!user) {
    return (
      <Container>
        <h1>User Not Found</h1>
        <Button as={Link} to="/users" variant="primary">
          Back to Users
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mb-4">
        <Button as={Link} to="/users" variant="secondary" className="mb-3">
          Back to Users
        </Button>
        <h1>{user.name}'s Collection</h1>
        <p className="text-muted">
          Total Cards: {cards.length}
        </p>
      </div>

      {cards.length === 0 ? (
        <div className="text-center p-5">
          <p>This user has no cards in their collection yet.</p>
        </div>
      ) : (
        <Row>
          {cards.map(card => (
            <Col key={card.id} xs={12} sm={6} md={6} lg={4} xl={3} className="d-flex">
              <CardItem card={card} showDelete={false} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
