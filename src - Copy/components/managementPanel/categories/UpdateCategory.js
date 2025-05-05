import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import api from '../../../utils/axios';
import '../../../styles/form-styles.scss';

const UpdateCategory = () => {
     const { id } = useParams();
     const [isLoading, setIsLoading] = useState(false);
     const [showErrorAlert, setShowErrorAlert] = useState(false);
     const [errorMessage, setErrorMessage] = useState('');
     const navigate = useNavigate();
     const [formData, setFormData] = useState({
          name: '',
          index: '',
          image: null,
     });

     const { user } = useAuth('staff');
     const isEditable = ['admin', 'moderator'].includes(user.role);

     const getCategory = async () => {
          try {
               const response = await api.get(`/product-categories/${id}`);
               if (response.status === 200) {
                    setFormData(response.data);
               } else {
                    throw new Error('Failed to fetch category');
               }
          } catch (error) {
               console.error('Error: ' + (error.response ? error.response.data.error : error.message));
          }
     };

     const handleChange = (e) => {
          const { name, value, type, files } = e.target;
          setShowErrorAlert(false);
          setErrorMessage('');

          if (type === 'file') {
               setFormData({
                    ...formData,
                    image: files[0],
               });
          } else {
               setFormData({
                    ...formData,
                    [name]: value,
               });
          }
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          const formDataToSend = new FormData();
          formDataToSend.append('name', formData.name);
          formDataToSend.append('index', formData.index);
          formDataToSend.append('image', formData.image);

          try {
               const response = await api.put(`/product-categories/${id}`, formDataToSend);
               if (response.status === 200) {
                    alert('Category updated successfully!');
                    navigate('/management/categories');
               } else {
                    setShowErrorAlert(true);
                    setErrorMessage(response.data.error || 'Failed to save the category.');
               }
          } catch (error) {
               setShowErrorAlert(true);
               setErrorMessage(error.response ? error.response.data.error : error.message || 'Failed to save the category.');
          }
     };

     useEffect(() => {
          getCategory();
     }, []);

     return (
          <>
               <form className="form-container" onSubmit={handleSubmit}>
                    <h2>Update existing category</h2>
                    {showErrorAlert && <div className="alert alert-danger">{errorMessage}</div>}

                    <label>Name:</label>
                    <input name="name" type="text" value={formData.name} onChange={handleChange} disabled={!isEditable} />

                    <label>Index:</label>
                    <input name="index" type="number" value={formData.index} onChange={handleChange} disabled={!isEditable} />

                    <label>Image:</label>
                    <input name="image" type="file" onChange={handleChange} disabled={!isEditable} />

                    {isEditable && <button type="submit">Save Category</button>}
               </form>
          </>
     );
};

export default UpdateCategory;
