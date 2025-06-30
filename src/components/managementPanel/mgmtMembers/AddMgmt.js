import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../../hooks/useFetch';
import api from '../../../utils/axios';
import {
  Container,
  Stack,
  Title,
  TextInput,
  PasswordInput,
  Select,
  Button,
  Modal,
  Text,
} from '@mantine/core';

export default function AddUser() {
  const navigate = useNavigate();
  const { data: roles = [] } = useFetch('/staff/roles');

  const [userData, setUserData] = useState({
    name: '',
    surname: '',
    email: '',
    role: '',
    password: '',
  });

  const [modalOpened, setModalOpened] = useState(false);
  const [modalContent, setModalContent] = useState({ message: '', isError: false });

  const handleChange = (field) => (value) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('auth/register/mgmt', userData);
      if (response.status === 201) {
        setModalContent({ message: 'User created successfully!', isError: false });
        setModalOpened(true);
        setUserData({ name: '', surname: '', email: '', role: '', password: '' });
      } else {
        setModalContent({ message: response.data.error || 'Unknown error', isError: true });
        setModalOpened(true);
      }
    } catch (error) {
      setModalContent({
        message: error.response?.data?.error || error.message,
        isError: true,
      });
      setModalOpened(true);
    }
  };

  const handleModalClose = () => {
    setModalOpened(false);
    if (!modalContent.isError) {
      navigate('/management/mgnts');
    }
  };

  return (
    <Container size="sm" my="xl">
      <form onSubmit={handleSubmit}>
        <Stack spacing="md">
          <Title order={2}>Add User</Title>

          <TextInput
            label="Name"
            placeholder="Name"
            required
            value={userData.name}
            onChange={(e) => handleChange('name')(e.currentTarget.value)}
          />

          <TextInput
            label="Surname"
            placeholder="Surname"
            required
            value={userData.surname}
            onChange={(e) => handleChange('surname')(e.currentTarget.value)}
          />

          <TextInput
            label="Email"
            placeholder="Email"
            type="email"
            value={userData.email}
            onChange={(e) => handleChange('email')(e.currentTarget.value)}
          />

          <Select
            label="Role"
            placeholder="Select role"
            data={roles?.map((r) => ({ label: r, value: r }))}
            value={userData.role}
            onChange={handleChange('role')}
            required
          />

          <PasswordInput
            label="Password"
            placeholder="Password"
            required
            value={userData.password}
            onChange={(e) => handleChange('password')(e.currentTarget.value)}
          />

          <Button type="submit">Add User</Button>
        </Stack>
      </form>

      <Modal
        opened={modalOpened}
        onClose={handleModalClose}
        title={modalContent.isError ? 'Error' : 'Success'}
        centered
      >
        <Text color={modalContent.isError ? 'red' : 'green'}>{modalContent.message}</Text>
        <Button mt="md" fullWidth onClick={handleModalClose}>
          OK
        </Button>
      </Modal>
    </Container>
  );
}
