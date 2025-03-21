import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Table, Form, Modal } from 'react-bootstrap';
import { motion } from 'framer-motion';

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Vegetables',
    price: '',
    quantity: '',
    unit: 'kg',
    description: ''
  });

  // Sample product data for demonstration
  const sampleProducts = [
    { id: 1, name: 'Organic Tomatoes', category: 'Vegetables', price: 40, quantity: 100, unit: 'kg', status: 'Available' },
    { id: 2, name: 'Fresh Potatoes', category: 'Vegetables', price: 25, quantity: 200, unit: 'kg', status: 'Available' },
    { id: 3, name: 'Premium Rice', category: 'Grains', price: 60, quantity: 150, unit: 'kg', status: 'Low Stock' },
    { id: 4, name: 'Red Apples', category: 'Fruits', price: 120, quantity: 50, unit: 'kg', status: 'Available' },
  ];

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userData = JSON.parse(localStorage.getItem('user'));
    
    if (!isAuthenticated || !userData || userData.userType !== 'farmer') {
      // Redirect to login if not authenticated or not a farmer
      navigate('/login');
      return;
    }
    
    setUser(userData);
    
    // Set sample products
    setProducts(sampleProducts);
  }, [navigate]);

  const handleAddProduct = () => {
    const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const product = {
      id,
      ...newProduct,
      status: 'Available'
    };
    
    setProducts([...products, product]);
    setNewProduct({
      name: '',
      category: 'Vegetables',
      price: '',
      quantity: '',
      unit: 'kg',
      description: ''
    });
    setShowAddModal(false);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

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
            <Card className="bg-success text-white shadow">
              <Card.Body>
                <Row className="align-items-center">
                  <Col>
                    <h2 className="mb-0">Farmer Dashboard</h2>
                    <p className="mb-0">Welcome back, {user.name}!</p>
                  </Col>
                  <Col xs="auto">
                    <span className="display-5">🌱</span>
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
              <Card.Body className="d-flex flex-column">
                <Card.Title>Total Products</Card.Title>
                <div className="d-flex align-items-center mt-2">
                  <span className="display-4 me-2">{products.length}</span>
                  <small className="text-muted">items</small>
                </div>
                <div className="mt-auto pt-3">
                  <Button 
                    variant="outline-success" 
                    className="w-100"
                    onClick={() => setShowAddModal(true)}
                  >
                    Add New Product
                  </Button>
                </div>
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
                <Card.Title>Total Sales</Card.Title>
                <div className="d-flex align-items-center mt-2">
                  <span className="display-4 me-2">₹8,520</span>
                </div>
                <p className="text-success mt-2 mb-0">
                  <i className="bi bi-arrow-up"></i> 12% from last month
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
                <Card.Title>Orders</Card.Title>
                <div className="d-flex align-items-center mt-2">
                  <span className="display-4 me-2">12</span>
                  <small className="text-muted">pending</small>
                </div>
                <p className="text-primary mt-2 mb-0">
                  <i className="bi bi-box"></i> 3 ready for delivery
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
                <Card.Title>Buyer Requests</Card.Title>
                <div className="d-flex align-items-center mt-2">
                  <span className="display-4 me-2">5</span>
                  <small className="text-muted">new</small>
                </div>
                <p className="text-danger mt-2 mb-0">
                  <i className="bi bi-clock"></i> 2 urgent requests
                </p>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      <Row>
        <Col>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Your Products</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price (₹/unit)</th>
                      <th>Quantity</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>₹{product.price}/{product.unit}</td>
                        <td>{product.quantity} {product.unit}</td>
                        <td>
                          <span className={`badge bg-${product.status === 'Available' ? 'success' : 'warning'}`}>
                            {product.status}
                          </span>
                        </td>
                        <td>
                          <Button variant="outline-primary" size="sm" className="me-2">
                            Edit
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            Delete
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
      </Row>

      {/* Add Product Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={newProduct.category}
                onChange={handleInputChange}
              >
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Grains">Grains</option>
                <option value="Dairy">Dairy</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Price (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    placeholder="Price per unit"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={newProduct.quantity}
                    onChange={handleInputChange}
                    placeholder="Available quantity"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Unit</Form.Label>
                  <Form.Select
                    name="unit"
                    value={newProduct.unit}
                    onChange={handleInputChange}
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="liter">liter</option>
                    <option value="piece">piece</option>
                    <option value="dozen">dozen</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                placeholder="Product description"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleAddProduct}>
            Add Product
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FarmerDashboard; 