import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Container, Nav, Button, Dropdown } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { authService } from '../services/api';

const Navbar = () => {
  const [expanded, setExpanded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    
    checkAuth();
    
    // Listen for storage events (in case user logs in/out in another tab)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  // Get initials from user name for profile avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <BootstrapNavbar 
      bg="primary-custom" 
      variant="dark" 
      expand="md" 
      expanded={expanded}
      className="py-2"
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to={isAuthenticated ? "/home" : "/login"} className="d-flex align-items-center">
          <motion.span 
            className="d-inline-block me-2 fs-4"
            animate={{ rotate: [0, 10, 0] }}
            transition={{ repeat: Infinity, repeatDelay: 5, duration: 0.5 }}
          >
            🌾
          </motion.span>
          <span className="fw-bold">AgroConnect</span>
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle 
          aria-controls="navbar-nav" 
          onClick={() => setExpanded(!expanded)}
        />
        
        <BootstrapNavbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            {isAuthenticated ? (
              <>
                <NavLink to="/home" onClick={() => setExpanded(false)}>Home</NavLink>
                <NavLink to="/marketplace" onClick={() => setExpanded(false)}>Marketplace</NavLink>
                <NavLink to="/services" onClick={() => setExpanded(false)}>Services</NavLink>
                <NavLink to="/about" onClick={() => setExpanded(false)}>About</NavLink>
                
                {/* Buyer-specific links */}
                {user && user.userType === 'buyer' && (
                  <>
                    <NavLink to="/buyer-marketplace" onClick={() => setExpanded(false)}>
                      Buyer Marketplace
                    </NavLink>
                    <NavLink to="/cart" onClick={() => setExpanded(false)}>
                      <i className="bi bi-cart3 me-1"></i>
                      Cart
                    </NavLink>
                  </>
                )}
                
                {/* Show dashboard link based on user type */}
                {user && (
                  <NavLink 
                    to={`/${user.userType}-dashboard`} 
                    onClick={() => setExpanded(false)}
                  >
                    Dashboard
                  </NavLink>
                )}
                
                {/* Profile dropdown */}
                <div className="ms-md-2 mt-2 mt-md-0 d-flex align-items-center">
                  <Dropdown align="end">
                    <Dropdown.Toggle 
                      as="div" 
                      className="d-flex align-items-center"
                      style={{ cursor: 'pointer' }}
                    >
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="d-flex align-items-center"
                      >
                        <div 
                          className="rounded-circle bg-light text-primary-custom d-flex align-items-center justify-content-center me-2"
                          style={{ width: '35px', height: '35px', fontSize: '14px', fontWeight: 'bold' }}
                        >
                          {user && getInitials(user.name)}
                        </div>
                        <span className="d-none d-md-inline text-light">
                          {user && user.name?.split(' ')[0]}
                        </span>
                      </motion.div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="shadow-sm border-0">
                      <Dropdown.Item 
                        as={Link} 
                        to="/profile"
                        onClick={() => setExpanded(false)}
                      >
                        <i className="bi bi-person me-2"></i>
                        View Profile
                      </Dropdown.Item>
                      <Dropdown.Item 
                        as={Link} 
                        to="/edit-profile"
                        onClick={() => setExpanded(false)}
                      >
                        <i className="bi bi-pencil-square me-2"></i>
                        Edit Profile
                      </Dropdown.Item>
                      
                      {/* Buyer-specific menu items */}
                      {user?.userType === 'buyer' && (
                        <>
                          <Dropdown.Item 
                            as={Link} 
                            to="/buyer-marketplace"
                            onClick={() => setExpanded(false)}
                          >
                            <i className="bi bi-shop me-2"></i>
                            Buyer Marketplace
                          </Dropdown.Item>
                          <Dropdown.Item 
                            as={Link} 
                            to="/cart"
                            onClick={() => setExpanded(false)}
                          >
                            <i className="bi bi-cart3 me-2"></i>
                            Shopping Cart
                          </Dropdown.Item>
                        </>
                      )}
                      
                      <Dropdown.Item 
                        as={Link} 
                        to={`/${user?.userType}-dashboard`}
                        onClick={() => setExpanded(false)}
                      >
                        <i className="bi bi-speedometer2 me-2"></i>
                        Dashboard
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item 
                        onClick={() => {
                          setExpanded(false);
                          handleLogout();
                        }}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={() => setExpanded(false)}>Login</NavLink>
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="ms-md-2 mt-2 mt-md-0"
                >
                  <Button 
                    as={Link} 
                    to="/register" 
                    variant="light" 
                    className="text-primary-custom fw-semibold"
                    onClick={() => setExpanded(false)}
                  >
                    Register
                  </Button>
                </motion.div>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

// NavLink component
const NavLink = ({ children, to, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
  >
    <Nav.Link 
      as={Link} 
      to={to} 
      className="text-light mx-md-1"
      onClick={onClick}
    >
      {children}
    </Nav.Link>
  </motion.div>
);

export default Navbar; 