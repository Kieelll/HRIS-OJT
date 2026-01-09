import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import DashboardLayout from '../components/layouts/DashboardLayout'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import { useToast } from '../contexts/ToastContext'
import ConfirmationModal from '../components/common/ConfirmationModal'

const Profile = () => {
  const { user, ROLES } = useAuth()
  const { showToast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    department: user?.department || 'Not specified',
    position: 'Software Engineer',
    employeeId: user?.id || '',
    joinDate: '2023-01-15',
    address: '123 Main St, City, State 12345',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

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

  const handleSave = () => {
    showToast('Profile updated successfully', 'success')
    setIsEditing(false)
    setShowSaveModal(false)
  }

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('Passwords do not match', 'error')
      return
    }
    showToast('Password changed successfully', 'success')
    setShowPasswordModal(false)
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  // Get nav items based on role
  const getNavItems = () => {
    const baseItems = [{ path: '/profile', label: 'Profile', icon: '👤' }]
    
    if (user?.role === ROLES.APPLICANT) {
      return [
        { path: '/applicant/jobs', label: 'Job Listings', icon: '💼' },
        ...baseItems,
      ]
    } else if (user?.role === ROLES.EMPLOYEE) {
      return [
        { path: '/employee/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/employee/offboarding', label: 'Offboarding', icon: '👋' },
        ...baseItems,
      ]
    } else if (user?.role === ROLES.MANAGER) {
      return [
        { path: '/manager/dashboard', label: 'Dashboard', icon: '📊' },
        ...baseItems,
      ]
    } else if ([ROLES.HR_OFFICER, ROLES.HR_ANALYST, ROLES.HR_MANAGER].includes(user?.role)) {
      return [
        { path: '/hr/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/hr/job-requests', label: 'Job Requests', icon: '📝' },
        { path: '/hr/screening', label: 'Screening', icon: '🔍' },
        { path: '/hr/interviews', label: 'Interviews', icon: '💼' },
        { path: '/hr/onboarding', label: 'Onboarding', icon: '✅' },
        { path: '/hr/offboarding', label: 'Offboarding', icon: '👋' },
        ...baseItems,
      ]
    } else if ([ROLES.HR_DIRECTOR, ROLES.CEO].includes(user?.role)) {
      return [
        { path: '/executive/dashboard', label: 'Dashboard', icon: '📊' },
        ...baseItems,
      ]
    }
    return baseItems
  }

  return (
    <DashboardLayout navItems={getNavItems()}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
            <p className="text-gray-600 mt-1">Manage your personal information and account settings</p>
          </div>
          {!isEditing && (
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              ✏️ Edit Profile
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 card-elevation text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-warm-peach to-warm-amber flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                {getInitials(user?.name)}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{user?.name}</h3>
              <Badge variant="primary" className="mb-4">
                {getRoleDisplayName(user?.role)}
              </Badge>
              <div className="space-y-2 text-sm text-gray-600">
                <p>{user?.email}</p>
                <p>{profileData.department}</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 card-elevation">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  disabled={!isEditing}
                />
                <Input
                  label="Email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  disabled={!isEditing}
                />
                <Input
                  label="Phone Number"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  disabled={!isEditing}
                />
                <Input
                  label="Department"
                  value={profileData.department}
                  onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                  disabled={!isEditing}
                />
                <Input
                  label="Position"
                  value={profileData.position}
                  onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                  disabled={!isEditing}
                />
                <Input
                  label="Employee ID"
                  value={profileData.employeeId}
                  disabled
                />
                <Input
                  label="Join Date"
                  type="date"
                  value={profileData.joinDate}
                  onChange={(e) => setProfileData({ ...profileData, joinDate: e.target.value })}
                  disabled={!isEditing}
                />
                <div className="md:col-span-2">
                  <Input
                    label="Address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-warm-beige">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={() => setShowSaveModal(true)}>
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-xl p-6 card-elevation mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Security</h3>
              <Button variant="outline" onClick={() => setShowPasswordModal(true)}>
                🔒 Change Password
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Confirmation */}
      <ConfirmationModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onConfirm={handleSave}
        title="Save Profile Changes"
        message="Are you sure you want to save these changes to your profile?"
        confirmText="Save"
        cancelText="Cancel"
        variant="primary"
      />

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="bg-warm-ivory rounded-2xl shadow-2xl w-full max-w-md card-elevation-hover">
            <div className="flex items-center justify-between p-6 border-b border-warm-beige">
              <h2 className="text-2xl font-semibold text-gray-800">Change Password</h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-smooth text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
              <Input
                label="New Password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
              />
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handlePasswordChange}>
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default Profile

