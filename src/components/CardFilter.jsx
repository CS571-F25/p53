import { Form, Row, Col, Card } from 'react-bootstrap';

export default function CardFilter({ filters, onFilterChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: value
    });
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Filter & Sort</Card.Title>
        <Row>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Search</Form.Label>
              <Form.Control
                type="text"
                name="search"
                value={filters.search}
                onChange={handleChange}
                placeholder="Search cards..."
              />
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
                <option value="Pokemon">Pokemon</option>
                <option value="Magic: The Gathering">Magic: The Gathering</option>
                <option value="Baseball">Baseball</option>
                <option value="Basketball">Basketball</option>
                <option value="Football">Football</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Rarity</Form.Label>
              <Form.Select
                name="rarity"
                value={filters.rarity}
                onChange={handleChange}
              >
                <option value="">All</option>
                <option value="Common">Common</option>
                <option value="Uncommon">Uncommon</option>
                <option value="Rare">Rare</option>
                <option value="Ultra Rare">Ultra Rare</option>
                <option value="Mythic Rare">Mythic Rare</option>
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
                <option value="rarity">Rarity</option>
                <option value="condition">Condition</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
