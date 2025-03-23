import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Cart.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [paymentId, setPaymentId] = useState(null);

  useEffect(() => {
    // Check if we have order data from location state
    if (location.state?.order) {
      setOrderData(location.state.order);
      setOrderId(location.state.orderId);
      setPaymentId(location.state.paymentId);
    } else {
      // If no order data, redirect to home
      navigate('/');
    }
  }, [location, navigate]);

  // Format price
  const formatPrice = (price) => {
    return `₹${price.toFixed(2)}`;
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get estimated delivery date (5 days from now)
  const getEstimatedDelivery = () => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return formatDate(date);
  };

  // Get payment method label
  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'razorpay':
        return 'Razorpay';
      case 'cod':
        return 'Cash on Delivery';
      case 'bank-transfer':
        return 'Bank Transfer';
      default:
        return method;
    }
  };

  if (!orderData) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading order details...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Row className="mb-4">
          <Col>
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-4"
              >
                <div className="success-checkmark">
                  <div className="check-icon">
                    <span className="icon-line line-tip"></span>
                    <span className="icon-line line-long"></span>
                    <div className="icon-circle"></div>
                    <div className="icon-fix"></div>
                  </div>
                </div>
              </motion.div>
              <h1 className="display-5 mb-3">Order Confirmed!</h1>
              <p className="lead mb-4">
                Your order has been successfully placed and will be processed soon.
              </p>
              <div className="d-flex justify-content-center gap-3 mb-5">
                <Link to="/buyer-dashboard" className="btn btn-primary">
                  Go to Dashboard
                </Link>
                <Link to="/buyer-marketplace" className="btn btn-outline-primary">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col lg={8}>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Header className="bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Order Summary</h5>
                  <Badge bg="success" className="fs-6">Order #{orderId}</Badge>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="ps-4">Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th className="pe-4 text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderData.items.map((item, index) => (
                        <tr key={index}>
                          <td className="ps-4">
                            <div className="d-flex align-items-center">
                              <div className="cart-img-container me-3">
                                <img 
                                  src={item.imageUrl || `https://via.placeholder.com/60x60.png?text=${encodeURIComponent(item.commodityType || 'Product')}`} 
                                  alt={item.productName}
                                  className="cart-img"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://via.placeholder.com/60x60.png?text=${encodeURIComponent(item.commodityType || 'Product')}`;
                                  }}
                                />
                              </div>
                              <div>
                                <h6 className="mb-0">{item.productName || 'Product'}</h6>
                                <div className="d-flex align-items-center text-muted small">
                                  <Badge bg="info" pill className="me-2">{item.commodityType || 'Other'}</Badge>
                                  <span>Farmer: {item.farmer?.name || 'Unknown'}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>{formatPrice(Number(item.pricePerUnit || 0))} <small className="text-muted">/ {item.unit || 'unit'}</small></td>
                          <td>{Number(item.quantity || 1)}</td>
                          <td className="pe-4 text-end fw-bold">{formatPrice(Number(item.pricePerUnit || 0) * Number(item.quantity || 1))}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-light">
                      <tr>
                        <td colSpan="3" className="text-end pe-4">Subtotal:</td>
                        <td className="pe-4 text-end">{formatPrice(Number(orderData.total || 0))}</td>
                      </tr>
                      <tr>
                        <td colSpan="3" className="text-end pe-4">Shipping:</td>
                        <td className="pe-4 text-end">Free</td>
                      </tr>
                      <tr>
                        <td colSpan="3" className="text-end pe-4 fw-bold">Total:</td>
                        <td className="pe-4 text-end fw-bold fs-5">{formatPrice(Number(orderData.total || 0))}</td>
                      </tr>
                    </tfoot>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Order Details</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <small className="text-muted d-block">Order Date</small>
                  <div>{formatDate(new Date())}</div>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Order Status</small>
                  <Badge bg="success">Confirmed</Badge>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Payment Method</small>
                  <div>{getPaymentMethodLabel(orderData.paymentMethod)}</div>
                </div>
                {paymentId && (
                  <div className="mb-3">
                    <small className="text-muted d-block">Payment ID</small>
                    <div className="text-break">{paymentId}</div>
                  </div>
                )}
                <div>
                  <small className="text-muted d-block">Estimated Delivery</small>
                  <div>{getEstimatedDelivery()}</div>
                </div>
              </Card.Body>
            </Card>

            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Shipping Address</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-1 fw-bold">{orderData.shipping.name}</div>
                <div className="mb-3">{orderData.shipping.address}</div>
                <div>{orderData.shipping.city}, {orderData.shipping.state || 'N/A'}</div>
                <div>{orderData.shipping.pincode}</div>
                <div className="mt-3">{orderData.shipping.phone}</div>
                <div>{orderData.shipping.email}</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="text-center mb-5">
          <p>Need help with your order?</p>
          <Link to="/contact" className="btn btn-outline-secondary">Contact Us</Link>
        </div>
      </motion.div>
    </Container>
  );
};

export default OrderConfirmation; 