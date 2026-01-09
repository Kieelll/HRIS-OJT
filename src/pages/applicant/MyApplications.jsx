import { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { mockJobListings } from '../../mockData'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import ConfirmationModal from '../../components/common/ConfirmationModal'
import EmptyState from '../../components/common/EmptyState'
import { useToast } from '../../contexts/ToastContext'
import { FileText, Calendar, MapPin, Building2, X } from 'lucide-react'

const MyApplications = () => {
  const { showToast } = useToast()
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)
  
  // Mock applications data - in real app, this would come from API/context
  const [applications] = useState([
    {
      id: 'APP-001',
      jobId: 'JOB-001',
      jobTitle: 'Senior Software Engineer',
      company: 'Tech Corp',
      department: 'Engineering',
      appliedDate: '2024-01-20',
      status: 'under_review',
      statusLabel: 'Under Review',
      lastUpdate: '2024-01-22',
    },
    {
      id: 'APP-002',
      jobId: 'JOB-002',
      jobTitle: 'HR Analyst',
      company: 'HR Solutions Inc',
      department: 'Human Resources',
      appliedDate: '2024-01-18',
      status: 'interview',
      statusLabel: 'Interview Scheduled',
      lastUpdate: '2024-01-25',
      interviewDate: '2024-02-05',
    },
    {
      id: 'APP-003',
      jobId: 'JOB-003',
      jobTitle: 'Product Designer',
      company: 'Design Studio',
      department: 'Product',
      appliedDate: '2024-01-15',
      status: 'rejected',
      statusLabel: 'Not Selected',
      lastUpdate: '2024-01-28',
    },
  ])

  const navItems = [
    { path: '/applicant/jobs', label: 'Job Listings', icon: 'briefcase' },
    { path: '/applicant/applications', label: 'My Applications', icon: 'document' },
    { path: '/applicant/onboarding', label: 'Onboarding Progress', icon: 'checkmark' },
    { path: '/applicant/profile', label: 'My Profile', icon: 'person' },
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case 'under_review':
        return <Badge variant="info" className="bg-blue-100 text-blue-700">Under Review</Badge>
      case 'interview':
        return <Badge variant="warning" className="bg-yellow-100 text-yellow-700">Interview</Badge>
      case 'offer':
        return <Badge variant="success" className="bg-green-100 text-green-700">Offer Extended</Badge>
      case 'accepted':
        return <Badge variant="success" className="bg-green-100 text-green-700">Accepted</Badge>
      case 'rejected':
        return <Badge variant="error" className="bg-red-100 text-red-700">Not Selected</Badge>
      case 'withdrawn':
        return <Badge variant="default" className="bg-gray-100 text-gray-700">Withdrawn</Badge>
      default:
        return <Badge variant="info">Pending</Badge>
    }
  }

  const handleWithdraw = (application) => {
    setSelectedApplication(application)
    setShowWithdrawModal(true)
  }

  const confirmWithdraw = () => {
    showToast('Application withdrawn successfully', 'success')
    setShowWithdrawModal(false)
    setSelectedApplication(null)
  }

  const filteredApplications = applications

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">My Applications</h2>
          <p className="text-gray-600 mt-1">Track the status of your job applications</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm font-medium text-gray-600 mb-1">Total Applications</div>
            <div className="text-2xl font-bold text-gray-900">{applications.length}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm font-medium text-gray-600 mb-1">Under Review</div>
            <div className="text-2xl font-bold text-blue-600">
              {applications.filter(a => a.status === 'under_review').length}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm font-medium text-gray-600 mb-1">Interviews</div>
            <div className="text-2xl font-bold text-yellow-600">
              {applications.filter(a => a.status === 'interview').length}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm font-medium text-gray-600 mb-1">Active</div>
            <div className="text-2xl font-bold text-green-600">
              {applications.filter(a => ['under_review', 'interview', 'offer'].includes(a.status)).length}
            </div>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <EmptyState
            icon="📄"
            title="No Applications Yet"
            description="You haven't submitted any job applications yet. Browse job listings and apply to get started."
          />
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div
                key={application.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      <h3 className="text-xl font-semibold text-gray-900">{application.jobTitle}</h3>
                      {getStatusBadge(application.status)}
                    </div>
                    <div className="space-y-2 ml-8">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium mr-2">Company:</span>
                        {application.company}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium mr-2">Department:</span>
                        {application.department}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        Applied: {new Date(application.appliedDate).toLocaleDateString()}
                      </div>
                      {application.interviewDate && (
                        <div className="flex items-center text-sm text-blue-600 font-medium">
                          <Calendar className="w-4 h-4 mr-1" />
                          Interview: {new Date(application.interviewDate).toLocaleDateString()}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-2">
                        Last updated: {new Date(application.lastUpdate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {['under_review', 'interview'].includes(application.status) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWithdraw(application)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Withdraw
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={showWithdrawModal}
        onClose={() => {
          setShowWithdrawModal(false)
          setSelectedApplication(null)
        }}
        onConfirm={confirmWithdraw}
        title="Withdraw Application"
        message={`Are you sure you want to withdraw your application for "${selectedApplication?.jobTitle}"? This action cannot be undone.`}
        confirmText="Withdraw"
        cancelText="Cancel"
        variant="danger"
      />
    </DashboardLayout>
  )
}

export default MyApplications
