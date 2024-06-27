import React from 'react';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import './TopBar.css';

const TopBar = () => {

    const navigate = useNavigate();
    const username = localStorage.getItem('username'); // Retrieve the username

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username'); // Remove the username on logout
        navigate('/login');
    };

    return (
        <div className="topbar">
            <div>
                <img src="/logo.webp" alt="Logo" className="logo" />
            </div>
            <div className="p-d-flex p-ai-center">
                <Avatar icon="pi pi-user" className="p-mr-2" size="large" />
                <span className="username">{username}</span>
                <Button label="Logout" icon="pi pi-sign-out" onClick={handleLogout} className="p-button-secondary" />
            </div>
        </div>
    );
};

export default TopBar;
