import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

const ROLES = {
  APPLICANT: 'applicant',
  EMPLOYEE: 'employee',
  MANAGER: 'manager',
  HR_OFFICER: 'hr_officer',
  HR_ANALYST: 'hr_analyst',
  HR_MANAGER: 'hr_manager',
  HR_DIRECTOR: 'hr_director',
  CEO: 'ceo',
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('hris_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, password, role) => {
    // Mock login - in real app, this would be an API call
    const mockUser = {
      id: `user_${Date.now()}`,
      email,
      name: getMockUserName(role),
      role,
      department: getMockDepartment(role),
    }
    setUser(mockUser)
    localStorage.setItem('hris_user', JSON.stringify(mockUser))
    return mockUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('hris_user')
  }

  const getMockUserName = (role) => {
    const names = {
      [ROLES.APPLICANT]: 'John Applicant',
      [ROLES.EMPLOYEE]: 'Jane Employee',
      [ROLES.MANAGER]: 'Mike Manager',
      [ROLES.HR_OFFICER]: 'Sarah HR Officer',
      [ROLES.HR_ANALYST]: 'David HR Analyst',
      [ROLES.HR_MANAGER]: 'Lisa HR Manager',
      [ROLES.HR_DIRECTOR]: 'Robert HR Director',
      [ROLES.CEO]: 'CEO Executive',
    }
    return names[role] || 'User'
  }

  const getMockDepartment = (role) => {
    if (role === ROLES.APPLICANT) return null
    if ([ROLES.HR_OFFICER, ROLES.HR_ANALYST, ROLES.HR_MANAGER, ROLES.HR_DIRECTOR].includes(role)) {
      return 'Human Resources'
    }
    return 'Engineering'
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    ROLES,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

