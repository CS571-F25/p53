import { Card, Badge, Button } from 'react-bootstrap';

export default function CardItem({ card, showDelete = false, onDelete }) {
  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/200x280/cccccc/666666?text=No+Image';
  };

  return (
    <Card style={{ width: '100%', marginBottom: '1rem', minWidth: '200px' }} className="flex-fill">
      <Card.Img
        variant="top"
        src={card.image || 'https://placehold.co/200x280/cccccc/666666?text=No+Image'}
        onError={handleImageError}
        style={{ height: '280px', objectFit: 'cover' }}
      />
      <Card.Body style={{ textAlign: 'left' }}>
        <Card.Title style={{ wordWrap: 'break-word' }}>{card.name}</Card.Title>
        <Card.Text style={{ wordWrap: 'break-word' }}>
          <strong>Game/Sport:</strong> {card.game}<br />
          <strong>Set:</strong> {card.set}<br />
          <strong>Rarity:</strong> <Badge bg="info">{card.rarity}</Badge><br />
          <strong>Condition:</strong> <Badge bg="success">{card.condition}</Badge>
          {card.notes && (
            <>
              <br /><strong>Notes:</strong> {card.notes}
            </>
          )}
        </Card.Text>
        {showDelete && (
          <Button variant="danger" size="sm" onClick={() => onDelete(card.id)}>
            Delete
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
