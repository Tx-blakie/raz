import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ListGroup, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user data from local storage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  // Function to get user type display text with icon
  const getUserTypeDisplay = (userType) => {
    switch(userType) {
      case 'farmer':
        return (
          <span>
            <i className="bi bi-tree me-1"></i>
            Farmer
          </span>
        );
      case 'buyer':
        return (
          <span>
            <i className="bi bi-cart3 me-1"></i>
            Buyer
          </span>
        );
      case 'helper':
        return (
          <span>
            <i className="bi bi-person-gear me-1"></i>
            Agricultural Helper
          </span>
        );
      default:
        return userType;
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <h2>User not found</h2>
        <p>Please log in to view your profile</p>
        <Button as={Link} to="/login" variant="success">Login</Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col lg={4} className="mb-4 mb-lg-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <div 
                  className="mx-auto rounded-circle bg-success text-white d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}
                >
                  {user.name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2)}
                </div>
                <h3 className="mb-1">{user.name}</h3>
                <p className="text-muted mb-3">{user.email}</p>
                <Badge 
                  bg={user.userType === 'farmer' ? 'success' : user.userType === 'buyer' ? 'primary' : 'warning'}
                  className="px-3 py-2 mb-3 fs-6"
                >
                  {getUserTypeDisplay(user.userType)}
                </Badge>
                <div className="d-grid gap-2 mt-3">
                  <Button 
                    as={Link}
                    to="/edit-profile"
                    variant="outline-success"
                    className="d-flex align-items-center justify-content-center"
                  >
                    <i className="bi bi-pencil-square me-2"></i>
                    Edit Profile
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>

        <Col lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white py-3">
                <h4 className="mb-0">Personal Information</h4>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item className="py-3 px-0 border-top-0">
                    <Row>
                      <Col md={4} className="text-muted">Full Name</Col>
                      <Col md={8} className="fw-medium">{user.name}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item className="py-3 px-0">
                    <Row>
                      <Col md={4} className="text-muted">Email</Col>
                      <Col md={8} className="fw-medium">{user.email}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item className="py-3 px-0">
                    <Row>
                      <Col md={4} className="text-muted">Phone</Col>
                      <Col md={8} className="fw-medium">{user.phone || 'Not provided'}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item className="py-3 px-0">
                    <Row>
                      <Col md={4} className="text-muted">User Type</Col>
                      <Col md={8} className="fw-medium">
                        {getUserTypeDisplay(user.userType)}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white py-3">
                <h4 className="mb-0">Location Information</h4>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item className="py-3 px-0 border-top-0">
                    <Row>
                      <Col md={4} className="text-muted">Address</Col>
                      <Col md={8} className="fw-medium">{user.address || 'Not provided'}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item className="py-3 px-0">
                    <Row>
                      <Col md={4} className="text-muted">Pincode</Col>
                      <Col md={8} className="fw-medium">{user.pincode || 'Not provided'}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item className="py-3 px-0">
                    <Row>
                      <Col md={4} className="text-muted">District</Col>
                      <Col md={8} className="fw-medium">{user.district || 'Not provided'}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item className="py-3 px-0">
                    <Row>
                      <Col md={4} className="text-muted">State</Col>
                      <Col md={8} className="fw-medium">{user.state || 'Not provided'}</Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile; 