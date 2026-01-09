import { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { mockOffboarding } from '../../mockData'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import ConfirmationModal from '../../components/common/ConfirmationModal'
import Input from '../../components/common/Input'
import Table from '../../components/common/Table'
import { useToast } from '../../contexts/ToastContext'

const OffboardingAdmin = () => {
  const [offboardings, setOffboardings] = useState(mockOffboarding)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [selectedOffboarding, setSelectedOffboarding] = useState(null)
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

  const handleChecklistUpdate = (offboardingId, checklistItem) => {
    setOffboardings(
      offboardings.map((off) =>
        off.id === offboardingId
          ? {
              ...off,
              checklist: { ...off.checklist, [checklistItem]: !off.checklist[checklistItem] },
            }
          : off
      )
    )
    showToast(`${checklistItem} updated`, 'success')
  }

  const handleComplete = (offboardingId) => {
    setSelectedOffboarding(offboardingId)
    setShowCompleteModal(true)
  }

  const confirmComplete = () => {
    setOffboardings(
      offboardings.map((off) =>
        off.id === selectedOffboarding ? { ...off, status: 'completed' } : off
      )
    )
    setShowCompleteModal(false)
    setSelectedOffboarding(null)
    showToast('Offboarding process completed', 'success')
  }

  const filteredOffboardings = offboardings.filter((off) => {
    const matchesSearch =
      off.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      off.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || off.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const tableHeaders = ['Employee ID', 'Name', 'Department', 'Exit Date', 'Status', 'Actions']

  const renderRow = (offboarding) => (
    <tr key={offboarding.id} className="hover:bg-mesh-primary transition-smooth">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
        {offboarding.employeeId}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{offboarding.employeeName}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{offboarding.department}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{offboarding.exitDate}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge variant={offboarding.status === 'completed' ? 'success' : 'warning'}>
          {offboarding.status}
        </Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <Button variant="ghost" size="sm">
          View Details
        </Button>
      </td>
    </tr>
  )

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Offboarding Management</h2>
          <p className="text-gray-600 mt-1">Track and manage employee exit processes</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 card-elevation">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search by employee name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="w-full px-4 py-2 border rounded-lg bg-white border-warm-beige focus:outline-none focus:ring-2 focus:ring-warm-amber"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <Table
          headers={tableHeaders}
          data={filteredOffboardings}
          renderRow={renderRow}
          emptyMessage="No offboarding records found"
        />

        {/* Exit Checklist Details */}
        {filteredOffboardings.length > 0 && (
          <div className="bg-white rounded-xl p-6 card-elevation">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Exit Checklists</h3>
            <div className="space-y-4">
              {filteredOffboardings.map((offboarding) => (
                <div
                  key={offboarding.id}
                  className="p-4 bg-mesh-primary rounded-lg border border-warm-beige"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">{offboarding.employeeName}</h4>
                      <p className="text-sm text-gray-600">{offboarding.department}</p>
                    </div>
                    <Badge variant={offboarding.status === 'completed' ? 'success' : 'warning'}>
                      {offboarding.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(offboarding.checklist).map(([key, value]) => (
                      <label
                        key={key}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => handleChecklistUpdate(offboarding.id, key)}
                          className="w-4 h-4 text-warm-amber border-warm-beige rounded focus:ring-warm-amber"
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-warm-beige">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleComplete(offboarding.id)}
                      disabled={offboarding.status === 'completed'}
                    >
                      Mark as Complete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Complete Confirmation */}
        <ConfirmationModal
          isOpen={showCompleteModal}
          onClose={() => {
            setShowCompleteModal(false)
            setSelectedOffboarding(null)
          }}
          onConfirm={confirmComplete}
          title="Complete Offboarding"
          message="Are you sure all exit checklist items are completed? This will finalize the offboarding process."
          confirmText="Complete"
          cancelText="Cancel"
          variant="primary"
        />
      </div>
    </DashboardLayout>
  )
}

export default OffboardingAdmin

