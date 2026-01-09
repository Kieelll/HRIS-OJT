const ProgressBar = ({ steps, currentStep }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-smooth ${
                  index < currentStep
                    ? 'bg-gradient-to-r from-warm-peach to-warm-amber text-white'
                    : index === currentStep
                    ? 'bg-warm-amber text-white ring-4 ring-warm-peach ring-opacity-30'
                    : 'bg-warm-beige text-gray-600'
                }`}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
              <p className={`mt-2 text-xs font-medium ${index <= currentStep ? 'text-gray-800' : 'text-gray-500'}`}>
                {step}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 transition-smooth ${
                  index < currentStep ? 'bg-gradient-to-r from-warm-peach to-warm-amber' : 'bg-warm-beige'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProgressBar

