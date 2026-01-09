import { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { mockApplicants } from '../../mockData'
import { useOnboarding, ONBOARDING_STAGES } from '../../contexts/OnboardingContext'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import ConfirmationModal from '../../components/common/ConfirmationModal'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Table from '../../components/common/Table'
import TaskCard from '../../components/onboarding/TaskCard'
import OnboardingTimeline from '../../components/onboarding/OnboardingTimeline'
import Modal from '../../components/common/Modal'
import { useToast } from '../../contexts/ToastContext'
import { 
  Search, Filter, AlertTriangle, CheckCircle2, Clock, Users, 
  FileText, TrendingUp, Calendar, UserCheck, XCircle 
} from 'lucide-react'
import { mockOnboardingTasks } from '../../mockData'

const OnboardingApproval = () => {
  const { 
    getOnboardingStatus, 
    initializeOnboarding, 
    updateOnboardingStage,
    updateTask,
    updateDocumentStatus 
  } = useOnboarding()
  const { showToast } = useToast()
  
  const [applicants, setApplicants] = useState(
    mockApplicants.filter((a) => a.status === 'interview' || a.status === 'screening')
  )
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedApplicant, setSelectedApplicant] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [viewMode, setViewMode] = useState('table') // 'table' or 'kanban'

  const navItems = [
    { path: '/hr/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/hr/job-requests', label: 'Job Requests', icon: 'document' },
    { path: '/hr/screening', label: 'Screening', icon: 'search' },
    { path: '/hr/interviews', label: 'Interviews', icon: 'briefcase' },
    { path: '/hr/onboarding', label: 'Onboarding', icon: 'checkmark' },
    { path: '/hr/offboarding', label: 'Offboarding', icon: 'users' },
    { path: '/profile', label: 'Profile', icon: 'person' },
  ]

  const stageLabels = {
    [ONBOARDING_STAGES.APPLICATION_SUBMITTED]: 'Application Submitted',
    [ONBOARDING_STAGES.SCREENING_PASSED]: 'Screening Passed',
    [ONBOARDING_STAGES.OFFER_EXTENDED]: 'Offer Extended',
    [ONBOARDING_STAGES.OFFER_ACCEPTED]: 'Offer Accepted',
    [ONBOARDING_STAGES.PRE_ONBOARDING]: 'Pre-Onboarding',
    [ONBOARDING_STAGES.ACTIVE_ONBOARDING]: 'Active Onboarding',
    [ONBOARDING_STAGES.FULLY_ONBOARDED]: 'Fully Onboarded',
  }

  const stages = Object.values(ONBOARDING_STAGES)

  const handleApprove = (applicantId) => {
    setSelectedApplicant(applicantId)
    setShowApproveModal(true)
  }

  const confirmApprove = () => {
    const applicant = applicants.find((a) => a.id === selectedApplicant)
    if (applicant) {
      // Initialize onboarding with default tasks
      initializeOnboarding(applicant.id, {
        tasks: mockOnboardingTasks,
        expectedStartDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        assignedDepartment: applicant.department,
      })
      
      updateOnboardingStage(applicant.id, ONBOARDING_STAGES.OFFER_ACCEPTED)
      
      showToast(`Onboarding initiated for ${applicant.name}`, 'success')
      setApplicants(applicants.map(a => 
        a.id === applicant.id ? { ...a, onboardingStatus: 'active' } : a
      ))
    }
    setShowApproveModal(false)
    setSelectedApplicant(null)
  }

  const handleViewDetails = (applicantId) => {
    setSelectedApplicant(applicantId)
    setShowDetailModal(true)
  }

  const handleCompleteTask = (applicantId, taskId) => {
    updateTask(applicantId, taskId, { 
      status: 'completed', 
      completedAt: new Date().toISOString() 
    })
    showToast('Task marked as completed', 'success')
  }

  const handleApproveDocument = (applicantId, documentId) => {
    updateDocumentStatus(applicantId, documentId, 'approved')
    showToast('Document approved', 'success')
  }

  const handleRejectDocument = (applicantId, documentId) => {
    updateDocumentStatus(applicantId, documentId, 'rejected')
    showToast('Document rejected. Applicant will be notified.', 'success')
  }

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch = 
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.position.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && applicant.onboardingStatus === 'active') ||
      (statusFilter === 'pending' && !applicant.onboardingStatus)
    
    const matchesDepartment = departmentFilter === 'all' || 
      applicant.department === departmentFilter

    return matchesSearch && matchesStatus && matchesDepartment
  })

  // Calculate metrics
  const activeOnboarding = applicants.filter(a => a.onboardingStatus === 'active').length
  const pendingApproval = applicants.filter(a => !a.onboardingStatus && a.status === 'interview').length
  const overdueTasks = applicants.reduce((count, applicant) => {
    const status = getOnboardingStatus(applicant.id)
    const overdue = status.tasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
    ).length
    return count + overdue
  }, 0)

  const bottleneckCandidates = applicants.filter(applicant => {
    const status = getOnboardingStatus(applicant.id)
    const incompleteTasks = status.tasks.filter(t => t.status !== 'completed').length
    const overdueTasks = status.tasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
    ).length
    return incompleteTasks >= 3 || overdueTasks > 0
  })

  const tableHeaders = ['Name', 'Email', 'Position', 'Department', 'Stage', 'Progress', 'Actions']

  const renderRow = (applicant) => {
    const onboardingStatus = getOnboardingStatus(applicant.id)
    const completedTasks = onboardingStatus.tasks.filter(t => t.status === 'completed').length
    const totalTasks = onboardingStatus.tasks.length || 0
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    const currentStage = onboardingStatus.stage || ONBOARDING_STAGES.APPLICATION_SUBMITTED

    return (
      <tr key={applicant.id} className="hover:bg-gray-50 transition-smooth">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold mr-3">
              {applicant.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{applicant.name}</div>
              <div className="text-xs text-gray-500">{applicant.email}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{applicant.position}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{applicant.department}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <Badge variant="info" className="text-xs">
            {stageLabels[currentStage] || 'Not Started'}
          </Badge>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {totalTasks > 0 ? (
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-600">{progress}%</span>
            </div>
          ) : (
            <span className="text-xs text-gray-400">Not started</span>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleViewDetails(applicant.id)}
            >
              View
            </Button>
            {!applicant.onboardingStatus && (
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => handleApprove(applicant.id)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Start Onboarding
              </Button>
            )}
          </div>
        </td>
      </tr>
    )
  }

  const selectedApplicantData = selectedApplicant 
    ? applicants.find(a => a.id === selectedApplicant)
    : null
  const selectedOnboardingStatus = selectedApplicantData 
    ? getOnboardingStatus(selectedApplicantData.id)
    : null

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Onboarding Management</h2>
            <p className="text-gray-600 mt-1">Manage and track candidate onboarding progress</p>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Active Onboarding</span>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{activeOnboarding}</div>
            <div className="text-xs text-gray-500 mt-1">Candidates in process</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Pending Approval</span>
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{pendingApproval}</div>
            <div className="text-xs text-gray-500 mt-1">Awaiting start</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Overdue Tasks</span>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{overdueTasks}</div>
            <div className="text-xs text-gray-500 mt-1">Requires attention</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Bottlenecks</span>
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{bottleneckCandidates.length}</div>
            <div className="text-xs text-gray-500 mt-1">Need intervention</div>
          </div>
        </div>

        {/* Bottleneck Alert */}
        {bottleneckCandidates.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 mb-1">Onboarding Bottlenecks Detected</h4>
                <p className="text-sm text-gray-700 mb-2">
                  {bottleneckCandidates.length} candidate{bottleneckCandidates.length > 1 ? 's' : ''} have 3+ incomplete tasks or overdue items.
                </p>
                <div className="flex flex-wrap gap-2">
                  {bottleneckCandidates.slice(0, 5).map(candidate => (
                    <Button
                      key={candidate.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(candidate.id)}
                      className="text-xs"
                    >
                      {candidate.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 card-elevation">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active Onboarding</option>
              <option value="pending">Pending Approval</option>
            </select>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Product">Product</option>
            </select>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'table' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
                className={viewMode === 'table' ? 'bg-purple-600 text-white' : ''}
              >
                Table
              </Button>
              <Button
                variant={viewMode === 'kanban' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('kanban')}
                className={viewMode === 'kanban' ? 'bg-purple-600 text-white' : ''}
              >
                Kanban
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <Table
          headers={tableHeaders}
          data={filteredApplicants}
          renderRow={renderRow}
          emptyMessage="No candidates found matching your filters"
        />

        {/* Approve Modal */}
        <ConfirmationModal
          isOpen={showApproveModal}
          onClose={() => {
            setShowApproveModal(false)
            setSelectedApplicant(null)
          }}
          onConfirm={confirmApprove}
          title="Start Onboarding Process"
          message={`Initiate onboarding for ${selectedApplicantData?.name}? This will create their onboarding tasks and send them a welcome email.`}
          confirmText="Start Onboarding"
          cancelText="Cancel"
          variant="primary"
        />

        {/* Detail Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedApplicant(null)
          }}
          title={`Onboarding Details - ${selectedApplicantData?.name}`}
          size="large"
        >
          {selectedApplicantData && selectedOnboardingStatus && (
            <div className="space-y-6">
              {/* Timeline */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Onboarding Timeline</h3>
                <OnboardingTimeline
                  stages={stages}
                  currentStage={selectedOnboardingStatus.stage || ONBOARDING_STAGES.APPLICATION_SUBMITTED}
                  stageLabels={stageLabels}
                />
              </div>

              {/* Tasks */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Tasks</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {selectedOnboardingStatus.tasks.length > 0 ? (
                    selectedOnboardingStatus.tasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onComplete={() => handleCompleteTask(selectedApplicantData.id, task.id)}
                        isApplicant={false}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No tasks assigned yet</p>
                  )}
                </div>
              </div>

              {/* Documents */}
              {selectedOnboardingStatus.documents.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Documents</h3>
                  <div className="space-y-2">
                    {selectedOnboardingStatus.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">{doc.name}</div>
                            <div className="text-xs text-gray-500">
                              {doc.uploadedAt ? `Uploaded ${new Date(doc.uploadedAt).toLocaleDateString()}` : 'Not uploaded'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {doc.status === 'pending_review' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRejectDocument(selectedApplicantData.id, doc.id)}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                Reject
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleApproveDocument(selectedApplicantData.id, doc.id)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                Approve
                              </Button>
                            </>
                          )}
                          {doc.status === 'approved' && (
                            <Badge variant="success">Approved</Badge>
                          )}
                          {doc.status === 'rejected' && (
                            <Badge variant="error">Rejected</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default OnboardingApproval
