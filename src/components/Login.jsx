import { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { loginUser } from '../utils/api';
import { useNavigate, Link } from 'react-router';

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
        <Container style={{ maxWidth: '500px', marginTop: '2rem' }}>
            <h1 className="mb-4 text-center">Login</h1>

            <Card>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        {loginError && (
                            <Alert variant="danger" dismissible onClose={() => setLoginError('')}>
                                {loginError}
                            </Alert>
                        )}
                        {loginSuccess && (
                            <Alert variant="success">
                                Login successful! Redirecting...
                            </Alert>
                        )}

                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={loginData.username}
                                onChange={handleChange}
                                required
                                placeholder="Enter your username"
                                autoComplete="off"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={loginData.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter your password"
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            Login
                        </Button>
                    </Form>

                    <div className="text-center mt-3">
                        <small className="text-muted">
                            Don't have an account? <Link to="/signup">Sign up here</Link>
                        </small>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}
