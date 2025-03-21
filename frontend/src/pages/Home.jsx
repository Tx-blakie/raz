import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container, Row, Col, Button, Card, Alert } from 'react-bootstrap';

const Home = () => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData && userData !== 'undefined') {
        const parsedUser = JSON.parse(userData);
        if (parsedUser && typeof parsedUser === 'object') {
          setUser(parsedUser);
        }
      }
    } catch (error) {
      console.error('Failed to parse user data:', error);
      localStorage.removeItem('user'); // Clear invalid data
    }
  }, []);
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="position-relative d-flex align-items-center overflow-hidden" style={{ height: "100vh" }}>
        {/* Background Image with Overlay */}
        <div className="position-absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80" 
            alt="Agricultural landscape" 
            className="w-100 h-100 object-fit-cover"
          />
          <div 
            className="position-absolute top-0 start-0 w-100 h-100" 
            style={{ 
              background: "linear-gradient(90deg, rgba(20, 83, 45, 0.8) 0%, rgba(22, 163, 74, 0.5) 100%)" 
            }}
          ></div>
        </div>
        
        {/* Content */}
        <Container className="position-relative z-1">
          <Row className="justify-content-start">
            <Col lg={7}>
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {user && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Alert variant="light" className="mb-4">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h4 className="mb-1">Welcome, {user.name}!</h4>
                          <p className="mb-0">You are logged in as a {user.userType}</p>
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            as={Link} 
                            to={`/${user.userType}-dashboard`} 
                            variant="success" 
                            size="sm"
                          >
                            Go to Dashboard
                          </Button>
                        </motion.div>
                      </div>
                    </Alert>
                  </motion.div>
                )}
                
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="display-4 fw-bold text-white mb-4"
                >
                  Connecting the Agricultural Ecosystem
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="fs-5 text-white mb-4"
                >
                  Smart AgroConnect brings together farmers, buyers, and agricultural helpers 
                  on one platform to create a sustainable and efficient ecosystem.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="d-flex flex-wrap gap-3"
                >
                  {!user ? (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        as={Link} 
                        to="/register" 
                        variant="success" 
                        size="lg" 
                        className="d-flex align-items-center"
                      >
                        <span>Join Now</span>
                        <svg className="ms-2" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        as={Link} 
                        to={`/${user.userType}-dashboard`} 
                        variant="success" 
                        size="lg" 
                        className="d-flex align-items-center"
                      >
                        <span>View Dashboard</span>
                        <svg className="ms-2" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </Button>
                    </motion.div>
                  )}
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      as={Link} 
                      to="/marketplace" 
                      variant="outline-light" 
                      size="lg"
                    >
                      Explore Marketplace
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Action Buttons Section */}
      {user && (
        <section className="py-5 bg-light">
          <Container>
            <h2 className="text-center mb-4">Quick Actions</h2>
            <Row className="g-4">
              {user.userType === 'farmer' && (
                <Col md={4}>
                  <motion.div 
                    whileHover={{ y: -10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card className="h-100 border-0 shadow-sm text-center">
                      <Card.Body className="p-4">
                        <div className="bg-success text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: "80px", height: "80px" }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-basket" viewBox="0 0 16 16">
                            <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9H2zM1 7v1h14V7H1zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5z"/>
                          </svg>
                        </div>
                        <Card.Title className="fs-4 mb-3">Add Commodity</Card.Title>
                        <Card.Text>
                          List your agricultural products for sale on the marketplace
                        </Card.Text>
                        <Button 
                          as={Link} 
                          to="/add-commodity" 
                          variant="success"
                          className="mt-3"
                        >
                          Add Commodity
                        </Button>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              )}
              
              {user.userType === 'helper' && (
                <Col md={4}>
                  <motion.div 
                    whileHover={{ y: -10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card className="h-100 border-0 shadow-sm text-center">
                      <Card.Body className="p-4">
                        <div className="bg-info text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: "80px", height: "80px" }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-briefcase" viewBox="0 0 16 16">
                            <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5m1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0M1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5"/>
                          </svg>
                        </div>
                        <Card.Title className="fs-4 mb-3">Available Jobs</Card.Title>
                        <Card.Text>
                          Browse and apply for available farming jobs in your area
                        </Card.Text>
                        <Button 
                          as={Link} 
                          to="/helper-dashboard" 
                          variant="info"
                          className="mt-3 text-white"
                        >
                          Find Jobs
                        </Button>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              )}

              <Col md={user.userType === 'farmer' || user.userType === 'helper' ? 4 : 6}>
                <motion.div 
                  whileHover={{ y: -10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card className="h-100 border-0 shadow-sm text-center">
                    <Card.Body className="p-4">
                      <div className="bg-primary text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: "80px", height: "80px" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-graph-up-arrow" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M0 0h1v15h15v1H0V0Zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5Z"/>
                        </svg>
                      </div>
                      <Card.Title className="fs-4 mb-3">Market Prices</Card.Title>
                      <Card.Text>
                        View current market prices for various agricultural commodities
                      </Card.Text>
                      <Button 
                        as={Link} 
                        to="/market-prices" 
                        variant="primary"
                        className="mt-3"
                      >
                        View Prices
                      </Button>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>

              {user.userType !== 'helper' && (
                <Col md={user.userType === 'farmer' ? 4 : 6}>
                  <motion.div 
                    whileHover={{ y: -10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card className="h-100 border-0 shadow-sm text-center">
                      <Card.Body className="p-4">
                        <div className="bg-warning text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: "80px", height: "80px" }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-currency-exchange" viewBox="0 0 16 16">
                            <path d="M0 5a5.002 5.002 0 0 0 4.027 4.905 6.46 6.46 0 0 1 .544-2.073C3.695 7.536 3.132 6.864 3 5.91h-.5v-.426h.466V5.05c0-.046 0-.093.004-.135H2.5v-.427h.511C3.236 3.24 4.213 2.5 5.681 2.5c.316 0 .59.031.819.085v.733a3.46 3.46 0 0 0-.815-.082c-.919 0-1.538.466-1.734 1.252h1.917v.427h-1.98c-.003.046-.003.097-.003.147v.422h1.983v.427H3.93c.118.602.468 1.03 1.005 1.229a6.5 6.5 0 0 1 4.97-3.113A5.002 5.002 0 0 0 0 5zm16 5.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0zm-7.75 1.322c.069.835.746 1.485 1.964 1.562V14h.54v-.62c1.259-.086 1.996-.74 1.996-1.69 0-.865-.563-1.31-1.57-1.54l-.426-.1V8.374c.54.06.884.347.966.745h.948c-.07-.804-.779-1.433-1.914-1.502V7h-.54v.629c-1.076.103-1.808.732-1.808 1.622 0 .787.544 1.288 1.45 1.493l.358.085v1.78c-.554-.08-.92-.376-1.003-.787H8.25zm1.96-1.895c-.532-.12-.82-.364-.82-.732 0-.41.311-.719.824-.809v1.54h-.005zm.622 1.044c.645.145.943.38.943.796 0 .474-.37.8-1.02.86v-1.674l.077.018z"/>
                          </svg>
                        </div>
                        <Card.Title className="fs-4 mb-3">{user.userType === 'buyer' ? 'Place Bid' : 'View Bids'}</Card.Title>
                        <Card.Text>
                          {user.userType === 'buyer' 
                            ? 'Place bids on available commodities from verified farmers' 
                            : 'View and manage bids on your commodities'}
                        </Card.Text>
                        <Button 
                          as={Link} 
                          to={user.userType === 'buyer' ? '/place-bid' : '/view-bids'} 
                          variant="warning"
                          className="mt-3 text-white"
                        >
                          {user.userType === 'buyer' ? 'Place Bid' : 'View Bids'}
                        </Button>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              )}
              
              {user.userType === 'helper' && (
                <Col md={4}>
                  <motion.div 
                    whileHover={{ y: -10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card className="h-100 border-0 shadow-sm text-center">
                      <Card.Body className="p-4">
                        <div className="bg-success text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: "80px", height: "80px" }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-calendar-check" viewBox="0 0 16 16">
                            <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                          </svg>
                        </div>
                        <Card.Title className="fs-4 mb-3">My Schedule</Card.Title>
                        <Card.Text>
                          View and manage your upcoming appointments and scheduled jobs
                        </Card.Text>
                        <Button 
                          as={Link} 
                          to="/helper-dashboard" 
                          variant="success"
                          className="mt-3"
                        >
                          View Schedule
                        </Button>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              )}
            </Row>
          </Container>
        </section>
      )}

      {/* CTA Section - Only show for non-logged in users */}
      {!user && (
        <section className="py-5 bg-success text-white">
          <Container>
            <Row className="align-items-center">
              <Col lg={8} className="mb-4 mb-lg-0">
                <h2 className="display-5 fw-bold mb-3">Ready to Join the Agricultural Revolution?</h2>
                <p className="fs-5 text-white-50">
                  Sign up today and become part of a growing community of agricultural professionals making a difference.
                </p>
              </Col>
              <Col lg={4} className="text-lg-end">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    as={Link} 
                    to="/register" 
                    variant="light" 
                    size="lg" 
                    className="text-success fw-bold d-flex align-items-center ms-auto"
                  >
                    Register Now
                    <svg className="ms-2" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </Button>
                </motion.div>
              </Col>
            </Row>
          </Container>
        </section>
      )}
    </div>
  );
};

export default Home; 