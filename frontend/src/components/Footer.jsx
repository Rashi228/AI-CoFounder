import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <h5 className="text-white mb-3">
              <i className="fas fa-robot me-2 text-gradient"></i>
              AI-CoFounder
            </h5>
            <p className="text-light">
              The intelligent platform that transforms startup ideas into investment-ready ventures 
              with AI-powered tools and smart co-founder matching.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-light">
                <i className="fab fa-twitter fa-lg"></i>
              </a>
              <a href="#" className="text-light">
                <i className="fab fa-linkedin fa-lg"></i>
              </a>
              <a href="#" className="text-light">
                <i className="fab fa-github fa-lg"></i>
              </a>
            </div>
          </div>
          
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="text-white mb-3">Platform</h6>
            <ul className="list-unstyled">
              <li><Link to="/idea-input" className="text-light text-decoration-none">Submit Idea</Link></li>
              <li><Link to="/dashboard" className="text-light text-decoration-none">Dashboard</Link></li>
              <li><Link to="/cofounder-matching" className="text-light text-decoration-none">Find Co-Founders</Link></li>
              <li><Link to="/pitch-deck" className="text-light text-decoration-none">Pitch Deck</Link></li>
            </ul>
          </div>
          
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="text-white mb-3">Tools</h6>
            <ul className="list-unstyled">
              <li><Link to="/problem-refinement" className="text-light text-decoration-none">Problem Refinement</Link></li>
              <li><Link to="/market-research" className="text-light text-decoration-none">Market Research</Link></li>
              <li><Link to="/business-models" className="text-light text-decoration-none">Business Models</Link></li>
              <li><Link to="/financial-projections" className="text-light text-decoration-none">Financial Projections</Link></li>
            </ul>
          </div>
          
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="text-white mb-3">Resources</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light text-decoration-none">Documentation</a></li>
              <li><a href="#" className="text-light text-decoration-none">Tutorials</a></li>
              <li><a href="#" className="text-light text-decoration-none">API</a></li>
              <li><a href="#" className="text-light text-decoration-none">Support</a></li>
            </ul>
          </div>
          
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="text-white mb-3">Company</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light text-decoration-none">About</a></li>
              <li><a href="#" className="text-light text-decoration-none">Blog</a></li>
              <li><a href="#" className="text-light text-decoration-none">Careers</a></li>
              <li><a href="#" className="text-light text-decoration-none">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <hr className="my-4" />
        
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="text-light mb-0">
              © 2025 AI-CoFounder. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <a href="#" className="text-light text-decoration-none me-3">Privacy Policy</a>
            <a href="#" className="text-light text-decoration-none">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
