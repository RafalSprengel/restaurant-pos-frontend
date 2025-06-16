import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/axios.js';
import {
     Button,
     Checkbox,
     Group,
     Input,
     LoadingOverlay,
     Select,
     Stack,
     Textarea,
     Title,
     Text,
     Notification
} from '@mantine/core';

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
          setFormData((prev) => ({
               ...prev,
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
                    setErrorMessage(`Failed to load categories. (${response.data.error})`);
               }
          } catch (error) {
               setErrorMessage(`Connection error (${error.response?.data?.error || error.message})`);
          } finally {
               setIsLoading(false);
          }
     };

     useEffect(() => {
          getCategories();
     }, []);

     return (
          <div style={{ position: 'relative' }}>
               <LoadingOverlay visible={isLoading} overlayBlur={1} />
               {!isLoading && (
                    <form onSubmit={handleSubmit}>
                         <Stack spacing="md">
                              <Title order={2}>Add a New Product</Title>
                              {errorMessage && <Notification color="red">{errorMessage}</Notification>}

                              <Input.Wrapper label="Name" required>
                                   <Input name="name" value={formData.name} onChange={handleChange} required />
                              </Input.Wrapper>

                              <Textarea label="Description" name="desc" value={formData.desc} onChange={handleChange} />

                              <Input.Wrapper label="Price" required>
                                   <Input type="number" name="price" step="0.01" value={formData.price} onChange={handleChange} required />
                              </Input.Wrapper>

                              <Input.Wrapper label="Image URL">
                                   <Input name="image" value={formData.image} onChange={handleChange} />
                              </Input.Wrapper>

                              <Select
                                   label="Category"
                                   data={categories.map((c) => ({ value: c._id, label: c.name }))}
                                   name="category"
                                   value={formData.category}
                                   onChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                                   required
                              />

                              <Input.Wrapper label="Ingredients (comma-separated)">
                                   <Input name="ingredients" value={formData.ingredients} onChange={handleChange} />
                              </Input.Wrapper>

                              <Group>
                                   <Checkbox
                                        label="Is Featured"
                                        name="isFeatured"
                                        checked={formData.isFeatured}
                                        onChange={handleChange}
                                   />
                                   <Checkbox
                                        label="Is Vegetarian"
                                        name="isVegetarian"
                                        checked={formData.isVegetarian}
                                        onChange={handleChange}
                                   />
                                   <Checkbox
                                        label="Is Gluten-Free"
                                        name="isGlutenFree"
                                        checked={formData.isGlutenFree}
                                        onChange={handleChange}
                                   />
                                   <Checkbox
                                        label="Is Available"
                                        name="isAvailable"
                                        checked={formData.isAvailable}
                                        onChange={handleChange}
                                   />
                              </Group>

                              <Button type="submit">Save Product</Button>
                         </Stack>
                    </form>
               )}
          </div>
     );
};

export default AddProduct;
