import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

// Profile Form Component
const ProfileForm = ({ profile, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    title: profile?.title || '',
    location: profile?.location || '',
    experience: profile?.experience || '',
    skills: profile?.skills || [],
    availability: profile?.availability || '',
    bio: profile?.bio || '',
    education: profile?.education || '',
    lookingFor: profile?.lookingFor || '',
    previousStartups: profile?.previousStartups || 0,
    image: profile?.image || ''
  });

  const availableSkills = [
    'React', 'Node.js', 'Python', 'JavaScript', 'AWS', 'Machine Learning',
    'Product Management', 'User Research', 'Design', 'Marketing', 'Sales',
    'Data Analysis', 'Business Strategy', 'Fundraising', 'Operations',
    'Full-Stack Development', 'AI/ML', 'Cloud Architecture', 'DevOps',
    'UX/UI Design', 'User Research', 'Prototyping', 'Design Systems',
    'Digital Marketing', 'Growth Hacking', 'Content Strategy', 'SEO'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Full Name *</label>
          <input 
            type="text" 
            className="form-control" 
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Title/Role *</label>
          <input 
            type="text" 
            className="form-control" 
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Location</label>
          <input 
            type="text" 
            className="form-control" 
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="e.g., Remote, San Francisco, New York"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Experience Level</label>
          <select 
            className="form-select"
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
          >
            <option value="">Select experience level</option>
            <option value="Entry Level (0-2 years)">Entry Level (0-2 years)</option>
            <option value="Mid Level (3-5 years)">Mid Level (3-5 years)</option>
            <option value="Senior Level (6+ years)">Senior Level (6+ years)</option>
          </select>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Availability</label>
          <select 
            className="form-select"
            value={formData.availability}
            onChange={(e) => handleInputChange('availability', e.target.value)}
          >
            <option value="">Select availability</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Consulting">Consulting</option>
          </select>
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Previous Startups</label>
          <input 
            type="number" 
            className="form-control" 
            value={formData.previousStartups}
            onChange={(e) => handleInputChange('previousStartups', parseInt(e.target.value) || 0)}
            min="0"
          />
        </div>
      </div>
      
      <div className="mb-3">
        <label className="form-label">Skills *</label>
        <div className="d-flex flex-wrap gap-1">
          {availableSkills.map((skill) => (
            <button
              key={skill}
              type="button"
              className={`btn btn-sm ${
                formData.skills.includes(skill) ? 'btn-primary' : 'btn-outline-primary'
              }`}
              onClick={() => handleSkillToggle(skill)}
            >
              {skill}
            </button>
          ))}
        </div>
        <small className="text-muted">Selected: {formData.skills.length} skills</small>
      </div>

      <div className="mb-3">
        <label className="form-label">Education</label>
        <input 
          type="text" 
          className="form-control" 
          value={formData.education}
          onChange={(e) => handleInputChange('education', e.target.value)}
          placeholder="e.g., Computer Science, Business Administration"
        />
      </div>
      
      <div className="mb-3">
        <label className="form-label">Bio</label>
        <textarea 
          className="form-control" 
          rows="4" 
          value={formData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          placeholder="Tell us about yourself, your experience, and what you're looking for in a co-founder..."
        />
      </div>
      
      <div className="mb-3">
        <label className="form-label">What are you looking for?</label>
        <textarea 
          className="form-control" 
          rows="3" 
          value={formData.lookingFor}
          onChange={(e) => handleInputChange('lookingFor', e.target.value)}
          placeholder="Describe the type of co-founder and startup you're interested in..."
        />
      </div>
      
      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={loading || !formData.name || !formData.title || formData.skills.length === 0}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            {profile ? 'Updating...' : 'Creating...'}
          </>
        ) : (
          <>
            <i className="fas fa-save me-2"></i>
            {profile ? 'Update Profile' : 'Create Profile'}
          </>
        )}
      </button>
    </form>
  );
};

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
  const [profiles, setProfiles] = useState([]);
  const [matches, setMatches] = useState([]);
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedProfileForCall, setSelectedProfileForCall] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load business plan from localStorage
    const storedBusinessPlan = localStorage.getItem('currentBusinessPlan');
    if (storedBusinessPlan) {
      const businessPlanData = JSON.parse(storedBusinessPlan);
      setBusinessPlan(businessPlanData);
    }

      // Load co-founder profiles
      await loadProfiles();
      
      // Load user's profile
      await loadMyProfile();
      
      // Load saved profiles
      await loadSavedProfiles();
      
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load co-founder data');
    } finally {
    setLoading(false);
    }
  };

  const loadProfiles = async () => {
    try {
      const response = await apiService.getCofounders();
      if (response.success) {
        setProfiles(response.data.cofounders);
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
    }
  };

  const loadMyProfile = async () => {
    try {
      const response = await apiService.getMyCofounderProfile();
      if (response.success && response.data) {
        setMyProfile(response.data);
      }
    } catch (error) {
      console.error('Error loading my profile:', error);
    }
  };

  const loadSavedProfiles = async () => {
    if (!businessPlan?._id) return;
    
    try {
      const response = await apiService.getSavedCofounderProfiles(businessPlan._id);
      if (response.success) {
        setSavedProfiles(response.data.savedProfiles);
      }
    } catch (error) {
      console.error('Error loading saved profiles:', error);
    }
  };

  const saveProfile = async (profileId) => {
    if (!businessPlan?._id) {
      setError('No business plan found. Please generate a business plan first.');
      return;
    }

    try {
      const response = await apiService.saveCofounderProfile(profileId, businessPlan._id);
      if (response.success) {
        await loadSavedProfiles(); // Refresh saved profiles
        alert('Profile saved to favorites!');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      if (error.message?.includes('already saved')) {
        alert('This profile is already in your favorites!');
      } else {
        setError('Failed to save profile. Please try again.');
      }
    }
  };

  const removeProfile = async (profileId) => {
    if (!businessPlan?._id) {
      setError('No business plan found. Please generate a business plan first.');
      return;
    }

    try {
      const response = await apiService.removeCofounderProfile(profileId, businessPlan._id);
      if (response.success) {
        await loadSavedProfiles(); // Refresh saved profiles
        alert('Profile removed from favorites!');
      }
    } catch (error) {
      console.error('Error removing profile:', error);
      setError('Failed to remove profile. Please try again.');
    }
  };

  const scheduleCall = async (profileId, preferredDate, preferredTime, message) => {
    if (!businessPlan?._id) {
      setError('No business plan found. Please generate a business plan first.');
      return;
    }

    try {
      const response = await apiService.scheduleCofounderCall(
        profileId, 
        businessPlan._id, 
        preferredDate, 
        preferredTime, 
        message
      );
      if (response.success) {
        alert('Call request sent successfully!');
        setShowScheduleModal(false);
        setSelectedProfileForCall(null);
      }
    } catch (error) {
      console.error('Error scheduling call:', error);
      setError('Failed to schedule call. Please try again.');
    }
  };

  const isProfileSaved = (profileId) => {
    return savedProfiles.some(saved => 
      saved._id === profileId || saved.id === profileId
    );
  };

  const generateMatches = async () => {
    if (!businessPlan?._id) {
      setError('No business plan found. Please generate a business plan first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiService.findCofounderMatches(businessPlan._id);
      if (response.success) {
        setMatches(response.data.matches);
        setActiveTab('matches');
      }
    } catch (error) {
      console.error('Error generating matches:', error);
      setError('Failed to generate matches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async () => {
    if (!businessPlan?._id) {
      setError('No business plan found. Please generate a business plan first.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await apiService.saveCofounderProgress(
        businessPlan._id,
        matches,
        [] // saved profiles - could be enhanced later
      );
      
      if (response.success) {
        // Update localStorage with the updated business plan
        localStorage.setItem('currentBusinessPlan', JSON.stringify(response.data));
        setBusinessPlan(response.data);
        alert('Progress saved successfully!');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      setError('Failed to save progress. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const createProfile = async (profileData) => {
    setLoading(true);
    setError('');

    try {
      const response = await apiService.createCofounderProfile(profileData);
      if (response.success) {
        setMyProfile(response.data);
        await loadProfiles(); // Refresh the profiles list
        alert('Profile created successfully!');
        setActiveTab('browse');
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      setError('Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    if (!myProfile?._id) return;

    setLoading(true);
    setError('');

    try {
      const response = await apiService.updateCofounderProfile(myProfile._id, profileData);
      if (response.success) {
        setMyProfile(response.data);
        await loadProfiles(); // Refresh the profiles list
        alert('Profile updated successfully!');
        setActiveTab('browse');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter profiles based on current filters
  const filteredProfiles = profiles.filter(profile => {
    if (filters.experience !== 'any' && !profile.experience.toLowerCase().includes(filters.experience)) return false;
    if (filters.location !== 'any' && profile.location !== filters.location) return false;
    if (filters.availability !== 'any' && profile.availability !== filters.availability) return false;
    if (filters.skills.length > 0) {
      const hasMatchingSkill = profile.skills.some(skill => 
        filters.skills.some(filterSkill => 
          skill.toLowerCase().includes(filterSkill.toLowerCase())
        )
      );
      if (!hasMatchingSkill) return false;
    }
    return true;
  });

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
    <div key={profile._id || profile.id} className="col-lg-6 mb-4">
      <div 
        className={`card h-100 ${selectedProfile?._id === profile._id || selectedProfile?.id === profile.id ? 'border-primary shadow' : ''}`}
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
                  {profile.matchScore && (
                  <div className="badge bg-success mb-1">{profile.matchScore}% Match</div>
                  )}
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
          
          <div className="row small text-muted mb-2">
            <div className="col-6">
              <i className="fas fa-briefcase me-1"></i>
              {profile.experience}
            </div>
            <div className="col-6">
              <i className="fas fa-rocket me-1"></i>
              {profile.previousStartups || 0} startups
            </div>
          </div>
          
          <div className="d-flex justify-content-end">
            {isProfileSaved(profile._id || profile.id) ? (
              <button 
                className="btn btn-sm btn-outline-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  removeProfile(profile._id || profile.id);
                }}
                title="Remove from favorites"
              >
                <i className="fas fa-heart-broken"></i>
              </button>
            ) : (
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  saveProfile(profile._id || profile.id);
                }}
                title="Save to favorites"
              >
                <i className="fas fa-heart"></i>
              </button>
            )}
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
            <button 
              className="btn btn-outline-primary"
              onClick={() => {
                setSelectedProfileForCall(selectedProfile);
                setShowScheduleModal(true);
              }}
            >
              <i className="fas fa-calendar me-2"></i>
              Schedule Call
            </button>
            {isProfileSaved(selectedProfile._id || selectedProfile.id) ? (
              <button 
                className="btn btn-outline-danger"
                onClick={() => removeProfile(selectedProfile._id || selectedProfile.id)}
              >
                <i className="fas fa-heart-broken me-2"></i>
                Remove from Favorites
              </button>
            ) : (
              <button 
                className="btn btn-outline-secondary"
                onClick={() => saveProfile(selectedProfile._id || selectedProfile.id)}
              >
              <i className="fas fa-heart me-2"></i>
              Save Profile
            </button>
            )}
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
                {filteredProfiles.length > 0 ? (
                <div className="row">
                    {filteredProfiles.map(renderProfileCard)}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="fas fa-users fa-3x text-muted mb-3"></i>
                    <h5>No Profiles Found</h5>
                    <p className="text-muted">No co-founder profiles match your current filters.</p>
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => setFilters({ skills: [], experience: 'any', location: 'any', availability: 'any' })}
                    >
                      Clear Filters
                    </button>
                </div>
                )}
                {selectedProfile && (
                  <div className="mt-4">
                    {renderProfileDetail()}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'matches' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5>My Matches</h5>
                  <button 
                    className="btn btn-outline-primary"
                    onClick={generateMatches}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Generating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sync me-2"></i>
                        Generate New Matches
                      </>
                    )}
                  </button>
                </div>

                {/* Saved Profiles Section */}
                {savedProfiles.length > 0 && (
                  <div className="mb-5">
                    <h6 className="text-primary mb-3">
                      <i className="fas fa-heart me-2"></i>
                      Saved Profiles ({savedProfiles.length})
                    </h6>
                    <div className="row">
                      {savedProfiles.map(renderProfileCard)}
                    </div>
                  </div>
                )}

                {/* Generated Matches Section */}
                {matches.length > 0 && (
                  <div>
                    <h6 className="text-success mb-3">
                      <i className="fas fa-magic me-2"></i>
                      AI-Generated Matches ({matches.length})
                    </h6>
                    <div className="row">
                      {matches.map(renderProfileCard)}
                    </div>
                  </div>
                )}

                {/* No matches or saved profiles */}
                {savedProfiles.length === 0 && matches.length === 0 && (
              <div className="text-center py-5">
                <i className="fas fa-heart fa-3x text-muted mb-3"></i>
                    <h5>No Matches Yet</h5>
                    <p className="text-muted">Generate matches based on your business plan or save profiles from the Browse tab!</p>
                    <button 
                      className="btn btn-primary"
                      onClick={generateMatches}
                      disabled={loading || !businessPlan}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Generating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-magic me-2"></i>
                          Generate Matches
                        </>
                      )}
                </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'create' && (
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title mb-4">
                    {myProfile ? 'Edit Your Co-Founder Profile' : 'Create Your Co-Founder Profile'}
                  </h5>
                  <ProfileForm 
                    profile={myProfile}
                    onSubmit={myProfile ? updateProfile : createProfile}
                    loading={loading}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="alert alert-danger mt-4" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="text-center mt-5">
            <button
              className="btn btn-primary btn-lg me-3"
              onClick={() => navigate('/pitch-deck')}
            >
              <i className="fas fa-arrow-right me-2"></i>
              Continue to Pitch Deck
            </button>
            <button 
              className="btn btn-outline-primary btn-lg"
              onClick={saveProgress}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : (
                <>
              <i className="fas fa-save me-2"></i>
              Save Progress
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Call Modal */}
      {showScheduleModal && selectedProfileForCall && (
        <ScheduleCallModal
          profile={selectedProfileForCall}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedProfileForCall(null);
          }}
          onSchedule={scheduleCall}
        />
      )}
    </div>
  );
};

// Schedule Call Modal Component
const ScheduleCallModal = ({ profile, onClose, onSchedule }) => {
  const [formData, setFormData] = useState({
    preferredDate: new Date().toISOString().split('T')[0],
    preferredTime: '10:00',
    message: `Hi ${profile.name}, I would like to schedule a call to discuss potential collaboration on my startup idea.`
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSchedule(profile._id || profile.id, formData.preferredDate, formData.preferredTime, formData.message);
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-calendar me-2"></i>
              Schedule Call with {profile.name}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Preferred Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.preferredDate}
                    onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Preferred Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={formData.preferredTime}
                    onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Add a personal message to your call request..."
                  required
                />
              </div>

              <div className="alert alert-info">
                <i className="fas fa-info-circle me-2"></i>
                <strong>Note:</strong> This will send a call request to {profile.name}. They will be notified and can respond with their availability.
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-paper-plane me-2"></i>
                Send Call Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CoFounderMatching;
