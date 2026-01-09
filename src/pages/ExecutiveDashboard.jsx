import DashboardLayout from '../components/layouts/DashboardLayout'
import { mockMetrics } from '../mockData'
import Badge from '../components/common/Badge'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const ExecutiveDashboard = () => {
  const navItems = [
    { path: '/executive/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ]

  const monthlyData = [
    { month: 'Jan', employees: 145, hires: 5, exits: 2 },
    { month: 'Feb', employees: 148, hires: 6, exits: 1 },
    { month: 'Mar', employees: 150, hires: 4, exits: 2 },
    { month: 'Apr', employees: 152, hires: 5, exits: 1 },
  ]

  const departmentData = [
    { name: 'Engineering', employees: 45, openPositions: 8 },
    { name: 'HR', employees: 12, openPositions: 2 },
    { name: 'Product', employees: 20, openPositions: 3 },
    { name: 'Sales', employees: 35, openPositions: 5 },
    { name: 'Marketing', employees: 18, openPositions: 2 },
  ]

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        <div className="bg-mesh-secondary rounded-2xl p-6 card-elevation">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Executive Dashboard</h2>
          <p className="text-gray-600">High-level overview of organizational HR metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 card-elevation-hover">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Employees</h3>
            <p className="text-3xl font-bold text-gray-800">{mockMetrics.totalEmployees}</p>
            <p className="text-sm text-green-600 mt-2">+2.5% from last month</p>
          </div>
          <div className="bg-white rounded-xl p-6 card-elevation-hover">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Attrition Rate</h3>
            <p className="text-3xl font-bold text-gray-800">{mockMetrics.attritionRate}%</p>
            <Badge variant="success" className="mt-2">Below Industry Avg</Badge>
          </div>
          <div className="bg-white rounded-xl p-6 card-elevation-hover">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Active Recruitments</h3>
            <p className="text-3xl font-bold text-gray-800">{mockMetrics.activeRecruitments}</p>
            <p className="text-sm text-gray-500 mt-2">12 positions open</p>
          </div>
          <div className="bg-white rounded-xl p-6 card-elevation-hover">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Monthly Hires</h3>
            <p className="text-3xl font-bold text-gray-800">{mockMetrics.monthlyHires}</p>
            <p className="text-sm text-gray-500 mt-2">This month</p>
          </div>
        </div>

        {/* Employee Growth Chart */}
        <div className="bg-white rounded-xl p-6 card-elevation">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Employee Growth Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="employees" stroke="#E8C4A0" strokeWidth={2} />
              <Line type="monotone" dataKey="hires" stroke="#E8D5B7" strokeWidth={2} />
              <Line type="monotone" dataKey="exits" stroke="#F4D5C2" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Overview */}
        <div className="bg-white rounded-xl p-6 card-elevation">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Department Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="employees" fill="#E8C4A0" name="Employees" />
              <Bar yAxisId="right" dataKey="openPositions" fill="#E8D5B7" name="Open Positions" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department Table */}
        <div className="bg-white rounded-xl p-6 card-elevation">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Department Details</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-warm-beige">
              <thead className="bg-mesh-primary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Employees</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Open Positions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-warm-beige">
                {departmentData.map((dept) => (
                  <tr key={dept.name}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{dept.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{dept.employees}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{dept.openPositions}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={dept.openPositions > 5 ? 'warning' : 'success'}>
                        {dept.openPositions > 5 ? 'High Demand' : 'Stable'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ExecutiveDashboard

