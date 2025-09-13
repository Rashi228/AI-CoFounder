import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MarketResearch = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [businessPlan, setBusinessPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load the business plan from localStorage
    const storedBusinessPlan = localStorage.getItem('currentBusinessPlan');
    if (storedBusinessPlan) {
      const businessPlanData = JSON.parse(storedBusinessPlan);
      setBusinessPlan(businessPlanData);
    }
    setLoading(false);
  }, []);

  // Generate market data from AI-generated business plan data
  const getMarketData = () => {
    if (!businessPlan) return null;
    
    // Use AI-generated market research data
    const marketSize = businessPlan.marketResearch?.marketSize || businessPlan.pitchDeckSummary?.marketSize || 'Market analysis in progress...';
    const competitors = businessPlan.marketResearch?.competitors || businessPlan.leanCanvas?.keyPartners?.slice(0, 3) || [
      'Direct competitors being analyzed',
      'Market leaders in this space',
      'Emerging competitors'
    ];
    const trends = businessPlan.marketResearch?.trends || businessPlan.leanCanvas?.valuePropositions?.slice(0, 3) || [
      'Market trends being analyzed',
      'Industry growth patterns',
      'Technology adoption rates'
    ];
    
    return {
      size: {
        current: marketSize,
        projected: 'AI-generated projections',
        unit: 'USD',
        growth: 'AI-analyzed growth rate'
      },
      competitors: competitors,
      trends: trends,
      customerSegments: businessPlan.customerPersona ? [businessPlan.customerPersona] : []
    };
  };

  const marketData = getMarketData();

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4>Loading market research...</h4>
            <p className="text-muted">AI is analyzing market data for your startup idea</p>
          </div>
        </div>
      </div>
    );
  }

  if (!marketData) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 text-center">
            <div className="alert alert-warning" role="alert">
              <h4>No Business Plan Found</h4>
              <p>Please generate a business plan first by submitting your idea.</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/submit-idea')}
              >
                Submit Your Idea
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="row">
      <div className="col-lg-8">
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Market Size Analysis</h5>
            <div className="row">
              <div className="col-md-4">
                <div className="text-center">
                  <div className="stat-number text-primary">
                    {marketData.size.current.includes('$') ? marketData.size.current : `$${marketData.size.current}`}
                  </div>
                  <p className="text-muted">Market Size</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center">
                  <div className="stat-number text-success">{marketData.size.projected}</div>
                  <p className="text-muted">Projected Growth</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center">
                  <div className="stat-number text-warning">{marketData.size.growth}</div>
                  <p className="text-muted">Growth Analysis</p>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div className="progress">
                <div 
                  className="progress-bar bg-gradient" 
                  role="progressbar" 
                  style={{ width: '60%' }}
                >
                  Market Growth Trajectory
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Key Market Trends</h5>
            <div className="row">
              {marketData.trends.map((trend, index) => (
                <div key={index} className="col-md-6 mb-3">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <h6 className="card-title mb-1">{trend}</h6>
                        <span className="badge bg-success">AI Generated</span>
                      </div>
                      <p className="card-text small text-muted">AI-analyzed market trend based on your startup idea and industry research</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Market Opportunity Score</h5>
            <div className="text-center mb-3">
              <div className="display-4 text-primary">8.2/10</div>
              <p className="text-muted">High Opportunity</p>
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <span>Market Size</span>
                <span className="text-success">9/10</span>
              </div>
              <div className="progress mb-2" style={{ height: '8px' }}>
                <div className="progress-bar bg-success" style={{ width: '90%' }}></div>
              </div>
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <span>Competition</span>
                <span className="text-warning">7/10</span>
              </div>
              <div className="progress mb-2" style={{ height: '8px' }}>
                <div className="progress-bar bg-warning" style={{ width: '70%' }}></div>
              </div>
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <span>Growth Potential</span>
                <span className="text-success">9/10</span>
              </div>
              <div className="progress mb-2" style={{ height: '8px' }}>
                <div className="progress-bar bg-success" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Quick Insights</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="fas fa-check-circle text-success me-2"></i>
                Large, growing market
              </li>
              <li className="mb-2">
                <i className="fas fa-check-circle text-success me-2"></i>
                Underserved student segment
              </li>
              <li className="mb-2">
                <i className="fas fa-exclamation-triangle text-warning me-2"></i>
                Moderate competition
              </li>
              <li className="mb-2">
                <i className="fas fa-check-circle text-success me-2"></i>
                Strong growth trends
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompetitors = () => (
    <div className="row">
      {marketData.competitors.map((competitor, index) => (
        <div key={index} className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="card-title">{competitor}</h5>
                <span className="badge bg-success">AI Generated</span>
              </div>
              
              <div className="mb-3">
                <h6 className="text-success">AI Analysis</h6>
                <ul className="list-unstyled">
                  <li className="mb-1">
                    <i className="fas fa-robot text-success me-2"></i>
                    AI-identified competitor in your market space
                  </li>
                  <li className="mb-1">
                    <i className="fas fa-robot text-success me-2"></i>
                    Market positioning analyzed by AI
                  </li>
                  <li className="mb-1">
                    <i className="fas fa-robot text-success me-2"></i>
                    Competitive landscape mapped by AI
                  </li>
                </ul>
              </div>
              
              <div className="mb-3">
                <h6 className="text-info">Recommended Actions</h6>
                <ul className="list-unstyled">
                  <li className="mb-1">
                    <i className="fas fa-search text-info me-2"></i>
                    Research this competitor's pricing and features
                  </li>
                  <li className="mb-1">
                    <i className="fas fa-chart-line text-info me-2"></i>
                    Analyze their market positioning and strategy
                  </li>
                  <li className="mb-1">
                    <i className="fas fa-lightbulb text-info me-2"></i>
                    Identify differentiation opportunities
                  </li>
                </ul>
              </div>
              
              <div className="mt-auto">
                <div className="alert alert-success">
                  <small>
                    <i className="fas fa-robot me-1"></i>
                    AI-generated competitive intelligence - use this as a starting point for deeper research
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCustomers = () => (
    <div className="row">
      {marketData.customerSegments.map((segment, index) => (
        <div key={index} className="col-lg-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">{segment.segment}</h5>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Market Size</span>
                  <span className="fw-bold">{segment.size}</span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Willingness to Pay</span>
                  <span className={`badge ${
                    segment.willingness === 'High' ? 'bg-success' : 
                    segment.willingness === 'Medium' ? 'bg-warning' : 'bg-danger'
                  }`}>
                    {segment.willingness}
                  </span>
                </div>
              </div>
              
              <div>
                <h6>Key Pain Points:</h6>
                <ul className="list-unstyled">
                  {segment.painPoints.map((point, i) => (
                    <li key={i} className="mb-1">
                      <i className="fas fa-circle text-primary me-2" style={{ fontSize: '6px' }}></i>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold mb-3">
              Market <span className="text-gradient">Research Dashboard</span>
            </h1>
            <p className="lead">
              Comprehensive market analysis for your startup idea
            </p>
          </div>

          {/* Navigation Tabs */}
          <ul className="nav nav-tabs mb-4" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="fas fa-chart-pie me-2"></i>
                Overview
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'competitors' ? 'active' : ''}`}
                onClick={() => setActiveTab('competitors')}
              >
                <i className="fas fa-users me-2"></i>
                Competitors
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'customers' ? 'active' : ''}`}
                onClick={() => setActiveTab('customers')}
              >
                <i className="fas fa-user-friends me-2"></i>
                Customer Segments
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'competitors' && renderCompetitors()}
            {activeTab === 'customers' && renderCustomers()}
          </div>

          {/* Action Buttons */}
          <div className="text-center mt-5">
            <button
              className="btn btn-primary btn-lg me-3"
              onClick={() => navigate('/business-models')}
            >
              <i className="fas fa-arrow-right me-2"></i>
              Continue to Business Models
            </button>
            <button className="btn btn-outline-primary btn-lg">
              <i className="fas fa-download me-2"></i>
              Download Report
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-5">
            <div className="progress" style={{ height: '8px' }}>
              <div
                className="progress-bar bg-primary"
                role="progressbar"
                style={{ width: '60%' }}
                aria-valuenow="60"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <div className="d-flex justify-content-between mt-2">
              <small className="text-muted">Submit Idea</small>
              <small className="text-muted">Problem Refinement</small>
              <small className="text-primary fw-bold">Market Research</small>
              <small className="text-muted">Business Model</small>
              <small className="text-muted">Pitch Deck</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketResearch;
