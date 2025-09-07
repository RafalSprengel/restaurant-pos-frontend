import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from '@mantine/form'
import { TextInput } from '@mantine/core'
import api from '../../../utils/axios.js'
import { useAuth } from '../../../context/authContext.js'
import './addCustomer.scss'
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';

const AddCustomer = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isEditable = ['admin', 'moderator'].includes(user?.role)
  const [isSavingInProgress, setIsSavingInProgress] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const form = useForm({
    initialValues: { firstName: '', surname: '', email: '', phone: '', password: '' },
    validate: {
      firstName: (value) => (value.trim() === '' ? 'First name is required' : null),
      surname: (value) => (value.trim() === '' ? 'Surname is required' : null),
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : 'Invalid email',
      phone: (value) =>
        value.trim() === '' || /^\+?[0-9\s\-()]*$/.test(value)
          ? null
          : 'Invalid phone number',
      password: (value) =>
        value.length < 6 ? 'Password must be at least 6 characters' : null,
    },
    validateInputOnBlur: true,
  })

  const handleSubmit = async (values) => {
    setIsSavingInProgress(true)
    setErrorMessage('')
    try {
      const response = await api.post('/auth/register/customer/', values)
      if (response.status === 201) {
        showNotification({
          title: 'Success',
          message: 'Customer added successfully!',
          color: 'green',
          icon: <IconCheck />,
        });
        setTimeout(() => navigate('/management/customers'), 1000);
      } else setErrorMessage(response.data?.error || 'Failed to add customer')
    } catch (err) {
      setErrorMessage(err.response?.data?.error || err.message || 'An error occurred')
    } finally {
      setIsSavingInProgress(false)
    }
  }

  return (
    <div className="add-customer">
      <form className="add-customer__form" onSubmit={form.onSubmit(handleSubmit)}>
        <h2 className="add-customer__title">Add Customer</h2>

        {errorMessage && (
          <div className="add-customer__notification add-customer__notification--error">
            <p>{errorMessage}</p>
          </div>
        )}

        <TextInput
          label="First name"
          placeholder="First name"
          {...form.getInputProps('firstName')}
          disabled={!isEditable || isSavingInProgress}
          classNames={{
            root: 'add-customer__field',
            input: `add-customer__input ${form.errors.firstName ? 'add-customer__input--error' : ''}`,
            label: 'add-customer__label',
          }}
        />

        <TextInput
          label="Surname"
          placeholder="Customer surname"
          {...form.getInputProps('surname')}
          disabled={!isEditable || isSavingInProgress}
          classNames={{
            root: 'add-customer__field',
            input: `add-customer__input ${form.errors.surname ? 'add-customer__input--error' : ''}`,
            label: 'add-customer__label',
          }}
        />

        <TextInput
          label="Email"
          placeholder="Customer email"
          {...form.getInputProps('email')}
          disabled={!isEditable || isSavingInProgress}
          classNames={{
            root: 'add-customer__field',
            input: `add-customer__input ${form.errors.email ? 'add-customer__input--error' : ''}`,
            label: 'add-customer__label',
          }}
        />

        <TextInput
          label="Phone"
          placeholder="Customer phone"
          {...form.getInputProps('phone')}
          disabled={!isEditable || isSavingInProgress}
          classNames={{
            root: 'add-customer__field',
            input: `add-customer__input ${form.errors.phone ? 'add-customer__input--error' : ''}`,
            label: 'add-customer__label',
          }}
        />

        <TextInput
          label="Password"
          placeholder="Customer password"
          {...form.getInputProps('password')}
          disabled={!isEditable || isSavingInProgress}
          classNames={{
            root: 'add-customer__field',
            input: `add-customer__input ${form.errors.password ? 'add-customer__input--error' : ''}`,
            label: 'add-customer__label',
          }}
        />
        <div className="buttons-group">
          {isEditable && (
            <button
              type="submit"
             className="button-panel"
              disabled={isSavingInProgress}
            >
              {isSavingInProgress ? 'Saving...' : 'Save'}
            </button>
          )}

          <button
            type="button"
            className="button-panel"
            onClick={() => navigate('/management/customers')}
          >
            Cancel
          </button>
        </div>

      </form>
    </div>

  )
}

export default AddCustomer
