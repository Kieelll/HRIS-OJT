import { createContext, useContext, useState, useEffect } from 'react'

const ApplicantProfileContext = createContext()

export const useApplicantProfile = () => {
  const context = useContext(ApplicantProfileContext)
  if (!context) {
    throw new Error('useApplicantProfile must be used within ApplicantProfileProvider')
  }
  return context
}

export const ApplicantProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load profile from localStorage
    const storedProfile = localStorage.getItem('applicant_profile')
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile))
    }
    setLoading(false)
  }, [])

  const calculateCompletion = (profileData) => {
    if (!profileData) return 0
    
    const fields = {
      personal: ['fullName', 'email', 'contactNumber', 'address'],
      professional: ['skills', 'yearsOfExperience', 'preferredRoles', 'employmentTypePreferences'],
      attributes: ['personalityTraits', 'workStyle'],
      documents: ['resume', 'validId'],
    }
    
    let totalFields = 0
    let completedFields = 0
    
    Object.values(fields).forEach((section) => {
      section.forEach((field) => {
        totalFields++
        if (field === 'skills' || field === 'personalityTraits' || field === 'preferredRoles') {
          if (profileData[field] && profileData[field].length > 0) {
            completedFields++
          }
        } else if (profileData[field]) {
          completedFields++
        }
      })
    })
    
    return Math.round((completedFields / totalFields) * 100)
  }

  const updateProfile = (updates) => {
    const updatedProfile = { ...profile, ...updates, lastUpdated: new Date().toISOString() }
    setProfile(updatedProfile)
    localStorage.setItem('applicant_profile', JSON.stringify(updatedProfile))
    return updatedProfile
  }

  const getCompletionPercentage = () => {
    return calculateCompletion(profile)
  }

  const value = {
    profile,
    updateProfile,
    setProfile,
    getCompletionPercentage,
    loading,
  }

  return (
    <ApplicantProfileContext.Provider value={value}>
      {children}
    </ApplicantProfileContext.Provider>
  )
}

