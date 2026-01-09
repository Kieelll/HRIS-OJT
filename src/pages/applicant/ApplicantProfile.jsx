import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useApplicantProfile } from '../../contexts/ApplicantProfileContext'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import ProgressBar from '../../components/common/ProgressBar'
import ConfirmationModal from '../../components/common/ConfirmationModal'
import FieldHelper from '../../components/common/FieldHelper'
import { useToast } from '../../contexts/ToastContext'
import { User, Briefcase, Heart, FileText } from 'lucide-react'

const ApplicantProfile = () => {
  const { profile, updateProfile, getCompletionPercentage } = useApplicantProfile()
  const { showToast } = useToast()
  const [isEditing, setIsEditing] = useState(!profile || getCompletionPercentage() < 100)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [activeTab, setActiveTab] = useState('professional') // Tab navigation state
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: profile?.fullName || '',
    email: profile?.email || '',
    contactNumber: profile?.contactNumber || '',
    address: profile?.address || '',
    
    // Professional Information
    skills: profile?.skills || [],
    yearsOfExperience: profile?.yearsOfExperience || '',
    preferredRoles: profile?.preferredRoles || [],
    employmentTypePreferences: profile?.employmentTypePreferences || [],
    
    // Personal Attributes
    personalityTraits: profile?.personalityTraits || [],
    workStyle: profile?.workStyle || '',
    
    // Documents
    resume: profile?.resume || null,
    cv: profile?.cv || null,
    supportingDocuments: profile?.supportingDocuments || [],
  })

  const [skillInput, setSkillInput] = useState('')
  const [traitInput, setTraitInput] = useState('')

  const navItems = [
    { path: '/applicant/jobs', label: 'Job Listings', icon: 'briefcase' },
    { path: '/applicant/applications', label: 'My Applications', icon: 'document' },
    { path: '/applicant/onboarding', label: 'Onboarding Progress', icon: 'checkmark' },
    { path: '/applicant/profile', label: 'My Profile', icon: 'person' },
  ]

  const completionPercentage = getCompletionPercentage()

  const skillOptions = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'HTML/CSS',
    'TypeScript', 'Vue.js', 'Angular', 'AWS', 'Docker', 'Git', 'Agile'
  ]

  const personalityTraitOptions = [
    'Analytical', 'Creative', 'Detail-oriented', 'Collaborative', 'Independent',
    'Leadership', 'Adaptable', 'Proactive', 'Problem-solver', 'Communicative'
  ]

  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']

  // Flexible validation - only validate critical fields for basic profile
  const validate = (strict = false) => {
    const newErrors = {}
    // Only validate email as absolutely critical
    if (!formData.email) {
      newErrors.email = 'Email is required to save your profile'
    }
    // If strict mode (e.g., for job application), validate more fields
    if (strict) {
      if (!formData.fullName) newErrors.fullName = 'Full name is required for job applications'
      if (!formData.contactNumber) newErrors.contactNumber = 'Contact number is required for job applications'
      if (!formData.resume) newErrors.resume = 'Resume is required for job applications'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    // Allow partial saves - only require email
    if (!validate(false)) {
      setShowSaveModal(false)
      showToast('Email is required to save your profile', 'error')
      return
    }
    
    updateProfile(formData)
    setIsEditing(false)
    setShowSaveModal(false)
    showToast('Profile saved successfully. You can complete remaining fields later.', 'success')
  }

  const handleAddSkill = (skill) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] })
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) })
  }

  const handleAddTrait = (trait) => {
    if (trait && !formData.personalityTraits.includes(trait)) {
      setFormData({ ...formData, personalityTraits: [...formData.personalityTraits, trait] })
      setTraitInput('')
    }
  }

  const handleRemoveTrait = (trait) => {
    setFormData({ ...formData, personalityTraits: formData.personalityTraits.filter((t) => t !== trait) })
  }

  const handleFileUpload = (field, file) => {
    if (file) {
      setFormData({ ...formData, [field]: { name: file.name, uploaded: new Date().toISOString() } })
    }
  }

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        {/* Header with Completion Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
              <p className="text-gray-600">
                Complete your profile to speed up job applications. Your information will be saved and automatically pre-filled for future applications.
              </p>
            </div>
            {isEditing ? (
              <div className="flex flex-col items-end">
                <Button 
                  variant="primary" 
                  onClick={() => setShowSaveModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white border-0"
                >
                  Save Profile
                </Button>
                <p className="text-xs text-gray-500 mt-1">Save anytime, complete later</p>
              </div>
            ) : (
              <Button 
                variant="primary" 
                onClick={() => setIsEditing(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white border-0"
              >
                Edit Profile
              </Button>
            )}
          </div>
          
          {/* Profile Completion Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Profile Completion</h3>
              <span className="text-lg font-bold text-gray-900">{completionPercentage}%</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            {completionPercentage < 100 && (
              <p className="text-xs text-gray-500">
                You can save your profile at any time. Only email is required to save.
              </p>
            )}

            {/* Profile Steps */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { key: 'personal', label: 'Personal Information', complete: formData.fullName && formData.email && formData.contactNumber && formData.address },
                { key: 'professional', label: 'Professional Details', complete: formData.skills.length > 0 && formData.yearsOfExperience && formData.preferredRoles.length > 0 },
                { key: 'attributes', label: 'Personal Attributes', complete: formData.personalityTraits.length > 0 || formData.workStyle },
                { key: 'documents', label: 'Documents', complete: formData.resume !== null },
              ].map((step) => (
                <div key={step.key} className="flex items-center space-x-2">
                  {step.complete ? (
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  )}
                  <span className={`text-sm ${step.complete ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex space-x-1 px-6">
              <button
                type="button"
                onClick={() => setActiveTab('personal')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${
                  activeTab === 'personal'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <User className={`mr-2 w-4 h-4 ${activeTab === 'personal' ? 'text-purple-600' : 'text-gray-600'}`} />
                Personal Info
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('professional')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${
                  activeTab === 'professional'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Briefcase className={`mr-2 w-4 h-4 ${activeTab === 'professional' ? 'text-purple-600' : 'text-gray-600'}`} />
                Professional
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('attributes')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${
                  activeTab === 'attributes'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Heart className={`mr-2 w-4 h-4 ${activeTab === 'attributes' ? 'text-purple-600' : 'text-gray-600'}`} />
                Attributes
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('documents')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${
                  activeTab === 'documents'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className={`mr-2 w-4 h-4 ${activeTab === 'documents' ? 'text-purple-600' : 'text-gray-600'}`} />
                Documents
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <form className="space-y-6">
              {/* Personal Information Tab */}
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                error={errors.fullName}
                disabled={!isEditing}
                placeholder="Enter your full name"
              />
              <div>
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={errors.email}
                  disabled={!isEditing}
                  placeholder="your.email@example.com"
                  required
                />
                <FieldHelper text="Required to save your profile" type="info" />
              </div>
              <div>
                <Input
                  label="Contact Number"
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  error={errors.contactNumber}
                  disabled={!isEditing}
                  placeholder="+1 (555) 123-4567"
                />
                <FieldHelper text="Recommended for job applications" type="info" />
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Home Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  error={errors.address}
                  disabled={!isEditing}
                  placeholder="123 Main St, City, State ZIP"
                />
                <FieldHelper text="Optional - can be added later" type="info" />
              </div>
                  </div>
                </div>
              )}

              {/* Professional Information Tab */}
              {activeTab === 'professional' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800">Professional Information</h3>
                  
                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      Add your skills to help employers find you. You can add more later.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.skills.map((skill) => (
                        <Badge key={skill} variant="default" className="flex items-center bg-gray-100 text-gray-800">
                          {skill}
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="ml-2 text-gray-500 hover:text-gray-800"
                            >
                              ×
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>
                    {isEditing && (
                      <div className="flex gap-2">
                        <select
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          className="flex-1 px-4 py-2 border rounded-lg bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Select a skill...</option>
                          {skillOptions.filter((s) => !formData.skills.includes(s)).map((skill) => (
                            <option key={skill} value={skill}>{skill}</option>
                          ))}
                        </select>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleAddSkill(skillInput)}
                          disabled={!skillInput}
                          className="bg-purple-600 text-white hover:bg-purple-700 border-0"
                        >
                          + Add Skill
                        </Button>
                      </div>
                    )}
                    {errors.skills && <p className="text-sm text-red-500 mt-1">{errors.skills}</p>}
                  </div>

                  {/* Years of Experience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      Your years of professional experience (optional)
                    </p>
                    <input
                      type="number"
                      value={formData.yearsOfExperience}
                      onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border rounded-lg bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
                      min="0"
                      max="50"
                      placeholder="e.g., 5"
                    />
                    {errors.yearsOfExperience && <p className="text-sm text-red-500 mt-1">{errors.yearsOfExperience}</p>}
                    <FieldHelper text="This helps employers understand your experience level" type="info" />
                  </div>

                  {/* Preferred Roles */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Roles
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      Select roles you're interested in. You can update this anytime.
                    </p>
                    <select
                      value={formData.preferredRoles[0] || ''}
                      onChange={(e) => {
                        if (e.target.value && !formData.preferredRoles.includes(e.target.value)) {
                          setFormData({ ...formData, preferredRoles: [...formData.preferredRoles, e.target.value] })
                        }
                      }}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border rounded-lg bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
                    >
                      <option value="">Select</option>
                      {['Software Engineer', 'Product Manager', 'Designer', 'Data Analyst', 'HR Specialist', 'Marketing Manager', 'Sales Manager', 'Operations Manager']
                        .filter((r) => !formData.preferredRoles.includes(r))
                        .map((role) => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                    {formData.preferredRoles.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.preferredRoles.map((role) => (
                          <Badge key={role} variant="default" className="flex items-center bg-gray-100 text-gray-800">
                            {role}
                            {isEditing && (
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, preferredRoles: formData.preferredRoles.filter((r) => r !== role) })}
                                className="ml-2 text-gray-500 hover:text-gray-800"
                              >
                                ×
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {errors.preferredRoles && <p className="text-sm text-red-500 mt-1">{errors.preferredRoles}</p>}
                  </div>
                </div>
              )}

              {/* Attributes Tab */}
              {activeTab === 'attributes' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800">Personal Attributes</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Work Style / Strengths
                    </label>
                    <textarea
                      value={formData.workStyle}
                      onChange={(e) => setFormData({ ...formData, workStyle: e.target.value })}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-4 py-2 border rounded-lg bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
                      placeholder="Describe your work style and key strengths..."
                    />
                  </div>
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === 'documents' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800">Documents</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resume
                      </label>
                      <p className="text-xs text-gray-500 mb-2">
                        Upload your resume. Required for job applications, but you can add it later.
                      </p>
                <p className="text-xs text-gray-500 mb-2">
                  Upload your resume. Required for job applications, but you can add it later.
                </p>
                      {formData.resume ? (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">📄</span>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{formData.resume.name}</p>
                              <p className="text-xs text-gray-500">
                                Uploaded {new Date(formData.resume.uploaded).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          {isEditing && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setFormData({ ...formData, resume: null })}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ) : (
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileUpload('resume', e.target.files[0])}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border rounded-lg bg-white border-gray-300 disabled:bg-gray-50"
                        />
                      )}
                      {errors.resume && <p className="text-sm text-red-500 mt-1">{errors.resume}</p>}
                      <FieldHelper 
                        text="Resume is required for job applications, but you can apply first and add it later" 
                        type="warning" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CV (Optional)
                      </label>
                      <p className="text-xs text-gray-500 mb-2">
                        Additional document to showcase your qualifications
                      </p>
                      {formData.cv ? (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">📄</span>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{formData.cv.name}</p>
                              <p className="text-xs text-gray-500">
                                Uploaded {new Date(formData.cv.uploaded).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          {isEditing && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setFormData({ ...formData, cv: null })}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ) : (
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileUpload('cv', e.target.files[0])}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border rounded-lg bg-white border-gray-300 disabled:bg-gray-50"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </form>
            
            {/* Helpful Footer Message */}
            {isEditing && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <span className="text-lg mr-2">💡</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800 mb-1">Save Your Progress Anytime</p>
                      <p className="text-xs text-gray-600">
                        You don't need to complete everything now. Save what you have and come back later to add more information. 
                        Only your email is required to save your profile.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onConfirm={handleSave}
        title="Save Profile"
        message={`Your profile is ${completionPercentage}% complete. You can always come back to add more information later. Save your progress now?`}
        confirmText="Save Progress"
        cancelText="Continue Editing"
        variant="primary"
      />
    </DashboardLayout>
  )
}

export default ApplicantProfile

