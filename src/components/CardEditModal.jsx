import { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap';

export default function CardEditModal({ show, onHide, card, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    game: '',
    set: '',
    condition: '',
    grade: '',
    image: '',
    notes: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Update form data when card changes
  useEffect(() => {
    if (card) {
      setFormData({
        name: card.name || '',
        game: card.game || '',
        set: card.set || '',
        condition: card.condition || '',
        grade: card.grade || '',
        image: card.image || '',
        notes: card.notes || ''
      });
    }
  }, [card]);

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
      // Compress the image
      const compressedImage = await compressImage(file, 45); // Target 45KB to leave room

      // Check final size
      const finalSizeKB = (compressedImage.length * 0.75) / 1024;
      
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
    setIsSaving(true);
    setError('');

    try {
      await onSave(card.id, formData);
      onHide();
    } catch (err) {
      setError(err.message || 'Failed to update card. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Card</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
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
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <Form.Text className="text-muted">
                  Upload new image (auto-compressed)
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
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

          <div className="d-flex gap-2 justify-content-end">
            <Button variant="secondary" onClick={onHide} disabled={isSaving}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
