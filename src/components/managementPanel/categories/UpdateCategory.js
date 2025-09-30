import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from '@mantine/form'
import { TextInput, NumberInput, Loader, Center } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck } from '@tabler/icons-react'
import api from '../../../utils/axios.js'
import './updateCategory.scss'
import ErrorMessage from '../../ErrorMessage.js'

const UpdateCategory = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

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

  const handleSubmit = async (values) => {
    setIsLoading(true)
    setShowErrorAlert(false)
    try {
      const res = await api.put(`/product-categories/${id}`, {
        name: values.name,
        index: values.index,
      })

      if (res.status === 200) {
        showNotification({
          title: 'Success',
          message: 'Category updated successfully!',
          color: 'green',
          icon: <IconCheck />,
        })
      } else {
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
        <ErrorMessage message={errorMessage} />
      )}

      <form className="update-category__form" onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Name"
          placeholder="Category name"
          {...form.getInputProps('name')}
          disabled={isLoading}
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
          disabled={isLoading}
          min={0}
          classNames={{
            root: 'update-category__form-field',
            input: `update-category__form-input ${form.errors.index ? 'update-category__form-input--error' : ''}`,
            label: 'update-category__form-label',
          }}
        />

        <div className="update-category__buttons-group">
          <button
            type="submit"
            className="button-panel"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Category'}
          </button>
          <button
            type="button"
            className="button-panel"
            onClick={() => navigate('/management/categories')}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdateCategory
