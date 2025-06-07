import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { FormProvider } from './contexts/FormContext';
import LandingPage from './pages/LandingPage';
import AnalyzePage from './pages/AnalyzePage';
import PreviewPage from './pages/PreviewPage';
import ResultsPage from './pages/ResultsPage';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Settings from './pages/Settings';
import EditProfile from './pages/EditProfile';

function App() {
  return (
    <ThemeProvider>
      <FormProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/preview" element={<PreviewPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </Routes>
        </Router>
      </FormProvider>
    </ThemeProvider>
  );
}

export default App;
