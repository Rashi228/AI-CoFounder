# 🚀 ACM Co-Founder Platform

An AI-powered platform that acts like a virtual startup mentor for students. Transform raw ideas into validated, investment-ready startups with comprehensive business planning, co-founder matching, and validation tools.

## ✨ Features

### 🧠 AI-Powered Business Plan Generation
- **Idea Refinement**: Transform raw ideas into clear problem statements
- **Market Research**: Automated market analysis and competitor research
- **Business Models**: Choose and customize revenue models
- **Financial Projections**: Generate realistic financial models
- **Pitch Deck Generation**: Create professional pitch decks

### 👥 Co-Founder Matching
- **Skills-Based Matching**: Find co-founders with complementary skills
- **Profile Browsing**: Browse potential co-founder profiles
- **Smart Suggestions**: AI-powered co-founder recommendations
- **Skills Analysis**: Get suggestions for needed skills

### 🧪 Validation Tools
- **Survey Generation**: Create customer validation surveys
- **Landing Page Builder**: Generate landing page content
- **Ad Campaign Simulation**: Test marketing strategies
- **A/B Testing**: Get testing suggestions and templates

### 📊 Dashboard & Analytics
- **Progress Tracking**: Monitor your startup journey
- **Activity Feed**: Track recent activities and milestones
- **Next Steps**: AI-suggested next actions
- **Performance Metrics**: Track validation experiments

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Bootstrap 5 + Custom CSS
- **Routing**: React Router DOM
- **State Management**: React Hooks + Local Storage
- **Icons**: Font Awesome
- **Charts**: Chart.js + React Chart.js 2

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **AI Integration**: Google Gemini API, OpenAI API
- **Security**: Helmet, CORS, Rate Limiting
- **Data**: JSON files (mock data for demo)

## 🚀 Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn
- Google Gemini API key or OpenAI API key

### Installation

1. **Clone and setup**:
```bash
cd /Users/rishikaagrawal/Desktop/acm
chmod +x start.sh
./start.sh
```

2. **Configure API keys**:
```bash
# Edit backend/.env file
nano backend/.env

# Add your API keys:
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

3. **Start the platform**:
```bash
# Start both frontend and backend
./start.sh dev

# Or start manually:
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

4. **Access the platform**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/api/health

## 📁 Project Structure

```
acm/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   ├── services/       # API service layer
│   │   └── assets/         # Static assets
│   ├── public/             # Public assets
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── routes/             # API route handlers
│   ├── services/           # Business logic services
│   ├── data/               # Mock data and databases
│   └── server.js           # Main server file
├── start.sh                # Platform startup script
└── README.md
```

## 🔧 API Endpoints

### Business Plan Generation
- `POST /api/ideas/generate` - Generate business plan from idea
- `POST /api/ideas/financials` - Calculate financial projections
- `POST /api/ideas/ad-simulation` - Simulate ad campaigns

### Co-Founder Matching
- `GET /api/cofounders` - Get all co-founders
- `POST /api/cofounders/match` - Find co-founder matches
- `GET /api/cofounders/:id` - Get co-founder details

### Validation Tools
- `POST /api/validation/survey` - Generate survey questions
- `POST /api/validation/landing-page` - Generate landing page content
- `POST /api/validation/ad-campaign` - Generate ad campaigns

## 🎯 Usage Examples

### 1. Submit an Idea
1. Go to "Submit Idea" page
2. Enter your raw idea (text, voice, or image)
3. AI will analyze and refine your idea
4. Get comprehensive business plan

### 2. Find Co-Founders
1. Go to "Co-Founder Matching" page
2. Enter your skills and needed skills
3. Browse matching profiles
4. Connect with potential co-founders

### 3. Validate Your Idea
1. Go to "Validation Experiments" page
2. Generate survey questions
3. Create landing page content
4. Simulate ad campaigns

### 4. Generate Pitch Deck
1. Go to "Pitch Deck Generator" page
2. Choose deck style
3. Review and customize slides
4. Export as PDF

## 🔑 API Keys Setup

### Google Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to `backend/.env`:
```env
GOOGLE_GEMINI_API_KEY=your_key_here
```

### OpenAI API
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add to `backend/.env`:
```env
OPENAI_API_KEY=your_key_here
```

## 🎨 Customization

### Frontend Styling
The platform uses Bootstrap 5 with custom CSS variables. Main colors are defined in `frontend/src/index.css`:

```css
:root {
  --primary-color: #6366f1;
  --secondary-color: #8b5cf6;
  --accent-color: #06b6d4;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
}
```

### Adding New Pages
1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/App.jsx`
3. Update navigation in `frontend/src/components/Navbar.jsx`

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku)
```bash
cd backend
# Add start script to package.json
# Deploy with environment variables
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions:
- Check the documentation in each folder
- Review the API endpoints
- Check console logs for errors
- Ensure API keys are properly configured

## 🎉 Demo

The platform includes a complete demo with:
- Mock co-founder database
- Sample business plans
- Validation templates
- Financial projections
- Pitch deck examples

Start exploring by submitting an idea and following the guided workflow!

---

**Built with ❤️ for student entrepreneurs**
