import { useParams, useNavigate } from 'react-router-dom';
import { Button, Group, Text} from "@mantine/core";
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useFetch } from "../../../hooks/useFetch.js";
import api from '../../../utils/axios.js';
import "../../../styles/single-table-reservation.scss";

const SingleTableReservation = () => {
  const { id } = useParams();

  const { data, loading, error, refetch } = useFetch(`/tables/reservations/${id}`);



  const handleBack = () => {
    window.history.back();
  };

  const openDeleteModal = (id) => {
    modals.openConfirmModal({
      title: 'Please confirm your action',
      size: 'sm',
      radius: 'md',
      withCloseButton: false,
      children: (
        <Text size="sm">
          Do you really want to delete this element?.
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => handleDelete(id),
    });
  }

  const openSuccessNotification = () => {
    notifications.show({
      title: 'Success',
      message: 'Element deleted!',
      color: 'green',
    })
  }

  const openErrorNotification = () => {
    notifications.show({
      title: 'Error',
      message: 'Cannot delete element!',
      color: 'red',
      autoClose: 4000,
      withCloseButton: true,
    })
  }

  const handleDelete = async (id) => {
    console.log(id);
    try {
      const response = await api.delete(`/tables/reservations/${id}`);
      openSuccessNotification()
    } catch (err) {
      console.log(err);
      openErrorNotification()
    } finally {
      handleBack()
    }
  };

  return (
    <div className="single-table-reservation">
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data &&
        <>
          <h2 className="single-table-reservation__title">Reservation Details</h2>

          <div className="single-table-reservation__row">
            <span className="single-table-reservation__label">Table Number:</span>
            <span className="single-table-reservation__value">{data.tableNumber}</span>
          </div>

          <div className="single-table-reservation__row">
            <span className="single-table-reservation__label">Reservation Time:</span>
            <span className="single-table-reservation__value">
              {data.timeSlot.start} - {data.timeSlot.end}
            </span>
          </div>

          <div className="single-table-reservation__row">
            <span className="single-table-reservation__label">Customer Name:</span>
            <span className="single-table-reservation__value">{data.customerDetails.name}</span>
          </div>

          <div className="single-table-reservation__row">
            <span className="single-table-reservation__label">Email:</span>
            <span className="single-table-reservation__value">{data.customerDetails.email}</span>
          </div>

          <div className="single-table-reservation__row">
            <span className="single-table-reservation__label">Phone:</span>
            <span className="single-table-reservation__value">{data.customerDetails.phone}</span>
          </div>

          {data.message && (
            <div className="single-table-reservation__row">
              <span className="single-table-reservation__label">Message:</span>
              <span className="single-table-reservation__value">{data.message}</span>
            </div>
          )}

          <Group justify="center" spacing="md" mt="md">
            <Button variant="default" onClick={handleBack}>
              Back
            </Button>
            <Button color="red" onClick={() => openDeleteModal(id)}>
              Delete
            </Button>
          </Group>
        </>
      }
    </div>
  );
};

export default SingleTableReservation;
