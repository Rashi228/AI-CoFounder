import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const FinancialProjections = () => {
  const [projectionType, setProjectionType] = useState('realistic');
  const [timeframe, setTimeframe] = useState('3years');
  const [projections, setProjections] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [businessPlan, setBusinessPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load business plan from localStorage
    const storedBusinessPlan = localStorage.getItem('currentBusinessPlan');
    if (storedBusinessPlan) {
      const businessPlanData = JSON.parse(storedBusinessPlan);
      setBusinessPlan(businessPlanData);
      
      // Load existing projections if available
      if (businessPlanData.financialProjections) {
        setProjections(businessPlanData.financialProjections);
      }
    }
  }, []);

  const generateProjections = async (scenario = projectionType) => {
    if (!businessPlan?._id) {
      setError('No business plan found. Please generate a business plan first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiService.generateFinancialProjections(businessPlan._id, {
        scenario: scenario,
        // Let the backend calculate these based on industry and business plan
        initialFunding: null,
        growthRate: null,
        monthlyCosts: null,
        revenuePerUser: null,
        initialUsers: null
      });

      if (response.success) {
        setProjections(response.data);
        // Update localStorage
        const updatedBusinessPlan = { ...businessPlan, financialProjections: response.data };
        localStorage.setItem('currentBusinessPlan', JSON.stringify(updatedBusinessPlan));
        setBusinessPlan(updatedBusinessPlan);
      }
    } catch (error) {
      console.error('Error generating projections:', error);
      setError('Failed to generate financial projections. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentProjection = projections?.projections || [];

  const handleExport = async () => {
    if (!businessPlan?._id) {
      setError('No business plan found. Please generate a business plan first.');
      return;
    }

    try {
      const response = await apiService.exportBusinessPlan(businessPlan._id, 'pdf');
      if (response.success) {
        // Create a download link
        const link = document.createElement('a');
        link.href = response.data.exportUrl;
        link.download = `financial-projections-${businessPlan.pitchDeckSummary?.title || 'business-plan'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error exporting projections:', error);
      setError('Failed to export projections. Please try again.');
    }
  };

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
        
        {!projections ? (
          <div className="text-center py-4">
            <p className="text-muted">No projections generated yet. Click "Generate Projections" to create your financial model.</p>
            <button 
              className="btn btn-primary"
              onClick={generateProjections}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Generating...
                </>
              ) : (
                <>
                  <i className="fas fa-calculator me-2"></i>
                  Generate Projections
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Users</th>
                  <th>Revenue</th>
                  <th>Expenses</th>
                  <th>Profit/Loss</th>
                  <th>Runway</th>
                </tr>
              </thead>
              <tbody>
                {currentProjection.map((data, index) => (
                  <tr key={index}>
                    <td className="fw-bold">Year {index + 1}</td>
                    <td>{data.users.toLocaleString()}</td>
                    <td className="text-success">{formatCurrency(data.revenue)}</td>
                    <td className="text-danger">{formatCurrency(data.costs)}</td>
                    <td className={data.netProfit >= 0 ? 'text-success' : 'text-danger'}>
                      {formatCurrency(data.netProfit)}
                    </td>
                    <td>{formatCurrency(data.runway)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderRevenueBreakdown = () => {
    if (!projections?.metrics) return null;

    const metrics = projections.metrics;
    const revenueBreakdown = projections.revenueBreakdown || {};
    const marketAnalysis = projections.marketAnalysis || {};
    
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-4">
            <i className="fas fa-pie-chart me-2"></i>
            Revenue Breakdown & Key Metrics
          </h5>
          
          <div className="row">
            <div className="col-md-6">
              <h6>Revenue Streams</h6>
              {Object.entries(revenueBreakdown).map(([stream, percentage], index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between">
                    <span>{stream}</span>
                    <span className="fw-bold">{percentage}%</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div 
                      className={`progress-bar ${index === 0 ? 'bg-primary' : index === 1 ? 'bg-success' : 'bg-warning'}`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              
              <div className="mt-3">
                <h6>Market Analysis</h6>
                <div className="row">
                  <div className="col-6">
                    <div className="text-center">
                      <div className="stat-number text-info">{formatCurrency(marketAnalysis.marketSize)}</div>
                      <p className="text-muted small">Market Size</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center">
                      <div className="stat-number text-warning">{marketAnalysis.targetMarketShare}%</div>
                      <p className="text-muted small">Target Share</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <h6>Key Metrics</h6>
              <div className="row">
                <div className="col-6 mb-3">
                  <div className="text-center">
                    <div className="stat-number text-primary">${metrics.arpu}</div>
                    <p className="text-muted small">ARPU</p>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="text-center">
                    <div className="stat-number text-danger">{metrics.churnRate}%</div>
                    <p className="text-muted small">Churn Rate</p>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="text-center">
                    <div className="stat-number text-warning">${metrics.cac}</div>
                    <p className="text-muted small">CAC</p>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="text-center">
                    <div className="stat-number text-info">{metrics.ltvCac}x</div>
                    <p className="text-muted small">LTV/CAC</p>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="text-center">
                    <div className="stat-number text-success">${metrics.ltv}</div>
                    <p className="text-muted small">LTV</p>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="text-center">
                    <div className="stat-number text-primary">{metrics.grossMargin}%</div>
                    <p className="text-muted small">Gross Margin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderExpenseBreakdown = () => {
    if (!projections?.expenseBreakdown) return null;

    const breakdown = projections.expenseBreakdown;
    const funding = projections.fundingRequirements;
    
    return (
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
                  <span className="fw-bold">{breakdown.development}%</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-primary" style={{ width: `${breakdown.development}%` }}></div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Marketing & Sales</span>
                  <span className="fw-bold">{breakdown.marketing}%</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-success" style={{ width: `${breakdown.marketing}%` }}></div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Operations & Support</span>
                  <span className="fw-bold">{breakdown.operations}%</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-warning" style={{ width: `${breakdown.operations}%` }}></div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>General & Administrative</span>
                  <span className="fw-bold">{breakdown.admin}%</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-info" style={{ width: `${breakdown.admin}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <h6>Funding Requirements</h6>
              <div className="alert alert-info">
                <h6 className="alert-heading">Seed Round Needed</h6>
                <p className="mb-1">
                  <strong>{formatCurrency(funding.seedRound)}</strong>
                </p>
                <small>To reach profitability in Month {funding.profitabilityMonth || 'N/A'}</small>
              </div>
              
              <div className="alert alert-warning">
                <h6 className="alert-heading">Use of Funds</h6>
                <ul className="mb-0 small">
                  <li>Product Development: {breakdown.development}%</li>
                  <li>Marketing: {breakdown.marketing}%</li>
                  <li>Operations: {breakdown.operations}%</li>
                  <li>Admin: {breakdown.admin}%</li>
                </ul>
              </div>
              
              <div className="alert alert-success">
                <h6 className="alert-heading">Runway</h6>
                <p className="mb-1">
                  <strong>{funding.runwayMonths} months</strong>
                </p>
                <small>Burn rate: {formatCurrency(funding.burnRate)}/month</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderScenarioComparison = () => {
    if (!projections) return null;

    const scenarios = ['conservative', 'realistic', 'optimistic'];
    
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-4">
            <i className="fas fa-balance-scale me-2"></i>
            Scenario Comparison
          </h5>
          
          <div className="alert alert-info mb-4">
            <i className="fas fa-info-circle me-2"></i>
            <strong>Note:</strong> Click "Generate Projections" to create projections for the selected scenario. Each scenario uses different growth rates and market penetration assumptions.
          </div>
          
          <div className="row">
            {scenarios.map((scenario) => {
              const isSelected = projectionType === scenario;
              const year3Data = currentProjection[2] || { revenue: 0, netProfit: 0, users: 0 };
              
              return (
                <div key={scenario} className="col-md-4 mb-3">
                  <div 
                    className={`card ${isSelected ? 'border-primary' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setProjectionType(scenario)}
                  >
                    <div className="card-body text-center">
                      <h6 className="card-title text-capitalize">{scenario}</h6>
                      <div className="stat-number text-primary">
                        {formatCurrency(year3Data.revenue)}
                      </div>
                      <p className="text-muted small">Year 3 Revenue</p>
                      <div className="stat-number text-success">
                        {formatCurrency(year3Data.netProfit)}
                      </div>
                      <p className="text-muted small">Year 3 Profit</p>
                      <div className="stat-number text-info">
                        {year3Data.users?.toLocaleString() || '0'}
                      </div>
                      <p className="text-muted small">Year 3 Users</p>
                      {isSelected && (
                        <div className="badge bg-primary mt-2">Selected</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

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
                  <div className="stat-number text-warning">
                    {projections?.summary?.breakEvenMonth ? `Month ${projections.summary.breakEvenMonth}` : 'TBD'}
                  </div>
                  <p className="text-muted small">Based on {projectionType} scenario</p>
                  {projections?.summary?.finalUsers && (
                    <div className="mt-2">
                      <small className="text-muted">
                        Final Users: {projections.summary.finalUsers.toLocaleString()}
                      </small>
                    </div>
                  )}
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
              onClick={() => navigate('/validation-experiments')}
            >
              <i className="fas fa-arrow-right me-2"></i>
              Continue to Validation Experiments
            </button>
            <button 
              className="btn btn-outline-primary btn-lg me-3"
              onClick={generateProjections}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Generating...
                </>
              ) : (
                <>
                  <i className="fas fa-calculator me-2"></i>
                  Generate Projections
                </>
              )}
            </button>
            <button 
              className="btn btn-outline-success btn-lg"
              onClick={handleExport}
              disabled={!projections}
            >
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
