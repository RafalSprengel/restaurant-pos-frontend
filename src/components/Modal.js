import { useState, useRef } from 'react';
import '../styles/Modal.scss';

export default function ({ isOpen, close, children }) {
    const layer = useRef();
    const handleClickOnLayer = (e) => {
        if (e.target == layer.current) close()
    }

    return (
        <>{isOpen &&
            <div className='modal' ref={layer} onClick={handleClickOnLayer}>
                <div className='modal__main'>
                    {children}
                </div>
            </div>
        }
        </>
    )
}