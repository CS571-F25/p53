import { Form, Row, Col, Card } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';

export default function CardFilter({ filters, onFilterChange, cards = [] }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: value
    });

    // Generate suggestions for search field
    if (name === 'search' && value.trim()) {
      const searchLower = value.toLowerCase();
      const cardNames = cards.map(card => card.name);
      const gameNames = cards.map(card => card.game);
      const allSuggestions = [...new Set([...cardNames, ...gameNames])];

      const filtered = allSuggestions
        .filter(item => item.toLowerCase().includes(searchLower))
        .slice(0, 10);

      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onFilterChange({
      ...filters,
      search: suggestion
    });
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get unique games and grades from user's cards
  const uniqueGames = [...new Set(cards.map(card => card.game))].sort();
  const uniqueGrades = [...new Set(cards.map(card => card.grade).filter(grade => grade))].sort();

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Filter & Sort</Card.Title>
        <Row>
          <Col md={3}>
            <Form.Group className="mb-3" ref={searchRef}>
              <Form.Label>Search</Form.Label>
              <div style={{ position: 'relative' }}>
                <Form.Control
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleChange}
                  placeholder="Search cards..."
                  autoComplete="off"
                />
                {showSuggestions && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    border: '1px solid #ced4da',
                    borderTop: 'none',
                    borderRadius: '0 0 0.375rem 0.375rem',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}>
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        style={{
                          padding: '0.5rem 1rem',
                          cursor: 'pointer',
                          borderBottom: index < suggestions.length - 1 ? '1px solid #f0f0f0' : 'none'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Game/Sport</Form.Label>
              <Form.Select
                name="game"
                value={filters.game}
                onChange={handleChange}
              >
                <option value="">All</option>
                {uniqueGames.map(game => (
                  <option key={game} value={game}>{game}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Grade</Form.Label>
              <Form.Select
                name="grade"
                value={filters.grade}
                onChange={handleChange}
              >
                <option value="">All</option>
                {uniqueGrades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Sort By</Form.Label>
              <Form.Select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleChange}
              >
                <option value="name">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="game">Game/Sport</option>
                <option value="condition">Condition</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
