import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetch } from '../../../hooks/useFetch';
import api from '../../../utils/axios';
import {
  Container,
  Stack,
  Title,
  Notification,
  TextInput,
  Select,
  PasswordInput,
  Button,
} from '@mantine/core';

export default function UpdateMgmt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const { data: roles = [] } = useFetch('http://localhost:3001/api/staff/roles');
  const [userData, setUserData] = useState({
    name: '',
    surname: '',
    email: '',
    role: '',
    password: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`http://localhost:3001/api/staff/${id}`);
        setUserData(response.data);
      } catch (error) {
        setErrorMessage('Error fetching user data: ' + (error.response ? error.response.data.error : error.message));
        setShowErrorNotification(true);
      }
    };

    fetchUserData();
  }, [id]);

  const handleChange = (field) => (value) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setShowErrorNotification(false);

    try {
      const response = await api.put(`http://localhost:3001/api/staff/${id}`, userData);
      if (response.status === 200) {
        navigate('/management/mgnts/');
      } else {
        setErrorMessage(response.data.error || 'Unknown error');
        setShowErrorNotification(true);
      }
    } catch (error) {
      setErrorMessage('Error updating user: ' + (error.response ? error.response.data.error : error.message));
      setShowErrorNotification(true);
    }
  };

  return (
    <Container size="sm" my="xl">
      <form onSubmit={handleSubmit}>
        <Stack spacing="md">
          <Title order={2}>Update User</Title>

          {showErrorNotification && (
            <Notification color="red" onClose={() => setShowErrorNotification(false)}>
              {errorMessage}
            </Notification>
          )}

          <TextInput
            label="Name"
            placeholder="Name"
            required
            value={userData.name}
            onChange={(event) => handleChange('name')(event.currentTarget.value)}
          />

          <TextInput
            label="Surname"
            placeholder="Surname"
            required
            value={userData.surname}
            onChange={(event) => handleChange('surname')(event.currentTarget.value)}
          />

          <TextInput
            label="Email"
            placeholder="Email"
            type="email"
            value={userData.email}
            onChange={(event) => handleChange('email')(event.currentTarget.value)}
          />

          <Select
            label="Role"
            placeholder="Select role"
            data={roles}
            value={userData.role}
            onChange={handleChange('role')}
            searchable
            clearable
            nothingFound="No roles found"
            required
          />

          <PasswordInput
            label="Password"
            placeholder="Password"
            value={userData.password}
            onChange={(event) => handleChange('password')(event.currentTarget.value)}
          />

          <Button type="submit">Update User</Button>
        </Stack>
      </form>
    </Container>
  );
}
