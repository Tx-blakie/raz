import { Navigate } from 'react-router-dom';

// Component to protect routes that require authentication and specific user types
const PrivateRoute = ({ children, userType }) => {
  // Check if the user is authenticated based on localStorage token
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  // Get the user data from localStorage if available
  let user = null;
  try {
    const userData = localStorage.getItem('user');
    if (userData && userData !== 'undefined') {
      user = JSON.parse(userData);
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If a specific user type is required, check if the user has that type
  if (userType && user && user.userType !== userType) {
    // Redirect to home page if the user doesn't have the required type
    return <Navigate to="/" replace />;
  }
  
  // If all checks pass, render the protected component
  return children;
};

export default PrivateRoute; 