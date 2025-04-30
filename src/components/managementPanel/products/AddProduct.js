import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/axios.js';
import '../../../styles/add-product.scss';

const AddProduct = () => {
     const [categories, setCategories] = useState([]);
     const [isLoading, setIsLoading] = useState(true);
     const [errorMessage, setErrorMessage] = useState('');
     const [formData, setFormData] = useState({
          name: '',
          desc: '',
          price: '',
          image: '',
          category: '',
          isFeatured: false,
          ingredients: '',
          isVegetarian: false,
          isGlutenFree: false,
          isAvailable: true,
     });

     const navigate = useNavigate();

     const handleChange = (e) => {
          const { name, value, type, checked } = e.target;
          setFormData((prevFormData) => ({
               ...prevFormData,
               [name]: type === 'checkbox' ? checked : value,
          }));
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          const dataToSend = {
               ...formData,
               price: parseFloat(formData.price),
               ingredients: formData.ingredients.split(',').map((item) => item.trim()),
               category: formData.category,
          };
          try {
               const response = await api.post('/products/', JSON.stringify(dataToSend));
               if (response.status === 201) {
                    if (window.confirm('Product added successfully!')) {
                         navigate(-1);
                    }
               } else {
                    setErrorMessage(`Failed to save the product (${response.data.error})`);
               }
          } catch (e) {
               console.error(e.response?.data?.error || e.message);
               setErrorMessage(`Error while saving... (${e.response?.data?.error || e.message})`);
          }
     };

     const getCategories = async () => {
          try {
               setErrorMessage(null);
               const response = await api.get('/product-categories');

               if (response.status === 200) {
                    setCategories(response.data);
               } else {
                    setErrorMessage(`Failed to load categories. Please try again later (${response.data.error})`);
               }
          } catch (error) {
               console.error(error);
               setErrorMessage(`Connection error (${error.response?.data?.error || error.message})`);
          } finally {
               setIsLoading(false);
          }
     };

     useEffect(() => {
          getCategories();
     }, []);

     return (
          <>
               {isLoading && <div>Loading...</div>}
               {!isLoading && (
                    <form className="menu-item-form" onSubmit={handleSubmit}>
                         <h2>Add a New Product</h2>
                         {errorMessage && <p className="error">{errorMessage}</p>}
                         <label>Name:</label>
                         <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                         <label>Description:</label>
                         <textarea name="desc" value={formData.desc} onChange={handleChange} />

                         <label>Price:</label>
                         <input type="number" name="price" step="0.01" value={formData.price} onChange={handleChange} required />

                         <label>Image URL:</label>
                         <input type="text" name="image" value={formData.image} onChange={handleChange} />

                         <label>Category:</label>
                         <select name="category" value={formData.category} onChange={handleChange} required>
                              <option value="">Select a category</option>
                              {categories.map((category) => (
                                   <option key={category._id} value={category._id}>
                                        {category.name}
                                   </option>
                              ))}
                         </select>

                         <label>
                              <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />
                              Is Featured
                         </label>

                         <label>Ingredients (comma-separated):</label>
                         <input type="text" name="ingredients" value={formData.ingredients} onChange={handleChange} />

                         <label>
                              <input type="checkbox" name="isVegetarian" checked={formData.isVegetarian} onChange={handleChange} />
                              Is Vegetarian
                         </label>

                         <label>
                              <input type="checkbox" name="isGlutenFree" checked={formData.isGlutenFree} onChange={handleChange} />
                              Is Gluten-Free
                         </label>

                         <label>
                              <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} />
                              Is Available
                         </label>

                         <button type="submit">Save Product</button>
                    </form>
               )}
          </>
     );
};

export default AddProduct;
