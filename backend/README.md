# ACM Co-Founder Platform - Backend API

A Node.js/Express backend API that powers the ACM Co-Founder platform, providing AI-powered business plan generation, co-founder matching, and validation tools.

## Features

### 🤖 AI-Powered Business Plan Generation
- Generate comprehensive business plans from raw ideas
- Support for Google Gemini and OpenAI APIs
- Problem statement refinement
- Market research and analysis
- Financial projections

### 👥 Co-Founder Matching
- Mock database of potential co-founders
- Skills-based matching algorithm
- Profile management
- Skills suggestions based on ideas

### 🧪 Validation Tools
- Survey question generation
- Landing page content creation
- Ad campaign simulation
- A/B testing suggestions

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **AI Integration**: Google Gemini API, OpenAI API
- **Security**: Helmet, CORS, Rate Limiting
- **Data**: JSON files (mock data)

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn
- Google Gemini API key or OpenAI API key

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Edit `.env` file and add your API keys:
```env
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Ideas & Business Plans
- `POST /api/ideas/generate` - Generate business plan from idea
- `POST /api/ideas/validation/:type` - Generate validation content
- `POST /api/ideas/financials` - Calculate financial projections
- `POST /api/ideas/ad-simulation` - Simulate ad campaign

### Co-Founders
- `GET /api/cofounders` - Get all co-founders with filtering
- `POST /api/cofounders/match` - Find co-founder matches
- `GET /api/cofounders/:id` - Get co-founder by ID
- `POST /api/cofounders/skills-suggestions` - Get skills suggestions
- `POST /api/cofounders` - Create co-founder profile

### Validation
- `POST /api/validation/survey` - Generate survey questions
- `POST /api/validation/landing-page` - Generate landing page content
- `POST /api/validation/ad-campaign` - Generate ad campaign
- `POST /api/validation/ab-test` - Generate A/B test suggestions
- `GET /api/validation/templates` - Get validation templates

## Example Usage

### Generate Business Plan
```javascript
const response = await fetch('http://localhost:5000/api/ideas/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    idea: "An app for students to find cheap food nearby",
    apiProvider: "gemini"
  })
});

const data = await response.json();
console.log(data.data);
```

### Find Co-Founder Matches
```javascript
const response = await fetch('http://localhost:5000/api/cofounders/match', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    requiredSkills: ["React", "Node.js", "JavaScript"],
    userSkills: ["Marketing", "Business"],
    idea: "Student food app"
  })
});

const data = await response.json();
console.log(data.data.matches);
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment | No (default: development) |
| `FRONTEND_URL` | Frontend URL for CORS | No (default: http://localhost:3000) |
| `GOOGLE_GEMINI_API_KEY` | Google Gemini API key | Yes (if using Gemini) |
| `OPENAI_API_KEY` | OpenAI API key | Yes (if using OpenAI) |

## Project Structure

```
backend/
├── routes/
│   ├── ideaRoutes.js          # Business plan and idea endpoints
│   ├── cofounderRoutes.js     # Co-founder matching endpoints
│   └── validationRoutes.js    # Validation tools endpoints
├── services/
│   └── aiService.js           # AI API integration service
├── data/
│   └── mockCofounders.js      # Mock co-founder database
├── server.js                  # Main server file
├── package.json
└── README.md
```

## Error Handling

The API includes comprehensive error handling:
- Input validation
- API rate limiting
- CORS protection
- Security headers
- Detailed error messages

## Rate Limiting

- 100 requests per 15 minutes per IP
- Configurable via environment variables

## Security Features

- Helmet for security headers
- CORS protection
- Rate limiting
- Input validation
- Error sanitization

## Development

### Running in Development Mode
```bash
npm run dev
```

### Running in Production
```bash
npm start
```

### Adding New Endpoints

1. Create route handler in appropriate file in `routes/`
2. Add service logic in `services/` if needed
3. Update this README with new endpoint documentation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
