import React from 'react';
import Modal from './Modal.js';
import '../styles/confirmation-modal.scss';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, message }) {
    function handleOnConfirm() {
        onConfirm();
        onClose();
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="confirmation-modal">
                <h5 className='confirmation-modal__header'>{message}</h5>
                <div className="confirmation-modal__buttons">
                    <button onClick={handleOnConfirm}>Tak</button>
                    <button onClick={onClose}>Nie</button>
                </div>
            </div>
        </Modal>
    );
}