import { CheckCircle2, Circle, FileText, ClipboardCheck, Calendar, AlertCircle, Clock } from 'lucide-react'
import Badge from '../common/Badge'
import Button from '../common/Button'

const TaskCard = ({ task, onComplete, onAction, isApplicant = false }) => {
  const isCompleted = task.status === 'completed'
  const isPending = task.status === 'pending'
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted

  const getTaskIcon = () => {
    switch (task.type) {
      case 'document_upload':
        return <FileText className="w-5 h-5" />
      case 'form_completion':
        return <ClipboardCheck className="w-5 h-5" />
      case 'acknowledgment':
        return <CheckCircle2 className="w-5 h-5" />
      case 'orientation':
        return <Calendar className="w-5 h-5" />
      default:
        return <Circle className="w-5 h-5" />
    }
  }

  const getStatusBadge = () => {
    if (isCompleted) {
      return <Badge variant="success" className="bg-green-100 text-green-700">Completed</Badge>
    }
    if (isOverdue) {
      return <Badge variant="error" className="bg-red-100 text-red-700">Overdue</Badge>
    }
    if (isPending) {
      return <Badge variant="warning" className="bg-yellow-100 text-yellow-700">Pending</Badge>
    }
    return <Badge variant="info" className="bg-blue-100 text-blue-700">In Progress</Badge>
  }

  return (
    <div className={`bg-white rounded-lg border-2 p-4 transition-all ${
      isCompleted ? 'border-green-200 bg-green-50/30' : 
      isOverdue ? 'border-red-200 bg-red-50/30' : 
      'border-gray-200 hover:border-purple-300 hover:shadow-md'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          <div className={`mt-1 ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              getTaskIcon()
            )}
          </div>
          <div className="flex-1">
            <h4 className={`font-medium ${isCompleted ? 'text-gray-600 line-through' : 'text-gray-900'}`}>
              {task.title}
            </h4>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {task.dueDate && (
        <div className="flex items-center text-xs text-gray-500 mb-3">
          <Clock className="w-4 h-4 mr-1" />
          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
          {isOverdue && (
            <span className="ml-2 text-red-600 font-medium">Overdue</span>
          )}
        </div>
      )}

      {task.assignedBy && !isApplicant && (
        <div className="text-xs text-gray-500 mb-3">
          Assigned by: {task.assignedBy}
        </div>
      )}

      {!isCompleted && (
        <div className="flex items-center space-x-2 mt-3">
          {isApplicant && onAction && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onAction(task)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {task.actionLabel || 'Complete Task'}
            </Button>
          )}
          {!isApplicant && onComplete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onComplete(task.id)}
            >
              Mark Complete
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default TaskCard

