/**
 * JobBoard Helper Functions
 * Utility functions for JobBoard component
 */

// Constants
export const CONSTANTS = {
  MAX_JOB_TITLE_LENGTH: 100,
  MAX_JOB_DESCRIPTION_LENGTH: 5000,
  MAX_COMPANY_NAME_LENGTH: 100,
  MAX_LOCATION_LENGTH: 100,
  MAX_SALARY_RANGE: 1000000,
  MIN_SALARY_RANGE: 0,
  MAX_SKILLS: 20,
  MAX_REQUIREMENTS: 50,
  JOB_STATUS: ['active', 'paused', 'closed', 'draft'],
  JOB_TYPES: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
  EXPERIENCE_LEVELS: ['entry', 'mid', 'senior', 'lead', 'executive'],
  REMOTE_OPTIONS: ['on-site', 'remote', 'hybrid'],
  APPLICATION_STATUS: ['applied', 'reviewing', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn'],
  CURRENCY_CODES: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'],
  SKILL_CATEGORIES: ['technical', 'soft', 'language', 'certification', 'tool']
};

// Validation functions
export const validate = {
  jobTitle: (title) => {
    if (!title || typeof title !== 'string') {
      return { isValid: false, error: 'Job title is required' };
    }
    if (title.length > CONSTANTS.MAX_JOB_TITLE_LENGTH) {
      return { isValid: false, error: `Job title exceeds ${CONSTANTS.MAX_JOB_TITLE_LENGTH} characters` };
    }
    return { isValid: true };
  },

  jobDescription: (description) => {
    if (!description || typeof description !== 'string') {
      return { isValid: false, error: 'Job description is required' };
    }
    if (description.length > CONSTANTS.MAX_JOB_DESCRIPTION_LENGTH) {
      return { isValid: false, error: `Job description exceeds ${CONSTANTS.MAX_JOB_DESCRIPTION_LENGTH} characters` };
    }
    return { isValid: true };
  },

  companyName: (name) => {
    if (!name || typeof name !== 'string') {
      return { isValid: false, error: 'Company name is required' };
    }
    if (name.length > CONSTANTS.MAX_COMPANY_NAME_LENGTH) {
      return { isValid: false, error: `Company name exceeds ${CONSTANTS.MAX_COMPANY_NAME_LENGTH} characters` };
    }
    return { isValid: true };
  },

  location: (location) => {
    if (!location || typeof location !== 'string') {
      return { isValid: false, error: 'Location is required' };
    }
    if (location.length > CONSTANTS.MAX_LOCATION_LENGTH) {
      return { isValid: false, error: `Location exceeds ${CONSTANTS.MAX_LOCATION_LENGTH} characters` };
    }
    return { isValid: true };
  },

  salaryRange: (minSalary, maxSalary) => {
    if (minSalary < CONSTANTS.MIN_SALARY_RANGE) {
      return { isValid: false, error: `Minimum salary must be at least ${CONSTANTS.MIN_SALARY_RANGE}` };
    }
    if (maxSalary > CONSTANTS.MAX_SALARY_RANGE) {
      return { isValid: false, error: `Maximum salary cannot exceed ${CONSTANTS.MAX_SALARY_RANGE}` };
    }
    if (minSalary > maxSalary) {
      return { isValid: false, error: 'Minimum salary cannot be greater than maximum salary' };
    }
    return { isValid: true };
  },

  skills: (skills) => {
    if (!Array.isArray(skills)) {
      return { isValid: false, error: 'Skills must be an array' };
    }
    if (skills.length > CONSTANTS.MAX_SKILLS) {
      return { isValid: false, error: `Maximum ${CONSTANTS.MAX_SKILLS} skills allowed` };
    }
    return { isValid: true };
  },

  requirements: (requirements) => {
    if (!Array.isArray(requirements)) {
      return { isValid: false, error: 'Requirements must be an array' };
    }
    if (requirements.length > CONSTANTS.MAX_REQUIREMENTS) {
      return { isValid: false, error: `Maximum ${CONSTANTS.MAX_REQUIREMENTS} requirements allowed` };
    }
    return { isValid: true };
  },

  jobType: (type) => {
    if (!CONSTANTS.JOB_TYPES.includes(type)) {
      return { isValid: false, error: 'Invalid job type' };
    }
    return { isValid: true };
  },

  experienceLevel: (level) => {
    if (!CONSTANTS.EXPERIENCE_LEVELS.includes(level)) {
      return { isValid: false, error: 'Invalid experience level' };
    }
    return { isValid: true };
  },

  remoteOption: (option) => {
    if (!CONSTANTS.REMOTE_OPTIONS.includes(option)) {
      return { isValid: false, error: 'Invalid remote option' };
    }
    return { isValid: true };
  }
};

// Utility functions
export const utils = {
  formatSalary: (minSalary, maxSalary, currency = 'USD') => {
    if (!minSalary && !maxSalary) return 'Salary not specified';
    
    const formatNumber = (num) => {
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
      return num.toString();
    };
    
    if (minSalary && maxSalary) {
      return `${currency} ${formatNumber(minSalary)} - ${formatNumber(maxSalary)}`;
    }
    if (minSalary) {
      return `${currency} ${formatNumber(minSalary)}+`;
    }
    return `${currency} ${formatNumber(maxSalary)}`;
  },

  formatDate: (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  },

  formatExperienceLevel: (level) => {
    const levelMap = {
      'entry': 'Entry Level',
      'mid': 'Mid Level',
      'senior': 'Senior Level',
      'lead': 'Lead Level',
      'executive': 'Executive Level'
    };
    return levelMap[level] || level;
  },

  formatJobType: (type) => {
    const typeMap = {
      'full-time': 'Full Time',
      'part-time': 'Part Time',
      'contract': 'Contract',
      'internship': 'Internship',
      'freelance': 'Freelance'
    };
    return typeMap[type] || type;
  },

  formatRemoteOption: (option) => {
    const optionMap = {
      'on-site': 'On Site',
      'remote': 'Remote',
      'hybrid': 'Hybrid'
    };
    return optionMap[option] || option;
  },

  calculateJobAge: (postedDate) => {
    const posted = new Date(postedDate);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays;
  },

  isJobNew: (postedDate, daysThreshold = 7) => {
    const age = utils.calculateJobAge(postedDate);
    return age <= daysThreshold;
  },

  isJobUrgent: (postedDate, daysThreshold = 3) => {
    const age = utils.calculateJobAge(postedDate);
    return age <= daysThreshold;
  },

  extractSkillsFromText: (text) => {
    const commonSkills = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue.js',
      'HTML', 'CSS', 'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes',
      'Git', 'Agile', 'Scrum', 'Machine Learning', 'AI', 'Data Science', 'DevOps'
    ];
    
    const foundSkills = commonSkills.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );
    
    return foundSkills;
  },

  categorizeRequirement: (requirement) => {
    const req = requirement.toLowerCase();
    if (req.includes('experience') || req.includes('years')) return 'experience';
    if (req.includes('degree') || req.includes('education') || req.includes('bachelor') || req.includes('master')) return 'education';
    if (req.includes('skill') || req.includes('technology') || req.includes('programming')) return 'skill';
    if (req.includes('certification') || req.includes('certificate')) return 'certification';
    if (req.includes('language') || req.includes('english')) return 'language';
    return 'other';
  },

  calculateRequirementPriority: (requirement) => {
    const req = requirement.toLowerCase();
    if (req.includes('required') || req.includes('must') || req.includes('essential')) return 'high';
    if (req.includes('preferred') || req.includes('nice to have') || req.includes('bonus')) return 'low';
    if (req.includes('experience') || req.includes('years')) return 'high';
    if (req.includes('degree') || req.includes('education')) return 'medium';
    return 'medium';
  },

  categorizeSkill: (skill) => {
    const skillLower = skill.toLowerCase();
    if (skillLower.includes('javascript') || skillLower.includes('python') || skillLower.includes('java') || skillLower.includes('react') || skillLower.includes('node')) return 'programming';
    if (skillLower.includes('html') || skillLower.includes('css') || skillLower.includes('frontend')) return 'frontend';
    if (skillLower.includes('database') || skillLower.includes('sql') || skillLower.includes('mongodb')) return 'database';
    if (skillLower.includes('aws') || skillLower.includes('cloud') || skillLower.includes('devops')) return 'infrastructure';
    if (skillLower.includes('agile') || skillLower.includes('scrum') || skillLower.includes('project')) return 'methodology';
    return 'other';
  },

  calculateSkillLevel: (skill) => {
    const skillLower = skill.toLowerCase();
    if (skillLower.includes('senior') || skillLower.includes('lead') || skillLower.includes('expert')) return 'senior';
    if (skillLower.includes('junior') || skillLower.includes('entry') || skillLower.includes('beginner')) return 'junior';
    if (skillLower.includes('intermediate') || skillLower.includes('mid')) return 'intermediate';
    return 'intermediate';
  },

  matchSkills: (jobSkills, candidateSkills) => {
    if (!Array.isArray(jobSkills) || !Array.isArray(candidateSkills)) return 0;
    
    const matchedSkills = jobSkills.filter(skill => 
      candidateSkills.some(candidateSkill => 
        candidateSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(candidateSkill.toLowerCase())
      )
    );
    
    return (matchedSkills.length / jobSkills.length) * 100;
  },

  calculateJobScore: (job, candidateProfile) => {
    let score = 0;
    
    // Skills match (40% weight)
    const skillsMatch = utils.matchSkills(job.requirements.skills, candidateProfile.skills);
    score += (skillsMatch / 100) * 40;
    
    // Experience match (30% weight)
    const experienceMatch = utils.calculateExperienceMatch(job.requirements.experience, candidateProfile.experience);
    score += (experienceMatch / 100) * 30;
    
    // Location match (20% weight)
    const locationMatch = utils.calculateLocationMatch(job.location, candidateProfile.location);
    score += (locationMatch / 100) * 20;
    
    // Salary match (10% weight)
    const salaryMatch = utils.calculateSalaryMatch(job.salary, candidateProfile.salaryExpectation);
    score += (salaryMatch / 100) * 10;
    
    return Math.round(score);
  },

  calculateExperienceMatch: (jobExperience, candidateExperience) => {
    const experienceMap = {
      'entry': 1,
      'mid': 2,
      'senior': 3,
      'lead': 4,
      'executive': 5
    };
    
    const jobLevel = experienceMap[jobExperience] || 1;
    const candidateLevel = experienceMap[candidateExperience] || 1;
    
    if (candidateLevel >= jobLevel) return 100;
    if (candidateLevel >= jobLevel - 1) return 75;
    if (candidateLevel >= jobLevel - 2) return 50;
    return 25;
  },

  calculateLocationMatch: (jobLocation, candidateLocation) => {
    if (!jobLocation || !candidateLocation) return 0;
    
    const jobCity = jobLocation.toLowerCase().split(',')[0].trim();
    const candidateCity = candidateLocation.toLowerCase().split(',')[0].trim();
    
    if (jobCity === candidateCity) return 100;
    if (jobCity.includes(candidateCity) || candidateCity.includes(jobCity)) return 75;
    return 0;
  },

  calculateSalaryMatch: (jobSalary, candidateExpectation) => {
    if (!jobSalary || !candidateExpectation) return 0;
    
    const jobMin = jobSalary.min || 0;
    const jobMax = jobSalary.max || 0;
    const candidateMin = candidateExpectation.min || 0;
    const candidateMax = candidateExpectation.max || 0;
    
    if (candidateMin <= jobMax && candidateMax >= jobMin) return 100;
    if (candidateMin <= jobMax * 1.2) return 75;
    if (candidateMin <= jobMax * 1.5) return 50;
    return 25;
  }
};

