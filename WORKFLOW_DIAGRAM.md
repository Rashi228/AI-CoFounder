# ACM Co-Founder Platform - Workflow Diagram

## User Journey Flow

```
┌─────────────────┐
│   Landing Page  │
│   (Home Page)   │
└─────────┬───────┘
          │
          ▼
    ┌──────────┐
    │  User    │
    │ Decision │
    └────┬────┘
         │
    ┌────▼────┐
    │         │
    ▼         ▼
┌──────┐  ┌────────┐
│Login │  │Register│
└──┬───┘  └───┬────┘
   │          │
   ▼          ▼
┌──────┐  ┌────────┐
│Auth  │  │Multi-  │
│Check │  │Step    │
└──┬───┘  │Form    │
   │      └───┬────┘
   │          │
   ▼          ▼
┌─────────────────┐
│   Dashboard     │
│   (Main Hub)    │
└─────────┬───────┘
          │
          ▼
    ┌──────────┐
    │  User    │
    │ Actions  │
    └────┬────┘
         │
    ┌────▼────┐
    │         │
    ▼         ▼
┌──────┐  ┌────────┐
│Submit│  │View    │
│Idea  │  │Plans   │
└──┬───┘  └───┬────┘
   │          │
   ▼          ▼
┌─────────────────┐
│  AI Processing  │
│  (Business Plan │
│   Generation)   │
└─────────┬───────┘
          │
          ▼
    ┌──────────┐
    │Generated │
    │Content   │
    └────┬────┘
         │
    ┌────▼────┐
    │         │
    ▼         ▼
┌──────┐  ┌────────┐
│View  │  │Edit    │
│Plan  │  │Plan    │
└──┬───┘  └───┬────┘
   │          │
   ▼          ▼
┌─────────────────┐
│  Additional     │
│  Features       │
└─────────┬───────┘
          │
    ┌─────▼─────┐
    │           │
    ▼           ▼
┌──────┐  ┌────────┐
│Co-   │  │Valida- │
│Founder│  │tion    │
│Match │  │Tools   │
└──────┘  └────────┘
```

## Detailed Feature Flow

### 1. Authentication Flow
```
User → Home Page → Login/Register → Auth Service → JWT Token → Dashboard
```

### 2. Business Plan Generation Flow
```
User → Submit Idea → AI Service → Business Plan → Save to DB → Display Results
```

### 3. Co-Founder Matching Flow
```
User → Skills Input → Matching Algorithm → Co-Founder Profiles → Contact Options
```

### 4. Validation Experiments Flow
```
User → Select Experiment Type → Generate Content → Run Experiment → Collect Results
```

## Database Schema Flow

### User Management
```
User Registration → User Model → MongoDB/In-Memory → JWT Token → Session Management
```

### Business Plan Storage
```
Idea Input → AI Processing → Business Plan Model → Database Storage → User Association
```

### Co-Founder Profiles
```
Profile Creation → Skills Matching → Database Storage → Search & Filter → Contact System
```

## API Endpoints Flow

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/demo-login
- GET /api/auth/profile

### Business Plans
- POST /api/ideas/generate
- GET /api/ideas/plans
- GET /api/ideas/plans/:id
- PUT /api/ideas/plans/:id
- DELETE /api/ideas/plans/:id

### Co-Founder Matching
- GET /api/cofounders
- POST /api/cofounders/match
- POST /api/cofounders (create profile)

### Validation Experiments
- POST /api/validation/survey
- POST /api/validation/landing-page
- POST /api/validation/ad-campaign

## Frontend Component Flow

### Page Structure
```
App.jsx
├── Navbar (Authentication Status)
├── Routes
│   ├── Home (Public)
│   ├── Login (Public)
│   ├── GetStarted (Public)
│   ├── Dashboard (Protected)
│   ├── IdeaInput (Protected)
│   ├── ProblemRefinement (Protected)
│   ├── MarketResearch (Protected)
│   ├── BusinessModels (Protected)
│   ├── FinancialProjections (Protected)
│   ├── ValidationExperiments (Protected)
│   ├── CoFounderMatching (Protected)
│   └── PitchDeck (Protected)
└── Footer
```

### State Management Flow
```
User Login → localStorage (Token + User Data) → API Service → Backend → Database
```

## Error Handling Flow

### Authentication Errors
```
Invalid Credentials → Error Message → User Feedback → Retry Option
```

### API Errors
```
Network Error → Fallback Service → Error Message → User Notification
```

### Database Errors
```
MongoDB Unavailable → In-Memory Fallback → Warning Message → Continued Operation
```

## Security Flow

### JWT Token Management
```
Login → Token Generation → Token Storage → Request Headers → Token Validation → Access Control
```

### Route Protection
```
Protected Route → Token Check → Valid Token → Allow Access
                → Invalid Token → Redirect to Login
```

## Data Persistence Flow

### With MongoDB
```
User Action → API Call → MongoDB Model → Database Storage → Response
```

### Without MongoDB (Fallback)
```
User Action → API Call → In-Memory Service → Temporary Storage → Response
```

## Integration Points

### AI Service Integration
```
Idea Input → AI Service → Mock Data (No API Key) → Business Plan → Database Storage
```

### Frontend-Backend Communication
```
React Component → API Service → Axios → Express Route → Database → Response
```

This workflow ensures a smooth user experience with proper error handling and fallback mechanisms when MongoDB is not available.
