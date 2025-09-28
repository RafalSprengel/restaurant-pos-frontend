import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { TextInput, Textarea, Select, Checkbox, Loader } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import api from '../../../utils/axios.js';
import ErrorMessage from '../../ErrorMessage';
import './addProduct.scss';

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isSavingInProgress, setIsSavingInProgress] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      name: '',
      desc: '',
      price: '',
      image: '',
      category: '',
      ingredients: '',
      isFeatured: false,
      isVegetarian: false,
      isGlutenFree: false,
      isAvailable: true,
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'Product name is required'),
      price: (value) =>
        !isNaN(parseFloat(value)) && parseFloat(value) > 0
          ? null
          : 'Price must be a positive number',
      category: (value) => (value ? null : 'Category is required'),
    },
    validateInputOnBlur: true,
  });

  const getCategories = async () => {
    try {
      const response = await api.get('/product-categories');
      if (response.status === 200) setCategories(response.data);
      else setError(response.data?.error || 'Failed to load categories');
    } catch (e) {
      setError(e.response?.data?.error || 'Connection error');
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => { getCategories(); }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please use only images (jpeg, jpg, png, gif, webp).');
        setImageFile(null);
      } else {
        setError('');
        setImageFile(file);
      }
    }
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('desc', values.desc);
    formData.append('price', parseFloat(values.price));
    formData.append('category', values.category);
    formData.append('ingredients', values.ingredients.split(',').map(i => i.trim()));
    formData.append('isFeatured', values.isFeatured);
    formData.append('isVegetarian', values.isVegetarian);
    formData.append('isGlutenFree', values.isGlutenFree);
    formData.append('isAvailable', values.isAvailable);
    if (imageFile) formData.append('image', imageFile);

    setIsSavingInProgress(true);
    setError('');
    try {
      const response = await api.post('/products/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (response.status === 201) {
        showNotification({
          title: 'Success',
          message: 'Product added successfully!',
          color: 'green',
          icon: <IconCheck />,
        });
        setTimeout(() => navigate('/management/products'), 1000);
      } else {
        setError(response.data?.error || 'Failed to save product');
      }
    } catch (e) {
      setError(e.response?.data?.error || 'An error occurred while saving the product');
    } finally {
      setIsSavingInProgress(false);
    }
  };

  if (loadingCategories)
    return (
      <div className="add-product__loading">
        <Loader size="sm" variant="dots" /> &nbsp;
        <span>Loading...</span>
      </div>
    );

  return (
    <div className="add-product">
      <div className="add-product__title">Add New Product</div>
      <form className="add-product-form" onSubmit={form.onSubmit(handleSubmit)}>
        {error && <ErrorMessage message={error} />}

        <TextInput
          label="Name"
          placeholder="Product Name"
          {...form.getInputProps('name')}
          onChange={(e) => {
            form.getInputProps('name').onChange(e);
            if (error) setError('');
          }}
          classNames={{
            root: 'add-product-form__field',
            input: `add-product-form__input ${form.errors.name ? 'add-product-form__input--error' : ''}`,
            label: 'add-product-form__label',
          }}
        />

        <Textarea
          label="Description"
          placeholder="Product description"
          {...form.getInputProps('desc')}
          classNames={{
            root: 'add-product-form__field',
            input: 'add-product-form__input',
            label: 'add-product-form__label',
          }}
        />

        <TextInput
          label="Price"
          placeholder="0.00"
          type="number"
          step="0.01"
          {...form.getInputProps('price')}
          classNames={{
            root: 'add-product-form__field',
            input: `add-product-form__input ${form.errors.price ? 'add-product-form__input--error' : ''}`,
            label: 'add-product-form__label',
          }}
        />

        <div className="add-product-form__field">
          <label className="add-product-form__label" htmlFor="image">Image:</label>
          <input id="image" type="file" accept="image/*" onChange={handleFileChange} className="add-product-form__input add-product-form__input--file" />
        </div>

        <Select
          label="Category"
          placeholder="Select category"
          data={(categories.categories || []).map(c => ({ value: c._id, label: c.name }))}
          {...form.getInputProps('category')}
          classNames={{
            root: 'add-product-form__field',
            input: `add-product-form__input ${form.errors.category ? 'add-product-form__input--error' : ''}`,
            label: 'add-product-form__label',
          }}
        />

        <TextInput
          label="Ingredients (comma-separated)"
          placeholder="ingredient1, ingredient2"
          {...form.getInputProps('ingredients')}
          classNames={{
            root: 'add-product-form__field',
            input: 'add-product-form__input',
            label: 'add-product-form__label',
          }}
        />

        <Checkbox label="Is Featured" {...form.getInputProps('isFeatured', { type: 'checkbox' })} classNames={{ root: 'add-product-form__field' }} />
        <Checkbox label="Is Vegetarian" {...form.getInputProps('isVegetarian', { type: 'checkbox' })} classNames={{ root: 'add-product-form__field' }} />
        <Checkbox label="Is Gluten-Free" {...form.getInputProps('isGlutenFree', { type: 'checkbox' })} classNames={{ root: 'add-product-form__field' }} />
        <Checkbox label="Is Available" {...form.getInputProps('isAvailable', { type: 'checkbox' })} classNames={{ root: 'add-product-form__field' }} />

        <div className="buttons-group">
          <button type="submit" className="button-panel" disabled={isSavingInProgress || (error && error.toLowerCase().includes('rights'))}>
            {isSavingInProgress ? 'Saving...' : 'Save Product'}
          </button>
          <button type="button" className="button-panel" onClick={() => navigate('/management/products')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
