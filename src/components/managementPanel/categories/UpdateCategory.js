import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import api from '../../../utils/axios';
import {
     TextInput,
     NumberInput,
     FileInput,
     Button,
     Stack,
     Title,
     Notification,
} from '@mantine/core';
import { IconX } from '@tabler/icons-react';

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
               setIsLoading(true);
               const response = await api.get(`/product-categories/${id}`);
               if (response.status === 200) {
                    setFormData({
                         name: response.data.name || '',
                         index: response.data.index || '',
                         image: null,
                    });
               } else {
                    throw new Error('Failed to fetch category');
               }
          } catch (error) {
               console.error('Error: ' + (error.response ? error.response.data.error : error.message));
          } finally {
               setIsLoading(false);
          }
     };

     const handleChange = (field) => (value) => {
          setShowErrorAlert(false);
          setErrorMessage('');
          setFormData((prev) => ({
               ...prev,
               [field]: value,
          }));
     };

     const handleFileChange = (file) => {
          setShowErrorAlert(false);
          setErrorMessage('');
          setFormData((prev) => ({
               ...prev,
               image: file,
          }));
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          const formDataToSend = new FormData();
          formDataToSend.append('name', formData.name);
          formDataToSend.append('index', formData.index);
          if (formData.image) {
               formDataToSend.append('image', formData.image);
          }

          try {
               setIsLoading(true);
               const response = await api.put(`/product-categories/${id}`, formDataToSend);
               if (response.status === 200) {
                    navigate('/management/categories');
               } else {
                    setShowErrorAlert(true);
                    setErrorMessage(response.data.error || 'Failed to save the category.');
               }
          } catch (error) {
               setShowErrorAlert(true);
               setErrorMessage(error.response ? error.response.data.error : error.message || 'Failed to save the category.');
          } finally {
               setIsLoading(false);
          }
     };

     useEffect(() => {
          getCategory();
     }, []);

     return (
          <form onSubmit={handleSubmit} style={{ width:'100%', margin: '0 auto' }}>
               <Stack spacing="md" >
                    <Title order={2}>Update existing category</Title>

                    {showErrorAlert && (
                         <Notification
                              icon={<IconX size={18} />}
                              color="red"
                              onClose={() => setShowErrorAlert(false)}
                              title="Error"
                         >
                              {errorMessage}
                         </Notification>
                    )}

                    <TextInput
                         label="Name"
                         name="name"
                         value={formData.name}
                         onChange={(event) => handleChange('name')(event.currentTarget.value)}
                         disabled={!isEditable || isLoading}
                         required
                         fullWidth
                    />

                    <NumberInput
                         label="Index"
                         name="index"
                         value={formData.index}
                         onChange={handleChange('index')}
                         disabled={!isEditable || isLoading}
                         required
                         fullWidth
                    />

                    <FileInput
                         label="Image"
                         name="image"
                         onChange={handleFileChange}
                         disabled={!isEditable || isLoading}
                         accept="image/*"
                         placeholder="Upload category image"
                         clearable
                         fullWidth
                    />

                    {isEditable && (
                         <Button type="submit" loading={isLoading} disabled={isLoading}>
                              Save Category
                         </Button>
                    )}
               </Stack>
          </form>
     );
};

export default UpdateCategory;
