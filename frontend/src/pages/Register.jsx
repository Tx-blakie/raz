import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { authService } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const typeFromUrl = searchParams.get('type');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    pincode: '',
    state: '',
    district: '',
    taluka: '',
    address: '',
    userType: typeFromUrl || 'farmer', // Default to farmer if no type is specified
    panCard: null,
    cancelledCheque: null,
    gstNumber: '',
    agricultureCertificate: null
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Update user type if it's passed in URL
    if (typeFromUrl) {
      setFormData(prev => ({
        ...prev,
        userType: typeFromUrl
      }));
    }
  }, [typeFromUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0]
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Confirm Password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    // Location validations
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
      isValid = false;
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
      isValid = false;
    }

    if (!formData.district.trim()) {
      newErrors.district = 'District is required';
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }

    // Role-specific validations
    if (formData.userType === 'farmer') {
      if (!formData.panCard) {
        newErrors.panCard = 'PAN Card is required for farmers';
        isValid = false;
      }
      if (!formData.cancelledCheque) {
        newErrors.cancelledCheque = 'Cancelled Cheque is required for farmers';
        isValid = false;
      }
    }

    if (formData.userType === 'helper') {
      if (!formData.panCard) {
        newErrors.panCard = 'PAN Card is required for helpers';
        isValid = false;
      }
      if (!formData.agricultureCertificate) {
        newErrors.agricultureCertificate = 'Agriculture Certificate is required for helpers';
        isValid = false;
      }
    }

    if (formData.userType === 'buyer') {
      if (!formData.gstNumber.trim()) {
        newErrors.gstNumber = 'GST Number is required for buyers';
        isValid = false;
      }
      if (!formData.panCard) {
        newErrors.panCard = 'PAN Card is required for buyers';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (validateForm()) {
      setIsLoading(true);
      
      // In a real app, we would handle file uploads properly
      // This is a simplified approach for demonstration
      const fileToBase64 = async (file) => {
        return new Promise((resolve, reject) => {
          if (!file) {
            resolve('');
            return;
          }
          
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      };

      try {
        // Convert files to base64 for API request
        const panCardBase64 = await fileToBase64(formData.panCard);
        const cancelledChequeBase64 = await fileToBase64(formData.cancelledCheque);
        const agricultureCertificateBase64 = await fileToBase64(formData.agricultureCertificate);
        
        // Prepare data for API
        const userData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          userType: formData.userType,
          pincode: formData.pincode,
          state: formData.state,
          district: formData.district,
          taluka: formData.taluka,
          address: formData.address,
          panCard: panCardBase64,
          cancelledCheque: cancelledChequeBase64,
          agricultureCertificate: agricultureCertificateBase64,
          gstNumber: formData.gstNumber
        };

        // Register the user
        await authService.register(userData);
        
        // Redirect to login page after successful registration
        navigate('/login', { 
          state: { 
            registrationSuccess: true, 
            userType: formData.userType,
            email: formData.email
          } 
        });
      } catch (error) {
        console.error('Registration error:', error);
        setApiError(error.toString());
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeIn}
          >
            <Card className="shadow-lg border-0">
              <Card.Header className="bg-success text-white">
                <h2 className="mb-0 fs-4">Join Our Community</h2>
              </Card.Header>
              <Card.Body className="p-4">
                {apiError && (
                  <Alert variant="danger" dismissible onClose={() => setApiError('')}>
                    {apiError}
                  </Alert>
                )}
                
                {/* User Type Selection */}
                <Form onSubmit={handleSubmit}>
                  <Row className="mb-4">
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Select User Type</Form.Label>
                        <div className="d-flex flex-wrap gap-3">
                          <UserTypeButton
                            type="farmer"
                            icon="🌱"
                            label="Farmer"
                            selected={formData.userType === 'farmer'}
                            onClick={() => setFormData({...formData, userType: 'farmer'})}
                          />
                          <UserTypeButton
                            type="buyer"
                            icon="🛒"
                            label="Buyer"
                            selected={formData.userType === 'buyer'}
                            onClick={() => setFormData({...formData, userType: 'buyer'})}
                          />
                          <UserTypeButton
                            type="helper"
                            icon="👨‍🌾"
                            label="Helper"
                            selected={formData.userType === 'helper'}
                            onClick={() => setFormData({...formData, userType: 'helper'})}
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Personal Information */}
                  <h5 className="mb-3 border-bottom pb-2">Personal Information</h5>
                  <Row className="mb-3">
                    <Col md={6} className="mb-3 mb-md-0">
                      <Form.Group>
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          isInvalid={!!errors.name}
                          placeholder="Enter your full name"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.name}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          isInvalid={!!errors.phone}
                          placeholder="Enter your phone number"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.phone}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          isInvalid={!!errors.email}
                          placeholder="Enter your email address"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6} className="mb-3 mb-md-0">
                      <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          isInvalid={!!errors.password}
                          placeholder="Create password"
                          autoComplete="new-password"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          isInvalid={!!errors.confirmPassword}
                          placeholder="Confirm your password"
                          autoComplete="new-password"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.confirmPassword}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Location Details */}
                  <h5 className="mt-4 mb-3 border-bottom pb-2">Location Details</h5>
                  <Row className="mb-3">
                    <Col md={6} className="mb-3 mb-md-0">
                      <Form.Group>
                        <Form.Label>Pincode</Form.Label>
                        <Form.Control
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          isInvalid={!!errors.pincode}
                          placeholder="Enter pincode"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.pincode}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>State</Form.Label>
                        <Form.Control
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          isInvalid={!!errors.state}
                          placeholder="Enter state"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.state}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6} className="mb-3 mb-md-0">
                      <Form.Group>
                        <Form.Label>District</Form.Label>
                        <Form.Control
                          type="text"
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                          isInvalid={!!errors.district}
                          placeholder="Enter district"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.district}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Taluka</Form.Label>
                        <Form.Control
                          type="text"
                          name="taluka"
                          value={formData.taluka}
                          onChange={handleChange}
                          placeholder="Enter taluka (optional)"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          isInvalid={!!errors.address}
                          placeholder="Enter your full address"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.address}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Role-specific fields */}
                  <h5 className="mt-4 mb-3 border-bottom pb-2">Document Uploads</h5>
                  <Row className="mb-3">
                    {/* PAN Card - required for all user types */}
                    <Col xs={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>PAN Card</Form.Label>
                        <Form.Control
                          type="file"
                          name="panCard"
                          onChange={handleFileChange}
                          isInvalid={!!errors.panCard}
                        />
                        <Form.Text className="text-muted">
                          Upload a scanned copy or clear image of your PAN card
                        </Form.Text>
                        <Form.Control.Feedback type="invalid">
                          {errors.panCard}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {formData.userType === 'farmer' && (
                      <Col xs={12} className="mb-3">
                        <Form.Group>
                          <Form.Label>Cancelled Cheque</Form.Label>
                          <Form.Control
                            type="file"
                            name="cancelledCheque"
                            onChange={handleFileChange}
                            isInvalid={!!errors.cancelledCheque}
                          />
                          <Form.Text className="text-muted">
                            Upload a scanned copy of your cancelled cheque for account verification
                          </Form.Text>
                          <Form.Control.Feedback type="invalid">
                            {errors.cancelledCheque}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    )}

                    {formData.userType === 'helper' && (
                      <Col xs={12} className="mb-3">
                        <Form.Group>
                          <Form.Label>Agriculture Certificate</Form.Label>
                          <Form.Control
                            type="file"
                            name="agricultureCertificate"
                            onChange={handleFileChange}
                            isInvalid={!!errors.agricultureCertificate}
                          />
                          <Form.Text className="text-muted">
                            Upload your agriculture certificate or farming experience document
                          </Form.Text>
                          <Form.Control.Feedback type="invalid">
                            {errors.agricultureCertificate}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    )}

                    {formData.userType === 'buyer' && (
                      <Col xs={12} className="mb-3">
                        <Form.Group>
                          <Form.Label>GST Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="gstNumber"
                            value={formData.gstNumber}
                            onChange={handleChange}
                            isInvalid={!!errors.gstNumber}
                            placeholder="Enter your GST number"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.gstNumber}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    )}
                  </Row>

                  <div className="d-grid gap-2 mt-4">
                    <Button 
                      variant="success" 
                      type="submit" 
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Registering...' : 'Register'}
                    </Button>
                  </div>

                  <div className="text-center mt-3">
                    <p>
                      Already have an account? <Link to="/login" className="text-success">Login here</Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

// User Type Button Component
const UserTypeButton = ({ type, icon, label, selected, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex-grow-1"
    >
      <Button
        variant={selected ? "success" : "outline-success"}
        className={`w-100 d-flex flex-column align-items-center py-3 ${selected ? 'shadow-sm' : ''}`}
        onClick={onClick}
        type="button"
      >
        <span className="fs-3 mb-2">{icon}</span>
        <span>{label}</span>
      </Button>
    </motion.div>
  );
};

export default Register; 