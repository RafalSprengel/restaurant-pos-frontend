import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from '@mantine/form'
import api from '../../../utils/axios.js'
import './updateCustomer.scss'
import { TextInput } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck } from '@tabler/icons-react'

const UpdateCustomer = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdatingInProgress, setIsUpdatingInProgress] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

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
        value.length > 0 && value.length < 6 ? 'Password must be at least 6 characters' : null,
    },
    validateInputOnBlur: true,
  })

  const getCustomer = async () => {
    try {
      setIsLoading(true)
      const res = await api.get(`/customers/${id}`)
      if (res.status === 200) {
        form.setValues({
          firstName: res.data.firstName || '',
          surname: res.data.surname || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          password: '',
        })
      } else throw new Error(res.data?.error || 'Failed to fetch customer')
    } catch (err) {
      setErrorMessage(err.response?.data?.error || err.message || 'Unable to fetch customer. You might not have enough rights.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getCustomer()
  }, [id])

  const handleSubmit = async (values) => {
    setIsUpdatingInProgress(true)
    setErrorMessage('')
    try {
      const res = await api.put(`/customers/${id}`, values)
      if (res.status === 200) {
        showNotification({
          title: 'Success',
          message: 'Customer updated successfully!',
          color: 'green',
          icon: <IconCheck />,
        })
        setTimeout(() => navigate('/management/customers'), 1000)
      } else {
        setErrorMessage(res.data?.error || 'Failed to update customer. You might not have enough rights.')
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Failed to update customer. You might not have enough rights.')
    } finally {
      setIsUpdatingInProgress(false)
    }
  }

  if (isLoading)
    return <div className="update-customer__loading">Loading...</div>

  return (
    <div className="update-customer">
      <h2 className="update-customer__title">Update Customer</h2>

      {errorMessage && (
        <div className="update-customer-form__notification update-customer-form__notification--error">
          <p>{errorMessage}</p>
        </div>
      )}

      <form className="update-customer-form" onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="First name"
          placeholder="Customer first name"
          {...form.getInputProps('firstName')}
          disabled={isLoading || isUpdatingInProgress}
          classNames={{
            root: 'update-customer-form__field',
            input: `update-customer-form__input ${form.errors.firstName ? 'update-customer-form__input--error' : ''}`,
            label: 'update-customer-form__label',
          }}
        />

        <TextInput
          label="Surname"
          placeholder="Customer surname"
          {...form.getInputProps('surname')}
          disabled={isLoading || isUpdatingInProgress}
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
          disabled={isLoading || isUpdatingInProgress}
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
          disabled={isLoading || isUpdatingInProgress}
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
          disabled={isLoading || isUpdatingInProgress}
          classNames={{
            root: 'update-customer-form__field',
            input: `update-customer-form__input ${form.errors.password ? 'update-customer-form__input--error' : ''}`,
            label: 'update-customer-form__label',
          }}
        />

        <div className="buttons-group">
          <button type="submit" className="button-panel" disabled={isUpdatingInProgress}>
            {isUpdatingInProgress ? 'Saving...' : 'Save Customer'}
          </button>
          <button type="button" className="button-panel" onClick={() => navigate('/management/customers')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdateCustomer
