import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CoFounderMatching = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [filters, setFilters] = useState({
    skills: [],
    experience: 'any',
    location: 'any',
    availability: 'any'
  });
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

  const getProfiles = () => {
    if (!businessPlan?.leanCanvas) return [];
    
    // Generate profiles based on the business plan's key activities and resources
    const keyActivities = businessPlan.leanCanvas.keyActivities || [];
    const keyResources = businessPlan.leanCanvas.keyResources || [];
    const customerSegments = businessPlan.leanCanvas.customerSegments || [];
    
    return [
      {
        id: 1,
        name: 'AI-Generated Match #1',
        title: 'Technical Co-founder',
        location: 'Remote',
        experience: '5+ years',
        skills: keyActivities.slice(0, 5) || ['Full-Stack Development', 'AI/ML', 'Cloud Architecture'],
        availability: 'Part-time',
        matchScore: 95,
        bio: `Perfect match for your ${businessPlan.pitchDeckSummary?.title || 'startup'} idea. Specialized in the technical requirements identified by AI analysis.`,
        previousStartups: 2,
        education: 'Computer Science',
        lookingFor: `Technical co-founder for ${businessPlan.pitchDeckSummary?.title || 'your startup'}`,
        image: 'https://via.placeholder.com/150'
      },
      {
        id: 2,
        name: 'AI-Generated Match #2',
        title: 'Business Co-founder',
        location: 'Remote',
        experience: '7+ years',
        skills: keyResources.slice(0, 5) || ['Business Strategy', 'Market Analysis', 'Operations'],
        availability: 'Full-time',
        matchScore: 88,
        bio: `Ideal business partner for your ${businessPlan.pitchDeckSummary?.title || 'startup'}. Experienced in the market segments identified by AI analysis.`,
        previousStartups: 3,
        education: 'Business Administration',
        lookingFor: `Business co-founder for ${businessPlan.pitchDeckSummary?.title || 'your startup'}`,
        image: 'https://via.placeholder.com/150'
      },
      {
        id: 3,
        name: 'AI-Generated Match #3',
        title: 'Design Co-founder',
        location: 'Remote',
        experience: '4+ years',
        skills: ['UX/UI Design', 'User Research', 'Prototyping', 'Design Systems'],
        availability: 'Part-time',
        matchScore: 92,
        bio: `Perfect design partner for your ${businessPlan.pitchDeckSummary?.title || 'startup'}. Specialized in user experience for your target market.`,
        previousStartups: 1,
        education: 'Design',
        lookingFor: `Design co-founder for ${businessPlan.pitchDeckSummary?.title || 'your startup'}`,
        image: 'https://via.placeholder.com/150'
      },
      {
        id: 4,
        name: 'AI-Generated Match #4',
        title: 'Marketing Co-founder',
        location: 'Remote',
        experience: '6+ years',
        skills: ['Digital Marketing', 'Growth Hacking', 'Content Strategy', 'SEO'],
        availability: 'Full-time',
        matchScore: 85,
        bio: `Marketing expert for your ${businessPlan.pitchDeckSummary?.title || 'startup'}. Experienced in reaching your target customer segments.`,
        previousStartups: 2,
        education: 'Marketing',
        lookingFor: `Marketing co-founder for ${businessPlan.pitchDeckSummary?.title || 'your startup'}`,
        image: 'https://via.placeholder.com/150'
      },
      {
        id: 5,
        name: 'AI-Generated Match #5',
        title: 'Data & Analytics Co-founder',
        location: 'Remote',
        experience: '3+ years',
        skills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL', 'Statistics'],
        availability: 'Part-time',
        matchScore: 90,
        bio: `Data expert for your ${businessPlan.pitchDeckSummary?.title || 'startup'}. Specialized in the analytics needs identified by AI analysis.`,
        previousStartups: 1,
        education: 'Data Science',
        lookingFor: `Data co-founder for ${businessPlan.pitchDeckSummary?.title || 'your startup'}`,
        image: 'https://via.placeholder.com/150'
      }
    ];
  };

  const profiles = getProfiles();

  const skills = [
    'React', 'Node.js', 'Python', 'JavaScript', 'AWS', 'Machine Learning',
    'Product Management', 'User Research', 'Design', 'Marketing', 'Sales',
    'Data Analysis', 'Business Strategy', 'Fundraising', 'Operations'
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSkillToggle = (skill) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const renderProfileCard = (profile) => (
    <div key={profile.id} className="col-lg-6 mb-4">
      <div 
        className={`card h-100 ${selectedProfile?.id === profile.id ? 'border-primary shadow' : ''}`}
        style={{ cursor: 'pointer' }}
        onClick={() => setSelectedProfile(profile)}
      >
        <div className="card-body">
          <div className="d-flex align-items-start mb-3">
            <img
              src={profile.image}
              alt={profile.name}
              className="rounded-circle me-3"
              style={{ width: '60px', height: '60px' }}
            />
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="card-title mb-1">{profile.name}</h5>
                  <p className="text-muted mb-1">{profile.title}</p>
                  <p className="text-muted small">{profile.location}</p>
                </div>
                <div className="text-end">
                  <div className="badge bg-success mb-1">{profile.matchScore}% Match</div>
                  <div className="small text-muted">{profile.availability}</div>
                </div>
              </div>
            </div>
          </div>
          
          <p className="card-text small mb-3">{profile.bio}</p>
          
          <div className="mb-3">
            <h6 className="small">Skills:</h6>
            <div className="d-flex flex-wrap gap-1">
              {profile.skills.slice(0, 4).map((skill, index) => (
                <span key={index} className="badge bg-light text-dark small">
                  {skill}
                </span>
              ))}
              {profile.skills.length > 4 && (
                <span className="badge bg-secondary small">
                  +{profile.skills.length - 4} more
                </span>
              )}
            </div>
          </div>
          
          <div className="row small text-muted">
            <div className="col-6">
              <i className="fas fa-briefcase me-1"></i>
              {profile.experience}
            </div>
            <div className="col-6">
              <i className="fas fa-rocket me-1"></i>
              {profile.previousStartups} startups
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfileDetail = () => {
    if (!selectedProfile) return null;

    return (
      <div className="card">
        <div className="card-body">
          <div className="d-flex align-items-center mb-4">
            <img
              src={selectedProfile.image}
              alt={selectedProfile.name}
              className="rounded-circle me-3"
              style={{ width: '80px', height: '80px' }}
            />
            <div>
              <h4 className="mb-1">{selectedProfile.name}</h4>
              <p className="text-muted mb-1">{selectedProfile.title}</p>
              <p className="text-muted small">{selectedProfile.location}</p>
            </div>
            <div className="ms-auto">
              <div className="badge bg-success fs-6">{selectedProfile.matchScore}% Match</div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <h6>About</h6>
              <p className="text-muted">{selectedProfile.bio}</p>
              
              <h6>Education</h6>
              <p className="text-muted">{selectedProfile.education}</p>
              
              <h6>Looking For</h6>
              <p className="text-muted">{selectedProfile.lookingFor}</p>
            </div>
            
            <div className="col-md-6">
              <h6>Skills</h6>
              <div className="d-flex flex-wrap gap-1 mb-3">
                {selectedProfile.skills.map((skill, index) => (
                  <span key={index} className="badge bg-primary">
                    {skill}
                  </span>
                ))}
              </div>
              
              <h6>Experience</h6>
              <p className="text-muted">{selectedProfile.experience} in the field</p>
              
              <h6>Previous Startups</h6>
              <p className="text-muted">{selectedProfile.previousStartups} companies</p>
            </div>
          </div>

          <div className="mt-4 d-flex gap-2">
            <button className="btn btn-primary">
              <i className="fas fa-envelope me-2"></i>
              Send Message
            </button>
            <button className="btn btn-outline-primary">
              <i className="fas fa-calendar me-2"></i>
              Schedule Call
            </button>
            <button className="btn btn-outline-secondary">
              <i className="fas fa-heart me-2"></i>
              Save Profile
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderFilters = () => (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">Filter Profiles</h5>
        
        <div className="row">
          <div className="col-md-3 mb-3">
            <label className="form-label">Experience Level</label>
            <select 
              className="form-select"
              value={filters.experience}
              onChange={(e) => handleFilterChange('experience', e.target.value)}
            >
              <option value="any">Any</option>
              <option value="entry">Entry Level (0-2 years)</option>
              <option value="mid">Mid Level (3-5 years)</option>
              <option value="senior">Senior Level (6+ years)</option>
            </select>
          </div>
          
          <div className="col-md-3 mb-3">
            <label className="form-label">Location</label>
            <select 
              className="form-select"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <option value="any">Any</option>
              <option value="remote">Remote</option>
              <option value="sf">San Francisco</option>
              <option value="ny">New York</option>
              <option value="austin">Austin</option>
            </select>
          </div>
          
          <div className="col-md-3 mb-3">
            <label className="form-label">Availability</label>
            <select 
              className="form-select"
              value={filters.availability}
              onChange={(e) => handleFilterChange('availability', e.target.value)}
            >
              <option value="any">Any</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
            </select>
          </div>
          
          <div className="col-md-3 mb-3">
            <label className="form-label">Match Score</label>
            <select className="form-select">
              <option value="any">Any</option>
              <option value="90+">90%+</option>
              <option value="80+">80%+</option>
              <option value="70+">70%+</option>
            </select>
          </div>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Skills</label>
          <div className="d-flex flex-wrap gap-1">
            {skills.map((skill) => (
              <button
                key={skill}
                className={`btn btn-sm ${
                  filters.skills.includes(skill) ? 'btn-primary' : 'btn-outline-primary'
                }`}
                onClick={() => handleSkillToggle(skill)}
              >
                {skill}
              </button>
            ))}
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
            <h4>Loading co-founder matches...</h4>
            <p className="text-muted">AI is analyzing your business plan to find the perfect co-founder matches</p>
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
              Find Your <span className="text-gradient">Co-Founder</span>
            </h1>
            <p className="lead">
              Connect with talented individuals who share your vision
            </p>
          </div>

          {/* Navigation Tabs */}
          <ul className="nav nav-tabs mb-4" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'browse' ? 'active' : ''}`}
                onClick={() => setActiveTab('browse')}
              >
                <i className="fas fa-search me-2"></i>
                Browse Profiles
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'matches' ? 'active' : ''}`}
                onClick={() => setActiveTab('matches')}
              >
                <i className="fas fa-heart me-2"></i>
                My Matches
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'create' ? 'active' : ''}`}
                onClick={() => setActiveTab('create')}
              >
                <i className="fas fa-plus me-2"></i>
                Create Profile
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'browse' && (
              <div>
                {renderFilters()}
                <div className="row">
                  {profiles.map(renderProfileCard)}
                </div>
                {selectedProfile && (
                  <div className="mt-4">
                    {renderProfileDetail()}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'matches' && (
              <div className="text-center py-5">
                <i className="fas fa-heart fa-3x text-muted mb-3"></i>
                <h5>Your Matches</h5>
                <p className="text-muted">No matches yet. Complete your profile to get better matches!</p>
                <button className="btn btn-primary">
                  Complete Profile
                </button>
              </div>
            )}
            
            {activeTab === 'create' && (
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title mb-4">Create Your Co-Founder Profile</h5>
                  <form>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Full Name</label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Title/Role</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Location</label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Experience Level</label>
                        <select className="form-select">
                          <option>Select experience level</option>
                          <option>Entry Level (0-2 years)</option>
                          <option>Mid Level (3-5 years)</option>
                          <option>Senior Level (6+ years)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Skills</label>
                      <div className="d-flex flex-wrap gap-1">
                        {skills.slice(0, 8).map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Bio</label>
                      <textarea className="form-control" rows="4" placeholder="Tell us about yourself, your experience, and what you're looking for in a co-founder..."></textarea>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">What are you looking for?</label>
                      <textarea className="form-control" rows="3" placeholder="Describe the type of co-founder and startup you're interested in..."></textarea>
                    </div>
                    
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-save me-2"></i>
                      Create Profile
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="text-center mt-5">
            <button
              className="btn btn-primary btn-lg me-3"
              onClick={() => navigate('/pitch-deck')}
            >
              <i className="fas fa-arrow-right me-2"></i>
              Continue to Pitch Deck
            </button>
            <button className="btn btn-outline-primary btn-lg">
              <i className="fas fa-save me-2"></i>
              Save Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoFounderMatching;
