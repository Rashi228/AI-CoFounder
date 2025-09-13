import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const PitchDeck = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [deckStyle, setDeckStyle] = useState('modern');
  const [isPresenting, setIsPresenting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [businessPlan, setBusinessPlan] = useState(null);
  const [pitchDeck, setPitchDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [shareModal, setShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [showMessageInput, setShowMessageInput] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const storedBusinessPlan = localStorage.getItem('currentBusinessPlan');
      if (storedBusinessPlan) {
        const businessPlanData = JSON.parse(storedBusinessPlan);
        setBusinessPlan(businessPlanData);
        
        // Check if pitch deck already exists
        if (businessPlanData.pitchDeck) {
          setPitchDeck(businessPlanData.pitchDeck);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load business plan data');
    } finally {
      setLoading(false);
    }
  };

  const generatePitchDeck = async () => {
    if (!businessPlan?._id) {
      setError('No business plan found. Please create a business plan first.');
      return;
    }

    try {
      setGenerating(true);
      setError(null);
      console.log('Generating pitch deck for business plan:', businessPlan._id, 'with style:', deckStyle);
      
      const response = await apiService.generatePitchDeck(businessPlan._id, deckStyle, customMessage);
      console.log('Generate response:', response);
      
      if (response.success) {
        setPitchDeck(response.data);
        
        // Update localStorage
        const updatedBusinessPlan = { ...businessPlan, pitchDeck: response.data };
        localStorage.setItem('currentBusinessPlan', JSON.stringify(updatedBusinessPlan));
        setBusinessPlan(updatedBusinessPlan);
        
        console.log('Pitch deck generated successfully');
      } else {
        setError(response.message || 'Failed to generate pitch deck');
      }
    } catch (error) {
      console.error('Error generating pitch deck:', error);
      setError(`Failed to generate pitch deck: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const updateSlideContent = async (slideId, field, value) => {
    if (!businessPlan?._id || !pitchDeck) return;

    try {
      setSaving(true);
      
      // Update local state immediately for better UX
      const updatedPitchDeck = { ...pitchDeck };
      const slideIndex = updatedPitchDeck.slides.findIndex(slide => slide.id === slideId);
      if (slideIndex !== -1) {
        updatedPitchDeck.slides[slideIndex].content[field] = value;
        setPitchDeck(updatedPitchDeck);
      }

      // Update backend
      const response = await apiService.updatePitchDeckSlide(businessPlan._id, slideId, {
        [field]: value
      });

      if (response.success) {
        // Update localStorage
        const updatedBusinessPlan = { ...businessPlan, pitchDeck: updatedPitchDeck };
        localStorage.setItem('currentBusinessPlan', JSON.stringify(updatedBusinessPlan));
        setBusinessPlan(updatedBusinessPlan);
      }
    } catch (error) {
      console.error('Error updating slide:', error);
      setError('Failed to update slide. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const sharePitchDeck = async () => {
    if (!businessPlan?._id) {
      setError('No business plan found. Please create a business plan first.');
      return;
    }

    if (!pitchDeck) {
      setError('No pitch deck found. Please generate a pitch deck first.');
      return;
    }

    try {
      setError(null);
      console.log('Sharing pitch deck for business plan:', businessPlan._id);
      
      const response = await apiService.sharePitchDeck(businessPlan._id);
      console.log('Share response:', response);
      
      if (response.success) {
        setShareUrl(response.data.shareUrl);
        setShareModal(true);
      } else {
        setError(response.message || 'Failed to share pitch deck');
      }
    } catch (error) {
      console.error('Error sharing pitch deck:', error);
      setError(`Failed to share pitch deck: ${error.message}`);
    }
  };

  const downloadPDF = async () => {
    if (!pitchDeck) return;

    try {
      // Create a simple PDF using browser's print functionality
      const printWindow = window.open('', '_blank');
      const slidesHTML = pitchDeck.slides.map((slide, index) => `
        <div style="page-break-after: always; padding: 40px; font-family: Arial, sans-serif;">
          <h1 style="color: #007bff; margin-bottom: 30px;">${slide.title}</h1>
          ${renderSlideForPDF(slide)}
        </div>
      `).join('');

      printWindow.document.write(`
        <html>
          <head>
            <title>${pitchDeck.title} - Pitch Deck</title>
            <style>
              body { margin: 0; padding: 0; }
              @media print {
                @page { margin: 1in; }
              }
            </style>
          </head>
          <body>
            ${slidesHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setError('Failed to download PDF. Please try again.');
    }
  };

  const renderSlideForPDF = (slide) => {
    switch (slide.id) {
      case 'title':
        return `
          <div style="text-align: center; margin-top: 100px;">
            <h1 style="font-size: 48px; margin-bottom: 20px;">${slide.content.companyName}</h1>
            <h2 style="color: #666; margin-bottom: 40px;">${slide.content.tagline}</h2>
            <p style="font-size: 18px;">${slide.content.presenter}</p>
            <p style="color: #666;">${slide.content.date}</p>
          </div>
        `;
      case 'problem':
        return `
          <h2 style="color: #dc3545; margin-bottom: 20px;">${slide.content.headline}</h2>
          <p style="font-size: 18px; margin-bottom: 30px;">${slide.content.description}</p>
          <ul style="font-size: 16px;">
            ${slide.content.stats.map(stat => `<li style="margin-bottom: 10px;">${stat}</li>`).join('')}
          </ul>
        `;
      case 'solution':
        return `
          <h2 style="color: #28a745; margin-bottom: 20px;">${slide.content.headline}</h2>
          <p style="font-size: 18px; margin-bottom: 30px;">${slide.content.description}</p>
          <ul style="font-size: 16px;">
            ${slide.content.features.map(feature => `<li style="margin-bottom: 10px;">${feature}</li>`).join('')}
          </ul>
        `;
      default:
        return `
          <h2 style="margin-bottom: 20px;">${slide.content.headline || slide.title}</h2>
          <p style="font-size: 16px;">${slide.content.description || 'Content for this slide'}</p>
        `;
    }
  };

  const handleFieldEdit = (slideId, field, currentValue) => {
    setEditingField({ slideId, field, value: currentValue });
  };

  const handleFieldSave = () => {
    if (editingField) {
      updateSlideContent(editingField.slideId, editingField.field, editingField.value);
      setEditingField(null);
    }
  };

  const handleFieldCancel = () => {
    setEditingField(null);
  };

  const renderEditableField = (slideId, field, value, type = 'text') => {
    if (editingField && editingField.slideId === slideId && editingField.field === field) {
      return (
        <div className="d-flex align-items-center gap-2">
          {type === 'textarea' ? (
            <textarea
              className="form-control"
              value={editingField.value}
              onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
              rows={3}
              autoFocus
            />
          ) : (
            <input
              type={type}
              className="form-control"
              value={editingField.value}
              onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
              autoFocus
            />
          )}
          <button
            className="btn btn-sm btn-success"
            onClick={handleFieldSave}
            disabled={saving}
          >
            <i className="fas fa-check"></i>
          </button>
          <button
            className="btn btn-sm btn-secondary"
            onClick={handleFieldCancel}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      );
    }

    return (
      <div className="d-flex align-items-center gap-2">
        <span>{value}</span>
        {isEditing && (
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => handleFieldEdit(slideId, field, value)}
          >
            <i className="fas fa-edit"></i>
          </button>
        )}
      </div>
    );
  };

  const renderSlide = (slide) => {
    const slideClass = `pitch-slide ${deckStyles.find(s => s.id === deckStyle)?.class || 'bg-white'}`;
    
    switch (slide.id) {
      case 'title':
        return (
          <div className={slideClass}>
            <div className="text-center h-100 d-flex flex-column justify-content-center">
              {renderEditableField(slide.id, 'companyName', slide.content.companyName)}
              {renderEditableField(slide.id, 'tagline', slide.content.tagline)}
              <div className="mt-auto">
                {renderEditableField(slide.id, 'presenter', slide.content.presenter)}
                {renderEditableField(slide.id, 'date', slide.content.date)}
              </div>
            </div>
          </div>
        );
      
      case 'problem':
        return (
          <div className={slideClass}>
            {renderEditableField(slide.id, 'headline', slide.content.headline)}
            {renderEditableField(slide.id, 'description', slide.content.description, 'textarea')}
            <div className="row mt-4">
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
            {renderEditableField(slide.id, 'headline', slide.content.headline)}
            {renderEditableField(slide.id, 'description', slide.content.description, 'textarea')}
            <div className="row mt-4">
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
            {renderEditableField(slide.id, 'headline', slide.content.headline)}
            {renderEditableField(slide.id, 'description', slide.content.description, 'textarea')}
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
            {renderEditableField(slide.id, 'headline', slide.content.headline)}
            {renderEditableField(slide.id, 'description', slide.content.description, 'textarea')}
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
            {renderEditableField(slide.id, 'headline', slide.content.headline)}
            {renderEditableField(slide.id, 'description', slide.content.description, 'textarea')}
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
            {renderEditableField(slide.id, 'headline', slide.content.headline)}
            {renderEditableField(slide.id, 'description', slide.content.description, 'textarea')}
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
            {renderEditableField(slide.id, 'headline', slide.content.headline)}
            {renderEditableField(slide.id, 'description', slide.content.description, 'textarea')}
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
            {renderEditableField(slide.id, 'headline', slide.content.headline)}
            {renderEditableField(slide.id, 'description', slide.content.description, 'textarea')}
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
            {renderEditableField(slide.id, 'headline', slide.content.headline)}
            {renderEditableField(slide.id, 'description', slide.content.description, 'textarea')}
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

  const deckStyles = [
    { id: 'modern', name: 'Modern', class: 'bg-gradient-primary' },
    { id: 'minimal', name: 'Minimal', class: 'bg-white' },
    { id: 'dark', name: 'Dark', class: 'bg-dark text-white' }
  ];

  const renderSlideNavigation = () => (
    <div className="card mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1">Slide {activeSlide + 1} of {pitchDeck?.slides?.length || 0}</h5>
            <p className="text-muted mb-0">{pitchDeck?.slides?.[activeSlide]?.title}</p>
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
              onClick={() => setActiveSlide(Math.min((pitchDeck?.slides?.length || 1) - 1, activeSlide + 1))}
              disabled={activeSlide === (pitchDeck?.slides?.length || 1) - 1}
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
              style={{ width: `${((activeSlide + 1) / (pitchDeck?.slides?.length || 1)) * 100}%` }}
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
          {pitchDeck?.slides?.map((slide, index) => (
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

  if (isPresenting && pitchDeck) {
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
        {renderSlide(pitchDeck.slides[activeSlide])}
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
              onClick={() => setActiveSlide(Math.min(pitchDeck.slides.length - 1, activeSlide + 1))}
              disabled={activeSlide === pitchDeck.slides.length - 1}
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
            <p className="text-muted">Preparing your presentation materials</p>
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

          {error && (
            <div className="alert alert-danger mb-4">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          {!pitchDeck ? (
            <div className="text-center py-5">
              <div className="card">
                <div className="card-body py-5">
                  <i className="fas fa-presentation fa-3x text-muted mb-4"></i>
                  <h3 className="mb-3">Generate Your Pitch Deck</h3>
                  <p className="text-muted mb-4">
                    Create a professional pitch deck with AI-generated content based on your business plan.
                  </p>
                  
                  {/* Style Selection */}
                  <div className="mb-4">
                    <h5 className="mb-3">Choose Deck Style</h5>
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

                  {/* Custom Message Input */}
                  <div className="mb-4">
                    <h5 className="mb-3">
                      <i className="fas fa-robot me-2"></i>
                      Custom Requirements (Optional)
                    </h5>
                    <p className="text-muted mb-3">
                      Describe any specific requirements for your pitch deck. The AI will customize the content accordingly.
                    </p>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="e.g., Focus on B2B enterprise customers, emphasize our AI technology, add more financial projections, make it more investor-friendly..."
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                    />
                  </div>

                  <button
                    className="btn btn-primary btn-lg"
                    onClick={generatePitchDeck}
                    disabled={generating}
                  >
                    {generating ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Generating...</span>
                        </div>
                        Generating Pitch Deck...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-magic me-2"></i>
                        Generate Pitch Deck
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Style Selection */}
              <div className="card mb-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
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
                    <div className="d-flex gap-2">
                      <button
                        className={`btn ${isEditing ? 'btn-success' : 'btn-outline-primary'}`}
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <i className="fas fa-edit me-2"></i>
                        {isEditing ? 'Done Editing' : 'Customize'}
                      </button>
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => setShowMessageInput(!showMessageInput)}
                      >
                        <i className="fas fa-magic me-2"></i>
                        AI Regenerate
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Message Input */}
              {showMessageInput && (
                <div className="card mb-4">
                  <div className="card-body">
                    <h5 className="card-title mb-3">
                      <i className="fas fa-robot me-2"></i>
                      AI-Powered Regeneration
                    </h5>
                    <p className="text-muted mb-3">
                      Describe how you want to modify your pitch deck. The AI will regenerate content based on your requirements.
                    </p>
                    <div className="mb-3">
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="e.g., Make it more focused on B2B enterprise customers, emphasize our AI technology, add more financial projections, make it more investor-friendly..."
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                      />
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-primary"
                        onClick={generatePitchDeck}
                        disabled={generating}
                      >
                        {generating ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                              <span className="visually-hidden">Generating...</span>
                            </div>
                            Regenerating...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-sync me-2"></i>
                            Regenerate with AI
                          </>
                        )}
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setShowMessageInput(false);
                          setCustomMessage('');
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Regenerate Button */}
              <div className="card mb-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Quick Actions</h6>
                      <p className="text-muted mb-0">Generate new content with current settings</p>
                    </div>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => {
                        setCustomMessage('');
                        generatePitchDeck();
                      }}
                      disabled={generating}
                    >
                      <i className="fas fa-sync me-2"></i>
                      Quick Regenerate
                    </button>
                  </div>
                </div>
              </div>

              {/* Slide Navigation */}
              {renderSlideNavigation()}

              {/* Main Slide Display */}
              <div className="mb-4">
                {renderSlide(pitchDeck.slides[activeSlide])}
              </div>

              {/* Slide Thumbnails */}
              {renderSlideThumbnails()}

              {/* Action Buttons */}
              <div className="text-center mt-5">
                <button 
                  className="btn btn-primary btn-lg me-3"
                  onClick={downloadPDF}
                >
                  <i className="fas fa-download me-2"></i>
                  Download PDF
                </button>
                <button 
                  className="btn btn-outline-primary btn-lg me-3"
                  onClick={sharePitchDeck}
                >
                  <i className="fas fa-share me-2"></i>
                  Share Deck
                </button>
                <button 
                  className="btn btn-outline-secondary btn-lg"
                  onClick={() => navigate('/dashboard')}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back to Dashboard
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {shareModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Share Your Pitch Deck</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShareModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Your pitch deck has been shared! Copy the link below to share with investors:</p>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    value={shareUrl}
                    readOnly
                  />
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigator.clipboard.writeText(shareUrl)}
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
                <small className="text-muted mt-2 d-block">
                  This link will expire in 30 days.
                </small>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShareModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PitchDeck;