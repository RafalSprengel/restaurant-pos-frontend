import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from '@mantine/form'
import { Input, TextInput, Textarea, Select, Checkbox, Button, Notification, Loader, Center } from '@mantine/core'
import api from '../../../utils/axios.js'
import './addProduct.scss'

const AddProduct = () => {
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

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
  })

  const getCategories = async () => {
    try {
      const response = await api.get('/product-categories')
      if (response.status === 200) {
        setCategories(response.data)
      } else {
        setErrorMessage(`Failed to load categories (${response.data.error})`)
      }
    } catch (e) {
      setErrorMessage(`Connection error (${e.response?.data?.error || e.message})`)
    } finally {
      setLoadingCategories(false)
    }
  }

  useEffect(() => {
    getCategories()
  }, [])

  const handleSubmit = async (values) => {
    const dataToSend = {
      ...values,
      price: parseFloat(values.price),
      ingredients: values.ingredients.split(',').map((i) => i.trim()),
    }

    try {
      const response = await api.post('/products/', JSON.stringify(dataToSend))
      if (response.status === 201) {
        if (window.confirm('Product added successfully!')) {
          navigate(-1)
        }
      } else {
        setErrorMessage(`Failed to save product (${response.data.error})`)
      }
    } catch (e) {
      setErrorMessage(`Error while saving... (${e.response?.data?.error || e.message})`)
    }
  }

  if (loadingCategories)
    return (
      <Center style={{ minHeight: '200px' }}>
        <Loader size="xl" />
      </Center>
    )

  return (
    <div className="add-product">
      <form className="add-product-form" onSubmit={form.onSubmit(handleSubmit)}>
        {errorMessage && <Notification color="red">{errorMessage}</Notification>}

        <TextInput
  label="Name"
  placeholder="Product Name"
  {...form.getInputProps('name')}
  error={form.errors.name}
  classNames={{
    root: 'add-product-form__field',
    input: `add-product-form__input ${form.errors.name ? 'add-product-form__input--error' : ''}`,
    label: 'add-product-form__label',
    error: 'add-product-form__error',
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
          error={form.errors.price}
          classNames={{
            root: 'add-product-form__field',
            input: `add-product-form__input ${form.errors.price ? 'add-product-form__input--error' : ''}`,
            label: 'add-product-form__label',
          }}
        />

        <TextInput
          label="Image URL"
          placeholder="http://..."
          {...form.getInputProps('image')}
          classNames={{
            root: 'add-product-form__field',
            input: 'add-product-form__input',
            label: 'add-product-form__label',
          }}
        />

        <Select
          label="Category"
          placeholder="Select category"
          data={categories.map((c) => ({ value: c._id, label: c.name }))}
          {...form.getInputProps('category')}
          error={form.errors.category}
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

        <Checkbox
          label="Is Featured"
          {...form.getInputProps('isFeatured', { type: 'checkbox' })}
          classNames={{
            root: 'add-product-form__field',
          }}
        />

        <Checkbox
          label="Is Vegetarian"
          {...form.getInputProps('isVegetarian', { type: 'checkbox' })}
          classNames={{
            root: 'add-product-form__field',
          }}
        />

        <Checkbox
          label="Is Gluten-Free"
          {...form.getInputProps('isGlutenFree', { type: 'checkbox' })}
          classNames={{
            root: 'add-product-form__field',
          }}
        />

        <Checkbox
          label="Is Available"
          {...form.getInputProps('isAvailable', { type: 'checkbox' })}
          classNames={{
            root: 'add-product-form__field',
          }}
        />

        <Button type="submit" className="add-product-form__submit">
          Save Product
        </Button>
      </form>
    </div>
  )
}

export default AddProduct
