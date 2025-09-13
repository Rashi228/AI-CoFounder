import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiService.login(formData.email, formData.password);
      
      if (response.success) {
        // Store user data and token in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        
        // Dispatch custom event to update navbar
        window.dispatchEvent(new CustomEvent('userLogin'));
        
        navigate('/dashboard');
      } else {
        setError(response.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await apiService.demoLogin();
      
      if (response.success) {
        // Store user data and token in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        
        // Dispatch custom event to update navbar
        window.dispatchEvent(new CustomEvent('userLogin'));
        
        navigate('/dashboard');
      } else {
        setError(response.message || 'Demo login failed. Please try again.');
      }
    } catch (error) {
      setError(error.message || 'Demo login failed. Please try again.');
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
                    <i className="fas fa-rocket text-primary me-2"></i>
                    Welcome Back
                  </h1>
                  <p className="text-muted">Sign in to continue your startup journey</p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
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
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-lock"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="rememberMe" />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <Link to="/forgot-password" className="text-decoration-none">
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>

                  <div className="text-center">
                    <p className="mb-3">Don't have an account?</p>
                    <Link to="/get-started" className="btn btn-outline-primary w-100 mb-3">
                      Create Account
                    </Link>
                    
                    <hr className="my-4" />
                    
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100"
                      onClick={handleDemoLogin}
                    >
                      <i className="fas fa-play me-2"></i>
                      Try Demo
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
