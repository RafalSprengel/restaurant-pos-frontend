import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext.js';
import api from '../../utils/axios';
import '../../styles/personal-details.scss';
import { useFetch } from '../../hooks/useFetch.js';

const PersonalDetails = () => {
     //const { user, refetchUser } = useAuth();
     const { data: customer, loading: loadingFetchingCustomer, error: errorFetchingCustomer, refetch: refetchCustomerData } = useFetch('/customers/customer');
     const [details, setDetails] = useState({
          name: '',
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
          if (details.newPassword && details.newPassword !== details.confirmPassword) {
               setError('Passwords do not match.');
               return;
          }

          setIsLoading(true);
          setError('');
          setSuccess('');

          const dataToSent = {
               name: details.name,
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
                    setSuccess('Details updated successfully!');
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

     useEffect(() => {
          if (customer) {
               setDetails({
                    name: customer.name || '',
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
               <h4>Profile</h4>
               <form onSubmit={(e) => e.preventDefault()}>
                    {error && <p className="error">{error}</p>}
                    {success && <p className="success">{success}</p>}

                    <div className="form-group">
                         <label htmlFor="name">Name:</label>
                         {isEditing ? <input type="text" id="name" name="name" value={details.name} onChange={handleInputChange} /> : <p>{details.name}</p>}
                    </div>
                    <div className="form-group">
                         <label htmlFor="surname">Surname:</label>
                         {isEditing ? (
                              <input type="text" id="surname" name="surname" value={details.surname} onChange={handleInputChange} />
                         ) : (
                              <p>{details.surname}</p>
                         )}
                    </div>
                    <div className="form-group">
                         <label htmlFor="email">Email:</label>
                         {isEditing ? (
                              <input type="email" id="email" name="email" value={details.email} onChange={handleInputChange} />
                         ) : (
                              <p>{details.email}</p>
                         )}
                    </div>
                    <div className="form-group">
                         <label htmlFor="phone">Phone:</label>
                         {isEditing ? <input type="text" id="phone" name="phone" value={details.phone} onChange={handleInputChange} /> : <p>{details.phone}</p>}
                    </div>

                    {isEditing && !isEditingPassword && <a onClick={() => setIsEditingPassword(!isEditingPassword)}>Change password</a>}
                    {isEditing && isEditingPassword && (
                         <>
                              <div className="form-group">
                                   <label htmlFor="oldPassword">Old Password:</label>
                                   <input type="password" id="oldPassword" name="oldPassword" value={details.oldPassword} onChange={handleInputChange} />
                              </div>
                              <div className="form-group">
                                   <label htmlFor="newPassword">New Password:</label>
                                   <input type="password" id="newPassword" name="newPassword" value={details.newPassword} onChange={handleInputChange} />
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
                    <div className="form-group">
                         <label htmlFor="name">City:</label>
                         {isEditing ? <input type="text" id="city" name="city" value={details.city} onChange={handleInputChange} /> : <p>{details.city}</p>}
                    </div>
                    <div className="form-group">
                         <label htmlFor="street">Street:</label>
                         {isEditing ? (
                              <input type="text" id="street" name="street" value={details.street} onChange={handleInputChange} />
                         ) : (
                              <p>{details.street}</p>
                         )}
                    </div>
                    <div className="form-group">
                         <label htmlFor="houseNo">House number:</label>
                         {isEditing ? (
                              <input type="houseNo" id="houseNo" name="houseNo" value={details.houseNo} onChange={handleInputChange} />
                         ) : (
                              <p>{details.houseNo}</p>
                         )}
                    </div>
                    <div className="form-group">
                         <label htmlFor="flatNo">FlatNo:</label>
                         {isEditing ? (
                              <input type="text" id="flatNo" name="flatNo" value={details.flatNo} onChange={handleInputChange} />
                         ) : (
                              <p>{details.flatNo}</p>
                         )}
                    </div>
                    {isEditing ? (
                         <div className="actions">
                              <button type="button" onClick={handleSave} disabled={isLoading}>
                                   {isLoading ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                   type="button"
                                   onClick={() => {
                                        setIsEditing(false);
                                   }}>
                                   Cancel
                              </button>
                         </div>
                    ) : (
                         <button
                              type="button"
                              onClick={() => {
                                   setIsEditing(true);
                              }}>
                              Edit
                         </button>
                    )}
               </form>
          </div>
     );
};

export default PersonalDetails;
