import React from 'react';
import Modal from './Modal.js'
import '../styles/ConfirmationModal.scss'


export default function ConfirmationModal({ isOpen, close, onConfirm, message }) {
    function handleOnConfirm() {
        onConfirm()
        close()
    }
    return (
        <Modal isOpen={isOpen} close={close}>
            <div className='confirmationModal'>
                <h2>{message}</h2>
                <div className='confirmationModal__buttons'>
                    <button onClick={() => handleOnConfirm()}>Yes</button>
                    <button onClick={close}>No</button>
                </div>
            </div>
        </Modal >
    );
}
