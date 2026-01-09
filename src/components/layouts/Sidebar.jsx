import { Link, useLocation } from 'react-router-dom'
import { getIconComponent } from '../../utils/iconMapper'

const Sidebar = ({ navItems = [], isCollapsed, onToggleCollapse }) => {
  const location = useLocation()

  return (
    <>
      <aside
        className={`bg-white dark:bg-dark-surface border-r border-warm-beige dark:border-dark-border shadow-sm transition-all duration-300 flex flex-col ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div>
                <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400">Premium HRIS</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Talent Portal</p>
              </div>
            )}
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-surfaceHover transition-smooth text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? '→' : '←'}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-2">
            {navItems
              .filter(item => item.path !== '/settings') // Remove Settings from sidebar
              .map((item) => {
                const isActive = location.pathname === item.path
                const IconComponent = item.icon ? getIconComponent(item.icon) : null
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth ${
                      isActive
                        ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-l-4 border-purple-600 dark:border-purple-500'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-surfaceHover'
                    }`}
                    title={isCollapsed ? item.label : ''}
                  >
                    {IconComponent && (
                      <IconComponent 
                        className={`${isCollapsed ? 'mx-auto' : 'mr-3'} ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'} w-5 h-5`}
                      />
                    )}
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                )
              })}
          </div>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar

