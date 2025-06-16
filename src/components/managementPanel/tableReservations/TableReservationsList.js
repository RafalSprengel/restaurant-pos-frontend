import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  Table,
  Button,
  Text,
  Stack,
  Container,
  Title,
  Pagination,
  TextInput,
  Group,
  Center,
  ScrollArea,
  Skeleton,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import api from '../../../utils/axios';

const TableReservationsList = () => {
  const [reservations, setReservations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchString, setSearchString] = useState('');
  const [sortCriteria, setSortCriteria] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const getReservations = async () => {
    const queryString = location.search;

    try {
      setIsLoading(true);
      setErrorMessage(null);
      const res = await api.get(`/tables/reservations${queryString}`);
      if (res.status === 200) {
        setReservations(res.data.reservations);
        setTotalPages(res.data.totalPages);
        setCurrentPage(res.data.currentPage);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.error || 'Error fetching reservations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (_id) => {
    try {
      setDeletingId(_id);
      await api.delete(`/tables/reservations/${_id}`);
      notifications.show({ title: 'Success', message: 'Element deleted!', color: 'green' });
    } catch (err) {
      console.error(err);
      notifications.show({ title: 'Error', message: 'Cannot delete element!', color: 'red' });
    } finally {
      setDeletingId(null);
      getReservations();
    }
  };

  const openDeleteModal = (e, _id) => {
    e.stopPropagation();
    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: <Text size="sm">Do you really want to delete this reservation?</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => handleDelete(_id),
    });
  };

  const handleSearchChange = (e) => {
    const value = e.currentTarget.value;
    setSearchString(value);
    const params = new URLSearchParams(location.search);
    params.delete('page');
    value ? params.set('search', value) : params.delete('search');
    navigate(`?${params.toString()}`);
  };

  const handleSort = (e) => {
    const name = e.currentTarget.dataset.name;
    const params = new URLSearchParams(location.search);
    const current = params.get('sortOrder');
    const newOrder = current !== 'desc' ? 'desc' : 'asc';
    params.set('sortBy', name);
    params.set('sortOrder', newOrder);
    params.delete('page');
    navigate(`?${params.toString()}`);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(location.search);
    params.set('page', page);
    navigate(`?${params.toString()}`);
  };

  const handleRowClick = (_id) => {
    navigate(`${_id}`);
  };

  const SortArrow = ({ criteria }) => {
    const arrow = () => {
      if (criteria === sortCriteria) return sortOrder === 'desc' ? '▼' : '▲';
      return '•';
    };
    return <>{arrow()}</>;
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchString(params.get('search') || '');
    setSortCriteria(params.get('sortBy') || '');
    setSortOrder(params.get('sortOrder') || '');
  }, [location.search]);

  useEffect(() => {
    getReservations();
  }, [location.search]);

  const rows = reservations.map((r) => (
    <Table.Tr key={r._id} onClick={() => handleRowClick(r._id)} style={{ cursor: 'pointer' }}>
      <Table.Td>{r.tableNumber}</Table.Td>
      <Table.Td>{r.timeSlot.start}</Table.Td>
      <Table.Td>{r.customerDetails.name}</Table.Td>
      <Table.Td>{r.customerDetails.email}</Table.Td>
      <Table.Td>
        <Button onClick={(e) => openDeleteModal(e, r._id)} disabled={deletingId === r._id} size="xs" color="red">
          {deletingId === r._id ? 'Deleting...' : 'Delete'}
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  const skeletonRows = Array(5)
    .fill(0)
    .map((_, index) => (
      <Table.Tr key={index}>
        <Table.Td>
          <Skeleton height={20} radius="sm" />
        </Table.Td>
        <Table.Td>
          <Skeleton height={20} radius="sm" />
        </Table.Td>
        <Table.Td>
          <Skeleton height={20} radius="sm" />
        </Table.Td>
        <Table.Td>
          <Skeleton height={20} radius="sm" />
        </Table.Td>
        <Table.Td>
          <Skeleton height={24} width={60} radius="sm" />
        </Table.Td>
      </Table.Tr>
    ));

  return (
    <Container w={'100%'}>
      <Stack>
        <Title order={2}>Reservations</Title>

        <Group align="center" justify="space-between" mb="md">
          <TextInput
            value={searchString}
            onChange={handleSearchChange}
            placeholder="Search by name, email or table no..."
            style={{ maxWidth: 400 }}
          />
        </Group>

        {errorMessage ? (
          <Text color="red">{errorMessage}</Text>
        ) : (
          <>
            <ScrollArea>
              <Table striped withTableBorder highlightOnHover  style={{ width: '100%' }}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th data-name="tableNumber" onClick={handleSort} style={{ cursor: 'pointer' }}>
                      Table No. <SortArrow criteria="tableNumber" />
                    </Table.Th>
                    <Table.Th data-name="timeSlot.start" onClick={handleSort} style={{ cursor: 'pointer' }}>
                      Date <SortArrow criteria="timeSlot.start" />
                    </Table.Th>
                    <Table.Th data-name="customerDetails.name" onClick={handleSort} style={{ cursor: 'pointer' }}>
                      Name <SortArrow criteria="customerDetails.name" />
                    </Table.Th>
                    <Table.Th data-name="customerDetails.email" onClick={handleSort} style={{ cursor: 'pointer' }}>
                      Email <SortArrow criteria="customerDetails.email" />
                    </Table.Th>
                    <Table.Th>Options</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{isLoading ? skeletonRows : rows}</Table.Tbody>
              </Table>
            </ScrollArea>

            {!isLoading && (
              <Center mt="lg">
                <Pagination
                  total={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  boundaries={1}
                  siblings={1}
                  size="md"
                  withEdges
                />
              </Center>
            )}
          </>
        )}
      </Stack>
    </Container>
  );
};

export default TableReservationsList;
