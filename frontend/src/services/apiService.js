// API Service for connecting frontend to backend
const API_BASE_URL = 'http://localhost:5001/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Idea and Business Plan APIs
  async generateBusinessPlan(idea, apiProvider = 'gemini', additionalData = {}) {
    return this.request('/ideas/generate', {
      method: 'POST',
      body: JSON.stringify({ 
        idea, 
        apiProvider,
        ...additionalData
      }),
    });
  }

  async generateValidationContent(idea, type) {
    return this.request(`/ideas/validation/${type}`, {
      method: 'POST',
      body: JSON.stringify({ idea }),
    });
  }

  async calculateFinancials(financialData) {
    return this.request('/ideas/financials', {
      method: 'POST',
      body: JSON.stringify(financialData),
    });
  }

  async simulateAdCampaign(adData) {
    return this.request('/ideas/ad-simulation', {
      method: 'POST',
      body: JSON.stringify(adData),
    });
  }

  // Co-founder APIs
  async getCofounders(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.request(`/cofounders?${queryParams}`);
  }

  async findCofounderMatches(requiredSkills, userSkills = [], idea = '') {
    return this.request('/cofounders/match', {
      method: 'POST',
      body: JSON.stringify({ requiredSkills, userSkills, idea }),
    });
  }

  async getCofounderById(id) {
    return this.request(`/cofounders/${id}`);
  }

  async getSkillsSuggestions(idea) {
    return this.request('/cofounders/skills-suggestions', {
      method: 'POST',
      body: JSON.stringify({ idea }),
    });
  }

  async createCofounderProfile(profileData) {
    return this.request('/cofounders', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  // Validation APIs
  async generateSurvey(idea, targetAudience = '') {
    return this.request('/validation/survey', {
      method: 'POST',
      body: JSON.stringify({ idea, targetAudience }),
    });
  }

  async generateLandingPage(idea, valueProposition = '') {
    return this.request('/validation/landing-page', {
      method: 'POST',
      body: JSON.stringify({ idea, valueProposition }),
    });
  }

  async generateAdCampaign(idea, budget = 500, platform = 'google') {
    return this.request('/validation/ad-campaign', {
      method: 'POST',
      body: JSON.stringify({ idea, budget, platform }),
    });
  }

  async generateABTest(idea, element = '') {
    return this.request('/validation/ab-test', {
      method: 'POST',
      body: JSON.stringify({ idea, element }),
    });
  }

  async getValidationTemplates() {
    return this.request('/validation/templates');
  }

  // Authentication APIs
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async demoLogin() {
    return this.request('/auth/demo-login', {
      method: 'POST',
    });
  }

  async getProfile() {
    const token = localStorage.getItem('token');
    return this.request('/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Get form data (industries, stages, etc.)
  async getFormData() {
    return this.request('/ideas/form-data');
  }

  // Save business plan progress
  async saveProgress(businessPlanId, section, data) {
    return this.request('/ideas/save-progress', {
      method: 'POST',
      body: JSON.stringify({ businessPlanId, section, data }),
    });
  }

  // Generate financial projections
  async generateFinancialProjections(businessPlanId, projectionData) {
    return this.request('/ideas/financial-projections', {
      method: 'POST',
      body: JSON.stringify({ businessPlanId, ...projectionData }),
    });
  }

  // Generate market research
  async generateMarketResearch(businessPlanId) {
    return this.request('/ideas/market-research', {
      method: 'POST',
      body: JSON.stringify({ businessPlanId }),
    });
  }

  // Export business plan
  async exportBusinessPlan(businessPlanId, format = 'pdf') {
    return this.request('/ideas/export', {
      method: 'POST',
      body: JSON.stringify({ businessPlanId, format }),
    });
  }

  // Get dashboard data
  async getDashboardData() {
    return this.request('/ideas/dashboard');
  }

  // Co-founder matching methods
  async getCofounders(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/cofounders${queryParams ? `?${queryParams}` : ''}`);
  }

  async getCofounderById(id) {
    return this.request(`/cofounders/${id}`);
  }

  async createCofounderProfile(profileData) {
    return this.request('/cofounders', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  async updateCofounderProfile(id, profileData) {
    return this.request(`/cofounders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getMyCofounderProfile() {
    return this.request('/cofounders/profile/me');
  }

  async findCofounderMatches(businessPlanId) {
    return this.request('/cofounders/match', {
      method: 'POST',
      body: JSON.stringify({ businessPlanId }),
    });
  }

  async saveCofounderProgress(businessPlanId, matches, savedProfiles) {
    return this.request('/cofounders/save-progress', {
      method: 'POST',
      body: JSON.stringify({ businessPlanId, matches, savedProfiles }),
    });
  }

  async saveCofounderProfile(profileId, businessPlanId) {
    return this.request('/cofounders/save-profile', {
      method: 'POST',
      body: JSON.stringify({ profileId, businessPlanId }),
    });
  }

  async removeCofounderProfile(profileId, businessPlanId) {
    return this.request('/cofounders/remove-profile', {
      method: 'DELETE',
      body: JSON.stringify({ profileId, businessPlanId }),
    });
  }

  async getSavedCofounderProfiles(businessPlanId) {
    return this.request(`/cofounders/saved-profiles/${businessPlanId}`);
  }

  async scheduleCofounderCall(profileId, businessPlanId, preferredDate, preferredTime, message) {
    return this.request('/cofounders/schedule-call', {
      method: 'POST',
      body: JSON.stringify({ profileId, businessPlanId, preferredDate, preferredTime, message }),
    });
  }

  // Pitch Deck APIs
  async generatePitchDeck(businessPlanId, style = 'modern', customMessage = '') {
    return this.request('/ideas/pitch-deck', {
      method: 'POST',
      body: JSON.stringify({ businessPlanId, style, customMessage }),
    });
  }

  async updatePitchDeckSlide(businessPlanId, slideId, content) {
    return this.request(`/ideas/pitch-deck/${businessPlanId}/slide/${slideId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  async sharePitchDeck(businessPlanId, permissions = 'view') {
    return this.request(`/ideas/pitch-deck/${businessPlanId}/share`, {
      method: 'POST',
      body: JSON.stringify({ permissions }),
    });
  }

  async getSharedPitchDeck(shareToken) {
    return this.request(`/ideas/pitch-deck/shared/${shareToken}`);
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export default new ApiService();
