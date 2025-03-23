import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Alert, Badge, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [checkoutInfo, setCheckoutInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'razorpay'
  });

  // Fetch cart items when component mounts
  useEffect(() => {
    // Load cart from localStorage
    const loadCartItems = () => {
      try {
        setLoading(true);
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          const parsed = JSON.parse(storedCart);
          // Make sure we have valid cart items
          if (Array.isArray(parsed)) {
            setCartItems(parsed);
          } else {
            // Reset cart if data is invalid
            setCartItems([]);
            localStorage.setItem('cart', JSON.stringify([]));
          }
        } else {
          // Initialize empty cart if none exists
          setCartItems([]);
          localStorage.setItem('cart', JSON.stringify([]));
        }
      } catch (err) {
        console.error('Error loading cart:', err);
        setError('Failed to load your cart. Please try again.');
        // Reset cart on error
        setCartItems([]);
        localStorage.setItem('cart', JSON.stringify([]));
      } finally {
        setLoading(false);
      }
    };

    // Try to load user data for pre-filling checkout form
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData) {
        setCheckoutInfo(prev => ({
          ...prev,
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || ''
        }));
      }
    } catch (err) {
      console.error('Error loading user data:', err);
    }

    loadCartItems();
    
    // Add Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Update cart in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Calculate cart totals
  const cartTotal = cartItems.reduce((total, item) => {
    return total + (Number(item.pricePerUnit || 0) * Number(item.quantity || 1));
  }, 0);

  const itemCount = cartItems.reduce((count, item) => {
    return count + Number(item.quantity || 1);
  }, 0);

  // Handle quantity updates
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item._id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Remove item from cart
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item._id !== id));
  };

  // Clear entire cart
  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setCartItems([]);
    }
  };

  // Handle checkout form input changes
  const handleCheckoutChange = (e) => {
    const { name, value } = e.target;
    setCheckoutInfo({
      ...checkoutInfo,
      [name]: value
    });
  };

  // Initialize Razorpay payment
  const initializeRazorpayPayment = () => {
    try {
      // Validate form
      const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'pincode'];
      const emptyField = requiredFields.find(field => !checkoutInfo[field]);
      
      if (emptyField) {
        setError(`Please fill in your ${emptyField}`);
        return;
      }
      
      setPaymentProcessing(true);
      
      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        setError("Payment gateway not loaded. Please refresh the page and try again.");
        setPaymentProcessing(false);
        return;
      }
      
      // Razorpay configuration
      const options = {
        key: "rzp_test_YOUR_KEY_HERE", // Replace with your actual test key
        amount: cartTotal * 100, // Amount in smallest currency unit (paise for INR)
        currency: "INR",
        name: "AgroConnect",
        description: `Order of ${itemCount} items`,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Agronomy_logo.svg/800px-Agronomy_logo.svg.png",
        handler: function(response) {
          // Payment successful
          const paymentId = response.razorpay_payment_id;
          handlePaymentSuccess(paymentId);
        },
        prefill: {
          name: checkoutInfo.name,
          email: checkoutInfo.email,
          contact: checkoutInfo.phone
        },
        notes: {
          address: checkoutInfo.address
        },
        theme: {
          color: "#198754"
        },
        modal: {
          ondismiss: function() {
            setPaymentProcessing(false);
          }
        }
      };
      
      // Create and open Razorpay
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      console.error("Razorpay error:", err);
      setError("Payment initialization failed. Please try again.");
      setPaymentProcessing(false);
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = (paymentId) => {
    try {
      setLoading(true);
      
      // Process order
      const orderData = {
        items: cartItems,
        total: cartTotal,
        shipping: checkoutInfo,
        paymentMethod: "razorpay",
        paymentId: paymentId,
        status: 'confirmed'
      };
      
      // In a real app, we'd save the order to the database here
      // const response = await api.post('/api/orders', orderData);
      
      // Clear cart after successful order
      setCartItems([]);
      localStorage.setItem('cart', JSON.stringify([]));
      
      // Navigate to order confirmation
      navigate('/order-confirmation', { 
        state: { 
          order: orderData,
          orderId: 'ORD' + Math.floor(Math.random() * 1000000),
          paymentId: paymentId
        }
      });
      
    } catch (err) {
      console.error('Error submitting order:', err);
      setError('Failed to process your order. Please try again.');
    } finally {
      setLoading(false);
      setPaymentProcessing(false);
    }
  };

  // Handle form submission for COD
  const handleSubmitOrder = async (e) => {
    if (e) e.preventDefault();
    
    // Validate form
    const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'pincode'];
    const emptyField = requiredFields.find(field => !checkoutInfo[field]);
    
    if (emptyField) {
      setError(`Please fill in your ${emptyField}`);
      return;
    }
    
    // Based on payment method
    if (checkoutInfo.paymentMethod === 'razorpay') {
      initializeRazorpayPayment();
      return;
    }
    
    try {
      setLoading(true);
      
      // Process order for COD
      const orderData = {
        items: cartItems,
        total: cartTotal,
        shipping: checkoutInfo,
        paymentMethod: checkoutInfo.paymentMethod,
        status: 'pending'
      };
      
      // Simulating a network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear cart after successful order
      setCartItems([]);
      localStorage.setItem('cart', JSON.stringify([]));
      
      // Navigate to order confirmation
      navigate('/order-confirmation', { 
        state: { 
          order: orderData,
          orderId: 'ORD' + Math.floor(Math.random() * 1000000)
        }
      });
      
    } catch (err) {
      console.error('Error submitting order:', err);
      setError('Failed to process your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format price
  const formatPrice = (price) => {
    return `₹${price.toFixed(2)}`;
  };

  // Generate a default image when product image is missing
  const getProductImage = (item) => {
    if (!item) return 'https://via.placeholder.com/60x60.png?text=Product';
    
    if (item.imageUrl) {
      // Check if it's a full URL (http or https) or a relative path
      if (item.imageUrl.startsWith('http')) {
        return item.imageUrl;
      } else {
        // Use a hardcoded placeholder if the path is relative (fixing the image path issue)
        return `https://via.placeholder.com/60x60.png?text=${encodeURIComponent(item.commodityType || 'Product')}`;
      }
    }
    
    // Default placeholder image based on product type
    const placeholders = {
      vegetables: 'https://via.placeholder.com/60x60.png?text=Vegetable',
      fruits: 'https://via.placeholder.com/60x60.png?text=Fruit',
      grains: 'https://via.placeholder.com/60x60.png?text=Grain',
      dairy: 'https://via.placeholder.com/60x60.png?text=Dairy',
      default: 'https://via.placeholder.com/60x60.png?text=Product'
    };
    
    return placeholders[item.commodityType] || placeholders.default;
  };

  // Checkout step 1: Cart review
  const renderCartReview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-0">Your Shopping Cart</h2>
          <p className="text-muted">{itemCount} items in your cart</p>
        </Col>
        <Col xs="auto">
          <Button 
            variant="outline-primary"
            as={Link}
            to="/buyer-marketplace"
            className="me-2"
          >
            <i className="fas fa-arrow-left me-2"></i>
            Continue Shopping
          </Button>
        </Col>
      </Row>
      
      {cartItems.length === 0 ? (
        <Card className="shadow-sm border-0">
          <Card.Body className="text-center py-5">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="cart-empty-container"
            >
              <i className="fas fa-shopping-cart fa-4x text-muted mb-4 cart-empty-icon"></i>
              <h3>Your cart is empty</h3>
              <p className="text-muted mb-4">Looks like you haven't added any items to your cart yet.</p>
              <Button 
                variant="primary" 
                size="lg"
                as={Link}
                to="/buyer-marketplace"
              >
                Browse Products
              </Button>
            </motion.div>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table className="cart-table mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="ps-4">Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th className="pe-4 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map(item => (
                      <motion.tr 
                        key={item._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="cart-item"
                      >
                        <td className="ps-4">
                          <div className="d-flex align-items-center">
                            <div className="cart-img-container me-3">
                              <Image 
                                src={getProductImage(item)} 
                                alt={item.productName}
                                className="cart-img"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `https://via.placeholder.com/60x60.png?text=${encodeURIComponent(item.commodityType || 'Product')}`;
                                }}
                              />
                            </div>
                            <div>
                              <h6 className="mb-0">{item.productName}</h6>
                              <div className="d-flex align-items-center text-muted small">
                                <Badge bg="info" pill className="me-2">{item.commodityType}</Badge>
                                <span>Farmer: {item.farmer?.name || 'Unknown'}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{formatPrice(item.pricePerUnit)} <small className="text-muted">/ {item.unit}</small></td>
                        <td>
                          <div className="quantity-control">
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            >
                              <i className="fas fa-minus"></i>
                            </Button>
                            <span className="mx-3">{item.quantity}</span>
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            >
                              <i className="fas fa-plus"></i>
                            </Button>
                          </div>
                        </td>
                        <td className="fw-bold">
                          {formatPrice(item.pricePerUnit * item.quantity)}
                        </td>
                        <td className="pe-4 text-end">
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => removeItem(item._id)}
                          >
                            <i className="fas fa-trash me-1"></i>
                            Remove
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
          
          <Row>
            <Col md={7} className="mb-4 mb-md-0">
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <h5>Special Instructions</h5>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    placeholder="Add any special instructions for delivery"
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col md={5}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white border-0">
                  <h5 className="mb-0">Order Summary</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-4">
                    <strong>Total:</strong>
                    <h4>{formatPrice(cartTotal)}</h4>
                  </div>
                  
                  <div className="d-grid gap-2">
                    <Button 
                      variant="success"
                      size="lg"
                      onClick={() => setShowCheckout(true)}
                      disabled={cartItems.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      onClick={clearCart}
                      disabled={cartItems.length === 0}
                    >
                      Clear Cart
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </motion.div>
  );

  // Checkout step 2: Payment and shipping
  const renderCheckoutForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Checkout</h2>
          <p className="text-muted">Complete your order</p>
        </div>
        <Button 
          variant="outline-secondary"
          onClick={() => setShowCheckout(false)}
          disabled={paymentProcessing}
        >
          <i className="fas fa-arrow-left me-2"></i>
          Back to Cart
        </Button>
      </div>
      
      <Row>
        <Col lg={8} className="mb-4 mb-lg-0">
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Shipping Information</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmitOrder}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        type="text" 
                        name="name" 
                        value={checkoutInfo.name}
                        onChange={handleCheckoutChange}
                        required
                        disabled={paymentProcessing}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        type="email" 
                        name="email" 
                        value={checkoutInfo.email}
                        onChange={handleCheckoutChange}
                        required
                        disabled={paymentProcessing}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number <span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        type="tel" 
                        name="phone" 
                        value={checkoutInfo.phone}
                        onChange={handleCheckoutChange}
                        required
                        disabled={paymentProcessing}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Pincode <span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        type="text" 
                        name="pincode" 
                        value={checkoutInfo.pincode}
                        onChange={handleCheckoutChange}
                        required
                        disabled={paymentProcessing}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Address <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={2} 
                    name="address" 
                    value={checkoutInfo.address}
                    onChange={handleCheckoutChange}
                    required
                    disabled={paymentProcessing}
                  />
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>City <span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        type="text" 
                        name="city" 
                        value={checkoutInfo.city}
                        onChange={handleCheckoutChange}
                        required
                        disabled={paymentProcessing}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>State</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="state" 
                        value={checkoutInfo.state}
                        onChange={handleCheckoutChange}
                        disabled={paymentProcessing}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
          
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Payment Method</h5>
            </Card.Header>
            <Card.Body>
              <div className="payment-methods">
                <div 
                  className={`payment-method-card ${checkoutInfo.paymentMethod === 'razorpay' ? 'selected' : ''}`}
                  onClick={() => !paymentProcessing && handleCheckoutChange({ target: { name: 'paymentMethod', value: 'razorpay' } })}
                >
                  <div className="d-flex align-items-center">
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id="razorpay"
                        name="paymentMethod"
                        checked={checkoutInfo.paymentMethod === 'razorpay'}
                        onChange={() => {}}
                        disabled={paymentProcessing}
                      />
                    </div>
                    <label htmlFor="razorpay" className="ms-2 flex-grow-1">
                      <div className="d-flex align-items-center">
                        <img 
                          src="https://cdn.razorpay.com/logo.svg" 
                          alt="Razorpay" 
                          className="me-3"
                          style={{ height: "30px" }}
                        />
                        <div>
                          <h6 className="mb-0">Razorpay</h6>
                          <small className="text-muted">Pay securely with Credit/Debit Card, UPI, etc.</small>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div 
                  className={`payment-method-card ${checkoutInfo.paymentMethod === 'cod' ? 'selected' : ''}`}
                  onClick={() => !paymentProcessing && handleCheckoutChange({ target: { name: 'paymentMethod', value: 'cod' } })}
                >
                  <div className="d-flex align-items-center">
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id="cod"
                        name="paymentMethod"
                        checked={checkoutInfo.paymentMethod === 'cod'}
                        onChange={() => {}}
                        disabled={paymentProcessing}
                      />
                    </div>
                    <label htmlFor="cod" className="ms-2 flex-grow-1">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-money-bill-wave text-success me-3 fa-2x"></i>
                        <div>
                          <h6 className="mb-0">Cash on Delivery</h6>
                          <small className="text-muted">Pay when your order arrives</small>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div 
                  className={`payment-method-card ${checkoutInfo.paymentMethod === 'bank-transfer' ? 'selected' : ''}`}
                  onClick={() => !paymentProcessing && handleCheckoutChange({ target: { name: 'paymentMethod', value: 'bank-transfer' } })}
                >
                  <div className="d-flex align-items-center">
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id="bank-transfer"
                        name="paymentMethod"
                        checked={checkoutInfo.paymentMethod === 'bank-transfer'}
                        onChange={() => {}}
                        disabled={paymentProcessing}
                      />
                    </div>
                    <label htmlFor="bank-transfer" className="ms-2 flex-grow-1">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-university text-primary me-3 fa-2x"></i>
                        <div>
                          <h6 className="mb-0">Bank Transfer</h6>
                          <small className="text-muted">Pay directly from your bank account</small>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="shadow-sm border-0 sticky-top" style={{ top: '20px' }}>
            <Card.Header className="bg-white">
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Items ({itemCount}):</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <strong>Order Total:</strong>
                <h4>{formatPrice(cartTotal)}</h4>
              </div>
              
              {error && (
                <Alert variant="danger" className="mb-3">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}
              
              <div className="d-grid">
                <Button 
                  variant="success" 
                  size="lg"
                  disabled={loading || paymentProcessing}
                  onClick={handleSubmitOrder}
                >
                  {loading || paymentProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </div>
              
              <div className="mt-3">
                <h6 className="mb-3">Order Items</h6>
                <div className="order-items-summary">
                  {cartItems.map(item => (
                    <div key={item._id} className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                      <div className="d-flex align-items-center">
                        <Badge bg="secondary" className="me-2">{item.quantity}</Badge>
                        <span>{item.productName}</span>
                      </div>
                      <span>{formatPrice(item.pricePerUnit * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <small className="text-muted">
                  By placing your order, you agree to our Terms of Service and Privacy Policy
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </motion.div>
  );

  return (
    <Container className="py-5">
      {loading && cartItems.length === 0 ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your cart...</p>
        </div>
      ) : (
        <>
          {showCheckout ? renderCheckoutForm() : renderCartReview()}
        </>
      )}
    </Container>
  );
};

export default Cart; 