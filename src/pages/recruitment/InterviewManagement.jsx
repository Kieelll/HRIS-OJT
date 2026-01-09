import { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { mockInterviews } from '../../mockData'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Modal from '../../components/common/Modal'
import ConfirmationModal from '../../components/common/ConfirmationModal'
import Table from '../../components/common/Table'
import { useToast } from '../../contexts/ToastContext'

const InterviewManagement = () => {
  const [interviews, setInterviews] = useState(mockInterviews)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [selectedInterview, setSelectedInterview] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStage, setFilterStage] = useState('all')
  const { showToast } = useToast()

  const [formData, setFormData] = useState({
    applicantName: '',
    position: '',
    stage: '',
    scheduledDate: '',
    scheduledTime: '',
    location: '',
    interviewers: '',
  })

  const [errors, setErrors] = useState({})

  const navItems = [
    { path: '/hr/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/hr/job-requests', label: 'Job Requests', icon: '📝' },
    { path: '/hr/screening', label: 'Screening', icon: '🔍' },
    { path: '/hr/interviews', label: 'Interviews', icon: '💼' },
    { path: '/hr/onboarding', label: 'Onboarding', icon: '✅' },
    { path: '/hr/offboarding', label: 'Offboarding', icon: '👋' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ]

  const validate = () => {
    const newErrors = {}
    if (!formData.applicantName) newErrors.applicantName = 'Applicant name is required'
    if (!formData.position) newErrors.position = 'Position is required'
    if (!formData.stage) newErrors.stage = 'Stage is required'
    if (!formData.scheduledDate) newErrors.scheduledDate = 'Date is required'
    if (!formData.scheduledTime) newErrors.scheduledTime = 'Time is required'
    if (!formData.location) newErrors.location = 'Location is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAdd = () => {
    if (!validate()) return
    setShowSubmitModal(true)
  }

  const confirmSubmit = () => {
    const newInterview = {
      id: `INT-${String(interviews.length + 1).padStart(3, '0')}`,
      applicantId: `APP-${String(interviews.length + 1).padStart(3, '0')}`,
      ...formData,
      interviewers: formData.interviewers.split(',').map((i) => i.trim()),
      status: 'scheduled',
    }
    setInterviews([...interviews, newInterview])
    setShowAddModal(false)
    setShowSubmitModal(false)
    setFormData({
      applicantName: '',
      position: '',
      stage: '',
      scheduledDate: '',
      scheduledTime: '',
      location: '',
      interviewers: '',
    })
    setErrors({})
    showToast('Interview scheduled successfully', 'success')
  }

  const handleDelete = (interviewId) => {
    setSelectedInterview(interviewId)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    setInterviews(interviews.filter((i) => i.id !== selectedInterview))
    setShowDeleteModal(false)
    setSelectedInterview(null)
    showToast('Interview deleted successfully', 'success')
  }

  const filteredInterviews = interviews.filter((interview) => {
    const matchesSearch =
      interview.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStage = filterStage === 'all' || interview.stage === filterStage
    return matchesSearch && matchesStage
  })

  const tableHeaders = ['ID', 'Applicant', 'Position', 'Stage', 'Date & Time', 'Location', 'Status', 'Actions']

  const renderRow = (interview) => (
    <tr key={interview.id} className="hover:bg-mesh-primary transition-smooth">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{interview.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{interview.applicantName}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{interview.position}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge variant="info">{interview.stage}</Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {interview.scheduledDate} {interview.scheduledTime}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{interview.location}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge variant={interview.status === 'completed' ? 'success' : 'warning'}>
          {interview.status}
        </Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(interview.id)}>
            Delete
          </Button>
        </div>
      </td>
    </tr>
  )

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Interview Management</h2>
            <p className="text-gray-600 mt-1">Schedule and manage interviews</p>
          </div>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            + Schedule Interview
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 card-elevation">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search by applicant or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              options={[
                { value: 'all', label: 'All Stages' },
                { value: 'initial', label: 'Initial' },
                { value: 'technical', label: 'Technical' },
                { value: 'final', label: 'Final' },
              ]}
            />
          </div>
        </div>

        {/* Upcoming Interviews Widget */}
        <div className="bg-white rounded-xl p-6 card-elevation">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Interviews</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {interviews
              .filter((i) => i.status === 'scheduled')
              .slice(0, 3)
              .map((interview) => (
                <div
                  key={interview.id}
                  className="p-4 bg-mesh-primary rounded-lg border border-warm-beige"
                >
                  <p className="font-semibold text-gray-800">{interview.applicantName}</p>
                  <p className="text-sm text-gray-600">{interview.position}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {interview.scheduledDate} at {interview.scheduledTime}
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* Table */}
        <Table
          headers={tableHeaders}
          data={filteredInterviews}
          renderRow={renderRow}
          emptyMessage="No interviews found"
        />

        {/* Add Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false)
            setFormData({
              applicantName: '',
              position: '',
              stage: '',
              scheduledDate: '',
              scheduledTime: '',
              location: '',
              interviewers: '',
            })
            setErrors({})
          }}
          title="Schedule Interview"
          size="lg"
        >
          <form className="space-y-4">
            <Input
              label="Applicant Name"
              value={formData.applicantName}
              onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
              error={errors.applicantName}
              required
            />
            <Input
              label="Position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              error={errors.position}
              required
            />
            <Select
              label="Interview Stage"
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
              options={[
                { value: 'initial', label: 'Initial' },
                { value: 'technical', label: 'Technical' },
                { value: 'final', label: 'Final' },
              ]}
              error={errors.stage}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Date"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                error={errors.scheduledDate}
                required
              />
              <Input
                label="Time"
                type="time"
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                error={errors.scheduledTime}
                required
              />
            </div>
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              error={errors.location}
              placeholder="Conference Room A"
              required
            />
            <Input
              label="Interviewers (comma-separated)"
              value={formData.interviewers}
              onChange={(e) => setFormData({ ...formData, interviewers: e.target.value })}
              placeholder="John Doe, Jane Smith"
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddModal(false)
                  setFormData({
                    applicantName: '',
                    position: '',
                    stage: '',
                    scheduledDate: '',
                    scheduledTime: '',
                    location: '',
                    interviewers: '',
                  })
                  setErrors({})
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAdd}>
                Schedule
              </Button>
            </div>
          </form>
        </Modal>

        {/* Submit Confirmation */}
        <ConfirmationModal
          isOpen={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          onConfirm={confirmSubmit}
          title="Schedule Interview"
          message="Are you sure you want to schedule this interview?"
          confirmText="Schedule"
          cancelText="Cancel"
          variant="primary"
        />

        {/* Delete Confirmation */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setSelectedInterview(null)
          }}
          onConfirm={confirmDelete}
          title="Delete Interview"
          message="Are you sure you want to delete this interview? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      </div>
    </DashboardLayout>
  )
}

export default InterviewManagement

