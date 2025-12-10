import { Card, Form, Row, Col, Badge, InputGroup } from 'react-bootstrap';
import { IconSearch } from './Icons';
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
    <Card
      className="mb-4"
      style={{
        border: 'none',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        backgroundColor: 'var(--bg-primary)'
      }}
    >
      <Card.Body style={{ padding: '1.5rem' }}>
        <Card.Title style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          marginBottom: '1.5rem',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center' }}><IconSearch /></span> Filter & Sort
        </Card.Title>
        <Row>
          <Col md={3} sm={6}>
            <Form.Group className="mb-3" ref={searchRef}>
              <Form.Label style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Search
              </Form.Label>
              <div style={{ position: 'relative' }}>
                <Form.Control
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleChange}
                  placeholder="Search cards..."
                  autoComplete="off"
                  style={{
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--border-color)',
                    padding: '0.75rem 1rem',
                    fontSize: '0.95rem',
                    transition: 'all var(--transition-fast)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary-color)';
                    e.target.style.boxShadow = '0 0 0 3px var(--focus-ring-color)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-color)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {showSuggestions && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    border: '2px solid var(--primary-color)',
                    borderTop: 'none',
                    borderRadius: '0 0 var(--radius-md) var(--radius-md)',
                    maxHeight: '250px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    boxShadow: 'var(--shadow-lg)',
                    marginTop: '-2px'
                  }}>
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        style={{
                          padding: '0.75rem 1rem',
                          cursor: 'pointer',
                          borderBottom: index < suggestions.length - 1 ? '1px solid var(--border-color)' : 'none',
                          transition: 'background-color var(--transition-fast)',
                          fontSize: '0.95rem'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-tertiary)'}
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
          <Col md={3} sm={6}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Game/Sport
              </Form.Label>
              <Form.Select
                name="game"
                value={filters.game}
                onChange={handleChange}
                style={{
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--border-color)',
                  padding: '0.75rem 1rem',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary-color)';
                  e.target.style.boxShadow = '0 0 0 3px var(--focus-ring-color)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-color)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">All Games</option>
                {uniqueGames.map(game => (
                  <option key={game} value={game}>{game}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3} sm={6}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Grade
              </Form.Label>
              <Form.Select
                name="grade"
                value={filters.grade}
                onChange={handleChange}
                style={{
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--border-color)',
                  padding: '0.75rem 1rem',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary-color)';
                  e.target.style.boxShadow = '0 0 0 3px var(--focus-ring-color)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-color)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">All Grades</option>
                {uniqueGrades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3} sm={6}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Sort By
              </Form.Label>
              <Form.Select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleChange}
                style={{
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--border-color)',
                  padding: '0.75rem 1rem',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary-color)';
                  e.target.style.boxShadow = '0 0 0 3px var(--focus-ring-color)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-color)';
                  e.target.style.boxShadow = 'none';
                }}
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
