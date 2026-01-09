import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react'

const OnboardingTimeline = ({ stages, currentStage, stageLabels }) => {
  const getStageIndex = (stage) => {
    return stages.indexOf(stage)
  }

  const currentIndex = getStageIndex(currentStage)

  const getStageStatus = (index) => {
    if (index < currentIndex) return 'completed'
    if (index === currentIndex) return 'current'
    return 'upcoming'
  }

  const getStageIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-green-600" />
      case 'current':
        return <Clock className="w-6 h-6 text-purple-600" />
      default:
        return <Circle className="w-6 h-6 text-gray-300" />
    }
  }

  return (
    <div className="relative">
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
      <div className="space-y-8">
        {stages.map((stage, index) => {
          const status = getStageStatus(index)
          const label = stageLabels[stage] || stage
          const isCompleted = status === 'completed'
          const isCurrent = status === 'current'

          return (
            <div key={stage} className="relative flex items-start space-x-4">
              <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 ${
                isCompleted ? 'border-green-600' : isCurrent ? 'border-purple-600' : 'border-gray-300'
              }`}>
                {getStageIcon(status)}
              </div>
              <div className="flex-1 pt-1">
                <div className={`text-sm font-medium ${
                  isCompleted ? 'text-gray-600' : isCurrent ? 'text-purple-600' : 'text-gray-400'
                }`}>
                  {label}
                </div>
                {isCurrent && (
                  <div className="mt-1 text-xs text-purple-600 font-medium">
                    Current Step
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OnboardingTimeline

