import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const IdeaInput = () => {
  const [ideaText, setIdeaText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [inputMethod, setInputMethod] = useState('text');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleVoiceRecording = () => {
    if (!isRecording) {
      // Start recording
      setIsRecording(true);
      // In a real app, you would integrate with Web Speech API
      console.log('Starting voice recording...');
      // Simulate voice recording for demo
      setTimeout(() => {
        setIsRecording(false);
        setIdeaText("This is a simulated voice-to-text transcription. In a real app, this would be actual voice input converted to text.");
      }, 3000);
    } else {
      // Stop recording
      setIsRecording(false);
      console.log('Stopping voice recording...');
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (ideaText.trim()) {
      setLoading(true);
      setError('');
      
      try {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in first to generate a business plan.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        // Call the API to generate business plan
        const response = await apiService.generateBusinessPlan(ideaText);
        
        if (response.success) {
          // Store the generated business plan data
          localStorage.setItem('currentBusinessPlan', JSON.stringify(response.data));
          localStorage.setItem('currentIdea', ideaText);
          
          console.log('Business plan generated:', response.data);
          navigate('/problem-refinement');
        } else {
          setError('Error generating business plan. Please try again.');
        }
      } catch (error) {
        console.error('Error generating business plan:', error);
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          setError('Please log in first to generate a business plan.');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError(`Error generating business plan: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold mb-3">
              Share Your <span className="text-gradient">Startup Idea</span>
            </h1>
            <p className="lead">
              Describe your idea in any way that works for you - text, voice, or even an image
            </p>
          </div>

          {/* Input Method Selection */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Choose Input Method</h5>
              <div className="row">
                <div className="col-md-4">
                  <button
                    className={`btn w-100 ${inputMethod === 'text' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setInputMethod('text')}
                  >
                    <i className="fas fa-keyboard fa-2x d-block mb-2"></i>
                    Text Input
                  </button>
                </div>
                <div className="col-md-4">
                  <button
                    className={`btn w-100 ${inputMethod === 'voice' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setInputMethod('voice')}
                  >
                    <i className="fas fa-microphone fa-2x d-block mb-2"></i>
                    Voice Input
                  </button>
                </div>
                <div className="col-md-4">
                  <button
                    className={`btn w-100 ${inputMethod === 'image' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setInputMethod('image')}
                  >
                    <i className="fas fa-image fa-2x d-block mb-2"></i>
                    Image Upload
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Text Input */}
          {inputMethod === 'text' && (
            <div className="idea-input-container">
              <h5 className="mb-3">
                <i className="fas fa-edit me-2"></i>
                Describe Your Idea
              </h5>
              <textarea
                className="form-control"
                rows="8"
                placeholder="Tell us about your startup idea... What problem does it solve? Who is your target audience? What makes it unique?"
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
              />
              <div className="mt-3">
                <small className="text-muted">
                  <i className="fas fa-lightbulb me-1"></i>
                  Tip: Be as detailed as possible. Include the problem you're solving, your target market, and any unique aspects of your solution.
                </small>
              </div>
            </div>
          )}

          {/* Voice Input */}
          {inputMethod === 'voice' && (
            <div className="idea-input-container text-center">
              <h5 className="mb-4">
                <i className="fas fa-microphone me-2"></i>
                Record Your Idea
              </h5>
              <div className="mb-4">
                <button
                  className={`voice-recording ${isRecording ? 'recording' : ''}`}
                  onClick={handleVoiceRecording}
                >
                  <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
                </button>
              </div>
              <p className="text-muted">
                {isRecording ? 'Recording... Click to stop' : 'Click the microphone to start recording'}
              </p>
              {ideaText && (
                <div className="mt-4">
                  <h6>Transcribed Text:</h6>
                  <div className="alert alert-light">
                    {ideaText}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Image Upload */}
          {inputMethod === 'image' && (
            <div className="idea-input-container">
              <h5 className="mb-3">
                <i className="fas fa-image me-2"></i>
                Upload an Image
              </h5>
              <div className="text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <button
                  className="btn btn-outline-primary btn-lg"
                  onClick={() => fileInputRef.current.click()}
                >
                  <i className="fas fa-upload me-2"></i>
                  Choose Image
                </button>
                {uploadedImage && (
                  <div className="mt-4">
                    <img
                      src={uploadedImage}
                      alt="Uploaded idea"
                      className="img-fluid rounded"
                      style={{ maxHeight: '300px' }}
                    />
                    <div className="mt-3">
                      <h6>Describe what you see in this image:</h6>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Describe your idea based on this image..."
                        value={ideaText}
                        onChange={(e) => setIdeaText(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Questions */}
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Additional Information</h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">What industry is this in?</label>
                  <select className="form-select">
                    <option value="">Select an industry</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="finance">Finance</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="sustainability">Sustainability</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">What stage is your idea in?</label>
                  <select className="form-select">
                    <option value="">Select stage</option>
                    <option value="concept">Just an idea</option>
                    <option value="prototype">Have a prototype</option>
                    <option value="mvp">Have an MVP</option>
                    <option value="early-users">Have early users</option>
                    <option value="revenue">Generating revenue</option>
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">What's your biggest challenge right now?</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="e.g., finding co-founders, market validation, funding, technical development..."
                />
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="text-center mt-4">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleSubmit}
              disabled={(!ideaText.trim() && !uploadedImage) || loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Generating Business Plan...
                </>
              ) : (
                <>
                  <i className="fas fa-arrow-right me-2"></i>
                  Analyze My Idea
                </>
              )}
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="mt-5">
            <div className="progress" style={{ height: '8px' }}>
              <div
                className="progress-bar bg-primary"
                role="progressbar"
                style={{ width: '20%' }}
                aria-valuenow="20"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <div className="d-flex justify-content-between mt-2">
              <small className="text-muted">Submit Idea</small>
              <small className="text-muted">Problem Refinement</small>
              <small className="text-muted">Market Research</small>
              <small className="text-muted">Business Model</small>
              <small className="text-muted">Pitch Deck</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaInput;
