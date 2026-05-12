import React from 'react';

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div>
          <div className="footer-brand">
            <i className="ti ti-plane"></i>SkyFly
          </div>
          <div className="footer-tagline">India's smartest way to book flights</div>
          <div style={{ fontSize: '12px' }}>College project · Built with ❤️</div>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <a>About us</a>
          <a>Careers</a>
          <a>Press</a>
          <a>Blog</a>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <a>Help centre</a>
          <a>Contact us</a>
          <a>Cancellation</a>
          <a>Baggage</a>
        </div>
        <div className="footer-col">
          <h4>Legal</h4>
          <a>Privacy policy</a>
          <a>Terms of service</a>
          <a>Cookie policy</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 SkyFly Technologies Pvt Ltd · College Project Demo</span>
        <span>Made in Jaipur 🇮🇳</span>
      </div>
    </footer>
  );
}
