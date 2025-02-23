import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext.js';
import api from '../../utils/axios';
import '../../styles/PersonalDetails.scss';

const PersonalDetails = () => {
    const { user, refetchUser } = useAuth();
    const [details, setDetails] = useState({ name: '', surname: '', email: '', phone: '', oldPassword: '', newPassword: '', confirmPassword: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        // Check if new password and confirm password match
        if (details.newPassword && details.newPassword !== details.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const { confirmPassword, ...updatedDetails } = details; // Don't send confirmPassword to the backend
            const response = await api.put(`/customers/`, updatedDetails);

            if (response.status === 200) {
                setSuccess('Details updated successfully!');
                setIsEditing(false);

                // Optionally refresh user data from backend
                refetchUser();
            } else {
                throw new Error(response.data.error || 'Failed to update details.');
            }
        } catch (error) {
            setError(error.response?.data?.error || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            setDetails({
                name: user.name || '',
                surname: user.surname || '',
                email: user.email || '',
                phone: user.phone || '',
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
    }, [user]);

    return (
        <div className="personal-details">
            <h4>Personal Details</h4>
            <form onSubmit={(e) => e.preventDefault()}>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={details.name}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <p>{details.name}</p>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="surname">Surname:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            id="surname"
                            name="surname"
                            value={details.surname}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <p>{details.surname}</p>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    {isEditing ? (
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={details.email}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <p>{details.email}</p>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={details.phone}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <p>{details.phone}</p>
                    )}
                </div>
                {isEditing && !isEditingPassword && <a onClick={()=>setIsEditingPassword(!isEditingPassword)}>Edit password</a>}
                {isEditing && isEditingPassword &&  (
                    <>
                        <div className="form-group">
                            <label htmlFor="oldPassword">Old Password:</label>
                            <input
                                type="password"
                                id="oldPassword"
                                name="oldPassword"
                                value={details.oldPassword}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password:</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={details.newPassword}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={details.confirmPassword}
                                onChange={handleInputChange}
                            />
                        </div>
                    </>
                )}
                {isEditing ? (
                    <div className="actions">
                        <button type="button" onClick={handleSave} disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                        <button type="button" onClick={() => {setIsEditing(false); setIsEditingPassword(false)}}>
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button type="button" onClick={() => setIsEditing(true)}>
                        Edit
                    </button>
                )}
            </form>
        </div>
    );
};

export default PersonalDetails;
