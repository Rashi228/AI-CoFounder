import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const checkUser = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };

    // Check on mount
    checkUser();

    // Listen for storage changes (when user logs in from another tab)
    window.addEventListener('storage', checkUser);
    
    // Listen for custom login event
    window.addEventListener('userLogin', checkUser);

    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('userLogin', checkUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          <i className="fas fa-robot me-2 text-gradient"></i>
          <span className="brand-text">AI-CoFounder</span>
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/idea-input')}`} to="/idea-input">
                Submit Idea
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/dashboard')}`} to="/dashboard">
                Dashboard
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Tools
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/problem-refinement">
                    Problem Refinement
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/market-research">
                    Market Research
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/business-models">
                    Business Models
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/financial-projections">
                    Financial Projections
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/validation-experiments">
                    Validation Experiments
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/cofounder-matching">
                    Co-Founder Matching
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/pitch-deck">
                    Pitch Deck Generator
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
          
          <div className="d-flex">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-primary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-user me-1"></i>
                  {user.firstName ? `${user.firstName} ${user.lastName}` : user.email}
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/dashboard">
                      <i className="fas fa-tachometer-alt me-2"></i>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/idea-input">
                      <i className="fas fa-lightbulb me-2"></i>
                      Submit Idea
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary me-2">
                  <i className="fas fa-sign-in-alt me-1"></i>
                  Login
                </Link>
                <Link to="/get-started" className="btn btn-primary">
                  <i className="fas fa-user-plus me-1"></i>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
