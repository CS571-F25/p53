import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import { getAllUsers, getUserCards, getCurrentUser } from '../utils/storage';

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = getAllUsers();
    const currentUserId = getCurrentUser();

    // Exclude current user from the list
    const otherUsers = allUsers.filter(user => user.id !== currentUserId);

    // Get card count for each user
    const usersWithCards = otherUsers.map(user => {
      const userCards = getUserCards(user.id);
      return {
        ...user,
        cardCount: userCards.length,
        previewCards: userCards.slice(0, 3) // Get first 3 cards for preview
      };
    });

    setUsers(usersWithCards);
  };

  return (
    <Container fluid style={{ textAlign: 'left', maxWidth: '1400px' }}>
      <h1 className="mb-4" style={{ textAlign: 'center' }}>Browse Other Collectors</h1>

      {users.length === 0 ? (
        <div className="text-center p-5">
          <p>No other users found.</p>
        </div>
      ) : (
        <Row>
          {users.map(user => (
            <Col key={user.id} xs={12} sm={6} lg={6} className="mb-4">
              <Card className="h-100">
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ fontSize: '1.5rem' }}>{user.name}</Card.Title>
                  <Card.Text style={{ fontSize: '1rem' }}>
                    <strong>{user.cardCount}</strong> cards in collection
                  </Card.Text>

                  {user.previewCards.length > 0 && (
                    <div className="mb-3">
                      <small className="text-muted">Preview:</small>
                      <div className="d-flex justify-content-center gap-3 mt-2">
                        {user.previewCards.map(card => (
                          <div key={card.id} style={{ width: '150px' }}>
                            <img
                              src={card.image || 'https://placehold.co/150x210/eeeeee/999999?text=Card'}
                              alt={card.name}
                              style={{
                                width: '100%',
                                height: '210px',
                                objectFit: 'cover',
                                borderRadius: '4px'
                              }}
                              onError={(e) => {
                                e.target.src = 'https://placehold.co/150x210/eeeeee/999999?text=Card';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    as={Link}
                    to={`/collection/${user.id}`}
                    variant="primary"
                    className="mt-auto"
                    style={{ fontSize: '1rem', padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}
                  >
                    View Full Collection
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
