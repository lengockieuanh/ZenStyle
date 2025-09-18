import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data') || localStorage.getItem('client_data');
    const type = localStorage.getItem('user_type');

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      setUserType(type);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('client_data');
    localStorage.removeItem('user_type');
    setIsAuthenticated(false);
    setUser(null);
    setUserType(null);
  };

  return { isAuthenticated, user, userType, logout };
};