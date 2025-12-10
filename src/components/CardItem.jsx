import { Card, Badge, Button } from 'react-bootstrap';

export default function CardItem({ card, showDelete = false, onDelete, showFavorite = false, onToggleFavorite, showEdit = false, onEdit }) {
  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/200x280/cccccc/666666?text=No+Image';
  };

  return (
    <Card
      style={{
        width: '100%',
        minWidth: '250px',
        height: '100%',
        position: 'relative',
        border: 'none',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all var(--transition-base)',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      {showFavorite && (
        <Button
          variant="link"
          onClick={() => onToggleFavorite(card.id, card.isFavorite)}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 10,
            padding: '8px',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)',
            transition: 'all var(--transition-fast)',
            border: '1px solid var(--border-color-light)',
            color: card.isFavorite ? '#fbbf24' : 'var(--text-light)' // Gold or Slate-400
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            if (!card.isFavorite) e.currentTarget.style.color = '#fbbf24'; // Preview gold on hover
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            if (!card.isFavorite) e.currentTarget.style.color = 'var(--text-light)';
          }}
          title={card.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {card.isFavorite ? (
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22px" height="22px">
               <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
             </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22px" height="22px">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          )}
        </Button>
      )}
      <div style={{
        height: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-tertiary)',
        padding: '1rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <Card.Img
          variant="top"
          src={card.image || 'https://placehold.co/200x280/cccccc/666666?text=No+Image'}
          onError={handleImageError}
          alt=""
          style={{
            height: '100%',
            width: '100%',
            objectFit: 'contain'
          }}
        />
      </div>
      <Card.Body style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
        <Card.Title style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          marginBottom: '1rem',
          color: 'var(--text-primary)',
          wordWrap: 'break-word'
        }}>
          {card.name}
        </Card.Title>
        <Card.Text style={{ fontSize: '0.95rem', lineHeight: '1.8', wordWrap: 'break-word' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Game/Sport:</span>{' '}
            <span style={{ color: 'var(--text-primary)' }}>{card.game}</span>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Set:</span>{' '}
            <span style={{ color: 'var(--text-primary)' }}>{card.set}</span>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Condition:</span>{' '}
            <Badge
              bg="success"
              style={{
                fontSize: '0.85rem',
                padding: '0.35rem 0.75rem',
                fontWeight: 500
              }}
            >
              {card.condition}
            </Badge>
          </div>
          {card.grade && (
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Grade:</span>{' '}
              <Badge
                bg="info"
                text="dark"
                style={{
                  fontSize: '0.85rem',
                  padding: '0.35rem 0.75rem',
                  fontWeight: 500
                }}
              >
                {card.grade}
              </Badge>
            </div>
          )}
          {card.notes && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '3px solid var(--primary-color)'
            }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Notes:</span>
              <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                {card.notes}
              </p>
            </div>
          )}
        </Card.Text>
        {(showEdit || showDelete) && (
          <div className="d-flex gap-2" style={{ marginTop: 'auto' }}>
            {showEdit && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onEdit(card)}
                style={{
                  flex: 1,
                  fontWeight: 500,
                  padding: '0.5rem 1rem'
                }}
              >
                Edit
              </Button>
            )}
            {showDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(card.id)}
                style={{
                  flex: 1,
                  fontWeight: 500,
                  padding: '0.5rem 1rem'
                }}
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
