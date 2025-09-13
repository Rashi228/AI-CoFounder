// TEMPORARILY COMMENTED OUT - Validation Experiments Page
// This page has been temporarily disabled as requested
// Original code preserved below for future restoration

/*
ORIGINAL VALIDATION EXPERIMENTS CODE - PRESERVED FOR FUTURE RESTORATION

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ValidationExperiments = () => {
  const [selectedExperiments, setSelectedExperiments] = useState([]);
  const [activeTab, setActiveTab] = useState('experiments');
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

  const getExperiments = () => {
    if (!businessPlan?.validation) return [];
    
    return [
      {
        id: 'landing-page',
        name: 'AI-Generated Landing Page Test',
        description: `Test demand using AI-generated landing page: "${businessPlan.validation.landingPage?.headline || 'Your Solution'}"`,
        duration: '1-2 weeks',
        cost: 'Low',
        difficulty: 'Easy',
        metrics: ['Email signups', 'Page views', 'Conversion rate'],
        steps: [
          `Use AI-generated headline: "${businessPlan.validation.landingPage?.headline || 'Your Solution'}"`,
          `Use AI-generated subheading: "${businessPlan.validation.landingPage?.subheading || 'Your Value Proposition'}"`,
          `Use AI-generated CTA: "${businessPlan.validation.landingPage?.callToAction || 'Get Started'}"`,
          'Drive traffic via social media and measure conversion rates'
        ]
      },
      {
        id: 'survey-test',
        name: 'AI-Generated Survey Test',
        description: 'Validate your idea using AI-generated survey questions',
        duration: '1-2 weeks',
        cost: 'Low',
        difficulty: 'Easy',
        metrics: ['Response rate', 'Problem validation', 'Feature priorities'],
        steps: [
          'Use AI-generated survey questions',
          'Distribute via social media and email',
          'Analyze responses for validation insights',
          'Iterate based on feedback'
        ]
      },
      {
        id: 'ad-campaign',
        name: 'AI-Generated Ad Campaign Test',
        description: 'Test market demand using AI-generated ad copy and keywords',
        duration: '1-2 weeks',
        cost: 'Medium',
        difficulty: 'Medium',
        metrics: ['Click-through rate', 'Cost per click', 'Conversion rate'],
        steps: [
          `Use AI-generated ad copy: "${businessPlan.validation.adCampaign?.adCopy || 'Your Ad Copy'}"`,
          `Target AI-generated keywords: ${businessPlan.validation.adCampaign?.keywords?.join(', ') || 'Your Keywords'}`,
          'Set up Google/Facebook ads with small budget',
          'Measure performance and iterate'
        ]
      },
      {
        id: 'customer-interviews',
        name: 'Customer Interviews',
        description: 'Conduct interviews using AI-generated questions',
        duration: '2-3 weeks',
        cost: 'Low',
        difficulty: 'Easy',
        metrics: ['Problem validation', 'Feature priorities', 'Willingness to pay'],
        steps: [
          `Target: ${businessPlan.customerPersona?.name || 'Your Target Customer'}`,
          'Use AI-generated survey questions as interview guide',
          'Find and schedule interviews',
          'Analyze and document insights'
        ]
      },
      {
        id: 'concierge-test',
        name: 'Concierge MVP',
        description: 'Manually deliver your service to test the process',
        duration: '2-4 weeks',
        cost: 'Low',
        difficulty: 'Easy',
        metrics: ['Customer satisfaction', 'Process efficiency', 'Value delivery'],
        steps: [
          'Define manual process based on AI analysis',
          'Find 10-20 customers using AI-generated persona',
          'Deliver service manually',
          'Document learnings and iterate'
        ]
      },
      {
        id: 'pricing-test',
        name: 'Pricing Experiment',
        description: 'Test different pricing models based on AI revenue analysis',
        duration: '1-2 weeks',
        cost: 'Low',
        difficulty: 'Easy',
        metrics: ['Price sensitivity', 'Conversion rates', 'Revenue per user'],
        steps: [
          'Use AI-generated revenue streams for pricing options',
          'A/B test different prices',
          'Survey willingness to pay',
          'Analyze optimal pricing'
        ]
      }
    ];
  };

  const experiments = getExperiments();

  const handleExperimentSelect = (experimentId) => {
    setSelectedExperiments(prev => 
      prev.includes(experimentId) 
        ? prev.filter(id => id !== experimentId)
        : [...prev, experimentId]
    );
  };

  const renderExperimentCard = (experiment) => (
    <div key={experiment.id} className="col-lg-6 mb-4">
      <div 
        className={`card h-100 ${selectedExperiments.includes(experiment.id) ? 'border-primary shadow' : ''}`}
        style={{ cursor: 'pointer' }}
        onClick={() => handleExperimentSelect(experiment.id)}
      >
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h5 className="card-title">{experiment.name}</h5>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={selectedExperiments.includes(experiment.id)}
                onChange={() => handleExperimentSelect(experiment.id)}
              />
            </div>
          </div>
          
          <p className="card-text text-muted mb-3">{experiment.description}</p>
          
          <div className="row mb-3">
            <div className="col-4">
              <div className="text-center">
                <div className="small text-muted">Duration</div>
                <div className="fw-bold">{experiment.duration}</div>
              </div>
            </div>
            <div className="col-4">
              <div className="text-center">
                <div className="small text-muted">Cost</div>
                <div className={`fw-bold ${
                  experiment.cost === 'Low' ? 'text-success' :
                  experiment.cost === 'Medium' ? 'text-warning' : 'text-danger'
                }`}>
                  {experiment.cost}
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="text-center">
                <div className="small text-muted">Difficulty</div>
                <div className={`fw-bold ${
                  experiment.difficulty === 'Easy' ? 'text-success' :
                  experiment.difficulty === 'Medium' ? 'text-warning' : 'text-danger'
                }`}>
                  {experiment.difficulty}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-3">
            <h6 className="small">Key Metrics:</h6>
            <div className="d-flex flex-wrap gap-1">
              {experiment.metrics.map((metric, index) => (
                <span key={index} className="badge bg-light text-dark small">
                  {metric}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExperimentPlan = () => {
    const selectedExperimentData = experiments.filter(exp => selectedExperiments.includes(exp.id));
    
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-4">
            <i className="fas fa-clipboard-list me-2"></i>
            Your Validation Plan
          </h5>
          
          {selectedExperimentData.length === 0 ? (
            <div className="text-center py-4">
              <i className="fas fa-clipboard fa-3x text-muted mb-3"></i>
              <p className="text-muted">Select experiments above to build your validation plan</p>
            </div>
          ) : (
            <div className="row">
              {selectedExperimentData.map((experiment, index) => (
                <div key={experiment.id} className="col-lg-6 mb-4">
                  <div className="card border-primary">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h6 className="card-title">{experiment.name}</h6>
                        <span className="badge bg-primary">Week {index + 1}</span>
                      </div>
                      
                      <h6 className="small">Steps:</h6>
                      <ol className="small">
                        {experiment.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="mb-1">{step}</li>
                        ))}
                      </ol>
                      
                      <div className="d-flex justify-content-between">
                        <small className="text-muted">Duration: {experiment.duration}</small>
                        <small className="text-muted">Cost: {experiment.cost}</small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTemplates = () => (
    <div className="row">
      <div className="col-lg-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">
              <i className="fas fa-file-alt me-2"></i>
              Interview Script Template
            </h5>
            <p className="card-text">Use this template for customer interviews</p>
            <div className="alert alert-light">
              <h6>Opening Questions:</h6>
              <ul className="mb-0 small">
                <li>Tell me about your current process for [problem area]</li>
                <li>What's the biggest challenge you face?</li>
                <li>How do you currently solve this problem?</li>
              </ul>
            </div>
            <button className="btn btn-outline-primary btn-sm">
              <i className="fas fa-download me-1"></i>
              Download Template
            </button>
          </div>
        </div>
      </div>
      
      <div className="col-lg-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">
              <i className="fas fa-chart-bar me-2"></i>
              Metrics Tracking Sheet
            </h5>
            <p className="card-text">Track your experiment results</p>
            <div className="alert alert-light">
              <h6>Key Metrics:</h6>
              <ul className="mb-0 small">
                <li>Conversion rates</li>
                <li>User engagement</li>
                <li>Customer feedback scores</li>
                <li>Cost per acquisition</li>
              </ul>
            </div>
            <button className="btn btn-outline-primary btn-sm">
              <i className="fas fa-download me-1"></i>
              Download Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4>Loading validation experiments...</h4>
            <p className="text-muted">AI is generating personalized validation strategies for your idea</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold mb-3">
              Validation <span className="text-gradient">Experiments</span>
            </h1>
            <p className="lead">
              Test your assumptions before building your full product
            </p>
          </div>

          <ul className="nav nav-tabs mb-4" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'experiments' ? 'active' : ''}`}
                onClick={() => setActiveTab('experiments')}
              >
                <i className="fas fa-flask me-2"></i>
                Experiments
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'plan' ? 'active' : ''}`}
                onClick={() => setActiveTab('plan')}
              >
                <i className="fas fa-clipboard-list me-2"></i>
                My Plan
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'templates' ? 'active' : ''}`}
                onClick={() => setActiveTab('templates')}
              >
                <i className="fas fa-file-alt me-2"></i>
                Templates
              </button>
            </li>
          </ul>

          <div className="tab-content">
            {activeTab === 'experiments' && (
              <div className="row">
                {experiments.map(renderExperimentCard)}
              </div>
            )}
            
            {activeTab === 'plan' && renderExperimentPlan()}
            
            {activeTab === 'templates' && renderTemplates()}
          </div>

          <div className="text-center mt-5">
            <button
              className="btn btn-primary btn-lg me-3"
              onClick={() => navigate('/cofounder-matching')}
            >
              <i className="fas fa-arrow-right me-2"></i>
              Continue to Co-Founder Matching
            </button>
            <button className="btn btn-outline-primary btn-lg">
              <i className="fas fa-save me-2"></i>
              Save Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationExperiments;
*/

// TEMPORARY PLACEHOLDER - Validation Experiments Page is temporarily disabled
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ValidationExperiments = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 text-center">
          <div className="card">
            <div className="card-body py-5">
              <i className="fas fa-tools fa-3x text-muted mb-4"></i>
              <h2 className="mb-3">Validation Experiments</h2>
              <p className="text-muted mb-4">
                This page is temporarily disabled for maintenance and updates.
              </p>
              <p className="text-muted mb-4">
                The Validation Experiments tool will be back soon with enhanced features!
              </p>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/cofounder-matching')}
              >
                <i className="fas fa-arrow-right me-2"></i>
                Continue to Co-Founder Matching
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationExperiments;