import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useFetch } from "../../../hooks/useFetch.js";
import api from '../../../utils/axios.js';
import "./singleTableReservation.scss";
import ConfirmationModal from '../../ConfirmationModal';

const SingleTableReservation = () => {
  const { id } = useParams();
  const { data, loading, error } = useFetch(`/tables/reservations/${id}`);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const openDeleteModal = () => {
    setShowModal(true);
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tables/reservations/${id}`);
      navigate(-1);
    } catch (err) {
      console.log(err);
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

          <div className="buttons-group">
            <button className="button-panel button-panel--delete" onClick={openDeleteModal}>
              Delete
            </button>
            <button className="button-panel" onClick={handleBack}>
              Back
            </button>
          </div>
        </>
      }
      {showModal && (
        <ConfirmationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={() => handleDelete(id)}
          title="Delete Reservation"
          message="Are you sure you want to delete this reservation?"
        />
      )}
    </div>
  );
};

export default SingleTableReservation;
