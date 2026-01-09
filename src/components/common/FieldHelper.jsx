const FieldHelper = ({ text, type = 'info' }) => {
  const styles = {
    info: 'text-blue-600 bg-blue-50 border-blue-200',
    warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    success: 'text-green-600 bg-green-50 border-green-200',
  }

  if (!text) return null

  return (
    <div className={`text-xs px-2 py-1 rounded border ${styles[type]} mt-1`}>
      {text}
    </div>
  )
}

export default FieldHelper

