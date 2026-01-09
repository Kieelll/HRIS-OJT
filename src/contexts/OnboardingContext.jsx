import { createContext, useContext, useState, useEffect } from 'react'

const OnboardingContext = createContext()

// Onboarding stages
export const ONBOARDING_STAGES = {
  APPLICATION_SUBMITTED: 'application_submitted',
  SCREENING_PASSED: 'screening_passed',
  OFFER_EXTENDED: 'offer_extended',
  OFFER_ACCEPTED: 'offer_accepted',
  PRE_ONBOARDING: 'pre_onboarding',
  ACTIVE_ONBOARDING: 'active_onboarding',
  FULLY_ONBOARDED: 'fully_onboarded',
}

// Task types
export const TASK_TYPES = {
  DOCUMENT_UPLOAD: 'document_upload',
  DOCUMENT_REVIEW: 'document_review',
  FORM_COMPLETION: 'form_completion',
  ACKNOWLEDGMENT: 'acknowledgment',
  ORIENTATION: 'orientation',
  SYSTEM_ACCESS: 'system_access',
}

export const OnboardingProvider = ({ children }) => {
  const [onboardingData, setOnboardingData] = useState(() => {
    const saved = localStorage.getItem('onboardingData')
    return saved ? JSON.parse(saved) : {}
  })

  useEffect(() => {
    localStorage.setItem('onboardingData', JSON.stringify(onboardingData))
  }, [onboardingData])

  const getOnboardingStatus = (applicantId) => {
    return onboardingData[applicantId] || {
      stage: ONBOARDING_STAGES.APPLICATION_SUBMITTED,
      tasks: [],
      documents: [],
      startDate: null,
      expectedStartDate: null,
      assignedDepartment: null,
      assignedManager: null,
    }
  }

  const updateOnboardingStage = (applicantId, stage) => {
    setOnboardingData((prev) => ({
      ...prev,
      [applicantId]: {
        ...getOnboardingStatus(applicantId),
        stage,
        updatedAt: new Date().toISOString(),
      },
    }))
  }

  const addTask = (applicantId, task) => {
    setOnboardingData((prev) => {
      const current = getOnboardingStatus(applicantId)
      return {
        ...prev,
        [applicantId]: {
          ...current,
          tasks: [...current.tasks, { ...task, id: Date.now(), createdAt: new Date().toISOString() }],
        },
      }
    })
  }

  const updateTask = (applicantId, taskId, updates) => {
    setOnboardingData((prev) => {
      const current = getOnboardingStatus(applicantId)
      return {
        ...prev,
        [applicantId]: {
          ...current,
          tasks: current.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
          ),
        },
      }
    })
  }

  const addDocument = (applicantId, document) => {
    setOnboardingData((prev) => {
      const current = getOnboardingStatus(applicantId)
      return {
        ...prev,
        [applicantId]: {
          ...current,
          documents: [...current.documents, { ...document, id: Date.now(), uploadedAt: new Date().toISOString() }],
        },
      }
    })
  }

  const updateDocumentStatus = (applicantId, documentId, status) => {
    setOnboardingData((prev) => {
      const current = getOnboardingStatus(applicantId)
      return {
        ...prev,
        [applicantId]: {
          ...current,
          documents: current.documents.map((doc) =>
            doc.id === documentId ? { ...doc, status, reviewedAt: new Date().toISOString() } : doc
          ),
        },
      }
    })
  }

  const initializeOnboarding = (applicantId, data) => {
    setOnboardingData((prev) => ({
      ...prev,
      [applicantId]: {
        stage: ONBOARDING_STAGES.OFFER_ACCEPTED,
        tasks: data.tasks || [],
        documents: data.documents || [],
        startDate: data.startDate || null,
        expectedStartDate: data.expectedStartDate || null,
        assignedDepartment: data.assignedDepartment || null,
        assignedManager: data.assignedManager || null,
        createdAt: new Date().toISOString(),
      },
    }))
  }

  const value = {
    onboardingData,
    getOnboardingStatus,
    updateOnboardingStage,
    addTask,
    updateTask,
    addDocument,
    updateDocumentStatus,
    initializeOnboarding,
    ONBOARDING_STAGES,
    TASK_TYPES,
  }

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}

