import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../services/apiService';

const SharedPitchDeck = () => {
  const { shareToken } = useParams();
  const [pitchDeck, setPitchDeck] = useState(null);
  const [businessPlan, setBusinessPlan] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSharedPitchDeck();
  }, [shareToken]);

  const loadSharedPitchDeck = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getSharedPitchDeck(shareToken);
      
      if (response.success) {
        setPitchDeck(response.data.pitchDeck);
        setBusinessPlan(response.data.businessPlan);
      } else {
        setError(response.message || 'Failed to load shared pitch deck');
      }
    } catch (error) {
      console.error('Error loading shared pitch deck:', error);
      setError('Failed to load shared pitch deck. The link may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  const renderSlide = (slide) => {
    const slideClass = 'pitch-slide bg-white';
    
    switch (slide.id) {
      case 'title':
        return (
          <div className={slideClass}>
            <div className="text-center h-100 d-flex flex-column justify-content-center">
              <h1 className="display-3 fw-bold mb-3">{slide.content.companyName}</h1>
              <h3 className="text-muted mb-4">{slide.content.tagline}</h3>
              <div className="mt-auto">
                <p className="lead">{slide.content.presenter}</p>
                <p className="text-muted">{slide.content.date}</p>
              </div>
            </div>
          </div>
        );
      
      case 'problem':
        return (
          <div className={slideClass}>
            <h2 className="display-4 fw-bold mb-4">{slide.content.headline}</h2>
            <p className="lead mb-4">{slide.content.description}</p>
            <div className="row">
              {slide.content.stats.map((stat, index) => (
                <div key={index} className="col-md-4 mb-3">
                  <div className="card border-0 bg-light">
                    <div className="card-body text-center">
                      <p className="card-text">{stat}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'solution':
        return (
          <div className={slideClass}>
            <h2 className="display-4 fw-bold mb-4">{slide.content.headline}</h2>
            <p className="lead mb-4">{slide.content.description}</p>
            <div className="row">
              {slide.content.features.map((feature, index) => (
                <div key={index} className="col-md-6 mb-3">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-check-circle text-success me-3 fa-2x"></i>
                    <span className="fs-5">{feature}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'market':
        return (
          <div className={slideClass}>
            <h2 className="display-4 fw-bold mb-4">{slide.content.headline}</h2>
            <p className="lead mb-4">{slide.content.description}</p>
            <div className="row text-center mb-4">
              <div className="col-md-6">
                <div className="stat-number text-primary">{slide.content.marketSize}</div>
                <p className="text-muted">Market Size</p>
              </div>
              <div className="col-md-6">
                <div className="stat-number text-success">{slide.content.growth}</div>
                <p className="text-muted">Annual Growth</p>
              </div>
            </div>
            <div className="row">
              {slide.content.segments.map((segment, index) => (
                <div key={index} className="col-md-4">
                  <div className="card border-0 bg-light">
                    <div className="card-body text-center">
                      <p className="card-text">{segment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'business-model':
        return (
          <div className={slideClass}>
            <h2 className="display-4 fw-bold mb-4">{slide.content.headline}</h2>
            <p className="lead mb-4">{slide.content.description}</p>
            <div className="row">
              <div className="col-md-8">
                <h5>Pricing Tiers:</h5>
                {slide.content.pricing.map((price, index) => (
                  <div key={index} className="card mb-2">
                    <div className="card-body">
                      <p className="card-text mb-0">{price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="col-md-4">
                <div className="card bg-primary text-white">
                  <div className="card-body text-center">
                    <h5 className="card-title">Year 1 Revenue</h5>
                    <div className="display-6">{slide.content.revenue}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'traction':
        return (
          <div className={slideClass}>
            <h2 className="display-4 fw-bold mb-4">{slide.content.headline}</h2>
            <p className="lead mb-4">{slide.content.description}</p>
            <div className="row">
              {slide.content.metrics.map((metric, index) => (
                <div key={index} className="col-md-6 mb-3">
                  <div className="card border-0 bg-light">
                    <div className="card-body text-center">
                      <p className="card-text fs-5">{metric}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'competition':
        return (
          <div className={slideClass}>
            <h2 className="display-4 fw-bold mb-4">{slide.content.headline}</h2>
            <p className="lead mb-4">{slide.content.description}</p>
            <div className="row mb-4">
              <div className="col-md-6">
                <h5>Competitors:</h5>
                {slide.content.competitors.map((competitor, index) => (
                  <div key={index} className="card mb-2">
                    <div className="card-body">
                      <p className="card-text mb-0">{competitor}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="col-md-6">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <h5 className="card-title">Our Advantage</h5>
                    <p className="card-text">{slide.content.advantage}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'team':
        return (
          <div className={slideClass}>
            <h2 className="display-4 fw-bold mb-4">{slide.content.headline}</h2>
            <p className="lead mb-4">{slide.content.description}</p>
            <div className="row">
              {slide.content.members.map((member, index) => (
                <div key={index} className="col-md-4">
                  <div className="card border-0 bg-light">
                    <div className="card-body text-center">
                      <p className="card-text">{member}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'financials':
        return (
          <div className={slideClass}>
            <h2 className="display-4 fw-bold mb-4">{slide.content.headline}</h2>
            <p className="lead mb-4">{slide.content.description}</p>
            <div className="row mb-4">
              <div className="col-md-8">
                <h5>Revenue Projections:</h5>
                {slide.content.projections.map((projection, index) => (
                  <div key={index} className="card mb-2">
                    <div className="card-body">
                      <p className="card-text mb-0">{projection}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="col-md-4">
                <div className="card bg-info text-white">
                  <div className="card-body">
                    <h5 className="card-title">Unit Economics</h5>
                    <p className="card-text">{slide.content.unitEconomics}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'funding':
        return (
          <div className={slideClass}>
            <h2 className="display-4 fw-bold mb-4">{slide.content.headline}</h2>
            <p className="lead mb-4">{slide.content.description}</p>
            <div className="row">
              <div className="col-md-6">
                <h5>Use of Funds:</h5>
                {slide.content.useOfFunds.map((use, index) => (
                  <div key={index} className="card mb-2">
                    <div className="card-body">
                      <p className="card-text mb-0">{use}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="col-md-6">
                <div className="card bg-warning text-dark">
                  <div className="card-body">
                    <h5 className="card-title">Milestones</h5>
                    <p className="card-text">{slide.content.milestones}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={slideClass}>
            <h2>{slide.title}</h2>
            <p>Content for {slide.title} slide</p>
          </div>
        );
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
            <h4>Loading shared pitch deck...</h4>
            <p className="text-muted">Please wait while we load the presentation</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <div className="card">
              <div className="card-body py-5">
                <i className="fas fa-exclamation-triangle fa-3x text-danger mb-4"></i>
                <h3 className="mb-3">Unable to Load Pitch Deck</h3>
                <p className="text-muted mb-4">{error}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => window.location.href = '/'}
                >
                  <i className="fas fa-home me-2"></i>
                  Go to Homepage
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pitchDeck) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <div className="card">
              <div className="card-body py-5">
                <i className="fas fa-file-alt fa-3x text-muted mb-4"></i>
                <h3 className="mb-3">No Pitch Deck Found</h3>
                <p className="text-muted mb-4">The shared pitch deck could not be found.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => window.location.href = '/'}
                >
                  <i className="fas fa-home me-2"></i>
                  Go to Homepage
                </button>
              </div>
            </div>
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
              {businessPlan?.companyName || 'Startup'} <span className="text-gradient">Pitch Deck</span>
            </h1>
            <p className="lead">
              Shared presentation
            </p>
          </div>

          {/* Slide Navigation */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">Slide {activeSlide + 1} of {pitchDeck.slides.length}</h5>
                  <p className="text-muted mb-0">{pitchDeck.slides[activeSlide].title}</p>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
                    disabled={activeSlide === 0}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setActiveSlide(Math.min(pitchDeck.slides.length - 1, activeSlide + 1))}
                    disabled={activeSlide === pitchDeck.slides.length - 1}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="progress" style={{ height: '4px' }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${((activeSlide + 1) / pitchDeck.slides.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Slide Display */}
          <div className="mb-4">
            {renderSlide(pitchDeck.slides[activeSlide])}
          </div>

          {/* Slide Thumbnails */}
          <div className="card">
            <div className="card-body">
              <h6 className="card-title">Slide Overview</h6>
              <div className="row">
                {pitchDeck.slides.map((slide, index) => (
                  <div key={slide.id} className="col-md-3 mb-2">
                    <div
                      className={`card ${activeSlide === index ? 'border-primary' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setActiveSlide(index)}
                    >
                      <div className="card-body p-2 text-center">
                        <div className="small fw-bold">{slide.title}</div>
                        <div className="text-muted small">Slide {index + 1}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedPitchDeck;
