import React from 'react';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Import Link

import './TopBar.css';
// import jwtDecode from 'jwt-decode';
import { jwtDecode } from 'jwt-decode';

const TopBar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    let username = '';

    // Decode the JWT token to get the username
    if (token) {
        const decoded = jwtDecode(token);
        username = decoded.username; // Assuming the payload has a 'username' field
    }
    const handleLogout = () => {
        localStorage.removeItem('token');
        //localStorage.removeItem('username'); // Remove the username on logout
        navigate('/login');
    };

    return (
        <div className="topbar">

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
