import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { authService } from '../services/api';

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pincode: '',
    state: '',
    district: '',
    taluka: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Load user data from local storage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Initialize form with user data
      setFormData({
        name: parsedUser.name || '',
        phone: parsedUser.phone || '',
        pincode: parsedUser.pincode || '',
        state: parsedUser.state || '',
        district: parsedUser.district || '',
        taluka: parsedUser.taluka || '',
        address: parsedUser.address || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Phone validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
      isValid = false;
    }

    // Password validation - only if changing password
    if (formData.newPassword || formData.currentPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to change password';
        isValid = false;
      }
      
      if (formData.newPassword && formData.newPassword.length < 6) {
        newErrors.newPassword = 'New password must be at least 6 characters';
        isValid = false;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    if (validateForm()) {
      setSaving(true);
      
      try {
        // In a real app, you would call an API to update the profile
        // For now, we'll just update local storage

        // Create updated user object
        const updatedUser = {
          ...user,
          name: formData.name,
          phone: formData.phone,
          pincode: formData.pincode,
          state: formData.state, 
          district: formData.district,
          taluka: formData.taluka,
          address: formData.address,
        };
        
        // In a real app, password update would be handled separately on the backend
        
        // Update local storage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Show success message
        setMessage({
          type: 'success',
          text: 'Profile updated successfully'
        });
        
        // Update state
        setUser(updatedUser);
        
        // Reset password fields
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // In a real app, you would navigate to profile after success
        // navigate('/profile');
      } catch (error) {
        console.error('Update error:', error);
        setMessage({
          type: 'danger',
          text: error.toString()
        });
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <h2>User not found</h2>
        <p>Please log in to edit your profile</p>
        <Button onClick={() => navigate('/login')} variant="success">Login</Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white py-3 border-bottom">
                <h3 className="mb-0">Edit Profile</h3>
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
                  <h5 className="mb-3 pb-2 border-bottom">Personal Information</h5>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group className="mb-3">
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
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
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

                  <h5 className="mt-4 mb-3 pb-2 border-bottom">Location Details</h5>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Pincode</Form.Label>
                        <Form.Control
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          placeholder="Enter your pincode"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>State</Form.Label>
                        <Form.Control
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="Enter your state"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>District</Form.Label>
                        <Form.Control
                          type="text"
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                          placeholder="Enter your district"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Taluka</Form.Label>
                        <Form.Control
                          type="text"
                          name="taluka"
                          value={formData.taluka}
                          onChange={handleChange}
                          placeholder="Enter your taluka (optional)"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your full address"
                    />
                  </Form.Group>

                  <h5 className="mt-4 mb-3 pb-2 border-bottom">Change Password (Optional)</h5>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          isInvalid={!!errors.currentPassword}
                          placeholder="Enter your current password"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.currentPassword}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          isInvalid={!!errors.newPassword}
                          placeholder="Enter your new password"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.newPassword}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          isInvalid={!!errors.confirmPassword}
                          placeholder="Confirm your new password"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.confirmPassword}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <div className="d-flex justify-content-between">
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => navigate('/profile')}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="success" 
                      type="submit"
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
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

export default EditProfile; 