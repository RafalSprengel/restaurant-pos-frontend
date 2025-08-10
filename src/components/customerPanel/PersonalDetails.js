import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/authContext.js';
import { Text, Divider, Space } from '@mantine/core';
import '@mantine/notifications/styles.css';
import { notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { modals } from '@mantine/modals';
import api from '../../utils/axios';
import '../../styles/personal-details.scss';
import { useFetch } from '../../hooks/useFetch.js';
import { Alert } from '@mantine/core';
import { IconXboxX } from '@tabler/icons-react';
import axios from 'axios';


const PersonalDetails = () => {
     const navigate = useNavigate();
     const { data: customer, loading: loadingFetchingCustomer, error: errorFetchingCustomer, refetch: refetchCustomerData } = useFetch('/customers/customer');
     const [details, setDetails] = useState({
          firstName: '',
          surname: '',
          email: '',
          phone: '',
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
          city: '',
          street: '',
          houseNo: '',
          flatNo: '',
     });
     const [isEditing, setIsEditing] = useState(false);
     const [isEditingPassword, setIsEditingPassword] = useState(false);
     const [errorPassword, setErrorPassword] = useState('');
     const [error, setError] = useState('');
     const [isLoading, setIsLoading] = useState(false);
     const { logout } = useAuth();

     const handleInputChange = (e) => {
          const { name, value } = e.target;
          let newValue = value;

          if (name === 'phone') {
               newValue = value.replace(/[^\d+]/g, '');
               if (newValue.startsWith('+')) {
                    newValue = '+' + newValue.slice(1).replace(/\+/g, '');
               } else {
                    newValue = newValue.replace(/\+/g, '');
               }
          }

          setDetails((prevDetails) => ({
               ...prevDetails,
               [name]: newValue,
          }));
     };

     const handleUpdateProfile = async () => {
          if (details.newPassword && details.newPassword !== details.confirmPassword) {
               setErrorPassword('`New Password` and `Confirm Password` do not match.');
               return;
          }

          setIsLoading(true);
          setError('');
          setErrorPassword('');

          const dataToSent = {
               firstName: details.firstName,
               surname: details.surname,
               email: details.email,
               phone: details.phone,
               newPassword: details.newPassword,
               address: {
                    city: details.city,
                    street: details.street,
                    houseNo: details.houseNo,
                    flatNo: details.flatNo,
               },
          };

          try {
               const response = await api.put(`/customers/customer`, dataToSent);

               if (response.status === 200) {
                    notifications.show({
                         title: 'Success',
                         message: 'Profile updated successfully!',
                         color: 'green',
                    });
                    setIsEditing(false);
                    refetchCustomerData();
               } else {
                    throw new Error(response.data.error || 'Failed to update details.');
               }
          } catch (error) {
               setError(error.response?.data?.error || error.message);
          } finally {
               setIsLoading(false);
          }
     };

     const handleUpdatePassword = async () => {
          if (details.newPassword && details.newPassword !== details.confirmPassword) {
               setErrorPassword('`New Password` and `Confirm Password` do not match.');
               return;
          }

          setIsLoading(true);
          setError('');
          setErrorPassword('')

          const dataToSent = {
               oldPassword: details.oldPassword,
               newPassword: details.newPassword,
          };

          try {
               const response = await api.put(`/customers/customer/update-password`, dataToSent);

               if (response.status === 200) {
                    notifications.show({
                         title: 'Success',
                         message: 'Password updated successfully!',
                         color: 'green',
                    });
                    setIsEditingPassword(false);
               } else {
                    throw new Error(response.data.error || 'Failed to update password.');
               }
          } catch (error) {
               setErrorPassword(error.response?.data?.error || error.message);
          } finally {
               setIsLoading(false);
          }
     };

     const deleteUserAccount = async () => {
          try {
               const response = await api.delete('/customers/customer/');
               if (response) handleLogout()
          } catch (err) {
               setError(err.response?.data.message || err.message)
          }
     }

     const openDeletingAccountConfirmModal = () => modals.openConfirmModal({
          title: 'Do you really want to delete your account?',
          children: (
               <Text size="sm">
                    Once when you delete your accoun there will be no way back ro recover your data.
               </Text>
          ),
          labels: { confirm: 'Delete my account', cancel: 'Cancel' },
          onCancel: () => console.log('Cancel'),
          onConfirm: deleteUserAccount,
     });

     const handleLogout = async () => {
          try {
               // await api.post('/auth/logout');
               logout();
               navigate('/customer/login', { replace: true });
          } catch (error) {
               console.error('Logout failed:', error.message);
          }
     };

     useEffect(() => {
          if (customer) {
               setDetails({
                    firstName: customer.firstName || '',
                    surname: customer.surname || '',
                    email: customer.email || '',
                    phone: customer.phone || '',
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                    city: customer.address.city || '',
                    street: customer.address.street || '',
                    houseNo: customer.address.houseNo || '',
                    flatNo: customer.address.flatNo,
               });
          }
     }, [customer]);

     return (
          <div className="personal-details">
               <h5 className="personal-details__title">Profile</h5>
               <form className="personal-details__form" onSubmit={(e) => e.preventDefault()}>
                    {error && (
                         <Alert
                              variant="light"
                              color="red"
                              radius="md"
                              title={error}
                              icon={<IconXboxX />}
                              style={{ marginBottom: 16 }}
                         />
                    )}

                    <div className="personal-details__group">
                         <label className="personal-details__label" htmlFor="firstName">First name:</label>
                         {isEditing ? <input className="personal-details__input" type="text" id="firstName" name="firstName" value={details.firstName} onChange={handleInputChange} /> : <p className="personal-details__value">{details.firstName}</p>}
                    </div>
                    <div className="personal-details__group">
                         <label className="personal-details__label" htmlFor="surname">Surname:</label>
                         {isEditing ? (
                              <input className="personal-details__input" type="text" id="surname" name="surname" value={details.surname} onChange={handleInputChange} />
                         ) : (
                              <p className="personal-details__value">{details.surname}</p>
                         )}
                    </div>
                    <div className="personal-details__group">
                         <label className="personal-details__label" htmlFor="email">Email:</label>
                         {isEditing ? (
                              <input className="personal-details__input" type="email" id="email" name="email" value={details.email} onChange={handleInputChange} />
                         ) : (
                              <p className="personal-details__value">{details.email}</p>
                         )}
                    </div>
                    <div className="personal-details__group">
                         <label className="personal-details__label" htmlFor="phone">Phone:</label>
                         {isEditing ? <input className="personal-details__input" type="text" id="phone" name="phone" value={details.phone} onChange={handleInputChange} /> : <p className="personal-details__value">{details.phone}</p>}
                    </div>

                    <div className="personal-details__group">
                         <label className="personal-details__label" htmlFor="city">City:</label>
                         {isEditing ? <input className="personal-details__input" type="text" id="city" name="city" value={details.city} onChange={handleInputChange} /> : <p className="personal-details__value">{details.city}</p>}
                    </div>
                    <div className="personal-details__group">
                         <label className="personal-details__label" htmlFor="street">Street:</label>
                         {isEditing ? (
                              <input className="personal-details__input" type="text" id="street" name="street" value={details.street} onChange={handleInputChange} />
                         ) : (
                              <p className="personal-details__value">{details.street}</p>
                         )}
                    </div>
                    <div className="personal-details__group">
                         <label className="personal-details__label" htmlFor="houseNo">House number:</label>
                         {isEditing ? (
                              <input className="personal-details__input" type="houseNo" id="houseNo" name="houseNo" value={details.houseNo} onChange={handleInputChange} />
                         ) : (
                              <p className="personal-details__value">{details.houseNo}</p>
                         )}
                    </div>
                    <div className="personal-details__group">
                         <label className="personal-details__label" htmlFor="flatNo">FlatNo:</label>
                         {isEditing ? (
                              <input className="personal-details__input" type="text" id="flatNo" name="flatNo" value={details.flatNo} onChange={handleInputChange} />
                         ) : (
                              <p className="personal-details__value">{details.flatNo}</p>
                         )}
                    </div>
                    {isEditing ? (
                         <div className="personal-details__actions">
                              <button className="personal-details__actions-btn" type="button" onClick={handleUpdateProfile} disabled={isLoading}>
                                   {isLoading ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                   className="personal-details__actions-btn"
                                   type="button"
                                   onClick={() => {
                                        setIsEditing(false);
                                   }}>
                                   Cancel
                              </button>
                         </div>
                    ) : (
                         <button
                              className="personal-details__edit-btn"
                              type="button"
                              onClick={() => {
                                   setIsEditing(true);
                              }}>
                              Edit
                         </button>
                    )}
               </form>



               <div className={`personal-details__password-update ${isEditingPassword ? 'personal-details__password-update--open' : ''}`}>
                    <div>{errorPassword && <Alert variant="light" color="red" radius="md" title={errorPassword} icon={<IconXboxX />}></Alert>}</div>
                    <div className="personal-details__group">
                         <label className="personal-details__label" htmlFor="oldPassword">Old Password:</label>
                         <input className="personal-details__input" type="password" id="oldPassword" name="oldPassword" value={details.oldPassword} onChange={handleInputChange} />
                    </div>
                    <div className="personal-details__group">
                         <label className="personal-details__label" htmlFor="newPassword">New Password:</label>
                         <input className="personal-details__input" type="password" id="newPassword" name="newPassword" value={details.newPassword} onChange={handleInputChange} />
                    </div>
                    <div className="personal-details__group">
                         <label className="personal-details__label" htmlFor="confirmPassword">Confirm Password:</label>
                         <input
                              className="personal-details__input"
                              type="password"
                              id="confirmPassword"
                              name="confirmPassword"
                              value={details.confirmPassword}
                              onChange={handleInputChange}
                         />
                    </div>
                    <span className="personal-details__actions">
                         <button className="personal-details__actions-btn" type="button" onClick={handleUpdatePassword} disabled={isLoading}>
                              {isLoading ? 'Saving...' : 'Update'}
                         </button>
                         <button
                              className="personal-details__actions-btn"
                              type="button"
                              onClick={() => {
                                   setIsEditingPassword(false);
                              }}>
                              Cancel
                         </button>

                    </span>
               </div>
               <Divider my="lg" />
               {!isEditingPassword && (
                    <div
                         className="personal-details__change-password personal-details__link"
                         onClick={() => {
                              setIsEditingPassword(!isEditingPassword);
                              setTimeout(() => {
                                   window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                              }, 300);
                         }}>
                         Change Password
                    </div>
               )}

               <div
                    className="personal-details__delete-account personal-details__link"
                    onClick={openDeletingAccountConfirmModal}
               >
                    Delete account
               </div>
          </div >
     );
};

export default PersonalDetails;
