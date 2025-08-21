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

      <form className="update-category__form" onSubmit={form.onSubmit(handleSubmit)}>
        {showErrorAlert && (
          <div className="update-category__form-notification">
            <p>{errorMessage}</p>
          </div>
        )}

        <TextInput
          label="Name"
          placeholder="Category name"
          {...form.getInputProps('name')}
          disabled={!isEditable || isLoading}
          classNames={{
            root: 'update-category__form-field',
            input: `update-category__form-input ${form.errors.name ? 'update-category__form-input--error' : ''}`,
            label: 'update-category__form-label',
          }}
        />

        <NumberInput
          label="Index"
          placeholder="Category index"
          {...form.getInputProps('index')}
          disabled={!isEditable || isLoading}
          min={0}
          classNames={{
            root: 'update-category__form-field',
            input: `update-category__form-input ${form.errors.index ? 'update-category__form-input--error' : ''}`,
            label: 'update-category__form-label',
          }}
        />

        <div className="update-category__form-field">
          <label className="update-category__form-label" htmlFor="image">
            Image:
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={!isEditable || isLoading}
            className="update-category__form-input update-category__form-input--file"
          />
        </div>

        {isEditable && (
          <Button
            type="submit"
            className="update-category__form-submit"
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
