import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { bookingAPI } from '../api/api';

export default function ProfilePage({ goto, user, onLogout }) {
  const [activeNav, setActiveNav] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserBookings();
  }, [user]);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getUserBookings(1, 50);
      setBookings(response.data.bookings || []);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    goto('home');
  };

  const navItems = [
    { id: 'bookings', label: 'My bookings', icon: 'ti-ticket' },
    { id: 'profile', label: 'Profile details', icon: 'ti-user' },
    { id: 'cards', label: 'Saved cards', icon: 'ti-credit-card' },
    { id: 'wishlist', label: 'Wishlist', icon: 'ti-heart' },
    { id: 'rewards', label: 'Rewards & offers', icon: 'ti-gift' },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bk-upcoming';
      case 'completed':
        return 'bk-completed';
      case 'cancelled':
        return 'bk-cancelled';
      default:
        return '';
    }
  };

  return (
    <>
      <div className="page">
        <div className="profile-page">
          <div className="profile-grid">
            <div className="profile-sidebar">
              <div className="avatar">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
              <div className="profile-name">{user?.firstName} {user?.lastName}</div>
              <div className="profile-email">{user?.email}</div>
              <ul className="profile-nav">
                {navItems.map((item) => (
                  <li
                    key={item.id}
                    className={activeNav === item.id ? 'active' : ''}
                    onClick={() => setActiveNav(item.id)}
                  >
                    <i className={`ti ${item.icon}`}></i>
                    {item.label}
                  </li>
                ))}
                <li style={{ color: 'var(--danger)', marginTop: '1rem' }} onClick={handleLogout}>
                  <i className="ti ti-logout"></i>Log out
                </li>
              </ul>
            </div>

            <div>
              <div className="section-head" style={{ marginBottom: '1rem' }}>
                <h2>My bookings</h2>
                <p>{bookings.length} bookings</p>
              </div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>Loading bookings...</div>
              ) : error ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--danger)' }}>{error}</div>
              ) : bookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
                  <p>No bookings yet</p>
                  <button className="btn-primary" onClick={() => goto('results')} style={{ marginTop: '1rem' }}>
                    Search flights
                  </button>
                </div>
              ) : (
                <div className="booking-list">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="bk-card">
                      <div>
                        <span className="bk-status bk-upcoming">
                          {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Pending'}
                        </span>
                        <div className="bk-route">
                          {booking.Flight?.departureCity} → {booking.Flight?.arrivalCity}
                        </div>
                        <div className="bk-info">
                          {booking.Flight?.airline} · {booking.Flight?.flightNumber} · {booking.Flight?.aircraft}
                        </div>
                        <div style={{ marginTop: '6px', display: 'flex', gap: '8px' }}>
                          <button className="sort-btn" onClick={() => goto('confirmation')}>
                            View ticket
                          </button>
                        </div>
                      </div>
                      <div></div>
                      <div>
                        <div className="bk-price">${booking.totalPrice}</div>
                        <div className="bk-pnr">Ref: {booking.bookingReference}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
