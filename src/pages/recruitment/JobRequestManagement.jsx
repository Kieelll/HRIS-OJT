import { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { mockJobRequests } from '../../mockData'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import ConfirmationModal from '../../components/common/ConfirmationModal'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Table from '../../components/common/Table'
import { useToast } from '../../contexts/ToastContext'

const JobRequestManagement = () => {
  const [requests, setRequests] = useState(mockJobRequests)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const { showToast } = useToast()

  const [formData, setFormData] = useState({
    position: '',
    department: '',
    employmentType: '',
    targetHireDate: '',
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

  const generateJobRequestId = () => {
    const year = new Date().getFullYear()
    const count = requests.length + 1
    return `JR-${year}-${String(count).padStart(3, '0')}`
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.position) newErrors.position = 'Position is required'
    if (!formData.department) newErrors.department = 'Department is required'
    if (!formData.employmentType) newErrors.employmentType = 'Employment type is required'
    if (!formData.targetHireDate) newErrors.targetHireDate = 'Target hire date is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAdd = () => {
    if (!validate()) return
    setShowSubmitModal(true)
  }

  const confirmSubmit = () => {
    const newRequest = {
      id: generateJobRequestId(),
      ...formData,
      actualOnboardingDate: null,
      status: 'pending',
      requestedBy: 'Current User',
      requestedDate: new Date().toISOString().split('T')[0],
      approvals: {
        manager: { approved: false, date: null },
        hr: { approved: false, date: null },
        director: { approved: false, date: null },
      },
    }
    setRequests([...requests, newRequest])
    setShowAddModal(false)
    setShowSubmitModal(false)
    setFormData({ position: '', department: '', employmentType: '', targetHireDate: '' })
    setErrors({})
    showToast('Job request created successfully', 'success')
  }

  const handleDelete = (requestId) => {
    setSelectedRequest(requestId)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    setRequests(requests.filter((r) => r.id !== selectedRequest))
    setShowDeleteModal(false)
    setSelectedRequest(null)
    showToast('Job request deleted successfully', 'success')
  }

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = request.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const tableHeaders = ['ID', 'Position', 'Department', 'Type', 'Target Date', 'Status', 'Actions']

  const renderRow = (request) => (
    <tr key={request.id} className="hover:bg-mesh-primary transition-smooth">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{request.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{request.position}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{request.department}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{request.employmentType}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{request.targetHireDate}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge
          variant={
            request.status === 'approved' ? 'success' : request.status === 'rejected' ? 'danger' : 'warning'
          }
        >
          {request.status}
        </Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(request.id)}>
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
            <h2 className="text-3xl font-bold text-gray-800">Job Request Management</h2>
            <p className="text-gray-600 mt-1">Create and manage job requests</p>
          </div>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            + Add Job Request
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 card-elevation">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search by position or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
              ]}
            />
          </div>
        </div>

        {/* Table */}
        <Table
          headers={tableHeaders}
          data={filteredRequests}
          renderRow={renderRow}
          emptyMessage="No job requests found"
        />

        {/* Add Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false)
            setFormData({ position: '', department: '', employmentType: '', targetHireDate: '' })
            setErrors({})
          }}
          title="Add Job Request"
          size="lg"
        >
          <form className="space-y-4">
            <Input
              label="Position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              error={errors.position}
              required
            />
            <Select
              label="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              options={[
                { value: 'Engineering', label: 'Engineering' },
                { value: 'Human Resources', label: 'Human Resources' },
                { value: 'Product', label: 'Product' },
                { value: 'Sales', label: 'Sales' },
                { value: 'Marketing', label: 'Marketing' },
              ]}
              error={errors.department}
              required
            />
            <Select
              label="Employment Type"
              value={formData.employmentType}
              onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
              options={[
                { value: 'Full-time', label: 'Full-time' },
                { value: 'Part-time', label: 'Part-time' },
                { value: 'Contract', label: 'Contract' },
                { value: 'Internship', label: 'Internship' },
              ]}
              error={errors.employmentType}
              required
            />
            <Input
              label="Target Hire Date"
              type="date"
              value={formData.targetHireDate}
              onChange={(e) => setFormData({ ...formData, targetHireDate: e.target.value })}
              error={errors.targetHireDate}
              required
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddModal(false)
                  setFormData({ position: '', department: '', employmentType: '', targetHireDate: '' })
                  setErrors({})
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAdd}>
                Submit
              </Button>
            </div>
          </form>
        </Modal>

        {/* Submit Confirmation */}
        <ConfirmationModal
          isOpen={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          onConfirm={confirmSubmit}
          title="Submit Job Request"
          message="Are you sure you want to submit this job request? It will be sent for approval."
          confirmText="Submit"
          cancelText="Cancel"
          variant="primary"
        />

        {/* Delete Confirmation */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setSelectedRequest(null)
          }}
          onConfirm={confirmDelete}
          title="Delete Job Request"
          message="Are you sure you want to delete this job request? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      </div>
    </DashboardLayout>
  )
}

export default JobRequestManagement

