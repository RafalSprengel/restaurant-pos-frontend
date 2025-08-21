import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from '@mantine/form'
import { TextInput, NumberInput, Button, Loader, Center } from '@mantine/core'
import api from '../../../utils/axios.js'
import { useAuth } from '../../../context/authContext.js'
import './updateCategory.scss'

const UpdateCategory = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth('staff')
  const isEditable = ['admin', 'moderator'].includes(user.role)
  const [isLoading, setIsLoading] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [imageFile, setImageFile] = useState(null)

  const form = useForm({
    initialValues: { name: '', index: '' },
    validate: {
      name: (value) => (value.trim() === '' ? 'Name is required' : null),
      index: (value) => (value === '' || value < 0 ? 'Index must be positive' : null),
    },
    validateInputOnBlur: true,
  })

  const getCategory = async () => {
    try {
      setIsLoading(true)
      const res = await api.get(`/product-categories/${id}`)
      if (res.status === 200) {
        form.setValues({
          name: res.data.name || '',
          index: res.data.index || '',
        })
      } else throw new Error('Failed to fetch category')
    } catch (err) {
      setShowErrorAlert(true)
      setErrorMessage(err.response?.data?.error || err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getCategory()
  }, [])

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0])
  }

  const handleSubmit = async (values) => {
    setIsLoading(true)
    setShowErrorAlert(false)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', values.name)
      formDataToSend.append('index', values.index)
      if (imageFile) formDataToSend.append('image', imageFile)

      const res = await api.put(`/product-categories/${id}`, formDataToSend)
      if (res.status === 200) navigate('/management/categories')
      else {
        setShowErrorAlert(true)
        setErrorMessage(res.data?.error || 'Failed to update category')
      }
    } catch (err) {
      setShowErrorAlert(true)
      setErrorMessage(err.response?.data?.error || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading)
    return (
      <Center className="update-category__center">
        <Loader size="md" />
      </Center>
    )

  return (
    <div className="update-category">
      <h2 className="update-category__title">Update Category</h2>

      {showErrorAlert && (
        <div className="update-category-form__notification update-category-form__notification--error">
          <p>{errorMessage}</p>
        </div>
      )}

      <form className="update-category-form" onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Name"
          placeholder="Category name"
          {...form.getInputProps('name')}
          disabled={!isEditable || isLoading}
          classNames={{
            root: 'update-category-form__field',
            input: `update-category-form__input ${form.errors.name ? 'update-category-form__input--error' : ''}`,
            label: 'update-category-form__label',
          }}
        />

        <NumberInput
          label="Index"
          placeholder="Category index"
          {...form.getInputProps('index')}
          disabled={!isEditable || isLoading}
          min={0}
          classNames={{
            root: 'update-category-form__field',
            input: `update-category-form__input ${form.errors.index ? 'update-category-form__input--error' : ''}`,
            label: 'update-category-form__label',
          }}
        />

        <div className="update-category-form__field">
          <label className="update-category-form__label" htmlFor="image">
            Image:
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={!isEditable || isLoading}
            className="update-category-form__input update-category-form__input--file"
          />
        </div>

        {isEditable && (
          <Button
            type="submit"
            className="update-category-form__submit"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Category'}
          </Button>
        )}
      </form>
    </div>
  )
}

export default UpdateCategory
