# MongoDB Setup Instructions

## Option 1: Install MongoDB Locally

### For macOS (using Homebrew)
```bash
# Install MongoDB Community Edition
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify installation
mongosh --version
```

### For Ubuntu/Debian
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### For Windows
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer
3. Start MongoDB service

## Option 2: Use MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update your `.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/acm-cofounder?retryWrites=true&w=majority
```

## Option 3: Use Docker

```bash
# Run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use docker-compose
# Create docker-compose.yml:
```

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

## Environment Configuration

Create a `.env` file in the backend directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/acm-cofounder

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Server
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# AI API Keys (optional)
GOOGLE_GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key
```

## Testing MongoDB Connection

1. Start your backend server:
```bash
cd backend
npm run dev
```

2. Check the console for:
```
MongoDB Connected: localhost
```

3. Test the API endpoints:
```bash
# Test demo login
curl -X POST http://localhost:5001/api/auth/demo-login

# Test registration
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","password":"password123","university":"Test University","major":"Computer Science"}'
```

## Troubleshooting

### MongoDB Not Starting
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Check MongoDB logs
tail -f /usr/local/var/log/mongodb/mongo.log

# Restart MongoDB
brew services restart mongodb-community
```

### Connection Issues
1. Ensure MongoDB is running on port 27017
2. Check firewall settings
3. Verify connection string in `.env` file
4. Check MongoDB logs for errors

### Database Access
```bash
# Connect to MongoDB shell
mongosh

# List databases
show dbs

# Use your database
use acm-cofounder

# List collections
show collections

# View users
db.users.find()
```

## Current Status

The application is currently running with a fallback authentication service that stores data in memory. This means:

- ✅ Authentication works
- ✅ All features are functional
- ❌ Data is not persisted between server restarts
- ❌ No real database storage

Once MongoDB is properly set up, the application will automatically switch to using the database for persistent storage.

## Next Steps

1. Install MongoDB using one of the options above
2. Update the `.env` file with your MongoDB URI
3. Restart the backend server
4. Test the endpoints to ensure database connectivity
5. The application will automatically use MongoDB instead of in-memory storage
