import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from '@mantine/form'
import { TextInput, Textarea, Select, Checkbox, Loader, Center, Notification } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck } from '@tabler/icons-react'
import api from '../../../utils/axios.js'
import './updateProduct.scss'

const UpdateProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingInProgress, setIsSavingInProgress] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [imageFile, setImageFile] = useState(null)

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
      name: (value) => (value.trim() === '' ? 'Product name is required' : null),
      price: (value) => (!isNaN(parseFloat(value)) && parseFloat(value) > 0 ? null : 'Price must be positive'),
      category: (value) => (value ? null : 'Category is required'),
    },
    validateInputOnBlur: true,
  })

  const getCategories = async () => {
    try {
      const res = await api.get('/product-categories')
      if (res.status === 200) setCategories(res.data.categories)
      else setErrorMessage(`Failed to load categories (${res.data.error})`)
    } catch (err) {
      setErrorMessage(`Connection error (${err.response?.data?.error || err.message})`)
    } finally {
      setLoadingCategories(false)
    }
  }

  const getProduct = async () => {
    try {
      setIsLoading(true)
      const res = await api.get(`/products/${id}`)
      if (res.status === 200) {
        const product = res.data;
        form.setValues({
          name: product.name || '',
          desc: product.desc || '',
          price: product.price || '',
          image: product.image || '',
          thumbnail: product.thumbnail || '',
          category: product.category || '',
          ingredients: (product.ingredients || []).join(', '),
          isFeatured: product.isFeatured,
          isVegetarian: product.isVegetarian,
          isGlutenFree: product.isGlutenFree,
          isAvailable: product.isAvailable,
        })
      } else setErrorMessage('Failed to fetch product')
    } catch (err) {
      setErrorMessage(err.response?.data?.error || err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getCategories()
    getProduct()
  }, [id])

  const handleSubmit = async (values) => {
    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('desc', values.desc)
    formData.append('price', parseFloat(values.price))
    formData.append('category', values.category)
    formData.append('ingredients', values.ingredients.split(',').map(i => i.trim()))
    formData.append('isFeatured', values.isFeatured)
    formData.append('isVegetarian', values.isVegetarian)
    formData.append('isGlutenFree', values.isGlutenFree)
    formData.append('isAvailable', values.isAvailable)
    if (imageFile) formData.append('image', imageFile)

    setIsSavingInProgress(true)
    setErrorMessage('')
    try {
      const res = await api.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.status === 200) {
        showNotification({
          title: 'Success',
          message: 'Product updated successfully!',
          color: 'green',
          icon: <IconCheck />,
        })
        setTimeout(() => navigate('/management/products'), 1000)
      } else {
        setErrorMessage(res.data?.error || 'Failed to update product')
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.error || err.message)
    } finally {
      setIsSavingInProgress(false)
    }
  }

  if (loadingCategories || isLoading)
    return (
      <Center className="update-product__center">
        <Loader size="md" />
      </Center>
    )

  return (
    <div className="update-product">
      <h2 className="update-product__title">Update Product</h2>
      {errorMessage && <Notification color="red">{errorMessage}</Notification>}

      <form className="update-product__form" onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Name"
          placeholder="Product Name"
          {...form.getInputProps('name')}
          classNames={{
            root: 'update-product__form-field',
            input: `update-product__form-input ${form.errors.name ? 'update-product__form-input--error' : ''}`,
            label: 'update-product__form-label',
          }}
        />

        <Textarea
          label="Description"
          placeholder="Product Description"
          {...form.getInputProps('desc')}
          classNames={{
            root: 'update-product__form-field',
            input: 'update-product__form-input',
            label: 'update-product__form-label',
          }}
        />

        <TextInput
          label="Price"
          placeholder="0.00"
          type="number"
          step="0.01"
          {...form.getInputProps('price')}
          classNames={{
            root: 'update-product__form-field',
            input: `update-product__form-input ${form.errors.price ? 'update-product__form-input--error' : ''}`,
            label: 'update-product__form-label',
          }}
        />

        <div className="update-product__form-field update-product__form-field-file-wrapper">
          <div className="update-product__file-group">
            <label className="update-product__form-label" htmlFor="image">Image:</label>
            <input
              id="image"
              className="update-product__file-input"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </div>

          {form.values.image && !imageFile && (
            <a
              href={`${process.env.REACT_APP_API_URL}${form.values.thumbnail}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{margin: "auto"}}
            >
              <img
                src={`${process.env.REACT_APP_API_URL}${form.values.thumbnail}`}
                alt="Thumbnail"
                className="update-product__thumbnail"
                style={{ cursor: 'pointer' }}
              />
            </a>
          )}
        </div>

        <Select
          label="Category"
          placeholder="Select category"
          data={(categories || []).map(c => ({ value: c._id, label: c.name }))}
          {...form.getInputProps('category')}
          classNames={{
            root: 'update-product__form-field',
            input: `update-product__form-input ${form.errors.category ? 'update-product__form-input--error' : ''}`,
            label: 'update-product__form-label',
          }}
        />

        <TextInput
          label="Ingredients (comma-separated)"
          placeholder="ingredient1, ingredient2"
          {...form.getInputProps('ingredients')}
          classNames={{
            root: 'update-product__form-field',
            input: 'update-product__form-input',
            label: 'update-product__form-label',
          }}
        />

        <Checkbox label="Is Featured" {...form.getInputProps('isFeatured', { type: 'checkbox' })} classNames={{ root: 'update-product__form-field' }} />
        <Checkbox label="Is Vegetarian" {...form.getInputProps('isVegetarian', { type: 'checkbox' })} classNames={{ root: 'update-product__form-field' }} />
        <Checkbox label="Is Gluten-Free" {...form.getInputProps('isGlutenFree', { type: 'checkbox' })} classNames={{ root: 'update-product__form-field' }} />
        <Checkbox label="Is Available" {...form.getInputProps('isAvailable', { type: 'checkbox' })} classNames={{ root: 'update-product__form-field' }} />

        <div className="buttons-group">
          <button type="submit" className="button-panel" disabled={isSavingInProgress}>
            {isSavingInProgress ? 'Saving...' : 'Update Product'}
          </button>
          <button type="button" className="button-panel" onClick={() => navigate('/management/products')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdateProduct
