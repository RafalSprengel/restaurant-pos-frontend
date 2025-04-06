import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../../context/authContext';
import api from '../../../utils/axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateProduct = () => {
     const { id } = useParams();
     const [categories, setCategories] = useState([]);
     const [product, setProduct] = useState({});
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
     const [message, setMessage] = useState('');
     const [showSuccessModal, setShowSuccessModal] = useState(false);
     const [showErrorAlert, setShowErrorAlert] = useState(false);
     const [errorMessage, setErrorMessage] = useState('');
     const navigate = useNavigate();
     const { user } = useAuth('staff');

     const isEditable = ['admin', 'moderator'].includes(user.role);

     const getProduct = async () => {
          try {
               const response = await api.get(`/products/${id}`);
               if (response.status === 200) {
                    setProduct(response.data);
               } else {
                    throw new Error('Failed to fetch product data');
               }
          } catch (error) {
               console.error('Error fetching product:', error);
               setErrorMessage('Failed to fetch product data. Please try again later.');
               setShowErrorAlert(true);
          }
     };

     useEffect(() => {
          getProduct();
     }, [id]);

     useEffect(() => {
          if (product) {
               setFormData({
                    name: product.name || '',
                    desc: product.desc || '',
                    price: product.price || '',
                    image: product.image || '',
                    category: product.category || '',
                    isFeatured: product.isFeatured || false,
                    ingredients: product.ingredients ? product.ingredients.join(', ') : '',
                    isVegetarian: product.isVegetarian || false,
                    isGlutenFree: product.isGlutenFree || false,
                    isAvailable: product.isAvailable || true,
               });
          }
     }, [product]);

     const handleChange = (e) => {
          const { name, value, type, checked } = e.target;
          setFormData({
               ...formData,
               [name]: type === 'checkbox' ? checked : value,
          });
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          const ingredientsArray = formData.ingredients
               ? formData.ingredients
                      .split(',')
                      .map((item) => item.trim())
                      .filter(Boolean)
               : [];
          const dataToSend = {
               ...formData,
               price: parseFloat(formData.price),
               ingredients: ingredientsArray,
               category: formData.category,
          };

          try {
               const response = await api.put(`/products/${id}`, dataToSend);
               if (response.status === 200) {
                    setMessage('Product updated successfully!');
                    setShowSuccessModal(true);
               } else {
                    console.error('Server error:', response.data.error);
                    setErrorMessage('Failed to update product. Please check your input and try again.');
                    setShowErrorAlert(true);
               }
          } catch (error) {
               console.error('Error saving product:', error);
               setErrorMessage('Error saving product. Please try again later.');
               setShowErrorAlert(true);
          }
     };

     const getCategories = async () => {
          try {
               const response = await api.get('/product-categories/');
               if (response.status === 200) {
                    setCategories(response.data);
               } else {
                    throw new Error('Failed to fetch categories');
               }
          } catch (error) {
               console.error('Error fetching categories:', error);
               alert('Failed to get categories. Please try again later.');
          }
     };

     useEffect(() => {
          getCategories();
     }, []);

     const handleCloseSuccessModal = () => {
          setShowSuccessModal(false);
          setTimeout(() => {
               navigate(-1);
          }, 500);
     };

     return (
          <>
               <form className="menu-item-form" onSubmit={handleSubmit}>
                    <h2>Update existing product</h2>

                    {showErrorAlert && <Alert variant="danger">{errorMessage}</Alert>}

                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required disabled={!isEditable} />

                    <label>Description:</label>
                    <textarea name="desc" value={formData.desc} onChange={handleChange} disabled={!isEditable} />

                    <label>Price:</label>
                    <input type="number" name="price" step="0.01" value={formData.price} onChange={handleChange} required disabled={!isEditable} />

                    <label>Image URL:</label>
                    <input type="text" name="image" value={formData.image} onChange={handleChange} disabled={!isEditable} />

                    <label>Category:</label>
                    <select name="category" value={formData.category} onChange={handleChange} required disabled={!isEditable}>
                         <option value="">Select a category</option>
                         {categories.map((category) => (
                              <option key={category._id} value={category._id}>
                                   {category.name}
                              </option>
                         ))}
                    </select>

                    <label>
                         <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} disabled={!isEditable} />
                         Is Featured
                    </label>

                    <label>Ingredients (comma-separated):</label>
                    <input type="text" name="ingredients" value={formData.ingredients} onChange={handleChange} disabled={!isEditable} />

                    <label>
                         <input type="checkbox" name="isVegetarian" checked={formData.isVegetarian} onChange={handleChange} disabled={!isEditable} />
                         Is Vegetarian
                    </label>

                    <label>
                         <input type="checkbox" name="isGlutenFree" checked={formData.isGlutenFree} onChange={handleChange} disabled={!isEditable} />
                         Is Gluten-Free
                    </label>

                    <label>
                         <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} disabled={!isEditable} />
                         Is Available
                    </label>

                    {isEditable && <button type="submit">Save Menu Item</button>}
               </form>

               <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
                    <Modal.Header closeButton>
                         <Modal.Title>Success</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{message}</Modal.Body>
                    <Modal.Footer>
                         <Button variant="secondary" onClick={handleCloseSuccessModal}>
                              OK
                         </Button>
                    </Modal.Footer>
               </Modal>
          </>
     );
};

export default UpdateProduct;
