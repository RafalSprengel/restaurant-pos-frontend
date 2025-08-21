import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from '@mantine/form'
import { TextInput, Button, Loader, Center } from '@mantine/core'
import api from '../../../utils/axios.js'
import { useAuth } from '../../../context/authContext.js'
import './updateCustomer.scss'

const UpdateCustomer = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth('staff')
  const isEditable = ['admin', 'moderator'].includes(user.role)
  const [isLoading, setIsLoading] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const form = useForm({
    initialValues: { name: '', surname: '', email: '', phone: '', password: '' },
    validate: {
      name: (value) => (value.trim() === '' ? 'Name is required' : null),
      surname: (value) => (value.trim() === '' ? 'Surname is required' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      phone: (value) =>
        value.trim() === '' || /^\+?[0-9\s\-()]*$/.test(value)
          ? null
          : 'Invalid phone number',
      password: (value) =>
        value.length > 0 && value.length < 6 ? 'Password must be at least 6 characters' : null,
    },
    validateInputOnBlur: true,
  })

  const getCustomer = async () => {
    try {
      setIsLoading(true)
      const res = await api.get(`/auth/customers/${id}`)
      if (res.status === 200) {
        form.setValues({
          name: res.data.name || '',
          surname: res.data.surname || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          password: '',
        })
      } else throw new Error('Failed to fetch customer')
    } catch (err) {
      setShowErrorAlert(true)
      setErrorMessage(err.response?.data?.error || err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getCustomer()
  }, [])

  const handleSubmit = async (values) => {
    setIsLoading(true)
    setShowErrorAlert(false)
    try {
      const res = await api.put(`/auth/customers/${id}`, values)
      if (res.status === 200) navigate('/management/customers')
      else {
        setShowErrorAlert(true)
        setErrorMessage(res.data?.error || 'Failed to update customer')
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
      <Center className="update-customer__center">
        <Loader size="md" />
      </Center>
    )

  return (
    <div className="update-customer">
      <h2 className="update-customer__title">Update Customer</h2>

      {showErrorAlert && (
        <div className="update-customer-form__notification update-customer-form__notification--error">
          <p>{errorMessage}</p>
        </div>
      )}

      <form className="update-customer-form" onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Name"
          placeholder="Customer name"
          {...form.getInputProps('name')}
          disabled={!isEditable || isLoading}
          classNames={{
            root: 'update-customer-form__field',
            input: `update-customer-form__input ${form.errors.name ? 'update-customer-form__input--error' : ''}`,
            label: 'update-customer-form__label',
          }}
        />

        <TextInput
          label="Surname"
          placeholder="Customer surname"
          {...form.getInputProps('surname')}
          disabled={!isEditable || isLoading}
          classNames={{
            root: 'update-customer-form__field',
            input: `update-customer-form__input ${form.errors.surname ? 'update-customer-form__input--error' : ''}`,
            label: 'update-customer-form__label',
          }}
        />

        <TextInput
          label="Email"
          placeholder="Customer email"
          {...form.getInputProps('email')}
          disabled={!isEditable || isLoading}
          classNames={{
            root: 'update-customer-form__field',
            input: `update-customer-form__input ${form.errors.email ? 'update-customer-form__input--error' : ''}`,
            label: 'update-customer-form__label',
          }}
        />

        <TextInput
          label="Phone"
          placeholder="Customer phone"
          {...form.getInputProps('phone')}
          disabled={!isEditable || isLoading}
          classNames={{
            root: 'update-customer-form__field',
            input: `update-customer-form__input ${form.errors.phone ? 'update-customer-form__input--error' : ''}`,
            label: 'update-customer-form__label',
          }}
        />

        <TextInput
          label="Password"
          placeholder="Leave empty to keep current password"
          {...form.getInputProps('password')}
          disabled={!isEditable || isLoading}
          classNames={{
            root: 'update-customer-form__field',
            input: `update-customer-form__input ${form.errors.password ? 'update-customer-form__input--error' : ''}`,
            label: 'update-customer-form__label',
          }}
        />

        {isEditable && (
          <Button
            type="submit"
            className="update-customer-form__submit"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Customer'}
          </Button>
        )}
      </form>
    </div>
  )
}

export default UpdateCustomer
