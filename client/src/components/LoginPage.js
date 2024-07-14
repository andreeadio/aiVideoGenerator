import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Card } from 'primereact/card';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './LoginPage.css';
import { Toast } from 'primereact/toast';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    //*to handle validations
    const [errors, setErrors] = useState({})
    const toast = useRef(null)

    const validate = () => {
        let tempErrors = {}
        let isValid = true

        if (!username) {
            tempErrors.username = 'This field is required!'
            isValid = false
        }
        if (!password) {
            tempErrors.password = 'Password is required!'
            isValid = false
        }

        setErrors(tempErrors)
        return isValid
    }

    const handleLogin = async () => {

        if (!validate()) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Form is not valid',
                life: 3000
            })
            return;
        }

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
            toast.current.show({
                severity: 'error',
                summary: 'Login Fail',
                detail: 'Invalide Credentials',
                life: 3000
            })
            return;
        }
    }


    return (

        <div className="login-container">
            <Toast ref={toast} />
            <h1>Welcome back! Time for a new creation!</h1>
            <Card title="Login" className="login-card">
                {errors.api && <p className="error-message">{errors.api}</p>}
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="username">Username</label>
                        <InputText
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="username"
                        />
                        {errors.username && <small className="p-error">{errors.username}</small>}
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
                        {errors.password && <small className="p-error">{errors.password}</small>}

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
