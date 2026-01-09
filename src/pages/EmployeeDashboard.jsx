import { useState } from 'react'
import DashboardLayout from '../components/layouts/DashboardLayout'
import { useAuth } from '../contexts/AuthContext'
import { mockAttendance, mockPayroll, mockTrainings } from '../mockData'
import Badge from '../components/common/Badge'
import Button from '../components/common/Button'
import { useToast } from '../contexts/ToastContext'
import ConfirmationModal from '../components/common/ConfirmationModal'

const EmployeeDashboard = () => {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedTraining, setSelectedTraining] = useState(null)

  const navItems = [
    { path: '/employee/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/employee/offboarding', label: 'Offboarding', icon: '👋' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ]

  const handleDeleteTraining = (trainingId) => {
    setSelectedTraining(trainingId)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    showToast('Training removed successfully', 'success')
    setShowDeleteModal(false)
    setSelectedTraining(null)
  }

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        <div className="bg-mesh-secondary rounded-2xl p-6 card-elevation">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {user?.name}!</h2>
          <p className="text-gray-600">Here's your overview for today</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Attendance Card */}
          <div className="bg-white rounded-xl p-6 card-elevation-hover">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Days</span>
                <span className="font-semibold">{mockAttendance.totalDays}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Present</span>
                <span className="font-semibold text-green-600">{mockAttendance.presentDays}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Absent</span>
                <span className="font-semibold text-red-600">{mockAttendance.absentDays}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">On Leave</span>
                <span className="font-semibold text-yellow-600">{mockAttendance.leaveDays}</span>
              </div>
            </div>
          </div>

          {/* Payroll Card */}
          <div className="bg-white rounded-xl p-6 card-elevation-hover">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payroll Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Month</span>
                <span className="font-semibold">{mockPayroll.currentMonth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gross Salary</span>
                <span className="font-semibold">${mockPayroll.grossSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Deductions</span>
                <span className="font-semibold text-red-600">-${mockPayroll.deductions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-800 font-semibold">Net Salary</span>
                <span className="font-bold text-lg text-green-600">${mockPayroll.netSalary.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-500">Pay Date: {mockPayroll.payDate}</p>
            </div>
          </div>

          {/* Performance Card */}
          <div className="bg-white rounded-xl p-6 card-elevation-hover">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Rating</span>
                <Badge variant="success">4.5/5.0</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Review</span>
                <span className="font-semibold">Q4 2023</span>
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Trainings Section */}
        <div className="bg-white rounded-xl p-6 card-elevation">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Training & Development</h3>
            <Button variant="primary" size="sm">
              Browse Trainings
            </Button>
          </div>
          <div className="space-y-4">
            {mockTrainings.map((training) => (
              <div
                key={training.id}
                className="flex items-center justify-between p-4 bg-mesh-primary rounded-lg border border-warm-beige"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-gray-800">{training.title}</h4>
                    <Badge variant={training.status === 'completed' ? 'success' : 'info'}>
                      {training.status}
                    </Badge>
                    {training.recommended && <Badge variant="warning">Recommended</Badge>}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {training.category} • {training.duration}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm">
                    {training.status === 'completed' ? 'Review' : 'Enroll'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTraining(training.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedTraining(null)
        }}
        onConfirm={confirmDelete}
        title="Remove Training"
        message="Are you sure you want to remove this training from your list?"
        confirmText="Remove"
        cancelText="Cancel"
        variant="danger"
      />
    </DashboardLayout>
  )
}

export default EmployeeDashboard

