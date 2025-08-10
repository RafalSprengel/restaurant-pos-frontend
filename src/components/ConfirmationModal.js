import React from 'react';
import Modal from './Modal.js';
import '../styles/confirmation-modal.scss';

export default function ConfirmationModal({ isOpen, close, onConfirm, message }) {
    function handleOnConfirm() {
        onConfirm();
        close();
    }
    return (
        <Modal isOpen={isOpen} close={close}>
            <div className="confirmation-modal">
                <h5 className='confirmation-modal__header'>{message}</h5>
                <div className="confirmation-modal__buttons">
                    <button onClick={handleOnConfirm}>Tak</button>
                    <button onClick={close}>Nie</button>
                </div>
            </div>
        </Modal>
    );
}