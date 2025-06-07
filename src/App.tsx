import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { FormProvider } from './contexts/FormContext';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const AnalyzePage = lazy(() => import('./pages/AnalyzePage'));
const PreviewPage = lazy(() => import('./pages/PreviewPage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const History = lazy(() => import('./pages/History'));
const Settings = lazy(() => import('./pages/Settings'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const Subscription = lazy(() => import('./pages/Subscription'));

function App() {
  return (
    <ThemeProvider>
      <FormProvider>
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/analyze" element={<AnalyzePage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/preview" element={<PreviewPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/subscription" element={<Subscription />} />
            </Routes>
          </Suspense>
        </Router>
      </FormProvider>
    </ThemeProvider>
  );
}

export default App;
