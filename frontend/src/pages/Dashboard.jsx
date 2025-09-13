import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDashboardData();
      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4>Loading your dashboard...</h4>
            <p className="text-muted">Fetching your startup journey data</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 text-center">
            <div className="alert alert-danger" role="alert">
              <h4>Error Loading Dashboard</h4>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={fetchDashboardData}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { stats, recentActivity, nextSteps, currentBusinessPlan, totalBusinessPlans } = dashboardData || {};

  const renderOverview = () => (
    <div className="row">
      <div className="col-lg-8">
        {/* Progress Overview */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title mb-4">
              <i className="fas fa-chart-line me-2"></i>
              Startup Journey Progress
            </h5>
            <div className="row">
              <div className="col-md-3 mb-3">
                <div className="text-center">
                  <div className={`rounded-circle d-inline-flex align-items-center justify-content-center ${
                    stats?.ideasSubmitted > 0 ? 'bg-success text-white' : 'bg-light text-muted'
                  }`} style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-lightbulb fa-lg"></i>
                  </div>
                  <div className="mt-2">
                    <div className="fw-bold">Idea Submitted</div>
                    <div className="text-muted small">Step 1</div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3 mb-3">
                <div className="text-center">
                  <div className={`rounded-circle d-inline-flex align-items-center justify-content-center ${
                    stats?.problemRefined > 0 ? 'bg-success text-white' : 'bg-light text-muted'
                  }`} style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-cogs fa-lg"></i>
                  </div>
                  <div className="mt-2">
                    <div className="fw-bold">Problem Refined</div>
                    <div className="text-muted small">Step 2</div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3 mb-3">
                <div className="text-center">
                  <div className={`rounded-circle d-inline-flex align-items-center justify-content-center ${
                    stats?.marketResearch > 0 ? 'bg-success text-white' : 'bg-light text-muted'
                  }`} style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-chart-bar fa-lg"></i>
                  </div>
                  <div className="mt-2">
                    <div className="fw-bold">Market Research</div>
                    <div className="text-muted small">Step 3</div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3 mb-3">
                <div className="text-center">
                  <div className={`rounded-circle d-inline-flex align-items-center justify-content-center ${
                    stats?.pitchDeck > 0 ? 'bg-success text-white' : 'bg-light text-muted'
                  }`} style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-presentation fa-lg"></i>
                  </div>
                  <div className="mt-2">
                    <div className="fw-bold">Pitch Deck</div>
                    <div className="text-muted small">Step 7</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title mb-4">
              <i className="fas fa-clock me-2"></i>
              Recent Activity
            </h5>
            {recentActivity && recentActivity.length > 0 ? (
              <div className="list-group list-group-flush">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div className={`me-3 ${
                        activity.type === 'idea' ? 'text-warning' :
                        activity.type === 'research' ? 'text-info' :
                        activity.type === 'experiment' ? 'text-primary' : 'text-success'
                      }`}>
                        <i className={`fas fa-${
                          activity.type === 'idea' ? 'lightbulb' :
                          activity.type === 'research' ? 'chart-bar' :
                          activity.type === 'experiment' ? 'flask' : 'users'
                        }`}></i>
                      </div>
                      <div>
                        <div className="fw-bold">{activity.title}</div>
                        <small className="text-muted">{activity.date}</small>
                      </div>
                    </div>
                    <span className={`badge ${
                      activity.status === 'completed' ? 'bg-success' :
                      activity.status === 'in-progress' ? 'bg-warning' : 'bg-secondary'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <i className="fas fa-clock fa-3x text-muted mb-3"></i>
                <p className="text-muted">No recent activity. Start by submitting your first idea!</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/idea-input')}
                >
                  Submit Your First Idea
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="card">
          <div className="card-body">
            <h5 className="card-title mb-4">
              <i className="fas fa-tasks me-2"></i>
              Next Steps
            </h5>
            {nextSteps && nextSteps.length > 0 ? (
              nextSteps.map((step) => (
                <div key={step.id} className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="card-title mb-0">{step.title}</h6>
                      <span className={`badge ${
                        step.priority === 'high' ? 'bg-danger' :
                        step.priority === 'medium' ? 'bg-warning' : 'bg-info'
                      }`}>
                        {step.priority}
                      </span>
                    </div>
                    <p className="card-text text-muted small">{step.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">Due: {step.dueDate}</small>
                      <div className="d-flex align-items-center">
                        <div className="progress me-2" style={{ width: '100px', height: '6px' }}>
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${step.progress}%` }}
                          ></div>
                        </div>
                        <small className="text-muted">{step.progress}%</small>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
                <p className="text-muted">All steps completed! Great job on your startup journey!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        {/* Quick Stats */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title mb-4">
              <i className="fas fa-chart-pie me-2"></i>
              Quick Stats
            </h5>
            <div className="row text-center">
              <div className="col-6 mb-3">
                <div className="stat-number text-primary">{stats?.ideasSubmitted || 0}</div>
                <p className="text-muted small">Ideas Submitted</p>
              </div>
              <div className="col-6 mb-3">
                <div className="stat-number text-success">{stats?.experiments || 0}</div>
                <p className="text-muted small">Experiments</p>
              </div>
              <div className="col-6 mb-3">
                <div className="stat-number text-warning">{stats?.cofounders || 0}</div>
                <p className="text-muted small">Co-Founders</p>
              </div>
              <div className="col-6 mb-3">
                <div className="stat-number text-info">{currentBusinessPlan?.marketScore || 0}/10</div>
                <p className="text-muted small">Market Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title mb-4">
              <i className="fas fa-bolt me-2"></i>
              Quick Actions
            </h5>
            <div className="d-grid gap-2">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/idea-input')}
              >
                <i className="fas fa-plus me-2"></i>
                Submit New Idea
              </button>
              <button 
                className="btn btn-outline-primary"
                onClick={() => navigate('/problem-refinement')}
              >
                <i className="fas fa-cogs me-2"></i>
                Refine Problem
              </button>
              <button 
                className="btn btn-outline-primary"
                onClick={() => navigate('/market-research')}
              >
                <i className="fas fa-chart-bar me-2"></i>
                Market Research
              </button>
              <button 
                className="btn btn-outline-primary"
                onClick={() => navigate('/cofounder-matching')}
              >
                <i className="fas fa-users me-2"></i>
                Find Co-Founders
              </button>
            </div>
          </div>
        </div>

        {/* Business Model Summary */}
        <div className="card">
          <div className="card-body">
            <h5 className="card-title mb-4">
              <i className="fas fa-briefcase me-2"></i>
              Business Model
            </h5>
            <div className="text-center">
              <div className="stat-number text-primary">{currentBusinessPlan?.businessModel || 'TBD'}</div>
              <p className="text-muted">Current Model</p>
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={() => navigate('/business-models')}
              >
                {currentBusinessPlan?.businessModel ? 'Change Model' : 'Define Model'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIdeas = () => (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="card-title mb-0">Your Startup Ideas ({totalBusinessPlans || 0})</h5>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/idea-input')}
              >
                <i className="fas fa-plus me-2"></i>
                Add New Idea
              </button>
            </div>
            
            {currentBusinessPlan ? (
              <div className="row">
                <div className="col-lg-6 mb-4">
                  <div className="card border-primary">
                    <div className="card-body">
                      <h6 className="card-title">{currentBusinessPlan.idea}</h6>
                      <p className="card-text text-muted">
                        {currentBusinessPlan.idea} - Your latest startup idea
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span className={`badge me-2 ${
                            currentBusinessPlan.status === 'completed' ? 'bg-success' : 'bg-warning'
                          }`}>
                            {currentBusinessPlan.status || 'In Progress'}
                          </span>
                          <span className="badge bg-primary">
                            {currentBusinessPlan.businessModel || 'TBD'}
                          </span>
                        </div>
                        <button 
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => navigate('/problem-refinement')}
                        >
                          View Details
                        </button>
                      </div>
                      <div className="mt-3">
                        <div className="d-flex justify-content-between">
                          <small className="text-muted">Progress</small>
                          <small className="text-muted">{currentBusinessPlan.progress || 0}%</small>
                        </div>
                        <div className="progress" style={{ height: '6px' }}>
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${currentBusinessPlan.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="fas fa-lightbulb fa-3x text-muted mb-3"></i>
                <h5>No Ideas Yet</h5>
                <p className="text-muted">Start your startup journey by submitting your first business idea!</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/idea-input')}
                >
                  <i className="fas fa-plus me-2"></i>
                  Submit Your First Idea
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="row">
      <div className="col-lg-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Market Research Score</h5>
            <div className="text-center">
              <div className="stat-number text-primary">{currentBusinessPlan?.marketScore || 0}/10</div>
              <p className="text-muted">Overall Market Score</p>
              <div className="progress">
                <div className="progress-bar" style={{ width: `${(currentBusinessPlan?.marketScore || 0) * 10}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-lg-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Validation Progress</h5>
            <div className="text-center">
              <div className="stat-number text-success">{stats?.experiments || 0}</div>
              <p className="text-muted">Experiments Completed</p>
              <div className="progress">
                <div className="progress-bar bg-success" style={{ width: `${Math.min((stats?.experiments || 0) * 20, 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-lg-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Overall Progress</h5>
            <div className="text-center">
              <div className="stat-number text-info">{currentBusinessPlan?.progress || 0}%</div>
              <p className="text-muted">Startup Journey Completion</p>
              <div className="progress">
                <div className="progress-bar bg-info" style={{ width: `${currentBusinessPlan?.progress || 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-lg-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Business Plans</h5>
            <div className="text-center">
              <div className="stat-number text-warning">{totalBusinessPlans || 0}</div>
              <p className="text-muted">Total Ideas Submitted</p>
              <div className="progress">
                <div className="progress-bar bg-warning" style={{ width: `${Math.min((totalBusinessPlans || 0) * 25, 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h1 className="display-5 fw-bold mb-2">
                Welcome to Your <span className="text-gradient">Dashboard</span>
              </h1>
              <p className="lead text-muted">
                Track your startup journey and manage your ideas
              </p>
            </div>
            <div>
              <button 
                className="btn btn-outline-primary btn-lg me-2"
                onClick={fetchDashboardData}
                disabled={loading}
              >
                <i className={`fas fa-sync-alt me-2 ${loading ? 'fa-spin' : ''}`}></i>
                Refresh
              </button>
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/idea-input')}
              >
                <i className="fas fa-plus me-2"></i>
                New Project
              </button>
            </div>
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
                className={`nav-link ${activeTab === 'ideas' ? 'active' : ''}`}
                onClick={() => setActiveTab('ideas')}
              >
                <i className="fas fa-lightbulb me-2"></i>
                Ideas
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                <i className="fas fa-chart-line me-2"></i>
                Analytics
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'ideas' && renderIdeas()}
            {activeTab === 'analytics' && renderAnalytics()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
