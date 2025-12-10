import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import CardItem from './CardItem';
import { getUserCards, getUserById } from '../utils/storage';

export default function UserCollection() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const userData = await getUserById(userId);
      const userCards = await getUserCards(userId);

      setUser(userData);
      setCards(userCards);
    } catch (error) {
      console.error("Error loading user data:", error);
      setUser(null);
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <div className="text-center p-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading user collection...</p>
        </div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <h1>User Not Found</h1>
        <Button as={Link} to="/" variant="primary">
          Back to Browse Users
        </Button>
      </Container>
    );
  }

  return (
    <Container fluid style={{ maxWidth: '1200px', padding: '2rem' }}>
      <div className="mb-4">
        <Button as={Link} to="/" variant="secondary" className="mb-3">
          Back to Browse Users
        </Button>
        <h1>{user.username}'s Collection</h1>
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
            <Col key={card.id} xs={12} sm={6} md={6} lg={4} xl={3} className="mb-4">
              <CardItem card={card} showDelete={false} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
