import { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { loginUser } from '../utils/api';
import { useNavigate, Link } from 'react-router';
import { IconCheck } from './Icons';

export default function Login() {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
        setLoginError('');
        setLoginSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');
        setLoginSuccess(false);

        try {
            const user = await loginUser(loginData.username, loginData.password);
            setLoginSuccess(true);
            setLoginData({ username: '', password: '' });

            // Dispatch custom event for auth change
            window.dispatchEvent(new Event('authChange'));

            // Redirect to home after 1 second
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            setLoginError(error.message || 'Login failed. Please try again.');
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
                    Welcome Back
                </h1>
                <p style={{
                    fontSize: '1.1rem',
                    color: 'var(--text-secondary)',
                    marginBottom: 0
                }}>
                    Sign in to your account to continue
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
                        {loginError && (
                            <Alert
                                variant="danger"
                                dismissible
                                onClose={() => setLoginError('')}
                                style={{
                                    borderRadius: 'var(--radius-md)',
                                    border: 'none',
                                    backgroundColor: 'var(--danger-bg)',
                                    color: 'var(--danger-hover)',
                                    fontWeight: 500,
                                    marginBottom: '1.5rem'
                                }}
                            >
                                {loginError}
                            </Alert>
                        )}
                        {loginSuccess && (
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
                                <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: '0.5rem' }}><IconCheck /></span> Login successful! Redirecting...
                            </Alert>
                        )}

                        <Form.Group className="mb-4" controlId="login-username">
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
                                value={loginData.username}
                                onChange={handleChange}
                                required
                                placeholder="Enter your username"
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

                        <Form.Group className="mb-4" controlId="login-password">
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
                                value={loginData.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter your password"
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
                            variant="primary"
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
                            Sign In
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
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                style={{
                                    color: 'var(--primary-color)',
                                    textDecoration: 'none',
                                    fontWeight: 600
                                }}
                            >
                                Sign up here
                            </Link>
                        </p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}
