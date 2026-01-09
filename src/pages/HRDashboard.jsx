import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/layouts/DashboardLayout'
import { mockJobRequests, mockApplicants, mockInterviews, mockMetrics } from '../mockData'
import Badge from '../components/common/Badge'
import Button from '../components/common/Button'
import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const HRDashboard = () => {
  const navigate = useNavigate()
  
  const navItems = [
    { path: '/hr/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/hr/job-requests', label: 'Job Requests', icon: '📝' },
    { path: '/hr/screening', label: 'Screening', icon: '🔍' },
    { path: '/hr/interviews', label: 'Interviews', icon: '💼' },
    { path: '/hr/onboarding', label: 'Onboarding', icon: '✅' },
    { path: '/hr/offboarding', label: 'Offboarding', icon: '👋' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ]

  const quickActions = [
    { label: 'New Job Request', icon: '➕', onClick: () => navigate('/hr/job-requests') },
  ]

  const statusData = [
    { name: 'Pending', value: mockJobRequests.filter((r) => r.status === 'pending').length },
    { name: 'Approved', value: mockJobRequests.filter((r) => r.status === 'approved').length },
    { name: 'Rejected', value: mockJobRequests.filter((r) => r.status === 'rejected').length },
  ]

  const COLORS = ['#E8C4A0', '#E8D5B7', '#F4D5C2']

  return (
    <DashboardLayout navItems={navItems} quickActions={quickActions}>
      <div className="space-y-6">
        <div className="bg-mesh-secondary rounded-2xl p-6 card-elevation">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">HR Dashboard</h2>
          <p className="text-gray-600">Manage recruitment, onboarding, and employee lifecycle</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 card-elevation-hover">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Active Job Requests</h3>
            <p className="text-3xl font-bold text-gray-800">{mockMetrics.activeRecruitments}</p>
            <Link to="/hr/job-requests">
              <Button variant="ghost" size="sm" className="mt-2">
                View All →
              </Button>
            </Link>
          </div>
          <div className="bg-white rounded-xl p-6 card-elevation-hover">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Applicants in Screening</h3>
            <p className="text-3xl font-bold text-gray-800">
              {mockApplicants.filter((a) => a.status === 'screening').length}
            </p>
            <Link to="/hr/screening">
              <Button variant="ghost" size="sm" className="mt-2">
                View All →
              </Button>
            </Link>
          </div>
          <div className="bg-white rounded-xl p-6 card-elevation-hover">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Upcoming Interviews</h3>
            <p className="text-3xl font-bold text-gray-800">
              {mockInterviews.filter((i) => i.status === 'scheduled').length}
            </p>
            <Link to="/hr/interviews">
              <Button variant="ghost" size="sm" className="mt-2">
                View All →
              </Button>
            </Link>
          </div>
          <div className="bg-white rounded-xl p-6 card-elevation-hover">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Onboarding Progress</h3>
            <p className="text-3xl font-bold text-gray-800">{mockMetrics.onboardingProgress}</p>
            <Link to="/hr/onboarding">
              <Button variant="ghost" size="sm" className="mt-2">
                View All →
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Job Requests */}
          <div className="bg-white rounded-xl p-6 card-elevation">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Recent Job Requests</h3>
              <Link to="/hr/job-requests">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {mockJobRequests.slice(0, 3).map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 bg-mesh-primary rounded-lg border border-warm-beige"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">{request.id}</span>
                      <Badge
                        variant={
                          request.status === 'approved'
                            ? 'success'
                            : request.status === 'rejected'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{request.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-white rounded-xl p-6 card-elevation">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Job Request Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 card-elevation">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/hr/job-requests">
              <Button variant="primary" className="w-full">
                Create Job Request
              </Button>
            </Link>
            <Link to="/hr/screening">
              <Button variant="secondary" className="w-full">
                Review Applicants
              </Button>
            </Link>
            <Link to="/hr/interviews">
              <Button variant="secondary" className="w-full">
                Schedule Interview
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default HRDashboard

