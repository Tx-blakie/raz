import { Navigate } from 'react-router-dom';

// Component to protect routes that require admin privileges
const AdminRoute = ({ children }) => {
  // Check if the user is authenticated based on localStorage token
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  // Get the user data from localStorage if available
  let user = null;
  try {
    const userData = localStorage.getItem('user');
    if (userData && userData !== 'undefined') {
      user = JSON.parse(userData);
      // Log user data for debugging
      console.log('User data in AdminRoute:', user);
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // Check if the user is an admin - handle different possible admin flag formats
  const isAdmin = 
    user && (
      user.isAdmin === true || 
      user.isAdmin === 'true' || 
      user.userType === 'admin' ||
      user.role === 'admin'
    );
  
  if (!isAdmin) {
    console.log('Not admin, redirecting to home');
    // Redirect to home page if the user is not an admin
    return <Navigate to="/" replace />;
  }
  
  console.log('Admin check passed, rendering admin component');
  // If all checks pass, render the admin component
  return children;
};

export default AdminRoute; 