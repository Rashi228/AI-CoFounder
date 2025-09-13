# ACM Co-Founder Platform - Frontend

An AI-powered Co-Founder platform that acts like a virtual startup mentor for students. The system helps students transform their raw ideas into validated, investment-ready startups.

## Features

### 🚀 Core Platform Features
- **Idea Input**: Submit ideas via text, voice, or image upload
- **Problem Refinement**: AI-powered problem statement refinement
- **Market Research**: Automated market analysis and competitor research
- **Business Models**: Choose and customize revenue models
- **Financial Projections**: Generate realistic financial models
- **Validation Experiments**: AI-suggested experiments to validate assumptions
- **Co-Founder Matching**: Find compatible co-founders
- **Pitch Deck Generator**: Create professional pitch decks

### 🎨 UI/UX Features
- Modern, responsive design with Bootstrap 5
- Interactive dashboards and data visualization
- Multi-step wizards for guided processes
- Real-time progress tracking
- Mobile-friendly interface

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Bootstrap 5 + Custom CSS
- **Routing**: React Router DOM
- **Icons**: Font Awesome
- **Charts**: Chart.js + React Chart.js 2
- **Voice**: React Speech Kit

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── IdeaInput.jsx
│   │   ├── ProblemRefinement.jsx
│   │   ├── MarketResearch.jsx
│   │   ├── BusinessModels.jsx
│   │   ├── FinancialProjections.jsx
│   │   ├── ValidationExperiments.jsx
│   │   ├── CoFounderMatching.jsx
│   │   ├── PitchDeck.jsx
│   │   └── Dashboard.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── README.md
```

## Key Pages

### 1. Home Page
- Hero section with value proposition
- Feature overview
- How it works section
- Call-to-action buttons

### 2. Idea Input
- Multi-modal input (text, voice, image)
- Form validation
- Progress tracking
- Additional questions

### 3. Problem Refinement
- Step-by-step refinement process
- AI-powered suggestions
- Target audience analysis
- Validation scoring

### 4. Market Research
- Market size analysis
- Competitor comparison
- Customer segmentation
- Trend analysis

### 5. Business Models
- Model comparison
- Customization options
- Revenue projections
- Risk assessment

### 6. Financial Projections
- Multiple scenario planning
- Revenue/expense breakdowns
- Funding requirements
- Unit economics

### 7. Validation Experiments
- Experiment templates
- Custom experiment builder
- Progress tracking
- Resource templates

### 8. Co-Founder Matching
- Profile browsing
- Advanced filtering
- Match scoring
- Communication tools

### 9. Pitch Deck Generator
- Slide templates
- Custom styling
- Presentation mode
- Export options

### 10. Dashboard
- Progress overview
- Recent activity
- Next steps
- Quick actions

## Customization

### Styling
The app uses Bootstrap 5 with custom CSS variables for theming. Main color variables are defined in `src/index.css`:

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
1. Create a new component in `src/pages/`
2. Add the route to `src/App.jsx`
3. Update navigation in `src/components/Navbar.jsx`

## Future Enhancements

- Backend integration
- User authentication
- Real-time collaboration
- Advanced AI features
- Mobile app
- Analytics dashboard
- Payment integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team or create an issue in the repository.
