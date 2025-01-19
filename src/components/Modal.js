import { useRef } from 'react';
import '../styles/Modal.scss';

export default function Modal({ isOpen, close, children }) {
    const layer = useRef();
    const handleClickOnLayer = (e) => {
        if (e.target === layer.current) close();
    }

    return (
        <>
            {isOpen && (
                <div className='customModal' ref={layer} onClick={handleClickOnLayer}>
                    <div className='customModal__main'>
                        {children}
                    </div>
                </div>
            )}
        </>
    );
}