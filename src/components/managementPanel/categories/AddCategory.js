import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from '@mantine/form'
import { TextInput, NumberInput, Button, Loader, Center } from '@mantine/core'
import api from '../../../utils/axios.js'
import { useAuth } from '../../../context/authContext.js'
import './addCategory.scss'

const AddCategory = () => {
  const { user } = useAuth('staff')
  const isEditable = ['admin', 'moderator'].includes(user.role)
  const [isLoading, setIsLoading] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const navigate = useNavigate()

  const form = useForm({
    initialValues: { name: '', index: '' },
    validate: {
      name: (value) => (value.trim() === '' ? 'Name is required' : null),
      index: (value) => (value === '' || value < 0 ? 'Index must be positive' : null),
    },
    validateInputOnBlur: true,
  })

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

      const res = await api.post('/product-categories/', formDataToSend)
      if (res.status === 201) navigate('/management/categories')
      else {
        setShowErrorAlert(true)
        setErrorMessage(res.data?.error || 'Failed to save category')
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
      <Center className="add-category__center">
        <Loader size="md" />
      </Center>
    )

  return (
    <div className="add-category">
      <h2 className="add-category__title">Add Category</h2>

      {showErrorAlert && (
        <div className="add-category-form__notification add-category-form__notification--error">
          <p>{errorMessage}</p>
        </div>
      )}

      <form className="add-category-form" onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Name"
          placeholder="Category name"
          {...form.getInputProps('name')}
          disabled={!isEditable || isLoading}
          classNames={{
            root: 'add-category-form__field',
            input: `add-category-form__input ${form.errors.name ? 'add-category-form__input--error' : ''}`,
            label: 'add-category-form__label',
          }}
        />

        <NumberInput
          label="Index"
          placeholder="Category index"
          {...form.getInputProps('index')}
          disabled={!isEditable || isLoading}
          min={0}
          classNames={{
            root: 'add-category-form__field',
            input: `add-category-form__input ${form.errors.index ? 'add-category-form__input--error' : ''}`,
            label: 'add-category-form__label',
          }}
        />

        <div className="add-category-form__field">
          <label className="add-category-form__label" htmlFor="image">
            Image:
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={!isEditable || isLoading}
            className="add-category-form__input add-category-form__input--file"
          />
        </div>

        {isEditable && (
          <Button
            type="submit"
            className="add-category-form__submit"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Category'}
          </Button>
        )}
      </form>
    </div>
  )
}

export default AddCategory
