import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from '@mantine/form'
import { TextInput, NumberInput } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck } from '@tabler/icons-react'
import api from '../../../utils/axios.js'
import './addCategory.scss'

const AddCategory = () => {
  const [isSavingInProgress, setIsSavingInProgress] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const form = useForm({
    initialValues: { name: '', index: '' },
    validate: {
      name: (value) => (value.trim() === '' ? 'Name is required' : null),
      index: (value) => (value === '' || value < 0 ? 'Index must be positive' : null),
    },
    validateInputOnBlur: true,
  })

  const handleSubmit = async (values) => {
    setIsSavingInProgress(true)
    setShowErrorAlert(false)
    try {
      const res = await api.post('/product-categories/', {
        name: values.name,
        index: values.index,
      })

      if (res.status === 201) {
        showNotification({
          title: 'Success',
          message: 'Category added successfully!',
          color: 'green',
          icon: <IconCheck />,
        })
        setTimeout(() => navigate('/management/categories'), 1000)
      } else {
        setShowErrorAlert(true)
        setErrorMessage(res.data?.error || 'Failed to save category')
      }
    } catch (err) {
      setShowErrorAlert(true)
      setErrorMessage(err.response?.data?.error || 'An error occurred')
    } finally {
      setIsSavingInProgress(false)
    }
  }

  return (
    <div className="add-category">
      <h2 className="add-category__title">Add Category</h2>

      {showErrorAlert && (
        <div className="add-category__form-error-message">
          {errorMessage}
        </div>
      )}

      <form className="add-category__form" onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Name"
          placeholder="Category name"
          {...form.getInputProps('name')}
          disabled={isSavingInProgress}
          classNames={{
            root: 'add-category__form-field',
            input: `add-category__form-input ${form.errors.name ? 'add-category__form-input--error' : ''}`,
            label: 'add-category__form-label',
          }}
        />

        <NumberInput
          label="Index"
          placeholder="Category index"
          {...form.getInputProps('index')}
          disabled={isSavingInProgress}
          min={0}
          classNames={{
            root: 'add-category__form-field',
            input: `add-category__form-input ${form.errors.index ? 'add-category__form-input--error' : ''}`,
            label: 'add-category__form-label',
          }}
        />

        <div className="add-category__form-buttons-group">
          <button type="submit" className="button-panel" disabled={isSavingInProgress}>
            {isSavingInProgress ? 'Saving...' : 'Save Category'}
          </button>
          <button type="button" className="button-panel" onClick={() => navigate('/management/categories')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddCategory
