import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import { ApplicantProfileProvider } from './contexts/ApplicantProfileContext'
import { OnboardingProvider } from './contexts/OnboardingContext'
import AppRoutes from './routes/AppRoutes'
import ToastContainer from './components/common/ToastContainer'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ApplicantProfileProvider>
          <OnboardingProvider>
            <ToastProvider>
              <AppRoutes />
              <ToastContainer />
            </ToastProvider>
          </OnboardingProvider>
        </ApplicantProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

