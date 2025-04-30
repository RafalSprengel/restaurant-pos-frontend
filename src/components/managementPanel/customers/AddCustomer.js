import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import api from '../../../utils/axios';
import '../../../styles/update-customer.scss';

const AddCustomer = () => {
     const [formData, setFormData] = useState({
          name: '',
          surname: '',
          email: '',
          phone: '',
          password: '',
     });
     const [isLoading, setIsLoading] = useState(false);
     const [errorMessage, setErrorMessage] = useState('');
     const navigate = useNavigate();
     const { user } = useAuth('staff');

     const isEditable = ['admin', 'moderator'].includes(user.role);

     const handleChange = (e) => {
          const { name, value } = e.target;
          setErrorMessage('');
          setFormData({
               ...formData,
               [name]: value,
          });
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          setIsLoading(true);

          try {
               const response = await api.post('/auth/register/customer/', formData);
               if (response.status === 201) {
                    alert('Customer added successfully!');
                    navigate('/management/customers');
               } else {
                    throw new Error(response.data.error || 'Failed to add customer.');
               }
          } catch (error) {
               setErrorMessage(error.response?.data?.error || error.message);
          } finally {
               setIsLoading(false);
          }
     };

     return (
          <>
               <form className="customer-form" onSubmit={handleSubmit}>
                    <h2>Add Customer</h2>
                    {errorMessage && <div className="error-alert">{errorMessage}</div>}

                    <label>Name:</label>
                    <input name="name" type="text" value={formData.name} onChange={handleChange} disabled={!isEditable} />

                    <label>Surname:</label>
                    <input name="surname" type="text" value={formData.surname} onChange={handleChange} disabled={!isEditable} />

                    <label>Email:</label>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} disabled={!isEditable} />

                    <label>Phone:</label>
                    <input
                         name="phone"
                         type="text"
                         value={formData.phone}
                         onChange={handleChange}
                         disabled={!isEditable}
                         pattern="^\+?[0-9\s\-\(\)]*$"
                         title="Phone number can contain only numbers, spaces, '-', '(', ')' and '+'"
                    />

                    <label>Password:</label>
                    <input name="password" type="text" value={formData.password} onChange={handleChange} disabled={!isEditable} />

                    {isEditable && (
                         <button type="submit" disabled={isLoading}>
                              Add Customer
                         </button>
                    )}
               </form>
          </>
     );
};

export default AddCustomer;
