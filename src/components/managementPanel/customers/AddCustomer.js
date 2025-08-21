import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from '@mantine/form'
import { TextInput, Button } from '@mantine/core'
import api from '../../../utils/axios.js'
import { useAuth } from '../../../context/authContext.js'
import './addCustomer.scss'

const AddCustomer = () => {
  const navigate = useNavigate()
  const { user } = useAuth('staff')
  const isEditable = ['admin', 'moderator'].includes(user.role)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const form = useForm({
    initialValues: { name: '', surname: '', email: '', phone: '', password: '' },
    validate: {
      name: (value) => (value.trim() === '' ? 'Name is required' : null),
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
    setIsLoading(true)
    setErrorMessage('')
    try {
      const response = await api.post('/auth/register/customer/', values)
      if (response.status === 201) navigate('/management/customers')
      else setErrorMessage(response.data?.error || 'Failed to add customer')
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="add-customer">
      <form className="add-customer-form" onSubmit={form.onSubmit(handleSubmit)}>
        <h2 className="add-customer-form__title">Add Customer</h2>

        {errorMessage && (
          <div className="add-customer-form__notification add-customer-form__notification--error">
            <p>{errorMessage}</p>
          </div>
        )}

        <TextInput
          label="Name"
          placeholder="Customer name"
          {...form.getInputProps('name')}
          disabled={!isEditable || isLoading}
          classNames={{
            root: 'add-customer-form__field',
            input: `add-customer-form__input ${form.errors.name ? 'add-customer-form__input--error' : ''}`,
            label: 'add-customer-form__label',
          }}
        />

        <TextInput
          label="Surname"
          placeholder="Customer surname"
          {...form.getInputProps('surname')}
          disabled={!isEditable || isLoading}
          classNames={{
            root: 'add-customer-form__field',
            input: `add-customer-form__input ${form.errors.surname ? 'add-customer-form__input--error' : ''}`,
            label: 'add-customer-form__label',
          }}
        />

        <TextInput
          label="Email"
          placeholder="Customer email"
          {...form.getInputProps('email')}
          disabled={!isEditable || isLoading}
          classNames={{
            root: 'add-customer-form__field',
            input: `add-customer-form__input ${form.errors.email ? 'add-customer-form__input--error' : ''}`,
            label: 'add-customer-form__label',
          }}
        />

        <TextInput
          label="Phone"
          placeholder="Customer phone"
          {...form.getInputProps('phone')}
          disabled={!isEditable || isLoading}
          classNames={{
            root: 'add-customer-form__field',
            input: `add-customer-form__input ${form.errors.phone ? 'add-customer-form__input--error' : ''}`,
            label: 'add-customer-form__label',
          }}
        />

        <TextInput
          label="Password"
          placeholder="Customer password"
          {...form.getInputProps('password')}
          disabled={!isEditable || isLoading}
          classNames={{
            root: 'add-customer-form__field',
            input: `add-customer-form__input ${form.errors.password ? 'add-customer-form__input--error' : ''}`,
            label: 'add-customer-form__label',
          }}
        />

        {isEditable && (
          <Button
            type="submit"
            className="add-customer-form__submit"
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Customer'}
          </Button>
        )}
      </form>
    </div>
  )
}

export default AddCustomer
