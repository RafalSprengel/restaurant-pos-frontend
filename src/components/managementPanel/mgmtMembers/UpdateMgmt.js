import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetch } from '../../../hooks/useFetch';
import api from '../../../utils/axios';
import {
  Container,
  Stack,
  Title,
  TextInput,
  Select,
  PasswordInput,
  Button,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

export default function UpdateMgmt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: roles = [] } = useFetch('staff/roles');
  const [userData, setUserData] = useState({
    name: '',
    surname: '',
    email: '',
    role: '',
    password: '',
  });

  const handleChange = (field) => (value) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.put(`/staff/${id}`, userData);
      if (response.status === 200) {
        notifications.show({
          title: 'Success',
          message: 'User updated successfully.',
          color: 'green',
        });
        navigate('/management/mgnts/');
      } else {
        notifications.show({
          title: 'Error',
          message: response.data.error || 'Unknown error',
          color: 'red',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error updating user',
        message: error.response ? error.response.data.error : error.message,
        color: 'red',
      });
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/staff/${id}`);
        setUserData(response.data);
      } catch (error) {
        notifications.show({
          title: 'Error fetching user',
          message: error.response ? error.response.data.error : error.message,
          color: 'red',
        });
      }
    };

    fetchUserData();
  }, [id]);

  return (
    <Container size="sm" my="xl">
      <form onSubmit={handleSubmit}>
        <Stack spacing="md">
          <Title order={2}>Update User</Title>

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
