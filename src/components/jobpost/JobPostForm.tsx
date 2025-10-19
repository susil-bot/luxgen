import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, Eye } from 'lucide-react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../common/Modal';
import { Input, Select, Textarea, Checkbox, MultiSelect } from '../common/FormComponents';
import { Button } from '../common/SimpleThemeComponents';
import { useFormValidation, JobPostRules } from '../../utils/formValidation';
import { CreateJobPostData, JobPostItem } from './Types.types';
import { JOB_POST_CONSTANTS } from './CONSTANTS';

interface JobPostFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateJobPostData) => Promise<void>;
  editingJobPost?: JobPostItem | null;
  isSubmitting?: boolean;
}

const JobPostForm: React.FC<JobPostFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingJobPost,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState<CreateJobPostData>({
    title: '',
    description: '',
    department: '',
    location: '',
    type: 'full-time',
    salary: undefined,
    requirements: '',
    benefits: [],
    skills: [],
    experience: '',
    education: '',
    company: '',
    contactEmail: '',
    contactPhone: '',
    applicationDeadline: '',
    startDate: '',
    isRemote: false,
    isUrgent: false,
    isFeatured: false,
    tags: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newBenefit, setNewBenefit] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newTag, setNewTag] = useState('');

  const { validateField, validateForm } = useFormValidation(JobPostRules);

  // Initialize form data when editing
  useEffect(() => {
    if (editingJobPost) {
      setFormData({
        title: editingJobPost.title,
        description: editingJobPost.description,
        department: '', // Not in new structure
        location: editingJobPost.location.city + ', ' + editingJobPost.location.country,
        type: editingJobPost.jobType,
        salary: editingJobPost.salary?.min || 0,
        requirements: editingJobPost.requirements?.experience?.description || '',
        benefits: editingJobPost.benefits || [],
        skills: editingJobPost.requirements?.skills || [],
        experience: editingJobPost.requirements?.experience?.years?.toString() || '',
        education: editingJobPost.requirements?.education?.level || '',
        company: editingJobPost.company.name,
        contactEmail: '', // Not in new structure
        contactPhone: '', // Not in new structure
        applicationDeadline: editingJobPost.applicationProcess?.deadline || '',
        startDate: editingJobPost.applicationProcess?.startDate || '',
        isRemote: editingJobPost.location.remote || false,
        isUrgent: editingJobPost.urgent,
        isFeatured: editingJobPost.featured,
        tags: editingJobPost.tags || []
      });
    } else {
      // Reset form for new job post
      setFormData({
        title: '',
        description: '',
        department: '',
        location: '',
        type: 'full-time',
        salary: undefined,
        requirements: '',
        benefits: [],
        skills: [],
        experience: '',
        education: '',
        company: '',
        contactEmail: '',
        contactPhone: '',
        applicationDeadline: '',
        startDate: '',
        isRemote: false,
        isUrgent: false,
        isFeatured: false,
        tags: []
      });
    }
    setErrors({});
  }, [editingJobPost, isOpen]);

  const handleInputChange = (field: keyof CreateJobPostData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field: keyof CreateJobPostData) => {
    const error = validateField(field, formData[field]);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const addBenefit = () => {
    if (newBenefit.trim() && (formData.benefits?.length || 0) < 15) {
      setFormData(prev => ({
        ...prev,
        benefits: [...(prev.benefits || []), newBenefit.trim()]
      }));
      setNewBenefit('');
    }
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: (prev.benefits || []).filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && (formData.skills?.length || 0) < 20) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: (prev.skills || []).filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && (formData.tags?.length || 0) < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started with data:', formData);
    
    const validationErrors = validateForm(formData);
    console.log('Validation errors:', validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log('Form has validation errors, not submitting');
      return;
    }

    try {
      console.log('Calling onSubmit with data:', formData);
      await onSubmit(formData);
      console.log('Form submitted successfully');
      onClose();
    } catch (error) {
      console.error('Error submitting job post:', error);
    }
  };

  const departmentOptions = JOB_POST_CONSTANTS.DEPARTMENTS.map(dept => ({
    value: dept,
    label: dept
  }));

  const locationOptions = JOB_POST_CONSTANTS.LOCATIONS.map(loc => ({
    value: loc,
    label: loc
  }));

  const jobTypeOptions = JOB_POST_CONSTANTS.JOB_TYPES.map(type => ({
    value: type.value,
    label: type.label
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingJobPost ? 'Edit Job Post' : 'Create New Job Post'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Job Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              onBlur={() => handleBlur('title')}
              error={errors.title}
              placeholder="e.g., Senior Software Engineer"
              required
            />
            
            <Input
              label="Company"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              onBlur={() => handleBlur('company')}
              error={errors.company}
              placeholder="e.g., LuxGen Corporation"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Department"
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              onBlur={() => handleBlur('department')}
              error={errors.department}
              options={departmentOptions}
              placeholder="Select department"
              required
            />
            
            <Select
              label="Location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              onBlur={() => handleBlur('location')}
              error={errors.location}
              options={locationOptions}
              placeholder="Select location"
              required
            />
            
            <Select
              label="Job Type"
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              onBlur={() => handleBlur('type')}
              error={errors.type}
              options={jobTypeOptions}
              required
            />
          </div>
          
          <Textarea
            label="Job Description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            onBlur={() => handleBlur('description')}
            error={errors.description}
            placeholder="Describe the role, responsibilities, and what makes this opportunity special..."
            rows={4}
            required
          />
        </div>

        {/* Requirements & Qualifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Requirements & Qualifications
          </h3>
          
          <Textarea
            label="Requirements"
            value={formData.requirements}
            onChange={(e) => handleInputChange('requirements', e.target.value)}
            onBlur={() => handleBlur('requirements')}
            error={errors.requirements}
            placeholder="List the key requirements and qualifications..."
            rows={3}
          />
          
          <Input
            label="Experience Level"
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            placeholder="e.g., 3-5 years, Senior level, etc."
          />
          
          <Input
            label="Education Requirements"
            value={formData.education}
            onChange={(e) => handleInputChange('education', e.target.value)}
            placeholder="e.g., Bachelor's degree in Computer Science"
          />
        </div>

        {/* Skills */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Skills & Technologies
          </h3>
          
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill (e.g., React, Python, Leadership)"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addSkill}
                variant="secondary"
                size="md"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {(formData.skills?.length || 0) > 0 && (
              <div className="flex flex-wrap gap-2">
                {(formData.skills || []).map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Benefits & Perks
          </h3>
          
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="Add a benefit (e.g., Health insurance, Remote work, etc.)"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addBenefit}
                variant="secondary"
                size="md"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {(formData.benefits?.length || 0) > 0 && (
              <div className="space-y-2">
                {(formData.benefits || []).map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-700">{benefit}</span>
                    <button
                      type="button"
                      onClick={() => removeBenefit(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Additional Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Salary Range"
              value={formData.salary?.toString() || ''}
              onChange={(e) => handleInputChange('salary', e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="e.g., 80000-120000"
              type="number"
            />
            
            <Input
              label="Contact Email"
              value={formData.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              placeholder="hr@company.com"
              type="email"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Contact Phone"
              value={formData.contactPhone}
              onChange={(e) => handleInputChange('contactPhone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
            
            <Input
              label="Application Deadline"
              value={formData.applicationDeadline}
              onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
              type="date"
            />
          </div>
          
          <Input
            label="Start Date"
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            type="date"
          />
        </div>

        {/* Job Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Job Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Checkbox
              label="Remote Work"
              checked={formData.isRemote}
              onChange={(e) => handleInputChange('isRemote', e.target.checked)}
              description="This position allows remote work"
            />
            
            <Checkbox
              label="Urgent Hiring"
              checked={formData.isUrgent}
              onChange={(e) => handleInputChange('isUrgent', e.target.checked)}
              description="Mark as urgent for faster processing"
            />
            
            <Checkbox
              label="Featured Job"
              checked={formData.isFeatured}
              onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
              description="Show this job prominently"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Tags
          </h3>
          
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag (e.g., #startup, #tech, #remote)"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addTag}
                variant="secondary"
                size="md"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {(formData.tags?.length || 0) > 0 && (
              <div className="flex flex-wrap gap-2">
                {(formData.tags || []).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <ModalFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            <Save className="w-4 h-4 mr-2" />
            {editingJobPost ? 'Update Job Post' : 'Create Job Post'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default JobPostForm;
