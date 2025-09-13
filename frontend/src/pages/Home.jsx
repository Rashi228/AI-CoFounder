import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Transform Your <span className="text-gradient">Startup Ideas</span> into Reality
              </h1>
              <p className="lead mb-4">
                AI-powered platform that helps students refine ideas, conduct market research, 
                find co-founders, and create investment-ready pitch decks.
              </p>
              <div className="d-flex gap-3">
                {user ? (
                  <>
                    <Link to="/dashboard" className="btn btn-primary btn-lg">
                      <i className="fas fa-tachometer-alt me-2"></i>
                      Go to Dashboard
                    </Link>
                    <Link to="/idea-input" className="btn btn-outline-light btn-lg">
                      <i className="fas fa-lightbulb me-2"></i>
                      Submit Idea
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/get-started" className="btn btn-primary btn-lg">
                      <i className="fas fa-rocket me-2"></i>
                      Get Started Free
                    </Link>
                    <Link to="/login" className="btn btn-outline-light btn-lg">
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="text-center">
                <i className="fas fa-rocket fa-10x text-white opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Everything You Need to Launch</h2>
            <p className="section-subtitle">
              From idea to investment, we've got you covered with AI-powered tools
            </p>
          </div>
          
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="card feature-card h-100">
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-lightbulb fa-3x text-primary"></i>
                  </div>
                  <h5 className="card-title">Idea Refinement</h5>
                  <p className="card-text">
                    Transform raw ideas into clear problem statements with AI-powered analysis 
                    and market validation insights.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6">
              <div className="card feature-card h-100">
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-chart-bar fa-3x text-success"></i>
                  </div>
                  <h5 className="card-title">Market Research</h5>
                  <p className="card-text">
                    Automated market analysis, competitor research, and trend identification 
                    to validate your business opportunity.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6">
              <div className="card feature-card h-100">
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-users fa-3x text-warning"></i>
                  </div>
                  <h5 className="card-title">Co-Founder Matching</h5>
                  <p className="card-text">
                    Find the perfect co-founder based on skills, interests, and complementary 
                    expertise using our matching algorithm.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6">
              <div className="card feature-card h-100">
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-calculator fa-3x text-info"></i>
                  </div>
                  <h5 className="card-title">Financial Projections</h5>
                  <p className="card-text">
                    Generate realistic financial models and projections to attract investors 
                    and plan your business growth.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6">
              <div className="card feature-card h-100">
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-flask fa-3x text-danger"></i>
                  </div>
                  <h5 className="card-title">Validation Experiments</h5>
                  <p className="card-text">
                    Get AI-suggested experiments to validate your assumptions and test 
                    your business model before scaling.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6">
              <div className="card feature-card h-100">
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-presentation fa-3x text-secondary"></i>
                  </div>
                  <h5 className="card-title">Pitch Deck Generator</h5>
                  <p className="card-text">
                    Automatically generate professional pitch decks tailored to your 
                    business model and target investors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Simple steps to transform your idea into a startup
            </p>
          </div>
          
          <div className="row">
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="text-center">
                <div className="progress-step">
                  <div className="step-number">1</div>
                  <div>
                    <h5>Submit Your Idea</h5>
                    <p className="text-muted">Share your raw idea via text, voice, or image</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="text-center">
                <div className="progress-step">
                  <div className="step-number">2</div>
                  <div>
                    <h5>AI Analysis</h5>
                    <p className="text-muted">Our AI refines and validates your concept</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="text-center">
                <div className="progress-step">
                  <div className="step-number">3</div>
                  <div>
                    <h5>Build & Validate</h5>
                    <p className="text-muted">Create business models and run experiments</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="text-center">
                <div className="progress-step">
                  <div className="step-number">4</div>
                  <div>
                    <h5>Launch & Scale</h5>
                    <p className="text-muted">Find co-founders and pitch to investors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="section-title">Ready to Launch Your Startup?</h2>
              <p className="section-subtitle">
                Join thousands of students who have transformed their ideas into successful startups
              </p>
              <div className="d-flex gap-3 justify-content-center">
                {user ? (
                  <>
                    <Link to="/dashboard" className="btn btn-primary btn-lg">
                      <i className="fas fa-tachometer-alt me-2"></i>
                      Go to Dashboard
                    </Link>
                    <Link to="/idea-input" className="btn btn-outline-primary btn-lg">
                      <i className="fas fa-lightbulb me-2"></i>
                      Submit Idea
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/get-started" className="btn btn-primary btn-lg">
                      <i className="fas fa-rocket me-2"></i>
                      Get Started Now
                    </Link>
                    <Link to="/login" className="btn btn-outline-primary btn-lg">
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
