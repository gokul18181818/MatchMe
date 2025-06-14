import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { FormProvider } from './contexts/FormContext';
import { AuthProvider } from './contexts/AuthContext';
import AuthGuard from './components/AuthGuard';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const WelcomePage = lazy(() => import('./pages/WelcomePage'));
const AnalyzePage = lazy(() => import('./pages/AnalyzePage'));
const PreviewPage = lazy(() => import('./pages/PreviewPage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const History = lazy(() => import('./pages/History'));
const Settings = lazy(() => import('./pages/Settings'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const Subscription = lazy(() => import('./pages/Subscription'));
const TestDatabasePage = lazy(() => import('./pages/TestDatabasePage'));
const ChooseActionPage = lazy(() => import('./pages/ChooseActionPage'));
const JobRecommendationsPage = lazy(() => import('./pages/JobRecommendationsPage'));
const JobCurationPage = lazy(() => import('./pages/JobCurationPage'));
const TestLinkedInAPI = lazy(() => import('./components/TestLinkedInAPI'));

// Error Boundary Component
class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Please refresh the page to continue
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-300">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <AppErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <FormProvider>
            <Router
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
              }}
            >
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/welcome" element={<AuthGuard><WelcomePage /></AuthGuard>} />
                  <Route path="/analyze" element={<AuthGuard><AnalyzePage /></AuthGuard>} />
                  <Route path="/results" element={<AuthGuard><ResultsPage /></AuthGuard>} />
                  <Route path="/preview" element={<AuthGuard><PreviewPage /></AuthGuard>} />
                  <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
                  <Route path="/history" element={<AuthGuard><History /></AuthGuard>} />
                  <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />
                  <Route path="/edit-profile" element={<AuthGuard><EditProfile /></AuthGuard>} />
                  <Route path="/subscription" element={<AuthGuard><Subscription /></AuthGuard>} />
                  <Route path="/test-database" element={<AuthGuard><TestDatabasePage /></AuthGuard>} />
                  <Route path="/choose-action" element={<AuthGuard><ChooseActionPage /></AuthGuard>} />
                  <Route path="/job-recommendations" element={<AuthGuard><JobRecommendationsPage /></AuthGuard>} />
                  <Route path="/job-curation" element={<AuthGuard><JobCurationPage /></AuthGuard>} />
                  <Route path="/test-linkedin-api" element={<AuthGuard><TestLinkedInAPI /></AuthGuard>} />
                </Routes>
              </Suspense>
            </Router>
          </FormProvider>
        </AuthProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}

export default App;
