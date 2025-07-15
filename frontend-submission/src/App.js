import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShortenerPage from './pages/ShortenerPage';
import StatisticsPage from './pages/StatisticsPage';
import Redirector from './pages/Redirector';
import { CssBaseline } from '@mui/material';
import { LoggerProvider } from './middleware/LoggerContext';

function App() {
  return (
    <LoggerProvider>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<ShortenerPage />} />
          <Route path="/stats" element={<StatisticsPage />} />
          <Route path="/:shortcode" element={<Redirector />} />
        </Routes>
      </Router>
    </LoggerProvider>
  );
}

export default App;
