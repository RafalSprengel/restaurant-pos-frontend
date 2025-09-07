import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Select, Loader } from '@mantine/core';
import api from '../../../utils/axios.js';
import { useAuth } from '../../../context/authContext.js';
import './updateMgmt.scss';

export default function UpdateMgmt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth('staff');
  const isEditable = ['admin', 'moderator'].includes(user?.role);
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
      } catch (err) { }
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
      <div className="update-mgmt__loading">
        <Loader size="sm" variant="dots" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="update-mgmt">
      <h2 className="update-mgmt__title">Update User</h2>

      {showError && <div className="update-mgmt__error">{errorMessage}</div>}

      <form className="update-mgmt__form" onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Name"
          placeholder="Name"
          {...form.getInputProps('name')}
          disabled={!isEditable}
          classNames={{
            root: 'update-mgmt__field',
            input: `update-mgmt__input ${form.errors.name ? 'update-mgmt__input--error' : ''}`,
            label: 'update-mgmt__label',
          }}
        />

        <TextInput
          label="Surname"
          placeholder="Surname"
          {...form.getInputProps('surname')}
          disabled={!isEditable}
          classNames={{
            root: 'update-mgmt__field',
            input: `update-mgmt__input ${form.errors.surname ? 'update-mgmt__input--error' : ''}`,
            label: 'update-mgmt__label',
          }}
        />

        <TextInput
          label="Email"
          placeholder="Email"
          {...form.getInputProps('email')}
          disabled={!isEditable}
          classNames={{
            root: 'update-mgmt__field',
            input: `update-mgmt__input ${form.errors.email ? 'update-mgmt__input--error' : ''}`,
            label: 'update-mgmt__label',
          }}
        />

        <Select
          label="Role"
          data={roles}
          {...form.getInputProps('role')}
          disabled={!isEditable}
          classNames={{
            root: 'update-mgmt__field',
            input: `update-mgmt__input ${form.errors.role ? 'update-mgmt__input--error' : ''}`,
            label: 'update-mgmt__label',
          }}
        />

        <PasswordInput
          label="Password"
          placeholder="Password"
          {...form.getInputProps('password')}
          disabled={!isEditable}
          classNames={{
            root: 'update-mgmt__field',
            input: `update-mgmt__input ${form.errors.password ? 'update-mgmt__input--error' : ''}`,
            label: 'update-mgmt__label',
          }}
        />
        <div className="buttons-group">
          {isEditable && (
            <button type="submit" className="button-panel" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          )}
          <button className="button-panel" onClick={() => navigate('/management/mgnts')} >Cancel</button>
        </div>
      </form>
    </div>
  );
}
