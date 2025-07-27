import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Building, 
  Mail, 
  Phone, 
  MessageSquare, 
  CheckCircle, 
  ArrowRight,
  Users,
  Target,
  Brain,
  Shield,
  BookOpen
} from 'lucide-react';

interface DemoRequestFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  companySize: string;
  useCase: string;
  preferredDate: string;
  preferredTime: string;
  additionalNotes: string;
  interestedRoles: string[];
}

const DemoRequestForm: React.FC = () => {
  const [formData, setFormData] = useState<DemoRequestFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    companySize: '',
    useCase: '',
    preferredDate: '',
    preferredTime: '',
    additionalNotes: '',
    interestedRoles: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '500+ employees'
  ];

  const useCases = [
    'Employee Training & Development',
    'Compliance Training',
    'Sales Training',
    'Customer Education',
    'Onboarding Programs',
    'Skills Assessment',
    'Performance Management',
    'Other'
  ];

  const timeSlots = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM'
  ];

  const roleOptions = [
    { id: 'super-admin', label: 'Super Admin', icon: Shield, description: 'Full system access & tenant management' },
    { id: 'admin', label: 'Admin', icon: Users, description: 'Organization management & reporting' },
    { id: 'trainer', label: 'Trainer', icon: Brain, description: 'AI content creation & sessions' },
    { id: 'user', label: 'User', icon: BookOpen, description: 'Learning & progress tracking' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleToggle = (roleId: string) => {
    setFormData(prev => ({
      ...prev,
      interestedRoles: prev.interestedRoles.includes(roleId)
        ? prev.interestedRoles.filter(id => id !== roleId)
        : [...prev.interestedRoles, roleId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the data to your backend
      console.log('Demo request submitted:', formData);
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting demo request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Demo Request Submitted!
          </h3>
          <p className="text-gray-600 mb-6">
            Thank you for your interest! Our team will review your request and contact you within 24 hours to schedule your personalized demo.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• We'll review your requirements and use case</li>
              <li>• Our team will contact you within 24 hours</li>
              <li>• We'll schedule a 30-minute personalized demo</li>
              <li>• You'll get hands-on experience with the platform</li>
            </ul>
          </div>
          <button
            onClick={() => setIsSubmitted(false)}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-white font-medium hover:bg-gray-800 transition-colors"
          >
            Request Another Demo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Request a Demo</h2>
        <p className="text-purple-100">
          Schedule a personalized demo with our team and see how LuxGen.AI can transform your training programs.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              placeholder="Enter your last name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              placeholder="Enter your email address"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {/* Company Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              id="company"
              name="company"
              required
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              placeholder="Enter your company name"
            />
          </div>
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              required
              value={formData.jobTitle}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              placeholder="Enter your job title"
            />
          </div>
        </div>

        <div>
          <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-2">
            Company Size *
          </label>
          <select
            id="companySize"
            name="companySize"
            required
            value={formData.companySize}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          >
            <option value="">Select company size</option>
            {companySizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        {/* Use Case */}
        <div>
          <label htmlFor="useCase" className="block text-sm font-medium text-gray-700 mb-2">
            Primary Use Case *
          </label>
          <select
            id="useCase"
            name="useCase"
            required
            value={formData.useCase}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          >
            <option value="">Select your primary use case</option>
            {useCases.map(useCase => (
              <option key={useCase} value={useCase}>{useCase}</option>
            ))}
          </select>
        </div>

        {/* Interested Roles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Which roles are you most interested in? *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roleOptions.map(role => (
              <label
                key={role.id}
                className={`relative flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                  formData.interestedRoles.includes(role.id)
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.interestedRoles.includes(role.id)}
                  onChange={() => handleRoleToggle(role.id)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 rounded mr-3 mt-0.5 flex-shrink-0 ${
                  formData.interestedRoles.includes(role.id)
                    ? 'border-purple-500 bg-purple-500'
                    : 'border-gray-300'
                }`}>
                  {formData.interestedRoles.includes(role.id) && (
                    <CheckCircle className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <role.icon className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-gray-900">{role.label}</span>
                  </div>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Scheduling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Date *
            </label>
            <input
              type="date"
              id="preferredDate"
              name="preferredDate"
              required
              value={formData.preferredDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Time *
            </label>
            <select
              id="preferredTime"
              name="preferredTime"
              required
              value={formData.preferredTime}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            >
              <option value="">Select time slot</option>
              {timeSlots.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            rows={4}
            value={formData.additionalNotes}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            placeholder="Tell us about your specific needs, challenges, or questions..."
          />
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting || formData.interestedRoles.length === 0}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-8 rounded-lg hover:from-purple-700 hover:to-pink-700 focus:ring-4 focus:ring-purple-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting Request...
              </>
            ) : (
              <>
                Schedule Demo
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">What to expect</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 30-minute personalized demo session</li>
                <li>• Live platform walkthrough with your use case</li>
                <li>• Q&A session with our product experts</li>
                <li>• Follow-up resources and next steps</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DemoRequestForm; 