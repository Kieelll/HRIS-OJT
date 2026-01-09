import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import Sidebar from './Sidebar'
import { Search, Bell } from 'lucide-react'

const DashboardLayout = ({ children, navItems = [], quickActions = [] }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-mesh-primary flex">
      <Sidebar
        navItems={navItems}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar with Search and Notifications */}
        <header className="bg-white border-b border-warm-beige shadow-sm h-16 flex items-center justify-between px-6">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search employees, jobs, documents..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center space-x-4 ml-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-smooth">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {/* Quick Actions */}
            {quickActions.length > 0 && (
              <div className="flex items-center space-x-2">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={action.onClick}
                    className="flex items-center px-3 py-1.5 bg-gradient-to-r from-warm-peach to-warm-amber text-white text-sm font-medium rounded-lg hover:from-warm-amber hover:to-warm-peach transition-smooth"
                  >
                    {action.icon && <span className="mr-1.5">{action.icon}</span>}
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout

