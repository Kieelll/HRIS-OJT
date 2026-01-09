import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import ConfirmationModal from '../common/ConfirmationModal'
import { useToast } from '../../contexts/ToastContext'
import { getIconComponent } from '../../utils/iconMapper'
import { LogOut } from 'lucide-react'

const Sidebar = ({ navItems = [], isCollapsed, onToggleCollapse }) => {
  const { user, logout, ROLES } = useAuth()
  const { showToast } = useToast()
  const location = useLocation()
  const navigate = useNavigate()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

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
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U'
  }

  return (
    <>
      <aside
        className={`bg-white border-r border-warm-beige shadow-sm transition-all duration-300 flex flex-col ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div>
                <h1 className="text-2xl font-bold text-purple-600">Premium HRIS</h1>
                <p className="text-xs text-gray-600">Talent Portal</p>
              </div>
            )}
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-lg hover:bg-gray-100 transition-smooth text-gray-600 hover:text-gray-800"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? '→' : '←'}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              const IconComponent = item.icon ? getIconComponent(item.icon) : null
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth ${
                    isActive
                      ? 'bg-purple-50 text-purple-600 border-l-4 border-purple-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  {IconComponent && (
                    <IconComponent 
                      className={`${isCollapsed ? 'mx-auto' : 'mr-3'} ${isActive ? 'text-purple-600' : 'text-gray-600'} w-5 h-5`}
                    />
                  )}
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-200 p-4">
          {!isCollapsed ? (
            <div className="space-y-2">
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{getRoleDisplayName(user?.role)}</p>
              </div>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="w-full flex items-center px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-smooth"
              >
                <LogOut className="mr-2 w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-semibold mx-auto mb-3">
                {getInitials(user?.name)}
              </div>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="w-full flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-smooth"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out? You will need to sign in again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        variant="primary"
      />
    </>
  )
}

export default Sidebar

