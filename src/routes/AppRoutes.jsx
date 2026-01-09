import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Login from '../pages/Login'
import ApplicantPortal from '../pages/applicant/ApplicantPortal'
import EmployeeDashboard from '../pages/EmployeeDashboard'
import ManagerDashboard from '../pages/ManagerDashboard'
import HRDashboard from '../pages/HRDashboard'
import ExecutiveDashboard from '../pages/ExecutiveDashboard'
import JobRequestManagement from '../pages/recruitment/JobRequestManagement'
import ApplicantScreening from '../pages/recruitment/ApplicantScreening'
import InterviewManagement from '../pages/recruitment/InterviewManagement'
import OnboardingApproval from '../pages/recruitment/OnboardingApproval'
import JobListings from '../pages/applicant/JobListings'
import ApplyJob from '../pages/applicant/ApplyJob'
import ApplicantProfile from '../pages/applicant/ApplicantProfile'
import MyApplications from '../pages/applicant/MyApplications'
import OnboardingProgress from '../pages/applicant/OnboardingProgress'
import OffboardingAdmin from '../pages/offboarding/OffboardingAdmin'
import OffboardingEmployee from '../pages/offboarding/OffboardingEmployee'
import Profile from '../pages/Profile'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

const AppRoutes = () => {
  const { isAuthenticated, user, ROLES } = useAuth()

  const getDefaultRoute = (role) => {
    switch (role) {
      case ROLES.APPLICANT:
        return '/applicant/jobs'
      case ROLES.EMPLOYEE:
        return '/employee/dashboard'
      case ROLES.MANAGER:
        return '/manager/dashboard'
      case ROLES.HR_OFFICER:
      case ROLES.HR_ANALYST:
      case ROLES.HR_MANAGER:
        return '/hr/dashboard'
      case ROLES.HR_DIRECTOR:
      case ROLES.CEO:
        return '/executive/dashboard'
      default:
        return '/login'
    }
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={getDefaultRoute(user?.role)} replace /> : <Login />}
      />
      
      {/* Applicant Routes */}
      <Route
        path="/applicant/jobs"
        element={
          <ProtectedRoute allowedRoles={[ROLES.APPLICANT]}>
            <ApplicantPortal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applicant/apply/:jobId"
        element={
          <ProtectedRoute allowedRoles={[ROLES.APPLICANT]}>
            <ApplyJob />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applicant/profile"
        element={
          <ProtectedRoute allowedRoles={[ROLES.APPLICANT]}>
            <ApplicantProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applicant/applications"
        element={
          <ProtectedRoute allowedRoles={[ROLES.APPLICANT]}>
            <MyApplications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applicant/onboarding"
        element={
          <ProtectedRoute allowedRoles={[ROLES.APPLICANT]}>
            <OnboardingProgress />
          </ProtectedRoute>
        }
      />

      {/* Employee Routes */}
      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/offboarding"
        element={
          <ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]}>
            <OffboardingEmployee />
          </ProtectedRoute>
        }
      />

      {/* Manager Routes */}
      <Route
        path="/manager/dashboard"
        element={
          <ProtectedRoute allowedRoles={[ROLES.MANAGER]}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />

      {/* HR Routes */}
      <Route
        path="/hr/dashboard"
        element={
          <ProtectedRoute allowedRoles={[ROLES.HR_OFFICER, ROLES.HR_ANALYST, ROLES.HR_MANAGER]}>
            <HRDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/job-requests"
        element={
          <ProtectedRoute allowedRoles={[ROLES.HR_OFFICER, ROLES.HR_ANALYST, ROLES.HR_MANAGER]}>
            <JobRequestManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/screening"
        element={
          <ProtectedRoute allowedRoles={[ROLES.HR_OFFICER, ROLES.HR_ANALYST, ROLES.HR_MANAGER]}>
            <ApplicantScreening />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/interviews"
        element={
          <ProtectedRoute allowedRoles={[ROLES.HR_OFFICER, ROLES.HR_ANALYST, ROLES.HR_MANAGER]}>
            <InterviewManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/onboarding"
        element={
          <ProtectedRoute allowedRoles={[ROLES.HR_OFFICER, ROLES.HR_ANALYST, ROLES.HR_MANAGER]}>
            <OnboardingApproval />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/offboarding"
        element={
          <ProtectedRoute allowedRoles={[ROLES.HR_OFFICER, ROLES.HR_ANALYST, ROLES.HR_MANAGER]}>
            <OffboardingAdmin />
          </ProtectedRoute>
        }
      />

      {/* Executive Routes */}
      <Route
        path="/executive/dashboard"
        element={
          <ProtectedRoute allowedRoles={[ROLES.HR_DIRECTOR, ROLES.CEO]}>
            <ExecutiveDashboard />
          </ProtectedRoute>
        }
      />

      {/* Profile Route - Available to all authenticated users */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={getDefaultRoute(user?.role)} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  )
}

export default AppRoutes

