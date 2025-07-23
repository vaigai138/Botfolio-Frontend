import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const expiryTime = localStorage.getItem('expiry');

    if (savedToken && savedUser && expiryTime) {
      const now = new Date().getTime();

      if (now < parseInt(expiryTime)) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } else {
        localStorage.clear();
        setToken(null);
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  const loginUser = (userData, jwtToken) => {
    const now = new Date().getTime();
    const threeHours = 3 * 60 * 60 * 1000;
    const expiry = now + threeHours;

    setUser(userData);
    setToken(jwtToken);

    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('expiry', expiry.toString());

    navigate('/dashboard');
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);