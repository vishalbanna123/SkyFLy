import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import ConfirmationPage from './pages/ConfirmationPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { authAPI } from './api/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const response = await authAPI.getCurrentUser();
        setUser(response.data.user);
      }
    } catch (error) {
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData, token) => {
    localStorage.setItem('authToken', token);
    setUser(userData);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setCurrentPage('home');
  };

  const goto = (page) => {
    // Require login for booking and profile pages
    if ((page === 'booking' || page === 'profile') && !user) {
      setCurrentPage('login');
      return;
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    if (loading) {
      return <div className="page" style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
    }

    switch (currentPage) {
      case 'home':
        return <HomePage goto={goto} user={user} />;
      case 'results':
        return <ResultsPage goto={goto} user={user} setSelectedFlight={setSelectedFlight} />;
      case 'booking':
        return <BookingPage goto={goto} user={user} selectedFlight={selectedFlight} setBookingData={setBookingData} />;
      case 'payment':
        return <PaymentPage goto={goto} user={user} bookingData={bookingData} />;
      case 'confirmation':
        return <ConfirmationPage goto={goto} />;
      case 'profile':
        return <ProfilePage goto={goto} user={user} onLogout={handleLogout} />;
      case 'login':
        return <LoginPage goto={goto} onLogin={handleLogin} />;
      case 'signup':
        return <SignupPage goto={goto} onSignup={handleLogin} />;
      default:
        return <HomePage goto={goto} user={user} />;
    }
  };

  return (
    <>
      <Navbar currentPage={currentPage} goto={goto} user={user} onLogout={handleLogout} />
      {renderPage()}
    </>
  );
}
