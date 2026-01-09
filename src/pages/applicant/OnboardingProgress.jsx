import { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useOnboarding, ONBOARDING_STAGES } from '../../contexts/OnboardingContext'
import { useAuth } from '../../contexts/AuthContext'
import OnboardingTimeline from '../../components/onboarding/OnboardingTimeline'
import TaskCard from '../../components/onboarding/TaskCard'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import { useToast } from '../../contexts/ToastContext'
import { FileText, CheckCircle2, AlertCircle, Calendar, Info } from 'lucide-react'
import { mockOnboardingTasks, mockOnboardingDocuments } from '../../mockData'

const OnboardingProgress = () => {
  const { user } = useAuth()
  const { getOnboardingStatus, updateTask, addDocument, updateDocumentStatus } = useOnboarding()
  const { showToast } = useToast()
  const [selectedTask, setSelectedTask] = useState(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)

  // Get onboarding status for current user (using user email as ID)
  const applicantId = user?.email || 'current-user'
  const onboardingStatus = getOnboardingStatus(applicantId)
  
  // Use mock data if no onboarding data exists
  const tasks = onboardingStatus.tasks.length > 0 ? onboardingStatus.tasks : mockOnboardingTasks
  const documents = onboardingStatus.documents.length > 0 ? onboardingStatus.documents : mockOnboardingDocuments

  const currentStage = onboardingStatus.stage || ONBOARDING_STAGES.OFFER_ACCEPTED

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

  const navItems = [
    { path: '/applicant/jobs', label: 'Job Listings', icon: 'briefcase' },
    { path: '/applicant/applications', label: 'My Applications', icon: 'document' },
    { path: '/applicant/onboarding', label: 'Onboarding Progress', icon: 'checkmark' },
    { path: '/applicant/profile', label: 'My Profile', icon: 'person' },
  ]

  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const totalTasks = tasks.length
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const pendingTasks = tasks.filter(t => t.status === 'pending')
  const overdueTasks = tasks.filter(t => 
    t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
  )

  const handleTaskAction = (task) => {
    setSelectedTask(task)
    setShowTaskModal(true)
  }

  const handleCompleteTask = () => {
    if (selectedTask) {
      updateTask(applicantId, selectedTask.id, { status: 'completed', completedAt: new Date().toISOString() })
      showToast('Task completed successfully!', 'success')
      setShowTaskModal(false)
      setSelectedTask(null)
    }
  }

  const handleDocumentUpload = (document) => {
    setSelectedDocument(document)
    setShowDocumentModal(true)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file && selectedDocument) {
      addDocument(applicantId, {
        ...selectedDocument,
        name: file.name,
        uploadedAt: new Date().toISOString(),
        status: 'pending_review',
      })
      showToast('Document uploaded successfully! It will be reviewed by HR.', 'success')
      setShowDocumentModal(false)
      setSelectedDocument(null)
    }
  }

  const getNextSteps = () => {
    if (pendingTasks.length === 0) {
      return 'All tasks completed! Waiting for HR review.'
    }
    const nextTask = pendingTasks[0]
    return `Next: ${nextTask.title} - Due ${new Date(nextTask.dueDate).toLocaleDateString()}`
  }

  const getStageInfo = () => {
    switch (currentStage) {
      case ONBOARDING_STAGES.OFFER_ACCEPTED:
        return {
          title: 'Welcome! Your offer has been accepted',
          description: 'Complete the pre-onboarding tasks below to prepare for your first day.',
          icon: '🎉',
        }
      case ONBOARDING_STAGES.PRE_ONBOARDING:
        return {
          title: 'Pre-Onboarding in Progress',
          description: 'You\'re completing the necessary paperwork before your start date.',
          icon: '📋',
        }
      case ONBOARDING_STAGES.ACTIVE_ONBOARDING:
        return {
          title: 'Active Onboarding',
          description: 'You\'re officially onboarded! Complete remaining tasks and attend orientation.',
          icon: '🚀',
        }
      case ONBOARDING_STAGES.FULLY_ONBOARDED:
        return {
          title: 'Fully Onboarded',
          description: 'Congratulations! You\'ve completed all onboarding tasks.',
          icon: '✅',
        }
      default:
        return {
          title: 'Onboarding Not Started',
          description: 'Complete your job application to begin onboarding.',
          icon: '📝',
        }
    }
  }

  const stageInfo = getStageInfo()

  if (currentStage === ONBOARDING_STAGES.APPLICATION_SUBMITTED || 
      currentStage === ONBOARDING_STAGES.SCREENING_PASSED ||
      currentStage === ONBOARDING_STAGES.OFFER_EXTENDED) {
    return (
      <DashboardLayout navItems={navItems}>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Onboarding Progress</h2>
            <p className="text-gray-600 mt-1">Track your onboarding journey</p>
          </div>
          <div className="bg-white rounded-xl p-8 card-elevation text-center">
            <div className="text-6xl mb-4">{stageInfo.icon}</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">{stageInfo.title}</h3>
            <p className="text-gray-600">{stageInfo.description}</p>
            <div className="mt-6">
              <OnboardingTimeline 
                stages={stages} 
                currentStage={currentStage}
                stageLabels={stageLabels}
              />
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Onboarding Progress</h2>
          <p className="text-gray-600 mt-1">Complete your tasks and prepare for your first day</p>
        </div>

        {/* Status Banner */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="text-4xl">{stageInfo.icon}</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{stageInfo.title}</h3>
                <p className="text-gray-600">{stageInfo.description}</p>
                <div className="mt-3 flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 mr-1 text-green-600" />
                    <span>{completedTasks} of {totalTasks} tasks completed</span>
                  </div>
                  <Badge variant="info" className="bg-purple-100 text-purple-700">
                    {completionPercentage}% Complete
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Tasks Completed</span>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{completedTasks}/{totalTasks}</div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Pending Tasks</span>
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{pendingTasks.length}</div>
            {overdueTasks.length > 0 && (
              <div className="mt-2 text-xs text-red-600">
                {overdueTasks.length} overdue
              </div>
            )}
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Documents</span>
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {documents.filter(d => d.status === 'approved').length}/{documents.length}
            </div>
            <div className="mt-2 text-xs text-gray-500">Documents reviewed</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl p-6 card-elevation">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Onboarding Timeline</h3>
          <OnboardingTimeline 
            stages={stages} 
            currentStage={currentStage}
            stageLabels={stageLabels}
          />
        </div>

        {/* What's Next */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-800 mb-1">What's Next?</h4>
              <p className="text-sm text-gray-700">{getNextSteps()}</p>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-xl p-6 card-elevation">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Your Tasks</h3>
            <Badge variant="info">{pendingTasks.length} Pending</Badge>
          </div>
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onAction={handleTaskAction}
                isApplicant={true}
              />
            ))}
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-xl p-6 card-elevation">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Required Documents</h3>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">{doc.name}</div>
                    <div className="text-sm text-gray-500">
                      {doc.required ? 'Required' : 'Optional'}
                      {doc.status === 'approved' && ' • Approved'}
                      {doc.status === 'pending_review' && ' • Under Review'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {doc.status === 'pending' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleDocumentUpload(doc)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Upload
                    </Button>
                  )}
                  {doc.status === 'pending_review' && (
                    <Badge variant="info" className="bg-yellow-100 text-yellow-700">
                      Under Review
                    </Badge>
                  )}
                  {doc.status === 'approved' && (
                    <Badge variant="success" className="bg-green-100 text-green-700">
                      Approved
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Completion Modal */}
        <Modal
          isOpen={showTaskModal}
          onClose={() => {
            setShowTaskModal(false)
            setSelectedTask(null)
          }}
          title={selectedTask?.title}
        >
          <div className="space-y-4">
            <p className="text-gray-600">{selectedTask?.description}</p>
            {selectedTask?.type === 'form_completion' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  Click the button below to open the form. Complete and submit it to mark this task as done.
                </p>
              </div>
            )}
            {selectedTask?.type === 'document_upload' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-3">
                  Upload the required document. Accepted formats: PDF, JPG, PNG
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full px-4 py-2 border rounded-lg"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      handleCompleteTask()
                    }
                  }}
                />
              </div>
            )}
            {selectedTask?.type === 'acknowledgment' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-3">
                  Please review the document and acknowledge that you understand the policies.
                </p>
                <Button
                  variant="primary"
                  onClick={handleCompleteTask}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  I Acknowledge
                </Button>
              </div>
            )}
            {selectedTask?.type === 'orientation' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-3">
                  Select a date and time for your orientation session.
                </p>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2 border rounded-lg"
                  min={new Date().toISOString().slice(0, 16)}
                />
                <Button
                  variant="primary"
                  onClick={handleCompleteTask}
                  className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Schedule Orientation
                </Button>
              </div>
            )}
          </div>
        </Modal>

        {/* Document Upload Modal */}
        <Modal
          isOpen={showDocumentModal}
          onClose={() => {
            setShowDocumentModal(false)
            setSelectedDocument(null)
          }}
          title={`Upload ${selectedDocument?.name}`}
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Please upload a clear, readable copy of your {selectedDocument?.name.toLowerCase()}.
            </p>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500">
              Accepted formats: PDF, JPG, PNG. Maximum file size: 10MB
            </p>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default OnboardingProgress
