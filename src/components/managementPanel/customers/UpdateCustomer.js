import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import api from '../../../utils/axios';
import {
  TextInput,
  Checkbox,
  Button,
  Container,
  Group,
  Stack,
  Modal,
  Alert,
  Title,
  Loader,
} from '@mantine/core';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';

const UpdateCustomer = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    isRegistered: false,
    address: {
      city: '',
      street: '',
      houseNo: '',
      flatNo: '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth('staff');

  const isEditable = ['admin', 'moderator'].includes(user.role);

  const getCustomer = async () => {
    try {
      const response = await api.get(`/customers/${id}`);
      if (response.status === 200) {
        setFormData({
          ...response.data,
          address: {
            city: response.data.address?.city || '',
            street: response.data.address?.street || '',
            houseNo: response.data.address?.houseNo || '',
            flatNo: response.data.address?.flatNo || '',
          },
        });
      } else {
        throw new Error('Failed to fetch customer');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || error.message);
      setShowErrorAlert(true);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShowErrorAlert(false);
    setErrorMessage('');

    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/management/customers');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.put(`/customers/${id}`, formData);
      if (response.status === 200) {
        setShowSuccessModal(true);
      } else {
        throw new Error(response.data.error || 'Failed to update customer.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || error.message);
      setShowErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCustomer();
  }, []);

  return (
    <Container size="md" mt="xl" w="100%">
      <form onSubmit={handleSubmit}>
        <Stack>
          <Title order={3}>Update Customer (No. {formData.customerNumber})</Title>

          {showErrorAlert && (
            <Alert icon={<IconAlertCircle size={16} />} color="red">
              {errorMessage}
            </Alert>
          )}

          <TextInput
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditable}
            required
          />

          <TextInput
            label="Surname"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            disabled={!isEditable}
            required
          />

          <TextInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditable}
            required
          />

          <TextInput
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditable}
            pattern="^\+?[0-9\s\-\(\)]*$"
            title="Phone number can contain only numbers, spaces, '-', '(', ')' and '+'"
            required
          />

          <Title order={5}>Address</Title>

          <TextInput
            label="City"
            name="address.city"
            value={formData.address.city}
            onChange={handleChange}
            disabled={!isEditable}
          />

          <TextInput
            label="Street"
            name="address.street"
            value={formData.address.street}
            onChange={handleChange}
            disabled={!isEditable}
          />

          <TextInput
            label="House No"
            name="address.houseNo"
            value={formData.address.houseNo}
            onChange={handleChange}
            disabled={!isEditable}
          />

          <TextInput
            label="Flat No"
            name="address.flatNo"
            value={formData.address.flatNo}
            onChange={handleChange}
            disabled={!isEditable}
          />

          {isEditable && (
            <Group justify="flex-end" mt="md">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader size="xs" /> : 'Save Customer'}
              </Button>
            </Group>
          )}
        </Stack>
      </form>

      <Modal
        opened={showSuccessModal}
        onClose={handleCloseSuccessModal}
        title="Success!"
        centered
      >
        <Group direction="column" align="center" spacing="md">
          <IconCheck size={48} color="green" />
          <p>Customer updated successfully!</p>
          <Button onClick={handleCloseSuccessModal}>OK</Button>
        </Group>
      </Modal>
    </Container>
  );
};

export default UpdateCustomer;
