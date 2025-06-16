import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import api from '../../../utils/axios';
import {
  Button,
  Group,
  Flex,
  TextInput,
  Table,
  Modal,
  Container,
  Text,
  Loader,
  Stack,
  ScrollArea,
  Pagination,
  Center
} from '@mantine/core';

const ProductsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productsList, setProductsList] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [sortCriteria, setSortCriteria] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth('management');

  const rolePermissions = {
    admin: { addProductButt: true, deleteProductButt: true },
    moderator: { addProductButt: true, deleteProductButt: true },
    member: { addProductButt: false, deleteProductButt: false },
  };

  const isVisible = rolePermissions[user.role] || { addProductButt: false, deleteProductButt: false };

  const getProducts = async () => {
    const queryString = location.search;

    try {
      setErrorMessage(null);
      setIsLoading(true);
      const response = await api.get(`/products/${queryString}`);

      if (response.status === 200) {
        const data = response.data;
        setProductsList(data.products);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      } else {
        setErrorMessage(`Server error: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setErrorMessage(error.response ? error.response.data.error : error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (id) => {
    navigate(`${id}`);
  };

  const handleDeleteClick = (event, id) => {
    event.stopPropagation();
    setProductToDelete(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowModal(false);
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const response = await api.delete(`/products/${productToDelete}`);

      if (response.status === 200) {
        navigate(location.pathname, { replace: true });
      } else {
        const errorData = response.data;
        setErrorMessage(`Unable to delete this product (${errorData.message || 'unknown error'})`);
      }
    } catch (error) {
      if (error.response) {
        const msg = error.response.data?.message || 'Failed to delete the product. Please try again.';
        setErrorMessage(msg);
        console.error('Error deleting product:', msg);
      } else {
        setErrorMessage('Network error. Please check your connection.');
        console.error('Error deleting product:', error);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(location.search);
    params.set('page', page);
    navigate('?' + params.toString());
  };

  const handleSearchChange = (e) => {
    const { value } = e.currentTarget;
    setSearchString(value);
    const params = new URLSearchParams(location.search);
    params.delete('page');
    value === '' ? params.delete('search') : params.set('search', value);
    navigate('?' + params);
  };

  const handleSort = (e) => {
    const { name } = e.currentTarget.dataset;
    const params = new URLSearchParams(location.search);
    const currentOrder = params.get('sortOrder');
    if (currentOrder !== 'desc') {
      params.set('sortOrder', 'desc');
    } else {
      params.set('sortOrder', 'asc');
    }
    params.delete('page');
    params.set('sortBy', name);
    navigate('?' + params);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchString(params.get('search') || '');
    setSortCriteria(params.get('sortBy') || '');
    setSortOrder(params.get('sortOrder') || '');
  }, [location.search]);

  useEffect(() => {
    getProducts();
  }, [isDeleting, searchParams, searchString, sortCriteria, sortOrder]);

  const SortArrow = ({ criteria }) => {
    const arrow = () => {
      if (criteria === sortCriteria) return sortOrder === 'desc' ? '▼' : '▲';
      return '•';
    };
    return <>{arrow()}</>;
  };

  return (
    <Container fluid position="center">
      {!isLoading && !errorMessage && (
        <Stack spacing="md">
          <Text size="xl" fw={600}>Products</Text>
          <Flex wrap="wrap" gap="md" justify="space-between" align="center">
            {isVisible.addProductButt && (
              <Button onClick={() => navigate('/management/add-product')}>Add new..</Button>
            )}
            <Flex align="center" gap="xs">
              <Text size="sm">Find item:</Text>
              <TextInput
                value={searchString}
                onChange={handleSearchChange}
                placeholder="Search..."
              />
            </Flex>
          </Flex>
        </Stack>
      )}

      {isLoading ? (
        <Center style={{ height: '60vh' }}>
          <Loader size="md" />
        </Center>
      ) : errorMessage ? (
        <Text color="red">{errorMessage}</Text>
      ) : productsList?.length > 0 ? (
        <ScrollArea>
          <Table striped highlightOnHover withTableBorder mt="md" verticalSpacing="sm" fontSize="sm">
            <thead>
              <tr>
                <th data-name="productNumber" onClick={handleSort} style={{ cursor: 'pointer' }}>Number <SortArrow criteria="productNumber" /></th>
                <th data-name="name" onClick={handleSort} style={{ cursor: 'pointer' }}>Name <SortArrow criteria="name" /></th>
                <th data-name="category" onClick={handleSort} style={{ cursor: 'pointer' }}>Category <SortArrow criteria="category" /></th>
                <th data-name="price" onClick={handleSort} style={{ cursor: 'pointer' }}>Price <SortArrow criteria="price" /></th>
                <th data-name="isAvailable" onClick={handleSort} style={{ cursor: 'pointer' }}>Is Available <SortArrow criteria="isAvailable" /></th>
                <th data-name="isVegetarian" onClick={handleSort} style={{ cursor: 'pointer' }}>Is Vegetarian <SortArrow criteria="isVegetarian" /></th>
                <th data-name="isGlutenFree" onClick={handleSort} style={{ cursor: 'pointer' }}>Is Gluten Free <SortArrow criteria="isGlutenFree" /></th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {productsList.map((item) => (
                <tr key={item._id} onClick={() => handleRowClick(item._id)} style={{ cursor: 'pointer' }}>
                  <td>{item.productNumber}</td>
                  <td>{item.name}</td>
                  <td>{item.category?.name || 'N/A'}</td>
                  <td>{item.price}</td>
                  <td>{item.isAvailable ? 'Yes' : 'No'}</td>
                  <td>{item.isVegetarian ? 'Yes' : 'No'}</td>
                  <td>{item.isGlutenFree ? 'Yes' : 'No'}</td>
                  <td>
                    {isVisible.deleteProductButt && (
                      <Button color="red" size="xs" onClick={(e) => handleDeleteClick(e, item._id)}>
                        Delete
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ScrollArea>
      ) : (
        <Text>No products found</Text>
      )}

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

      <Modal opened={showModal} onClose={() => setShowModal(false)} title="Confirm Deletion" centered>
        <Text>Are you sure you want to delete this product?</Text>
        <Group mt="md" position="right">
          <Button variant="default" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button color="red" onClick={handleConfirmDelete}>Delete</Button>
        </Group>
      </Modal>
    </Container>
  );
};

export default ProductsList;
