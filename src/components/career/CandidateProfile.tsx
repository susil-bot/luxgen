import React, { useState, useEffect } from 'react';
import { 
  User, Edit, Save, X, Plus, Trash2, MapPin, Mail, Phone, 
  Briefcase, GraduationCap, Award, Star, ExternalLink, 
  Linkedin, Github, Globe, Calendar, CheckCircle, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import apiServices from '../../services/apiServices';
import { toast } from 'react-hot-toast';

interface CandidateProfile {
  _id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: {
      city: string;
      state: string;
      country: string;
    };
  };
  professionalSummary: {
    headline: string;
    summary: string;
    currentStatus: string;
    openToWork: boolean;
  };
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    description: string;
    achievements: string[];
    skills: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    description: string;
  }>;
  skills: {
    technical: Array<{
      name: string;
      level: string;
      years: number;
    }>;
  };
  socialLinks: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
  analytics: {
    profileViews: number;
    lastActive: string;
    profileCompleteness: number;
  };
  atsData: {
    overallScore: number;
    skillsScore: number;
    experienceScore: number;
    educationScore: number;
    aiInsights: {
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
    };
    quality: string;
  };
}

const CandidateProfile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      // For now, we'll create a mock profile since we need to implement the API
      const mockProfile: CandidateProfile = {
        _id: 'mock-id',
        personalInfo: {
          firstName: user?.firstName || 'John',
          lastName: user?.lastName || 'Doe',
          email: user?.email || 'john.doe@example.com',
          phone: '+1-555-0123',
          location: {
            city: 'San Francisco',
            state: 'CA',
            country: 'USA'
          }
        },
        professionalSummary: {
          headline: 'Senior Full Stack Developer with 8+ years experience',
          summary: 'Passionate developer with expertise in React, Node.js, and cloud technologies. Led multiple successful projects and teams.',
          currentStatus: 'employed',
          openToWork: true
        },
        experience: [
          {
            company: 'TechStart Inc',
            position: 'Senior Full Stack Developer',
            startDate: '2020-01-01',
            isCurrent: true,
            description: 'Leading development of microservices architecture and mentoring junior developers.',
            achievements: ['Reduced API response time by 40%', 'Led team of 5 developers'],
            skills: ['React', 'Node.js', 'AWS', 'Docker']
          }
        ],
        education: [
          {
            degree: 'Bachelor of Science',
            institution: 'University of Technology',
            fieldOfStudy: 'Computer Science',
            startDate: '2015-09-01',
            endDate: '2019-06-01',
            description: 'Graduated with honors, focused on software engineering and algorithms.'
          }
        ],
        skills: {
          technical: [
            { name: 'React', level: 'expert', years: 6 },
            { name: 'Node.js', level: 'expert', years: 5 },
            { name: 'TypeScript', level: 'advanced', years: 4 },
            { name: 'AWS', level: 'advanced', years: 3 }
          ]
        },
        socialLinks: {
          linkedin: 'https://linkedin.com/in/johndoe',
          github: 'https://github.com/johndoe',
          website: 'https://johndoe.dev'
        },
        analytics: {
          profileViews: 45,
          lastActive: new Date().toISOString(),
          profileCompleteness: 85
        },
        atsData: {
          overallScore: 92,
          skillsScore: 88,
          experienceScore: 95,
          educationScore: 85,
          aiInsights: {
            strengths: ['Strong technical skills', 'Leadership experience', 'Cloud expertise'],
            weaknesses: ['Limited mobile development', 'No ML experience'],
            recommendations: ['Consider mobile development courses', 'Learn machine learning basics']
          },
          quality: 'high'
        }
      };
      setProfile(mockProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Implement save logic here
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'expert':
        return 'bg-green-100 text-green-800';
      case 'advanced':
        return 'bg-blue-100 text-blue-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'beginner':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white shadow-lg rounded-xl p-12 text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h3>
          <p className="text-gray-600 mb-6">Create your candidate profile to get started.</p>
          <button className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200">
            <Plus className="w-4 h-4 mr-2" />
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your candidate profile and career information</p>
          </div>
          <div className="flex space-x-3">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-primary-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {profile.personalInfo.firstName} {profile.personalInfo.lastName}
            </h2>
            <p className="text-primary-600 font-semibold mb-2">{profile.professionalSummary.headline}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {profile.personalInfo.location.city}, {profile.personalInfo.location.state}
              </span>
              <span className="flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                {profile.personalInfo.email}
              </span>
              <span className="flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                {profile.personalInfo.phone}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                profile.professionalSummary.openToWork 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {profile.professionalSummary.openToWork ? 'Open to Work' : 'Not Available'}
              </span>
              <span className="text-sm text-gray-600">
                Profile {profile.analytics.profileCompleteness}% complete
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-lg rounded-xl mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'experience', label: 'Experience', icon: Briefcase },
              { id: 'education', label: 'Education', icon: GraduationCap },
              { id: 'skills', label: 'Skills', icon: Award },
              { id: 'analytics', label: 'Analytics', icon: Star }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Professional Summary</h3>
                <p className="text-gray-700">{profile.professionalSummary.summary}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Social Links</h3>
                <div className="flex space-x-4">
                  {profile.socialLinks.linkedin && (
                    <a
                      href={profile.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Linkedin className="w-4 h-4 mr-1" />
                      LinkedIn
                    </a>
                  )}
                  {profile.socialLinks.github && (
                    <a
                      href={profile.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-600 hover:text-gray-800"
                    >
                      <Github className="w-4 h-4 mr-1" />
                      GitHub
                    </a>
                  )}
                  {profile.socialLinks.website && (
                    <a
                      href={profile.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-green-600 hover:text-green-800"
                    >
                      <Globe className="w-4 h-4 mr-1" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              {profile.experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-primary-500 pl-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-primary-600 font-semibold">{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(exp.startDate).toLocaleDateString()} - {exp.isCurrent ? 'Present' : new Date(exp.endDate!).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{exp.description}</p>
                  {exp.achievements.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Achievements:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {exp.achievements.map((achievement, idx) => (
                          <li key={idx} className="text-sm text-gray-700">{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {exp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map((skill, idx) => (
                        <span key={idx} className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              {profile.education.map((edu, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-blue-600 font-semibold">{edu.institution}</p>
                      <p className="text-sm text-gray-600">{edu.fieldOfStudy}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(edu.startDate).toLocaleDateString()} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}
                    </span>
                  </div>
                  {edu.description && (
                    <p className="text-gray-700">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.skills.technical.map((skill, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">{skill.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(skill.level)}`}>
                          {skill.level}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {skill.years} years experience
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Profile Views</h4>
                  <p className="text-2xl font-bold text-primary-600">{profile.analytics.profileViews}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Last Active</h4>
                  <p className="text-sm text-gray-600">{new Date(profile.analytics.lastActive).toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Completeness</h4>
                  <p className="text-2xl font-bold text-green-600">{profile.analytics.profileCompleteness}%</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">ATS Scores</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Overall</h4>
                    <p className={`text-2xl font-bold ${getScoreColor(profile.atsData.overallScore)}`}>
                      {profile.atsData.overallScore}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Skills</h4>
                    <p className={`text-2xl font-bold ${getScoreColor(profile.atsData.skillsScore)}`}>
                      {profile.atsData.skillsScore}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Experience</h4>
                    <p className={`text-2xl font-bold ${getScoreColor(profile.atsData.experienceScore)}`}>
                      {profile.atsData.experienceScore}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Education</h4>
                    <p className={`text-2xl font-bold ${getScoreColor(profile.atsData.educationScore)}`}>
                      {profile.atsData.educationScore}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                      Strengths
                    </h4>
                    <ul className="space-y-1">
                      {profile.atsData.aiInsights.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-gray-700">• {strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1 text-yellow-500" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-1">
                      {profile.atsData.aiInsights.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-sm text-gray-700">• {weakness}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                      <Star className="w-4 h-4 mr-1 text-blue-500" />
                      Recommendations
                    </h4>
                    <ul className="space-y-1">
                      {profile.atsData.aiInsights.recommendations.map((recommendation, index) => (
                        <li key={index} className="text-sm text-gray-700">• {recommendation}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
