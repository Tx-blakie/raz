import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-3">
      <Container>
        {/* Main Footer Content */}
        <Row className="pb-4">
          {/* Company Info */}
          <Col lg={3} md={6} className="mb-4 mb-lg-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h5 className="fw-bold mb-4 d-flex align-items-center">
                <span className="me-2 fs-4">🌾</span>
                Smart AgroConnect
              </h5>
              <p className="text-white-50">
                Connecting farmers, buyers, and agricultural helpers to create a sustainable ecosystem.
              </p>
              <div className="mt-3 d-flex gap-2">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="btn btn-sm btn-outline-light rounded-circle p-2"
                  >
                    <i className={`bi ${link.icon}`}></i>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </Col>

          {/* Quick Links */}
          <Col lg={3} md={6} className="mb-4 mb-lg-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h5 className="fw-bold mb-4">Quick Links</h5>
              <ul className="list-unstyled">
                {quickLinks.map((link, index) => (
                  <motion.li 
                    key={index} 
                    className="mb-2"
                    whileHover={{ x: 5 }}
                  >
                    <Link to={link.url} className="text-white-50 text-decoration-none">
                      → {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </Col>

          {/* Contact Info */}
          <Col lg={3} md={6} className="mb-4 mb-lg-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h5 className="fw-bold mb-4">Contact Us</h5>
              <ul className="list-unstyled text-white-50">
                <li className="mb-3 d-flex align-items-start">
                  <i className="bi bi-geo-alt-fill me-2 mt-1"></i>
                  <span>123 Agro Lane, Farmville<br />Countryside, CS 12345</span>
                </li>
                <li className="mb-3 d-flex align-items-center">
                  <i className="bi bi-telephone-fill me-2"></i>
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="mb-3 d-flex align-items-center">
                  <i className="bi bi-envelope-fill me-2"></i>
                  <span>info@smartagroconnect.com</span>
                </li>
              </ul>
            </motion.div>
          </Col>

          {/* Newsletter */}
          <Col lg={3} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h5 className="fw-bold mb-4">Subscribe</h5>
              <p className="text-white-50 mb-3">
                Get the latest updates and news about agricultural trends
              </p>
              <Form>
                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="Your email"
                    aria-label="Your email"
                    className="bg-dark border-secondary text-white"
                  />
                  <Button variant="success" id="subscribe-btn">
                    Subscribe
                  </Button>
                </InputGroup>
              </Form>
            </motion.div>
          </Col>
        </Row>

        {/* Copyright Section */}
        <hr className="my-4 bg-secondary" />
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start text-white-50 mb-3 mb-md-0">
            <small>
              © {new Date().getFullYear()} Smart AgroConnect. All rights reserved.
            </small>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <a href="#" className="text-white-50 text-decoration-none small">Privacy Policy</a>
              </li>
              <li className="list-inline-item ms-3">
                <a href="#" className="text-white-50 text-decoration-none small">Terms of Service</a>
              </li>
              <li className="list-inline-item ms-3">
                <a href="#" className="text-white-50 text-decoration-none small">Cookie Policy</a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

// Data
const socialLinks = [
  { icon: 'bi-facebook', url: '#' },
  { icon: 'bi-twitter', url: '#' },
  { icon: 'bi-instagram', url: '#' },
  { icon: 'bi-linkedin', url: '#' }
];

const quickLinks = [
  { label: 'Home', url: '/' },
  { label: 'Marketplace', url: '/marketplace' },
  { label: 'Services', url: '/services' },
  { label: 'About Us', url: '/about' },
  { label: 'Register', url: '/register' },
  { label: 'Login', url: '/login' },
];

export default Footer; 