import { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { addCard } from '../utils/storage';

export default function CardUploadForm({ onCardAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    game: '',
    set: '',
    rarity: '',
    condition: '',
    image: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add the card to localStorage
    const newCard = addCard(formData);

    // Reset form
    setFormData({
      name: '',
      game: '',
      set: '',
      rarity: '',
      condition: '',
      image: '',
      notes: ''
    });

    // Notify parent component
    if (onCardAdded) {
      onCardAdded(newCard);
    }
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Add New Card</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Card Name*</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter card name"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Game/Sport*</Form.Label>
                <Form.Control
                  type="text"
                  name="game"
                  value={formData.game}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Pokemon, Magic, Baseball"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Set*</Form.Label>
                <Form.Control
                  type="text"
                  name="set"
                  value={formData.set}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Base Set, Alpha"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Rarity*</Form.Label>
                <Form.Select
                  name="rarity"
                  value={formData.rarity}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select rarity...</option>
                  <option value="Common">Common</option>
                  <option value="Uncommon">Uncommon</option>
                  <option value="Rare">Rare</option>
                  <option value="Ultra Rare">Ultra Rare</option>
                  <option value="Mythic Rare">Mythic Rare</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Condition*</Form.Label>
                <Form.Select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select condition...</option>
                  <option value="Mint">Mint</option>
                  <option value="Near Mint">Near Mint</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/card-image.jpg"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional information..."
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Add Card to Collection
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
