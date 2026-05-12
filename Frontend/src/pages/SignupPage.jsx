import React, { useState } from 'react';
import { authAPI } from '../api/api';

export default function SignupPage({ goto, onSignup }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        setError('Please fill in all required fields');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (!formData.agreeTerms) {
        setError('Please agree to terms and conditions');
        return;
      }

      setLoading(true);
      const response = await authAPI.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      onSignup(response.data.user, response.data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
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
          <h2 className="auth-title">Create account</h2>
          <p className="auth-sub">Join millions of smart travellers</p>
          {error && <div style={{ color: '#ff4757', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
          <div className="auth-form">
            <div className="form-row cols2" style={{ gap: '10px' }}>
              <div className="form-group">
                <label>First name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Last name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Confirm password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <label style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '12px', color: 'var(--muted)', cursor: 'pointer' }}>
              <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} disabled={loading} style={{ marginTop: '2px', accentColor: 'var(--sky)' }} />
              I agree to the{' '}
              <a style={{ color: 'var(--sky)' }} onClick={() => alert('Terms of Service')}>
                Terms of Service
              </a>{' '}
              and{' '}
              <a style={{ color: 'var(--sky)' }} onClick={() => alert('Privacy Policy')}>
                Privacy Policy
              </a>
            </label>
            <button className="auth-submit" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
          <p className="auth-switch">
            Already have an account? <a onClick={() => goto('login')}>Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
