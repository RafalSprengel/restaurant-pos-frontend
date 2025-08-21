import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import api from '../../../utils/axios';
import './updateProduct.scss';
import { NumberInput, TextInput, Select, Checkbox, Button, Modal } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { useForm } from '@mantine/form';

const UpdateProduct = () => {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProduct, resCategories] = await Promise.all([
          api.get(`/products/${id}`),
          api.get('/product-categories/'),
        ]);
        if (resProduct.status === 200) setProduct(resProduct.data);
        if (resCategories.status === 200) setCategories(resCategories.data);
      } catch {
        alert('Failed to load product or categories');
      }
    };
    fetchData();
  }, [id]);

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
      }
    } catch {
      alert('Error saving product');
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setTimeout(() => navigate(-1), 500);
  };

  return (
    <div className="update-product">
      <form className="update-product__form" onSubmit={form.onSubmit(handleSubmit)}>
        <h3 className="update-product__title">Update Product</h3>

        <TextInput
          label="Name"
          placeholder="Product name"
          {...form.getInputProps('name')}
          disabled={!isEditable}
          classNames={{
            root: 'update-product__field',
            input: form.errors.name
              ? 'update-product__input update-product__input--error'
              : 'update-product__input',
            label: 'update-product__label',
            error: 'update-product__error',
          }}
        />

        <TextInput
          label="Description"
          placeholder="Product description"
          {...form.getInputProps('desc')}
          disabled={!isEditable}
          classNames={{
            root: 'update-product__field',
            input: form.errors.desc
              ? 'update-product__input update-product__input--error'
              : 'update-product__input',
            label: 'update-product__label',
            error: 'update-product__error',
          }}
        />

        <NumberInput
          label="Price"
          placeholder="0.00"
          step={0.01}
          precision={2}
          {...form.getInputProps('price')}
          disabled={!isEditable}
          classNames={{
            root: 'update-product__field',
            input: form.errors.price
              ? 'update-product__input update-product__input--error'
              : 'update-product__input',
            label: 'update-product__label',
            error: 'update-product__error',
          }}
        />

        <TextInput
          label="Image URL"
          placeholder="http://..."
          {...form.getInputProps('image')}
          disabled={!isEditable}
          classNames={{
            root: 'update-product__field',
            input: form.errors.image
              ? 'update-product__input update-product__input--error'
              : 'update-product__input',
            label: 'update-product__label',
            error: 'update-product__error',
          }}
        />

        <Select
          label="Category"
          placeholder="Select category"
          data={categories.map((c) => ({ value: c._id, label: c.name }))}
          {...form.getInputProps('category')}
          disabled={!isEditable}
          classNames={{
            root: 'update-product__field',
            input: form.errors.category
              ? 'update-product__input update-product__input--error'
              : 'update-product__input',
            label: 'update-product__label',
            error: 'update-product__error',
          }}
        />

        <TextInput
          label="Ingredients"
          placeholder="ingredient1, ingredient2"
          {...form.getInputProps('ingredients')}
          disabled={!isEditable}
          classNames={{
            root: 'update-product__field',
            input: 'update-product__input',
            label: 'update-product__label',
          }}
        />

        <Checkbox
          label="Is Featured"
          {...form.getInputProps('isFeatured', { type: 'checkbox' })}
          disabled={!isEditable}
          classNames={{ root: 'update-product__field' }}
        />
        <Checkbox
          label="Is Vegetarian"
          {...form.getInputProps('isVegetarian', { type: 'checkbox' })}
          disabled={!isEditable}
          classNames={{ root: 'update-product__field' }}
        />
        <Checkbox
          label="Is Gluten-Free"
          {...form.getInputProps('isGlutenFree', { type: 'checkbox' })}
          disabled={!isEditable}
          classNames={{ root: 'update-product__field' }}
        />
        <Checkbox
          label="Is Available"
          {...form.getInputProps('isAvailable', { type: 'checkbox' })}
          disabled={!isEditable}
          classNames={{ root: 'update-product__field' }}
        />

        <Button type="submit" className="update-product__submit" disabled={!isEditable}>
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
