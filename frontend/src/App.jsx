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
import BuyerMarketplace from './buyer/BuyerMarketplace';
import Cart from './buyer/Cart';
import OrderConfirmation from './buyer/OrderConfirmation';
import AddCommodity from './pages/AddCommodity';
import MarketPrices from './pages/MarketPrices';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

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
              {/* Redirect root path to home */}
              <Route path="/" element={<Home />} />
              
              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route 
                path="/home" 
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/about" 
                element={
                  <PrivateRoute>
                    <About />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/marketplace" 
                element={
                  <PrivateRoute>
                    <Marketplace />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/services" 
                element={
                  <PrivateRoute>
                    <Services />
                  </PrivateRoute>
                } 
              />
              
              {/* Profile routes */}
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/edit-profile" 
                element={
                  <PrivateRoute>
                    <EditProfile />
                  </PrivateRoute>
                } 
              />
              
              {/* Role-specific routes */}
              <Route 
                path="/farmer-dashboard" 
                element={
                  <PrivateRoute userType="farmer">
                    <FarmerDashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/buyer-dashboard" 
                element={
                  <PrivateRoute userType="buyer">
                    <BuyerDashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/helper-dashboard" 
                element={
                  <PrivateRoute userType="helper">
                    <HelperDashboard />
                  </PrivateRoute>
                } 
              />
              
              {/* Admin routes */}
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <ErrorBoundary>
                      <AdminDashboard />
                    </ErrorBoundary>
                  </AdminRoute>
                } 
              />
              
              <Route 
                path="/admin/documents" 
                element={
                  <AdminRoute>
                    <ErrorBoundary>
                      <AdminDashboard activeTab="documents" />
                    </ErrorBoundary>
                  </AdminRoute>
                } 
              />
              
              {/* Commodity management routes */}
              <Route 
                path="/add-commodity" 
                element={
                  <PrivateRoute userType="farmer">
                    <AddCommodity />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/market-prices" 
                element={
                  <PrivateRoute>
                    <MarketPrices />
                  </PrivateRoute>
                } 
              />
              
              {/* Buyer-specific routes */}
              <Route 
                path="/buyer-marketplace" 
                element={
                  <PrivateRoute allowedRoles={['buyer']}>
                    <ErrorBoundary>
                      <BuyerMarketplace />
                    </ErrorBoundary>
                  </PrivateRoute>
                } 
              />
              
              {/* Cart and Order routes */}
              <Route 
                path="/cart" 
                element={
                  <PrivateRoute allowedRoles={['buyer']}>
                    <ErrorBoundary>
                      <Cart />
                    </ErrorBoundary>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/order-confirmation" 
                element={
                  <PrivateRoute allowedRoles={['buyer']}>
                    <ErrorBoundary>
                      <OrderConfirmation />
                    </ErrorBoundary>
                  </PrivateRoute>
                } 
              />
              
              {/* Catch All */}
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
