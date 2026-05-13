import React from 'react';

export default function Navbar({ currentPage, goto, user, onLogout }) {
  const navItems = ['home', 'results', 'profile'];
  const navLabels = ['Home', 'Search Flights', 'My Bookings'];

  const handleProfileClick = () => {
    if (user) {
      goto('profile');
    } else {
      goto('login');
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <nav>
      <div className="brand" onClick={() => goto('home')}>
        <i className="ti ti-plane"></i>
        <span className="brand-name">SkyFly</span>
      </div>
      <div className="nav-links">
        {navLabels.map((label, idx) => (
          <div
            key={idx}
            className={`nav-link ${navItems[idx] === currentPage ? 'active' : ''}`}
            onClick={() => goto(navItems[idx])}
          >
            {label}
          </div>
        ))}
        <div className="nav-link">Offers</div>
      </div>
      <div className="nav-right">
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                padding: '8px 16px',
                borderRadius: '24px',
                background: '#1a1a1a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#fff',
              }}
              onClick={handleProfileClick}
            >
              <i className="ti ti-user" style={{ fontSize: '16px' }}></i>
              {user.firstName} {user.lastName}
            </div>
            <button
              className="btn-login"
              onClick={handleLogout}
              style={{ background: '#ff4757', borderColor: '#ff4757' }}
            >
              Log out
            </button>
          </div>
        ) : (
          <>
            <button className="btn-login" onClick={() => goto('login')}>
              Log in
            </button>
            <button className="btn-signup" onClick={() => goto('signup')}>
              Sign up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
