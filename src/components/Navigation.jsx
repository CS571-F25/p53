import { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router';
import { isLoggedIn, logoutUser, getCurrentUser } from '../utils/api';
import Logo from './Logo';

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
    <Navbar
      expand="lg"
      fixed="top"
      style={{
        background: 'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%)',
        boxShadow: 'var(--shadow-md)',
        padding: '1rem 0'
      }}
      variant="dark"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Logo />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="main-navigation"
          aria-label="Toggle navigation menu"
        />
        <Navbar.Collapse id="main-navigation">
          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link
              as={Link}
              to="/"
              style={{
                color: 'white',
                fontWeight: 500,
                padding: '0.5rem 1rem',
                transition: 'opacity 150ms ease-in-out'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.8'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              Browse Users
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/my-collection"
              style={{
                color: 'white',
                fontWeight: 500,
                padding: '0.5rem 1rem',
                transition: 'opacity 150ms ease-in-out'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.8'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              My Collection
            </Nav.Link>
            {loggedIn ? (
              <>
                <Navbar.Text
                  className="me-2"
                  style={{
                    color: 'white',
                    fontWeight: 700,
                    padding: '0.5rem 1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255, 255, 255, 0.25)'
                  }}
                  aria-label={`Logged in as ${username}`}
                >
                  {username}
                </Navbar.Text>
                <Button
                  variant="light"
                  size="sm"
                  onClick={handleLogout}
                  style={{
                    fontWeight: 500,
                    borderRadius: '0.5rem',
                    padding: '0.5rem 1.25rem'
                  }}
                  aria-label="Logout of your account"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="light"
                size="sm"
                onClick={handleLogin}
                style={{
                  fontWeight: 500,
                  borderRadius: '0.5rem',
                  padding: '0.5rem 1.25rem'
                }}
                aria-label="Login to your account"
              >
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
