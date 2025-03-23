import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Table, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddCommodity = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    productName: '',
    commodityType: '',
    quantity: '',
    pricePerUnit: '',
    description: '',
    imageUrl: '',
    inStock: true
  });
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [myCommodities, setMyCommodities] = useState([]);
  const [loadingCommodities, setLoadingCommodities] = useState(true);

  // Check if user is farmer
  if (!user || user.userType !== 'farmer') {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          Access denied. Only farmers can add commodities.
        </Alert>
      </Container>
    );
  }

  // Load farmer's commodities
  const loadCommodities = async () => {
    try {
      const response = await api.get('/api/commodities/farmer');
      setMyCommodities(response.data);
      setLoadingCommodities(false);
    } catch (err) {
      console.error('Error loading commodities:', err);
      setLoadingCommodities(false);
    }
  };

  // Load commodities when component mounts
  useEffect(() => {
    loadCommodities();
  }, []);

  // Format commodity type for display
  const formatCommodityType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Get badge for approval status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge bg="success">Approved</Badge>;
      case 'pending':
        return <Badge bg="warning" text="dark">Pending Approval</Badge>;
      case 'rejected':
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate product name
    if (!formData.productName.trim()) {
      newErrors.productName = 'Product name is required';
    }
    
    // Validate commodity type
    if (!formData.commodityType) {
      newErrors.commodityType = 'Please select a commodity type';
    }
    
    // Validate quantity
    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (parseInt(formData.quantity) < 10 || parseInt(formData.quantity) > 50) {
      newErrors.quantity = 'Quantity must be between 10 and 50 kg';
    }
    
    // Validate price
    if (!formData.pricePerUnit) {
      newErrors.pricePerUnit = 'Price is required';
    } else if (parseFloat(formData.pricePerUnit) <= 0) {
      newErrors.pricePerUnit = 'Price must be greater than 0';
    }
    
    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    // Validate image
    if (!formData.imageUrl) {
      newErrors.imageUrl = 'Product image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // First validate form
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Set up image data
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
      
      // Try to upload the image and create the commodity
      let imageUrl = '';
      
      if (imageFile) {
        try {
          // Prepare form data for image upload
          const formDataWithImage = new FormData();
          formDataWithImage.append('image', imageFile);
          
          // Upload image
          const imageUploadResponse = await api.post('/api/commodities/upload', formDataWithImage, config);
          
          if (imageUploadResponse.data && imageUploadResponse.data.url) {
            imageUrl = imageUploadResponse.data.url;
            console.log('Image uploaded successfully:', imageUrl);
          } else {
            throw new Error('Invalid image upload response');
          }
        } catch (uploadError) {
          console.error('Commodity upload failed:', uploadError);
          
          // Try fallback upload endpoint
          try {
            const fallbackFormData = new FormData();
            fallbackFormData.append('file', imageFile);
            const fallbackResponse = await api.post('/api/upload', fallbackFormData, config);
            
            if (fallbackResponse.data && (fallbackResponse.data.filePath || fallbackResponse.data.url)) {
              imageUrl = fallbackResponse.data.filePath || fallbackResponse.data.url;
              console.log('Image uploaded via fallback:', imageUrl);
            } else {
              throw new Error('Invalid fallback upload response');
            }
          } catch (fallbackError) {
            console.error('All upload attempts failed:', fallbackError);
            throw new Error('Failed to upload image. Please try again.');
          }
        }
      } else {
        throw new Error('Please select an image for your product');
      }
      
      if (!imageUrl) {
        throw new Error('Image upload failed. Please try again.');
      }
      
      // Create commodity with the uploaded image URL
      const commodityData = {
        productName: formData.productName,
        commodityType: formData.commodityType,
        quantity: formData.quantity,
        pricePerUnit: formData.pricePerUnit,
        description: formData.description,
        imageUrl: imageUrl,
        inStock: formData.inStock,
        unit: 'kg'
      };
      
      console.log('Submitting commodity data:', commodityData);
      
      try {
        const response = await api.post('/api/commodities', commodityData);
        console.log('Commodity created successfully:', response.data);
        
        // Handle success
        setMessage({ 
          type: 'success', 
          text: 'Commodity added successfully! Waiting for admin approval.' 
        });
        
        // Reset form
        setFormData({
          productName: '',
          commodityType: '',
          quantity: '',
          pricePerUnit: '',
          description: '',
          imageUrl: '',
          inStock: true
        });
        setImageFile(null);
        
        // Refresh the commodities list
        loadCommodities();
      } catch (commodityError) {
        console.error('Failed to create commodity:', commodityError);
        console.error('Error details:', commodityError.response?.data || commodityError.message);
        throw new Error(`Failed to create commodity: ${commodityError.response?.data?.message || commodityError.message}`);
      }
    } catch (err) {
      console.error('Submission error:', err);
      setMessage({ 
        type: 'danger', 
        text: err.response?.data?.message || err.message 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-success text-white py-3">
                <h3 className="mb-0">Add New Commodity</h3>
                <p className="mb-0 mt-1 text-white-50">List your agricultural product on the marketplace</p>
              </Card.Header>
              
              <Card.Body className="p-4">
                {message.text && (
                  <Alert 
                    variant={message.type} 
                    dismissible 
                    onClose={() => setMessage({ type: '', text: '' })}
                  >
                    {message.text}
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Product Name*</Form.Label>
                        <Form.Control
                          type="text"
                          name="productName"
                          value={formData.productName}
                          onChange={handleChange}
                          placeholder="Enter product name"
                          required
                          isInvalid={!!errors.productName}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.productName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Commodity Type*</Form.Label>
                        <Form.Select
                          name="commodityType"
                          value={formData.commodityType}
                          onChange={handleChange}
                          required
                          isInvalid={!!errors.commodityType}
                        >
                          <option value="">Select type</option>
                          <option value="vegetables">Vegetables</option>
                          <option value="fruits">Fruits</option>
                          <option value="grains">Grains</option>
                          <option value="pulses">Pulses</option>
                          <option value="spices">Spices</option>
                          <option value="dairy">Dairy Products</option>
                          <option value="other">Other</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.commodityType}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Quantity (kg)*</Form.Label>
                        <Form.Control
                          type="number"
                          min="10"
                          max="50"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          placeholder="Enter quantity (10-50 kg)"
                          required
                          isInvalid={!!errors.quantity}
                        />
                        <Form.Text className="text-muted">
                          Must be between 10 and 50 kg
                        </Form.Text>
                        <Form.Control.Feedback type="invalid">
                          {errors.quantity}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Price per 5kg (₹)*</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          step="0.01"
                          name="pricePerUnit"
                          value={formData.pricePerUnit}
                          onChange={handleChange}
                          placeholder="Enter price per 5kg"
                          required
                          isInvalid={!!errors.pricePerUnit}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.pricePerUnit}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Product Description*</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter product description"
                      required
                      isInvalid={!!errors.description}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.description}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Product Image*</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          required={!formData.imageUrl}
                          isInvalid={!!errors.imageUrl}
                        />
                        {formData.imageUrl && (
                          <div className="mt-2">
                            <img 
                              src={formData.imageUrl} 
                              alt="Preview" 
                              style={{ maxWidth: '200px' }}
                              className="rounded border"
                            />
                          </div>
                        )}
                        <Form.Control.Feedback type="invalid">
                          {errors.imageUrl}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Availability</Form.Label>
                        <Form.Select
                          name="inStock"
                          value={formData.inStock ? 'inStock' : 'outOfStock'}
                          onChange={handleChange}
                        >
                          <option value="inStock">In Stock</option>
                          <option value="outOfStock">Out of Stock</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => navigate('/farmer-dashboard')}
                      className="me-md-2"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      variant="success"
                      disabled={loading}
                    >
                      {loading ? 'Adding...' : 'Add Commodity'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </motion.div>
          
          {/* My Commodities Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5"
          >
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-primary text-white py-3">
                <h3 className="mb-0">My Commodities</h3>
                <p className="mb-0 mt-1 text-white-50">Track your submitted products and their approval status</p>
              </Card.Header>
              
              <Card.Body className="p-4">
                {loadingCommodities ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading your commodities...</p>
                  </div>
                ) : myCommodities.length === 0 ? (
                  <Alert variant="info">
                    You haven't added any commodities yet. Use the form above to add your first product.
                  </Alert>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="align-middle">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Type</th>
                          <th>Quantity (kg)</th>
                          <th>Price per 5kg</th>
                          <th>Date Added</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myCommodities.map((commodity) => (
                          <tr key={commodity._id}>
                            <td>{commodity.productName}</td>
                            <td>{formatCommodityType(commodity.commodityType)}</td>
                            <td>{commodity.quantity}</td>
                            <td>₹{commodity.pricePerUnit}</td>
                            <td>{new Date(commodity.createdAt || commodity.dateAdded).toLocaleDateString()}</td>
                            <td>{getStatusBadge(commodity.approvalStatus || commodity.status)}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button 
                                  variant="outline-primary" 
                                  size="sm"
                                  title="Edit commodity"
                                  disabled={(commodity.approvalStatus || commodity.status) === 'approved'}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                  </svg>
                                </Button>
                                <Button 
                                  variant={(commodity.inStock) ? 'outline-danger' : 'outline-success'} 
                                  size="sm"
                                  title={(commodity.inStock) ? 'Mark as out of stock' : 'Mark as in stock'}
                                  disabled={(commodity.approvalStatus || commodity.status) !== 'approved'}
                                >
                                  {(commodity.inStock) ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-toggle-on" viewBox="0 0 16 16">
                                      <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10H5zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
                                    </svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-toggle-off" viewBox="0 0 16 16">
                                      <path d="M11 4a4 4 0 0 1 0 8H8a4.992 4.992 0 0 0 2-4 4.992 4.992 0 0 0-2-4h3zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5z"/>
                                    </svg>
                                  )}
                                </Button>
                              </div>
                              {(commodity.approvalStatus === 'rejected' || commodity.status === 'rejected') && commodity.rejectionReason && (
                                <div className="mt-2">
                                  <small className="text-danger">
                                    <strong>Reason:</strong> {commodity.rejectionReason}
                                  </small>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default AddCommodity; 