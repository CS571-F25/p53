import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import CardItem from './CardItem';
import CardUploadForm from './CardUploadForm';
import CardFilter from './CardFilter';
import { getUserCards, getCurrentUser, deleteCard } from '../utils/storage';

export default function Home() {
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    game: '',
    rarity: '',
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

  const loadCards = () => {
    const currentUser = getCurrentUser();
    const userCards = getUserCards(currentUser);
    setCards(userCards);
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

    // Apply rarity filter
    if (filters.rarity) {
      result = result.filter(card => card.rarity === filters.rarity);
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
        case 'rarity':
          return a.rarity.localeCompare(b.rarity);
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

  const handleDeleteCard = (cardId) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      deleteCard(cardId);
      loadCards();
    }
  };

  return (
    <Container>
      <h1 className="mb-4">My Trading Card Collection</h1>

      <div className="mb-3">
        <Button
          variant={showUploadForm ? 'secondary' : 'primary'}
          onClick={() => setShowUploadForm(!showUploadForm)}
        >
          {showUploadForm ? 'Hide Upload Form' : 'Add New Card'}
        </Button>
      </div>

      {showUploadForm && <CardUploadForm onCardAdded={handleCardAdded} />}

      <CardFilter filters={filters} onFilterChange={setFilters} />

      <div className="mb-3">
        <h5>Total Cards: {filteredCards.length}</h5>
      </div>

      {filteredCards.length === 0 ? (
        <div className="text-center p-5">
          <p>No cards found. Add your first card to get started!</p>
        </div>
      ) : (
        <Row>
          {filteredCards.map(card => (
            <Col key={card.id} xs={12} sm={6} md={6} lg={4} xl={3} className="d-flex">
              <CardItem card={card} showDelete={true} onDelete={handleDeleteCard} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}