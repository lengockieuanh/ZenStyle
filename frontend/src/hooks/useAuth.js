import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);

  const checkAuth = () => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data') || localStorage.getItem('client_data');
    const type = localStorage.getItem('user_type');

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      setUserType(type);
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setUserType(null);
    }
  };

  useEffect(() => {
    checkAuth(); // Check khi component mount

    // Listen for localStorage changes
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab changes
    window.addEventListener('auth-change', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleStorageChange);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('client_data');
    localStorage.removeItem('user_type');
    
    setIsAuthenticated(false);
    setUser(null);
    setUserType(null);
    
    // Trigger custom event
    window.dispatchEvent(new Event('auth-change'));
  };

  return { isAuthenticated, user, userType, logout };
};