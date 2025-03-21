import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Table, Badge, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';

const HelperDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  // Sample job data for demonstration
  const sampleJobs = [
    { 
      id: 1, 
      title: 'Harvest Assistant', 
      location: 'Nashik, Maharashtra', 
      duration: '2 weeks',
      payment: '₹500 per day',
      farmer: 'Ramesh Kumar',
      requirements: 'Experience in vegetable harvesting',
      postedDate: '2023-07-15',
      status: 'Open'
    },
    { 
      id: 2, 
      title: 'Farm Equipment Operator', 
      location: 'Pune, Maharashtra', 
      duration: '1 month',
      payment: '₹700 per day',
      farmer: 'Sunil Patel',
      requirements: 'Must know tractor operation',
      postedDate: '2023-07-20',
      status: 'Open'
    },
    { 
      id: 3, 
      title: 'Crop Planting Helper', 
      location: 'Nagpur, Maharashtra', 
      duration: '10 days',
      payment: '₹450 per day',
      farmer: 'Vikram Singh',
      requirements: 'No experience required, training provided',
      postedDate: '2023-07-25',
      status: 'Open'
    },
    { 
      id: 4, 
      title: 'Irrigation System Setup', 
      location: 'Thane, Maharashtra', 
      duration: '5 days',
      payment: '₹600 per day',
      farmer: 'Amit Sharma',
      requirements: 'Experience with drip irrigation systems',
      postedDate: '2023-07-12',
      status: 'Open'
    }
  ];

  // Sample applications data
  const sampleApplications = [
    { 
      id: 1, 
      jobId: 2, 
      jobTitle: 'Farm Equipment Operator',
      farmer: 'Sunil Patel',
      appliedDate: '2023-07-21',
      status: 'Under Review'
    },
    { 
      id: 2, 
      jobId: 3, 
      jobTitle: 'Crop Planting Helper',
      farmer: 'Vikram Singh',
      appliedDate: '2023-07-26',
      status: 'Accepted'
    }
  ];

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userData = JSON.parse(localStorage.getItem('user'));
    
    if (!isAuthenticated || !userData || userData.userType !== 'helper') {
      // Redirect to login if not authenticated or not a helper
      navigate('/login');
      return;
    }
    
    setUser(userData);
    
    // Set sample data
    setJobs(sampleJobs);
    setApplications(sampleApplications);
  }, [navigate]);

  const handleApplyForJob = (jobId) => {
    // In a real app, this would send an application to the backend
    const job = jobs.find(j => j.id === jobId);
    
    if (job) {
      const newApplication = {
        id: applications.length > 0 ? Math.max(...applications.map(a => a.id)) + 1 : 1,
        jobId,
        jobTitle: job.title,
        farmer: job.farmer,
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'Under Review'
      };
      
      setApplications([...applications, newApplication]);
      alert(`Applied for ${job.title} successfully!`);
    }
  };

  const isJobApplied = (jobId) => {
    return applications.some(app => app.jobId === jobId);
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.farmer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-warning text-white shadow">
              <Card.Body>
                <Row className="align-items-center">
                  <Col>
                    <h2 className="mb-0">Helper Dashboard</h2>
                    <p className="mb-0">Welcome back, {user.name}!</p>
                  </Col>
                  <Col xs="auto">
                    <span className="display-5">👨‍🌾</span>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={3}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>Available Jobs</Card.Title>
                <div className="d-flex align-items-center mt-2">
                  <span className="display-4 me-2">{jobs.length}</span>
                  <small className="text-muted">jobs</small>
                </div>
                <p className="text-success mt-2 mb-0">
                  <i className="bi bi-arrow-up"></i> 5 new this week
                </p>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
        
        <Col md={3}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>Your Applications</Card.Title>
                <div className="d-flex align-items-center mt-2">
                  <span className="display-4 me-2">{applications.length}</span>
                  <small className="text-muted">applications</small>
                </div>
                <p className="text-primary mt-2 mb-0">
                  <i className="bi bi-check-circle"></i> {applications.filter(a => a.status === 'Accepted').length} accepted
                </p>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
        
        <Col md={3}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>Earnings (This Month)</Card.Title>
                <div className="d-flex align-items-center mt-2">
                  <span className="display-4 me-2">₹8,500</span>
                </div>
                <p className="text-success mt-2 mb-0">
                  <i className="bi bi-arrow-up"></i> 12% from last month
                </p>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
        
        <Col md={3}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>Profile Completion</Card.Title>
                <div className="d-flex align-items-center mt-2">
                  <span className="display-4 me-2">80%</span>
                </div>
                <p className="text-warning mt-2 mb-0">
                  <i className="bi bi-exclamation-circle"></i> Add skills to reach 100%
                </p>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="shadow-sm">
              <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Available Jobs</h5>
                <Form.Control
                  type="text"
                  placeholder="Search jobs..."
                  className="w-auto"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Location</th>
                      <th>Duration</th>
                      <th>Payment</th>
                      <th>Farmer</th>
                      <th>Posted Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.map(job => (
                      <tr key={job.id}>
                        <td>{job.title}</td>
                        <td>{job.location}</td>
                        <td>{job.duration}</td>
                        <td>{job.payment}</td>
                        <td>{job.farmer}</td>
                        <td>{job.postedDate}</td>
                        <td>
                          {isJobApplied(job.id) ? (
                            <Badge bg="success">Applied</Badge>
                          ) : (
                            <Button 
                              variant="outline-success" 
                              size="sm"
                              onClick={() => handleApplyForJob(job.id)}
                            >
                              Apply
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      <Row>
        <Col>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Your Applications</h5>
              </Card.Header>
              <Card.Body>
                {applications.length === 0 ? (
                  <p className="text-center text-muted py-4">You haven't applied to any jobs yet</p>
                ) : (
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Job Title</th>
                        <th>Farmer</th>
                        <th>Applied Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map(app => (
                        <tr key={app.id}>
                          <td>{app.jobTitle}</td>
                          <td>{app.farmer}</td>
                          <td>{app.appliedDate}</td>
                          <td>
                            <Badge bg={
                              app.status === 'Accepted' ? 'success' : 
                              app.status === 'Rejected' ? 'danger' : 'warning'
                            }>
                              {app.status}
                            </Badge>
                          </td>
                          <td>
                            <Button variant="outline-primary" size="sm">
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default HelperDashboard; 