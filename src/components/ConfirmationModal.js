import React from 'react';
import Modal from './Modal.js';
import './ConfirmationModal.scss';

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
                    <button onClick={handleOnConfirm}>Yes</button>
                    <button onClick={onClose}>No</button>
                </div>
            </div>
        </Modal>
    );
}