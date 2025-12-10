import { useState, useEffect } from 'react';
import { Container, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router';
import { getAllUsers, getUserCards } from '../utils/storage';
import { IconEye, IconStarFilled } from './Icons';

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
    <Container
      as="main"
      fluid
      style={{ textAlign: 'left', maxWidth: '1200px', paddingBottom: '3rem', padding: '2rem' }}
      role="main"
      aria-label="Browse other collectors"
    >
      <h1
        className="mb-5"
        style={{
          textAlign: 'center',
          color: 'var(--text-primary)',
          fontWeight: 700,
          fontSize: '2.25rem',
          letterSpacing: '-0.02em',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}
      >
        Browse Other Collectors
      </h1>

      {isLoading ? (
        <div className="text-center p-5" role="status" aria-live="polite">
          <Spinner animation="border" aria-hidden="true" />
          <span className="visually-hidden">Loading users</span>
          <p className="mt-2" aria-hidden="true">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center p-5" role="status" aria-live="polite">
          <p>No other users found.</p>
        </div>
      ) : (
        <div role="list" aria-label="List of collectors" style={{ paddingTop: '1rem' }}>
          {users.map(user => (
            <article key={user.id} className="mb-5" role="listitem">
              <Card
                style={{
                  border: '2px solid var(--border-color-light)',
                  borderRadius: 'var(--radius-lg)',
                  transition: 'all var(--transition-base)',
                  overflow: 'hidden',
                  backgroundColor: 'var(--bg-primary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-color-light)';
                }}
              >
                <Card.Body style={{ padding: '2rem' }}>
                  <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
                    <div>
                      <h2
                        style={{
                          fontSize: '2rem',
                          marginBottom: '0.5rem',
                          color: 'var(--text-primary)',
                          fontWeight: 600
                        }}
                      >
                        {user.username}
                      </h2>
                      <p style={{ fontSize: '1.1rem', marginBottom: 0, color: 'var(--text-secondary)' }}>
                        <strong>{user.cardCount}</strong> cards in collection
                      </p>
                    </div>
                    <Button
                      as={Link}
                      to={`/collection/${user.id}`}
                      variant="primary"
                      aria-label={`View ${user.username}'s full collection of ${user.cardCount} cards`}
                      style={{
                        padding: '0.875rem 2rem',
                        fontWeight: 600,
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-md)',
                        transition: 'all var(--transition-base)',
                        border: 'none',
                        fontSize: '1rem',
                        letterSpacing: '0.01em',
                        textDecoration: 'none',
                        display: 'inline-block'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                      }}
                    >
                      View Collection
                    </Button>
                  </div>

                  {user.previewCards.length > 0 && (
                    <section aria-label={`Preview of ${user.username}'s cards`}>
                      <hr style={{
                        borderColor: 'var(--border-color)',
                        margin: '1.5rem 0',
                        opacity: 1,
                        border: 'none',
                        borderTop: '2px solid var(--border-color)'
                      }} />
                      <h3
                        className="mb-4"
                        style={{
                          fontSize: '1.4rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center' }}><IconEye /></span> Preview Cards
                      </h3>
                      <div
                        className="d-flex gap-3"
                        style={{ justifyContent: 'center', overflowX: 'auto' }}
                        role="list"
                      >
                        {user.previewCards.map(card => (
                          <div
                            key={card.id}
                            style={{ textAlign: 'center', position: 'relative', flex: '0 0 auto' }}
                            role="listitem"
                          >
                            {card.isFavorite && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '5px',
                                  right: '5px',
                                  fontSize: '1.25rem',
                                  zIndex: 10,
                                  backgroundColor: 'var(--bg-primary)',
                                  borderRadius: '50%',
                                  width: '30px',
                                  height: '30px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  border: '1px solid var(--border-color-light)',
                                  boxShadow: 'var(--shadow-sm)'
                                }}
                                aria-label="Favorited card"
                                role="img"
                              >
                                <IconStarFilled size={20} color="#fbbf24" />
                              </div>
                            )}
                            <div style={{
                              width: '180px',
                              height: '252px',
                              borderRadius: 'var(--radius-lg)',
                              overflow: 'hidden',
                              boxShadow: 'var(--shadow-md)',
                              transition: 'all var(--transition-base)',
                              backgroundColor: 'var(--bg-tertiary)',
                              border: '1px solid var(--border-color)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.05)';
                              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            }}
                            >
                              <img
                                src={card.image || 'https://placehold.co/200x280/eeeeee/999999?text=No+Image'}
                                alt={`${card.name} trading card`}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain',
                                  padding: '0.5rem'
                                }}
                                onError={(e) => {
                                  e.target.src = 'https://placehold.co/200x280/eeeeee/999999?text=No+Image';
                                  e.target.alt = 'Card image unavailable';
                                }}
                                loading="lazy"
                              />
                            </div>
                            <p
                              style={{
                                marginTop: '0.5rem',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                maxWidth: '180px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                color: 'var(--text-primary)'
                              }}
                            >
                              {card.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </Card.Body>
              </Card>
            </article>
          ))}
        </div>
      )}
    </Container>
  );
}
