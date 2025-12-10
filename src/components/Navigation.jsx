import { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router';
import { isLoggedIn, logoutUser, getCurrentUser } from '../utils/api';

export default function Navigation() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  // Check login status on mount and when storage changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const status = isLoggedIn();
      setLoggedIn(status);
      if (status) {
        const user = getCurrentUser();
        setUsername(user?.username || '');
      } else {
        setUsername('');
      }
    };

    checkLoginStatus();

    // Listen for storage changes (e.g., login/logout in another tab)
    window.addEventListener('storage', checkLoginStatus);

    // Custom event for same-tab login/logout updates
    window.addEventListener('authChange', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('authChange', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    setLoggedIn(false);
    setUsername('');
    // Dispatch custom event for auth change
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/">Trading Card Collection</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Browse Users</Nav.Link>
            <Nav.Link as={Link} to="/my-collection">My Collection</Nav.Link>
            {loggedIn ? (
              <>
                <Navbar.Text className="me-2" style={{ color: '#adb5bd' }}>
                  {username}
                </Navbar.Text>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="primary" size="sm" onClick={handleLogin}>
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
