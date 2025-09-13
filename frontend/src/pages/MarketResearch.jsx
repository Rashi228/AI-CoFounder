import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const MarketResearch = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [businessPlan, setBusinessPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [marketData, setMarketData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load the business plan from localStorage
    const storedBusinessPlan = localStorage.getItem('currentBusinessPlan');
    if (storedBusinessPlan) {
      const businessPlanData = JSON.parse(storedBusinessPlan);
      setBusinessPlan(businessPlanData);
      
      // Load existing market research if available
      if (businessPlanData.marketResearchData) {
        setMarketData(businessPlanData.marketResearchData);
      }
    }
    setLoading(false);
  }, []);

  const generateMarketResearch = async () => {
    if (!businessPlan?._id) {
      setError('No business plan found. Please generate a business plan first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiService.generateMarketResearch(businessPlan._id);
      if (response.success) {
        setMarketData(response.data);
        // Update localStorage
        const updatedBusinessPlan = { ...businessPlan, marketResearchData: response.data };
        localStorage.setItem('currentBusinessPlan', JSON.stringify(updatedBusinessPlan));
        setBusinessPlan(updatedBusinessPlan);
      }
    } catch (error) {
      console.error('Error generating market research:', error);
      setError('Failed to generate market research. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    if (!businessPlan?._id) {
      setError('No business plan found. Please generate a business plan first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiService.exportBusinessPlan(businessPlan._id, 'pdf');
      if (response.success) {
        // Create a blob and download the report
        const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `market-research-report-${businessPlan.idea?.replace(/\s+/g, '-').toLowerCase() || 'report'}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      setError('Failed to download report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Use backend-generated market data or show loading state
  const getMarketData = () => {
    if (marketData) return marketData;
    return null; // Don't show fallback data, let user generate it
  };

  const currentMarketData = getMarketData();

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

  if (!businessPlan) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 text-center">
            <div className="alert alert-warning" role="alert">
              <h4>No Business Plan Found</h4>
              <p>Please generate a business plan first by submitting your idea.</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/idea-input')}
              >
                Submit Your Idea
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentMarketData) {
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

            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <div className="card">
                  <div className="card-body py-5">
                    <i className="fas fa-chart-line fa-4x text-primary mb-4"></i>
                    <h4>Generate Market Research</h4>
                    <p className="text-muted mb-4">
                      Get comprehensive market analysis including competitors, trends, customer segments, and opportunity scores for your startup idea.
                    </p>
                    <button 
                      className="btn btn-primary btn-lg"
                      onClick={generateMarketResearch}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Generating Market Research...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-chart-line me-2"></i>
                          Generate Market Research
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="alert alert-danger mt-4" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}
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
                    {currentMarketData.marketSize.current.includes('$') ? currentMarketData.marketSize.current : `$${currentMarketData.marketSize.current}`}
                  </div>
                  <p className="text-muted">Market Size</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center">
                  <div className="stat-number text-success">{currentMarketData.marketSize.projected}</div>
                  <p className="text-muted">Projected Growth</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center">
                  <div className="stat-number text-warning">{currentMarketData.marketSize.growth}</div>
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
              {currentMarketData.trends.map((trend, index) => (
                <div key={index} className="col-md-6 mb-3">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <h6 className="card-title mb-1">{trend.name}</h6>
                        <span className="badge bg-success">AI Generated</span>
                      </div>
                      <p className="card-text small text-muted">{trend.description}</p>
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
              <div className="display-4 text-primary">{currentMarketData.opportunityScore.overall}/10</div>
              <p className="text-muted">High Opportunity</p>
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <span>Market Size</span>
                <span className="text-success">{currentMarketData.opportunityScore.marketSize}/10</span>
              </div>
              <div className="progress mb-2" style={{ height: '8px' }}>
                <div className="progress-bar bg-success" style={{ width: `${currentMarketData.opportunityScore.marketSize * 10}%` }}></div>
              </div>
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <span>Competition</span>
                <span className="text-warning">{currentMarketData.opportunityScore.competition}/10</span>
              </div>
              <div className="progress mb-2" style={{ height: '8px' }}>
                <div className="progress-bar bg-warning" style={{ width: `${currentMarketData.opportunityScore.competition * 10}%` }}></div>
              </div>
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <span>Growth Potential</span>
                <span className="text-success">{currentMarketData.opportunityScore.growth}/10</span>
              </div>
              <div className="progress mb-2" style={{ height: '8px' }}>
                <div className="progress-bar bg-success" style={{ width: `${currentMarketData.opportunityScore.growth * 10}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Quick Insights</h5>
            {currentMarketData?.insights ? (
              <ul className="list-unstyled">
                {currentMarketData.insights.map((insight, index) => (
                  <li key={index} className="mb-2">
                    <i className={`fas ${
                      insight.toLowerCase().includes('large') || insight.toLowerCase().includes('growing') || insight.toLowerCase().includes('strong') ? 'fa-check-circle text-success' :
                      insight.toLowerCase().includes('moderate') || insight.toLowerCase().includes('competition') ? 'fa-exclamation-triangle text-warning' :
                      'fa-info-circle text-info'
                    } me-2`}></i>
                    {insight}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-3">
                <i className="fas fa-chart-line fa-2x text-muted mb-2"></i>
                <p className="text-muted small">Generate market research to see insights</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompetitors = () => (
    <div className="row">
      {currentMarketData.competitors.map((competitor, index) => (
        <div key={index} className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="card-title">{competitor.name}</h5>
                <span className="badge bg-success">AI Generated</span>
              </div>
              
              <div className="mb-3">
                <h6 className="text-success">AI Analysis</h6>
                <p className="text-muted small">{competitor.analysis}</p>
              </div>
              
              <div className="mb-3">
                <h6 className="text-info">Strengths</h6>
                <ul className="list-unstyled">
                  {competitor.strengths.map((strength, i) => (
                    <li key={i} className="mb-1">
                      <i className="fas fa-check text-success me-2"></i>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-3">
                <h6 className="text-warning">Weaknesses</h6>
                <ul className="list-unstyled">
                  {competitor.weaknesses.map((weakness, i) => (
                    <li key={i} className="mb-1">
                      <i className="fas fa-times text-danger me-2"></i>
                      {weakness}
                    </li>
                  ))}
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

  const renderCustomers = () => {
    if (!currentMarketData?.customerSegments) {
      return (
        <div className="text-center py-5">
          <i className="fas fa-user-friends fa-3x text-muted mb-3"></i>
          <h5>No Customer Segments Data</h5>
          <p className="text-muted">Generate market research to see detailed customer segment analysis</p>
          <button 
            className="btn btn-primary"
            onClick={generateMarketResearch}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Generating...
              </>
            ) : (
              <>
                <i className="fas fa-chart-line me-2"></i>
                Generate Market Research
              </>
            )}
          </button>
        </div>
      );
    }

    return (
      <div className="row">
        {currentMarketData.customerSegments.map((segment, index) => (
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
  };

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

          {/* Error Display */}
          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="text-center mt-5">
            <button
              className="btn btn-primary btn-lg me-3"
              onClick={() => navigate('/business-models')}
            >
              <i className="fas fa-arrow-right me-2"></i>
              Continue to Business Models
            </button>
            <button 
              className="btn btn-outline-primary btn-lg me-3"
              onClick={generateMarketResearch}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Generating...
                </>
              ) : (
                <>
                  <i className="fas fa-chart-line me-2"></i>
                  Generate Market Research
                </>
              )}
            </button>
            <button 
              className="btn btn-outline-success btn-lg"
              onClick={downloadReport}
              disabled={loading || !currentMarketData}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Downloading...
                </>
              ) : (
                <>
                  <i className="fas fa-download me-2"></i>
                  Download Report
                </>
              )}
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
