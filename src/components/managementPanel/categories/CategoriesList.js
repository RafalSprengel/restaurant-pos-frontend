import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../../hooks/useFetch.js';
import api from '../../../utils/axios.js';
import { useAuth } from '../../../context/authContext.js';
import {
  Table,
  Button,
  Title,
  Image,
  Notification,
  Modal,
  Text,
  Group,
  Stack,
  Loader,
  Center,
} from '@mantine/core';
import { IconTrash, IconPlus } from '@tabler/icons-react';

const CategoriesList = () => {
  const [deletingError, setDeletingError] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth('staff');

  const {
    data: categoryList,
    loading: loadingCategory,
    error: fetchError,
    refetch,
  } = useFetch('/product-categories/');

  const rolePermissions = {
    admin: { addNewButt: true, deleteButt: true },
    moderator: { addNewButt: true, deleteButt: true },
    member: { addNewButt: false, deleteButt: false },
  };

  const isVisible = rolePermissions[user.role] || { addNewButt: false, deleteButt: false };

  const handleRowClick = (id) => {
    navigate(`${id}`);
  };

  const handleDelete = async (id) => {
    setDeletingError(null);
    try {
      const response = await api.delete(`/product-categories/${id}`);
      if (response.status === 200) {
        refetch();
        setConfirmDeleteId(null);
      } else {
        const errorMessage = response.data?.error || 'Unknown error';
        throw new Error(errorMessage);
      }
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.message ||
        'Network error. Please check your connection.';
      setDeletingError(msg);
      setConfirmDeleteId(null);
    }
  };



  const rows = categoryList?.map((el) => {
    const randomUrl = `https://picsum.photos/200/200?random=${Math.random()}`;
    return (
      <tr key={el._id} style={{ cursor: 'pointer' }} onClick={() => handleRowClick(el._id)}>
        <td>{el.name}</td>
        <td>
          <Image
            src={el.image || randomUrl}
            width={60}
            height={60}
            fit="contain"
            alt="Category"
          />
        </td>
        <td>{el.index}</td>
        <td>
          {isVisible.deleteButt && (
            <Button
              color="red"
              size="xs"
              leftSection={<IconTrash size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDeleteId(el._id);
              }}
            >
              Delete
            </Button>
          )}
        </td>
      </tr>
    )
  });

  return (
    <Stack gap="md" w="100%">
      <Group justify="space-between">
        <Title order={3}>Categories</Title>
        {isVisible.addNewButt && (
          <Button
            onClick={() => navigate('/management/add-category')}
            leftSection={<IconPlus size={16} />}
          >
            Add new..
          </Button>
        )}
      </Group>

      {deletingError && (
        <Notification color="red" title="Error" onClose={() => setDeletingError(null)}>
          {deletingError}
        </Notification>
      )}

      {fetchError && (
        <Notification color="red" title="Fetch Error">
          {fetchError.toString()}
        </Notification>
      )}

      {loadingCategory ? (
        <Center style={{ height: '60vh' }}>
          <Loader size="md" />
        </Center>
      ) : categoryList?.length > 0 ? (
        <Table striped highlightOnHover withTableBorder>
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Index</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      ) : (
        <Text>No categories found.</Text>
      )}

      <Modal
        opened={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        title="Confirm Deletion"
        centered
      >
        <Text>Are you sure you want to delete this category?</Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setConfirmDeleteId(null)}>
            Cancel
          </Button>
          <Button color="red" onClick={() => handleDelete(confirmDeleteId)}>
            Delete
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
};

export default CategoriesList;
