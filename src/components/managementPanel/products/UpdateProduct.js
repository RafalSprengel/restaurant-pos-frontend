import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import api from '../../../utils/axios';
import './updateProduct.scss';
import { NumberInput, Select, Checkbox, Button, Modal, Alert } from '@mantine/core';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { useForm } from '@mantine/form';

const UpdateProduct = () => {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth('staff');
  const isEditable = ['admin', 'moderator'].includes(user.role);

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
      name: (v) => (v.trim() ? null : 'Name is required'),
      desc: (v) => (v.trim() ? null : 'Description is required'),
      price: (v) => (v && parseFloat(v) > 0 ? null : 'Price must be a positive number'),
      image: (v) => (v.trim() ? null : 'Image URL is required'),
      category: (v) => (v ? null : 'Category is required'),
    },
    validateInputOnBlur: true,
    validateInputOnChange: true,
  });

  const getProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      if (res.status === 200) setProduct(res.data);
    } catch {
      setErrorMessage('Failed to fetch product data');
      setShowErrorAlert(true);
    }
  };

  const getCategories = async () => {
    try {
      const res = await api.get('/product-categories/');
      if (res.status === 200) setCategories(res.data);
    } catch {
      alert('Failed to load categories');
    }
  };

  useEffect(() => { getProduct(); getCategories(); }, [id]);

  useEffect(() => {
    if (product) {
      form.setValues({
        name: product.name || '',
        desc: product.desc || '',
        price: product.price || '',
        image: product.image || '',
        category: product.category || '',
        ingredients: product.ingredients ? product.ingredients.join(', ') : '',
        isFeatured: product.isFeatured || false,
        isVegetarian: product.isVegetarian || false,
        isGlutenFree: product.isGlutenFree || false,
        isAvailable: product.isAvailable || true,
      });
    }
  }, [product]);

  const handleSubmit = async (values) => {
    const ingredientsArray = values.ingredients
      ? values.ingredients.split(',').map((i) => i.trim()).filter(Boolean)
      : [];
    const dataToSend = { ...values, price: parseFloat(values.price), ingredients: ingredientsArray };

    try {
      const res = await api.put(`/products/${id}`, dataToSend);
      if (res.status === 200) {
        setMessage('Product updated successfully!');
        setShowSuccessModal(true);
      } else {
        setErrorMessage('Failed to update product');
        setShowErrorAlert(true);
      }
    } catch {
      setErrorMessage('Error saving product');
      setShowErrorAlert(true);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setTimeout(() => navigate(-1), 500);
  };

  return (
    <div className="update-product">
      <form className="update-product-form" onSubmit={form.onSubmit(handleSubmit)}>
        <h3 className="update-product-form__title">Update Product</h3>

        {showErrorAlert && (
          <div className="update-product-form__notification update-product-form__notification--error">
            <p>{errorMessage}</p>
          </div>
        )}

        <div className="update-product-form__field">
          <label className="update-product-form__label">Name</label>
          <input
            {...form.getInputProps('name')}
            disabled={!isEditable}
            className={`update-product-form__input ${form.errors.name ? 'update-product-form__input--error' : ''}`}
          />
          {form.errors.name && <span className="update-product-form__error">{form.errors.name}</span>}
        </div>

        <div className="update-product-form__field">
          <label className="update-product-form__label">Description</label>
          <textarea
            {...form.getInputProps('desc')}
            disabled={!isEditable}
            className={`update-product-form__input ${form.errors.desc ? 'update-product-form__input--error' : ''}`}
          />
          {form.errors.desc && <span className="update-product-form__error">{form.errors.desc}</span>}
        </div>

        <div className="update-product-form__field">
          <label className="update-product-form__label">Price</label>
          <NumberInput
            value={form.values.price}
            onChange={(value) => form.setFieldValue('price', value)}
            onBlur={() => form.validateField('price')}
            step={0.01}
            precision={2}
            disabled={!isEditable}
            className={form.errors.price ? 'update-product-form__input update-product-form__input--error' : 'update-product-form__input'}
          />
          {form.errors.price && <span className="update-product-form__error">{form.errors.price}</span>}
        </div>

        <div className="update-product-form__field">
          <label className="update-product-form__label">Image URL</label>
          <input
            {...form.getInputProps('image')}
            disabled={!isEditable}
            className={`update-product-form__input ${form.errors.image ? 'update-product-form__input--error' : ''}`}
          />
          {form.errors.image && <span className="update-product-form__error">{form.errors.image}</span>}
        </div>

        <div className="update-product-form__field">
          <label className="update-product-form__label">Category</label>
          <Select
            value={form.values.category}
            onChange={(value) => form.setFieldValue('category', value)}
            onBlur={() => form.validateField('category')}
            placeholder="Select category"
            disabled={!isEditable}
            data={categories.map((cat) => ({ value: cat._id, label: cat.name }))}
            classNames={{
              input: form.errors.category ? 'update-product-form__input update-product-form__input--error' : 'update-product-form__input',
            }}
          />
          {form.errors.category && <span className="update-product-form__error">{form.errors.category}</span>}
        </div>

        <div className="update-product-form__field">
          <label className="update-product-form__label">Ingredients</label>
          <input
            {...form.getInputProps('ingredients')}
            disabled={!isEditable}
            className="update-product-form__input"
          />
        </div>

        <Checkbox
          label="Is Featured" {...form.getInputProps('isFeatured', { type: 'checkbox' })} disabled={!isEditable}
        />
        <Checkbox
          label="Is Vegetarian" {...form.getInputProps('isVegetarian', { type: 'checkbox' })} disabled={!isEditable}
        />
        <Checkbox
          label="Is Gluten-Free" {...form.getInputProps('isGlutenFree', { type: 'checkbox' })} disabled={!isEditable}
        />
        <Checkbox
          label="Is Available" {...form.getInputProps('isAvailable', { type: 'checkbox' })} disabled={!isEditable}
        />

        <Button type="submit" className="update-product-form__submit" disabled={!isEditable}>
          Save Product
        </Button>
      </form>

      <Modal opened={showSuccessModal} onClose={handleCloseSuccessModal} title="Success!" centered>
        <div className="update-product__modal-content">
          <IconCheck size={48} color="green" />
          <p>{message}</p>
          <Button onClick={handleCloseSuccessModal}>OK</Button>
        </div>
      </Modal>
    </div>
  );
};

export default UpdateProduct;
