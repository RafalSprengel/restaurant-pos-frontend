import React, { useState, useEffect } from 'react';
import '../../styles/AddUser.scss';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useFetch } from '../../hooks/useFetch';

import { useAuth } from '../../context/authContext';

export default function AddUser() {
    const { isAuthenticated } = useAuth();

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(null);
    const { data: roles } = useFetch('http://localhost:3001/api/getRoles');

    const [userData, setUserData] = useState({
        name: 'Rafal',
        surname: 'Sprengel',
        email: 'test@wp.pl',
        password: '12345',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    };
    const handleChangeRole = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('userData: ', userData);
        setErrorMessage(null);
        try {
            const response = await fetch('http://localhost:3001/api/auth/register-new-system-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            const res = await response.json();
            if (response.ok) {
                setUserData({
                    name: '',
                    surname: '',
                    email: '',
                    password: '',
                });
                navigate('/admin/users');
            } else {
                setErrorMessage(res.error);
            }
        } catch (error) {
            console.error('Error adding user:', error);
            setErrorMessage('Error adding user: ' + error);
        }
    };

    return (
        <div>
            <h4>Add User</h4>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <form className="add-user" onSubmit={handleSubmit}>
                <label>Name</label>
                <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                />
                <label>Surname</label>
                <input
                    type="text"
                    name="surname"
                    value={userData.surname}
                    onChange={handleChange}
                    placeholder="Surname"
                    required
                />
                <label>Email</label>
                <input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Email" />
                <label>Role</label>
                <select name="role" onChange={handleChangeRole}>
                    {roles?.map((role, index) => (
                        <option value={role} key={index}>
                            {role}
                        </option>
                    ))}
                </select>
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                />
                <button className="btn m-3" ype="submit">
                    Add User
                </button>
            </form>
        </div>
    );
}
