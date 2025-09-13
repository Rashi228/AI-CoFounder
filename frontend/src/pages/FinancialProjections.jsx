import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FinancialProjections = () => {
  const [projectionType, setProjectionType] = useState('conservative');
  const [timeframe, setTimeframe] = useState('3years');
  const navigate = useNavigate();

  const projections = {
    conservative: {
      year1: { users: 1000, revenue: 15000, expenses: 120000, profit: -105000 },
      year2: { users: 5000, revenue: 120000, expenses: 200000, profit: -80000 },
      year3: { users: 15000, revenue: 450000, expenses: 350000, profit: 100000 }
    },
    realistic: {
      year1: { users: 2000, revenue: 30000, expenses: 150000, profit: -120000 },
      year2: { users: 8000, revenue: 200000, expenses: 250000, profit: -50000 },
      year3: { users: 25000, revenue: 750000, expenses: 400000, profit: 350000 }
    },
    optimistic: {
      year1: { users: 5000, revenue: 75000, expenses: 200000, profit: -125000 },
      year2: { users: 15000, revenue: 450000, expenses: 300000, profit: 150000 },
      year3: { users: 40000, revenue: 1200000, expenses: 500000, profit: 700000 }
    }
  };

  const currentProjection = projections[projectionType];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderProjectionTable = () => (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title mb-4">
          <i className="fas fa-chart-line me-2"></i>
          Financial Projections ({projectionType.charAt(0).toUpperCase() + projectionType.slice(1)})
        </h5>
        
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Year</th>
                <th>Users</th>
                <th>Revenue</th>
                <th>Expenses</th>
                <th>Profit/Loss</th>
                <th>Growth Rate</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(currentProjection).map(([year, data], index) => (
                <tr key={year}>
                  <td className="fw-bold">Year {index + 1}</td>
                  <td>{data.users.toLocaleString()}</td>
                  <td className="text-success">{formatCurrency(data.revenue)}</td>
                  <td className="text-danger">{formatCurrency(data.expenses)}</td>
                  <td className={data.profit >= 0 ? 'text-success' : 'text-danger'}>
                    {formatCurrency(data.profit)}
                  </td>
                  <td>
                    {index === 0 ? 'N/A' : 
                     `${Math.round(((data.users - Object.values(currentProjection)[index-1].users) / Object.values(currentProjection)[index-1].users) * 100)}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderRevenueBreakdown = () => (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title mb-4">
          <i className="fas fa-pie-chart me-2"></i>
          Revenue Breakdown (Year 3)
        </h5>
        
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <span>Subscription Revenue</span>
                <span className="fw-bold">70%</span>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div className="progress-bar bg-primary" style={{ width: '70%' }}></div>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <span>Premium Features</span>
                <span className="fw-bold">20%</span>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div className="progress-bar bg-success" style={{ width: '20%' }}></div>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <span>Enterprise Sales</span>
                <span className="fw-bold">10%</span>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div className="progress-bar bg-warning" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <h6>Key Metrics</h6>
            <div className="row">
              <div className="col-6 mb-3">
                <div className="text-center">
                  <div className="stat-number text-primary">$30</div>
                  <p className="text-muted small">ARPU</p>
                </div>
              </div>
              <div className="col-6 mb-3">
                <div className="text-center">
                  <div className="stat-number text-success">5%</div>
                  <p className="text-muted small">Churn Rate</p>
                </div>
              </div>
              <div className="col-6 mb-3">
                <div className="text-center">
                  <div className="stat-number text-warning">$25</div>
                  <p className="text-muted small">CAC</p>
                </div>
              </div>
              <div className="col-6 mb-3">
                <div className="text-center">
                  <div className="stat-number text-info">3.2x</div>
                  <p className="text-muted small">LTV/CAC</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExpenseBreakdown = () => (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title mb-4">
          <i className="fas fa-chart-bar me-2"></i>
          Expense Breakdown (Year 3)
        </h5>
        
        <div className="row">
          <div className="col-md-8">
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <span>Development & Engineering</span>
                <span className="fw-bold">40%</span>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div className="progress-bar bg-primary" style={{ width: '40%' }}></div>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <span>Marketing & Sales</span>
                <span className="fw-bold">30%</span>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div className="progress-bar bg-success" style={{ width: '30%' }}></div>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <span>Operations & Support</span>
                <span className="fw-bold">20%</span>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div className="progress-bar bg-warning" style={{ width: '20%' }}></div>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <span>General & Administrative</span>
                <span className="fw-bold">10%</span>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div className="progress-bar bg-info" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <h6>Funding Requirements</h6>
            <div className="alert alert-info">
              <h6 className="alert-heading">Seed Round Needed</h6>
              <p className="mb-1">
                <strong>{formatCurrency(500000)}</strong>
              </p>
              <small>To reach profitability in Year 2</small>
            </div>
            
            <div className="alert alert-warning">
              <h6 className="alert-heading">Use of Funds</h6>
              <ul className="mb-0 small">
                <li>Product Development: 50%</li>
                <li>Marketing: 30%</li>
                <li>Operations: 20%</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScenarioComparison = () => (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title mb-4">
          <i className="fas fa-balance-scale me-2"></i>
          Scenario Comparison
        </h5>
        
        <div className="row">
          {Object.entries(projections).map(([scenario, data]) => (
            <div key={scenario} className="col-md-4 mb-3">
              <div className={`card ${projectionType === scenario ? 'border-primary' : ''}`}>
                <div className="card-body text-center">
                  <h6 className="card-title text-capitalize">{scenario}</h6>
                  <div className="stat-number text-primary">
                    {formatCurrency(data.year3.revenue)}
                  </div>
                  <p className="text-muted small">Year 3 Revenue</p>
                  <div className="stat-number text-success">
                    {formatCurrency(data.year3.profit)}
                  </div>
                  <p className="text-muted small">Year 3 Profit</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold mb-3">
              Financial <span className="text-gradient">Projections</span>
            </h1>
            <p className="lead">
              Build realistic financial models for your startup
            </p>
          </div>

          {/* Scenario Selection */}
          <div className="row mb-4">
            <div className="col-lg-8">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title mb-3">Select Projection Scenario</h5>
                  <div className="btn-group w-100" role="group">
                    <input
                      type="radio"
                      className="btn-check"
                      name="scenario"
                      id="conservative"
                      checked={projectionType === 'conservative'}
                      onChange={() => setProjectionType('conservative')}
                    />
                    <label className="btn btn-outline-primary" htmlFor="conservative">
                      Conservative
                    </label>

                    <input
                      type="radio"
                      className="btn-check"
                      name="scenario"
                      id="realistic"
                      checked={projectionType === 'realistic'}
                      onChange={() => setProjectionType('realistic')}
                    />
                    <label className="btn btn-outline-primary" htmlFor="realistic">
                      Realistic
                    </label>

                    <input
                      type="radio"
                      className="btn-check"
                      name="scenario"
                      id="optimistic"
                      checked={projectionType === 'optimistic'}
                      onChange={() => setProjectionType('optimistic')}
                    />
                    <label className="btn btn-outline-primary" htmlFor="optimistic">
                      Optimistic
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="card-title">Break-even Point</h6>
                  <div className="stat-number text-warning">Month 18</div>
                  <p className="text-muted small">Based on realistic scenario</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Projection Table */}
          {renderProjectionTable()}

          {/* Revenue and Expense Breakdowns */}
          <div className="row mt-4">
            <div className="col-lg-6">
              {renderRevenueBreakdown()}
            </div>
            <div className="col-lg-6">
              {renderExpenseBreakdown()}
            </div>
          </div>

          {/* Scenario Comparison */}
          <div className="mt-4">
            {renderScenarioComparison()}
          </div>

          {/* Action Buttons */}
          <div className="text-center mt-5">
            <button
              className="btn btn-primary btn-lg me-3"
              onClick={() => navigate('/validation-experiments')}
            >
              <i className="fas fa-arrow-right me-2"></i>
              Continue to Validation Experiments
            </button>
            <button className="btn btn-outline-primary btn-lg">
              <i className="fas fa-download me-2"></i>
              Export Projections
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-5">
            <div className="progress" style={{ height: '8px' }}>
              <div
                className="progress-bar bg-primary"
                role="progressbar"
                style={{ width: '100%' }}
                aria-valuenow="100"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <div className="d-flex justify-content-between mt-2">
              <small className="text-muted">Submit Idea</small>
              <small className="text-muted">Problem Refinement</small>
              <small className="text-muted">Market Research</small>
              <small className="text-muted">Business Model</small>
              <small className="text-primary fw-bold">Financial Projections</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialProjections;
