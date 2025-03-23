import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Tab, Card, Table, Badge, Button, Form, Alert, Modal, Pagination } from 'react-bootstrap';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [users, setUsers] = useState([]);
    const [commodities, setCommodities] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    // Check if user is admin
    if (!user?.isAdmin) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    Access denied. Admin privileges required.
                </Alert>
            </Container>
        );
    }

    useEffect(() => {
        fetchData();
    }, [activeTab, selectedRole, selectedStatus]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');

            // Fetch statistics
            if (activeTab === 'overview') {
                const { data } = await axios.get('/api/admin/statistics');
                setStats(data);
            }

            // Fetch users
            if (activeTab === 'users') {
                const { data } = await axios.get(`/api/admin/users?role=${selectedRole}`);
                setUsers(data);
            }

            // Fetch commodities
            if (activeTab === 'commodities') {
                const { data } = await axios.get(`/api/admin/commodities?status=${selectedStatus}`);
                setCommodities(data);
            }

            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching data');
            setLoading(false);
        }
    };

    const handleUserDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`/api/admin/users/${userId}`);
                setUsers(users.filter(user => user._id !== userId));
            } catch (err) {
                setError(err.response?.data?.message || 'Error deleting user');
            }
        }
    };

    const handleCommodityAction = async (commodityId, status) => {
        if (status === 'rejected' && !rejectionReason) {
            setError('Please provide a reason for rejection');
            return;
        }

        try {
            const { data } = await axios.patch(`/api/admin/commodities/${commodityId}`, {
                status,
                rejectionReason: status === 'rejected' ? rejectionReason : undefined
            });

            setCommodities(commodities.map(commodity => 
                commodity._id === commodityId ? data : commodity
            ));

            setShowModal(false);
            setRejectionReason('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating commodity');
        }
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = activeTab === 'users' 
        ? users.slice(indexOfFirstItem, indexOfLastItem)
        : commodities.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(
        (activeTab === 'users' ? users.length : commodities.length) / itemsPerPage
    );

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <Pagination.Item
                    key={i}
                    active={i === currentPage}
                    onClick={() => setCurrentPage(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }
        return pages;
    };

    return (
        <Container fluid className="py-4">
            <Row>
                <Col md={3}>
                    <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                            <Nav.Link 
                                active={activeTab === 'overview'}
                                onClick={() => setActiveTab('overview')}
                            >
                                Overview
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link 
                                active={activeTab === 'users'}
                                onClick={() => setActiveTab('users')}
                            >
                                Users Management
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link 
                                active={activeTab === 'commodities'}
                                onClick={() => setActiveTab('commodities')}
                            >
                                Commodities
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
                <Col md={9}>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    {loading ? (
                        <div className="text-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <Tab.Content>
                            {/* Overview Tab */}
                            {activeTab === 'overview' && stats && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Row>
                                        <Col md={6} className="mb-4">
                                            <Card>
                                                <Card.Body>
                                                    <Card.Title>Users Statistics</Card.Title>
                                                    <Table striped bordered hover>
                                                        <tbody>
                                                            <tr>
                                                                <td>Total Users</td>
                                                                <td>{stats.users.total}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Farmers</td>
                                                                <td>{stats.users.farmers}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Buyers</td>
                                                                <td>{stats.users.buyers}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Helpers</td>
                                                                <td>{stats.users.helpers}</td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col md={6} className="mb-4">
                                            <Card>
                                                <Card.Body>
                                                    <Card.Title>Commodities Statistics</Card.Title>
                                                    <Table striped bordered hover>
                                                        <tbody>
                                                            <tr>
                                                                <td>Total Commodities</td>
                                                                <td>{stats.commodities.total}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Pending Approval</td>
                                                                <td>{stats.commodities.pending}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Approved</td>
                                                                <td>{stats.commodities.approved}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Rejected</td>
                                                                <td>{stats.commodities.rejected}</td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </motion.div>
                            )}

                            {/* Users Tab */}
                            {activeTab === 'users' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Form.Group className="mb-3">
                                        <Form.Label>Filter by Role</Form.Label>
                                        <Form.Select
                                            value={selectedRole}
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                        >
                                            <option value="all">All Users</option>
                                            <option value="farmer">Farmers</option>
                                            <option value="buyer">Buyers</option>
                                            <option value="helper">Helpers</option>
                                        </Form.Select>
                                    </Form.Group>

                                    <Table responsive striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentItems.map(user => (
                                                <tr key={user._id}>
                                                    <td>{user.name}</td>
                                                    <td>{user.email}</td>
                                                    <td>
                                                        <Badge bg={
                                                            user.userType === 'farmer' ? 'success' :
                                                            user.userType === 'buyer' ? 'primary' :
                                                            'info'
                                                        }>
                                                            {user.userType}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <Badge bg={user.status === 'active' ? 'success' : 'danger'}>
                                                            {user.status}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => handleUserDelete(user._id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </motion.div>
                            )}

                            {/* Commodities Tab */}
                            {activeTab === 'commodities' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Form.Group className="mb-3">
                                        <Form.Label>Filter by Status</Form.Label>
                                        <Form.Select
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                        >
                                            <option value="all">All Commodities</option>
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                        </Form.Select>
                                    </Form.Group>

                                    <Table responsive striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Farmer</th>
                                                <th>Type</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentItems.map(commodity => (
                                                <tr key={commodity._id}>
                                                    <td>{commodity.productName}</td>
                                                    <td>{commodity.farmer.name}</td>
                                                    <td>{commodity.commodityType}</td>
                                                    <td>{commodity.quantity} kg</td>
                                                    <td>₹{commodity.pricePerUnit}/5kg</td>
                                                    <td>
                                                        <Badge bg={
                                                            commodity.status === 'approved' ? 'success' :
                                                            commodity.status === 'pending' ? 'warning' :
                                                            'danger'
                                                        }>
                                                            {commodity.status}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        {commodity.status === 'pending' && (
                                                            <>
                                                                <Button
                                                                    variant="success"
                                                                    size="sm"
                                                                    className="me-2"
                                                                    onClick={() => handleCommodityAction(commodity._id, 'approved')}
                                                                >
                                                                    Approve
                                                                </Button>
                                                                <Button
                                                                    variant="danger"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setSelectedItem(commodity);
                                                                        setShowModal(true);
                                                                    }}  
                                                                >
                                                                    Reject
                                                                </Button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </motion.div>
                            )}

                            {/* Pagination */}
                            {(activeTab === 'users' || activeTab === 'commodities') && (
                                <Pagination className="mt-3 justify-content-center">
                                    <Pagination.Prev
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                    />
                                    {renderPagination()}
                                    <Pagination.Next
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    />
                                </Pagination>
                            )}
                        </Tab.Content>
                    )}
                </Col>
            </Row>

            {/* Rejection Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Reject Commodity</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Reason for Rejection</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Please provide a reason for rejection"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => handleCommodityAction(selectedItem._id, 'rejected')}
                    >
                        Reject
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdminDashboard; 