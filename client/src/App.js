import logo from './logo.svg';
import './App.css';


import React, { useState } from 'react';

import { BrowserRouter as Router, Routes, Route, Switch } from 'react-router-dom';
import WelcomePage from "./components/WelcomePage";
import LoginPage from "./components/LoginPage";
import VideoGenPage from "./components/VideoGenPage"
import RegisterPage from "./components/RegisterPage"
import VideoDisplayPage from './components/VideoDisplayPage';
import PromptForm from './components/PromptForm';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/"
          element={<WelcomePage />} />
        <Route path="/login"
          element={<LoginPage />} />
        <Route path="/generate"
          element={<VideoGenPage />} />
        <Route path="/register"
          element={<RegisterPage />} />
        <Route path="/video" element={<VideoDisplayPage />} />

      </Routes>
    </Router>
  );
}

export default App;
