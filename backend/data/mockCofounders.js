// Mock co-founder database
const mockCofounders = [
  {
    id: 1,
    name: 'Sarah Chen',
    title: 'Full-Stack Developer',
    location: 'San Francisco, CA',
    experience: '5 years',
    skills: ['React', 'Node.js', 'Python', 'AWS', 'Machine Learning', 'JavaScript', 'TypeScript'],
    availability: 'Part-time',
    bio: 'Passionate developer with experience in building scalable web applications. Looking to join an early-stage startup focused on education technology.',
    previousStartups: 2,
    education: 'Stanford University - Computer Science',
    lookingFor: 'Technical co-founder for EdTech startup',
    matchScore: 95,
    image: 'https://via.placeholder.com/150'
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    title: 'Product Manager',
    location: 'New York, NY',
    experience: '7 years',
    skills: ['Product Strategy', 'User Research', 'Agile', 'Analytics', 'Growth', 'Business Development'],
    availability: 'Full-time',
    bio: 'Product leader with experience scaling products from 0 to 1M users. Specialized in B2B SaaS and marketplace platforms.',
    previousStartups: 3,
    education: 'MIT - Business Administration',
    lookingFor: 'Business co-founder for marketplace startup',
    matchScore: 88,
    image: 'https://via.placeholder.com/150'
  },
  {
    id: 3,
    name: 'Emily Johnson',
    title: 'UX/UI Designer',
    location: 'Austin, TX',
    experience: '4 years',
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Mobile Design', 'Adobe Creative Suite'],
    availability: 'Part-time',
    bio: 'Creative designer focused on creating intuitive user experiences. Passionate about solving real-world problems through design.',
    previousStartups: 1,
    education: 'Art Center College of Design',
    lookingFor: 'Design co-founder for consumer app',
    matchScore: 92,
    image: 'https://via.placeholder.com/150'
  },
  {
    id: 4,
    name: 'David Kim',
    title: 'Marketing Specialist',
    location: 'Seattle, WA',
    experience: '6 years',
    skills: ['Digital Marketing', 'Growth Hacking', 'Content Strategy', 'SEO', 'Social Media', 'PPC'],
    availability: 'Full-time',
    bio: 'Growth-focused marketer with experience in scaling startups from seed to Series A. Expert in digital marketing and user acquisition.',
    previousStartups: 2,
    education: 'University of Washington - Marketing',
    lookingFor: 'Marketing co-founder for SaaS startup',
    matchScore: 85,
    image: 'https://via.placeholder.com/150'
  },
  {
    id: 5,
    name: 'Lisa Wang',
    title: 'Data Scientist',
    location: 'Boston, MA',
    experience: '3 years',
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL', 'Statistics', 'TensorFlow', 'Pandas'],
    availability: 'Part-time',
    bio: 'Data scientist with expertise in machine learning and analytics. Passionate about using data to drive business decisions.',
    previousStartups: 1,
    education: 'Harvard University - Data Science',
    lookingFor: 'Technical co-founder for AI startup',
    matchScore: 90,
    image: 'https://via.placeholder.com/150'
  },
  {
    id: 6,
    name: 'James Wilson',
    title: 'Business Development',
    location: 'Chicago, IL',
    experience: '8 years',
    skills: ['Sales', 'Partnerships', 'Strategy', 'Fundraising', 'Operations', 'Business Strategy'],
    availability: 'Full-time',
    bio: 'Business development expert with experience in B2B sales and partnerships. Successfully raised $2M+ in previous startups.',
    previousStartups: 3,
    education: 'Northwestern University - Business',
    lookingFor: 'Business co-founder for B2B startup',
    matchScore: 87,
    image: 'https://via.placeholder.com/150'
  },
  {
    id: 7,
    name: 'Alex Chen',
    title: 'Mobile Developer',
    location: 'Los Angeles, CA',
    experience: '4 years',
    skills: ['React Native', 'iOS', 'Android', 'Swift', 'Kotlin', 'Flutter', 'Mobile Development'],
    availability: 'Part-time',
    bio: 'Mobile development specialist with experience in both iOS and Android. Passionate about creating smooth mobile experiences.',
    previousStartups: 2,
    education: 'UCLA - Computer Science',
    lookingFor: 'Technical co-founder for mobile app',
    matchScore: 89,
    image: 'https://via.placeholder.com/150'
  },
  {
    id: 8,
    name: 'Maria Garcia',
    title: 'Finance & Operations',
    location: 'Miami, FL',
    experience: '6 years',
    skills: ['Financial Planning', 'Operations', 'Accounting', 'Fundraising', 'Business Analysis', 'Excel'],
    availability: 'Full-time',
    bio: 'Finance professional with startup experience. Expert in financial modeling, fundraising, and operational efficiency.',
    previousStartups: 2,
    education: 'University of Miami - Finance',
    lookingFor: 'Business co-founder for fintech startup',
    matchScore: 91,
    image: 'https://via.placeholder.com/150'
  }
];

