import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AnalysisForm from './components/AnalysisForm';
import ProcessingView from './components/ProcessingView';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/analyze" element={<AnalysisForm />} />
        <Route path="/analyzing/:jobId" element={<ProcessingView />} />
        <Route path="/results/:jobId" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
