import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import "primereact/resources/themes/lara-light-blue/theme.css"
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './WelcomePage.css'; // Make sure to create and import your CSS file for custom styles

const WelcomePage = () => {

    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/login');
    };

    return (
        <div className="app-container">
            {/* <div className="background-animation"></div> */}
            <div className="content">
                <h1>Welcome to the Video Generator</h1>
                <p>Create videos with ease using AI generation.</p>
                <Button label="Get Started" onClick={handleGetStarted} icon="pi pi-sign-in" className="p-button-primary" />
            </div>
        </div>
    );
}

export default WelcomePage;
