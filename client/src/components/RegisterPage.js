import React, { useState } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Card } from 'primereact/card';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', {
                username,
                password,
                email,
                name,
                surname,
            });
            setSuccess('User registered successfully!');
            setError('');
            setTimeout(() => {
                navigate('/generate');
            }, 2000);
        } catch (error) {
            setError('Error registering user. Please try again.');
            setSuccess('');
            console.error('Error registering user:', error);
        }
    };

    return (
        <div className="register-container">

            <h1>Welcome new user, hope you enjoy the process!</h1>

            <Card title="Register" className="register-card">
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="name">First Name</label>
                        <InputText
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="first name"
                        />
                    </div>
                </div>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="surname">Last Name</label>
                        <InputText
                            id="surname"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            placeholder="last name"
                        />
                    </div>
                </div>
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
                        <label htmlFor="email">Email</label>
                        <InputText
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email"
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
                    <Button label="Register" icon="pi pi-user-plus" onClick={handleRegister} className="p-button-primary" />
                </div>
            </Card>
        </div>
    );
}

export default RegisterPage;
