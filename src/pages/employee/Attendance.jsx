import DashboardLayout from '../../components/layouts/DashboardLayout'
import { mockAttendance } from '../../mockData'
import Badge from '../../components/common/Badge'
import Table from '../../components/common/Table'
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

const Attendance = () => {
  const navItems = [
    { path: '/employee/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/employee/attendance', label: 'Attendance', icon: 'calendar' },
    { path: '/employee/payroll', label: 'Payroll', icon: 'document' },
    { path: '/profile', label: 'Profile', icon: 'person' },
  ]

  const tableHeaders = ['Date', 'Day', 'Check In', 'Check Out', 'Hours', 'Status']

  const renderRow = (record) => {
    const getStatusBadge = (status) => {
      switch (status) {
        case 'present':
          return <Badge variant="success" className="bg-green-100 text-green-700">Present</Badge>
        case 'absent':
          return <Badge variant="error" className="bg-red-100 text-red-700">Absent</Badge>
        case 'leave':
          return <Badge variant="warning" className="bg-yellow-100 text-yellow-700">On Leave</Badge>
        default:
          return <Badge variant="info">Pending</Badge>
      }
    }

    return (
      <tr key={record.date} className="hover:bg-gray-50 transition-smooth">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {new Date(record.date).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' })}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          {record.checkIn || '--'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          {record.checkOut || '--'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          {record.hours || '--'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {getStatusBadge(record.status)}
        </td>
      </tr>
    )
  }

  const attendanceRecords = mockAttendance.thisMonth.map(record => ({
    ...record,
    checkIn: record.status === 'present' ? '9:00 AM' : null,
    checkOut: record.status === 'present' ? '6:00 PM' : null,
    hours: record.status === 'present' ? '8.0' : null,
  }))

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Attendance</h2>
          <p className="text-gray-600 mt-1">View your attendance records and history</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Days</span>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{mockAttendance.totalDays}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Present</span>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{mockAttendance.presentDays}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Absent</span>
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600">{mockAttendance.absentDays}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">On Leave</span>
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-yellow-600">{mockAttendance.leaveDays}</div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">This Month's Attendance</h3>
          </div>
          <Table
            headers={tableHeaders}
            data={attendanceRecords}
            renderRow={renderRow}
            emptyMessage="No attendance records found"
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Attendance

