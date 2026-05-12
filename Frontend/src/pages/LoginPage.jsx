import React, { useState } from 'react';
import { authAPI } from '../api/api';

export default function LoginPage({ goto, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      const response = await authAPI.login({ email, password });
      onLogin(response.data.user, response.data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="auth-page">
        <div className="auth-box">
          <div className="auth-logo">
            <i className="ti ti-plane"></i>
            <span>SkyFly</span>
          </div>
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-sub">Log in to manage your bookings</p>
          {error && <div style={{ color: '#ff4757', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
          <div className="auth-form">
            <div className="form-group">
              <label>Email address</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <div style={{ textAlign: 'right', marginTop: '-6px' }}>
              <a style={{ fontSize: '12px', color: 'var(--sky)', cursor: 'pointer', textDecoration: 'none' }}>Forgot password?</a>
            </div>
            <button className="auth-submit" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </div>
          <p className="auth-switch">
            Don't have an account? <a onClick={() => goto('signup')}>Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
