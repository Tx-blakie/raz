import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';

const MarketPrices = () => {
  const [loading, setLoading] = useState(true);
  const [commodityType, setCommodityType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [marketPrices, setMarketPrices] = useState([]);
  
  // Mock data for demonstration
  useEffect(() => {
    // In a real application, this would be an API call
    const mockPrices = [
      { id: 1, name: 'Tomatoes', type: 'vegetables', price: '₹250-300/5kg', change: '+5%', trend: 'up' },
      { id: 2, name: 'Onions', type: 'vegetables', price: '₹180-220/5kg', change: '-2%', trend: 'down' },
      { id: 3, name: 'Potatoes', type: 'vegetables', price: '₹160-200/5kg', change: '0%', trend: 'stable' },
      { id: 4, name: 'Alphonso Mangoes', type: 'fruits', price: '₹500-700/5kg', change: '+10%', trend: 'up' },
      { id: 5, name: 'Bananas', type: 'fruits', price: '₹120-150/5kg', change: '+2%', trend: 'up' },
      { id: 6, name: 'Apples', type: 'fruits', price: '₹350-400/5kg', change: '-1%', trend: 'down' },
      { id: 7, name: 'Rice (Basmati)', type: 'grains', price: '₹210-250/5kg', change: '+3%', trend: 'up' },
      { id: 8, name: 'Wheat', type: 'grains', price: '₹150-180/5kg', change: '0%', trend: 'stable' },
      { id: 9, name: 'Chickpeas', type: 'pulses', price: '₹320-350/5kg', change: '+1%', trend: 'up' },
      { id: 10, name: 'Lentils (Masoor)', type: 'pulses', price: '₹280-310/5kg', change: '-2%', trend: 'down' },
      { id: 11, name: 'Cumin', type: 'spices', price: '₹1200-1500/5kg', change: '+5%', trend: 'up' },
      { id: 12, name: 'Turmeric', type: 'spices', price: '₹800-950/5kg', change: '+2%', trend: 'up' },
    ];
    
    // Simulate API delay
    setTimeout(() => {
      setMarketPrices(mockPrices);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Filter data based on type and search term
  const filteredPrices = marketPrices.filter(item => {
    const matchesType = commodityType === 'all' || item.type === commodityType;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });
  
  // Get trend icon based on trend value
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <i className="bi bi-arrow-up-circle-fill text-success"></i>;
      case 'down':
        return <i className="bi bi-arrow-down-circle-fill text-danger"></i>;
      default:
        return <i className="bi bi-dash-circle-fill text-secondary"></i>;
    }
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
            <h1 className="display-5 fw-bold mb-3">Current Market Prices</h1>
            <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
              Stay informed about the latest agricultural commodity prices across different categories
            </p>
          </div>
          
          <Card className="border-0 shadow-sm mb-5">
            <Card.Body className="p-4">
              <Row className="mb-3 align-items-center">
                <Col md={5} className="mb-3 mb-md-0">
                  <Form.Control
                    type="text"
                    placeholder="Search commodities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Col>
                <Col md={4} className="mb-3 mb-md-0">
                  <Form.Select
                    value={commodityType}
                    onChange={(e) => setCommodityType(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="grains">Grains</option>
                    <option value="pulses">Pulses</option>
                    <option value="spices">Spices</option>
                  </Form.Select>
                </Col>
                <Col md={3} className="text-md-end">
                  <Button variant="outline-success">
                    <i className="bi bi-download me-2"></i>
                    Export Data
                  </Button>
                </Col>
              </Row>
              
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="success" />
                  <p className="mt-3 text-muted">Loading market prices...</p>
                </div>
              ) : filteredPrices.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-search fs-1 text-muted"></i>
                  <p className="mt-3">No commodities found matching your search criteria.</p>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setCommodityType('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <Table responsive hover>
                  <thead className="bg-light">
                    <tr>
                      <th>Commodity</th>
                      <th>Category</th>
                      <th>Price Range</th>
                      <th>Change (24h)</th>
                      <th>Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPrices.map(item => (
                      <tr key={item.id}>
                        <td className="fw-medium">{item.name}</td>
                        <td>
                          <span className="text-capitalize">{item.type}</span>
                        </td>
                        <td>{item.price}</td>
                        <td className={
                          item.trend === 'up' ? 'text-success' : 
                          item.trend === 'down' ? 'text-danger' : 
                          'text-secondary'
                        }>
                          {item.change}
                        </td>
                        <td>
                          {getTrendIcon(item.trend)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
              
              <div className="mt-4 text-center text-muted small">
                <p className="mb-0">
                  <i className="bi bi-info-circle me-1"></i>
                  Price data is updated daily. Last updated: Today, 9:00 AM
                </p>
              </div>
            </Card.Body>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h4 className="mb-4">Understanding Market Prices</h4>
              
              <Row>
                <Col md={4} className="mb-4 mb-md-0">
                  <div className="d-flex">
                    <div className="me-3 text-success fs-3">
                      <i className="bi bi-graph-up"></i>
                    </div>
                    <div>
                      <h5>Price Trends</h5>
                      <p className="text-muted">
                        Markets fluctuate based on supply, demand, and seasonal factors. 
                        Using our trend indicators can help you make better selling decisions.
                      </p>
                    </div>
                  </div>
                </Col>
                
                <Col md={4} className="mb-4 mb-md-0">
                  <div className="d-flex">
                    <div className="me-3 text-primary fs-3">
                      <i className="bi bi-calendar-check"></i>
                    </div>
                    <div>
                      <h5>Seasonal Variations</h5>
                      <p className="text-muted">
                        Agricultural commodities often follow seasonal patterns. 
                        Understanding these can help you plan your cultivation and sales.
                      </p>
                    </div>
                  </div>
                </Col>
                
                <Col md={4}>
                  <div className="d-flex">
                    <div className="me-3 text-warning fs-3">
                      <i className="bi bi-geo-alt"></i>
                    </div>
                    <div>
                      <h5>Regional Differences</h5>
                      <p className="text-muted">
                        Prices can vary by region based on local supply and demand. 
                        These prices represent national averages.
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
};

export default MarketPrices; 