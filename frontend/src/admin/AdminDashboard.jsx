import { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Tab, Card, Table, Badge, Button, Form, Alert, Modal, Tabs } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

// Function to set auth token
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [filterUserType, setFilterUserType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [assignHelperModal, setAssignHelperModal] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for users and other data
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([
    // Sample product data
    {
      id: 1,
      name: 'Sample Product',
      farmer: 'John Farmer',
      type: 'Vegetable',
      quantity: '100 kg',
      price: '$50',
      status: 'pending',
      submittedDate: '2023-04-15'
    }
  ]);
  const [bids, setBids] = useState([
    // Sample bid data
    {
      id: 1,
      product: 'Sample Product',
      farmer: 'John Farmer',
      buyer: 'Alice Buyer',
      bidAmount: '$45',
      quantity: '50 kg',
      status: 'pending',
      date: '2023-04-16'
    }
  ]);
  const [assignments, setAssignments] = useState([
    // Sample assignment data
    {
      id: 1,
      farmer: 'John Farmer',
      helper: 'Bob Helper',
      task: 'Harvesting',
      status: 'active',
      startDate: '2023-04-17',
      endDate: '2023-04-25'
    }
  ]);
  
  // Check if user is an admin
  const isAdmin = user && user.isAdmin;

  // Redirect if not admin
  useEffect(() => {
    if (user && !isAdmin) {
      navigate('/home');
    }
  }, [user, isAdmin, navigate]);

  // Set auth token when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  // Fetch users from the database
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/api/admin/users');
      
      // Check if we have a valid response with data
      if (response && response.data) {
        // Validate user data before setting it
        const validUsers = response.data.filter(user => {
          // Check if each user has the required properties
          return user && typeof user === 'object' && user._id;
        });
        
        console.log('Valid users:', validUsers.length);
        setUsers(validUsers);
      } else {
        throw new Error('No data received from server');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      
      if (err.response?.status === 401) {
        setError('Authentication error. Please log in again.');
        // Redirect to login page after a short delay
        setTimeout(() => navigate('/login'), 2000);
      } else if (err.response?.status === 403) {
        setError('You do not have permission to access this page.');
        // Redirect to home page after a short delay
        setTimeout(() => navigate('/home'), 2000);
      } else {
        setError('Failed to fetch users: ' + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  // Update user status
  const updateUserStatus = async (userId, status) => {
    try {
      await api.patch(`/api/admin/users/${userId}/status`, { status });
      // Refresh users list after update
      fetchUsers();
    } catch (err) {
      setError('Failed to update user status: ' + (err.response?.data?.message || err.message));
      console.error('Error updating user status:', err);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await api.delete(`/api/admin/users/${userId}`);
        // Refresh users list after deletion
        fetchUsers();
      } catch (err) {
        setError('Failed to delete user: ' + (err.response?.data?.message || err.message));
        console.error('Error deleting user:', err);
      }
    }
  };

  // Load data when component mounts
  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">
          <h4>Access Denied</h4>
          <p>Only administrators can access this dashboard.</p>
          <Button onClick={() => navigate('/home')} variant="primary">
            Back to Home
          </Button>
        </Alert>
      </Container>
    );
  }

  // Filter users based on search term and filter type
  const filteredUsers = users.filter(user => {
    const matchesSearch = (
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm)
    );
    
    const matchesFilter = filterUserType === 'all' || user.userType === filterUserType;
    
    return matchesSearch && matchesFilter;
  });

  // View user details
  const viewUserDetails = (user) => {
    // Validate user object before setting it
    if (user && typeof user === 'object' && user._id) {
      setModalData(user);
      setShowModal(true);
    } else {
      setError('Invalid user data. Cannot display details.');
    }
  };

  // Handler functions for product and bid actions
  const handleProductAction = (product, newStatus) => {
    // Mock implementation
    const updatedProducts = products.map(p => 
      p.id === product.id ? { ...p, status: newStatus } : p
    );
    setProducts(updatedProducts);
  };

  const handleBidAction = (bid, newStatus) => {
    // Mock implementation
    const updatedBids = bids.map(b => 
      b.id === bid.id ? { ...b, status: newStatus } : b
    );
    setBids(updatedBids);
  };

  return (
    <div className="admin-dashboard">
      <Container fluid className="py-4">
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}
        
        <Row>
          {/* Sidebar */}
          <Col lg={3} xl={2} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-0">
                <h5 className="p-3 bg-primary text-white mb-0">Admin Controls</h5>
                <Nav className="flex-column" variant="pills" activeKey={activeTab} onSelect={setActiveTab}>
                  <Nav.Item>
                    <Nav.Link eventKey="users" className="rounded-0 border-bottom px-3 py-3">
                      <i className="bi bi-people me-2"></i>
                      User Management
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="products" className="rounded-0 border-bottom px-3 py-3">
                      <i className="bi bi-box me-2"></i>
                      Product Management
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="bids" className="rounded-0 border-bottom px-3 py-3">
                      <i className="bi bi-cash-stack me-2"></i>
                      Bid Management
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="assignments" className="rounded-0 px-3 py-3">
                      <i className="bi bi-person-check me-2"></i>
                      Helper Assignments
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
            
            <motion.div 
              className="mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-0 shadow-sm bg-success text-white">
                <Card.Body>
                  <h5 className="mb-3">Admin Statistics</h5>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Total Users:</span>
                    <span className="fw-bold">{users.length}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Farmers:</span>
                    <span className="fw-bold">{users.filter(u => u.userType === 'farmer').length}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Buyers:</span>
                    <span className="fw-bold">{users.filter(u => u.userType === 'buyer').length}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Helpers:</span>
                    <span className="fw-bold">{users.filter(u => u.userType === 'helper').length}</span>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          
          {/* Main Content */}
          <Col lg={9} xl={10}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Tab.Content>
                  {/* Users Tab */}
                  <Tab.Pane eventKey="users" active={activeTab === 'users'}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4 className="mb-0">User Management</h4>
                      <Form.Group className="d-flex">
                        <Form.Control
                          type="text"
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="me-2"
                          style={{ width: '200px' }}
                        />
                        <Form.Select 
                          value={filterUserType}
                          onChange={(e) => setFilterUserType(e.target.value)}
                          style={{ width: '150px' }}
                        >
                          <option value="all">All Users</option>
                          <option value="farmer">Farmers</option>
                          <option value="buyer">Buyers</option>
                          <option value="helper">Helpers</option>
                        </Form.Select>
                      </Form.Group>
                    </div>
                    
                    {loading ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <Table responsive hover>
                        <thead className="bg-light">
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Location</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers && filteredUsers.length > 0 ? (
                            filteredUsers.map(user => {
                              if (!user) return null;
                              return (
                                <tr key={user._id || Math.random().toString()}>
                                  <td>{user.name || 'N/A'}</td>
                                  <td>{user.email || 'N/A'}</td>
                                  <td>
                                    <Badge bg={
                                      user.userType === 'farmer' ? 'success' :
                                      user.userType === 'buyer' ? 'primary' :
                                      'info'
                                    }>
                                      {user.userType || 'unknown'}
                                    </Badge>
                                  </td>
                                  <td>
                                    <Badge bg={
                                      user.status === 'active' ? 'success' :
                                      user.status === 'inactive' ? 'danger' :
                                      'warning'
                                    }>
                                      {user.status || 'pending'}
                                    </Badge>
                                  </td>
                                  <td>
                                    {typeof user.location === 'object' 
                                      ? (user.location?.address 
                                          ? `${user.location.address}, ${user.location.district || ''} ${user.location.state || ''}`.trim() 
                                          : 'No address')
                                      : (user.location || 'N/A')}
                                  </td>
                                  <td>
                                    <Button
                                      variant="outline-primary"
                                      size="sm"
                                      className="me-2"
                                      onClick={() => viewUserDetails(user)}
                                    >
                                      View
                                    </Button>
                                    <Button
                                      variant={user.status === 'active' ? 'outline-danger' : 'outline-success'}
                                      size="sm"
                                      className="me-2"
                                      onClick={() => updateUserStatus(user._id, user.status === 'active' ? 'inactive' : 'active')}
                                    >
                                      {user.status === 'active' ? 'Deactivate' : 'Activate'}
                                    </Button>
                                    <Button
                                      variant="danger"
                                      size="sm"
                                      onClick={() => deleteUser(user._id)}
                                    >
                                      Delete
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center">No users found</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    )}
                  </Tab.Pane>
                  
                  {/* Products Tab */}
                  <Tab.Pane eventKey="products" active={activeTab === 'products'}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4 className="mb-0">Product Management</h4>
                      <Form.Group className="d-flex">
                        <Form.Control
                          type="text"
                          placeholder="Search products..."
                          className="me-2"
                          style={{ width: '200px' }}
                        />
                        <Form.Select style={{ width: '150px' }}>
                          <option value="all">All Status</option>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </Form.Select>
                      </Form.Group>
                    </div>
                    
                    <Table responsive hover>
                      <thead className="bg-light">
                        <tr>
                          <th>ID</th>
                          <th>Product Name</th>
                          <th>Farmer</th>
                          <th>Type</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Status</th>
                          <th>Submitted</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products && products.length > 0 ? (
                          products.map(product => (
                            <tr key={product.id}>
                              <td>#{product.id}</td>
                              <td>{product.name}</td>
                              <td>{product.farmer}</td>
                              <td>{product.type}</td>
                              <td>{product.quantity}</td>
                              <td>{product.price}</td>
                              <td>
                                <Badge bg={
                                  product.status === 'approved' ? 'success' : 
                                  product.status === 'rejected' ? 'danger' : 
                                  'warning'
                                }>
                                  {product.status}
                                </Badge>
                              </td>
                              <td>{product.submittedDate}</td>
                              <td>
                                {product.status === 'pending' && (
                                  <>
                                    <Button 
                                      variant="success" 
                                      size="sm" 
                                      className="me-1"
                                      onClick={() => handleProductAction(product, 'approved')}
                                    >
                                      <i className="bi bi-check-lg"></i>
                                    </Button>
                                    <Button 
                                      variant="danger" 
                                      size="sm"
                                      onClick={() => handleProductAction(product, 'rejected')}
                                    >
                                      <i className="bi bi-x-lg"></i>
                                    </Button>
                                  </>
                                )}
                                {product.status !== 'pending' && (
                                  <Button 
                                    variant="primary" 
                                    size="sm"
                                    onClick={() => handleProductAction(product, 'pending')}
                                  >
                                    <i className="bi bi-arrow-counterclockwise"></i>
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="9" className="text-center">No products available</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </Tab.Pane>
                  
                  {/* Bids Tab */}
                  <Tab.Pane eventKey="bids" active={activeTab === 'bids'}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4 className="mb-0">Bid Management</h4>
                      <Form.Group className="d-flex">
                        <Form.Control
                          type="text"
                          placeholder="Search bids..."
                          className="me-2"
                          style={{ width: '200px' }}
                        />
                        <Form.Select style={{ width: '150px' }}>
                          <option value="all">All Status</option>
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </Form.Select>
                      </Form.Group>
                    </div>
                    
                    <Table responsive hover>
                      <thead className="bg-light">
                        <tr>
                          <th>ID</th>
                          <th>Product</th>
                          <th>Farmer</th>
                          <th>Buyer</th>
                          <th>Bid Amount</th>
                          <th>Quantity</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bids && bids.length > 0 ? (
                          bids.map(bid => (
                            <tr key={bid.id}>
                              <td>#{bid.id}</td>
                              <td>{bid.product}</td>
                              <td>{bid.farmer}</td>
                              <td>{bid.buyer}</td>
                              <td>{bid.bidAmount}</td>
                              <td>{bid.quantity}</td>
                              <td>
                                <Badge bg={
                                  bid.status === 'accepted' ? 'success' : 
                                  bid.status === 'rejected' ? 'danger' : 
                                  'warning'
                                }>
                                  {bid.status}
                                </Badge>
                              </td>
                              <td>{bid.date}</td>
                              <td>
                                {bid.status === 'pending' && (
                                  <>
                                    <Button 
                                      variant="success" 
                                      size="sm" 
                                      className="me-1"
                                      onClick={() => handleBidAction(bid, 'accepted')}
                                    >
                                      <i className="bi bi-check-lg"></i>
                                    </Button>
                                    <Button 
                                      variant="danger" 
                                      size="sm"
                                      onClick={() => handleBidAction(bid, 'rejected')}
                                    >
                                      <i className="bi bi-x-lg"></i>
                                    </Button>
                                  </>
                                )}
                                {bid.status !== 'pending' && (
                                  <Button 
                                    variant="primary" 
                                    size="sm"
                                    onClick={() => handleBidAction(bid, 'pending')}
                                  >
                                    <i className="bi bi-arrow-counterclockwise"></i>
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="9" className="text-center">No bids available</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </Tab.Pane>
                  
                  {/* Assignments Tab */}
                  <Tab.Pane eventKey="assignments" active={activeTab === 'assignments'}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4 className="mb-0">Helper Assignments</h4>
                      <Form.Group>
                        <Form.Control
                          type="text"
                          placeholder="Search assignments..."
                          style={{ width: '250px' }}
                        />
                      </Form.Group>
                    </div>
                    
                    <Table responsive hover>
                      <thead className="bg-light">
                        <tr>
                          <th>ID</th>
                          <th>Farmer</th>
                          <th>Helper</th>
                          <th>Task</th>
                          <th>Status</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignments && assignments.length > 0 ? (
                          assignments.map(assignment => (
                            <tr key={assignment.id}>
                              <td>#{assignment.id}</td>
                              <td>{assignment.farmer}</td>
                              <td>{assignment.helper}</td>
                              <td>{assignment.task}</td>
                              <td>
                                <Badge bg={
                                  assignment.status === 'active' ? 'success' : 
                                  assignment.status === 'completed' ? 'info' : 
                                  'warning'
                                }>
                                  {assignment.status}
                                </Badge>
                              </td>
                              <td>{assignment.startDate}</td>
                              <td>{assignment.endDate}</td>
                              <td>
                                <Button 
                                  variant="primary" 
                                  size="sm" 
                                  className="me-1"
                                >
                                  <i className="bi bi-eye"></i>
                                </Button>
                                {assignment.status === 'active' && (
                                  <Button 
                                    variant="success" 
                                    size="sm"
                                  >
                                    <i className="bi bi-check-circle"></i>
                                  </Button>
                                )}
                                {assignment.status === 'pending' && (
                                  <Button 
                                    variant="warning" 
                                    size="sm"
                                  >
                                    <i className="bi bi-play-fill"></i>
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="text-center">No assignments available</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* User Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalData && (
            <div>
              <Row>
                <Col md={6}>
                  <p><strong>Name:</strong> {modalData.name || 'N/A'}</p>
                  <p><strong>Email:</strong> {modalData.email || 'N/A'}</p>
                  <p><strong>Phone:</strong> {modalData.phone || 'N/A'}</p>
                  <p><strong>User Type:</strong> {modalData.userType || 'N/A'}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Status:</strong> {modalData.status || 'Active'}</p>
                  <p><strong>Location:</strong> {
                    typeof modalData.location === 'object' 
                      ? (
                          <>
                            {modalData.location?.address ? modalData.location.address : 'No address'}<br/>
                            {modalData.location?.taluka ? `${modalData.location.taluka}, ` : ''}
                            {modalData.location?.district ? `${modalData.location.district}, ` : ''}
                            {modalData.location?.state || ''}
                            {modalData.location?.pincode ? ` - ${modalData.location.pincode}` : ''}
                          </>
                        )
                      : (modalData.location || 'N/A')
                  }</p>
                  <p><strong>Joined:</strong> {modalData.createdAt ? new Date(modalData.createdAt).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Last Updated:</strong> {modalData.updatedAt ? new Date(modalData.updatedAt).toLocaleDateString() : 'N/A'}</p>
                </Col>
              </Row>
              {modalData.userType === 'farmer' && (
                <div className="mt-3">
                  <h6>Farming Details</h6>
                  <p><strong>Farm Size:</strong> {modalData.farmSize || 'Not specified'}</p>
                  <p><strong>Primary Crops:</strong> {modalData.primaryCrops?.join(', ') || 'Not specified'}</p>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard; 