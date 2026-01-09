import DashboardLayout from '../../components/layouts/DashboardLayout'
import EmptyState from '../../components/common/EmptyState'

const MyApplications = () => {
  const navItems = [
    { path: '/applicant/jobs', label: 'Job Listings', icon: 'briefcase' },
    { path: '/applicant/applications', label: 'My Applications', icon: 'document' },
    { path: '/applicant/onboarding', label: 'Onboarding Progress', icon: 'checkmark' },
    { path: '/applicant/profile', label: 'My Profile', icon: 'person' },
  ]

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">My Applications</h2>
          <p className="text-gray-600 mt-1">View and track your job applications</p>
        </div>
        <EmptyState
          icon="📄"
          title="No Applications Yet"
          description="You haven't submitted any job applications yet. Browse job listings and apply to get started."
        />
      </div>
    </DashboardLayout>
  )
}

export default MyApplications

