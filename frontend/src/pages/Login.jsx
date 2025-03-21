import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container, Row, Col, Form, Button, Card, Alert, Nav } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [loginType, setLoginType] = useState('user');
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Admin credentials for demo
  const adminCredentials = {
    email: 'admin@agroconnect.com',
    password: 'Admin@123'
  };
  
  useEffect(() => {
    if (location.state?.registrationSuccess) {
      setSuccessMessage('Registration successful! Please login to continue.');
      if (location.state?.email) {
        setFormData(prev => ({
          ...prev,
          email: location.state.email
        }));
      }
    }
  }, [location]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        const result = await login(formData);
        
        if (result.success) {
          const user = JSON.parse(localStorage.getItem('user'));
          
          // Check if user is admin when admin login is selected
          if (loginType === 'admin' && !user.isAdmin) {
            throw new Error('Not authorized as admin');
          }
          
          setSuccessMessage('Login successful!');
          setTimeout(() => {
            navigate(user.isAdmin ? '/admin-dashboard' : '/home');
          }, 1000);
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('Login error:', error);
        setLoginError(error.message || 'Login failed');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <Container className="py-5 min-h-screen d-flex align-items-center justify-content-center">
      <Row className="justify-content-center w-100">
        <Col md={8} lg={6} xl={5}>
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeIn}
          >
            <Card className="shadow-lg border-0">
              <Card.Header className="bg-success text-white text-center py-3">
                <h2 className="fs-4 mb-0">Welcome Back!</h2>
              </Card.Header>
              
              <Card.Body className="p-4">
                {/* Login Type Selector */}
                <Nav 
                  variant="pills" 
                  className="nav-fill mb-4"
                  activeKey={loginType}
                  onSelect={(k) => setLoginType(k)}
                >
                  <Nav.Item>
                    <Nav.Link eventKey="user">User Login</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="admin">Admin Login</Nav.Link>
                  </Nav.Item>
                </Nav>
                
                {successMessage && (
                  <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
                    {successMessage}
                  </Alert>
                )}
                
                {loginError && (
                  <Alert variant="danger" onClose={() => setLoginError('')} dismissible>
                    {loginError}
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                      placeholder="Enter your email"
                      className="py-2"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                      placeholder="Enter your password"
                      className="py-2"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      label="Remember me"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                    {loginType === 'user' && (
                      <Link to="/forgot-password" className="text-success text-decoration-none">
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    className="d-grid"
                  >
                    <Button 
                      variant="success" 
                      type="submit" 
                      size="lg" 
                      className="py-2"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </motion.div>
                  
                  {loginType === 'user' && (
                    <div className="text-center mt-4">
                      <p className="mb-0">
                        Don't have an account? <Link to="/register" className="text-success">Sign up</Link>
                      </p>
                    </div>
                  )}
                  
                  {loginType === 'admin' && (
                    <div className="text-center mt-4">
                      <small className="text-muted">
                        Admin Credentials (for demo):<br />
                        Email: {adminCredentials.email}<br />
                        Password: {adminCredentials.password}
                      </small>
                    </div>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login; 