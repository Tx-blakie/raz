import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Table, Badge, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);

  // Sample order data for demonstration
  const sampleOrders = [
    { 
      id: 1, 
      date: '2023-07-15', 
      items: [
        { name: 'Organic Tomatoes', quantity: 10, price: 40 },
        { name: 'Fresh Potatoes', quantity: 5, price: 25 }
      ],
      total: 525,
      status: 'Delivered',
      farmer: 'Ramesh Kumar'
    },
    { 
      id: 2, 
      date: '2023-07-20', 
      items: [
        { name: 'Premium Rice', quantity: 25, price: 60 }
      ],
      total: 1500,
      status: 'Processing',
      farmer: 'Sunil Patel'
    },
    { 
      id: 3, 
      date: '2023-07-25', 
      items: [
        { name: 'Red Apples', quantity: 8, price: 120 },
        { name: 'Organic Bananas', quantity: 5, price: 80 }
      ],
      total: 1360,
      status: 'Shipped',
      farmer: 'Vikram Singh'
    }
  ];

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userData = JSON.parse(localStorage.getItem('user'));
    
    if (!isAuthenticated || !userData || userData.userType !== 'buyer') {
      // Redirect to login if not authenticated or not a buyer
      navigate('/login');
      return;
    }
    
    setUser(userData);
    
    // Set sample data
    setOrders(sampleOrders);
    
    // Get real cart data from localStorage
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, [navigate]);

  const handleRemoveFromCart = (id) => {
    const updatedCart = cart.filter(item => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cart.map(item => 
      item._id === id ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.pricePerUnit * item.quantity), 0);
  };

  const handleCheckout = () => {
    navigate('/cart');
  };

  const filteredOrders = orders.filter(order => 
    order.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!user) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-primary text-white shadow">
              <Card.Body>
                <Row className="align-items-center">
                  <Col>
                    <h2 className="mb-0">Buyer Dashboard</h2>
                    <p className="mb-0">Welcome back, {user.name}!</p>
                  </Col>
                  <Col xs="auto">
                    <span className="display-5">🛒</span>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Marketplace Access Card */}
      <Row className="mb-4">
        <Col>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-0">
                <Row className="g-0">
                  <Col md={8} className="p-4">
                    <h3 className="mb-3">Browse Approved Products</h3>
                    <p className="text-muted">
                      Explore our marketplace of fresh, high-quality agricultural products approved by our team.
                      Find the best deals from local farmers and place your orders directly.
                    </p>
                    <Button 
                      variant="success" 
                      size="lg" 
                      className="mt-2"
                      onClick={() => navigate('/buyer-marketplace')}
                    >
                      <i className="fas fa-store me-2"></i>
                      Go to Marketplace
                    </Button>
                  </Col>
                  <Col md={4} className="bg-light p-4 d-flex flex-column justify-content-center">
                    <div className="text-center">
                      <i className="fas fa-leaf fa-5x text-success mb-3"></i>
                      <h4>Fresh Produce</h4>
                      <p className="mb-0">Direct from farmers</p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={3}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>Total Orders</Card.Title>
                <div className="d-flex align-items-center mt-2">
                  <span className="display-4 me-2">{orders.length}</span>
                  <small className="text-muted">orders</small>
                </div>
                <p className="text-success mt-2 mb-0">
                  <i className="bi bi-arrow-up"></i> 8% from last month
                </p>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
        
        <Col md={3}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>Amount Spent</Card.Title>
                <div className="d-flex align-items-center mt-2">
                  <span className="display-4 me-2">₹3,385</span>
                </div>
                <p className="text-success mt-2 mb-0">
                  <i className="bi bi-arrow-up"></i> 15% from last month
                </p>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
        
        <Col md={3}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>Cart Items</Card.Title>
                <div className="d-flex align-items-center mt-2">
                  <span className="display-4 me-2">{cart.length}</span>
                  <small className="text-muted">items</small>
                </div>
                <p className="text-primary mt-2 mb-0">
                  <Button 
                    variant="link" 
                    className="p-0 text-decoration-none" 
                    onClick={() => navigate('/cart')}
                  >
                    <i className="bi bi-basket me-1"></i>
                    View cart
                  </Button>
                </p>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
        
        <Col md={3}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>Saved Farmers</Card.Title>
                <div className="d-flex align-items-center mt-2">
                  <span className="display-4 me-2">8</span>
                  <small className="text-muted">farmers</small>
                </div>
                <p className="text-success mt-2 mb-0">
                  <i className="bi bi-star"></i> 3 with new products
                </p>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="shadow-sm">
              <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Order History</h5>
                <Form.Control
                  type="text"
                  placeholder="Search orders..."
                  className="w-auto"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Farmer</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.date}</td>
                        <td>{order.items.map(item => item.name).join(', ')}</td>
                        <td>₹{order.total}</td>
                        <td>{order.farmer}</td>
                        <td>
                          <Badge bg={
                            order.status === 'Delivered' ? 'success' : 
                            order.status === 'Shipped' ? 'info' : 'warning'
                          }>
                            {order.status}
                          </Badge>
                        </td>
                        <td>
                          <Button variant="outline-primary" size="sm">
                            Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
        
        <Col md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Your Cart</h5>
              </Card.Header>
              <Card.Body>
                {cart.length === 0 ? (
                  <div className="text-center text-muted py-4">
                    <i className="bi bi-cart3 fs-1 mb-3 d-block"></i>
                    <p>Your cart is empty</p>
                    <Button 
                      variant="primary"
                      onClick={() => navigate('/buyer-marketplace')}
                    >
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <>
                    {cart.slice(0, 3).map(item => (
                      <div key={item._id} className="mb-3 pb-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0">{item.productName}</h6>
                          <span>${item.pricePerUnit} per unit</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <span>Qty: {item.quantity}</span>
                          </div>
                          <div>
                            <span>${(item.pricePerUnit * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                        <small className="text-muted">Farmer: {item.farmer?.name || 'Unknown'}</small>
                      </div>
                    ))}
                    
                    {cart.length > 3 && (
                      <p className="text-center text-muted mb-3">
                        +{cart.length - 3} more items
                      </p>
                    )}
                    
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5>Total:</h5>
                      <h5>${getCartTotal().toFixed(2)}</h5>
                    </div>
                    
                    <div className="d-grid">
                      <Button 
                        variant="success" 
                        onClick={handleCheckout}
                      >
                        Proceed to Checkout
                      </Button>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default BuyerDashboard; 