// Formatting functions
export const formatters = {
  formatJobCard: (job) => {
    return {
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      experience: job.requirements.experience,
      salary: utils.formatSalary(job.salary.min, job.salary.max, job.salary.currency),
      postedDate: utils.formatDate(job.postedAt),
      isNew: utils.isJobNew(job.postedAt),
      isUrgent: utils.isJobUrgent(job.postedAt),
      skills: job.requirements.skills.slice(0, 5), // Show first 5 skills
      status: job.status,
      applicants: job.applicants?.length || 0
    };
  },

  formatJobDetail: (job) => {
    return {
      ...job,
      formattedSalary: utils.formatSalary(job.salary.min, job.salary.max, job.salary.currency),
      formattedPostedDate: utils.formatDate(job.postedAt),
      formattedExperience: utils.formatExperienceLevel(job.requirements.experience),
      formattedType: utils.formatJobType(job.type),
      formattedRemote: utils.formatRemoteOption(job.remote),
      isNew: utils.isJobNew(job.postedAt),
      isUrgent: utils.isJobUrgent(job.postedAt),
      skillsCount: job.requirements.skills.length,
      requirementsCount: job.requirements.list.length
    };
  },

  formatApplicationStatus: (status) => {
    const statusMap = {
      'applied': 'Applied',
      'reviewing': 'Under Review',
      'shortlisted': 'Shortlisted',
      'interview': 'Interview Scheduled',
      'offered': 'Offer Made',
      'rejected': 'Rejected',
      'withdrawn': 'Withdrawn'
    };
    return statusMap[status] || status;
  },

  formatApplicationDate: (dateString) => {
    return utils.formatDate(dateString);
  }
};

