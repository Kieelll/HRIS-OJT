import { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { mockApplicants } from '../../mockData'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import ConfirmationModal from '../../components/common/ConfirmationModal'
import Input from '../../components/common/Input'
import Table from '../../components/common/Table'
import { useToast } from '../../contexts/ToastContext'

const ApplicantScreening = () => {
  const [applicants, setApplicants] = useState(mockApplicants)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedApplicant, setSelectedApplicant] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const { showToast } = useToast()

  const navItems = [
    { path: '/hr/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/hr/job-requests', label: 'Job Requests', icon: '📝' },
    { path: '/hr/screening', label: 'Screening', icon: '🔍' },
    { path: '/hr/interviews', label: 'Interviews', icon: '💼' },
    { path: '/hr/onboarding', label: 'Onboarding', icon: '✅' },
    { path: '/hr/offboarding', label: 'Offboarding', icon: '👋' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ]

  const handleStatusChange = (applicantId, status) => {
    setSelectedApplicant(applicantId)
    setNewStatus(status)
    setShowStatusModal(true)
  }

  const confirmStatusChange = () => {
    setApplicants(
      applicants.map((app) =>
        app.id === selectedApplicant ? { ...app, status: newStatus } : app
      )
    )
    setShowStatusModal(false)
    setSelectedApplicant(null)
    setNewStatus('')
    showToast(`Applicant status updated to ${newStatus}`, 'success')
  }

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch =
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || applicant.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const tableHeaders = ['ID', 'Name', 'Email', 'Position', 'Department', 'Status', 'Actions']

  const renderRow = (applicant) => (
    <tr key={applicant.id} className="hover:bg-mesh-primary transition-smooth">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{applicant.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{applicant.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{applicant.email}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{applicant.position}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{applicant.department}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge
          variant={
            applicant.status === 'interview'
              ? 'info'
              : applicant.status === 'rejected'
              ? 'danger'
              : 'warning'
          }
        >
          {applicant.status}
        </Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            View Resume
          </Button>
          {applicant.status === 'screening' && (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleStatusChange(applicant.id, 'interview')}
              >
                Pass
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleStatusChange(applicant.id, 'rejected')}
              >
                Reject
              </Button>
            </>
          )}
        </div>
      </td>
    </tr>
  )

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Applicant Screening</h2>
          <p className="text-gray-600 mt-1">Review and screen job applicants</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 card-elevation">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search by name, email, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="w-full px-4 py-2 border rounded-lg bg-white border-warm-beige focus:outline-none focus:ring-2 focus:ring-warm-amber"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="screening">Screening</option>
              <option value="interview">Interview</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <Table
          headers={tableHeaders}
          data={filteredApplicants}
          renderRow={renderRow}
          emptyMessage="No applicants found"
        />

        {/* Status Change Confirmation */}
        <ConfirmationModal
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false)
            setSelectedApplicant(null)
            setNewStatus('')
          }}
          onConfirm={confirmStatusChange}
          title="Change Applicant Status"
          message={`Are you sure you want to change this applicant's status to "${newStatus}"?`}
          confirmText="Confirm"
          cancelText="Cancel"
          variant="primary"
        />
      </div>
    </DashboardLayout>
  )
}

export default ApplicantScreening

