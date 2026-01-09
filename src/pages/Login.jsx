import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import Button from '../components/common/Button'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [errors, setErrors] = useState({})
  const { login, ROLES } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const roleOptions = [
    { value: ROLES.APPLICANT, label: 'Applicant' },
    { value: ROLES.EMPLOYEE, label: 'Employee' },
    { value: ROLES.MANAGER, label: 'Department Manager' },
    { value: ROLES.HR_OFFICER, label: 'HR Officer' },
    { value: ROLES.HR_ANALYST, label: 'HR Analyst' },
    { value: ROLES.HR_MANAGER, label: 'HR Manager' },
    { value: ROLES.HR_DIRECTOR, label: 'HR Director' },
    { value: ROLES.CEO, label: 'CEO / COO' },
  ]

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

  const validate = () => {
    const newErrors = {}
    if (!email) newErrors.email = 'Email is required'
    if (!password) newErrors.password = 'Password is required'
    if (!role) newErrors.role = 'Role is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    // Mock login - no actual authentication
    login(email, password, role)
    showToast('Login successful', 'success')
    navigate(getDefaultRoute(role))
  }

  return (
    <div className="min-h-screen flex bg-mesh-primary">
      {/* Left Side - Branding & Information */}
      <div className="hidden lg:flex lg:w-1/2 bg-mesh-secondary items-center justify-center p-12">
        <div className="max-w-lg">
          <div className="mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-warm-peach to-warm-amber bg-clip-text text-transparent mb-3">
              HRIS
            </h1>
            <p className="text-2xl font-semibold text-gray-800 mb-2">
              Human Resource Information System
            </p>
            <p className="text-gray-600 text-lg">
              Streamline your HR operations with a comprehensive platform designed for modern organizations.
            </p>
          </div>

          <div className="space-y-6 mt-10">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-r from-warm-peach to-warm-amber flex items-center justify-center text-white text-xl font-bold">
                👥
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Talent Management</h3>
                <p className="text-gray-600 text-sm">
                  Complete recruitment lifecycle from job posting to onboarding
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-r from-warm-peach to-warm-amber flex items-center justify-center text-white text-xl font-bold">
                📊
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Analytics & Insights</h3>
                <p className="text-gray-600 text-sm">
                  Real-time dashboards and reports for data-driven HR decisions
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-r from-warm-peach to-warm-amber flex items-center justify-center text-white text-xl font-bold">
                ⚡
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Workflow Automation</h3>
                <p className="text-gray-600 text-sm">
                  Automated approvals, notifications, and streamlined processes
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-r from-warm-peach to-warm-amber flex items-center justify-center text-white text-xl font-bold">
                🔒
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Secure & Compliant</h3>
                <p className="text-gray-600 text-sm">
                  Enterprise-grade security with role-based access control
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl card-elevation-hover p-8">
            <div className="text-center mb-8 lg:hidden">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-warm-peach to-warm-amber bg-clip-text text-transparent mb-2">
                HRIS
              </h1>
              <p className="text-gray-600">Human Resource Information System</p>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600 mb-6">Sign in to access your HRIS account</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                placeholder="Enter your email"
                required
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                placeholder="Enter your password"
                required
              />

              <Select
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                options={roleOptions}
                error={errors.role}
                placeholder="Select your role"
                required
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-warm-amber hover:text-warm-peach font-medium">
                  Forgot password?
                </a>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Demo Mode: Use any email/password and select a role
              </p>
              <a href="#" className="text-sm text-warm-amber hover:text-warm-peach font-medium mt-2 inline-block">
                ← Back to Portal
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

