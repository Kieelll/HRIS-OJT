import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { mockJobListings } from '../../mockData'
import { useApplicantProfile } from '../../contexts/ApplicantProfileContext'
import ProgressBar from '../../components/common/ProgressBar'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import ConfirmationModal from '../../components/common/ConfirmationModal'
import { useToast } from '../../contexts/ToastContext'

const ApplyJob = () => {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { profile, getCompletionPercentage } = useApplicantProfile()
  const [currentStep, setCurrentStep] = useState(1)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showProfileWarning, setShowProfileWarning] = useState(false)

  const job = mockJobListings.find((j) => j.id === jobId)
  const completionPercentage = getCompletionPercentage()

  const steps = ['Job-Specific Info', 'Review & Submit']

  // Auto-fill from profile
  const [formData, setFormData] = useState({
    // Auto-filled from profile (read-only)
    fullName: profile?.fullName || '',
    email: profile?.email || '',
    contactNumber: profile?.contactNumber || '',
    address: profile?.address || '',
    resume: profile?.resume || null,
    cv: profile?.cv || null,
    
    // Job-specific fields (editable)
    position: job?.title || '',
    department: job?.department || '',
    employmentType: job?.employmentType || '',
    preferredStartDate: '',
    coverLetter: '',
    additionalDocuments: null,
  })

  const [errors, setErrors] = useState({})

  const navItems = [
    { path: '/applicant/jobs', label: 'Job Listings', icon: 'briefcase' },
    { path: '/applicant/applications', label: 'My Applications', icon: 'document' },
    { path: '/applicant/onboarding', label: 'Onboarding Progress', icon: 'checkmark' },
    { path: '/applicant/profile', label: 'My Profile', icon: 'person' },
  ]

  useEffect(() => {
    if (!job) {
      navigate('/applicant/jobs')
      return
    }

    // Check profile completion - only warn if critical fields missing
    const hasCriticalFields = profile?.email && profile?.fullName && profile?.contactNumber
    if (!profile || !hasCriticalFields) {
      setShowProfileWarning(true)
    }

    // Auto-fill from profile when it loads
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        fullName: profile.fullName || prev.fullName,
        email: profile.email || prev.email,
        contactNumber: profile.contactNumber || prev.contactNumber,
        address: profile.address || prev.address,
        resume: profile.resume || prev.resume,
        cv: profile.cv || prev.cv,
      }))
    }
  }, [job, navigate, profile, completionPercentage])

  const validateStep = (step) => {
    const newErrors = {}
    // Only validate preferred start date - everything else can come from profile or be optional
    if (step === 1) {
      if (!formData.preferredStartDate) {
        newErrors.preferredStartDate = 'Preferred start date helps us plan your onboarding'
      }
    }
    setErrors(newErrors)
    // Allow proceeding even with warnings - just show the error but don't block
    return true
  }

  const handleContinueWithIncompleteProfile = () => {
    setShowProfileWarning(false)
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    setShowSubmitModal(true)
  }

  const confirmSubmit = () => {
    // Flexible submission - use whatever data is available
    // Only require email and basic contact info if available
    if (!formData.email && !profile?.email) {
      showToast('Email is required to submit application', 'error')
      setShowSubmitModal(false)
      return
    }
    
    // Mock submission - accepts partial data
    showToast('Application submitted successfully! We\'ll use the information you provided.', 'success')
    setShowSubmitModal(false)
    setShowSuccess(true)
    setTimeout(() => {
      navigate('/applicant/jobs')
    }, 3000)
  }


  if (!job) return null

  // Profile warning modal
  if (showProfileWarning) {
    return (
      <DashboardLayout navItems={navItems}>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-8 card-elevation">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">ℹ️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Information Needed</h2>
              <p className="text-gray-600">
                To apply for this job, we need some basic information from your profile. You can complete the rest later.
              </p>
            </div>
            
            {profile && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-gray-800 mb-2">Required for Application:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {!profile.fullName && <li>• Full Name (required)</li>}
                  {!profile.email && <li>• Email Address (required)</li>}
                  {!profile.contactNumber && <li>• Contact Number (required)</li>}
                </ul>
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-sm font-medium text-gray-800 mb-2">Recommended (can add later):</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {!profile.address && <li>• Address</li>}
                    {!profile.resume && <li>• Resume</li>}
                    {profile.skills?.length === 0 && <li>• Skills</li>}
                  </ul>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/applicant/profile">
                <Button variant="primary" className="w-full sm:w-auto">
                  Add Required Info
                </Button>
              </Link>
              <Button variant="outline" onClick={handleContinueWithIncompleteProfile} className="w-full sm:w-auto">
                Continue with Current Profile
              </Button>
            </div>
            <p className="text-xs text-center text-gray-500 mt-4">
              You can always update your profile later. We'll use whatever information you have available.
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (showSuccess) {
    return (
      <DashboardLayout navItems={navItems}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center bg-white rounded-2xl p-12 card-elevation max-w-md">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Application Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your application. We've sent a confirmation email to {formData.email}
            </p>
            <p className="text-sm text-gray-500">You will be redirected shortly...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Apply for {job.title}</h2>
          <p className="text-gray-600 mt-1">{job.department} • {job.employmentType}</p>
        </div>

        <div className="bg-white rounded-xl p-6 card-elevation">
          <ProgressBar steps={steps} currentStep={currentStep} />
        </div>

        {/* Auto-filled Information Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start">
            <span className="text-xl mr-3">ℹ️</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 mb-1">
                Information from your profile has been auto-filled
              </p>
              <p className="text-xs text-gray-600">
                Your saved profile information is automatically used here. Missing fields? No problem - you can add them to your profile anytime, and they'll be included in future applications.
                <Link to="/applicant/profile" className="text-blue-600 hover:underline ml-1">Update profile →</Link>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 card-elevation">
          {/* Step 1: Job-Specific Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Job-Specific Information</h3>
                <p className="text-gray-600 text-sm">
                  Complete the information specific to this job application. Your profile information is already included.
                </p>
              </div>

              {/* Auto-filled from Profile Section */}
              <div className="bg-mesh-primary rounded-lg p-6 border border-warm-beige">
                <div className="flex items-center mb-4">
                  <Badge variant="info" className="mr-2">From Your Profile</Badge>
                  <span className="text-sm text-gray-600">Auto-filled - Update in profile</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                    <p className="text-sm text-gray-800">{formData.fullName || 'Not set in profile'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                    <p className="text-sm text-gray-800">{formData.email || 'Not set in profile'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Contact Number</label>
                    <p className="text-sm text-gray-800">{formData.contactNumber || 'Not set in profile'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Address</label>
                    <p className="text-sm text-gray-800">{formData.address || 'Not set in profile'}</p>
                  </div>
                </div>
                
                {/* Documents from Profile */}
                <div className="mt-4 pt-4 border-t border-warm-beige">
                  <label className="block text-xs font-medium text-gray-500 mb-2">Documents from Profile</label>
                  <div className="space-y-2">
                    {formData.resume ? (
                      <div className="flex items-center text-sm text-gray-700">
                        <span className="mr-2">📄</span>
                        <span>Resume: {formData.resume.name || 'Uploaded'}</span>
                      </div>
                    ) : (
                      <p className="text-sm text-yellow-600">⚠️ Resume not found in profile</p>
                    )}
                    {formData.cv && (
                      <div className="flex items-center text-sm text-gray-700">
                        <span className="mr-2">📄</span>
                        <span>CV: {formData.cv.name || 'Uploaded'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Job-Specific Fields */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">Job Details</h4>
                <Input
                  label="Position"
                  value={formData.position}
                  disabled
                />
                <Input
                  label="Department"
                  value={formData.department}
                  disabled
                />
                <Select
                  label="Employment Type"
                  value={formData.employmentType}
                  disabled
                  options={[{ value: formData.employmentType, label: formData.employmentType }]}
                />
                <Input
                  label="Preferred Start Date"
                  type="date"
                  value={formData.preferredStartDate}
                  onChange={(e) => setFormData({ ...formData, preferredStartDate: e.target.value })}
                  error={errors.preferredStartDate}
                  required
                />
              </div>

              {/* Additional Job-Specific Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg bg-white border-warm-beige focus:outline-none focus:ring-2 focus:ring-warm-amber"
                  placeholder="Write a cover letter specific to this position..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Documents (Optional)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      setFormData({ ...formData, additionalDocuments: { name: file.name } })
                    }
                  }}
                  className="w-full px-4 py-2 border rounded-lg bg-white border-warm-beige"
                />
                {formData.additionalDocuments && (
                  <p className="text-sm text-gray-600 mt-2">Selected: {formData.additionalDocuments.name}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Upload any additional documents specific to this application (e.g., portfolio, certifications)
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-800">Review Your Application</h3>
              
              {/* Profile Information */}
              <div className="bg-mesh-primary rounded-lg p-6 border border-warm-beige">
                <div className="flex items-center mb-4">
                  <Badge variant="info">From Your Profile</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-medium text-gray-500">Full Name:</span>
                    <p className="text-sm text-gray-800">{formData.fullName}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-500">Email:</span>
                    <p className="text-sm text-gray-800">{formData.email}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-500">Contact Number:</span>
                    <p className="text-sm text-gray-800">{formData.contactNumber}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-500">Address:</span>
                    <p className="text-sm text-gray-800">{formData.address}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-warm-beige">
                  <span className="text-xs font-medium text-gray-500">Documents:</span>
                  <div className="mt-2 space-y-1">
                    {formData.resume && (
                      <p className="text-sm text-gray-700">📄 Resume: {formData.resume.name || 'From profile'}</p>
                    )}
                    {formData.cv && (
                      <p className="text-sm text-gray-700">📄 CV: {formData.cv.name || 'From profile'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Job-Specific Information */}
              <div className="bg-white rounded-lg p-6 border border-warm-beige">
                <div className="flex items-center mb-4">
                  <Badge variant="primary">Job-Specific</Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-medium text-gray-500">Position:</span>
                    <p className="text-sm text-gray-800">{formData.position}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-500">Department:</span>
                    <p className="text-sm text-gray-800">{formData.department}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-500">Employment Type:</span>
                    <p className="text-sm text-gray-800">{formData.employmentType}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-500">Preferred Start Date:</span>
                    <p className="text-sm text-gray-800">{formData.preferredStartDate || 'Not specified'}</p>
                  </div>
                  {formData.coverLetter && (
                    <div>
                      <span className="text-xs font-medium text-gray-500">Cover Letter:</span>
                      <p className="text-sm text-gray-800 mt-1">{formData.coverLetter}</p>
                    </div>
                  )}
                  {formData.additionalDocuments && (
                    <div>
                      <span className="text-xs font-medium text-gray-500">Additional Documents:</span>
                      <p className="text-sm text-gray-800">{formData.additionalDocuments.name}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-warm-beige">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            ) : (
              <div />
            )}
            {currentStep < 2 ? (
              <Button variant="primary" onClick={handleNext}>
                Review & Submit
              </Button>
            ) : (
              <Button variant="primary" onClick={handleSubmit}>
                Submit Application
              </Button>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={confirmSubmit}
        title="Submit Application"
        message="Submit your application with the information provided? You can always update your profile and resubmit if needed."
        confirmText="Submit Application"
        cancelText="Review Again"
        variant="primary"
      />
    </DashboardLayout>
  )
}

export default ApplyJob

