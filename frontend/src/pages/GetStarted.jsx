import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const GetStarted = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    major: '',
    interests: [],
    experience: 'beginner'
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const interestOptions = [
    'Technology', 'Business', 'Design', 'Marketing', 'Finance', 'Healthcare',
    'Education', 'Sustainability', 'Social Impact', 'E-commerce', 'AI/ML', 'Mobile Apps'
  ];

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner - New to startups' },
    { value: 'intermediate', label: 'Intermediate - Some experience' },
    { value: 'advanced', label: 'Advanced - Experienced entrepreneur' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleInterestToggle = (interest) => {
    setFormData({
      ...formData,
      interests: formData.interests.includes(interest)
        ? formData.interests.filter(i => i !== interest)
        : [...formData.interests, interest]
    });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiService.register(formData);
      
      if (response.success) {
        // Store user data and token in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        
        // Dispatch custom event to update navbar
        window.dispatchEvent(new CustomEvent('userLogin'));
        
        navigate('/dashboard');
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div>
      <h4 className="mb-4">Personal Information</h4>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="firstName" className="form-label">First Name</label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="lastName" className="form-label">Last Name</label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
            required
          />
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email Address</label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h4 className="mb-4">Academic Background</h4>
      <div className="mb-3">
        <label htmlFor="university" className="form-label">University/Institution</label>
        <input
          type="text"
          className="form-control"
          id="university"
          name="university"
          value={formData.university}
          onChange={handleChange}
          placeholder="Enter your university name"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="major" className="form-label">Major/Field of Study</label>
        <input
          type="text"
          className="form-control"
          id="major"
          name="major"
          value={formData.major}
          onChange={handleChange}
          placeholder="Enter your major"
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Startup Experience</label>
        {experienceLevels.map((level) => (
          <div key={level.value} className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="experience"
              id={level.value}
              value={level.value}
              checked={formData.experience === level.value}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor={level.value}>
              {level.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <h4 className="mb-4">Interests & Goals</h4>
      <div className="mb-3">
        <label className="form-label">What are you interested in? (Select all that apply)</label>
        <div className="row">
          {interestOptions.map((interest) => (
            <div key={interest} className="col-md-4 col-sm-6 mb-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={interest}
                  checked={formData.interests.includes(interest)}
                  onChange={() => handleInterestToggle(interest)}
                />
                <label className="form-check-label" htmlFor={interest}>
                  {interest}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="alert alert-info">
        <i className="fas fa-info-circle me-2"></i>
        <strong>What happens next?</strong>
        <ul className="mb-0 mt-2">
          <li>We'll create your personalized dashboard</li>
          <li>You can start submitting your startup ideas</li>
          <li>We'll help you find co-founders and validate your ideas</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h1 className="h3 mb-3">
                    <i className="fas fa-rocket text-primary me-2"></i>
                    Join ACM Co-Founder
                  </h1>
                  <p className="text-muted">Start your entrepreneurial journey today</p>
                </div>

                {/* Progress Steps */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="text-center">
                        <div className={`rounded-circle d-inline-flex align-items-center justify-content-center ${
                          step <= currentStep ? 'bg-primary text-white' : 'bg-light text-muted'
                        }`} style={{ width: '40px', height: '40px' }}>
                          {step}
                        </div>
                        <div className="mt-2">
                          <small className={step <= currentStep ? 'text-primary fw-bold' : 'text-muted'}>
                            {step === 1 ? 'Personal' : step === 2 ? 'Academic' : 'Interests'}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {currentStep === 1 && renderStep1()}
                  {currentStep === 2 && renderStep2()}
                  {currentStep === 3 && renderStep3()}

                  <div className="d-flex justify-content-between mt-4">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handlePrevious}
                      disabled={currentStep === 1}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      Previous
                    </button>
                    
                    {currentStep < 3 ? (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleNext}
                      >
                        Next
                        <i className="fas fa-arrow-right ms-2"></i>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-success"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-check me-2"></i>
                            Create Account
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>

                <div className="text-center mt-4">
                  <p className="mb-0">Already have an account?</p>
                  <Link to="/login" className="text-decoration-none">
                    Sign in here
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
