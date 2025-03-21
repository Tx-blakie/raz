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

  // Sample cart data
  const sampleCart = [
    { id: 1, name: 'Organic Carrots', quantity: 3, price: 50, farmer: 'Ramesh Kumar' },
    { id: 2, name: 'Fresh Spinach', quantity: 2, price: 30, farmer: 'Sunil Patel' }
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
    setCart(sampleCart);
  }, [navigate]);

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    // In a real app, this would process the checkout
    alert('Checkout functionality would be implemented here');
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
                  <i className="bi bi-basket"></i> Ready for checkout
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
                  <p className="text-center text-muted py-4">Your cart is empty</p>
                ) : (
                  <>
                    {cart.map(item => (
                      <div key={item.id} className="mb-3 pb-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0">{item.name}</h6>
                          <span>₹{item.price} per unit</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span className="mx-2">{item.quantity}</span>
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                          <div>
                            <span className="me-3">₹{item.price * item.quantity}</span>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleRemoveFromCart(item.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </div>
                        </div>
                        <small className="text-muted">Farmer: {item.farmer}</small>
                      </div>
                    ))}
                    
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5>Total:</h5>
                      <h5>₹{getCartTotal()}</h5>
                    </div>
                    
                    <div className="d-grid">
                      <Button 
                        variant="success" 
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
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