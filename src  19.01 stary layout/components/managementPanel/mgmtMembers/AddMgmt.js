import React, { useState } from 'react';
import '../../../styles/AddUser.scss';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useFetch } from '../../../hooks/useFetch';
import api from '../../../utils/axios';

export default function AddUser() {
     const navigate = useNavigate();
     const [errorMessage, setErrorMessage] = useState(null);
     const { data: roles = [] } = useFetch('http://localhost:3001/api/staff/roles');

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
          setErrorMessage(null);

          try {
               const response = await api.post('auth/register/mgmt', userData);
               console.log('## response: ', response);
               if (response.status === 201) {
                    setUserData({
                         name: '',
                         surname: '',
                         email: '',
                         password: '',
                    });
                    navigate('/management/mgnts');
               } else {
                    setErrorMessage(response.data.error);
               }
          } catch (error) {
               console.error('Error adding user:', error);
               setErrorMessage('Error adding user: ' + (error.response ? error.response.data.error : error.message));
          }
     };

     return (
          <div>
               <h4>Add User</h4>
               {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
               <form className="add-user" onSubmit={handleSubmit}>
                    <label>Name</label>
                    <input type="text" name="name" value={userData.name} onChange={handleChange} placeholder="Name" required />
                    <label>Surname</label>
                    <input type="text" name="surname" value={userData.surname} onChange={handleChange} placeholder="Surname" required />
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
                    <input type="password" name="password" value={userData.password} onChange={handleChange} placeholder="Password" required />
                    <button className="btn m-3" ype="submit">
                         Add User
                    </button>
               </form>
          </div>
     );
}
