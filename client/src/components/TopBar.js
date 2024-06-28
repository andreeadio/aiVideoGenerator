import React from 'react';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Import Link

import './TopBar.css';

const TopBar = () => {

    const navigate = useNavigate();
    const username = localStorage.getItem('username'); // Retrieve the username

    const handleLogout = () => {
        // localStorage.removeItem('token');
        // localStorage.removeItem('username'); // Remove the username on logout
        navigate('/login');
    };
    const navigateToVideo = () => {
        navigate('/video');
    };

    const navigateToGenerateImages = () => {
        navigate('/generate-images');
    };

    return (
        <div className="topbar">
            {/* <div className="p-d-flex p-ai-center">
                <img src="/logo.webp" alt="Logo" className="logo" />
                <Link to="/generate-images" className="nav-link">Generate Video</Link>
                <Link to="/video" className="nav-link">Video List</Link>

            </div>

            <div className="p-d-flex p-ai-center">
                <Avatar icon="pi pi-user" className="p-mr-2" />
                <span className="username">{username}</span>
                <Button label=" Log out" icon="pi pi-sign-out" onClick={handleLogout} className="p-button-secondary" />
            </div> */}


            <div className="navigation-links">
                <img src="/logo.webp" alt="Logo" className="logo" />
                <Link to="/generate-images" className="nav-link">Generate Video</Link>
                <Link to="/video" className="nav-link">Video List</Link>
            </div>
            <div className="user-section">
                <Avatar icon="pi pi-user" className="p-mr-2" />
                <span className="username">{username}</span>
                <Button label=" Log out" icon="pi pi-sign-out" onClick={handleLogout} className="p-button-secondary" />
            </div>
        </div>
    );
};

export default TopBar;
