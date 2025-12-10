import { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { registerUser } from '../utils/api';
import { useNavigate, Link } from 'react-router';

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
        <Container style={{ maxWidth: '500px', marginTop: '2rem' }}>
            <h1 className="mb-4 text-center">Sign Up</h1>

            <Card>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        {signupError && (
                            <Alert variant="danger" dismissible onClose={() => setSignupError('')}>
                                {signupError}
                            </Alert>
                        )}
                        {signupSuccess && (
                            <Alert variant="success">
                                Account created successfully! Redirecting to login...
                            </Alert>
                        )}

                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={signupData.username}
                                onChange={handleChange}
                                required
                                minLength={3}
                                placeholder="Choose a username (min 3 characters)"
                                autoComplete="off"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={signupData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                placeholder="Choose a password (min 6 characters)"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={signupData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="Confirm your password"
                            />
                        </Form.Group>

                        <Button variant="success" type="submit" className="w-100">
                            Create Account
                        </Button>
                    </Form>

                    <div className="text-center mt-3">
                        <small className="text-muted">
                            Already have an account? <Link to="/login">Login here</Link>
                        </small>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}
