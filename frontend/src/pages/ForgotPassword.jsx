import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/apiService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await apiService.forgotPassword(email);
      
      if (response.success) {
        setMessage(response.message || 'Password reset instructions have been sent to your email.');
      } else {
        setMessage(response.message || 'Error sending reset email. Please try again.');
      }
    } catch (error) {
      setMessage(error.message || 'Error sending reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h1 className="h3 mb-3">
                    <i className="fas fa-key text-primary me-2"></i>
                    Forgot Password?
                  </h1>
                  <p className="text-muted">Enter your email address and we'll send you instructions to reset your password.</p>
                </div>

                {message && (
                  <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`} role="alert">
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Sending...
                      </>
                    ) : (
                      'Send Reset Instructions'
                    )}
                  </button>
                </form>

                <div className="text-center">
                  <p className="mb-0">Remember your password?</p>
                  <Link to="/login" className="text-decoration-none">
                    Sign in here
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
