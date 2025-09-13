import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// In-memory storage for demo purposes (replace with MongoDB when available)
let users = [];
let nextUserId = 1;

class AuthService {
  async register(userData) {
    try {
      const { firstName, lastName, email, password, university, major, interests, experience } = userData;

      // Check if user already exists
      const existingUser = users.find(user => user.email === email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = {
        id: nextUserId++,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        university,
        major,
        interests: interests || [],
        experience: experience || 'beginner',
        createdAt: new Date().toISOString(),
        lastLogin: null
      };

      users.push(newUser);

      // Generate token
      const token = this.generateToken(newUser.id);

      return {
        success: true,
        data: {
          user: this.sanitizeUser(newUser),
          token
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async login(email, password) {
    try {
      const user = users.find(u => u.email === email);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Update last login
      user.lastLogin = new Date().toISOString();

      // Generate token
      const token = this.generateToken(user.id);

      return {
        success: true,
        data: {
          user: this.sanitizeUser(user),
          token
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async demoLogin() {
    try {
      let demoUser = users.find(u => u.email === 'demo@acmcofounder.com');
      
      if (!demoUser) {
        // Create demo user
        const hashedPassword = await bcrypt.hash('demo123', 10);
        demoUser = {
          id: nextUserId++,
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@acmcofounder.com',
          password: hashedPassword,
          university: 'Demo University',
          major: 'Computer Science',
          interests: ['Technology', 'AI/ML', 'Business'],
          experience: 'intermediate',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        
        users.push(demoUser);
      } else {
        demoUser.lastLogin = new Date().toISOString();
      }

      const token = this.generateToken(demoUser.id);

      return {
        success: true,
        data: {
          user: this.sanitizeUser(demoUser),
          token
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserById(userId) {
    const user = users.find(u => u.id === parseInt(userId));
    if (!user) {
      throw new Error('User not found');
    }
    return this.sanitizeUser(user);
  }

  generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'acm-cofounder-secret', {
      expiresIn: '7d'
    });
  }

  sanitizeUser(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'acm-cofounder-secret');
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

export default new AuthService();