// Content processing functions
export const contentProcessors = {
  processJobDescription: (description) => {
    if (!description) return { text: '', wordCount: 0, paragraphCount: 0 };
    
    const paragraphs = description.split('\n').filter(p => p.trim());
    const wordCount = description.split(' ').length;
    
    return {
      text: description,
      wordCount,
      paragraphCount: paragraphs.length,
      paragraphs
    };
  },

  processJobRequirements: (requirements) => {
    if (!Array.isArray(requirements)) return [];
    
    return requirements.map((req, index) => ({
      id: `req-${index}`,
      text: req,
      type: utils.categorizeRequirement(req),
      priority: utils.calculateRequirementPriority(req)
    }));
  },

  processJobSkills: (skills) => {
    if (!Array.isArray(skills)) return [];
    
    return skills.map(skill => ({
      name: skill,
      category: utils.categorizeSkill(skill),
      level: utils.calculateSkillLevel(skill)
    }));
  }
};

// Filter and sort functions
export const filters = {
  filterJobsByStatus: (jobs, status) => {
    return jobs.filter(job => job.status === status);
  },

  filterJobsByType: (jobs, type) => {
    return jobs.filter(job => job.type === type);
  },

  filterJobsByExperience: (jobs, experience) => {
    return jobs.filter(job => job.requirements.experience === experience);
  },

  filterJobsByLocation: (jobs, location) => {
    return jobs.filter(job => 
      job.location.toLowerCase().includes(location.toLowerCase())
    );
  },

  filterJobsBySalary: (jobs, minSalary, maxSalary) => {
    return jobs.filter(job => {
      const jobMin = job.salary.min || 0;
      const jobMax = job.salary.max || 0;
      return jobMin >= minSalary && jobMax <= maxSalary;
    });
  },

  filterJobsBySkills: (jobs, requiredSkills) => {
    return jobs.filter(job => {
      const jobSkills = job.requirements.skills || [];
      return requiredSkills.every(skill => 
        jobSkills.some(jobSkill => 
          jobSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
    });
  },

  filterJobsByRemote: (jobs, remoteOption) => {
    return jobs.filter(job => job.remote === remoteOption);
  },

  sortJobsByDate: (jobs, order = 'desc') => {
    return jobs.sort((a, b) => {
      const dateA = new Date(a.postedAt);
      const dateB = new Date(b.postedAt);
      return order === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });
  },

  sortJobsBySalary: (jobs, order = 'desc') => {
    return jobs.sort((a, b) => {
      const salaryA = a.salary.max || a.salary.min || 0;
      const salaryB = b.salary.max || b.salary.min || 0;
      return order === 'desc' ? salaryB - salaryA : salaryA - salaryB;
    });
  },

  sortJobsByRelevance: (jobs, candidateProfile) => {
    return jobs.sort((a, b) => {
      const scoreA = utils.calculateJobScore(a, candidateProfile);
      const scoreB = utils.calculateJobScore(b, candidateProfile);
      return scoreB - scoreA;
    });
  }
};

// Search functions
export const search = {
  searchJobsByText: (jobs, searchText) => {
    if (!searchText) return jobs;
    
    const searchLower = searchText.toLowerCase();
    
    return jobs.filter(job => 
      job.title.toLowerCase().includes(searchLower) ||
      job.company.toLowerCase().includes(searchLower) ||
      job.location.toLowerCase().includes(searchLower) ||
      job.description.toLowerCase().includes(searchLower) ||
      (job.requirements.skills || []).some(skill => 
        skill.toLowerCase().includes(searchLower)
      )
    );
  },

  searchJobsByFilters: (jobs, filters) => {
    let filteredJobs = jobs;
    
    if (filters.status) {
      filteredJobs = filters.filterJobsByStatus(filteredJobs, filters.status);
    }
    
    if (filters.type) {
      filteredJobs = filters.filterJobsByType(filteredJobs, filters.type);
    }
    
    if (filters.experience) {
      filteredJobs = filters.filterJobsByExperience(filteredJobs, filters.experience);
    }
    
    if (filters.location) {
      filteredJobs = filters.filterJobsByLocation(filteredJobs, filters.location);
    }
    
    if (filters.salary) {
      filteredJobs = filters.filterJobsBySalary(filteredJobs, filters.salary.min, filters.salary.max);
    }
    
    if (filters.skills) {
      filteredJobs = filters.filterJobsBySkills(filteredJobs, filters.skills);
    }
    
    if (filters.remote) {
      filteredJobs = filters.filterJobsByRemote(filteredJobs, filters.remote);
    }
    
    return filteredJobs;
  }
};

// Error handling
export const errorHandlers = {
  handleJobCreationError: (error) => {
    console.error('Job creation error:', error);
    return {
      success: false,
      message: 'Failed to create job posting. Please try again.',
      error: error.message
    };
  },

  handleJobUpdateError: (error) => {
    console.error('Job update error:', error);
    return {
      success: false,
      message: 'Failed to update job posting. Please try again.',
      error: error.message
    };
  },

  handleJobDeleteError: (error) => {
    console.error('Job deletion error:', error);
    return {
      success: false,
      message: 'Failed to delete job posting. Please try again.',
      error: error.message
    };
  },

  handleApplicationError: (error) => {
    console.error('Application error:', error);
    return {
      success: false,
      message: 'Failed to submit application. Please try again.',
      error: error.message
    };
  }
};

export default {
  CONSTANTS,
  validate,
  utils,
  formatters,
  contentProcessors,
  filters,
  search,
  errorHandlers
};
