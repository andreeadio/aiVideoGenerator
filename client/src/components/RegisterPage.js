import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')

    const [success, setSuccess] = useState('')
    const navigate = useNavigate();
    //*to handle validations
    const [errors, setErrors] = useState({})
    const toast = useRef(null)

    const validate = () => {
        let tempErrors = {}
        let isValid = true

        if (!name) {
            tempErrors.name = 'This field is required!'
            isValid = false
        }
        if (!username) {
            tempErrors.username = 'This field is required!'
            isValid = false
        }
        if (!email) {
            tempErrors.email = 'Email is required!'
            isValid = false
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            tempErrors.email = 'Email is not valid!'
            isValid = false
        }
        if (!password) {
            tempErrors.password = 'Password is required!'
            isValid = false
        } else if (password.length < 8) {
            tempErrors.password = 'Password must be at least 8 characters!'
            isValid = false
        }
        if (password !== confirmPassword) {
            tempErrors.confirmPassword = 'Passwords do not match'
            isValid = false
        }

        setErrors(tempErrors)
        return isValid
    }


    const handleRegister = async () => {

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
            const response = await axios.post('http://localhost:8080/api/auth/register', {
                username,
                password,
                email,
                name,
                surname,
            });
            const { token } = response.data.token;
            localStorage.setItem('token', token);
            localStorage.setItem('username', response.data.username);
            setErrors({});
            setTimeout(() => {
                navigate('/generate');
            }, 2000);
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Registration failed!',
                life: 3000
            })
            console.error('Error registering user:', error);
        }
    };

    return (
        <div className="register-container">
            <Toast ref={toast} />
            <h1>Welcome new user, hope you enjoy the process!</h1>

            <Card title="Register" className="register-card">
                {errors.api && <p className="error-message">{errors.api}</p>}
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="name">First Name</label>
                        <InputText
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="first name"
                            required
                        />
                        {errors.name && <small className="p-error">{errors.name}</small>}
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
                        {errors.username && <small className="p-error">{errors.username}</small>}
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
                        {errors.email && <small className="p-error">{errors.email}</small>}
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
                    <div className="p-field">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <Password
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="password"
                            feedback={false}
                        />
                        {errors.confirmPassword && <small className="p-error">{errors.confirmPassword}</small>}
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


