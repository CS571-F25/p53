import { useState } from 'react';
import { useNavigate } from 'react-router';
import { IconCheck, IconPlus } from './Icons';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { addCard } from '../utils/storage';
import { isLoggedIn } from '../utils/api';

export default function CardUploadForm({ onCardAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    game: '',
    set: '',
    condition: '',
    grade: '',
    image: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const compressImage = (file, maxSizeKB = 50) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Calculate new dimensions (start with max 800px width)
          let width = img.width;
          let height = img.height;
          const maxDimension = 800;

          if (width > height && width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Try different quality levels to get under target size
          const tryCompress = (quality) => {
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            const sizeKB = (dataUrl.length * 0.75) / 1024; // Estimate base64 size

            if (sizeKB <= maxSizeKB || quality <= 0.1) {
              return dataUrl;
            }

            // Reduce quality if still too large
            return tryCompress(quality - 0.1);
          };

          const compressed = tryCompress(0.8);
          resolve(compressed);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setError('Compressing image...');

      // Compress the image
      const compressedImage = await compressImage(file, 45); // Target 45KB to leave room

      // Check final size
      const finalSizeKB = (compressedImage.length * 0.75) / 1024;
      console.log(`Compressed image size: ${finalSizeKB.toFixed(1)}KB`);

      if (finalSizeKB > 50) {
        setError(`Image is still too large after compression (${finalSizeKB.toFixed(1)}KB). Please use a smaller image or provide an image URL instead.`);
        e.target.value = '';
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: compressedImage
      }));
      setError('');
    } catch (err) {
      setError('Failed to process image. Please try a different image or use an image URL instead.');
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    if (!isLoggedIn()) {
      setError('You must be logged in to add cards. Please visit Settings to login or sign up.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Add the card via API
      const newCard = await addCard(formData);

      // Reset form
      setFormData({
        name: '',
        game: '',
        set: '',
        condition: '',
        grade: '',
        image: '',
        notes: ''
      });

      // Notify parent component
      if (onCardAdded) {
        onCardAdded(newCard);
      }
    } catch (err) {
      setError(err.message || 'Failed to add card. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <Card.Body style={{ padding: '2rem' }}>
        <Card.Title style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          marginBottom: '1.5rem',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center' }}><IconPlus /></span> Add New Card
        </Card.Title>
        {error && (
          <Alert
            variant="danger"
            dismissible
            onClose={() => setError('')}
            style={{
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger-hover)',
              fontWeight: 500
            }}
          >
            {error}
          </Alert>
        )}
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
                  autoComplete="off"
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
                  autoComplete="off"
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
                  autoComplete="off"
                />
              </Form.Group>
            </Col>
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
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Grade</Form.Label>
                <Form.Control
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  placeholder="e.g., PSA 10, BGS 9.5"
                  autoComplete="off"
                />
                <Form.Text className="text-muted">
                  Professional grading (optional)
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <Form.Text className="text-muted">
                  Images will be automatically compressed. For best results, use an image URL.
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Or Image URL</Form.Label>
                <Form.Control
                  type="url"
                  name="image"
                  value={formData.image && !formData.image.startsWith('data:') ? formData.image : ''}
                  onChange={handleChange}
                  placeholder="https://example.com/card-image.jpg"
                  autoComplete="off"
                />
              </Form.Group>
            </Col>
          </Row>

          {formData.image && (
            <Row>
              <Col>
                <div className="mb-3">
                  <small className="text-muted">Image Preview:</small>
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Card preview"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '200px',
                        objectFit: 'contain',
                        border: '1px solid var(--border-color-light)',
                        borderRadius: 'var(--radius-sm)'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional information..."
              autoComplete="off"
            />
          </Form.Group>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '0.875rem 2.5rem',
                fontSize: '1.05rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all var(--transition-fast)',
                minWidth: '200px'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = 'var(--shadow-md)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              {isSubmitting ? (
                <>
                  <IconCheck /> Adding Card...
                </>
              ) : (
                <>
                  <IconPlus /> Add Card to Collection
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
