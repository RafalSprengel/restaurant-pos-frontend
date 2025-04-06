import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/axios.js';
import '../../../styles/FormStyles.scss';

const AddCategory = () => {
     const [isLoading, setIsLoading] = useState(false);
     const [errorMessage, setErrorMessage] = useState('');
     const navigate = useNavigate();
     const [formData, setFormData] = useState({
          name: '',
          image: '',
          index: '',
     });

     const handleChange = (e) => {
          const { name, value, type, files } = e.target;

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
          setIsLoading(true);
          setErrorMessage(null);
          const formDataToSend = new FormData();
          formDataToSend.append('name', formData.name);
          formDataToSend.append('index', formData.index);
          formDataToSend.append('image', formData.image);

          try {
               const res = await api.post('/product-categories/', formDataToSend);
               if (res.status === 201) {
                    if (window.confirm('Category added successfully!')) {
                         navigate('/management/categories');
                    }
               } else {
                    setErrorMessage(`Failed to save category (${res.data.error})`);
               }
          } catch (e) {
               console.log(e);
               setErrorMessage(e.response?.data?.error || 'An error occurred');
          } finally {
               setIsLoading(false);
          }
     };

     return (
          <>
               <h3>Add a new category</h3>
               <form className="form-container" onSubmit={handleSubmit}>
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required disabled={isLoading} />
                    <label>Index:</label>
                    <input type="number" name="index" value={formData.index} onChange={handleChange} required disabled={isLoading} />
                    <label>Image:</label>
                    <input type="file" accept="image/*" name="image" onChange={handleChange} />
                    <button type="submit" disabled={isLoading}>
                         {isLoading ? 'Saving...' : 'Save Category'}
                    </button>
               </form>
          </>
     );
};

export default AddCategory;
