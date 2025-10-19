import { JobPostItem } from './Types.types';

export const JOB_POST_FIXTURE: JobPostItem[] = [
  {
    _id: '1',
    title: 'Senior Software Engineer',
    description: 'We are looking for a senior software engineer to join our team and help build scalable web applications using modern technologies.',
    shortDescription: 'Join our engineering team to build scalable web applications',
    company: {
      name: 'TechCorp Inc.',
      logo: '/assets/logos/techcorp.png',
      website: 'https://techcorp.com',
      size: 'large',
      industry: 'Technology',
      location: {
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        remote: false
      }
    },
    jobType: 'full-time',
    experienceLevel: 'senior',
    salary: {
      min: 120000,
      max: 150000,
      currency: 'USD',
      period: 'yearly'
    },
    location: {
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      remote: false,
      hybrid: true
    },
    requirements: {
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'AWS'],
      education: {
        level: 'bachelor',
        field: 'Computer Science'
      },
      experience: {
        years: 5,
        description: '5+ years of experience with JavaScript, React, Node.js, and MongoDB'
      },
      certifications: ['AWS Certified Developer'],
      languages: [
        { name: 'English', proficiency: 'native' }
      ]
    },
    benefits: ['Health Insurance', '401(k) Matching', 'Flexible Schedule', 'Remote Work'],
    perks: ['Gym Membership', 'Free Lunch', 'Learning Budget'],
    applicationProcess: {
      deadline: '2024-12-31',
      startDate: '2024-01-15',
      process: 'multi-stage',
      stages: [
        { name: 'Application Review', description: 'Initial application screening', order: 1 },
        { name: 'Technical Interview', description: 'Coding challenge and technical discussion', order: 2 },
        { name: 'Final Interview', description: 'Cultural fit and team collaboration', order: 3 }
      ]
    },
    status: 'active',
    visibility: 'public',
    analytics: {
      views: 150,
      applications: 25,
      shortlisted: 8,
      hired: 0
    },
    tags: ['engineering', 'javascript', 'react', 'senior'],
    keywords: ['software', 'engineer', 'javascript', 'react'],
    featured: true,
    urgent: false,
    postedBy: 'user1',
    tenantId: 'tenant1',
    publishedAt: '2024-01-01T10:00:00Z',
    expiresAt: '2024-12-31T23:59:59Z',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    _id: '2',
    title: 'Marketing Manager',
    description: 'Join our marketing team to develop and execute marketing strategies that drive growth and brand awareness.',
    shortDescription: 'Lead marketing initiatives and drive brand growth',
    company: {
      name: 'MarketingPro LLC',
      logo: '/assets/logos/marketingpro.png',
      website: 'https://marketingpro.com',
      size: 'medium',
      industry: 'Marketing',
      location: {
        city: 'New York',
        state: 'NY',
        country: 'USA',
        remote: true
      }
    },
    jobType: 'full-time',
    experienceLevel: 'mid',
    salary: {
      min: 90000,
      max: 110000,
      currency: 'USD',
      period: 'yearly'
    },
    location: {
      city: 'New York',
      state: 'NY',
      country: 'USA',
      remote: true,
      hybrid: false
    },
    requirements: {
      skills: ['Digital Marketing', 'Analytics', 'Content Creation', 'Social Media'],
      education: {
        level: 'bachelor',
        field: 'Marketing'
      },
      experience: {
        years: 3,
        description: '3+ years of marketing experience with digital marketing tools'
      },
      certifications: ['Google Analytics Certified'],
      languages: [
        { name: 'English', proficiency: 'native' }
      ]
    },
    benefits: ['Health Insurance', 'Dental Insurance', 'Paid Time Off', 'Professional Development'],
    perks: ['Remote Work', 'Flexible Hours', 'Learning Budget'],
    applicationProcess: {
      deadline: '2024-11-30',
      startDate: '2024-02-01',
      process: 'screening',
      stages: [
        { name: 'Application Review', description: 'Resume and portfolio review', order: 1 },
        { name: 'Interview', description: 'Skills and experience discussion', order: 2 }
      ]
    },
    status: 'active',
    visibility: 'public',
    analytics: {
      views: 95,
      applications: 15,
      shortlisted: 5,
      hired: 0
    },
    tags: ['marketing', 'digital', 'remote', 'manager'],
    keywords: ['marketing', 'manager', 'digital', 'remote'],
    featured: false,
    urgent: false,
    postedBy: 'user2',
    tenantId: 'tenant1',
    publishedAt: '2024-01-02T14:30:00Z',
    expiresAt: '2024-11-30T23:59:59Z',
    createdAt: '2024-01-02T14:30:00Z',
    updatedAt: '2024-01-02T14:30:00Z'
  },
  {
    _id: '3',
    title: 'Sales Representative',
    description: 'We need a motivated sales representative to help us expand our customer base and drive revenue growth.',
    shortDescription: 'Drive sales growth and expand customer base',
    company: {
      name: 'SalesForce Solutions',
      logo: '/assets/logos/salesforce.png',
      website: 'https://salesforce.com',
      size: 'medium',
      industry: 'Sales',
      location: {
        city: 'Chicago',
        state: 'IL',
        country: 'USA',
        remote: false
      }
    },
    jobType: 'full-time',
    experienceLevel: 'entry',
    salary: {
      min: 75000,
      max: 95000,
      currency: 'USD',
      period: 'yearly'
    },
    location: {
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      remote: false,
      hybrid: false
    },
    requirements: {
      skills: ['Sales', 'Communication', 'CRM', 'Negotiation'],
      education: {
        level: 'high-school',
        field: 'Any'
      },
      experience: {
        years: 2,
        description: '2+ years of sales experience with proven track record'
      },
      certifications: ['Sales Training Certificate'],
      languages: [
        { name: 'English', proficiency: 'native' }
      ]
    },
    benefits: ['Health Insurance', 'Commission', 'Car Allowance', 'Sales Training'],
    perks: ['Commission Bonus', 'Car Allowance', 'Sales Training'],
    applicationProcess: {
      deadline: '2024-10-31',
      startDate: '2024-01-20',
      process: 'direct',
      stages: [
        { name: 'Application Review', description: 'Resume and experience review', order: 1 },
        { name: 'Interview', description: 'Sales skills and motivation discussion', order: 2 }
      ]
    },
    status: 'active',
    visibility: 'public',
    analytics: {
      views: 60,
      applications: 8,
      shortlisted: 3,
      hired: 0
    },
    tags: ['sales', 'commission', 'urgent', 'entry-level'],
    keywords: ['sales', 'representative', 'commission', 'entry'],
    featured: false,
    urgent: true,
    postedBy: 'user3',
    tenantId: 'tenant1',
    publishedAt: '2024-01-03T09:15:00Z',
    expiresAt: '2024-10-31T23:59:59Z',
    createdAt: '2024-01-03T09:15:00Z',
    updatedAt: '2024-01-03T09:15:00Z'
  }
];

export const JOB_POST_STATS_FIXTURE = {
  total: 3,
  active: 3,
  inactive: 0,
  draft: 0,
  totalLikes: 0,
  totalComments: 0,
  totalShares: 0,
  totalViews: 305,
  avgEngagement: 0
};

export const JOB_POST_FILTERS_FIXTURE = {
  status: 'all',
  department: 'all',
  location: 'all',
  type: 'all'
};

export const JOB_POST_SEARCH_FIXTURE = {
  query: 'software engineer',
  results: JOB_POST_FIXTURE.filter(job => 
    job.title.toLowerCase().includes('software') || 
    job.description.toLowerCase().includes('software') ||
    job.requirements.skills?.some(skill => skill.toLowerCase().includes('software'))
  )
};
