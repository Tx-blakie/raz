import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Check auth status
    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await api.get('/api/users/me');
            
            if (response.data) {
                setUser(response.data);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    };

    // Login user
    const login = async (credentials) => {
        try {
            const response = await api.post('/api/users/login', credentials);
            
            if (!response.data || !response.data.token) {
                throw new Error('Invalid response from server');
            }
            
            const userData = response.data;
            
            // Store token and user data
            localStorage.setItem('token', userData.token);
            
            // Remove token from user object before storing
            const { token, ...userDataWithoutToken } = userData;
            localStorage.setItem('user', JSON.stringify(userDataWithoutToken));
            
            setUser(userDataWithoutToken);
            
            return { success: true };
        } catch (error) {
            console.error('Login failed:', error);
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Login failed'
            };
        }
    };

    // Logout user
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const register = async (userData) => {
        try {
            setError('');
            const { data } = await api.post('/api/users/register', userData);
            localStorage.setItem('token', data.token);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            setUser(data.user);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            throw err;
        }
    };

    const updateProfile = async (userData) => {
        try {
            setError('');
            const { data } = await api.patch('/api/users/profile', userData);
            setUser(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || 'Profile update failed');
            throw err;
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext; 