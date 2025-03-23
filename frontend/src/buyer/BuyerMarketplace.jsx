import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './BuyerMarketplace.css';

const BuyerMarketplace = () => {
  // State variables
  const navigate = useNavigate();
  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cart, setCart] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch commodities when component mounts
  useEffect(() => {
    const fetchCommodities = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/commodities/marketplace');
        if (response.status === 200) {
          setCommodities(response.data);
        }
      } catch (err) {
        console.error('Error fetching commodities:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCommodities();
    
    // Load cart from localStorage
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Update cart in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Apply filters and sorting to the commodities
  const filteredCommodities = commodities.filter(commodity => {
    // Filter by type
    if (filterType !== 'all' && commodity.commodityType !== filterType) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !commodity.productName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by price range
    if (priceRange.min && commodity.pricePerUnit < parseFloat(priceRange.min)) {
      return false;
    }
    if (priceRange.max && commodity.pricePerUnit > parseFloat(priceRange.max)) {
      return false;
    }
    
    return true;
  });

  // Sort the filtered commodities
  const sortedCommodities = [...filteredCommodities].sort((a, b) => {
    switch (sortBy) {
      case 'priceAsc':
        return a.pricePerUnit - b.pricePerUnit;
      case 'priceDesc':
        return b.pricePerUnit - a.pricePerUnit;
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      default:
        return 0;
    }
  });

  // Function to handle adding product to cart
  const handleAddToCart = (commodity) => {
    try {
      if (!commodity || !commodity._id) {
        console.error('Invalid commodity data:', commodity);
        setToastMessage('Failed to add item to cart. Missing product data.');
        setShowToast(true);
        return;
      }

      // Check if already in cart
      const existingItemIndex = cart.findIndex(item => item._id === commodity._id);
      
      if (existingItemIndex !== -1) {
        // Update quantity if already in cart
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += 1;
        setCart(updatedCart);
        setToastMessage(`Increased ${commodity.productName} quantity in cart`);
      } else {
        // Create a complete copy with ALL necessary fields for the cart
        const itemToAdd = {
          _id: commodity._id,
          productName: commodity.productName || 'Product',
          pricePerUnit: Number(commodity.pricePerUnit || 0),
          commodityType: commodity.commodityType || 'Other',
          unit: commodity.unit || 'unit',
          quantity: 1,
          farmer: commodity.farmer || { name: 'Unknown Farmer' },
          description: commodity.description || '',
          // Ensure image URLs are properly formatted
          imageUrl: commodity.imageUrl ? 
            (commodity.imageUrl.startsWith('http') ? 
              commodity.imageUrl : 
              `https://via.placeholder.com/200x200.png?text=${encodeURIComponent(commodity.commodityType || 'Product')}`) 
            : `https://via.placeholder.com/200x200.png?text=${encodeURIComponent(commodity.commodityType || 'Product')}`
        };
        
        // Update state
        setCart(prev => [...prev, itemToAdd]);
        setToastMessage(`Added ${commodity.productName} to cart`);
        
        // Save to localStorage immediately
        localStorage.setItem('cart', JSON.stringify([...cart, itemToAdd]));
      }
      
      // If there's an existing item, update its quantity in localStorage
      if (existingItemIndex !== -1) {
        const updatedCartForStorage = cart.map(item => 
          item._id === commodity._id ? {...item, quantity: item.quantity + 1} : item
        );
        localStorage.setItem('cart', JSON.stringify(updatedCartForStorage));
      }
      
      // Show success toast
      setShowToast(true);
      
      // Animate the cart button
      const cartButton = document.querySelector('.cart-button');
      if (cartButton) {
        cartButton.classList.add('cart-button-animate');
        setTimeout(() => {
          cartButton.classList.remove('cart-button-animate');
        }, 700);
      }
    } catch (err) {
      console.error('Error adding item to cart:', err);
      setToastMessage('Failed to add item to cart. Please try again.');
      setShowToast(true);
    }
  };

  // Function to handle view product details
  const handleViewDetails = (commodity) => {
    setSelectedCommodity(commodity);
    setShowModal(true);
  };

  // Function to handle going to cart page
  const handleGoToCart = () => {
    navigate('/cart');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Calculate total items in cart
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Helper function to get proper image URL
  const getProductImage = (imageUrl, commodityType) => {
    if (!imageUrl) {
      // Return a typed placeholder if no image
      return `https://via.placeholder.com/300x200.png?text=${encodeURIComponent(commodityType || 'Product')}`;
    }
    
    // Check if it's a full URL
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // If it's a relative path, use a placeholder instead
    return `https://via.placeholder.com/300x200.png?text=${encodeURIComponent(commodityType || 'Product')}`;
  };

  return (
    <Container fluid className="py-4">
      {/* Hero Section */}
      <Row className="mb-4">
        <Col>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hero-section text-center p-5 rounded"
          >
            <h1 className="display-4 fw-bold text-white mb-3">Buyer's Marketplace</h1>
            <p className="lead text-white mb-4">
              Discover fresh produce directly from local farmers at competitive prices
            </p>
            <Form>
              <Row className="justify-content-center">
                <Col md={6}>
                  <InputGroup className="mb-3">
                    <Form.Control
                      placeholder="Search for products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="light">
                      <i className="fas fa-search"></i>
                    </Button>
                  </InputGroup>
                </Col>
              </Row>
            </Form>
          </motion.div>
        </Col>
      </Row>

      {/* Cart status */}
      <Row className="mb-4">
        <Col className="d-flex justify-content-end">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="success" 
              className="cart-button"
              onClick={handleGoToCart}
            >
              <i className="fas fa-shopping-cart me-2"></i>
              Cart 
              {cartItemCount > 0 && (
                <Badge 
                  bg="light" 
                  text="dark" 
                  pill 
                  className="ms-2 cart-counter"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </motion.div>
        </Col>
      </Row>

      {/* Filters and Sorting */}
      <Row className="mb-4">
        <Col md={3} className="mb-3 mb-md-0">
          <Card>
            <Card.Header className="bg-light">
              <h5 className="mb-0">Filters</h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Product Type</Form.Label>
                  <Form.Select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="grains">Grains</option>
                    <option value="dairy">Dairy</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Price Range</Form.Label>
                  <Row>
                    <Col>
                      <Form.Control 
                        type="number" 
                        placeholder="Min" 
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                      />
                    </Col>
                    <Col>
                      <Form.Control 
                        type="number" 
                        placeholder="Max" 
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                      />
                    </Col>
                  </Row>
                </Form.Group>
                <Button 
                  variant="outline-primary" 
                  className="w-100"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('all');
                    setPriceRange({ min: '', max: '' });
                  }}
                >
                  Reset Filters
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={9}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <span className="me-2">Sort by:</span>
              <Form.Select 
                style={{ width: 'auto', display: 'inline-block' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </Form.Select>
            </div>
            <div className="view-toggle">
              <Button 
                variant={viewMode === 'grid' ? 'primary' : 'outline-primary'} 
                className="me-2"
                onClick={() => setViewMode('grid')}
              >
                <i className="fas fa-th"></i>
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                onClick={() => setViewMode('list')}
              >
                <i className="fas fa-list"></i>
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center my-5">
              <Spinner animation="border" variant="primary" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* No Results */}
          {!loading && !error && sortedCommodities.length === 0 && (
            <div className="text-center my-5">
              <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search term</p>
            </div>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4"
            >
              {sortedCommodities.map(commodity => (
                <motion.div 
                  key={commodity._id} 
                  className="col"
                  variants={itemVariants}
                >
                  <Card className="h-100 product-card">
                    <div className="product-img-wrapper">
                      <Card.Img 
                        variant="top" 
                        src={getProductImage(commodity.imageUrl, commodity.commodityType)}
                        alt={commodity.productName}
                        className="product-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://via.placeholder.com/300x200.png?text=${encodeURIComponent(commodity.commodityType || 'Product')}`;
                        }}
                      />
                    </div>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Card.Title className="mb-0">{commodity.productName}</Card.Title>
                        <Badge bg="success">₹{commodity.pricePerUnit}</Badge>
                      </div>
                      <Card.Text className="text-muted small">
                        {commodity.farmer.name} • {commodity.farmer.location?.address || 'Location N/A'}
                      </Card.Text>
                      <Card.Text className="product-description">
                        {commodity.description}
                      </Card.Text>
                      <div className="d-flex justify-content-between mt-auto">
                        <div>
                          <Badge bg="info" className="me-2">{commodity.commodityType}</Badge>
                          <Badge bg="secondary">{commodity.quantity} {commodity.unit}</Badge>
                        </div>
                      </div>
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-between bg-white border-top-0">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleViewDetails(commodity)}
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleAddToCart(commodity)}
                        className="add-to-cart-btn"
                      >
                        <i className="fas fa-cart-plus me-1"></i>
                        Add to Cart
                      </Button>
                    </Card.Footer>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {sortedCommodities.map(commodity => (
                <motion.div 
                  key={commodity._id}
                  variants={itemVariants}
                  className="mb-3"
                >
                  <Card className="product-list-card">
                    <Row className="g-0">
                      <Col md={3}>
                        <div className="product-img-wrapper h-100">
                          <Card.Img 
                            src={getProductImage(commodity.imageUrl, commodity.commodityType)}
                            alt={commodity.productName}
                            className="product-img h-100"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://via.placeholder.com/300x200.png?text=${encodeURIComponent(commodity.commodityType || 'Product')}`;
                            }}
                          />
                        </div>
                      </Col>
                      <Col md={9}>
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <Card.Title>{commodity.productName}</Card.Title>
                            <Badge bg="success" className="price-badge">₹{commodity.pricePerUnit}</Badge>
                          </div>
                          <Card.Text className="text-muted small">
                            {commodity.farmer.name} • {commodity.farmer.location?.address || 'Location N/A'}
                          </Card.Text>
                          <Card.Text>{commodity.description}</Card.Text>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <Badge bg="info" className="me-2">{commodity.commodityType}</Badge>
                              <Badge bg="secondary">{commodity.quantity} {commodity.unit}</Badge>
                              <small className="ms-3 text-muted">
                                Listed: {new Date(commodity.createdAt).toLocaleDateString()}
                              </small>
                            </div>
                            <div>
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                className="me-2"
                                onClick={() => handleViewDetails(commodity)}
                              >
                                View Details
                              </Button>
                              <Button 
                                variant="primary" 
                                size="sm"
                                onClick={() => handleAddToCart(commodity)}
                                className="add-to-cart-btn"
                              >
                                <i className="fas fa-cart-plus me-1"></i>
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </Col>
      </Row>

      {/* Product Details Modal */}
      {selectedCommodity && (
        <div className="modal fade show" style={{ display: showModal ? 'block' : 'none' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedCommodity.productName}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <img 
                      src={getProductImage(selectedCommodity.imageUrl, selectedCommodity.commodityType)}
                      alt={selectedCommodity.productName}
                      className="img-fluid rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://via.placeholder.com/400x300.png?text=${encodeURIComponent(selectedCommodity.commodityType || 'Product')}`;
                      }}
                    />
                  </div>
                  <div className="col-md-6">
                    <h3 className="mb-3">₹{selectedCommodity.pricePerUnit} <small className="text-muted">per {selectedCommodity.unit}</small></h3>
                    <p className="mb-3">{selectedCommodity.description}</p>
                    <p>
                      <strong>Type:</strong> {selectedCommodity.commodityType}<br />
                      <strong>Quantity Available:</strong> {selectedCommodity.quantity} {selectedCommodity.unit}<br />
                      <strong>Farmer:</strong> {selectedCommodity.farmer.name}<br />
                      <strong>Location:</strong> {selectedCommodity.farmer.location?.address || 'Location N/A'}<br />
                      <strong>Listed:</strong> {new Date(selectedCommodity.createdAt).toLocaleDateString()}
                    </p>
                    <div className="d-grid gap-2">
                      <Button 
                        variant="primary" 
                        onClick={() => {
                          handleAddToCart(selectedCommodity);
                          setShowModal(false);
                        }}
                      >
                        Add to Cart
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => {
                          // In a real app, this would navigate to contact page
                          alert(`Contact ${selectedCommodity.farmer.name}`);
                        }}
                      >
                        Contact Farmer
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Button 
                  variant="secondary" 
                  onClick={() => setShowModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
      
      {/* Toast notification */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={3000} 
          autohide
          bg="success"
          className="toast-notification"
        >
          <Toast.Header closeButton={true}>
            <i className="fas fa-check-circle me-2"></i>
            <strong className="me-auto">Cart Updated</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default BuyerMarketplace; 