// Helper functions for co-founder matching
const cofounderService = {
  // Find co-founders based on required skills
  findMatches(requiredSkills, userSkills = []) {
    const normalizedRequired = requiredSkills.map(skill => skill.toLowerCase().trim());
    const normalizedUser = userSkills.map(skill => skill.toLowerCase().trim());
    
    return mockCofounders
      .map(cofounder => {
        const cofounderSkills = cofounder.skills.map(skill => skill.toLowerCase());
        const matchingSkills = normalizedRequired.filter(skill => 
          cofounderSkills.some(cs => cs.includes(skill) || skill.includes(cs))
        );
        
        const matchScore = (matchingSkills.length / normalizedRequired.length) * 100;
        
        return {
          ...cofounder,
          matchingSkills,
          matchScore: Math.round(matchScore)
        };
      })
      .filter(cofounder => cofounder.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);
  },

  // Get co-founder by ID
  getById(id) {
    return mockCofounders.find(cofounder => cofounder.id === parseInt(id));
  },

  // Get all co-founders with optional filtering
  getAll(filters = {}) {
    let results = [...mockCofounders];
    
    if (filters.location) {
      results = results.filter(cofounder => 
        cofounder.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.availability) {
      results = results.filter(cofounder => 
        cofounder.availability.toLowerCase() === filters.availability.toLowerCase()
      );
    }
    
    if (filters.experience) {
      const experienceMap = {
        'entry': [0, 2],
        'mid': [3, 5],
        'senior': [6, 10]
      };
      
      const [min, max] = experienceMap[filters.experience] || [0, 10];
      results = results.filter(cofounder => {
        const years = parseInt(cofounder.experience);
        return years >= min && years <= max;
      });
    }
    
    return results;
  },

  // Get skills suggestions based on idea
  getSkillsSuggestions(idea) {
    const ideaLower = idea.toLowerCase();
    const skillCategories = {
      'app': ['Mobile Development', 'React Native', 'iOS', 'Android'],
      'web': ['React', 'Node.js', 'JavaScript', 'Frontend Development'],
      'ai': ['Machine Learning', 'Python', 'Data Science', 'AI/ML'],
      'marketplace': ['Product Management', 'Business Development', 'Operations'],
      'saas': ['Backend Development', 'Cloud Computing', 'DevOps', 'API Development'],
      'fintech': ['Finance', 'Blockchain', 'Security', 'Compliance'],
      'edtech': ['Education', 'Learning Management', 'Content Creation'],
      'health': ['Healthcare', 'Medical', 'Compliance', 'Data Privacy']
    };
    
    const suggestions = [];
    for (const [keyword, skills] of Object.entries(skillCategories)) {
      if (ideaLower.includes(keyword)) {
        suggestions.push(...skills);
      }
    }
    
    return [...new Set(suggestions)]; // Remove duplicates
  }
};

export { mockCofounders, cofounderService };
