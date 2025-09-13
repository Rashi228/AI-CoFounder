# API Setup Guide for ACM Co-Founder

## 🚨 URGENT: Configure API Keys to Get Real AI-Generated Content

Currently, the system is using **mock data** because no AI API keys are configured. To get **real, dynamic AI-generated business plans** instead of hardcoded text, you need to set up API keys.

## 🔧 Quick Setup (5 minutes)

### Step 1: Create Environment File
Create a file named `.env` in the `backend` folder with the following content:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://acmcofounder:acmcofounder123@cluster0.g6qtf.mongodb.net/acmcofounder?retryWrites=true&w=majority

# AI API Keys (REPLACE WITH YOUR ACTUAL KEY)
GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key_here

# Server Configuration
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Email Configuration (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### Step 2: Get Google Gemini API Key (Recommended)

1. **Go to**: https://makersuite.google.com/app/apikey
2. **Sign in** with your Google account
3. **Click** "Create API Key"
4. **Copy** the generated key
5. **Replace** `your_google_gemini_api_key_here` in the `.env` file


### Step 3: Restart the Backend Server

```bash
cd backend
npm start
```

## 🎯 What This Fixes

### Before (Mock Data):
- ❌ Hardcoded "Alex Johnson" persona
- ❌ Generic "Young Professional" occupation
- ❌ Static pain points and goals
- ❌ Same content for every idea

### After (AI-Generated):
- ✅ Dynamic persona names based on industry
- ✅ Contextual occupations (e.g., "Dr. Sarah Martinez" for healthcare)
- ✅ Industry-specific pain points and goals
- ✅ Personalized content for each unique idea

## 🔍 Industry Detection Examples

The system now intelligently detects industries and generates contextual content:

- **Healthcare ideas** → Medical professionals, healthcare pain points
- **Education ideas** → Students/educators, learning-focused goals
- **Finance ideas** → Financial professionals, money-related challenges
- **E-commerce ideas** → Retail professionals, shopping-related needs
- **Technology ideas** → Tech professionals, productivity-focused goals

## 🚀 Enhanced Features

### Dynamic Content Generation:
- **Persona Names**: Industry-appropriate names (Dr. Sarah Martinez for healthcare, Professor Alex Johnson for education)
- **Occupations**: Contextual roles (Medical Professional, Educator, Financial Analyst)
- **Pain Points**: Industry-specific challenges
- **Goals**: Relevant objectives for each sector
- **Lean Canvas**: Complete business model tailored to industry

### Smart Industry Detection:
- Analyzes idea keywords to determine industry
- Adjusts target age based on context (students → 22, seniors → 65)
- Generates appropriate business model components

## 🔧 Troubleshooting

### If you still see "Alex Johnson":
1. ✅ Check that `.env` file exists in `backend` folder
2. ✅ Verify API key is correctly formatted (no spaces, quotes)
3. ✅ Restart the backend server after adding keys
4. ✅ Check console for "No AI API key configured" message

### If API calls fail:
1. ✅ Verify API key is valid and active
2. ✅ Check your API usage limits
3. ✅ Ensure you have credits/quota remaining
4. ✅ Check Gemini API quota and limits

## 📊 Cost Information

- **Google Gemini**: Free tier available, very affordable

## 🎉 Result

Once configured, you'll get:
- **Unique, contextual business plans** for every idea
- **Industry-specific personas** and pain points
- **Dynamic content** that adapts to your startup idea
- **Professional-quality** business plan generation

---

**Need Help?** The system will automatically fall back to enhanced mock data if API calls fail, but for the best experience, configure your API keys!
