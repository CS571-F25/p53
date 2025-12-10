import { Card, Badge, Button } from 'react-bootstrap';

export default function CardItem({ card, showDelete = false, onDelete, showFavorite = false, onToggleFavorite, showEdit = false, onEdit }) {
  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/200x280/cccccc/666666?text=No+Image';
  };

  return (
    <Card style={{ width: '100%', minWidth: '250px', height: '100%', position: 'relative' }}>
      {showFavorite && (
        <Button
          variant="link"
          onClick={() => onToggleFavorite(card.id, card.isFavorite)}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            fontSize: '1.5rem',
            padding: '0',
            zIndex: 10,
            textDecoration: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={card.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {card.isFavorite ? '⭐' : '☆'}
        </Button>
      )}
      <Card.Img
        variant="top"
        src={card.image || 'https://placehold.co/200x280/cccccc/666666?text=No+Image'}
        onError={handleImageError}
        style={{ height: '350px', objectFit: 'contain', backgroundColor: '#f8f9fa' }}
        alt={card.name}
      />
      <Card.Body style={{ textAlign: 'left' }}>
        <Card.Title style={{ wordWrap: 'break-word' }}>{card.name}</Card.Title>
        <Card.Text style={{ wordWrap: 'break-word' }}>
          <strong>Game/Sport:</strong> {card.game}<br />
          <strong>Set:</strong> {card.set}<br />
          <strong>Condition:</strong> <Badge bg="success">{card.condition}</Badge>
          {card.grade && (
            <>
              <br /><strong>Grade:</strong> <Badge bg="info">{card.grade}</Badge>
            </>
          )}
          {card.notes && (
            <>
              <br /><strong>Notes:</strong> {card.notes}
            </>
          )}
        </Card.Text>
        <div className="d-flex gap-2">
          {showEdit && (
            <Button variant="primary" size="sm" onClick={() => onEdit(card)}>
              Edit
            </Button>
          )}
          {showDelete && (
            <Button variant="danger" size="sm" onClick={() => onDelete(card.id)}>
              Delete
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
