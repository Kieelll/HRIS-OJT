import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import Sidebar from './Sidebar'
import ConfirmationModal from '../common/ConfirmationModal'
import { Search, Bell, Settings, User, LogOut, ChevronDown } from 'lucide-react'

const DashboardLayout = ({ children, navItems = [], quickActions = [] }) => {
  const { user, logout, ROLES } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const notificationsRef = useRef(null)
  const userMenuRef = useRef(null)

  // Mock notifications
  const notifications = [
    { id: 1, message: 'New job application received', time: '2 hours ago', read: false },
    { id: 2, message: 'Interview scheduled for tomorrow', time: '5 hours ago', read: false },
    { id: 3, message: 'Onboarding task completed', time: '1 day ago', read: true },
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    showToast('Logged out successfully', 'success')
    navigate('/login')
  }

  const getRoleDisplayName = (role) => {
    const roleNames = {
      [ROLES.APPLICANT]: 'Applicant',
      [ROLES.EMPLOYEE]: 'Employee',
      [ROLES.MANAGER]: 'Manager',
      [ROLES.HR_OFFICER]: 'HR Officer',
      [ROLES.HR_ANALYST]: 'HR Analyst',
      [ROLES.HR_MANAGER]: 'HR Manager',
      [ROLES.HR_DIRECTOR]: 'HR Director',
      [ROLES.CEO]: 'CEO',
    }
    return roleNames[role] || 'User'
  }

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
  }

  return (
    <div className="min-h-screen bg-mesh-primary dark:bg-dark-bg flex transition-colors">
      <Sidebar
        navItems={navItems}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar with Search and Notifications */}
        <header className="bg-white dark:bg-dark-surface border-b border-warm-beige dark:border-dark-border shadow-sm h-16 flex items-center justify-between px-6 transition-colors">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search employees, jobs, documents..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-gray-900 dark:text-dark-text placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-colors"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
          <div className="flex items-center space-x-3 ml-4">
            {/* Quick Actions */}
            {quickActions.length > 0 && (
              <div className="hidden lg:flex items-center space-x-2">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={action.onClick}
                    className="flex items-center px-3 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-smooth"
                  >
                    {action.icon && <span className="mr-1.5">{action.icon}</span>}
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-surfaceHover rounded-lg transition-smooth"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-surface rounded-xl shadow-2xl border border-gray-200 dark:border-dark-border z-50 transition-colors">
                  <div className="p-4 border-b border-gray-200 dark:border-dark-border">
                    <h3 className="font-semibold text-gray-800 dark:text-dark-text">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">No notifications</div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-surfaceHover cursor-pointer transition-colors ${
                            !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm text-gray-900 dark:text-dark-text">{notification.message}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-full mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 border-t border-gray-200 dark:border-dark-border">
                    <button className="w-full text-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 py-2 transition-colors">
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings Icon */}
            <Link
              to="/settings"
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-surfaceHover rounded-lg transition-smooth"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-surfaceHover transition-smooth"
              >
                <div className="w-8 h-8 rounded-full bg-purple-600 dark:bg-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                  {getInitials(user?.name)}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-sm font-medium text-gray-800 dark:text-dark-text">{user?.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{getRoleDisplayName(user?.role)}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 hidden lg:block" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-surface rounded-xl shadow-2xl border border-gray-200 dark:border-dark-border z-50 transition-colors">
                  <div className="p-4 border-b border-gray-200 dark:border-dark-border">
                    <div className="text-sm font-medium text-gray-800 dark:text-dark-text">{user?.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</div>
                  </div>
                  <div className="py-2">
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-surfaceHover transition-smooth"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-surfaceHover transition-smooth"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </div>
                  <div className="border-t border-gray-200 dark:border-dark-border p-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        setShowLogoutModal(true)
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-smooth"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 px-6">
            {children}
          </div>
        </main>
      </div>

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to sign in again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        variant="primary"
      />
    </div>
  )
}

export default DashboardLayout

