import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Select, Button, Loader, Center } from '@mantine/core';
import api from '../../../utils/axios.js';
import { useAuth } from '../../../context/authContext.js';
import './updateMgmt.scss';

export default function UpdateMgmt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth('staff');
  const isEditable = ['admin', 'moderator'].includes(user.role);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm({
    initialValues: { name: '', surname: '', email: '', role: '', password: '' },
    validate: {
      name: (value) => (value.trim() === '' ? 'Name is required' : null),
      surname: (value) => (value.trim() === '' ? 'Surname is required' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      role: (value) => (value === '' ? 'Role is required' : null),
      password: (value) => (value && value.length < 6 ? 'Password must be at least 6 characters' : null),
    },
    validateInputOnBlur: true,
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get('/staff/roles');
        setRoles(res.data || []);
      } catch (err) {}
    };

    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/staff/${id}`);
        form.setValues({
          name: res.data.name || '',
          surname: res.data.surname || '',
          email: res.data.email || '',
          role: res.data.role || '',
          password: '',
        });
      } catch (err) {
        setShowError(true);
        setErrorMessage(err.response?.data?.error || err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
    fetchUser();
  }, [id]);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    setShowError(false);
    try {
      const res = await api.put(`/staff/${id}`, values);
      if (res.status === 200) navigate('/management/mgnts');
      else throw new Error(res.data?.error || 'Failed to update user');
    } catch (err) {
      setShowError(true);
      setErrorMessage(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Center className="update-mgmt__center">
        <Loader size="md" />
      </Center>
    );
  }

  return (
    <div className="update-mgmt-container">
      <h2 className="update-mgmt-container__title">Update User</h2>

      {showError && <div className="update-mgmt__error">{errorMessage}</div>}

      <form className="update-mgmt-form" onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Name"
          {...form.getInputProps('name')}
          disabled={!isEditable}
          className="update-mgmt-form__input"
        />

        <TextInput
          label="Surname"
          {...form.getInputProps('surname')}
          disabled={!isEditable}
          className="update-mgmt-form__input"
        />

        <TextInput
          label="Email"
          {...form.getInputProps('email')}
          disabled={!isEditable}
          className="update-mgmt-form__input"
        />

        <Select
          label="Role"
          data={roles}
          {...form.getInputProps('role')}
          disabled={!isEditable}
          className="update-mgmt-form__input"
        />

        <PasswordInput
          label="Password"
          {...form.getInputProps('password')}
          disabled={!isEditable}
          className="update-mgmt-form__input"
        />

        {isEditable && (
          <Button type="submit" className="update-mgmt-button" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update User'}
          </Button>
        )}
      </form>
    </div>
  );
}
