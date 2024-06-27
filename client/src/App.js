
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import WelcomePage from "./components/WelcomePage";
import LoginPage from "./components/LoginPage";
import PromptForm from "./components/PromptForm";
import RegisterPage from "./components/RegisterPage";
import VideoDisplayPage from './components/VideoDisplayPage';
import TopBar from './components/TopBar';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const hideTopBarPaths = ['/', '/login', '/register']; // Add paths where you don't want to show the TopBar

  return (
    <div >
      {!hideTopBarPaths.includes(location.pathname) && <TopBar />}
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/generate" element={<PromptForm />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/video" element={<VideoDisplayPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
