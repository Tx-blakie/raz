import { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Tab, Card, Table, Badge, Button, Form, Alert, Modal, Tabs, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

// Function to set auth token
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

const AdminDashboard = ({ activeTab: initialActiveTab }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialActiveTab || 'users');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [filterUserType, setFilterUserType] = useState('all');
  const [filterProductStatus, setFilterProductStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [assignHelperModal, setAssignHelperModal] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [commodityToReject, setCommodityToReject] = useState(null);
  
  // State for users and other data
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [bids, setBids] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Farmer Guidelines.pdf', type: 'PDF', size: '2.4 MB', uploadedBy: 'Admin', date: '2023-05-15', category: 'guidelines' },
    { id: 2, name: 'Quality Standards.docx', type: 'Word', size: '1.8 MB', uploadedBy: 'Admin', date: '2023-06-22', category: 'standards' },
    { id: 3, name: 'Market Analysis Report.xlsx', type: 'Excel', size: '3.2 MB', uploadedBy: 'Admin', date: '2023-07-10', category: 'reports' },
    { id: 4, name: 'Organic Certification Process.pdf', type: 'PDF', size: '4.1 MB', uploadedBy: 'Admin', date: '2023-08-05', category: 'certification' },
    { id: 5, name: 'Commodity Pricing Guide.pdf', type: 'PDF', size: '1.5 MB', uploadedBy: 'Admin', date: '2023-09-18', category: 'pricing' }
  ]);
  const [documentCategories] = useState([
    'All', 'Guidelines', 'Standards', 'Reports', 'Certification', 'Pricing', 'Other'
  ]);
  const [selectedDocCategory, setSelectedDocCategory] = useState('All');
  const [documentSearchTerm, setDocumentSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newDocument, setNewDocument] = useState({
    name: '',
    category: 'guidelines',
    file: null
  });
  
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
    // Debug user data
    console.log("AdminDashboard - User data:", user);
    console.log("AdminDashboard - localStorage token:", localStorage.getItem('token'));
    console.log("AdminDashboard - localStorage user:", localStorage.getItem('user'));
    
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
    
    fetchUsers();
    fetchCommodities();
    
    // Clean up function
    return () => {
      setAuthToken(null);
    };
  }, []);

  // Fetch users from the database
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/users');
      if (response.status === 200) {
        setUsers(response.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch commodities from the database
  const fetchCommodities = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/commodities');
      if (response.status === 200) {
        setProducts(response.data);
      }
    } catch (err) {
      console.error('Error fetching commodities:', err);
      setError(err.response?.data?.message || 'Failed to fetch commodities');
    } finally {
      setLoading(false);
    }
  };

  // Update commodity status
  const handleCommodityAction = async (commodityId, newStatus, rejectionReason = '') => {
    try {
      setLoading(true);
      const data = { 
        status: newStatus
      };
      
      // Add rejection reason if provided
      if (newStatus === 'rejected' && rejectionReason) {
        data.rejectionReason = rejectionReason;
      }
      
      const response = await api.patch(`/api/admin/commodities/${commodityId}/status`, data);
      
      if (response.status === 200) {
        // Update products array with the updated commodity
        setProducts(prevProducts => 
          prevProducts.map(product => 
            product._id === commodityId 
              ? { ...product, status: newStatus, ...(newStatus === 'rejected' ? { rejectionReason } : {}) } 
              : product
          )
        );
        
        // Update modal data if this is the currently viewed commodity
        if (modalData && modalData._id === commodityId) {
          setModalData(prev => ({ 
            ...prev, 
            status: newStatus,
            ...(newStatus === 'rejected' ? { rejectionReason } : {})
          }));
        }
        
        // Close modal if present
        setShowModal(false);
      } else {
        setError('Failed to update commodity status');
      }
    } catch (err) {
      console.error('Error updating commodity status:', err);
      setError(err.response?.data?.message || 'Failed to update commodity status');
    } finally {
      setLoading(false);
    }
  };

  // Handle reject button click
  const handleRejectClick = (commodity) => {
    setCommodityToReject(commodity);
    setRejectionReason('');
    setShowRejectionModal(true);
  };

  // Handle confirm rejection
  const handleConfirmReject = () => {
    if (commodityToReject && rejectionReason.trim()) {
      handleCommodityAction(commodityToReject._id, 'rejected', rejectionReason);
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

  if (!isAdmin) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Access Denied</Alert.Heading>
          <p>You do not have admin permissions to view this page.</p>
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

  // Filter products based on search term and status
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || (
      product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.commodityType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.farmer?.name && product.farmer.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    const matchesFilter = filterProductStatus === 'all' || product.status === filterProductStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Filter documents based on category and search term
  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedDocCategory === 'All' || 
                           doc.category.toLowerCase() === selectedDocCategory.toLowerCase();
    const matchesSearch = doc.name.toLowerCase().includes(documentSearchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
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

  // View product details
  const viewProductDetails = (product) => {
    if (product && typeof product === 'object' && product._id) {
      setModalData(product);
      setShowModal(true);
    } else {
      setError('Invalid product data. Cannot display details.');
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

  // Handle document upload
  const handleDocumentUpload = () => {
    if (!newDocument.name || !newDocument.file) {
      setError('Please provide a document name and file');
      return;
    }
    
    // In a real app, you would upload the file to a server
    // For this mock, we'll just add it to the state
    const newDoc = {
      id: documents.length + 1,
      name: newDocument.name,
      type: newDocument.file.name.split('.').pop().toUpperCase(),
      size: `${(newDocument.file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadedBy: user.name,
      date: new Date().toISOString().split('T')[0],
      category: newDocument.category
    };
    
    setDocuments([...documents, newDoc]);
    setNewDocument({ name: '', category: 'guidelines', file: null });
    setShowUploadModal(false);
  };
  
  // Handle document delete
  const handleDeleteDocument = (docId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(doc => doc.id !== docId));
    }
  };
  
  // Handle document download
  const handleDocumentDownload = (doc) => {
    // In a real application, this would be an API call to download the actual file
    // For demo purposes, we'll create a mock download using Blob
    
    try {
      // Mock document content based on type
      let content = '';
      let mimeType = '';
      
      switch(doc.type.toLowerCase()) {
        case 'pdf':
          content = 'Mock PDF content for ' + doc.name;
          mimeType = 'application/pdf';
          break;
        case 'doc':
        case 'docx':
        case 'word':
          content = 'Mock Word document content for ' + doc.name;
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        case 'xls':
        case 'xlsx':
        case 'excel':
          content = 'Mock Excel content for ' + doc.name;
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
        default:
          content = 'Mock text content for ' + doc.name;
          mimeType = 'text/plain';
      }
      
      // Create blob and download link
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      
      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);
      
      // Show success message
      setSuccessMessage(`Document "${doc.name}" downloaded successfully`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (error) {
      setError('Error downloading document: ' + error.message);
      console.error('Download error:', error);
    }
  };
  
  // Get icon for document based on type
  const getDocumentIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <i className="fas fa-file-pdf text-danger"></i>;
      case 'word':
      case 'doc':
      case 'docx':
        return <i className="fas fa-file-word text-primary"></i>;
      case 'excel':
      case 'xlsx':
      case 'xls':
        return <i className="fas fa-file-excel text-success"></i>;
      case 'image':
      case 'jpg':
      case 'png':
        return <i className="fas fa-file-image text-info"></i>;
      default:
        return <i className="fas fa-file text-secondary"></i>;
    }
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-4">Admin Dashboard</h1>
          </motion.div>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onSelect={k => setActiveTab(k)}
        className="mb-4"
      >
        {/* Users Tab */}
        <Tab eventKey="users" title={<span><i className="fas fa-users me-2"></i>Users</span>}>
          <div className="tab-content p-3">
            <h2>User Management</h2>
            <div className="mb-3 d-flex flex-wrap gap-2 align-items-center">
              <Form.Control 
                type="text" 
                placeholder="Search users..." 
                className="w-auto flex-grow-1" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <Form.Select 
                className="w-auto" 
                value={filterUserType}
                onChange={e => setFilterUserType(e.target.value)}
              >
                <option value="all">All Users</option>
                <option value="farmer">Farmers</option>
                <option value="buyer">Buyers</option>
                <option value="helper">Helpers</option>
              </Form.Select>
            </div>

            {loading ? (
              <div className="text-center mt-5">
                <Spinner animation="border" />
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover responsive className="table-sm">
                  <thead>
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
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map(user => (
                        <tr key={user._id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`status-${user.userType}`}>
                              {user.userType}
                            </span>
                          </td>
                          <td>
                            <span className={`status-${user.status}`}>
                              {user.status}
                            </span>
                          </td>
                          <td>
                            {user.location?.address || 'N/A'}
                          </td>
                          <td>
                            <Button
                              variant="outline-info"
                              size="sm"
                              className="me-1"
                              onClick={() => viewUserDetails(user)}
                            >
                              <i className="fas fa-eye"></i> View
                            </Button>
                            <Button
                              variant={user.status === 'active' ? 'outline-warning' : 'outline-success'}
                              size="sm"
                              className="me-1"
                              onClick={() => updateUserStatus(user._id, user.status === 'active' ? 'inactive' : 'active')}
                            >
                              {user.status === 'active' ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => deleteUser(user._id)}
                            >
                              <i className="fas fa-trash"></i> Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        </Tab>

        {/* Products Tab */}
        <Tab eventKey="products" title={<span><i className="fas fa-box me-2"></i>Products</span>}>
          <div className="tab-content p-3">
            <h2>Product Management</h2>
            <div className="mb-3 d-flex flex-wrap gap-2 align-items-center">
              <Form.Control 
                type="text" 
                placeholder="Search products..." 
                className="w-auto flex-grow-1" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <Form.Select 
                className="w-auto" 
                value={filterProductStatus}
                onChange={e => setFilterProductStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Form.Select>
            </div>

            {loading ? (
              <div className="text-center mt-5">
                <Spinner animation="border" />
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover responsive className="table-sm">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Product</th>
                      <th>Farmer</th>
                      <th>Type</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(product => (
                        <tr key={product._id}>
                          <td>{product._id.substring(0, 6)}...</td>
                          <td>{product.productName}</td>
                          <td>{product.farmer?.name || 'Unknown'}</td>
                          <td>{product.commodityType}</td>
                          <td>{product.quantity} {product.unit || 'kg'}</td>
                          <td>₹{product.pricePerUnit}</td>
                          <td>
                            <span className={`status-${product.status}`}>
                              {product.status}
                            </span>
                          </td>
                          <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                          <td>
                            <Button
                              variant="outline-info"
                              size="sm"
                              className="me-1"
                              onClick={() => viewProductDetails(product)}
                            >
                              <i className="fas fa-eye"></i> View
                            </Button>
                            
                            {product.status === 'pending' && (
                              <>
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  className="me-1"
                                  onClick={() => handleCommodityAction(product._id, 'approved')}
                                >
                                  <i className="fas fa-check"></i> Approve
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => {
                                    setShowRejectionModal(true);
                                    setCommodityToReject(product);
                                  }}
                                >
                                  <i className="fas fa-times"></i> Reject
                                </Button>
                              </>
                            )}
                            
                            {product.status !== 'pending' && (
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => handleCommodityAction(product._id, 'pending')}
                              >
                                <i className="fas fa-undo"></i> Reset
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center">
                          No products found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        </Tab>

        {/* Documents Tab */}
        <Tab eventKey="documents" title={<span><i className="fas fa-file-alt me-2"></i>Documents</span>}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-0">Document Management</h3>
                <Button variant="success" onClick={() => setShowUploadModal(true)}>
                  <i className="fas fa-upload me-2"></i> Upload Document
                </Button>
              </div>
              
              {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                  {error}
                </Alert>
              )}
              
              {successMessage && (
                <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
                  {successMessage}
                </Alert>
              )}
              
              <Row className="mb-4">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Filter by Category</Form.Label>
                    <Form.Select 
                      value={selectedDocCategory}
                      onChange={(e) => setSelectedDocCategory(e.target.value)}
                    >
                      {documentCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={8}>
                  <Form.Group>
                    <Form.Label>Search Documents</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Search by document name..."
                      value={documentSearchTerm}
                      onChange={(e) => setDocumentSearchTerm(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-file-alt fs-1 text-muted mb-3"></i>
                  <p>No documents found matching your criteria.</p>
                </div>
              ) : (
                <Table hover responsive className="align-middle document-table">
                  <thead className="bg-light">
                    <tr>
                      <th style={{ width: '5%' }}>#</th>
                      <th style={{ width: '40%' }}>Document Name</th>
                      <th style={{ width: '10%' }}>Type</th>
                      <th style={{ width: '10%' }}>Size</th>
                      <th style={{ width: '15%' }}>Uploaded On</th>
                      <th style={{ width: '10%' }}>Category</th>
                      <th style={{ width: '10%' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocuments.map((doc, index) => (
                      <tr key={doc.id}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="me-3 fs-4">
                              {getDocumentIcon(doc.type)}
                            </div>
                            <div>
                              <h6 className="mb-0">{doc.name}</h6>
                              <small className="text-muted">Uploaded by {doc.uploadedBy}</small>
                            </div>
                          </div>
                        </td>
                        <td>{doc.type}</td>
                        <td>{doc.size}</td>
                        <td>{doc.date}</td>
                        <td>
                          <Badge bg="info" className="text-capitalize document-category">
                            {doc.category}
                          </Badge>
                        </td>
                        <td>
                          <div className="document-actions">
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              className="me-1"
                              onClick={() => handleDocumentDownload(doc)}
                            >
                              <i className="fas fa-download"></i> Download
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDeleteDocument(doc.id)}
                            >
                              <i className="fas fa-trash"></i> Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* User Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalData && 
             (modalData.userType ? 'User Details' : 
              modalData.productName ? 'Product Details' : 
              modalData.bidAmount ? 'Bid Details' : 'Details')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalData && modalData.userType && (
            <div className="user-details">
              <p><strong>ID:</strong> {modalData._id}</p>
              <p><strong>Name:</strong> {modalData.name}</p>
              <p><strong>Email:</strong> {modalData.email}</p>
              <p><strong>Phone:</strong> {modalData.phone}</p>
              <p><strong>Type:</strong> {modalData.userType}</p>
              <p><strong>Status:</strong> {modalData.status}</p>
              <p><strong>Location:</strong> {modalData.location?.address || 'N/A'}</p>
              <p><strong>Admin:</strong> {modalData.isAdmin ? 'Yes' : 'No'}</p>
              <p><strong>Created At:</strong> {new Date(modalData.createdAt).toLocaleString()}</p>
              <div className="mt-3">
                <Button variant={modalData.status === 'active' ? 'warning' : 'success'} 
                  onClick={() => updateUserStatus(modalData._id, modalData.status === 'active' ? 'inactive' : 'active')}>
                  {modalData.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>{' '}
                <Button variant="danger" onClick={() => deleteUser(modalData._id)}>
                  Delete User
                </Button>
              </div>
            </div>
          )}
          {modalData && modalData.productName && (
            <div className="product-details">
              <p><strong>ID:</strong> {modalData._id}</p>
              <p><strong>Product Name:</strong> {modalData.productName}</p>
              <p><strong>Farmer:</strong> {modalData.farmer?.name || 'N/A'}</p>
              <p><strong>Type:</strong> {modalData.commodityType}</p>
              <p><strong>Quantity:</strong> {modalData.quantity} {modalData.unit || 'kg'}</p>
              <p><strong>Price:</strong> ₹{modalData.pricePerUnit}</p>
              <p><strong>Status:</strong> <span className={`status-${modalData.status}`}>{modalData.status}</span></p>
              <p><strong>Description:</strong> {modalData.description}</p>
              {modalData.rejectionReason && (
                <p><strong>Rejection Reason:</strong> {modalData.rejectionReason}</p>
              )}
              <p><strong>Submitted:</strong> {new Date(modalData.createdAt).toLocaleString()}</p>
              {modalData.images && modalData.images.length > 0 && (
                <div className="product-images">
                  <p><strong>Images:</strong></p>
                  <div className="image-gallery">
                    {modalData.images.map((image, index) => (
                      <img 
                        key={index} 
                        src={image.startsWith('http') ? image : `/uploads/${image}`}
                        alt={`Product ${index + 1}`} 
                        className="product-image"
                      />
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-3">
                {modalData.status === 'pending' && (
                  <>
                    <Button 
                      variant="success" 
                      onClick={() => handleCommodityAction(modalData._id, 'approved')}
                    >
                      Approve
                    </Button>{' '}
                    <Button 
                      variant="danger" 
                      onClick={() => {
                        setShowRejectionModal(true);
                        setCommodityToReject(modalData);
                      }}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {modalData.status !== 'pending' && (
                  <Button 
                    variant="secondary" 
                    onClick={() => handleCommodityAction(modalData._id, 'pending')}
                  >
                    Revert to Pending
                  </Button>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Rejection Reason Modal */}
      <Modal show={showRejectionModal} onHide={() => setShowRejectionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Rejection Reason</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Please provide a reason for rejection:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectionModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={() => {
              if (rejectionReason.trim() === '') {
                setError('Please provide a rejection reason');
                return;
              }
              handleCommodityAction(commodityToReject._id, 'rejected', rejectionReason);
              setShowRejectionModal(false);
              setRejectionReason('');
            }}
          >
            Confirm Rejection
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Document Upload Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload New Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Document Name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter document name"
                value={newDocument.name}
                onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={newDocument.category}
                onChange={(e) => setNewDocument({...newDocument, category: e.target.value})}
              >
                <option value="guidelines">Guidelines</option>
                <option value="standards">Standards</option>
                <option value="reports">Reports</option>
                <option value="certification">Certification</option>
                <option value="pricing">Pricing</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>File</Form.Label>
              <div 
                className="upload-dropzone mb-3"
                onClick={() => document.getElementById('document-file-input').click()}
              >
                <i className="fas fa-cloud-upload-alt fs-1 text-primary mb-2"></i>
                <p className="mb-0">Drag & drop your file here or click to browse</p>
                <small className="text-muted">Supported formats: PDF, Word, Excel, Images</small>
              </div>
              <Form.Control 
                type="file" 
                id="document-file-input"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setNewDocument({...newDocument, file: e.target.files[0]});
                  }
                }}
              />
              {newDocument.file && (
                <div className="border rounded p-2 d-flex align-items-center">
                  <i className="fas fa-file me-2 text-primary"></i>
                  <span className="me-auto">{newDocument.file.name}</span>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => setNewDocument({...newDocument, file: null})}
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                </div>
              )}
              <Form.Text className="text-muted">
                Upload PDF, Word, Excel, or image files. Maximum size: 10MB
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleDocumentUpload}>
            Upload Document
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard; 