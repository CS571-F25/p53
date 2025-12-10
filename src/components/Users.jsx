import { useState, useEffect } from 'react';
import { Container, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router';
import { getAllUsers, getUserCards } from '../utils/storage';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();

    const handleAuthChange = () => {
      loadUsers();
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // Fetch all users from API
      const allUsers = await getAllUsers();

      // Get card count for each user
      const usersWithCardsPromises = allUsers.map(async (user) => {
        const userCards = await getUserCards(user.id);

        // Sort cards to show favorites first, then by name
        const sortedCards = [...userCards].sort((a, b) => {
          // Favorites come first
          if (a.isFavorite && !b.isFavorite) return -1;
          if (!a.isFavorite && b.isFavorite) return 1;
          // Then sort by name
          return a.name.localeCompare(b.name);
        });

        return {
          ...user,
          cardCount: userCards.length,
          previewCards: sortedCards.slice(0, 5) // Get first 5 cards for preview (favorites first)
        };
      });

      const usersWithCards = await Promise.all(usersWithCardsPromises);
      // Filter out users with 0 cards
      const usersWithSomeCards = usersWithCards.filter(user => user.cardCount > 0);
      setUsers(usersWithSomeCards);
    } catch (error) {
      console.error("Error loading users:", error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid style={{ textAlign: 'left', maxWidth: '1200px', paddingBottom: '3rem' }}>
      <h1 className="mb-4" style={{ textAlign: 'center' }}>Browse Other Collectors</h1>

      {isLoading ? (
        <div className="text-center p-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center p-5">
          <p>No other users found.</p>
        </div>
      ) : (
        <div>
          {users.map(user => (
            <Card key={user.id} className="mb-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <Card.Title style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                      {user.username}
                    </Card.Title>
                    <Card.Text style={{ fontSize: '1.1rem', marginBottom: 0 }}>
                      <strong>{user.cardCount}</strong> cards in collection
                    </Card.Text>
                  </div>
                  <Button
                    as={Link}
                    to={`/collection/${user.id}`}
                    variant="primary"
                    size="lg"
                  >
                    View Full Collection
                  </Button>
                </div>

                {user.previewCards.length > 0 && (
                  <div>
                    <hr />
                    <h5 className="mb-3">Preview:</h5>
                    <div className="d-flex gap-4" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                      {user.previewCards.map(card => (
                        <div key={card.id} style={{ textAlign: 'center', position: 'relative' }}>
                          {card.isFavorite && (
                            <div style={{
                              position: 'absolute',
                              top: '5px',
                              right: '5px',
                              fontSize: '1.5rem',
                              zIndex: 10,
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              borderRadius: '50%',
                              width: '35px',
                              height: '35px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              ⭐
                            </div>
                          )}
                          <img
                            src={card.image || 'https://placehold.co/200x280/eeeeee/999999?text=No+Image'}
                            alt={card.name}
                            style={{
                              width: '200px',
                              height: '280px',
                              objectFit: 'contain',
                              borderRadius: '8px',
                              backgroundColor: '#f8f9fa',
                              border: '1px solid #dee2e6'
                            }}
                            onError={(e) => {
                              e.target.src = 'https://placehold.co/200x280/eeeeee/999999?text=No+Image';
                            }}
                          />
                          <p style={{
                            marginTop: '0.5rem',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {card.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
