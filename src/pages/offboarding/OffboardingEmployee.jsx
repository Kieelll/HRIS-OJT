import { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import ConfirmationModal from '../../components/common/ConfirmationModal'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Modal from '../../components/common/Modal'
import ProgressBar from '../../components/common/ProgressBar'
import { useToast } from '../../contexts/ToastContext'

const OffboardingEmployee = () => {
  const [showResignationModal, setShowResignationModal] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [offboardingStatus, setOffboardingStatus] = useState(null)
  const { showToast } = useToast()

  const [formData, setFormData] = useState({
    resignationDate: '',
    lastWorkingDay: '',
    reason: '',
    feedback: '',
  })

  const [errors, setErrors] = useState({})

  const navItems = [
    { path: '/employee/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/employee/offboarding', label: 'Offboarding', icon: '👋' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ]

  const offboardingSteps = ['Resignation Submitted', 'Exit Checklist', 'Clearance', 'Final Pay', 'Complete']

  const validate = () => {
    const newErrors = {}
    if (!formData.resignationDate) newErrors.resignationDate = 'Resignation date is required'
    if (!formData.lastWorkingDay) newErrors.lastWorkingDay = 'Last working day is required'
    if (!formData.reason) newErrors.reason = 'Reason is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    setShowSubmitModal(true)
  }

  const confirmSubmit = () => {
    setOffboardingStatus({
      status: 'submitted',
      resignationDate: formData.resignationDate,
      lastWorkingDay: formData.lastWorkingDay,
      progress: 1,
    })
    setShowResignationModal(false)
    setShowSubmitModal(false)
    setFormData({ resignationDate: '', lastWorkingDay: '', reason: '', feedback: '' })
    setErrors({})
    showToast('Resignation submitted successfully', 'success')
  }

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Offboarding</h2>
          <p className="text-gray-600 mt-1">Manage your exit process</p>
        </div>

        {!offboardingStatus ? (
          <div className="bg-white rounded-xl p-8 card-elevation text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">No Active Offboarding</h3>
            <p className="text-gray-600 mb-6">
              If you're planning to leave the company, you can submit your resignation here.
            </p>
            <Button variant="primary" onClick={() => setShowResignationModal(true)}>
              Submit Resignation
            </Button>
          </div>
        ) : (
          <>
            {/* Progress Tracker */}
            <div className="bg-white rounded-xl p-6 card-elevation">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Offboarding Progress</h3>
              <ProgressBar steps={offboardingSteps} currentStep={offboardingStatus.progress} />
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-xl p-6 card-elevation">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Exit Status</h3>
                <Badge variant="warning">{offboardingStatus.status}</Badge>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Resignation Date</span>
                  <span className="font-semibold">{offboardingStatus.resignationDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Working Day</span>
                  <span className="font-semibold">{offboardingStatus.lastWorkingDay}</span>
                </div>
              </div>
            </div>

            {/* Exit Checklist */}
            <div className="bg-white rounded-xl p-6 card-elevation">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Exit Checklist</h3>
              <div className="space-y-3">
                {[
                  'Equipment Return',
                  'Access Revoked',
                  'Final Pay Processed',
                  'Exit Interview Completed',
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-mesh-primary rounded-lg"
                  >
                    <span className="text-gray-700">{item}</span>
                    <Badge variant={index < 2 ? 'success' : 'warning'}>
                      {index < 2 ? 'Completed' : 'Pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Resignation Form Modal */}
        <Modal
          isOpen={showResignationModal}
          onClose={() => {
            setShowResignationModal(false)
            setFormData({ resignationDate: '', lastWorkingDay: '', reason: '', feedback: '' })
            setErrors({})
          }}
          title="Submit Resignation"
          size="lg"
        >
          <form className="space-y-4">
            <Input
              label="Resignation Date"
              type="date"
              value={formData.resignationDate}
              onChange={(e) => setFormData({ ...formData, resignationDate: e.target.value })}
              error={errors.resignationDate}
              required
            />
            <Input
              label="Last Working Day"
              type="date"
              value={formData.lastWorkingDay}
              onChange={(e) => setFormData({ ...formData, lastWorkingDay: e.target.value })}
              error={errors.lastWorkingDay}
              required
            />
            <Select
              label="Reason for Leaving"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              options={[
                { value: 'better_opportunity', label: 'Better Opportunity' },
                { value: 'relocation', label: 'Relocation' },
                { value: 'personal', label: 'Personal Reasons' },
                { value: 'career_change', label: 'Career Change' },
                { value: 'other', label: 'Other' },
              ]}
              error={errors.reason}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Feedback (Optional)
              </label>
              <textarea
                value={formData.feedback}
                onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg bg-white border-warm-beige focus:outline-none focus:ring-2 focus:ring-warm-amber"
                placeholder="Share any feedback or comments..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowResignationModal(false)
                  setFormData({ resignationDate: '', lastWorkingDay: '', reason: '', feedback: '' })
                  setErrors({})
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Submit Resignation
              </Button>
            </div>
          </form>
        </Modal>

        {/* Submit Confirmation */}
        <ConfirmationModal
          isOpen={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          onConfirm={confirmSubmit}
          title="Submit Resignation"
          message="Are you sure you want to submit your resignation? This action will initiate the offboarding process."
          confirmText="Submit"
          cancelText="Cancel"
          variant="primary"
        />
      </div>
    </DashboardLayout>
  )
}

export default OffboardingEmployee

