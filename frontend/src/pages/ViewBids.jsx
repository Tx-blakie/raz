import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Alert, Modal, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ViewBids = () => {
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const [message, setMessage] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProduct, setFilterProduct] = useState('all');
  
  // Check if user is a farmer
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isFarmer = user && user.userType === 'farmer';
  
  // Load mock data
  useEffect(() => {
    // In a real application, this would be an API call
    const mockBids = [
      { 
        id: 1, 
        productName: 'Organic Tomatoes', 
        buyer: 'Priya Singh', 
        buyerLocation: 'Mumbai, Maharashtra',
        quantity: '15 kg', 
        basePrice: '₹250/5kg',
        bidAmount: '₹240/5kg', 
        bidDate: '2023-06-15', 
        status: 'pending',
        buyerRating: 4.7,
        notes: 'Looking for fresh, ripe tomatoes. Can arrange pickup.'
      },
      { 
        id: 2, 
        productName: 'Fresh Green Peas', 
        buyer: 'Vikram Joshi', 
        buyerLocation: 'Thane, Maharashtra',
        quantity: '20 kg', 
        basePrice: '₹300/5kg',
        bidAmount: '₹310/5kg', 
        bidDate: '2023-06-14', 
        status: 'accepted',
        buyerRating: 4.5,
        notes: 'Need them for my restaurant. Premium quality only.'
      },
      { 
        id: 3, 
        productName: 'Organic Tomatoes', 
        buyer: 'Vikram Joshi', 
        buyerLocation: 'Thane, Maharashtra',
        quantity: '10 kg', 
        basePrice: '₹250/5kg',
        bidAmount: '₹230/5kg', 
        bidDate: '2023-06-13', 
        status: 'rejected',
        buyerRating: 4.5,
        notes: 'Need them for my restaurant.'
      },
      { 
        id: 4, 
        productName: 'Fresh Green Peas', 
        buyer: 'Anita Desai', 
        buyerLocation: 'Pune, Maharashtra',
        quantity: '15 kg', 
        basePrice: '₹300/5kg',
        bidAmount: '₹290/5kg', 
        bidDate: '2023-06-12', 
        status: 'pending',
        buyerRating: 4.3,
        notes: 'Looking for good quality product.'
      },
    ];
    
    // Simulate API delay
    setTimeout(() => {
      setBids(mockBids);
      setLoading(false);
    }, 1000);
  }, []);
  
  if (!isFarmer) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">
          <h4>Access Denied</h4>
          <p>Only farmers can access this page to view bids on their products.</p>
          <Button onClick={() => navigate('/home')} variant="primary">
            Back to Home
          </Button>
        </Alert>
      </Container>
    );
  }
  
  // Get unique product names for filter
  const productOptions = [...new Set(bids.map(bid => bid.productName))];
  
  // Filter bids based on status and product
  const filteredBids = bids.filter(bid => {
    const matchesStatus = filterStatus === 'all' || bid.status === filterStatus;
    const matchesProduct = filterProduct === 'all' || bid.productName === filterProduct;
    return matchesStatus && matchesProduct;
  });
  
  // View bid details
  const handleViewBid = (bid) => {
    setSelectedBid(bid);
    setShowModal(true);
  };
  
  // Accept a bid
  const handleAcceptBid = (bid) => {
    setBids(bids.map(b => {
      if (b.id === bid.id) {
        return { ...b, status: 'accepted' };
      }
      return b;
    }));
    
    if (selectedBid && selectedBid.id === bid.id) {
      setSelectedBid({ ...selectedBid, status: 'accepted' });
    }
    
    setMessage({
      text: `Bid from ${bid.buyer} for ${bid.productName} has been accepted. They will be notified.`,
      type: 'success'
    });
    
    // Close modal if open
    if (showModal) {
      setTimeout(() => {
        setShowModal(false);
      }, 1500);
    }
  };
  
  // Reject a bid
  const handleRejectBid = (bid) => {
    setBids(bids.map(b => {
      if (b.id === bid.id) {
        return { ...b, status: 'rejected' };
      }
      return b;
    }));
    
    if (selectedBid && selectedBid.id === bid.id) {
      setSelectedBid({ ...selectedBid, status: 'rejected' });
    }
    
    setMessage({
      text: `Bid from ${bid.buyer} for ${bid.productName} has been rejected.`,
      type: 'info'
    });
    
    // Close modal if open
    if (showModal) {
      setTimeout(() => {
        setShowModal(false);
      }, 1500);
    }
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
            <h1 className="display-5 fw-bold mb-3">Your Product Bids</h1>
            <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
              Manage buyer bids on your agricultural products
            </p>
          </div>
          
          {message.text && (
            <Alert 
              variant={message.type} 
              dismissible 
              onClose={() => setMessage({})}
              className="mb-4"
            >
              {message.text}
            </Alert>
          )}
          
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-3">
              <Row className="align-items-center">
                <Col sm={6} md={4} className="mb-3 mb-md-0">
                  <Form.Group>
                    <Form.Label>Filter by Status</Form.Label>
                    <Form.Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col sm={6} md={4} className="mb-3 mb-md-0">
                  <Form.Group>
                    <Form.Label>Filter by Product</Form.Label>
                    <Form.Select
                      value={filterProduct}
                      onChange={(e) => setFilterProduct(e.target.value)}
                    >
                      <option value="all">All Products</option>
                      {productOptions.map((product, index) => (
                        <option key={index} value={product}>{product}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4} className="d-flex align-items-end justify-content-md-end mt-3 mt-md-0">
                  <Button variant="outline-primary" onClick={() => {
                    setFilterStatus('all');
                    setFilterProduct('all');
                  }}>
                    <i className="bi bi-arrow-repeat me-2"></i>
                    Reset Filters
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading your bids...</p>
            </div>
          ) : filteredBids.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3">
                <i className="bi bi-inbox fs-1 text-muted"></i>
              </div>
              <h5>No bids found</h5>
              <p className="text-muted">
                {filterStatus !== 'all' || filterProduct !== 'all' ? 
                  'Try changing your filters to see more results.' : 
                  'You do not have any bids on your products yet.'}
              </p>
            </div>
          ) : (
            <Table responsive hover className="align-middle">
              <thead className="bg-light">
                <tr>
                  <th>Product</th>
                  <th>Buyer</th>
                  <th>Quantity</th>
                  <th>Base Price</th>
                  <th>Bid Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBids.map(bid => (
                  <tr key={bid.id}>
                    <td className="fw-medium">{bid.productName}</td>
                    <td>
                      {bid.buyer}
                      <div className="small">{renderRating(bid.buyerRating)}</div>
                    </td>
                    <td>{bid.quantity}</td>
                    <td>{bid.basePrice}</td>
                    <td className={
                      parseInt(bid.bidAmount.replace(/[^0-9]/g, '')) >= parseInt(bid.basePrice.replace(/[^0-9]/g, '')) ? 
                      'text-success fw-bold' : 'text-danger'
                    }>
                      {bid.bidAmount}
                    </td>
                    <td>{bid.bidDate}</td>
                    <td>
                      <Badge bg={
                        bid.status === 'accepted' ? 'success' : 
                        bid.status === 'rejected' ? 'danger' : 
                        'warning'
                      }>
                        {bid.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          onClick={() => handleViewBid(bid)}
                        >
                          <i className="bi bi-eye"></i>
                        </Button>
                        
                        {bid.status === 'pending' && (
                          <>
                            <Button 
                              variant="outline-success" 
                              size="sm"
                              onClick={() => handleAcceptBid(bid)}
                            >
                              <i className="bi bi-check-lg"></i>
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleRejectBid(bid)}
                            >
                              <i className="bi bi-x-lg"></i>
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </motion.div>
      </Container>
      
      {/* Bid Details Modal */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Bid Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBid && (
            <Row>
              <Col md={6}>
                <h5 className="mb-3">Product Information</h5>
                <Table borderless>
                  <tbody>
                    <tr>
                      <td className="fw-bold">Product:</td>
                      <td>{selectedBid.productName}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Base Price:</td>
                      <td>{selectedBid.basePrice}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Bid Amount:</td>
                      <td className={
                        parseInt(selectedBid.bidAmount.replace(/[^0-9]/g, '')) >= 
                        parseInt(selectedBid.basePrice.replace(/[^0-9]/g, '')) ? 
                        'text-success fw-bold' : 'text-danger'
                      }>
                        {selectedBid.bidAmount}
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Quantity:</td>
                      <td>{selectedBid.quantity}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Submitted:</td>
                      <td>{selectedBid.bidDate}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Status:</td>
                      <td>
                        <Badge bg={
                          selectedBid.status === 'accepted' ? 'success' : 
                          selectedBid.status === 'rejected' ? 'danger' : 
                          'warning'
                        }>
                          {selectedBid.status}
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              
              <Col md={6}>
                <h5 className="mb-3">Buyer Information</h5>
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>
                      {selectedBid.buyer.split(' ').map(word => word[0]).join('')}
                    </div>
                  </div>
                  <div>
                    <h6 className="mb-0">{selectedBid.buyer}</h6>
                    <div>{renderRating(selectedBid.buyerRating)}</div>
                  </div>
                </div>
                
                <p className="mb-2">
                  <i className="bi bi-geo-alt me-2"></i>
                  {selectedBid.buyerLocation}
                </p>
                
                <h6 className="mt-4 mb-2">Buyer's Notes:</h6>
                <p className="p-3 bg-light rounded">
                  {selectedBid.notes || 'No additional notes provided.'}
                </p>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          
          {selectedBid && selectedBid.status === 'pending' && (
            <>
              <Button 
                variant="success" 
                onClick={() => handleAcceptBid(selectedBid)}
              >
                Accept Bid
              </Button>
              <Button 
                variant="danger" 
                onClick={() => handleRejectBid(selectedBid)}
              >
                Reject Bid
              </Button>
            </>
          )}
          
          {selectedBid && selectedBid.status === 'accepted' && (
            <Button variant="primary">
              <i className="bi bi-chat-dots me-2"></i>
              Contact Buyer
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewBids; 