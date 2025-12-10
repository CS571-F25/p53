import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import CardItem from './CardItem';
import CardUploadForm from './CardUploadForm';
import CardFilter from './CardFilter';
import CardEditModal from './CardEditModal';
import { getUserCards, deleteCard, toggleFavorite, updateCard } from '../utils/storage';
import { getCurrentUser, isLoggedIn } from '../utils/api';
import { useNavigate } from 'react-router';
import { IconChart, IconPlus, IconClose } from './Icons';

export default function Home() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [editingCard, setEditingCard] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filteredCards, setFilteredCards] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    game: '',
    grade: '',
    sortBy: 'name'
  });

  // Load user's cards
  useEffect(() => {
    loadCards();
  }, []);

  // Apply filters and sorting whenever cards or filters change
  useEffect(() => {
    applyFiltersAndSort();
  }, [cards, filters]);

  const loadCards = async () => {
    setIsLoading(true);
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        setCards([]);
        return;
      }
      const userCards = await getUserCards(currentUser.id);
      setCards(userCards);
    } catch (error) {
      console.error("Error loading cards:", error);
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...cards];

    // Apply search filter
    if (filters.search) {
      result = result.filter(card =>
        card.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        card.game.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply game filter
    if (filters.game) {
      result = result.filter(card => card.game === filters.game);
    }

    // Apply grade filter
    if (filters.grade) {
      result = result.filter(card => card.grade === filters.grade);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'game':
          return a.game.localeCompare(b.game);
        case 'condition':
          return a.condition.localeCompare(b.condition);
        default:
          return 0;
      }
    });

    setFilteredCards(result);
  };

  const handleCardAdded = () => {
    loadCards();
    setShowUploadForm(false);
  };

  const handleDeleteCard = async (cardId) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      try {
        await deleteCard(cardId);
        await loadCards();
      } catch (error) {
        console.error("Error deleting card:", error);
        alert("Failed to delete card. Please try again.");
      }
    }
  };

  const handleToggleFavorite = async (cardId, currentFavoriteStatus) => {
    try {
      await toggleFavorite(cardId, currentFavoriteStatus);

      // Update the cards state directly without reloading
      setCards(prevCards =>
        prevCards.map(card =>
          card.id === cardId
            ? { ...card, isFavorite: !currentFavoriteStatus }
            : card
        )
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Failed to update favorite status. Please try again.");
    }
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setShowEditModal(true);
  };

  const handleSaveCard = async (cardId, updatedData) => {
    try {
      // Merge existing card data with updates to ensure we don't lose fields
      // that aren't in the form (like userId, createdAt, isFavorite)
      const cardToUpdate = cards.find(c => c.id === cardId);
      if (!cardToUpdate) throw new Error("Card not found");
      
      const fullUpdate = { ...cardToUpdate, ...updatedData };
      await updateCard(cardId, fullUpdate);

      // Update the cards state directly
      setCards(prevCards =>
        prevCards.map(card =>
          card.id === cardId
            ? { ...card, ...updatedData }
            : card
        )
      );
    } catch (error) {
      console.error("Error updating card:", error);
      throw error;
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingCard(null);
  };

  return (
    <Container
      as="main"
      fluid
      style={{ maxWidth: '1200px', padding: '2rem' }}
      role="main"
      aria-label="My trading card collection"
    >
      <h1 className="mb-5" style={{
        color: 'var(--text-primary)',
        fontWeight: 700,
        textAlign: 'center',
        fontSize: '2.25rem',
        letterSpacing: '-0.02em',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        My Trading Card Collection
      </h1>

      <section aria-label="Card management tools" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        {!isLoggedIn() && (
          <Alert
            variant="warning"
            className="mb-4"
            role="alert"
            style={{
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              backgroundColor: 'var(--warning-bg)',
              color: 'var(--warning-hover)',
              fontWeight: 500,
              padding: '1rem 1.5rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            You are not logged in. Please{' '}
            <Alert.Link
              onClick={() => navigate('/login')}
              style={{
                textDecoration: 'underline',
                cursor: 'pointer',
                color: 'var(--warning-hover)',
                fontWeight: 700
              }}
              aria-label="Navigate to login page"
            >
              login
            </Alert.Link>{' '}
            or{' '}
            <Alert.Link
              onClick={() => navigate('/signup')}
              style={{
                textDecoration: 'underline',
                cursor: 'pointer',
                color: 'var(--warning-hover)',
                fontWeight: 700
              }}
              aria-label="Navigate to signup page"
            >
              sign up
            </Alert.Link>{' '}
            to add cards to your collection.
          </Alert>
        )}

        <div className="mb-4" style={{ textAlign: 'center' }}>
          <Button
            variant={showUploadForm ? 'secondary' : 'primary'}
            onClick={() => setShowUploadForm(!showUploadForm)}
            aria-expanded={showUploadForm}
            aria-controls="card-upload-form"
            aria-label={showUploadForm ? 'Hide card upload form' : 'Show card upload form'}
            style={{
              padding: '0.875rem 2rem',
              fontSize: '1.05rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            {showUploadForm ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}><IconClose /> Hide Upload Form</span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}><IconPlus /> Add New Card</span>
            )}
          </Button>
        </div>

        {showUploadForm && (
          <div id="card-upload-form">
            <CardUploadForm onCardAdded={handleCardAdded} />
          </div>
        )}

        <CardFilter filters={filters} onFilterChange={setFilters} cards={cards} />
      </section>

      <div
        className="mb-4"
        style={{
          marginTop: '3rem',
          textAlign: 'center',
          padding: '1.5rem',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          maxWidth: '400px',
          margin: '3rem auto 2rem auto'
        }}
      >
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem'
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center' }}><IconChart /></span>
          Total Cards: <span style={{ color: 'var(--primary-color)' }}>{filteredCards.length}</span>
        </h2>
      </div>

      {isLoading ? (
        <div className="text-center p-5" role="status" aria-live="polite">
          <Spinner animation="border" aria-hidden="true" />
          <span className="visually-hidden">Loading your collection</span>
          <p className="mt-2" aria-hidden="true">Loading your collection...</p>
        </div>
      ) : filteredCards.length === 0 ? (
        <div className="text-center p-5" role="status" aria-live="polite">
          <p>No cards found. Add your first card to get started!</p>
        </div>
      ) : (
        <section aria-label="Card collection grid">
          <Row>
            {filteredCards.map(card => (
              <Col key={card.id} xs={12} sm={6} md={6} lg={4} xl={3} className="mb-4">
                <CardItem
                  card={card}
                  showEdit={true}
                  onEdit={handleEditCard}
                  showDelete={true}
                  onDelete={handleDeleteCard}
                  showFavorite={true}
                  onToggleFavorite={handleToggleFavorite}
                />
              </Col>
            ))}
          </Row>
        </section>
      )}

      <CardEditModal
        show={showEditModal}
        onHide={handleCloseEditModal}
        card={editingCard}
        onSave={handleSaveCard}
      />
    </Container>
  );
}