import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from '@mantine/form'
import { TextInput, PasswordInput, Select, Button, Loader, Center } from '@mantine/core'
import api from '../../../utils/axios'
import { useFetch } from '../../../hooks/useFetch'
import './AddMgmt.scss'

export default function AddUser() {
  const navigate = useNavigate()
  const { data: roles = [] } = useFetch('/staff/roles')

  const [isLoading, setIsLoading] = useState(false)
  const [modalOpened, setModalOpened] = useState(false)
  const [modalContent, setModalContent] = useState({ message: '', isError: false })

  const form = useForm({
    initialValues: { firstName: '', surname: '', email: '', role: '', password: '' },
    validate: {
      firstName: (v) => (v.trim() === '' ? 'First Name is required' : null),
      surname: (v) => (v.trim() === '' ? 'Surname is required' : null),
      email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Invalid email'),
      role: (v) => (v ? null : 'Role is required'),
      password: (v) => (v.length < 6 ? 'Password must be at least 6 characters' : null),
    },
    validateInputOnBlur: true,
  })

  const handleSubmit = async (values) => {
    setIsLoading(true)
    try {
      const response = await api.post('auth/register/mgmt', values)
      if (response.status === 201) {
        setModalContent({ message: 'User created successfully!', isError: false })
        setModalOpened(true)
        form.reset()
      } else {
        setModalContent({ message: response.data.error || 'Unknown error', isError: true })
        setModalOpened(true)
      }
    } catch (err) {
      setModalContent({ message: err.response?.data?.error || err.message, isError: true })
      setModalOpened(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleModalClose = () => {
    setModalOpened(false)
    if (!modalContent.isError) navigate('/management/mgnts')
  }

  if (isLoading)
    return (
      <Center className="add-mgmt__center">
        <Loader size="md" />
      </Center>
    )

  return (
    <div className="add-mgmt">
      <h2 className="add-mgmt__title">Add User</h2>

      <form className="add-mgmt__form" onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="First Name"
          placeholder="First name"
          {...form.getInputProps('firstName')}
          classNames={{
            root: 'add-mgmt__field',
            input: `add-mgmt__input ${form.errors.firstName ? 'add-mgmt__input--error' : ''}`,
            label: 'add-mgmt__label',
          }}
        />
        <TextInput
          label="Surname"
          placeholder="Surname"
          {...form.getInputProps('surname')}
          classNames={{
            root: 'add-mgmt__field',
            input: `add-mgmt__input ${form.errors.surname ? 'add-mgmt__input--error' : ''}`,
            label: 'add-mgmt__label',
          }}
        />
        <TextInput
          label="Email"
          placeholder="Email"
          {...form.getInputProps('email')}
          classNames={{
            root: 'add-mgmt__field',
            input: `add-mgmt__input ${form.errors.email ? 'add-mgmt__input--error' : ''}`,
            label: 'add-mgmt__label',
          }}
        />
        <Select
          label="Role"
          placeholder="Select role"
          data={roles}
          {...form.getInputProps('role')}
          classNames={{
            root: 'add-mgmt__field',
            input: `add-mgmt__input ${form.errors.role ? 'add-mgmt__input--error' : ''}`,
            label: 'add-mgmt__label',
          }}
        />
        <PasswordInput
          label="Password"
          placeholder="Password"
          {...form.getInputProps('password')}
          classNames={{
            root: 'add-mgmt__field',
            input: `add-mgmt__input ${form.errors.password ? 'add-mgmt__input--error' : ''}`,
            label: 'add-mgmt__label',
          }}
        />
        <div className="buttons-group">
          <button type="submit" className="button-panel" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add User'}
          </button>
          <button className="button-panel" onClick={() => navigate('/management/mgnts')} >Cancel</button>
        </div>
      </form>

      {modalOpened && (
        <div className="add-mgmt__modal">
          <div className="add-mgmt__modal-content">
            <h3>{modalContent.isError ? 'Error' : 'Success'}</h3>
            <p>{modalContent.message}</p>
            <div className="add-mgmt__modal-buttons">
              <Button onClick={handleModalClose}>OK</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
