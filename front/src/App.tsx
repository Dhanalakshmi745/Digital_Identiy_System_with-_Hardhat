import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import { Register } from './components/Register';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (userData: any) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('privateKey');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleRegister = (userData: any) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
    setShowRegister(false);
  };

  if (isAuthenticated && currentUser) {
    return <Dashboard user={currentUser} onLogout={handleLogout} />;
  }

  if (showRegister) {
    return (
      <Register 
        onRegister={handleRegister}
        onBackToLogin={() => setShowRegister(false)}
      />
    );
  }

  return (
    <Login 
      onLogin={handleLogin}
      onShowRegister={() => setShowRegister(true)}
    />
  );
}
