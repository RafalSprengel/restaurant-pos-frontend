import React, { useState, useEffect } from 'react';
import '../../../styles/AddUser.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useFetch } from '../../../hooks/useFetch';
import api from '../../../utils/axios';

export default function UpdateMgmt() {
    const { id } = useParams(); // Zakładając, że ID użytkownika jest w URL
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(null);
    const { data: roles=[]} = useFetch('http://localhost:3001/api/staff/roles');
    const [userData, setUserData] = useState({
        name: '',
        surname: '',
        email: '',
        role: '',
        password: '',
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get(`http://localhost:3001/api/staff/${id}`);
                setUserData(response.data);
            } catch (error) {
                setErrorMessage('Error fetching user data: ' + (error.response ? error.response.data.error : error.message));
            }
        };

        fetchUserData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null);
    
        try {
            const response = await api.put(`http://localhost:3001/api/staff/${id}`, userData);
    
            if (response.status === 200) {
                navigate('/management/mgnts/');
            } else {
                setErrorMessage(response.data.error);
            }
        } catch (error) {
            setErrorMessage('Error updating user: ' + (error.response ? error.response.data.error : error.message));
        }
    };

    return (
        <div>
            <h4>Update User</h4>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <form className="add-user" onSubmit={handleSubmit}>
                <label>Name</label>
                <input
                    type="text"
                    name="name"
                    value={userData.name || ''}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                />
                <label>Surname</label>
                <input
                    type="text"
                    name="surname"
                    value={userData.surname || ''}
                    onChange={handleChange}
                    placeholder="Surname"
                    required
                />
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={userData.email || ''}
                    onChange={handleChange}
                    placeholder="Email"
                />
                <label>Role</label>
                <select name="role" value={userData.role} onChange={handleChange}>
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
                    value={userData.password || ''}
                    onChange={handleChange}
                    placeholder="Password"
                />
                <button className="btn m-3" type="submit">
                    Update User
                </button>
            </form>
        </div>
    );
}
