import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from '@mantine/form'
import { TextInput } from '@mantine/core'
import api from '../../../utils/axios.js'
import './addCustomer.scss'
import { showNotification } from '@mantine/notifications'
import { IconCheck } from '@tabler/icons-react'
import ErrorMessage from '../../ErrorMessage'

const AddCustomer = () => {
  const navigate = useNavigate()
  const [isSavingInProgress, setIsSavingInProgress] = useState(false)
  const [error, setError] = useState('')

  const form = useForm({
    initialValues: { firstName: '', surname: '', email: '', phone: '', password: '' },
    validate: {
      firstName: (value) => (value.trim() === '' ? 'First name is required' : null),
      surname: (value) => (value.trim() === '' ? 'Surname is required' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
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
    setError('')
    try {
      const response = await api.post('/auth/register/customer/', values)
      if (response.status === 201) {
        showNotification({
          title: 'Success',
          message: 'Customer added successfully!',
          color: 'green',
          icon: <IconCheck />,
        })
        setTimeout(() => navigate('/management/customers'), 1000)
      } else {
        setError(response.data?.error || 'Failed to add customer')
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'An error occurred')
    } finally {
      setIsSavingInProgress(false)
    }
  }

  return (
    <div className="add-customer">
      <form className="add-customer__form" onSubmit={form.onSubmit(handleSubmit)}>
        <h2 className="add-customer__title">Add Customer</h2>

        {error && <ErrorMessage message={error} />}

        <TextInput
          label="First name"
          placeholder="First name"
          {...form.getInputProps('firstName')}
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
          classNames={{
            root: 'add-customer__field',
            input: `add-customer__input ${form.errors.password ? 'add-customer__input--error' : ''}`,
            label: 'add-customer__label',
          }}
        />

        <div className="buttons-group">
          <button type="submit" className="button-panel" disabled={isSavingInProgress}>
            {isSavingInProgress ? 'Saving...' : 'Save'}
          </button>
          <button type="button" className="button-panel" onClick={() => navigate('/management/customers')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddCustomer
