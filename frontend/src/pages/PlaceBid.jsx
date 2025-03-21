import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Alert, Modal, Table } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PlaceBid = () => {
  const navigate = useNavigate();
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidQuantity, setBidQuantity] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Check if user is a buyer
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isBuyer = user && user.userType === 'buyer';
  
  // Load mock data
  useEffect(() => {
    // This would be replaced with actual API calls in a real application
    const mockProducts = [
      { id: 101, name: 'Organic Tomatoes', farmer: 'Rahul Kumar', type: 'vegetables', quantity: '30 kg', price: '₹250/5kg', location: 'Pune, Maharashtra', rating: 4.5 },
      { id: 102, name: 'Premium Alphonso Mangoes', farmer: 'Sneha Desai', type: 'fruits', quantity: '25 kg', price: '₹600/5kg', location: 'Nagpur, Maharashtra', rating: 4.8 },
      { id: 103, name: 'Fresh Green Peas', farmer: 'Rahul Kumar', type: 'vegetables', quantity: '40 kg', price: '₹300/5kg', location: 'Pune, Maharashtra', rating: 4.3 },
      { id: 104, name: 'Organic Rice', farmer: 'Sneha Desai', type: 'grains', quantity: '50 kg', price: '₹200/5kg', location: 'Nagpur, Maharashtra', rating: 4.7 },
      { id: 105, name: 'Red Apples', farmer: 'Amit Sharma', type: 'fruits', quantity: '35 kg', price: '₹400/5kg', location: 'Mumbai, Maharashtra', rating: 4.6 },
      { id: 106, name: 'Organic Wheat', farmer: 'Priya Patel', type: 'grains', quantity: '45 kg', price: '₹180/5kg', location: 'Nashik, Maharashtra', rating: 4.4 },
    ];
    
    setProducts(mockProducts);
  }, []);
  
  if (!isBuyer) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">
          <h4>Access Denied</h4>
          <p>Only buyers can access this page to place bids.</p>
          <Button onClick={() => navigate('/home')} variant="primary">
            Back to Home
          </Button>
        </Alert>
      </Container>
    );
  }

  // Filter products based on search and type
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.farmer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || product.type === filterType;
    
    return matchesSearch && matchesType;
  });
  
  // Handle opening the bid modal
  const handleOpenBidModal = (product) => {
    setSelectedProduct(product);
    setShowBidModal(true);
    setBidAmount('');
    setBidQuantity('');
  };
  
  // Handle bid submission
  const handleSubmitBid = () => {
    setLoading(true);
    
    // Validation
    if (!bidAmount || !bidQuantity) {
      setMessage({ type: 'danger', text: 'Please fill in all fields.' });
      setLoading(false);
      return;
    }
    
    if (parseInt(bidQuantity) > parseInt(selectedProduct.quantity.split(' ')[0])) {
      setMessage({ type: 'danger', text: 'Bid quantity cannot exceed available quantity.' });
      setLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setMessage({ type: 'success', text: 'Your bid has been submitted successfully!' });
      setLoading(false);
      
      // Close modal after success
      setTimeout(() => {
        setShowBidModal(false);
        setMessage({ type: '', text: '' });
      }, 2000);
    }, 1500);
  };
  
  // Render star rating
  const renderRating = (rating) => {
    return (
      <div className="text-warning">
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <i
              key={index}
              className={`bi ${starValue <= rating ? 'bi-star-fill' : 
                             starValue <= rating + 0.5 ? 'bi-star-half' : 
                             'bi-star'}`}
            ></i>
          );
        })}
        <span className="text-muted ms-1">({rating})</span>
      </div>
    );
  };
  
  return (
    <div className="py-5">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold mb-3">Place Bids on Commodities</h1>
            <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
              Browse verified farm products and place competitive bids
            </p>
          </div>
          
          {/* Filters */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-3">
              <Row className="align-items-center">
                <Col md={6} lg={5} className="mb-3 mb-md-0">
                  <Form.Control
                    type="text"
                    placeholder="Search products or farmers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Col>
                <Col md={6} lg={4} className="mb-3 mb-lg-0">
                  <Form.Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="grains">Grains</option>
                    <option value="pulses">Pulses</option>
                    <option value="spices">Spices</option>
                  </Form.Select>
                </Col>
                <Col lg={3} className="text-lg-end">
                  <span className="text-muted me-2">Sort by:</span>
                  <Form.Select
                    className="d-inline-block w-auto"
                  >
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </Form.Select>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          
          {/* Products list */}
          <Row className="g-4">
            {filteredProducts.length === 0 ? (
              <Col xs={12}>
                <div className="text-center py-5">
                  <i className="bi bi-search fs-1 text-muted"></i>
                  <p className="mt-3">No products found matching your search criteria.</p>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterType('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </Col>
            ) : (
              filteredProducts.map(product => (
                <Col key={product.id} lg={6} className="mb-4">
                  <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                    <Card className="border-0 shadow-sm h-100">
                      <Card.Body className="p-4">
                        <Row>
                          <Col md={8}>
                            <Badge bg="secondary" className="text-capitalize mb-2">
                              {product.type}
                            </Badge>
                            <h5 className="mb-1">{product.name}</h5>
                            <p className="text-muted mb-2">Farmer: {product.farmer}</p>
                            {renderRating(product.rating)}
                            
                            <div className="mt-3">
                              <div className="d-flex mb-2">
                                <div className="me-4">
                                  <small className="text-muted d-block">Base Price</small>
                                  <span className="fw-bold">{product.price}</span>
                                </div>
                                <div>
                                  <small className="text-muted d-block">Available Quantity</small>
                                  <span className="fw-bold">{product.quantity}</span>
                                </div>
                              </div>
                              <small className="text-muted d-block mb-3">
                                <i className="bi bi-geo-alt me-1"></i>
                                {product.location}
                              </small>
                            </div>
                          </Col>
                          <Col md={4} className="d-flex flex-column justify-content-between align-items-md-end">
                            <div className="text-md-end mb-3 mb-md-0">
                              <img 
                                src={`https://source.unsplash.com/100x100/?${product.name.split(' ')[0].toLowerCase()},farm`} 
                                alt={product.name} 
                                className="rounded"
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                              />
                            </div>
                            <Button 
                              variant="success" 
                              className="w-100"
                              onClick={() => handleOpenBidModal(product)}
                            >
                              Place Bid
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))
            )}
          </Row>
        </motion.div>
      </Container>
      
      {/* Bid Modal */}
      <Modal show={showBidModal} onHide={() => {
        if (!loading) {
          setShowBidModal(false);
          setMessage({ type: '', text: '' });
        }
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Place a Bid</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <>
              <div className="mb-4">
                <h5>{selectedProduct.name}</h5>
                <p className="text-muted mb-0">Farmer: {selectedProduct.farmer}</p>
                <p className="text-muted mb-0">Base Price: {selectedProduct.price}</p>
                <p className="text-muted">Available: {selectedProduct.quantity}</p>
              </div>
              
              {message.text && (
                <Alert variant={message.type} className="mb-3">
                  {message.text}
                </Alert>
              )}
              
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Your Bid Amount (per 5kg)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter your bid price in ₹"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    disabled={loading}
                  />
                  <Form.Text className="text-muted">
                    Base price is {selectedProduct.price}. Place a competitive bid.
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Quantity Required (kg)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter quantity in kg"
                    value={bidQuantity}
                    onChange={(e) => setBidQuantity(e.target.value)}
                    max={parseInt(selectedProduct.quantity.split(' ')[0])}
                    disabled={loading}
                  />
                  <Form.Text className="text-muted">
                    Maximum available: {selectedProduct.quantity}
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Additional Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Any specific requirements or delivery instructions"
                    disabled={loading}
                  />
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => {
              if (!loading) {
                setShowBidModal(false);
                setMessage({ type: '', text: '' });
              }
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="success" 
            onClick={handleSubmitBid}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Submitting...
              </>
            ) : 'Submit Bid'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PlaceBid; 