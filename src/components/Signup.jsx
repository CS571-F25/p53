import { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { registerUser } from '../utils/api';
import { useNavigate, Link } from 'react-router';
import { IconCheck } from './Icons';

export default function Signup() {
    const navigate = useNavigate();
    const [signupData, setSignupData] = useState({ username: '', password: '', confirmPassword: '' });
    const [signupError, setSignupError] = useState('');
    const [signupSuccess, setSignupSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupData(prev => ({ ...prev, [name]: value }));
        setSignupError('');
        setSignupSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSignupError('');
        setSignupSuccess(false);

        // Validate passwords match
        if (signupData.password !== signupData.confirmPassword) {
            setSignupError('Passwords do not match');
            return;
        }

        // Validate password length
        if (signupData.password.length < 6) {
            setSignupError('Password must be at least 6 characters long');
            return;
        }

        try {
            await registerUser(signupData.username, signupData.password);
            setSignupSuccess(true);
            setSignupData({ username: '', password: '', confirmPassword: '' });

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            setSignupError(error.message || 'Signup failed. Username may already exist.');
        }
    };

    return (
        <Container
            style={{
                maxWidth: '500px',
                marginTop: '4rem',
                marginBottom: '4rem'
            }}
        >
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    marginBottom: '0.5rem',
                    letterSpacing: '-0.5px'
                }}>
                    Create Account
                </h1>
                <p style={{
                    fontSize: '1.1rem',
                    color: 'var(--text-secondary)',
                    marginBottom: 0
                }}>
                    Join us and start your collection today
                </p>
            </div>

            <Card style={{
                border: 'none',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-xl)',
                overflow: 'hidden'
            }}>
                <Card.Body style={{ padding: '2.5rem' }}>
                    <Form onSubmit={handleSubmit}>
                        {signupError && (
                            <Alert
                                variant="danger"
                                dismissible
                                onClose={() => setSignupError('')}
                                style={{
                                    borderRadius: 'var(--radius-md)',
                                    border: 'none',
                                    backgroundColor: 'var(--danger-bg)',
                                    color: 'var(--danger-hover)',
                                    fontWeight: 500,
                                    marginBottom: '1.5rem'
                                }}
                            >
                                {signupError}
                            </Alert>
                        )}
                        {signupSuccess && (
                            <Alert
                                variant="success"
                                style={{
                                    borderRadius: 'var(--radius-md)',
                                    border: 'none',
                                    backgroundColor: 'var(--success-bg)',
                                    color: 'var(--success-hover)',
                                    fontWeight: 500,
                                    marginBottom: '1.5rem'
                                }}
                            >
                                <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: '0.5rem' }}><IconCheck /></span> Account created successfully! Redirecting to login...
                            </Alert>
                        )}

                        <Form.Group className="mb-4">
                            <Form.Label style={{
                                fontWeight: 600,
                                color: 'var(--text-primary)',
                                marginBottom: '0.5rem',
                                fontSize: '0.95rem'
                            }}>
                                Username
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={signupData.username}
                                onChange={handleChange}
                                required
                                minLength={3}
                                placeholder="Choose a username (min 3 characters)"
                                autoComplete="off"
                                style={{
                                    padding: '0.75rem 1rem',
                                    fontSize: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '2px solid var(--border-color)',
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
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label style={{
                                fontWeight: 600,
                                color: 'var(--text-primary)',
                                marginBottom: '0.5rem',
                                fontSize: '0.95rem'
                            }}>
                                Password
                            </Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={signupData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                placeholder="Choose a password (min 6 characters)"
                                style={{
                                    padding: '0.75rem 1rem',
                                    fontSize: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '2px solid var(--border-color)',
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
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label style={{
                                fontWeight: 600,
                                color: 'var(--text-primary)',
                                marginBottom: '0.5rem',
                                fontSize: '0.95rem'
                            }}>
                                Confirm Password
                            </Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={signupData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="Confirm your password"
                                style={{
                                    padding: '0.75rem 1rem',
                                    fontSize: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '2px solid var(--border-color)',
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
                        </Form.Group>

                        <Button
                            variant="success"
                            type="submit"
                            className="w-100"
                            style={{
                                padding: '0.875rem 1.5rem',
                                fontSize: '1.05rem',
                                fontWeight: 600,
                                borderRadius: 'var(--radius-md)',
                                border: 'none',
                                boxShadow: 'var(--shadow-sm)',
                                transition: 'all var(--transition-fast)',
                                marginTop: '0.5rem'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = 'var(--shadow-lg)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'var(--shadow-sm)';
                            }}
                        >
                            Create Account
                        </Button>
                    </Form>

                    <div
                        className="text-center mt-4"
                        style={{
                            paddingTop: '1.5rem',
                            borderTop: '1px solid var(--border-color)'
                        }}
                    >
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.95rem',
                            margin: 0
                        }}>
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                style={{
                                    color: 'var(--primary-color)',
                                    textDecoration: 'none',
                                    fontWeight: 600
                                }}
                            >
                                Login here
                            </Link>
                        </p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}
