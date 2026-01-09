import { useToast } from '../../contexts/ToastContext'

const ToastContainer = () => {
  const { toasts, removeToast } = useToast()

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500 text-green-800'
      case 'error':
        return 'bg-red-100 border-red-500 text-red-800'
      case 'warning':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800'
      case 'info':
        return 'bg-blue-100 border-blue-500 text-blue-800'
      default:
        return 'bg-warm-cream border-warm-beige text-gray-800'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`min-w-[300px] px-4 py-3 rounded-lg border shadow-lg card-elevation ${getToastStyles(toast.type)} transition-smooth animate-slide-in`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-current opacity-70 hover:opacity-100"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ToastContainer

