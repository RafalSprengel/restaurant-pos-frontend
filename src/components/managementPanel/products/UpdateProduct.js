import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import api from '../../../utils/axios';
import {
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Checkbox,
  Button,
  Container,
  Stack,
  Group,
  Modal,
  Alert,
  Title,
  Loader,
} from '@mantine/core';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';

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
      ? formData.ingredients.split(',').map((item) => item.trim()).filter(Boolean)
      : [];
    const dataToSend = {
      ...formData,
      price: parseFloat(formData.price),
      ingredients: ingredientsArray,
    };

    try {
      const response = await api.put(`/products/${id}`, dataToSend);
      if (response.status === 200) {
        setMessage('Product updated successfully!');
        setShowSuccessModal(true);
      } else {
        setErrorMessage('Failed to update product. Please check your input and try again.');
        setShowErrorAlert(true);
      }
    } catch (error) {
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
    <Container size="sm" mt="xl" w='100%'>
      <form onSubmit={handleSubmit}>
        <Stack>
          <Title order={3}>Update Existing Product</Title>

          {showErrorAlert && (
            <Alert icon={<IconAlertCircle size={16} />} color="red">
              {errorMessage}
            </Alert>
          )}

          <TextInput
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditable}
            required
          />

          <Textarea
            label="Description"
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            disabled={!isEditable}
          />

          <NumberInput
            label="Price"
            name="price"
            value={parseFloat(formData.price)}
            onChange={(value) => setFormData({ ...formData, price: value })}
            disabled={!isEditable}
            step={0.01}
            precision={2}
            required
          />

          <TextInput
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={handleChange}
            disabled={!isEditable}
          />

          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={(value) => setFormData({ ...formData, category: value })}
            disabled={!isEditable}
            data={categories.map((cat) => ({
              value: cat._id,
              label: cat.name,
            }))}
            placeholder="Select a category"
            required
          />

          <TextInput
            label="Ingredients (comma-separated)"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            disabled={!isEditable}
          />

          <Checkbox
            label="Is Featured"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
            disabled={!isEditable}
          />

          <Checkbox
            label="Is Vegetarian"
            name="isVegetarian"
            checked={formData.isVegetarian}
            onChange={handleChange}
            disabled={!isEditable}
          />

          <Checkbox
            label="Is Gluten-Free"
            name="isGlutenFree"
            checked={formData.isGlutenFree}
            onChange={handleChange}
            disabled={!isEditable}
          />

          <Checkbox
            label="Is Available"
            name="isAvailable"
            checked={formData.isAvailable}
            onChange={handleChange}
            disabled={!isEditable}
          />

          {isEditable && (
            <Group justify="flex-end">
              <Button type="submit">Save Menu Item</Button>
            </Group>
          )}
        </Stack>
      </form>

      <Modal
        opened={showSuccessModal}
        onClose={handleCloseSuccessModal}
        title="Success!"
        centered
      >
        <Group direction="column" align="center" spacing="md">
          <IconCheck size={48} color="green" />
          <p>{message}</p>
          <Button onClick={handleCloseSuccessModal}>OK</Button>
        </Group>
      </Modal>
    </Container>
  );
};

export default UpdateProduct;
