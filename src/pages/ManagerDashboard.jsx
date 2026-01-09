import DashboardLayout from '../components/layouts/DashboardLayout'
import { mockJobRequests, mockInterviews, mockMetrics } from '../mockData'
import Badge from '../components/common/Badge'
import Button from '../components/common/Button'
import { useToast } from '../contexts/ToastContext'
import { useState } from 'react'
import ConfirmationModal from '../components/common/ConfirmationModal'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const ManagerDashboard = () => {
  const { showToast } = useToast()
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)

  const navItems = [
    { path: '/manager/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ]

  const pendingRequests = mockJobRequests.filter((req) => req.status === 'pending')
  const upcomingInterviews = mockInterviews.filter((int) => int.status === 'scheduled')

  const handleApprove = (requestId) => {
    setSelectedRequest(requestId)
    setShowApproveModal(true)
  }

  const confirmApprove = () => {
    showToast('Job request approved successfully', 'success')
    setShowApproveModal(false)
    setSelectedRequest(null)
  }

  const chartData = [
    { name: 'Jan', hires: 3 },
    { name: 'Feb', hires: 5 },
    { name: 'Mar', hires: 4 },
    { name: 'Apr', hires: 6 },
  ]

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        <div className="bg-mesh-secondary rounded-2xl p-6 card-elevation">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Manager Dashboard</h2>
          <p className="text-gray-600">Overview of your team and pending approvals</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 card-elevation-hover">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Pending Approvals</h3>
            <p className="text-3xl font-bold text-gray-800">{mockMetrics.pendingApprovals}</p>
          </div>
          <div className="bg-white rounded-xl p-6 card-elevation-hover">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Upcoming Interviews</h3>
            <p className="text-3xl font-bold text-gray-800">{mockMetrics.upcomingInterviews}</p>
          </div>
          <div className="bg-white rounded-xl p-6 card-elevation-hover">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Active Recruitments</h3>
            <p className="text-3xl font-bold text-gray-800">{mockMetrics.activeRecruitments}</p>
          </div>
          <div className="bg-white rounded-xl p-6 card-elevation-hover">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Team Size</h3>
            <p className="text-3xl font-bold text-gray-800">24</p>
          </div>
        </div>

        {/* Pending Job Requests */}
        <div className="bg-white rounded-xl p-6 card-elevation">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Pending Job Request Approvals</h3>
          <div className="space-y-4">
            {pendingRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No pending approvals</p>
            ) : (
              pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 bg-mesh-primary rounded-lg border border-warm-beige"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-800">{request.position}</h4>
                      <Badge variant="warning">{request.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {request.department} • {request.employmentType} • Target: {request.targetHireDate}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Requested by: {request.requestedBy}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" onClick={() => handleApprove(request.id)}>
                      Approve
                    </Button>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-white rounded-xl p-6 card-elevation">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Interviews</h3>
          <div className="space-y-4">
            {upcomingInterviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No upcoming interviews</p>
            ) : (
              upcomingInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="flex items-center justify-between p-4 bg-mesh-primary rounded-lg border border-warm-beige"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-800">{interview.applicantName}</h4>
                      <Badge variant="info">{interview.stage}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {interview.position} • {interview.scheduledDate} at {interview.scheduledTime}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Location: {interview.location}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl p-6 card-elevation">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly Hires Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="hires" fill="#E8C4A0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showApproveModal}
        onClose={() => {
          setShowApproveModal(false)
          setSelectedRequest(null)
        }}
        onConfirm={confirmApprove}
        title="Approve Job Request"
        message="Are you sure you want to approve this job request? This action will forward it to HR for review."
        confirmText="Approve"
        cancelText="Cancel"
        variant="primary"
      />
    </DashboardLayout>
  )
}

export default ManagerDashboard

