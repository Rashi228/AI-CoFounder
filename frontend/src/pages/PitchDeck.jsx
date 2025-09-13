import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PitchDeck = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [deckStyle, setDeckStyle] = useState('modern');
  const [isPresenting, setIsPresenting] = useState(false);
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

  const getSlides = () => {
    if (!businessPlan?.pitchDeckSummary) return [];
    
    return [
      {
        id: 'title',
        title: 'Title Slide',
        content: {
          companyName: businessPlan.pitchDeckSummary.title || 'Your Startup',
          tagline: businessPlan.pitchDeckSummary.tagline || 'AI-Powered Solution',
          presenter: 'Your Name',
          date: '2024'
        }
      },
      {
        id: 'problem',
        title: 'Problem',
        content: {
          headline: businessPlan.pitchDeckSummary.problem || 'Problem Statement',
          description: businessPlan.problemStatement || 'AI is analyzing the problem...',
          stats: [
            'Problem validation in progress',
            'Market analysis ongoing',
            'Customer research needed'
          ]
        }
      },
      {
        id: 'solution',
        title: 'Solution',
        content: {
          headline: businessPlan.pitchDeckSummary.solution || 'Solution Overview',
          description: businessPlan.pitchDeckSummary.solution || 'AI is developing the solution...',
          features: businessPlan.leanCanvas?.valuePropositions?.slice(0, 4) || [
            'Solution features being analyzed',
            'Value propositions in development',
            'Key benefits being identified',
            'Unique selling points being refined'
          ]
        }
      },
      {
        id: 'market',
        title: 'Market',
        content: {
          headline: 'Market Opportunity',
          description: businessPlan.pitchDeckSummary.marketSize || 'Market analysis in progress...',
          marketSize: businessPlan.pitchDeckSummary.marketSize || 'TBD',
          growth: 'Analysis ongoing',
          segments: businessPlan.leanCanvas?.customerSegments || [
            'Target market being analyzed',
            'Customer segments being identified',
            'Market size being calculated'
          ]
        }
      },
      {
        id: 'business-model',
        title: 'Business Model',
        content: {
          headline: businessPlan.pitchDeckSummary.businessModel || 'Business Model',
          description: businessPlan.pitchDeckSummary.businessModel || 'Business model being developed...',
          pricing: businessPlan.leanCanvas?.revenueStreams || [
            'Revenue streams being analyzed',
            'Pricing strategy in development',
            'Monetization model being refined'
          ],
          revenue: 'Projections in progress'
        }
      },
      {
        id: 'traction',
        title: 'Traction',
        content: {
          headline: 'Validation Progress',
          description: 'Early validation using AI-generated tools and surveys.',
          metrics: [
            'Survey questions generated for validation',
            'Landing page content created',
            'Ad campaign materials ready',
            'Market research in progress'
          ]
        }
      },
      {
        id: 'competition',
        title: 'Competition',
        content: {
          headline: 'Competitive Analysis',
          description: 'AI-powered analysis of competitive landscape.',
          competitors: businessPlan.leanCanvas?.keyPartners || [
            'Competitive analysis in progress',
            'Key partners being identified',
            'Competitive advantages being analyzed'
          ],
          advantage: 'AI-generated competitive insights'
        }
      },
      {
        id: 'team',
        title: 'Team',
        content: {
          headline: 'Team Requirements',
          description: 'Key team members needed based on AI analysis.',
          members: [
            'Team structure being analyzed',
            'Key roles being identified',
            'Skills requirements being defined',
            'Co-founder matching in progress'
          ]
        }
      },
      {
        id: 'financials',
        title: 'Financial Projections',
        content: {
          headline: 'Financial Planning',
          description: 'AI-generated financial projections based on business model analysis.',
          projections: [
            'Revenue streams being analyzed',
            'Cost structure being defined',
            'Financial projections in development',
            'Unit economics being calculated'
          ],
          unitEconomics: 'Financial modeling in progress'
        }
      },
      {
        id: 'funding',
        title: 'Funding Ask',
        content: {
          headline: businessPlan.pitchDeckSummary.theAsk || 'Funding Requirements',
          description: businessPlan.pitchDeckSummary.theAsk || 'Funding needs being analyzed...',
          useOfFunds: [
            'Product development requirements',
            'Market validation needs',
            'Team building requirements',
            'Operational scaling needs'
          ],
          milestones: 'Milestones being defined based on AI analysis'
        }
      }
    ];
  };

  const slides = getSlides();

  const deckStyles = [
    { id: 'modern', name: 'Modern', class: 'bg-gradient-primary' },
    { id: 'minimal', name: 'Minimal', class: 'bg-white' },
    { id: 'dark', name: 'Dark', class: 'bg-dark text-white' }
  ];

  const renderSlide = (slide) => {
    const slideClass = `pitch-slide ${deckStyles.find(s => s.id === deckStyle)?.class || 'bg-white'}`;
    
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

  const renderSlideNavigation = () => (
    <div className="card mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1">Slide {activeSlide + 1} of {slides.length}</h5>
            <p className="text-muted mb-0">{slides[activeSlide].title}</p>
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
              onClick={() => setActiveSlide(Math.min(slides.length - 1, activeSlide + 1))}
              disabled={activeSlide === slides.length - 1}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setIsPresenting(!isPresenting)}
            >
              <i className={`fas fa-${isPresenting ? 'stop' : 'play'} me-2`}></i>
              {isPresenting ? 'Stop' : 'Present'}
            </button>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="progress" style={{ height: '4px' }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${((activeSlide + 1) / slides.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSlideThumbnails = () => (
    <div className="card">
      <div className="card-body">
        <h6 className="card-title">Slide Overview</h6>
        <div className="row">
          {slides.map((slide, index) => (
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
  );

  if (isPresenting) {
    return (
      <div className="presentation-mode">
        <div className="position-fixed top-0 end-0 p-3">
          <button
            className="btn btn-outline-light"
            onClick={() => setIsPresenting(false)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        {renderSlide(slides[activeSlide])}
        <div className="position-fixed bottom-0 start-50 translate-middle-x p-3">
          <div className="btn-group">
            <button
              className="btn btn-outline-light"
              onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
              disabled={activeSlide === 0}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              className="btn btn-outline-light"
              onClick={() => setActiveSlide(Math.min(slides.length - 1, activeSlide + 1))}
              disabled={activeSlide === slides.length - 1}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4>Loading your pitch deck...</h4>
            <p className="text-muted">AI is generating your personalized pitch deck content</p>
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
              Pitch Deck <span className="text-gradient">Generator</span>
            </h1>
            <p className="lead">
              Create a professional pitch deck for your startup
            </p>
          </div>

          {/* Style Selection */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Choose Deck Style</h5>
              <div className="btn-group" role="group">
                {deckStyles.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    className={`btn ${deckStyle === style.id ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setDeckStyle(style.id)}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Slide Navigation */}
          {renderSlideNavigation()}

          {/* Main Slide Display */}
          <div className="mb-4">
            {renderSlide(slides[activeSlide])}
          </div>

          {/* Slide Thumbnails */}
          {renderSlideThumbnails()}

          {/* Action Buttons */}
          <div className="text-center mt-5">
            <button className="btn btn-primary btn-lg me-3">
              <i className="fas fa-download me-2"></i>
              Download PDF
            </button>
            <button className="btn btn-outline-primary btn-lg me-3">
              <i className="fas fa-share me-2"></i>
              Share Deck
            </button>
            <button className="btn btn-outline-secondary btn-lg">
              <i className="fas fa-edit me-2"></i>
              Customize
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PitchDeck;
