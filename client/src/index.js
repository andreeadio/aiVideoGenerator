import "primereact/resources/themes/lara-light-blue/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import 'primeicons/primeicons.css'; //import icons

import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import WelcomePage from "./components/WelcomePage";
import LoginPage from "./components/LoginPage";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);