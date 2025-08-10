import { useState } from 'react';
import { Text, Button, Stack, Paper, Group, Modal, Loader, ScrollArea, Title } from '@mantine/core';
import api from '../../utils/axios';
import { useFetch } from '../../hooks/useFetch';

const RecentOrderList = () => {
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { data, loading: loadingOrders, error: fetchError, refetch: refetchOrders } = useFetch('/orders/customer');
  const orders = data || [];

  const handleDeleteClick = (id) => setOrderToDelete(id);

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await api.put(`/orders/customer/${orderToDelete}`);
      if (response.status === 200) {
        await refetchOrders();
      } else {
        setErrorMessage('Unable to delete this order.');
      }
    } catch {
      setErrorMessage('Unable to delete this order.');
    } finally {
      setIsLoading(false);
      setOrderToDelete(null);
    }
  };

  if (loadingOrders) {
    return (
      <Group position="center" mt="xl">
        <Loader />
        <Text>Loading orders...</Text>
      </Group>
    );
  }

  if (fetchError) {
    return <Text color="red">Error fetching orders: {fetchError.message}</Text>;
  }
  return (
    <Stack spacing="md" p="md" style={{ width: "80%" }}>
      <Title order={4}>Recent Orders</Title>

      {orders.length > 0 ? (
        <ScrollArea>
          <Stack spacing="sm">
            {orders.map((order) => (
              <Paper key={order._id} shadow="sm" p="md" radius="md" withBorder>
                <Stack spacing={4}>
                  <Text><strong>Order Number:</strong> {order.orderNumber}</Text>
                  <Text><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</Text>
                  <Text><strong>Status:</strong> {order.isPaid ? 'Paid' : 'Unpaid'}</Text>
                  <Text><strong>Order Type:</strong> {order.orderType}</Text>
                  <Text><strong>Items:</strong></Text>
                  <Stack spacing={1} pl="md">
                    {order.products.map((product, index) => (
                      <Text key={index} size="sm">
                        {product.name} - {product.quantity} (${product.price.toFixed(2)})
                      </Text>
                    ))}
                  </Stack>
                  <Text><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</Text>

                  <Group position="right" mt="sm">
                    <Button color="red" size="xs" onClick={() => handleDeleteClick(order._id)}>
                      Delete
                    </Button>
                  </Group>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </ScrollArea>
      ) : (
        <Text>No recent orders found.</Text>
      )}

      <Modal
        opened={orderToDelete !== null}
        onClose={() => setOrderToDelete(null)}
        title="Confirm Delete"
        centered
      >
        <Text mb="md">Are you sure you want to delete this order?</Text>

        {errorMessage && <Text color="red" mb="sm">{errorMessage}</Text>}

        <Group position="right">
          <Button variant="default" onClick={() => setOrderToDelete(null)} disabled={isLoading}>
            Cancel
          </Button>
          <Button color="red" onClick={handleConfirmDelete} loading={isLoading}>
            Delete
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
};

export default RecentOrderList;
