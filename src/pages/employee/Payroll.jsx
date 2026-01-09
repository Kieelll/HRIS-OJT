import DashboardLayout from '../../components/layouts/DashboardLayout'
import { mockPayroll } from '../../mockData'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Table from '../../components/common/Table'
import { Download, FileText, DollarSign, Calendar } from 'lucide-react'

const Payroll = () => {
  const navItems = [
    { path: '/employee/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/employee/attendance', label: 'Attendance', icon: 'calendar' },
    { path: '/employee/payroll', label: 'Payroll', icon: 'document' },
    { path: '/profile', label: 'Profile', icon: 'person' },
  ]

  // Mock payroll history
  const payrollHistory = [
    {
      id: 'PAY-2024-01',
      month: 'January 2024',
      grossSalary: 7500,
      deductions: 1200,
      netSalary: 6300,
      payDate: '2024-01-31',
      status: 'paid',
    },
    {
      id: 'PAY-2023-12',
      month: 'December 2023',
      grossSalary: 7500,
      deductions: 1200,
      netSalary: 6300,
      payDate: '2023-12-31',
      status: 'paid',
    },
    {
      id: 'PAY-2023-11',
      month: 'November 2023',
      grossSalary: 7500,
      deductions: 1200,
      netSalary: 6300,
      payDate: '2023-11-30',
      status: 'paid',
    },
  ]

  const tableHeaders = ['Month', 'Gross Salary', 'Deductions', 'Net Salary', 'Pay Date', 'Status', 'Actions']

  const renderRow = (payslip) => (
    <tr key={payslip.id} className="hover:bg-gray-50 transition-smooth">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payslip.month}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${payslip.grossSalary.toLocaleString()}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-${payslip.deductions.toLocaleString()}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
        ${payslip.netSalary.toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {new Date(payslip.payDate).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge variant="success" className="bg-green-100 text-green-700">Paid</Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-1" />
          Download
        </Button>
      </td>
    </tr>
  )

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Payroll</h2>
          <p className="text-gray-600 mt-1">View your payslips and payroll history</p>
        </div>

        {/* Current Month Summary */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Current Month - {mockPayroll.currentMonth}</h3>
              <p className="text-sm text-gray-600">Pay Date: {mockPayroll.payDate}</p>
            </div>
            <DollarSign className="w-12 h-12 text-purple-600" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <div className="text-sm font-medium text-gray-600 mb-1">Gross Salary</div>
              <div className="text-2xl font-bold text-gray-900">${mockPayroll.grossSalary.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-sm font-medium text-gray-600 mb-1">Deductions</div>
              <div className="text-2xl font-bold text-red-600">-${mockPayroll.deductions.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-sm font-medium text-gray-600 mb-1">Net Salary</div>
              <div className="text-2xl font-bold text-green-600">${mockPayroll.netSalary.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Payroll History */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Payroll History</h3>
          </div>
          <Table
            headers={tableHeaders}
            data={payrollHistory}
            renderRow={renderRow}
            emptyMessage="No payroll records found"
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Payroll

