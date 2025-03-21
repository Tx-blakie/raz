import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import About from './pages/About';
import Marketplace from './pages/Marketplace';
import Services from './pages/Services';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import HelperDashboard from './pages/HelperDashboard';
import AdminDashboard from './admin/AdminDashboard';
import AddCommodity from './pages/AddCommodity';
import MarketPrices from './pages/MarketPrices';
import PlaceBid from './pages/PlaceBid';
import ViewBids from './pages/ViewBids';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Role-specific route component
const RoleRoute = ({ children, userType }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If userType is specified, check if user has that type
  if (userType && user.userType !== userType) {
    return <Navigate to="/home" />;
  }
  
  return children;
};

// Admin-specific route component
const AdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!user.isAdmin) {
    return <Navigate to="/home" />;
  }
  
  return children;
};

function App() {
  const [isReady, setIsReady] = useState(false);
  
  // Add a small delay to avoid flash of redirected content
  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 100);
  }, []);
  
  if (!isReady) {
    return null; // Or a loading spinner
  }
  
  return (
    <Router>
      <AuthProvider>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              {/* Redirect root path to login */}
              <Route path="/" element={<Navigate to="/login" />} />
              
              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route 
                path="/home" 
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/about" 
                element={
                  <ProtectedRoute>
                    <About />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/marketplace" 
                element={
                  <ProtectedRoute>
                    <Marketplace />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/services" 
                element={
                  <ProtectedRoute>
                    <Services />
                  </ProtectedRoute>
                } 
              />
              
              {/* Profile routes */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/edit-profile" 
                element={
                  <ProtectedRoute>
                    <EditProfile />
                  </ProtectedRoute>
                } 
              />
              
              {/* Role-specific routes */}
              <Route 
                path="/farmer-dashboard" 
                element={
                  <RoleRoute userType="farmer">
                    <FarmerDashboard />
                  </RoleRoute>
                } 
              />
              <Route 
                path="/buyer-dashboard" 
                element={
                  <RoleRoute userType="buyer">
                    <BuyerDashboard />
                  </RoleRoute>
                } 
              />
              <Route 
                path="/helper-dashboard" 
                element={
                  <RoleRoute userType="helper">
                    <HelperDashboard />
                  </RoleRoute>
                } 
              />
              
              {/* Admin routes */}
              <Route 
                path="/admin-dashboard" 
                element={
                  <AdminRoute>
                    <ErrorBoundary>
                      <AdminDashboard />
                    </ErrorBoundary>
                  </AdminRoute>
                } 
              />
              
              {/* Commodity management routes */}
              <Route 
                path="/add-commodity" 
                element={
                  <RoleRoute userType="farmer">
                    <AddCommodity />
                  </RoleRoute>
                } 
              />
              <Route 
                path="/market-prices" 
                element={
                  <ProtectedRoute>
                    <MarketPrices />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/place-bid" 
                element={
                  <RoleRoute userType="buyer">
                    <PlaceBid />
                  </RoleRoute>
                } 
              />
              <Route 
                path="/view-bids" 
                element={
                  <RoleRoute userType="farmer">
                    <ViewBids />
                  </RoleRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
