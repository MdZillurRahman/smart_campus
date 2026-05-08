import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('sc_user');
    return stored ? JSON.parse(stored) : null;
  })

  const navigate = useNavigate();

  const loginUser = (token, userData) => {
    localStorage.setItem('sc_token', token);
    localStorage.setItem('sc_user', JSON.stringify(userData));
    setUser(userData);

    const redirects = {
      student: '/student/dashboard',
      admin: '/admin/dashboard',
      staff: '/staff/dashboard',
    }
    navigate(redirects[userData.role] || '/');
  }

  const logoutUser = () => {
    localStorage.removeItem('sc_token');
    localStorage.removeItem('sc_user');
    setUser(null);
    navigate('/login');
  }

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);