import React, { useState } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Card } from 'primereact/card';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './LoginPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username,
                password,
            });

            const { token } = response.data;
            localStorage.setItem('token', token);
            // localStorage.setItem('username', response.data.username);
            setError('');
            navigate('/generate-images');
        } catch (error) {
            setError('Invalid username or password. Please try again.');
            console.error('Error logging in:', error)
        }
    }


    return (

        <div className="login-container">
            <h1>Welcome back! Time for a new creation!</h1>
            <Card title="Login" className="login-card">
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="username">Username</label>
                        <InputText
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="username"
                        />
                    </div>
                </div>
                <div className="p-fluid">

                    <div className="p-field">
                        <label htmlFor="password">Password</label>
                        <Password
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="password"
                            feedback={false}
                        />
                    </div>
                </div>
                <div className="p-fluid">

                    <Button label="Login" icon="pi pi-sign-in" onClick={handleLogin} className="p-button-primary" />
                </div>
                <div className="p-field">
                    <p>Don't have an account? <a href="/register">Register here</a></p>
                </div>
            </Card >
        </div >

    );
}

export default LoginPage;
