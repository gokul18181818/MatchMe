import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { FormProvider } from './contexts/FormContext';
import { AuthProvider } from './contexts/AuthContext';

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

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FormProvider>
          <Router>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/welcome" element={<WelcomePage />} />
                <Route path="/analyze" element={<AnalyzePage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/preview" element={<PreviewPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/history" element={<History />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/test-database" element={<TestDatabasePage />} />
              </Routes>
            </Suspense>
          </Router>
        </FormProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
