import { useState, useEffect } from 'react'
import DashboardLayout from '../components/layouts/DashboardLayout'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useToast } from '../contexts/ToastContext'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import Select from '../components/common/Select'
import ConfirmationModal from '../components/common/ConfirmationModal'
import { Settings as SettingsIcon, Bell, User, Lock, Globe, Moon, Sun } from 'lucide-react'

const Settings = () => {
  const { user, ROLES } = useAuth()
  const { theme, setTheme } = useTheme()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('account')
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [formData, setFormData] = useState({
    email: user?.email || '',
    name: user?.name || '',
    language: 'en',
    timezone: 'UTC',
    theme: theme,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
  })

  useEffect(() => {
    setFormData(prev => ({ ...prev, theme }))
  }, [theme])

  const getRoleNavItems = () => {
    const baseItems = [{ path: '/profile', label: 'Profile', icon: 'person' }]
    
    if (user?.role === ROLES.APPLICANT) {
      return [
        { path: '/applicant/jobs', label: 'Job Listings', icon: 'briefcase' },
        { path: '/applicant/applications', label: 'My Applications', icon: 'document' },
        { path: '/applicant/onboarding', label: 'Onboarding Progress', icon: 'checkmark' },
        ...baseItems,
      ]
    }
    if (user?.role === ROLES.EMPLOYEE) {
      return [
        { path: '/employee/dashboard', label: 'Dashboard', icon: 'dashboard' },
        ...baseItems,
      ]
    }
    if (user?.role === ROLES.MANAGER) {
      return [
        { path: '/manager/dashboard', label: 'Dashboard', icon: 'dashboard' },
        ...baseItems,
      ]
    }
    if ([ROLES.HR_OFFICER, ROLES.HR_ANALYST, ROLES.HR_MANAGER].includes(user?.role)) {
      return [
        { path: '/hr/dashboard', label: 'Dashboard', icon: 'dashboard' },
        ...baseItems,
      ]
    }
    if ([ROLES.HR_DIRECTOR, ROLES.CEO].includes(user?.role)) {
      return [
        { path: '/executive/dashboard', label: 'Dashboard', icon: 'dashboard' },
        ...baseItems,
      ]
    }
    return baseItems
  }

  const navItems = getRoleNavItems()

  const handleSave = () => {
    showToast('Settings saved successfully', 'success')
    setShowSaveModal(false)
  }

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Globe },
  ]

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-dark-text">Settings</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account settings and preferences</p>
        </div>

        <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border shadow-sm transition-colors">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-dark-border">
            <div className="flex space-x-1 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${
                      activeTab === tab.id
                        ? 'border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400'
                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-2 ${activeTab === tab.id ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'}`} />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'account' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Role"
                      value={user?.role || ''}
                      disabled
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text">Notification Preferences</h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 border border-gray-200 dark:border-dark-border rounded-lg hover:border-purple-300 dark:hover:border-purple-500 transition-colors cursor-pointer bg-white dark:bg-dark-surface">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-dark-text">Email Notifications</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.emailNotifications}
                      onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 border border-gray-200 dark:border-dark-border rounded-lg hover:border-purple-300 dark:hover:border-purple-500 transition-colors cursor-pointer bg-white dark:bg-dark-surface">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-dark-text">Push Notifications</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Receive browser push notifications</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.pushNotifications}
                      onChange={(e) => setFormData({ ...formData, pushNotifications: e.target.checked })}
                      className="w-5 h-5 text-purple-600 dark:text-purple-400 rounded focus:ring-purple-500 dark:focus:ring-purple-400"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 border border-gray-200 dark:border-dark-border rounded-lg hover:border-purple-300 dark:hover:border-purple-500 transition-colors cursor-pointer bg-white dark:bg-dark-surface">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-dark-text">SMS Notifications</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via SMS</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.smsNotifications}
                      onChange={(e) => setFormData({ ...formData, smsNotifications: e.target.checked })}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text">Security Settings</h3>
                <div className="space-y-4">
                  <div>
                    <Input
                      label="Current Password"
                      type="password"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <Input
                      label="New Password"
                      type="password"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <Input
                      label="Confirm New Password"
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <Button variant="primary" className="bg-purple-600 hover:bg-purple-700 text-white">
                    Update Password
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text">Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label="Language"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    options={[
                      { value: 'en', label: 'English' },
                      { value: 'es', label: 'Spanish' },
                      { value: 'fr', label: 'French' },
                    ]}
                  />
                  <Select
                    label="Timezone"
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    options={[
                      { value: 'UTC', label: 'UTC' },
                      { value: 'EST', label: 'Eastern Time' },
                      { value: 'PST', label: 'Pacific Time' },
                    ]}
                  />
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => {
                          setTheme('light')
                          setFormData({ ...formData, theme: 'light' })
                        }}
                        className={`flex items-center px-4 py-2 border rounded-lg transition-all ${
                          formData.theme === 'light' 
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-500' 
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                        }`}
                      >
                        <Sun className="w-4 h-4 mr-2" />
                        Light
                      </button>
                      <button
                        onClick={() => {
                          setTheme('dark')
                          setFormData({ ...formData, theme: 'dark' })
                        }}
                        className={`flex items-center px-4 py-2 border rounded-lg transition-all ${
                          formData.theme === 'dark' 
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-500' 
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                        }`}
                      >
                        <Moon className="w-4 h-4 mr-2" />
                        Dark
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Theme changes are applied immediately
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-dark-border">
              <Button variant="outline" onClick={() => {
                setFormData({
                  email: user?.email || '',
                  name: user?.name || '',
                  language: 'en',
                  timezone: 'UTC',
                  theme: theme,
                  emailNotifications: true,
                  pushNotifications: true,
                  smsNotifications: false,
                })
              }}>
                Reset
              </Button>
              <Button
                variant="primary"
                onClick={() => setShowSaveModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onConfirm={handleSave}
        title="Save Settings"
        message="Are you sure you want to save these settings changes?"
        confirmText="Save"
        cancelText="Cancel"
        variant="primary"
      />
    </DashboardLayout>
  )
}

export default Settings

